import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
    try {
        const { email, role } = await req.json()

        if (!email || !role) {
            return NextResponse.json({ error: 'Email e ruolo sono obbligatori.' }, { status: 400 })
        }

        if (!['recruiter', 'superadmin'].includes(role)) {
            return NextResponse.json({ error: 'Ruolo non valido.' }, { status: 400 })
        }

        // 1. Invite the user via Supabase Auth (sends a magic link email)
        const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
            data: { role }
        })

        if (inviteError) {
            // If user already exists, just update the role
            if (inviteError.message.includes('already been registered') || inviteError.message.includes('already exists')) {
                // Find the user
                const { data: { users } } = await supabaseAdmin.auth.admin.listUsers()
                const existingUser = users.find(u => u.email === email)

                if (existingUser) {
                    const { error: roleError } = await supabaseAdmin.from('user_roles').upsert({
                        user_id: existingUser.id,
                        role
                    }, { onConflict: 'user_id' })

                    if (roleError) {
                        return NextResponse.json({ error: 'Errore aggiornamento ruolo: ' + roleError.message }, { status: 500 })
                    }

                    return NextResponse.json({
                        success: true,
                        message: `Ruolo aggiornato a "${role}" per ${email}.`,
                        isExistingUser: true
                    })
                }
            }
            return NextResponse.json({ error: 'Errore invito: ' + inviteError.message }, { status: 500 })
        }

        // 2. Add the role to user_roles table
        if (inviteData?.user) {
            const { error: roleError } = await supabaseAdmin.from('user_roles').upsert({
                user_id: inviteData.user.id,
                role
            }, { onConflict: 'user_id' })

            if (roleError) {
                return NextResponse.json({ error: 'Utente invitato ma errore assegnazione ruolo: ' + roleError.message }, { status: 500 })
            }
        }

        return NextResponse.json({
            success: true,
            message: `Invito inviato a ${email} con ruolo "${role}".`,
            isExistingUser: false
        })

    } catch (err: any) {
        return NextResponse.json({ error: 'Errore server: ' + err.message }, { status: 500 })
    }
}

// GET: List all team members
export async function GET() {
    try {
        // Get all roles
        const { data: roles, error: rolesError } = await supabaseAdmin
            .from('user_roles')
            .select('*')
            .order('created_at', { ascending: true })

        if (rolesError) {
            return NextResponse.json({ error: rolesError.message }, { status: 500 })
        }

        // Get user details from auth
        const { data: { users } } = await supabaseAdmin.auth.admin.listUsers()

        const teamMembers = roles.map(r => {
            const user = users.find(u => u.id === r.user_id)
            return {
                id: r.id,
                user_id: r.user_id,
                email: user?.email || 'Sconosciuto',
                role: r.role,
                created_at: r.created_at,
                last_sign_in: user?.last_sign_in_at || null
            }
        })

        return NextResponse.json({ members: teamMembers })
    } catch (err: any) {
        return NextResponse.json({ error: 'Errore server: ' + err.message }, { status: 500 })
    }
}

// DELETE: Remove a team member
export async function DELETE(req: NextRequest) {
    try {
        const { user_id } = await req.json()

        if (!user_id) {
            return NextResponse.json({ error: 'user_id obbligatorio.' }, { status: 400 })
        }

        // Remove role
        const { error: deleteError } = await supabaseAdmin
            .from('user_roles')
            .delete()
            .eq('user_id', user_id)

        if (deleteError) {
            return NextResponse.json({ error: deleteError.message }, { status: 500 })
        }

        return NextResponse.json({ success: true, message: 'Membro rimosso dal team.' })
    } catch (err: any) {
        return NextResponse.json({ error: 'Errore server: ' + err.message }, { status: 500 })
    }
}
