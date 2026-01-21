import React, { useEffect, useState } from 'react';
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
    LayoutGrid 
} from 'lucide-react';
import { Ranking } from '../components/Ranking';
import { ProductionManager } from '../components/ProductionManager';

export const AdminDashboard: React.FC = () => {
    const [pendingArchitects, setPendingArchitects] = useState<Architect[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [stats, setStats] = useState({
        totalProposals: 0,
        totalProposalValue: 0,
        averageTicket: 0,
        totalArchitects: 0
    });
    const [storeDiscount, setStoreDiscount] = useState('0');
    const [savingDiscount, setSavingDiscount] = useState(false);
    const [activeTab, setActiveTab] = useState<'overview' | 'production'>('overview');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            await Promise.all([
                fetchPendingArchitects(),
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
        const { data: proposals } = await supabase.from('proposals').select('total_value');
        const { count: architectsCount } = await supabase.from('architects').select('*', { count: 'exact', head: true });

        const totalValue = proposals?.reduce((acc, p) => acc + Number(p.total_value), 0) || 0;
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
            .single();

        if (data) {
            setStoreDiscount(data.value);
        }
    };

    const handleSaveDiscount = async () => {
        setSavingDiscount(true);
        try {
            const { error } = await supabase
                .from('app_settings')
                .upsert({ key: 'store_discount_percentage', value: storeDiscount }, { onConflict: 'key' });

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
            setPendingArchitects(data || []);
        } catch (error) {
            console.error('Error fetching architects:', error);
        }
    };

    const handleAction = async (id: string, action: 'approved' | 'rejected') => {
        setActionLoading(id);
        try {
            const { error } = await supabase
                .from('architects')
                .update({
                    approval_status: action,
                    approved_at: action === 'approved' ? new Date().toISOString() : null,
                } as any)
                .eq('id', id);

            if (error) throw error;

            // Remove from list
            setPendingArchitects(prev => prev.filter(arch => arch.id !== id));
        } catch (error) {
            console.error(`Error ${action} architect:`, error);
            alert(`Erro ao processar ação. Tente novamente.`);
        } finally {
            setActionLoading(null);
        }
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

                <div className="flex gap-1 bg-white/5 p-1 rounded-xl">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-6 py-3 text-[10px] uppercase font-bold tracking-widest rounded-lg transition-all flex items-center gap-3 ${activeTab === 'overview' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}
                    >
                        <LayoutGrid size={14} /> Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('production')}
                        className={`px-6 py-3 text-[10px] uppercase font-bold tracking-widest rounded-lg transition-all flex items-center gap-3 ${activeTab === 'production' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}
                    >
                        <Package size={14} /> Produção & Expedição
                    </button>
                </div>
            </header>

            {activeTab === 'overview' ? (
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
                                        Este valor será usado como base para gerar os cupons dos arquitetos (Base + 3%).
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
                                                        onClick={() => handleAction(arch.id, 'rejected')}
                                                        disabled={!!actionLoading}
                                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all disabled:opacity-50"
                                                    >
                                                        {actionLoading === arch.id ? <Loader2 className="animate-spin" size={14} /> : <XCircle size={14} />}
                                                        Rejeitar
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(arch.id, 'approved')}
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
            ) : (
                <ProductionManager />
            )}
        </div>
    );
};
