import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { PublicLayout } from '../layouts/PublicLayout';

export const ForgotPassword: React.FC = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [countdown, setCountdown] = useState<number | null>(null);

    React.useEffect(() => {
        if (countdown === null) return;

        if (countdown === 0) {
            setCountdown(null);
            setError(null);
            return;
        }

        const timer = setTimeout(() => {
            setCountdown(countdown - 1);
            if (error?.includes('aguarde')) {
                setError(`Muitas tentativas. Por favor, aguarde ${countdown - 1} segundos antes de tentar novamente.`);
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, [countdown, error]);

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/update-password`,
            });

            if (resetError) throw resetError;

            setSuccess(true);
        } catch (err: any) {
            console.error('Reset password error:', err);

            // Check for various forms of rate limit error
            const isRateLimit =
                err.status === 429 ||
                err.message?.toLowerCase().includes('rate limit') ||
                err.message?.includes('429') ||
                JSON.stringify(err).toLowerCase().includes('rate limit');

            if (isRateLimit) {
                setCountdown(60);
                setError('Muitas tentativas. Por favor, aguarde 60 segundos antes de tentar novamente.');
            } else {
                setError('Erro ao enviar e-mail. Verifique se o endereço está correto e tente novamente.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <PublicLayout>
            <div className="min-h-[85vh] flex items-center justify-center px-6 relative py-32">
                <div className="w-full max-w-lg animate-fade-in">
                    <div className="text-center mb-16 space-y-6">
                        <p className="text-[10px] text-zinc-500 uppercase tracking-[0.5em] font-bold">Recuperação de Acesso</p>
                    </div>

                    <div className="glass p-12 md:p-16 space-y-12">
                        <div className="space-y-4">
                            <h2 className="text-4xl font-serif text-white">Esqueceu sua senha?</h2>
                            <p className="text-zinc-500 text-sm font-light uppercase tracking-widest">Digite seu e-mail para redefinir sua senha.</p>
                        </div>

                        {!success ? (
                            <form onSubmit={handleResetPassword} className="space-y-8">
                                {error && (
                                    <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-300 text-xs rounded-lg">
                                        {error}
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-[0.4em]">E-mail Profissional</label>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="nome@escritorio.com"
                                        className="w-full px-6 py-5 text-xs border border-white/5 focus:outline-none focus:border-gold transition-all glass-dark text-white rounded-lg"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading || countdown !== null}
                                    className="w-full group relative overflow-hidden bg-white text-black py-7 text-[10px] uppercase tracking-[0.5em] font-bold transition-all hover:scale-[1.02] shadow-2xl disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-4">
                                        {isLoading ? <Loader2 className="animate-spin" size={16} /> : <>Enviar Link de Recuperação <ArrowRight size={16} /></>}
                                    </span>
                                    <div className="absolute inset-0 bg-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                                </button>
                            </form>
                        ) : (
                            <div className="text-center space-y-6 animate-fade-in">
                                <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-300 text-xs rounded-lg uppercase tracking-widest leading-relaxed">
                                    Verifique sua caixa de entrada. Enviamos um link para redefinir sua senha.
                                </div>
                            </div>
                        )}

                        <div className="pt-8 border-t border-white/5 text-center">
                            <button
                                onClick={() => navigate('/login')}
                                className="flex items-center justify-center gap-2 text-zinc-500 text-[10px] font-bold uppercase tracking-[0.4em] hover:text-white transition-colors mx-auto"
                            >
                                <ArrowLeft size={12} />
                                Voltar para Login
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
        </PublicLayout>
    );
};
