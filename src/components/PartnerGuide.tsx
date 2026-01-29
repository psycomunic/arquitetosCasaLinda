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
            filename: 'Programa_Comissoes_Casa_Linda.pdf',
            image: { type: 'jpeg' as const, quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
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
                    <h4 className="text-white text-sm font-bold uppercase tracking-wide">Programa de Comissões</h4>
                    <p className="text-zinc-500 text-xs mt-1">Baixar PDF Oficial</p>
                </div>
                <Download size={18} className="text-zinc-500 group-hover:text-gold transition-colors" />
            </button>

            {/* Hidden Content for PDF Generation */}
            <div className="fixed left-[-9999px] top-0">
                <div ref={contentRef} className="w-[210mm] h-[297mm] bg-white text-black p-[15mm] font-sans relative flex flex-col justify-between overflow-hidden">

                    <div>
                        {/* Header */}
                        <div className="flex justify-between items-end border-b-2 border-[#C5A059] pb-4 mb-6">
                            <img src="/logo.png" alt="Casa Linda" className="h-10 object-contain filter brightness-0" />
                            <div className="text-right">
                                <h1 className="text-xl font-serif text-[#1a1a1a] uppercase tracking-widest leading-none">Programa de<br />Comissões</h1>
                                <p className="text-[10px] text-[#666] uppercase tracking-[0.2em] mt-1">Casa Linda Decorações</p>
                            </div>
                        </div>

                        {/* Intro */}
                        <div className="mb-6">
                            <p className="text-xs text-[#333] leading-relaxed text-justify">
                                Esta tabela foi desenhada para refletir a realidade dos projetos arquitetônicos, permitindo
                                evolução rápida, metas acessíveis e estímulo contínuo à parceria.
                            </p>
                        </div>

                        {/* Tabela de Progressão */}
                        <section className="mb-8">
                            <h2 className="text-sm font-bold text-[#C5A059] uppercase tracking-widest mb-4 border-l-4 border-[#C5A059] pl-3">Tabela de Progressão Mensal</h2>

                            <div className="w-full bg-[#f8f8f8] rounded-lg overflow-hidden border border-[#eee]">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-[#1a1a1a] text-white">
                                            <th className="p-2 text-[10px] uppercase tracking-wider font-semibold w-2/3">Volume de Vendas Mensal</th>
                                            <th className="p-2 text-[10px] uppercase tracking-wider font-semibold text-right">Comissão</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-xs text-[#333]">
                                        <tr className="border-b border-[#ddd]">
                                            <td className="p-2 font-medium">Até R$ 5.999</td>
                                            <td className="p-2 text-right font-bold text-[#C5A059]">15%</td>
                                        </tr>
                                        <tr className="border-b border-[#ddd] bg-white">
                                            <td className="p-2 font-medium">De R$ 6.000 a R$ 11.999</td>
                                            <td className="p-2 text-right font-bold text-[#C5A059]">16%</td>
                                        </tr>
                                        <tr className="border-b border-[#ddd]">
                                            <td className="p-2 font-medium">De R$ 12.000 a R$ 19.999</td>
                                            <td className="p-2 text-right font-bold text-[#C5A059]">17%</td>
                                        </tr>
                                        <tr className="border-b border-[#ddd] bg-white">
                                            <td className="p-2 font-medium">De R$ 20.000 a R$ 29.999</td>
                                            <td className="p-2 text-right font-bold text-[#C5A059]">18%</td>
                                        </tr>
                                        <tr className="border-b border-[#ddd]">
                                            <td className="p-2 font-medium">De R$ 30.000 a R$ 39.999</td>
                                            <td className="p-2 text-right font-bold text-[#C5A059]">19%</td>
                                        </tr>
                                        <tr className="bg-[#C5A059]/10">
                                            <td className="p-2 font-bold text-[#1a1a1a]">A partir de R$ 40.000</td>
                                            <td className="p-2 text-right font-bold text-[#1a1a1a] text-sm">20%</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        {/* Regras Importantes */}
                        <section className="mb-6">
                            <h2 className="text-sm font-bold text-[#1a1a1a] uppercase tracking-widest mb-3 border-l-4 border-[#1a1a1a] pl-3">Regras Importantes</h2>
                            <ul className="space-y-2">
                                {[
                                    "A comissão é calculada sobre vendas confirmadas no mês.",
                                    "A progressão é automática e reavaliada mensalmente.",
                                    "Caso o volume diminua, o nível retorna ao correspondente, sem penalidades.",
                                    "Não existem metas mínimas obrigatórias.",
                                    "Projetos personalizados e VIP podem ter condições especiais."
                                ].map((rule, idx) => (
                                    <li key={idx} className="text-[10px] text-[#333] flex items-start gap-2">
                                        <span className="text-[#C5A059] font-bold">•</span>
                                        {rule}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </div>

                    <div>
                        {/* Compromisso Casa Linda */}
                        <section className="bg-[#1a1a1a] text-white p-4 rounded-lg mb-4 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-[#C5A059] rounded-full blur-[40px] opacity-20 -mr-10 -mt-10"></div>
                            <h2 className="text-xs font-bold text-[#C5A059] uppercase tracking-widest mb-2">Compromisso Casa Linda</h2>
                            <p className="text-[10px] font-light leading-relaxed text-zinc-300">
                                A Casa Linda acredita em parcerias de longo prazo. Esta estrutura de comissão foi criada para
                                incentivar crescimento constante, recompensar a recorrência e manter uma relação clara, justa
                                e sustentável.
                            </p>
                        </section>

                        {/* Footer */}
                        <div className="border-t border-[#eee] pt-3 flex justify-between items-center">
                            <p className="text-[9px] text-[#999] uppercase tracking-widest">Casa Linda Decorações</p>
                            <p className="text-[9px] text-[#999] uppercase tracking-widest">Portal do Arquiteto</p>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
};
