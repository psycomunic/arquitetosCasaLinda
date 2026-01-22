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
  Star,
  Globe,
  FileCheck,
  Users
} from 'lucide-react';
import { MovingCarousel } from '../components/MovingCarousel';

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

      {/* Dramatic Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-6 overflow-hidden pt-28">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=2000&auto=format&fit=crop"
            className="w-full h-full object-cover opacity-20 scale-105 animate-pulse-slow"
            alt="Interior Luxuoso"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-canvas via-canvas/50 to-canvas"></div>
        </div>

        <div className="container mx-auto relative z-10 text-center space-y-12">
          {/* Social Proof / Authority Badges */}
          <div className="flex flex-wrap justify-center gap-3 md:gap-6 mb-12">
            {[
              { icon: <Globe size={10} />, text: "Exportamos para os EUA" },
              { icon: <FileCheck size={10} />, text: "Certificado de Autenticidade" },
              { icon: <Users size={10} />, text: "+5.000 Arquitetos Ativos" }
            ].map((badge, i) => (
              <div key={i} className="glass border-white/5 px-5 py-2 rounded-full flex items-center gap-2 group transition-all hover:bg-white/5">
                <span className="text-gold group-hover:scale-110 transition-transform">{badge.icon}</span>
                <span className="text-[8px] uppercase tracking-[0.3em] text-zinc-400 font-bold">{badge.text}</span>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl lg:text-[6.5rem] font-serif leading-none tracking-tighter text-white max-w-6xl mx-auto">
              A maior referência,
              <br className="hidden md:block" />
              <span className="text-gradient-gold italic block mt-4">agora ao seu lado.</span>
            </h1>

            <p className="text-xs md:text-lg text-zinc-500 font-light max-w-2xl mx-auto leading-relaxed uppercase tracking-[0.4em]">
              Padrão galeria e <span className="text-white font-bold text-gold-leaf">20% de comissão</span> para seus projetos.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-6 justify-center pt-8">
            <button
              onClick={() => navigate('/register')}
              className="group relative overflow-hidden bg-gold-leaf text-black px-12 py-7 text-[10px] uppercase tracking-[0.5em] font-bold shadow-[0_20px_60px_rgba(197,160,89,0.2)] hover:shadow-[0_20px_80px_rgba(197,160,89,0.3)] transition-all hover:-translate-y-1 transform active:scale-95"
            >
              <span className="relative z-10">SOLICITAR ACESSO DE PARCEIRO</span>
              <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
            </button>
          </div>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-6 opacity-40 group cursor-pointer" onClick={() => {
          const section = document.getElementById('como-funciona');
          section?.scrollIntoView({ behavior: 'smooth' });
        }}>
          <p className="text-[7px] uppercase tracking-[0.6em] font-bold text-zinc-500 group-hover:text-gold transition-colors">Scroll para Explorar</p>
          <div className="w-px h-16 bg-gradient-to-b from-gold via-gold/50 to-transparent"></div>
        </div>
      </section>

      <MovingCarousel />

      {/* Seção Como Funciona (Três Caminhos de Venda) */}
      <section id="como-funciona" className="py-32 bg-black px-6 border-b border-white/5 relative overflow-hidden">
        {/* Ambient Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gold/5 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto text-center space-y-20 relative z-10">
          <div className="space-y-6">
            <h2 className="text-gold text-[10px] uppercase tracking-[0.6em] font-bold opacity-80">Parceria Inteligente</h2>
            <h3 className="text-4xl md:text-6xl font-serif text-white">3 Caminhos para sua Comissão</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* MECÂNICA 1 */}
            <div className="group relative glass p-10 hover:border-gold/30 transition-all duration-500 flex flex-col items-center text-center">
              <div className="text-gold mb-8">
                <div className="w-16 h-16 rounded-full border border-gold/20 flex items-center justify-center group-hover:bg-gold group-hover:text-black transition-all">
                  <Zap size={24} />
                </div>
              </div>
              <p className="text-[9px] uppercase tracking-widest text-gold font-bold mb-4">Mecânica 01</p>
              <h4 className="text-xl font-serif text-white mb-6 uppercase tracking-wider">Indicação Direta</h4>
              <p className="text-zinc-500 text-[11px] leading-relaxed mb-8 uppercase tracking-widest text-center">
                Ideal para projetos simples e alto volume. O cliente compra sozinho via seu <b>Link Exclusivo</b> ou <b>Cupom</b>. Zero fricção operacional e escala absoluta.
              </p>
              <button
                onClick={() => navigate('/register')}
                className="w-full mb-8 py-3 border border-white/10 text-[8px] uppercase tracking-[0.3em] font-bold text-white hover:bg-white hover:text-black transition-all duration-300"
              >
                Gerar meu Link Exclusivo
              </button>
              <div className="w-full space-y-3 pt-6 border-t border-white/5">
                <div className="flex justify-between text-[8px] uppercase tracking-widest font-bold">
                  <span className="text-zinc-600">Comissão</span>
                  <span className="text-white">Até 20%</span>
                </div>
                <div className="flex justify-between text-[8px] uppercase tracking-widest font-bold">
                  <span className="text-zinc-600">Esforço</span>
                  <span className="text-gold">Mínimo</span>
                </div>
              </div>
            </div>

            {/* MECÂNICA 2 */}
            <div className="group relative glass p-10 hover:border-gold/30 transition-all duration-500 flex flex-col items-center text-center">
              <div className="text-gold mb-8">
                <div className="w-16 h-16 rounded-full border border-gold/20 flex items-center justify-center group-hover:bg-gold group-hover:text-black transition-all">
                  <Monitor size={24} />
                </div>
              </div>
              <p className="text-[9px] uppercase tracking-widest text-gold font-bold mb-4">Mecânica 02</p>
              <h4 className="text-xl font-serif text-white mb-6 uppercase tracking-wider">Venda Assistida</h4>
              <p className="text-zinc-500 text-[11px] leading-relaxed mb-8 uppercase tracking-widest text-center">
                Nosso time sugere composições, ajusta medidas e <b>simula os quadros no seu projeto</b>. Você recebe um link personalizado para o cliente apenas realizar o pagamento.
              </p>
              <button
                onClick={() => navigate('/register')}
                className="w-full mb-8 py-3 bg-white/5 border border-gold/30 text-[8px] uppercase tracking-[0.3em] font-bold text-gold hover:bg-gold hover:text-black transition-all duration-300"
              >
                Solicitar Simulação Técnica
              </button>
              <div className="w-full space-y-3 pt-6 border-t border-white/5">
                <div className="flex justify-between text-[8px] uppercase tracking-widest font-bold">
                  <span className="text-zinc-600">Comissão</span>
                  <span className="text-white">+1% Bônus</span>
                </div>
                <div className="flex justify-between text-[8px] uppercase tracking-widest font-bold">
                  <span className="text-zinc-600">Suporte</span>
                  <span className="text-gold">Humanizado</span>
                </div>
              </div>
            </div>

            {/* MECÂNICA 3 */}
            <div className="group relative glass p-10 hover:border-gold/30 transition-all duration-500 flex flex-col items-center text-center">
              <div className="text-gold mb-8">
                <div className="w-16 h-16 rounded-full border border-gold/20 flex items-center justify-center group-hover:bg-gold group-hover:text-black transition-all">
                  <Star size={24} />
                </div>
              </div>
              <p className="text-[9px] uppercase tracking-widest text-gold font-bold mb-4">Mecânica 03</p>
              <h4 className="text-xl font-serif text-white mb-6 uppercase tracking-wider">Projetos Especiais</h4>
              <p className="text-zinc-500 text-[11px] leading-relaxed mb-8 uppercase tracking-widest text-center">
                <b>Projetos AAA</b>: Tamanho personalizado, espelhos sob medida e artes exclusivas de nosso artista residente para obras autorais de alto padrão.
              </p>
              <button
                onClick={() => navigate('/register')}
                className="w-full mb-8 py-3 bg-gold text-black text-[8px] uppercase tracking-[0.3em] font-bold shadow-[0_0_20px_rgba(197,160,89,0.3)] hover:shadow-[0_0_40px_rgba(197,160,89,0.5)] hover:-translate-y-0.5 transition-all duration-300"
              >
                Consultar Briefing VIP
              </button>
              <div className="w-full space-y-3 pt-6 border-t border-white/5">
                <div className="flex justify-between text-[8px] uppercase tracking-widest font-bold">
                  <span className="text-zinc-600">Comissão</span>
                  <span className="text-white">20% FIXO</span>
                </div>
                <div className="flex justify-between text-[8px] uppercase tracking-widest font-bold">
                  <span className="text-zinc-600">Nível</span>
                  <span className="text-gold">EXCLUSIVIDADE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Proposta de Valor (O que oferecemos) */}
      <section id="proposta" className="py-40 px-6 bg-ebonite relative">
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
                  src="/arte-exemplo.png"
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
                QUERO MEU ACESSO DE PARCEIRO
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-ebonite px-6">
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-gold text-[10px] uppercase tracking-[0.5em] font-bold">Dúvidas Frequentes</h2>
            <h3 className="text-4xl font-serif text-white">Perguntas Comuns</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              { q: "Preciso fechar a venda com o cliente?", a: "Não. Você pode apenas indicar ou optar pela venda assistida. O modelo é flexível." },
              { q: "Posso indicar quadros e espelhos sob medida?", a: "Sim. Trabalhamos com tamanhos personalizados e projetos especiais." },
              { q: "Como funciona a arte personalizada?", a: "Você envia o briefing e nosso artista residente desenvolve a arte exclusiva para o projeto." },
              { q: "Como sei quanto vou receber?", a: "Tudo fica disponível no seu dashboard, com total transparência." },
              { q: "Quando recebo a comissão?", a: "Mensalmente, após confirmação da venda." },
              { q: "Posso perder meu nível?", a: "Sim, caso não atinja o volume mínimo mensal. O sistema é justo e automático." },
              { q: "Posso usar a marca Casa Linda nos meus projetos?", a: "Sim, conforme diretrizes do Programa de Parcerias." }
            ].map((faq, i) => (
              <div key={i} className="glass p-8 space-y-4 hover:bg-white/5 transition-colors">
                <h4 className="text-sm font-bold text-white uppercase tracking-widest">{faq.q}</h4>
                <p className="text-xs text-zinc-400 leading-relaxed text-justify">{faq.a}</p>
              </div>
            ))}
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
              <span className="relative z-10 flex items-center gap-4">QUERO AUMENTAR MINHAS VENDAS COM CASA LINDA <ArrowRight size={16} /></span>
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
