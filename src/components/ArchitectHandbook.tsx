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
                <div ref={contentRef} className="w-[210mm] min-h-[297mm] bg-white text-black p-[15mm] font-sans relative">

                    {/* Header */}
                    <div className="flex justify-between items-center border-b-2 border-[#C5A059] pb-8 mb-12">
                        <img src="/logo.png" alt="Casa Linda" className="h-12 object-contain filter brightness-0" />
                        <div className="text-right">
                            <h1 className="text-2xl font-serif text-[#1a1a1a] uppercase tracking-widest">Manual Interno</h1>
                            <p className="text-xs text-[#666] uppercase tracking-[0.2em] mt-1">Exclusividade e Alta Performance</p>
                        </div>
                    </div>

                    <div className="space-y-10">
                        {/* 1. Objetivo */}
                        <section>
                            <h2 className="flex items-center gap-3 text-lg font-bold text-[#C5A059] uppercase tracking-widest mb-4">
                                <span className="w-8 h-[1px] bg-[#C5A059]"></span>
                                01. Objetivo
                            </h2>
                            <p className="text-sm text-[#333] leading-relaxed text-justify">
                                Este documento orienta o time interno da Casa Linda sobre como atender arquitetos parceiros de forma profissional, padronizada e alinhada ao posicionamento premium da marca. Nosso foco é ser uma extensão técnica e estética do escritório do parceiro.
                            </p>
                        </section>

                        {/* 2. Princípios */}
                        <section className="bg-[#f9f9f9] p-6 border-l-4 border-[#C5A059]">
                            <h2 className="text-base font-bold text-[#1a1a1a] uppercase tracking-widest mb-4">Princípios de Atendimento</h2>
                            <ul className="space-y-3 text-sm text-[#444]">
                                <li className="flex items-start gap-3">
                                    <span className="text-[#C5A059] font-bold">•</span>
                                    <span>Atendimento consultivo, não vendedor.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-[#C5A059] font-bold">•</span>
                                    <span>Linguagem clara, elegante e segura.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-[#C5A059] font-bold">•</span>
                                    <span>Nunca prometer prazos ou valores sem validação.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-[#C5A059] font-bold">•</span>
                                    <span>Tratar o arquiteto como parceiro estratégico.</span>
                                </li>
                            </ul>
                        </section>

                        {/* 3. Fluxo e Scripts */}
                        <div className="grid grid-cols-2 gap-8">
                            <section>
                                <h2 className="text-base font-bold text-[#1a1a1a] uppercase tracking-widest mb-4">Fluxo de Atendimento</h2>
                                <ol className="space-y-2 text-sm text-[#333] list-decimal list-inside marker:text-[#C5A059] marker:font-bold">
                                    <li>Recebimento do contato.</li>
                                    <li>Identificação da necessidade (indicação, venda assistida ou projeto VIP).</li>
                                    <li>Direcionamento correto.</li>
                                    <li>Acompanhamento (Follow-up).</li>
                                </ol>
                            </section>

                            <section>
                                <h2 className="text-base font-bold text-[#1a1a1a] uppercase tracking-widest mb-4">Scripts de Contato</h2>
                                <div className="italic text-sm text-[#555] border p-4 border-[#eee]">
                                    “Olá, tudo bem? Aqui é da Casa Linda Decorações. Recebemos seu contato como arquiteto parceiro e queremos entender melhor seu projeto para te apoiar da melhor forma.”
                                </div>
                            </section>
                        </div>

                        {/* 4. Playbook Ativação */}
                        <section>
                            <h2 className="flex items-center gap-3 text-lg font-bold text-[#C5A059] uppercase tracking-widest mb-6">
                                <span className="w-8 h-[1px] bg-[#C5A059]"></span>
                                02. Playbook de Ativação (30 Dias)
                            </h2>
                            <div className="grid grid-cols-4 gap-4">
                                {[
                                    { title: "Semana 1", desc: "Boas-vindas + Guia do Arquiteto" },
                                    { title: "Semana 2", desc: "Contato ativo para primeira indicação" },
                                    { title: "Semana 3", desc: "Apresentação de projetos personalizados" },
                                    { title: "Semana 4", desc: "Follow-up e fechamento da 1ª venda" }
                                ].map((item, i) => (
                                    <div key={i} className="bg-[#1a1a1a] p-4 text-white text-center">
                                        <p className="text-[#C5A059] text-xs font-bold uppercase tracking-widest mb-2">{item.title}</p>
                                        <p className="text-[10px] uppercase leading-tight">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* 5. Projetos e Erros */}
                        <section className="grid grid-cols-2 gap-10">
                            <div>
                                <h3 className="text-sm font-bold text-[#1a1a1a] uppercase tracking-widest mb-3">Projetos Personalizados</h3>
                                <p className="text-xs text-[#444] leading-relaxed text-justify">
                                    Sempre solicitar briefing completo: ambiente, medidas, conceito, prazo desejado. Encaminhar para o time responsável antes de qualquer proposta.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-[#b91c1c] uppercase tracking-widest mb-3">Erros a Evitar</h3>
                                <ul className="space-y-1 text-xs text-[#444]">
                                    <li>• Responder de forma genérica.</li>
                                    <li>• Tratar arquiteto como cliente final.</li>
                                    <li>• Prometer comissão sem validação.</li>
                                    <li>• Demorar no retorno.</li>
                                </ul>
                            </div>
                        </section>

                        {/* Footer */}
                        <div className="absolute bottom-[15mm] left-[15mm] right-[15mm] border-t border-[#eee] pt-6 flex justify-between items-center">
                            <p className="text-[10px] text-[#999] uppercase tracking-widest">Casa Linda Decorações - Documento Confidencial</p>
                            <p className="text-[10px] text-[#999] uppercase tracking-widest">Página 1 de 1</p>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};
