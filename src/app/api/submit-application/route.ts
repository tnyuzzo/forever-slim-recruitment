import { NextRequest, NextResponse } from 'next/server'
import { after } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import * as Sentry from '@sentry/nextjs'
import { ATTRIBUTION_PARAMS } from '@/lib/attribution'
import { rateLimit, getClientIp } from '@/lib/rate-limit'
import { submitApplicationSchema } from '@/lib/server-validation'

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
    // Rate limiting
    const ip_address = getClientIp(req.headers)
    const rateLimitResult = rateLimit('submit:' + ip_address, { maxRequests: 5, windowMs: 60_000 })
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Troppe richieste. Riprova tra qualche minuto.' },
        {
          status: 429,
          headers: { 'Retry-After': String(Math.ceil((rateLimitResult.resetAt - Date.now()) / 1000)) },
        }
      )
    }

    const body = await req.json()

    // Zod validation
    const parsed = submitApplicationSchema.safeParse(body)
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors
      Sentry.captureMessage('Submit validation failed', {
        level: 'warning',
        extra: { fieldErrors, email: body.email ?? 'missing' },
      })
      return NextResponse.json(
        { error: 'Dati non validi', details: fieldErrors },
        { status: 400 }
      )
    }

    const { email } = parsed.data

    const user_agent = req.headers.get('user-agent') ?? null

    // Legge session_id da cookie HttpOnly o da body
    const cookieSid = req.cookies.get('fs_sid')?.value ?? null
    const session_id: string | null = cookieSid ?? body.session_id ?? null

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

    // Build payload DB (whitelist esplicita — nessun campo arbitrario dal body)
    const page_url = body.page_url

    const dbRecord = {
      email: body.email,
      first_name: body.first_name,
      last_name: body.last_name,
      whatsapp: body.whatsapp,
      birth_date: body.birth_date,
      age_range: body.age_range,
      city: body.city,
      country: body.country ?? 'it',
      nationality: body.nationality,
      native_language: body.native_language,
      italian_level: body.italian_level,
      english_level: body.english_level,
      other_languages: body.other_languages,
      strong_accent: body.strong_accent,
      bio_short: body.bio_short,
      hours_per_day: body.hours_per_day,
      days_per_week: body.days_per_week,
      time_slots: body.time_slots,
      start_date: body.start_date,
      weekend_sat: body.weekend_sat,
      weekend_sun: body.weekend_sun,
      weekend_details: body.weekend_details,
      holidays: body.holidays,
      sales_years: body.sales_years,
      inbound_outbound: body.inbound_outbound,
      sectors: body.sectors,
      close_rate_range: body.close_rate_range,
      experience: body.experience,
      motivation: body.motivation,
      availability: body.availability,
      has_vat: body.has_vat,
      roleplay_think_about_it: body.roleplay_think_about_it,
      roleplay_bundle3: body.roleplay_bundle3,
      photo_url: body.photo_url,
      audio_url: body.audio_url,
      audio_uploaded: body.audio_uploaded,
      score_total: body.score_total,
      score_breakdown: body.score_breakdown,
      priority: body.priority,
      status: body.status === 'rejected' ? 'rejected' : 'new',
      ko_reason: body.ko_reason,
      pq_hours: body.pq_hours,
      pq_days: body.pq_days,
      pq_punctuality: body.pq_punctuality,
      pq_italian: body.pq_italian,
      consent_privacy: body.consent_privacy,
      consent_truth: body.consent_truth,
      consent_whatsapp: body.consent_whatsapp,
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
      Sentry.captureException(error, { extra: { email: parsed.data.email } })
      return NextResponse.json({ error: 'Errore nel salvataggio' }, { status: 500 })
    }

    const candidate_id = inserted.id

    const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://closeragency.eu').trim()

    // after(): esegue dopo la response ma mantiene la Lambda attiva
    after(async () => {
      // PostHog: application_submitted server-side (backup per ad blocker)
      try {
        const { capturePostHogEvent } = await import('@/lib/posthog-server')
        // Calcola fascia d'età da birth_date
        let age_bracket: string | undefined
        if (body.birth_date) {
          const age = Math.floor((Date.now() - new Date(body.birth_date).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
          if (age < 25) age_bracket = '<25'
          else if (age < 30) age_bracket = '25-29'
          else if (age < 35) age_bracket = '30-34'
          else if (age < 40) age_bracket = '35-39'
          else if (age < 45) age_bracket = '40-44'
          else if (age < 50) age_bracket = '45-49'
          else if (age < 55) age_bracket = '50-54'
          else if (age < 60) age_bracket = '55-59'
          else age_bracket = '60+'
        }
        capturePostHogEvent({
          event: 'application_submitted',
          distinct_id: fbp || candidate_id,
          properties: {
            candidate_id,
            funnel_type: body.funnel ?? 'donna',
            utm_source: body.utm_source ?? undefined,
            utm_medium: body.utm_medium ?? undefined,
            utm_campaign: body.utm_campaign ?? undefined,
            utm_content: body.utm_content ?? undefined,
            country: body.country ?? 'it',
            age_bracket,
            $lib: 'server',
          },
        })
      } catch (e) {
        console.error('[submit-application] posthog error:', e)
      }

      try {
        const fbRes = await fetch(`${baseUrl}/api/fb-event`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()}`,
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
        })
        if (!fbRes.ok) {
          const fbData = await fbRes.json()
          console.error('[submit-application] fb-event error:', fbData)
        }
      } catch (e) {
        console.error('[submit-application] fb-event error:', e)
      }

      try {
        await fetch(`${baseUrl}/api/send-notification`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()}`,
          },
          body: JSON.stringify({
            first_name: body.first_name,
            last_name: body.last_name,
            email: body.email,
            whatsapp: body.whatsapp,
            score_total: body.score_total,
            priority: body.priority,
            isKO: body.status === 'rejected',
          }),
        })
      } catch (e) {
        console.error('[submit-application] send-notification error:', e)
      }
    })

    return NextResponse.json({ candidate_id, status: body.status ?? 'new' })
  } catch (err) {
    console.error('[submit-application]', err)
    Sentry.captureException(err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
