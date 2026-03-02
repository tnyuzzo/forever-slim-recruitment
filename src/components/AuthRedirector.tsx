'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

/**
 * Intercepts Supabase auth hash fragments (#access_token=...) on ANY page.
 * Manually parses tokens from hash and establishes session via setSession().
 * Then redirects to /admin.
 *
 * This handles:
 * - Old invite links that redirect to the homepage instead of /auth/callback
 * - Any page that accidentally receives an auth hash fragment
 */
export function AuthRedirector() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    const hash = window.location.hash.substring(1)
    if (!hash || !hash.includes('access_token=')) return

    const params = new URLSearchParams(hash)
    const access_token = params.get('access_token')
    const refresh_token = params.get('refresh_token')

    if (!access_token || !refresh_token) return

    const supabase = createClient()

    // Manually set session from hash tokens
    supabase.auth.setSession({ access_token, refresh_token })
      .then(({ data, error }) => {
        if (data.session && !error) {
          window.location.href = '/admin'
        }
      })
  }, [])

  return null
}
