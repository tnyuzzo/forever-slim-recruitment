'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AuthCallbackPage() {
  const [status, setStatus] = useState('Verifica in corso...')

  useEffect(() => {
    let redirected = false
    const supabase = createClient()

    const redirect = (path: string) => {
      if (redirected) return
      redirected = true
      window.location.href = path
    }

    const processAuth = async () => {
      // 1. Try manual hash parsing as primary method
      const hash = window.location.hash.substring(1)
      if (hash) {
        const params = new URLSearchParams(hash)
        const access_token = params.get('access_token')
        const refresh_token = params.get('refresh_token')

        if (access_token && refresh_token) {
          console.log('[auth/callback] Found tokens in hash, setting session...')
          const { data, error } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          })

          if (data.session && !error) {
            setStatus('Accesso confermato! Reindirizzamento...')
            redirect('/admin')
            return
          }
          console.error('[auth/callback] setSession failed:', error)
        }
      }

      // 2. Fallback: check if session was auto-detected by client
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setStatus('Accesso confermato! Reindirizzamento...')
        redirect('/admin')
        return
      }

      // 3. Listen for auth state change (in case processing is async)
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (session && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION')) {
          setStatus('Accesso confermato! Reindirizzamento...')
          subscription.unsubscribe()
          redirect('/admin')
        }
      })

      // 4. Timeout fallback
      setTimeout(() => {
        subscription.unsubscribe()
        setStatus('Sessione non trovata. Reindirizzamento al login...')
        redirect('/admin/login')
      }, 8000)
    }

    processAuth()
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
