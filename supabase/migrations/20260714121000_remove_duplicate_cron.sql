-- 20260714121000_remove_duplicate_cron.sql
-- Havia DOIS cron jobs chamando a mesma função magazord-sync a cada 15 min:
--   1) magazord-sync-job                     (mantido)
--   2) invoke_magazord_sync_every_15_min     (removido = duplicado)
--
-- Removemos o duplicado (nº 2). Ele ainda enviava um Bearer inválido
-- (current_setting('request.jwt.aud')), então além de duplicado
-- provavelmente nem autenticava. Mantemos o nº 1, que já funciona.

select cron.unschedule('invoke_magazord_sync_every_15_min');
