import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ProposalItem, ArchitectProfile } from '../types';

interface ProposalPrintViewProps {
    items: ProposalItem[];
    clientName: string;
    architectProfile: ArchitectProfile | null;
    totalValue: number;
    onClose: () => void;
}

export const ProposalPrintView: React.FC<ProposalPrintViewProps> = ({
    items,
    clientName,
    architectProfile,
    totalValue,
    onClose
}) => {
    const [isReady, setIsReady] = useState(false);

    // Auto-trigger print when ready
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsReady(true);
            window.print();
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    const currentDate = new Date().toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });

    // Get up to 4 images for the cover collage
    const coverImages = items.slice(0, 4).map(item => item.artPiece?.imageUrl || item.customImageUrl);

    return createPortal(
        <div className="fixed inset-0 bg-white z-[9999] overflow-y-auto animate-fade-in text-black font-serif">
            {/* Control Bar - Hidden in Print */}
            <div className="fixed top-0 left-0 w-full bg-zinc-900 text-white p-4 flex justify-between items-center no-print z-50 shadow-xl font-sans">
                <div className="text-xs font-bold uppercase tracking-widest">
                    Visualização de Impressão (A4)
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 text-xs font-bold uppercase tracking-widest hover:text-gold transition-colors"
                    >
                        Voltar / Editar
                    </button>
                    <button
                        onClick={() => window.print()}
                        className="bg-gold text-black px-6 py-2 text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors"
                    >
                        Imprimir / Salvar PDF
                    </button>
                </div>
            </div>

            {/* A4 PAGES CONTAINER */}
            <div className="w-[210mm] mx-auto bg-white shadow-2xl my-20 print:my-0 print:shadow-none print:w-full">

                {/* PAGE 1: COVER */}
                <div className="w-full h-[297mm] relative flex flex-col p-16 break-after-page bg-white">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-12">
                        {architectProfile?.logoUrl ? (
                            <img src={architectProfile.logoUrl} className="h-16 object-contain" alt="Branding" />
                        ) : (
                            <h2 className="text-xl font-bold uppercase tracking-widest">{architectProfile?.officeName || 'Seu Escritório'}</h2>
                        )}
                        <div className="text-right">
                            <p className="text-[9px] font-sans uppercase tracking-[0.3em] text-zinc-400">Curadoria de Arte</p>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 flex flex-col justify-center relative">
                        {/* Collage */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none -z-10">
                            <div className="grid grid-cols-2 gap-2 w-full max-w-lg grayscale">
                                {coverImages.map((img, i) => (
                                    <div key={i} className="aspect-square bg-zinc-100 overflow-hidden">
                                        <img src={img} className="w-full h-full object-cover" alt="" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="text-center space-y-6 z-10">
                            <h1 className="text-6xl italic text-black">
                                Seleção Exclusiva
                            </h1>
                            <div className="w-16 h-[1px] bg-gold mx-auto my-6"></div>
                            <h2 className="text-4xl uppercase tracking-widest font-sans font-light">
                                {clientName}
                            </h2>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-between items-end border-t border-zinc-100 pt-8 font-sans">
                        <div>
                            <p className="text-[9px] font-bold uppercase tracking-[0.2em]">{architectProfile?.officeName}</p>
                            <p className="text-[9px] text-zinc-400 uppercase tracking-widest mt-1">Interior Design</p>
                        </div>
                        <div className="text-right text-[9px] text-zinc-400 uppercase tracking-[0.2em]">
                            {currentDate}
                        </div>
                    </div>
                </div>

                {/* ITEMS PAGES */}
                <div className="bg-white min-h-[297mm] p-12">
                    <div className="mb-8 pb-4 border-b border-zinc-100 flex justify-between items-end">
                        <h3 className="text-2xl italic">Obras Selecionadas</h3>
                        <span className="text-[9px] font-sans uppercase tracking-[0.2em] text-zinc-400">Ref: {Math.floor(Math.random() * 9999).toString().padStart(4, '0')}</span>
                    </div>

                    <div className="space-y-12">
                        {items.map((item, idx) => (
                            <div key={idx} className="break-inside-avoid page-break-item mb-12 last:mb-0">
                                <div className="flex flex-col md:flex-row gap-8 items-center">
                                    <div className="w-full md:w-3/5">
                                        <div className="bg-zinc-50 p-6 shadow-sm flex justify-center">
                                            <img
                                                src={item.artPiece?.imageUrl || item.customImageUrl}
                                                className="w-full h-auto object-contain max-h-[350px]"
                                                alt={item.title}
                                            />
                                        </div>
                                    </div>
                                    <div className="w-full md:w-2/5 space-y-6">
                                        <div className="space-y-2">
                                            <span className="text-[9px] text-gold font-sans uppercase tracking-[0.4em] font-bold block">
                                                Obra 0{idx + 1}
                                            </span>
                                            <h4 className="text-2xl leading-tight">{item.title}</h4>
                                            <p className="text-xs text-zinc-400 font-sans uppercase tracking-widest">{item.artPiece?.category || 'Acervo Pessoal'}</p>
                                        </div>

                                        <div className="space-y-3 pt-4 border-t border-zinc-100 font-sans">
                                            <div>
                                                <p className="text-[8px] uppercase tracking-widest text-zinc-400 mb-1">Moldura Selecionada</p>
                                                <p className="text-sm border-l-2 border-gold pl-3">{item.frame?.name}</p>
                                            </div>
                                            <div>
                                                <p className="text-[8px] uppercase tracking-widest text-zinc-400 mb-1">Acabamento</p>
                                                <p className="text-sm border-l-2 border-gold pl-3">{item.finish?.name}</p>
                                            </div>
                                        </div>

                                        <div className="bg-zinc-50 p-4 mt-4">
                                            <p className="text-[9px] uppercase tracking-widest text-zinc-400 mb-2 font-sans">Investimento</p>
                                            <p className="text-xl">R$ {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* SUMMARY PAGE */}
                <div className="w-full h-[297mm] relative flex flex-col p-16 break-before-page bg-white">
                    <div className="flex-1 flex flex-col justify-center items-center text-center space-y-16">
                        <div className="space-y-6">
                            <div className="w-12 h-12 border border-black flex items-center justify-center mx-auto mb-6 rounded-full">
                                <span className="font-serif italic text-2xl">i</span>
                            </div>
                            <h2 className="text-5xl italic">Resumo do Investimento</h2>
                            <div className="w-24 h-[1px] bg-gold mx-auto"></div>
                        </div>

                        <div className="py-12 px-20 border-y border-zinc-100 bg-zinc-50/50 w-full max-w-2xl">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-xs font-sans uppercase tracking-[0.3em] text-zinc-500">Total Proposta</span>
                                <span className="text-5xl">R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-12 text-left bg-white p-10 border border-zinc-100 shadow-sm w-full max-w-3xl">
                            <div className="space-y-4">
                                <h4 className="text-xs font-sans font-bold uppercase tracking-widest text-black">Aprovação</h4>
                                <p className="text-[10px] font-sans text-zinc-500 leading-relaxed">
                                    Ao aprovar esta proposta, o cliente concorda com os termos de prestação de serviços e prazos estipulados.
                                    <br /><br />
                                    _______________________<br />
                                    Assinatura do Cliente
                                </p>
                            </div>
                            <div className="space-y-4">
                                <h4 className="text-xs font-sans font-bold uppercase tracking-widest text-black">Próximos Passos</h4>
                                <p className="text-[10px] font-sans text-zinc-500 leading-relaxed">
                                    1. Devolução da via assinada<br />
                                    2. Pagamento do sinal (50%)<br />
                                    3. Início da produção
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="text-center border-t border-zinc-100 pt-8">
                        <div className="flex justify-center items-center gap-4 mb-4 opacity-50">
                            <img src="/logo.png" alt="" className="h-6 grayscale" />
                        </div>
                        <p className="text-[8px] font-sans uppercase tracking-[0.4em] text-zinc-400">
                            {architectProfile?.officeName} • {architectProfile?.website || 'www.casalinda.com.br'}
                        </p>
                    </div>
                </div>

            </div>

            <style>{`
                @media print {
                    @page { size: A4; margin: 0; }
                    html, body { 
                        height: auto; 
                        overflow: visible; 
                        background-color: white !important;
                        background: white !important;
                        -webkit-print-color-adjust: exact; 
                        print-color-adjust: exact;
                    }
                    /* HIDE MAIN APP ROOT */
                    #root { display: none !important; }

                    /* Reset the fixed modal container */
                    .fixed.inset-0 {
                        position: static !important;
                        overflow: visible !important;
                        height: auto !important;
                        background: white !important;
                    }
                    .no-print { display: none !important; }
                    .break-after-page { page-break-after: always; }
                    .break-before-page { page-break-before: always; }
                    .break-inside-avoid { page-break-inside: avoid; }
                    
                    /* Container resets */
                    .w-[210mm] { 
                        width: 100% !important; 
                        margin: 0 !important; 
                        box-shadow: none !important; 
                    }
                    
                    /* Clean up scrollbars */
                    ::-webkit-scrollbar { display: none; }
                }
            `}</style>
        </div>,
        document.body
    );
};
