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
            console.error('Missing MagaZord API credentials in env variables.');
            return new Response(JSON.stringify({ error: 'Missing configurations' }), { headers: corsHeaders, status: 500 });
        }

        // Build date filter: fetch orders from the last 30 days only.
        // Format required by MagaZord API: YYYY-MM-DD
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const dateFrom = thirtyDaysAgo.toISOString().split('T')[0]; // e.g. "2026-02-01"
        const dateTo = now.toISOString().split('T')[0];             // e.g. "2026-03-03"

        const authHeader = `Basic ${btoa(`${apiUser}:${apiPass}`)}`;

        // Pass date filters directly in the API URL so MagaZord returns only recent orders.
        // dataHoraInicio/dataHoraFim filter by order creation date.
        const url = `${baseUrl}/v2/site/pedido?limit=100&ordenacao=desc&dataHoraInicio=${dateFrom}&dataHoraFim=${dateTo}`;
        console.log('Chamando URL:', url);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        const responseText = await response.text();
        console.log('MagaZord API response status:', response.status);
        console.log('MagaZord API response (início):', responseText.substring(0, 800));

        if (!response.ok) {
            console.error('Falha ao comunicar com API MagaZord:', response.status, responseText);
            return new Response(JSON.stringify({ error: 'MagaZord API communication failed', details: responseText }), { headers: corsHeaders, status: 500 });
        }

        const responseData = JSON.parse(responseText);

        // MagaZord v2 confirmed structure: { status, data: { items: [...] } }
        const orders = responseData.data?.items
            || responseData.data?.itens
            || responseData.data?.registros
            || (Array.isArray(responseData.data) ? responseData.data : null)
            || responseData.items
            || responseData.itens
            || responseData.registros
            || (Array.isArray(responseData) ? responseData : []);

        console.log('Total pedidos retornados pela API:', Array.isArray(orders) ? orders.length : `not array: ${typeof orders}`);

        if (!Array.isArray(orders) || orders.length === 0) {
            return new Response(JSON.stringify({ success: true, message: 'No orders found in date range.' }), { headers: corsHeaders, status: 200 });
        }

        // Secondary client-side date guard: reject anything older than 30 days.
        // This protects against APIs that ignore date params and return old orders anyway.
        const threshold = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const recentOrders = orders.filter((order: any) => {
            if (!order.dataHora) return true; // keep if no date field
            const orderDate = new Date(order.dataHora.replace(' ', 'T'));
            return orderDate >= threshold;
        });

        console.log(`Pedidos nos últimos 30 dias: ${recentOrders.length} de ${orders.length}`);

        if (recentOrders.length === 0) {
            return new Response(JSON.stringify({ success: true, message: 'No recent orders found.' }), { headers: corsHeaders, status: 200 });
        }

        // Log first order structure for reference
        if (recentOrders.length > 0) {
            const first = recentOrders[0]?.seq || recentOrders[0];
            console.log('Campos do primeiro pedido (recente):', JSON.stringify(Object.keys(first)));
            console.log('Data do primeiro pedido:', first.dataHora);
        }

        let processedCount = 0;

        for (const rawOrder of recentOrders) {
            // MagaZord API wraps each order in a 'seq' field: [{seq: {...order}}]
            const order = rawOrder?.seq || rawOrder;

            const situacaoId = order.pedidoSituacao || order.situacao?.id || 0;

            const situacaoStr = (
                order.pedidoSituacaoDescricao ||
                order.situacao?.nome ||
                order.situacao?.codigo ||
                ''
            ).toString().toUpperCase().trim();

            // Approved statuses: 4=Aprovado, 5=Faturamento Iniciado, 6=Faturado, 7=Separação,
            // 8=Transporte, 9=Entregue
            const isApproved = (situacaoId >= 4 && situacaoId <= 9)
                || ['APROVADO', 'FATURADO', 'FATURAMENTO INICIADO', 'FATURAMENTO_INICIADO',
                    'SEPARAÇÃO', 'TRANSPORTE', 'ENTREGUE', 'PAGO'].includes(situacaoStr);

            // Try all possible coupon field names - cupomCodigo confirmed via webhook payload
            let couponCode = order.cupomCodigo
                || order.cupomDesconto
                || order.codigoCupomDesconto
                || order.codigoCupom
                || order.cupom
                || order.passouCupom;

            if (!couponCode && Array.isArray(order.cupons) && order.cupons.length > 0) {
                couponCode = order.cupons[0].codigo || order.cupons[0].nome || order.cupons[0];
            }
            if (!couponCode && Array.isArray(order.cuponsDesconto) && order.cuponsDesconto.length > 0) {
                couponCode = order.cuponsDesconto[0].codigo || order.cuponsDesconto[0];
            }
            if (typeof couponCode === 'object' && couponCode !== null) {
                couponCode = couponCode.codigo || couponCode.nome;
            }

            console.log(`Pedido ${order.codigo || order.id} [${order.dataHora}]: situacao=${situacaoId} (${situacaoStr}), aprovado=${isApproved}, cupom='${couponCode || 'nenhum'}'`);

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

                    const { data: existingComm, error: existingCommError } = await supabase
                        .from('magazord_commissions')
                        .select('status')
                        .eq('magazord_order_id', String(orderId))
                        .maybeSingle();

                    if (existingCommError) {
                        console.error(`Error fetching commission for order ${orderId}:`, existingCommError);
                        continue;
                    }

                    if (existingComm && existingComm.status === 'PAID') {
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

                    console.log(`✓ Comissão registrada: pedido ${orderId}, arquiteto ${architect.id}, valor R$${commissionAmount}`);
                    processedCount++;
                } else {
                    console.log(`Nenhum arquiteto com cupom '${couponCode}'`);
                }
            }
        }

        return new Response(
            JSON.stringify({ success: true, message: `Processed ${processedCount} orders`, dateFrom, dateTo }),
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
