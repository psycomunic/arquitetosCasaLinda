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

        const reqText = await req.text();
        console.log('Recebido payload bruto (raw):', reqText);

        if (!reqText || reqText.trim() === '') {
            console.log('Recebido payload vazio, ignorando.');
            return new Response(JSON.stringify({ success: true, message: 'Empty payload' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });
        }

        let payload;
        try {
            payload = JSON.parse(reqText);
        } catch (e) {
            console.error('Falha ao fazer parse do JSON:', e);
            return new Response(JSON.stringify({ error: 'Invalid JSON or format', raw: reqText }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 });
        }

        // Extracting order details from MagaZord payload.
        const orderId = payload.id || payload.numero;
        const status = payload.situacao; // 4 - Approved, 5 - Approved and Integrated, etc.
        const orderValue = parseFloat(payload.valorTotal || payload.total || '0');

        // Check for coupon in various common MagaZord payload formats
        let couponCode = payload.codigoCupom || payload.cupom;
        if (!couponCode && payload.cupons && Array.isArray(payload.cupons) && payload.cupons.length > 0) {
            couponCode = payload.cupons[0].codigo || payload.cupons[0].nome || payload.cupons[0];
        }

        if (typeof couponCode === 'object' && couponCode !== null) {
            couponCode = couponCode.codigo || couponCode.nome;
        }

        // Check if couponCode exists and status is approved/invoiced
        if (couponCode && (status === 4 || status === 5 || status === 6 || status === 8)) {
            // Find architect
            const { data: architect, error: archError } = await supabase
                .from('architects')
                .select('id, commission_rate')
                .ilike('coupon_code', couponCode)
                .single();

            if (archError || !architect) {
                console.log(`Buscando arquiteto com o cupom ${couponCode} falhou ou ele não existe no portal.`);
                return new Response(JSON.stringify({ success: false, message: 'Architect not found for this coupon code' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });
            }

            // Calculate commission
            const commissionAmount = (orderValue * Number(architect.commission_rate)) / 100;

            // Insert into our commissions table (reusing magazord_seller_code for the utilized coupon code here)
            const { error: insertError } = await supabase
                .from('magazord_commissions')
                .upsert({
                    architect_id: architect.id,
                    magazord_order_id: String(orderId),
                    magazord_seller_code: couponCode,
                    order_value: orderValue,
                    commission_amount: commissionAmount,
                    status: 'PENDING'
                }, { onConflict: 'magazord_order_id' });

            if (insertError) {
                console.error('Erro ao salvar comissão:', insertError);
                throw insertError;
            }

            return new Response(JSON.stringify({ success: true, message: 'Commission computed successfully' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });
        } else {
            return new Response(JSON.stringify({ success: true, message: 'Ignored webhook - Not an approved order with seller code' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });
        }

    } catch (error) {
        console.error('Webhook error:', error);
        return new Response(JSON.stringify({ error: error.message }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 });
    }
});
