-- Enable pg_cron and pg_net extensions if not already enabled
create extension if not exists pg_cron with schema extensions;
create extension if not exists pg_net with schema extensions;

-- Function to trigger the Edge Function for MagaZord Sync
CREATE OR REPLACE FUNCTION public.invoke_magazord_sync()
RETURNS void AS $$
DECLARE
  project_url text;
  service_key text;
  request_id bigint;
BEGIN
  -- We assume the URL and KEY are set as custom settings or we construct it.
  -- In a managed Supabase project, you can use the built-in HTTP capabilities.
  
  -- Because standard pg_net requires hardcoding the URL, we'll use a placeholder
  -- that the user will need to adjust if executed manually, OR we use the GraphQL/REST
  -- endpoint. Since it's an edge function, it's public (but protected by CORS/keys if we want).
  -- Note: We just invoke the function. 
  
  -- Auth and Content-Type headers
  SELECT net.http_post(
      url:='https://sfpzxxtptrlttvzymqto.supabase.co/functions/v1/magazord-sync',
      headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmcHp4eHRwdHJsdHR2enltcXRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODc2NTIwMSwiZXhwIjoyMDg0MzQxMjAxfQ.9h5Ze5v8vI2e476sJYpcg49xE2-1TilTsb1Frkcjmnk"}'::jsonb
  ) INTO request_id;
END;
$$ LANGUAGE plpgsql;

-- Schedule the cron job to run every 15 minutes
-- Unschedule if exists first to avoid duplicates
SELECT cron.unschedule('magazord-sync-job');

-- Schedule it
SELECT cron.schedule(
    'magazord-sync-job',
    '*/15 * * * *', -- Every 15 minutes
    $$ SELECT public.invoke_magazord_sync(); $$
);
