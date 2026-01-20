import React, { useEffect, useState } from 'react';
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
        // Wait for images to load ideally, but short timeout works for now
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

    return (
        <div className="fixed inset-0 bg-white z-[9999] overflow-y-auto animate-fade-in text-black">
            {/* Control Bar - Hidden in Print */}
            <div className="fixed top-0 left-0 w-full bg-zinc-900 text-white p-4 flex justify-between items-center no-print z-50 shadow-xl">
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
                <div className="w-full h-[297mm] relative flex flex-col justify-between p-24 break-after-page bg-zinc-50 border-b border-zinc-100">
                    {/* Branding Header */}
                    <div className="flex justify-between items-start">
                        <div className="w-40 h-40 border border-zinc-200 flex items-center justify-center bg-white p-4">
                            {architectProfile?.logoUrl ? (
                                <img src={architectProfile.logoUrl} className="w-full h-full object-contain" alt="Logo" />
                            ) : (
                                <span className="text-[8px] uppercase tracking-widest text-zinc-300 text-center">Logo Arquitetura</span>
                            )}
                        </div>
                        <div className="text-right">
                            <img src="/logo.png" alt="Casa Linda" className="h-12 object-contain grayscale opacity-30 ml-auto" />
                        </div>
                    </div>

                    {/* Cover Content */}
                    <div className="space-y-8">
                        <div className="w-24 h-1 bg-gold"></div>
                        <h1 className="text-7xl font-serif leading-tight">
                            Curadoria <br />
                            <span className="italic text-zinc-400">Exclusive</span>
                        </h1>
                        <div className="space-y-2 pt-10">
                            <p className="text-xs font-bold uppercase tracking-[0.4em] text-zinc-400">Projeto</p>
                            <h2 className="text-4xl font-serif">{clientName}</h2>
                        </div>
                    </div>

                    {/* Footer Info */}
                    <div className="flex justify-between items-end border-t border-zinc-200 pt-10">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em]">{architectProfile?.officeName || 'Escritório de Arquitetura'}</p>
                            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">{architectProfile?.name}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em]">{currentDate}</p>
                        </div>
                    </div>
                </div>

                {/* PAGE 2: INTRO / MOODGRID (Optional, maybe skip to items for now) */}

                {/* ITEMS PAGES */}
                <div className="p-24 min-h-[297mm] bg-white">
                    <div className="mb-16 border-b border-zinc-100 pb-8">
                        <h3 className="text-2xl font-serif italic text-zinc-400">Seleção de Obras</h3>
                    </div>

                    <div className="space-y-24">
                        {items.map((item, idx) => (
                            <div key={idx} className="flex gap-16 items-start break-inside-avoid page-break-item mb-24 last:mb-0">
                                <div className="w-1/2 aspect-[4/5] bg-zinc-50 border border-zinc-100 p-8 shadow-sm">
                                    <img
                                        src={item.artPiece?.imageUrl || item.customImageUrl}
                                        className="w-full h-full object-contain drop-shadow-xl"
                                        alt={item.title}
                                    />
                                </div>
                                <div className="w-1/2 pt-4 space-y-6">
                                    <div>
                                        <span className="text-[9px] text-gold uppercase tracking-[0.3em] font-bold">
                                            0{idx + 1} // {item.artPiece?.category || 'Acervo'}
                                        </span>
                                        <h4 className="text-4xl font-serif mt-3 leading-tight">{item.title}</h4>
                                    </div>

                                    <div className="space-y-4 py-8 border-y border-zinc-50">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-[8px] uppercase tracking-widest text-zinc-400 mb-1">Moldura</p>
                                                <p className="text-xs font-bold uppercase">{item.frame?.name}</p>
                                            </div>
                                            <div>
                                                <p className="text-[8px] uppercase tracking-widest text-zinc-400 mb-1">Acabamento</p>
                                                <p className="text-xs font-bold uppercase">{item.finish?.name}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-baseline justify-between">
                                        <p className="text-[9px] uppercase tracking-widest text-zinc-400">Investimento</p>
                                        <p className="text-2xl font-serif">R$ {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* SUMMARY PAGE */}
                <div className="w-full h-[297mm] relative flex flex-col p-24 break-before-page bg-zinc-900 text-white">
                    <div className="flex-1 flex flex-col justify-center space-y-20">
                        <div>
                            <p className="text-gold text-xs font-bold uppercase tracking-[0.4em] mb-6">Investimento Total</p>
                            <h2 className="text-8xl font-serif">R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h2>
                        </div>

                        <div className="grid grid-cols-2 gap-16 border-t border-white/10 pt-16">
                            <div className="space-y-6">
                                <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Condições Comerciais</p>
                                <ul className="space-y-3 text-[10px] font-light tracking-wide text-zinc-300">
                                    <li>• Validade da proposta: 15 dias</li>
                                    <li>• Pagamento: 50% entrada + 50% na entrega</li>
                                    <li>• Prazo de produção: 20 dias úteis</li>
                                    <li>• Instalação inclusa para Grande SP</li>
                                </ul>
                            </div>
                            <div className="space-y-6">
                                <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Contatos</p>
                                <div className="text-sm">
                                    <p className="font-serif text-xl mb-2">{architectProfile?.officeName}</p>
                                    <p className="text-zinc-400">{architectProfile?.phone}</p>
                                    <p className="text-zinc-400">{architectProfile?.website}</p>
                                    <p className="text-zinc-400 block mt-4 text-[10px] uppercase tracking-widest">{architectProfile?.city} - {architectProfile?.state}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-center border-t border-white/10 pt-10">
                        <p className="text-[9px] uppercase tracking-[0.5em] text-zinc-600">
                            Arte Impressa & Curadoria • Casa Linda Decorações
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
                        background: white;
                        -webkit-print-color-adjust: exact; 
                        print-color-adjust: exact;
                    }
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
        </div>
    );
};
