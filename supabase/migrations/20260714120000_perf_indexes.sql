-- 20260714120000_perf_indexes.sql
-- Cria índices que faltavam na tabela architects.
-- Sem índice, cada busca por status (lista de pendentes/aprovados que as
-- atendentes abrem o dia todo) e cada checagem de cupom faz varredura da
-- tabela inteira — uma das fontes de consumo de I/O de disco.
--
-- Tabela pequena: cria em milissegundos, trava desprezível. Pode rodar
-- direto no SQL Editor do Supabase.

CREATE INDEX IF NOT EXISTS idx_architects_approval_status
    ON public.architects (approval_status);

CREATE INDEX IF NOT EXISTS idx_architects_coupon_code
    ON public.architects (coupon_code);
