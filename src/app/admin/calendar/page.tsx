'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { format } from 'date-fns'
import { it } from 'date-fns/locale'
import { Calendar, Clock, Video, ChevronRight, Search, Sun, Moon, CalendarDays } from 'lucide-react'

type Candidate = {
  id: string
  created_at: string
  first_name: string
  last_name: string
  status: string
  time_slots: string
  start_date: string
  hours_per_day: number
  days_per_week: number
  weekend_sat: boolean
  weekend_sun: boolean
}

export default function CalendarPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const supabase = createClient()

  useEffect(() => {
    fetchCandidates()
  }, [])

  async function fetchCandidates() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('candidates')
        .select('id, created_at, first_name, last_name, status, time_slots, start_date, hours_per_day, days_per_week, weekend_sat, weekend_sun')
        .in('status', ['new', 'qualified', 'interview_booked'])
        .order('created_at', { ascending: false })

      if (error) throw error
      if (data) setCandidates(data)
    } catch (error) {
      console.error('Error fetching calendar candidates:', error)
    } finally {
      setLoading(false)
    }
  }

  const bookedCandidates = candidates.filter(c => c.status === 'interview_booked')

  const pendingCandidates = candidates.filter(c => c.status === 'qualified' || c.status === 'new')
    .filter(c =>
      `${c.first_name} ${c.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.time_slots.toLowerCase().includes(searchTerm.toLowerCase())
    )

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main">Disponibilità & Colloqui</h1>
          <p className="text-text-muted text-sm mt-1">Pianifica le videochiamate in base alle fasce orarie dei candidati.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Booked Interviews */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-purple-50 p-6 rounded-3xl border border-purple-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-200 text-purple-700 rounded-full flex items-center justify-center">
                <Video className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-purple-900">Colloqui Fissati</h2>
            </div>

            {loading ? (
              <p className="text-purple-600/60 text-sm">Caricamento...</p>
            ) : bookedCandidates.length === 0 ? (
              <p className="text-purple-600/60 text-sm">Nessun colloquio programmato al momento.</p>
            ) : (
              <div className="space-y-3">
                {bookedCandidates.map(candidate => (
                  <Link href={`/admin/candidates/${candidate.id}`} key={candidate.id} className="block bg-white p-4 rounded-2xl shadow-sm border border-purple-100 hover:border-purple-300 transition-colors">
                    <div className="font-bold text-text-main">{candidate.first_name} {candidate.last_name}</div>
                    <div className="text-xs text-text-muted mt-1 flex items-center gap-2">
                      <Clock className="w-3 h-3" /> Disponibilità: {candidate.time_slots}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Candidates Availability */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h2 className="text-lg font-bold text-text-main flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-primary-main" /> Esplora Disponibilità
              </h2>

              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cerca orario, nome..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-main"
                />
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12 text-text-muted">Recupero disponibilità...</div>
            ) : pendingCandidates.length === 0 ? (
              <div className="text-center py-12 text-text-muted">Nessun candidato trovato in attesa di colloquio.</div>
            ) : (
              <div className="space-y-4">
                {pendingCandidates.map(candidate => (
                  <div key={candidate.id} className="border border-gray-100 rounded-2xl p-5 hover:border-primary-light transition-all">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                      <div>
                        <Link href={`/admin/candidates/${candidate.id}`} className="font-bold text-lg text-primary-hover hover:underline">
                          {candidate.first_name} {candidate.last_name}
                        </Link>
                        <div className="flex items-center gap-3 text-sm text-text-muted mt-2">
                          <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-md">
                            <Clock className="w-4 h-4 text-primary-main" /> {candidate.hours_per_day}h / {candidate.days_per_week}gg
                          </div>
                          <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-md">
                            <Calendar className="w-4 h-4 text-primary-main" /> Inizio: {candidate.start_date}
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 md:ml-8">
                        <div className="text-xs font-bold text-text-muted uppercase mb-1">Fasce Orarie Segnalate</div>
                        <div className="font-medium text-text-main bg-blue-50 text-blue-800 p-3 rounded-xl border border-blue-100">
                          {candidate.time_slots}
                        </div>
                        <div className="flex gap-2 text-xs mt-3">
                          {candidate.weekend_sat && <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100 font-medium">Sabato</span>}
                          {candidate.weekend_sun && <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100 font-medium">Domenica</span>}
                        </div>
                      </div>

                      <div className="hidden md:flex flex-shrink-0">
                        <Link href={`/admin/candidates/${candidate.id}`} className="w-10 h-10 bg-gray-50 hover:bg-primary-main hover:text-white rounded-full flex items-center justify-center text-gray-400 transition-colors">
                          <ChevronRight className="w-5 h-5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
