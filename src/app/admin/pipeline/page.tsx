'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { ChevronRight, GripVertical, Calendar } from 'lucide-react'
import { format } from 'date-fns'

type Candidate = {
  id: string
  first_name: string
  last_name: string
  score_total: number
  priority: 'low' | 'medium' | 'high'
  status: string
  whatsapp: string
  hours_per_day: number
  created_at: string
}

const COLUMNS = [
  { id: 'qualified', label: 'Qualificati', color: 'bg-amber-500', lightBg: 'bg-amber-50' },
  { id: 'invited', label: 'Invitati', color: 'bg-indigo-500', lightBg: 'bg-indigo-50' },
  { id: 'interview_booked', label: 'Colloquio Fissato', color: 'bg-purple-500', lightBg: 'bg-purple-50' },
  { id: 'offer_sent', label: 'Proposta Inviata', color: 'bg-cyan-500', lightBg: 'bg-cyan-50' },
  { id: 'hired', label: 'Assunti', color: 'bg-green-500', lightBg: 'bg-green-50' },
  { id: 'rejected', label: 'Rifiutati', color: 'bg-red-500', lightBg: 'bg-red-50' },
]

const priorityColors: Record<string, string> = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-orange-100 text-orange-700',
  low: 'bg-gray-100 text-gray-500',
}

export default function PipelinePage() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(true)
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null)
  const [interviewMap, setInterviewMap] = useState<Record<string, any>>({})
  const supabase = createClient()

  useEffect(() => {
    fetchCandidates()
  }, [])

  async function fetchCandidates() {
    try {
      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .order('score_total', { ascending: false })

      if (error) throw error
      if (data) {
        setCandidates(data)

        // Fetch latest interview for booked candidates
        const bookedIds = data.filter(c => c.status === 'interview_booked').map(c => c.id)
        if (bookedIds.length > 0) {
          const { data: interviewData } = await supabase
            .from('interviews')
            .select('candidate_id, scheduled_start, scheduled_at, status, outcome')
            .in('candidate_id', bookedIds)
            .in('status', ['confirmed', 'scheduled', 'pending'])
            .order('created_at', { ascending: false })

          if (interviewData) {
            const map: Record<string, any> = {}
            for (const iv of interviewData) {
              if (!map[iv.candidate_id]) {
                map[iv.candidate_id] = iv
              }
            }
            setInterviewMap(map)
          }
        }
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateCandidateStatus = useCallback(async (candidateId: string, newStatus: string) => {
    // Optimistic update
    setCandidates(prev => prev.map(c => c.id === candidateId ? { ...c, status: newStatus } : c))

    try {
      const { error } = await supabase
        .from('candidates')
        .update({ status: newStatus })
        .eq('id', candidateId)

      if (error) throw error
    } catch (error) {
      console.error('Error updating status:', error)
      fetchCandidates() // Revert on error
    }
  }, [supabase])

  const handleDragStart = (e: React.DragEvent, candidateId: string) => {
    setDraggedId(candidateId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverColumn(columnId)
  }

  const handleDragLeave = () => {
    setDragOverColumn(null)
  }

  const handleDrop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault()
    setDragOverColumn(null)
    if (draggedId) {
      updateCandidateStatus(draggedId, columnId)
      setDraggedId(null)
    }
  }

  const handleDragEnd = () => {
    setDraggedId(null)
    setDragOverColumn(null)
  }

  const getColumnCandidates = (status: string) => candidates.filter(c => c.status === status)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-main">Pipeline</h1>
        <p className="text-text-muted text-sm mt-1">Trascina i candidati tra le fasi della selezione.</p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-text-muted">Caricamento pipeline...</div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2">
          {COLUMNS.map(col => {
            const colCandidates = getColumnCandidates(col.id)
            const isOver = dragOverColumn === col.id

            return (
              <div
                key={col.id}
                onDragOver={(e) => handleDragOver(e, col.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, col.id)}
                className={`flex-shrink-0 w-64 md:w-72 flex flex-col rounded-2xl border transition-all ${isOver ? 'border-indigo-300 bg-indigo-50/50 shadow-lg scale-[1.02]' : 'border-gray-100 bg-white shadow-sm'
                  }`}
              >
                {/* Column header */}
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${col.color}`} />
                    <h3 className="font-bold text-sm text-text-main">{col.label}</h3>
                  </div>
                  <span className="text-xs font-bold text-text-muted bg-gray-100 px-2.5 py-1 rounded-full">{colCandidates.length}</span>
                </div>

                {/* Cards */}
                <div className="p-3 space-y-2 flex-1 min-h-[200px]">
                  {colCandidates.length === 0 && (
                    <div className="text-xs text-text-muted text-center py-8 opacity-50">
                      Nessun candidato
                    </div>
                  )}
                  {colCandidates.map(c => (
                    <div
                      key={c.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, c.id)}
                      onDragEnd={handleDragEnd}
                      className={`group p-3 rounded-xl border border-gray-100 bg-white hover:shadow-md transition-all cursor-grab active:cursor-grabbing ${draggedId === c.id ? 'opacity-50 scale-95' : ''
                        }`}
                    >
                      <div className="flex items-start gap-2">
                        <GripVertical className="w-4 h-4 text-gray-300 group-hover:text-gray-400 mt-0.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-semibold text-sm text-text-main truncate">{c.first_name} {c.last_name}</span>
                            <span className="text-xs font-bold text-primary-main shrink-0">{c.score_total || 0}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${priorityColors[c.priority] || priorityColors.low}`}>
                              {c.priority?.toUpperCase()}
                            </span>
                            <span className="text-[10px] text-text-muted">{c.hours_per_day}h/gg</span>
                          </div>
                          {interviewMap[c.id] && (
                            <div className="flex items-center gap-1 mt-1.5 text-[10px] text-purple-600 font-medium">
                              <Calendar className="w-3 h-3" />
                              {format(new Date(interviewMap[c.id].scheduled_start || interviewMap[c.id].scheduled_at), 'dd MMM HH:mm')}
                            </div>
                          )}
                        </div>
                        <Link
                          href={`/admin/candidates/${c.id}`}
                          className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-full bg-gray-100 hover:bg-primary-main hover:text-white flex items-center justify-center transition-all shrink-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
