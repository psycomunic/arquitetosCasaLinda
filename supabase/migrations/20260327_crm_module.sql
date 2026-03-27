-- ============================================================
-- CRM MODULE MIGRATION
-- Created: 2026-03-27
-- ============================================================

-- ----
-- crm_leads
-- ----
CREATE TABLE IF NOT EXISTS crm_leads (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    architect_id uuid REFERENCES architects(id) ON DELETE SET NULL,
    attendant_name text NOT NULL DEFAULT '',
    contact_name text NOT NULL DEFAULT '',
    contact_phone text NOT NULL DEFAULT '',
    contact_email text,
    pipeline_stage text NOT NULL DEFAULT 'novo'
        CHECK (pipeline_stage IN ('novo', 'contato_feito', 'proposta_enviada', 'negociando', 'fechado', 'perdido')),
    deal_value numeric NOT NULL DEFAULT 0,
    closed_at timestamptz,
    notes text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- ----
-- crm_activities
-- ----
CREATE TABLE IF NOT EXISTS crm_activities (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id uuid NOT NULL REFERENCES crm_leads(id) ON DELETE CASCADE,
    type text NOT NULL DEFAULT 'note'
        CHECK (type IN ('call', 'whatsapp', 'email', 'note', 'meeting')),
    description text NOT NULL DEFAULT '',
    attendant_name text NOT NULL DEFAULT '',
    created_at timestamptz NOT NULL DEFAULT now()
);

-- ----
-- crm_message_templates
-- ----
CREATE TABLE IF NOT EXISTS crm_message_templates (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    category text NOT NULL DEFAULT 'outros'
        CHECK (category IN ('boas_vindas', 'follow_up', 'proposta', 'reativacao', 'outros')),
    title text NOT NULL DEFAULT '',
    body text NOT NULL DEFAULT '',
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- ----
-- crm_followups
-- ----
CREATE TABLE IF NOT EXISTS crm_followups (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id uuid NOT NULL REFERENCES crm_leads(id) ON DELETE CASCADE,
    attendant_name text NOT NULL DEFAULT '',
    due_date date NOT NULL,
    message text,
    completed boolean NOT NULL DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- ----
-- RLS: allow admins to read/write all CRM data
-- ----
ALTER TABLE crm_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_message_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_followups ENABLE ROW LEVEL SECURITY;

-- Policies: allow authenticated users (admins) full access
CREATE POLICY "crm_leads_all" ON crm_leads FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "crm_activities_all" ON crm_activities FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "crm_message_templates_all" ON crm_message_templates FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "crm_followups_all" ON crm_followups FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ----
-- Seed default message templates
-- ----
INSERT INTO crm_message_templates (category, title, body) VALUES
(
    'boas_vindas',
    'Boas-vindas ao Programa',
    E'Olá {{nome}}! 🎉\n\nSeja muito bem-vindo(a) ao Programa de Parceiros Casa Linda!\n\nSeu cadastro foi aprovado e seu cupom exclusivo *{{cupom}}* já está ativo.\n\nAcesse o Portal do Arquiteto para consultar tabelas, políticas de comissão e muito mais:\n🔗 www.arquitetoscasalinda.com.br\n\nEstamos aqui para o que precisar! Boas vendas! ✨'
),
(
    'follow_up',
    'Follow-up Primeiro Contato',
    E'Olá {{nome}}, tudo bem? 😊\n\nPassei para saber como estão os projetos por aí!\n\nCaso tenha alguma dúvida sobre os produtos Casa Linda ou queira ver as tabelas de preços atualizadas, estou à disposição!\n\nLinks rápidos:\n📱 Atendimento: (47) 99706-0582\n🌐 Portal: www.arquitetoscasalinda.com.br'
),
(
    'follow_up',
    'Reativação 30 Dias',
    E'Olá {{nome}}! 👋\n\nFaz um tempinho que não nos falamos. Queria saber se está tudo bem e se posso ajudar com algum projeto.\n\nTemos novidades no catálogo que podem ser perfeitas para seus clientes!\n\nPosso te mostrar? 😊'
),
(
    'proposta',
    'Envio de Proposta',
    E'Olá {{nome}}! 😊\n\nConforme conversamos, preparei uma proposta especial com os produtos Casa Linda para o seu projeto.\n\nO seu cupom *{{cupom}}* garante {{desconto}}% de desconto para os seus clientes.\n\nQualquer dúvida, estou aqui! Quando podemos conversar para avançarmos?'
),
(
    'proposta',
    'Follow-up de Proposta Enviada',
    E'Oi {{nome}}! Tudo certo?\n\nPassei para saber se teve a oportunidade de analisar a proposta que enviei. 😊\n\nSe tiver alguma dúvida ou quiser ajustar algum item, é só me falar!\n\nAguardo seu retorno. Abraços!'
),
(
    'reativacao',
    'Reativação Cliente Inativo',
    E'Olá {{nome}}! Tudo bem? 🏡\n\nEstamos com novidades incríveis na Casa Linda e pensei em você!\n\nSeu cupom *{{cupom}}* continua ativo com desconto exclusivo para seus clientes.\n\nGostaria de marcar um bate-papo rápido para te mostrar as novidades? 🚀'
),
(
    'reativacao',
    'Reativação com Promoção',
    E'{{nome}}, boa tarde! ✨\n\nTemos uma promoção especial por tempo limitado e queria te avisar em primeira mão!\n\nÉ uma ótima oportunidade para fechar aquele projeto que ficou na gaveta. 😉\n\nPosso te passar os detalhes?'
),
(
    'outros',
    'Parabéns pelo Fechamento',
    E'{{nome}}, parabéns! 🎊🎉\n\nFicamos muito felizes em saber do fechamento! É uma satisfação enorme fazer parte dos seus projetos.\n\nConte sempre com a Casa Linda. Qualquer novidade, estamos aqui!\n\nAbraços e muito sucesso! 🏡✨'
);
