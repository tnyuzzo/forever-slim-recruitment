'use client'

import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { format } from 'date-fns'
import { ChevronLeft, CheckCircle2, XCircle, Calendar, Play, Mail, Phone, MessageCircle, Send, Globe, User, Clock, Briefcase, Headphones, Shield } from 'lucide-react'
import { notFound } from 'next/navigation'

export default function CandidateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [candidate, setCandidate] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [inviteLoading, setInviteLoading] = useState(false)
  const [inviteSent, setInviteSent] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    fetchCandidate()
  }, [id])

  async function fetchCandidate() {
    try {
      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      if (data) setCandidate(data)
    } catch (error) {
      console.error('Error fetching candidate:', error)
      notFound()
    } finally {
      setLoading(false)
    }
  }

  async function updateStatus(newStatus: string) {
    try {
      const { error } = await supabase
        .from('candidates')
        .update({ status: newStatus })
        .eq('id', id)

      if (error) throw error
      setCandidate({ ...candidate, status: newStatus })
    } catch (error) {
      console.error('Error updating status:', error)
      alert("Errore nell'aggiornamento dello stato")
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
        updateStatus('interview_booked')
      } else {
        alert("Errore nell'invio: " + (data.error || 'Sconosciuto'))
      }
    } catch (err) {
      console.error(err)
      alert("Errore nell'invio dell'invito")
    } finally {
      setInviteLoading(false)
    }
  }

  if (loading) {
    return <div className="p-12 text-center text-text-muted">Caricamento dettagli candidato...</div>
  }

  if (!candidate) return notFound()

  const whatsappLink = candidate.whatsapp ? `https://wa.me/${candidate.whatsapp.replace(/[^0-9]/g, '')}` : null

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
            <div className="absolute top-0 right-0 p-4">
              <div className="text-center">
                <div className="text-3xl font-black text-primary-main">{candidate.score_total || 0}</div>
                <div className="text-xs uppercase font-bold text-text-muted">Score</div>
              </div>
            </div>

            <h1 className="text-3xl font-black text-text-main mb-2">{candidate.first_name} {candidate.last_name}</h1>
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
                Il tuo browser non supporta l'elemento audio.
              </audio>
            </div>
          )}

          {/* Comunicazione */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary-main" /> Comunicazione & Profilo
            </h3>
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
          </div>

          {/* Esperienza */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary-main" /> Esperienza & Vendita
            </h3>
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
          </div>

          {/* Disponibilità */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary-main" /> Disponibilità
            </h3>
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
          </div>

          {/* Prove Pratiche (Roleplay) */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
              <Play className="w-5 h-5 text-primary-main" /> Prove Pratiche (Roleplay)
            </h3>
            <div className="space-y-6">
              <div>
                <div className="text-sm font-semibold text-text-main mb-2">1. Come gestiresti l'obiezione "Ci Devo Pensare"?</div>
                <div className="bg-blue-50/50 border border-blue-100 p-5 rounded-2xl text-sm leading-relaxed text-slate-700 italic">
                  "{candidate.roleplay_think_about_it}"
                </div>
                <div className="text-xs text-text-muted mt-1">{candidate.roleplay_think_about_it?.length || 0} caratteri</div>
              </div>
              <div>
                <div className="text-sm font-semibold text-text-main mb-2">2. Upsell: Da 1 scatola a Kit 3 scatole</div>
                <div className="bg-blue-50/50 border border-blue-100 p-5 rounded-2xl text-sm leading-relaxed text-slate-700 italic">
                  "{candidate.roleplay_bundle3}"
                </div>
                <div className="text-xs text-text-muted mt-1">{candidate.roleplay_bundle3?.length || 0} caratteri</div>
              </div>
            </div>
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
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 sticky top-24">
            <h3 className="font-bold text-lg mb-6">Azioni Rapide</h3>

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
                onClick={() => updateStatus('interview_booked')}
                className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${candidate.status === 'interview_booked' ? 'bg-purple-50 border-purple-200 text-purple-700 shadow-sm' : 'border-gray-200 hover:bg-gray-50'
                  }`}
              >
                <span className="font-semibold">Prenota Colloquio</span>
                <Calendar className="w-5 h-5 opacity-50" />
              </button>

              <button
                onClick={() => updateStatus('hired')}
                className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${candidate.status === 'hired' ? 'bg-green-50 border-green-200 text-green-700 shadow-sm' : 'border-gray-200 hover:bg-gray-50'
                  }`}
              >
                <span className="font-semibold">Segna come Assunto</span>
                <CheckCircle2 className="w-5 h-5 opacity-50" />
              </button>

              <div className="pt-4 mt-4 border-t border-gray-100">
                <button
                  onClick={() => updateStatus('rejected')}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${candidate.status === 'rejected' ? 'bg-red-50 border-red-200 text-red-700 shadow-sm' : 'border-gray-200 text-red-600 hover:bg-red-50'
                    }`}
                >
                  <span className="font-semibold">Rifiuta Candidato</span>
                  <XCircle className="w-5 h-5 opacity-50" />
                </button>
              </div>
            </div>

            {/* Invita a Colloquio */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <h4 className="font-bold text-sm mb-3 text-text-main">📩 Invia Link Colloquio</h4>
              {inviteSent ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-700 font-medium text-center">
                  ✅ Link inviato con successo!
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

            {candidate.ko_reason && (
              <div className="mt-8 p-4 bg-red-50 rounded-xl border border-red-100">
                <div className="text-xs font-bold text-red-600 uppercase mb-1">Motivo KO Automatico</div>
                <div className="text-sm font-medium text-red-800">{candidate.ko_reason}</div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
