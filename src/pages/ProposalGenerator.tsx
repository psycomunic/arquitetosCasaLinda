import React, { useState, useMemo, useRef, useEffect } from 'react';
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
    Box,
    Layout,
    Square,
    Maximize,
    Loader2
} from 'lucide-react';
import { MOCK_ARTS, FRAMES, FINISHES, FORMATS } from '../constants';
import { ArtPiece, ProposalItem, Frame, Finish, ArchitectProfile, Format } from '../types';
import { supabase } from '../lib/supabase';
import { ProposalPrintView } from '../components/ProposalPrintView';

export const ProposalGenerator: React.FC = () => {
    const [proposalItems, setProposalItems] = useState<ProposalItem[]>([]);
    const [clientName, setClientName] = useState('');
    const [projectName, setProjectName] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [showPrintPreview, setShowPrintPreview] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [architectProfile, setArchitectProfile] = useState<ArchitectProfile | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase
                    .from('architects')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (data) {
                    const profileData = data as any;
                    setArchitectProfile({
                        name: profileData.name,
                        officeName: profileData.office_name,
                        commissionRate: Number(profileData.commission_rate),
                        totalEarnings: Number(profileData.total_earnings),
                        logoUrl: profileData.logo_url
                    });
                }
            }
        };
        fetchProfile();
    }, []);

    // Current item being configured
    const [selectedFormat, setSelectedFormat] = useState<Format>(FORMATS[1]); // Default to 1 Tela
    const [selectedSize, setSelectedSize] = useState<string>(FORMATS[1].sizes?.[0] || '');
    const [selectedFrame, setSelectedFrame] = useState<Frame>(FRAMES[0]);

    // Update selected size when format changes
    useEffect(() => {
        if (selectedFormat.sizes && selectedFormat.sizes.length > 0) {
            setSelectedSize(selectedFormat.sizes[0]);
        }
    }, [selectedFormat]);
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
        let multiplier = 1;
        if (selectedFormat.id === 'dupla') multiplier = 2;
        if (selectedFormat.id === 'tripla') multiplier = 3;

        return (basePrice + frame.price + finish.price) * multiplier;
    };

    const handleAddArtToProposal = (art: ArtPiece) => {
        const price = calculateItemPrice(art.price, selectedFrame, selectedFinish);
        const newItem: ProposalItem = {
            id: Math.random().toString(36).substr(2, 9),
            artPiece: art,
            title: art.title,
            frame: selectedFrame,
            finish: selectedFinish,
            format: selectedFormat,
            size: selectedSize,
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
            format: selectedFormat,
            size: selectedSize,
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
                setCustomTitle(file.name.split('.')[0]); // Set title to filename
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle paste interface
    useEffect(() => {
        const handlePaste = (e: ClipboardEvent) => {
            const items = e.clipboardData?.items;
            if (!items) return;

            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1) {
                    const blob = items[i].getAsFile();
                    if (blob) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                            setCustomImage(reader.result as string);
                            setCustomTitle('Imagem Colada');
                        };
                        reader.readAsDataURL(blob);
                    }
                }
            }
        };

        window.addEventListener('paste', handlePaste);
        return () => window.removeEventListener('paste', handlePaste);
    }, []);

    const totalProposalValue = proposalItems.reduce((acc, item) => acc + item.price, 0);

    if (showPrintPreview) {
        return (
            <ProposalPrintView
                items={proposalItems}
                clientName={clientName}
                architectProfile={architectProfile}
                totalValue={totalProposalValue}
                onClose={() => setShowPrintPreview(false)}
            />
        );
    }

    const renderFormatIcon = (formatId: string) => {
        switch (formatId) {
            case 'quadrado':
                return (
                    <div className="w-16 h-16 bg-zinc-200 flex items-center justify-center rounded shadow-inner">
                        <div className="w-10 h-10 border-2 border-black bg-white"></div>
                    </div>
                );
            case 'padrao':
                return (
                    <div className="w-16 h-16 bg-zinc-200 flex items-center justify-center rounded shadow-inner">
                        <div className="w-8 h-10 border-2 border-black bg-white"></div>
                    </div>
                );
            case 'dupla':
                return (
                    <div className="w-16 h-16 bg-zinc-200 flex items-center justify-center gap-1 rounded shadow-inner px-2">
                        <div className="w-6 h-8 border-2 border-black bg-white"></div>
                        <div className="w-6 h-8 border-2 border-black bg-white"></div>
                    </div>
                );
            case 'tripla':
                return (
                    <div className="w-16 h-16 bg-zinc-200 flex items-center justify-center gap-1 rounded shadow-inner px-1">
                        <div className="w-4 h-6 border-2 border-black bg-white"></div>
                        <div className="w-4 h-6 border-2 border-black bg-white"></div>
                        <div className="w-4 h-6 border-2 border-black bg-white"></div>
                    </div>
                );
            default:
                return null;
        }
    };

    const renderSizeIcon = () => {
        return (
            <div className="w-12 h-12 bg-zinc-200 flex items-center justify-center rounded shadow-inner">
                <Maximize size={20} className="text-zinc-600" />
            </div>
        );
    };

    return (
        <div className="animate-fade-in no-print space-y-12">
            <header className="mb-12">
                <h2 className="text-7xl font-serif text-white">Configurador de Proposta</h2>
            </header>

            <div className="flex flex-col lg:flex-row gap-12">
                {/* Configuration Area */}
                <div className="w-full lg:w-2/3 space-y-10">

                    {/* 1. Format Selection */}
                    <div className="glass p-10 space-y-8">
                        <div className="flex items-center gap-3 text-gold">
                            <Layout size={18} />
                            <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold">Escolha o Formato</h4>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {FORMATS.map(f => (
                                <button
                                    key={f.id}
                                    onClick={() => setSelectedFormat(f)}
                                    className={`p-6 flex flex-col items-center gap-4 border transition-all rounded-lg ${selectedFormat.id === f.id ? 'border-gold bg-gold/5' : 'border-white/5 bg-white/5 hover:border-white/10'}`}
                                >
                                    {renderFormatIcon(f.id)}
                                    <span className="text-[9px] uppercase tracking-widest font-bold text-white">{f.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 2. Size Selection */}
                    <div className="glass p-10 space-y-8 animate-fade-in">
                        <div className="flex items-center gap-3 text-gold">
                            <Maximize size={18} />
                            <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold">Escolha o Tamanho</h4>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                            {selectedFormat.sizes?.map(size => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={`p-4 flex flex-col items-center gap-3 border transition-all rounded-lg ${selectedSize === size ? 'border-gold bg-gold/5' : 'border-white/5 bg-white/5 hover:border-white/10'}`}
                                >
                                    {renderSizeIcon()}
                                    <span className="text-[9px] uppercase tracking-widest font-bold text-white text-center">{size}</span>
                                </button>
                            ))}
                        </div>
                    </div>


                    {/* 3. Item Configuration (Frame/Finish) */}
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

                    {/* Upload / Paste Area */}
                    <div className="glass p-10 space-y-12">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                            <div className="space-y-2">
                                <h3 className="font-serif text-3xl text-white">Adicionar Imagem</h3>
                                <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">Faça upload ou simplesmente cole (Ctrl+V) a imagem do quadro</p>
                            </div>
                            <div className="flex gap-4 w-full md:w-auto">
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="bg-white text-black px-10 py-4 text-[9px] uppercase font-bold tracking-[0.3em] hover:bg-gold transition-all rounded-lg flex items-center gap-3 shadow-xl"
                                >
                                    <Upload size={14} /> Selecionar Arquivo
                                </button>
                                <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                            </div>
                        </div>

                        {/* Custom Upload/Paste Preview */}
                        {customImage ? (
                            <div className="p-8 border-2 border-dashed border-gold/30 rounded-xl bg-gold/5 flex flex-col md:flex-row gap-10 items-center animate-fade-in relative">
                                <button 
                                    onClick={() => setCustomImage(null)}
                                    className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                                <img src={customImage} className="w-56 h-56 object-cover rounded shadow-2xl border border-white/10" alt="Custom" />
                                <div className="flex-1 space-y-6">
                                    <div className="space-y-3">
                                        <label className="text-[9px] uppercase font-bold text-zinc-500 tracking-widest">Título da Obra no Site</label>
                                        <input
                                            type="text"
                                            value={customTitle}
                                            onChange={(e) => setCustomTitle(e.target.value)}
                                            placeholder="Ex: Abstração Minimalista I"
                                            className="w-full px-6 py-4 text-xs glass-dark border border-white/5 rounded-lg focus:border-gold outline-none text-white font-serif"
                                        />
                                    </div>
                                    <button
                                        onClick={handleAddCustomToProposal}
                                        className="w-full md:w-auto bg-gold text-black px-12 py-5 text-[10px] uppercase font-bold tracking-[0.4em] hover:bg-white transition-all shadow-2xl rounded-lg"
                                    >
                                        Incluir na Proposta
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-white/5 rounded-2xl p-20 text-center hover:border-gold/30 hover:bg-white/5 transition-all cursor-pointer group"
                            >
                                <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform">
                                    <Upload className="text-zinc-600 group-hover:text-gold" size={30} />
                                </div>
                                <h4 className="text-white font-serif text-xl mb-2">Arraste ou Cole sua Imagem</h4>
                                <p className="text-zinc-500 text-xs tracking-widest uppercase">Ou clique para selecionar um arquivo</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar Generator */}
                <div className="w-full lg:w-1/3">
                    <div className="glass p-12 sticky top-28 space-y-10">
                        <div className="space-y-4">
                            <h3 className="font-serif text-3xl text-white">Suas Escolhas</h3>
                            <div className="w-12 h-1 bg-gold"></div>
                        </div>
                        <div className="space-y-6 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                            {proposalItems.length === 0 ? (
                                <div className="py-20 text-center border border-dashed border-white/5 rounded-xl">
                                    <p className="text-zinc-600 text-[10px] uppercase tracking-widest leading-loose">
                                        Nenhuma obra selecionada <br /> para a proposta.
                                    </p>
                                </div>
                            ) : (
                                proposalItems.map((item, idx) => (
                                    <div key={item.id} className="flex gap-5 items-center glass p-5 group border-white/5 hover:border-gold/20 transition-all rounded-lg relative">
                                        <img src={item.artPiece?.imageUrl || item.customImageUrl} className="w-20 h-24 object-cover rounded shadow-lg" alt="" />
                                        <div className="flex-1 overflow-hidden">
                                            <p className="text-xs font-bold text-white truncate uppercase tracking-widest">{item.title}</p>
                                            <div className="flex flex-col gap-1 mt-2">
                                                <div className="flex flex-wrap gap-1">
                                                    <span className="text-[8px] bg-white/5 px-2 py-1 rounded text-zinc-400 uppercase tracking-tighter">{item.format?.label || '1 Tela'}</span>
                                                    {item.size && <span className="text-[8px] bg-white/5 px-2 py-1 rounded text-zinc-400 uppercase tracking-tighter">{item.size}</span>}
                                                </div>
                                                <div className="flex flex-wrap gap-1">
                                                    <span className="text-[8px] bg-white/5 px-2 py-1 rounded text-zinc-400 uppercase tracking-tighter">{item.frame?.name}</span>
                                                    <span className="text-[8px] bg-white/5 px-2 py-1 rounded text-zinc-400 uppercase tracking-tighter">{item.finish?.name}</span>
                                                </div>
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
                                onClick={async () => {
                                    if (!architectProfile || isSaving) return;
                                    setIsSaving(true);
                                    try {
                                        const userId = (await supabase.auth.getUser()).data.user?.id;
                                        
                                        // 1. Insert Proposal header
                                        const { data: proposalData, error: proposalError } = await supabase
                                            .from('proposals')
                                            .insert({
                                                architect_id: userId,
                                                client_name: clientName,
                                                project_name: (projectName && projectName.trim() !== '') ? projectName : clientName,
                                                total_value: totalProposalValue,
                                                commission_value: totalProposalValue * (architectProfile.commissionRate / 100),
                                                status: 'sent'
                                            } as any)
                                            .select()
                                            .single();

                                        if (proposalError) throw proposalError;

                                        // 2. Insert items
                                        const itemsToInsert = proposalItems.map(item => ({
                                            proposal_id: proposalData.id,
                                            product_name: `${item.title} - ${item.frame?.name} (${item.finish?.name})`,
                                            product_code: item.artPiece?.id || 'CUSTOM',
                                            quantity: 1,
                                            unit_price: item.price,
                                            total_price: item.price,
                                            image_url: item.artPiece?.imageUrl || item.customImageUrl
                                        }));

                                        const { error: itemsError } = await supabase
                                            .from('proposal_items')
                                            .insert(itemsToInsert);

                                        if (itemsError) throw itemsError;

                                        setShowPrintPreview(true);
                                    } catch (err) {
                                        console.error('Error saving proposal:', err);
                                        alert('Erro ao salvar proposta. Tente novamente.');
                                    } finally {
                                        setIsSaving(false);
                                    }
                                }}
                                disabled={proposalItems.length === 0 || !clientName || isSaving}
                                className="w-full bg-white text-black py-6 font-bold flex items-center justify-center gap-4 hover:bg-gold transition-all disabled:opacity-10 disabled:grayscale disabled:cursor-not-allowed uppercase tracking-[0.4em] text-[10px] shadow-[0_0_30px_rgba(255,255,255,0.05)]"
                            >
                                {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Printer size={18} />}
                                {isSaving ? 'Salvando...' : 'Exportar Curadoria'}
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
