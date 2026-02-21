-- Migration: Add interview management columns to interviews table
-- Run this against the live Supabase database
-- This preserves the existing invite/booking flow (slot_token, scheduled_at, pending/confirmed)
-- while adding columns needed for outcome recording and calendar display.

-- 1. Add new columns
ALTER TABLE interviews ADD COLUMN IF NOT EXISTS scheduled_start TIMESTAMPTZ;
ALTER TABLE interviews ADD COLUMN IF NOT EXISTS scheduled_end TIMESTAMPTZ;
ALTER TABLE interviews ADD COLUMN IF NOT EXISTS channel TEXT DEFAULT 'phone';
ALTER TABLE interviews ADD COLUMN IF NOT EXISTS interviewer TEXT;
ALTER TABLE interviews ADD COLUMN IF NOT EXISTS outcome TEXT;
ALTER TABLE interviews ADD COLUMN IF NOT EXISTS admin_notes TEXT;

-- 2. Add constraints on new columns
ALTER TABLE interviews DROP CONSTRAINT IF EXISTS interviews_outcome_check;
ALTER TABLE interviews ADD CONSTRAINT interviews_outcome_check
  CHECK (outcome IS NULL OR outcome IN ('pass', 'fail', 'follow_up'));

-- 3. Extend status constraint to include all needed values
ALTER TABLE interviews DROP CONSTRAINT IF EXISTS interviews_status_check;
ALTER TABLE interviews ADD CONSTRAINT interviews_status_check
  CHECK (status IN ('pending', 'confirmed', 'scheduled', 'completed', 'no_show', 'rescheduled', 'cancelled'));

-- 4. Backfill scheduled_start/end from existing scheduled_at
UPDATE interviews
SET scheduled_start = scheduled_at,
    scheduled_end = scheduled_at + INTERVAL '1 hour'
WHERE scheduled_at IS NOT NULL AND scheduled_start IS NULL;

-- 5. Index for calendar queries
CREATE INDEX IF NOT EXISTS idx_interviews_scheduled_start ON interviews(scheduled_start);
CREATE INDEX IF NOT EXISTS idx_interviews_candidate_id ON interviews(candidate_id);
CREATE INDEX IF NOT EXISTS idx_interviews_status ON interviews(status);

-- 6. RLS: allow authenticated users full access (admin operations)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated full access interviews' AND tablename = 'interviews'
  ) THEN
    CREATE POLICY "Authenticated full access interviews" ON interviews
      FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;
END $$;
