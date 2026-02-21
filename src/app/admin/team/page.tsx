'use client'

import { useState, useEffect } from 'react'
import { UserPlus, Trash2, Shield, ShieldCheck, Loader2, Mail, Clock } from 'lucide-react'

interface TeamMember {
    id: string
    user_id: string
    email: string
    role: 'superadmin' | 'recruiter'
    created_at: string
    last_sign_in: string | null
}

export default function TeamManagement() {
    const [members, setMembers] = useState<TeamMember[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [inviteEmail, setInviteEmail] = useState('')
    const [inviteRole, setInviteRole] = useState<'recruiter' | 'superadmin'>('recruiter')
    const [isInviting, setIsInviting] = useState(false)
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

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
                <p className="text-text-muted mt-2">Invita nuovi recruiter e gestisci il tuo team di selezione.</p>
            </div>

            {/* Message Banner */}
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
                    <div className="divide-y divide-gray-50">
                        {members.map((member) => (
                            <div key={member.id} className="flex items-center justify-between p-5 hover:bg-gray-50/50 transition-colors">
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

                                {/* Don't show delete for superadmin (protect self) */}
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
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
