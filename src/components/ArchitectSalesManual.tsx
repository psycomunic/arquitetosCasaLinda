import React, { useRef } from 'react';
// @ts-ignore
import html2pdf from 'html2pdf.js';
import { Download, TrendingUp } from 'lucide-react';

export const ArchitectSalesManual: React.FC = () => {
    const contentRef = useRef<HTMLDivElement>(null);

    const handleDownload = () => {
        const element = contentRef.current;
        const opt = {
            margin: 0,
            filename: 'Manual_Vendas_Casa_Linda.pdf',
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
                    <TrendingUp size={20} />
                </div>
                <div className="flex-1">
                    <h4 className="text-white text-sm font-bold uppercase tracking-wide">Manual de Vendas</h4>
                    <p className="text-zinc-500 text-xs mt-1">Dicas & Boas Práticas PDF</p>
                </div>
                <Download size={18} className="text-zinc-500 group-hover:text-gold transition-colors" />
            </button>

            {/* Hidden Content for PDF Generation */}
            <div className="fixed left-[-9999px] top-0">
                <div ref={contentRef} className="w-[210mm] min-h-[297mm] bg-white text-black p-[15mm] font-sans relative">

                    {/* Header */}
                    <div className="flex justify-between items-center border-b-2 border-[#C5A059] pb-6 mb-8">
                        <img src="/logo.png" alt="Casa Linda" className="h-10 object-contain filter brightness-0" />
                        <div className="text-right">
                            <h1 className="text-xl font-serif text-[#1a1a1a] uppercase tracking-widest">Manual de Vendas</h1>
                            <p className="text-[10px] text-[#666] uppercase tracking-[0.2em] mt-1">Boas Práticas para Arquitetos</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Intro */}
                        <div className="bg-[#f9f9f9] p-6 border-l-4 border-[#C5A059]">
                            <h2 className="text-sm font-bold text-[#1a1a1a] uppercase tracking-widest mb-2">Elevando o Valor do Seu Projeto</h2>
                            <p className="text-xs text-[#555] leading-relaxed">
                                Este guia foi desenhado para ajudar você a apresentar as obras da Casa Linda de forma valorizada, facilitando a aprovação pelo cliente final e garantindo uma composição estética impecável.
                            </p>
                        </div>

                        {/* 1. Ferramenta de Propostas */}
                        <section>
                            <h2 className="flex items-center gap-3 text-sm font-bold text-[#C5A059] uppercase tracking-widest mb-3">
                                <span className="w-8 h-[1px] bg-[#C5A059]"></span>
                                01. O Poder do Gerador de Propostas
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="border border-[#eee] p-4 rounded">
                                    <h3 className="text-xs font-bold text-[#1a1a1a] mb-2 uppercase">White Label (Sua Marca)</h3>
                                    <p className="text-[10px] text-[#555] leading-relaxed">
                                        As propostas geradas no dashboard saem com a <strong>sua logomarca</strong> e seus dados. Para o cliente, é uma curadoria exclusiva do seu escritório, não um catálogo de loja.
                                    </p>
                                </div>
                                <div className="border border-[#eee] p-4 rounded">
                                    <h3 className="text-xs font-bold text-[#1a1a1a] mb-2 uppercase">Agilidade Visual</h3>
                                    <p className="text-[10px] text-[#555] leading-relaxed">
                                        Use o gerador para criar rapidamente seleções de obras "P", "M" e "G". Apresentar opções visuais prontas acelera a decisão de compra em até 3x.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* 2. Argumentos de Venda */}
                        <section>
                            <h2 className="flex items-center gap-3 text-sm font-bold text-[#C5A059] uppercase tracking-widest mb-3">
                                <span className="w-8 h-[1px] bg-[#C5A059]"></span>
                                02. Argumentos que Vendem
                            </h2>
                            <ul className="space-y-3">
                                <li className="flex gap-3">
                                    <div className="w-6 h-6 rounded-full bg-[#1a1a1a] text-[#C5A059] flex items-center justify-center text-[10px] font-bold shrink-0">1</div>
                                    <div>
                                        <h3 className="text-xs font-bold text-[#1a1a1a] uppercase">Certificado de Autenticidade</h3>
                                        <p className="text-[10px] text-[#555] mt-1">Explique que não é apenas "decoração", é uma obra de arte com procedência e qualidade museológica.</p>
                                    </div>
                                </li>
                                <li className="flex gap-3">
                                    <div className="w-6 h-6 rounded-full bg-[#1a1a1a] text-[#C5A059] flex items-center justify-center text-[10px] font-bold shrink-0">2</div>
                                    <div>
                                        <h3 className="text-xs font-bold text-[#1a1a1a] uppercase">Curadoria Exclusiva</h3>
                                        <p className="text-[10px] text-[#555] mt-1">Ressalte que as dimensões e acabamentos foram pensados especificamente para a harmonia daquele ambiente.</p>
                                    </div>
                                </li>
                                <li className="flex gap-3">
                                    <div className="w-6 h-6 rounded-full bg-[#1a1a1a] text-[#C5A059] flex items-center justify-center text-[10px] font-bold shrink-0">3</div>
                                    <div>
                                        <h3 className="text-xs font-bold text-[#1a1a1a] uppercase">Marca Internacional</h3>
                                        <p className="text-[10px] text-[#555] mt-1">Mencione que a Casa Linda exporta para os EUA, chancelando a qualidade premium do produto.</p>
                                    </div>
                                </li>
                            </ul>
                        </section>

                         {/* 3. Dicas de Ouro */}
                         <section>
                            <h2 className="flex items-center gap-3 text-sm font-bold text-[#C5A059] uppercase tracking-widest mb-3">
                                <span className="w-8 h-[1px] bg-[#C5A059]"></span>
                                03. Dicas de Ouro para Fechamento
                            </h2>
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div className="bg-[#1a1a1a] p-4 text-white">
                                    <p className="text-[#C5A059] text-[10px] font-bold uppercase tracking-widest mb-2">Segurança</p>
                                    <p className="text-[9px]">Sempre valide as medidas antes de apresentar. Use nosso time de suporte se tiver dúvida.</p>
                                </div>
                                <div className="bg-[#1a1a1a] p-4 text-white">
                                    <p className="text-[#C5A059] text-[10px] font-bold uppercase tracking-widest mb-2">Escassez</p>
                                    <p className="text-[9px]">Obras de coleções limitadas podem esgotar. Use isso para acelerar a decisão.</p>
                                </div>
                                <div className="bg-[#1a1a1a] p-4 text-white">
                                    <p className="text-[#C5A059] text-[10px] font-bold uppercase tracking-widest mb-2">Facilidade</p>
                                    <p className="text-[9px]">Envie o link direto já com o carrinho montado para o WhatsApp do cliente.</p>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Footer - Moved closer */}
                    <div className="absolute bottom-[10mm] left-[15mm] right-[15mm] border-t border-[#eee] pt-4 flex justify-between items-center">
                        <p className="text-[9px] text-[#999] uppercase tracking-widest">Casa Linda Decorações - Material de Apoio ao Arquiteto</p>
                        <p className="text-[9px] text-[#999] uppercase tracking-widest">Página 1 de 1</p>
                    </div>

                </div>
            </div>
        </>
    );
};
