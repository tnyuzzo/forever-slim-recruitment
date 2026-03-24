import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { ATTRIBUTION_PARAMS } from '@/lib/attribution'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function sendCAPIPageView(
  page_url: string | null,
  ip_address: string | null,
  user_agent: string | null,
  fbp: string | null,
  fbc: string | null,
) {
  const pixelId = process.env.FB_PIXEL_ID?.trim()
  const accessToken = process.env.FB_ACCESS_TOKEN?.trim()
  if (!pixelId || !accessToken) return

  const userData: Record<string, string> = {}
  if (fbp) userData.fbp = fbp
  if (fbc) userData.fbc = fbc
  if (ip_address) userData.client_ip_address = ip_address
  if (user_agent) userData.client_user_agent = user_agent

  const payload = {
    data: [
      {
        event_name: 'PageView',
        event_time: Math.floor(Date.now() / 1000),
        event_id: crypto.randomUUID(),
        event_source_url: page_url ?? 'https://closeragency.eu',
        action_source: 'website',
        user_data: userData,
      },
    ],
  }

  try {
    const res = await fetch(
      `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    )
    if (!res.ok) {
      const data = await res.json()
      console.error('[track-visitor] CAPI PageView error:', data)
    }
  } catch (e) {
    console.error('[track-visitor] CAPI PageView error:', e)
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const ip_address =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      req.headers.get('x-real-ip') ??
      null

    // Session ID: usa cookie HttpOnly esistente o crea nuovo
    const existingSid = req.cookies.get('fs_sid')?.value ?? body.session_id ?? null
    const session_id = existingSid || crypto.randomUUID()

    // Estrae parametri UTM dalla search string
    const search = body.search ?? ''
    const params = new URLSearchParams(search)
    const attribution: Record<string, string | null> = {}
    for (const key of ATTRIBUTION_PARAMS) {
      attribution[key] = params.get(key) ?? null
    }

    const user_agent = body.user_agent ?? null
    const page_url = body.page_url ?? null
    const fbp = body.fbp ?? null
    const fbc = body.fbc ?? null

    // Fire-and-forget: Supabase insert + CAPI PageView
    void supabase
      .from('page_visitors')
      .insert({
        session_id,
        ip_address,
        user_agent,
        page_url,
        referrer: body.referrer ?? null,
        fbp,
        fbc,
        ...attribution,
      })
      .then(() => {})

    void sendCAPIPageView(page_url, ip_address, user_agent, fbp, fbc)

    const res = NextResponse.json({ ok: true })

    // Imposta fs_sid solo se non esiste già
    if (!existingSid) {
      res.cookies.set('fs_sid', session_id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 90, // 90 giorni
      })
    }

    return res
  } catch (err) {
    console.error('[track-visitor]', err)
    // Sempre 200: non bloccare l'UX per errori di tracking
    return NextResponse.json({ ok: true })
  }
}
