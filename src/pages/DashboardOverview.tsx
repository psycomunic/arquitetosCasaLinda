import React, { useEffect, useState } from 'react';
import { DollarSign, Award, ArrowRight, Inbox } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ArchitectProfile } from '../types';
import { Ranking } from '../components/Ranking';

export const DashboardOverview: React.FC = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<ArchitectProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase
                    .from('architects')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (data) {
                    setProfile({
                        name: data.name,
                        officeName: data.office_name,
                        commissionRate: Number(data.commission_rate),
                        totalEarnings: Number(data.total_earnings),
                        logoUrl: data.logo_url
                    });
                }
            }
            setLoading(false);
        };
        fetchProfile();
    }, []);

    if (loading) {
        return <div className="text-white">Carregando...</div>;
    }

    const firstName = profile?.name.split(' ')[0] || 'Parceiro';

    return (
        <div className="space-y-10 animate-fade-in no-print">
            <header className="mb-12">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-2 h-2 rounded-full bg-gold shadow-[0_0_15px_rgba(197,160,89,0.8)]" />
                    <p className="text-gold text-[10px] font-bold uppercase tracking-[0.5em]">Sistema Private Ativo</p>
                </div>
                <h2 className="text-7xl font-serif text-white">Bem-vindo(a), {firstName}</h2>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="glass p-10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 text-white/5 group-hover:text-gold/10 transition-colors">
                        <DollarSign size={100} strokeWidth={1} />
                    </div>
                    <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-zinc-500 mb-6">Total Faturado</p>
                    <h3 className="text-4xl font-serif text-white">
                        R$ {profile?.totalEarnings?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
                    </h3>
                </div>

                <div className="glass p-10 border-l-2 border-gold relative">
                    <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-zinc-500 mb-6">Taxa de Parceria</p>
                    <div className="flex items-baseline gap-3">
                        <h3 className="text-5xl font-serif text-gold">{profile?.commissionRate || 10}%</h3>
                    </div>
                    <p className="mt-4 text-[10px] text-zinc-400 font-medium uppercase tracking-[0.2em] leading-relaxed">
                        Sua graduação atual.
                    </p>
                </div>

                <div className="bg-ebonite glass p-10 shadow-2xl relative overflow-hidden border border-white/5">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <Award size={100} strokeWidth={1} className="text-white" />
                    </div>
                    <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-zinc-600 mb-6">Status do Escritório</p>
                    <h3 className="text-4xl font-serif text-white uppercase tracking-wider">Standard</h3>
                    <p className="mt-4 text-[10px] text-gold font-bold uppercase tracking-widest">
                        Em desenvolvimento
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Ranking Section */}
                <Ranking />

                {/* Vendas Recentes / Placeholder */}
                <div className="glass overflow-hidden min-h-[300px] flex flex-col">
                    <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
                        <h3 className="font-serif text-2xl text-white">Vendas Recentes</h3>
                        <button
                            onClick={() => navigate('/earnings')}
                            className="text-[9px] text-gold hover:text-white font-bold uppercase tracking-[0.3em] transition-all flex items-center gap-2"
                        >
                            Relatório Completo <ArrowRight size={14} />
                        </button>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-zinc-600">
                        <Inbox size={48} strokeWidth={1} className="mb-4 opacity-20" />
                        <p className="text-[10px] uppercase tracking-[0.3em]">Nenhuma venda registrada ainda</p>
                    </div>
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
