import React from 'react';
import { MessageCircle } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
    return (
        <a
            href="https://wa.me/554797220810"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-2 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 group flex items-center gap-2"
            aria-label="Fale conosco no WhatsApp"
        >
            <img src="/whatsapp-icon.png" className="w-10 h-10 object-contain" alt="WhatsApp" />
            <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:pr-4 transition-all duration-500 ease-in-out whitespace-nowrap font-bold text-sm">
                Fale Conosco
            </span>
        </a>
    );
};
