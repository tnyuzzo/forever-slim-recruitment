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
  birth_date DATE,

  -- Lingua e Comunicazione (Step 2)
  nationality TEXT,
  native_language TEXT,
  italian_level italian_level NOT NULL DEFAULT 'medium',
  strong_accent BOOLEAN DEFAULT false,
  bio_short TEXT,

  -- Disponibilita (Step 3)
  hours_per_day INT NOT NULL DEFAULT 4,
  days_per_week INT NOT NULL DEFAULT 3,
  time_slots TEXT,
  start_date TEXT,
  weekend_sat BOOLEAN DEFAULT false,
  weekend_sun BOOLEAN DEFAULT false,
  holidays BOOLEAN DEFAULT false,

  -- Esperienza (Step 4)
  sales_years INT DEFAULT 0,
  inbound_outbound TEXT,
  sectors TEXT,
  close_rate_range TEXT,
  motivation TEXT,

  -- Prove pratiche (Step 5)
  roleplay_think_about_it TEXT,
  roleplay_bundle3 TEXT,

  -- Audio (Step 6)
  audio_url TEXT,
  audio_uploaded BOOLEAN DEFAULT false,

  -- Scoring (calcolato al submit)
  score_total INT DEFAULT 0,
  score_breakdown JSONB DEFAULT '{}',
  priority candidate_priority DEFAULT 'low',

  -- Status e admin
  status candidate_status DEFAULT 'new',
  ko_reason TEXT,
  notes TEXT,

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
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),

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

-- Pubblico: puo solo INSERIRE candidature (niente SELECT/UPDATE/DELETE)
CREATE POLICY "Pubblico puo inserire candidatura"
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
