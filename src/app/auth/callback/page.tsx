'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AuthCallbackPage() {
  const [status, setStatus] = useState('Verifica in corso...')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // The Supabase browser client auto-detects #access_token in the URL hash
    // and exchanges it for a session (stored in cookies)
    const handleCallback = async () => {
      // Give the SDK a moment to process the hash
      const { data: { session }, error } = await supabase.auth.getSession()

      if (error) {
        console.error('[auth/callback] Error:', error)
        setStatus('Errore di autenticazione. Reindirizzamento...')
        setTimeout(() => router.replace('/admin/login'), 2000)
        return
      }

      if (session) {
        setStatus('Accesso confermato! Reindirizzamento...')
        router.replace('/admin')
      } else {
        // Hash might not be processed yet, listen for auth state change
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          if (event === 'SIGNED_IN' && session) {
            setStatus('Accesso confermato! Reindirizzamento...')
            router.replace('/admin')
            subscription.unsubscribe()
          }
        })

        // Timeout fallback
        setTimeout(() => {
          setStatus('Sessione non trovata. Reindirizzamento al login...')
          router.replace('/admin/login')
        }, 5000)
      }
    }

    handleCallback()
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
