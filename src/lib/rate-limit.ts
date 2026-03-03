/**
 * Rate limiter in-memory per Vercel serverless.
 *
 * Limiti per-instance (non condiviso tra Lambda cold start).
 * Sufficiente per bloccare burst da singolo IP su stessa istanza.
 * Per rate limiting distribuito servirebbe Upstash Redis.
 */

interface RateLimitEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

// Pulizia periodica delle entry scadute (evita memory leak su Lambda long-lived)
const CLEANUP_INTERVAL = 60_000 // 1 min
let lastCleanup = Date.now()

function cleanup() {
  const now = Date.now()
  if (now - lastCleanup < CLEANUP_INTERVAL) return
  lastCleanup = now
  for (const [key, entry] of store) {
    if (now > entry.resetAt) store.delete(key)
  }
}

interface RateLimitConfig {
  /** Numero massimo di richieste nella finestra */
  maxRequests: number
  /** Durata finestra in millisecondi */
  windowMs: number
}

interface RateLimitResult {
  success: boolean
  remaining: number
  resetAt: number
}

export function rateLimit(key: string, config: RateLimitConfig): RateLimitResult {
  cleanup()

  const now = Date.now()
  const entry = store.get(key)

  // Finestra scaduta o prima richiesta → reset
  if (!entry || now > entry.resetAt) {
    const newEntry: RateLimitEntry = {
      count: 1,
      resetAt: now + config.windowMs,
    }
    store.set(key, newEntry)
    return { success: true, remaining: config.maxRequests - 1, resetAt: newEntry.resetAt }
  }

  // Dentro la finestra
  entry.count++
  if (entry.count > config.maxRequests) {
    return { success: false, remaining: 0, resetAt: entry.resetAt }
  }

  return { success: true, remaining: config.maxRequests - entry.count, resetAt: entry.resetAt }
}

/** Estrae IP da headers Next.js (Vercel) */
export function getClientIp(headers: Headers): string {
  return (
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    headers.get('x-real-ip') ??
    'unknown'
  )
}
