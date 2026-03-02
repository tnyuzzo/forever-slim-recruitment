'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Lock, Loader2, Mail, ArrowLeft } from 'lucide-react'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [mode, setMode] = useState<'password' | 'magiclink'>('password')
  const [magicLinkSent, setMagicLinkSent] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const siteUrl = (typeof window !== 'undefined' ? window.location.origin : 'https://closeragency.eu')

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError('Credenziali non valide.')
      setIsLoading(false)
      return
    }

    router.push('/admin')
    router.refresh()
  }

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      setError('Inserisci la tua email.')
      return
    }
    setIsLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
        emailRedirectTo: `${siteUrl}/auth/callback`,
      },
    })

    if (error) {
      setError('Errore invio link. Verifica che la tua email sia registrata nel team.')
      setIsLoading(false)
      return
    }

    setMagicLinkSent(true)
    setIsLoading(false)
  }

  if (magicLinkSent) {
    return (
      <div className="min-h-screen bg-bg-alt flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600">
              <Mail className="w-8 h-8" />
            </div>
          </div>
          <h1 className="text-2xl font-black text-text-main mb-4">Controlla la tua email</h1>
          <p className="text-gray-600 mb-2">
            Abbiamo inviato un link di accesso a:
          </p>
          <p className="font-semibold text-text-main mb-6">{email}</p>
          <p className="text-sm text-gray-500 mb-8">
            Clicca il link nell&apos;email per accedere al pannello. Il link scade tra 1 ora.
          </p>
          <button
            onClick={() => {
              setMagicLinkSent(false)
              setMode('password')
            }}
            className="text-primary-main hover:text-primary-hover font-medium text-sm flex items-center gap-1 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Torna al login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-alt flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-primary-light/50 rounded-full flex items-center justify-center text-primary-main">
            <Lock className="w-8 h-8" />
          </div>
        </div>

        <h1 className="text-2xl font-black text-center text-text-main mb-8">Accesso Admin</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
            {error}
          </div>
        )}

        {mode === 'password' ? (
          <>
            <form onSubmit={handlePasswordLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-text-main">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-main"
                  placeholder="admin@closeragency.eu"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-text-main">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-main"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary-main hover:bg-primary-hover text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Accedi al Pannello'}
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 text-gray-400">oppure</span>
              </div>
            </div>

            <button
              onClick={() => {
                setMode('magiclink')
                setError(null)
              }}
              className="w-full border-2 border-primary-main text-primary-main hover:bg-primary-light/30 font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <Mail className="w-5 h-5" />
              Accedi senza password
            </button>
          </>
        ) : (
          <>
            <form onSubmit={handleMagicLink} className="space-y-6">
              <p className="text-sm text-gray-600 text-center">
                Inserisci la tua email e riceverai un link di accesso diretto.
              </p>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-text-main">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-main"
                  placeholder="tuaemail@esempio.com"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary-main hover:bg-primary-hover text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <>
                    <Mail className="w-5 h-5" />
                    Invia link di accesso
                  </>
                )}
              </button>
            </form>

            <button
              onClick={() => {
                setMode('password')
                setError(null)
              }}
              className="w-full mt-4 text-primary-main hover:text-primary-hover font-medium text-sm flex items-center justify-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Accedi con password
            </button>
          </>
        )}
      </div>
    </div>
  )
}
