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
        }, 1500); // Slightly longer delay to ensure images load
        return () => clearTimeout(timer);
    }, []);

    const currentDate = new Date().toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });

    return createPortal(
        <div className="fixed inset-0 bg-white z-[9999] overflow-y-auto animate-fade-in text-zinc-900 font-serif">
            {/* Control Bar - Hidden in Print */}
            <div className="fixed top-0 left-0 w-full bg-zinc-900 text-white p-4 flex justify-between items-center no-print z-50 shadow-xl font-sans">
                <div className="text-xs font-bold uppercase tracking-widest">
                    Visualização de Impressão (Premium)
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
                <div className="w-full h-[297mm] relative flex flex-col break-after-page bg-white overflow-hidden">
                    {/* Artistic Background Element */}
                    <div className="absolute top-0 right-0 w-2/3 h-full bg-zinc-50/50 -skew-x-12 translate-x-1/3 -z-10"></div>

                    <div className="flex-1 flex flex-col p-20 relative z-10">
                        {/* Header */}
                        <div className="flex justify-between items-start mb-24">
                            <div>
                                <p className="text-[10px] font-sans uppercase tracking-[0.4em] text-gold mb-2">Curadoria Exclusiva</p>
                                <h1 className="text-6xl italic font-light text-zinc-900 leading-tight">
                                    Projeto<br />
                                    <span className="font-serif font-bold">{clientName}</span>
                                </h1>
                            </div>
                            <div className="text-right">
                                {architectProfile?.logoUrl ? (
                                    <img src={architectProfile.logoUrl} className="h-20 object-contain ml-auto" alt="Branding" />
                                ) : (
                                    <h2 className="text-xl font-bold uppercase tracking-widest border-b-2 border-gold pb-2 inline-block">{architectProfile?.officeName || 'Seu Escritório'}</h2>
                                )}
                            </div>
                        </div>

                        {/* Cover Image Feature (First Item) */}
                        {items[0] && (
                            <div className="flex-1 flex items-center justify-center relative mb-20">
                                <div className="relative z-10 shadow-2xl">
                                    <div className="bg-white p-4 pb-12 shadow-md rotate-1 transform transition-transform">
                                        <img
                                            src={items[0].artPiece?.imageUrl || items[0].customImageUrl}
                                            className="max-h-[350px] object-contain"
                                            alt="Capa"
                                        />
                                    </div>
                                </div>
                                <div className="absolute -bottom-10 -right-10 text-[200px] leading-none text-zinc-100 font-serif italic -z-10 select-none">
                                    01
                                </div>
                            </div>
                        )}

                        {/* Footer */}
                        <div className="mt-auto border-t border-zinc-200 pt-8 flex justify-between items-end font-sans">
                            <div>
                                <p className="text-[9px] uppercase tracking-[0.3em] text-zinc-400">Desenvolvido por</p>
                                <p className="text-xs font-bold uppercase tracking-widest mt-1">{architectProfile?.officeName}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[9px] uppercase tracking-[0.3em] text-zinc-400">Data</p>
                                <p className="text-xs font-bold uppercase tracking-widest mt-1">{currentDate}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ITEMS PAGES */}
                <div className="bg-white min-h-[297mm]">
                    {/* Page Header */}
                    <div className="px-20 pt-20 pb-10">
                        <h3 className="text-3xl italic font-light text-zinc-900">Seleção de Obras</h3>
                        <div className="w-12 h-[2px] bg-gold mt-4"></div>
                    </div>

                    <div className="px-20 pb-20 space-y-24">
                        {items.map((item, idx) => (
                            <div key={idx} className="break-inside-avoid page-break-item">
                                <div className="flex flex-col gap-10">
                                    {/* Number & Title */}
                                    <div className="flex items-baseline gap-6 border-b border-zinc-100 pb-6">
                                        <span className="text-4xl text-transparent bg-clip-text bg-gradient-to-br from-gold to-yellow-600 font-serif font-bold italic">
                                            {(idx + 1).toString().padStart(2, '0')}
                                        </span>
                                        <div className="flex-1">
                                            <h4 className="text-2xl font-serif text-zinc-800">{item.title}</h4>
                                            <p className="text-[10px] font-sans text-zinc-400 uppercase tracking-widest mt-1">
                                                {item.artPiece?.category || 'Acervo Personalizado'}
                                                <span className="mx-2 text-zinc-300">•</span>
                                                {item.format?.label} {item.size ? `(${item.size})` : ''}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xl font-serif font-bold text-zinc-900">R$ {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-12 gap-12">
                                        {/* Main Art Image */}
                                        <div className="col-span-8">
                                            <div className="bg-zinc-50 p-12 flex items-center justify-center shadow-inner rounded-sm">
                                                <img
                                                    src={item.artPiece?.imageUrl || item.customImageUrl}
                                                    className="w-full h-auto object-contain max-h-[400px] shadow-lg"
                                                    alt={item.title}
                                                />
                                            </div>
                                        </div>

                                        {/* Details Sidebar */}
                                        <div className="col-span-4 space-y-8">
                                            {/* Frame Detail */}
                                            <div className="space-y-3">
                                                <p className="text-[9px] font-sans uppercase tracking-[0.2em] text-zinc-400 font-bold border-b border-zinc-100 pb-2">Moldura</p>
                                                <div className="flex flex-col gap-3">
                                                    {item.frame?.thumbnailUrl ? (
                                                        <div className="w-full aspect-square bg-zinc-100 overflow-hidden border border-zinc-200">
                                                            <img
                                                                src={item.frame.thumbnailUrl}
                                                                className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-700"
                                                                alt={item.frame.name}
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="w-full aspect-square bg-zinc-100 flex items-center justify-center text-zinc-300 italic text-xs">
                                                            Sem imagem
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-serif text-lg leading-none">{item.frame?.name}</p>
                                                        <p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-wide">{item.frame?.category}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Finish Detail */}
                                            <div className="space-y-3 pt-4">
                                                <p className="text-[9px] font-sans uppercase tracking-[0.2em] text-zinc-400 font-bold border-b border-zinc-100 pb-2">Acabamento</p>
                                                <div>
                                                    <p className="font-serif text-lg">{item.finish?.name}</p>
                                                    <p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-wide">
                                                        {item.finish?.isGlass ? 'Proteção com Vidro' : 'Sem Vidro'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* SUMMARY PAGE */}
                <div className="w-full h-[297mm] relative flex flex-col p-20 break-before-page bg-zinc-900 text-white">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none"
                        style={{ backgroundImage: `url("https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2574&auto=format&fit=crop")`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                    </div>

                    <div className="flex-1 flex flex-col justify-center relative z-10">
                        <div className="text-center space-y-8 mb-20">
                            <h2 className="text-5xl font-serif italic font-light">Resumo do Investimento</h2>
                            <div className="w-24 h-[1px] bg-gold mx-auto"></div>
                        </div>

                        <div className="max-w-2xl mx-auto w-full space-y-8">
                            {/* Item List Summary */}
                            <div className="space-y-4 mb-12">
                                {items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-baseline border-b border-white/10 pb-4 text-sm">
                                        <span className="font-sans font-light tracking-wide text-zinc-400">{item.title}</span>
                                        <span className="font-serif text-zinc-300">R$ {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Total */}
                            <div className="flex justify-between items-end py-8 border-y border-gold/30">
                                <span className="text-sm font-sans uppercase tracking-[0.4em] text-gold">Valor Total</span>
                                <span className="text-6xl font-serif italic">R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="text-center space-y-2 opacity-60">
                                <p className="text-xs font-sans uppercase tracking-[0.2em] text-zinc-400">
                                    5% de desconto no <span className="text-white font-bold">PIX</span>
                                </p>
                                <p className="text-xs font-sans uppercase tracking-[0.2em] text-zinc-400">
                                    ou em até <span className="text-white font-bold">12x sem juros</span>
                                </p>
                            </div>
                        </div>

                        <div className="mt-20 grid grid-cols-2 gap-20 max-w-4xl mx-auto">
                            <div className="space-y-4 text-center">
                                <div className="border-b border-white/20 pb-4"></div>
                                <p className="text-[10px] font-sans uppercase tracking-[0.2em] text-zinc-500">Assinatura do Cliente</p>
                            </div>
                            <div className="space-y-4 text-center">
                                <div className="border-b border-white/20 pb-4"></div>
                                <p className="text-[10px] font-sans uppercase tracking-[0.2em] text-zinc-500">Data</p>
                            </div>
                        </div>
                    </div>

                    <div className="text-center opacity-30 pt-10">
                        <p className="text-[8px] font-sans uppercase tracking-[0.5em]">
                            {architectProfile?.officeName}
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
