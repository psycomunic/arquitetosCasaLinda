import React from 'react';
import { MessageCircle } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
    return (
        <a
            href="https://wa.me/554797220810"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 hover:scale-110 transition-transform duration-300 group flex items-center gap-0"
            aria-label="Fale conosco no WhatsApp"
        >
            <img src="/whatsapp-icon.png" className="w-14 h-14 object-contain drop-shadow-2xl" alt="WhatsApp" />
            <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap font-bold text-sm bg-white text-black px-0 group-hover:px-4 py-2 rounded-full ml-[-10px] shadow-xl">
                Fale Conosco
            </span>
        </a>
    );
};
