import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, ArrowRight, CheckCircle2 } from 'lucide-react';

export const Register: React.FC = () => {
    const navigate = useNavigate();

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate register
        navigate('/obrigado');
    };

    return (
        <div className="min-h-screen bg-canvas flex items-center justify-center px-6 py-20 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute -top-20 -left-20 w-96 h-96 bg-gold/5 blur-[120px] rounded-full -z-10"></div>

            <div className="w-full max-w-2xl animate-fade-in">
                <div className="text-center mb-16 space-y-6">
                    <div
                        className="cursor-pointer flex justify-center"
                        onClick={() => navigate('/')}
                    >
                        <img src="/logo.png" alt="Casa Linda" className="h-12 md:h-16 object-contain" />
                    </div>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-[0.5em] font-bold">Solicitação de Parceria Private</p>
                </div>

                <div className="glass p-12 md:p-16 space-y-16">
                    <div className="grid md:grid-cols-2 gap-16">
                        <div className="space-y-10">
                            <div className="space-y-4">
                                <h2 className="text-4xl font-serif text-white leading-tight">Junte-se ao <br /> Círculo de Elite.</h2>
                                <p className="text-zinc-500 text-sm font-light uppercase tracking-widest leading-relaxed">
                                    Benefícios exclusivos para arquitetos credenciados.
                                </p>
                            </div>

                            <div className="space-y-6">
                                {[
                                    "20% de Comissão Direta",
                                    "Portal White Label",
                                    "Curadoria Personalizada",
                                    "Geração de Propostas em PDF"
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <CheckCircle2 size={16} className="text-gold" />
                                        <span className="text-[10px] text-zinc-300 uppercase tracking-widest font-medium">{item}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-10 border-t border-white/5">
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 glass flex items-center justify-center rounded-full text-gold">
                                        <Award size={20} />
                                    </div>
                                    <p className="text-[9px] text-zinc-500 uppercase tracking-widest leading-loose">
                                        Sujeito à aprovação de <br /> credenciais profissionais.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleRegister} className="space-y-8">
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-[0.4em]">Nome Completo</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-5 py-4 text-xs border border-white/5 focus:outline-none focus:border-gold transition-all glass-dark text-white rounded-lg"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-[0.4em]">CAU / ABD</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Reg. Profissional"
                                        className="w-full px-5 py-4 text-xs border border-white/5 focus:outline-none focus:border-gold transition-all glass-dark text-white rounded-lg"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-[0.4em]">E-mail Corporativo</label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full px-5 py-4 text-xs border border-white/5 focus:outline-none focus:border-gold transition-all glass-dark text-white rounded-lg"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-[0.4em]">Defina sua Senha</label>
                                    <input
                                        type="password"
                                        required
                                        className="w-full px-5 py-4 text-xs border border-white/5 focus:outline-none focus:border-gold transition-all glass-dark text-white rounded-lg"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full group relative overflow-hidden bg-white text-black py-6 text-[9px] uppercase tracking-[0.5em] font-bold transition-all hover:scale-[1.02] shadow-2xl"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-4">Enviar Solicitação <ArrowRight size={14} /></span>
                                <div className="absolute inset-0 bg-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                            </button>
                        </form>
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <p className="text-[10px] text-zinc-600 uppercase tracking-widest">Já possui acesso?</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="mt-4 text-gold text-[10px] font-bold uppercase tracking-[0.4em] hover:text-white transition-colors"
                    >
                        Realizar Login Private
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
    );
};
