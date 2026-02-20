-- Create interviews table
CREATE TABLE IF NOT EXISTS interviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
  slot_token TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  scheduled_at TIMESTAMPTZ,
  meeting_link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create interview_slots table (admin availability)
CREATE TABLE IF NOT EXISTS interview_slots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id TEXT DEFAULT 'default',
  day_of_week INT NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Allow public access for booking pages (service_role handles admin ops)
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read own interview by token" ON interviews
  FOR SELECT USING (true);
CREATE POLICY "Public can update own interview by token" ON interviews
  FOR UPDATE USING (true);
CREATE POLICY "Service role full access on interviews" ON interviews
  FOR ALL USING (auth.role() = 'service_role');

ALTER TABLE interview_slots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read active slots" ON interview_slots
  FOR SELECT USING (is_active = true);
CREATE POLICY "Service role full access on interview_slots" ON interview_slots
  FOR ALL USING (auth.role() = 'service_role');

-- Insert default admin availability (Mon-Fri, 10:00-18:00)
INSERT INTO interview_slots (day_of_week, start_time, end_time) VALUES
  (1, '10:00', '18:00'),  -- Monday
  (2, '10:00', '18:00'),  -- Tuesday
  (3, '10:00', '18:00'),  -- Wednesday
  (4, '10:00', '18:00'),  -- Thursday
  (5, '10:00', '18:00');  -- Friday
