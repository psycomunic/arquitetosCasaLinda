import React, { useRef } from 'react';
// @ts-ignore
import html2pdf from 'html2pdf.js';
import { Download, HelpCircle } from 'lucide-react';

export const InternalFAQ: React.FC = () => {
    const contentRef = useRef<HTMLDivElement>(null);

    const handleDownload = () => {
        const element = contentRef.current;
        const opt = {
            margin: 0,
            filename: 'FAQ_Interno_Casa_Linda.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save();
    };

    const faqItems = [
        { q: "Como funciona a comissão?", a: "A Casa Linda trabalha com comissão progressiva de 15% a 20%, baseada no volume mensal de vendas. Tudo é calculado automaticamente e o arquiteto acompanha em seu dashboard exclusivo." },
        { q: "Preciso fechar a venda com o cliente?", a: "Não. O arquiteto pode apenas indicar a Casa Linda ou optar pela venda assistida. Nos projetos especiais, a Casa Linda cuida de todo o processo." },
        { q: "Posso criar quadros e espelhos sob medida?", a: "Sim. Trabalhamos com quadros e espelhos personalizados, desenvolvidos conforme o projeto do arquiteto." },
        { q: "Vocês fazem artes exclusivas?", a: "Sim. Contamos com artista residente (Rod) para criação de artes autorais exclusivas, desenvolvidas a partir do briefing do arquiteto." },
        { q: "A comissão substitui meu honorário?", a: "Não. A comissão é uma remuneração adicional e não interfere no contrato do arquiteto com o cliente final." },
        { q: "Como sei quanto vou receber?", a: "Todas as vendas e comissões ficam disponíveis no dashboard do arquiteto, com total transparência." },
        { q: "Quando recebo o pagamento?", a: "O pagamento das comissões é realizado mensalmente, após a confirmação das vendas." },
        { q: "Vocês entregam em todo o Brasil?", a: "Sim. Atendemos todo o Brasil e também realizamos exportações para os Estados Unidos." },
        { q: "O cliente recebe certificado?", a: "Sim. Todas as obras acompanham Certificado de Autenticidade, reforçando exclusividade e valor do projeto." },
        { q: "Posso perder meu nível de comissão?", a: "Sim. O nível é reavaliado mensalmente de acordo com o volume de vendas, garantindo um sistema justo." },
        { q: "Posso usar a marca Casa Linda nos meus projetos?", a: "Sim, desde que respeitadas as diretrizes do Programa de Parcerias Casa Linda." },
        { q: "Quem cuida do atendimento ao cliente final?", a: "A Casa Linda assume todo o atendimento operacional ao cliente final, garantindo segurança ao arquiteto." }
    ];

    return (
        <>
            <button
                onClick={handleDownload}
                className="group flex items-center gap-3 px-6 py-4 bg-white/5 border border-white/10 hover:border-gold/50 hover:bg-gold/10 transition-all rounded-xl w-full text-left"
            >
                <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold group-hover:scale-110 transition-transform">
                    <HelpCircle size={20} />
                </div>
                <div className="flex-1">
                    <h4 className="text-white text-sm font-bold uppercase tracking-wide">FAQ de Atendimento</h4>
                    <p className="text-zinc-500 text-xs mt-1">Dúvidas Frequentes PDF</p>
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
                            <h1 className="text-xl font-serif text-[#1a1a1a] uppercase tracking-widest">FAQ Interno</h1>
                            <p className="text-[10px] text-[#666] uppercase tracking-[0.2em] mt-1">Atendimento a Arquitetos</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                        {faqItems.map((item, index) => (
                            <div key={index} className="space-y-2 break-inside-avoid">
                                <h3 className="text-xs font-bold text-[#C5A059] uppercase tracking-widest flex items-start gap-2">
                                    <span className="text-[#1a1a1a] opacity-30 select-none">{String(index + 1).padStart(2, '0')}.</span>
                                    {item.q}
                                </h3>
                                <p className="text-[10px] text-[#444] leading-relaxed text-justify border-l-2 border-[#eee] pl-3">
                                    {item.a}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="absolute bottom-[10mm] left-[15mm] right-[15mm] border-t border-[#eee] pt-4 flex justify-between items-center">
                        <p className="text-[9px] text-[#999] uppercase tracking-widest">Casa Linda Decorações - Uso Interno</p>
                        <p className="text-[9px] text-[#999] uppercase tracking-widest">Página 1 de 1</p>
                    </div>

                </div>
            </div>
        </>
    );
};
