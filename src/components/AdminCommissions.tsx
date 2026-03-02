import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { CheckCircle2, Search, Filter, Loader2, DollarSign, RefreshCw, AlertCircle } from 'lucide-react';

interface CombinedCommission {
    id: string;
    date: string;
    reference: string;
    architectId: string;
    architectName: string;
    clientName: string;
    type: 'PROPOSAL' | 'MAGAZORD';
    saleValue: number;
    commissionValue: number;
    status: 'pending' | 'paid' | 'cancelled';
    originalId: string; // ID from the original table
}

export const AdminCommissions: React.FC = () => {
    const [commissions, setCommissions] = useState<CombinedCommission[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'paid' | 'cancelled'>('all');

    const fetchCommissions = async () => {
        setLoading(true);
        try {
            // Fetch manual sales
            const { data: salesData, error: salesError } = await supabase
                .from('sales')
                .select('*, architects(name)');

            // Fetch MagaZord sales
            const { data: magazordData, error: magazordError } = await supabase
                .from('magazord_commissions')
                .select('*, architects(name)');

            if (salesError) throw salesError;
            if (magazordError) throw magazordError;

            let combined: CombinedCommission[] = [];

            if (salesData) {
                combined = [...combined, ...salesData.map((s: any) => ({
                    id: `SALE-${s.id}`,
                    originalId: s.id,
                    date: s.created_at,
                    reference: s.proposal_id ? s.proposal_id.slice(0, 8) : 'MANUAL',
                    architectId: s.architect_id,
                    architectName: s.architects?.name || 'Desconhecido',
                    clientName: s.client_name || 'Venda Assistida',
                    type: 'PROPOSAL' as const,
                    saleValue: Number(s.sale_value),
                    commissionValue: Number(s.commission_value),
                    status: s.status as 'pending' | 'paid' | 'cancelled'
                }))];
            }

            if (magazordData) {
                combined = [...combined, ...magazordData.map((m: any) => ({
                    id: `MAGZ-${m.id}`,
                    originalId: m.id,
                    date: m.created_at,
                    reference: `ORD-${m.magazord_order_id}`,
                    architectId: m.architect_id,
                    architectName: m.architects?.name || 'Desconhecido',
                    clientName: 'E-commerce (MagaZord)',
                    type: 'MAGAZORD' as const,
                    saleValue: Number(m.order_value),
                    commissionValue: Number(m.commission_amount),
                    status: (m.status === 'PAID' ? 'paid' : m.status === 'CANCELED' ? 'cancelled' : 'pending') as 'pending' | 'paid' | 'cancelled'
                }))];
            }

            // Sort newest first
            combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

            setCommissions(combined);
        } catch (error) {
            console.error('Error fetching commissions:', error);
            alert('Erro ao carregar comissões.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCommissions();
    }, []);

    const handleMarkAsPaid = async (commission: CombinedCommission) => {
        if (!confirm(`Tem certeza que deseja marcar esta comissão de R$ ${commission.commissionValue.toLocaleString('pt-BR')} para ${commission.architectName} como PAGA?`)) {
            return;
        }

        setActionLoading(commission.id);
        try {
            // 1. Update the specific table status
            if (commission.type === 'PROPOSAL') {
                const { error } = await (supabase.from('sales') as any)
                    .update({ status: 'paid' })
                    .eq('id', commission.originalId);
                if (error) throw error;
            } else if (commission.type === 'MAGAZORD') {
                const { error } = await (supabase.from('magazord_commissions') as any)
                    .update({ status: 'PAID' })
                    .eq('id', commission.originalId);
                if (error) throw error;
            }

            // 2. Fetch current architect total earnings
            const { data: archData, error: archError } = await supabase
                .from('architects')
                .select('total_earnings')
                .eq('id', commission.architectId)
                .single();

            if (archError) throw archError;
            if (!archData) throw new Error('Architect not found');

            // 3. Increment the earnings
            const currentEarnings = Number((archData as any).total_earnings) || 0;
            const newEarnings = currentEarnings + commission.commissionValue;

            const { error: updateArchError } = await (supabase.from('architects') as any)
                .update({ total_earnings: newEarnings })
                .eq('id', commission.architectId);

            if (updateArchError) throw updateArchError;

            alert('Comissão marcada como paga com sucesso e saldo do arquiteto atualizado!');
            fetchCommissions();
        } catch (error) {
            console.error('Error marking as paid:', error);
            alert('Erro ao processar o pagamento.');
        } finally {
            setActionLoading(null);
        }
    };

    const handleMarkAsCancelled = async (commission: CombinedCommission) => {
        if (!confirm(`Tem certeza que deseja marcar esta comissão de ${commission.architectName} como CANCELADA?`)) {
            return;
        }

        setActionLoading(commission.id);
        try {
            if (commission.type === 'PROPOSAL') {
                const { error } = await (supabase.from('sales') as any)
                    .update({ status: 'cancelled' })
                    .eq('id', commission.originalId);
                if (error) throw error;
            } else if (commission.type === 'MAGAZORD') {
                const { error } = await (supabase.from('magazord_commissions') as any)
                    .update({ status: 'CANCELED' })
                    .eq('id', commission.originalId);
                if (error) throw error;
            }

            fetchCommissions();
        } catch (error) {
            console.error('Error cancelling:', error);
            alert('Erro ao cancelar comissão.');
        } finally {
            setActionLoading(null);
        }
    };

    const filteredCommissions = commissions.filter(c => {
        const matchesSearch = c.architectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.clientName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const pendingTotal = commissions
        .filter(c => c.status === 'pending')
        .reduce((sum, c) => sum + c.commissionValue, 0);

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <DollarSign className="text-gold" /> Gestão de Repasses de Arquitetos
            </h3>

            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass p-6 border-l-2 border-gold relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <DollarSign size={80} />
                    </div>
                    <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500 mb-2">Comissões Pendentes</p>
                    <h3 className="text-3xl font-serif text-white">R$ {pendingTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
                    <p className="text-[10px] text-zinc-400 mt-2">Aguardando repasse manual</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center glass p-4">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                    <input
                        type="text"
                        placeholder="Buscar por arquiteto, cliente ou ref..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-lg pl-12 pr-4 py-3 text-sm text-white focus:border-gold outline-none"
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <button
                        onClick={() => setStatusFilter('all')}
                        className={`px-4 py-2 text-[10px] uppercase tracking-widest font-bold rounded flex-1 md:flex-none transition-colors border ${statusFilter === 'all' ? 'bg-white text-black border-white' : 'border-white/10 text-zinc-400 hover:border-gold'}`}
                    >
                        Todos
                    </button>
                    <button
                        onClick={() => setStatusFilter('pending')}
                        className={`px-4 py-2 text-[10px] uppercase tracking-widest font-bold rounded flex-1 md:flex-none transition-colors border ${statusFilter === 'pending' ? 'bg-gold/20 text-gold border-gold' : 'border-white/10 text-zinc-400 hover:border-gold'}`}
                    >
                        Pendentes
                    </button>
                    <button
                        onClick={() => setStatusFilter('paid')}
                        className={`px-4 py-2 text-[10px] uppercase tracking-widest font-bold rounded flex-1 md:flex-none transition-colors border ${statusFilter === 'paid' ? 'bg-green-500/20 text-green-500 border-green-500' : 'border-white/10 text-zinc-400 hover:border-gold'}`}
                    >
                        Pagos
                    </button>
                    <button
                        onClick={fetchCommissions}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 text-zinc-300 rounded border border-white/10 flex items-center justify-center"
                        title="Atualizar lista"
                    >
                        <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="glass overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-black/40 border-b border-white/5 text-[9px] uppercase tracking-[0.3em] text-zinc-500 font-bold">
                                <th className="px-6 py-4">Data</th>
                                <th className="px-6 py-4">Arquiteto</th>
                                <th className="px-6 py-4">Origem / Ref</th>
                                <th className="px-6 py-4 text-right">Repasse (R$)</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-center">Ação</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                                        <Loader2 className="animate-spin mx-auto mb-2 text-gold" size={24} />
                                        <p className="text-[10px] uppercase tracking-widest">Carregando comissões...</p>
                                    </td>
                                </tr>
                            ) : filteredCommissions.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                                        <AlertCircle className="mx-auto mb-2 opacity-50" size={24} />
                                        <p className="text-[10px] uppercase tracking-widest">Nenhuma comissão encontrada</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredCommissions.map(commission => (
                                    <tr key={commission.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 text-xs text-zinc-400">
                                            {new Date(commission.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-bold text-white">{commission.architectName}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-xs text-zinc-300">{commission.clientName}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[10px] font-mono text-zinc-500">{commission.reference}</span>
                                                {commission.type === 'MAGAZORD' && (
                                                    <span className="text-[8px] bg-gold/20 text-gold px-1.5 py-0.5 rounded border border-gold/30">ONLINE</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <p className="text-sm font-bold text-gold">R$ {commission.commissionValue.toLocaleString('pt-BR')}</p>
                                            <p className="text-[9px] text-zinc-500">Venda: R$ {commission.saleValue.toLocaleString('pt-BR')}</p>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded inline-flex items-center gap-1
                                                ${commission.status === 'paid' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                                                    commission.status === 'cancelled' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                                                        'bg-gold/10 text-gold border border-gold/20'}`
                                            }>
                                                {commission.status === 'paid' ? 'Pago' : commission.status === 'pending' ? 'Pendente' : 'Cancelado'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {commission.status === 'pending' && (
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => handleMarkAsPaid(commission)}
                                                        disabled={!!actionLoading}
                                                        className="px-3 py-1.5 bg-green-500/10 hover:bg-green-500/20 text-green-500 border border-green-500/20 rounded text-[9px] font-bold uppercase tracking-widest transition-all disabled:opacity-50"
                                                    >
                                                        {actionLoading === commission.id ? <Loader2 size={12} className="animate-spin inline mr-1" /> : <CheckCircle2 size={12} className="inline mr-1" />}
                                                        Pagar
                                                    </button>
                                                    <button
                                                        onClick={() => handleMarkAsCancelled(commission)}
                                                        disabled={!!actionLoading}
                                                        className="px-3 py-1.5 hover:bg-red-500/10 text-zinc-500 hover:text-red-500 rounded text-[9px] font-bold uppercase tracking-widest transition-all disabled:opacity-50"
                                                    >
                                                        Cancelar
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
