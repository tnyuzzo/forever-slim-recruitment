'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Save, Clock, Bell, Loader2, CheckCircle2, Plus, Trash2, Copy } from 'lucide-react'

type SlotRow = {
  id?: string
  day_of_week: number
  start_time: string
  end_time: string
  is_active: boolean
}

const DAY_NAMES = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato']
const SHORT_DAYS = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab']
const WEEKDAYS = [1, 2, 3, 4, 5] // Lun-Ven
const ALL_DAYS = [1, 2, 3, 4, 5, 6, 0] // Lun-Dom

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
        setSlots(WEEKDAYS.map(d => ({ day_of_week: d, start_time: '10:00', end_time: '18:00', is_active: true })))
      }
    } catch (error) {
      console.error('Error fetching slots:', error)
      setSlots(WEEKDAYS.map(d => ({ day_of_week: d, start_time: '10:00', end_time: '18:00', is_active: true })))
    } finally {
      setLoading(false)
    }
  }

  function addSlot() {
    const usedDays = new Set(slots.map(s => s.day_of_week))
    const nextDay = ALL_DAYS.find(d => !usedDays.has(d))
    if (nextDay === undefined) return
    setSlots([...slots, { day_of_week: nextDay, start_time: '09:00', end_time: '17:00', is_active: true }].sort((a, b) => {
      const order = [1, 2, 3, 4, 5, 6, 0]
      return order.indexOf(a.day_of_week) - order.indexOf(b.day_of_week)
    }))
  }

  function removeSlot(index: number) {
    setSlots(slots.filter((_, i) => i !== index))
  }

  function updateSlot(index: number, field: keyof SlotRow, value: any) {
    setSlots(slots.map((s, i) => i === index ? { ...s, [field]: value } : s))
  }

  function copyToWeekdays(sourceIndex: number) {
    const source = slots[sourceIndex]
    const newSlots = [...slots]

    for (const day of WEEKDAYS) {
      const existing = newSlots.findIndex(s => s.day_of_week === day)
      if (existing >= 0) {
        newSlots[existing] = { ...newSlots[existing], start_time: source.start_time, end_time: source.end_time, is_active: source.is_active }
      } else {
        newSlots.push({ day_of_week: day, start_time: source.start_time, end_time: source.end_time, is_active: source.is_active })
      }
    }

    setSlots(newSlots.sort((a, b) => {
      const order = [1, 2, 3, 4, 5, 6, 0]
      return order.indexOf(a.day_of_week) - order.indexOf(b.day_of_week)
    }))
  }

  function copyToAll(sourceIndex: number) {
    const source = slots[sourceIndex]
    const newSlots: SlotRow[] = ALL_DAYS.map(day => ({
      day_of_week: day,
      start_time: source.start_time,
      end_time: source.end_time,
      is_active: source.is_active,
    }))
    setSlots(newSlots)
  }

  function toggleDay(day: number) {
    const existing = slots.findIndex(s => s.day_of_week === day)
    if (existing >= 0) {
      setSlots(slots.filter((_, i) => i !== existing))
    } else {
      const ref = slots[0] || { start_time: '10:00', end_time: '18:00', is_active: true }
      const newSlots = [...slots, { day_of_week: day, start_time: ref.start_time, end_time: ref.end_time, is_active: true }]
      setSlots(newSlots.sort((a, b) => {
        const order = [1, 2, 3, 4, 5, 6, 0]
        return order.indexOf(a.day_of_week) - order.indexOf(b.day_of_week)
      }))
    }
  }

  async function saveSlots() {
    setSaving(true)
    try {
      await supabase.from('interview_slots').delete().neq('id', '00000000-0000-0000-0000-000000000000')

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

  const activeDays = new Set(slots.map(s => s.day_of_week))

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
            <p className="text-sm text-text-muted">Seleziona i giorni e imposta le fasce orarie. I candidati potranno prenotare solo in questi slot.</p>
          </div>
        </div>

        {/* Day selector chips */}
        <div className="mb-6">
          <label className="text-xs font-semibold text-text-muted uppercase mb-2 block">Giorni Attivi</label>
          <div className="flex flex-wrap gap-2">
            {ALL_DAYS.map(day => (
              <button
                key={day}
                onClick={() => toggleDay(day)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  activeDays.has(day)
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                }`}
              >
                {SHORT_DAYS[day]}
              </button>
            ))}
          </div>
        </div>

        {/* Slot rows */}
        <div className="space-y-3">
          {slots.map((slot, index) => (
            <div key={`${slot.day_of_week}-${index}`} className={`flex flex-wrap items-center gap-3 p-4 rounded-xl border transition-all ${slot.is_active ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50 opacity-60'}`}>
              <input
                type="checkbox"
                checked={slot.is_active}
                onChange={(e) => updateSlot(index, 'is_active', e.target.checked)}
                className="w-5 h-5 accent-indigo-600 rounded"
              />
              <span className="font-bold text-sm text-text-main w-24">{DAY_NAMES[slot.day_of_week]}</span>
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
              <div className="flex items-center gap-1 ml-auto">
                <button
                  onClick={() => copyToWeekdays(index)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                  title="Copia questa fascia su Lun-Ven"
                >
                  <Copy className="w-3 h-3" /> Lun-Ven
                </button>
                <button
                  onClick={() => copyToAll(index)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                  title="Copia questa fascia su tutti i giorni"
                >
                  <Copy className="w-3 h-3" /> Tutti
                </button>
                <button
                  onClick={() => removeSlot(index)}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {slots.length < 7 && (
          <div className="mt-4">
            <button
              onClick={addSlot}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-gray-300 text-sm font-semibold text-text-muted hover:bg-gray-50 transition-colors"
            >
              <Plus className="w-4 h-4" /> Aggiungi Giorno
            </button>
          </div>
        )}

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
              <div className="text-xs text-text-muted mt-0.5">Ricevi un&apos;email ad ogni nuova candidatura</div>
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
