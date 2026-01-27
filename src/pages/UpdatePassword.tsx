import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, Loader2, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { PublicLayout } from '../layouts/PublicLayout';

export const UpdatePassword: React.FC = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        // Check if we have an active session (which comes from the magic link)
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                setError('Link de recuperação inválido ou expirado.');
            }
        };
        checkSession();
    }, []);

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const { error: updateError } = await supabase.auth.updateUser({
                password: password
            });

            if (updateError) throw updateError;

            setSuccess(true);

            // Redirect after a few seconds
            setTimeout(() => {
                navigate('/dashboard');
            }, 3000);
        } catch (err: any) {
            console.error('Update password error:', err);
            setError('Erro ao atualizar senha. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <PublicLayout>
            <div className="min-h-[85vh] flex items-center justify-center px-6 relative py-32">
                <div className="w-full max-w-lg animate-fade-in">
                    <div className="text-center mb-16 space-y-6">
                        <p className="text-[10px] text-zinc-500 uppercase tracking-[0.5em] font-bold">Definição de Credenciais</p>
                    </div>

                    <div className="glass p-12 md:p-16 space-y-12">
                        <div className="space-y-4">
                            <h2 className="text-4xl font-serif text-white">Nova Senha</h2>
                            <p className="text-zinc-500 text-sm font-light uppercase tracking-widest">Defina sua nova senha de acesso.</p>
                        </div>

                        {!success ? (
                            <form onSubmit={handleUpdatePassword} className="space-y-8">
                                {error && (
                                    <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-300 text-xs rounded-lg">
                                        {error}
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-[0.4em]">Nova Senha</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full px-6 py-5 text-xs border border-white/5 focus:outline-none focus:border-gold transition-all glass-dark text-white rounded-lg pr-12"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading || !!error && error.includes('inválido')}
                                    className="w-full group relative overflow-hidden bg-white text-black py-7 text-[10px] uppercase tracking-[0.5em] font-bold transition-all hover:scale-[1.02] shadow-2xl disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-4">
                                        {isLoading ? <Loader2 className="animate-spin" size={16} /> : <>Redefinir Senha <ArrowRight size={16} /></>}
                                    </span>
                                    <div className="absolute inset-0 bg-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                                </button>
                            </form>
                        ) : (
                            <div className="text-center space-y-6 animate-fade-in">
                                <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-300 text-xs rounded-lg uppercase tracking-widest leading-relaxed">
                                    Senha atualizada com sucesso! Redirecionando...
                                </div>
                            </div>
                        )}
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
