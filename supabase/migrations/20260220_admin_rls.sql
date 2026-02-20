-- 20260220_admin_rls.sql
-- Esse script foi rodado no painel do Supabase para consertar o RLS e garantir que os administradores
-- (baseado na coluna is_admin = true) possam visualizar todos os arquitetos e outros dados necessários.

-- Primeiro, garante a função de validação de admin:
CREATE OR REPLACE FUNCTION public.is_app_admin()
RETURNS BOOLEAN AS $$
DECLARE
  is_admin_user BOOLEAN;
BEGIN
  SELECT is_admin INTO is_admin_user FROM public.architects WHERE id = auth.uid();
  RETURN COALESCE(is_admin_user, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. Regras para a tabela architects
DROP POLICY IF EXISTS "Admins access architects" ON architects;
CREATE POLICY "Admins access architects" ON architects
FOR ALL USING ( public.is_app_admin() );

-- 2. Regras para a tabela proposals
DROP POLICY IF EXISTS "Admins access proposals" ON proposals;
CREATE POLICY "Admins access proposals" ON proposals
FOR ALL USING ( public.is_app_admin() );

-- 3. Regras para a tabela proposal_items
DROP POLICY IF EXISTS "Admins access proposal_items" ON proposal_items;
CREATE POLICY "Admins access proposal_items" ON proposal_items
FOR ALL USING ( public.is_app_admin() );

-- 4. Regras para a tabela sales
DROP POLICY IF EXISTS "Admins access sales" ON sales;
CREATE POLICY "Admins access sales" ON sales
FOR ALL USING ( public.is_app_admin() );

-- 5. Regras para a tabela app_settings
DROP POLICY IF EXISTS "Admins access app_settings" ON app_settings;
CREATE POLICY "Admins access app_settings" ON app_settings
FOR ALL USING ( public.is_app_admin() );
