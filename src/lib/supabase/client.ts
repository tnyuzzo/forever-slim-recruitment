import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        // Implicit flow: il client auto-rileva #access_token nell'URL hash
        // e stabilisce la sessione. Necessario per invite link e magic link
        // che usano hash fragments (generateLink API).
        // PKCE (default SSR) ignora l'hash → sessione mai stabilita.
        flowType: 'implicit',
      },
    }
  )
}
