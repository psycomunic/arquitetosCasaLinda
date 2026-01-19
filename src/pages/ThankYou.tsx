import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Mail } from 'lucide-react';
import { trackEvent } from '../components/Analytics';

export const ThankYou: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Fire conversion event on mount
        trackEvent('CompleteRegistration');
    }, []);

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
                        <div className="w-24 h-24 bg-gold/10 rounded-full flex items-center justify-center text-gold animate-bounce">
                            <CheckCircle2 size={48} />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h1 className="text-4xl md:text-5xl font-serif text-white">Solicitação Recebida</h1>
                        <p className="text-zinc-400 text-lg font-light leading-relaxed max-w-lg mx-auto">
                            Agradecemos seu interesse em se tornar um parceiro Private. Seus dados foram enviados para nossa equipe de curadoria.
                        </p>
                    </div>

                    <div className="space-y-4 bg-zinc-900/50 p-8 rounded-lg border border-white/5">
                        <div className="flex items-center justify-center gap-3 text-gold">
                            <Mail size={20} />
                            <span className="text-xs font-bold uppercase tracking-widest">Próximos Passos</span>
                        </div>
                        <p className="text-sm text-zinc-500">
                            Em breve você receberá um e-mail com o status da sua aprovação e as credenciais de acesso ao portal.
                        </p>
                    </div>

                    <div className="pt-8">
                        <button
                            onClick={() => navigate('/')}
                            className="bg-white text-black px-12 py-4 text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-gold transition-all shadow-xl hover:shadow-gold/20 flex items-center gap-4 mx-auto"
                        >
                            Voltar ao Início <ArrowRight size={14} />
                        </button>
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
