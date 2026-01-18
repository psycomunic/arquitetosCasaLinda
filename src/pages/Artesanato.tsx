import React from 'react';
import { PublicLayout } from '../layouts/PublicLayout';
import { Star, Brush, Package, Award } from 'lucide-react';

export const Artesanato: React.FC = () => {
    return (
        <PublicLayout>
            <section className="pt-40 pb-20 px-6">
                <div className="max-w-7xl mx-auto space-y-32">
                    <div className="text-center space-y-8">
                        <h2 className="text-gold text-[10px] uppercase tracking-[0.6em] font-bold">Alma Brasileira</h2>
                        <h1 className="text-6xl md:text-[7rem] font-serif leading-none text-white uppercase italic">Artesanato</h1>
                        <p className="text-zinc-500 font-light text-xl max-w-3xl mx-auto leading-relaxed">
                            Onde a sensibilidade do artista encontra o rigor técnico artesanal para criar peças de alma e presença.
                        </p>
                    </div>

                    {/* Artist Spotlight */}
                    <div className="grid lg:grid-cols-2 gap-24 items-center glass p-12 md:p-24">
                        <div className="space-y-10 order-2 lg:order-1">
                            <div className="inline-flex items-center gap-3 px-4 py-1 glass rounded-full">
                                <Star size={12} className="text-gold" />
                                <span className="text-[8px] uppercase tracking-[0.4em] font-bold text-zinc-300">Artista Residente</span>
                            </div>
                            <h2 className="text-5xl md:text-7xl font-serif text-white uppercase">Rod</h2>
                            <p className="text-lg text-zinc-400 font-light leading-relaxed">
                                Reconhecido por suas criações exclusivas e originais, o artista Rod é um expoente do design brasileiro. Com uma carreira consolidada, acumula diversos prêmios e reconhecimentos que chancelam cada traço de sua obra.
                            </p>
                            <div className="space-y-4">
                                <p className="text-[10px] text-gold uppercase tracking-[0.5em] font-bold">Diferencial Exclusivo</p>
                                <p className="text-zinc-500 text-sm leading-relaxed uppercase tracking-widest">
                                    A Casa Linda possui artistas internos. Todos os itens são registrados e patenteados, garantindo o uso totalmente exclusivo por nossos parceiros.
                                </p>
                            </div>
                        </div>
                        <div className="order-1 lg:order-2">
                            <div className="aspect-[4/5] bg-zinc-900 overflow-hidden rounded-lg grayscale hover:grayscale-0 transition-all duration-1000">
                                <img
                                    src="https://images.unsplash.com/photo-1554188248-986adbb73be4?q=80&w=1000&auto=format&fit=crop"
                                    className="w-full h-full object-cover"
                                    alt="Artista Rod"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="glass p-16 space-y-8">
                            <Brush className="text-gold" size={40} />
                            <h3 className="text-3xl font-serif text-white">Processo Manual</h3>
                            <p className="text-zinc-500 text-sm leading-relaxed uppercase tracking-[0.2em]">
                                Feito à mão e reproduzido em impressão de última geração com altíssima resolução (FULL HD 4K). Cada peça é cuidadosamente finalizada por nossos artesãos para garantir a máxima qualidade.
                            </p>
                        </div>
                        <div className="glass p-16 space-y-8">
                            <Package className="text-gold" size={40} />
                            <h3 className="text-3xl font-serif text-white">Receba com Carinho</h3>
                            <p className="text-zinc-500 text-sm leading-relaxed uppercase tracking-[0.2em]">
                                Nossos quadros são enviados em embalagens próprias personalizadas de alta qualidade e espessura, para que seu projeto chegue intacto e sem danos.
                            </p>
                        </div>
                    </div>

                    <div className="text-center py-20 border-t border-white/5 space-y-8">
                        <Award className="mx-auto text-gold" size={48} />
                        <h3 className="text-4xl font-serif text-white">Aprovado por Profissionais</h3>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-[0.6em] font-bold">Prova Social & Reconhecimento de Mercado</p>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
};
