'use client'

import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { format } from 'date-fns'
import { ChevronLeft, CheckCircle2, XCircle, Calendar, Play } from 'lucide-react'
import { notFound } from 'next/navigation'

export default function CandidateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [candidate, setCandidate] = useState<any>(null)
  const [loading, setLoading] = useState(true)
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

  if (loading) {
    return <div className="p-12 text-center text-text-muted">Caricamento dettagli candidato...</div>
  }

  if (!candidate) return notFound()

  return (
    <div className="space-y-6 relative pb-24">
      <Link href="/admin" className="inline-flex items-center text-sm font-semibold text-text-muted hover:text-text-main transition-colors mb-4">
        <ChevronLeft className="w-4 h-4 mr-1" /> Torna alla lista
      </Link>

      <div className="flex flex-col lg:flex-row gap-6">

        {/* Main Profile Info */}
        <div className="flex-1 space-y-6">
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <div className="text-center">
                <div className="text-3xl font-black text-primary-main">{candidate.score_total || 0}</div>
                <div className="text-xs uppercase font-bold text-text-muted">Score</div>
              </div>
            </div>

            <h1 className="text-3xl font-black text-text-main mb-2">{candidate.first_name} {candidate.last_name}</h1>
            <p className="text-text-muted font-medium mb-6">Inviato il {format(new Date(candidate.created_at), 'dd MMM yyyy, HH:mm')}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 border-b border-gray-100 pb-8">
              <div>
                <div className="text-xs text-text-muted mb-1">Email</div>
                <div className="font-semibold">{candidate.email}</div>
              </div>
              <div>
                <div className="text-xs text-text-muted mb-1">WhatsApp</div>
                <div className="font-semibold">{candidate.whatsapp}</div>
              </div>
              <div>
                <div className="text-xs text-text-muted mb-1">Città / Nazione</div>
                <div className="font-semibold">{candidate.city}, {candidate.country}</div>
              </div>
              <div>
                <div className="text-xs text-text-muted mb-1">Età</div>
                <div className="font-semibold">{candidate.age_range}</div>
              </div>
            </div>

            {candidate.audio_url && (
              <div className="bg-primary-light/30 border border-primary-light rounded-2xl p-6 mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary-main shadow-sm flex-shrink-0">
                    <Play className="w-5 h-5 ml-1" />
                  </div>
                  <div>
                    <h3 className="font-bold text-text-main">Memo Vocale del candidato</h3>
                    <p className="text-sm text-text-muted">Ascolta la presentazione per valutare dizione e tono.</p>
                  </div>
                </div>
                <audio controls className="w-full h-10 outline-none">
                  <source src={candidate.audio_url} type="audio/mpeg" />
                  Il tuo browser non supporta l'elemento audio.
                </audio>
              </div>
            )}

            <div className="space-y-8">
              <section>
                <h3 className="text-lg font-bold border-b border-gray-100 pb-2 mb-4">Esperienza & Profilo</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="text-xs text-text-muted mb-1">Anni nelle vendite</div>
                    <div className="font-semibold">{candidate.sales_years}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="text-xs text-text-muted mb-1">Close Rate Max</div>
                    <div className="font-semibold">{candidate.close_rate_range}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="text-xs text-text-muted mb-1">Tipo chiamate</div>
                    <div className="font-semibold capitalize">{candidate.inbound_outbound}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="text-xs text-text-muted mb-1">Livello Italiano</div>
                    <div className="font-semibold capitalize">
                      {candidate.italian_level} {candidate.strong_accent && "(Forte Accento)"}
                    </div>
                  </div>
                </div>
                <div className="mt-4 space-y-4">
                  <div>
                    <div className="text-xs font-semibold text-text-muted uppercase mb-1">Perché vuoi questo ruolo?</div>
                    <p className="text-sm leading-relaxed bg-gray-50 p-4 rounded-xl">{candidate.motivation}</p>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-text-muted uppercase mb-1">Breve Bio</div>
                    <p className="text-sm leading-relaxed bg-gray-50 p-4 rounded-xl">{candidate.bio_short}</p>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-bold border-b border-gray-100 pb-2 mb-4">Disponibilità</h3>
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
                  <div className="text-xs text-text-muted mb-1">Fasce orarie ideali</div>
                  <div className="font-semibold">{candidate.time_slots}</div>
                </div>
                <div className="flex gap-2 flex-wrap text-xs">
                  {candidate.weekend_sat && <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">Disponibile Sabato</span>}
                  {candidate.weekend_sun && <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">Disponibile Domenica</span>}
                  {candidate.holidays && <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">Disponibile Festivi</span>}
                </div>
              </section>

              <section>
                <h3 className="text-lg font-bold border-b border-gray-100 pb-2 mb-4">Prove Pratiche (Roleplay)</h3>
                <div className="space-y-6">
                  <div>
                    <div className="text-sm font-semibold text-text-main mb-2">1. Come gestiresti l'obiezione "Ci Devo Pensare"?</div>
                    <div className="bg-blue-50/50 border border-blue-100 p-5 rounded-2xl text-sm leading-relaxed text-slate-700 italic">
                      "{candidate.roleplay_think_about_it}"
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-text-main mb-2">2. Upsell: Da 1 scatola a Kit 3 scatole</div>
                    <div className="bg-blue-50/50 border border-blue-100 p-5 rounded-2xl text-sm leading-relaxed text-slate-700 italic">
                      "{candidate.roleplay_bundle3}"
                    </div>
                  </div>
                </div>
              </section>
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
