import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import {
    CheckCircle2, Search, Loader2, DollarSign, RefreshCw,
    AlertCircle, Calendar, Users, Clock, History, TrendingUp, X
} from 'lucide-react';

interface CombinedCommission {
    id: string;
    date: string;
    reference: string;
    architectId: string;
    architectName: string;
    pixKey: string | null;
    clientName: string;
    type: 'PROPOSAL' | 'MAGAZORD';
    saleValue: number;
    commissionValue: number;
    status: 'awaiting' | 'pending' | 'paid' | 'cancelled';
    originalId: string;
}

interface ArchitectSummary {
    architectId: string;
    architectName: string;
    pixKey: string | null;
    pendingCount: number;
    pendingTotal: number;
    commissions: CombinedCommission[];
}

export const AdminCommissions: React.FC = () => {
    const [commissions, setCommissions] = useState<CombinedCommission[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'summary' | 'history'>('summary');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'paid' | 'cancelled'>('all');
    const [selectedArchitectForPayment, setSelectedArchitectForPayment] = useState<ArchitectSummary | null>(null);

    // Month selector: default to current month
    const now = new Date();
    const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
    const [selectedYear, setSelectedYear] = useState(now.getFullYear());

    const fetchCommissions = async () => {
        setLoading(true);
        try {
            const { data: salesData } = await supabase
                .from('sales')
                .select('*, architects(name, pix_key)');

            const { data: magazordData } = await supabase
                .from('magazord_commissions')
                .select('*, architects(name, pix_key)');

            let combined: CombinedCommission[] = [];

            if (salesData) {
                combined = [...combined, ...salesData.map((s: any) => ({
                    id: `SALE-${s.id}`,
                    originalId: s.id,
                    date: s.created_at,
                    reference: s.proposal_id ? s.proposal_id.slice(0, 8) : 'MANUAL',
                    architectId: s.architect_id,
                    architectName: s.architects?.name || 'Desconhecido',
                    pixKey: s.architects?.pix_key || null,
                    clientName: s.client_name || 'Venda Assistida',
                    type: 'PROPOSAL' as const,
                    saleValue: Number(s.sale_value),
                    commissionValue: Number(s.commission_value),
                    status: s.status as 'awaiting' | 'pending' | 'paid' | 'cancelled'
                }))];
            }

            if (magazordData) {
                combined = [...combined, ...magazordData.map((m: any) => ({
                    id: `MAGZ-${m.id}`,
                    originalId: m.id,
                    date: m.created_at,
                    reference: m.magazord_order_id || m.id,
                    architectId: m.architect_id,
                    architectName: m.architects?.name || 'Desconhecido',
                    pixKey: m.architects?.pix_key || null,
                    clientName: 'MagaZord (Online)',
                    type: 'MAGAZORD' as const,
                    saleValue: Number(m.order_value),
                    commissionValue: Number(m.commission_amount),
                    status: (m.status === 'PAID' ? 'paid' : m.status === 'CANCELED' ? 'cancelled' : m.status === 'AWAITING' ? 'awaiting' : 'pending') as 'awaiting' | 'pending' | 'paid' | 'cancelled'
                }))];
            }

            combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            setCommissions(combined);
        } catch (error) {
            console.error('Error fetching commissions:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCommissions(); }, []);

    // ─── Month filtering ───────────────────────────────────────────────
    const monthCommissions = useMemo(() =>
        commissions.filter(c => {
            const d = new Date(c.date);
            return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
        }), [commissions, selectedMonth, selectedYear]);

    // ─── Per-architect summary for selected month ──────────────────────
    const architectSummaries = useMemo((): ArchitectSummary[] => {
        const map = new Map<string, ArchitectSummary>();
        monthCommissions.forEach(c => {
            if (!map.has(c.architectId)) {
                map.set(c.architectId, {
                    architectId: c.architectId,
                    architectName: c.architectName,
                    pixKey: c.pixKey,
                    pendingCount: 0,
                    pendingTotal: 0,
                    commissions: []
                });
            }
            const entry = map.get(c.architectId)!;
            entry.commissions.push(c);
            if (c.status === 'pending') {
                entry.pendingCount++;
                entry.pendingTotal += c.commissionValue;
            }
        });
        return Array.from(map.values()).sort((a, b) => b.pendingTotal - a.pendingTotal);
    }, [monthCommissions]);

    const monthGrandTotal = useMemo(() =>
        architectSummaries.reduce((s, a) => s + a.pendingTotal, 0),
        [architectSummaries]);

    // ─── Payment day info ──────────────────────────────────────────────
    const paymentDay = 10;
    const today = new Date();
    const nextPayment = new Date(today.getFullYear(), today.getMonth(), paymentDay);
    if (nextPayment < today) nextPayment.setMonth(nextPayment.getMonth() + 1);
    const daysUntilPayment = Math.ceil((nextPayment.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const isPaymentDay = today.getDate() === paymentDay;

    const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

    // ─── Pay all pending for one architect ────────────────────────────
    const confirmPayment = async (summary: ArchitectSummary) => {
        if (summary.pendingTotal === 0) return;

        setActionLoading(summary.architectId);
        try {
            const pending = summary.commissions.filter(c => c.status === 'pending');

            // Update each commission
            for (const c of pending) {
                if (c.type === 'PROPOSAL') {
                    await (supabase.from('sales') as any).update({ status: 'paid' }).eq('id', c.originalId);
                } else {
                    await (supabase.from('magazord_commissions') as any).update({ status: 'PAID' }).eq('id', c.originalId);
                }
            }

            // Update architect total_earnings
            const { data: archData } = await supabase
                .from('architects').select('total_earnings').eq('id', summary.architectId).single();
            const newEarnings = (Number((archData as any)?.total_earnings) || 0) + summary.pendingTotal;
            await (supabase.from('architects') as any).update({ total_earnings: newEarnings }).eq('id', summary.architectId);

            await fetchCommissions();
        } catch (error) {
            console.error('Error paying architect:', error);
            alert('Erro ao processar pagamento.');
        } finally {
            setActionLoading(null);
            setSelectedArchitectForPayment(null);
        }
    };

    // ─── History: mark single as paid ─────────────────────────────────
    const handleMarkAsPaid = async (commission: CombinedCommission) => {
        if (!confirm(`Marcar comissão de R$ ${commission.commissionValue.toLocaleString('pt-BR')} para ${commission.architectName} como PAGA?`)) return;
        setActionLoading(commission.id);
        try {
            if (commission.type === 'PROPOSAL') {
                await (supabase.from('sales') as any).update({ status: 'paid' }).eq('id', commission.originalId);
            } else {
                await (supabase.from('magazord_commissions') as any).update({ status: 'PAID' }).eq('id', commission.originalId);
            }
            const { data: archData } = await supabase.from('architects').select('total_earnings').eq('id', commission.architectId).single();
            const newEarnings = (Number((archData as any)?.total_earnings) || 0) + commission.commissionValue;
            await (supabase.from('architects') as any).update({ total_earnings: newEarnings }).eq('id', commission.architectId);
            await fetchCommissions();
        } catch (error) {
            alert('Erro ao processar pagamento.');
        } finally {
            setActionLoading(null);
        }
    };

    const handleMarkAsCancelled = async (commission: CombinedCommission) => {
        if (!confirm(`Cancelar esta comissão de ${commission.architectName}?`)) return;
        setActionLoading(commission.id);
        try {
            if (commission.type === 'PROPOSAL') {
                await (supabase.from('sales') as any).update({ status: 'cancelled' }).eq('id', commission.originalId);
            } else {
                await (supabase.from('magazord_commissions') as any).update({ status: 'CANCELED' }).eq('id', commission.originalId);
            }
            await fetchCommissions();
        } catch (error) {
            alert('Erro ao cancelar.');
        } finally {
            setActionLoading(null);
        }
    };

    const filteredHistory = commissions.filter(c => {
        const matchesSearch = c.architectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.clientName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                    <DollarSign className="text-gold" /> Gestão de Repasses
                </h3>
                <button onClick={fetchCommissions} className="p-2 bg-white/5 hover:bg-white/10 rounded border border-white/10 text-zinc-400" title="Atualizar">
                    <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                </button>
            </div>

            {/* ── Tabs ── */}
            <div className="flex gap-1 bg-black/40 p-1 rounded-lg border border-white/5 w-fit">
                <button
                    onClick={() => setActiveTab('summary')}
                    className={`px-5 py-2 rounded text-[11px] font-bold uppercase tracking-widest transition-all flex items-center gap-2
                        ${activeTab === 'summary' ? 'bg-gold text-black' : 'text-zinc-400 hover:text-white'}`}
                >
                    <Users size={13} /> Repasses do Mês
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`px-5 py-2 rounded text-[11px] font-bold uppercase tracking-widest transition-all flex items-center gap-2
                        ${activeTab === 'history' ? 'bg-gold text-black' : 'text-zinc-400 hover:text-white'}`}
                >
                    <History size={13} /> Histórico
                </button>
            </div>

            {/* ══════════════════════════════════════════════
                TAB: SUMMARY
            ══════════════════════════════════════════════ */}
            {activeTab === 'summary' && (
                <div className="space-y-6">

                    {/* Payment Day Banner */}
                    <div className={`glass p-4 border rounded-xl flex items-center justify-between
                        ${isPaymentDay ? 'border-green-500/50 bg-green-500/5' : 'border-gold/30 bg-gold/5'}`}>
                        <div className="flex items-center gap-3">
                            <Calendar className={isPaymentDay ? 'text-green-400' : 'text-gold'} size={22} />
                            <div>
                                <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">
                                    {isPaymentDay ? '🎉 Hoje é dia de pagamento!' : 'Próximo pagamento'}
                                </p>
                                <p className={`text-lg font-bold ${isPaymentDay ? 'text-green-400' : 'text-white'}`}>
                                    Dia {paymentDay} de cada mês
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            {!isPaymentDay && (
                                <>
                                    <p className="text-2xl font-serif text-gold">{daysUntilPayment}</p>
                                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest">dias restantes</p>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Month Selector + Grand Total */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Month selector */}
                        <div className="glass p-5 rounded-xl border border-white/5">
                            <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold mb-3">Período</p>
                            <div className="flex gap-2">
                                <select
                                    value={selectedMonth}
                                    onChange={e => setSelectedMonth(Number(e.target.value))}
                                    className="flex-1 bg-black/50 border border-white/10 text-white rounded px-3 py-2 text-sm outline-none focus:border-gold"
                                >
                                    {monthNames.map((m, i) => (
                                        <option key={i} value={i}>{m}</option>
                                    ))}
                                </select>
                                <select
                                    value={selectedYear}
                                    onChange={e => setSelectedYear(Number(e.target.value))}
                                    className="w-28 bg-black/50 border border-white/10 text-white rounded px-3 py-2 text-sm outline-none focus:border-gold"
                                >
                                    {[2025, 2026, 2027].map(y => <option key={y}>{y}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Grand Total */}
                        <div className="glass p-5 rounded-xl border-l-2 border-gold relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5"><DollarSign size={60} /></div>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold mb-1">
                                Total a Pagar — {monthNames[selectedMonth]} {selectedYear}
                            </p>
                            <p className="text-3xl font-serif text-gold">
                                R$ {monthGrandTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </p>
                            <p className="text-[10px] text-zinc-500 mt-1">
                                {architectSummaries.filter(a => a.pendingTotal > 0).length} arquiteto(s) com saldo pendente
                            </p>
                        </div>
                    </div>

                    {/* Per-architect cards */}
                    {loading ? (
                        <div className="flex items-center justify-center py-16">
                            <Loader2 className="animate-spin text-gold mr-3" size={24} />
                            <span className="text-zinc-400 text-sm">Carregando...</span>
                        </div>
                    ) : architectSummaries.length === 0 ? (
                        <div className="glass p-12 rounded-xl text-center">
                            <TrendingUp className="mx-auto mb-3 text-zinc-600" size={32} />
                            <p className="text-zinc-400 text-sm">Nenhuma comissão em {monthNames[selectedMonth]} {selectedYear}</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {architectSummaries.map(summary => (
                                <div key={summary.architectId}
                                    className={`glass p-5 rounded-xl border transition-all
                                        ${summary.pendingTotal > 0 ? 'border-gold/20 bg-gold/3' : 'border-white/5 opacity-60'}`}
                                >
                                    <div className="flex items-center justify-between flex-wrap gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold text-sm">
                                                {summary.architectName.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-white font-bold">{summary.architectName}</p>
                                                <p className="text-[10px] text-zinc-500 mt-0.5">
                                                    {summary.commissions.length} venda(s) no mês
                                                    {summary.pendingCount > 0 && (
                                                        <span className="ml-2 text-gold">· {summary.pendingCount} pendente(s)</span>
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6">
                                            <div className="text-right">
                                                <p className="text-[10px] text-zinc-500 uppercase tracking-widest">A pagar</p>
                                                <p className={`text-xl font-serif ${summary.pendingTotal > 0 ? 'text-gold' : 'text-zinc-600'}`}>
                                                    R$ {summary.pendingTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                </p>
                                            </div>

                                            {summary.pendingTotal > 0 && (
                                                <button
                                                    onClick={() => setSelectedArchitectForPayment(summary)}
                                                    disabled={!!actionLoading}
                                                    className="px-5 py-2.5 bg-gold text-black font-bold text-[11px] uppercase tracking-widest rounded-lg hover:bg-gold/90 transition-all disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
                                                >
                                                    <CheckCircle2 size={13} />
                                                    Pagar R$ {summary.pendingTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                </button>
                                            )}

                                            {summary.pendingTotal === 0 && (
                                                <span className="px-4 py-2 bg-green-500/10 text-green-500 text-[10px] font-bold uppercase tracking-widest rounded-lg border border-green-500/20 flex items-center gap-1.5">
                                                    <CheckCircle2 size={11} /> Pago
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Mini breakdown */}
                                    {summary.commissions.filter(c => c.status === 'pending').length > 0 && (
                                        <div className="mt-4 pt-4 border-t border-white/5 space-y-1.5">
                                            {summary.commissions.filter(c => c.status === 'pending').map(c => (
                                                <div key={c.id} className="flex justify-between items-center text-xs">
                                                    <span className="text-zinc-500">
                                                        {new Date(c.date).toLocaleDateString('pt-BR')}
                                                        <span className="mx-2 text-zinc-700">·</span>
                                                        {c.clientName}
                                                        {c.type === 'MAGAZORD' && (
                                                            <span className="ml-2 text-[9px] bg-gold/20 text-gold px-1.5 py-0.5 rounded border border-gold/30">ONLINE</span>
                                                        )}
                                                    </span>
                                                    <span className="text-gold font-mono">
                                                        R$ {c.commissionValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* ══════════════════════════════════════════════
                TAB: HISTORY
            ══════════════════════════════════════════════ */}
            {activeTab === 'history' && (
                <div className="space-y-4">
                    {/* Filters */}
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center glass p-4">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                            <input
                                type="text"
                                placeholder="Buscar por arquiteto, cliente ou ref..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-lg pl-12 pr-4 py-3 text-sm text-white focus:border-gold outline-none"
                            />
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            {(['all', 'awaiting', 'pending', 'paid', 'cancelled'] as const).map(s => (
                                <button
                                    key={s}
                                    onClick={() => setStatusFilter(s as any)}
                                    className={`px-4 py-2 text-[10px] uppercase tracking-widest font-bold rounded flex-1 md:flex-none transition-colors border
                                        ${statusFilter === s
                                            ? s === 'all' ? 'bg-white text-black border-white'
                                                : s === 'pending' ? 'bg-gold/20 text-gold border-gold'
                                                    : s === 'awaiting' ? 'bg-zinc-500/20 text-zinc-400 border-zinc-500'
                                                        : s === 'paid' ? 'bg-green-500/20 text-green-500 border-green-500'
                                                            : 'bg-red-500/20 text-red-500 border-red-500'
                                            : 'border-white/10 text-zinc-400 hover:border-gold'}`}
                                >
                                    {s === 'all' ? 'Todos' : s === 'awaiting' ? 'Aguardando MagaZord' : s === 'pending' ? 'Pendentes' : s === 'paid' ? 'Pagos' : 'Cancelados'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Table */}
                    <div className="glass overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-black/40 border-b border-white/5 text-[9px] uppercase tracking-[0.3em] text-zinc-500 font-bold">
                                        <th className="px-6 py-4">Data</th>
                                        <th className="px-6 py-4">Arquiteto</th>
                                        <th className="px-6 py-4">Origem / Ref</th>
                                        <th className="px-6 py-4 text-right">Comissão (R$)</th>
                                        <th className="px-6 py-4 text-center">Status</th>
                                        <th className="px-6 py-4 text-center">Ação</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {loading ? (
                                        <tr><td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                                            <Loader2 className="animate-spin mx-auto mb-2 text-gold" size={24} />
                                            <p className="text-[10px] uppercase tracking-widest">Carregando...</p>
                                        </td></tr>
                                    ) : filteredHistory.length === 0 ? (
                                        <tr><td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                                            <AlertCircle className="mx-auto mb-2 opacity-50" size={24} />
                                            <p className="text-[10px] uppercase tracking-widest">Nenhuma comissão encontrada</p>
                                        </td></tr>
                                    ) : filteredHistory.map(c => (
                                        <tr key={c.id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4 text-xs text-zinc-400">
                                                {new Date(c.date).toLocaleDateString('pt-BR')}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-bold text-white">{c.architectName}</td>
                                            <td className="px-6 py-4">
                                                <p className="text-xs text-zinc-300">{c.clientName}</p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-[10px] font-mono text-zinc-600">{c.reference}</span>
                                                    {c.type === 'MAGAZORD' && (
                                                        <span className="text-[8px] bg-gold/20 text-gold px-1.5 py-0.5 rounded border border-gold/30">ONLINE</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <p className="text-sm font-bold text-gold">R$ {c.commissionValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                                <p className="text-[9px] text-zinc-500">Venda: R$ {c.saleValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded border inline-flex items-center gap-1
                                                    ${c.status === 'paid' ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                                        : c.status === 'cancelled' ? 'bg-red-500/10 text-red-500 border-red-500/20'
                                                            : c.status === 'awaiting' ? 'bg-zinc-500/10 text-zinc-400 border-zinc-500/30'
                                                                : 'bg-gold/10 text-gold border-gold/20'}`}>
                                                    {c.status === 'paid' ? 'Pago' : c.status === 'awaiting' ? 'Aguardando MagaZord' : c.status === 'pending' ? 'Pendente' : 'Cancelado'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {c.status === 'pending' && (
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={() => handleMarkAsPaid(c)}
                                                            disabled={!!actionLoading}
                                                            className="px-3 py-1.5 bg-green-500/10 hover:bg-green-500/20 text-green-500 border border-green-500/20 rounded text-[9px] font-bold uppercase tracking-widest transition-all disabled:opacity-50"
                                                        >
                                                            {actionLoading === c.id ? <Loader2 size={12} className="animate-spin inline mr-1" /> : <CheckCircle2 size={12} className="inline mr-1" />}
                                                            Pagar
                                                        </button>
                                                        <button
                                                            onClick={() => handleMarkAsCancelled(c)}
                                                            disabled={!!actionLoading}
                                                            className="px-3 py-1.5 hover:bg-red-500/10 text-zinc-500 hover:text-red-500 rounded text-[9px] font-bold uppercase tracking-widest transition-all disabled:opacity-50"
                                                        >
                                                            Cancelar
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Payment Modal */}
            {selectedArchitectForPayment && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
                    <div className="bg-zinc-950 w-full max-w-lg rounded-2xl border border-gold/30 shadow-[0_0_50px_rgba(197,160,89,0.1)] relative flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-white/5 flex items-start justify-between bg-zinc-900/50 rounded-t-2xl">
                            <div>
                                <h2 className="text-xl font-bold text-white font-serif">Confirmar Pagamento</h2>
                                <p className="text-sm text-zinc-400 mt-1">Detalhes do repasse para o arquiteto</p>
                            </div>
                            <button
                                onClick={() => setSelectedArchitectForPayment(null)}
                                className="p-2 hover:bg-white/5 rounded-full text-zinc-500 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
                            <div className="bg-white/5 p-4 rounded-lg border border-white/5">
                                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-[0.2em] mb-1">Arquiteto(a)</p>
                                <p className="text-white text-lg font-bold">{selectedArchitectForPayment.architectName}</p>
                            </div>

                            <div className="bg-gold/10 p-4 rounded-lg border border-gold/20">
                                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-[0.2em] mb-1">Total a Transferir</p>
                                <p className="text-gold text-3xl font-serif">R$ {selectedArchitectForPayment.pendingTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                <p className="text-xs text-zinc-400 mt-1">Referente a {selectedArchitectForPayment.pendingCount} comissões pendentes.</p>
                            </div>

                            <div className="bg-white/5 p-4 rounded-lg border border-white/5">
                                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-[0.2em] mb-1">Chave PIX do Arquiteto</p>
                                <p className="text-white text-lg font-mono">{selectedArchitectForPayment.pixKey || 'Não informada'}</p>
                            </div>

                            {/* Detalhamento (opcional, mostra os itens que estão sendo pagos) */}
                            <div className="mt-4">
                                <p className="text-xs uppercase tracking-[0.2em] font-bold text-zinc-500 mb-2">Comissões (Este Mês)</p>
                                <div className="space-y-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                                    {selectedArchitectForPayment.commissions.filter(c => c.status === 'pending').map(c => (
                                        <div key={c.id} className="flex justify-between items-center text-xs bg-black/40 p-2 rounded border border-white/5">
                                            <span className="text-zinc-400 truncate w-3/4">{c.clientName}</span>
                                            <span className="text-zinc-300 font-mono">R$ {c.commissionValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-white/5 bg-zinc-900/50 rounded-b-2xl flex gap-3">
                            <button
                                onClick={() => setSelectedArchitectForPayment(null)}
                                className="flex-1 px-4 py-3 rounded-lg border border-white/10 text-zinc-400 hover:bg-white/5 transition-colors text-sm font-bold uppercase tracking-widest"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => confirmPayment(selectedArchitectForPayment)}
                                disabled={!!actionLoading}
                                className="flex-1 px-4 py-3 rounded-lg bg-gold text-black hover:bg-gold/90 transition-all font-bold text-sm uppercase tracking-widest flex justify-center items-center"
                            >
                                {actionLoading === selectedArchitectForPayment.architectId
                                    ? <Loader2 className="animate-spin" size={18} />
                                    : 'Confirmar Pagamento'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
