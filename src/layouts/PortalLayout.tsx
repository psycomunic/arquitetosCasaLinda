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
    X,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { supabase } from '../lib/supabase';

import { CompleteProfileModal } from '../components/CompleteProfileModal';
import { PixReminderModal } from '../components/PixReminderModal';

interface PortalLayoutProps {
    children: React.ReactNode;
    profile: {
        id?: string;
        name: string;
        officeName: string;
        logoUrl: string;
        profilePhotoUrl?: string;
        isAdmin?: boolean;
        phone?: string;
        pixKey?: string | null;
    };
    onProfileUpdate?: () => void;
}

export const PortalLayout: React.FC<PortalLayoutProps> = ({ children, profile, onProfileUpdate }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    const [collapsed, setCollapsed] = React.useState(false);

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

    const sidebarWidth = collapsed ? 'lg:w-20' : 'lg:w-80';
    const mainMargin = collapsed ? 'lg:ml-20' : 'lg:ml-80';

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

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-40 ${sidebarWidth} glass border-r-0 flex flex-col shadow-2xl transition-all duration-300 ease-in-out
                ${mobileMenuOpen ? 'translate-x-0 w-80' : '-translate-x-full lg:translate-x-0'}
            `}>
                {/* Collapse toggle button – desktop only */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="hidden lg:flex absolute -right-3 top-8 z-50 w-6 h-6 bg-zinc-800 border border-white/10 rounded-full items-center justify-center text-zinc-400 hover:text-gold hover:border-gold/40 transition-all shadow-lg"
                    title={collapsed ? 'Expandir menu' : 'Recolher menu'}
                >
                    {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
                </button>

                <div className={`p-6 ${collapsed ? 'lg:px-3' : 'lg:p-12'} h-full flex flex-col overflow-y-auto overflow-x-hidden transition-all duration-300`}>
                    {/* Logo */}
                    <div
                        className={`mb-12 cursor-pointer hidden lg:flex ${collapsed ? 'justify-center' : 'justify-start'}`}
                        onClick={() => navigate('/')}
                    >
                        {collapsed ? (
                            <img src="/favicon.ico" alt="CL" className="w-8 h-8 object-contain" onError={e => (e.currentTarget.style.display = 'none')} />
                        ) : (
                            <img src="/logo.png" alt="Casa Linda" className="h-10 object-contain" />
                        )}
                    </div>

                    {/* Mobile top spacer */}
                    <div className="lg:hidden mb-8 flex justify-end"></div>

                    <div className="space-y-10 lg:space-y-16 flex-1">
                        {/* Profile card */}
                        {!collapsed && (
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
                        )}

                        {/* Collapsed: avatar only */}
                        {collapsed && (
                            <div className="hidden lg:flex justify-center">
                                <div className="w-10 h-10 glass flex items-center justify-center grayscale overflow-hidden rounded-lg shrink-0">
                                    {profile.profilePhotoUrl ? (
                                        <img src={profile.profilePhotoUrl} className="w-full h-full object-cover" alt="" />
                                    ) : profile.logoUrl ? (
                                        <img src={profile.logoUrl} className="w-full h-full object-cover" alt="" />
                                    ) : (
                                        <ImageIcon size={16} />
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Nav */}
                        <nav className="space-y-3">
                            {menuItems.map((item) => {
                                const isActive = location.pathname === item.path || location.search ? location.pathname + location.search === item.path : false;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => {
                                            navigate(item.path);
                                            setMobileMenuOpen(false);
                                        }}
                                        title={collapsed ? item.label : undefined}
                                        className={`w-full flex items-center gap-6 transition-all rounded-lg
                                            ${collapsed ? 'lg:justify-center lg:px-0 lg:py-4 px-6 py-5' : 'px-6 py-5'}
                                            text-[9px] font-bold uppercase tracking-[0.3em]
                                            ${isActive
                                                ? 'bg-gold text-black shadow-[0_10px_30px_rgba(197,160,89,0.3)]'
                                                : 'text-zinc-500 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        <span className="shrink-0">{item.icon}</span>
                                        {!collapsed && <span className="lg:inline">{item.label}</span>}
                                        {/* Mobile always shows label */}
                                        <span className="lg:hidden">{item.label}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Logout */}
                    <div className="mt-10 lg:mt-auto">
                        <button
                            onClick={handleLogout}
                            title={collapsed ? 'Finalizar Sessão' : undefined}
                            className={`w-full flex items-center gap-6 text-[9px] font-bold text-zinc-600 hover:text-red-500 uppercase tracking-[0.4em] transition-all
                                ${collapsed ? 'lg:justify-center lg:px-0 lg:py-5 px-6 py-5' : 'px-6 py-5'}`}
                        >
                            <LogOut size={16} />
                            {!collapsed && <span className="lg:inline">Finalizar Sessão</span>}
                            <span className="lg:hidden">Finalizar Sessão</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/80 z-30 lg:hidden backdrop-blur-sm"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            <main className={`flex-1 w-full ${mainMargin} p-6 pt-24 lg:p-16 lg:pt-16 transition-all duration-300`}>
                {children}
            </main>

            {!profile.isAdmin && onProfileUpdate && (
                <CompleteProfileModal
                    isOpen={!profile.phone}
                    onProfileUpdate={onProfileUpdate}
                />
            )}

            {!profile.isAdmin && profile.id && !profile.pixKey && (
                <PixReminderModal
                    isOpen={true}
                    onClose={() => { }}
                    userId={profile.id}
                />
            )}
        </div>
    );
};
