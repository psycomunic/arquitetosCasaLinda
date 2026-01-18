import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Calculator,
  Instagram,
  Lock,
  Zap,
  Monitor,
  Sparkles,
  Star
} from 'lucide-react';

export const Home: React.FC = () => {
  const [calcValue, setCalcValue] = useState<number>(15000);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const formatCurrency = (val: number) =>
    val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="flex flex-col bg-canvas selection:bg-gold selection:text-black">
      {/* Spotlight Effect Layer */}
      <div className="fixed inset-0 pointer-events-none spotlight z-0"></div>

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
          <a href="#proposta" className="hover:text-gold transition-colors">Exclusividade</a>
          <a href="#tecnologia" className="hover:text-gold transition-colors">Portal Private</a>
          <a href="#comissao" className="hover:text-gold transition-colors">Rentabilidade</a>
        </div>

        <button
          onClick={() => navigate('/login')}
          className="group relative overflow-hidden bg-white text-black px-8 py-3 text-[9px] uppercase tracking-[0.3em] font-bold transition-all hover:scale-105 active:scale-95"
        >
          <span className="relative z-10">Acesso Restrito</span>
          <div className="absolute inset-0 bg-gold translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
        </button>
      </nav>

      {/* Dramatic Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=2000&auto=format&fit=crop"
            className="w-full h-full object-cover opacity-20 scale-110 animate-pulse-slow"
            alt="Interior Luxuoso"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-canvas via-transparent to-canvas"></div>
        </div>

        <div className="container mx-auto relative z-10 text-center space-y-12">
          <div className="inline-flex items-center gap-3 px-6 py-2 glass rounded-full animate-float">
            <Lock size={12} className="text-gold" />
            <span className="text-[9px] uppercase tracking-[0.4em] font-bold text-zinc-300">Apenas para Arquitetos e Designers</span>
          </div>

          <h1 className="text-6xl md:text-[9rem] font-serif leading-none tracking-tighter text-white">
            Onde a Técnica <br />
            <span className="text-gradient-gold italic font-light">Encontra a Obra.</span>
          </h1>

          <p className="text-sm md:text-xl text-zinc-400 font-light max-w-2xl mx-auto leading-relaxed uppercase tracking-[0.1em]">
            Elevamos a curadoria de arte a um padrão de elite. <br />
            <span className="text-white font-bold">20% de comissão direta</span> e ferramentas de luxo para o seu escritório.
          </p>

          <div className="flex flex-col md:flex-row gap-6 justify-center pt-8">
            <button
              onClick={() => navigate('/register')}
              className="group bg-gold-leaf text-black px-12 py-7 text-xs uppercase tracking-[0.4em] font-bold shadow-[0_0_50px_rgba(197,160,89,0.3)] hover:shadow-[0_0_80px_rgba(197,160,89,0.5)] transition-all hover:-translate-y-1"
            >
              Iniciar Parceria Private
            </button>
            <button className="glass text-white px-12 py-7 text-xs uppercase tracking-[0.4em] font-bold hover:bg-white/10 transition-all">
              Conhecer o Acervo
            </button>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-30">
          <p className="text-[8px] uppercase tracking-[0.5em] font-bold">Scroll para Descobrir</p>
          <div className="w-px h-20 bg-gradient-to-b from-gold to-transparent"></div>
        </div>
      </section>

      {/* Seção Proposta: Glass Cards */}
      <section id="proposta" className="py-40 px-6 bg-canvas relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-10">
              <h2 className="text-gold text-[10px] uppercase tracking-[0.6em] font-bold">Diferencial Elite</h2>
              <h3 className="text-5xl md:text-7xl font-serif text-white">Sua Marca, <br /> Nosso Acervo.</h3>
              <p className="text-lg text-zinc-500 font-light leading-relaxed">
                Desenvolvemos um ecossistema exclusivo para que você tenha o controle total. Gere propostas imersivas em segundos, personalizadas com a <span className="text-white border-b border-gold">identidade do seu escritório</span>.
              </p>

              <div className="grid gap-6">
                {[
                  { icon: <Zap />, title: "Comissão Superior", desc: "Repasse imediato de 20% em cada indicação." },
                  { icon: <Monitor />, title: "Portal White Label", desc: "Propostas PDF com a sua marca e logo." },
                  { icon: <Sparkles />, title: "Curadoria Curada", desc: "Acesso a obras exclusivas de artistas nacionais." }
                ].map((item, i) => (
                  <div key={i} className="glass p-8 group hover:bg-white/5 transition-all">
                    <div className="flex gap-6 items-center">
                      <div className="text-gold group-hover:scale-110 transition-transform">{item.icon}</div>
                      <div>
                        <h5 className="text-sm font-bold uppercase tracking-widest text-white">{item.title}</h5>
                        <p className="text-[11px] text-zinc-500 mt-1 uppercase tracking-wider">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="glass-dark p-2 rounded-2xl rotate-2 shadow-2xl overflow-hidden group">
                <img
                  src="https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=1000&auto=format&fit=crop"
                  className="w-full h-auto rounded-xl opacity-80 group-hover:opacity-100 transition-opacity duration-700"
                  alt="Arte Canvas"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-12">
                  <p className="text-3xl font-serif text-white italic">O padrão de galeria que seu cliente exige.</p>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-gold/10 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Calculadora de Ganhos: Gatilho Massivo de Conversão */}
      <section id="comissao" className="py-40 bg-ebonite px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gold/5 blur-[120px] rounded-full -z-10"></div>

        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-20 items-center">
          <div className="lg:w-1/2 space-y-8">
            <h3 className="text-gold text-[10px] uppercase tracking-[0.5em] font-bold">Rentabilidade Exclusiva</h3>
            <h2 className="text-5xl md:text-7xl font-serif text-white">Onde o lucro <br /> abraça a arte.</h2>
            <p className="text-zinc-500 font-light text-lg">
              Nosso modelo de negócio foi desenhado para profissionais de elite. Enquanto o mercado oferece 10%, a Casa Linda garante <span className="text-white font-bold">20%</span>.
            </p>
            <div className="flex items-center gap-6 p-8 glass-dark border-l-4 border-gold">
              <div className="w-12 h-12 bg-gold/20 flex items-center justify-center rounded-full text-gold">
                <Calculator size={24} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">Potencial de Ganho</p>
                <p className="text-sm text-zinc-200">Simule agora o retorno de sua próxima curadoria.</p>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 w-full glass p-12 md:p-16 relative">
            <div className="space-y-12">
              <div className="space-y-6">
                <div className="flex justify-between items-baseline">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">Valor do Projeto Curado</span>
                  <span className="text-4xl font-serif text-gold">{formatCurrency(calcValue)}</span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="100000"
                  step="1000"
                  value={calcValue}
                  onChange={(e) => setCalcValue(Number(e.target.value))}
                  className="w-full h-1 bg-zinc-800 appearance-none cursor-pointer accent-gold"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-10 border-t border-white/5">
                <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-gold-leaf">Seu Repasse Casa Linda</p>
                  <p className="text-5xl font-serif text-white">{formatCurrency(calcValue * 0.2)}</p>
                </div>
                <div className="opacity-20">
                  <p className="text-[10px] uppercase tracking-widest font-bold">Lojista Comum</p>
                  <p className="text-4xl font-serif">{formatCurrency(calcValue * 0.1)}</p>
                </div>
              </div>

              <button
                onClick={() => navigate('/register')}
                className="w-full py-6 bg-white text-black text-[10px] uppercase tracking-[0.5em] font-bold hover:bg-gold transition-all shadow-[0_10px_40px_rgba(255,255,255,0.1)]"
              >
                Ativar Minha Conta Premium
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final: High Urgency */}
      <section className="py-60 bg-canvas text-center px-6 relative">
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="flex justify-center">
            <div className="w-12 h-12 glass flex items-center justify-center rounded-full text-gold animate-bounce">
              <Star size={20} />
            </div>
          </div>
          <h2 className="text-6xl md:text-[10rem] font-serif italic text-white leading-none tracking-tighter">
            Curadoria é Poder.
          </h2>
          <p className="text-sm md:text-xl font-extralight tracking-[0.3em] text-zinc-500 uppercase max-w-2xl mx-auto leading-relaxed">
            Não ofereça apenas quadros. Ofereça uma experiência de galeria personalizada pelo seu olhar técnico.
          </p>
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <button
              onClick={() => navigate('/register')}
              className="group relative overflow-hidden bg-white text-black px-20 py-8 text-[10px] uppercase tracking-[0.5em] font-bold transition-all hover:scale-105"
            >
              <span className="relative z-10 flex items-center gap-4">Solicitar Acesso à Galeria <ArrowRight size={16} /></span>
              <div className="absolute inset-0 bg-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
            </button>
          </div>
          <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-[0.4em]">Seu convite expira em 24 horas</p>
        </div>
      </section>

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
                <li className="hover:text-white cursor-pointer transition-colors">Termos de Comissão</li>
                <li className="hover:text-white cursor-pointer transition-colors">Suporte Private</li>
              </ul>
            </div>
            <div className="space-y-6">
              <h5 className="text-gold text-[9px] uppercase tracking-widest font-bold">Processo</h5>
              <ul className="text-[10px] text-zinc-500 space-y-4 uppercase tracking-widest">
                <li className="hover:text-white cursor-pointer transition-colors">Canvas Premium</li>
                <li className="hover:text-white cursor-pointer transition-colors">Sustentabilidade</li>
                <li className="hover:text-white cursor-pointer transition-colors">Artesanato</li>
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

      <style>{`
        @keyframes pulse-slow {
          0% { transform: scale(1.1); opacity: 0.15; }
          50% { transform: scale(1.15); opacity: 0.25; }
          100% { transform: scale(1.1); opacity: 0.15; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 15s infinite ease-in-out;
        }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: #c5a059;
          cursor: pointer;
          border: 4px solid #1a1a1a;
          box-shadow: 0 0 20px rgba(197, 160, 89, 0.4);
        }
        section { scroll-margin-top: 100px; }
      `}</style>
    </div>
  );
};
