import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Palette, Star, CheckCircle } from 'lucide-react';

interface CustomProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CustomProjectModal: React.FC<CustomProjectModalProps> = ({ isOpen, onClose }) => {
    const [step, setStep] = useState(1);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStep(2); // Show success message
        setTimeout(() => {
            onClose();
            setStep(1);
        }, 3000);
    };

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-zinc-100 rounded-full transition-colors"
                >
                    <X size={20} className="text-zinc-500" />
                </button>

                {step === 1 ? (
                    <div className="p-8 md:p-12">
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-gold text-[10px] uppercase tracking-[0.3em] font-bold">Mecânica 03</span>
                                <div className="bg-gold/10 text-gold px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
                                    <Star size={10} /> Projetos Especiais
                                </div>
                            </div>
                            <h3 className="text-3xl font-serif mb-4">Projeto Personalizado</h3>
                            <p className="text-zinc-500 text-sm leading-relaxed">
                                Solicite obras exclusivas, tamanhos sob medida ou curadoria artistica com nosso Artista Residente.
                                <br />
                                <span className="text-black font-bold mt-2 block">Comissão Fixa de 20%.</span>
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-700">Tipo de Demanda</label>
                                    <select className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-4 text-sm text-zinc-900 focus:outline-none focus:border-gold transition-colors appearance-none">
                                        <option>Obra sob Medida</option>
                                        <option>Artista Residente (Exclusivo)</option>
                                        <option>Espelhos Especiais</option>
                                        <option>Consultoria Completa</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-700">Ambiente</label>
                                    <input
                                        type="text"
                                        placeholder="Ex: Lobby Hotel, Living..."
                                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-4 text-sm text-zinc-900 focus:outline-none focus:border-gold transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-zinc-700 flex items-center gap-2">
                                    <Palette size={14} /> Paleta de Cores / Estilo
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ex: Tons terrosos, minimalista, vibrante..."
                                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-4 text-sm text-zinc-900 focus:outline-none focus:border-gold transition-colors"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-zinc-700">Detalhamento</label>
                                <textarea
                                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-4 text-sm text-zinc-900 focus:outline-none focus:border-gold transition-colors min-h-[100px]"
                                    placeholder="Descreva a visão para este projeto..."
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-black text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-gold transition-colors"
                            >
                                Iniciar Projeto Especial
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="p-12 text-center py-24">
                        <div className="w-20 h-20 bg-gold/20 text-gold rounded-full flex items-center justify-center mx-auto mb-6">
                            <Star size={40} />
                        </div>
                        <h3 className="text-2xl font-serif mb-2">Projeto Iniciado!</h3>
                        <p className="text-zinc-500 text-sm max-w-sm mx-auto">
                            Um consultor sênior foi alocado para este projeto e entrará em contato em breve.
                        </p>
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
};
