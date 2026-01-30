# Documento de Requisitos do Produto (PRD) - Portal do Arquiteto

## 1. Visão Geral do Projeto
O **Portal do Arquiteto** é uma plataforma exclusiva da **Casa Linda Decorações**, desenvolvida para fortalecer a parceria com arquitetos e designers de interiores. O objetivo principal é facilitar a especificação e venda de quadros decorativos de alto padrão, permitindo que os profissionais gerem propostas personalizadas, acompanhem suas comissões e acessem materiais de suporte vendas e marketing.

## 2. Personas de Usuário

### 2.1. O Arquiteto/Designer (Usuário Principal)
- **Perfil:** Profissional autônomo ou dono de escritório de arquitetura/interiores.
- **Dores:** Dificuldade em apresentar opções de quadros com preços e acabamentos claros; falta de transparência em comissões; necessidade de orçamentos rápidos.
- **Objetivos:** Impressionar clientes com propostas profissionais, agilizar o processo de venda, garantir sua comissão e ter acesso a produtos de qualidade.

### 2.2. O Administrador (Casa Linda)
- **Perfil:** Gestor da plataforma.
- **Objetivos:** Gerenciar parceiros, acompanhar vendas globais e garantir a atualização de preços e catálogos.

## 3. Histórias de Usuário (User Stories)
- **Como arquiteto**, quero fazer login seguro para acessar meus dados.
- **Como arquiteto**, quero criar uma proposta visual com opções de molduras e tamanhos para meu cliente aprovar.
- **Como arquiteto**, quero ver quanto ganhei de comissão para controlar meu financeiro.
- **Como arquiteto**, quero aprender melhores técnicas de venda para converter mais clientes.
- **Como administrador**, quero ter uma visão geral do desempenho da plataforma.

## 4. Requisitos Funcionais

### 4.1. Autenticação e Perfil
- [x] **Login/Registro:** Sistema de autenticação via E-mail/Senha (Supabase Auth).
- [x] **Recuperação de Senha:** Fluxo de "Esqueci minha senha" e atualização de senha.
- [x] **Gestão de Perfil:** Atualização de foto de perfil, logo do escritório e dados cadastrais.

### 4.2. Gerador de Propostas (Core Feature)
- [x] **Seleção de Arte:** Upload de imagem própria ou seleção de banco de imagens (Mock arts).
- [x] **Configuração de Moldura:**
    - Coleções: Borda Infinita, Caixa, Premium (Clássicas, Luxo, Flutuante, Côncava), Inox.
    - Acabamentos: Sem Vidro, Com Vidro.
    - Cores/Materiais: Preta, Branca, Dourada, Madeira, etc.
- [x] **Formatos e Tamanhos:**
    - 1 Tela Quadrado (ex: 85x85cm).
    - 1 Tela Padrão (ex: 115x75cm).
    - 2 Telas (Díptico) e 3 Telas (Tríptico).
- [x] **Cálculo Dinâmico de Preço:** Preço atualizado em tempo real com base no tamanho, moldura e acabamento escolhido.
- [x] **Visualização e Impressão:** Geração de proposta (PDF ou Web View) para envio ao cliente.

### 4.3. Dashboard e Financeiro
- [x] **Visão Geral:** Resumo de vendas, comissões pendentes e pagas.
- [x] **Minhas Vendas (Earnings):** Lista detalhada de vendas realizadas, status (Processando, Concluído) e valores.
- [x] **Ranking:** Visualização de desempenho comparativo (gamificação).

### 4.4. Recursos e Suporte
- [x] **Materiais Educativos:**
    - Manual do Arquiteto.
    - Guia de Parceiro.
    - Mecânicas de Vendas.
- [x] **Suporte:** Botão flutuante para WhatsApp e FAQ interno.

## 5. Requisitos Não Funcionais
- **Performance:** Carregamento rápido das páginas e imagens de molduras.
- **Responsividade:** Interface totalmente adaptada para Desktop, Tablets e Mobile.
- **Segurança:** Proteção de rotas (Protected Routes) e dados sensíveis via RLS (Row Level Security) no Supabase.
- **UX/UI:** Design "Premium", estético e alinhado com o mercado de luxo (Cores: Dourado, Preto, Branco, Glassmorphism).

## 6. Arquitetura Técnica
- **Frontend:** React (Vite), TypeScript.
- **Estilização:** Tailwind CSS (Utilitários e Design System).
- **Roteamento:** React Router Dom v7.
- **Backend / Database:** Supabase (PostgreSQL, Auth, Storage).
- **Ícones:** Lucide React.
- **Geração de PDF:** html2pdf.js.

## 7. Estrutura de Preços (Referência)
O sistema utiliza uma tabela de preços complexa baseada em:
1.  **Grupo de Preço** (ex: `borda_infinita`, `caixa`, `premium_standard`).
2.  **Acabamento** (`com_vidro`, `sem_vidro`).
3.  **Dimensão** (ex: `85x55cm`, `145x145cm`).
*Nota: A lógica de preços está centralizada em `src/constants.tsx`.*
