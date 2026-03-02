'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

/**
 * Intercepts Supabase auth hash fragments (#access_token=...) on ANY page.
 * When detected, waits for the Supabase client to process the token,
 * then redirects the user to /admin.
 *
 * This handles:
 * - Old invite links that redirect to the homepage instead of /auth/callback
 * - Any page that accidentally receives an auth hash fragment
 */
export function AuthRedirector() {
  useEffect(() => {
    // Only run if there's an access_token in the hash
    if (typeof window === 'undefined') return
    const hash = window.location.hash
    if (!hash || !hash.includes('access_token=')) return

    const supabase = createClient()

    // The Supabase browser client auto-detects #access_token and processes it.
    // We just need to wait for the session to be established, then redirect.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION')) {
        subscription.unsubscribe()
        // Use window.location to ensure full page load with session cookies
        window.location.href = '/admin'
      }
    })

    // Fallback: if hash was already processed before listener was set up
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        subscription.unsubscribe()
        window.location.href = '/admin'
      }
    })

    // Cleanup
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return null
}
