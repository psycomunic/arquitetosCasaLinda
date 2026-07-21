import React, { useEffect, useState, useRef } from 'react';
import { Copy, MapPin, Building, Activity, Wallet, Calendar, PlusCircle, Check, Play, BookOpen, Clock, Heart, Award, ArrowRight, MessageCircle, FileDown, ShieldCheck, Globe, CheckCircle2, DollarSign, Inbox, Share2, UploadCloud, Crown, MessageSquare, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { applyMonthlyCommission, currentMonthRate } from '../lib/commission';
import { ArchitectProfile } from '../types';
import { Architect, Sale, MagazordCommission } from '../types/database';
import { Ranking } from '../components/Ranking';
import { AssistanceModal } from '../components/AssistanceModal';
import { CustomProjectModal } from '../components/CustomProjectModal';
import { ArchitectHandbook } from '../components/ArchitectHandbook';
import { InternalFAQ } from '../components/InternalFAQ';
import { PartnerGuide } from '../components/PartnerGuide';
import { SalesMechanics } from '../components/SalesMechanics';
import { ArchitectSalesManual } from '../components/ArchitectSalesManual';

export const DashboardOverview: React.FC = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<ArchitectProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [assistanceModalOpen, setAssistanceModalOpen] = useState(false);
    const [customProjectModalOpen, setCustomProjectModalOpen] = useState(false);
    const [copiedLink, setCopiedLink] = useState(false);
    const [copiedCoupon, setCopiedCoupon] = useState(false);
    const [storeDiscount, setStoreDiscount] = useState(0);
    const [recentSales, setRecentSales] = useState<any[]>([]);

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase
                    .from('architects')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                const architect = data as unknown as Architect;

                let dynamicTotalEarnings = 0;
                let allSales: any[] = [];

                // Fetch recent sales and magazord commissions dynamically
                const { data: salesData } = await supabase
                    .from('sales')
                    .select('*')
                    .eq('architect_id', user.id);

                const { data: magazordData } = await supabase
                    .from('magazord_commissions')
                    .select('*')
                    .eq('architect_id', user.id);

                if (salesData) {
                    allSales = [...allSales, ...salesData.map((s: Sale) => ({
                        id: s.id,
                        architectId: user.id,
                        date: s.created_at,
                        reference: s.proposal_id ? s.proposal_id.slice(0, 8) : 'MANUAL',
                        clientName: (s as any).client_name || 'Venda Assistida',
                        type: 'PROPOSAL',
                        saleValue: Number(s.sale_value),
                        commissionValue: Number(s.commission_value),
                        status: s.status,
                    }))];
                }

                if (magazordData) {
                    allSales = [...allSales, ...magazordData.map((m: MagazordCommission) => ({
                        id: m.id,
                        architectId: user.id,
                        date: m.created_at,
                        reference: `ORD-${m.magazord_order_id}`,
                        clientName: 'E-commerce (MagaZord)',
                        type: 'MAGAZORD',
                        saleValue: Number(m.order_value),
                        commissionValue: Number(m.commission_amount),
                        status: m.status === 'PAID' ? 'paid' : m.status === 'CANCELED' ? 'cancelled' : m.status === 'AWAITING' ? 'awaiting' : 'pending',
                    }))];
                }

                // Recalcula os repasses pela faixa do mês (progressão mensal).
                allSales = applyMonthlyCommission(allSales);

                dynamicTotalEarnings = allSales.reduce((acc, curr) => acc + (curr.status === 'paid' ? curr.commissionValue : 0), 0);

                // Faixa atual = faixa do mês corrente pelo faturamento do arquiteto.
                const nowRef = new Date();
                const liveRate = currentMonthRate(allSales, user.id, nowRef.getFullYear(), nowRef.getMonth());

                allSales.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                setRecentSales(allSales.slice(0, 5));

                if (architect) {
                    setProfile({
                        name: architect.name,
                        officeName: architect.office_name,
                        commissionRate: liveRate,
                        totalEarnings: dynamicTotalEarnings > 0 ? dynamicTotalEarnings : Number(architect.total_earnings), // Fallback to DB value if historical
                        logoUrl: architect.logo_url,
                        couponCode: architect.coupon_code,
                        isAdmin: architect.is_admin
                    });
                }

                // Fetch store discount setting
                const { data: settings } = await supabase
                    .from('app_settings')
                    .select('value')
                    .eq('key', 'store_discount_percentage')
                    .single();

                if (settings) {
                    setStoreDiscount(Number((settings as any).value));
                }
            }
            setLoading(false);
        };
        fetchProfile();
    }, []);

    if (loading) {
        return <div className="text-white">Carregando...</div>;
    }

    const firstName = profile?.name?.split(' ')[0]?.toLowerCase() || 'parceiro';
    const calculatedCoupon = profile?.couponCode || `${firstName}${storeDiscount}`;

    // Affiliate Link with Coupon Parameter
    const computedLink = `https://www.casalindadecoracoes.com.br/?cupom=${calculatedCoupon}`;

    const copyLink = () => {
        navigator.clipboard.writeText(computedLink);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
    };

    const copyCoupon = () => {
        if (calculatedCoupon) {
            navigator.clipboard.writeText(calculatedCoupon);
            setCopiedCoupon(true);
            setTimeout(() => setCopiedCoupon(false), 2000);
        }
    };

    return (
        <div className="space-y-10 animate-fade-in no-print pb-20">
            <header className="mb-12">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-2 h-2 rounded-full bg-gold shadow-[0_0_15px_rgba(197,160,89,0.8)]" />
                    <p className="text-gold text-[10px] font-bold uppercase tracking-[0.5em]">Sistema Private Ativo</p>
                </div>
                <h2 className="text-4xl md:text-7xl font-serif text-white">Bem-vindo(a), {firstName}</h2>
            </header>

            {/* MECHANICS SELECTION - NEW SECTION */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* MECÂNICA 1: ESCALA */}
                <div className="bg-zinc-900/30 border border-white/10 p-5 md:p-8 group hover:border-gold/50 transition-all duration-500 relative overflow-hidden rounded-xl">
                    <div className="absolute top-0 right-0 p-3 md:p-4 bg-zinc-900 rounded-bl-2xl text-[8px] md:text-[9px] font-bold uppercase tracking-widest text-zinc-500 group-hover:text-gold transition-colors">
                        Mecânica 01
                    </div>
                    <div className="mb-6 w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center text-zinc-500 group-hover:text-gold group-hover:scale-110 transition-all">
                        <Share2 size={20} />
                    </div>
                    <h3 className="text-xl md:text-2xl font-serif text-white mb-2">Indicação Direta</h3>
                    <p className="text-[10px] md:text-xs text-zinc-500 uppercase tracking-widest mb-6 font-bold">Ganhe na Escala</p>
                    <p className="text-zinc-400 text-sm mb-8 min-h-[auto] md:min-h-[60px]">
                        Ideal para projetos simples e alto volume. O cliente compra sozinho pelo seu cupom de desconto.
                    </p>

                    <div className="space-y-3">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 bg-black/50 border border-white/10 rounded-lg px-4 py-3 flex items-center justify-between group relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-gold/0 via-gold/5 to-gold/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                <span className="text-white font-mono text-sm relative z-10 flex items-center gap-2">
                                    <Globe size={14} className="text-zinc-500" />
                                    {computedLink}
                                </span>
                                <button
                                    onClick={copyLink}
                                    className="text-zinc-400 hover:text-gold transition-colors relative z-10 p-2 hover:bg-white/5 rounded-full"
                                    title="Copiar Link"
                                >
                                    {copiedLink ? <CheckCircle2 size={16} className="text-green-500" /> : <Copy size={16} />}
                                </button>
                            </div>
                        </div>
                        <div className="p-3 md:p-4 bg-black/50 rounded-xl border border-white/5 flex items-center justify-between group-hover:border-gold/30 transition-colors">
                            <div className="flex flex-col overflow-hidden mr-2">
                                <span className="text-[8px] uppercase tracking-widest text-zinc-600 font-bold mb-1 flex items-center gap-2">
                                    Seu Cupom ({storeDiscount}% OFF)
                                    {profile?.couponCode && <span className="bg-green-500/20 text-green-500 px-1 py-0.5 rounded text-[8px]">ATIVO</span>}
                                </span>
                                <span className="text-[9px] md:text-[10px] text-zinc-400 font-mono truncate">{calculatedCoupon}</span>
                            </div>
                            <button onClick={copyCoupon} className="text-gold hover:text-white transition-colors shrink-0">
                                {copiedCoupon ? <Check size={16} /> : <Copy size={16} />}
                            </button>
                        </div>

                        <a
                            href={`https://wa.me/5547997060582?text=Olá! Sou o arquiteto ${profile?.name} e gostaria de ativar meu cupom de desconto: ${calculatedCoupon}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-3 bg-zinc-900 border border-white/5 text-zinc-400 hover:text-gold text-[9px] uppercase tracking-[0.2em] font-bold hover:bg-white/5 transition-all flex items-center justify-center gap-2 rounded-lg"
                        >
                            <MessageSquare size={14} />
                            Solicitar Ativação do Cupom
                        </a>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                        <div className="h-1 flex-1 bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full w-full bg-zinc-700"></div>
                        </div>
                        <span className="text-[9px] uppercase tracking-widest text-zinc-500">Comissão Padrão</span>
                    </div>
                </div>

                {/* MECÂNICA 2: VALOR */}
                <div className="bg-zinc-900/30 border border-white/10 p-5 md:p-8 group hover:border-gold/50 transition-all duration-500 relative overflow-hidden rounded-xl">
                    <div className="absolute top-0 right-0 p-3 md:p-4 bg-zinc-900 rounded-bl-2xl text-[8px] md:text-[9px] font-bold uppercase tracking-widest text-zinc-500 group-hover:text-gold transition-colors">
                        Mecânica 02
                    </div>
                    <div className="mb-6 w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center text-zinc-500 group-hover:text-gold group-hover:scale-110 transition-all">
                        <MessageSquare size={20} />
                    </div>
                    <h3 className="text-xl md:text-2xl font-serif text-white mb-2">Venda Assistida</h3>
                    <p className="text-[10px] md:text-xs text-zinc-500 uppercase tracking-widest mb-6 font-bold">Valor & Suporte</p>
                    <p className="text-zinc-400 text-xs mb-8 min-h-[auto] md:min-h-[60px] leading-relaxed">
                        Envie seu projeto e nosso time sugere composições, ajusta medidas e simula no ambiente de forma real.
                    </p>

                    <a
                        href={`https://wa.me/5547997060582?text=Olá! Sou o arquiteto ${profile?.name} e gostaria de solicitar uma Venda Assistida para um projeto meu.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-4 bg-[#25D366] text-white text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-[#20bd5a] transition-all flex items-center justify-center gap-2 mb-3 rounded-lg shadow-[0_0_20px_rgba(37,211,102,0.2)]"
                    >
                        Solicitar via WhatsApp
                    </a>

                    <button
                        onClick={() => setAssistanceModalOpen(true)}
                        className="w-full py-4 border border-white/5 text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-white/5 transition-all rounded-lg"
                    >
                        Ver Detalhes do Fluxo
                    </button>
                    <div className="mt-4 flex items-center gap-2">
                        <div className="h-1 flex-1 bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full w-[80%] bg-gold"></div>
                        </div>
                        <span className="text-[9px] uppercase tracking-widest text-gold font-bold">+1% Bônus</span>
                    </div>
                </div>

                {/* MECÂNICA 3: AAA */}
                <div className="bg-zinc-900/30 border border-white/10 p-5 md:p-8 group hover:border-gold/50 transition-all duration-500 relative overflow-hidden rounded-xl">
                    <div className="absolute top-0 right-0 p-3 md:p-4 bg-zinc-900 rounded-bl-2xl text-[8px] md:text-[9px] font-bold uppercase tracking-widest text-zinc-500 group-hover:text-gold transition-colors">
                        Mecânica 03
                    </div>
                    <div className="mb-6 w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center text-zinc-500 group-hover:text-gold group-hover:scale-110 transition-all">
                        <Star size={20} />
                    </div>
                    <h3 className="text-xl md:text-2xl font-serif text-white mb-2">Criação Artística Exclusiva</h3>
                    <p className="text-[10px] md:text-xs text-zinc-500 uppercase tracking-widest mb-6 font-bold">Luxo & Atendimento AAA</p>
                    <p className="text-zinc-400 text-xs mb-8 min-h-[auto] md:min-h-[60px] leading-relaxed">
                        Criação artística sob medida pelo nosso artista residente para obras autorais exclusivas.
                    </p>

                    <a
                        href={`https://wa.me/5547997060582?text=Olá! Sou o arquiteto ${profile?.name} e gostaria de solicitar um Projeto Especial (AAA).`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-4 bg-[#25D366] text-white text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-[#20bd5a] transition-all flex items-center justify-center gap-2 mb-3 rounded-lg shadow-[0_0_20px_rgba(37,211,102,0.2)]"
                    >
                        Solicitar via WhatsApp
                    </a>

                    <button
                        onClick={() => setCustomProjectModalOpen(true)}
                        className="w-full py-4 border border-white/5 text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-white/5 transition-all rounded-lg"
                    >
                        Ver Detalhes do Fluxo
                    </button>
                    <div className="mt-4 flex items-center gap-2">
                        <div className="h-1 flex-1 bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full w-full bg-gold"></div>
                        </div>
                        <span className="text-[9px] uppercase tracking-widest text-gold font-bold">Garantida 20%</span>
                    </div>
                </div>
            </div>

            {/* STATS OVERVIEW */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="glass p-10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 text-white/5 group-hover:text-gold/10 transition-colors">
                        <DollarSign size={100} strokeWidth={1} />
                    </div>
                    <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-zinc-500 mb-6">Total Faturado</p>
                    <h3 className="text-2xl md:text-4xl font-serif text-white">
                        R$ {profile?.totalEarnings?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
                    </h3>
                </div>

                <div className="glass p-10 border-l-2 border-gold relative">
                    <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-zinc-500 mb-6">Taxa de Parceria</p>
                    <div className="flex items-baseline gap-3">
                        <h3 className="text-5xl font-serif text-gold">{profile?.commissionRate || 15}%</h3>
                    </div>
                    <p className="mt-4 text-[10px] text-zinc-400 font-medium uppercase tracking-[0.2em] leading-relaxed">
                        Sua graduação atual.
                    </p>
                </div>

                <div className="bg-ebonite glass p-10 shadow-2xl relative overflow-hidden border border-white/5">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <Award size={100} strokeWidth={1} className="text-white" />
                    </div>
                    <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-zinc-600 mb-6">Status do Escritório</p>
                    <h3 className="text-2xl md:text-4xl font-serif text-white uppercase tracking-wider">Standard</h3>
                    <p className="mt-4 text-[10px] text-gold font-bold uppercase tracking-widest">
                        Em desenvolvimento
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Ranking Section */}
                <Ranking />

                {/* Vendas Recentes */}
                <div className="glass overflow-hidden min-h-[300px] flex flex-col">
                    <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
                        <h3 className="font-serif text-2xl text-white">Vendas Recentes</h3>
                        <button
                            onClick={() => navigate('/earnings')}
                            className="text-[9px] text-gold hover:text-white font-bold uppercase tracking-[0.3em] transition-all flex items-center gap-2"
                        >
                            Relatório Completo <ArrowRight size={14} />
                        </button>
                    </div>
                    {recentSales.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-12 text-zinc-600">
                            <Inbox size={48} strokeWidth={1} className="mb-4 opacity-20" />
                            <p className="text-[10px] uppercase tracking-[0.3em]">Nenhuma venda registrada ainda</p>
                        </div>
                    ) : (
                        <div className="flex-1 overflow-auto">
                            <table className="w-full text-left">
                                <tbody className="divide-y divide-white/5">
                                    {recentSales.map((sale) => (
                                        <tr key={sale.id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4 text-[10px] font-mono text-zinc-600">
                                                {sale.reference}
                                                {sale.type === 'MAGAZORD' && <span className="ml-2 text-[8px] bg-gold/20 text-gold px-1.5 py-0.5 rounded border border-gold/30">ONLINE</span>}
                                            </td>
                                            <td className="px-6 py-4 text-xs text-white truncate max-w-[120px]">{sale.clientName}</td>
                                            <td className="px-6 py-4 text-xs font-bold text-gold text-right">R$ {sale.commissionValue.toLocaleString('pt-BR')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* EDUCATION & RESOURCES SECTION - NEW */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <div className="glass p-8 h-full">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                                <Crown size={20} />
                            </div>
                            <div>
                                <h3 className="font-serif text-xl text-white">Academia Casa Linda</h3>
                                <p className="text-[10px] uppercase tracking-widest text-zinc-500">Materiais Exclusivos</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <ArchitectSalesManual />
                            <SalesMechanics />
                            <PartnerGuide />
                            {profile?.isAdmin && (
                                <>
                                    <ArchitectHandbook />
                                    <InternalFAQ />
                                </>
                            )}
                            <div className="p-4 rounded-xl border border-white/5 bg-white/5 opacity-50 cursor-not-allowed">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500">
                                        <Award size={16} />
                                    </div>
                                    <div>
                                        <h4 className="text-zinc-400 text-xs font-bold uppercase">Certificação Premium</h4>
                                        <p className="text-zinc-600 text-[10px]">Em breve</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <AssistanceModal isOpen={assistanceModalOpen} onClose={() => setAssistanceModalOpen(false)} />
            <CustomProjectModal isOpen={customProjectModalOpen} onClose={() => setCustomProjectModalOpen(false)} />

            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
      `}</style>
        </div>
    );
};
