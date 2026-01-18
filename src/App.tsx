import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

const App: React.FC = () => {
  // Mock profile data - in a real app this would come from a context or auth hook
  const profile = {
    name: 'Isabella Arcuri',
    officeName: 'Arcuri Studio Design',
    logoUrl: 'https://images.unsplash.com/photo-1599305090748-364e26244675?q=80&w=200&auto=format&fit=crop'
  };

  return (
    <Router>
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
