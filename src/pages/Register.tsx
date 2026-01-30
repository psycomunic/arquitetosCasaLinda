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

    const [step, setStep] = useState(1);
    const totalSteps = 4;
    const [direction, setDirection] = useState<'next' | 'prev'>('next');

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();

        // Validation per step
        if (step === 1 && !formData.name.trim()) {
            setError('Por favor, insira seu nome completo.');
            return;
        }
        if (step === 3 && !formData.email.includes('@')) {
            setError('Por favor, insira um e-mail válido.');
            return;
        }
        setError(null); // Clear error if validation passes for the current step

        if (step < totalSteps) {
            setDirection('next');
            setStep(s => s + 1);
        } else {
            handleRegister(e);
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setDirection('prev');
            setStep(s => s - 1);
            setError(null); // Clear error when going back
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
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

            if (authData.user) {
                navigate('/obrigado');
            }
        } catch (err: any) {
            console.error('Registration error:', err);
            setError(err.message || 'Erro ao realizar cadastro. Tente novamente.');
            setIsLoading(false);
        }
    };

    return (
        <PublicLayout bgClass="!bg-black" lightMode={false}>
            <div className="min-h-screen flex items-center justify-center px-4 md:px-6 py-20 relative">
                <div className="w-full max-w-2xl animate-fade-in relative z-10">

                    <div className="text-center mb-8 space-y-3">
                        <p className="text-[10px] text-zinc-400 font-bold tracking-[0.3em] uppercase">Casa Linda Decorações</p>
                        <h1 className="text-2xl md:text-4xl font-serif text-white leading-tight">
                            Portal do Arquiteto
                        </h1>
                    </div>

                    <div className="bg-transparent md:bg-black/50 md:backdrop-blur-sm md:border md:border-white/5 rounded-3xl p-0 md:p-16 relative min-h-[400px] flex flex-col justify-center">
                        {/* Abstract Gold Glow */}
                        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gold/5 blur-[100px] rounded-full pointer-events-none translate-x-1/2 -translate-y-1/2"></div>

                        <div className="relative z-10 w-full max-w-md mx-auto">
                            {/* Progress Bar */}
                            <div className="absolute -top-10 md:-top-16 left-0 w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gold transition-all duration-500 ease-out"
                                    style={{ width: `${(step / totalSteps) * 100}%` }}
                                ></div>
                            </div>

                            {/* Step Indicator */}
                            <div className="mb-8 flex items-center justify-between text-[10px] uppercase tracking-widest font-bold text-zinc-500">
                                <span>Passo {step} de {totalSteps}</span>
                                {step > 1 && (
                                    <button onClick={handleBack} className="hover:text-white transition-colors">Voltar</button>
                                )}
                            </div>

                            <form onSubmit={handleNext} className="space-y-8">
                                {error && (
                                    <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-300 text-xs rounded-lg animate-fade-in">
                                        {error}
                                    </div>
                                )}

                                <div className="min-h-[120px]">
                                    {step === 1 && (
                                        <div className="space-y-4 animate-slide-in">
                                            <label className="block text-sm md:text-base font-medium text-white">Como podemos te chamar?</label>
                                            <input
                                                type="text"
                                                autoFocus
                                                required
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full bg-transparent border-b-2 border-zinc-700 focus:border-gold text-2xl md:text-3xl text-white placeholder-zinc-800 py-2 outline-none transition-colors"
                                                placeholder="Seu Nome"
                                            />
                                        </div>
                                    )}

                                    {step === 2 && (
                                        <div className="space-y-4 animate-slide-in">
                                            <label className="block text-sm md:text-base font-medium text-white">
                                                Possui registro profissional? <span className="text-zinc-500 font-normal">(Opcional)</span>
                                            </label>
                                            <input
                                                type="text"
                                                autoFocus
                                                value={formData.cau}
                                                onChange={(e) => setFormData({ ...formData, cau: e.target.value })}
                                                className="w-full bg-transparent border-b-2 border-zinc-700 focus:border-gold text-2xl md:text-3xl text-white placeholder-zinc-800 py-2 outline-none transition-colors"
                                                placeholder="CAU ou ABD"
                                            />
                                        </div>
                                    )}

                                    {step === 3 && (
                                        <div className="space-y-4 animate-slide-in">
                                            <label className="block text-sm md:text-base font-medium text-white">Qual seu melhor e-mail corporativo?</label>
                                            <input
                                                type="email"
                                                autoFocus
                                                required
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full bg-transparent border-b-2 border-zinc-700 focus:border-gold text-2xl md:text-3xl text-white placeholder-zinc-800 py-2 outline-none transition-colors"
                                                placeholder="seu@email.com"
                                            />
                                        </div>
                                    )}

                                    {step === 4 && (
                                        <div className="space-y-4 animate-slide-in">
                                            <label className="block text-sm md:text-base font-medium text-white">Crie uma senha segura</label>
                                            <input
                                                type="password"
                                                autoFocus
                                                required
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                className="w-full bg-transparent border-b-2 border-zinc-700 focus:border-gold text-2xl md:text-3xl text-white placeholder-zinc-800 py-2 outline-none transition-colors"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full group relative overflow-hidden bg-gold text-black py-5 text-sm uppercase tracking-[0.2em] font-bold rounded-xl hover:shadow-[0_0_30px_rgba(255,215,0,0.3)] hover:brightness-110 transition-all disabled:opacity-70 mt-4"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-3">
                                        {isLoading ? "Processando..." : (
                                            step === totalSteps ? <>Finalizar Cadastro <ArrowRight size={16} /></> : <>Continuar <ArrowRight size={16} /></>
                                        )}
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
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        .animate-slide-in {
            animation: slideIn 0.4s ease-out forwards;
        }
      `}</style>
            </div>
        </PublicLayout>
    );
};
