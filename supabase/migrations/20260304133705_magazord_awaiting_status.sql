-- Adiciona o status AWAITING no check constraint da tabela magazord_commissions
ALTER TABLE magazord_commissions DROP CONSTRAINT if exists magazord_commissions_status_check;
ALTER TABLE magazord_commissions ADD CONSTRAINT magazord_commissions_status_check CHECK (status IN ('AWAITING', 'PENDING', 'PAID', 'CANCELED'));
