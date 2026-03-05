'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

/**
 * Intercepts Supabase auth tokens on ANY page:
 * - PKCE: ?code=... in query string
 * - Implicit: #access_token=... in hash
 *
 * Handles old invite links or stray auth fragments landing on wrong pages.
 */
export function AuthRedirector() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const supabase = createClient()

    // PKCE flow: ?code= in query string
    const url = new URL(window.location.href)
    const code = url.searchParams.get('code')
    if (code && !url.pathname.startsWith('/auth/callback')) {
      supabase.auth.exchangeCodeForSession(code)
        .then(({ data, error }) => {
          if (data.session && !error) {
            window.location.href = '/admin'
          }
        })
      return
    }

    // Implicit flow: #access_token= in hash
    const hash = window.location.hash.substring(1)
    if (!hash || !hash.includes('access_token=')) return

    const params = new URLSearchParams(hash)
    const access_token = params.get('access_token')
    const refresh_token = params.get('refresh_token')

    if (!access_token || !refresh_token) return

    supabase.auth.setSession({ access_token, refresh_token })
      .then(({ data, error }) => {
        if (data.session && !error) {
          window.location.href = '/admin'
        }
      })
  }, [])

  return null
}
