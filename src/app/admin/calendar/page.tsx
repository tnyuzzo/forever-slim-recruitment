'use client'

import { useEffect, useState, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { it } from 'date-fns/locale'
import { Calendar as BigCalendar, dateFnsLocalizer, type View } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { Clock, Video, AlertCircle } from 'lucide-react'

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date: Date) => startOfWeek(date, { locale: it }),
  getDay,
  locales: { 'it': it },
})

type InterviewWithCandidate = {
  id: string
  candidate_id: string
  scheduled_start: string | null
  scheduled_end: string | null
  scheduled_at: string | null
  status: string
  outcome: string | null
  channel: string | null
  admin_notes: string | null
  slot_token: string | null
  candidates: {
    id: string
    first_name: string
    last_name: string
    email: string
    whatsapp: string
    score_total: number
  } | null
}

type CalendarEvent = {
  id: string
  title: string
  start: Date
  end: Date
  resource: InterviewWithCandidate
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'In attesa',
  confirmed: 'Confermato',
  scheduled: 'Programmato',
  completed: 'Completato',
  no_show: 'No Show',
  rescheduled: 'Riprogrammato',
  cancelled: 'Annullato',
}

const MESSAGES = {
  allDay: 'Tutto il giorno',
  previous: 'Indietro',
  next: 'Avanti',
  today: 'Oggi',
  month: 'Mese',
  week: 'Settimana',
  day: 'Giorno',
  agenda: 'Agenda',
  date: 'Data',
  time: 'Ora',
  event: 'Evento',
  noEventsInRange: 'Nessun colloquio in questo periodo.',
  showMore: (total: number) => `+${total} altri`,
}

export default function CalendarPage() {
  const [interviews, setInterviews] = useState<InterviewWithCandidate[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<View>('week')
  const [date, setDate] = useState(new Date())
  const supabase = createClient()

  useEffect(() => {
    fetchInterviews()
  }, [])

  async function fetchInterviews() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('interviews')
        .select('*, candidates(id, first_name, last_name, email, whatsapp, score_total)')
        .not('status', 'eq', 'cancelled')
        .order('scheduled_start', { ascending: true })

      if (error) throw error
      if (data) setInterviews(data as InterviewWithCandidate[])
    } catch (error) {
      console.error('Error fetching interviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const calendarEvents: CalendarEvent[] = useMemo(() =>
    interviews
      .filter(i => i.scheduled_start || i.scheduled_at)
      .map(i => {
        const startDate = new Date(i.scheduled_start || i.scheduled_at!)
        const endDate = i.scheduled_end
          ? new Date(i.scheduled_end)
          : new Date(startDate.getTime() + 60 * 60 * 1000)

        return {
          id: i.id,
          title: i.candidates
            ? `${i.candidates.first_name} ${i.candidates.last_name}`
            : 'Candidato',
          start: startDate,
          end: endDate,
          resource: i,
        }
      }),
    [interviews]
  )

  const upcomingInterviews = useMemo(() => {
    const now = new Date()
    return interviews
      .filter(i => {
        const dateStr = i.scheduled_start || i.scheduled_at
        if (!dateStr) return false
        return new Date(dateStr) >= now && ['confirmed', 'scheduled', 'pending'].includes(i.status)
      })
      .sort((a, b) => {
        const dateA = new Date(a.scheduled_start || a.scheduled_at!)
        const dateB = new Date(b.scheduled_start || b.scheduled_at!)
        return dateA.getTime() - dateB.getTime()
      })
      .slice(0, 10)
  }, [interviews])

  const pastInterviews = useMemo(() => {
    return interviews
      .filter(i => i.status === 'completed' || i.status === 'no_show')
      .sort((a, b) => {
        const dateA = new Date(a.scheduled_start || a.scheduled_at || a.id)
        const dateB = new Date(b.scheduled_start || b.scheduled_at || b.id)
        return dateB.getTime() - dateA.getTime()
      })
      .slice(0, 5)
  }, [interviews])

  const eventStyleGetter = useCallback((event: CalendarEvent) => {
    const interview = event.resource
    let backgroundColor = '#6366f1' // indigo default
    let borderColor = '#4f46e5'

    if (interview.outcome === 'pass') {
      backgroundColor = '#22c55e'
      borderColor = '#16a34a'
    } else if (interview.outcome === 'fail') {
      backgroundColor = '#ef4444'
      borderColor = '#dc2626'
    } else if (interview.outcome === 'follow_up') {
      backgroundColor = '#f59e0b'
      borderColor = '#d97706'
    } else if (interview.status === 'no_show') {
      backgroundColor = '#94a3b8'
      borderColor = '#64748b'
    } else if (interview.status === 'pending') {
      backgroundColor = '#a5b4fc'
      borderColor = '#818cf8'
    }

    return {
      style: {
        backgroundColor,
        borderColor,
        borderLeft: `4px solid ${borderColor}`,
        borderRadius: '8px',
        color: 'white',
        fontWeight: 600,
        fontSize: '13px',
        padding: '2px 6px',
      },
    }
  }, [])

  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    if (event.resource.candidates?.id) {
      window.location.href = `/admin/candidates/${event.resource.candidates.id}`
    }
  }, [])

  function getInterviewDate(interview: InterviewWithCandidate): string {
    const dateStr = interview.scheduled_start || interview.scheduled_at
    if (!dateStr) return 'N/D'
    return format(new Date(dateStr), "EEE d MMM, HH:mm", { locale: it })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-main">Calendario Colloqui</h1>
        <p className="text-text-muted text-sm mt-1">Visualizza e gestisci tutti i colloqui programmati.</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-text-muted">Caricamento colloqui...</div>
      ) : interviews.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100 text-center">
          <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-text-main mb-2">Nessun colloquio registrato</h3>
          <p className="text-text-muted text-sm">I colloqui appariranno qui quando inviterai i candidati dalla loro pagina dettaglio.</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar: Upcoming + Past */}
          <div className="lg:col-span-1 space-y-6">
            {/* Upcoming */}
            <div className="bg-purple-50 p-5 rounded-3xl border border-purple-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-purple-200 text-purple-700 rounded-full flex items-center justify-center">
                  <Video className="w-4 h-4" />
                </div>
                <h2 className="text-sm font-bold text-purple-900">Prossimi Colloqui</h2>
              </div>

              {upcomingInterviews.length === 0 ? (
                <p className="text-purple-600/60 text-xs">Nessun colloquio programmato.</p>
              ) : (
                <div className="space-y-2">
                  {upcomingInterviews.map(interview => (
                    <Link
                      href={`/admin/candidates/${interview.candidate_id}`}
                      key={interview.id}
                      className="block bg-white p-3 rounded-xl shadow-sm border border-purple-100 hover:border-purple-300 transition-colors"
                    >
                      <div className="font-bold text-sm text-text-main">
                        {interview.candidates?.first_name} {interview.candidates?.last_name}
                      </div>
                      <div className="text-xs text-text-muted mt-1 flex items-center gap-1.5">
                        <Clock className="w-3 h-3" />
                        {getInterviewDate(interview)}
                      </div>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                          interview.status === 'confirmed' ? 'bg-purple-100 text-purple-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {STATUS_LABELS[interview.status] || interview.status}
                        </span>
                        {interview.candidates?.score_total != null && (
                          <span className="text-[10px] font-bold text-primary-main">
                            Score: {interview.candidates.score_total}
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Past */}
            {pastInterviews.length > 0 && (
              <div className="bg-gray-50 p-5 rounded-3xl border border-gray-200">
                <h2 className="text-sm font-bold text-text-main mb-4">Colloqui Recenti</h2>
                <div className="space-y-2">
                  {pastInterviews.map(interview => (
                    <Link
                      href={`/admin/candidates/${interview.candidate_id}`}
                      key={interview.id}
                      className="block bg-white p-3 rounded-xl border border-gray-100 hover:border-gray-300 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-semibold text-xs text-text-main">
                          {interview.candidates?.first_name} {interview.candidates?.last_name}
                        </div>
                        {interview.outcome && (
                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                            interview.outcome === 'pass' ? 'bg-green-100 text-green-700' :
                            interview.outcome === 'fail' ? 'bg-red-100 text-red-700' :
                            'bg-amber-100 text-amber-700'
                          }`}>
                            {interview.outcome === 'pass' ? 'OK' : interview.outcome === 'fail' ? 'KO' : 'F/U'}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-text-muted mt-1">
                        {getInterviewDate(interview)} — {STATUS_LABELS[interview.status]}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main Calendar */}
          <div className="lg:col-span-3">
            <div className="bg-white p-4 md:p-6 rounded-3xl shadow-sm border border-gray-100">
              <div className="h-[600px]">
                <BigCalendar
                  localizer={localizer}
                  events={calendarEvents}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: '100%' }}
                  view={view}
                  onView={setView}
                  date={date}
                  onNavigate={setDate}
                  eventPropGetter={eventStyleGetter}
                  onSelectEvent={handleSelectEvent}
                  messages={MESSAGES}
                  culture="it"
                  min={new Date(2025, 0, 1, 8, 0)}
                  max={new Date(2025, 0, 1, 21, 0)}
                  views={['month', 'week', 'day', 'agenda']}
                  tooltipAccessor={(event: CalendarEvent) => {
                    const i = event.resource
                    return `${event.title} — ${STATUS_LABELS[i.status] || i.status}${i.outcome ? ` (${i.outcome})` : ''}${i.channel ? ` via ${i.channel}` : ''}`
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
