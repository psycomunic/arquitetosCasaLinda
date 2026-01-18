import React from 'react';
import { PublicLayout } from '../layouts/PublicLayout';
import { Leaf, Trees, Heart, ShieldCheck } from 'lucide-react';

export const Sustentabilidade: React.FC = () => {
    return (
        <PublicLayout>
            <section className="pt-40 pb-20 px-6">
                <div className="max-w-7xl mx-auto space-y-32">
                    <div className="text-center space-y-8">
                        <h2 className="text-gold text-[10px] uppercase tracking-[0.6em] font-bold">Compromisso Ético</h2>
                        <h1 className="text-6xl md:text-[7rem] font-serif leading-none text-white">Sustentabilidade</h1>
                        <p className="text-zinc-500 font-light text-xl max-w-3xl mx-auto leading-relaxed">
                            Aliamos a sofisticação da arte à preservação ambiental. Cada peça é um reflexo do nosso respeito pela natureza.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-12">
                        {[
                            {
                                icon: <Trees size={40} />,
                                title: "Madeira Nobre Reflorestada",
                                desc: "Utilizamos exclusivamente madeira nobre tratada proveniente de reflorestamento, garantindo a integridade estrutural do chassi sem agredir biomas nativos."
                            },
                            {
                                icon: <Leaf size={40} />,
                                title: "Insumos Eco-Conscientes",
                                desc: "Nossas tintas Epson Ultrachrome são livres de odores e compostas por pigmentos que não agridem a saúde do ambiente ou do usuário."
                            },
                            {
                                icon: <ShieldCheck size={40} />,
                                title: "Durabilidade Geracional",
                                desc: "O maior pilar da sustentabilidade é a longevidade. Criamos obras feitas para durar mais de 200 anos, evitando o descarte e o consumo desenfreado."
                            }
                        ].map((item, i) => (
                            <div key={i} className="glass p-12 space-y-8 group hover:-translate-y-2 transition-all">
                                <div className="text-gold group-hover:scale-110 transition-transform">{item.icon}</div>
                                <h3 className="text-2xl font-serif text-white">{item.title}</h3>
                                <p className="text-zinc-500 text-sm leading-relaxed uppercase tracking-widest">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="grid md:grid-cols-2 gap-24 items-center">
                        <div className="relative aspect-square overflow-hidden rounded-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1000&auto=format&fit=crop"
                                className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity duration-1000"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-canvas to-transparent"></div>
                        </div>
                        <div className="space-y-10">
                            <h3 className="text-gold text-[10px] uppercase tracking-[0.6em] font-bold">Produção Local</h3>
                            <h2 className="text-5xl font-serif text-white uppercase italic">Feito com Amor no Brasil.</h2>
                            <p className="text-zinc-500 font-light text-lg italic leading-relaxed">
                                "Nossa produção é feita artesanalmente com amor, o que garante que cada quadro seja único e especial. Cada peça é cuidadosamente feita à mão por nossos artesãos."
                            </p>
                            <div className="flex items-center gap-4 text-white">
                                <Heart className="text-red-500 fill-red-500" size={20} />
                                <span className="text-[10px] uppercase tracking-[0.4em] font-bold">Artesanato Nacional de Elite</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
};
