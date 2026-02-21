-- Struttura RBAC (Role-Based Access Control) per l'App di Recruitment
-- Creazione della tabella user_roles e delle policy relative

-- 1. Creare la tabella user_roles
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('superadmin', 'recruiter')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Abilitare RLS sulla tabella user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. Policy per permettere a tutti gli autenticati di leggere il proprio ruolo
CREATE POLICY "Users can read own role" 
  ON public.user_roles 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- 4. Policy (usando la Service Role Key o il superadmin) per permettere ai superadmin di leggere tutti i ruoli
CREATE POLICY "Superadmin can read all roles"
  ON public.user_roles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() AND ur.role = 'superadmin'
    )
  );

-- 5. Policy per permettere la gestione completa (update/delete) ai superadmin
CREATE POLICY "Superadmin full access on user_roles"
  ON public.user_roles
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() AND ur.role = 'superadmin'
    )
  );
  
-- 6. Full access per service_role
CREATE POLICY "Service role full access on user_roles"
  ON public.user_roles
  FOR ALL
  USING (auth.role() = 'service_role');


-- 7. Funzione per ottenere il ruolo utente rapidamente (usata nelle view e RLS)
CREATE OR REPLACE FUNCTION public.get_user_role(lookup_uid UUID)
RETURNS TEXT 
LANGUAGE sql 
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.user_roles WHERE user_id = lookup_uid LIMIT 1;
$$;


-- 8. Assegnamo il ruolo di superadmin al primo utente registrato (Tony)
-- (Questo funzionerà solo se l'utente esiste già in auth.users)
DO $$
DECLARE
  first_user_id UUID;
BEGIN
  -- Trova il primo utente registrato (presumibilmente l'admin)
  SELECT id INTO first_user_id FROM auth.users ORDER BY created_at ASC LIMIT 1;
  
  IF first_user_id IS NOT NULL THEN
    -- Inserisci (o aggiorna se esiste già tramite on_conflict_do_nothing) il ruolo
    INSERT INTO public.user_roles (user_id, role)
    VALUES (first_user_id, 'superadmin')
    ON CONFLICT (user_id) DO UPDATE SET role = 'superadmin';
  END IF;
END $$;
