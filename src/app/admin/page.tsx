'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { Candidate, CandidateStatus, CandidatePriority } from '@/types/database'
import {
  Users,
  UserCheck,
  UserX,
  Calendar,
  TrendingUp,
  Search,
  Filter,
  ChevronDown,
  Eye,
  Download,
} from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

const statusColors: Record<CandidateStatus, string> = {
  new: 'bg-gray-100 text-gray-700',
  qualified: 'bg-blue-100 text-blue-700',
  interview_booked: 'bg-yellow-100 text-yellow-700',
  hired: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
}

const statusLabels: Record<CandidateStatus, string> = {
  new: 'Nuovo',
  qualified: 'Qualificato',
  interview_booked: 'Colloquio',
  hired: 'Assunto',
  rejected: 'Rifiutato',
}

const priorityColors: Record<CandidatePriority, string> = {
  high: 'bg-pink-100 text-pink-700',
  medium: 'bg-amber-100 text-amber-700',
  low: 'bg-gray-100 text-gray-500',
}

export default function AdminDashboardPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<CandidateStatus | 'all'>('all')
  const [priorityFilter, setPriorityFilter] = useState<CandidatePriority | 'all'>('all')

  useEffect(() => {
    loadCandidates()
  }, [])

  const loadCandidates = async () => {
    setIsLoading(true)
    const supabase = createClient()
    const { data, error } = await supabase
      .from('candidates')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error loading candidates:', error)
    } else {
      setCandidates(data || [])
    }
    setIsLoading(false)
  }

  const filteredCandidates = candidates.filter((c) => {
    const matchesSearch =
      searchQuery === '' ||
      `${c.first_name} ${c.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.whatsapp.includes(searchQuery)

    const matchesStatus = statusFilter === 'all' || c.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || c.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  // Calculate KPIs
  const totalCandidates = candidates.length
  const qualifiedCount = candidates.filter((c) => c.status !== 'rejected').length
  const rejectedCount = candidates.filter((c) => c.status === 'rejected').length
  const interviewBookedCount = candidates.filter((c) => c.status === 'interview_booked').length
  const hiredCount = candidates.filter((c) => c.status === 'hired').length
  const qualifiedPercent = totalCandidates > 0 ? Math.round((qualifiedCount / totalCandidates) * 100) : 0
  const rejectedPercent = totalCandidates > 0 ? Math.round((rejectedCount / totalCandidates) * 100) : 0

  const exportCSV = () => {
    const headers = ['Nome', 'Cognome', 'Email', 'WhatsApp', 'Score', 'Priorità', 'Status', 'Data']
    const rows = filteredCandidates.map((c) => [
      c.first_name,
      c.last_name,
      c.email,
      c.whatsapp,
      c.score_total,
      c.priority,
      c.status,
      new Date(c.created_at).toLocaleDateString('it-IT'),
    ])

    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `candidature_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Panoramica candidature e gestione</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalCandidates}</p>
              <p className="text-xs text-gray-500">Totali</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{qualifiedPercent}%</p>
              <p className="text-xs text-gray-500">Qualificati</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <UserX className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{rejectedPercent}%</p>
              <p className="text-xs text-gray-500">Rifiutati</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{interviewBookedCount}</p>
              <p className="text-xs text-gray-500">Colloqui</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{hiredCount}</p>
              <p className="text-xs text-gray-500">Assunti</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FDF2F8] rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-[#D946A8]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {candidates.filter((c) => c.priority === 'high').length}
              </p>
              <p className="text-xs text-gray-500">Alta priorità</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cerca per nome, email o telefono..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D946A8] focus:border-transparent"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as CandidateStatus | 'all')}
              className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D946A8]"
            >
              <option value="all">Tutti gli stati</option>
              <option value="new">Nuovo</option>
              <option value="qualified">Qualificato</option>
              <option value="interview_booked">Colloquio</option>
              <option value="hired">Assunto</option>
              <option value="rejected">Rifiutato</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as CandidatePriority | 'all')}
              className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D946A8]"
            >
              <option value="all">Tutte le priorità</option>
              <option value="high">Alta</option>
              <option value="medium">Media</option>
              <option value="low">Bassa</option>
            </select>
            <Button variant="outline" onClick={exportCSV} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              CSV
            </Button>
          </div>
        </div>
      </div>

      {/* Candidates Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Caricamento...</div>
        ) : filteredCandidates.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Nessun candidato trovato</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Contatto
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Priorità
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Data
                  </th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCandidates.map((candidate) => (
                  <tr key={candidate.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <p className="font-medium text-gray-900">
                        {candidate.first_name} {candidate.last_name}
                      </p>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <p className="text-sm text-gray-600">{candidate.email}</p>
                      <p className="text-sm text-gray-400">{candidate.whatsapp}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 font-semibold text-gray-900">
                        {candidate.score_total}
                      </span>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${priorityColors[candidate.priority]}`}>
                        {candidate.priority === 'high' ? 'Alta' : candidate.priority === 'medium' ? 'Media' : 'Bassa'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[candidate.status]}`}>
                        {statusLabels[candidate.status]}
                      </span>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell text-sm text-gray-500">
                      {new Date(candidate.created_at).toLocaleDateString('it-IT')}
                    </td>
                    <td className="px-4 py-4">
                      <Link
                        href={`/admin/candidates/${candidate.id}`}
                        className="p-2 text-gray-400 hover:text-[#D946A8] transition-colors"
                      >
                        <Eye className="w-5 h-5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
