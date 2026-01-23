import React, { useState } from 'react';
import { PublicLayout } from '../layouts/PublicLayout';
import { ShieldCheck, Award, Zap, Ruler, X } from 'lucide-react';

export const CanvasPremium: React.FC = () => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    return (
        <PublicLayout>
            <section className="pt-40 pb-20 px-6">
                <div className="max-w-7xl mx-auto space-y-24">
                    <div className="text-center space-y-8">
                        <h2 className="text-gold text-[10px] uppercase tracking-[0.6em] font-bold">Qualidade Museu</h2>
                        <h1 className="text-4xl sm:text-6xl md:text-[7rem] font-serif leading-tight text-white">Canvas Premium</h1>
                        <p className="text-zinc-500 font-light text-base md:text-xl max-w-3xl mx-auto leading-relaxed">
                            Descubra a verdadeira arte em tecido canvas, utilizado pelos artistas mais exigentes e museus ao redor do mundo.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-20 items-center">
                        <div className="space-y-12">
                            <div className="glass p-10 border-l-4 border-gold">
                                <h3 className="text-2xl font-serif text-white mb-6">Especificações Técnicas</h3>
                                <ul className="space-y-6">
                                    <li className="flex gap-4">
                                        <Zap className="text-gold shrink-0" size={20} />
                                        <p className="text-sm text-zinc-400 leading-relaxed">
                                            <strong className="text-white block uppercase tracking-widest text-[10px] mb-1">Material</strong>
                                            Canvas museu 100% algodão, 380 g/m².
                                        </p>
                                    </li>
                                    <li className="flex gap-4">
                                        <Zap className="text-gold shrink-0" size={20} />
                                        <p className="text-sm text-zinc-400 leading-relaxed">
                                            <strong className="text-white block uppercase tracking-widest text-[10px] mb-1">Tinta</strong>
                                            HP Latex® 4ª geração, à base d'água sem odor. Sustentável e segura para ambientes internos.
                                        </p>
                                    </li>
                                    <li className="flex gap-4">
                                        <Zap className="text-gold shrink-0" size={20} />
                                        <p className="text-sm text-zinc-400 leading-relaxed">
                                            <strong className="text-white block uppercase tracking-widest text-[10px] mb-1">Impressão</strong>
                                            HP Latex Série 800 - 4K real. Definição fotográfica extraordinária.
                                        </p>
                                    </li>
                                    <li className="flex gap-4">
                                        <Zap className="text-gold shrink-0" size={20} />
                                        <p className="text-sm text-zinc-400 leading-relaxed">
                                            <strong className="text-white block uppercase tracking-widest text-[10px] mb-1">Estrutura</strong>
                                            Madeira nobre tratada de reflorestamento. Opção de acabamento em gesso para selagem premium.
                                        </p>
                                    </li>
                                </ul>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-1 gap-6">
                                <div className="glass-3d p-8 text-center space-y-4 hover:-translate-y-1 transition-all">
                                    <ShieldCheck className="mx-auto text-gold" size={32} />
                                    <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-white">5 Anos de Garantia</p>
                                    <p className="text-[8px] text-zinc-500 uppercase tracking-widest">Embalagem Personalizada</p>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <img
                                src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1000&auto=format&fit=crop"
                                className="w-full h-auto rounded-lg shadow-2xl grayscale hover:grayscale-0 transition-all duration-1000"
                                alt="Canvas Detail"
                            />
                            <div className="absolute -bottom-10 -right-10 flex gap-4 no-print">
                                <div className="glass p-6 backdrop-blur-xl border-white/10">
                                    <p className="text-3xl font-serif text-white">4K</p>
                                    <p className="text-[8px] uppercase tracking-widest text-zinc-500">Resolução</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- CATALOGO DE MOLDURAS --- */}
                    <div className="space-y-40 pt-20">

                        {/* 1. Borda Infinita */}
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="glass-3d p-8 rounded-2xl group overflow-hidden">
                                <div className="aspect-square bg-black/40 rounded-xl overflow-hidden relative">
                                    <img
                                        src="/images/frames/borda-infinita.jpg"
                                        alt="Borda Infinita 360"
                                        className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-1000"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60"></div>
                                    <div className="absolute bottom-6 left-6 right-6">
                                        <h3 className="text-2xl font-serif text-white mb-2">Borda Infinita 360°</h3>
                                        <p className="text-sm text-zinc-300 font-light">A imagem continua nas laterais de 4cm, criando um efeito de imersão total.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <h2 className="text-gold text-[10px] uppercase tracking-[0.6em] font-bold">Moderna & Clean</h2>
                                <h3 className="text-4xl font-serif text-white">Estética de Galeria</h3>
                                <p className="text-zinc-400 font-light leading-relaxed">
                                    A opção favorita para obras contemporâneas e fotografias Fine Art. O acabamento em borda infinita elimina a necessidade de moldura externa, permitindo que a obra interaja diretamente com o ambiente.
                                </p>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-3 text-sm text-zinc-300">
                                        <div className="w-1.5 h-1.5 bg-gold rounded-full"></div>
                                        Chassi de madeira nobre tratada (4cm de espessura)
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-zinc-300">
                                        <div className="w-1.5 h-1.5 bg-gold rounded-full"></div>
                                        Impressão contínua nas laterais (efeito espelhado ou estendido)
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-zinc-300">
                                        <div className="w-1.5 h-1.5 bg-gold rounded-full"></div>
                                        Verso com acabamento selado e fita de proteção
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* 2. Coleção Minimalista (Caixa) */}
                        <div className="space-y-12">
                            <div className="text-center space-y-4">
                                <h2 className="text-gold text-[10px] uppercase tracking-[0.6em] font-bold">Coleção Minimalista</h2>
                                <h3 className="text-4xl md:text-5xl font-serif text-white">Moldura Caixa</h3>
                                <p className="text-zinc-500 max-w-2xl mx-auto font-light">
                                    Moldura reta que envolve diretamente o chassi, proporcionando um acabamento firme e clássico para sua obra.
                                </p>
                                <div className="inline-flex items-center gap-2 px-4 py-2 border border-gold/30 rounded-full bg-gold/5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse"></div>
                                    <span className="text-[10px] uppercase tracking-widest text-gold">Opção com Vidro Disponível</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {[
                                    { name: "Caixa Preta", img: "/images/frames/caixa-preta.png", desc: "Elegância atemporal" },
                                    { name: "Caixa Branca", img: "/images/frames/caixa-branca.png", desc: "Leveza e amplitude" },
                                    { name: "Caixa Madeira", img: "/images/frames/caixa-madeira.png", desc: "Aconchego natural" },
                                    { name: "Caixa Dourada", img: "/images/frames/caixa-dourada.png", desc: "Sofisticação moderna" },
                                ].map((item, i) => (
                                    <div key={i} className="group cursor-pointer">
                                        <div className="glass-3d p-4 rounded-xl aspect-square flex items-center justify-center mb-4 transition-all duration-500 group-hover:bg-white/5">
                                            <img
                                                src={item.img}
                                                alt={item.name}
                                                className="w-full h-full object-contain drop-shadow-2xl transform group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="text-center">
                                            <h4 className="text-white font-serif">{item.name}</h4>
                                            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 3. Coleção Flutuante (Float) */}
                        <div className="space-y-12">
                            <div className="text-center space-y-4">
                                <h2 className="text-gold text-[10px] uppercase tracking-[0.6em] font-bold">Design Contemporâneo</h2>
                                <h3 className="text-4xl md:text-5xl font-serif text-white">Moldura Flutuante (Float)</h3>
                                <p className="text-zinc-500 max-w-2xl mx-auto font-light">
                                    A flutuante dá um efeito de descolamento da moldura para o canvas, como se estivesse flutuando.
                                </p>
                                <div className="inline-flex items-center gap-2 px-4 py-2 border border-zinc-700 rounded-full bg-zinc-900/50">
                                    <span className="text-[10px] uppercase tracking-widest text-zinc-400">Não aceita vidro (Design Original)</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {[
                                    { name: "Flutuante Preta", img: "/images/frames/flutuante-preta.png", desc: "Profundidade & Contraste" },
                                    { name: "Flutuante Branca", img: "/images/frames/flutuante-branca.png", desc: "Minimalismo Puro" },
                                    { name: "Flutuante Madeira", img: "/images/frames/flutuante-madeira.jpg", desc: "Toque Orgânico" },
                                    { name: "Flutuante Dourada", img: "/images/frames/flutuante-dourada.jpg", desc: "Luxo Discreto" },
                                ].map((item, i) => (
                                    <div key={i} className="group cursor-pointer">
                                        <div className="glass-3d p-4 rounded-xl aspect-square flex items-center justify-center mb-4 transition-all duration-500 group-hover:bg-white/5">
                                            <img
                                                src={item.img}
                                                alt={item.name}
                                                className="w-full h-full object-contain drop-shadow-2xl transform group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="text-center">
                                            <h4 className="text-white font-serif">{item.name}</h4>
                                            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 3. Coleção Clássica (Côncava) */}
                        <div className="space-y-12">
                            <div className="text-center space-y-4">
                                <h2 className="text-gold text-[10px] uppercase tracking-[0.6em] font-bold">Coleção Clássica</h2>
                                <h3 className="text-4xl md:text-5xl font-serif text-white">Moldura Côncava</h3>
                                <p className="text-zinc-500 max-w-2xl mx-auto font-light">
                                    Perfil robusto com curvatura interna que conduz o olhar para a obra. Uma escolha tradicional que nunca sai de moda.
                                </p>
                                <div className="inline-flex items-center gap-2 px-4 py-2 border border-gold/30 rounded-full bg-gold/5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse"></div>
                                    <span className="text-[10px] uppercase tracking-widest text-gold">Opção com Vidro Disponível</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {[
                                    { name: "Côncava Preta", img: "/images/frames/concava-preta.png" },
                                    { name: "Côncava Branca", img: "/images/frames/concava-branca.jpg" },
                                    { name: "Côncava Madeira", img: "/images/frames/concava-madeira.jpg" },
                                    { name: "Côncava Dourada", img: "/images/frames/concava-dourada.png" },
                                ].map((item, i) => (
                                    <div key={i} className="group cursor-pointer">
                                        <div className="glass-3d p-4 rounded-xl aspect-square flex items-center justify-center mb-4 transition-all duration-500 group-hover:bg-white/5">
                                            <img
                                                src={item.img}
                                                alt={item.name}
                                                className="w-full h-full object-contain drop-shadow-2xl transform group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="text-center">
                                            <h4 className="text-white font-serif">{item.name}</h4>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 4. Coleção Premium Luxo */}
                        <div className="glass p-12 rounded-3xl border border-gold/20 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-50"></div>

                            <div className="grid md:grid-cols-2 gap-16 items-center relative z-10">
                                <div className="space-y-8">
                                    <div>
                                        <h2 className="text-gold text-[10px] uppercase tracking-[0.6em] font-bold mb-2">Linha Signature</h2>
                                        <h3 className="text-4xl md:text-5xl font-serif text-white leading-tight">Coleção Premium <br /><span className="text-2xl text-zinc-400 italic font-light">Luxo</span></h3>
                                    </div>
                                    <p className="text-zinc-300 font-light leading-relaxed">
                                        O ápice da molduraria fina. Acabamentos ornamentados inspirados na realeza, com detalhes em folha de ouro e prata. Ideal para obras que exigem imponência.
                                    </p>
                                    <div className="flex gap-4">
                                        <div className="inline-flex items-center gap-2 px-4 py-2 border border-gold/30 rounded-full bg-gold/10">
                                            <div className="w-1.5 h-1.5 rounded-full bg-gold"></div>
                                            <span className="text-[10px] uppercase tracking-widest text-gold text-nowrap">Com Vidro Crystal</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white/5 p-4 rounded-lg text-center border border-white/10">
                                            <span className="block text-gold font-serif text-xl mb-1">98%</span>
                                            <span className="text-[9px] uppercase tracking-widest text-zinc-400">Proteção UV</span>
                                        </div>
                                        <div className="bg-white/5 p-4 rounded-lg text-center border border-white/10">
                                            <span className="block text-gold font-serif text-xl mb-1">3mm</span>
                                            <span className="text-[9px] uppercase tracking-widest text-zinc-400">Vidro Crystal</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { name: "Roma Moderna", img: "/images/frames/roma-moderna.jpg" },
                                        { name: "Palaciana", img: "/images/frames/palaciana.jpg" },
                                        { name: "Realce Imperial", img: "/images/frames/realce-imperial.jpg" },
                                        { name: "Imperial Prata e Ouro", img: "/images/frames/imperial-prata-e-ouro.jpg" },
                                        { name: "Barroco Imperial", img: "/images/frames/barroco-imperial.jpg" },
                                    ].map((item, i) => (
                                        <div
                                            key={i}
                                            className="group relative rounded-xl overflow-hidden aspect-square border border-white/10 cursor-pointer"
                                            onClick={() => setSelectedImage(item.img)}
                                        >
                                            <img
                                                src={item.img}
                                                alt={item.name}
                                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                            />
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                <span className="text-white font-serif text-sm tracking-widest uppercase border-b border-gold pb-1">{item.name}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* 5. Coleção Premium Clássica */}
                        <div className="glass p-12 rounded-3xl border border-white/10 relative overflow-hidden">
                            <div className="grid md:grid-cols-2 gap-16 items-center relative z-10">
                                <div className="space-y-8 order-2 md:order-1">
                                    <div className="grid grid-cols-2 gap-4">
                                        {[
                                            { name: "Trono de Ouro", img: "/images/frames/trono-de-ouro.jpg" },
                                            { name: "Majestade Negra", img: "/images/frames/majestade-negra.jpg" },
                                            { name: "Galeria Imperial", img: "/images/frames/galeria-imperial.jpg" },
                                        ].map((item, i) => (
                                            <div
                                                key={i}
                                                className="group relative rounded-xl overflow-hidden aspect-square border border-white/10 cursor-pointer"
                                                onClick={() => setSelectedImage(item.img)}
                                            >
                                                <img
                                                    src={item.img}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                                />
                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                    <span className="text-white font-serif text-sm tracking-widest uppercase border-b border-gold pb-1">{item.name}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-8 order-1 md:order-2 text-right">
                                    <div>
                                        <h2 className="text-gold text-[10px] uppercase tracking-[0.6em] font-bold mb-2">Linha Signature</h2>
                                        <h3 className="text-4xl md:text-5xl font-serif text-white leading-tight">Coleção Premium <br /><span className="text-2xl text-zinc-400 italic font-light">Clássica</span></h3>
                                    </div>
                                    <p className="text-zinc-300 font-light leading-relaxed ml-auto">
                                        Sofisticação equilibrada. Molduras com perfis nobres e acabamentos refinados, perfeitas para ambientes que buscam elegância sem excessos.
                                    </p>
                                    <div className="flex justify-end gap-4">
                                        <div className="inline-flex items-center gap-2 px-4 py-2 border border-gold/30 rounded-full bg-gold/10">
                                            <div className="w-1.5 h-1.5 rounded-full bg-gold"></div>
                                            <span className="text-[10px] uppercase tracking-widest text-gold text-nowrap">Com Vidro Crystal</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 justify-end">
                                        <div className="bg-white/5 p-4 rounded-lg text-center border border-white/10 col-start-2">
                                            <span className="block text-gold font-serif text-xl mb-1">Crystal</span>
                                            <span className="text-[9px] uppercase tracking-widest text-zinc-400">Vidro 3mm</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Disclaimer +250 Molduras */}
                        <div className="glass p-8 rounded-xl border border-gold/10 text-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                            <p className="text-gold text-[10px] uppercase tracking-[0.4em] font-bold mb-2 relative z-10">Personalização Ilimitada</p>
                            <h3 className="text-2xl md:text-3xl font-serif text-white relative z-10">
                                +250 Molduras Disponíveis
                            </h3>
                            <p className="text-zinc-400 font-light mt-4 max-w-2xl mx-auto relative z-10">
                                Além da nossa curadoria online, dispomos de um acervo físico completo com centenas de perfis, acabamentos e texturas para harmonizar perfeitamente com seu projeto.
                            </p>
                        </div>
                    </div>


                    {/* Dedicated Authenticity Certificate Section */}
                    <div className="py-24 border-t border-white/5">
                        <div className="grid lg:grid-cols-2 gap-20 items-center">
                            <div className="space-y-8 order-2 lg:order-1">
                                <h2 className="text-gold text-[10px] uppercase tracking-[0.6em] font-bold">Respaldo e Precisão</h2>
                                <h3 className="text-4xl md:text-6xl font-serif text-white leading-tight">Certificado de Autenticidade</h3>
                                <p className="text-lg text-zinc-500 font-light leading-relaxed">
                                    Cada obra produzida pela Casa Linda é acompanhada por um documento oficial que atesta sua origem, materiais e exclusividade. O certificado assegura o valor patrimonial da arte para seu cliente, confirmando o uso de canvas 100% algodão e tintas HP Latex originais.
                                </p>
                                <div className="space-y-4">
                                    {[
                                        "Número de Série Único",
                                        "Assinatura do Ateliê",
                                        "Especificações Técnicas de Impressão",
                                        "Garantia de Longevidade (30+ anos)"
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-4 text-[10px] uppercase tracking-widest text-zinc-400 font-medium">
                                            <div className="w-1.5 h-1.5 rounded-full bg-gold"></div>
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="relative order-1 lg:order-2 -mx-6 sm:mx-0">
                                <div className="glass-3d-dark p-0 sm:p-6 rounded-none sm:rounded-2xl transform rotate-0 sm:rotate-3 scale-100 sm:scale-100 shadow-2xl hover:rotate-0 transition-transform duration-700 group">
                                    <img
                                        src="/images/certificado-autenticidade.png"
                                        className="w-full h-auto drop-shadow-2xl"
                                        alt="Documento de Autenticidade"
                                    />
                                    <div className="absolute inset-0 bg-gold/5 blur-3xl rounded-full -z-10 animate-pulse hidden sm:block"></div>
                                </div>
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-gold/10 rounded-full blur-3xl hidden sm:block"></div>
                            </div>
                        </div>
                    </div>

                    <div className="p-16 glass text-center space-y-8 bg-gold/5">
                        <h3 className="text-3xl font-serif text-white italic">"Prontos para pendurar em seu projeto."</h3>
                        <p className="text-zinc-500 text-sm font-light uppercase tracking-[0.2em] max-w-2xl mx-auto">
                            Você receberá os quadros finalizados com serrilha de fixação e kit de instalação completo, prontos para transformar o ambiente.
                        </p>
                    </div>
                </div>
            </section>

            {/* Lightbox Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300"
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        onClick={() => setSelectedImage(null)}
                        className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
                    >
                        <X size={32} />
                    </button>
                    <img
                        src={selectedImage}
                        alt="Zoomed detailed view"
                        className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </PublicLayout>
    );
};

