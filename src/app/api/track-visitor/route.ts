import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { ATTRIBUTION_PARAMS } from '@/lib/attribution'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const ip_address =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      req.headers.get('x-real-ip') ??
      null

    // Genera session_id se non presente
    let session_id: string = body.session_id
    if (!session_id) {
      session_id = crypto.randomUUID()
    }

    // Estrae parametri UTM dalla search string
    const search = body.search ?? ''
    const params = new URLSearchParams(search)
    const attribution: Record<string, string | null> = {}
    for (const key of ATTRIBUTION_PARAMS) {
      attribution[key] = params.get(key) ?? null
    }

    await supabase.from('page_visitors').insert({
      session_id,
      ip_address,
      user_agent: body.user_agent ?? null,
      page_url: body.page_url ?? null,
      referrer: body.referrer ?? null,
      utm_source: attribution.utm_source,
      utm_medium: attribution.utm_medium,
      utm_campaign: attribution.utm_campaign,
      utm_content: attribution.utm_content,
      utm_term: attribution.utm_term,
      funnel: attribution.funnel,
      fbclid: attribution.fbclid,
      fbc: body.fbc ?? null,
      fbp: body.fbp ?? null,
      campaign_id: attribution.campaign_id,
      adset_id: attribution.adset_id,
      ad_id: attribution.ad_id,
      placement: attribution.placement,
      site_source_name: attribution.site_source_name,
    })

    // Imposta cookie fs_sid (90gg, HttpOnly)
    const res = NextResponse.json({ session_id })
    res.cookies.set('fs_sid', session_id, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 90,
    })
    return res
  } catch (err) {
    console.error('[track-visitor]', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
