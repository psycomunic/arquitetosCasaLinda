import React, { useRef } from 'react';
// @ts-ignore
import html2pdf from 'html2pdf.js';
import { Download, Target } from 'lucide-react';

export const SalesMechanics: React.FC = () => {
    const contentRef = useRef<HTMLDivElement>(null);

    const handleDownload = () => {
        const element = contentRef.current;
        const opt = {
            margin: 0,
            filename: 'Mecanicas_de_Venda_Casa_Linda.pdf',
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
                    <Target size={20} />
                </div>
                <div className="flex-1">
                    <h4 className="text-white text-sm font-bold uppercase tracking-wide">Mecânicas de Venda</h4>
                    <p className="text-zinc-500 text-xs mt-1">Guia Prático PDF</p>
                </div>
                <Download size={18} className="text-zinc-500 group-hover:text-gold transition-colors" />
            </button>

            {/* Hidden Content for PDF Generation */}
            <div className="fixed left-[-9999px] top-0">
                <div ref={contentRef} className="w-[210mm] min-h-[297mm] bg-white text-black p-[15mm] font-sans relative">

                    {/* Header */}
                    <div className="flex justify-between items-center border-b-2 border-[#C5A059] pb-6 mb-12">
                        <img src="/logo.png" alt="Casa Linda" className="h-10 object-contain filter brightness-0" />
                        <div className="text-right">
                            <h1 className="text-xl font-serif text-[#1a1a1a] uppercase tracking-widest">Mecânicas de Venda</h1>
                            <p className="text-[10px] text-[#666] uppercase tracking-[0.2em] mt-1">Modelo Híbrido de Parceria</p>
                        </div>
                    </div>

                    <div className="space-y-12">
                        <section>
                            <h2 className="flex items-center gap-3 text-lg font-bold text-[#C5A059] uppercase tracking-widest mb-6">
                                <span className="w-8 h-[1px] bg-[#C5A059]"></span>
                                Modelos Disponíveis
                            </h2>
                            <p className="text-sm text-[#333] mb-8 leading-relaxed">
                                A Casa Linda trabalha com um modelo híbrido flexível, desenhado para se adaptar ao fluxo de trabalho do seu escritório.
                            </p>

                            <div className="space-y-6">
                                {/* 1 */}
                                <div className="bg-[#f9f9f9] p-6 border-l-4 border-[#C5A059]">
                                    <h3 className="text-base font-bold text-[#1a1a1a] uppercase tracking-widest mb-2">1. Indicação Direta ao Site</h3>
                                    <p className="text-xs text-[#555] leading-relaxed">
                                        O cliente compra online diretamente pelo e-commerce utilizando seu <strong>link exclusivo</strong> ou <strong>cupom de desconto</strong>. A comissão é atribuída automaticamente ao seu perfil.
                                    </p>
                                </div>

                                {/* 2 */}
                                <div className="bg-[#f9f9f9] p-6 border-l-4 border-[#C5A059]">
                                    <h3 className="text-base font-bold text-[#1a1a1a] uppercase tracking-widest mb-2">2. Venda Assistida</h3>
                                    <p className="text-xs text-[#555] leading-relaxed">
                                        O time de concierges da Casa Linda apoia você e seu cliente na escolha das obras, definição de medidas, simulações no ambiente e fechamento do pedido. Ideal para clientes que precisam de mais segurança na escolha.
                                    </p>
                                </div>

                                {/* 3 */}
                                <div className="bg-[#f9f9f9] p-6 border-l-4 border-[#C5A059]">
                                    <h3 className="text-base font-bold text-[#1a1a1a] uppercase tracking-widest mb-2">3. Pedido Direto (Projetos Especiais)</h3>
                                    <p className="text-xs text-[#555] leading-relaxed">
                                        Para obras sob medida, espelhos personalizados, composições complexas e projetos autorais com nosso artista residente. O atendimento é 100% personalizado para atender as especificidades do projeto arquitetônico.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="bg-[#1a1a1a] text-white p-8 rounded-lg text-center mt-12">
                             <h3 className="text-sm font-bold text-[#C5A059] uppercase tracking-widest mb-3">Flexibilidade Total</h3>
                             <p className="text-xs leading-relaxed max-w-lg mx-auto">
                                 Você pode alternar entre os modelos conforme a necessidade de cada cliente ou projeto, mantendo sempre a transparência e segurança da sua comissão.
                             </p>
                        </section>
                    </div>

                    {/* Footer */}
                    <div className="absolute bottom-[15mm] left-[15mm] right-[15mm] border-t border-[#eee] pt-6 flex justify-between items-center">
                        <p className="text-[10px] text-[#999] uppercase tracking-widest">Casa Linda Decorações - Documento Interno</p>
                        <p className="text-[10px] text-[#999] uppercase tracking-widest">Página 1 de 1</p>
                    </div>
                </div>
            </div>
        </>
    );
};
