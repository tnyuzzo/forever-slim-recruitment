'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { format } from 'date-fns'
import { Filter, Search, ChevronRight, Trash2, User } from 'lucide-react'
import Image from 'next/image'

type Candidate = {
  id: string
  created_at: string
  first_name: string
  last_name: string
  email: string
  whatsapp: string
  score_total: number
  priority: 'low' | 'medium' | 'high'
  status: 'new' | 'invited' | 'interview_booked' | 'idoneo' | 'hired' | 'rejected'
  italian_level: string
  hours_per_day: number
  birth_date: string | null
  photo_url: string | null
  audio_url: string | null
}

const statusColors: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  invited: 'bg-indigo-100 text-indigo-700',
  interview_booked: 'bg-purple-100 text-purple-700',
  idoneo: 'bg-cyan-100 text-cyan-700',
  hired: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700'
}

const statusLabels: Record<string, string> = {
  new: 'Nuovo',
  invited: 'Invitato',
  interview_booked: 'Colloquio Fissato',
  idoneo: 'Idoneo',
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
  const [userRole, setUserRole] = useState<'superadmin' | 'recruiter' | null>(null)
  const [confirmDialog, setConfirmDialog] = useState<{ title: string; message: string; onConfirm: () => void } | null>(null)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [bulkDeleting, setBulkDeleting] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    fetchCandidates()
    fetchUserRole()
  }, [])

  async function fetchUserRole() {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      // 1. User metadata (most reliable — set via admin API)
      const metaRole = user.user_metadata?.role
      if (metaRole === 'superadmin' || metaRole === 'recruiter') {
        setUserRole(metaRole)
        return
      }
      // 2. Direct DB query (may fail due to RLS)
      const { data } = await supabase.from('user_roles').select('role').eq('user_id', user.id).single()
      if (data) {
        setUserRole(data.role as 'superadmin' | 'recruiter')
        return
      }
      // 3. API fallback (uses service_role, bypasses RLS)
      try {
        const res = await fetch('/api/team')
        if (res.ok) {
          const teamData = await res.json()
          const me = teamData.members?.find((m: any) => m.user_id === user.id)
          if (me) setUserRole(me.role as 'superadmin' | 'recruiter')
        }
      } catch {}
    }
  }

  function handleDelete(candidate: Candidate) {
    setConfirmDialog({
      title: 'Eliminazione Definitiva',
      message: `Sei sicuro di voler ELIMINARE DEFINITIVAMENTE ${candidate.first_name} ${candidate.last_name}? Questa azione è IRREVERSIBILE.`,
      onConfirm: async () => {
        try {
          if (candidate.photo_url) {
            const photoPath = candidate.photo_url.split('/storage/v1/object/public/candidate-photos/')[1]
            if (photoPath) await supabase.storage.from('candidate-photos').remove([photoPath])
          }
          if (candidate.audio_url) {
            const audioPath = candidate.audio_url.split('/storage/v1/object/public/candidate-audio/')[1]
            if (audioPath) await supabase.storage.from('candidate-audio').remove([audioPath])
          }
          await supabase.from('interviews').delete().eq('candidate_id', candidate.id)
          const { error } = await supabase.from('candidates').delete().eq('id', candidate.id)
          if (error) throw error
          setConfirmDialog(null)
          setCandidates(prev => prev.filter(c => c.id !== candidate.id))
        } catch (error) {
          console.error('Error deleting candidate:', error)
          alert('Errore nella cancellazione del candidato')
          setConfirmDialog(null)
        }
      },
    })
  }

  function toggleSelect(id: string) {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleSelectAll() {
    if (selectedIds.size === filteredCandidates.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredCandidates.map(c => c.id)))
    }
  }

  function handleBulkDelete() {
    const count = selectedIds.size
    const selected = candidates.filter(c => selectedIds.has(c.id))
    setConfirmDialog({
      title: `Eliminazione di ${count} candidat${count === 1 ? 'o' : 'i'}`,
      message: `Sei sicuro di voler ELIMINARE DEFINITIVAMENTE ${count} candidat${count === 1 ? 'o' : 'i'}? Verranno eliminati anche foto, audio e colloqui associati. Questa azione è IRREVERSIBILE.`,
      onConfirm: async () => {
        setBulkDeleting(true)
        try {
          for (const candidate of selected) {
            if (candidate.photo_url) {
              const photoPath = candidate.photo_url.split('/storage/v1/object/public/candidate-photos/')[1]
              if (photoPath) await supabase.storage.from('candidate-photos').remove([photoPath])
            }
            if (candidate.audio_url) {
              const audioPath = candidate.audio_url.split('/storage/v1/object/public/candidate-audio/')[1]
              if (audioPath) await supabase.storage.from('candidate-audio').remove([audioPath])
            }
            await supabase.from('interviews').delete().eq('candidate_id', candidate.id)
            await supabase.from('candidates').delete().eq('id', candidate.id)
          }
          setCandidates(prev => prev.filter(c => !selectedIds.has(c.id)))
          setSelectedIds(new Set())
          setConfirmDialog(null)
        } catch (error) {
          console.error('Error bulk deleting candidates:', error)
          alert('Errore nella cancellazione di alcuni candidati')
          setConfirmDialog(null)
        } finally {
          setBulkDeleting(false)
        }
      },
    })
  }

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
            <option value="invited">Invitati</option>
            <option value="interview_booked">Colloquio Fissato</option>
            <option value="idoneo">Idonei</option>
            <option value="hired">Assunti</option>
            <option value="rejected">Rifiutati KO</option>
          </select>
        </div>
      </div>

      {userRole === 'superadmin' && selectedIds.size > 0 && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl px-5 py-3">
          <span className="text-sm font-semibold text-red-700">
            {selectedIds.size} selezionat{selectedIds.size === 1 ? 'o' : 'i'}
          </span>
          <button
            onClick={handleBulkDelete}
            disabled={bulkDeleting}
            className="ml-auto inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            {bulkDeleting ? 'Eliminazione...' : 'Elimina selezionati'}
          </button>
          <button
            onClick={() => setSelectedIds(new Set())}
            className="px-4 py-2 rounded-xl border border-red-200 text-red-600 text-sm font-medium hover:bg-red-100 transition-colors"
          >
            Deseleziona
          </button>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-sm font-semibold text-text-muted">
                {userRole === 'superadmin' && (
                  <th className="p-4 w-10">
                    <input
                      type="checkbox"
                      checked={filteredCandidates.length > 0 && selectedIds.size === filteredCandidates.length}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-gray-300 text-red-500 focus:ring-red-500 cursor-pointer"
                    />
                  </th>
                )}
                <th className="p-4 whitespace-nowrap w-12"></th>
                <th className="p-4 whitespace-nowrap">Nome</th>
                <th className="p-4 whitespace-nowrap">Età</th>
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
                  <td colSpan={userRole === 'superadmin' ? 10 : 9} className="p-8 text-center text-text-muted">
                    Caricamento candidati...
                  </td>
                </tr>
              ) : filteredCandidates.length === 0 ? (
                <tr>
                  <td colSpan={userRole === 'superadmin' ? 10 : 9} className="p-8 text-center text-text-muted">
                    Nessun candidato trovato.
                  </td>
                </tr>
              ) : (
                filteredCandidates.map((candidate) => (
                  <tr
                    key={candidate.id}
                    className={`hover:bg-gray-50 transition-colors cursor-pointer ${selectedIds.has(candidate.id) ? 'bg-red-50/50' : ''}`}
                    onClick={() => router.push(`/admin/candidates/${candidate.id}`)}
                  >
                    {userRole === 'superadmin' && (
                      <td className="p-4" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedIds.has(candidate.id)}
                          onChange={() => toggleSelect(candidate.id)}
                          className="w-4 h-4 rounded border-gray-300 text-red-500 focus:ring-red-500 cursor-pointer"
                        />
                      </td>
                    )}
                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                      {candidate.photo_url ? (
                        <Image
                          src={candidate.photo_url}
                          alt={`${candidate.first_name} ${candidate.last_name}`}
                          width={36}
                          height={36}
                          className="w-9 h-9 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-text-main">{candidate.first_name} {candidate.last_name}</div>
                      <div className="text-xs text-text-muted">{format(new Date(candidate.created_at), 'dd MMM yyyy')}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-text-main">{candidate.birth_date ? Math.floor((Date.now() - new Date(candidate.birth_date).getTime()) / 31557600000) : '—'}</div>
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
                    <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        {userRole === 'superadmin' && (
                          <button
                            onClick={() => handleDelete(candidate)}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-red-500 hover:text-white transition-colors text-gray-400"
                            title="Elimina candidato"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {confirmDialog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <h3 className="text-lg font-bold text-red-600 mb-2">{confirmDialog.title}</h3>
            <p className="text-sm text-text-muted mb-6">{confirmDialog.message}</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmDialog(null)}
                className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Annulla
              </button>
              <button
                onClick={confirmDialog.onConfirm}
                className="px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
              >
                Elimina Definitivamente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
