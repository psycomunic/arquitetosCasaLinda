import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { PublicLayout } from '../layouts/PublicLayout';

export const Register: React.FC = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        cau: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState<string | null>(null);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            // 1. Sign up with Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    emailRedirectTo: `${window.location.origin}/login`,
                    data: {
                        full_name: formData.name,
                        cau: formData.cau
                    }
                }
            });

            if (authError) throw authError;

            // Profile is created automatically by database trigger now

            if (authData.user) {
                navigate('/obrigado');
            }
        } catch (err: any) {
            console.error('Registration error:', err);
            setError(err.message || 'Erro ao realizar cadastro. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <PublicLayout bgClass="bg-white" lightMode={true}>
            <div className="min-h-screen flex items-center justify-center px-4 md:px-6 py-32 relative">
                <div className="w-full max-w-5xl animate-fade-in relative z-10">
                    <div className="text-center mb-10 md:mb-16 space-y-4 md:space-y-6">
                        <p className="text-[10px] text-zinc-400 font-bold tracking-[0.3em] uppercase">Casa Linda Decorações</p>
                        <h1 className="text-3xl md:text-5xl font-serif text-black leading-tight">
                            Portal do Arquiteto
                        </h1>
                    </div>

                    <div className="bg-black rounded-3xl p-6 md:p-16 space-y-10 md:space-y-16 shadow-2xl overflow-hidden relative">
                        {/* Abstract Gold Glow */}
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 blur-[120px] rounded-full pointer-events-none translate-x-1/2 -translate-y-1/2"></div>

                        <div className="grid md:grid-cols-2 gap-10 md:gap-20 relative z-10">
                            <div className="space-y-10">
                                <div className="space-y-6">
                                    <h2 className="text-3xl md:text-5xl font-serif text-white leading-tight">
                                        Solicitação de <br /> <span className="text-gold">Acesso Private.</span>
                                    </h2>
                                    <p className="text-zinc-400 text-sm md:text-base font-light leading-relaxed max-w-sm">
                                        Ambiente exclusivo para profissionais credenciados. Desbloqueie ferramentas e benefícios únicos.
                                    </p>
                                </div>

                                <div className="space-y-5">
                                    {[
                                        "Comissão Progressiva (até 20%)",
                                        "Atendimento VIP & Venda Assistida",
                                        "Projetos Artísticos Exclusivos",
                                        "Dashboard Financeiro Completo"
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-4 group">
                                            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-gold/50 transition-colors">
                                                <CheckCircle2 size={14} className="text-gold" />
                                            </div>
                                            <span className="text-xs md:text-sm text-zinc-300 group-hover:text-white transition-colors">{item}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-10 border-t border-white/10 hidden md:block">
                                    <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 bg-white/5 border border-white/10 flex items-center justify-center rounded-full text-gold">
                                            <Award size={24} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Status</p>
                                            <p className="text-xs text-zinc-300 font-medium">Sujeito à análise de credenciais</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={handleRegister} className="space-y-8">
                                {error && (
                                    <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-300 text-xs rounded-lg">
                                        {error}
                                    </div>
                                )}

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1">Nome Completo</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-6 py-4 text-sm md:text-base border border-white/10 focus:border-gold bg-zinc-900/50 text-white rounded-xl placeholder-zinc-700 transition-all outline-none"
                                            placeholder="Ex: João Silva"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1">
                                            CAU / ABD <span className="text-zinc-700 ml-1 font-normal normal-case">(Opcional)</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Ex: A12345-6"
                                            value={formData.cau}
                                            onChange={(e) => setFormData({ ...formData, cau: e.target.value })}
                                            className="w-full px-6 py-4 text-sm md:text-base border border-white/10 focus:border-gold bg-zinc-900/50 text-white rounded-xl placeholder-zinc-700 transition-all outline-none"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1">E-mail Corporativo</label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-6 py-4 text-sm md:text-base border border-white/10 focus:border-gold bg-zinc-900/50 text-white rounded-xl placeholder-zinc-700 transition-all outline-none"
                                            placeholder="Ex: contato@seuecretorio.com"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1">Senha de Acesso</label>
                                        <input
                                            type="password"
                                            required
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="w-full px-6 py-4 text-sm md:text-base border border-white/10 focus:border-gold bg-zinc-900/50 text-white rounded-xl placeholder-zinc-700 transition-all outline-none"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full group relative overflow-hidden bg-white text-black py-5 text-xs uppercase tracking-[0.3em] font-bold rounded-xl hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all disabled:opacity-70"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-3">
                                        {isLoading ? "Processando..." : <>Enviar Solicitação <ArrowRight size={14} /></>}
                                    </span>
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="mt-12 text-center">
                        <p className="text-xs text-zinc-400 mb-4">Já possui credenciais de acesso?</p>
                        <button
                            onClick={() => navigate('/login')}
                            className="text-black text-xs font-bold uppercase tracking-[0.3em] hover:text-gold transition-colors pb-1 border-b border-black/20 hover:border-gold"
                        >
                            Acessar Dashboard
                        </button>
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
