-- Migration: Facebook CAPI Tracking
-- Da eseguire nel SQL Editor di Supabase Dashboard

-- 1. Nuovi campi attribution su candidates
ALTER TABLE candidates
  ADD COLUMN IF NOT EXISTS session_id TEXT,
  ADD COLUMN IF NOT EXISTS fbclid TEXT,
  ADD COLUMN IF NOT EXISTS fbc TEXT,
  ADD COLUMN IF NOT EXISTS fbp TEXT,
  ADD COLUMN IF NOT EXISTS utm_content TEXT,
  ADD COLUMN IF NOT EXISTS utm_term TEXT,
  ADD COLUMN IF NOT EXISTS funnel TEXT,
  ADD COLUMN IF NOT EXISTS campaign_id TEXT,
  ADD COLUMN IF NOT EXISTS adset_id TEXT,
  ADD COLUMN IF NOT EXISTS ad_id TEXT,
  ADD COLUMN IF NOT EXISTS placement TEXT,
  ADD COLUMN IF NOT EXISTS site_source_name TEXT,
  ADD COLUMN IF NOT EXISTS ip_address TEXT,
  ADD COLUMN IF NOT EXISTS user_agent TEXT,
  ADD COLUMN IF NOT EXISTS fb_lead_event_id TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS fb_schedule_event_id TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS fb_complete_event_id TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS lead_sent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS schedule_sent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS complete_sent_at TIMESTAMPTZ;

-- 2. Idempotenza Schedule su interviews
ALTER TABLE interviews
  ADD COLUMN IF NOT EXISTS fb_event_sent BOOLEAN DEFAULT FALSE;

-- 3. Nuova tabella page_visitors
CREATE TABLE IF NOT EXISTS page_visitors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  page_url TEXT,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,
  funnel TEXT,
  fbclid TEXT,
  fbc TEXT,
  fbp TEXT,
  campaign_id TEXT,
  adset_id TEXT,
  ad_id TEXT,
  placement TEXT,
  site_source_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pv_session ON page_visitors(session_id);
CREATE INDEX IF NOT EXISTS idx_pv_ip ON page_visitors(ip_address);

ALTER TABLE page_visitors ENABLE ROW LEVEL SECURITY;
