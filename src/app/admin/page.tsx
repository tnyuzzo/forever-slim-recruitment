'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { format } from 'date-fns'
import { Filter, Search, ChevronRight } from 'lucide-react'

type Candidate = {
  id: string
  created_at: string
  first_name: string
  last_name: string
  email: string
  whatsapp: string
  score_total: number
  priority: 'low' | 'medium' | 'high'
  status: 'new' | 'qualified' | 'invited' | 'interview_booked' | 'offer_sent' | 'hired' | 'rejected'
  italian_level: string
  hours_per_day: number
}

const statusColors: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  qualified: 'bg-amber-100 text-amber-700',
  invited: 'bg-indigo-100 text-indigo-700',
  interview_booked: 'bg-purple-100 text-purple-700',
  offer_sent: 'bg-cyan-100 text-cyan-700',
  hired: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700'
}

const statusLabels: Record<string, string> = {
  new: 'Nuovo',
  qualified: 'Qualificato',
  invited: 'Invitato',
  interview_booked: 'Colloquio Fissato',
  offer_sent: 'Proposta Inviata',
  hired: 'Assunto',
  rejected: 'Rifiutato'
}

const priorityColors = {
  high: 'bg-red-100 text-red-700 border-red-200',
  medium: 'bg-orange-100 text-orange-700 border-orange-200',
  low: 'bg-gray-100 text-gray-700 border-gray-200'
}

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const supabase = createClient()

  useEffect(() => {
    fetchCandidates()
  }, [])

  async function fetchCandidates() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      if (data) setCandidates(data)
    } catch (error) {
      console.error('Error fetching candidates:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCandidates = candidates.filter(c => {
    const matchesSearch =
      `${c.first_name} ${c.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || c.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main">Candidati</h1>
          <p className="text-text-muted text-sm mt-1">Gestisci e valuta le candidature ricevute.</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cerca per nome o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-main"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            className="w-full md:w-auto p-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-main bg-white"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tutti gli stati</option>
            <option value="new">Nuovi</option>
            <option value="qualified">Qualificati</option>
            <option value="invited">Invitati</option>
            <option value="interview_booked">Colloquio Fissato</option>
            <option value="offer_sent">Proposta Inviata</option>
            <option value="hired">Assunti</option>
            <option value="rejected">Rifiutati KO</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-sm font-semibold text-text-muted">
                <th className="p-4 whitespace-nowrap">Nome</th>
                <th className="p-4 whitespace-nowrap">Contatti</th>
                <th className="p-4 whitespace-nowrap">Score</th>
                <th className="p-4 whitespace-nowrap">Priorità</th>
                <th className="p-4 whitespace-nowrap">Status</th>
                <th className="p-4 whitespace-nowrap">Italiano / Ore</th>
                <th className="p-4 whitespace-nowrap text-right">Azione</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-text-muted">
                    Caricamento candidati...
                  </td>
                </tr>
              ) : filteredCandidates.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-text-muted">
                    Nessun candidato trovato.
                  </td>
                </tr>
              ) : (
                filteredCandidates.map((candidate) => (
                  <tr key={candidate.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="font-semibold text-text-main">{candidate.first_name} {candidate.last_name}</div>
                      <div className="text-xs text-text-muted">{format(new Date(candidate.created_at), 'dd MMM yyyy')}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-text-main">{candidate.email}</div>
                      <div className="text-xs text-text-muted">{candidate.whatsapp}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-lg text-primary-main">{candidate.score_total || 0}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${priorityColors[candidate.priority] || priorityColors.low}`}>
                        {candidate.priority?.toUpperCase() || 'LOW'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusColors[candidate.status]}`}>
                        {statusLabels[candidate.status]}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="capitalize">{candidate.italian_level}</div>
                      <div className="text-xs text-text-muted">{candidate.hours_per_day}h/gg</div>
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        href={`/admin/candidates/${candidate.id}`}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-primary-main hover:text-white transition-colors text-gray-500"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
