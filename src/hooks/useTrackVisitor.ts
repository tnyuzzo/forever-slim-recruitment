'use client'

import { useEffect, useRef } from 'react'

export function useTrackVisitor() {
  const tracked = useRef(false)

  useEffect(() => {
    if (tracked.current) return
    tracked.current = true

    const fbp = (window as unknown as { _fbp?: string })._fbp ?? null
    const fbc = (window as unknown as { _fbc?: string })._fbc ?? null

    // Legge session_id da cookie fs_sid se già presente
    const sidMatch = document.cookie.match(/fs_sid=([^;]+)/)
    const session_id = sidMatch ? sidMatch[1] : null

    const payload = {
      session_id,
      fbp,
      fbc,
      page_url: window.location.href,
      referrer: document.referrer || null,
      user_agent: navigator.userAgent,
      search: window.location.search,
    }

    // Fire-and-forget — non blocca UX
    fetch('/api/track-visitor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(() => {
      // silenzioso in caso di errore di rete
    })
  }, [])
}
