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
        // payload.id       = internal numeric ID (e.g., 33790)
        // payload.codigo   = order code (e.g., "0012603991922")
        // payload.pedidoSituacao = status (1=Aguardando, 4=Aprovado)
        // payload.cupomCodigo   = coupon code (e.g., "angelo20")
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

        console.log(`Pedido ${orderId} (id interno: ${internalId}): situacao=${status}, cupom='${couponCode || 'nenhum'}', valor=${orderValue}`);

        // If no coupon, ignore immediately
        if (!couponCode) {
            console.log('Sem cupom — ignorando.');
            return new Response(JSON.stringify({ success: true, message: 'No coupon code — ignored' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200
            });
        }

        // ─── Re-check current status via MagaZord API (always, not just when pending) ───
        // MagaZord fires webhook on creation (status=1). When admin approves later,
        // no second webhook fires. So we always re-check the LIVE order status.
        // CRITICAL FIX: Use the direct order endpoint by internal ID, NOT the list endpoint.
        // The list endpoint returns the oldest orders first (2023), ignoring all sort/date params.
        if (internalId && apiUser && apiPass && baseUrl) {
            try {
                const authHeader = `Basic ${btoa(`${apiUser}:${apiPass}`)}`;

                // PRIMARY: Direct order lookup by internal numeric ID
                const directUrl = `${baseUrl}/v2/site/pedido/${internalId}`;
                console.log('Re-check direto:', directUrl);

                const directResp = await fetch(directUrl, {
                    method: 'GET',
                    headers: { 'Authorization': authHeader, 'Content-Type': 'application/json', 'Accept': 'application/json' }
                });

                console.log('Re-check status HTTP:', directResp.status);

                if (directResp.ok) {
                    const directText = await directResp.text();
                    console.log('Re-check resposta:', directText.substring(0, 400));
                    const directData = JSON.parse(directText);

                    // Single order endpoint may wrap in data: { ... } or data.items[0]
                    const freshOrder = directData?.data?.seq
                        || directData?.data?.items?.[0]?.seq
                        || directData?.data?.items?.[0]
                        || directData?.data
                        || directData?.seq
                        || directData;

                    if (freshOrder && (freshOrder.codigo || freshOrder.id)) {
                        const freshStatus = freshOrder.pedidoSituacao ?? freshOrder.situacao ?? status;
                        const freshCoupon = freshOrder.cupomCodigo || freshOrder.codigoCupom || freshOrder.cupom || couponCode;
                        const freshValue = parseFloat(freshOrder.valorTotal || freshOrder.valorTotalFinal || String(orderValue));
                        console.log(`Re-check direto OK: situacao=${freshStatus}, cupom='${freshCoupon}', valor=${freshValue}`);
                        status = freshStatus;
                        if (freshCoupon) couponCode = freshCoupon;
                    } else {
                        console.log('Re-check direto: resposta sem dados de pedido:', JSON.stringify(directData).substring(0, 200));
                        // FALLBACK: search by codigo in the list, but paginate to recent orders
                        await recheckViaList(baseUrl, authHeader, orderId, internalId, (freshStatus: number, freshCoupon: string) => {
                            status = freshStatus;
                            if (freshCoupon) couponCode = freshCoupon;
                        });
                    }
                } else {
                    console.log(`Re-check direto falhou (${directResp.status}) — tentando via lista...`);
                    // FALLBACK: paginate via list to find the order
                    const authHeaderFallback = authHeader;
                    await recheckViaList(baseUrl, authHeaderFallback, orderId, internalId, (freshStatus: number, freshCoupon: string) => {
                        status = freshStatus;
                        if (freshCoupon) couponCode = freshCoupon;
                    });
                }
            } catch (apiErr) {
                console.log('Erro no re-check:', apiErr, '— usando status do webhook.');
            }
        }

        // ─── Process orders ───────────────────────
        const isApproved = status >= 4 && status <= 9;
        const mappedStatus = isApproved ? 'PENDING' : 'AWAITING';

        const cleanCoupon = String(couponCode).trim();
        const { data: architect, error: archError } = await supabase
            .from('architects')
            .select('id, commission_rate, name')
            .ilike('coupon_code', cleanCoupon)
            .single();

        if (archError || !architect) {
            console.log(`Arquiteto não encontrado para cupom '${cleanCoupon}'.`);
            return new Response(JSON.stringify({ success: false, message: `Architect not found for coupon: ${cleanCoupon}` }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200
            });
        }

        const commissionAmount = (orderValue * Number(architect.commission_rate)) / 100;
        console.log(`Comissão: ${commissionAmount} para ${(architect as any).name} (${architect.commission_rate}% de ${orderValue}) - Status: ${mappedStatus}`);

        const { error: insertError } = await supabase
            .from('magazord_commissions')
            .upsert({
                architect_id: architect.id,
                magazord_order_id: String(orderId),
                magazord_seller_code: cleanCoupon,
                order_value: orderValue,
                commission_amount: commissionAmount,
                status: mappedStatus
            }, { onConflict: 'magazord_order_id' });

        if (insertError) {
            console.error('Erro ao salvar comissão:', insertError);
            throw insertError;
        }

        console.log(`✅ Comissão salva (${mappedStatus}): pedido ${orderId}, arquiteto ${(architect as any).name}, valor R$${commissionAmount}`);
        return new Response(JSON.stringify({ success: true, message: `Commission saved (${mappedStatus})` }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200
        });

    } catch (error: any) {
        console.error('Webhook error:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400
        });
    }
});

// Fallback: find order in list using paginated approach to get NEWEST orders
async function recheckViaList(
    baseUrl: string,
    authHeader: string,
    orderId: string,
    internalId: number,
    onFound: (status: number, coupon: string) => void
) {
    try {
        // First get the total count
        const countResp = await fetch(`${baseUrl}/v2/site/pedido?limit=1&pagina=1`, {
            method: 'GET',
            headers: { 'Authorization': authHeader, 'Content-Type': 'application/json', 'Accept': 'application/json' }
        });

        let lastPage = 1;
        if (countResp.ok) {
            const countData = await countResp.json();
            const total = countData.data?.total || countData.data?.totalRegistros || countData.total || 0;
            console.log(`Fallback lista: total de pedidos = ${total}`);
            if (total > 0) {
                lastPage = Math.ceil(total / 100);
            }
        }

        // Fetch the last page (newest orders)
        const listUrl = `${baseUrl}/v2/site/pedido?limit=100&pagina=${lastPage}`;
        console.log('Fallback lista URL:', listUrl);

        const listResp = await fetch(listUrl, {
            method: 'GET',
            headers: { 'Authorization': authHeader, 'Content-Type': 'application/json', 'Accept': 'application/json' }
        });

        if (!listResp.ok) {
            console.log(`Fallback lista falhou: ${listResp.status}`);
            return;
        }

        const listData = await listResp.json();
        const rawOrders: any[] = listData?.data?.items
            || listData?.data?.itens
            || (Array.isArray(listData?.data) ? listData.data : null)
            || listData?.items
            || (Array.isArray(listData) ? listData : []);

        const allOrders = rawOrders.map((o: any) => o?.seq || o);
        console.log(`Fallback lista: ${allOrders.length} pedidos na página ${lastPage}`);

        const freshOrder = allOrders.find((o: any) =>
            String(o?.codigo) === String(orderId)
            || (internalId && String(o?.id) === String(internalId))
        );

        if (freshOrder) {
            const freshStatus = freshOrder.pedidoSituacao ?? freshOrder.situacao ?? 1;
            const freshCoupon = freshOrder.cupomCodigo || freshOrder.codigoCupom || freshOrder.cupom || '';
            console.log(`Fallback lista encontrou pedido: situacao=${freshStatus}, cupom='${freshCoupon}'`);
            onFound(freshStatus, freshCoupon);
        } else {
            console.log(`Pedido ${orderId} não encontrado na página ${lastPage}.`);
        }
    } catch (err) {
        console.log('Erro no fallback lista:', err);
    }
}
