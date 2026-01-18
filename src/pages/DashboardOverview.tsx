import React from 'react';
import { DollarSign, TrendingUp, Award, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MOCK_SALES } from '../constants';

export const DashboardOverview: React.FC = () => {
    const navigate = useNavigate();
    const totalEarnings = 28450.00;
    const commissionRate = 20;

    return (
        <div className="space-y-10 animate-fade-in no-print">
            <header className="mb-12">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-2 h-2 rounded-full bg-gold shadow-[0_0_15px_rgba(197,160,89,0.8)]" />
                    <p className="text-gold text-[10px] font-bold uppercase tracking-[0.5em]">Sistema Private Ativo</p>
                </div>
                <h2 className="text-7xl font-serif text-white">Bem-vinda, Isabella</h2>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="glass p-10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 text-white/5 group-hover:text-gold/10 transition-colors">
                        <DollarSign size={100} strokeWidth={1} />
                    </div>
                    <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-zinc-500 mb-6">Total Faturado</p>
                    <h3 className="text-4xl font-serif text-white">R$ {totalEarnings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
                    <div className="mt-4 flex items-center gap-2 text-[10px] text-green-500 font-bold uppercase tracking-widest">
                        <TrendingUp size={12} /> +22% Performance
                    </div>
                </div>

                <div className="glass p-10 border-l-2 border-gold relative">
                    <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-zinc-500 mb-6">Taxa de Parceria</p>
                    <div className="flex items-baseline gap-3">
                        <h3 className="text-5xl font-serif text-gold">{commissionRate}%</h3>
                        <span className="text-[9px] text-white/40 font-bold uppercase tracking-widest">Plano Platinum</span>
                    </div>
                    <p className="mt-4 text-[10px] text-zinc-400 font-medium uppercase tracking-[0.2em] leading-relaxed">
                        Sua graduação permite repasses exclusivos acima da média.
                    </p>
                </div>

                <div className="bg-ebonite glass p-10 shadow-2xl relative overflow-hidden border border-white/5">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <Award size={100} strokeWidth={1} className="text-white" />
                    </div>
                    <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-zinc-600 mb-6">Status do Escritório</p>
                    <h3 className="text-4xl font-serif text-white uppercase tracking-wider">Top Tier</h3>
                    <p className="mt-4 text-[10px] text-gold font-bold uppercase tracking-widest">
                        Benefícios VIP Ativos
                    </p>
                </div>
            </div>

            <div className="glass overflow-hidden">
                <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
                    <h3 className="font-serif text-2xl text-white">Vendas Recentes</h3>
                    <button
                        onClick={() => navigate('/earnings')}
                        className="text-[9px] text-gold hover:text-white font-bold uppercase tracking-[0.3em] transition-all flex items-center gap-2"
                    >
                        Relatório de Repasses <ArrowRight size={14} />
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[9px] uppercase tracking-[0.4em] text-zinc-500 bg-black/40">
                                <th className="px-10 py-5 font-bold">Data</th>
                                <th className="px-10 py-5 font-bold">Projeto/Cliente</th>
                                <th className="px-10 py-5 font-bold">Investimento</th>
                                <th className="px-10 py-5 font-bold">Repasse (20%)</th>
                                <th className="px-10 py-5 font-bold">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {MOCK_SALES.slice(0, 4).map((sale) => (
                                <tr key={sale.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-10 py-7 text-[11px] text-zinc-500">{new Date(sale.date).toLocaleDateString('pt-BR')}</td>
                                    <td className="px-10 py-7 text-sm font-medium text-white">{sale.clientName}</td>
                                    <td className="px-10 py-7 text-sm text-zinc-400">R$ {sale.value.toLocaleString('pt-BR')}</td>
                                    <td className="px-10 py-7 text-sm font-bold text-gold">R$ {sale.commission.toLocaleString('pt-BR')}</td>
                                    <td className="px-10 py-7">
                                        <span className="text-[9px] px-3 py-1 glass rounded-full font-bold uppercase tracking-widest text-zinc-400">
                                            {sale.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

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
