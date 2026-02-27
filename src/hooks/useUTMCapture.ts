'use client'

import { useEffect } from 'react'
import { ATTRIBUTION_PARAMS } from '@/lib/attribution'

export const FS_UTM_KEY = 'fs_utm'

/**
 * Hook che legge i parametri UTM dall'URL e li salva in localStorage.
 * Chiamato nelle landing page (layout o pagine pubbliche).
 * Se utm_source è presente → sovrascrive (nuovo click da ad).
 * Altrimenti → merge con i valori esistenti.
 */
export function useUTMCapture() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const params = new URLSearchParams(window.location.search)
    const fresh: Record<string, string> = {}

    for (const key of ATTRIBUTION_PARAMS) {
      const val = params.get(key)
      if (val) fresh[key] = val
    }

    if (Object.keys(fresh).length === 0) return

    try {
      if (fresh.utm_source) {
        // Nuovo click da ad: sovrascrive completamente
        localStorage.setItem(FS_UTM_KEY, JSON.stringify(fresh))
      } else {
        // Parametri parziali: merge senza sovrascrivere esistenti
        const existing = JSON.parse(localStorage.getItem(FS_UTM_KEY) || '{}')
        localStorage.setItem(FS_UTM_KEY, JSON.stringify({ ...existing, ...fresh }))
      }
    } catch {
      // localStorage non disponibile (es. incognito con blocco)
    }
  }, [])
}

/**
 * Legge i parametri UTM salvati in localStorage.
 * Usata nel submit handler del form.
 */
export function getStoredUTMs(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(localStorage.getItem(FS_UTM_KEY) || '{}')
  } catch {
    return {}
  }
}
