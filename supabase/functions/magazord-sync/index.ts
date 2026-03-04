import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

        // ─── STEP 1: Get total order count ──────────────────────────────────
        // MagaZord API ignores all ordering/date filters and always returns oldest first.
        // To get the NEWEST orders, we need to paginate to the last page.
        const countUrl = `${baseUrl}/v2/site/pedido?limit=1&pagina=1`;
        console.log('Buscando total de pedidos:', countUrl);

        const countResp = await fetch(countUrl, {
            method: 'GET',
            headers: { 'Authorization': authHeader, 'Content-Type': 'application/json', 'Accept': 'application/json' }
        });

        if (!countResp.ok) {
            return new Response(JSON.stringify({ error: 'MagaZord API failed on count request' }), { headers: corsHeaders, status: 500 });
        }

        const countData = await countResp.json();
        console.log('Count response (início):', JSON.stringify(countData).substring(0, 300));

        // MagaZord may include total in different fields
        const totalOrders = countData.data?.total
            || countData.data?.totalRegistros
            || countData.data?.count
            || countData.total
            || countData.totalRegistros
            || 0;

        console.log(`Total de pedidos na loja: ${totalOrders}`);

        // ─── STEP 2: Calculate last page to get the newest orders ────────────
        const pageSize = 100;
        let orders: any[] = [];

        if (totalOrders > 0) {
            // Calculate which page holds the newest orders
            const lastPage = Math.ceil(totalOrders / pageSize);
            const pageToFetch = lastPage;
            const url = `${baseUrl}/v2/site/pedido?limit=${pageSize}&pagina=${pageToFetch}`;
            console.log(`Buscando página ${pageToFetch} de ${lastPage} (pedidos mais recentes):`, url);

            const response = await fetch(url, {
                method: 'GET',
                headers: { 'Authorization': authHeader, 'Content-Type': 'application/json', 'Accept': 'application/json' }
            });

            const responseText = await response.text();
            console.log('MagaZord response status:', response.status);
            console.log('MagaZord response (início):', responseText.substring(0, 400));

            if (!response.ok) {
                return new Response(JSON.stringify({ error: 'MagaZord API failed', details: responseText }), { headers: corsHeaders, status: 500 });
            }

            const responseData = JSON.parse(responseText);
            const rawOrders = responseData.data?.items
                || responseData.data?.itens
                || responseData.data?.registros
                || (Array.isArray(responseData.data) ? responseData.data : null)
                || responseData.items
                || responseData.itens
                || (Array.isArray(responseData) ? responseData : []);

            orders = rawOrders;
        } else {
            // Fallback: if total is unknown, just fetch the last page using a high page number
            // and walk backwards until we find orders
            console.log('Total desconhecido - tentando buscar com offset grande...');
            const url = `${baseUrl}/v2/site/pedido?limit=${pageSize}&pagina=999`;
            console.log('Fallback URL:', url);

            const response = await fetch(url, {
                method: 'GET',
                headers: { 'Authorization': authHeader, 'Content-Type': 'application/json', 'Accept': 'application/json' }
            });

            if (response.ok) {
                const responseData = await response.json();
                const rawOrders = responseData.data?.items
                    || responseData.data?.itens
                    || (Array.isArray(responseData.data) ? responseData.data : null)
                    || responseData.items
                    || (Array.isArray(responseData) ? responseData : []);
                orders = rawOrders;
            }
        }

        console.log(`Pedidos retornados: ${Array.isArray(orders) ? orders.length : 'não é array'}`);

        if (!Array.isArray(orders) || orders.length === 0) {
            return new Response(JSON.stringify({ success: true, message: 'No orders found.' }), { headers: corsHeaders, status: 200 });
        }

        // ─── STEP 3: Client-side date filter (30 days) ──────────────────────
        // Extra safety: even if pagination works, reject anything older than 30 days
        const now = new Date();
        const threshold = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        const recentOrders = orders.filter((order: any) => {
            const rawOrder = order?.seq || order;
            if (!rawOrder.dataHora) return true;
            // MagaZord format: "2026-03-03 15:29:13-03"
            const orderDate = new Date(rawOrder.dataHora.replace(' ', 'T'));
            return orderDate >= threshold;
        });

        // Log dates of first and last order for debugging
        if (orders.length > 0) {
            const first = orders[0]?.seq || orders[0];
            const last = orders[orders.length - 1]?.seq || orders[orders.length - 1];
            console.log(`Data do primeiro pedido retornado: ${first.dataHora}`);
            console.log(`Data do último pedido retornado: ${last.dataHora}`);
        }

        console.log(`Pedidos válidos (últimos 30 dias): ${recentOrders.length} de ${orders.length}`);

        if (recentOrders.length === 0) {
            return new Response(JSON.stringify({ success: true, message: 'No recent orders found (all older than 30 days). Pagination may need adjustment.' }), { headers: corsHeaders, status: 200 });
        }

        // ─── STEP 4: Process each order ─────────────────────────────────────
        let processedCount = 0;

        for (const rawOrder of recentOrders) {
            const order = rawOrder?.seq || rawOrder;

            const situacaoId = order.pedidoSituacao || order.situacao?.id || 0;
            const situacaoStr = (
                order.pedidoSituacaoDescricao || order.situacao?.nome || order.situacao?.codigo || ''
            ).toString().toUpperCase().trim();

            const isApproved = (situacaoId >= 4 && situacaoId <= 9)
                || ['APROVADO', 'FATURADO', 'FATURAMENTO INICIADO', 'FATURAMENTO_INICIADO',
                    'SEPARAÇÃO', 'TRANSPORTE', 'ENTREGUE', 'PAGO'].includes(situacaoStr);

            let couponCode = order.cupomCodigo || order.cupomDesconto || order.codigoCupomDesconto
                || order.codigoCupom || order.cupom || order.passouCupom;

            if (!couponCode && Array.isArray(order.cupons) && order.cupons.length > 0) {
                couponCode = order.cupons[0].codigo || order.cupons[0].nome || order.cupons[0];
            }
            if (!couponCode && Array.isArray(order.cuponsDesconto) && order.cuponsDesconto.length > 0) {
                couponCode = order.cuponsDesconto[0].codigo || order.cuponsDesconto[0];
            }
            if (typeof couponCode === 'object' && couponCode !== null) {
                couponCode = couponCode.codigo || couponCode.nome;
            }

            console.log(`Pedido ${order.codigo || order.id} [${order.dataHora}]: situacao=${situacaoId}, aprovado=${isApproved}, cupom='${couponCode || 'nenhum'}'`);

            if (isApproved && couponCode) {
                const orderId = order.codigo || order.numero || order.id;
                const orderValue = parseFloat(order.valorTotal || order.total || '0');

                const { data: architect, error: archError } = await supabase
                    .from('architects')
                    .select('id, commission_rate')
                    .ilike('coupon_code', couponCode)
                    .single();

                if (!archError && architect) {
                    const commissionAmount = (orderValue * Number(architect.commission_rate)) / 100;

                    const { data: existingComm } = await supabase
                        .from('magazord_commissions')
                        .select('status')
                        .eq('magazord_order_id', String(orderId))
                        .maybeSingle();

                    if (existingComm?.status === 'PAID') {
                        console.log(`Skipping order ${orderId}: already PAID`);
                        continue;
                    }

                    await supabase
                        .from('magazord_commissions')
                        .upsert({
                            architect_id: architect.id,
                            magazord_order_id: String(orderId),
                            magazord_seller_code: couponCode,
                            order_value: orderValue,
                            commission_amount: commissionAmount,
                            status: existingComm ? existingComm.status : 'PENDING'
                        }, { onConflict: 'magazord_order_id' });

                    console.log(`✓ Comissão: pedido ${orderId}, R$${commissionAmount}`);
                    processedCount++;
                } else {
                    console.log(`Nenhum arquiteto com cupom '${couponCode}'`);
                }
            }
        }

        return new Response(
            JSON.stringify({ success: true, message: `Processed ${processedCount} orders`, recentCount: recentOrders.length, totalFromApi: orders.length }),
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
