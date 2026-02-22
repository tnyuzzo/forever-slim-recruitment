# STACK_ANTONIO.md - Riferimento Completo per Progetti Web

> **ISTRUZIONI PER CLAUDE CODE:** Leggi SEMPRE questo file prima di iniziare un nuovo progetto.
> Contiene lo stack tecnologico standard, le credenziali e le regole di lavoro.

---

## 📋 INDICE

1. [Overview](#-overview)
2. [Credenziali & API Keys](#-credenziali--api-keys)
3. [Stack Tecnologico Standard](#-stack-tecnologico-standard)
4. [Template per Tipo Progetto](#-template-per-tipo-progetto)
5. [Setup Rapido Nuovo Progetto](#-setup-rapido-nuovo-progetto)
6. [Integrazioni Opzionali](#-integrazioni-opzionali)
7. [Workflow con Claude Code](#-workflow-con-claude-code)
8. [Checklist Sicurezza](#-checklist-sicurezza)
9. [Riferimenti Rapidi](#-riferimenti-rapidi)

---

## 🎯 OVERVIEW

### Scopo del Documento
Questo file definisce lo stack tecnologico standard per tutti i progetti web di Antonio.
Elimina la necessità di discutere infrastruttura ogni volta: le scelte sono già fatte.

### Come Usarlo
1. **Nuovo progetto:** Passa questo file a Claude Code all'inizio
2. **Scegli il template:** Landing Page, E-commerce, o Web App
3. **Claude procede:** Setup automatico con le credenziali già note

### Proprietario
- **Nome:** Antonio
- **Email:** tonytodavida@gmail.com
- **Approccio:** Autonomia massima, spiegazioni semplici, risultati funzionanti

---

## 🔐 CREDENZIALI & API KEYS

### GitHub
```
Username: tnyuzzo
Email: tonytodavida@gmail.com
```

### Vercel
```
Account: tonyuzzos-projects
API Token: tAwxdWxXGlek70qekcvdEu2K
Dashboard: https://vercel.com/tonyuzzos-projects
```

### Supabase
```
Organizzazione: Tonyuzzo (Free Plan)
Region preferita: Central EU (Frankfurt) - eu-central-1

# Progetto Forever Slim (esempio)
Project ID: zyvbsfdznegcqbfzuxpf
URL: https://zyvbsfdznegcqbfzuxpf.supabase.co
API Key: sb_publishable_XVhE21Xv-iIrR024rmVHrA_Zt0a0n1Z
API Token (Claude): sbp_895c2add50fc9483404c6c43518a2cb5e5d6e8d2
```

### Sanity CMS
```
Account: GitHub (tnyuzzo)

# Progetto Forever Slim
Project ID: t4gul96h
Dataset: production
API Token: skL343byLOSH7tDQ7piDq504I0DQCHOpjMZWP6QbmCF3cHbsamo8uS0j5YWsMXCep9MmodFAMFqKxnNZrHz8ebc60cGsVWRyHb7pW77dLJ8wBK2eiQboGPFSYQlLnuJEoZpR3BJUF9Ko9bZifnqf3xUZV1cFQz3TwHCXnVddv4FtoIZCiWZ2
Studio URL: http://localhost:3333
```

### WaveSpeed AI (Generazione Immagini)
```
API Key: (da configurare - usare MCP tool mcp__wavespeed__)
Modelli disponibili:
- google/nano-banana-pro/text-to-image  → Genera immagini da zero
- google/nano-banana-pro/edit           → Modifica immagini esistenti

Pricing:
- Text-to-Image: $0.03 (1K), $0.05 (2K), $0.10 (4K)
- Image Edit: $0.14 (1K/2K), $0.24 (4K)
```

### Stripe (Template - da configurare per progetto)
```
# Modalità Test
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Modalità Live (produzione)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

### Resend (Email - opzionale)
```
# Da configurare quando serve
RESEND_API_KEY=re_xxx
```

---

## 🛠 STACK TECNOLOGICO STANDARD

### Frontend
| Tecnologia | Versione | Scopo |
|------------|----------|-------|
| **Next.js** | 16+ | Framework React con App Router |
| **React** | 19+ | UI Library |
| **TypeScript** | 5+ | Type safety |
| **Tailwind CSS** | 4+ | Styling utility-first |
| **Lucide React** | latest | Icone |

### Backend & Database
| Tecnologia | Scopo |
|------------|-------|
| **Supabase** | Auth + PostgreSQL + Storage |
| Region: Frankfurt | Latenza ottimale per Italia (~15-20ms) |

### CMS (Contenuti Editabili)
| Tecnologia | Scopo |
|------------|-------|
| **Sanity** | CMS Headless per testi, FAQ, testimonial |
| **Portable Text** | Rich text con formattazione e colori |

### Hosting & Deploy
| Tecnologia | Scopo |
|------------|-------|
| **Vercel** | Hosting con deploy automatico da GitHub |
| **GitHub** | Version control |

### Immagini
| Tecnologia | Scopo |
|------------|-------|
| **Sharp** | Ottimizzazione (WebP/AVIF, resize) |
| **WaveSpeed AI** | Generazione/editing immagini con AI |

### Pagamenti
| Tecnologia | Scopo |
|------------|-------|
| **Stripe** | Pagamenti one-time e subscription |

---

## 📦 TEMPLATE PER TIPO PROGETTO

### 1️⃣ LANDING PAGE SEMPLICE

**Quando usarlo:** Pagina singola, no login, no database complesso

**Stack:**
- Next.js + Tailwind
- Sanity CMS (per testi editabili)
- Vercel

**Struttura:**
```
progetto/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Homepage
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── PortableText.tsx
│   └── lib/
│       └── sanity/
│           ├── client.ts
│           ├── queries.ts
│           └── types.ts
├── sanity/
│   ├── sanity.config.ts
│   └── schemas/
└── public/images/
```

**Dipendenze:**
```bash
npm install @sanity/client @portabletext/react lucide-react
npm install -D @tailwindcss/typography
```

---

### 2️⃣ E-COMMERCE

**Quando usarlo:** Vendita prodotti, checkout, area clienti

**Stack:**
- Next.js + Tailwind
- Sanity CMS (prodotti, contenuti)
- Supabase (auth, ordini, clienti)
- Stripe (pagamenti)
- Vercel

**Struttura:**
```
progetto/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Homepage
│   │   ├── layout.tsx
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── registrati/
│   │   ├── (dashboard)/          # Protette
│   │   │   ├── dashboard/
│   │   │   ├── ordini/
│   │   │   ├── profilo/
│   │   │   └── nuovo-ordine/     # Checkout
│   │   └── api/
│   │       ├── auth/callback/
│   │       └── stripe/webhook/
│   ├── components/
│   └── lib/
│       ├── sanity/
│       ├── supabase/
│       │   ├── client.ts
│       │   ├── server.ts
│       │   └── middleware.ts
│       └── stripe/
├── sanity/
├── supabase/
│   └── schema.sql
└── middleware.ts
```

**Dipendenze aggiuntive:**
```bash
npm install @supabase/supabase-js @supabase/ssr
npm install stripe @stripe/stripe-js
```

**Schema Database (Supabase):**
```sql
-- Tipi
CREATE TYPE order_status AS ENUM ('pending', 'paid', 'shipped', 'delivered', 'cancelled');
CREATE TYPE product_type AS ENUM ('1kit', '3kit');

-- Clienti
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  nome TEXT,
  cognome TEXT,
  telefono TEXT,
  indirizzo TEXT,
  citta TEXT,
  cap TEXT,
  provincia TEXT,
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ordini
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id),
  stripe_payment_intent_id TEXT,
  status order_status DEFAULT 'pending',
  total_amount DECIMAL(10,2) NOT NULL,
  product_type product_type NOT NULL,
  quantity INTEGER DEFAULT 1,
  shipping_address JSONB,
  tracking_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
```

---

### 3️⃣ WEB APP CON AUTENTICAZIONE

**Quando usarlo:** Dashboard, SaaS, app con login

**Stack:**
- Next.js + Tailwind
- Supabase (auth, database, storage)
- Vercel

**Struttura:**
```
progetto/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Landing pubblica
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   ├── registrati/
│   │   │   └── reset-password/
│   │   ├── (app)/                # Protette
│   │   │   ├── dashboard/
│   │   │   ├── settings/
│   │   │   └── [altre pagine]/
│   │   └── api/
│   │       └── auth/callback/
│   ├── components/
│   │   ├── ui/                   # Componenti riutilizzabili
│   │   └── forms/
│   └── lib/
│       └── supabase/
├── supabase/
│   └── schema.sql
└── middleware.ts                 # Protezione route
```

---

## 🚀 SETUP RAPIDO NUOVO PROGETTO

### Comandi Iniziali
```bash
# 1. Crea progetto Next.js
npx create-next-app@latest nome-progetto --typescript --tailwind --app --src-dir

# 2. Entra nella cartella
cd nome-progetto

# 3. Installa dipendenze base
npm install lucide-react

# 4. (Se serve Sanity) Inizializza nella stessa cartella
npm create sanity@latest -- --project-id NUOVO_ID --dataset production --output-path ./sanity

# 5. (Se serve Supabase)
npm install @supabase/supabase-js @supabase/ssr

# 6. (Se serve Stripe)
npm install stripe @stripe/stripe-js
```

### Template .env.local
```env
# === SUPABASE ===
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT_ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_xxx

# === SANITY ===
NEXT_PUBLIC_SANITY_PROJECT_ID=xxx
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=xxx

# === STRIPE ===
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# === DEVELOPMENT ===
DEV_BYPASS_AUTH=true
```

### Checklist Pre-Lancio
- [ ] Variabili ambiente configurate su Vercel
- [ ] Tabelle database create su Supabase
- [ ] Contenuti inseriti su Sanity
- [ ] Test pagamento Stripe (modalità test)
- [ ] Immagini ottimizzate (WebP/AVIF)
- [ ] Mobile responsive verificato
- [ ] Dominio collegato (opzionale)

---

## 🔌 INTEGRAZIONI OPZIONALI

### Email con Resend
```bash
npm install resend
```

```typescript
// lib/email.ts
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendOrderConfirmation(to: string, orderDetails: any) {
  await resend.emails.send({
    from: 'Forever Slim <noreply@tuodominio.com>',
    to,
    subject: 'Conferma Ordine',
    html: `<h1>Grazie per il tuo ordine!</h1>...`
  })
}
```

### Tracking con Facebook Pixel
```typescript
// components/FacebookPixel.tsx
'use client'
import Script from 'next/script'

export function FacebookPixel() {
  return (
    <Script id="facebook-pixel" strategy="afterInteractive">
      {`
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', 'TUO_PIXEL_ID');
        fbq('track', 'PageView');
      `}
    </Script>
  )
}
```

### Form Validation con Zod
```bash
npm install react-hook-form zod @hookform/resolvers
```

```typescript
// Esempio schema
import { z } from 'zod'

const contactSchema = z.object({
  nome: z.string().min(2, 'Nome troppo corto'),
  email: z.string().email('Email non valida'),
  messaggio: z.string().min(10, 'Messaggio troppo corto'),
})
```

### Error Monitoring con Sentry
```bash
npx @sentry/wizard@latest -i nextjs
```

---

## 🤝 WORKFLOW CON CLAUDE CODE

### Regole di Comunicazione
1. **Autonomia:** Procedi senza chiedere conferme continue
2. **Linguaggio:** Semplice, non tecnico
3. **Verifiche:** Usa Chrome per testare, non chiedere screenshot
4. **Consensi:** Chiedi una volta sola a inizio sessione

### Cosa Claude PUÒ Fare
- Scrivere e modificare codice
- Creare nuovi file e cartelle
- Eseguire comandi npm/git
- Fare deploy su Vercel
- Connettersi a Supabase/Sanity
- Generare immagini con WaveSpeed
- Testare il sito nel browser

### Cosa Claude NON PUÒ Fare
- Accedere a email/password personali
- Fare pagamenti reali
- Modificare account bancari
- Cancellare dati senza conferma

### Come Iniziare un Nuovo Progetto
```
"Ciao Claude, leggi STACK_ANTONIO.md e crea un nuovo progetto
[landing page / e-commerce / web app] chiamato [nome]."
```

### Come Continuare un Progetto Esistente
```
"Apri il progetto [nome] e [descrizione task]"
```

---

## 🔒 CHECKLIST SICUREZZA

### Headers HTTP (next.config.ts)
```typescript
const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
]
```

### Validazione Input
- [ ] Tutti i form validati con Zod
- [ ] Query parametrizzate (Supabase le fa di default)
- [ ] Sanitizzazione HTML se accetti rich text

### Rate Limiting
- Vercel ha rate limiting automatico
- Per API custom: usa `@upstash/ratelimit`

### Checklist Deployment
- [ ] Nessuna API key nel codice (solo .env)
- [ ] .env.local nel .gitignore
- [ ] RLS abilitato su Supabase
- [ ] HTTPS forzato (Vercel lo fa automatico)

---

## 🔗 RIFERIMENTI RAPIDI

### Dashboard
| Servizio | URL |
|----------|-----|
| Vercel | https://vercel.com/tonyuzzos-projects |
| Supabase | https://supabase.com/dashboard |
| Sanity | https://sanity.io/manage |
| Stripe | https://dashboard.stripe.com |
| GitHub | https://github.com/tnyuzzo |

### Documentazione
| Servizio | URL |
|----------|-----|
| Next.js | https://nextjs.org/docs |
| Supabase | https://supabase.com/docs |
| Sanity | https://sanity.io/docs |
| Tailwind | https://tailwindcss.com/docs |
| Stripe | https://stripe.com/docs |
| WaveSpeed | https://wavespeed.ai/docs |

### Comandi Utili
```bash
# Sviluppo locale
npm run dev                    # Avvia Next.js (porta 3000)
npm run sanity                 # Avvia Sanity Studio (porta 3333)

# Build & Deploy
npm run build                  # Build produzione
git push origin main           # Deploy automatico su Vercel

# Database
# Vai su Supabase Dashboard > SQL Editor per eseguire query

# Immagini
npm run image:optimize         # Ottimizza immagini con Sharp
```

---

## 📝 NOTE VERSIONI

### Ultimo Aggiornamento
- **Data:** 2 Febbraio 2026
- **Autore:** Claude (Anthropic) per Antonio

### Changelog
- v1.0 - Creazione documento con stack completo

---

*Questo file va tenuto aggiornato con nuove credenziali e decisioni tecnologiche.*
