import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Architect } from '../types/database';
import { CheckCircle2, XCircle, Loader2, ShieldAlert, BarChart3, Users, DollarSign, FileText } from 'lucide-react';
import { Ranking } from '../components/Ranking';

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

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            await Promise.all([
                fetchPendingArchitects(),
                fetchStats()
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
        <div className="animate-fade-in space-y-12">
            <header>
                <h2 className="text-4xl font-serif text-white">Painel Administrativo</h2>
                <p className="text-zinc-500 text-sm font-light uppercase tracking-widest mt-2">
                    Visão geral de performance e solicitações.
                </p>
            </header>

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
                        <BarChart3 className="text-blue-400" size={24} />
                        <span className="text-[9px] uppercase tracking-widest text-zinc-500">Ticket Médio</span>
                    </div>
                    <h3 className="text-2xl font-serif text-white">R$ {stats.averageTicket.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</h3>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Ranking */}
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-3">
                        <BarChart3 className="text-gold" /> Performance de Vendas
                    </h3>
                    <Ranking />
                </div>

                {/* Pending Requests */}
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-3">
                        <ShieldAlert className="text-gold" /> Solicitações Pendentes
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
        </div>
    );
};
