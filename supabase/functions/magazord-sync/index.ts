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

        // DEBUG MODE: Fetching all orders (no date filter) to diagnose
        // which orders the API returns and why the test order isn't showing up.
        console.log('Buscando todos os pedidos (modo debug sem filtro de data)...');

        // Basic Auth combination
        const authHeader = `Basic ${btoa(`${apiUser}:${apiPass}`)}`;

        // Fetch all orders without date filter to see full list
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
        // Log full response for debugging (split into chunks if large)
        const chunkSize = 800;
        for (let i = 0; i < responseText.length; i += chunkSize) {
            console.log(`MagaZord API response [${i}]:`, responseText.substring(i, i + chunkSize));
        }

        if (!response.ok) {
            console.error('Falha ao comunicar com API MagaZord:', response.status, responseText);
            return new Response(JSON.stringify({ error: 'MagaZord API communication failed', details: responseText }), { headers: corsHeaders, status: 500 });
        }

        const responseData = JSON.parse(responseText);
        // MagaZord v2 returns { data: { itens: [...] } } or { data: [...] } or { itens: [...] } or direct array
        const orders = responseData.data?.itens || responseData.data?.registros || (Array.isArray(responseData.data) ? responseData.data : null)
            || responseData.itens || responseData.registros || (Array.isArray(responseData) ? responseData : []);

        if (!Array.isArray(orders) || orders.length === 0) {
            console.log('Nenhum pedido encontrado na resposta. Total:', orders?.length);
            return new Response(JSON.stringify({ success: true, message: 'No orders found.' }), { headers: corsHeaders, status: 200 });
        }

        console.log(`Encontrados ${orders.length} pedidos para processar.`);

        let processedCount = 0;

        for (const order of orders) {
            // MagaZord v2 uses string status codes like "APROVADO", "FATURADO" etc
            const situacaoStr = (order.situacao?.nome || order.situacao?.codigo || order.situacao || '').toString().toUpperCase();
            const situacaoId = order.situacao?.id || 0;
            const isApproved = ['APROVADO', 'FATURADO', 'FATURAMENTO_INICIADO', 'APROVADO_PARCIAL'].includes(situacaoStr)
                || situacaoId === 4 || situacaoId === 5 || situacaoId === 6 || situacaoId === 8;
            // Debug: log each order's key fields
            const couponDebug = order.codigoCupom || order.cupom || (order.cupons?.[0]?.codigo) || 'nenhum';
            console.log(`Pedido ${order.codigo || order.id}: situacao='${situacaoStr}' (id=${situacaoId}), aprovado=${isApproved}, cupom='${couponDebug}'`);

            if (isApproved) {
                const orderId = order.codigo || order.numero || order.id;
                const orderValue = parseFloat(order.valorTotal || order.total || '0');

                let couponCode = order.codigoCupom || order.cupom;
                if (!couponCode && order.cupons && Array.isArray(order.cupons) && order.cupons.length > 0) {
                    couponCode = order.cupons[0].codigo || order.cupons[0].nome || order.cupons[0];
                }

                if (typeof couponCode === 'object' && couponCode !== null) {
                    couponCode = couponCode.codigo || couponCode.nome;
                }

                if (couponCode) {
                    // Find architect
                    const { data: architect, error: archError } = await supabase
                        .from('architects')
                        .select('id, commission_rate')
                        .ilike('coupon_code', couponCode)
                        .single();

                    if (!archError && architect) {
                        const commissionAmount = (orderValue * Number(architect.commission_rate)) / 100;

                        // Check if commission already exists and is pending. If paid, don't overwrite.
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
                            // Skip already paid to prevent override
                            continue;
                        }

                        // Upsert
                        await supabase
                            .from('magazord_commissions')
                            .upsert({
                                architect_id: architect.id,
                                magazord_order_id: String(orderId),
                                magazord_seller_code: couponCode,
                                order_value: orderValue,
                                commission_amount: commissionAmount,
                                status: existingComm ? existingComm.status : 'PENDING' // Keep existing status if it's not paid yet (like cancelled), otherwise new is pending
                            }, { onConflict: 'magazord_order_id' });

                        processedCount++;
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
