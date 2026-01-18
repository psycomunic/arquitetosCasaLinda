import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Instagram, Lock } from 'lucide-react';

interface PublicLayoutProps {
    children: React.ReactNode;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-canvas text-zinc-200 selection:bg-gold selection:text-black">
            {/* Glass Navigation */}
            <nav className={`fixed top-0 w-full z-50 px-6 md:px-12 py-5 flex justify-between items-center transition-all duration-700 ${scrolled ? 'glass-dark py-4' : 'bg-transparent'
                }`}>
                <div
                    className="cursor-pointer"
                    onClick={() => navigate('/')}
                >
                    <img src="/logo.png" alt="Casa Linda" className="h-8 md:h-12 object-contain" />
                </div>

                <div className="hidden lg:flex gap-10 text-[9px] uppercase tracking-[0.3em] font-medium text-zinc-500">
                    <button onClick={() => navigate('/canvas-premium')} className="hover:text-gold transition-colors uppercase">Canvas Premium</button>
                    <button onClick={() => navigate('/sustentabilidade')} className="hover:text-gold transition-colors uppercase">Sustentabilidade</button>
                    <button onClick={() => navigate('/artesanato')} className="hover:text-gold transition-colors uppercase">Artesanato</button>
                </div>

                <button
                    onClick={() => navigate('/login')}
                    className="group relative overflow-hidden bg-white text-black px-8 py-3 text-[9px] uppercase tracking-[0.3em] font-bold transition-all hover:scale-105 active:scale-95"
                >
                    <span className="relative z-10">Acesso Restrito</span>
                    <div className="absolute inset-0 bg-gold translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                </button>
            </nav>

            <main>{children}</main>

            {/* Footer Minimalista Dark */}
            <footer className="py-20 px-6 md:px-12 bg-ebonite border-t border-white/5">
                <div className="flex flex-col md:flex-row justify-between items-start gap-16">
                    <div className="space-y-8">
                        <div
                            className="cursor-pointer"
                            onClick={() => navigate('/')}
                        >
                            <img src="/logo.png" alt="Casa Linda" className="h-10 md:h-20 object-contain" />
                        </div>
                        <div className="space-y-2">
                            <p className="text-[10px] text-zinc-500 uppercase tracking-widest leading-relaxed">Desde 2020 elevando o design nacional.</p>
                            <p className="text-[10px] text-zinc-500 uppercase tracking-widest leading-relaxed">São Paulo | Brasil</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-20">
                        <div className="space-y-6">
                            <h5 className="text-gold text-[9px] uppercase tracking-widest font-bold">Parceria</h5>
                            <ul className="text-[10px] text-zinc-500 space-y-4 uppercase tracking-widest">
                                <li className="hover:text-white cursor-pointer transition-colors" onClick={() => navigate('/login')}>Portal Arquiteto</li>
                                <li className="hover:text-white cursor-pointer transition-colors" onClick={() => navigate('/termos-comissao')}>Termos de Comissão</li>
                                <li className="hover:text-white cursor-pointer transition-colors" onClick={() => navigate('/suporte-private')}>Suporte Private</li>
                            </ul>
                        </div>
                        <div className="space-y-6">
                            <h5 className="text-gold text-[9px] uppercase tracking-widest font-bold">Processo</h5>
                            <ul className="text-[10px] text-zinc-500 space-y-4 uppercase tracking-widest">
                                <li className="hover:text-white cursor-pointer transition-colors" onClick={() => navigate('/canvas-premium')}>Canvas Premium</li>
                                <li className="hover:text-white cursor-pointer transition-colors" onClick={() => navigate('/sustentabilidade')}>Sustentabilidade</li>
                                <li className="hover:text-white cursor-pointer transition-colors" onClick={() => navigate('/artesanato')}>Artesanato</li>
                            </ul>
                        </div>
                        <div className="space-y-6">
                            <h5 className="text-gold text-[9px] uppercase tracking-widest font-bold">Social</h5>
                            <ul className="text-[10px] text-zinc-500 space-y-4 uppercase tracking-widest">
                                <li className="hover:text-white cursor-pointer flex items-center gap-3">
                                    <Instagram size={12} /> Instagram
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="mt-24 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[8px] uppercase tracking-[0.6em] text-zinc-600 font-bold gap-8">
                    <p>© 2024 Casa Linda Decorações. Exclusividade e Arte.</p>
                    <div className="flex gap-12">
                        <span className="hover:text-zinc-400 cursor-pointer transition-colors">Privacidade</span>
                        <span className="hover:text-zinc-400 cursor-pointer transition-colors">LGPD Compliance</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};
