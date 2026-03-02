import { createClient } from '@supabase/supabase-js'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)
const resend = new Resend(process.env.RESEND_API_KEY)
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://closeragency.eu'

export async function POST(req: NextRequest) {
    try {
        const authClient = await createServerClient()
        const { data: { user } } = await authClient.auth.getUser()
        if (!user) {
            return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
        }

        const { email, role } = await req.json()

        if (!email || !role) {
            return NextResponse.json({ error: 'Email e ruolo sono obbligatori.' }, { status: 400 })
        }

        if (!['recruiter', 'superadmin'].includes(role)) {
            return NextResponse.json({ error: 'Ruolo non valido.' }, { status: 400 })
        }

        // 1. Try to invite via Supabase Auth (creates user + generates invite link)
        const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.generateLink({
            type: 'invite',
            email,
            options: {
                data: { role },
                redirectTo: `${siteUrl}/admin/login`
            }
        })

        if (inviteError) {
            // If user already exists, just update the role
            if (inviteError.message.includes('already been registered') || inviteError.message.includes('already exists')) {
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
                console.error('Errore assegnazione ruolo:', roleError)
            }
        }

        // 3. Send invite email via Resend (reliable delivery)
        const confirmUrl = inviteData.properties?.action_link
        if (!confirmUrl) {
            return NextResponse.json({ error: 'Errore generazione link di invito.' }, { status: 500 })
        }

        const roleLabel = role === 'superadmin' ? 'Super Admin' : 'Recruiter'

        const { error: emailError } = await resend.emails.send({
            from: 'Closer Agency <recruiting@closeragency.eu>',
            to: email,
            subject: `Sei stato invitato come ${roleLabel} — Closer Agency`,
            html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px; color: #1a1a1a;">
    <div style="text-align: center; margin-bottom: 32px;">
        <h1 style="font-size: 24px; font-weight: 700; color: #7c3aed; margin: 0;">Closer Agency</h1>
    </div>

    <h2 style="font-size: 20px; margin-bottom: 16px;">Sei stato invitato nel team!</h2>

    <p style="font-size: 15px; line-height: 1.6; color: #4a4a4a;">
        Sei stato invitato a unirti al pannello di gestione di <strong>Closer Agency</strong> con il ruolo di <strong>${roleLabel}</strong>.
    </p>

    <p style="font-size: 15px; line-height: 1.6; color: #4a4a4a;">
        Clicca il pulsante qui sotto per accettare l'invito e impostare la tua password:
    </p>

    <div style="text-align: center; margin: 32px 0;">
        <a href="${confirmUrl}" style="display: inline-block; background: #7c3aed; color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 15px;">
            Accetta Invito
        </a>
    </div>

    <p style="font-size: 13px; color: #888; line-height: 1.5;">
        Se non riesci a cliccare il pulsante, copia e incolla questo link nel browser:<br>
        <a href="${confirmUrl}" style="color: #7c3aed; word-break: break-all;">${confirmUrl}</a>
    </p>

    <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;">

    <p style="font-size: 12px; color: #aaa; text-align: center;">
        Closer Agency — Pannello Recruiting
    </p>
</body>
</html>
            `.trim()
        })

        if (emailError) {
            console.error('Errore invio email invito:', emailError)
            return NextResponse.json({
                error: `Utente creato ma errore invio email: ${emailError.message}. Riprova.`,
            }, { status: 500 })
        }

        return NextResponse.json({
            success: true,
            message: `Invito inviato a ${email} con ruolo "${role}".`,
            isExistingUser: false
        })

    } catch (err: any) {
        console.error('Errore team invite:', err)
        return NextResponse.json({ error: 'Errore server: ' + err.message }, { status: 500 })
    }
}

// GET: List all team members
export async function GET() {
    try {
        const authClient = await createServerClient()
        const { data: { user } } = await authClient.auth.getUser()
        if (!user) {
            return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
        }

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
        const authClient = await createServerClient()
        const { data: { user } } = await authClient.auth.getUser()
        if (!user) {
            return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
        }

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
