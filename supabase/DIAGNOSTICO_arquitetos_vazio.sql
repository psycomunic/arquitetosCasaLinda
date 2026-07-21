-- ============================================================
-- DIAGNÓSTICO — rode no SQL Editor do Supabase e me mande o resultado
-- É só leitura. Não altera nada.
-- ============================================================

-- 1) Quantos arquitetos existem por status de aprovação?
--    (Se a maioria estiver com status NULL/vazio, a lista some porque
--     o painel filtra por approval_status = 'approved')
select coalesce(approval_status, '(NULO)') as status, count(*)
from public.architects
group by 1
order by 2 desc;

-- 2) Os usuários que acessam o painel estão marcados como admin no BANCO?
--    (A regra de RLS depende de is_admin = true. Se estiver false/NULL,
--     o painel abre mas nenhuma linha aparece.)
select email, is_admin, approval_status
from public.architects
where email in (
  'psycomunic@gmail.com',
  'kelly.cordeirodasilva.5@gmail.com',
  'giselekf2@gmail.com',
  'renan.macedos@hotmail.com'
);

-- 3) Quais cron jobs estão realmente agendados? (pra confirmar a duplicação)
select jobid, schedule, jobname, active
from cron.job
order by jobname;
