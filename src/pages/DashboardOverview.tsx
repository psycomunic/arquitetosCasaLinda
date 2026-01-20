import React, { useEffect, useState, useRef } from 'react';
import { DollarSign, Award, ArrowRight, Inbox, Share2, UploadCloud, Crown, Copy, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ArchitectProfile } from '../types';
import { Architect } from '../types/database';
import { Ranking } from '../components/Ranking';
import { AssistanceModal } from '../components/AssistanceModal';
import { CustomProjectModal } from '../components/CustomProjectModal';

export const DashboardOverview: React.FC = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<ArchitectProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [assistanceModalOpen, setAssistanceModalOpen] = useState(false);
    const [customProjectModalOpen, setCustomProjectModalOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase
                    .from('architects')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                const architect = data as unknown as Architect;

                if (architect) {
                    setProfile({
                        name: architect.name,
                        officeName: architect.office_name,
                        commissionRate: Number(architect.commission_rate),
                        totalEarnings: Number(architect.total_earnings),
                        logoUrl: architect.logo_url
                    });
                }
            }
            setLoading(false);
        };
        fetchProfile();
    }, []);

    const copyLink = () => {
        const link = `https://casalinda.com.br/invite/${profile?.officeName?.replace(/\s+/g, '-').toLowerCase()}`;
        navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) {
        return <div className="text-white">Carregando...</div>;
    }

    const firstName = profile?.name.split(' ')[0] || 'Parceiro';

    return (
        <div className="space-y-10 animate-fade-in no-print pb-20">
            <header className="mb-12">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-2 h-2 rounded-full bg-gold shadow-[0_0_15px_rgba(197,160,89,0.8)]" />
                    <p className="text-gold text-[10px] font-bold uppercase tracking-[0.5em]">Sistema Private Ativo</p>
                </div>
                <h2 className="text-7xl font-serif text-white">Bem-vindo(a), {firstName}</h2>
            </header>

            {/* MECHANICS SELECTION - NEW SECTION */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* MECÂNICA 1: ESCALA */}
                <div className="bg-canvas border border-white/5 p-8 group hover:border-gold/50 transition-all duration-500 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 bg-zinc-900 rounded-bl-2xl text-[9px] font-bold uppercase tracking-widest text-zinc-500 group-hover:text-gold transition-colors">
                        Mecânica 01
                    </div>
                    <div className="mb-6 w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center text-zinc-500 group-hover:text-gold group-hover:scale-110 transition-all">
                        <Share2 size={20} />
                    </div>
                    <h3 className="text-2xl font-serif text-white mb-2">Indicação Direta</h3>
                    <p className="text-xs text-zinc-500 uppercase tracking-widest mb-6 font-bold">Ganhe na Escala</p>
                    <p className="text-zinc-400 text-sm mb-8 min-h-[60px]">
                        Ideal para projetos simples e alto volume. O cliente compra sozinho pelo seu link.
                    </p>

                    <div className="p-4 bg-black/50 rounded-xl border border-white/5 flex items-center justify-between group-hover:border-gold/30 transition-colors">
                        <span className="text-xs text-zinc-500 font-mono">casalinda.com/{firstName.toLowerCase()}</span>
                        <button onClick={copyLink} className="text-gold hover:text-white transition-colors">
                            {copied ? <Check size={16} /> : <Copy size={16} />}
                        </button>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                        <div className="h-1 flex-1 bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full w-full bg-zinc-700"></div>
                        </div>
                        <span className="text-[9px] uppercase tracking-widest text-zinc-500">Comissão Padrão</span>
                    </div>
                </div>

                {/* MECÂNICA 2: VALOR */}
                <div className="bg-canvas border border-white/5 p-8 group hover:border-gold/50 transition-all duration-500 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 bg-zinc-900 rounded-bl-2xl text-[9px] font-bold uppercase tracking-widest text-zinc-500 group-hover:text-gold transition-colors">
                        Mecânica 02
                    </div>
                    <div className="mb-6 w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center text-zinc-500 group-hover:text-gold group-hover:scale-110 transition-all">
                        <UploadCloud size={20} />
                    </div>
                    <h3 className="text-2xl font-serif text-white mb-2">Venda Assistida</h3>
                    <p className="text-xs text-zinc-500 uppercase tracking-widest mb-6 font-bold">Valor & Suporte</p>
                    <p className="text-zinc-400 text-sm mb-8 min-h-[60px]">
                        Envie o projeto e nosso time cuida da especificação e orçamento.
                    </p>

                    <button
                        onClick={() => setAssistanceModalOpen(true)}
                        className="w-full py-4 bg-zinc-900 text-white text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-gold hover:text-black transition-all"
                    >
                        Solicitar Assistência
                    </button>
                    <div className="mt-4 flex items-center gap-2">
                        <div className="h-1 flex-1 bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full w-[80%] bg-gold"></div>
                        </div>
                        <span className="text-[9px] uppercase tracking-widest text-gold font-bold">+1% Bônus</span>
                    </div>
                </div>

                {/* MECÂNICA 3: PROJETOS ESPECIAIS */}
                <div className="bg-gradient-to-b from-zinc-900 to-black border border-gold/20 p-8 group hover:border-gold transition-all duration-500 relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 p-4 bg-gold text-black rounded-bl-2xl text-[9px] font-bold uppercase tracking-widest">
                        Exclusivo
                    </div>
                    <div className="mb-6 w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center text-gold group-hover:scale-110 transition-all">
                        <Crown size={20} />
                    </div>
                    <h3 className="text-2xl font-serif text-white mb-2">Projetos Especiais</h3>
                    <p className="text-xs text-zinc-500 uppercase tracking-widest mb-6 font-bold">Arte Sob Medida</p>
                    <p className="text-zinc-400 text-sm mb-8 min-h-[60px]">
                        Obras exclusivas, tamanhos gigantes e acesso ao nosso <span className="text-gold">Artista Residente</span>.
                    </p>

                    <button
                        onClick={() => setCustomProjectModalOpen(true)}
                        className="w-full py-4 bg-gold text-black text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-white transition-all shadow-[0_0_20px_rgba(197,160,89,0.2)]"
                    >
                        Iniciar Projeto AAA
                    </button>
                    <div className="mt-4 flex items-center gap-2">
                        <div className="h-1 flex-1 bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full w-full bg-gold"></div>
                        </div>
                        <span className="text-[9px] uppercase tracking-widest text-gold font-bold">20% Garantido</span>
                    </div>
                </div>
            </div>

            {/* STATS OVERVIEW */}
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

            <AssistanceModal isOpen={assistanceModalOpen} onClose={() => setAssistanceModalOpen(false)} />
            <CustomProjectModal isOpen={customProjectModalOpen} onClose={() => setCustomProjectModalOpen(false)} />

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
