import { NextRequest, NextResponse } from 'next/server'

async function sha256(value: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(value.toLowerCase().trim())
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

export async function POST(req: NextRequest) {
  // Autenticazione interna: solo API Routes server-side possono chiamare questo endpoint
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const pixelId = process.env.FB_PIXEL_ID
  const accessToken = process.env.FB_ACCESS_TOKEN
  if (!pixelId || !accessToken) {
    console.warn('[fb-event] FB_PIXEL_ID o FB_ACCESS_TOKEN non configurati — skip')
    return NextResponse.json({ skipped: true })
  }

  try {
    const body = await req.json()
    const {
      event_name,
      event_id,
      event_source_url,
      email,
      phone,
      firstName,
      lastName,
      fbp,
      fbc,
      ip_address,
      user_agent,
      country = 'it',
      external_id,
      value,
      currency,
      test_event_code,
    } = body

    // Hashing PII
    const userData: Record<string, string | string[]> = {}
    if (email) userData.em = [await sha256(email)]
    if (phone) userData.ph = [await sha256(phone.replace(/[\s+\-()]/g, ''))]
    if (firstName) userData.fn = [await sha256(firstName)]
    if (lastName) userData.ln = [await sha256(lastName)]
    if (country) userData.country = [await sha256(country)]
    if (external_id) userData.external_id = [await sha256(String(external_id))]
    if (fbp) userData.fbp = fbp
    if (fbc) userData.fbc = fbc
    if (ip_address) userData.client_ip_address = ip_address
    if (user_agent) userData.client_user_agent = user_agent

    const eventPayload: Record<string, unknown> = {
      data: [
        {
          event_name,
          event_time: Math.floor(Date.now() / 1000),
          event_id,
          event_source_url: event_source_url ?? `https://closeragency.eu`,
          action_source: 'website',
          user_data: userData,
          ...(value != null && currency ? { custom_data: { value, currency } } : {}),
        },
      ],
    }
    if (test_event_code) eventPayload.test_event_code = test_event_code

    const fbRes = await fetch(
      `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventPayload),
      }
    )

    const fbData = await fbRes.json()
    if (!fbRes.ok) {
      console.error('[fb-event] Facebook API error:', fbData)
      return NextResponse.json({ error: fbData }, { status: 502 })
    }

    return NextResponse.json({ ok: true, fb: fbData })
  } catch (err) {
    console.error('[fb-event]', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
