import React, { useRef } from 'react';
// @ts-ignore
import html2pdf from 'html2pdf.js';
import { Download, BookOpen } from 'lucide-react';

export const PartnerGuide: React.FC = () => {
    const contentRef = useRef<HTMLDivElement>(null);

    const handleDownload = () => {
        const element = contentRef.current;
        const opt = {
            margin: 0,
            filename: 'Guia_Arquiteto_Parceiro_Casa_Linda.pdf',
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
                    <BookOpen size={20} />
                </div>
                <div className="flex-1">
                    <h4 className="text-white text-sm font-bold uppercase tracking-wide">Guia Completo do Arquiteto</h4>
                    <p className="text-zinc-500 text-xs mt-1">Manual de Parceria PDF</p>
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
                            <h1 className="text-xl font-serif text-[#1a1a1a] uppercase tracking-widest">Guia do Parceiro</h1>
                            <p className="text-[10px] text-[#666] uppercase tracking-[0.2em] mt-1">Casa Linda Decorações</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* 1. Sobre a Casa Linda */}
                        <section>
                            <h2 className="text-sm font-bold text-[#C5A059] uppercase tracking-widest mb-1">01. Sobre a Casa  Linda</h2>
                            <p className="text-[10px] text-[#333] leading-relaxed text-justify">
                                A Casa Linda é a maior marca de quadros decorativos do Brasil, com atuação nacional e internacional, exportando para os Estados Unidos. Todas as obras acompanham Certificado de Autenticidade, garantindo procedência, exclusividade e alto valor percebido nos projetos.
                            </p>
                        </section>

                        {/* 2. O Programa de Parcerias */}
                        <section>
                            <h2 className="text-sm font-bold text-[#C5A059] uppercase tracking-widest mb-1">02. O Programa de Parcerias</h2>
                            <p className="text-[10px] text-[#333] leading-relaxed text-justify">
                                O Programa de Parcerias Casa Linda foi criado para arquitetos e designers que desejam indicar uma marca consolidada, elevar seus projetos e gerar renda adicional de forma profissional e transparente.
                            </p>
                        </section>

                        {/* 3. Modelos de Comissão */}
                        <section className="bg-[#f9f9f9] p-3 border-l-4 border-[#C5A059]">
                            <h2 className="text-sm font-bold text-[#1a1a1a] uppercase tracking-widest mb-2">03. Modelos de Comissão</h2>
                            <p className="text-[10px] text-[#333] mb-2">A comissão é progressiva e baseada no volume mensal de vendas:</p>
                            <div className="grid grid-cols-3 gap-2 text-center">
                                <div className="bg-[#1a1a1a] text-white p-2 rounded">
                                    <p className="text-[9px] uppercase tracking-widest text-[#C5A059]">Parceiro Casa Linda</p>
                                    <p className="text-lg font-bold">15%</p>
                                </div>
                                <div className="bg-[#1a1a1a] text-white p-2 rounded">
                                    <p className="text-[9px] uppercase tracking-widest text-[#C5A059]">Parceiro Ativo</p>
                                    <p className="text-lg font-bold">17%</p>
                                </div>
                                <div className="bg-[#1a1a1a] text-white p-2 rounded">
                                    <p className="text-[9px] uppercase tracking-widest text-[#C5A059]">Parceiro Premium</p>
                                    <p className="text-lg font-bold">20%</p>
                                </div>
                            </div>
                        </section>

                        {/* 4. Mecânicas de Venda & 7. Fluxo */}
                        <div className="grid grid-cols-2 gap-6">
                            <section>
                                <h2 className="text-sm font-bold text-[#1a1a1a] uppercase tracking-widest mb-2">04. Mecânicas de Venda</h2>
                                <ul className="space-y-2 text-[10px] text-[#333]">
                                    <li><strong>• Indicação Direta:</strong> Cliente compra online com seu link/cupom.</li>
                                    <li><strong>• Venda Assistida:</strong> Time Casa Linda apoia na escolha e fechamento.</li>
                                    <li><strong>• Pedido Direto:</strong> Para projetos especiais e sob medida.</li>
                                </ul>
                            </section>
                            <section>
                                <h2 className="text-sm font-bold text-[#1a1a1a] uppercase tracking-widest mb-2">07. Fluxo de Atendimento</h2>
                                <p className="text-[10px] text-[#333] mb-1">O time Casa Linda cuida de todo o suporte, basta o arquiteto:</p>
                                <ul className="space-y-1 text-[10px] text-[#333]">
                                    <li>• Indicar a loja</li>
                                    <li>• Solicitar venda assistida</li>
                                    <li>• Solicitar personalização</li>
                                </ul>
                            </section>
                        </div>

                        {/* 5, 6, 8, 9, 10, 11 - Compact Grid */}
                        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                            <section>
                                <h2 className="text-xs font-bold text-[#1a1a1a] uppercase tracking-widest mb-1">05. Sob Medida</h2>
                                <p className="text-[9px] text-[#333]">Produzimos quadros e espelhos em diversos tamanhos e formatos, adequando cada peça ao ambiente.</p>
                            </section>

                            <section>
                                <h2 className="text-xs font-bold text-[#1a1a1a] uppercase tracking-widest mb-1">06. Artes Exclusivas</h2>
                                <p className="text-[9px] text-[#333]">Artista residente (Rod) cria artes autorais a partir do seu briefing.</p>
                            </section>

                            <section>
                                <h2 className="text-xs font-bold text-[#1a1a1a] uppercase tracking-widest mb-1">08. Dashboard</h2>
                                <p className="text-[9px] text-[#333]">Acesso exclusivo para acompanhar vendas, comissões e ranking.</p>
                            </section>

                            <section>
                                <h2 className="text-xs font-bold text-[#1a1a1a] uppercase tracking-widest mb-1">09. Pagamentos</h2>
                                <p className="text-[9px] text-[#333]">Mensalmente após confirmação das vendas e notas fiscais.</p>
                            </section>

                            <section className="col-span-2 bg-[#f9f9f9] p-3 border border-[#eee]">
                                <h2 className="text-xs font-bold text-[#1a1a1a] uppercase tracking-widest mb-2">10. Perguntas Frequentes & 11. Visão</h2>
                                <ul className="grid grid-cols-2 gap-2 text-[9px] text-[#333]">
                                    <li>• Comissão substitui honorários? Não.</li>
                                    <li>• Posso personalizar? Sim.</li>
                                    <li>• Entrega em todo BR? Sim (+EUA).</li>
                                    <li>• Tem certificado? Sim.</li>
                                </ul>
                                <p className="mt-3 text-[9px] text-[#C5A059] font-bold uppercase tracking-widest text-center border-t border-[#ddd] pt-2">
                                    "Nosso objetivo é ser uma extensão criativa e operacional dos seus projetos."
                                </p>
                            </section>
                        </div>
                    </div>

                    {/* Footer - Moved closer */}
                    <div className="border-t border-[#eee] pt-4 mt-6 flex justify-between items-center">
                        <p className="text-[9px] text-[#999] uppercase tracking-widest">Casa Linda Decorações - Guia do Parceiro</p>
                        <p className="text-[9px] text-[#999] uppercase tracking-widest">Página 1 de 1</p>
                    </div>

                </div>
            </div>
        </>
    );
};
