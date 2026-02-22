import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { ATTRIBUTION_PARAMS } from '@/lib/attribution'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function recoverAttribution(
  session_id: string | null,
  ip_address: string | null
) {
  if (session_id) {
    const { data } = await supabase
      .from('page_visitors')
      .select('fbp, fbc, fbclid, utm_source, utm_medium, utm_campaign, utm_content, utm_term, funnel, campaign_id, adset_id, ad_id, placement, site_source_name')
      .eq('session_id', session_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
    if (data) return data
  }
  // Fallback: IP match nelle ultime 24h
  if (ip_address) {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    const { data } = await supabase
      .from('page_visitors')
      .select('fbp, fbc, fbclid, utm_source, utm_medium, utm_campaign, utm_content, utm_term, funnel, campaign_id, adset_id, ad_id, placement, site_source_name')
      .eq('ip_address', ip_address)
      .gte('created_at', since)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
    if (data) return data
  }
  return null
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const ip_address =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      req.headers.get('x-real-ip') ??
      null

    const user_agent = req.headers.get('user-agent') ?? null

    // Legge session_id da cookie HttpOnly o da body
    const cookieSid = req.cookies.get('fs_sid')?.value ?? null
    const session_id: string | null = cookieSid ?? body.session_id ?? null

    // Campi obbligatori
    const { email, first_name, last_name } = body
    if (!email || !first_name || !last_name) {
      return NextResponse.json({ error: 'Campi obbligatori mancanti' }, { status: 400 })
    }

    // Idempotenza: se esiste già una candidatura con stesso email + evento Lead già inviato → skip
    const { data: existing } = await supabase
      .from('candidates')
      .select('id, fb_lead_event_id')
      .eq('email', email)
      .not('fb_lead_event_id', 'is', null)
      .limit(1)
      .single()

    if (existing) {
      return NextResponse.json({ candidate_id: existing.id, status: 'duplicate' })
    }

    // Attribution recovery
    let fbp: string | null = body.fbp ?? null
    let fbc: string | null = body.fbc ?? null
    let recovered: Record<string, string | null> = {}

    if (!fbp || !fbc) {
      const recoveredData = await recoverAttribution(session_id, ip_address)
      if (recoveredData) {
        if (!fbp && recoveredData.fbp) fbp = recoveredData.fbp
        if (!fbc && recoveredData.fbc) fbc = recoveredData.fbc
        recovered = recoveredData
      }
    }

    // Estrae UTM dal body (passati come parametri URL serializzati)
    const utm: Record<string, string | null> = {}
    for (const key of ATTRIBUTION_PARAMS) {
      utm[key] = body[key] ?? recovered[key as keyof typeof recovered] ?? null
    }

    // Genera event_id univoco
    const fb_lead_event_id = crypto.randomUUID()

    // Build payload DB (tutti i campi dal body + attribution)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { fbp: _fbp, fbc: _fbc, session_id: _sid, page_url, search, ...candidateFields } = body

    const dbRecord = {
      ...candidateFields,
      session_id,
      ip_address,
      user_agent,
      fbp,
      fbc,
      fbclid: utm.fbclid,
      utm_source: utm.utm_source,
      utm_medium: utm.utm_medium,
      utm_campaign: utm.utm_campaign,
      utm_content: utm.utm_content,
      utm_term: utm.utm_term,
      funnel: utm.funnel,
      campaign_id: utm.campaign_id,
      adset_id: utm.adset_id,
      ad_id: utm.ad_id,
      placement: utm.placement,
      site_source_name: utm.site_source_name,
      fb_lead_event_id,
      lead_sent_at: new Date().toISOString(),
    }

    const { data: inserted, error } = await supabase
      .from('candidates')
      .insert(dbRecord)
      .select('id')
      .single()

    if (error) {
      console.error('[submit-application] DB error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const candidate_id = inserted.id

    // Fire-and-forget: invia evento Lead a Facebook CAPI
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://closeragency.eu'
    fetch(`${baseUrl}/api/fb-event`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify({
        event_name: 'Lead',
        event_id: fb_lead_event_id,
        event_source_url: page_url ?? `${baseUrl}/apply`,
        email: body.email,
        phone: body.whatsapp,
        firstName: body.first_name,
        lastName: body.last_name,
        fbp,
        fbc,
        ip_address,
        user_agent,
        country: body.country ?? 'it',
        external_id: candidate_id,
      }),
    }).catch((e) => console.error('[submit-application] fb-event error:', e))

    // Fire-and-forget: notifica email/SMS admin
    fetch(`${baseUrl}/api/send-notification`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        first_name: body.first_name,
        last_name: body.last_name,
        email: body.email,
        whatsapp: body.whatsapp,
        score_total: body.score_total,
        priority: body.priority,
        isKO: body.status === 'rejected',
      }),
    }).catch((e) => console.error('[submit-application] send-notification error:', e))

    return NextResponse.json({ candidate_id, status: body.status ?? 'new' })
  } catch (err) {
    console.error('[submit-application]', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
