import { NextRequest, NextResponse } from 'next/server'

/** Mappa nome paese (italiano) → codice ISO 3166-1 alpha-2 lowercase (richiesto da Facebook CAPI) */
const COUNTRY_TO_ISO: Record<string, string> = {
  'italia': 'it', 'albania': 'al', 'argentina': 'ar', 'australia': 'au', 'austria': 'at',
  'belgio': 'be', 'bosnia ed erzegovina': 'ba', 'brasile': 'br', 'bulgaria': 'bg',
  'canada': 'ca', 'cile': 'cl', 'cina': 'cn', 'colombia': 'co', 'croazia': 'hr',
  'danimarca': 'dk', 'ecuador': 'ec', 'egitto': 'eg', 'estonia': 'ee', 'filippine': 'ph',
  'finlandia': 'fi', 'francia': 'fr', 'germania': 'de', 'giappone': 'jp', 'grecia': 'gr',
  'india': 'in', 'irlanda': 'ie', 'kosovo': 'xk', 'lettonia': 'lv', 'lituania': 'lt',
  'lussemburgo': 'lu', 'macedonia del nord': 'mk', 'malta': 'mt', 'marocco': 'ma',
  'messico': 'mx', 'moldova': 'md', 'montenegro': 'me', 'nigeria': 'ng', 'norvegia': 'no',
  'paesi bassi': 'nl', 'pakistan': 'pk', 'perù': 'pe', 'polonia': 'pl', 'portogallo': 'pt',
  'regno unito': 'gb', 'repubblica ceca': 'cz', 'romania': 'ro', 'russia': 'ru',
  'senegal': 'sn', 'serbia': 'rs', 'slovacchia': 'sk', 'slovenia': 'si', 'spagna': 'es',
  'sri lanka': 'lk', 'stati uniti': 'us', 'svezia': 'se', 'svizzera': 'ch', 'tunisia': 'tn',
  'turchia': 'tr', 'ucraina': 'ua', 'ungheria': 'hu', 'venezuela': 've',
}

function countryToIso(country: string): string {
  const iso = COUNTRY_TO_ISO[country.toLowerCase().trim()]
  if (!iso) {
    console.warn(`[fb-event] Country non mappato: "${country}" — uso lowercase`)
    return country.toLowerCase().trim()
  }
  return iso
}

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
  if (authHeader !== `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const pixelId = process.env.FB_PIXEL_ID?.trim()
  const accessToken = process.env.FB_ACCESS_TOKEN?.trim()
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
    if (country) userData.country = [await sha256(countryToIso(country))]
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
