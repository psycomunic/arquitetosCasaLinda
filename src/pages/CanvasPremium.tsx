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
                        <h1 className="text-6xl md:text-[7rem] font-serif leading-none text-white">Canvas Premium</h1>
                        <p className="text-zinc-500 font-light text-xl max-w-3xl mx-auto leading-relaxed">
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
                                            Tecido Canvas 100% algodão próprio para quadros (o mesmo usado em obras de arte e museus).
                                        </p>
                                    </li>
                                    <li className="flex gap-4">
                                        <Zap className="text-gold shrink-0" size={20} />
                                        <p className="text-sm text-zinc-400 leading-relaxed">
                                            <strong className="text-white block uppercase tracking-widest text-[10px] mb-1">Tinta</strong>
                                            Epson Ultrachrome com 200 anos de durabilidade, sem cheiro, mais vida e mais cor.
                                        </p>
                                    </li>
                                    <li className="flex gap-4">
                                        <Zap className="text-gold shrink-0" size={20} />
                                        <p className="text-sm text-zinc-400 leading-relaxed">
                                            <strong className="text-white block uppercase tracking-widest text-[10px] mb-1">Impressão</strong>
                                            Epson Monna Lisa Evo Tre 16 de grandes formatos em FULL HD 4K.
                                        </p>
                                    </li>
                                </ul>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="glass p-8 text-center space-y-4">
                                    <ShieldCheck className="mx-auto text-gold" size={32} />
                                    <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-white">5 Anos de Garantia</p>
                                </div>
                                <div className="glass p-8 text-center space-y-4">
                                    <Award className="mx-auto text-gold" size={32} />
                                    <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-white">Certificado de Autenticidade</p>
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

                    <div className="grid md:grid-cols-3 gap-10 pt-20">
                        {[
                            {
                                title: "Borda Infinita",
                                desc: "O excesso de tecido é dobrado sobre a borda do chassi, criando uma continuidade da imagem que envolve toda a peça. Com proteção UV.",
                                image: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=800&auto=format&fit=crop"
                            },
                            {
                                title: "Moldura Canaleta",
                                desc: "Moldura estilo caixa com perfil de 5 cm de profundidade, fabricadas em madeira nobre de reflorestamento revestida.",
                                image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop"
                            },
                            {
                                title: "Premium com Vidro",
                                desc: "Acabamento com vidro float 3mm incolor de alta transparência. Obras que podem durar mais de 200 anos.",
                                image: "https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=800&auto=format&fit=crop"
                            }
                        ].map((type, i) => (
                            <div key={i} className="glass group overflow-hidden">
                                <div className="aspect-square overflow-hidden">
                                    <img src={type.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-60 group-hover:opacity-100" />
                                </div>
                                <div className="p-10 space-y-4">
                                    <h4 className="text-2xl font-serif text-white">{type.title}</h4>
                                    <p className="text-xs text-zinc-500 leading-relaxed uppercase tracking-wider">{type.desc}</p>
                                </div>
                            </div>
                        ))}
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
