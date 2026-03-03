import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
    // Handle CORS preflight requests
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

        // Basic Auth combination
        const authHeader = `Basic ${btoa(`${apiUser}:${apiPass}`)}`;

        // Fetch all orders without date filter (debug) to understand response structure
        const url = `${baseUrl}/v2/site/pedido?limit=100`;
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
        // Log first 1000 chars to see initial structure
        console.log('MagaZord API response (início):', responseText.substring(0, 1000));

        if (!response.ok) {
            console.error('Falha ao comunicar com API MagaZord:', response.status, responseText);
            return new Response(JSON.stringify({ error: 'MagaZord API communication failed', details: responseText }), { headers: corsHeaders, status: 500 });
        }

        const responseData = JSON.parse(responseText);

        // === STRUCTURE DEBUG ===
        console.log('responseData top-level keys:', JSON.stringify(Object.keys(responseData || {})));
        const dataValue = responseData.data;
        console.log('data typeof:', typeof dataValue, '| isArray:', Array.isArray(dataValue));
        if (dataValue && typeof dataValue === 'object' && !Array.isArray(dataValue)) {
            console.log('data object keys:', JSON.stringify(Object.keys(dataValue)));
            const itens = dataValue.itens;
            console.log('data.itens typeof:', typeof itens, '| isArray:', Array.isArray(itens), '| length:', Array.isArray(itens) ? itens.length : 'N/A');
        }

        // MagaZord v2: try multiple response structures
        const orders = responseData.data?.itens
            || responseData.data?.registros
            || (Array.isArray(responseData.data) ? responseData.data : null)
            || responseData.itens
            || responseData.registros
            || (Array.isArray(responseData) ? responseData : []);

        console.log('orders isArray:', Array.isArray(orders), '| length:', orders?.length);

        if (!Array.isArray(orders) || orders.length === 0) {
            console.log('Nenhum pedido encontrado na resposta. Total:', orders?.length);
            return new Response(JSON.stringify({ success: true, message: 'No orders found.' }), { headers: corsHeaders, status: 200 });
        }

        // Log first order structure to understand field names
        if (orders.length > 0) {
            const first = orders[0];
            console.log('Primeiro pedido - chaves:', JSON.stringify(Object.keys(first)));
            console.log('Primeiro pedido - campos situação:', JSON.stringify({
                situacao: first.situacao,
                pedidoSituacaoId: first.pedidoSituacaoId,
                pedidoSituacaoDescricao: first.pedidoSituacaoDescricao,
            }));
            console.log('Primeiro pedido - campos cupom:', JSON.stringify({
                codigoCupom: first.codigoCupom,
                cupom: first.cupom,
                cupons: first.cupons,
                cupomDesconto: first.cupomDesconto,
                codigoCupomDesconto: first.codigoCupomDesconto,
                passouCupom: first.passouCupom,
                cuponsDesconto: first.cuponsDesconto,
            }));
        }

        console.log(`Encontrados ${orders.length} pedidos para processar.`);
        let processedCount = 0;

        for (const order of orders) {
            // Handle BOTH field naming conventions:
            // - Old/generic: order.situacao.nome / order.situacao.id
            // - MagaZord specific: order.pedidoSituacaoId / order.pedidoSituacaoDescricao
            const situacaoStr = (
                order.pedidoSituacaoDescricao ||
                order.situacao?.nome ||
                order.situacao?.codigo ||
                order.situacao ||
                ''
            ).toString().toUpperCase();

            const situacaoId = order.pedidoSituacaoId || order.situacao?.id || 0;

            // Portuguese and English approved status variants + common IDs
            const isApproved = [
                'APROVADO', 'FATURADO', 'FATURAMENTO_INICIADO', 'APROVADO_PARCIAL',
                'APROVADO PAGAMENTO', 'PAGO', 'ENTREGUE', 'TRANSITO', 'EM TRÂNSITO'
            ].includes(situacaoStr)
                || situacaoId === 4 || situacaoId === 5 || situacaoId === 6
                || situacaoId === 7 || situacaoId === 8 || situacaoId === 9;

            // Debug: log each order's key fields
            let couponDebug = order.codigoCupom || order.cupom
                || order.cupomDesconto?.codigo || order.codigoCupomDesconto
                || order.cuponsDesconto?.[0]?.codigo || order.cupons?.[0]?.codigo || 'nenhum';
            console.log(`Pedido ${order.codigo || order.numero || order.id}: situacao='${situacaoStr}' (id=${situacaoId}), aprovado=${isApproved}, cupom='${couponDebug}'`);

            if (isApproved) {
                const orderId = order.codigo || order.numero || order.id;
                const orderValue = parseFloat(order.valorTotal || order.total || '0');

                // Try multiple coupon field names used by MagaZord
                let couponCode = order.codigoCupom || order.cupom
                    || order.cupomDesconto?.codigo || order.codigoCupomDesconto
                    || order.passouCupom;

                if (!couponCode && order.cupons && Array.isArray(order.cupons) && order.cupons.length > 0) {
                    couponCode = order.cupons[0].codigo || order.cupons[0].nome || order.cupons[0];
                }
                if (!couponCode && order.cuponsDesconto && Array.isArray(order.cuponsDesconto) && order.cuponsDesconto.length > 0) {
                    couponCode = order.cuponsDesconto[0].codigo || order.cuponsDesconto[0].nome || order.cuponsDesconto[0];
                }
                if (typeof couponCode === 'object' && couponCode !== null) {
                    couponCode = couponCode.codigo || couponCode.nome;
                }

                console.log(`  → orderId=${orderId}, valor=${orderValue}, cupomFinal='${couponCode}'`);

                if (couponCode) {
                    // Find architect
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
                            console.error(`Error fetching existing commission for order ${orderId}:`, existingCommError);
                            continue;
                        }

                        if (existingComm && existingComm.status === 'PAID') {
                            console.log(`  → Skipping order ${orderId}: already PAID`);
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

                        console.log(`  → Comissão registrada para arquiteto ${architect.id}: R$${commissionAmount}`);
                        processedCount++;
                    } else {
                        console.log(`  → Nenhum arquiteto encontrado com cupom '${couponCode}'`);
                    }
                }
            }
        }

        return new Response(JSON.stringify({ success: true, message: `Processed ${processedCount} orders` }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });

    } catch (error) {
        console.error('Job error:', error);
        return new Response(JSON.stringify({ error: error.message }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 });
    }
});
