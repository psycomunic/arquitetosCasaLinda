import React, { useEffect, useState, useMemo } from 'react';
import { CheckCircle2, Heart, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Sale, MagazordCommission } from '../types/database';


interface CombinedSale {
    id: string;
    date: string;
    reference: string;
    clientName: string;
    type: 'PROPOSAL' | 'MAGAZORD';
    saleValue: number;
    commissionValue: number;
    status: 'pending' | 'paid' | 'cancelled';
}

export const Earnings: React.FC = () => {
    const [sales, setSales] = useState<CombinedSale[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentRate, setCurrentRate] = useState(15);
    const [stats, setStats] = useState({
        totalEarnings: 0,
        pendingEarnings: 0,
        availableForWithdrawal: 0
    });

    useEffect(() => {
        fetchSales();
    }, []);

    const fetchSales = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: salesData, error: salesError } = await supabase
                .from('sales')
                .select('*')
                .eq('architect_id', user.id);

            const { data: magazordData, error: magazordError } = await supabase
                .from('magazord_commissions')
                .select('*')
                .eq('architect_id', user.id);

            // Fetch current rate
            const { data: architectData } = await supabase
                .from('architects')
                .select('commission_rate')
                .eq('id', user.id)
                .single();

            if (architectData) {
                setCurrentRate(Number((architectData as any).commission_rate));
            }

            if (salesError) throw salesError;
            if (magazordError) throw magazordError;

            let combined: CombinedSale[] = [];

            if (salesData) {
                combined = [...combined, ...salesData.map((s: Sale) => ({
                    id: s.id,
                    date: s.created_at,
                    reference: s.proposal_id ? s.proposal_id.slice(0, 8) : 'MANUAL',
                    clientName: (s as any).client_name || 'Venda Assistida',
                    type: 'PROPOSAL' as const,
                    saleValue: Number(s.sale_value),
                    commissionValue: Number(s.commission_value),
                    status: s.status as 'pending' | 'paid' | 'cancelled'
                }))];
            }

            if (magazordData) {
                combined = [...combined, ...magazordData.map((m: MagazordCommission) => ({
                    id: m.id,
                    date: m.created_at,
                    reference: `ORD-${m.magazord_order_id}`,
                    clientName: 'E-commerce (MagaZord)',
                    type: 'MAGAZORD' as const,
                    saleValue: Number(m.order_value),
                    commissionValue: Number(m.commission_amount),
                    status: (m.status === 'PAID' ? 'paid' : m.status === 'CANCELED' ? 'cancelled' : 'pending') as 'pending' | 'paid' | 'cancelled'
                }))];
            }

            combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

            setSales(combined);
            const total = combined.reduce((acc, curr) => acc + (curr.status === 'paid' ? curr.commissionValue : 0), 0);
            const pending = combined.reduce((acc, curr) => acc + (curr.status === 'pending' ? curr.commissionValue : 0), 0);

            // Assuming paid commissions are available for withdrawal unless marked otherwise
            setStats({
                totalEarnings: total,
                pendingEarnings: pending,
                availableForWithdrawal: total
            });
        } catch (error) {
            console.error('Error fetching sales:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-white p-10">Carregando extrato...</div>;
    }

    return (
        <div className="animate-fade-in no-print space-y-12">
            <header className="mb-12">
                <h2 className="text-7xl font-serif text-white">Gestão de Repasses</h2>
            </header>

            <div className="glass p-16 flex flex-col md:flex-row justify-between items-center gap-10 bg-gradient-to-br from-white/5 to-transparent">
                <div className="space-y-4">
                    <h3 className="text-5xl font-serif text-white">Sua Performance</h3>
                    <p className="text-zinc-500 text-sm font-light uppercase tracking-widest">Extrato consolidado de indicações técnicas.</p>
                </div>
                <div className="text-center md:text-right space-y-6">
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.6em]">Saldo para Resgate</p>
                    <p className="text-6xl font-serif text-gold">R$ {stats.availableForWithdrawal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    {/* Button Removed */}
                    {stats.pendingEarnings > 0 && (
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest">
                            Em processamento: R$ {stats.pendingEarnings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                    )}
                </div>
            </div>

            {/* Payment Day Banner */}
            {(() => {
                const today = new Date();
                const paymentDay = 10;
                const nextPayment = new Date(today.getFullYear(), today.getMonth(), paymentDay);
                if (nextPayment <= today && today.getDate() !== paymentDay) nextPayment.setMonth(nextPayment.getMonth() + 1);
                const daysLeft = Math.ceil((nextPayment.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                const isToday = today.getDate() === paymentDay;
                const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
                const now = new Date();
                const monthPending = sales
                    .filter(s => {
                        const d = new Date(s.date);
                        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() && s.status === 'pending';
                    })
                    .reduce((sum, s) => sum + s.commissionValue, 0);
                return (
                    <div className={`glass p-6 flex flex-col md:flex-row justify-between items-center gap-6 border rounded-xl ${isToday ? 'border-green-500/40 bg-green-500/5' : 'border-gold/20 bg-gold/3'}`}>
                        <div className="flex items-center gap-4">
                            <Calendar className={isToday ? 'text-green-400' : 'text-gold'} size={28} />
                            <div>
                                <p className="text-[10px] uppercase tracking-[0.25em] text-zinc-500 font-bold">Próximo Pagamento</p>
                                <p className={`text-lg font-bold ${isToday ? 'text-green-400' : 'text-white'}`}>
                                    {isToday ? '🎉 Hoje é seu dia de pagamento!' : `Dia ${paymentDay} de ${monthNames[nextPayment.getMonth()]} — faltam ${daysLeft} dia(s)`}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] uppercase tracking-[0.25em] text-zinc-500 font-bold">A receber no Dia {paymentDay}</p>
                            <p className={`text-3xl font-serif ${monthPending > 0 ? 'text-gold' : 'text-zinc-500'}`}>
                                R$ {monthPending.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </p>
                            {monthPending === 0 && (
                                <p className="text-[10px] text-green-500 flex items-center justify-end gap-1 mt-1">
                                    <CheckCircle2 size={10} /> Pago este mês
                                </p>
                            )}
                        </div>
                    </div>
                );
            })()}

            <div className="glass overflow-hidden border border-white/5">
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-[9px] uppercase tracking-[0.5em] text-zinc-500 bg-black/40 border-b border-white/5">
                            <th className="px-12 py-7 font-bold">Ref. Projeto</th>
                            <th className="px-12 py-7 font-bold">Data</th>
                            <th className="px-12 py-7 font-bold">Cliente / Escritório</th>
                            <th className="px-12 py-7 font-bold">Valor Total</th>
                            <th className="px-12 py-7 font-bold">Repasse Arquiteto</th>
                            <th className="px-12 py-7 font-bold">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {sales.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-12 py-12 text-center text-zinc-500 uppercase tracking-widest text-xs">
                                    Nenhum repasse registrado.
                                </td>
                            </tr>
                        ) : (
                            sales.map((sale) => (
                                <tr key={sale.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-12 py-8 text-[11px] font-mono text-zinc-600">
                                        {sale.reference}
                                        {sale.type === 'MAGAZORD' && <span className="ml-2 text-[8px] bg-gold/20 text-gold px-1.5 py-0.5 rounded border border-gold/30">ONLINE</span>}
                                    </td>
                                    <td className="px-12 py-8 text-xs text-zinc-400">{new Date(sale.date).toLocaleDateString('pt-BR')}</td>
                                    <td className="px-12 py-8 text-sm font-medium text-white">{sale.clientName}</td>
                                    <td className="px-12 py-8 text-sm text-zinc-400">R$ {sale.saleValue.toLocaleString('pt-BR')}</td>
                                    <td className="px-12 py-8 text-sm font-bold text-gold">R$ {sale.commissionValue.toLocaleString('pt-BR')}</td>
                                    <td className="px-12 py-8">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${sale.status === 'paid' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : sale.status === 'cancelled' ? 'bg-red-500' : 'bg-gold shadow-[0_0_10px_rgba(197,160,89,0.5)]'}`} />
                                            <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">
                                                {sale.status === 'paid' ? 'Disponível' : sale.status === 'pending' ? 'Em Processamento' : 'Cancelado'}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Partner Program Details Section */}
            <div className="pt-12 border-t border-white/5 space-y-12">
                <div className="max-w-3xl">
                    <h3 className="text-3xl font-serif text-white mb-6">Programa de Arquitetos</h3>
                    <p className="text-zinc-400 font-light leading-relaxed">
                        Esta tabela foi desenhada para refletir a realidade dos projetos arquitetônicos, permitindo evolução rápida, metas acessíveis e estímulo contínuo à parceria.
                    </p>
                </div>

                <div className="grid lg:grid-cols-12 gap-12">
                    {/* Tabela de Progressão */}
                    <div className="lg:col-span-7 glass p-10">
                        <h4 className="text-xl font-serif text-white mb-8 pl-4 border-l-4 border-gold uppercase tracking-widest">
                            Tabela de Progressão Mensal
                        </h4>

                        <div className="space-y-1">
                            {[
                                { range: "Até R$ 5.999", percent: "15%" },
                                { range: "De R$ 6.000 a R$ 11.999", percent: "16%" },
                                { range: "De R$ 12.000 a R$ 19.999", percent: "17%" },
                                { range: "De R$ 20.000 a R$ 29.999", percent: "18%" },
                                { range: "De R$ 30.000 a R$ 39.999", percent: "19%" },
                                { range: "A partir de R$ 40.000", percent: "20%" }
                            ].map((row, i) => {
                                const isCurrent = row.percent.includes(String(currentRate));
                                return (
                                    <div
                                        key={i}
                                        className={`flex justify-between items-center p-4 rounded border border-white/5 transition-all hover:bg-white/5 ${isCurrent ? 'bg-gold/10 border-gold/30' : 'bg-zinc-900/50'}`}
                                    >
                                        <span className={`text-xs uppercase tracking-wider font-bold ${isCurrent ? 'text-white' : 'text-zinc-400'}`}>
                                            {row.range}
                                        </span>
                                        <span className={`text-xl font-bold font-serif ${isCurrent ? 'text-gold' : 'text-zinc-200'}`}>
                                            {row.percent}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Regras e Compromisso */}
                    <div className="lg:col-span-5 space-y-8">
                        <div className="glass p-10 h-full">
                            <h4 className="text-lg font-bold text-white uppercase tracking-widest mb-6 pl-4 border-l-4 border-gold">
                                Regras Importantes
                            </h4>
                            <ul className="space-y-4 mb-8">
                                {[
                                    "Comissão sobre vendas confirmadas no mês.",
                                    "Progressão automática e reavaliada mensalmente.",
                                    "Sem penalidades se o volume diminuir.",
                                    "Sem metas mínimas obrigatórias.",
                                    "Condições especiais para projetos VIP."
                                ].map((rule, i) => (
                                    <li key={i} className="flex gap-3 text-sm text-zinc-400 font-light leading-relaxed">
                                        <CheckCircle2 size={16} className="text-gold shrink-0 mt-0.5" />
                                        {rule}
                                    </li>
                                ))}
                            </ul>

                            <div className="bg-gradient-to-br from-gold/20 to-gold/5 p-6 rounded-xl border border-gold/20 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Heart size={60} strokeWidth={1} />
                                </div>
                                <h4 className="text-gold text-[10px] font-bold uppercase tracking-widest mb-2">Compromisso Casa Linda</h4>
                                <p className="text-zinc-300 text-xs leading-relaxed font-light">
                                    Estrutura criada para incentivar crescimento constante e recompensar a recorrência de forma justa.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
