import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
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
      .select('id, email, whatsapp, first_name, last_name, fbp, fbc, ip_address, user_agent, country')
      .single()

    if (error || !updated) {
      // Già inviato o non trovato — idempotent OK
      return NextResponse.json({ skipped: true })
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://closeragency.eu'
    fetch(`${baseUrl}/api/fb-event`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
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
    }).catch((e) => console.error('[select-candidate] fb-event error:', e))

    return NextResponse.json({ ok: true, candidate_id })
  } catch (err) {
    console.error('[select-candidate]', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
