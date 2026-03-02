'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AuthCallbackPage() {
  const [status, setStatus] = useState('Verifica in corso...')
  const supabase = createClient()

  useEffect(() => {
    let redirected = false

    const redirect = (path: string) => {
      if (redirected) return
      redirected = true
      // Use window.location for full page load to ensure cookies are sent
      window.location.href = path
    }

    // Listen for auth state changes (hash processing)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('[auth/callback] onAuthStateChange:', event, !!session)
      if (session && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION' || event === 'TOKEN_REFRESHED')) {
        setStatus('Accesso confermato! Reindirizzamento...')
        subscription.unsubscribe()
        redirect('/admin')
      }
    })

    // Also check current session (might already be processed)
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()

      if (error) {
        console.error('[auth/callback] Error:', error)
        setStatus('Errore di autenticazione. Reindirizzamento...')
        setTimeout(() => redirect('/admin/login'), 2000)
        return
      }

      if (session) {
        setStatus('Accesso confermato! Reindirizzamento...')
        subscription.unsubscribe()
        redirect('/admin')
      }
    }

    checkSession()

    // Timeout fallback: if nothing works after 8 seconds, go to login
    const timeout = setTimeout(() => {
      setStatus('Sessione non trovata. Reindirizzamento al login...')
      subscription.unsubscribe()
      redirect('/admin/login')
    }, 8000)

    return () => {
      subscription.unsubscribe()
      clearTimeout(timeout)
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-4">
        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-gray-600 font-medium">{status}</p>
      </div>
    </div>
  )
}
