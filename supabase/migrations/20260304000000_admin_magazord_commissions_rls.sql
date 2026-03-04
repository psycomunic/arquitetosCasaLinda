-- Permite que admins (is_admin = true) vejam e gerenciem todas as comissões MagaZord.
-- A função is_app_admin() já existe (criada em 20260220_admin_rls.sql).

DROP POLICY IF EXISTS "Admins access magazord_commissions" ON magazord_commissions;

CREATE POLICY "Admins access magazord_commissions"
    ON magazord_commissions
    FOR ALL
    USING ( public.is_app_admin() )
    WITH CHECK ( public.is_app_admin() );
