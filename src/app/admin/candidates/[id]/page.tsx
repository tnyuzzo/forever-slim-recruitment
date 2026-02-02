'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { Candidate, CandidateStatus } from '@/types/database'
import Button from '@/components/ui/Button'
import Textarea from '@/components/ui/Textarea'
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Clock,
  Calendar,
  Briefcase,
  Languages,
  Play,
  Pause,
  Download,
  CheckCircle,
  XCircle,
  CalendarPlus,
  Star,
} from 'lucide-react'

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
  interview_booked: 'Colloquio Prenotato',
  hired: 'Assunto',
  rejected: 'Rifiutato',
}

const priorityColors = {
  high: 'bg-pink-100 text-pink-700 border-pink-200',
  medium: 'bg-amber-100 text-amber-700 border-amber-200',
  low: 'bg-gray-100 text-gray-600 border-gray-200',
}

export default function CandidateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [candidate, setCandidate] = useState<Candidate | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [notes, setNotes] = useState('')
  const [isSavingNotes, setIsSavingNotes] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null)

  useEffect(() => {
    loadCandidate()
  }, [id])

  const loadCandidate = async () => {
    setIsLoading(true)
    const supabase = createClient()
    const { data, error } = await supabase
      .from('candidates')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) {
      console.error('Error loading candidate:', error)
      router.push('/admin')
      return
    }

    setCandidate(data)
    setNotes(data.notes || '')
    setIsLoading(false)
  }

  const updateStatus = async (newStatus: CandidateStatus) => {
    if (!candidate) return

    const supabase = createClient()
    const { error } = await supabase
      .from('candidates')
      .update({ status: newStatus })
      .eq('id', candidate.id)

    if (!error) {
      setCandidate({ ...candidate, status: newStatus })
    }
  }

  const saveNotes = async () => {
    if (!candidate) return

    setIsSavingNotes(true)
    const supabase = createClient()
    await supabase
      .from('candidates')
      .update({ notes })
      .eq('id', candidate.id)

    setIsSavingNotes(false)
  }

  const toggleAudio = () => {
    if (!audioRef) return
    if (isPlaying) {
      audioRef.pause()
    } else {
      audioRef.play()
    }
    setIsPlaying(!isPlaying)
  }

  if (isLoading || !candidate) {
    return (
      <div className="p-8 text-center text-gray-500">Caricamento...</div>
    )
  }

  const scoreBreakdown = candidate.score_breakdown as unknown as Record<string, number> | null

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {candidate.first_name} {candidate.last_name}
            </h1>
            <p className="text-gray-500 text-sm">
              Candidatura del {new Date(candidate.created_at).toLocaleDateString('it-IT')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${statusColors[candidate.status]}`}>
            {statusLabels[candidate.status]}
          </span>
          <span className={`px-4 py-2 rounded-full text-sm font-medium border ${priorityColors[candidate.priority]}`}>
            {candidate.priority === 'high' ? 'Alta Priorità' : candidate.priority === 'medium' ? 'Media Priorità' : 'Bassa Priorità'}
          </span>
        </div>
      </div>

      {/* Score Card */}
      <div className="bg-gradient-to-r from-[#D946A8] to-[#C026A0] rounded-2xl p-6 text-white mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm">Score Totale</p>
            <p className="text-5xl font-bold">{candidate.score_total}</p>
          </div>
          {scoreBreakdown && (
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-semibold">{scoreBreakdown.italian || 0}</p>
                <p className="text-xs text-white/70">Italiano</p>
              </div>
              <div>
                <p className="text-2xl font-semibold">{scoreBreakdown.experience || 0}</p>
                <p className="text-xs text-white/70">Esperienza</p>
              </div>
              <div>
                <p className="text-2xl font-semibold">{scoreBreakdown.roleplay || 0}</p>
                <p className="text-xs text-white/70">Roleplay</p>
              </div>
              <div>
                <p className="text-2xl font-semibold">{scoreBreakdown.availability || 0}</p>
                <p className="text-xs text-white/70">Disponibilità</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* KO Info */}
      {candidate.ko_reason && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <p className="text-red-800 font-medium">Motivo KO</p>
          <p className="text-red-700">{candidate.ko_reason}</p>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-[#D946A8]" />
              Dati Personali
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700">{candidate.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700">{candidate.whatsapp}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700">{candidate.city}, {candidate.country}</span>
              </div>
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700">{candidate.age_range} anni</span>
              </div>
            </div>
            {candidate.bio_short && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Bio</p>
                <p className="text-gray-700">{candidate.bio_short}</p>
              </div>
            )}
          </div>

          {/* Language & Communication */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Languages className="w-5 h-5 text-[#D946A8]" />
              Lingua & Comunicazione
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Nazionalità</p>
                <p className="text-gray-900">{candidate.nationality}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Lingua Madre</p>
                <p className="text-gray-900">{candidate.native_language}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Livello Italiano</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  candidate.italian_level === 'high' ? 'bg-green-100 text-green-700' :
                  candidate.italian_level === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {candidate.italian_level === 'high' ? 'Alto' : candidate.italian_level === 'medium' ? 'Medio' : 'Base'}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Accento Marcato</p>
                <p className="text-gray-900">{candidate.strong_accent ? 'Sì' : 'No'}</p>
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#D946A8]" />
              Disponibilità
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Ore/Giorno</p>
                <p className="text-2xl font-semibold text-gray-900">{candidate.hours_per_day}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Giorni/Settimana</p>
                <p className="text-2xl font-semibold text-gray-900">{candidate.days_per_week}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Fascia Oraria</p>
                <p className="text-gray-900">{candidate.time_slots}</p>
              </div>
            </div>
            <div className="mt-4 flex gap-4">
              {candidate.weekend_sat && (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">Sabato</span>
              )}
              {candidate.weekend_sun && (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">Domenica</span>
              )}
              {candidate.holidays && (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">Festivi</span>
              )}
            </div>
          </div>

          {/* Experience */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-[#D946A8]" />
              Esperienza
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Anni di Esperienza</p>
                <p className="text-gray-900">{candidate.sales_years} anni</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tipo</p>
                <p className="text-gray-900 capitalize">{candidate.inbound_outbound}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Close Rate</p>
                <p className="text-gray-900">{candidate.close_rate_range}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Settori</p>
                <p className="text-gray-900">{candidate.sectors || 'Non specificato'}</p>
              </div>
            </div>
            {candidate.motivation && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Motivazione</p>
                <p className="text-gray-700">{candidate.motivation}</p>
              </div>
            )}
          </div>

          {/* Roleplay Answers */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-[#D946A8]" />
              Prove Pratiche
            </h2>
            <div className="space-y-6">
              <div>
                <p className="text-sm text-gray-500 mb-2">Risposta a &quot;Ci devo pensare&quot;</p>
                <div className="bg-gray-50 rounded-lg p-4 text-gray-700 text-sm">
                  {candidate.roleplay_think_about_it || 'Non compilato'}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Proposta Kit 3 Mesi</p>
                <div className="bg-gray-50 rounded-lg p-4 text-gray-700 text-sm">
                  {candidate.roleplay_bundle3 || 'Non compilato'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Azioni</h2>
            <div className="space-y-3">
              {candidate.status === 'new' && (
                <Button
                  fullWidth
                  onClick={() => updateStatus('qualified')}
                  className="flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Qualifica
                </Button>
              )}
              {(candidate.status === 'new' || candidate.status === 'qualified') && (
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => updateStatus('interview_booked')}
                  className="flex items-center justify-center gap-2"
                >
                  <CalendarPlus className="w-4 h-4" />
                  Prenota Colloquio
                </Button>
              )}
              {candidate.status === 'interview_booked' && (
                <Button
                  fullWidth
                  onClick={() => updateStatus('hired')}
                  className="flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Segna come Assunto
                </Button>
              )}
              {candidate.status !== 'rejected' && (
                <Button
                  variant="ghost"
                  fullWidth
                  onClick={() => updateStatus('rejected')}
                  className="flex items-center justify-center gap-2 text-red-600 hover:bg-red-50"
                >
                  <XCircle className="w-4 h-4" />
                  Rifiuta
                </Button>
              )}
            </div>
          </div>

          {/* Audio */}
          {candidate.audio_url && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Audio</h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleAudio}
                  className="w-12 h-12 rounded-full bg-[#D946A8] text-white flex items-center justify-center hover:bg-[#C026A0] transition-colors"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </button>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Audio Presentazione</p>
                  <p className="text-xs text-gray-500">Clicca per ascoltare</p>
                </div>
                <a
                  href={candidate.audio_url}
                  download
                  className="p-2 text-gray-400 hover:text-[#D946A8]"
                >
                  <Download className="w-5 h-5" />
                </a>
              </div>
              <audio
                ref={(el) => setAudioRef(el)}
                src={candidate.audio_url}
                onEnded={() => setIsPlaying(false)}
                className="hidden"
              />
            </div>
          )}

          {/* Notes */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Note Admin</h2>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Aggiungi note private..."
              className="mb-3"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={saveNotes}
              isLoading={isSavingNotes}
            >
              Salva Note
            </Button>
          </div>

          {/* UTM */}
          {(candidate.utm_source || candidate.utm_campaign) && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Sorgente Traffico</h2>
              <div className="space-y-2 text-sm">
                {candidate.utm_source && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Source</span>
                    <span className="text-gray-900">{candidate.utm_source}</span>
                  </div>
                )}
                {candidate.utm_medium && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Medium</span>
                    <span className="text-gray-900">{candidate.utm_medium}</span>
                  </div>
                )}
                {candidate.utm_campaign && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Campaign</span>
                    <span className="text-gray-900">{candidate.utm_campaign}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
