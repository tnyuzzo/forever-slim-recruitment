'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { Candidate, CandidateStatus } from '@/types/database'
import { Eye, Clock, TrendingUp } from 'lucide-react'

const columns: { id: CandidateStatus; label: string; color: string }[] = [
  { id: 'new', label: 'Nuovi', color: 'bg-gray-500' },
  { id: 'qualified', label: 'Qualificati', color: 'bg-blue-500' },
  { id: 'interview_booked', label: 'Colloquio', color: 'bg-yellow-500' },
  { id: 'hired', label: 'Assunti', color: 'bg-green-500' },
  { id: 'rejected', label: 'Rifiutati', color: 'bg-red-500' },
]

const priorityColors = {
  high: 'border-l-pink-500',
  medium: 'border-l-amber-500',
  low: 'border-l-gray-300',
}

export default function PipelinePage() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [draggedCandidate, setDraggedCandidate] = useState<Candidate | null>(null)

  useEffect(() => {
    loadCandidates()
  }, [])

  const loadCandidates = async () => {
    setIsLoading(true)
    const supabase = createClient()
    const { data, error } = await supabase
      .from('candidates')
      .select('*')
      .order('score_total', { ascending: false })

    if (error) {
      console.error('Error loading candidates:', error)
    } else {
      setCandidates(data || [])
    }
    setIsLoading(false)
  }

  const handleDragStart = (candidate: Candidate) => {
    setDraggedCandidate(candidate)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = async (newStatus: CandidateStatus) => {
    if (!draggedCandidate || draggedCandidate.status === newStatus) {
      setDraggedCandidate(null)
      return
    }

    // Optimistically update UI
    setCandidates(candidates.map(c =>
      c.id === draggedCandidate.id ? { ...c, status: newStatus } : c
    ))

    // Update in database
    const supabase = createClient()
    const { error } = await supabase
      .from('candidates')
      .update({ status: newStatus })
      .eq('id', draggedCandidate.id)

    if (error) {
      console.error('Error updating status:', error)
      // Revert on error
      loadCandidates()
    }

    setDraggedCandidate(null)
  }

  const getCandidatesForColumn = (status: CandidateStatus) => {
    return candidates.filter(c => c.status === status)
  }

  if (isLoading) {
    return (
      <div className="p-8 text-center text-gray-500">Caricamento...</div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pipeline</h1>
        <p className="text-gray-500">Trascina le card per cambiare lo stato</p>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map(column => (
          <div
            key={column.id}
            className="flex-shrink-0 w-72"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(column.id)}
          >
            {/* Column Header */}
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-3 h-3 rounded-full ${column.color}`} />
              <h2 className="font-semibold text-gray-900">{column.label}</h2>
              <span className="text-sm text-gray-500 ml-auto">
                {getCandidatesForColumn(column.id).length}
              </span>
            </div>

            {/* Column Content */}
            <div className="bg-gray-100 rounded-xl p-3 min-h-[500px]">
              <div className="space-y-3">
                {getCandidatesForColumn(column.id).map(candidate => (
                  <div
                    key={candidate.id}
                    draggable
                    onDragStart={() => handleDragStart(candidate)}
                    className={`
                      bg-white rounded-lg p-4 border border-gray-200 border-l-4 cursor-move
                      hover:shadow-md transition-shadow
                      ${priorityColors[candidate.priority]}
                      ${draggedCandidate?.id === candidate.id ? 'opacity-50' : ''}
                    `}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-gray-900">
                          {candidate.first_name} {candidate.last_name}
                        </p>
                        <p className="text-sm text-gray-500">{candidate.email}</p>
                      </div>
                      <Link
                        href={`/admin/candidates/${candidate.id}`}
                        className="p-1 text-gray-400 hover:text-[#D946A8]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        <span className="font-semibold text-gray-900">{candidate.score_total}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{candidate.hours_per_day}h/{candidate.days_per_week}gg</span>
                      </div>
                    </div>

                    <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-400">
                      {new Date(candidate.created_at).toLocaleDateString('it-IT')}
                    </div>
                  </div>
                ))}

                {getCandidatesForColumn(column.id).length === 0 && (
                  <div className="text-center py-8 text-gray-400 text-sm">
                    Nessun candidato
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
