# PROJECT_STATUS.md — Recruitment App (closeragency.eu)

> Fonte di verità condivisa per Claude e Gemini.
> Aggiornato il: 2026-02-28

---

## Current State

- **Branch attivo:** main
- **Ultimo deploy:** Vercel (produzione) — commit `f3f89ed`
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
│   │   │   └── settings/page.tsx       # Impostazioni
│   │   ├── api/
│   │   │   ├── booking/route.ts        # Prenotazione colloquio
│   │   │   ├── send-notification/route.ts  # Notifiche (email/WhatsApp)
│   │   │   ├── invite/route.ts         # Invito colloquio
│   │   │   ├── inbound/route.ts        # Webhook email inbound Resend
│   │   │   ├── team/route.ts           # API gestione team
│   │   │   └── cron/reminders/route.ts # Reminder automatici (4 livelli)
│   │   └── layout.tsx
│   ├── components/
│   │   ├── landing/            # Componenti landing donna
│   │   ├── landing-uomo/       # Componenti landing uomo
│   │   ├── layout/             # Footer (accordion disclaimers)
│   │   └── ui/                 # Componenti UI base
│   ├── lib/
│   │   ├── supabase/           # Client, server, middleware, roles
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
- **Landing duplicata:** `/donna` = copia di `/` per tracking separato Facebook Ads (pixel custom).
- **Form multi-step:** 8 step (FormStep0–7) con scoring automatico al submit.
- **Pipeline candidati:** stati: `new → qualified → invited → interview_booked → offer_sent → hired | rejected`
- **Email:** Resend per invio, webhook inbound per ricevere risposte candidate via `reply@closeragency.eu`
- **Cron reminder:** 4 livelli (T-48h, T-24h, T-2h, T+0 no-show), timezone-aware, ogni 15 min
- **Redirect:** www.closeragency.eu → closeragency.eu (301 in next.config.ts)
- **Sender email:** `noreply@closeragency.eu` / `reply@closeragency.eu`

---

## Recently Completed

- [x] Hero mobile: immagine 16:9 sopra H1 per donna e uomo
- [x] UX mobile: sticky CTA, progress bar %, micro-feedback, checkbox fasce orarie, footer accordion
- [x] Logo Closer Agency aggiunto alla landing uomo
- [x] Email sender domain: closeragency.eu (Resend verified)
- [x] Cron reminder 4 livelli (T-48h, T-24h, T-2h, T+0)
- [x] Webhook inbound email con Svix signature verification
- [x] Status `offer_sent` aggiunto al pipeline candidati
- [x] Route `/donna` e `/apply-donna` per tracking FB Ads genere donna
- [x] Admin dashboard URL aggiornato al dominio produzione
- [x] **Ads recruiting batch 1**: generate 6 creatività (bonifico-provvigioni, typography-bold, confronto-ufficio × donna/uomo)
- [x] **Organizzazione ads/recruiting/**: suddivisa in `donna/` (31), `uomo/` (24), `unisex/` (16) — inclusi file da "Recruting old". Preview HTML aggiornato.
- [x] **Ads recruiting batch 2+3**: generate 12 immagini (dm-instagram, certificato-top-performer, meme-lunedi, countdown-posti, daylife-collage, lettera-futuro × donna/uomo)
- [x] **Gap analysis donna/uomo**: identificate 9 asimmetrie di stile e generate creatività mancanti (6 donna: pattern-interrupt, lifestyle, split-confronto, prima/dopo, whatsapp-mockup, candid; 3 uomo: identity, income, ugc-pov)
- [x] **Ads fascia 45-55**: generate 8 creatività age-specific (4 donna: testimonial-52, figli-grandi, split-20anni, typography-50; 4 uomo: piano-b, testimonial-51, checklist, calcolo-reddito). Preview aggiornato: donna 47, uomo 37, unisex 16 = 100 totali.
- [x] **Pulizia watermark Gemini**: rigenerati 16 file `Gemini_Generated_Image_*` senza stella/watermark → rinominati con nomi descrittivi (7 donna, 8 unisex, 1 uomo). Vecchi file eliminati. Preview HTML aggiornato.
- [x] **Fix testo duplicato coppia**: rigenerata `unisex-coppia-da-casa.jpg` (era `ws-10x-07-coppia.png`, lista bullet appariva due volte). Vecchio file eliminato.
- [x] **Facebook CAPI server-side**: implementati 3 eventi Lead → Schedule → CompleteRegistration in `/api/fb-event`; idempotenza con `fb_lead_event_id` (candidates) e `fb_event_sent` (interviews)
- [x] **Data di nascita**: tre select GG/MM/Anno in tutti i form (apply, apply-donna, apply-uomo) al posto di input date nativo
- [x] **UTM tracking completo**: 12 parametri attribution (`utm_source/medium/campaign/content/term`, `funnel`, `campaign_id/adset_id/ad_id`, `placement`, `site_source_name`, `fbclid`) salvati su `candidates`, `page_visitors`, e `localStorage('fs_utm')`
- [x] **Cloudflare Zaraz**: script caricato da `zaraz.closeragency.eu`; `zaraz.track('fb_pageview')` via DOMContentLoaded in fbpScript (trigger Cloudflare: `Event Name Equals fb_pageview`); `zaraz.track('Lead')` al submit form (apply + apply-uomo)
- [x] **page_visitors table**: nuova tabella Supabase per attribution recovery (session_id cookie HttpOnly 90gg + IP fallback)
- [x] **DB migration**: aggiornati `candidates` (+14 colonne attribution/CAPI) e `interviews` (+3 colonne CAPI idempotenza) via Management API
- [x] **`useUTMCapture.ts`**: nuovo hook + `getStoredUTMs()` utility per leggere UTMs da localStorage nel submit handler
- [x] **`/api/track-visitor`**: migliorato con idempotenza session_id (cookie `fs_sid`), fire-and-forget DB insert, sempre 200

---

- [x] **Cleanup & API optimization**: booking POST notifiche admin fire-and-forget (SMS+Email non bloccano la risposta), `Promise.all` su query DB indipendenti, import `Resend` top-level. Eliminati `src/components/form/` (9 file dead code) e `public/images/closer-agency-logo.jpeg` (2.6MB inutilizzato).

---

## In Progress

- nessuno

---

## TODO / Planned

- [ ] **Vercel env vars produzione**: aggiungere `FB_PIXEL_ID`, `FB_ACCESS_TOKEN`, `NEXT_PUBLIC_SITE_URL` tramite `vercel env add` (presenti in `.env.local` ma non su Vercel)
- [ ] Verifica funzionamento webhook inbound in produzione (corpo email nelle notifiche)
- [ ] Landing uomo `/uomo` (esiste ma da verificare parità con donna)
- [ ] A/B test headline landing donna
- [ ] Form uomo `/apply-uomo`: eventuali differenze copy rispetto a donna
- [ ] Valutare ads unisex fascia 45-55 (stili già coperti per donna/uomo)

### Sicurezza (completati 2026-02-28)
- [x] **`escapeHtml` utility**: creato `src/lib/escapeHtml.ts` per sanitizzare dati utente in template HTML email
- [x] **Auth server-side API admin**: aggiunto auth check con `createClient()` (cookie-based) in `team`, `invite`, `select-candidate` routes
- [x] **Auth Bearer send-notification**: protetto con `SUPABASE_SERVICE_ROLE_KEY` (chiamata interna da submit-application)
- [x] **Cron auth bypass fix**: `reminders/route.ts` ora richiede `CRON_SECRET` obbligatorio (`!CRON_SECRET` = 401)
- [x] **DEV_BYPASS_AUTH produzione**: aggiunto check `NODE_ENV !== 'production'` in `middleware.ts` e `supabase/middleware.ts`
- [x] **Whitelist submit-application**: sostituito spread operator con whitelist esplicita dei campi, `status` accetta solo `'rejected' | 'new'`
- [x] **escapeHtml email**: applicato a `send-notification`, `booking`, `invite`, `cron/reminders`, `inbound` routes
- [x] **Error message leak**: `submit-application` non espone più `error.message` al client

---

## Do NOT Touch

- `src/middleware.ts` — auth guard admin, modificare con cautela
- `src/lib/supabase/roles.ts` — gestione ruoli, testare prima di cambiare
- `vercel.json` — cron config, modifiche rompono reminder
- `src/types/database.ts` — allineato con schema Supabase, sincronizzare con migrazioni

---

## Conventions

- Commit: messaggi in italiano, imperativo, descrittivi
- Nomi componenti: PascalCase
- Nomi file route: kebab-case dove possibile
- Tailwind v4 (no config JS, usa CSS variables)
- `"use client"` solo dove necessario (preferire Server Components)
