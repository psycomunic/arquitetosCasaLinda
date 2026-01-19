import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { DashboardOverview } from './pages/DashboardOverview';
import { ProposalGenerator } from './pages/ProposalGenerator';
import { Earnings } from './pages/Earnings';
import { Settings } from './pages/Settings';
import { PortalLayout } from './layouts/PortalLayout';
import { CanvasPremium } from './pages/CanvasPremium';
import { Sustentabilidade } from './pages/Sustentabilidade';
import { Artesanato } from './pages/Artesanato';
import { TermosComissao } from './pages/TermosComissao';
import { SuportePrivate } from './pages/SuportePrivate';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { LGPD } from './pages/LGPD';
import { ThankYou } from './pages/ThankYou';
import { Analytics } from './components/Analytics';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App: React.FC = () => {
  const [profile, setProfile] = React.useState({
    name: '',
    officeName: '',
    logoUrl: ''
  });

  useEffect(() => {
    // Check active session and fetch profile
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('architects')
          .select('*')
          .eq('id', user.id)
          .single() as any;

        if (data) {
          setProfile({
            name: data.name,
            officeName: data.office_name,
            logoUrl: data.logo_url || ''
          });
        }
      }
    };

    fetchProfile();

    // Listen to changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) fetchProfile();
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <Analytics />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/canvas-premium" element={<CanvasPremium />} />
        <Route path="/sustentabilidade" element={<Sustentabilidade />} />
        <Route path="/artesanato" element={<Artesanato />} />
        <Route path="/termos-comissao" element={<TermosComissao />} />
        <Route path="/suporte-private" element={<SuportePrivate />} />
        <Route path="/obrigado" element={<ThankYou />} />

        {/* Legal Pages */}
        <Route path="/privacidade" element={<PrivacyPolicy />} />
        <Route path="/lgpd" element={<LGPD />} />

        {/* Portal Routes */}
        <Route path="/dashboard" element={
          <PortalLayout profile={profile}>
            <DashboardOverview />
          </PortalLayout>
        } />
        <Route path="/proposals" element={
          <PortalLayout profile={profile}>
            <ProposalGenerator />
          </PortalLayout>
        } />
        <Route path="/earnings" element={
          <PortalLayout profile={profile}>
            <Earnings />
          </PortalLayout>
        } />
        <Route path="/settings" element={
          <PortalLayout profile={profile}>
            <Settings />
          </PortalLayout>
        } />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
