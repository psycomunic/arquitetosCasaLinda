import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Mail, Loader2, PartyPopper } from 'lucide-react';
import { trackEvent } from '../components/Analytics';
import { supabase } from '../lib/supabase';

export const ThankYou: React.FC = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState<'pending' | 'approved'>('pending');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        trackEvent('CompleteRegistration');
        checkStatus();
    }, []);

    const checkStatus = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            setLoading(false);
            return;
        }

        // Initial check
        const { data } = await supabase
            .from('architects')
            .select('approval_status')
            .eq('id', user.id)
            .single();

        if (data && data.approval_status === 'approved') {
            setStatus('approved');
        }

        // Realtime subscription
        const channel = supabase
            .channel('approval-check')
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'architects',
                    filter: `id=eq.${user.id}`
                },
                (payload) => {
                    const newStatus = (payload.new as any).approval_status;
                    if (newStatus === 'approved') {
                        setStatus('approved');
                    }
                }
            )
            .subscribe();

        setLoading(false);

        return () => {
            supabase.removeChannel(channel);
        };
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-canvas flex items-center justify-center">
                <Loader2 className="animate-spin text-gold" size={32} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-canvas flex items-center justify-center px-6 py-20 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 blur-[120px] rounded-full -z-10"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/5 blur-[120px] rounded-full -z-10"></div>

            <div className="w-full max-w-2xl animate-fade-in text-center space-y-12">
                <div className="flex justify-center mb-8">
                    <img src="/logo.png" alt="Casa Linda" className="h-16 object-contain" />
                </div>

                <div className="glass p-12 md:p-16 space-y-10 border-t-4 border-gold">
                    <div className="flex justify-center">
                        <div className={`w-24 h-24 rounded-full flex items-center justify-center animate-bounce ${status === 'approved' ? 'bg-green-500/10 text-green-500' : 'bg-gold/10 text-gold'}`}>
                            {status === 'approved' ? <PartyPopper size={48} /> : <CheckCircle2 size={48} />}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h1 className="text-4xl md:text-5xl font-serif text-white">
                            {status === 'approved' ? 'Acesso Liberado!' : 'Solicitação Recebida'}
                        </h1>
                        <p className="text-zinc-400 text-lg font-light leading-relaxed max-w-lg mx-auto">
                            {status === 'approved'
                                ? 'Sua conta foi aprovada pela nossa curadoria. Você já pode acessar todas as ferramentas exclusivas do portal.'
                                : 'Agradecemos seu interesse em se tornar um parceiro Private. Seus dados foram enviados para nossa equipe de curadoria.'}
                        </p>
                    </div>

                    <div className="space-y-4 bg-zinc-900/50 p-8 rounded-lg border border-white/5">
                        <div className="flex items-center justify-center gap-3 text-gold">
                            {status === 'approved' ? <CheckCircle2 size={20} /> : <Mail size={20} />}
                            <span className="text-xs font-bold uppercase tracking-widest">{status === 'approved' ? 'Tudo Pronto' : 'Próximos Passos'}</span>
                        </div>
                        <p className="text-sm text-zinc-500">
                            {status === 'approved'
                                ? 'Clique no botão abaixo para entrar no seu Dashboard.'
                                : 'Aguarde nesta tela ou fique atento ao seu e-mail. Assim que aprovado, esta página atualizará automaticamente.'}
                        </p>
                    </div>

                    <div className="pt-8">
                        {status === 'approved' ? (
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="bg-green-500 text-black px-12 py-4 text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-green-400 transition-all shadow-xl hover:shadow-green-500/20 flex items-center gap-4 mx-auto"
                            >
                                Acessar Dashboard <ArrowRight size={14} />
                            </button>
                        ) : (
                            <button
                                onClick={() => navigate('/')}
                                className="bg-white text-black px-12 py-4 text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-gold transition-all shadow-xl hover:shadow-gold/20 flex items-center gap-4 mx-auto"
                            >
                                Voltar ao Início <ArrowRight size={14} />
                            </button>
                        )}
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
