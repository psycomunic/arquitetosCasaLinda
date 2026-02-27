-- Adiciona o campo de rastreio de vendedor MagaZord
ALTER TABLE architects ADD COLUMN magazord_seller_code varchar(255) UNIQUE;

-- Criação da tabela de comissões integradas com a MagaZord
CREATE TABLE magazord_commissions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    architect_id UUID REFERENCES architects(id) ON DELETE CASCADE,
    magazord_order_id VARCHAR(255) NOT NULL UNIQUE,
    magazord_seller_code VARCHAR(255) NOT NULL,
    order_value DECIMAL(10, 2) NOT NULL,
    commission_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PAID', 'CANCELED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ativação do RLS e Criação de Políticas de Segurança
ALTER TABLE magazord_commissions ENABLE ROW LEVEL SECURITY;

-- Política de Leitura: Arquitetos só podem ver suas próprias comissões
CREATE POLICY "Architects can view their own commissions"
    ON magazord_commissions FOR SELECT
    USING (auth.uid() = architect_id);

-- O sistema/admin insere e altera via Service Role / functions.
