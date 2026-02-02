'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Interview } from '@/types/database'
import { ChevronLeft, ChevronRight, Clock, Phone, Video, MessageCircle, User } from 'lucide-react'
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns'
import { it } from 'date-fns/locale'

const channelIcons = {
  phone: Phone,
  whatsapp: MessageCircle,
  zoom: Video,
}

const statusColors = {
  scheduled: 'bg-blue-100 text-blue-700 border-blue-200',
  completed: 'bg-green-100 text-green-700 border-green-200',
  no_show: 'bg-red-100 text-red-700 border-red-200',
  rescheduled: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  canceled: 'bg-gray-100 text-gray-700 border-gray-200',
}

export default function CalendarPage() {
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  useEffect(() => {
    loadInterviews()
  }, [])

  const loadInterviews = async () => {
    setIsLoading(true)
    const supabase = createClient()
    const { data, error } = await supabase
      .from('interviews')
      .select(`
        *,
        candidate:candidates(id, first_name, last_name, email, whatsapp)
      `)
      .order('scheduled_start', { ascending: true })

    if (error) {
      console.error('Error loading interviews:', error)
    } else {
      setInterviews(data || [])
    }
    setIsLoading(false)
  }

  const getInterviewsForDate = (date: Date) => {
    return interviews.filter(interview =>
      isSameDay(new Date(interview.scheduled_start), date)
    )
  }

  const renderCalendar = () => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart, { locale: it })
    const endDate = endOfWeek(monthEnd, { locale: it })

    const rows = []
    let days = []
    let day = startDate

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const currentDay = day
        const dayInterviews = getInterviewsForDate(currentDay)
        const isToday = isSameDay(currentDay, new Date())
        const isCurrentMonth = isSameMonth(currentDay, monthStart)
        const isSelected = selectedDate && isSameDay(currentDay, selectedDate)

        days.push(
          <div
            key={currentDay.toString()}
            onClick={() => setSelectedDate(currentDay)}
            className={`
              min-h-[100px] p-2 border-b border-r border-gray-200 cursor-pointer
              ${!isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'bg-white'}
              ${isSelected ? 'ring-2 ring-[#D946A8] ring-inset' : ''}
              hover:bg-gray-50 transition-colors
            `}
          >
            <div className={`
              w-7 h-7 flex items-center justify-center rounded-full text-sm mb-1
              ${isToday ? 'bg-[#D946A8] text-white' : ''}
            `}>
              {format(currentDay, 'd')}
            </div>
            <div className="space-y-1">
              {dayInterviews.slice(0, 3).map(interview => (
                <div
                  key={interview.id}
                  className={`
                    text-xs p-1 rounded truncate
                    ${statusColors[interview.status]}
                  `}
                >
                  {format(new Date(interview.scheduled_start), 'HH:mm')}
                </div>
              ))}
              {dayInterviews.length > 3 && (
                <div className="text-xs text-gray-500 pl-1">
                  +{dayInterviews.length - 3} altri
                </div>
              )}
            </div>
          </div>
        )
        day = addDays(day, 1)
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7">
          {days}
        </div>
      )
      days = []
    }

    return rows
  }

  const selectedDateInterviews = selectedDate ? getInterviewsForDate(selectedDate) : []

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Calendario Colloqui</h1>
        <p className="text-gray-500">Visualizza e gestisci i colloqui programmati</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Calendar Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <button
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h2 className="text-lg font-semibold text-gray-900 capitalize">
              {format(currentMonth, 'MMMM yyyy', { locale: it })}
            </h2>
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 border-b border-gray-200">
            {['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'].map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-500 bg-gray-50">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Caricamento...</div>
          ) : (
            <div>{renderCalendar()}</div>
          )}
        </div>

        {/* Selected Date Details */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">
            {selectedDate
              ? format(selectedDate, "d MMMM yyyy", { locale: it })
              : 'Seleziona una data'}
          </h2>

          {selectedDate && selectedDateInterviews.length === 0 && (
            <p className="text-gray-500 text-sm">Nessun colloquio programmato</p>
          )}

          <div className="space-y-4">
            {selectedDateInterviews.map(interview => {
              const ChannelIcon = channelIcons[interview.channel]
              const candidate = interview.candidate as { first_name: string; last_name: string; email: string } | undefined

              return (
                <div
                  key={interview.id}
                  className={`p-4 rounded-lg border ${statusColors[interview.status]}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span className="font-medium">
                        {format(new Date(interview.scheduled_start), 'HH:mm')} - {format(new Date(interview.scheduled_end), 'HH:mm')}
                      </span>
                    </div>
                    <ChannelIcon className="w-4 h-4" />
                  </div>
                  {candidate && (
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 opacity-50" />
                      <span>{candidate.first_name} {candidate.last_name}</span>
                    </div>
                  )}
                  {interview.interviewer && (
                    <p className="text-sm opacity-75 mt-1">
                      Intervistatore: {interview.interviewer}
                    </p>
                  )}
                </div>
              )
            })}
          </div>

          {/* Legend */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-2">Legenda</p>
            <div className="space-y-1">
              {Object.entries(statusColors).map(([status, color]) => (
                <div key={status} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded ${color.split(' ')[0]}`} />
                  <span className="text-xs text-gray-600 capitalize">
                    {status === 'no_show' ? 'No Show' : status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
