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
    Package
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface PortalLayoutProps {
    children: React.ReactNode;
    profile: {
        name: string;
        officeName: string;
        logoUrl: string;
        isAdmin?: boolean;
    };
}

export const PortalLayout: React.FC<PortalLayoutProps> = ({ children, profile }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { id: 'dashboard', icon: <LayoutDashboard size={16} />, label: 'Overview', path: '/dashboard' },
        ...(profile.isAdmin ? [
            { id: 'admin', icon: <Shield size={16} />, label: 'Painel Admin', path: '/adm' },
            { id: 'production', icon: <Package size={16} />, label: 'Produção & Envios', path: '/adm?tab=production' }
        ] : []),
        { id: 'proposals', icon: <FilePlus size={16} />, label: 'Nova Proposta', path: '/proposals' },
        { id: 'sales', icon: <History size={16} />, label: 'Comissões', path: '/earnings' },
        { id: 'settings', icon: <Settings size={16} />, label: 'Branding', path: '/settings' }
    ];

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };

    return (
        <div className="flex min-h-screen bg-canvas text-zinc-200">
            {/* Dark Sidebar with Glass Blur */}
            <aside className="no-print w-80 glass border-r-0 flex flex-col fixed h-full z-20 shadow-2xl">
                <div className="p-12 h-full flex flex-col">
                    <div
                        className="mb-20 cursor-pointer"
                        onClick={() => navigate('/')}
                    >
                        <img src="/logo.png" alt="Casa Linda" className="h-10 object-contain" />
                    </div>

                    <div className="space-y-16 flex-1">
                        <div className="flex items-center gap-5 p-4 glass rounded-xl border-white/5">
                            <div className="w-14 h-14 glass flex items-center justify-center grayscale overflow-hidden rounded-lg">
                                {profile.logoUrl ? <img src={profile.logoUrl} className="w-full h-full object-cover" alt="" /> : <ImageIcon size={20} />}
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
                                    onClick={() => navigate(item.path)}
                                    className={`w-full flex items-center gap-6 px-6 py-5 text-[9px] font-bold uppercase tracking-[0.3em] transition-all rounded-lg ${location.pathname === item.path ? 'bg-gold text-black shadow-[0_10px_30px_rgba(197,160,89,0.3)]' : 'text-zinc-500 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    {item.icon} {item.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="mt-auto">
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
            <main className="flex-1 ml-80 p-16">
                {children}
            </main>
        </div>
    );
};
