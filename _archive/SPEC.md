# SPEC.md — Web App Reclutamento Venditrici Telefoniche

> **Per Claude Code:** Leggi questo file INSIEME a STACK_ANTONIO.md prima di iniziare.
> Usa il template "Web App con Autenticazione" dallo stack.
> Questo file contiene TUTTE le specifiche del progetto.

---

## §1 — CONTESTO PROGETTO

### Cosa stiamo costruendo
Web app completa (frontend pubblico + dashboard admin) per reclutare venditrici telefoniche donne (freelance) nel settore cosmetici + integratori alimentari per controllo peso.

### Vincoli fondamentali
- **Nome azienda:** MAI visibile nel frontend pubblico (riservatezza). Solo nel footer legale: "Swiss Research Labs GmbH"
- **Compliance:** Zero claim medici, zero "risultati garantiti", disclaimer guadagni sempre visibili
- **Mobile-first:** Il 90%+ del traffico arriva da ads mobile
- **Lingua UI:** Italiano (tutto il copy è in italiano)
- **Niente strumenti esterni:** Tutto in-app — nessuna dashboard esterna, nessun tool di terze parti per gestione candidature

### Stack (da STACK_ANTONIO.md)
- Next.js 16+ (App Router) + React 19+ + TypeScript 5+
- Tailwind CSS 4+ + Lucide React
- Supabase (Auth + PostgreSQL + Storage) — Region: Frankfurt (eu-central-1)
- Zod + react-hook-form per validazione form
- Vercel per deploy
- **NO Sanity CMS** (copy statico)
- **NO Stripe** (nessun pagamento)

---

## §2 — ARCHITETTURA PAGINE (ROUTING)

```
PAGINE PUBBLICHE:
/                  → Landing page long-form + CTA
/apply             → Form candidatura multi-step
/thanks            → Thank-you page (solo se "qualified")
/not-eligible      → Esito KO (messaggio rispettoso)

PAGINE LEGALI (pubbliche):
/privacy           → Privacy Policy
/cookies           → Cookie Policy
/terms             → Termini & Condizioni

PAGINE ADMIN (protette — Supabase Auth):
/admin/login       → Login admin
/admin             → Dashboard (lista candidature + filtri + KPI)
/admin/candidates/:id → Scheda candidato (dettagli, scoring, note, audio, azioni)
/admin/pipeline    → Vista kanban (new → qualified → interview_booked → hired → rejected)
/admin/calendar    → Calendario colloqui (vista mese/settimana + agenda)
/admin/settings    → Impostazioni (soglie KO, pesi scoring, disponibilità colloqui)
```

### Middleware (middleware.ts)
- Route `/admin/*` (escluso `/admin/login`): richiede autenticazione Supabase
- Route pubbliche: accesso libero
- Redirect non autenticati → `/admin/login`

---

## §3 — SCHEMA DATABASE (SQL — esegui su Supabase)

```sql
-- ============================================
-- ENUM TYPES
-- ============================================

CREATE TYPE candidate_status AS ENUM (
  'new',
  'qualified', 
  'interview_booked', 
  'hired', 
  'rejected'
);

CREATE TYPE candidate_priority AS ENUM (
  'low', 
  'medium', 
  'high'
);

CREATE TYPE italian_level AS ENUM (
  'low', 
  'medium', 
  'high'
);

CREATE TYPE interview_status AS ENUM (
  'scheduled', 
  'completed', 
  'no_show', 
  'rescheduled', 
  'canceled'
);

CREATE TYPE interview_outcome AS ENUM (
  'pass', 
  'fail', 
  'follow_up'
);

CREATE TYPE interview_channel AS ENUM (
  'phone', 
  'whatsapp', 
  'zoom'
);

-- ============================================
-- TABLE: candidates
-- ============================================

CREATE TABLE candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Dati base (Step 1)
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  city TEXT,
  country TEXT,
  age_range TEXT, -- "30-35", "36-40", "41-45", "46-50", "50+"

  -- Lingua & Comunicazione (Step 2)
  nationality TEXT,
  native_language TEXT,
  italian_level italian_level NOT NULL DEFAULT 'medium',
  strong_accent BOOLEAN DEFAULT false,
  bio_short TEXT, -- max 300 char "Presentati in 2 righe"

  -- Disponibilità (Step 3)
  hours_per_day INT NOT NULL DEFAULT 4,
  days_per_week INT NOT NULL DEFAULT 3,
  time_slots TEXT, -- "mattina", "pomeriggio", "sera", "flessibile"
  start_date DATE,
  weekend_sat BOOLEAN DEFAULT false,
  weekend_sun BOOLEAN DEFAULT false,
  holidays BOOLEAN DEFAULT false,

  -- Esperienza (Step 4)
  sales_years INT DEFAULT 0,
  inbound_outbound TEXT, -- "inbound", "outbound", "entrambi", "nessuno"
  sectors TEXT, -- testo libero
  close_rate_range TEXT, -- "0-10%", "10-20%", "20-30%", "30%+"
  motivation TEXT,

  -- Prove pratiche (Step 5)
  roleplay_think_about_it TEXT, -- obiezione "ci devo pensare"
  roleplay_bundle3 TEXT, -- proposta kit 3

  -- Audio (Step 6)
  audio_url TEXT,
  audio_uploaded BOOLEAN DEFAULT false,

  -- Scoring (calcolato al submit)
  score_total INT DEFAULT 0,
  score_breakdown JSONB DEFAULT '{}',
  priority candidate_priority DEFAULT 'low',

  -- Status & admin
  status candidate_status DEFAULT 'new',
  ko_reason TEXT,
  notes TEXT, -- note interne admin

  -- UTM tracking
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_adset TEXT,
  utm_ad TEXT,

  -- Consensi
  consent_privacy BOOLEAN NOT NULL DEFAULT false,
  consent_truth BOOLEAN NOT NULL DEFAULT false,
  consent_whatsapp BOOLEAN DEFAULT false
);

-- Indici per ricerca e filtri admin
CREATE INDEX idx_candidates_status ON candidates(status);
CREATE INDEX idx_candidates_priority ON candidates(priority);
CREATE INDEX idx_candidates_score ON candidates(score_total DESC);
CREATE INDEX idx_candidates_created ON candidates(created_at DESC);
CREATE INDEX idx_candidates_email ON candidates(email);

-- ============================================
-- TABLE: interviews
-- ============================================

CREATE TABLE interviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  scheduled_start TIMESTAMPTZ NOT NULL,
  scheduled_end TIMESTAMPTZ NOT NULL,
  channel interview_channel DEFAULT 'phone',
  meeting_link TEXT,
  interviewer TEXT,

  status interview_status DEFAULT 'scheduled',
  outcome interview_outcome,
  admin_notes TEXT
);

CREATE INDEX idx_interviews_candidate ON interviews(candidate_id);
CREATE INDEX idx_interviews_date ON interviews(scheduled_start);
CREATE INDEX idx_interviews_status ON interviews(status);

-- ============================================
-- TABLE: admin_settings (single row)
-- ============================================

CREATE TABLE admin_settings (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1), -- forza riga singola
  
  ko_min_hours INT DEFAULT 4,
  ko_min_days INT DEFAULT 3,
  
  scoring_weights JSONB DEFAULT '{
    "italian_high": 20,
    "italian_medium": 10,
    "experience_inbound": 15,
    "close_rate_high": 10,
    "availability_6plus": 10,
    "weekend_available": 5,
    "roleplay_quality": 20,
    "audio_uploaded": 5
  }',
  
  interview_slots JSONB DEFAULT '{
    "monday": ["10:00-12:00", "14:00-17:00"],
    "tuesday": ["10:00-12:00", "14:00-17:00"],
    "wednesday": ["10:00-12:00", "14:00-17:00"],
    "thursday": ["10:00-12:00", "14:00-17:00"],
    "friday": ["10:00-12:00", "14:00-17:00"]
  }',
  
  notification_emails JSONB DEFAULT '["tonytodavida@gmail.com"]'
);

-- Inserisci riga default
INSERT INTO admin_settings (id) VALUES (1);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Pubblico: può solo INSERIRE candidature (niente SELECT/UPDATE/DELETE)
CREATE POLICY "Pubblico può inserire candidatura"
  ON candidates FOR INSERT
  TO anon
  WITH CHECK (true);

-- Admin autenticati: accesso completo a candidates
CREATE POLICY "Admin accesso completo candidates"
  ON candidates FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Admin autenticati: accesso completo a interviews
CREATE POLICY "Admin accesso completo interviews"
  ON interviews FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Admin autenticati: accesso completo a settings
CREATE POLICY "Admin accesso completo settings"
  ON admin_settings FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================
-- STORAGE: bucket per audio candidati
-- ============================================
-- Crea via Supabase Dashboard o API:
-- Bucket name: "candidate-audio"
-- Public: false
-- File size limit: 10MB
-- Allowed MIME types: audio/mpeg, audio/wav, audio/ogg, audio/webm, audio/mp4
-- 
-- Storage policies:
-- INSERT per anon (upload pubblico durante candidatura)
-- SELECT/DELETE per authenticated (admin)
```

---

## §4 — FORM CANDIDATURA MULTI-STEP

### Struttura step e validazione Zod

Ogni step ha il proprio schema Zod. La navigazione è avanti/indietro con salvataggio locale (state React, NON localStorage). Progress bar visibile in alto.

```typescript
// ============================================
// STEP 0 — PRE-QUALIFICA (Sì/No) — KO immediato
// ============================================
// Domande:
// 1. "Posso garantire minimo 4 ore al giorno?" → Sì/No
// 2. "Posso lavorare almeno 3 giorni a settimana?" → Sì/No
// 3. "Posso rispettare gli appuntamenti senza ritardi?" → Sì/No
// 4. "Parlo italiano in modo fluido e naturale con clientela italiana?" → Sì/No
//
// LOGICA: Se QUALSIASI risposta = "No" → redirect /not-eligible
// KO reason: "Pre-qualifica: non soddisfa requisito [X]"

const step0Schema = z.object({
  pq_hours: z.literal(true, { errorMap: () => ({ message: "Questo requisito è necessario" }) }),
  pq_days: z.literal(true, { errorMap: () => ({ message: "Questo requisito è necessario" }) }),
  pq_punctuality: z.literal(true, { errorMap: () => ({ message: "Questo requisito è necessario" }) }),
  pq_italian: z.literal(true, { errorMap: () => ({ message: "Questo requisito è necessario" }) }),
})

// ============================================
// STEP 1 — DATI BASE
// ============================================
const step1Schema = z.object({
  first_name: z.string().min(2, "Inserisci il tuo nome"),
  last_name: z.string().min(2, "Inserisci il tuo cognome"),
  email: z.string().email("Email non valida"),
  whatsapp: z.string().min(8, "Inserisci il numero WhatsApp con prefisso"),
  country: z.string().min(2, "Seleziona il paese"),
  city: z.string().min(2, "Inserisci la città"),
  age_range: z.enum(["30-35", "36-40", "41-45", "46-50", "50+"]),
})

// ============================================
// STEP 2 — LINGUA & COMUNICAZIONE
// ============================================
// LOGICA KO: se italian_level = "low" → KO automatico
// KO reason: "Livello italiano insufficiente"
const step2Schema = z.object({
  nationality: z.string().min(2, "Inserisci la nazionalità"),
  native_language: z.string().min(2, "Inserisci la lingua madre"),
  italian_level: z.enum(["low", "medium", "high"]),
  strong_accent: z.boolean(),
  bio_short: z.string().max(300, "Massimo 300 caratteri").min(20, "Scrivi almeno 20 caratteri"),
})

// ============================================
// STEP 3 — DISPONIBILITÀ
// ============================================
// LOGICA KO: se hours_per_day < 4 → KO
// LOGICA KO: se days_per_week < 3 → KO
const step3Schema = z.object({
  hours_per_day: z.number().min(1).max(12),
  days_per_week: z.number().min(1).max(7),
  time_slots: z.string().min(1, "Seleziona almeno una fascia oraria"),
  start_date: z.string().min(1, "Indica quando puoi iniziare"),
  weekend_sat: z.boolean(),
  weekend_sun: z.boolean(),
  holidays: z.boolean(),
})

// ============================================
// STEP 4 — ESPERIENZA
// ============================================
const step4Schema = z.object({
  sales_years: z.number().min(0),
  inbound_outbound: z.enum(["inbound", "outbound", "entrambi", "nessuno"]),
  sectors: z.string().optional(),
  close_rate_range: z.enum(["0-10%", "10-20%", "20-30%", "30%+"]),
  motivation: z.string().min(30, "Scrivi almeno 30 caratteri"),
})

// ============================================
// STEP 5 — PROVE PRATICHE (obbligatorie)
// ============================================
const step5Schema = z.object({
  roleplay_think_about_it: z.string().min(200, "Minimo 200 caratteri"),
  roleplay_bundle3: z.string().min(200, "Minimo 200 caratteri"),
})

// ============================================
// STEP 6 — AUDIO (opzionale, NON bloccante)
// ============================================
// File upload: audio 30-45 sec, max 10MB
// Microcopy: "Facoltativo: accelera la valutazione. Puoi inviare anche senza."
// Upload su Supabase Storage bucket "candidate-audio"
// Salva URL in candidates.audio_url

// ============================================
// STEP 7 — CONSENSI
// ============================================
const step7Schema = z.object({
  consent_privacy: z.literal(true, { errorMap: () => ({ message: "Il consenso privacy è obbligatorio" }) }),
  consent_truth: z.literal(true, { errorMap: () => ({ message: "Devi confermare la veridicità dei dati" }) }),
  consent_whatsapp: z.boolean().optional(),
})
```

### Microcopy per ogni step
- Step 0: "Prima di iniziare, verifichiamo che questa opportunità sia adatta a te."
- Step 1: "Ci servono solo le informazioni essenziali per contattarti."
- Step 2: "La comunicazione è il tuo strumento di lavoro — aiutaci a conoscerti."
- Step 3: "Più tempo dedichi, più appuntamenti ricevi. Indica la tua disponibilità reale."
- Step 4: "Non è necessaria esperienza specifica — valutiamo la persona nel suo insieme."
- Step 5: "Due brevi esercizi per capire come comunichi. Non esiste una risposta sbagliata."
- Step 6: "Facoltativo: un breve audio di presentazione (30-45 secondi). Accelera la valutazione ma puoi saltarlo."
- Step 7: "Ultimo passaggio — conferma e invia la tua candidatura."

---

## §5 — LOGICA BUSINESS

### §5.1 — Regole KO (Hard Reject)

```typescript
// Esegui PRIMA dello scoring
// Se KO → status = "rejected", ko_reason = motivo, redirect /not-eligible

function checkKO(data: CandidateFormData): { isKO: boolean; reason: string | null } {
  // Step 0 — Pre-qualifica
  if (!data.pq_hours) return { isKO: true, reason: "Non può garantire 4 ore/giorno" }
  if (!data.pq_days) return { isKO: true, reason: "Non può lavorare 3 giorni/settimana" }
  if (!data.pq_punctuality) return { isKO: true, reason: "Non può garantire puntualità" }
  if (!data.pq_italian) return { isKO: true, reason: "Italiano non fluido" }
  
  // Step 2 — Lingua
  if (data.italian_level === "low") return { isKO: true, reason: "Livello italiano insufficiente" }
  
  // Step 3 — Disponibilità
  if (data.hours_per_day < 4) return { isKO: true, reason: "Disponibilità oraria insufficiente (< 4h/giorno)" }
  if (data.days_per_week < 3) return { isKO: true, reason: "Disponibilità giornaliera insufficiente (< 3gg/settimana)" }
  
  return { isKO: false, reason: null }
}
```

### §5.2 — Algoritmo Scoring (0-100)

```typescript
// Esegui DOPO il check KO (solo se non KO)
// Salva score_total + score_breakdown in candidates

interface ScoreBreakdown {
  italian: number        // 0, 10, o 20
  experience: number     // 0 o 15
  close_rate: number     // 0 o 10
  availability: number   // 0 o 10
  weekend: number        // 0 o 5
  roleplay: number       // 0..20
  audio: number          // 0 o 5
}

function calculateScore(data: CandidateFormData, weights: ScoringWeights): { total: number; breakdown: ScoreBreakdown } {
  const breakdown: ScoreBreakdown = {
    italian: 0,
    experience: 0,
    close_rate: 0,
    availability: 0,
    weekend: 0,
    roleplay: 0,
    audio: 0,
  }

  // Italiano: high = 20, medium = 10
  if (data.italian_level === "high") breakdown.italian = weights.italian_high  // 20
  else if (data.italian_level === "medium") breakdown.italian = weights.italian_medium  // 10

  // Esperienza inbound/closer
  if (data.inbound_outbound === "inbound" || data.inbound_outbound === "entrambi") {
    breakdown.experience = weights.experience_inbound  // 15
  }

  // Close rate alto (30%+)
  if (data.close_rate_range === "30%+") {
    breakdown.close_rate = weights.close_rate_high  // 10
  }

  // Disponibilità 6+ ore
  if (data.hours_per_day >= 6) {
    breakdown.availability = weights.availability_6plus  // 10
  }

  // Weekend disponibile (almeno sabato O domenica)
  if (data.weekend_sat || data.weekend_sun) {
    breakdown.weekend = weights.weekend_available  // 5
  }

  // Roleplay: valutazione euristica
  // Criterio: lunghezza minima raggiunta (>= 200 char) + bonus per lunghezza extra
  // Max 20 punti: 10 per roleplay_think_about_it + 10 per roleplay_bundle3
  let roleplayScore = 0
  
  // Roleplay 1: "Ci devo pensare"
  const rp1Len = data.roleplay_think_about_it?.length || 0
  if (rp1Len >= 200) roleplayScore += 5
  if (rp1Len >= 350) roleplayScore += 3
  if (rp1Len >= 500) roleplayScore += 2  // max 10

  // Roleplay 2: "Proposta kit 3"
  const rp2Len = data.roleplay_bundle3?.length || 0
  if (rp2Len >= 200) roleplayScore += 5
  if (rp2Len >= 350) roleplayScore += 3
  if (rp2Len >= 500) roleplayScore += 2  // max 10

  breakdown.roleplay = Math.min(roleplayScore, weights.roleplay_quality)  // cap a 20

  // Audio caricato: bonus priorità
  if (data.audio_uploaded) {
    breakdown.audio = weights.audio_uploaded  // 5
  }

  const total = Object.values(breakdown).reduce((sum, val) => sum + val, 0)

  return { total: Math.min(total, 100), breakdown }
}

// Classificazione automatica priorità
function getPriority(score: number): "low" | "medium" | "high" {
  if (score >= 75) return "high"
  if (score >= 55) return "medium"
  return "low"
}
```

### §5.3 — Flow Post-Submit

```
SUBMIT →
  1. Controlla KO → se KO: salva (status=rejected, ko_reason) → redirect /not-eligible
  2. Calcola scoring → salva (score_total, score_breakdown, priority)
  3. Se audio caricato → upload su Storage → salva audio_url
  4. Salva UTM params da URL
  5. Status = "new" (se score >= 55) oppure "new" comunque (lo scoring non rifiuta, solo prioritizza)
  6. Redirect /thanks

/thanks:
  - Messaggio conferma + "Ti contatteremo entro 48 ore"
  - (OPZIONALE) Bottone "Prenota colloquio" che apre un calendario
    basato su interview_slots da admin_settings
    → Se la candidata prenota: crea record in interviews (status=scheduled)
       e aggiorna candidate status a "interview_booked"
    → Se non implementabile subito: mostra placeholder "Ti contatteremo per fissare il colloquio"

/not-eligible:
  - Messaggio rispettoso: "Grazie per il tuo interesse..."
  - "Al momento il tuo profilo non è in linea con i requisiti specifici di questa posizione."
  - "Questo non riflette il tuo valore professionale — ogni ruolo ha requisiti diversi."
  - NO motivo specifico del KO (privacy + evita contestazioni)
```

---

## §6 — DASHBOARD ADMIN

### §6.1 — Lista Candidati (/admin)

**Layout:** Tabella responsiva con:
- Colonne: Nome, Email, WhatsApp, Score (con badge colore), Priority (badge), Status (badge), Italiano, Ore/gg, Data candidatura
- Riga cliccabile → apre /admin/candidates/:id

**Filtri (sidebar o top bar):**
- Status: multi-select (new, qualified, interview_booked, hired, rejected)
- Priority: multi-select (low, medium, high)
- Italian level: multi-select (low, medium, high)
- Disponibilità ore: range slider (4-8+)
- Weekend: sì/no
- Score range: slider 0-100
- Data: date range picker

**Ricerca:** per nome, email, WhatsApp (ricerca full-text su lato client o ilike su Supabase)

**Ordinamento:** per score_total (default desc) o created_at

**Export CSV:** bottone che scarica la lista filtrata in formato CSV

**KPI in alto (cards):**
- Candidature totali
- Qualified %
- Rejected %
- Colloqui fissati
- No-show rate
- Assunti

### §6.2 — Scheda Candidato (/admin/candidates/:id)

**Layout:** Pagina dedicata con sezioni:

1. **Header:** Nome + badge status + badge priority + score (grande, colorato)
2. **Dati personali:** tutti i campi step 1-2 in layout card
3. **Disponibilità:** tutti i campi step 3 in card separata
4. **Esperienza:** step 4 in card
5. **Prove pratiche:** step 5 — testo completo di entrambe le risposte roleplay
6. **Audio:** player inline se presente (play/pause/download), oppure "Nessun audio caricato"
7. **Score breakdown:** visualizzazione grafica (barra o radar) del breakdown scoring per categoria
8. **KO info:** se rejected, mostra ko_reason in box evidenziato
9. **Note admin:** textarea con salvataggio (candidates.notes)
10. **UTM:** se presenti, mostra sorgente traffico

**Azioni (bottoni):**
- "Qualifica" → status = qualified
- "Rifiuta" → status = rejected (chiedi motivo opzionale)
- "Prenota colloquio" → apre form per creare record in interviews
- "Segna come assunto" → status = hired

### §6.3 — Pipeline Kanban (/admin/pipeline)

**5 colonne:**
1. New (grigio)
2. Qualified (blu)
3. Interview Booked (giallo)
4. Hired (verde)
5. Rejected (rosso)

**Card candidato:** Nome, score badge, ore/gg, data candidatura

**Drag & drop:** spostamento tra colonne aggiorna candidates.status

**Libreria suggerita:** @dnd-kit/core + @dnd-kit/sortable

### §6.4 — Calendario Colloqui (/admin/calendar)

**Viste:** mese, settimana, agenda (tab switch)

**Ogni evento mostra:** nome candidata, orario, canale (phone/whatsapp/zoom), status (badge colore)

**Click su evento:** apre dettaglio con opzioni:
- Segna come completato (outcome: pass/fail/follow_up)
- Segna come no-show
- Ripianifica
- Cancella
- Aggiungi note

**Crea nuovo colloquio:** form modale con:
- Seleziona candidata (dropdown ricerca)
- Data/ora inizio e fine
- Canale
- Meeting link (opzionale)
- Interviewer (opzionale)

**Libreria suggerita:** react-big-calendar (con localizzazione italiana)

### §6.5 — Impostazioni (/admin/settings)

**Sezioni:**

1. **Soglie KO:** modifica ko_min_hours e ko_min_days
2. **Pesi scoring:** modifica ogni peso individualmente (tabella editabile)
3. **Slot colloqui:** configurazione disponibilità per giorno della settimana
4. **Email notifiche:** lista email per notifiche (opzionale/placeholder)

Tutti i campi leggono/scrivono su admin_settings (riga singola).

---

## §7 — DESIGN SYSTEM

### Palette colori
```
Sfondo principale:  #FFFFFF (bianco puro)
Sfondo sezioni alt: #FAFAFA (grigio chiarissimo)
Testo principale:   #1A1A1A (quasi nero)
Testo secondario:   #6B7280 (grigio medio)
Accento primario:   #D946A8 (magenta/rosa sobrio — NON fucsia pieno)
Accento hover:      #C026A0 (magenta scuro)
Accento chiaro:     #FDF2F8 (rosa chiarissimo per sfondi badge)
Successo:           #059669 (verde)
Errore:             #DC2626 (rosso)
Warning:            #D97706 (ambra)
```

### Tipografia
```
Font heading: Inter (o system-ui sans-serif)
Font body: Inter (o system-ui sans-serif)
Heading 1: 2.5rem / bold / tracking tight
Heading 2: 2rem / semibold
Heading 3: 1.5rem / semibold
Body: 1rem / normal / leading relaxed
Small: 0.875rem
```

### Principi UI
- **Mobile-first sempre** — design per 375px prima, poi scale up
- **Molto spazio bianco** — padding generosi, sezioni ben separate
- **Femminile sobrio** — NO rosa cliché, NO cuoricini, NO font script
- **Premium e pulito** — linee sottili, ombre leggere, border radius 8-12px
- **CTA sticky su mobile** — bottone fisso in basso durante scroll landing
- **Progress bar nel form** — visibile, con step numerati, animazione di avanzamento
- **Badge colorati** nella dashboard — status e priority con colori distinti
- **Accordion per FAQ** — una domanda visibile alla volta, transizione smooth

### Componenti dashboard
```
Card:        bg-white, border border-gray-200, rounded-xl, shadow-sm, p-6
Badge:       rounded-full, px-3 py-1, text-xs font-medium
             - new: bg-gray-100 text-gray-700
             - qualified: bg-blue-100 text-blue-700
             - interview_booked: bg-yellow-100 text-yellow-700
             - hired: bg-green-100 text-green-700
             - rejected: bg-red-100 text-red-700
             - priority high: bg-pink-100 text-pink-700
             - priority medium: bg-amber-100 text-amber-700
             - priority low: bg-gray-100 text-gray-500
Button CTA:  bg-[#D946A8] hover:bg-[#C026A0] text-white rounded-lg px-6 py-3 font-semibold
Input:       border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#D946A8]
```

---

## §8 — COPY & COMPLIANCE

### File di riferimento
Il copy completo della landing è nel file **COPY_LANDING_RECLUTAMENTO.md** — usalo INTEGRALMENTE per le sezioni A-I della landing page.

Le pagine legali (Privacy Policy, Cookie Policy, Termini & Condizioni) sono nel file **PAGINE_LEGALI.md** — usale per le route /privacy, /cookies, /terms.

### Regole copy (per ogni testo nel sito)
- **Vietato:** "dimagrisci", "perdi X kg", "garantito", "cura", "risultati assicurati"
- **Obbligatorio:** disclaimer guadagni visibile ovunque si menzionano cifre
- **Obbligatorio:** disclaimer collaborazione autonoma/freelance
- **Nessun nome azienda** nel frontend (solo "Swiss Research Labs GmbH" nel footer legale)
- **Tono:** diretto, professionale, caldo ma non confidenziale, zero emoji nel body

---

## §9 — LANDING PAGE (struttura sezioni)

Implementa le sezioni della landing nell'ordine esatto del file COPY_LANDING_RECLUTAMENTO.md:

```
A) HERO — headline, subheadline, 3 benefici, 3 requisiti, CTA sticky
B) "Cosa farai / cosa NON farai" — layout due colonne desktop, singola mobile
C) "Lead caldi + appuntamenti già fissati" — con infografica 3 step
D) "Compenso" — 3 scenari in card, range giornaliero, disclaimer in box evidenziato
E) "Requisiti & standard" — "Cerchiamo te se" + "NON è per te se" con icone ✓/✗
F) "Supporto & formazione" — 5 sotto-sezioni con icone
G) "Processo selezione" — 3 step visualizzati come timeline/stepper
H) "FAQ" — accordion, 12 domande
I) "CTA finale" — blocco pieno con CTA grande

FOOTER — disclaimer completi + link legali + Swiss Research Labs GmbH
```

### CTA ripetizione
Inserisci CTA "Candidati ora" dopo le sezioni: A, D, E, H, I — per un totale di 5 CTA nella pagina. Tutti puntano a `/apply`.

---

## §10 — IMMAGINI (genera con WaveSpeed AI)

Usa il tool WaveSpeed `text_to_image` con modello `google/nano-banana-pro/text-to-image` per generare le immagini della landing. Parametri standard:
- aspect_ratio: "4:5" per immagini verticali (hero, sezioni), "16:9" per banner orizzontali
- resolution: "2k"
- output_format: "png"

### Immagini da generare

**IMG-1: Hero**
```
Prompt: "Professional woman in her late 30s working from home, sitting at a clean modern desk with a laptop and phone, warm natural lighting from a window, soft smile, wearing elegant casual clothes, minimal scandinavian interior with white walls and plants, warm and inviting atmosphere, editorial photography style, soft focus background"
Aspect ratio: 4:5
Uso: Sezione Hero, accanto alla headline
```

**IMG-2: Consulenza telefonica**
```
Prompt: "Close-up of a professional woman having a warm phone conversation, gentle hand gesture, soft natural lighting, wearing a simple elegant top, blurred home office background with bookshelves, warm color tones, editorial portrait photography, empathetic expression"
Aspect ratio: 4:5
Uso: Sezione "Cosa farai"
```

**IMG-3: Libertà e flessibilità**
```
Prompt: "Woman in her 40s sitting on a comfortable sofa with laptop, cozy home environment, cup of coffee on side table, morning light through large windows, relaxed but professional posture, wearing comfortable elegant loungewear, bright and airy interior, lifestyle photography"
Aspect ratio: 16:9
Uso: Sezione "Compenso" o "Lead caldi"
```

**IMG-4: Supporto team**
```
Prompt: "Flat illustration of diverse women connected by dotted lines in a network pattern, minimal vector style, soft pink and white and grey color palette, abstract representation of teamwork and support, clean modern design, white background, subtle geometric shapes"
Aspect ratio: 16:9
Uso: Sezione "Supporto & formazione"
```

**IMG-5: Processo selezione**
```
Prompt: "Minimal flat illustration of three connected steps shown as circles with icons inside (form, conversation, handshake), clean line art style, soft pink accent color on white background, modern infographic design, subtle connecting lines between steps"
Aspect ratio: 16:9
Uso: Sezione "Processo selezione"
```

**IMG-6: CTA finale**
```
Prompt: "Professional woman standing confidently in a bright modern space, arms gently crossed, warm smile, wearing a crisp white blouse, soft natural light, clean white background with subtle warm tones, editorial fashion photography style, empowering and approachable"
Aspect ratio: 4:5
Uso: Sezione CTA finale
```

**NOTA:** Dopo la generazione di ogni immagine, ottimizza con Sharp (WebP, resize per mobile/desktop) e salva in /public/images/.

---

## §11 — SUPABASE CONFIG

### Progetto
- Crea un NUOVO progetto Supabase (non usare quello di Forever Slim)
- Region: eu-central-1 (Frankfurt)
- Nome suggerito: "recruitment-app" o "hiring-platform"

### Setup
1. Esegui lo schema SQL di §3 nel SQL Editor
2. Crea il bucket Storage "candidate-audio" (private, 10MB limit, mime types audio)
3. Configura Storage policies (anon INSERT, authenticated SELECT/DELETE)
4. Crea un utente admin via Supabase Auth (email: tonytodavida@gmail.com)

### Variabili ambiente (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=https://[NEW_PROJECT_ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon_key]
SUPABASE_SERVICE_ROLE_KEY=[service_role_key]  # Solo per API routes server-side
```

---

## §12 — EVENT TRACKING (placeholders)

Inserisci chiamate a funzioni placeholder per tracking futuro (Facebook Pixel, analytics):

```typescript
// lib/tracking.ts
export function trackEvent(event: string, data?: Record<string, any>) {
  // TODO: implementare Facebook Pixel, Google Analytics, ecc.
  console.log(`[TRACK] ${event}`, data)
}

// Eventi da tracciare:
// trackEvent('view_landing')
// trackEvent('click_cta', { position: 'hero' | 'mid' | 'final' })
// trackEvent('start_application')
// trackEvent('prequal_pass')
// trackEvent('prequal_fail', { reason })
// trackEvent('step_complete', { step: number })
// trackEvent('submit_application', { score, priority })
// trackEvent('qualified')
// trackEvent('ko_rejected', { reason })
// trackEvent('interview_scheduled')
// trackEvent('interview_completed', { outcome })
```

---

## §13 — ORDINE DI IMPLEMENTAZIONE

Claude Code, implementa in questo ordine:

```
FASE 1 — Setup e Database
  1. Crea progetto Next.js con stack da STACK_ANTONIO.md
  2. Configura Supabase (nuovo progetto, schema SQL, storage bucket)
  3. Setup variabili ambiente
  4. Struttura cartelle e routing

FASE 2 — Form e Logica
  5. Form multi-step con tutti gli step (0-7)
  6. Validazione Zod per ogni step
  7. Logica KO (hard reject)
  8. Algoritmo scoring
  9. Upload audio su Supabase Storage
  10. Pagine /thanks e /not-eligible
  11. Salvataggio candidatura su Supabase

FASE 3 — Landing Page
  12. Genera immagini con WaveSpeed (§10)
  13. Ottimizza immagini con Sharp
  14. Implementa landing con copy da COPY_LANDING_RECLUTAMENTO.md
  15. Sticky CTA mobile
  16. FAQ accordion
  17. Footer con disclaimer e link legali
  18. Pagine legali (/privacy, /cookies, /terms) da PAGINE_LEGALI.md

FASE 4 — Dashboard Admin
  19. Login admin (Supabase Auth)
  20. Lista candidati con filtri e ricerca
  21. Scheda candidato con dettagli e azioni
  22. Export CSV
  23. Pipeline kanban (drag & drop)
  24. Calendario colloqui
  25. KPI cards
  26. Pagina settings

FASE 5 — Rifinitura
  27. Responsive check (mobile/tablet/desktop)
  28. RLS verification
  29. Deploy su Vercel
  30. Test completo del flusso candidatura
```
