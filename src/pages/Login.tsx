import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, ShieldCheck } from 'lucide-react';

export const Login: React.FC = () => {
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate login
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen bg-canvas flex items-center justify-center px-6 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gold/5 blur-[120px] rounded-full -z-10"></div>
            <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gold/5 blur-[100px] rounded-full -z-10"></div>

            <div className="w-full max-w-lg animate-fade-in">
                <div className="text-center mb-16 space-y-6">
                    <div
                        className="cursor-pointer flex justify-center"
                        onClick={() => navigate('/')}
                    >
                        <img src="/logo.png" alt="Casa Linda" className="h-8 md:h-10 object-contain" />
                    </div>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-[0.5em] font-bold">Portal Arquiteto Private</p>
                </div>

                <div className="glass p-12 md:p-16 space-y-12">
                    <div className="space-y-4">
                        <h2 className="text-4xl font-serif text-white">Bem-vindo de volta.</h2>
                        <p className="text-zinc-500 text-sm font-light uppercase tracking-widest">Acesse suas ferramentas de curadoria.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-8">
                        <div className="space-y-4">
                            <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-[0.4em]">E-mail Profissional</label>
                            <input
                                type="email"
                                required
                                placeholder="nome@escritorio.com"
                                className="w-full px-6 py-5 text-xs border border-white/5 focus:outline-none focus:border-gold transition-all glass-dark text-white rounded-lg"
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-[0.4em]">Senha</label>
                                <button type="button" className="text-[9px] text-gold uppercase tracking-widest hover:text-white transition-colors">Esqueceu?</button>
                            </div>
                            <input
                                type="password"
                                required
                                placeholder="••••••••"
                                className="w-full px-6 py-5 text-xs border border-white/5 focus:outline-none focus:border-gold transition-all glass-dark text-white rounded-lg"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full group relative overflow-hidden bg-white text-black py-7 text-[10px] uppercase tracking-[0.5em] font-bold transition-all hover:scale-[1.02] shadow-2xl"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-4">Autenticar Acesso <ArrowRight size={16} /></span>
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
        </div >
    );
};
