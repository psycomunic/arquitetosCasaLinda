import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Upload, MessageSquare, CheckCircle } from 'lucide-react';

interface AssistanceModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AssistanceModal: React.FC<AssistanceModalProps> = ({ isOpen, onClose }) => {
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
                            <span className="text-gold text-[10px] uppercase tracking-[0.3em] font-bold">Mecânica 02</span>
                            <h3 className="text-3xl font-serif mt-2 mb-4">Venda Assistida</h3>
                            <p className="text-zinc-500 text-sm leading-relaxed">
                                Envie seu projeto e nossa equipe de especialistas fará a curadoria, simulação e orçamento para seu cliente.
                                <br />
                                <span className="text-gold font-bold mt-2 block">+1% de Bônus na comissão.</span>
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-zinc-700">Upload do Projeto / Planta</label>
                                <div className="border-2 border-dashed border-zinc-200 rounded-xl p-8 text-center hover:border-gold transition-colors cursor-pointer group">
                                    <Upload className="mx-auto text-zinc-300 group-hover:text-gold mb-4 transition-colors" />
                                    <p className="text-xs text-zinc-400">Arraste seu arquivo ou clique para selecionar</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-zinc-700">Observações / Briefing</label>
                                <textarea
                                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-4 text-sm focus:outline-none focus:border-gold transition-colors min-h-[120px]"
                                    placeholder="Descreva o estilo do cliente, cores preferidas e quaisquer detalhes importantes..."
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-black text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-gold transition-colors"
                            >
                                Enviar Solicitação
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="p-12 text-center py-24">
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle size={40} />
                        </div>
                        <h3 className="text-2xl font-serif mb-2">Solicitação Recebida!</h3>
                        <p className="text-zinc-500 text-sm max-w-sm mx-auto">
                            Nosso time entrará em contato em até 24h com a curadoria inicial para sua aprovação.
                        </p>
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
};
