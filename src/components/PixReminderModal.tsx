import React, { useState, useEffect } from 'react';
import { AlertCircle, ArrowRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PixReminderModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
}

export const PixReminderModal: React.FC<PixReminderModalProps> = ({ isOpen, onClose, userId }) => {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            // Check localStorage to see if architect already saw this
            const hasSeen = localStorage.getItem(`pix_reminder_seen_${userId}`);
            if (!hasSeen) {
                setIsVisible(true);
            } else {
                // Already saw it trigger onClose immediately
                onClose();
            }
        } else {
            setIsVisible(false);
        }
    }, [isOpen, userId, onClose]);

    const handleClose = () => {
        localStorage.setItem(`pix_reminder_seen_${userId}`, 'true');
        setIsVisible(false);
        onClose();
    };

    const handleGoToSettings = () => {
        localStorage.setItem(`pix_reminder_seen_${userId}`, 'true');
        setIsVisible(false);
        onClose();
        navigate('/settings');
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-zinc-950 w-full max-w-lg rounded-2xl border-2 border-red-500/30 shadow-[0_0_50px_rgba(239,68,68,0.15)] relative flex flex-col overflow-hidden">
                {/* Decorative header */}
                <div className="h-1 bg-gradient-to-r from-red-600 via-gold to-red-600"></div>

                <div className="p-6 border-b border-white/5 flex items-start justify-between bg-red-500/5">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center shrink-0 border border-red-500/20">
                            <AlertCircle className="text-red-500" size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white font-serif">Atenção Arquiteto!</h2>
                            <p className="text-sm text-zinc-400 mt-1">Sua Chave PIX não está cadastrada.</p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-white/5 rounded-full text-zinc-500 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8 space-y-6">
                    <p className="text-zinc-300 leading-relaxed text-center">
                        Para garantir que você receba suas comissões corretamente, precisamos da sua <strong>Chave PIX</strong>.
                    </p>

                    <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-center">
                        <p className="text-lg font-bold text-gold">Os repasses são feitos no dia 10</p>
                        <p className="text-sm text-zinc-400 mt-1">Não se esqueça da obrigatoriedade de emitir NF.</p>
                    </div>

                    <p className="text-xs text-zinc-500 text-center">
                        Você pode preencher depois se preferir, mas recomendamos que faça agora acessando seu Perfil.
                    </p>
                </div>

                <div className="p-6 border-t border-white/5 bg-zinc-900/50 flex gap-3">
                    <button
                        onClick={handleClose}
                        className="flex-1 px-4 py-3 rounded-lg border border-white/10 text-zinc-400 hover:bg-white/5 transition-colors text-sm font-bold uppercase tracking-widest"
                    >
                        Lembrar Mais Tarde
                    </button>
                    <button
                        onClick={handleGoToSettings}
                        className="flex-1 px-4 py-3 rounded-lg bg-gold text-black hover:bg-gold/90 transition-all font-bold text-sm uppercase tracking-widest flex justify-center items-center gap-2"
                    >
                        Cadastrar PIX Agora
                        <ArrowRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};
