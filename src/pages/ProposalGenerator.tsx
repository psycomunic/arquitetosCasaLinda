import React, { useState, useMemo, useRef } from 'react';
import {
    Plus,
    Printer,
    Zap,
    Search,
    Trash2,
    Image as ImageIcon,
    ChevronLeft,
    Upload,
    Layers,
    Box
} from 'lucide-react';
import { MOCK_ARTS, FRAMES, FINISHES } from '../constants';
import { ArtPiece, ProposalItem, Frame, Finish } from '../types';

export const ProposalGenerator: React.FC = () => {
    const [proposalItems, setProposalItems] = useState<ProposalItem[]>([]);
    const [clientName, setClientName] = useState('');
    const [showPrintPreview, setShowPrintPreview] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Current item being configured
    const [selectedFrame, setSelectedFrame] = useState<Frame>(FRAMES[0]);
    const [selectedFinish, setSelectedFinish] = useState<Finish>(FINISHES[0]);

    // Group frames by category and subcategory
    const groupedFrames = useMemo(() => {
        const groups: Record<string, Record<string, Frame[]>> = {};
        FRAMES.forEach(f => {
            if (!groups[f.category]) groups[f.category] = {};
            const sub = f.subCategory || 'Geral';
            if (!groups[f.category][sub]) groups[f.category][sub] = [];
            groups[f.category][sub].push(f);
        });
        return groups;
    }, []);

    const handleFrameSelect = (frame: Frame) => {
        setSelectedFrame(frame);
        // If the new frame doesn't allow glass and the current finish is glass,
        // switch to Canvas Standard (f1)
        if (!frame.allowsGlass && selectedFinish.isGlass) {
            const defaultFinish = FINISHES.find(f => !f.isGlass) || FINISHES[0];
            setSelectedFinish(defaultFinish);
        }
    };
    const [customImage, setCustomImage] = useState<string | null>(null);
    const [customTitle, setCustomTitle] = useState('');

    const fileInputRef = useRef<HTMLInputElement>(null);

    const filteredArts = useMemo(() => {
        return MOCK_ARTS.filter(art =>
            art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            art.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    const calculateItemPrice = (basePrice: number, frame: Frame, finish: Finish) => {
        return basePrice + frame.price + finish.price;
    };

    const handleAddArtToProposal = (art: ArtPiece) => {
        const price = calculateItemPrice(art.price, selectedFrame, selectedFinish);
        const newItem: ProposalItem = {
            id: Math.random().toString(36).substr(2, 9),
            artPiece: art,
            title: art.title,
            frame: selectedFrame,
            finish: selectedFinish,
            quantity: 1,
            price: price
        };
        setProposalItems([...proposalItems, newItem]);
    };

    const handleAddCustomToProposal = () => {
        if (!customImage) return;
        const basePrice = 500; // Base price for custom upload
        const price = calculateItemPrice(basePrice, selectedFrame, selectedFinish);
        const newItem: ProposalItem = {
            id: Math.random().toString(36).substr(2, 9),
            customImageUrl: customImage,
            title: customTitle || 'Imagem do Cliente',
            frame: selectedFrame,
            finish: selectedFinish,
            quantity: 1,
            price: price
        };
        setProposalItems([...proposalItems, newItem]);
        setCustomImage(null);
        setCustomTitle('');
    };

    const handleRemoveArtFromProposal = (id: string) => {
        setProposalItems(proposalItems.filter(item => item.id !== id));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCustomImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const totalProposalValue = proposalItems.reduce((acc, item) => acc + item.price, 0);

    if (showPrintPreview) {
        return (
            <div className="max-w-4xl mx-auto bg-white min-h-[1122px] shadow-2xl p-24 text-black animate-fade-in relative">
                <div className="no-print absolute top-0 left-0 w-full -translate-y-full pb-10 flex justify-between items-center">
                    <button onClick={() => setShowPrintPreview(false)} className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.4em] text-white hover:text-gold transition-all">
                        <ChevronLeft size={16} /> Editar Proposta
                    </button>
                    <button onClick={() => window.print()} className="bg-gold text-black px-12 py-5 text-[10px] font-bold flex items-center gap-4 hover:bg-white transition-all uppercase tracking-[0.5em] shadow-2xl">
                        <Printer size={18} /> Imprimir Proposta
                    </button>
                </div>

                <div className="flex justify-between items-start mb-32">
                    <div className="space-y-12">
                        <div className="w-56 h-56 bg-zinc-50 p-10 border border-zinc-100 shadow-sm flex items-center justify-center grayscale">
                            <span className="text-[10px] text-zinc-300 font-bold tracking-[0.4em] uppercase">Branding</span>
                        </div>
                        <div>
                            <h3 className="text-3xl font-serif text-black">Arcuri Studio Design</h3>
                            <p className="text-[10px] text-zinc-400 uppercase tracking-[0.6em] font-medium mt-2">Interior Design & Art Curation</p>
                        </div>
                    </div>
                    <div className="text-right space-y-4">
                        <h1 className="text-7xl font-serif uppercase tracking-[0.1em] text-black/10">Project Selection</h1>
                        <div className="space-y-2">
                            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.4em]">Ref: CP-{Math.floor(Math.random() * 99999).toString().padStart(5, '0')}</p>
                            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.4em]">Data: {new Date().toLocaleDateString('pt-BR')}</p>
                        </div>
                    </div>
                </div>

                <div className="mb-24 py-16 border-y border-zinc-100">
                    <p className="text-[9px] uppercase tracking-[0.6em] text-zinc-300 font-bold mb-8 italic">Composição Exclusiva para:</p>
                    <h2 className="text-7xl font-serif text-black tracking-tight">{clientName}</h2>
                </div>

                <div className="space-y-40 mb-40">
                    {proposalItems.map((item, idx) => (
                        <div key={idx} className="flex gap-24 items-start break-inside-avoid">
                            <div className="w-1/2 shadow-2xl bg-zinc-50 border border-zinc-100">
                                <img src={item.artPiece?.imageUrl || item.customImageUrl} className="w-full h-auto" alt={item.title} />
                            </div>
                            <div className="w-1/2 flex flex-col pt-10">
                                <p className="text-[10px] text-gold-leaf font-bold uppercase tracking-[0.5em] mb-4">{item.artPiece?.category || 'Custom'}</p>
                                <h4 className="text-5xl font-serif mb-8 text-black leading-tight">{item.title}</h4>

                                <div className="space-y-4 mb-16">
                                    <div className="flex justify-between border-b border-zinc-100 pb-2">
                                        <span className="text-[9px] uppercase tracking-widest text-zinc-400">Moldura</span>
                                        <span className="text-[10px] uppercase font-bold text-black">{item.frame?.name}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-zinc-100 pb-2">
                                        <span className="text-[9px] uppercase tracking-widest text-zinc-400">Acabamento</span>
                                        <span className="text-[10px] uppercase font-bold text-black">{item.finish?.name}</span>
                                    </div>
                                </div>

                                <div className="mt-auto bg-zinc-50 p-10 border-l-4 border-black">
                                    <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.4em] mb-2">Valor de Investimento:</p>
                                    <p className="text-4xl font-serif text-black">R$ {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-black text-white p-20 flex justify-between items-center mb-32">
                    <div className="space-y-2">
                        <p className="text-2xl font-serif tracking-[0.3em] uppercase">Investimento Total</p>
                        <p className="text-[9px] text-zinc-500 uppercase tracking-[0.4em]">Seleção Premium Casa Linda</p>
                    </div>
                    <div className="text-right">
                        <p className="text-7xl font-serif">R$ {totalProposalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    </div>
                </div>

                <div className="pt-20 border-t border-zinc-100 flex justify-between items-end">
                    <div className="text-[9px] text-zinc-300 font-bold tracking-[0.5em] uppercase">
                        <p>Arcuri Studio Design & Casa Linda Decorações</p>
                    </div>
                    <div className="text-xl font-serif tracking-[0.4em] uppercase">
                        <img src="/logo.png" alt="Casa Linda" className="h-6 object-contain grayscale" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in no-print space-y-12">
            <header className="mb-12">
                <h2 className="text-7xl font-serif text-white">Configurador de Proposta</h2>
            </header>

            <div className="flex flex-col lg:flex-row gap-12">
                {/* Configuration Area */}
                <div className="w-full lg:w-2/3 space-y-10">
                    {/* Item Configuration (Frame/Finish) */}
                    <div className="glass p-10 space-y-12">
                        <div className="space-y-8">
                            <div className="flex items-center gap-3 text-gold">
                                <Box size={18} />
                                <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold">Escolha a Moldura</h4>
                            </div>

                            <div className="space-y-10">
                                {Object.entries(groupedFrames).map(([category, subGroups]) => (
                                    <div key={category} className="space-y-6">
                                        <h5 className="text-[9px] uppercase tracking-[0.3em] font-bold text-zinc-500 border-b border-white/5 pb-2">{category}</h5>
                                        <div className="space-y-6">
                                            {Object.entries(subGroups).map(([sub, frames]) => (
                                                <div key={sub} className="space-y-3">
                                                    {sub !== 'Geral' && (
                                                        <p className="text-[8px] uppercase tracking-widest text-zinc-600 font-medium italic">{sub}</p>
                                                    )}
                                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                                        {frames.map(f => (
                                                            <button
                                                                key={f.id}
                                                                onClick={() => handleFrameSelect(f)}
                                                                className={`p-0 text-left border transition-all rounded-lg flex flex-col items-stretch overflow-hidden h-full ${selectedFrame.id === f.id ? 'border-gold bg-gold/5' : 'border-white/5 bg-white/5 hover:border-white/10'}`}
                                                            >
                                                                {f.thumbnailUrl ? (
                                                                    <div className="aspect-square w-full bg-zinc-900 border-b border-white/5">
                                                                        <img src={f.thumbnailUrl} alt={f.name} className="w-full h-full object-cover" />
                                                                    </div>
                                                                ) : (
                                                                    <div className="aspect-square w-full bg-zinc-800 border-b border-white/5 flex items-center justify-center">
                                                                        <Box size={14} className="text-zinc-600" />
                                                                    </div>
                                                                )}
                                                                <div className="p-2">
                                                                    <p className="text-[8px] uppercase tracking-tighter font-bold text-white leading-tight">{f.name}</p>
                                                                </div>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="flex items-center gap-3 text-gold">
                                <Layers size={18} />
                                <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold">Acabamento</h4>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {FINISHES.map(f => {
                                    const isDisabled = !selectedFrame.allowsGlass && f.isGlass;
                                    return (
                                        <button
                                            key={f.id}
                                            disabled={isDisabled}
                                            onClick={() => setSelectedFinish(f)}
                                            className={`p-4 text-left border transition-all rounded-lg relative ${selectedFinish.id === f.id ? 'border-gold bg-gold/5' : isDisabled ? 'border-white/5 bg-white/5 opacity-30 cursor-not-allowed' : 'border-white/5 bg-white/5 hover:border-white/20'}`}
                                        >
                                            <p className="text-[9px] uppercase tracking-widest font-bold text-white">{f.name}</p>
                                            <p className="text-[10px] text-gold mt-1">+ R$ {f.price}</p>
                                            {isDisabled && (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <span className="text-[7px] text-white/40 uppercase tracking-tighter bg-black/60 px-2 py-1 rounded">Sem Vidro</span>
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Catalog & Upload */}
                    <div className="glass p-10 space-y-12">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                            <h3 className="font-serif text-3xl text-white">Acervo ou Upload</h3>
                            <div className="flex gap-4 w-full md:w-auto">
                                <div className="relative flex-1 md:w-64">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
                                    <input
                                        type="text"
                                        placeholder="Buscar no acervo..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 text-[10px] glass-dark border border-white/5 rounded-lg focus:border-gold outline-none"
                                    />
                                </div>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="bg-white text-black px-6 py-3 text-[9px] uppercase font-bold tracking-widest hover:bg-gold transition-all"
                                >
                                    <Upload size={14} className="inline mr-2" /> Upload
                                </button>
                                <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                            </div>
                        </div>

                        {/* Custom Upload Preview */}
                        {customImage && (
                            <div className="p-8 border-2 border-dashed border-gold/30 rounded-xl bg-gold/5 flex flex-col md:flex-row gap-10 items-center animate-fade-in">
                                <img src={customImage} className="w-40 h-40 object-cover rounded shadow-2xl" alt="Custom" />
                                <div className="flex-1 space-y-6">
                                    <div className="space-y-3">
                                        <label className="text-[9px] uppercase font-bold text-zinc-500 tracking-widest">Título da Obra (Opcional)</label>
                                        <input
                                            type="text"
                                            value={customTitle}
                                            onChange={(e) => setCustomTitle(e.target.value)}
                                            placeholder="Ex: Foto Família / Arte Digital"
                                            className="w-full px-6 py-4 text-xs glass-dark border border-white/5 rounded-lg focus:border-gold outline-none"
                                        />
                                    </div>
                                    <button
                                        onClick={handleAddCustomToProposal}
                                        className="bg-gold text-black px-10 py-4 text-[9px] uppercase font-bold tracking-widest hover:bg-white transition-all shadow-xl"
                                    >
                                        Adicionar Imagem à Proposta
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                            {filteredArts.map((art) => (
                                <div key={art.id} className="group relative flex flex-col glass overflow-hidden hover:border-gold/30 transition-all">
                                    <div className="aspect-[4/5] bg-zinc-900 relative overflow-hidden">
                                        <img
                                            src={art.imageUrl}
                                            alt={art.title}
                                            className="w-full h-full object-cover group-hover:scale-110 grayscale group-hover:grayscale-0 transition-all duration-1000"
                                        />
                                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-all duration-500" />
                                        <button
                                            onClick={() => handleAddArtToProposal(art)}
                                            className="absolute bottom-6 right-6 w-14 h-14 bg-white text-black flex items-center justify-center rounded-full shadow-2xl scale-0 group-hover:scale-100 transition-transform duration-500 hover:bg-gold hover:text-white"
                                        >
                                            <Plus size={24} />
                                        </button>
                                    </div>
                                    <div className="p-8">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-[9px] text-gold uppercase tracking-[0.4em] font-bold mb-3">{art.category}</p>
                                                <h4 className="font-serif text-2xl text-white mb-2">{art.title}</h4>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs font-bold text-white">R$ {art.price.toLocaleString('pt-BR')}</p>
                                                <p className="text-[9px] text-zinc-500 uppercase mt-1">Sugerido</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar Generator */}
                <div className="w-full lg:w-1/3">
                    <div className="glass p-12 sticky top-28 space-y-10">
                        <div className="space-y-4">
                            <h3 className="font-serif text-3xl text-white">Suas Escolhas</h3>
                            <div className="w-12 h-1 bg-gold"></div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-[0.4em] mb-4">Projeto / Ambiente</label>
                                <input
                                    type="text"
                                    value={clientName}
                                    onChange={(e) => setClientName(e.target.value)}
                                    placeholder="Ex: Apartamento Ibirapuera"
                                    className="w-full px-6 py-5 text-xs border border-white/5 focus:outline-none focus:border-gold transition-all glass-dark text-white rounded-lg"
                                />
                            </div>
                        </div>

                        <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                            {proposalItems.length === 0 ? (
                                <div className="text-center py-20 text-zinc-600 border border-dashed border-white/5 rounded-xl bg-white/5">
                                    <ImageIcon className="mx-auto mb-4 opacity-10" size={50} strokeWidth={1} />
                                    <p className="text-[10px] uppercase tracking-[0.3em] px-10">Componha seu projeto selecionando molduras e obras</p>
                                </div>
                            ) : (
                                proposalItems.map((item, idx) => (
                                    <div key={item.id} className="flex gap-5 items-center glass p-5 group border-white/5 hover:border-gold/20 transition-all rounded-lg relative">
                                        <img src={item.artPiece?.imageUrl || item.customImageUrl} className="w-20 h-24 object-cover rounded shadow-lg" alt="" />
                                        <div className="flex-1 overflow-hidden">
                                            <p className="text-xs font-bold text-white truncate uppercase tracking-widest">{item.title}</p>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                <span className="text-[8px] bg-white/5 px-2 py-1 rounded text-zinc-400 uppercase tracking-tighter">{item.frame?.name}</span>
                                                <span className="text-[8px] bg-white/5 px-2 py-1 rounded text-zinc-400 uppercase tracking-tighter">{item.finish?.name}</span>
                                            </div>
                                            <p className="text-[10px] text-gold mt-2 font-bold">R$ {item.price.toLocaleString('pt-BR')}</p>
                                        </div>
                                        <button onClick={() => handleRemoveArtFromProposal(item.id)} className="text-zinc-600 hover:text-red-500 transition-colors">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="pt-10 border-t border-white/5 space-y-8">
                            <div className="flex justify-between items-baseline">
                                <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.4em]">Subtotal</span>
                                <span className="text-3xl font-serif text-white">R$ {totalProposalValue.toLocaleString('pt-BR')}</span>
                            </div>

                            <div className="bg-white/5 p-6 rounded-lg border border-white/5">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-zinc-500 text-[9px] font-bold uppercase tracking-[0.4em]">Seu Repasse (20%)</span>
                                    <Zap size={14} className="text-gold" />
                                </div>
                                <span className="font-serif text-gold text-2xl">R$ {(totalProposalValue * 0.2).toLocaleString('pt-BR')}</span>
                            </div>

                            <button
                                onClick={() => setShowPrintPreview(true)}
                                disabled={proposalItems.length === 0 || !clientName}
                                className="w-full bg-white text-black py-6 font-bold flex items-center justify-center gap-4 hover:bg-gold transition-all disabled:opacity-10 disabled:grayscale disabled:cursor-not-allowed uppercase tracking-[0.4em] text-[10px] shadow-[0_0_30px_rgba(255,255,255,0.05)]"
                            >
                                <Printer size={18} /> Exportar Curadoria
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c5a059;
        }
        @media print {
          body { background: white !important; }
          .no-print { display: none !important; }
          main { margin: 0 !important; padding: 0 !important; }
        }
      `}</style>
        </div>
    );
};
