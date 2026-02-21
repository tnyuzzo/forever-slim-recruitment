'use client'

import { useEffect, useState, use } from 'react'
import { Calendar, Clock, CheckCircle2, Loader2, Globe } from 'lucide-react'

type Slot = {
    date: string
    time: string
    datetime: string
    dayName: string
    italianTime?: string
}

function detectTimezone() {
    try {
        return Intl.DateTimeFormat().resolvedOptions().timeZone
    } catch {
        return 'Europe/Rome'
    }
}

function getTimezoneCity(tz: string): string {
    const parts = tz.split('/')
    return (parts[parts.length - 1] || tz).replace(/_/g, ' ')
}

function getGMTOffset(tz: string): string {
    const now = new Date()
    const formatter = new Intl.DateTimeFormat('en', { timeZone: tz, timeZoneName: 'shortOffset' })
    const parts = formatter.formatToParts(now)
    const tzPart = parts.find(p => p.type === 'timeZoneName')
    return tzPart?.value || ''
}

function formatLocalTime(isoDatetime: string, tz: string): string {
    const d = new Date(isoDatetime)
    const end = new Date(d.getTime() + 60 * 60 * 1000)
    const fmt = (date: Date) => date.toLocaleTimeString('it-IT', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false })
    return `${fmt(d)} - ${fmt(end)}`
}

export default function BookingPage({ params }: { params: Promise<{ token: string }> }) {
    const { token } = use(params)
    const [candidateName, setCandidateName] = useState('')
    const [slots, setSlots] = useState<Slot[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)
    const [confirming, setConfirming] = useState(false)
    const [confirmed, setConfirmed] = useState(false)
    const [confirmedDate, setConfirmedDate] = useState('')
    const [error, setError] = useState('')
    const [alreadyBooked, setAlreadyBooked] = useState(false)

    // Timezone
    const [userTz, setUserTz] = useState('Europe/Rome')
    const [isDifferentTz, setIsDifferentTz] = useState(false)
    const [tzConfirmed, setTzConfirmed] = useState(false)

    useEffect(() => {
        const tz = detectTimezone()
        setUserTz(tz)
        const isItalian = tz === 'Europe/Rome' || tz === 'Europe/Vatican'
        setIsDifferentTz(!isItalian)
        if (isItalian) setTzConfirmed(true)
    }, [])

    useEffect(() => {
        fetchSlots()
    }, [token])

    async function fetchSlots() {
        try {
            const res = await fetch(`/api/booking?token=${token}`)
            const data = await res.json()

            if (data.already_booked) {
                setAlreadyBooked(true)
                setConfirmedDate(data.scheduled_at)
                setCandidateName(data.candidate_name)
                return
            }

            if (data.error) {
                setError(data.error)
                return
            }

            setCandidateName(data.candidate_name)
            setSlots(data.slots || [])
        } catch (err) {
            setError('Errore nel caricamento degli slot disponibili.')
        } finally {
            setLoading(false)
        }
    }

    async function confirmSlot() {
        if (!selectedSlot) return
        setConfirming(true)
        try {
            const res = await fetch('/api/booking', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, scheduled_at: selectedSlot.datetime }),
            })
            const data = await res.json()
            if (data.success) {
                setConfirmed(true)
                setConfirmedDate(selectedSlot.datetime)
            } else {
                setError(data.error || 'Errore nella conferma.')
            }
        } catch (err) {
            setError('Errore di rete. Riprova.')
        } finally {
            setConfirming(false)
        }
    }

    // Group slots by date
    const groupedSlots = slots.reduce<Record<string, Slot[]>>((acc, s) => {
        if (!acc[s.date]) acc[s.date] = []
        acc[s.date].push(s)
        return acc
    }, {})

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mx-auto" />
                    <p className="text-slate-500 font-medium">Caricamento disponibilità...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-lg border border-red-100 text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Calendar className="w-8 h-8 text-red-500" />
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 mb-2">Link non valido</h1>
                    <p className="text-slate-500">{error}</p>
                </div>
            </div>
        )
    }

    if (confirmed || alreadyBooked) {
        const displayDateIT = new Date(confirmedDate).toLocaleString('it-IT', { timeZone: 'Europe/Rome', weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })
        const displayDateLocal = isDifferentTz
            ? new Date(confirmedDate).toLocaleString('it-IT', { timeZone: userTz, weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })
            : null

        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-lg border border-green-100 text-center space-y-6">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-10 h-10 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900">Colloquio Confermato!</h1>
                    <p className="text-slate-500 leading-relaxed">
                        {alreadyBooked ? 'Hai già prenotato il tuo colloquio.' : `Perfetto, ${candidateName}! Il tuo colloquio è stato prenotato con successo.`}
                    </p>
                    <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 space-y-2">
                        <div className="flex items-center gap-3 justify-center">
                            <Calendar className="w-5 h-5 text-indigo-600" />
                            <span className="text-lg font-bold text-indigo-700 capitalize">{displayDateIT}</span>
                        </div>
                        {isDifferentTz && (
                            <p className="text-sm text-indigo-500">(ora italiana)</p>
                        )}
                        {displayDateLocal && (
                            <div className="pt-2 border-t border-indigo-100">
                                <div className="flex items-center gap-2 justify-center">
                                    <Globe className="w-4 h-4 text-slate-500" />
                                    <span className="text-sm font-semibold text-slate-600 capitalize">{displayDateLocal}</span>
                                </div>
                                <p className="text-xs text-slate-400">(ora locale {getTimezoneCity(userTz)} {getGMTOffset(userTz)})</p>
                            </div>
                        )}
                    </div>
                    <p className="text-sm text-slate-400">Riceverai un promemoria via email/SMS prima del colloquio.</p>
                </div>
            </div>
        )
    }

    // Popup timezone
    if (isDifferentTz && !tzConfirmed) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-lg border border-indigo-100 text-center space-y-6">
                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto">
                        <Globe className="w-8 h-8 text-indigo-600" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900">Fuso Orario Rilevato</h2>
                    <div className="bg-slate-50 rounded-2xl p-5 space-y-1">
                        <p className="text-lg font-bold text-slate-800">{getTimezoneCity(userTz)}</p>
                        <p className="text-sm text-slate-500">{getGMTOffset(userTz)}</p>
                    </div>
                    <p className="text-slate-500 leading-relaxed text-sm">
                        Gli orari disponibili saranno mostrati nel <strong>tuo fuso orario</strong> ({getTimezoneCity(userTz)}).
                        Accanto vedrai anche l'ora italiana come riferimento.
                    </p>
                    <button
                        onClick={() => setTzConfirmed(true)}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors"
                    >
                        Conferma e continua
                    </button>
                    <button
                        onClick={() => { setIsDifferentTz(false); setTzConfirmed(true) }}
                        className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        Sono in Italia, mostra ora italiana
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4">
            <div className="max-w-2xl mx-auto">

                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-bold mb-4">
                        <Calendar className="w-4 h-4" /> Prenotazione Colloquio
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-3">
                        Ciao {candidateName}, scegli il tuo slot!
                    </h1>
                    <p className="text-slate-500 text-lg">
                        Seleziona la fascia oraria che preferisci per il colloquio conoscitivo.
                    </p>
                    {isDifferentTz && (
                        <p className="text-xs text-indigo-500 mt-2 flex items-center justify-center gap-1">
                            <Globe className="w-3.5 h-3.5" />
                            Orari nel tuo fuso: {getTimezoneCity(userTz)} ({getGMTOffset(userTz)}) — ora italiana tra parentesi
                        </p>
                    )}
                </div>

                <div className="space-y-8">
                    {Object.entries(groupedSlots).map(([date, dateSlots]) => (
                        <div key={date} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="bg-slate-50 px-6 py-4 border-b border-gray-100">
                                <h3 className="font-bold text-slate-800 capitalize flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-indigo-600" /> {date}
                                </h3>
                            </div>
                            <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                                {dateSlots.map((slot) => {
                                    const localTime = isDifferentTz ? formatLocalTime(slot.datetime, userTz) : null
                                    return (
                                        <button
                                            key={slot.datetime}
                                            onClick={() => setSelectedSlot(slot)}
                                            className={`p-3 rounded-xl border-2 transition-all text-center ${selectedSlot?.datetime === slot.datetime
                                                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-md scale-105'
                                                    : 'border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/30'
                                                }`}
                                        >
                                            <Clock className={`w-4 h-4 mx-auto mb-1 ${selectedSlot?.datetime === slot.datetime ? 'text-indigo-600' : 'text-gray-400'}`} />
                                            <div className="font-bold text-sm">{localTime || slot.time}</div>
                                            {localTime && (
                                                <div className="text-[10px] text-slate-400 mt-0.5">({slot.italianTime || slot.time} IT)</div>
                                            )}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Confirm Bar */}
                {selectedSlot && (
                    <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-200 p-4 z-50">
                        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
                            <div className="text-sm">
                                <span className="text-slate-500">Hai scelto:</span>{' '}
                                <span className="font-bold text-slate-900 capitalize">
                                    {selectedSlot.date}, {isDifferentTz ? formatLocalTime(selectedSlot.datetime, userTz) : selectedSlot.time}
                                </span>
                                {isDifferentTz && (
                                    <span className="text-slate-400 text-xs ml-1">({selectedSlot.italianTime || selectedSlot.time} IT)</span>
                                )}
                            </div>
                            <button
                                onClick={confirmSlot}
                                disabled={confirming}
                                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2 shrink-0"
                            >
                                {confirming ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                {confirming ? 'Confermo...' : 'Conferma Slot'}
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}
