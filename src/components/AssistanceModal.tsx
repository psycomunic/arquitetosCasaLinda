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
                            <h3 className="text-3xl font-serif mt-2 mb-4">Como funciona a Venda Assistida</h3>
                            <div className="space-y-4 text-zinc-500 text-sm leading-relaxed">
                                <p>1. <b>Você envia o projeto:</b> Clique no botão de WhatsApp para falar com nossa curadoria.</p>
                                <p>2. <b>Nós fazemos a curadoria:</b> Sugerimos composições e ajustamos medidas para o seu ambiente.</p>
                                <p>3. <b>Simulamos no ambiente:</b> Criamos apresentações realistas dos quadros no seu projeto.</p>
                                <p>4. <b>Link Personalizado:</b> Enviamos um link pronto para o seu cliente apenas realizar o pagamento.</p>
                                <p className="text-gold font-bold p-3 bg-gold/5 border border-gold/10 rounded-lg">
                                    💰 Benefício: +1% de Bônus na comissão por venda assistida.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <a
                                href="https://wa.me/5511999999999?text=Olá! Gostaria de iniciar uma Venda Assistida para um novo projeto."
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full bg-[#25D366] text-white py-5 rounded-xl font-bold uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-3 shadow-lg shadow-green-500/20"
                            >
                                <MessageSquare size={20} />
                                Iniciar via WhatsApp agora
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
