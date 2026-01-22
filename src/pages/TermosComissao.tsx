import React from 'react';
import { PublicLayout } from '../layouts/PublicLayout';
import { DollarSign, ShieldCheck, Zap, Handshake, Star } from 'lucide-react';

export const TermosComissao: React.FC = () => {
    return (
        <PublicLayout>
            <section className="pt-40 pb-20 px-6">
                <div className="max-w-4xl mx-auto space-y-20">
                    <div className="text-center space-y-8">
                        <h2 className="text-gold text-[10px] uppercase tracking-[0.6em] font-bold">Parceria Lucrativa</h2>
                        <h1 className="text-6xl md:text-8xl font-serif leading-none text-white">Comissão</h1>
                        <p className="text-zinc-500 font-light text-xl leading-relaxed">
                            O modelo de repasse técnico mais agressivo do mercado de decoração de alto padrão.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Pilar 1 */}
                        <div className="glass p-10 space-y-6 hover:border-gold/30 transition-all group">
                            <div className="w-12 h-12 bg-white/5 flex items-center justify-center rounded-lg text-gold group-hover:bg-gold group-hover:text-black transition-all">
                                <Zap size={24} />
                            </div>
                            <h3 className="text-xl font-serif text-white uppercase tracking-wider">Escala Digital</h3>
                            <p className="text-[10px] text-zinc-500 uppercase tracking-widest leading-relaxed">
                                Ideal para volume e projetos rápidos. Use seu link ou cupom exclusivo. O cliente compra e você recebe até 20%.
                            </p>
                            <div className="pt-4 border-t border-white/5">
                                <span className="text-gold font-bold text-[10px] uppercase tracking-[0.2em]">15% a 20%</span>
                            </div>
                        </div>

                        {/* Pilar 2 */}
                        <div className="glass p-10 space-y-6 hover:border-gold/30 transition-all group">
                            <div className="w-12 h-12 bg-white/5 flex items-center justify-center rounded-lg text-gold group-hover:bg-gold group-hover:text-black transition-all">
                                <Handshake size={24} />
                            </div>
                            <h3 className="text-xl font-serif text-white uppercase tracking-wider">Venda Assistida</h3>
                            <p className="text-[10px] text-zinc-500 uppercase tracking-widest leading-relaxed">
                                Suporte técnico total. Simulações no seu projeto e curadoria humanizada para elevar o ticket médio.
                            </p>
                            <div className="pt-4 border-t border-white/5">
                                <span className="text-gold font-bold text-[10px] uppercase tracking-[0.2em]">15% a 20% + Bônus</span>
                            </div>
                        </div>

                        {/* Pilar 3 */}
                        <div className="glass p-10 border border-gold/20 space-y-6 hover:border-gold transition-all group bg-gold/5">
                            <div className="w-12 h-12 bg-gold flex items-center justify-center rounded-lg text-black">
                                <Star size={24} />
                            </div>
                            <h3 className="text-xl font-serif text-white uppercase tracking-wider">Criação Artística</h3>
                            <p className="text-[10px] text-zinc-500 uppercase tracking-widest leading-relaxed">
                                Luxo percebido e Moat competitivo. Briefing exclusivo com nosso artista residente para obras únicas.
                            </p>
                            <div className="pt-4 border-t border-gold/10">
                                <span className="text-gold font-bold text-[10px] uppercase tracking-[0.2em]">Garantida 20%</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass p-12 md:p-24 space-y-12">
                        <div className="space-y-10">
                            <div className="grid md:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <div className="flex gap-4 text-white">
                                        <ShieldCheck className="text-gold" size={20} />
                                        <span className="text-[10px] uppercase tracking-[0.4em] font-bold">Segurança Total</span>
                                    </div>
                                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest leading-loose">
                                        Seu escritório merece transparência. Todos os repasses são formalizados e realizados com rigorosa precisão. Você acompanha tudo pelo seu painel exclusivo.
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex gap-4 text-white">
                                        <Zap className="text-gold" size={20} />
                                        <span className="text-[10px] uppercase tracking-[0.4em] font-bold">Liquidez Imediata</span>
                                    </div>
                                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest leading-loose">
                                        Esqueça os prazos longos. Os valores são liberados em sua conta assim que o faturamento é confirmado pelo cliente. Fluxo de caixa ágil para você.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-20 text-center space-y-6">
                            <p className="text-white text-xl font-serif italic max-w-2xl mx-auto">
                                "Criação artística exclusiva: o diferencial que coloca seu escritório anos à frente da concorrência."
                            </p>
                            <button onClick={() => window.open('https://wa.me/554797220810', '_blank')} className="bg-gold text-black px-8 py-4 text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-white transition-all shadow-xl hover:shadow-gold/20">
                                Falar com Consultor Private
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
};
