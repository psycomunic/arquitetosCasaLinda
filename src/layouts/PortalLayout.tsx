import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    FilePlus,
    History,
    Settings,
    LogOut,
    ImageIcon,
    Shield,
    Package,
    Menu,
    X
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface PortalLayoutProps {
    children: React.ReactNode;
    profile: {
        name: string;
        officeName: string;
        logoUrl: string;
        profilePhotoUrl?: string;
        isAdmin?: boolean;
    };
}

export const PortalLayout: React.FC<PortalLayoutProps> = ({ children, profile }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

    const menuItems = [
        { id: 'dashboard', icon: <LayoutDashboard size={16} />, label: 'Overview', path: '/dashboard' },
        ...(profile.isAdmin ? [
            { id: 'admin', icon: <Shield size={16} />, label: 'Painel Admin', path: '/adm' },
            { id: 'production', icon: <Package size={16} />, label: 'Produção & Envios', path: '/adm?tab=production' }
        ] : []),
        { id: 'sales', icon: <History size={16} />, label: 'Comissões', path: '/earnings' },
        { id: 'settings', icon: <Settings size={16} />, label: 'Perfil', path: '/settings' }
    ];

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };

    // Lock body scroll when mobile menu is open
    React.useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [mobileMenuOpen]);

    return (
        <div className="flex min-h-screen bg-canvas text-zinc-200">
            {/* Mobile Header */}
            <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-canvas border-b border-white/5 flex items-center justify-between px-6 z-30">
                <div onClick={() => navigate('/')} className="h-6">
                    <img src="/logo.png" alt="Casa Linda" className="h-full object-contain" />
                </div>
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="p-2 text-white hover:text-gold transition-colors"
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </header>

            {/* Dark Sidebar with Glass Blur */}
            <aside className={`
                fixed inset-y-0 left-0 z-40 w-80 glass border-r-0 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out
                ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="p-12 h-full flex flex-col overflow-y-auto">
                     {/* Close button for mobile inside sidebar (optional, but header button handles it) */}
                    <div
                        className="mb-12 cursor-pointer hidden lg:block"
                        onClick={() => navigate('/')}
                    >
                        <img src="/logo.png" alt="Casa Linda" className="h-10 object-contain" />
                    </div>

                    {/* Mobile: Extra padding top if needed or relying on header z-index */}
                    <div className="lg:hidden mb-8 flex justify-end">
                         {/* Placeholder if we wanted a close button inside, but the header toggle is fine */}
                    </div>

                    <div className="space-y-10 lg:space-y-16 flex-1">
                        <div className="flex items-center gap-5 p-4 glass rounded-xl border-white/5">
                            <div className="w-14 h-14 glass flex items-center justify-center grayscale overflow-hidden rounded-lg shrink-0">
                                {profile.profilePhotoUrl ? (
                                    <img src={profile.profilePhotoUrl} className="w-full h-full object-cover" alt="" />
                                ) : profile.logoUrl ? (
                                    <img src={profile.logoUrl} className="w-full h-full object-cover" alt="" />
                                ) : (
                                    <ImageIcon size={20} />
                                )}
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-[10px] font-bold uppercase tracking-widest truncate text-white">{profile.name}</p>
                                <p className="text-[8px] text-zinc-500 uppercase tracking-widest truncate mt-1">{profile.officeName}</p>
                            </div>
                        </div>

                        <nav className="space-y-3">
                            {menuItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        navigate(item.path);
                                        setMobileMenuOpen(false);
                                    }}
                                    className={`w-full flex items-center gap-6 px-6 py-5 text-[9px] font-bold uppercase tracking-[0.3em] transition-all rounded-lg ${location.pathname === item.path ? 'bg-gold text-black shadow-[0_10px_30px_rgba(197,160,89,0.3)]' : 'text-zinc-500 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    {item.icon} {item.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="mt-10 lg:mt-auto">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-6 px-6 py-5 text-[9px] font-bold text-zinc-600 hover:text-red-500 uppercase tracking-[0.4em] transition-all"
                        >
                            <LogOut size={16} /> Finalizar Sessão
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            {/* Overlay for mobile when menu is open */}
            {mobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/80 z-30 lg:hidden backdrop-blur-sm"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            <main className="flex-1 w-full lg:ml-80 p-6 pt-24 lg:p-16 lg:pt-16 transition-all">
                {children}
            </main>
        </div>
    );
};
