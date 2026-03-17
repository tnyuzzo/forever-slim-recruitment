'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AuthCallbackPage() {
  const [status, setStatus] = useState('Verifica in corso...')
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    let redirected = false
    const supabase = createClient()

    const redirect = (path: string) => {
      if (redirected) return
      redirected = true
      window.location.href = path
    }

    const processAuth = async () => {
      const url = new URL(window.location.href)

      // 0. Check for error from Supabase (expired/invalid OTP)
      const error_code = url.searchParams.get('error_code')
      if (error_code) {
        setIsError(true)
        if (error_code === 'otp_expired') {
          setStatus('Il link è scaduto o è già stato utilizzato. Accedi con email e password.')
        } else {
          const desc = url.searchParams.get('error_description')?.replace(/\+/g, ' ')
          setStatus(desc || 'Errore di autenticazione. Riprova.')
        }
        setTimeout(() => redirect('/admin/login'), 4000)
        return
      }

      // 1. PKCE flow: exchange ?code= for session
      const code = url.searchParams.get('code')
      if (code) {
        const { data, error } = await supabase.auth.exchangeCodeForSession(code)
        if (data.session && !error) {
          setStatus('Accesso confermato! Reindirizzamento...')
          redirect('/admin')
          return
        }
        // PKCE exchange failed — fall through to implicit flow
      }

      // 2. Implicit flow: parse #access_token from hash
      const hash = window.location.hash.substring(1)
      if (hash) {
        const hashParams = new URLSearchParams(hash)

        // Check for error in hash fragment too
        const hashError = hashParams.get('error_code')
        if (hashError) {
          setIsError(true)
          if (hashError === 'otp_expired') {
            setStatus('Il link è scaduto o è già stato utilizzato. Accedi con email e password.')
          } else {
            const desc = hashParams.get('error_description')?.replace(/\+/g, ' ')
            setStatus(desc || 'Errore di autenticazione. Riprova.')
          }
          setTimeout(() => redirect('/admin/login'), 4000)
          return
        }

        const access_token = hashParams.get('access_token')
        const refresh_token = hashParams.get('refresh_token')

        if (access_token && refresh_token) {
          const { data, error } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          })

          if (data.session && !error) {
            setStatus('Accesso confermato! Reindirizzamento...')
            redirect('/admin')
            return
          }
          // setSession failed — fall through to getSession check
        }
      }

      // 3. Fallback: check if session was auto-detected by client
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setStatus('Accesso confermato! Reindirizzamento...')
        redirect('/admin')
        return
      }

      // 4. Listen for auth state change (in case processing is async)
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (session && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION')) {
          setStatus('Accesso confermato! Reindirizzamento...')
          subscription.unsubscribe()
          redirect('/admin')
        }
      })

      // 5. Timeout fallback
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
        {isError ? (
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto">
            <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        ) : (
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
        )}
        <p className={`font-medium ${isError ? 'text-red-600' : 'text-gray-600'}`}>{status}</p>
        {isError && (
          <a href="/admin/login" className="inline-block mt-2 text-sm text-purple-600 hover:underline">
            Vai al login
          </a>
        )}
      </div>
    </div>
  )
}
