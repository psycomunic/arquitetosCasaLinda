import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Architect } from '../types/database';
import { CheckCircle2, XCircle, Loader2, ShieldAlert } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
    const [pendingArchitects, setPendingArchitects] = useState<Architect[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        fetchPendingArchitects();
    }, []);

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
        } finally {
            setLoading(false);
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
                    // In a real app we would set approved_by from current session
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
                    Gerencie solicitações de acesso ao portal.
                </p>
            </header>

            <div className="glass p-8 md:p-12">
                <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                    <ShieldAlert className="text-gold" /> Solicitações Pendentes
                </h3>

                {pendingArchitects.length === 0 ? (
                    <div className="text-center py-12 text-zinc-500">
                        <p className="text-xs uppercase tracking-widest">Nenhuma solicitação pendente no momento.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {pendingArchitects.map((arch) => (
                            <div key={arch.id} className="p-6 rounded-lg bg-white/5 border border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all hover:bg-white/10">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <h4 className="text-white font-bold text-sm tracking-wide">{arch.name}</h4>
                                        {arch.cau && <span className="bg-gold/10 text-gold text-[9px] px-2 py-1 rounded border border-gold/20 font-mono">CAU: {arch.cau}</span>}
                                    </div>
                                    <div className="text-xs text-zinc-500 space-y-1">
                                        <p>{arch.email}</p>
                                        <p className="text-[10px] opacity-70">Solicitado em: {new Date(arch.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 w-full md:w-auto">
                                    <button
                                        onClick={() => handleAction(arch.id, 'rejected')}
                                        disabled={!!actionLoading}
                                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all disabled:opacity-50"
                                    >
                                        {actionLoading === arch.id ? <Loader2 className="animate-spin" size={14} /> : <XCircle size={14} />}
                                        Rejeitar
                                    </button>
                                    <button
                                        onClick={() => handleAction(arch.id, 'approved')}
                                        disabled={!!actionLoading}
                                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/20 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all disabled:opacity-50"
                                    >
                                        {actionLoading === arch.id ? <Loader2 className="animate-spin" size={14} /> : <CheckCircle2 size={14} />}
                                        Aprovar Acesso
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
