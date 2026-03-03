# PROJECT_STATUS.md — Recruitment App (closeragency.eu)

> Fonte di verità condivisa per Claude e Gemini.
> Aggiornato il: 2026-03-03

---

## Current State

- **Branch attivo:** main
- **Ultimo deploy:** Vercel (produzione) — commit `f902e40`
- **Dominio:** https://closeragency.eu
- **Stato build:** ✅ stabile
- **Dev server:** `npm run dev` → porta 3001

---

## Stack & Dependencies

| Layer | Tech |
|---|---|
| Framework | Next.js 16.1.6 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Auth + DB | Supabase (SSR) |
| Email | Resend (outbound + inbound webhook) |
| Webhook signature | Svix |
| Forms | react-hook-form + zod |
| Calendar UI | react-big-calendar |
| Drag & Drop | @dnd-kit |
| Cron | Vercel Crons (ogni 15 min) |
| Deploy | Vercel |

---

## Project Structure

```
recruitment-app/
├── src/
│   ├── app/
│   │   ├── (public)/           # Pagine pubbliche
│   │   │   ├── page.tsx        # Landing donna (default, /)
│   │   │   ├── donna/page.tsx  # Landing donna tracking FB Ads
│   │   │   ├── uomo/page.tsx   # Landing uomo
│   │   │   ├── apply/page.tsx          # Form donna (multi-step)
│   │   │   ├── apply-donna/page.tsx    # Form donna (alias FB)
│   │   │   ├── apply-uomo/page.tsx     # Form uomo (multi-step)
│   │   │   ├── book/[token]/page.tsx   # Prenotazione colloquio
│   │   │   ├── thanks/page.tsx         # Pagina ringraziamento
│   │   │   ├── not-eligible/page.tsx   # Non idoneo
│   │   │   ├── privacy/page.tsx        # Privacy policy
│   │   │   ├── terms/page.tsx          # Termini
│   │   │   └── cookies/page.tsx        # Cookie policy
│   │   ├── admin/              # Area admin (auth-protected)
│   │   │   ├── page.tsx        # Dashboard candidati
│   │   │   ├── pipeline/page.tsx       # Kanban pipeline
│   │   │   ├── candidates/[id]/page.tsx # Dettaglio candidato
│   │   │   ├── calendar/page.tsx       # Calendario colloqui
│   │   │   ├── team/page.tsx           # Gestione team
│   │   │   ├── login/page.tsx          # Login (password + magic link)
│   │   │   └── settings/page.tsx       # Impostazioni
│   │   ├── auth/
│   │   │   └── callback/page.tsx       # Auth callback (processa #access_token hash)
│   │   ├── api/
│   │   │   ├── booking/route.ts        # Prenotazione colloquio
│   │   │   ├── send-notification/route.ts  # Notifiche (email/WhatsApp)
│   │   │   ├── invite/route.ts         # Invito colloquio
│   │   │   ├── inbound/route.ts        # Webhook email inbound Resend
│   │   │   ├── team/route.ts           # API gestione team
│   │   │   ├── my-role/route.ts        # Role detection (service_role)
│   │   │   ├── fb-event/route.ts       # Facebook CAPI events
│   │   │   └── cron/reminders/route.ts # Reminder automatici (4 livelli)
│   │   └── layout.tsx
│   ├── components/
│   │   ├── AuthRedirector.tsx    # Intercetta #access_token su qualsiasi pagina → /admin
│   │   ├── landing/            # Componenti landing donna
│   │   ├── landing-uomo/       # Componenti landing uomo
│   │   ├── layout/             # Footer (accordion disclaimers)
│   │   └── ui/                 # Componenti UI base
│   ├── lib/
│   │   ├── supabase/           # Client (flowType implicit), server, middleware, roles
│   │   ├── scoring.ts          # Sistema di scoring candidati
│   │   ├── tracking.ts         # Facebook Pixel / tracking
│   │   └── validation.ts       # Zod schemas
│   ├── types/
│   │   └── database.ts         # Tipi TypeScript (Candidate, Interview, ecc.)
│   └── middleware.ts           # Auth middleware
├── supabase/                   # Config e migrazioni Supabase
├── public/                     # Asset statici
├── next.config.ts              # Redirect www→non-www
└── vercel.json                 # Cron job config
```

---

## Architecture Decisions

- **Routing:** App Router Next.js. Pubblico in `(public)/`, admin protetto da middleware Supabase.
- **Auth flow:** Supabase browser client con `flowType: 'implicit'` (non PKCE) per supportare hash fragments da invite/magic link
- **AuthRedirector:** componente globale nel root layout che intercetta `#access_token` su qualsiasi pagina e redirige a `/admin`
- **Auth callback:** `/auth/callback/page.tsx` parsing manuale hash + `setSession()` come metodo primario, fallback `onAuthStateChange`
- **Landing duplicata:** `/donna` = copia di `/` per tracking separato Facebook Ads (pixel custom).
- **Form multi-step:** 8 step (FormStep0–7) con scoring automatico al submit.
- **Pipeline candidati:** stati: `new → invited → interview_booked → idoneo → hired | rejected` (6 stage, senza `qualified`)
- **Email:** Resend per invio, webhook inbound per ricevere risposte candidate via `reply@closeragency.eu`
- **Cron reminder:** 4 livelli (T-48h, T-24h, T-2h, T+0 no-show), timezone-aware, ogni 15 min
- **Redirect:** www.closeragency.eu → closeragency.eu (301 in next.config.ts)
- **Sender email:** `recruiting@closeragency.eu` (mittente unificato) / `reply@closeragency.eu` (inbound webhook)
- **Supabase site_url:** `https://closeragency.eu` (aggiornato da localhost)
- **Env vars:** `.trim()` su `NEXT_PUBLIC_SITE_URL` in tutte le API routes (Vercel env aveva newline trailing)

---

## Recently Completed

### Sessione 2026-03-03

- [x] **Fix redirect invito team**: root cause era `%0A` (newline) nella env var `NEXT_PUBLIC_SITE_URL` su Vercel che rompeva il redirect_to nell'invite link. Aggiunto `.trim()` a tutte le 6 API routes che leggono SITE_URL
- [x] **Fix auth flow (flowType implicit)**: `@supabase/ssr` usa `flowType: 'pkce'` di default che IGNORA `#access_token` nell'URL hash. Cambiato a `flowType: 'implicit'` in `client.ts` + parsing manuale hash con `setSession()` in callback e AuthRedirector
- [x] **AuthRedirector globale**: nuovo componente nel root layout che intercetta `#access_token` su qualsiasi pagina (gestisce vecchi link che arrivano in homepage)
- [x] **Auth callback migliorato**: `/auth/callback/page.tsx` con parsing manuale hash come metodo primario, `window.location.href` per redirect pulito
- [x] **Login admin Magic Link**: pagina login ora ha due modalità: password (come prima) + "Accedi senza password" (magic link via `signInWithOtp`). Per utenti invitati che non hanno password. `shouldCreateUser: false` per sicurezza
- [x] **Reinvite team members**: bottone "Reinvia Invito"/"Reinvia Accesso" per ogni membro + badge "Invito Pendente" per chi non ha ancora fatto login + link copiabile dopo reinvio
- [x] **Fix responsive team page**: layout mobile a due righe (info + bottoni) invece che overflow
- [x] **Fix superadmin role detection**: `/api/my-role` endpoint dedicato con service_role key (bypass RLS), admin layout semplificato
- [x] **Middleware temp disabled/restored**: disabilitato per workaround incident Vercel dxb1, poi ripristinato dopo che Vercel ha escluso dxb1 dai deploy target
- [x] **Storage bucket fix**: `candidate-audio` cambiato da privato a pubblico per permettere playback audio candidati

### Sessione 2026-03-02

- [x] **Pipeline semplificata (6 stage)**: rimosso `qualified` (ridondante con auto-scoring), rinominato `offer_sent` → `idoneo`. Migrazione DB enum + dati. File aggiornati: `database.ts`, `admin/page.tsx`, `pipeline/page.tsx`, `candidates/[id]/page.tsx`, `analytics/page.tsx`, `tracking.ts`
- [x] **Bulk delete candidati (superadmin)**: checkbox multi-selezione + bottone "Elimina selezionati" con conferma, visibile solo per superadmin
- [x] **Team invite via Resend**: riscritta `api/team/route.ts` — check esplicito utente esistente via `listUsers()`, magic link per utenti esistenti, invite link per nuovi, email via Resend API (non più Supabase mailer limitato a 3/h)
- [x] **Copy invite link UI**: bottone "Copia Link" con clipboard API nella pagina team, mostrato dopo ogni invito
- [x] **Fix superadmin role detection**: fallback a 3 livelli (RLS query → user_metadata → API `/api/team`) in `layout.tsx` e `admin/page.tsx` per risolvere race condition JWT/RLS
- [x] **Supabase site_url fix**: aggiornato da `http://localhost:3000` a `https://closeragency.eu` via Management API
- [x] **Email sender unificato**: tutti i mittenti cambiati a `Closer Agency <recruiting@closeragency.eu>`
- [x] **FB CAPI phone hash fix**: corretto hashing telefono per Facebook Conversions API

### Precedenti

- [x] Hero mobile: immagine 16:9 sopra H1 per donna e uomo
- [x] UX mobile: sticky CTA, progress bar %, micro-feedback, checkbox fasce orarie, footer accordion
- [x] Logo Closer Agency aggiunto alla landing uomo
- [x] Email sender domain: closeragency.eu (Resend verified)
- [x] Cron reminder 4 livelli (T-48h, T-24h, T-2h, T+0)
- [x] Webhook inbound email con Svix signature verification
- [x] Route `/donna` e `/apply-donna` per tracking FB Ads genere donna
- [x] Admin dashboard URL aggiornato al dominio produzione
- [x] **Facebook CAPI server-side**: 3 eventi Lead → Schedule → CompleteRegistration
- [x] **Data di nascita**: tre select GG/MM/Anno in tutti i form
- [x] **UTM tracking completo**: 12 parametri attribution salvati su candidates, page_visitors, localStorage
- [x] **Cloudflare Zaraz**: pageview tracciato server-side
- [x] **PostHog custom events**: 3 eventi analytics client-side

---

## In Progress

- nessuno

---

## TODO / Planned

- [ ] Verifica funzionamento webhook inbound in produzione
- [ ] Landing uomo `/uomo` (esiste ma da verificare parità con donna)
- [ ] A/B test headline landing donna
- [ ] Form uomo `/apply-uomo`: eventuali differenze copy rispetto a donna
- [ ] Valutare ads unisex fascia 45-55

---

## Do NOT Touch

- `src/middleware.ts` — auth guard admin, modificare con cautela
- `src/lib/supabase/roles.ts` — gestione ruoli, testare prima di cambiare
- `src/lib/supabase/client.ts` — `flowType: 'implicit'` necessario per invite/magic link, NON tornare a PKCE
- `vercel.json` — cron config, modifiche rompono reminder
- `src/types/database.ts` — allineato con schema Supabase, sincronizzare con migrazioni

---

## Conventions

- Commit: messaggi in italiano, imperativo, descrittivi
- Nomi componenti: PascalCase
- Nomi file route: kebab-case dove possibile
- Tailwind v4 (no config JS, usa CSS variables)
- `"use client"` solo dove necessario (preferire Server Components)
- Env vars: sempre `.trim()` quando si legge `NEXT_PUBLIC_SITE_URL`
