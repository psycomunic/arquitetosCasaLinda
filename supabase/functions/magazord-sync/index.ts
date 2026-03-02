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

        // Calculate a timeframe for polling. E.g., fetch orders modified in the last 2 hours to be safe.
        // We do this to not process the entire database on every request.
        const dateThreshold = new Date();
        dateThreshold.setHours(dateThreshold.getHours() - 2);

        const year = dateThreshold.getFullYear();
        const month = String(dateThreshold.getMonth() + 1).padStart(2, '0');
        const day = String(dateThreshold.getDate()).padStart(2, '0');
        const hours = String(dateThreshold.getHours()).padStart(2, '0');
        const minutes = String(dateThreshold.getMinutes()).padStart(2, '0');
        const seconds = String(dateThreshold.getSeconds()).padStart(2, '0');

        const dataModificacao = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;

        console.log(`Buscando pedidos modificados após: ${dataModificacao}...`);

        // Basic Auth combination
        const authHeader = `Basic ${btoa(`${apiUser}:${apiPass}`)}`;

        // Fetch paginated or latest orders from MagaZord (depending on API structure, usually /api/v1/pedidos)
        const response = await fetch(`${baseUrl}/v1/pedidos?dataModificacao=${encodeURIComponent(dataModificacao)}`, {
            method: 'GET',
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error('Falha ao comunicar com API MagaZord:', response.status, errText);
            return new Response(JSON.stringify({ error: 'MagaZord API communication failed' }), { headers: corsHeaders, status: 500 });
        }

        const responseData = await response.json();
        // Assuming the orders are listed in `responseData.registros` or root array based on standard ERP apis.
        const orders = responseData.itens || responseData.registros || responseData;

        if (!Array.isArray(orders)) {
            console.log('Nenhum array de pedidos encontrado na resposta.');
            return new Response(JSON.stringify({ success: true, message: 'No orders found or invalid structure.' }), { headers: corsHeaders, status: 200 });
        }

        let processedCount = 0;

        for (const order of orders) {
            const status = order.situacao?.id || order.situacao;
            // Aprovado ou Faturado etc (geralmente status >= 4 e < 9)
            if (status === 4 || status === 5 || status === 6 || status === 8) {
                const orderId = order.numero || order.id;
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
