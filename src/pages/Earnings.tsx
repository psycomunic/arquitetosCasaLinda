import React, { useEffect, useState } from 'react';
import { CheckCircle2, Heart } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Sale } from '../types/database';

export const Earnings: React.FC = () => {
    const [sales, setSales] = useState<Sale[]>([]);
    const [loading, setLoading] = useState(true);
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

            const { data, error } = await supabase
                .from('sales')
                .select('*')
                .eq('architect_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (data) {
                setSales(data);
                const total = data.reduce((acc: number, curr: Sale) => acc + (curr.status === 'paid' ? Number(curr.commission_value) : 0), 0);
                const pending = data.reduce((acc: number, curr: Sale) => acc + (curr.status === 'pending' ? Number(curr.commission_value) : 0), 0);
                // Assuming paid commissions are available for withdrawal unless marked otherwise
                setStats({
                    totalEarnings: total,
                    pendingEarnings: pending,
                    availableForWithdrawal: total
                });
            }
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
                                        {sale.proposal_id ? sale.proposal_id.slice(0, 8) : 'MANUAL'}
                                    </td>
                                    <td className="px-12 py-8 text-xs text-zinc-400">{new Date(sale.created_at).toLocaleDateString('pt-BR')}</td>
                                    <td className="px-12 py-8 text-sm font-medium text-white">{sale.client_name}</td>
                                    <td className="px-12 py-8 text-sm text-zinc-400">R$ {Number(sale.sale_value).toLocaleString('pt-BR')}</td>
                                    <td className="px-12 py-8 text-sm font-bold text-gold">R$ {Number(sale.commission_value).toLocaleString('pt-BR')}</td>
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
                                { range: "A partir de R$ 40.000", percent: "20%", highlight: true }
                            ].map((row, i) => (
                                <div
                                    key={i}
                                    className={`flex justify-between items-center p-4 rounded border border-white/5 transition-all hover:bg-white/5 ${row.highlight ? 'bg-gold/10 border-gold/30' : 'bg-zinc-900/50'}`}
                                >
                                    <span className={`text-xs uppercase tracking-wider font-bold ${row.highlight ? 'text-white' : 'text-zinc-400'}`}>
                                        {row.range}
                                    </span>
                                    <span className={`text-xl font-bold font-serif ${row.highlight ? 'text-gold' : 'text-zinc-200'}`}>
                                        {row.percent}
                                    </span>
                                </div>
                            ))}
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
