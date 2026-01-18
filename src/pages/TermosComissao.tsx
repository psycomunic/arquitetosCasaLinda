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
                                    Ao se tornar um parceiro Private da Casa Linda, você passa a integrar nosso programa Platinum, garantindo automaticamente 20% de comissão sobre o valor total de cada indicação técnica concluída.
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-10 pt-10 border-t border-white/5">
                                <div className="space-y-4">
                                    <div className="flex gap-4 text-white">
                                        <ShieldCheck className="text-gold" size={20} />
                                        <span className="text-[10px] uppercase tracking-[0.4em] font-bold">Segurança Jurídica</span>
                                    </div>
                                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest leading-loose">
                                        Todos os repasses são documentados e realizados com total transparência fiscal para o seu escritório.
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex gap-4 text-white">
                                        <Zap className="text-gold" size={20} />
                                        <span className="text-[10px] uppercase tracking-[0.4em] font-bold">Pagamento Ágil</span>
                                    </div>
                                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest leading-loose">
                                        Os valores são creditados em sua conta digital do portal assim que a venda é faturada, com resgate simplificado.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-20 text-center">
                            <Handshake size={48} className="mx-auto text-gold mb-8 opacity-20" />
                            <p className="text-zinc-600 text-[9px] uppercase tracking-[0.6em] font-bold max-w-sm mx-auto">
                                Uma relação baseada em confiança, arte e rentabilidade mútua.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
};
