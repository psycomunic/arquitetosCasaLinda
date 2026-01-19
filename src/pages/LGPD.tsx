import React from 'react';
import { PublicLayout } from '../layouts/PublicLayout';
import { ShieldCheck } from 'lucide-react';

export const LGPD: React.FC = () => {
    return (
        <PublicLayout>
            <div className="pt-32 pb-20 px-6 md:px-12 max-w-4xl mx-auto space-y-8">
                <div className="flex items-center gap-4 mb-8">
                    <ShieldCheck className="text-gold w-12 h-12" />
                    <h1 className="text-4xl font-serif text-white">LGPD Compliance</h1>
                </div>

                <div className="space-y-6 text-zinc-400 font-light leading-relaxed text-justify">
                    <p>
                        A Lei Geral de Proteção de Dados Pessoais (LGPD) - Lei nº 13.709/2018 - é a legislação brasileira que regula as atividades de tratamento de dados pessoais. A Casa Linda Decorações está em total conformidade com a LGPD, garantindo transparência e segurança no tratamento dos seus dados.
                    </p>

                    <h2 className="text-2xl text-gold font-serif mt-8 mb-4">Nossos Compromissos</h2>
                    <ul className="space-y-4">
                        <li className="glass p-6 rounded-lg border border-white/5">
                            <strong className="text-white block mb-2 uppercase tracking-widest text-xs">Transparência</strong>
                            Informamos claramente quais dados coletamos, para quê e por quanto tempo os armazenamos.
                        </li>
                        <li className="glass p-6 rounded-lg border border-white/5">
                            <strong className="text-white block mb-2 uppercase tracking-widest text-xs">Segurança</strong>
                            Adotamos os melhores padrões de segurança da informação para blindar seus dados contra vazamentos e acessos indevidos.
                        </li>
                        <li className="glass p-6 rounded-lg border border-white/5">
                            <strong className="text-white block mb-2 uppercase tracking-widest text-xs">Controle</strong>
                            Respeitamos seus direitos de titular. Você pode solicitar acesso, correção, portabilidade ou eliminação dos seus dados a qualquer momento.
                        </li>
                    </ul>

                    <h2 className="text-2xl text-gold font-serif mt-8 mb-4">Encarregado de Dados (DPO)</h2>
                    <p>
                        Para quaisquer solicitações ou dúvidas relacionadas à LGPD, você pode entrar em contato diretamente com nosso canal de privacidade:
                        <br /><br />
                        <span className="text-white font-bold">E-mail:</span> suporte@casalindadecoracoes.com
                        <br />
                        <span className="text-white font-bold">Assunto:</span> Solicitação LGPD
                    </p>
                </div>
            </div>
        </PublicLayout>
    );
};
