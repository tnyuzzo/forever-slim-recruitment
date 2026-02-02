'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { AdminSettings } from '@/types/database'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Settings, Save, AlertCircle } from 'lucide-react'

export default function SettingsPage() {
  const [settings, setSettings] = useState<AdminSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)

  // Form state
  const [koMinHours, setKoMinHours] = useState(4)
  const [koMinDays, setKoMinDays] = useState(3)
  const [weights, setWeights] = useState({
    italian_high: 20,
    italian_medium: 10,
    experience_inbound: 15,
    close_rate_high: 10,
    availability_6plus: 10,
    weekend_available: 5,
    roleplay_quality: 20,
    audio_uploaded: 5,
  })

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    setIsLoading(true)
    const supabase = createClient()
    const { data, error } = await supabase
      .from('admin_settings')
      .select('*')
      .single()

    if (error) {
      console.error('Error loading settings:', error)
    } else if (data) {
      setSettings(data)
      setKoMinHours(data.ko_min_hours)
      setKoMinDays(data.ko_min_days)
      setWeights(data.scoring_weights)
    }
    setIsLoading(false)
  }

  const handleSave = async () => {
    setIsSaving(true)
    setSaveMessage(null)

    const supabase = createClient()
    const { error } = await supabase
      .from('admin_settings')
      .update({
        ko_min_hours: koMinHours,
        ko_min_days: koMinDays,
        scoring_weights: weights,
      })
      .eq('id', 1)

    if (error) {
      setSaveMessage('Errore durante il salvataggio')
    } else {
      setSaveMessage('Impostazioni salvate')
      setTimeout(() => setSaveMessage(null), 3000)
    }
    setIsSaving(false)
  }

  const updateWeight = (key: keyof typeof weights, value: number) => {
    setWeights({ ...weights, [key]: value })
  }

  if (isLoading) {
    return (
      <div className="p-8 text-center text-gray-500">Caricamento...</div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Impostazioni</h1>
        <p className="text-gray-500">Configura soglie KO e pesi scoring</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* KO Thresholds */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            Soglie KO
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Candidati sotto queste soglie vengono automaticamente rifiutati
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ore minime al giorno
              </label>
              <input
                type="number"
                min={1}
                max={12}
                value={koMinHours}
                onChange={(e) => setKoMinHours(Number(e.target.value))}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D946A8]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giorni minimi a settimana
              </label>
              <input
                type="number"
                min={1}
                max={7}
                value={koMinDays}
                onChange={(e) => setKoMinDays(Number(e.target.value))}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D946A8]"
              />
            </div>
          </div>
        </div>

        {/* Scoring Weights */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#D946A8]" />
            Pesi Scoring
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Configura i punti assegnati per ogni criterio (totale massimo: 100)
          </p>
          <div className="space-y-4">
            {[
              { key: 'italian_high', label: 'Italiano Alto' },
              { key: 'italian_medium', label: 'Italiano Medio' },
              { key: 'experience_inbound', label: 'Esperienza Inbound' },
              { key: 'close_rate_high', label: 'Close Rate Alto (30%+)' },
              { key: 'availability_6plus', label: 'Disponibilità 6+ ore' },
              { key: 'weekend_available', label: 'Weekend Disponibile' },
              { key: 'roleplay_quality', label: 'Qualità Roleplay' },
              { key: 'audio_uploaded', label: 'Audio Caricato' },
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between">
                <label className="text-sm text-gray-700">{label}</label>
                <input
                  type="number"
                  min={0}
                  max={50}
                  value={weights[key as keyof typeof weights]}
                  onChange={(e) => updateWeight(key as keyof typeof weights, Number(e.target.value))}
                  className="w-20 px-3 py-2 border border-gray-200 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-[#D946A8]"
                />
              </div>
            ))}
            <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
              <span className="font-medium text-gray-900">Totale Massimo</span>
              <span className={`font-bold ${Object.values(weights).reduce((a, b) => a + b, 0) > 100 ? 'text-red-600' : 'text-gray-900'}`}>
                {Object.values(weights).reduce((a, b) => a + b, 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center gap-4">
          <Button onClick={handleSave} isLoading={isSaving} className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            Salva Impostazioni
          </Button>
          {saveMessage && (
            <span className={`text-sm ${saveMessage.includes('Errore') ? 'text-red-600' : 'text-green-600'}`}>
              {saveMessage}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
