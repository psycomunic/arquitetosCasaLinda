create extension if not exists pg_net;

select cron.unschedule('invoke_magazord_sync_every_15_min');

select
  cron.schedule(
    'invoke_magazord_sync_every_15_min',
    '*/15 * * * *',
    $$
    select
      net.http_post(
          url:='https://sfpzxxtptrlttvzymqto.supabase.co/functions/v1/magazord-sync',
          headers:='{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting('request.jwt.aud', true) || '"}'::jsonb
      ) as request_id;
    $$
  );
