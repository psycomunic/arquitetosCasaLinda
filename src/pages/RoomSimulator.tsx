import React, { useState, useRef, useEffect } from 'react';
import { Upload, ArrowRight, ArrowLeft, Image as ImageIcon, Move, Check } from 'lucide-react';
import { MOCK_ARTS, FORMATS } from '../constants';

type Step = 1 | 2 | 3 | 4;

export const RoomSimulator: React.FC = () => {
    const [step, setStep] = useState<Step>(1);
    const [roomImage, setRoomImage] = useState<string | null>(null);
    const [selectedArt, setSelectedArt] = useState<string | null>(null);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);

    // Canvas state for Step 4
    const [artPosition, setArtPosition] = useState({ x: 50, y: 50 }); // Percentage
    const [artScale, setArtScale] = useState(1);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setRoomImage(reader.result as string);
                setStep(2);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleMouseDown = () => setIsDragging(true);
    const handleMouseUp = () => setIsDragging(false);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        setArtPosition({ x, y });
    };

    // Touch support for mobile
    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging || !containerRef.current) return;

        const touch = e.touches[0];
        const rect = containerRef.current.getBoundingClientRect();
        const x = ((touch.clientX - rect.left) / rect.width) * 100;
        const y = ((touch.clientY - rect.top) / rect.height) * 100;

        setArtPosition({ x, y });
    };

    const getSelectedArtUrl = () => {
        const art = MOCK_ARTS.find(a => a.id === selectedArt);
        return art ? art.imageUrl : '';
    };

    return (
        <div className="space-y-8">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-light text-white mb-2">Simulador de Ambiente</h1>
                    <p className="text-zinc-400">Visualize as obras no ambiente do seu cliente em 4 passos simples.</p>
                </div>
                <div className="flex gap-2">
                    {[1, 2, 3, 4].map((s) => (
                        <div
                            key={s}
                            className={`w-3 h-3 rounded-full transition-all ${step >= s ? 'bg-gold scale-110' : 'bg-white/10'
                                }`}
                        />
                    ))}
                </div>
            </header>

            <div className="glass p-8 rounded-2xl min-h-[600px] flex flex-col relative overflow-hidden">
                {/* Back Button */}
                {step > 1 && (
                    <button
                        onClick={() => setStep(prev => (prev - 1) as Step)}
                        className="absolute top-8 left-8 z-10 p-2 glass rounded-full hover:bg-white/10 transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                )}

                {/* Step 1: Upload Room */}
                {step === 1 && (
                    <div className="flex-1 flex flex-col items-center justify-center text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="w-24 h-24 glass rounded-full flex items-center justify-center mb-6 text-gold">
                            <ImageIcon size={40} />
                        </div>
                        <h2 className="text-2xl text-white font-light mb-4">Passo 1: Foto do Ambiente</h2>
                        <p className="text-zinc-400 max-w-md mb-8">
                            Tire uma foto do ambiente do seu cliente ou faça upload de uma imagem existente para começar a simulação.
                        </p>

                        <label className="cursor-pointer group">
                            <div className="bg-gold hover:bg-gold/90 text-black px-8 py-4 rounded-full font-bold tracking-wider uppercase transition-all flex items-center gap-3">
                                <Upload size={20} />
                                Carregar Foto
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileUpload}
                            />
                        </label>
                    </div>
                )}

                {/* Step 2: Select Art */}
                {step === 2 && (
                    <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-right-8 duration-500">
                        <h2 className="text-xl text-white font-light mb-6 text-center">Passo 2: Escolha a Obra</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
                            {MOCK_ARTS.map((art) => (
                                <div
                                    key={art.id}
                                    onClick={() => {
                                        setSelectedArt(art.id);
                                        setStep(3);
                                    }}
                                    className="group cursor-pointer"
                                >
                                    <div className="aspect-[4/5] rounded-lg overflow-hidden mb-3 relative">
                                        <img
                                            src={art.imageUrl}
                                            alt={art.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <span className="text-xs font-bold uppercase tracking-widest text-white border border-white/30 px-4 py-2 rounded-full glass">
                                                Selecionar
                                            </span>
                                        </div>
                                    </div>
                                    <h3 className="text-sm font-medium text-white truncate">{art.title}</h3>
                                    <p className="text-xs text-zinc-500">{art.category}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 3: Select Size */}
                {step === 3 && (
                    <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-right-8 duration-500">
                        <h2 className="text-xl text-white font-light mb-6 text-center">Passo 3: Tamanho Aproximado</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {FORMATS.map((format) => (
                                <div key={format.id} className="space-y-4">
                                    <h3 className="text-gold text-sm font-bold uppercase tracking-widest border-b border-white/10 pb-2">
                                        {format.label}
                                    </h3>
                                    <div className="space-y-2">
                                        {format.sizes.map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => {
                                                    setSelectedSize(size);
                                                    setStep(4);
                                                }}
                                                className="w-full text-left px-4 py-3 glass rounded-lg text-sm text-zinc-300 hover:bg-white/10 hover:text-white transition-all flex items-center justify-between group"
                                            >
                                                {size}
                                                <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-gold" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 4: Visualize & Adjust */}
                {step === 4 && roomImage && (
                    <div className="flex-1 flex flex-col h-full animate-in fade-in duration-700">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl text-white font-light">Passo 4: Ajuste Final</h2>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-zinc-400">Tamanho:</span>
                                    <input
                                        type="range"
                                        min="0.2"
                                        max="3"
                                        step="0.1"
                                        value={artScale}
                                        onChange={(e) => setArtScale(parseFloat(e.target.value))}
                                        className="w-32 accent-gold"
                                    />
                                </div>
                                <button
                                    onClick={() => {
                                        setStep(1);
                                        setRoomImage(null);
                                        setSelectedArt(null);
                                        setSelectedSize(null);
                                    }}
                                    className="px-4 py-2 bg-gold text-black text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-gold/90"
                                >
                                    Nova Simulação
                                </button>
                            </div>
                        </div>

                        <div
                            ref={containerRef}
                            className="relative flex-1 bg-black/50 rounded-lg overflow-hidden cursor-crosshair border border-white/10"
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleMouseUp}
                        >
                            {/* Room Background */}
                            <img
                                src={roomImage}
                                alt="Ambiente"
                                className="w-full h-full object-contain pointer-events-none select-none"
                            />

                            {/* Art Overlay */}
                            <div
                                onMouseDown={handleMouseDown}
                                onTouchStart={handleMouseDown}
                                className="absolute shadow-[0_20px_50px_rgba(0,0,0,0.5)] cursor-move group transition-transform duration-75"
                                style={{
                                    left: `${artPosition.x}%`,
                                    top: `${artPosition.y}%`,
                                    transform: `translate(-50%, -50%) scale(${artScale})`,
                                    width: '20%', // Base width relative to container
                                }}
                            >
                                <img
                                    src={getSelectedArtUrl()}
                                    alt="Obra"
                                    className="w-full h-auto rounded-sm border-[3px] border-white/10" // Simulation of frame
                                />
                                <div className="absolute inset-0 border-2 border-gold opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity flex items-center justify-center">
                                    <Move size={24} className="text-gold drop-shadow-md" />
                                </div>
                            </div>

                            {/* Info Overlay */}
                            <div className="absolute bottom-4 left-4 right-4 glass p-4 rounded-xl flex items-center justify-between pointer-events-none">
                                <div>
                                    <p className="text-xs text-zinc-400 uppercase tracking-wider mb-1">Obra Selecionada</p>
                                    <p className="text-sm text-white font-medium">
                                        {MOCK_ARTS.find(a => a.id === selectedArt)?.title}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-zinc-400 uppercase tracking-wider mb-1">Tamanho Referência</p>
                                    <p className="text-sm text-gold font-bold">{selectedSize}</p>
                                </div>
                            </div>
                        </div>

                        <p className="text-center text-xs text-zinc-500 mt-4">
                            Arraste a obra para posicionar. Use o slider acima para ajustar o tamanho conforme a perspectiva da foto.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
