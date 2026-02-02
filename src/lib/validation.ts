import { z } from 'zod'

// ============================================
// STEP 0 — PRE-QUALIFICA (Sì/No) — KO immediato
// ============================================
export const step0Schema = z.object({
  pq_hours: z.literal(true, { message: 'Questo requisito è necessario' }),
  pq_days: z.literal(true, { message: 'Questo requisito è necessario' }),
  pq_punctuality: z.literal(true, { message: 'Questo requisito è necessario' }),
  pq_italian: z.literal(true, { message: 'Questo requisito è necessario' }),
})

// ============================================
// STEP 1 — DATI BASE
// ============================================
export const step1Schema = z.object({
  first_name: z.string().min(2, 'Inserisci il tuo nome'),
  last_name: z.string().min(2, 'Inserisci il tuo cognome'),
  email: z.string().email('Email non valida'),
  whatsapp: z.string().min(8, 'Inserisci il numero WhatsApp con prefisso'),
  country: z.string().min(2, 'Seleziona il paese'),
  city: z.string().min(2, 'Inserisci la città'),
  age_range: z.enum(['30-35', '36-40', '41-45', '46-50', '50+'], {
    message: 'Seleziona la tua fascia di età',
  }),
})

// ============================================
// STEP 2 — LINGUA & COMUNICAZIONE
// ============================================
export const step2Schema = z.object({
  nationality: z.string().min(2, 'Inserisci la nazionalità'),
  native_language: z.string().min(2, 'Inserisci la lingua madre'),
  italian_level: z.enum(['low', 'medium', 'high'], {
    message: 'Seleziona il livello di italiano',
  }),
  strong_accent: z.boolean(),
  bio_short: z
    .string()
    .min(20, 'Scrivi almeno 20 caratteri')
    .max(300, 'Massimo 300 caratteri'),
})

// ============================================
// STEP 3 — DISPONIBILITÀ
// ============================================
export const step3Schema = z.object({
  hours_per_day: z.number().min(1, 'Minimo 1 ora').max(12, 'Massimo 12 ore'),
  days_per_week: z.number().min(1, 'Minimo 1 giorno').max(7, 'Massimo 7 giorni'),
  time_slots: z.string().min(1, 'Seleziona almeno una fascia oraria'),
  start_date: z.string().min(1, 'Indica quando puoi iniziare'),
  weekend_sat: z.boolean(),
  weekend_sun: z.boolean(),
  holidays: z.boolean(),
})

// ============================================
// STEP 4 — ESPERIENZA
// ============================================
export const step4Schema = z.object({
  sales_years: z.number().min(0, 'Inserisci un valore valido'),
  inbound_outbound: z.enum(['inbound', 'outbound', 'entrambi', 'nessuno'], {
    message: 'Seleziona il tipo di esperienza',
  }),
  sectors: z.string().optional(),
  close_rate_range: z.enum(['0-10%', '10-20%', '20-30%', '30%+'], {
    message: 'Seleziona il tasso di chiusura',
  }),
  motivation: z.string().min(30, 'Scrivi almeno 30 caratteri'),
})

// ============================================
// STEP 5 — PROVE PRATICHE
// ============================================
export const step5Schema = z.object({
  roleplay_think_about_it: z.string().min(200, 'Minimo 200 caratteri'),
  roleplay_bundle3: z.string().min(200, 'Minimo 200 caratteri'),
})

// ============================================
// STEP 6 — AUDIO (opzionale)
// ============================================
export const step6Schema = z.object({
  audio_url: z.string().optional(),
  audio_uploaded: z.boolean().optional(),
})

// ============================================
// STEP 7 — CONSENSI
// ============================================
export const step7Schema = z.object({
  consent_privacy: z.literal(true, { message: 'Il consenso privacy è obbligatorio' }),
  consent_truth: z.literal(true, { message: 'Devi confermare la veridicità dei dati' }),
  consent_whatsapp: z.boolean().optional(),
})

// ============================================
// COMPLETE FORM SCHEMA
// ============================================
export const fullFormSchema = step0Schema
  .merge(step1Schema)
  .merge(step2Schema)
  .merge(step3Schema)
  .merge(step4Schema)
  .merge(step5Schema)
  .merge(step6Schema)
  .merge(step7Schema)

export type Step0Data = z.infer<typeof step0Schema>
export type Step1Data = z.infer<typeof step1Schema>
export type Step2Data = z.infer<typeof step2Schema>
export type Step3Data = z.infer<typeof step3Schema>
export type Step4Data = z.infer<typeof step4Schema>
export type Step5Data = z.infer<typeof step5Schema>
export type Step6Data = z.infer<typeof step6Schema>
export type Step7Data = z.infer<typeof step7Schema>
export type FullFormData = z.infer<typeof fullFormSchema>
