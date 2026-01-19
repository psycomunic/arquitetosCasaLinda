import React from 'react';
import { PublicLayout } from '../layouts/PublicLayout';
import { MessageCircle, Phone, Mail, Clock } from 'lucide-react';

export const SuportePrivate: React.FC = () => {
    return (
        <PublicLayout>
            <section className="pt-40 pb-20 px-6">
                <div className="max-w-4xl mx-auto space-y-20">
                    <div className="text-center space-y-8">
                        <h2 className="text-gold text-[10px] uppercase tracking-[0.6em] font-bold">Atendimento Exclusivo</h2>
                        <h1 className="text-6xl md:text-8xl font-serif leading-none text-white">Suporte</h1>
                        <p className="text-zinc-500 font-light text-xl leading-relaxed">
                            Canal de comunicação direta para agilizar suas cotações e tirar dúvidas técnicas.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {[
                            { icon: <MessageCircle className="text-gold" />, title: "WhatsApp Business", value: "(47) 9722-0810", desc: "Acesso imediato para consultoria técnica." },
                            { icon: <MessageCircle className="text-gold" />, title: "WhatsApp Dedicado", value: "(47) 99686-0431", desc: "Suporte comercial exclusivo." },
                            { icon: <Mail className="text-gold" />, title: "E-mail Private", value: "suporte@casalindadecoracoes.com", desc: "Para documentações e formalizações." },
                            { icon: <Clock className="text-gold" />, title: "Horário", value: "Seg - Sex, 9h as 18h", desc: "Equipe técnica pronta para atender." }
                        ].map((item, i) => (
                            <div key={i} className="glass p-10 space-y-6">
                                <div className="p-4 glass-dark w-fit rounded-xl border-white/5">{item.icon}</div>
                                <div>
                                    <h4 className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-2">{item.title}</h4>
                                    <p className="text-xl font-serif text-white">{item.value}</p>
                                </div>
                                <p className="text-[10px] text-zinc-600 uppercase tracking-[0.2em]">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="glass p-12 text-center space-y-8">
                        <h3 className="text-2xl font-serif text-white italic">Precisa de uma amostra física?</h3>
                        <p className="text-zinc-500 text-xs uppercase tracking-widest leading-relaxed max-w-lg mx-auto">
                            Enviamos kits de amostras de tecido canvas e molduras para o seu escritório para que você possa apresentar aos seus clientes com total segurança.
                        </p>
                        <button className="bg-white text-black px-12 py-5 text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-gold transition-all">Solicitar Kit de Amostras</button>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
};
