import React from 'react';
import { PublicLayout } from '../layouts/PublicLayout';
import { DollarSign, ShieldCheck, Zap, Handshake } from 'lucide-react';

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

                    <div className="glass p-12 md:p-24 space-y-12">
                        <div className="flex items-center gap-6 pb-12 border-b border-white/5">
                            <div className="w-16 h-16 bg-gold flex items-center justify-center rounded-full text-black">
                                <DollarSign size={32} />
                            </div>
                            <h3 className="text-4xl font-serif text-white">20% de Repasse Técnico</h3>
                        </div>

                        <div className="space-y-10">
                            <div className="space-y-4">
                                <h4 className="text-gold text-[10px] uppercase tracking-[0.3em] font-bold">Plano Platinum</h4>
                                <p className="text-sm text-zinc-400 leading-relaxed uppercase tracking-widest">
                                    Ao se tornar um parceiro Private da Casa Linda, você garante uma vantagem competitiva exclusiva. Enquanto o mercado trabalha com margens menores, nós valorizamos sua especificação com <span className="text-white font-bold">20% de comissão garantida</span> sobre o valor total de cada projeto. Sem faixas, sem metas inatingíveis.
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-10 pt-10 border-t border-white/5">
                                <div className="space-y-4">
                                    <div className="flex gap-4 text-white">
                                        <ShieldCheck className="text-gold" size={20} />
                                        <span className="text-[10px] uppercase tracking-[0.4em] font-bold">Segurança Total</span>
                                    </div>
                                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest leading-loose">
                                        Seu escritório merece transparência. Todos os repasses são formalizados, documentados e realizados com rigorosa precisão fiscal. Você acompanha tudo pelo seu painel exclusivo.
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex gap-4 text-white">
                                        <Zap className="text-gold" size={20} />
                                        <span className="text-[10px] uppercase tracking-[0.4em] font-bold">Liquidez Imediata</span>
                                    </div>
                                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest leading-loose">
                                        Esqueça os prazos longos. Os valores são liberados em sua conta digital assim que o faturamento é confirmado. Fluxo de caixa ágil para o seu negócio crescer.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-20 text-center space-y-6">
                            <Handshake size={48} className="mx-auto text-gold mb-8 opacity-20" />
                            <p className="text-white text-xl font-serif italic max-w-2xl mx-auto">
                                "Não é apenas sobre quadros. É sobre alavancar o faturamento do seu escritório com o parceiro certo."
                            </p>
                            <button onClick={() => window.open('https://wa.me/554797220810', '_blank')} className="bg-gold text-black px-8 py-4 text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-white transition-all shadow-xl hover:shadow-gold/20">
                                Quero Ser Parceiro Agora
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
};
