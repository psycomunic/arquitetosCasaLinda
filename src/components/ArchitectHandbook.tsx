import React, { useRef } from 'react';
// @ts-ignore
import html2pdf from 'html2pdf.js';
import { Download, FileText } from 'lucide-react';

export const ArchitectHandbook: React.FC = () => {
    const contentRef = useRef<HTMLDivElement>(null);

    const handleDownload = () => {
        const element = contentRef.current;
        const opt = {
            margin: 0,
            filename: 'Manual_Casa_Linda_Arquitetos.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save();
    };

    return (
        <>
            <button
                onClick={handleDownload}
                className="group flex items-center gap-3 px-6 py-4 bg-white/5 border border-white/10 hover:border-gold/50 hover:bg-gold/10 transition-all rounded-xl w-full text-left"
            >
                <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold group-hover:scale-110 transition-transform">
                    <FileText size={20} />
                </div>
                <div className="flex-1">
                    <h4 className="text-white text-sm font-bold uppercase tracking-wide">Playbook de Atendimento</h4>
                    <p className="text-zinc-500 text-xs mt-1">Baixar PDF Oficial</p>
                </div>
                <Download size={18} className="text-zinc-500 group-hover:text-gold transition-colors" />
            </button>

            {/* Hidden Content for PDF Generation */}
            <div className="fixed left-[-9999px] top-0">
                <div ref={contentRef} className="w-[210mm] bg-white text-black p-[10mm] font-sans relative">

                    {/* Header */}
                    <div className="flex justify-between items-center border-b-2 border-[#C5A059] pb-6 mb-8">
                        <img src="/logo.png" alt="Casa Linda" className="h-10 object-contain filter brightness-0" />
                        <div className="text-right">
                            <h1 className="text-xl font-serif text-[#1a1a1a] uppercase tracking-widest">Manual Interno</h1>
                            <p className="text-[10px] text-[#666] uppercase tracking-[0.2em] mt-1">Exclusividade e Alta Performance</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* 1. Objetivo */}
                        <section>
                            <h2 className="flex items-center gap-3 text-sm font-bold text-[#C5A059] uppercase tracking-widest mb-2">
                                <span className="w-8 h-[1px] bg-[#C5A059]"></span>
                                01. Objetivo
                            </h2>
                            <p className="text-xs text-[#333] leading-relaxed text-justify">
                                Este documento orienta o time interno da Casa Linda sobre como atender arquitetos parceiros de forma profissional, padronizada e alinhada ao posicionamento premium da marca. Nosso foco é ser uma extensão técnica e estética do escritório do parceiro.
                            </p>
                        </section>

                        {/* 2. Princípios - Two Columns to save space */}
                        <section className="bg-[#f9f9f9] p-4 border-l-4 border-[#C5A059]">
                            <h2 className="text-sm font-bold text-[#1a1a1a] uppercase tracking-widest mb-3">Princípios de Atendimento</h2>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                <ul className="space-y-2 text-xs text-[#444]">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#C5A059] font-bold">•</span>
                                        <span>Atendimento consultivo, não vendedor.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#C5A059] font-bold">•</span>
                                        <span>Linguagem clara, elegante e segura.</span>
                                    </li>
                                </ul>
                                <ul className="space-y-2 text-xs text-[#444]">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#C5A059] font-bold">•</span>
                                        <span>Validação rigorosa de prazos.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#C5A059] font-bold">•</span>
                                        <span>Parceria e visão de longo prazo.</span>
                                    </li>
                                </ul>
                            </div>
                        </section>

                        {/* 3. Fluxo e Scripts */}
                        <div className="grid grid-cols-2 gap-6">
                            <section>
                                <h2 className="text-sm font-bold text-[#1a1a1a] uppercase tracking-widest mb-2">Fluxo de Atendimento</h2>
                                <ol className="space-y-1 text-xs text-[#333] list-decimal list-inside marker:text-[#C5A059] marker:font-bold">
                                    <li>Recebimento do contato.</li>
                                    <li>Identificação da necessidade.</li>
                                    <li>Direcionamento correto do lead.</li>
                                    <li>Acompanhamento (Follow-up).</li>
                                </ol>
                            </section>

                            <section>
                                <h2 className="text-sm font-bold text-[#1a1a1a] uppercase tracking-widest mb-2">Scripts de Contato</h2>
                                <div className="italic text-xs text-[#555] border p-3 border-[#eee] leading-relaxed">
                                    “Olá, tudo bem? Aqui é da Casa Linda Decorações. Recebemos seu contato como arquiteto parceiro e queremos entender melhor seu projeto para te apoiar.”
                                </div>
                            </section>
                        </div>

                        {/* 4. Playbook Ativação */}
                        <section>
                            <h2 className="flex items-center gap-3 text-sm font-bold text-[#C5A059] uppercase tracking-widest mb-4">
                                <span className="w-8 h-[1px] bg-[#C5A059]"></span>
                                02. Playbook de Ativação (30 Dias)
                            </h2>
                            <div className="grid grid-cols-4 gap-3">
                                {[
                                    { title: "Semana 1", desc: "Boas-vindas + Guia" },
                                    { title: "Semana 2", desc: "Contato ativo inic." },
                                    { title: "Semana 3", desc: "Projetos Person." },
                                    { title: "Semana 4", desc: "Fechamento 1ª venda" }
                                ].map((item, i) => (
                                    <div key={i} className="bg-[#1a1a1a] p-3 text-white text-center">
                                        <p className="text-[#C5A059] text-[10px] font-bold uppercase tracking-widest mb-1">{item.title}</p>
                                        <p className="text-[9px] uppercase leading-tight">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* 5. Projetos e Erros */}
                        <section className="grid grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-xs font-bold text-[#1a1a1a] uppercase tracking-widest mb-2">Projetos Personalizados</h3>
                                <p className="text-[10px] text-[#444] leading-relaxed text-justify">
                                    Solicitar briefing completo: ambiente, medidas, conceito, prazo. Encaminhar para o time responsável antes de qualquer proposta comercial.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-xs font-bold text-[#b91c1c] uppercase tracking-widest mb-2">Erros a Evitar</h3>
                                <ul className="space-y-1 text-[10px] text-[#444]">
                                    <li>• Responder de forma genérica.</li>
                                    <li>• Tratar arquiteto como cliente final.</li>
                                    <li>• Prometer comissão sem validação.</li>
                                </ul>
                            </div>
                        </section>

                        {/* Footer - Moved closer */}
                        <div className="border-t border-[#eee] pt-4 mt-8 flex justify-between items-center">
                            <p className="text-[9px] text-[#999] uppercase tracking-widest">Casa Linda Decorações - Documento Confidencial</p>
                            <p className="text-[9px] text-[#999] uppercase tracking-widest">Página 1 de 1</p>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};
