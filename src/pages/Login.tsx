import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { PublicLayout } from '../layouts/PublicLayout';

export const Login: React.FC = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const { error: authError } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (authError) throw authError;

            navigate('/dashboard');
        } catch (err: any) {
            console.error('Login error:', err);
            setError(err.message === 'Invalid login credentials'
                ? 'E-mail ou senha incorretos.'
                : err.message.includes('Email not confirmed')
                    ? 'E-mail não confirmado. Verifique sua caixa de entrada.'
                    : 'Erro ao conectar. Verifique seus dados.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <PublicLayout>
            <div className="min-h-[85vh] flex items-center justify-center px-6 relative py-32">
                <div className="w-full max-w-lg animate-fade-in">
                    <div className="text-center mb-16 space-y-6">
                        <p className="text-[10px] text-zinc-500 uppercase tracking-[0.5em] font-bold">Portal Arquiteto Private</p>
                    </div>

                    <div className="glass p-12 md:p-16 space-y-12">
                        <div className="space-y-4">
                            <h2 className="text-4xl font-serif text-white">Bem-vindo de volta.</h2>
                            <p className="text-zinc-500 text-sm font-light uppercase tracking-widest">Acesse suas ferramentas de curadoria.</p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-8">
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

                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-[0.4em]">Senha</label>
                                    <button
                                        type="button"
                                        onClick={() => navigate('/forgot-password')}
                                        className="text-[9px] text-gold uppercase tracking-widest hover:text-white transition-colors"
                                    >
                                        Esqueceu?
                                    </button>
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full px-6 py-5 text-xs border border-white/5 focus:outline-none focus:border-gold transition-all glass-dark text-white rounded-lg"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full group relative overflow-hidden bg-white text-black py-7 text-[10px] uppercase tracking-[0.5em] font-bold transition-all hover:scale-[1.02] shadow-2xl disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-4">
                                    {isLoading ? <Loader2 className="animate-spin" size={16} /> : <>Autenticar Acesso <ArrowRight size={16} /></>}
                                </span>
                                <div className="absolute inset-0 bg-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                            </button>
                        </form>

                        <div className="pt-8 border-t border-white/5 text-center space-y-6">
                            <p className="text-[10px] text-zinc-600 uppercase tracking-widest">Ainda não é parceiro?</p>
                            <button
                                onClick={() => navigate('/register')}
                                className="text-gold text-[10px] font-bold uppercase tracking-[0.4em] hover:text-white transition-colors"
                            >
                                Solicitar Credenciamento Private
                            </button>
                        </div>
                    </div>

                    <div className="mt-12 flex justify-center items-center gap-4 opacity-30">
                        <ShieldCheck size={14} className="text-gold" />
                        <p className="text-[8px] uppercase tracking-[0.5em] font-bold">Conexão Segura AES-256</p>
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
