import React, { useState, useRef } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { ArchitectProfile } from '../types';

export const Settings: React.FC = () => {
    const [profile, setProfile] = useState<ArchitectProfile>({
        name: 'Isabella Arcuri',
        officeName: 'Arcuri Studio Design',
        commissionRate: 20,
        totalEarnings: 28450.00,
        logoUrl: 'https://images.unsplash.com/photo-1599305090748-364e26244675?q=80&w=200&auto=format&fit=crop'
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfile({ ...profile, logoUrl: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="max-w-4xl animate-fade-in no-print">
            <header className="mb-12">
                <h2 className="text-7xl font-serif text-white">Branding</h2>
            </header>

            <div className="glass p-16 md:p-24 space-y-16">
                <div>
                    <h3 className="font-serif text-5xl text-white mb-4">Branding Private</h3>
                    <p className="text-zinc-500 text-sm font-light uppercase tracking-widest leading-relaxed">Personalize seu ambiente de trabalho e o material que seus clientes recebem.</p>
                </div>

                <div className="space-y-10">
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-[0.5em]">Logo do Escritório (White Label)</label>
                    <div className="flex flex-col md:flex-row items-center gap-16">
                        <div className="w-56 h-56 glass flex items-center justify-center overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000 border-dashed border-white/20">
                            {profile.logoUrl ? (
                                <img src={profile.logoUrl} className="w-full h-full object-contain p-8" alt="Logo" />
                            ) : (
                                <ImageIcon className="text-white/10" size={80} strokeWidth={1} />
                            )}
                        </div>
                        <div className="space-y-6 text-center md:text-left">
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="bg-white text-black px-12 py-5 text-[10px] font-bold hover:bg-gold transition-all uppercase tracking-[0.4em] shadow-xl"
                            >
                                Upload Novo Branding
                            </button>
                            <p className="text-[9px] text-zinc-600 uppercase tracking-widest">Formato PNG Transparente | JPG | SVG</p>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleLogoUpload}
                                className="hidden"
                                accept="image/*"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-4">
                        <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-[0.5em]">Responsável Técnico</label>
                        <input
                            type="text"
                            value={profile.name}
                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                            className="w-full px-6 py-5 border border-white/5 focus:outline-none focus:border-gold transition-all text-xs glass-dark text-white rounded-lg"
                        />
                    </div>
                    <div className="space-y-4">
                        <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-[0.5em]">Nome da Empresa / Studio</label>
                        <input
                            type="text"
                            value={profile.officeName}
                            onChange={(e) => setProfile({ ...profile, officeName: e.target.value })}
                            className="w-full px-6 py-5 border border-white/5 focus:outline-none focus:border-gold transition-all text-xs glass-dark text-white rounded-lg"
                        />
                    </div>
                </div>

                <div className="pt-10 border-t border-white/5">
                    <button className="bg-gold text-black px-16 py-6 font-bold hover:bg-white transition-all uppercase tracking-[0.4em] text-[10px] shadow-2xl">
                        Salvar Preferências
                    </button>
                </div>
            </div>
        </div>
    );
};
