export type CandidateStatus = 'new' | 'qualified' | 'interview_booked' | 'hired' | 'rejected'
export type CandidatePriority = 'low' | 'medium' | 'high'
export type ItalianLevel = 'low' | 'medium' | 'high'
export type InterviewStatus = 'pending' | 'confirmed' | 'scheduled' | 'completed' | 'no_show' | 'rescheduled' | 'cancelled'
export type InterviewOutcome = 'pass' | 'fail' | 'follow_up'
export type InterviewChannel = 'phone' | 'whatsapp' | 'zoom'

export interface Candidate {
  id: string
  created_at: string

  // Step 1 - Dati base
  first_name: string
  last_name: string
  email: string
  whatsapp: string
  city: string | null
  country: string | null
  age_range: string | null

  // Step 2 - Lingua & Comunicazione
  nationality: string | null
  native_language: string | null
  italian_level: ItalianLevel
  strong_accent: boolean
  bio_short: string | null

  // Step 3 - Disponibilità
  hours_per_day: number
  days_per_week: number
  time_slots: string | null
  start_date: string | null
  weekend_sat: boolean
  weekend_sun: boolean
  holidays: boolean

  // Step 4 - Esperienza
  sales_years: number
  inbound_outbound: string | null
  sectors: string | null
  close_rate_range: string | null
  motivation: string | null

  // Step 5 - Prove pratiche
  roleplay_think_about_it: string | null
  roleplay_bundle3: string | null

  // Step 6 - Audio
  audio_url: string | null
  audio_uploaded: boolean

  // Scoring
  score_total: number
  score_breakdown: ScoreBreakdown
  priority: CandidatePriority

  // Status & admin
  status: CandidateStatus
  ko_reason: string | null
  notes: string | null

  // UTM tracking
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  utm_adset: string | null
  utm_ad: string | null

  // Consensi
  consent_privacy: boolean
  consent_truth: boolean
  consent_whatsapp: boolean
}

export interface ScoreBreakdown {
  italian: number
  experience: number
  close_rate: number
  availability: number
  weekend: number
  roleplay: number
  audio: number
}

export interface Interview {
  id: string
  created_at: string
  candidate_id: string

  // Booking flow fields (live schema)
  slot_token: string | null
  scheduled_at: string | null

  // Rich fields (extended schema)
  scheduled_start: string | null
  scheduled_end: string | null
  channel: InterviewChannel | null
  meeting_link: string | null
  interviewer: string | null
  status: InterviewStatus
  outcome: InterviewOutcome | null
  admin_notes: string | null

  // Joined data
  candidate?: Candidate
  candidates?: Candidate
}

export interface ScoringWeights {
  italian_high: number
  italian_medium: number
  experience_inbound: number
  close_rate_high: number
  availability_6plus: number
  weekend_available: number
  roleplay_quality: number
  audio_uploaded: number
}

export interface InterviewSlots {
  monday: string[]
  tuesday: string[]
  wednesday: string[]
  thursday: string[]
  friday: string[]
  saturday?: string[]
  sunday?: string[]
}

export interface AdminSettings {
  id: number
  ko_min_hours: number
  ko_min_days: number
  scoring_weights: ScoringWeights
  interview_slots: InterviewSlots
  notification_emails: string[]
}
