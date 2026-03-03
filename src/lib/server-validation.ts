import { z } from 'zod'

/**
 * Schema Zod server-side per /api/submit-application.
 *
 * Più permissivo del fullFormSchema client-side:
 * - Non richiede pq_* = true (candidati KO hanno false)
 * - Non richiede consent_* = true (server riceve il valore, non lo forza)
 * - Valida tipi e formati, non logica di business
 */
export const submitApplicationSchema = z.object({
  // Obbligatori
  email: z.string().email('Email non valida'),
  first_name: z.string().min(1).max(100),
  last_name: z.string().min(1).max(100),

  // Opzionali con tipo
  whatsapp: z.string().max(30).optional().nullable(),
  birth_date: z.string().optional().nullable(),
  age_range: z.string().max(20).optional().nullable(),
  city: z.string().max(100).optional().nullable(),
  country: z.string().max(100).optional().nullable(),
  nationality: z.string().max(100).optional().nullable(),
  native_language: z.string().max(50).optional().nullable(),
  italian_level: z.enum(['low', 'medium', 'high']).optional().nullable(),
  english_level: z.string().max(20).optional().nullable(),
  other_languages: z.string().max(200).optional().nullable(),
  strong_accent: z.boolean().optional().nullable(),
  bio_short: z.string().max(500).optional().nullable(),

  // Disponibilita
  hours_per_day: z.number().min(0).max(24).optional().nullable(),
  days_per_week: z.number().min(0).max(7).optional().nullable(),
  time_slots: z.string().max(200).optional().nullable(),
  start_date: z.string().max(50).optional().nullable(),
  weekend_sat: z.boolean().optional().nullable(),
  weekend_sun: z.boolean().optional().nullable(),
  weekend_details: z.string().max(300).optional().nullable(),
  holidays: z.boolean().optional().nullable(),

  // Esperienza
  sales_years: z.number().min(0).max(50).optional().nullable(),
  inbound_outbound: z.string().max(20).optional().nullable(),
  sectors: z.string().max(500).optional().nullable(),
  close_rate_range: z.string().max(20).optional().nullable(),
  experience: z.string().max(2000).optional().nullable(),
  motivation: z.string().max(2000).optional().nullable(),
  availability: z.string().max(200).optional().nullable(),
  has_vat: z.boolean().optional().nullable(),

  // Roleplay
  roleplay_think_about_it: z.string().max(5000).optional().nullable(),
  roleplay_bundle3: z.string().max(5000).optional().nullable(),

  // Media
  photo_url: z.string().url().max(500).optional().nullable(),
  audio_url: z.string().url().max(500).optional().nullable(),
  audio_uploaded: z.boolean().optional().nullable(),

  // Score (calcolato client-side, validato range)
  score_total: z.number().min(0).max(100).optional().nullable(),
  score_breakdown: z.record(z.string(), z.number()).optional().nullable(),
  priority: z.string().max(20).optional().nullable(),
  status: z.string().max(20).optional().nullable(),
  ko_reason: z.string().max(200).optional().nullable(),

  // Pre-qualifica (boolean, non forzati a true server-side)
  pq_hours: z.boolean().optional().nullable(),
  pq_days: z.boolean().optional().nullable(),
  pq_punctuality: z.boolean().optional().nullable(),
  pq_italian: z.boolean().optional().nullable(),

  // Consensi
  consent_privacy: z.boolean().optional().nullable(),
  consent_truth: z.boolean().optional().nullable(),
  consent_whatsapp: z.boolean().optional().nullable(),

  // Tracking (passthrough, non validati stretti)
  session_id: z.string().max(100).optional().nullable(),
  page_url: z.string().max(500).optional().nullable(),
  fbp: z.string().max(200).optional().nullable(),
  fbc: z.string().max(200).optional().nullable(),
}).passthrough() // Permette UTM params extra senza listarli tutti

/**
 * Schema per /api/booking POST
 */
export const bookingSchema = z.object({
  token: z.string().uuid('Token non valido'),
  scheduled_at: z.string().datetime({ message: 'Data/ora non valida' }),
})

/**
 * Schema per /api/invite POST
 */
export const inviteSchema = z.object({
  candidate_id: z.number().int().positive('ID candidato non valido'),
  channels: z.array(z.enum(['email', 'sms'])).min(1, 'Seleziona almeno un canale'),
})

/**
 * Schema per /api/team POST
 */
export const teamInviteSchema = z.object({
  email: z.string().email('Email non valida'),
  role: z.enum(['recruiter', 'superadmin'], { message: 'Ruolo non valido' }),
})

/**
 * Schema per /api/team DELETE
 */
export const teamDeleteSchema = z.object({
  user_id: z.string().uuid('user_id non valido'),
})
