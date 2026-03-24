import { NextRequest, NextResponse, after } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createClient as createServerClient } from '@/lib/supabase/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const authClient = await createServerClient()
    const { data: { user } } = await authClient.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
    }

    const { candidate_id } = await req.json()

    if (!candidate_id) {
      return NextResponse.json({ error: 'candidate_id obbligatorio' }, { status: 400 })
    }

    // Idempotenza: procede solo se fb_complete_event_id è ancora null
    const fb_complete_event_id = crypto.randomUUID()
    const { data: updated, error } = await supabase
      .from('candidates')
      .update({
        fb_complete_event_id,
        complete_sent_at: new Date().toISOString(),
      })
      .eq('id', candidate_id)
      .is('fb_complete_event_id', null)
      .select('id, email, whatsapp, first_name, last_name, fbp, fbc, ip_address, user_agent, country, utm_source, utm_medium, utm_campaign, utm_content, funnel')
      .single()

    if (error || !updated) {
      // Già inviato o non trovato — idempotent OK
      return NextResponse.json({ skipped: true })
    }

    const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://closeragency.eu').trim()

    after(async () => {
      // PostHog: CompleteRegistration event server-side
      try {
        const { capturePostHogEvent } = await import('@/lib/posthog-server')
        capturePostHogEvent({
          event: 'candidate_hired',
          distinct_id: updated.fbp || candidate_id,
          properties: {
            candidate_id,
            utm_source: updated.utm_source ?? undefined,
            utm_medium: updated.utm_medium ?? undefined,
            utm_campaign: updated.utm_campaign ?? undefined,
            utm_content: updated.utm_content ?? undefined,
            funnel_type: updated.funnel ?? undefined,
            country: updated.country ?? undefined,
          },
        })
      } catch (e) {
        console.error('[select-candidate] posthog error:', e)
      }

      try {
        const fbRes = await fetch(`${baseUrl}/api/fb-event`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()}`,
          },
          body: JSON.stringify({
            event_name: 'CompleteRegistration',
            event_id: fb_complete_event_id,
            event_source_url: `${baseUrl}/admin`,
            email: updated.email,
            phone: updated.whatsapp,
            firstName: updated.first_name,
            lastName: updated.last_name,
            fbp: updated.fbp,
            fbc: updated.fbc,
            ip_address: updated.ip_address,
            user_agent: updated.user_agent,
            country: updated.country ?? 'it',
            external_id: candidate_id,
          }),
        })
        if (!fbRes.ok) {
          const fbData = await fbRes.json()
          console.error('[select-candidate] fb-event error:', fbData)
        }
      } catch (e) {
        console.error('[select-candidate] fb-event error:', e)
      }
    })

    return NextResponse.json({ ok: true, candidate_id })
  } catch (err) {
    console.error('[select-candidate]', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
