import React from 'react';
import { Palette, Maximize, Frame } from 'lucide-react';

export const CustomizationSection: React.FC = () => {
    return (
        <section className="py-24 bg-ebonite relative overflow-hidden border-t border-white/5">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Text Content */}
                    <div className="space-y-10">
                        <div className="space-y-4">
                            <h2 className="text-gold text-[10px] uppercase tracking-[0.5em] font-bold">Liberdade Criativa</h2>
                            <h3 className="text-3xl md:text-5xl font-serif text-white leading-tight">
                                Personalização Total <br /> para Seus Projetos
                            </h3>
                        </div>

                        <p className="text-lg text-zinc-400 font-light leading-relaxed">
                            Oferecemos um acervo completo de artes em altíssima resolução e mais de <span className="text-white border-b border-gold/50">250 modelos de molduras</span> para que cada detalhe reflita a identidade do seu projeto.
                        </p>

                        <div className="grid sm:grid-cols-2 gap-6 pt-4">
                            <div className="flex gap-4 items-start group">
                                <div className="p-3 rounded-lg bg-gold/5 border border-gold/20 text-gold group-hover:bg-gold group-hover:text-black transition-colors">
                                    <Palette size={20} />
                                </div>
                                <div>
                                    <h4 className="text-white font-serif text-lg mb-1">Acervo Exclusivo</h4>
                                    <p className="text-zinc-500 text-xs uppercase tracking-wider">Artes em Alta Resolução</p>
                                </div>
                            </div>

                            <div className="flex gap-4 items-start group">
                                <div className="p-3 rounded-lg bg-gold/5 border border-gold/20 text-gold group-hover:bg-gold group-hover:text-black transition-colors">
                                    <Frame size={20} />
                                </div>
                                <div>
                                    <h4 className="text-white font-serif text-lg mb-1">Molduras Premium</h4>
                                    <p className="text-zinc-500 text-xs uppercase tracking-wider">+250 Opções de Acabamento</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Visual / Image Area */}
                    <div className="relative">
                        {/* Abstract Composition representing frames and art */}
                        <div className="relative aspect-square md:aspect-[4/3] rounded-sm overflow-hidden border border-white/10 glass-3d group">
                            <img
                                src="https://images.unsplash.com/photo-1579762715118-a6f1d4b934f1?q=80&w=1000&auto=format&fit=crop"
                                alt="Acervo de Artes"
                                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>

                            {/* Floating Card */}
                            <div className="absolute bottom-6 right-6 left-6 md:left-auto md:w-64 glass p-6 border-l-4 border-gold backdrop-blur-xl">
                                <div className="flex items-center gap-3 mb-2 text-gold">
                                    <Maximize size={16} />
                                    <span className="text-[9px] uppercase tracking-widest font-bold">Qualidade Ultra HD</span>
                                </div>
                                <p className="text-zinc-300 text-xs leading-relaxed">
                                    Impressão fine art com fidelidade de cor e detalhes impressionantes.
                                </p>
                            </div>
                        </div>

                        {/* Decorative Element */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-gold/10 rounded-full blur-[80px] pointer-events-none"></div>
                        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none"></div>
                    </div>

                </div>
            </div>
        </section>
    );
};
