-- Migration: age_range → birth_date
-- Da eseguire nel SQL Editor di Supabase Dashboard

-- 1. Aggiungi la nuova colonna birth_date
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS birth_date DATE;

-- 2. (Opzionale) Rimuovi la vecchia colonna age_range
-- ALTER TABLE candidates DROP COLUMN IF EXISTS age_range;
