import { createClient } from '@supabase/supabase-js'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { teamInviteSchema, teamDeleteSchema } from '@/lib/server-validation'

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)
const resend = new Resend(process.env.RESEND_API_KEY)
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://closeragency.eu').trim()

/** Verifica che l'utente autenticato sia superadmin. Usa service_role per bypassare RLS. */
async function requireSuperadmin(userId: string): Promise<boolean> {
    const { data } = await supabaseAdmin
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single()
    return data?.role === 'superadmin'
}

function buildInviteHtml(roleLabel: string, actionLink: string, isExisting: boolean) {
    const ctaText = isExisting ? 'Accedi al Pannello' : 'Accetta Invito'
    const instruction = isExisting
        ? 'Clicca il pulsante qui sotto per accedere al pannello:'
        : "Clicca il pulsante qui sotto per accettare l'invito e impostare la tua password:"

    return `<!DOCTYPE html>
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
    <p style="font-size: 15px; line-height: 1.6; color: #4a4a4a;">${instruction}</p>
    <div style="text-align: center; margin: 32px 0;">
        <a href="${actionLink}" style="display: inline-block; background: #7c3aed; color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 15px;">
            ${ctaText}
        </a>
    </div>
    <p style="font-size: 13px; color: #888; line-height: 1.5;">
        Se non riesci a cliccare il pulsante, copia e incolla questo link nel browser:<br>
        <a href="${actionLink}" style="color: #7c3aed; word-break: break-all;">${actionLink}</a>
    </p>
    <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;">
    <p style="font-size: 12px; color: #aaa; text-align: center;">Closer Agency — Pannello Recruiting</p>
</body>
</html>`
}

export async function POST(req: NextRequest) {
    try {
        const authClient = await createServerClient()
        const { data: { user } } = await authClient.auth.getUser()
        if (!user) {
            return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
        }

        // Solo superadmin può invitare/reinvitare membri
        if (!await requireSuperadmin(user.id)) {
            return NextResponse.json({ error: 'Solo i Super Admin possono gestire il team.' }, { status: 403 })
        }

        const body = await req.json()
        const parsed = teamInviteSchema.safeParse(body)
        if (!parsed.success) {
            return NextResponse.json({ error: 'Dati non validi', details: parsed.error.flatten().fieldErrors }, { status: 400 })
        }
        const { email, role } = parsed.data

        const roleLabel = role === 'superadmin' ? 'Super Admin' : 'Recruiter'

        // ── Step 1: Check if user already exists in Supabase Auth ──
        const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers()
        if (listError) {
            console.error('[team-invite] listUsers failed:', listError)
            return NextResponse.json({ error: 'Errore interno listUsers.' }, { status: 500 })
        }

        const existingUser = users.find(u => u.email?.toLowerCase() === email.toLowerCase())
        let targetUserId: string
        let actionLink: string
        const isExistingUser = !!existingUser

        console.log(`[team-invite] email=${email} role=${role} exists=${isExistingUser}`)

        if (existingUser) {
            // ── Existing user: confirm email + generate magic link ──
            targetUserId = existingUser.id

            // Ensure email is confirmed (zombie users from failed inviteUserByEmail)
            if (!existingUser.email_confirmed_at) {
                console.log('[team-invite] Confirming email for zombie user:', email)
                const { error: confirmErr } = await supabaseAdmin.auth.admin.updateUserById(targetUserId, {
                    email_confirm: true
                })
                if (confirmErr) {
                    console.error('[team-invite] updateUser confirm failed:', confirmErr)
                }
            }

            // Generate magic link
            const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
                type: 'magiclink',
                email,
                options: { redirectTo: `${siteUrl}/auth/callback` }
            })

            if (linkError) {
                console.error('[team-invite] generateLink magiclink failed:', linkError)
                return NextResponse.json({ error: 'Errore generazione link: ' + linkError.message }, { status: 500 })
            }

            actionLink = linkData.properties.action_link
            console.log('[team-invite] Magic link generated OK, length:', actionLink?.length)
        } else {
            // ── New user: generate invite link (creates user + link in one call) ──
            const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
                type: 'invite',
                email,
                options: {
                    data: { role },
                    redirectTo: `${siteUrl}/auth/callback`
                }
            })

            if (linkError) {
                console.error('[team-invite] generateLink invite failed:', linkError)
                return NextResponse.json({ error: 'Errore creazione invito: ' + linkError.message }, { status: 500 })
            }

            targetUserId = linkData.user.id
            actionLink = linkData.properties.action_link
            console.log('[team-invite] Invite link generated OK, userId:', targetUserId, 'linkLength:', actionLink?.length)
        }

        if (!actionLink) {
            console.error('[team-invite] actionLink is empty/undefined')
            return NextResponse.json({ error: 'Link di invito non generato.' }, { status: 500 })
        }

        // Ensure redirect_to is in the action link (generateLink may ignore redirectTo option)
        const callbackUrl = `${siteUrl}/auth/callback`
        if (!actionLink.includes('redirect_to=')) {
            actionLink += `&redirect_to=${encodeURIComponent(callbackUrl)}`
        } else if (!actionLink.includes('/auth/callback')) {
            actionLink = actionLink.replace(/redirect_to=[^&]+/, `redirect_to=${encodeURIComponent(callbackUrl)}`)
        }

        // ── Step 2 & 3: Assign role + Send email in parallel ──
        console.log('[team-invite] Sending via Resend to:', email)

        const [roleResult, emailResult] = await Promise.allSettled([
            supabaseAdmin.from('user_roles').upsert({
                user_id: targetUserId,
                role
            }, { onConflict: 'user_id' }),
            resend.emails.send({
                from: 'Closer Agency <recruiting@closeragency.eu>',
                to: email,
                subject: `Sei stato invitato come ${roleLabel} — Closer Agency`,
                html: buildInviteHtml(roleLabel, actionLink, isExistingUser)
            })
        ])

        // Handle role upsert result
        if (roleResult.status === 'rejected') {
            console.error('[team-invite] role upsert failed:', roleResult.reason)
        } else if (roleResult.value.error) {
            console.error('[team-invite] role upsert failed:', roleResult.value.error)
        }

        // Handle email result
        if (emailResult.status === 'rejected') {
            console.error('[team-invite] Resend FAILED:', emailResult.reason)
            return NextResponse.json({
                success: true,
                message: `Utente creato ma email non inviata: ${emailResult.reason}. Usa il link qui sotto.`,
                inviteLink: actionLink,
                emailSent: false,
                isExistingUser
            })
        }

        const { data: emailData, error: emailError } = emailResult.value

        if (emailError) {
            console.error('[team-invite] Resend FAILED:', JSON.stringify(emailError))
            return NextResponse.json({
                success: true,
                message: `Utente creato ma email non inviata: ${emailError.message}. Usa il link qui sotto.`,
                inviteLink: actionLink,
                emailSent: false,
                isExistingUser
            })
        }

        console.log('[team-invite] Resend SUCCESS. ID:', emailData?.id)

        return NextResponse.json({
            success: true,
            message: isExistingUser
                ? `Email di accesso inviata a ${email}. Ruolo: ${roleLabel}.`
                : `Invito inviato a ${email} con ruolo "${roleLabel}".`,
            inviteLink: actionLink,
            emailSent: true,
            isExistingUser
        })

    } catch (err: any) {
        console.error('[team-invite] UNEXPECTED ERROR:', err)
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

        const { data: roles, error: rolesError } = await supabaseAdmin
            .from('user_roles')
            .select('user_id, role, created_at')
            .order('created_at', { ascending: true })

        if (rolesError) {
            return NextResponse.json({ error: rolesError.message }, { status: 500 })
        }

        const { data: { users } } = await supabaseAdmin.auth.admin.listUsers()

        // O(1) lookup by user id instead of O(n) .find() per role
        const usersMap = new Map(users.map(u => [u.id, u]))

        const teamMembers = roles.map(r => {
            const authUser = usersMap.get(r.user_id)
            return {
                user_id: r.user_id,
                email: authUser?.email || 'Sconosciuto',
                role: r.role,
                created_at: r.created_at,
                last_sign_in: authUser?.last_sign_in_at || null
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

        // Solo superadmin può rimuovere membri
        if (!await requireSuperadmin(user.id)) {
            return NextResponse.json({ error: 'Solo i Super Admin possono gestire il team.' }, { status: 403 })
        }

        const body = await req.json()
        const parsed = teamDeleteSchema.safeParse(body)
        if (!parsed.success) {
            return NextResponse.json({ error: 'Dati non validi', details: parsed.error.flatten().fieldErrors }, { status: 400 })
        }
        const { user_id } = parsed.data

        // Impedisci auto-eliminazione
        if (user_id === user.id) {
            return NextResponse.json({ error: 'Non puoi rimuovere te stesso dal team.' }, { status: 400 })
        }

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
