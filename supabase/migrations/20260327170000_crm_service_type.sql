-- ============================================================
-- CRM Migration: Add Service Type
-- Created: 2026-03-27
-- ============================================================

ALTER TABLE crm_leads 
ADD COLUMN IF NOT EXISTS service_type text NOT NULL DEFAULT 'indefinido' 
CHECK (service_type IN ('indefinido', 'indicacao_direta', 'venda_assistida', 'criacao_artistica'));
