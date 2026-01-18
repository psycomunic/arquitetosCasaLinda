import React from 'react';
import { MOCK_SALES } from '../constants';

export const Earnings: React.FC = () => {
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
                    <p className="text-6xl font-serif text-gold">R$ 5.480,00</p>
                    <button className="px-12 py-5 bg-white text-black text-[9px] font-bold uppercase tracking-[0.4em] hover:bg-gold transition-all">
                        Transferir Valores
                    </button>
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
                        {MOCK_SALES.map((sale) => (
                            <tr key={sale.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-12 py-8 text-[11px] font-mono text-zinc-600">{sale.id}</td>
                                <td className="px-12 py-8 text-xs text-zinc-400">{new Date(sale.date).toLocaleDateString('pt-BR')}</td>
                                <td className="px-12 py-8 text-sm font-medium text-white">{sale.clientName}</td>
                                <td className="px-12 py-8 text-sm text-zinc-400">R$ {sale.value.toLocaleString('pt-BR')}</td>
                                <td className="px-12 py-8 text-sm font-bold text-gold">R$ {sale.commission.toLocaleString('pt-BR')}</td>
                                <td className="px-12 py-8">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${sale.status === 'Concluído' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-gold shadow-[0_0_10px_rgba(197,160,89,0.5)]'}`} />
                                        <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">{sale.status}</span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
