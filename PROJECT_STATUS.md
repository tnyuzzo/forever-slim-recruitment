# PROJECT_STATUS.md — Recruitment App (closeragency.eu)

> Fonte di verità condivisa per Claude e Gemini.
> Aggiornato il: 2026-02-22

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
│   │   ├── form/               # FormStep0–7 + MultiStepForm
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

---

## In Progress

- nessuno

---

## TODO / Planned

- [ ] Verifica funzionamento webhook inbound in produzione (corpo email nelle notifiche)
- [ ] Landing uomo `/uomo` (esiste ma da verificare parità con donna)
- [ ] A/B test headline landing donna
- [ ] Form uomo `/apply-uomo`: eventuali differenze copy rispetto a donna

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
