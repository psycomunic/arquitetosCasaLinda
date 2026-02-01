import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Architect } from '../types/database';
import {
    CheckCircle2,
    XCircle,
    Loader2,
    Shield,
    BarChart,
    Users,
    DollarSign,
    FileText,
    Package,
    LayoutGrid,
    MessageCircle
} from 'lucide-react';
import { Ranking } from '../components/Ranking';
import { ProductionManager } from '../components/ProductionManager';

import { AddSaleModal } from '../components/AddSaleModal';

export const AdminDashboard: React.FC = () => {
    const [pendingArchitects, setPendingArchitects] = useState<Architect[]>([]);
    const [approvedArchitects, setApprovedArchitects] = useState<Architect[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [selectedArchitect, setSelectedArchitect] = useState<Architect | null>(null);
    const [isAddSaleModalOpen, setIsAddSaleModalOpen] = useState(false);

    const [stats, setStats] = useState({
        totalProposals: 0,
        totalProposalValue: 0,
        averageTicket: 0,
        totalArchitects: 0
    });
    const [storeDiscount, setStoreDiscount] = useState('0');
    const [savingDiscount, setSavingDiscount] = useState(false);
    const [activeTab, setActiveTab] = useState<'overview' | 'production' | 'architects'>('overview');
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [approvalModalOpen, setApprovalModalOpen] = useState(false);
    const [architectToApprove, setArchitectToApprove] = useState<Architect | null>(null);
    const [couponCode, setCouponCode] = useState('');

    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab === 'production') {
            setActiveTab('production');
        } else if (tab === 'architects') {
            setActiveTab('architects');
        } else {
            setActiveTab('overview');
        }
    }, [searchParams]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            await Promise.all([
                fetchPendingArchitects(),
                fetchApprovedArchitects(),
                fetchStats(),
                fetchSettings()
            ]);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        // Fetch proposals stats
        const { data: proposals } = await supabase.from('proposals').select('total_value') as any;
        const { count: architectsCount } = await supabase.from('architects').select('*', { count: 'exact', head: true });

        const totalValue = proposals?.reduce((acc: any, p: any) => acc + Number(p.total_value), 0) || 0;
        const totalCount = proposals?.length || 0;

        setStats({
            totalProposals: totalCount,
            totalProposalValue: totalValue,
            averageTicket: totalCount > 0 ? totalValue / totalCount : 0,
            totalArchitects: architectsCount || 0
        });
    }

    const fetchSettings = async () => {
        const { data } = await supabase
            .from('app_settings')
            .select('value')
            .eq('key', 'store_discount_percentage')
            .single() as any;

        if (data) {
            setStoreDiscount(data.value);
            // Don't auto-set coupon code here as it depends on the architect
        }
    };

    const handleSaveDiscount = async () => {
        setSavingDiscount(true);
        try {
            const { error } = await supabase
                .from('app_settings')
                .upsert({ key: 'store_discount_percentage', value: storeDiscount } as any, { onConflict: 'key' });

            if (error) throw error;
            alert('Configuração de desconto atualizada!');
        } catch (err) {
            console.error(err);
            alert('Erro ao salvar configuração.');
        } finally {
            setSavingDiscount(false);
        }
    };

    const fetchPendingArchitects = async () => {
        try {
            const { data, error } = await supabase
                .from('architects')
                .select('*')
                .eq('approval_status', 'pending')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setPendingArchitects((data as any) || []);
        } catch (error) {
            console.error('Error fetching architects:', error);
        }
    };

    const fetchApprovedArchitects = async () => {
        try {
            const { data, error } = await supabase
                .from('architects')
                .select('*')
                .eq('approval_status', 'approved')
                .order('name', { ascending: true });

            if (error) throw error;
            setApprovedArchitects((data as any) || []);
        } catch (error) {
            console.error('Error fetching approved architects:', error);
        }
    };

    const handleReject = async (id: string) => {
        if (!confirm('Tem certeza que deseja rejeitar este arquiteto?')) return;

        setActionLoading(id);
        try {
            const { error } = await (supabase
                .from('architects') as any)
                .update({
                    approval_status: 'rejected',
                    approved_at: null,
                })
                .eq('id', id);

            if (error) throw error;

            fetchPendingArchitects();
            fetchApprovedArchitects();
        } catch (error) {
            console.error(`Error rejecting architect:`, error);
            alert(`Erro ao processar ação. Tente novamente.`);
        } finally {
            setActionLoading(null);
        }
    };

    const initiateApproval = async (architect: Architect) => {
        setArchitectToApprove(architect);

        const firstName = architect.name.split(' ')[0].toLowerCase().trim();
        const discount = storeDiscount || '15';
        let baseCode = `${firstName}${discount}`;
        let finalCode = baseCode;
        let isUnique = false;
        let attempts = 0;

        // Check uniqueness and suggest alternative
        while (!isUnique && attempts < 10) {
            const { data } = await supabase
                .from('architects')
                .select('id')
                .eq('coupon_code', finalCode)
                .single();

            if (!data) {
                isUnique = true;
            } else {
                attempts++;
                finalCode = `${baseCode}${attempts}`;
            }
        }

        setCouponCode(finalCode);
        setApprovalModalOpen(true);
    };

    const handleConfirmApproval = async () => {
        if (!architectToApprove) return;

        setActionLoading(architectToApprove.id);
        try {
            // Check for duplicate coupon
            const { data: existingCoupon } = await supabase
                .from('architects')
                .select('id')
                .eq('coupon_code', couponCode)
                .single();

            if (existingCoupon) {
                alert('Este código de cupom já está em uso por outro arquiteto. Por favor, escolha outro.');
                setActionLoading(null);
                return;
            }

            // Update architect with approval status AND coupon code
            const { error } = await (supabase
                .from('architects') as any)
                .update({
                    approval_status: 'approved',
                    approved_at: new Date().toISOString(),
                    coupon_code: couponCode,
                    commission_rate: 15
                })
                .eq('id', architectToApprove.id);

            if (error) throw error;

            setApprovalModalOpen(false);
            setArchitectToApprove(null);
            setCouponCode('');

            fetchPendingArchitects();
            fetchApprovedArchitects();
            alert('Arquiteto aprovado com sucesso! Cupom gerado.');
        } catch (error) {
            console.error(`Error approving architect:`, error);
            alert(`Erro ao aprovar arquiteto. Tente novamente.`);
        } finally {
            setActionLoading(null);
        }
    };

    const openAddSaleModal = (architect: Architect) => {
        setSelectedArchitect(architect);
        setIsAddSaleModalOpen(true);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="animate-spin text-gold" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-20">
            <header className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                    <h2 className="text-4xl font-serif text-white">Painel Administrativo</h2>
                    <p className="text-zinc-500 text-sm font-light uppercase tracking-widest mt-2">
                        Controle e Gestão da Casa Linda
                    </p>
                </div>

                <div className="flex gap-1 bg-white/5 p-1 rounded-xl overflow-x-auto scrollbar-hide w-full md:w-auto">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-6 py-3 text-[10px] uppercase font-bold tracking-widest rounded-lg transition-all flex items-center gap-3 whitespace-nowrap ${activeTab === 'overview' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}
                    >
                        <LayoutGrid size={14} /> Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('production')}
                        className={`px-6 py-3 text-[10px] uppercase font-bold tracking-widest rounded-lg transition-all flex items-center gap-3 whitespace-nowrap ${activeTab === 'production' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}
                    >
                        <Package size={14} /> Produção & Expedição
                    </button>
                    <button
                        onClick={() => setActiveTab('architects')}
                        className={`px-6 py-3 text-[10px] uppercase font-bold tracking-widest rounded-lg transition-all flex items-center gap-3 whitespace-nowrap ${activeTab === 'architects' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}
                    >
                        <Users size={14} /> Arquitetos
                    </button>
                    <div className="w-[1px] h-6 bg-white/10 mx-2 self-center hidden md:block"></div>
                    <button
                        onClick={() => navigate('/proposals')}
                        className="px-6 py-3 text-[10px] uppercase font-bold tracking-widest rounded-lg transition-all flex items-center gap-3 text-gold hover:bg-gold hover:text-black hover:shadow-[0_0_20px_rgba(197,160,89,0.3)] whitespace-nowrap"
                    >
                        <FileText size={14} /> Nova Proposta
                    </button>
                </div>
            </header>

            {activeTab === 'overview' && (
                <>
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="glass p-6">
                            <div className="flex justify-between items-start mb-4">
                                <Users className="text-gold" size={24} />
                                <span className="text-[9px] uppercase tracking-widest text-zinc-500">Arquitetos</span>
                            </div>
                            <h3 className="text-3xl font-serif text-white">{stats.totalArchitects}</h3>
                        </div>
                        <div className="glass p-6">
                            <div className="flex justify-between items-start mb-4">
                                <FileText className="text-zinc-400" size={24} />
                                <span className="text-[9px] uppercase tracking-widest text-zinc-500">Propostas</span>
                            </div>
                            <h3 className="text-3xl font-serif text-white">{stats.totalProposals}</h3>
                        </div>
                        <div className="glass p-6">
                            <div className="flex justify-between items-start mb-4">
                                <DollarSign className="text-green-500" size={24} />
                                <span className="text-[9px] uppercase tracking-widest text-zinc-500">Vol. Propostas</span>
                            </div>
                            <h3 className="text-2xl font-serif text-white">R$ {(stats.totalProposalValue / 1000).toFixed(1)}k</h3>
                        </div>
                        <div className="glass p-6">
                            <div className="flex justify-between items-start mb-4">
                                <BarChart className="text-blue-400" size={24} />
                                <span className="text-[9px] uppercase tracking-widest text-zinc-500">Ticket Médio</span>
                            </div>
                            <h3 className="text-2xl font-serif text-white">R$ {(stats.averageTicket || 0).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</h3>
                        </div>
                    </div>

                    {/* Store Settings Section */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-white flex items-center gap-3">
                            <DollarSign className="text-gold" /> Promoções & Cashback Loja
                        </h3>
                        <div className="glass p-8 md:p-12 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <DollarSign size={150} strokeWidth={1} />
                            </div>
                            <div className="max-w-md space-y-8 relative z-10">
                                <div className="space-y-4">
                                    <label className="block text-[10px] uppercase tracking-[0.4em] font-bold text-zinc-500">
                                        Desconto Base da Loja (%)
                                    </label>
                                    <p className="text-xs text-zinc-500 mb-6">
                                        Este valor será usado como base para gerar os cupons dos arquitetos.
                                    </p>
                                    <div className="flex gap-4">
                                        <input
                                            type="number"
                                            value={storeDiscount}
                                            onChange={(e) => setStoreDiscount(e.target.value)}
                                            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-6 py-4 text-white font-serif text-xl focus:border-gold outline-none transition-all"
                                            placeholder="Ex: 10"
                                        />
                                        <button
                                            onClick={handleSaveDiscount}
                                            disabled={savingDiscount}
                                            className="px-8 py-4 bg-gold text-black text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-white transition-all disabled:opacity-50 flex items-center gap-2"
                                        >
                                            {savingDiscount ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} />}
                                            Salvar Promoção
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Ranking */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold text-white flex items-center gap-3">
                                <BarChart className="text-gold" /> Performance de Vendas
                            </h3>
                            <Ranking />
                        </div>

                        {/* Pending Requests */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold text-white flex items-center gap-3">
                                <Shield className="text-gold" /> Solicitações Pendentes
                            </h3>
                            <div className="glass p-8 md:p-12">
                                {pendingArchitects.length === 0 ? (
                                    <div className="text-center py-12 text-zinc-500">
                                        <p className="text-xs uppercase tracking-widest">Nenhuma solicitação pendente.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {pendingArchitects.map((arch) => (
                                            <div key={arch.id} className="p-6 rounded-lg bg-white/5 border border-white/5 flex flex-col items-start gap-6 transition-all hover:bg-white/10">
                                                <div className="space-y-2 w-full">
                                                    <div className="flex items-center justify-between">
                                                        <h4 className="text-white font-bold text-sm tracking-wide">{arch.name}</h4>
                                                        {arch.cau && <span className="bg-gold/10 text-gold text-[9px] px-2 py-1 rounded border border-gold/20 font-mono">CAU: {arch.cau}</span>}
                                                    </div>
                                                    <div className="text-xs text-zinc-500 space-y-1">
                                                        <p>{arch.email}</p>
                                                        <p className="text-[10px] opacity-70">Solicitado: {new Date(arch.created_at).toLocaleDateString()}</p>
                                                        <div className="flex gap-2 text-[10px] text-zinc-400 mt-2">
                                                            <span>{arch.city || 'N/A'}-{arch.state || 'UF'}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4 w-full">
                                                    <button
                                                        onClick={() => handleReject(arch.id)}
                                                        disabled={!!actionLoading}
                                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all disabled:opacity-50"
                                                    >
                                                        {actionLoading === arch.id ? <Loader2 className="animate-spin" size={14} /> : <XCircle size={14} />}
                                                        Rejeitar
                                                    </button>
                                                    <button
                                                        onClick={() => initiateApproval(arch)}
                                                        disabled={!!actionLoading}
                                                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/20 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all disabled:opacity-50"
                                                    >
                                                        {actionLoading === arch.id ? <Loader2 className="animate-spin" size={14} /> : <CheckCircle2 size={14} />}
                                                        Aprovar
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}

            {activeTab === 'production' && <ProductionManager />}

            {activeTab === 'architects' && (
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-3">
                        <Users className="text-gold" /> Arquitetos Parceiros
                    </h3>

                    <div className="glass p-8">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/10 text-left">
                                        <th className="pb-4 text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Arquiteto</th>
                                        <th className="pb-4 text-[10px] uppercase tracking-widest text-zinc-500 font-bold text-right">Vendas Totais</th>
                                        <th className="pb-4 text-[10px] uppercase tracking-widest text-zinc-500 font-bold text-center">Cupom</th>
                                        <th className="pb-4 text-[10px] uppercase tracking-widest text-zinc-500 font-bold text-right">Comissão Atual</th>
                                        <th className="pb-4 text-[10px] uppercase tracking-widest text-zinc-500 font-bold text-center">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {approvedArchitects.map((arch) => (
                                        <tr key={arch.id} className="group hover:bg-white/5 transition-colors">
                                            <td className="py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-white font-bold text-sm">{arch.name}</span>
                                                    <span className="text-zinc-500 text-xs">{arch.email}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 text-right">
                                                <span className="text-white font-mono">
                                                    {arch.total_earnings?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                </span>
                                            </td>
                                            <td className="py-4 text-center">
                                                <div className="flex flex-col items-center gap-2">
                                                    {arch.coupon_code ? (
                                                        <span className="text-zinc-400 font-mono text-xs border border-white/10 px-2 py-1 rounded bg-white/5">
                                                            {arch.coupon_code}
                                                        </span>
                                                    ) : (
                                                        <span className="text-zinc-600 text-[10px] italic">Sem cupom</span>
                                                    )}
                                                    {arch.phone && (
                                                        <a
                                                            href={`https://wa.me/55${arch.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                                                                "Olá! Segue os contatos do site. Se precisar de qualquer auxilio, pode estar chamando no whatsapp 47997060582 para atendimento do arquiteto e para clientes finais o número é 47997220810. Para informações como comissões, pode estar acessando os aquivos disponibilizados no portal do arquiteto. Qualquer duvida estaremos a disposição, e Boas vendas!"
                                                            )}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-1 text-[9px] text-green-500 hover:text-green-400 uppercase tracking-widest font-bold bg-green-500/10 hover:bg-green-500/20 px-2 py-1.5 rounded transition-all"
                                                        >
                                                            <MessageCircle size={10} />
                                                            Boas Vindas
                                                        </a>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-4 text-right">
                                                <span className="bg-gold/10 text-gold text-xs px-2 py-1 rounded border border-gold/20 font-bold">
                                                    {arch.commission_rate}%
                                                </span>
                                            </td>
                                            <td className="py-4 text-center">
                                                <button
                                                    onClick={() => openAddSaleModal(arch)}
                                                    className="bg-zinc-800 text-gold hover:text-white hover:bg-gold hover:text-black border border-white/10 hover:border-gold px-4 py-2 rounded text-[10px] font-bold uppercase tracking-widest transition-all"
                                                >
                                                    + Adicionar Venda
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {selectedArchitect && (
                <AddSaleModal
                    isOpen={isAddSaleModalOpen}
                    onClose={() => setIsAddSaleModalOpen(false)}
                    architect={selectedArchitect}
                    onSuccess={() => {
                        fetchApprovedArchitects();
                        fetchStats();
                    }}
                />
            )}

            {/* Approval Modal */}
            {approvalModalOpen && architectToApprove && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-zinc-900 w-full max-w-md rounded-2xl p-8 border border-white/10 shadow-2xl space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-serif text-white">Aprovar Arquiteto</h3>
                            <button onClick={() => setApprovalModalOpen(false)} className="text-zinc-500 hover:text-white">
                                <XCircle size={20} />
                            </button>
                        </div>

                        <div>
                            <p className="text-sm text-zinc-400 mb-1">Arquiteto</p>
                            <p className="text-white font-bold">{architectToApprove.name}</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">Cupom de Desconto</label>
                            <input
                                type="text"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white font-mono focus:border-gold outline-none"
                                placeholder="Ex: nome15"
                            />
                            <p className="text-[10px] text-zinc-600">Este cupom será vinculado ao perfil do arquiteto.</p>
                        </div>

                        <button
                            onClick={handleConfirmApproval}
                            disabled={!couponCode || !!actionLoading}
                            className="w-full py-4 bg-gold text-black font-bold uppercase tracking-widest rounded-lg hover:bg-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {actionLoading ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle2 size={16} />}
                            Confirmar Aprovação
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
