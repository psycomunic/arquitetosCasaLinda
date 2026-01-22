import React from 'react';
import { PublicLayout } from '../layouts/PublicLayout';
import { ShieldCheck, Award, Zap, Ruler } from 'lucide-react';

export const CanvasPremium: React.FC = () => {
    return (
        <PublicLayout>
            <section className="pt-40 pb-20 px-6">
                <div className="max-w-7xl mx-auto space-y-24">
                    <div className="text-center space-y-8">
                        <h2 className="text-gold text-[10px] uppercase tracking-[0.6em] font-bold">Qualidade Museu</h2>
                        <h1 className="text-4xl sm:text-6xl md:text-[7rem] font-serif leading-tight text-white">Canvas Premium</h1>
                        <p className="text-zinc-500 font-light text-base md:text-xl max-w-3xl mx-auto leading-relaxed">
                            Descubra a verdadeira arte em tecido canvas, utilizado pelos artistas mais exigentes e museus ao redor do mundo.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-20 items-center">
                        <div className="space-y-12">
                            <div className="glass p-10 border-l-4 border-gold">
                                <h3 className="text-2xl font-serif text-white mb-6">Especificações Técnicas</h3>
                                <ul className="space-y-6">
                                    <li className="flex gap-4">
                                        <Zap className="text-gold shrink-0" size={20} />
                                        <p className="text-sm text-zinc-400 leading-relaxed">
                                            <strong className="text-white block uppercase tracking-widest text-[10px] mb-1">Material</strong>
                                            Canvas museu 100% algodão, 380 g/m².
                                        </p>
                                    </li>
                                    <li className="flex gap-4">
                                        <Zap className="text-gold shrink-0" size={20} />
                                        <p className="text-sm text-zinc-400 leading-relaxed">
                                            <strong className="text-white block uppercase tracking-widest text-[10px] mb-1">Tinta</strong>
                                            HP Latex® 4ª geração, à base d'água sem odor. Sustentável e segura para ambientes internos.
                                        </p>
                                    </li>
                                    <li className="flex gap-4">
                                        <Zap className="text-gold shrink-0" size={20} />
                                        <p className="text-sm text-zinc-400 leading-relaxed">
                                            <strong className="text-white block uppercase tracking-widest text-[10px] mb-1">Impressão</strong>
                                            HP Latex Série 800 - 4K real. Definição fotográfica extraordinária.
                                        </p>
                                    </li>
                                    <li className="flex gap-4">
                                        <Zap className="text-gold shrink-0" size={20} />
                                        <p className="text-sm text-zinc-400 leading-relaxed">
                                            <strong className="text-white block uppercase tracking-widest text-[10px] mb-1">Estrutura</strong>
                                            Madeira nobre tratada de reflorestamento. Opção de acabamento em gesso para selagem premium.
                                        </p>
                                    </li>
                                </ul>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-1 gap-6">
                                <div className="glass-3d p-8 text-center space-y-4 hover:-translate-y-1 transition-all">
                                    <ShieldCheck className="mx-auto text-gold" size={32} />
                                    <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-white">5 Anos de Garantia</p>
                                    <p className="text-[8px] text-zinc-500 uppercase tracking-widest">Embalagem Personalizada</p>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <img
                                src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1000&auto=format&fit=crop"
                                className="w-full h-auto rounded-lg shadow-2xl grayscale hover:grayscale-0 transition-all duration-1000"
                                alt="Canvas Detail"
                            />
                            <div className="absolute -bottom-10 -right-10 flex gap-4 no-print">
                                <div className="glass p-6 backdrop-blur-xl border-white/10">
                                    <p className="text-3xl font-serif text-white">4K</p>
                                    <p className="text-[8px] uppercase tracking-widest text-zinc-500">Resolução</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-10 pt-20 perspective-1000">
                        {[
                            {
                                title: "Borda Infinita 360°",
                                desc: "Transforme seu ambiente em uma galeria. Imagem contínua nas laterais que envolve toda a peça. Com proteção UV contra desbotamento.",
                                image: "/images/frames/borda-infinita.jpg"
                            },
                            {
                                title: "Moldura Premium Caixa",
                                desc: "Estilo canaleta (float). O canvas ganha uma moldura de 5cm em madeira nobre revestida. Elegância com durabilidade superior a 30 anos.",
                                image: "/images/frames/caixa-dourada.png"
                            },
                            {
                                title: "Premium com Vidro",
                                desc: "Máximo requinte. Moldura com vidro float 3mm de alta transparência. Proteção extraordinária para obras que atravessam gerações.",
                                image: "/images/frames/trono-de-ouro.jpg"
                            }
                        ].map((type, i) => (
                            <div key={i} className="glass-3d group overflow-hidden flex flex-col items-center text-center transform hover:-translate-y-2 hover:rotate-x-2 transition-all duration-500">
                                <div className="aspect-square w-full overflow-hidden bg-black/40">
                                    <img
                                        src={type.image}
                                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-1000 opacity-80 group-hover:opacity-100"
                                        alt={type.title}
                                    />
                                </div>
                                <div className="p-10 space-y-6">
                                    <h4 className="text-2xl font-serif text-white tracking-wide">{type.title}</h4>
                                    <p className="text-[10px] text-zinc-400 leading-relaxed uppercase tracking-[0.2em] font-light">
                                        {type.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Dedicated Authenticity Certificate Section */}
                    <div className="py-24 border-t border-white/5">
                        <div className="grid lg:grid-cols-2 gap-20 items-center">
                            <div className="space-y-8 order-2 lg:order-1">
                                <h2 className="text-gold text-[10px] uppercase tracking-[0.6em] font-bold">Respaldo e Precisão</h2>
                                <h3 className="text-4xl md:text-6xl font-serif text-white leading-tight">Certificado de Autenticidade</h3>
                                <p className="text-lg text-zinc-500 font-light leading-relaxed">
                                    Cada obra produzida pela Casa Linda é acompanhada por um documento oficial que atesta sua origem, materiais e exclusividade. O certificado assegura o valor patrimonial da arte para seu cliente, confirmando o uso de canvas 100% algodão e tintas HP Latex originais.
                                </p>
                                <div className="space-y-4">
                                    {[
                                        "Número de Série Único",
                                        "Assinatura do Ateliê",
                                        "Especificações Técnicas de Impressão",
                                        "Garantia de Longevidade (30+ anos)"
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-4 text-[10px] uppercase tracking-widest text-zinc-400 font-medium">
                                            <div className="w-1.5 h-1.5 rounded-full bg-gold"></div>
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="relative order-1 lg:order-2">
                                <div className="glass-3d-dark p-6 rounded-2xl transform rotate-3 shadow-2xl hover:rotate-0 transition-transform duration-700 group">
                                    <img
                                        src="/images/certificado-autenticidade.png"
                                        className="w-full h-auto drop-shadow-2xl"
                                        alt="Documento de Autenticidade"
                                    />
                                    <div className="absolute inset-0 bg-gold/5 blur-3xl rounded-full -z-10 animate-pulse"></div>
                                </div>
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-gold/10 rounded-full blur-3xl"></div>
                            </div>
                        </div>
                    </div>

                    <div className="p-16 glass text-center space-y-8 bg-gold/5">
                        <h3 className="text-3xl font-serif text-white italic">"Prontos para pendurar em seu projeto."</h3>
                        <p className="text-zinc-500 text-sm font-light uppercase tracking-[0.2em] max-w-2xl mx-auto">
                            Você receberá os quadros finalizados com serrilha de fixação e kit de instalação completo, prontos para transformar o ambiente.
                        </p>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
};
