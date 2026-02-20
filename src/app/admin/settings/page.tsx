'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Save, Clock, Bell, Loader2, CheckCircle2, Plus, Trash2 } from 'lucide-react'

type SlotRow = {
  id?: string
  day_of_week: number
  start_time: string
  end_time: string
  is_active: boolean
}

const DAY_NAMES = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato']

export default function SettingsPage() {
  const [slots, setSlots] = useState<SlotRow[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    fetchSlots()
  }, [])

  async function fetchSlots() {
    try {
      const { data, error } = await supabase
        .from('interview_slots')
        .select('*')
        .order('day_of_week', { ascending: true })

      if (error) throw error
      if (data && data.length > 0) {
        setSlots(data)
      } else {
        // Default Mon-Fri 10-18
        setSlots([
          { day_of_week: 1, start_time: '10:00', end_time: '18:00', is_active: true },
          { day_of_week: 2, start_time: '10:00', end_time: '18:00', is_active: true },
          { day_of_week: 3, start_time: '10:00', end_time: '18:00', is_active: true },
          { day_of_week: 4, start_time: '10:00', end_time: '18:00', is_active: true },
          { day_of_week: 5, start_time: '10:00', end_time: '18:00', is_active: true },
        ])
      }
    } catch (error) {
      console.error('Error fetching slots:', error)
      // Use defaults
      setSlots([
        { day_of_week: 1, start_time: '10:00', end_time: '18:00', is_active: true },
        { day_of_week: 2, start_time: '10:00', end_time: '18:00', is_active: true },
        { day_of_week: 3, start_time: '10:00', end_time: '18:00', is_active: true },
        { day_of_week: 4, start_time: '10:00', end_time: '18:00', is_active: true },
        { day_of_week: 5, start_time: '10:00', end_time: '18:00', is_active: true },
      ])
    } finally {
      setLoading(false)
    }
  }

  function addSlot() {
    const usedDays = new Set(slots.map(s => s.day_of_week))
    const nextDay = [1, 2, 3, 4, 5, 6, 0].find(d => !usedDays.has(d)) ?? 0
    setSlots([...slots, { day_of_week: nextDay, start_time: '09:00', end_time: '17:00', is_active: true }])
  }

  function removeSlot(index: number) {
    setSlots(slots.filter((_, i) => i !== index))
  }

  function updateSlot(index: number, field: keyof SlotRow, value: any) {
    setSlots(slots.map((s, i) => i === index ? { ...s, [field]: value } : s))
  }

  async function saveSlots() {
    setSaving(true)
    try {
      // Delete all existing slots
      await supabase.from('interview_slots').delete().neq('id', '00000000-0000-0000-0000-000000000000')

      // Insert new slots
      const { error } = await supabase
        .from('interview_slots')
        .insert(slots.map(s => ({
          day_of_week: s.day_of_week,
          start_time: s.start_time,
          end_time: s.end_time,
          is_active: s.is_active,
        })))

      if (error) throw error
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('Error saving slots:', error)
      alert('Errore nel salvataggio. Riprova.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="p-12 text-center text-text-muted">Caricamento impostazioni...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-main">Impostazioni</h1>
        <p className="text-text-muted text-sm mt-1">Configura gli slot disponibili per i colloqui e i parametri di sistema.</p>
      </div>

      {/* Calendar Availability */}
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
            <Clock className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-text-main">Disponibilità per Colloqui</h2>
            <p className="text-sm text-text-muted">Definisci le fasce orarie in cui sei disponibile per i colloqui. I candidati potranno prenotare solo in questi slot.</p>
          </div>
        </div>

        <div className="space-y-3">
          {slots.map((slot, index) => (
            <div key={index} className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${slot.is_active ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50 opacity-60'}`}>
              <input
                type="checkbox"
                checked={slot.is_active}
                onChange={(e) => updateSlot(index, 'is_active', e.target.checked)}
                className="w-5 h-5 accent-indigo-600 rounded"
              />
              <select
                value={slot.day_of_week}
                onChange={(e) => updateSlot(index, 'day_of_week', parseInt(e.target.value))}
                className="px-3 py-2 border border-gray-200 rounded-xl text-sm font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 w-36"
              >
                {DAY_NAMES.map((name, i) => (
                  <option key={i} value={i}>{name}</option>
                ))}
              </select>
              <div className="flex items-center gap-2">
                <input
                  type="time"
                  value={slot.start_time}
                  onChange={(e) => updateSlot(index, 'start_time', e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-text-muted text-sm font-medium">—</span>
                <input
                  type="time"
                  value={slot.end_time}
                  onChange={(e) => updateSlot(index, 'end_time', e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                onClick={() => removeSlot(index)}
                className="ml-auto p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={addSlot}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-gray-300 text-sm font-semibold text-text-muted hover:bg-gray-50 transition-colors"
          >
            <Plus className="w-4 h-4" /> Aggiungi Fascia Oraria
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
          <div>
            {saved && (
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-green-600">
                <CheckCircle2 className="w-4 h-4" /> Salvato!
              </span>
            )}
          </div>
          <button
            onClick={saveSlots}
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Salvataggio...' : 'Salva Disponibilità'}
          </button>
        </div>
      </div>

      {/* Notifications Config */}
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
            <Bell className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-text-main">Notifiche</h2>
            <p className="text-sm text-text-muted">Configura come ricevere le notifiche per nuove candidature.</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200">
            <div>
              <div className="font-semibold text-sm text-text-main">Email di Notifica</div>
              <div className="text-xs text-text-muted mt-0.5">Ricevi un'email ad ogni nuova candidatura</div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-text-muted bg-gray-100 px-2 py-1 rounded-full">Configurato in .env</span>
              <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            </div>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200">
            <div>
              <div className="font-semibold text-sm text-text-main">SMS (ClickSend)</div>
              <div className="text-xs text-text-muted mt-0.5">Ricevi un SMS per candidati a priorità alta</div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-text-muted bg-gray-100 px-2 py-1 rounded-full">Configurato in .env</span>
              <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
