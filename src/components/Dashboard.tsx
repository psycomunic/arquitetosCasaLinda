
import React, { useState, useRef, useMemo } from 'react';
import {
  LayoutDashboard,
  FilePlus,
  History,
  Settings,
  LogOut,
  Plus,
  Printer,
  DollarSign,
  TrendingUp,
  Users,
  Star,
  Image as ImageIcon,
  CheckCircle2,
  Trash2,
  Search,
  ChevronLeft,
  Award,
  ArrowRight,
  ShieldCheck,
  Zap,
  Briefcase
} from 'lucide-react';
import { MOCK_ARTS, MOCK_SALES } from '../constants';
import { ArtPiece, ProposalItem, ArchitectProfile } from '../types';

interface DashboardProps {
  onExit: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onExit }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'proposals' | 'sales' | 'settings'>('overview');
  const [profile, setProfile] = useState<ArchitectProfile>({
    name: 'Isabella Arcuri',
    officeName: 'Arcuri Studio Design',
    commissionRate: 20,
    totalEarnings: 28450.00,
    logoUrl: 'https://images.unsplash.com/photo-1599305090748-364e26244675?q=80&w=200&auto=format&fit=crop'
  });

  const [proposalItems, setProposalItems] = useState<ProposalItem[]>([]);
  const [clientName, setClientName] = useState('');
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredArts = useMemo(() => {
    return MOCK_ARTS.filter(art =>
      art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleAddArtToProposal = (art: ArtPiece) => {
    setProposalItems([...proposalItems, { artPiece: art, quantity: 1 }]);
  };

  const handleRemoveArtFromProposal = (index: number) => {
    setProposalItems(proposalItems.filter((_, i) => i !== index));
  };

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

  const totalProposalValue = proposalItems.reduce((acc, item) => acc + (item.artPiece.price * item.quantity), 0);

  const renderOverview = () => (
    <div className="space-y-10 animate-fade-in no-print">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass p-10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 text-white/5 group-hover:text-gold/10 transition-colors">
            <DollarSign size={100} strokeWidth={1} />
          </div>
          <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-zinc-500 mb-6">Total Faturado</p>
          <h3 className="text-4xl font-serif text-white">R$ {profile.totalEarnings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
          <div className="mt-4 flex items-center gap-2 text-[10px] text-green-500 font-bold uppercase tracking-widest">
            <TrendingUp size={12} /> +22% Performance
          </div>
        </div>

        <div className="glass p-10 border-l-2 border-gold relative">
          <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-zinc-500 mb-6">Taxa de Parceria</p>
          <div className="flex items-baseline gap-3">
            <h3 className="text-5xl font-serif text-gold">{profile.commissionRate}%</h3>
            <span className="text-[9px] text-white/40 font-bold uppercase tracking-widest">Plano Platinum</span>
          </div>
          <p className="mt-4 text-[10px] text-zinc-400 font-medium uppercase tracking-[0.2em] leading-relaxed">
            Sua graduação permite repasses exclusivos acima da média.
          </p>
        </div>

        <div className="bg-ebonite glass p-10 shadow-2xl relative overflow-hidden border border-white/5">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Award size={100} strokeWidth={1} className="text-white" />
          </div>
          <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-zinc-600 mb-6">Status do Escritório</p>
          <h3 className="text-4xl font-serif text-white uppercase tracking-wider">Top Tier</h3>
          <p className="mt-4 text-[10px] text-gold font-bold uppercase tracking-widest">
            Benefícios VIP Ativos
          </p>
        </div>
      </div>

      <div className="glass overflow-hidden">
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
          <h3 className="font-serif text-2xl text-white">Vendas Recentes</h3>
          <button onClick={() => setActiveTab('sales')} className="text-[9px] text-gold hover:text-white font-bold uppercase tracking-[0.3em] transition-all flex items-center gap-2">
            Relatório de Repasses <ArrowRight size={14} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[9px] uppercase tracking-[0.4em] text-zinc-500 bg-black/40">
                <th className="px-10 py-5 font-bold">Data</th>
                <th className="px-10 py-5 font-bold">Projeto/Cliente</th>
                <th className="px-10 py-5 font-bold">Investimento</th>
                <th className="px-10 py-5 font-bold">Repasse (20%)</th>
                <th className="px-10 py-5 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {MOCK_SALES.slice(0, 4).map((sale) => (
                <tr key={sale.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-10 py-7 text-[11px] text-zinc-500">{new Date(sale.date).toLocaleDateString('pt-BR')}</td>
                  <td className="px-10 py-7 text-sm font-medium text-white">{sale.clientName}</td>
                  <td className="px-10 py-7 text-sm text-zinc-400">R$ {sale.value.toLocaleString('pt-BR')}</td>
                  <td className="px-10 py-7 text-sm font-bold text-gold">R$ {sale.commission.toLocaleString('pt-BR')}</td>
                  <td className="px-10 py-7">
                    <span className="text-[9px] px-3 py-1 glass rounded-full font-bold uppercase tracking-widest text-zinc-400">
                      {sale.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderProposalGenerator = () => (
    <div className="animate-fade-in no-print space-y-12">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Gallery Catalog */}
        <div className="w-full lg:w-2/3 space-y-10">
          <div className="glass p-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
              <h3 className="font-serif text-3xl text-white">Selecione o Acervo</h3>
              <div className="relative w-full md:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                <input
                  type="text"
                  placeholder="Buscar obra, série ou estilo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 text-xs border border-white/5 focus:outline-none focus:border-gold transition-all glass-dark text-white rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              {filteredArts.map((art) => (
                <div key={art.id} className="group relative flex flex-col glass overflow-hidden hover:border-gold/30 transition-all">
                  <div className="aspect-[4/5] bg-zinc-900 relative overflow-hidden">
                    <img
                      src={art.imageUrl}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-110 grayscale group-hover:grayscale-0 transition-all duration-1000"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-all duration-500" />
                    <button
                      onClick={() => handleAddArtToProposal(art)}
                      className="absolute bottom-6 right-6 w-14 h-14 bg-white text-black flex items-center justify-center rounded-full shadow-2xl scale-0 group-hover:scale-100 transition-transform duration-500 hover:bg-gold hover:text-white"
                    >
                      <Plus size={24} />
                    </button>
                  </div>
                  <div className="p-8">
                    <p className="text-[9px] text-gold uppercase tracking-[0.4em] font-bold mb-3">{art.category}</p>
                    <h4 className="font-serif text-2xl text-white mb-2">{art.title}</h4>
                    <p className="text-sm font-bold text-zinc-500">R$ {art.price.toLocaleString('pt-BR')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Floating Sidebar Generator */}
        <div className="w-full lg:w-1/3">
          <div className="glass p-12 sticky top-28 space-y-10">
            <div className="space-y-4">
              <h3 className="font-serif text-3xl text-white">Sua Proposta</h3>
              <div className="w-12 h-1 bg-gold"></div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-[0.4em] mb-4">Projeto / Ambiente</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Ex: Apartamento Ibirapuera"
                  className="w-full px-6 py-5 text-xs border border-white/5 focus:outline-none focus:border-gold transition-all glass-dark text-white rounded-lg"
                />
              </div>
            </div>

            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
              {proposalItems.length === 0 ? (
                <div className="text-center py-20 text-zinc-600 border border-dashed border-white/5 rounded-xl bg-white/5">
                  <ImageIcon className="mx-auto mb-4 opacity-10" size={50} strokeWidth={1} />
                  <p className="text-[10px] uppercase tracking-[0.3em] px-10">Componha seu projeto com obras do acervo</p>
                </div>
              ) : (
                proposalItems.map((item, idx) => (
                  <div key={idx} className="flex gap-5 items-center glass p-5 group border-white/5 hover:border-gold/20 transition-all rounded-lg">
                    <img src={item.artPiece.imageUrl} className="w-20 h-24 object-cover rounded shadow-lg" alt="" />
                    <div className="flex-1 overflow-hidden">
                      <p className="text-xs font-bold text-white truncate uppercase tracking-widest">{item.artPiece.title}</p>
                      <p className="text-[10px] text-gold mt-1">R$ {item.artPiece.price.toLocaleString('pt-BR')}</p>
                    </div>
                    <button onClick={() => handleRemoveArtFromProposal(idx)} className="text-zinc-600 hover:text-red-500 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="pt-10 border-t border-white/5 space-y-8">
              <div className="flex justify-between items-baseline">
                <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.4em]">Subtotal do Projeto</span>
                <span className="text-3xl font-serif text-white">R$ {totalProposalValue.toLocaleString('pt-BR')}</span>
              </div>

              <div className="bg-white/5 p-6 rounded-lg border border-white/5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-zinc-500 text-[9px] font-bold uppercase tracking-[0.4em]">Seu Repasse (20%)</span>
                  <Zap size={14} className="text-gold" />
                </div>
                <span className="font-serif text-gold text-2xl">R$ {(totalProposalValue * 0.2).toLocaleString('pt-BR')}</span>
              </div>

              <button
                onClick={() => setShowPrintPreview(true)}
                disabled={proposalItems.length === 0 || !clientName}
                className="w-full bg-white text-black py-6 font-bold flex items-center justify-center gap-4 hover:bg-gold transition-all disabled:opacity-10 disabled:grayscale disabled:cursor-not-allowed uppercase tracking-[0.4em] text-[10px] shadow-[0_0_30px_rgba(255,255,255,0.05)]"
              >
                <Printer size={18} /> Exportar Curadoria
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSales = () => (
    <div className="animate-fade-in no-print space-y-12">
      <div className="glass p-16 flex flex-col md:flex-row justify-between items-center gap-10 bg-gradient-to-br from-white/5 to-transparent">
        <div className="space-y-4">
          <h3 className="text-5xl font-serif text-white">Sua Performance</h3>
          <p className="text-zinc-500 text-sm font-light uppercase tracking-widest">Extrato consolidado de indicações técnicas.</p>
        </div>
        <div className="text-center md:text-right space-y-6">
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.6em]">Saldo para Resgate</p>
          <p className="text-6xl font-serif text-gold">R$ 5.480,00</p>
          <button className="px-12 py-5 bg-white text-black text-[9px] font-bold uppercase tracking-[0.4em] hover:bg-gold transition-all">
            Transferir Valores
          </button>
        </div>
      </div>

      <div className="glass overflow-hidden border border-white/5">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[9px] uppercase tracking-[0.5em] text-zinc-500 bg-black/40 border-b border-white/5">
              <th className="px-12 py-7 font-bold">Ref. Projeto</th>
              <th className="px-12 py-7 font-bold">Data</th>
              <th className="px-12 py-7 font-bold">Cliente / Escritório</th>
              <th className="px-12 py-7 font-bold">Valor Total</th>
              <th className="px-12 py-7 font-bold">Repasse Arquiteto</th>
              <th className="px-12 py-7 font-bold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {MOCK_SALES.map((sale) => (
              <tr key={sale.id} className="hover:bg-white/5 transition-colors">
                <td className="px-12 py-8 text-[11px] font-mono text-zinc-600">{sale.id}</td>
                <td className="px-12 py-8 text-xs text-zinc-400">{new Date(sale.date).toLocaleDateString('pt-BR')}</td>
                <td className="px-12 py-8 text-sm font-medium text-white">{sale.clientName}</td>
                <td className="px-12 py-8 text-sm text-zinc-400">R$ {sale.value.toLocaleString('pt-BR')}</td>
                <td className="px-12 py-8 text-sm font-bold text-gold">R$ {sale.commission.toLocaleString('pt-BR')}</td>
                <td className="px-12 py-8">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${sale.status === 'Concluído' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-gold shadow-[0_0_10px_rgba(197,160,89,0.5)]'}`} />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">{sale.status}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="max-w-4xl animate-fade-in no-print">
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

  return (
    <div className="flex min-h-screen bg-canvas text-zinc-200">
      {/* Dark Sidebar with Glass Blur */}
      <aside className="no-print w-80 glass border-r-0 flex flex-col fixed h-full z-20 shadow-2xl">
        <div className="p-12 h-full flex flex-col">
          <div className="mb-20 cursor-pointer" onClick={onExit}>
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
              {[
                { id: 'overview', icon: <LayoutDashboard size={16} />, label: 'Overview' },
                { id: 'proposals', icon: <FilePlus size={16} />, label: 'Nova Proposta' },
                { id: 'sales', icon: <History size={16} />, label: 'Repasses' },
                { id: 'settings', icon: <Settings size={16} />, label: 'Branding' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center gap-6 px-6 py-5 text-[9px] font-bold uppercase tracking-[0.3em] transition-all rounded-lg ${activeTab === item.id ? 'bg-gold text-black shadow-[0_10px_30px_rgba(197,160,89,0.3)]' : 'text-zinc-500 hover:text-white hover:bg-white/5'
                    }`}
                >
                  {item.icon} {item.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-auto">
            <button
              onClick={onExit}
              className="w-full flex items-center gap-6 px-6 py-5 text-[9px] font-bold text-zinc-600 hover:text-red-500 uppercase tracking-[0.4em] transition-all"
            >
              <LogOut size={16} /> Finalizar Sessão
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={`flex-1 transition-all duration-700 ${!showPrintPreview ? 'ml-80 p-16' : ''}`}>

        {showPrintPreview ? (
          <div className="max-w-4xl mx-auto bg-white min-h-[1122px] shadow-2xl p-24 text-black animate-fade-in relative">

            {/* Header Document (Always White for PDF quality) */}
            <div className="no-print absolute top-0 left-0 w-full -translate-y-full pb-10 flex justify-between items-center">
              <button onClick={() => setShowPrintPreview(false)} className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.4em] text-white hover:text-gold transition-all">
                <ChevronLeft size={16} /> Editar Proposta
              </button>
              <button onClick={() => window.print()} className="bg-gold text-black px-12 py-5 text-[10px] font-bold flex items-center gap-4 hover:bg-white transition-all uppercase tracking-[0.5em] shadow-2xl">
                <Printer size={18} /> Imprimir em Alta Definição
              </button>
            </div>

            <div className="flex justify-between items-start mb-32">
              <div className="space-y-12">
                <div className="w-56 h-56 bg-zinc-50 p-10 border border-zinc-100 shadow-sm flex items-center justify-center grayscale">
                  {profile.logoUrl ? <img src={profile.logoUrl} className="w-full h-full object-contain" alt="Arch Logo" /> : <span className="text-[10px] text-zinc-300 font-bold tracking-[0.4em] uppercase">Branding</span>}
                </div>
                <div>
                  <h3 className="text-3xl font-serif text-black">{profile.officeName}</h3>
                  <p className="text-[10px] text-zinc-400 uppercase tracking-[0.6em] font-medium mt-2">Interior Design & Art Curation</p>
                </div>
              </div>
              <div className="text-right space-y-4">
                <h1 className="text-7xl font-serif uppercase tracking-[0.1em] text-black/10">Project Selection</h1>
                <div className="space-y-2">
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.4em]">Ref: CP-{Math.floor(Math.random() * 99999).toString().padStart(5, '0')}</p>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.4em]">Data: {new Date().toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
            </div>

            <div className="mb-24 py-16 border-y border-zinc-100">
              <p className="text-[9px] uppercase tracking-[0.6em] text-zinc-300 font-bold mb-8 italic">Composição Exclusiva para:</p>
              <h2 className="text-7xl font-serif text-black tracking-tight">{clientName}</h2>
            </div>

            <div className="space-y-40 mb-40">
              {proposalItems.map((item, idx) => (
                <div key={idx} className="flex gap-24 items-start">
                  <div className="w-1/2 shadow-2xl grayscale hover:grayscale-0 transition-all duration-1000 bg-zinc-50">
                    <img src={item.artPiece.imageUrl} className="w-full h-auto" alt={item.artPiece.title} />
                  </div>
                  <div className="w-1/2 flex flex-col pt-10">
                    <p className="text-[10px] text-gold-leaf font-bold uppercase tracking-[0.5em] mb-4">{item.artPiece.category}</p>
                    <h4 className="text-5xl font-serif mb-12 text-black leading-tight">{item.artPiece.title}</h4>
                    <p className="text-zinc-500 text-base leading-relaxed font-light italic mb-16 border-l-2 border-zinc-100 pl-8">
                      "Uma peça de presença imponente, o canvas traz uma profundidade textural que ancora visualmente o ambiente, criando um ponto focal de sofisticação e alma."
                    </p>
                    <div className="mt-auto bg-zinc-50 p-10 border-l-4 border-black">
                      <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.4em] mb-2 text-zinc-400">Valor de Investimento:</p>
                      <p className="text-4xl font-serif text-black">R$ {item.artPiece.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-black text-white p-20 flex justify-between items-center mb-32">
              <div className="space-y-2">
                <p className="text-2xl font-serif tracking-[0.3em] uppercase">Investimento Total</p>
                <p className="text-[9px] text-zinc-500 uppercase tracking-[0.4em]">Seleção Premium Casa Linda</p>
              </div>
              <div className="text-right">
                <p className="text-7xl font-serif">R$ {totalProposalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>
            </div>

            <div className="pt-20 border-t border-zinc-100 flex justify-between items-end">
              <div className="text-[9px] text-zinc-300 font-bold tracking-[0.5em] uppercase">
                <p>{profile.officeName} & Casa Linda Decorações</p>
              </div>
              <div className="text-xl font-serif tracking-[0.4em] uppercase">
                <img src="/logo.png" alt="Casa Linda" className="h-10 object-contain grayscale" />
              </div>
            </div>
          </div>
        ) : (
          <div>
            <header className="flex justify-between items-end mb-24">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-gold shadow-[0_0_15px_rgba(197,160,89,0.8)]" />
                  <p className="text-gold text-[10px] font-bold uppercase tracking-[0.5em]">Sistema Private Ativo</p>
                </div>
                <h2 className="text-7xl font-serif text-white">
                  {activeTab === 'overview' && `Bem-vinda, ${profile.name.split(' ')[0]}`}
                  {activeTab === 'proposals' && 'Novo Projeto'}
                  {activeTab === 'sales' && 'Gestão de Repasses'}
                  {activeTab === 'settings' && 'Branding'}
                </h2>
              </div>
              {activeTab !== 'proposals' && (
                <button
                  onClick={() => setActiveTab('proposals')}
                  className="bg-white text-black px-12 py-5 text-[10px] font-bold flex items-center gap-5 hover:bg-gold transition-all shadow-2xl uppercase tracking-[0.4em] animate-pulse"
                >
                  <Plus size={18} /> Iniciar Curadoria
                </button>
              )}
            </header>

            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'proposals' && renderProposalGenerator()}
            {activeTab === 'settings' && renderSettings()}
            {activeTab === 'sales' && renderSales()}
          </div>
        )}
      </main>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c5a059;
        }
        @media print {
          body { background: white !important; }
          .no-print { display: none !important; }
          main { margin: 0 !important; padding: 0 !important; }
        }
      `}</style>
    </div>
  );
};
