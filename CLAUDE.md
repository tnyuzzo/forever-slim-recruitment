# Recruitment App — CLAUDE.md

Per il contesto completo del progetto leggi `PROJECT_STATUS.md`.

## Stack
- Next.js 16 App Router | Supabase | Vercel | Tailwind | React Hook Form + Zod
- `NEXT_PUBLIC_*` env vars (non `VITE_*`) | API Routes in `src/app/api/` | No Edge Functions

## Supabase
- Project ref: `fxvnzxxioqpxrvownjag`
- Migration via Management API: `curl -X POST https://api.supabase.com/v1/projects/fxvnzxxioqpxrvownjag/database/query -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" -H "Content-Type: application/json" -d '{"query":"..."}'`
- `SUPABASE_ACCESS_TOKEN` è in `.env.local` (non committato)
- Storage upload (foto/audio candidati) rimane client-side anche se DB insert è server-side
- Schema `candidates`: ha sia `age_range` (legacy, non rimuovere) che `birth_date` (nuova)

## Git
- Path con `[id]` nella directory admin vanno quotati in zsh: `git add 'src/app/admin/candidates/[id]/page.tsx'`

## Facebook CAPI
- 3 eventi: **Lead** (submit form) → **Schedule** (booking confermato) → **CompleteRegistration** (admin marca "Assunto")
- Variabili Vercel ancora da aggiungere: `FB_PIXEL_ID`, `FB_ACCESS_TOKEN`, `NEXT_PUBLIC_SITE_URL`
- Test: aggiungere `test_event_code` nel body di `/api/fb-event`, verificare su Meta → Gestione eventi → Test Events
- `/api/fb-event` è endpoint interno — autenticato con `Authorization: Bearer SUPABASE_SERVICE_ROLE_KEY`

## Preview server
- Il server "recruitment-app" ha `cwd` puntato alla directory padre → errori `tailwindcss` pre-esistenti nei log errors
- Per verificare la build usare `preview_logs level:all` e cercare `✓ Compiled` (non `level:error`)
