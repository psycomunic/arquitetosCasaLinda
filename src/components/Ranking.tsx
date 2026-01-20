import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Trophy, Medal, Crown } from 'lucide-react';

interface RankingItem {
    architect_id: string;
    name: string;
    total_sales: number;
    sales_count: number;
    office_name: string;
}

export const Ranking: React.FC = () => {
    const [ranking, setRanking] = useState<RankingItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRanking();
    }, []);

    const fetchRanking = async () => {
        try {
            // First get all sales
            const { data: sales, error } = await supabase
                .from('sales')
                .select('architect_id, sale_value, architects(name, office_name)')
                .eq('status', 'paid');

            if (error) throw error;

            // Group by architect
            const grouped: Record<string, RankingItem> = {};

            sales?.forEach((sale: any) => {
                const id = sale.architect_id;
                if (!grouped[id]) {
                    grouped[id] = {
                        architect_id: id,
                        name: sale.architects?.name || 'Desconhecido',
                        office_name: sale.architects?.office_name || '',
                        total_sales: 0,
                        sales_count: 0
                    };
                }
                grouped[id].total_sales += Number(sale.sale_value);
                grouped[id].sales_count += 1;
            });

            // Sort by total sales desc
            const sorted = Object.values(grouped).sort((a, b) => b.total_sales - a.total_sales);
            setRanking(sorted.slice(0, 50)); // Top 50

        } catch (error) {
            console.error("Error fetching ranking", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-10 text-center text-xs text-zinc-500 uppercase tracking-widest">Carregando Ranking...</div>;

    if (ranking.length === 0) return (
        <div className="glass p-8 text-center">
            <Trophy className="mx-auto text-zinc-700 mb-4" size={32} strokeWidth={1} />
            <p className="text-zinc-500 text-xs uppercase tracking-widest">Ranking em formação...</p>
        </div>
    )

    return (
        <div className="glass overflow-hidden">
            <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Trophy className="text-gold" size={18} />
                    <h3 className="text-white font-serif text-xl">Ranking de Performance</h3>
                </div>
                <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">Top 50</span>
            </div>

            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                <table className="w-full text-left">
                    <thead className="sticky top-0 bg-zinc-900/90 backdrop-blur z-10">
                        <tr className="text-[8px] uppercase tracking-[0.3em] text-zinc-500 border-b border-white/5">
                            <th className="px-6 py-4 font-bold w-16">Pos.</th>
                            <th className="px-6 py-4 font-bold">Arquiteto</th>
                            <th className="px-6 py-4 font-bold text-right">Volume de Vendas</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {ranking.map((item, index) => {
                            let Icon = null;
                            if (index === 0) Icon = <Crown size={14} className="text-gold fill-gold/20" />;
                            else if (index === 1) Icon = <Medal size={14} className="text-zinc-300" />;
                            else if (index === 2) Icon = <Medal size={14} className="text-amber-700" />;

                            return (
                                <tr key={item.architect_id} className={`hover:bg-white/5 transition-colors ${index < 3 ? 'bg-white/[0.02]' : ''}`}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-xs font-bold font-mono ${index < 3 ? 'text-white' : 'text-zinc-600'}`}>
                                                #{String(index + 1).padStart(2, '0')}
                                            </span>
                                            {Icon}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className={`text-xs font-bold ${index === 0 ? 'text-gold' : 'text-white'}`}>{item.name}</p>
                                            {item.office_name && <p className="text-[9px] text-zinc-500 uppercase tracking-wider">{item.office_name}</p>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <p className="text-xs font-bold text-zinc-300">R$ {item.total_sales.toLocaleString('pt-BR')}</p>
                                        <p className="text-[8px] text-zinc-600 uppercase tracking-wider">{item.sales_count} vendas</p>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
            `}</style>
        </div>
    );
};
