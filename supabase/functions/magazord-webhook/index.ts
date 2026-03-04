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

        const reqText = await req.text();
        console.log('Recebido payload bruto (raw):', reqText);

        if (!reqText || reqText.trim() === '') {
            return new Response(JSON.stringify({ success: true, message: 'Empty payload' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200
            });
        }

        let payload: any;
        try {
            payload = JSON.parse(reqText);
        } catch (e) {
            console.error('Falha ao fazer parse do JSON:', e);
            return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400
            });
        }

        // Field names confirmed from real webhook payloads:
        // payload.codigo = order code ("0012603904143")
        // payload.id = internal MagaZord ID (33790)
        // payload.pedidoSituacao = status (1=Aguardando, 4=Aprovado)
        // payload.cupomCodigo = coupon code ("angelo20")
        // payload.dataHora = order date ("2026-03-03 15:29:13-03")
        const internalId = payload.id;
        const orderId = payload.codigo || String(payload.id);
        let status = payload.pedidoSituacao ?? payload.situacao ?? 0;
        const orderValue = parseFloat(payload.valorTotal || payload.valorTotalFinal || payload.total || '0');

        let couponCode = payload.cupomCodigo || payload.codigoCupom || payload.cupom;
        if (!couponCode && Array.isArray(payload.cupons) && payload.cupons.length > 0) {
            couponCode = payload.cupons[0].codigo || payload.cupons[0].nome || payload.cupons[0];
        }
        if (typeof couponCode === 'object' && couponCode !== null) {
            couponCode = couponCode.codigo || couponCode.nome;
        }

        console.log(`Pedido ${orderId}: situacao=${status}, cupom='${couponCode || 'nenhum'}', valor=${orderValue}`);

        // If no coupon, ignore immediately
        if (!couponCode) {
            console.log('Sem cupom — ignorando.');
            return new Response(JSON.stringify({ success: true, message: 'No coupon code — ignored' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200
            });
        }

        // ─── If status is pending (1-3), re-check current status via MagaZord API ───
        // MagaZord fires webhook on creation (status=1). When admin approves later,
        // no second webhook fires. So we always re-check the LIVE order status.
        if (status < 4 && apiUser && apiPass && baseUrl) {
            console.log(`Status=${status} — Re-consultando pedido ${orderId} na API MagaZord...`);
            try {
                const authHeader = `Basic ${btoa(`${apiUser}:${apiPass}`)}`;

                // Only search orders from the last 30 days so we don't get 2023 orders.
                const now = new Date();
                const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                const dateFrom = thirtyDaysAgo.toISOString().split('T')[0];
                const dateTo = now.toISOString().split('T')[0];

                const listUrl = `${baseUrl}/v2/site/pedido?limit=100&ordenacao=desc&dataHoraInicio=${dateFrom}&dataHoraFim=${dateTo}`;
                console.log('Re-check URL:', listUrl);

                const apiResp = await fetch(listUrl, {
                    method: 'GET',
                    headers: { 'Authorization': authHeader, 'Content-Type': 'application/json', 'Accept': 'application/json' }
                });

                if (apiResp.ok) {
                    const apiText = await apiResp.text();
                    console.log('API re-check resposta (início):', apiText.substring(0, 200));
                    const apiData = JSON.parse(apiText);

                    const rawOrders: any[] = apiData?.data?.items
                        || apiData?.data?.itens
                        || (Array.isArray(apiData?.data) ? apiData.data : null)
                        || apiData?.items
                        || (Array.isArray(apiData) ? apiData : []);

                    // Unpack 'seq' wrapper if present: [{seq: {...order}}] → [{...order}]
                    const allOrders = rawOrders.map((o: any) => o?.seq || o);

                    console.log(`Re-check: ${allOrders.length} pedidos encontrados no período de ${dateFrom} a ${dateTo}`);

                    // Find the specific order by codigo or internal id
                    const freshOrder = allOrders.find((o: any) =>
                        String(o?.codigo) === String(orderId)
                        || (internalId && String(o?.id) === String(internalId))
                    );

                    if (freshOrder) {
                        const freshStatus = freshOrder.pedidoSituacao ?? freshOrder.situacao ?? status;
                        const freshCoupon = freshOrder.cupomCodigo || freshOrder.codigoCupom || freshOrder.cupom || couponCode;
                        const freshValue = parseFloat(freshOrder.valorTotal || freshOrder.valorTotalFinal || String(orderValue));
                        console.log(`API re-check: situacao=${freshStatus}, cupom='${freshCoupon}', valor=${freshValue}, data=${freshOrder.dataHora}`);
                        status = freshStatus;
                        if (freshCoupon) couponCode = freshCoupon;
                    } else {
                        console.log(`Pedido ${orderId} não encontrado nos pedidos recentes (${dateFrom} a ${dateTo}). Total consultados: ${allOrders.length}. Status do webhook: ${status}.`);
                    }
                } else {
                    console.log(`API re-check falhou (${apiResp.status}) — usando status do webhook (${status}).`);
                }
            } catch (apiErr) {
                console.log('Erro no re-check da API:', apiErr, '— usando status do webhook.');
            }
        }

        // ─── Process only approved orders (status 4–9) ───────────────────────
        if (status >= 4 && status <= 9) {
            const cleanCoupon = String(couponCode).trim();
            const { data: architect, error: archError } = await supabase
                .from('architects')
                .select('id, commission_rate, name')
                .ilike('coupon_code', cleanCoupon)
                .single();

            if (archError || !architect) {
                console.log(`Arquiteto não encontrado para cupom '${cleanCoupon}'. Verificar campo coupon_code.`);
                return new Response(JSON.stringify({ success: false, message: `Architect not found for coupon: ${cleanCoupon}` }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200
                });
            }

            const commissionAmount = (orderValue * Number(architect.commission_rate)) / 100;
            console.log(`Comissão: ${commissionAmount} para ${(architect as any).name} (${architect.commission_rate}% de ${orderValue})`);

            const { error: insertError } = await supabase
                .from('magazord_commissions')
                .upsert({
                    architect_id: architect.id,
                    magazord_order_id: String(orderId),
                    magazord_seller_code: cleanCoupon,
                    order_value: orderValue,
                    commission_amount: commissionAmount,
                    status: 'PENDING'
                }, { onConflict: 'magazord_order_id' });

            if (insertError) {
                console.error('Erro ao salvar comissão:', insertError);
                throw insertError;
            }

            console.log(`✅ Comissão salva: pedido ${orderId}, arquiteto ${(architect as any).name}, valor ${commissionAmount}`);
            return new Response(JSON.stringify({ success: true, message: 'Commission saved' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200
            });
        } else {
            console.log(`Pedido ${orderId} ainda não aprovado (status=${status}) — aguardando aprovação.`);
            return new Response(JSON.stringify({ success: true, message: `Order status=${status}, not yet approved` }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200
            });
        }

    } catch (error: any) {
        console.error('Webhook error:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400
        });
    }
});
