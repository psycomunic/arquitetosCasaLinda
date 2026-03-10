-- Migration to add pix_key to architects table

ALTER TABLE public.architects ADD COLUMN IF NOT EXISTS pix_key TEXT;
