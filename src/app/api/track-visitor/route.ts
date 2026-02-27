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

    // Fire-and-forget: non blocca la risposta
    void supabase
      .from('page_visitors')
      .insert({
        session_id,
        ip_address,
        user_agent: body.user_agent ?? null,
        page_url: body.page_url ?? null,
        referrer: body.referrer ?? null,
        fbp: body.fbp ?? null,
        fbc: body.fbc ?? null,
        ...attribution,
      })
      .then(() => {})

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
