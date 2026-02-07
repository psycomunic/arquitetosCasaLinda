import React from 'react';
import { Image, Layers, Frame } from 'lucide-react';

export const MaterialsSection: React.FC = () => {
    return (
        <section className="py-24 bg-zinc-950 relative overflow-hidden border-t border-white/5">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gold/5 blur-[120px] rounded-full"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16 space-y-6">
                    <h2 className="text-gold text-[10px] uppercase tracking-[0.5em] font-bold">Acabamento Premium</h2>
                    <h3 className="text-3xl md:text-5xl font-serif text-white">Materiais de Padrão Galeria</h3>
                    <p className="text-zinc-400 text-lg font-light max-w-2xl mx-auto leading-relaxed">
                        Trabalhamos com materiais de padrão galeria para garantir durabilidade e impacto visual.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Papel Fotográfico */}
                    <div className="group relative glass-3d p-8 md:p-12 rounded-2xl text-center hover:-translate-y-2 transition-all duration-500">
                        <div className="w-16 h-16 mx-auto rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold mb-8 group-hover:bg-gold group-hover:text-black transition-all shadow-[0_0_20px_rgba(197,160,89,0.2)]">
                            <Image size={32} />
                        </div>
                        <h4 className="text-xl font-serif text-white mb-4">Papel Fotográfico</h4>
                        <p className="text-zinc-400 text-sm leading-relaxed font-light tracking-wide">
                            Nitidez máxima e cores vibrantes.
                        </p>
                    </div>

                    {/* Vinil Fotográfico */}
                    <div className="group relative glass-3d p-8 md:p-12 rounded-2xl text-center hover:-translate-y-2 transition-all duration-500">
                        <div className="w-16 h-16 mx-auto rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold mb-8 group-hover:bg-gold group-hover:text-black transition-all shadow-[0_0_20px_rgba(197,160,89,0.2)]">
                            <Layers size={32} />
                        </div>
                        <h4 className="text-xl font-serif text-white mb-4">Vinil Fotográfico</h4>
                        <p className="text-zinc-400 text-sm leading-relaxed font-light tracking-wide">
                            Versatilidade e resistência com excelente acabamento.
                        </p>
                    </div>

                    {/* Canvas Museológico */}
                    <div className="group relative glass-3d p-8 md:p-12 rounded-2xl text-center hover:-translate-y-2 transition-all duration-500">
                        <div className="w-16 h-16 mx-auto rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold mb-8 group-hover:bg-gold group-hover:text-black transition-all shadow-[0_0_20px_rgba(197,160,89,0.2)]">
                            <Frame size={32} />
                        </div>
                        <h4 className="text-xl font-serif text-white mb-4">Canvas Museológico 100% Algodão</h4>
                        <p className="text-zinc-400 text-sm leading-relaxed font-light tracking-wide">
                            A textura da tela de pintura com máxima qualidade de conservação.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};
