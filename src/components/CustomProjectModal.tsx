import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Palette, Star, CheckCircle, MessageSquare } from 'lucide-react';

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
                            <span className="text-gold text-[10px] uppercase tracking-[0.3em] font-bold">Mecânica 03</span>
                            <h3 className="text-3xl font-serif mt-2 mb-4">Como funcionam os Projetos Especiais</h3>
                            <div className="grid md:grid-cols-2 gap-8 text-sm leading-relaxed">
                                <div className="space-y-4">
                                    <h4 className="text-zinc-900 font-bold uppercase tracking-widest text-[10px]">O que você pode solicitar:</h4>
                                    <ul className="space-y-2 text-zinc-500">
                                        <li>• Tamanhos 100% personalizados</li>
                                        <li>• Espelhos sob medida</li>
                                        <li>• Artes exclusivas (Artista Residente)</li>
                                        <li>• Projetos Corporativos / Hotéis</li>
                                    </ul>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-zinc-900 font-bold uppercase tracking-widest text-[10px]">Fluxo de Trabalho:</h4>
                                    <ul className="space-y-2 text-zinc-500">
                                        <li>1. <b>Orçamento:</b> Envie a demanda via WhatsApp</li>
                                        <li>2. <b>Produção:</b> Executamos o projeto técnico</li>
                                        <li>3. <b>Faturamento:</b> Proposta oficial e nota fiscal</li>
                                        <li className="text-gold font-bold">• <b>Comissão:</b> 20% FIXO</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <a
                                href="https://wa.me/5511999999999?text=Olá! Gostaria de falar sobre um Projeto Especial (Tamanho personalizado / Arte exclusiva / AAA)."
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full bg-[#25D366] text-white py-5 rounded-xl font-bold uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-3 shadow-lg shadow-green-500/20"
                            >
                                <MessageSquare size={20} />
                                Solicitar via WhatsApp
                            </a>
                            
                            <button
                                onClick={onClose}
                                className="w-full bg-zinc-100 text-zinc-500 py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-zinc-200 transition-colors"
                            >
                                Voltar ao Painel
                            </button>
                        </div>
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
