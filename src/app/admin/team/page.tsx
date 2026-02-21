'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { UserPlus, Trash2, Shield, ShieldCheck, Loader2, Mail, Clock, ChevronDown, ChevronUp, Save, Copy, Plus, CheckCircle2 } from 'lucide-react'

interface TeamMember {
    id: string
    user_id: string
    email: string
    role: 'superadmin' | 'recruiter'
    created_at: string
    last_sign_in: string | null
}

type SlotRow = {
    id?: string
    day_of_week: number
    start_time: string
    end_time: string
    is_active: boolean
    recruiter_id: string | null
}

const DAY_NAMES = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato']
const SHORT_DAYS = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab']
const WEEKDAYS = [1, 2, 3, 4, 5]
const ALL_DAYS = [1, 2, 3, 4, 5, 6, 0]

export default function TeamManagement() {
    const [members, setMembers] = useState<TeamMember[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [inviteEmail, setInviteEmail] = useState('')
    const [inviteRole, setInviteRole] = useState<'recruiter' | 'superadmin'>('recruiter')
    const [isInviting, setIsInviting] = useState(false)
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)
    const [expandedMember, setExpandedMember] = useState<string | null>(null)
    const [memberSlots, setMemberSlots] = useState<Record<string, SlotRow[]>>({})
    const [slotSaving, setSlotSaving] = useState<string | null>(null)
    const [slotSaved, setSlotSaved] = useState<string | null>(null)
    const supabase = createClient()

    const fetchMembers = async () => {
        try {
            const res = await fetch('/api/team')
            const data = await res.json()
            if (data.members) setMembers(data.members)
        } catch {
            setMessage({ text: 'Errore nel caricamento del team.', type: 'error' })
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => { fetchMembers() }, [])

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsInviting(true)
        setMessage(null)

        try {
            const res = await fetch('/api/team', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: inviteEmail, role: inviteRole })
            })
            const data = await res.json()

            if (data.success) {
                setMessage({ text: data.message, type: 'success' })
                setInviteEmail('')
                fetchMembers()
            } else {
                setMessage({ text: data.error || 'Errore sconosciuto.', type: 'error' })
            }
        } catch {
            setMessage({ text: 'Errore di rete.', type: 'error' })
        } finally {
            setIsInviting(false)
        }
    }

    const handleRemove = async (userId: string, email: string) => {
        if (!confirm(`Rimuovere ${email} dal team?`)) return

        try {
            const res = await fetch('/api/team', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId })
            })
            const data = await res.json()

            if (data.success) {
                setMessage({ text: `${email} rimosso dal team.`, type: 'success' })
                fetchMembers()
            } else {
                setMessage({ text: data.error, type: 'error' })
            }
        } catch {
            setMessage({ text: 'Errore di rete.', type: 'error' })
        }
    }

    async function toggleMemberSlots(userId: string) {
        if (expandedMember === userId) {
            setExpandedMember(null)
            return
        }
        setExpandedMember(userId)

        if (memberSlots[userId]) return

        const { data, error } = await supabase
            .from('interview_slots')
            .select('*')
            .eq('recruiter_id', userId)
            .order('day_of_week', { ascending: true })

        if (!error && data && data.length > 0) {
            setMemberSlots(prev => ({ ...prev, [userId]: data }))
        } else {
            setMemberSlots(prev => ({
                ...prev,
                [userId]: WEEKDAYS.map(d => ({
                    day_of_week: d,
                    start_time: '10:00',
                    end_time: '18:00',
                    is_active: true,
                    recruiter_id: userId,
                }))
            }))
        }
    }

    function updateMemberSlot(userId: string, index: number, field: keyof SlotRow, value: any) {
        setMemberSlots(prev => ({
            ...prev,
            [userId]: prev[userId].map((s, i) => i === index ? { ...s, [field]: value } : s)
        }))
    }

    function removeMemberSlot(userId: string, index: number) {
        setMemberSlots(prev => ({
            ...prev,
            [userId]: prev[userId].filter((_, i) => i !== index)
        }))
    }

    function addMemberSlot(userId: string) {
        const slots = memberSlots[userId] || []
        const usedDays = new Set(slots.map(s => s.day_of_week))
        const nextDay = ALL_DAYS.find(d => !usedDays.has(d))
        if (nextDay === undefined) return
        const newSlots = [...slots, { day_of_week: nextDay, start_time: '09:00', end_time: '17:00', is_active: true, recruiter_id: userId }]
        setMemberSlots(prev => ({
            ...prev,
            [userId]: newSlots.sort((a, b) => {
                const order = [1, 2, 3, 4, 5, 6, 0]
                return order.indexOf(a.day_of_week) - order.indexOf(b.day_of_week)
            })
        }))
    }

    function copyMemberToWeekdays(userId: string, sourceIndex: number) {
        const slots = memberSlots[userId]
        const source = slots[sourceIndex]
        const newSlots = [...slots]

        for (const day of WEEKDAYS) {
            const existing = newSlots.findIndex(s => s.day_of_week === day)
            if (existing >= 0) {
                newSlots[existing] = { ...newSlots[existing], start_time: source.start_time, end_time: source.end_time, is_active: source.is_active }
            } else {
                newSlots.push({ day_of_week: day, start_time: source.start_time, end_time: source.end_time, is_active: source.is_active, recruiter_id: userId })
            }
        }

        setMemberSlots(prev => ({
            ...prev,
            [userId]: newSlots.sort((a, b) => {
                const order = [1, 2, 3, 4, 5, 6, 0]
                return order.indexOf(a.day_of_week) - order.indexOf(b.day_of_week)
            })
        }))
    }

    function toggleMemberDay(userId: string, day: number) {
        const slots = memberSlots[userId] || []
        const existing = slots.findIndex(s => s.day_of_week === day)
        if (existing >= 0) {
            setMemberSlots(prev => ({
                ...prev,
                [userId]: slots.filter((_, i) => i !== existing)
            }))
        } else {
            const ref = slots[0] || { start_time: '10:00', end_time: '18:00', is_active: true }
            const newSlots = [...slots, { day_of_week: day, start_time: ref.start_time, end_time: ref.end_time, is_active: true, recruiter_id: userId }]
            setMemberSlots(prev => ({
                ...prev,
                [userId]: newSlots.sort((a, b) => {
                    const order = [1, 2, 3, 4, 5, 6, 0]
                    return order.indexOf(a.day_of_week) - order.indexOf(b.day_of_week)
                })
            }))
        }
    }

    async function saveMemberSlots(userId: string) {
        setSlotSaving(userId)
        try {
            await supabase.from('interview_slots').delete().eq('recruiter_id', userId)

            const slots = memberSlots[userId] || []
            if (slots.length > 0) {
                const { error } = await supabase
                    .from('interview_slots')
                    .insert(slots.map(s => ({
                        day_of_week: s.day_of_week,
                        start_time: s.start_time,
                        end_time: s.end_time,
                        is_active: s.is_active,
                        recruiter_id: userId,
                    })))

                if (error) throw error
            }

            setSlotSaved(userId)
            setTimeout(() => setSlotSaved(null), 3000)
        } catch (error) {
            console.error('Error saving member slots:', error)
            alert('Errore nel salvataggio. Riprova.')
        } finally {
            setSlotSaving(null)
        }
    }

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return 'Mai'
        return new Date(dateStr).toLocaleDateString('it-IT', {
            day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
        })
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black text-text-main">Gestione Team</h1>
                <p className="text-text-muted mt-2">Invita nuovi recruiter, gestisci il team e imposta le disponibilità individuali.</p>
            </div>

            {message && (
                <div className={`p-4 rounded-xl text-sm font-medium border ${message.type === 'success'
                        ? 'bg-green-50 text-green-700 border-green-100'
                        : 'bg-red-50 text-red-600 border-red-100'
                    }`}>
                    {message.text}
                </div>
            )}

            {/* Invite Form */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h2 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-primary-main" />
                    Invita Membro del Team
                </h2>
                <form onSubmit={handleInvite} className="flex flex-col sm:flex-row gap-3">
                    <input
                        type="email"
                        placeholder="email@esempio.com"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        required
                        className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-main text-sm"
                    />
                    <select
                        value={inviteRole}
                        onChange={(e) => setInviteRole(e.target.value as 'recruiter' | 'superadmin')}
                        className="border border-gray-300 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-main"
                    >
                        <option value="recruiter">Recruiter</option>
                        <option value="superadmin">Super Admin</option>
                    </select>
                    <button
                        type="submit"
                        disabled={isInviting}
                        className="bg-primary-main hover:bg-primary-hover text-white font-semibold px-6 py-3 rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2 justify-center whitespace-nowrap"
                    >
                        {isInviting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                        Invita
                    </button>
                </form>
                <p className="text-xs text-text-muted mt-3">
                    Il membro riceverà un&apos;email con un link per impostare la password e accedere al pannello.
                </p>
            </div>

            {/* Team Members List */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-text-main">Membri del Team ({members.length})</h2>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center p-12">
                        <Loader2 className="w-6 h-6 animate-spin text-primary-main" />
                    </div>
                ) : members.length === 0 ? (
                    <div className="p-12 text-center text-text-muted">
                        Nessun membro nel team. Invita il primo recruiter qui sopra.
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {members.map((member) => {
                            const isExpanded = expandedMember === member.user_id
                            const slots = memberSlots[member.user_id] || []
                            const activeDays = new Set(slots.map(s => s.day_of_week))

                            return (
                                <div key={member.id}>
                                    <div className="flex items-center justify-between p-5 hover:bg-gray-50/50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${member.role === 'superadmin'
                                                    ? 'bg-amber-100 text-amber-600'
                                                    : 'bg-blue-100 text-blue-600'
                                                }`}>
                                                {member.role === 'superadmin'
                                                    ? <ShieldCheck className="w-5 h-5" />
                                                    : <Shield className="w-5 h-5" />
                                                }
                                            </div>
                                            <div>
                                                <div className="font-semibold text-text-main">{member.email}</div>
                                                <div className="flex items-center gap-3 text-xs text-text-muted mt-0.5">
                                                    <span className={`px-2 py-0.5 rounded-full font-medium ${member.role === 'superadmin'
                                                            ? 'bg-amber-50 text-amber-700'
                                                            : 'bg-blue-50 text-blue-700'
                                                        }`}>
                                                        {member.role === 'superadmin' ? 'Super Admin' : 'Recruiter'}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        Ultimo accesso: {formatDate(member.last_sign_in)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => toggleMemberSlots(member.user_id)}
                                                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                                                    isExpanded ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                            >
                                                <Clock className="w-3.5 h-3.5" />
                                                Disponibilità
                                                {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                            </button>
                                            {member.role !== 'superadmin' && (
                                                <button
                                                    onClick={() => handleRemove(member.user_id, member.email)}
                                                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Rimuovi dal team"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Availability Editor */}
                                    {isExpanded && (
                                        <div className="px-5 pb-5 bg-gray-50/50 border-t border-gray-100">
                                            <div className="pt-4 space-y-4">
                                                {/* Day selector chips */}
                                                <div>
                                                    <label className="text-xs font-semibold text-text-muted uppercase mb-2 block">Giorni Attivi</label>
                                                    <div className="flex flex-wrap gap-2">
                                                        {ALL_DAYS.map(day => (
                                                            <button
                                                                key={day}
                                                                onClick={() => toggleMemberDay(member.user_id, day)}
                                                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                                                    activeDays.has(day)
                                                                        ? 'bg-indigo-600 text-white shadow-sm'
                                                                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                                                                }`}
                                                            >
                                                                {SHORT_DAYS[day]}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Slot rows */}
                                                <div className="space-y-2">
                                                    {slots.map((slot, index) => (
                                                        <div key={`${slot.day_of_week}-${index}`} className={`flex flex-wrap items-center gap-2 p-3 rounded-xl border transition-all ${slot.is_active ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50 opacity-60'}`}>
                                                            <input
                                                                type="checkbox"
                                                                checked={slot.is_active}
                                                                onChange={(e) => updateMemberSlot(member.user_id, index, 'is_active', e.target.checked)}
                                                                className="w-4 h-4 accent-indigo-600 rounded"
                                                            />
                                                            <span className="font-bold text-xs text-text-main w-20">{DAY_NAMES[slot.day_of_week]}</span>
                                                            <div className="flex items-center gap-1.5">
                                                                <input
                                                                    type="time"
                                                                    value={slot.start_time}
                                                                    onChange={(e) => updateMemberSlot(member.user_id, index, 'start_time', e.target.value)}
                                                                    className="px-2 py-1.5 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                />
                                                                <span className="text-text-muted text-xs">—</span>
                                                                <input
                                                                    type="time"
                                                                    value={slot.end_time}
                                                                    onChange={(e) => updateMemberSlot(member.user_id, index, 'end_time', e.target.value)}
                                                                    className="px-2 py-1.5 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                />
                                                            </div>
                                                            <div className="flex items-center gap-1 ml-auto">
                                                                <button
                                                                    onClick={() => copyMemberToWeekdays(member.user_id, index)}
                                                                    className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                                                                    title="Copia su Lun-Ven"
                                                                >
                                                                    <Copy className="w-3 h-3" /> Lun-Ven
                                                                </button>
                                                                <button
                                                                    onClick={() => removeMemberSlot(member.user_id, index)}
                                                                    className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                                >
                                                                    <Trash2 className="w-3.5 h-3.5" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                {slots.length < 7 && (
                                                    <button
                                                        onClick={() => addMemberSlot(member.user_id)}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-dashed border-gray-300 text-xs font-semibold text-text-muted hover:bg-gray-50 transition-colors"
                                                    >
                                                        <Plus className="w-3.5 h-3.5" /> Aggiungi Giorno
                                                    </button>
                                                )}

                                                {/* Save button */}
                                                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                                                    <div>
                                                        {slotSaved === member.user_id && (
                                                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-600">
                                                                <CheckCircle2 className="w-3.5 h-3.5" /> Salvato!
                                                            </span>
                                                        )}
                                                    </div>
                                                    <button
                                                        onClick={() => saveMemberSlots(member.user_id)}
                                                        disabled={slotSaving === member.user_id}
                                                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors disabled:opacity-50 text-xs"
                                                    >
                                                        {slotSaving === member.user_id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                                                        {slotSaving === member.user_id ? 'Salvataggio...' : 'Salva Disponibilità'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
