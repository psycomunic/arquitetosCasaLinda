import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Instagram, Lock, Menu, X } from 'lucide-react';
import { FloatingWhatsApp } from '../components/FloatingWhatsApp';

interface PublicLayoutProps {
    children: React.ReactNode;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { label: 'Canvas Premium', path: '/canvas-premium' },
        { label: 'Sustentabilidade', path: '/sustentabilidade' },
        { label: 'Artistas', path: '/artistas' },
        { label: 'Termos', path: '/termos-comissao' },
        { label: 'Suporte', path: '/suporte-private' },
    ];

    return (
        <div className="min-h-screen bg-canvas text-zinc-200 selection:bg-gold selection:text-black overflow-x-hidden">
            <FloatingWhatsApp />

            {/* Glass Navigation */}
            <nav className={`fixed top-0 w-full z-50 px-6 md:px-12 py-5 flex justify-between items-center transition-all duration-700 ${scrolled ? 'glass-dark py-4' : 'bg-transparent'
                }`}>
                <div
                    className="cursor-pointer relative z-[60]"
                    onClick={() => navigate('/')}
                >
                    <img src="/logo.png" alt="Casa Linda" className="h-8 md:h-12 object-contain" />
                </div>

                <div className="hidden lg:flex gap-10 text-[9px] uppercase tracking-[0.3em] font-medium text-zinc-500">
                    {navLinks.map((link) => (
                        <button key={link.path} onClick={() => navigate(link.path)} className="hover:text-gold transition-colors uppercase">{link.label}</button>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/login')}
                        className="hidden sm:block group relative overflow-hidden bg-white text-black px-8 py-3 text-[9px] uppercase tracking-[0.3em] font-bold transition-all hover:scale-105 active:scale-95"
                    >
                        <span className="relative z-10">Acesso Restrito</span>
                        <div className="absolute inset-0 bg-gold translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                    </button>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="lg:hidden relative z-[60] p-2 text-white"
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu Overlay */}
                <div className={`fixed inset-0 bg-black/95 z-[55] transition-all duration-500 lg:hidden ${mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                    <div className="flex flex-col items-center justify-center h-full space-y-12 text-center p-6">
                        {navLinks.map((link) => (
                            <button
                                key={link.path}
                                onClick={() => {
                                    navigate(link.path);
                                    setMobileMenuOpen(false);
                                }}
                                className="text-2xl font-serif text-white hover:text-gold transition-colors uppercase tracking-[0.2em]"
                            >
                                {link.label}
                            </button>
                        ))}
                        <button
                            onClick={() => {
                                navigate('/login');
                                setMobileMenuOpen(false);
                            }}
                            className="bg-gold-leaf text-black px-12 py-5 text-sm uppercase tracking-[0.3em] font-bold"
                        >
                            Acesso Restrito
                        </button>
                    </div>
                </div>
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
                            <p className="text-[10px] text-zinc-500 uppercase tracking-widest leading-relaxed">Rodovia Paul Fritz Kuehnrich, 990 - Fortaleza</p>
                            <p className="text-[10px] text-zinc-500 uppercase tracking-widest leading-relaxed">Blumenau/SC | CEP: 89052-381</p>
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
                                <li className="hover:text-white cursor-pointer transition-colors" onClick={() => navigate('/artistas')}>Artistas</li>
                            </ul>
                        </div>
                        <div className="space-y-6">
                            <h5 className="text-gold text-[9px] uppercase tracking-widest font-bold">Social</h5>
                            <ul className="text-[10px] text-zinc-500 space-y-4 uppercase tracking-widest">
                                <li className="hover:text-white cursor-pointer flex items-center gap-3">
                                    <a href="https://www.instagram.com/casa.lindadecoracoes/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3">
                                        <Instagram size={12} /> Instagram
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="mt-24 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[8px] uppercase tracking-[0.6em] text-zinc-600 font-bold gap-8">
                    <p>© 2024 Casa Linda Decorações. Exclusividade e Arte.</p>
                    <div className="flex gap-12">
                        <span className="hover:text-zinc-400 cursor-pointer transition-colors" onClick={() => navigate('/privacidade')}>Privacidade</span>
                        <span className="hover:text-zinc-400 cursor-pointer transition-colors" onClick={() => navigate('/lgpd')}>LGPD Compliance</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};
