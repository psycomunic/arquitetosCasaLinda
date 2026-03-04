import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// MagaZord API behavior (confirmed by logs):
// - Ignores `ordenacao`, `order`, `sort` params → always returns oldest first
// - Ignores `dataHoraInicio`, `dataHoraFim` date filters
// - Ignores `pagina` page number → always returns first 100 (oldest)
// - The "total" field in the count response is the last ORDER ID (33781), not total order count
//
// STRATEGY: Use the direct single-order endpoint GET /v2/site/pedido/{id}
// to check each order we already know about from webhooks, OR iterate IDs
// sequentially starting from the last known internal ID in our DB.

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
        const supabase = createClient(supabaseUrl, supabaseKey);

        const apiUser = Deno.env.get('MAGAZORD_API_USER');
        const apiPass = Deno.env.get('MAGAZORD_API_PASS');
        const baseUrl = Deno.env.get('MAGAZORD_BASE_URL');

        if (!apiUser || !apiPass || !baseUrl) {
            return new Response(JSON.stringify({ error: 'Missing configurations' }), { headers: corsHeaders, status: 500 });
        }

        const authHeader = `Basic ${btoa(`${apiUser}:${apiPass}`)}`;

        // ─── STRATEGY 1: Re-check all PENDING commissions from DB ────────────
        // For each PENDING commission, fetch the current order status via direct endpoint
        // and update the commission if it's now approved.
        const { data: pendingCommissions, error: pendingError } = await supabase
            .from('magazord_commissions')
            .select('id, magazord_order_id, architect_id, order_value, commission_amount, status')
            .eq('status', 'PENDING')
            .limit(50);

        if (pendingError) {
            console.error('Erro ao buscar comissões pendentes:', pendingError);
        }

        console.log(`Comissões PENDING para re-check: ${pendingCommissions?.length ?? 0}`);

        let updatedCount = 0;

        if (pendingCommissions && pendingCommissions.length > 0) {
            for (const commission of pendingCommissions) {
                const orderId = commission.magazord_order_id;
                console.log(`Verificando pedido PENDING: ${orderId}`);

                // Try to fetch the order directly by codigo (order code)
                // MagaZord v2 single order endpoint: GET /v2/site/pedido?codigo={codigo}
                const singleUrl = `${baseUrl}/v2/site/pedido?codigo=${orderId}`;
                console.log('Consultando:', singleUrl);

                try {
                    const resp = await fetch(singleUrl, {
                        method: 'GET',
                        headers: { 'Authorization': authHeader, 'Content-Type': 'application/json', 'Accept': 'application/json' }
                    });

                    if (!resp.ok) {
                        console.log(`Pedido ${orderId}: HTTP ${resp.status}`);
                        continue;
                    }

                    const data = await resp.json();
                    console.log(`Pedido ${orderId} resposta:`, JSON.stringify(data).substring(0, 300));

                    // Extract order from response
                    const rawOrder = data?.data?.items?.[0] || data?.data?.seq || data?.data || data;
                    const order = rawOrder?.seq || rawOrder;

                    if (!order || (!order.pedidoSituacao && !order.situacao)) {
                        console.log(`Pedido ${orderId}: não encontrado ou estrutura inesperada`);
                        continue;
                    }

                    const situacaoId = order.pedidoSituacao || order.situacao?.id || 0;
                    const situacaoStr = (order.pedidoSituacaoDescricao || order.situacao?.nome || '').toString().toUpperCase();
                    const isApproved = (situacaoId >= 4 && situacaoId <= 9)
                        || ['APROVADO', 'FATURADO', 'FATURAMENTO INICIADO', 'FATURAMENTO_INICIADO',
                            'SEPARAÇÃO', 'TRANSPORTE', 'ENTREGUE', 'PAGO'].includes(situacaoStr.trim());

                    console.log(`Pedido ${orderId}: situacao=${situacaoId} (${situacaoStr}), aprovado=${isApproved}`);

                    if (isApproved && commission.status !== 'PAID') {
                        // Update existing commission to confirm approval
                        await supabase
                            .from('magazord_commissions')
                            .update({ status: 'PENDING' }) // Keep PENDING but we know it's approved (admin must mark PAID)
                            .eq('id', commission.id);

                        console.log(`✓ Comissão ${commission.id} confirmada como aprovada (pedido ${orderId})`);
                        updatedCount++;
                    }
                } catch (orderErr) {
                    console.log(`Erro ao verificar pedido ${orderId}:`, orderErr);
                }
            }
        }

        // ─── STRATEGY 2: Diagnostic - try different list params ──────────────
        // Try filter by codigo > last known order to discover new orders
        const { data: lastKnown } = await supabase
            .from('magazord_commissions')
            .select('magazord_order_id, created_at')
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

        console.log(`Último pedido conhecido no banco: ${lastKnown?.magazord_order_id || 'nenhum'} em ${lastKnown?.created_at || 'N/A'}`);

        // Try fetching recent orders using the ?codigo= filter with a minimum code
        // This may also be ignored, but worth trying
        let diagnosticOrders: any[] = [];
        if (lastKnown?.magazord_order_id) {
            const minCode = lastKnown.magazord_order_id;
            const diagUrl = `${baseUrl}/v2/site/pedido?codigoMaior=${minCode}&limit=100`;
            console.log('Tentando filtro por codigoMaior:', diagUrl);

            const diagResp = await fetch(diagUrl, {
                method: 'GET',
                headers: { 'Authorization': authHeader, 'Content-Type': 'application/json', 'Accept': 'application/json' }
            });

            if (diagResp.ok) {
                const diagData = await diagResp.json();
                const firstItem = diagData?.data?.items?.[0]?.seq || diagData?.data?.items?.[0] || {};
                console.log(`codigoMaior filter - primeiro item data: ${firstItem?.dataHora || 'N/A'}, codigo: ${firstItem?.codigo || 'N/A'}`);
                diagnosticOrders = diagData?.data?.items || [];
            }
        }

        // Also try a direct list with offset parameter
        const offsetUrl = `${baseUrl}/v2/site/pedido?limit=100&offset=33700`;
        console.log('Tentando offset param:', offsetUrl);
        const offsetResp = await fetch(offsetUrl, {
            method: 'GET',
            headers: { 'Authorization': authHeader, 'Content-Type': 'application/json', 'Accept': 'application/json' }
        });

        if (offsetResp.ok) {
            const offsetData = await offsetResp.json();
            const firstItem = offsetData?.data?.items?.[0]?.seq || offsetData?.data?.items?.[0] || {};
            const lastItem = offsetData?.data?.items?.[offsetData?.data?.items?.length - 1]?.seq || {};
            console.log(`offset=33700 - primeiro item data: ${firstItem?.dataHora || 'N/A'}, último: ${lastItem?.dataHora || 'N/A'}`);

            // If offset worked, process these orders
            const rawOrders = offsetData?.data?.items || [];
            const now = new Date();
            const threshold = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

            for (const rawOrder of rawOrders) {
                const order = rawOrder?.seq || rawOrder;
                if (!order.dataHora) continue;
                const orderDate = new Date(order.dataHora.replace(' ', 'T'));
                if (orderDate < threshold) continue; // skip old

                const situacaoId = order.pedidoSituacao || 0;
                const isApproved = situacaoId >= 4 && situacaoId <= 9;
                let couponCode = order.cupomCodigo || order.codigoCupom || order.cupom;
                if (typeof couponCode === 'object' && couponCode !== null) couponCode = couponCode.codigo;

                if (isApproved && couponCode) {
                    const orderId = order.codigo || order.id;
                    const orderValue = parseFloat(order.valorTotal || '0');

                    const { data: architect } = await supabase
                        .from('architects')
                        .select('id, commission_rate')
                        .ilike('coupon_code', couponCode)
                        .single();

                    if (architect) {
                        const commissionAmount = (orderValue * Number(architect.commission_rate)) / 100;
                        const { data: existing } = await supabase
                            .from('magazord_commissions')
                            .select('status')
                            .eq('magazord_order_id', String(orderId))
                            .maybeSingle();

                        if (!existing || existing.status !== 'PAID') {
                            await supabase
                                .from('magazord_commissions')
                                .upsert({
                                    architect_id: architect.id,
                                    magazord_order_id: String(orderId),
                                    magazord_seller_code: couponCode,
                                    order_value: orderValue,
                                    commission_amount: commissionAmount,
                                    status: existing ? existing.status : 'PENDING'
                                }, { onConflict: 'magazord_order_id' });

                            console.log(`✓ Comissão via offset: pedido ${orderId}, R$${commissionAmount}`);
                            updatedCount++;
                        }
                    }
                }
            }
        }

        return new Response(
            JSON.stringify({
                success: true,
                message: `Processed ${updatedCount} orders`,
                pendingRechecked: pendingCommissions?.length ?? 0,
                diagnosticOrdersFound: diagnosticOrders.length
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );

    } catch (error) {
        console.error('Job error:', error);
        return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
    }
});
