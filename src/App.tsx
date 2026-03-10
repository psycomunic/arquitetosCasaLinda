import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { ForgotPassword } from './pages/ForgotPassword';
import { UpdatePassword } from './pages/UpdatePassword';
import { Register } from './pages/Register';
import { DashboardOverview } from './pages/DashboardOverview';
import { ProposalGenerator } from './pages/ProposalGenerator';
import { Earnings } from './pages/Earnings';
import { Settings } from './pages/Settings';
import { PortalLayout } from './layouts/PortalLayout';
import { CanvasPremium } from './pages/CanvasPremium';
import { Sustentabilidade } from './pages/Sustentabilidade';
import { Artistas } from './pages/Artistas';
import { TermosComissao } from './pages/TermosComissao';
import { SuportePrivate } from './pages/SuportePrivate';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { LGPD } from './pages/LGPD';
import { ThankYou } from './pages/ThankYou';
import { Analytics } from './components/Analytics';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminDashboard } from './pages/AdminDashboard';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App: React.FC = () => {
  const [profile, setProfile] = React.useState({
    id: '',
    name: '',
    officeName: '',
    logoUrl: '',
    profilePhotoUrl: '',
    isAdmin: false,
    phone: '',
    pixKey: null as string | null
  });
  const [authLoading, setAuthLoading] = React.useState(true);

  const ADMIN_EMAILS = [
    'renan.macedos@hotmail.com',
    'giselekf2@gmail.com',
    'kelly.cordeirodasilva.5@gmail.com'
  ];

  const fetchProfile = React.useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('architects')
          .select('*')
          .eq('id', user.id)
          .single() as any;

        if (data) {
          const isHardcodedAdmin = ADMIN_EMAILS.includes(user.email || '');
          setProfile({
            id: user.id,
            name: data.name,
            officeName: data.office_name,
            logoUrl: data.logo_url || '',
            profilePhotoUrl: data.profile_photo_url || '', // Fetch profile photo
            isAdmin: data.is_admin || isHardcodedAdmin || false,
            phone: data.phone || '',
            pixKey: data.pix_key || null
          });
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();

    // Listen to changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) fetchProfile();
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-gold/20 border-t-gold rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Router>
      <ScrollToTop />
      <Analytics />
      <FloatingWhatsApp />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/update-password" element={<UpdatePassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/canvas-premium" element={<CanvasPremium />} />
        <Route path="/sustentabilidade" element={<Sustentabilidade />} />
        <Route path="/artistas" element={<Artistas />} />
        <Route path="/termos-comissao" element={<TermosComissao />} />
        <Route path="/suporte-private" element={<SuportePrivate />} />
        <Route path="/obrigado" element={<ThankYou />} />

        {/* Legal Pages */}
        <Route path="/privacidade" element={<PrivacyPolicy />} />
        <Route path="/lgpd" element={<LGPD />} />

        {/* Portal Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <PortalLayout profile={profile} onProfileUpdate={fetchProfile}>
              <DashboardOverview />
            </PortalLayout>
          </ProtectedRoute>
        } />

        {/* Admin Route */}
        {profile.isAdmin && (
          <Route path="/adm" element={
            <ProtectedRoute>
              <PortalLayout profile={profile} onProfileUpdate={fetchProfile}>
                <AdminDashboard />
              </PortalLayout>
            </ProtectedRoute>
          } />
        )}

        <Route path="/proposals" element={
          <ProtectedRoute>
            <PortalLayout profile={profile} onProfileUpdate={fetchProfile}>
              <ProposalGenerator />
            </PortalLayout>
          </ProtectedRoute>
        } />
        <Route path="/earnings" element={
          <ProtectedRoute>
            <PortalLayout profile={profile} onProfileUpdate={fetchProfile}>
              <Earnings />
            </PortalLayout>
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <PortalLayout profile={profile} onProfileUpdate={fetchProfile}>
              <Settings />
            </PortalLayout>
          </ProtectedRoute>
        } />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
