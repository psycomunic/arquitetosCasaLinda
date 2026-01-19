import React from 'react';
import { PublicLayout } from '../layouts/PublicLayout';

export const PrivacyPolicy: React.FC = () => {
    return (
        <PublicLayout>
            <div className="pt-32 pb-20 px-6 md:px-12 max-w-4xl mx-auto space-y-8">
                <h1 className="text-4xl font-serif text-white mb-8">Política de Privacidade</h1>

                <div className="space-y-6 text-zinc-400 font-light leading-relaxed text-justify">
                    <p>
                        A Casa Linda Decorações ("nós", "nosso") está comprometida em proteger sua privacidade. Esta Política de Privacidade descreve como coletamos, usamos e compartilhamos suas informações pessoais ao utilizar nosso site e serviços.
                    </p>

                    <h2 className="text-2xl text-gold font-serif mt-8 mb-4">1. Coleta de Informações</h2>
                    <p>
                        Coletamos informações que você nos fornece diretamente, como nome, endereço de e-mail, telefone e endereço físico ao se cadastrar, fazer uma compra ou entrar em contato conosco. Também coletamos informações automaticamente, como endereço IP, tipo de navegador e dados de uso.
                    </p>

                    <h2 className="text-2xl text-gold font-serif mt-8 mb-4">2. Uso das Informações</h2>
                    <p>
                        Usamos suas informações para:
                        <ul className="list-disc pl-6 mt-2 space-y-2">
                            <li>Processar e entregar seus pedidos.</li>
                            <li>Comunicar sobre produtos, serviços e promoções.</li>
                            <li>Melhorar e personalizar sua experiência em nosso site.</li>
                            <li>Cumprir obrigações legais e regulatórias.</li>
                        </ul>
                    </p>

                    <h2 className="text-2xl text-gold font-serif mt-8 mb-4">3. Compartilhamento de Informações</h2>
                    <p>
                        Não vendemos suas informações pessoais. Podemos compartilhar seus dados com prestadores de serviços terceirizados que nos ajudam a operar nosso negócio (ex: processadores de pagamento, transportadoras), sempre sob estritas obrigações de confidencialidade.
                    </p>

                    <h2 className="text-2xl text-gold font-serif mt-8 mb-4">4. Segurança</h2>
                    <p>
                        Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações contra acesso não autorizado, alteração ou destruição.
                    </p>

                    <h2 className="text-2xl text-gold font-serif mt-8 mb-4">5. Seus Direitos</h2>
                    <p>
                        Você tem o direito de acessar, corrigir ou excluir suas informações pessoais. Entre em contato conosco através dos canais de suporte para exercer esses direitos.
                    </p>

                    <h2 className="text-2xl text-gold font-serif mt-8 mb-4">6. Contato</h2>
                    <p>
                        Para dúvidas sobre esta política, entre em contato pelo e-mail: suporte@casalindadecoracoes.com
                    </p>
                </div>
            </div>
        </PublicLayout>
    );
};
