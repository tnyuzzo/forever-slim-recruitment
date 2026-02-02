import type { FullFormData } from './validation'
import type { ScoreBreakdown, ScoringWeights, CandidatePriority } from '@/types/database'

// Default scoring weights (can be overridden by admin_settings)
export const DEFAULT_SCORING_WEIGHTS: ScoringWeights = {
  italian_high: 20,
  italian_medium: 10,
  experience_inbound: 15,
  close_rate_high: 10,
  availability_6plus: 10,
  weekend_available: 5,
  roleplay_quality: 20,
  audio_uploaded: 5,
}

/**
 * Check KO (Hard Reject) conditions
 * Returns KO status and reason if applicable
 */
export function checkKO(data: FullFormData): { isKO: boolean; reason: string | null } {
  // Step 0 — Pre-qualifica
  if (!data.pq_hours) {
    return { isKO: true, reason: 'Non può garantire 4 ore/giorno' }
  }
  if (!data.pq_days) {
    return { isKO: true, reason: 'Non può lavorare 3 giorni/settimana' }
  }
  if (!data.pq_punctuality) {
    return { isKO: true, reason: 'Non può garantire puntualità' }
  }
  if (!data.pq_italian) {
    return { isKO: true, reason: 'Italiano non fluido' }
  }

  // Step 2 — Lingua
  if (data.italian_level === 'low') {
    return { isKO: true, reason: 'Livello italiano insufficiente' }
  }

  // Step 3 — Disponibilità
  if (data.hours_per_day < 4) {
    return { isKO: true, reason: 'Disponibilità oraria insufficiente (< 4h/giorno)' }
  }
  if (data.days_per_week < 3) {
    return { isKO: true, reason: 'Disponibilità giornaliera insufficiente (< 3gg/settimana)' }
  }

  return { isKO: false, reason: null }
}

/**
 * Calculate scoring based on form data
 * Returns total score (0-100) and breakdown by category
 */
export function calculateScore(
  data: FullFormData,
  weights: ScoringWeights = DEFAULT_SCORING_WEIGHTS
): { total: number; breakdown: ScoreBreakdown } {
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
  if (data.italian_level === 'high') {
    breakdown.italian = weights.italian_high // 20
  } else if (data.italian_level === 'medium') {
    breakdown.italian = weights.italian_medium // 10
  }

  // Esperienza inbound/closer
  if (data.inbound_outbound === 'inbound' || data.inbound_outbound === 'entrambi') {
    breakdown.experience = weights.experience_inbound // 15
  }

  // Close rate alto (30%+)
  if (data.close_rate_range === '30%+') {
    breakdown.close_rate = weights.close_rate_high // 10
  }

  // Disponibilità 6+ ore
  if (data.hours_per_day >= 6) {
    breakdown.availability = weights.availability_6plus // 10
  }

  // Weekend disponibile (almeno sabato O domenica)
  if (data.weekend_sat || data.weekend_sun) {
    breakdown.weekend = weights.weekend_available // 5
  }

  // Roleplay: valutazione euristica
  // Max 20 punti: 10 per roleplay_think_about_it + 10 per roleplay_bundle3
  let roleplayScore = 0

  // Roleplay 1: "Ci devo pensare"
  const rp1Len = data.roleplay_think_about_it?.length || 0
  if (rp1Len >= 200) roleplayScore += 5
  if (rp1Len >= 350) roleplayScore += 3
  if (rp1Len >= 500) roleplayScore += 2 // max 10

  // Roleplay 2: "Proposta kit 3"
  const rp2Len = data.roleplay_bundle3?.length || 0
  if (rp2Len >= 200) roleplayScore += 5
  if (rp2Len >= 350) roleplayScore += 3
  if (rp2Len >= 500) roleplayScore += 2 // max 10

  breakdown.roleplay = Math.min(roleplayScore, weights.roleplay_quality) // cap a 20

  // Audio caricato: bonus priorità
  if (data.audio_uploaded) {
    breakdown.audio = weights.audio_uploaded // 5
  }

  const total = Object.values(breakdown).reduce((sum, val) => sum + val, 0)

  return { total: Math.min(total, 100), breakdown }
}

/**
 * Get priority classification based on score
 */
export function getPriority(score: number): CandidatePriority {
  if (score >= 75) return 'high'
  if (score >= 55) return 'medium'
  return 'low'
}
