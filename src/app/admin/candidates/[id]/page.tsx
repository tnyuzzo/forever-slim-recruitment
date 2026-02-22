'use client'

import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { format } from 'date-fns'
import { ChevronLeft, CheckCircle2, XCircle, Play, Mail, Phone, MessageCircle, Send, Globe, Clock, Briefcase, Headphones, Shield, FileText, Save, Loader2, Video, X, AlertTriangle, BarChart3, Pencil, User } from 'lucide-react'
import { notFound } from 'next/navigation'

const OUTCOME_STYLES: Record<string, string> = {
  pass: 'border-green-400 bg-green-50 text-green-700',
  fail: 'border-red-400 bg-red-50 text-red-700',
  follow_up: 'border-amber-400 bg-amber-50 text-amber-700',
}

const INTERVIEW_STATUS_LABELS: Record<string, string> = {
  pending: 'In attesa',
  confirmed: 'Confermato',
  scheduled: 'Programmato',
  completed: 'Completato',
  no_show: 'No Show',
  rescheduled: 'Riprogrammato',
  cancelled: 'Annullato',
}

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700 border-blue-200',
  qualified: 'bg-amber-100 text-amber-700 border-amber-200',
  invited: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  interview_booked: 'bg-purple-100 text-purple-700 border-purple-200',
  offer_sent: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  hired: 'bg-green-100 text-green-700 border-green-200',
  rejected: 'bg-red-100 text-red-700 border-red-200',
}

const STATUS_LABELS: Record<string, string> = {
  new: 'Nuovo',
  qualified: 'Qualificato',
  invited: 'Invitato',
  interview_booked: 'Colloquio Fissato',
  offer_sent: 'Proposta Inviata',
  hired: 'Assunto',
  rejected: 'Rifiutato',
}

const SCORE_LABELS: Record<string, { label: string; max: number }> = {
  italian: { label: 'Italiano', max: 20 },
  experience: { label: 'Esperienza', max: 15 },
  close_rate: { label: 'Close Rate', max: 10 },
  availability: { label: 'Disponibilità', max: 10 },
  weekend: { label: 'Weekend', max: 5 },
  roleplay: { label: 'Roleplay', max: 20 },
  audio: { label: 'Audio', max: 5 },
}

export default function CandidateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [candidate, setCandidate] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [inviteLoading, setInviteLoading] = useState(false)
  const [inviteSent, setInviteSent] = useState(false)

  // Notes
  const [notes, setNotes] = useState('')
  const [notesSaving, setNotesSaving] = useState(false)
  const [notesSaved, setNotesSaved] = useState(false)

  // Rejection
  const [rejectionReason, setRejectionReason] = useState('')

  // Interviews
  const [interviews, setInterviews] = useState<any[]>([])

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  // Confirm dialog
  const [confirmDialog, setConfirmDialog] = useState<{ title: string; message: string; onConfirm: () => void } | null>(null)

  // Status dropdown
  const [showStatusDropdown, setShowStatusDropdown] = useState(false)

  // Edit mode
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState<Record<string, any>>({})
  const [editSaving, setEditSaving] = useState(false)

  // Outcome modal
  const [showOutcomeModal, setShowOutcomeModal] = useState(false)
  const [outcomeData, setOutcomeData] = useState({
    interview_id: '',
    outcome: '' as '' | 'pass' | 'fail' | 'follow_up',
    admin_notes: '',
    status: 'completed',
  })

  function showToast(message: string, type: 'success' | 'error' = 'success') {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const supabase = createClient()

  useEffect(() => {
    fetchCandidate()
    fetchInterviews()
  }, [id])

  async function fetchCandidate() {
    try {
      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      if (data) {
        setCandidate(data)
        setNotes(data.notes || '')
        setRejectionReason(data.ko_reason || '')
      }
    } catch (error) {
      console.error('Error fetching candidate:', error)
      notFound()
    } finally {
      setLoading(false)
    }
  }

  async function fetchInterviews() {
    const { data, error } = await supabase
      .from('interviews')
      .select('*')
      .eq('candidate_id', id)
      .order('created_at', { ascending: false })

    if (!error && data) setInterviews(data)
  }

  async function updateStatus(newStatus: string) {
    try {
      const { error } = await supabase
        .from('candidates')
        .update({ status: newStatus })
        .eq('id', id)

      if (error) throw error
      setCandidate({ ...candidate, status: newStatus })
      showToast(`Status aggiornato: ${STATUS_LABELS[newStatus] || newStatus}`)
    } catch (error) {
      console.error('Error updating status:', error)
      showToast("Errore nell'aggiornamento dello stato", 'error')
    }
  }

  async function saveNotes() {
    setNotesSaving(true)
    try {
      const { error } = await supabase
        .from('candidates')
        .update({ notes })
        .eq('id', id)

      if (error) throw error
      setCandidate({ ...candidate, notes })
      setNotesSaved(true)
      setTimeout(() => setNotesSaved(false), 2000)
    } catch (error) {
      console.error('Error saving notes:', error)
      alert('Errore nel salvataggio delle note')
    } finally {
      setNotesSaving(false)
    }
  }

  function handleReject() {
    setConfirmDialog({
      title: 'Conferma Rifiuto',
      message: `Sei sicuro di voler rifiutare ${candidate?.first_name} ${candidate?.last_name}? Questa azione è difficile da annullare.`,
      onConfirm: rejectWithReason,
    })
  }

  async function rejectWithReason() {
    try {
      const updateData: any = { status: 'rejected' }
      if (rejectionReason.trim()) {
        updateData.ko_reason = rejectionReason
      }

      const { error } = await supabase
        .from('candidates')
        .update(updateData)
        .eq('id', id)

      if (error) throw error
      setCandidate({ ...candidate, ...updateData })
      setConfirmDialog(null)
      showToast('Candidato rifiutato')
    } catch (error) {
      console.error('Error rejecting candidate:', error)
      showToast("Errore nell'aggiornamento", 'error')
    }
  }

  function handleHire() {
    setConfirmDialog({
      title: 'Conferma Assunzione',
      message: `Confermi di voler segnare ${candidate?.first_name} ${candidate?.last_name} come assunto?`,
      onConfirm: async () => {
        await updateStatus('hired')
        // Invia evento CompleteRegistration a Facebook CAPI
        fetch('/api/select-candidate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ candidate_id: id }),
        }).catch((e) => console.error('[handleHire] select-candidate error:', e))
        setConfirmDialog(null)
      },
    })
  }

  async function recordOutcome() {
    if (!outcomeData.outcome) return
    try {
      const { error } = await supabase
        .from('interviews')
        .update({
          status: outcomeData.status,
          outcome: outcomeData.outcome,
          admin_notes: outcomeData.admin_notes || null,
        })
        .eq('id', outcomeData.interview_id)

      if (error) throw error

      setShowOutcomeModal(false)
      fetchInterviews()
      showToast('Esito colloquio salvato')

      // Auto-advance candidate status based on outcome
      if (outcomeData.outcome === 'pass') {
        updateStatus('offer_sent')
      } else if (outcomeData.outcome === 'fail') {
        updateStatus('rejected')
      }
    } catch (error) {
      console.error('Error recording outcome:', error)
      showToast("Errore nel salvataggio dell'esito", 'error')
    }
  }

  async function sendInvite(channels: string[]) {
    setInviteLoading(true)
    try {
      const res = await fetch('/api/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidate_id: id, channels }),
      })
      const data = await res.json()
      if (res.ok) {
        setInviteSent(true)
        setCandidate({ ...candidate, status: 'invited' })
        fetchInterviews()
        // Mostra feedback dettagliato per canale
        const msgs: string[] = []
        if (data.results?.email) {
          msgs.push(data.results.email.success ? 'Email inviata' : 'Email: ' + data.results.email.detail)
        }
        if (data.results?.sms) {
          msgs.push(data.results.sms.success ? 'SMS inviato' : 'SMS: ' + data.results.sms.detail)
        }
        showToast(msgs.length > 0 ? msgs.join(' | ') : 'Invito inviato!',
          data.results?.email?.success === false || data.results?.sms?.success === false ? 'error' : 'success')
      } else {
        showToast("Errore nell'invio: " + (data.error || 'Sconosciuto'), 'error')
      }
    } catch (err) {
      console.error(err)
      showToast("Errore di rete nell'invio dell'invito. Riprova.", 'error')
    } finally {
      setInviteLoading(false)
    }
  }

  function startEditing() {
    setEditData({
      first_name: candidate.first_name,
      last_name: candidate.last_name,
      email: candidate.email,
      whatsapp: candidate.whatsapp,
      phone_secondary: candidate.phone_secondary || '',
      city: candidate.city || '',
      country: candidate.country || '',
      age_range: candidate.age_range || '',
      nationality: candidate.nationality || '',
      native_language: candidate.native_language || '',
      italian_level: candidate.italian_level || '',
      bio_short: candidate.bio_short || '',
      hours_per_day: candidate.hours_per_day || 0,
      days_per_week: candidate.days_per_week || 0,
      time_slots: candidate.time_slots || '',
      start_date: candidate.start_date || '',
      sales_years: candidate.sales_years || 0,
      close_rate_range: candidate.close_rate_range || '',
      inbound_outbound: candidate.inbound_outbound || '',
      sectors: candidate.sectors || '',
      motivation: candidate.motivation || '',
    })
    setIsEditing(true)
  }

  function cancelEditing() {
    setIsEditing(false)
    setEditData({})
  }

  async function saveEditing() {
    setEditSaving(true)
    try {
      const { error } = await supabase
        .from('candidates')
        .update(editData)
        .eq('id', id)

      if (error) throw error
      setCandidate({ ...candidate, ...editData })
      setIsEditing(false)
      setEditData({})
      showToast('Dati candidato aggiornati')
    } catch (error) {
      console.error('Error saving candidate data:', error)
      showToast('Errore nel salvataggio', 'error')
    } finally {
      setEditSaving(false)
    }
  }

  function editField(key: string, value: any) {
    setEditData(prev => ({ ...prev, [key]: value }))
  }

  if (loading) {
    return <div className="p-12 text-center text-text-muted">Caricamento dettagli candidato...</div>
  }

  if (!candidate) return notFound()

  const whatsappLink = candidate.whatsapp ? `https://wa.me/${candidate.whatsapp.replace(/[^0-9]/g, '')}` : null

  function getInterviewDate(interview: any): string {
    const dateStr = interview.scheduled_start || interview.scheduled_at
    if (!dateStr) return 'Data non definita'
    return format(new Date(dateStr), 'dd MMM yyyy, HH:mm')
  }

  return (
    <div className="space-y-6 relative pb-24">
      <Link href="/admin" className="inline-flex items-center text-sm font-semibold text-text-muted hover:text-text-main transition-colors mb-4">
        <ChevronLeft className="w-4 h-4 mr-1" /> Torna alla lista
      </Link>

      <div className="flex flex-col lg:flex-row gap-6">

        {/* Main Profile Info */}
        <div className="flex-1 space-y-6">

          {/* Header Card */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 flex items-start gap-3">
              {!isEditing && (
                <button
                  onClick={startEditing}
                  className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-500 hover:text-indigo-600 transition-colors"
                  title="Modifica dati"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              )}
              <div className="text-center">
                <div className="text-3xl font-black text-primary-main">{candidate.score_total || 0}</div>
                <div className="text-xs uppercase font-bold text-text-muted">Score</div>
              </div>
            </div>

            {isEditing ? (
              <>
                <div className="flex items-center gap-4 mb-2">
                  {candidate.photo_url ? (
                    <img src={candidate.photo_url} alt="Foto candidato" className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-200 shadow-sm shrink-0" />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-gray-100 border-2 border-gray-200 flex items-center justify-center shrink-0">
                      <User className="w-7 h-7 text-gray-400" />
                    </div>
                  )}
                  <div className="flex flex-wrap items-center gap-3">
                    <input value={editData.first_name} onChange={e => editField('first_name', e.target.value)} className="text-2xl font-black text-text-main border border-gray-200 rounded-xl px-3 py-1 w-40 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    <input value={editData.last_name} onChange={e => editField('last_name', e.target.value)} className="text-2xl font-black text-text-main border border-gray-200 rounded-xl px-3 py-1 w-40 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${STATUS_COLORS[candidate.status] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                      {STATUS_LABELS[candidate.status] || candidate.status}
                    </span>
                  </div>
                </div>
                <p className="text-text-muted font-medium mb-6">Inviato il {format(new Date(candidate.created_at), 'dd MMM yyyy, HH:mm')}</p>

                {/* Contatti editabili */}
                <div className="space-y-3 mb-8 border-b border-gray-100 pb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-text-muted mb-1 block">Email</label>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                        <input value={editData.email} onChange={e => editField('email', e.target.value)} className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-text-muted mb-1 block">WhatsApp / Telefono</label>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-green-500 shrink-0" />
                        <input value={editData.whatsapp} onChange={e => editField('whatsapp', e.target.value)} className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-text-muted mb-1 block">Secondo Numero (opzionale)</label>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-orange-500 shrink-0" />
                        <input value={editData.phone_secondary} onChange={e => editField('phone_secondary', e.target.value)} placeholder="+39 ..." className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dati Anagrafici editabili */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  <div>
                    <label className="text-xs text-text-muted mb-1 block">Città</label>
                    <input value={editData.city} onChange={e => editField('city', e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="text-xs text-text-muted mb-1 block">Nazione</label>
                    <input value={editData.country} onChange={e => editField('country', e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="text-xs text-text-muted mb-1 block">Età</label>
                    <input value={editData.age_range} onChange={e => editField('age_range', e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="text-xs text-text-muted mb-1 block">Nazionalità</label>
                    <input value={editData.nationality} onChange={e => editField('nationality', e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                </div>

                {/* Save/Cancel bar */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <button
                    onClick={saveEditing}
                    disabled={editSaving}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors disabled:opacity-50 text-sm"
                  >
                    {editSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {editSaving ? 'Salvataggio...' : 'Salva Modifiche'}
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Annulla
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-4 mb-2">
                  {candidate.photo_url ? (
                    <img src={candidate.photo_url} alt="Foto candidato" className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-200 shadow-sm shrink-0" />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-gray-100 border-2 border-gray-200 flex items-center justify-center shrink-0">
                      <User className="w-7 h-7 text-gray-400" />
                    </div>
                  )}
                  <h1 className="text-3xl font-black text-text-main">{candidate.first_name} {candidate.last_name}</h1>
                  <div className="relative">
                    <button
                      onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                      className={`px-3 py-1 rounded-full text-xs font-bold border cursor-pointer hover:opacity-80 transition-opacity ${STATUS_COLORS[candidate.status] || 'bg-gray-100 text-gray-600 border-gray-200'}`}
                    >
                      {STATUS_LABELS[candidate.status] || candidate.status} ▾
                    </button>
                    {showStatusDropdown && (
                      <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-30 py-1 min-w-[160px]">
                        {Object.entries(STATUS_LABELS).map(([key, label]) => (
                          <button
                            key={key}
                            onClick={() => {
                              if (key === 'rejected') { handleReject(); }
                              else if (key === 'hired') { handleHire(); }
                              else { updateStatus(key); }
                              setShowStatusDropdown(false)
                            }}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center gap-2 ${candidate.status === key ? 'font-bold' : ''}`}
                          >
                            <span className={`w-2 h-2 rounded-full ${STATUS_COLORS[key]?.split(' ')[0] || 'bg-gray-300'}`} />
                            {label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-text-muted font-medium mb-6">Inviato il {format(new Date(candidate.created_at), 'dd MMM yyyy, HH:mm')}</p>

                {/* Contatti Rapidi */}
                <div className="flex flex-wrap gap-3 mb-8 border-b border-gray-100 pb-8">
                  <a href={`mailto:${candidate.email}`} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-sm font-semibold hover:bg-blue-100 transition-colors">
                    <Mail className="w-4 h-4" /> {candidate.email}
                  </a>
                  <a href={`tel:${candidate.whatsapp}`} className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-xl text-sm font-semibold hover:bg-green-100 transition-colors">
                    <Phone className="w-4 h-4" /> {candidate.whatsapp}
                  </a>
                  {whatsappLink && (
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-semibold hover:bg-emerald-100 transition-colors">
                      <MessageCircle className="w-4 h-4" /> WhatsApp
                    </a>
                  )}
                  {candidate.phone_secondary && (
                    <a href={`tel:${candidate.phone_secondary}`} className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-700 rounded-xl text-sm font-semibold hover:bg-orange-100 transition-colors">
                      <Phone className="w-4 h-4" /> {candidate.phone_secondary}
                    </a>
                  )}
                </div>

                {/* Dati Anagrafici Completi */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <div className="text-xs text-text-muted mb-1">Città / Nazione</div>
                    <div className="font-semibold text-sm">{candidate.city}, {candidate.country}</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <div className="text-xs text-text-muted mb-1">Età</div>
                    <div className="font-semibold text-sm">{candidate.age_range}</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <div className="text-xs text-text-muted mb-1">Nazionalità</div>
                    <div className="font-semibold text-sm">{candidate.nationality}</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <div className="text-xs text-text-muted mb-1">Lingua Madre</div>
                    <div className="font-semibold text-sm">{candidate.native_language}</div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Pre-Qualifica */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary-main" /> Pre-Qualifica
            </h3>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                { key: 'pq_hours', label: 'Garantisce 4h/giorno' },
                { key: 'pq_days', label: 'Lavora 3+ giorni/settimana' },
                { key: 'pq_punctuality', label: 'Puntualità confermata' },
                { key: 'pq_italian', label: 'Italiano fluido' },
              ].map(pq => (
                <div key={pq.key} className={`flex items-center gap-3 p-3 rounded-xl border ${candidate[pq.key] ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  {candidate[pq.key] ? <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" /> : <XCircle className="w-5 h-5 text-red-500 shrink-0" />}
                  <span className="text-sm font-medium">{pq.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Score Breakdown */}
          {candidate.score_breakdown && Object.keys(candidate.score_breakdown).length > 0 && (
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary-main" /> Score Breakdown
              </h3>
              <div className="space-y-3">
                {Object.entries(SCORE_LABELS).map(([key, { label, max }]) => {
                  const value = (candidate.score_breakdown as Record<string, number>)?.[key] || 0
                  const pct = max > 0 ? (value / max) * 100 : 0
                  return (
                    <div key={key}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="font-medium text-text-main">{label}</span>
                        <span className="font-bold text-text-main">{value}/{max}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${pct >= 80 ? 'bg-green-500' : pct >= 50 ? 'bg-amber-500' : pct > 0 ? 'bg-red-400' : 'bg-gray-200'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Audio del candidato */}
          {candidate.audio_url && (
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 shadow-sm flex-shrink-0">
                  <Headphones className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-text-main">Memo Vocale del Candidato</h3>
                  <p className="text-sm text-text-muted">Ascolta la presentazione per valutare dizione e tono.</p>
                </div>
              </div>
              <audio controls className="w-full h-12 outline-none rounded-xl">
                <source src={candidate.audio_url} type="audio/mpeg" />
                Il tuo browser non supporta l&apos;elemento audio.
              </audio>
            </div>
          )}

          {/* Comunicazione */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary-main" /> Comunicazione & Profilo
            </h3>
            {isEditing ? (
              <div className="space-y-3">
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-text-muted mb-1 block">Livello Italiano</label>
                    <select value={editData.italian_level} onChange={e => editField('italian_level', e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      <option value="high">Alto</option>
                      <option value="medium">Medio</option>
                      <option value="low">Basso</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-text-muted mb-1 block">Lingua Madre</label>
                    <input value={editData.native_language} onChange={e => editField('native_language', e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-text-muted mb-1 block">Breve Bio</label>
                  <textarea value={editData.bio_short} onChange={e => editField('bio_short', e.target.value)} rows={3} className="w-full border border-gray-200 rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="text-xs text-text-muted mb-1">Livello Italiano</div>
                    <div className="font-semibold capitalize">{candidate.italian_level} {candidate.strong_accent && <span className="text-amber-600 text-xs ml-1">(Forte Accento)</span>}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="text-xs text-text-muted mb-1">Lingua Madre</div>
                    <div className="font-semibold">{candidate.native_language}</div>
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-text-muted uppercase mb-1">Breve Bio</div>
                  <p className="text-sm leading-relaxed bg-gray-50 p-4 rounded-xl">{candidate.bio_short}</p>
                </div>
              </>
            )}
          </div>

          {/* Esperienza */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary-main" /> Esperienza & Vendita
            </h3>
            {isEditing ? (
              <div className="space-y-3">
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-text-muted mb-1 block">Anni nelle vendite</label>
                    <input type="number" value={editData.sales_years} onChange={e => editField('sales_years', parseInt(e.target.value) || 0)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="text-xs text-text-muted mb-1 block">Close Rate Massimo</label>
                    <select value={editData.close_rate_range} onChange={e => editField('close_rate_range', e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      <option value="30%+">30%+</option>
                      <option value="20-30%">20-30%</option>
                      <option value="10-20%">10-20%</option>
                      <option value="<10%">&lt;10%</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-text-muted mb-1 block">Tipo Chiamate</label>
                    <select value={editData.inbound_outbound} onChange={e => editField('inbound_outbound', e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      <option value="inbound">Inbound</option>
                      <option value="outbound">Outbound</option>
                      <option value="entrambi">Entrambi</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-text-muted mb-1 block">Settori</label>
                    <input value={editData.sectors} onChange={e => editField('sectors', e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-text-muted mb-1 block">Motivazione</label>
                  <textarea value={editData.motivation} onChange={e => editField('motivation', e.target.value)} rows={3} className="w-full border border-gray-200 rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="text-xs text-text-muted mb-1">Anni nelle vendite</div>
                    <div className="font-semibold">{candidate.sales_years}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="text-xs text-text-muted mb-1">Close Rate Massimo</div>
                    <div className="font-semibold">{candidate.close_rate_range}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="text-xs text-text-muted mb-1">Tipo Chiamate</div>
                    <div className="font-semibold capitalize">{candidate.inbound_outbound}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="text-xs text-text-muted mb-1">Settori</div>
                    <div className="font-semibold">{candidate.sectors || 'Nessuno specificato'}</div>
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-text-muted uppercase mb-1">Perché vuoi questo ruolo?</div>
                  <p className="text-sm leading-relaxed bg-gray-50 p-4 rounded-xl">{candidate.motivation}</p>
                </div>
              </>
            )}
          </div>

          {/* Disponibilità */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary-main" /> Disponibilità
            </h3>
            {isEditing ? (
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-text-muted mb-1 block">Ore al giorno</label>
                  <input type="number" value={editData.hours_per_day} onChange={e => editField('hours_per_day', parseInt(e.target.value) || 0)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="text-xs text-text-muted mb-1 block">Giorni a settimana</label>
                  <input type="number" value={editData.days_per_week} onChange={e => editField('days_per_week', parseInt(e.target.value) || 0)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="text-xs text-text-muted mb-1 block">Fasce orarie ideali</label>
                  <input value={editData.time_slots} onChange={e => editField('time_slots', e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="text-xs text-text-muted mb-1 block">Da quando può iniziare</label>
                  <input value={editData.start_date} onChange={e => editField('start_date', e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="text-xs text-text-muted mb-1">Ore al Giorno / Settimana</div>
                    <div className="font-semibold">{candidate.hours_per_day}h / {candidate.days_per_week}gg</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="text-xs text-text-muted mb-1">Da quando può iniziare</div>
                    <div className="font-semibold">{candidate.start_date}</div>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl mb-4">
                  <div className="text-xs text-text-muted mb-1">Fasce Orarie Ideali</div>
                  <div className="font-semibold">{candidate.time_slots}</div>
                </div>
                <div className="flex gap-2 flex-wrap text-xs">
                  {candidate.weekend_sat && <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">Disponibile Sabato</span>}
                  {candidate.weekend_sun && <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">Disponibile Domenica</span>}
                  {candidate.holidays && <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">Disponibile Festivi</span>}
                </div>
              </>
            )}
          </div>

          {/* Prove Pratiche (Roleplay) */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
              <Play className="w-5 h-5 text-primary-main" /> Prove Pratiche (Roleplay)
            </h3>
            <div className="space-y-6">
              <div>
                <div className="text-sm font-semibold text-text-main mb-2">1. Come gestiresti l&apos;obiezione &quot;Ci Devo Pensare&quot;?</div>
                <div className="bg-blue-50/50 border border-blue-100 p-5 rounded-2xl text-sm leading-relaxed text-slate-700 italic">
                  &quot;{candidate.roleplay_think_about_it}&quot;
                </div>
                <div className="text-xs text-text-muted mt-1">{candidate.roleplay_think_about_it?.length || 0} caratteri</div>
              </div>
              <div>
                <div className="text-sm font-semibold text-text-main mb-2">2. Upsell: Da 1 scatola a Kit 3 scatole</div>
                <div className="bg-blue-50/50 border border-blue-100 p-5 rounded-2xl text-sm leading-relaxed text-slate-700 italic">
                  &quot;{candidate.roleplay_bundle3}&quot;
                </div>
                <div className="text-xs text-text-muted mt-1">{candidate.roleplay_bundle3?.length || 0} caratteri</div>
              </div>
            </div>
          </div>

          {/* Storico Colloqui */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
              <Video className="w-5 h-5 text-primary-main" /> Storico Colloqui
            </h3>
            {interviews.length === 0 ? (
              <p className="text-text-muted text-sm">Nessun colloquio registrato.</p>
            ) : (
              <div className="space-y-3">
                {interviews.map(interview => (
                  <div key={interview.id} className="border border-gray-100 rounded-xl p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="font-semibold text-sm">
                          {getInterviewDate(interview)}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-1.5">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            interview.status === 'confirmed' ? 'bg-purple-100 text-purple-700' :
                            interview.status === 'completed' ? 'bg-green-100 text-green-700' :
                            interview.status === 'no_show' ? 'bg-red-100 text-red-700' :
                            interview.status === 'pending' ? 'bg-gray-100 text-gray-600' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {INTERVIEW_STATUS_LABELS[interview.status] || interview.status}
                          </span>
                          {interview.outcome && (
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                              interview.outcome === 'pass' ? 'bg-green-100 text-green-700' :
                              interview.outcome === 'fail' ? 'bg-red-100 text-red-700' :
                              'bg-amber-100 text-amber-700'
                            }`}>
                              {interview.outcome === 'pass' ? 'Superato' : interview.outcome === 'fail' ? 'Non Superato' : 'Follow-up'}
                            </span>
                          )}
                          {interview.channel && (
                            <span className="text-xs text-text-muted">{interview.channel}</span>
                          )}
                        </div>
                        {interview.admin_notes && (
                          <p className="text-xs text-text-muted mt-2 bg-gray-50 p-2 rounded-lg italic">{interview.admin_notes}</p>
                        )}
                      </div>
                      {['confirmed', 'scheduled'].includes(interview.status) && !interview.outcome && (
                        <button
                          onClick={() => {
                            setOutcomeData({
                              interview_id: interview.id,
                              outcome: '',
                              admin_notes: '',
                              status: 'completed',
                            })
                            setShowOutcomeModal(true)
                          }}
                          className="px-3 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-semibold hover:bg-indigo-100 transition-colors shrink-0"
                        >
                          Registra Esito
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Consensi */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold border-b border-gray-100 pb-2 mb-4">Consensi</h3>
            <div className="grid md:grid-cols-3 gap-3">
              <div className={`flex items-center gap-2 p-3 rounded-xl border text-sm font-medium ${candidate.consent_privacy ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
                {candidate.consent_privacy ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />} Privacy
              </div>
              <div className={`flex items-center gap-2 p-3 rounded-xl border text-sm font-medium ${candidate.consent_truth ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
                {candidate.consent_truth ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />} Veridicità
              </div>
              <div className={`flex items-center gap-2 p-3 rounded-xl border text-sm font-medium ${candidate.consent_whatsapp ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
                {candidate.consent_whatsapp ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />} WhatsApp
              </div>
            </div>
          </div>

        </div>

        {/* Action Sidebar */}
        <div className="lg:w-80 flex-shrink-0">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 sticky top-24 space-y-6">
            <h3 className="font-bold text-lg">Azioni Rapide</h3>

            <div className="space-y-3">
              <button
                onClick={() => updateStatus('qualified')}
                className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${candidate.status === 'qualified' ? 'bg-amber-50 border-amber-200 text-amber-700 shadow-sm' : 'border-gray-200 hover:bg-gray-50'
                  }`}
              >
                <span className="font-semibold">Qualifica Profilo</span>
                <CheckCircle2 className="w-5 h-5 opacity-50" />
              </button>

              <button
                onClick={handleHire}
                className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${candidate.status === 'hired' ? 'bg-green-50 border-green-200 text-green-700 shadow-sm' : 'border-gray-200 hover:bg-gray-50'
                  }`}
              >
                <span className="font-semibold">Segna come Assunto</span>
                <CheckCircle2 className="w-5 h-5 opacity-50" />
              </button>

              <div className="pt-4 mt-4 border-t border-gray-100 space-y-2">
                <input
                  type="text"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Motivo del rifiuto (opzionale)..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                />
                <button
                  onClick={handleReject}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${candidate.status === 'rejected' ? 'bg-red-50 border-red-200 text-red-700 shadow-sm' : 'border-gray-200 text-red-600 hover:bg-red-50'
                    }`}
                >
                  <span className="font-semibold">Rifiuta Candidato</span>
                  <XCircle className="w-5 h-5 opacity-50" />
                </button>
              </div>
            </div>

            {/* Invita a Colloquio */}
            <div className="pt-6 border-t border-gray-100">
              <h4 className="font-bold text-sm mb-3 text-text-main flex items-center gap-2">
                <Send className="w-4 h-4" /> Invia Link Colloquio
              </h4>
              {inviteSent ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-700 font-medium text-center">
                  Link inviato con successo!
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={() => sendInvite(['email', 'sms'])}
                    disabled={inviteLoading}
                    className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors disabled:opacity-50 text-sm"
                  >
                    <Send className="w-4 h-4" /> {inviteLoading ? 'Invio in corso...' : 'Email + SMS'}
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => sendInvite(['email'])}
                      disabled={inviteLoading}
                      className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-semibold disabled:opacity-50"
                    >
                      <Mail className="w-3.5 h-3.5" /> Solo Email
                    </button>
                    <button
                      onClick={() => sendInvite(['sms'])}
                      disabled={inviteLoading}
                      className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-semibold disabled:opacity-50"
                    >
                      <Phone className="w-3.5 h-3.5" /> Solo SMS
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Note Interne */}
            <div className="pt-6 border-t border-gray-100">
              <h4 className="font-bold text-sm mb-3 text-text-main flex items-center gap-2">
                <FileText className="w-4 h-4" /> Note Interne
              </h4>
              <textarea
                value={notes}
                onChange={(e) => { setNotes(e.target.value); setNotesSaved(false) }}
                placeholder="Aggiungi note su questo candidato..."
                rows={4}
                className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-main resize-none"
              />
              <button
                onClick={saveNotes}
                disabled={notesSaving}
                className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
              >
                {notesSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : notesSaved ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <Save className="w-4 h-4" />}
                {notesSaving ? 'Salvataggio...' : notesSaved ? 'Salvato!' : 'Salva Note'}
              </button>
            </div>

            {candidate.ko_reason && candidate.status !== 'rejected' && (
              <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                <div className="text-xs font-bold text-red-600 uppercase mb-1">Motivo KO Automatico</div>
                <div className="text-sm font-medium text-red-800">{candidate.ko_reason}</div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Outcome Recording Modal */}
      {showOutcomeModal && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Registra Esito Colloquio</h3>
              <button onClick={() => setShowOutcomeModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div>
              <label className="text-sm font-semibold text-text-muted block mb-2">Esito</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'pass' as const, label: 'Superato' },
                  { value: 'fail' as const, label: 'Non Superato' },
                  { value: 'follow_up' as const, label: 'Follow-up' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setOutcomeData(prev => ({ ...prev, outcome: opt.value }))}
                    className={`p-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                      outcomeData.outcome === opt.value
                        ? OUTCOME_STYLES[opt.value]
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-text-muted block mb-2">Stato colloquio</label>
              <select
                value={outcomeData.status}
                onChange={(e) => setOutcomeData(prev => ({ ...prev, status: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-main"
              >
                <option value="completed">Completato</option>
                <option value="no_show">No Show</option>
                <option value="rescheduled">Da Riprogrammare</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-text-muted block mb-2">Note Colloquio</label>
              <textarea
                value={outcomeData.admin_notes}
                onChange={(e) => setOutcomeData(prev => ({ ...prev, admin_notes: e.target.value }))}
                placeholder="Impressioni, punti di forza, criticita..."
                rows={3}
                className="w-full border border-gray-200 rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-main"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowOutcomeModal(false)}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                Annulla
              </button>
              <button
                onClick={recordOutcome}
                disabled={!outcomeData.outcome}
                className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                Salva Esito
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Dialog */}
      {confirmDialog && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="text-lg font-bold">{confirmDialog.title}</h3>
            </div>
            <p className="text-sm text-text-muted">{confirmDialog.message}</p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setConfirmDialog(null)}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                Annulla
              </button>
              <button
                onClick={confirmDialog.onConfirm}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-colors"
              >
                Conferma
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg font-semibold text-sm flex items-center gap-2 animate-in slide-in-from-bottom-2 ${
          toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
          {toast.message}
        </div>
      )}
    </div>
  )
}
