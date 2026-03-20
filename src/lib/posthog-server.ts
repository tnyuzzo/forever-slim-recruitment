const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://eu.i.posthog.com'

interface PostHogEvent {
  event: string
  distinct_id: string
  properties?: Record<string, unknown>
}

/** Fire-and-forget PostHog event via HTTP API (no SDK dependency) */
export function capturePostHogEvent({ event, distinct_id, properties = {} }: PostHogEvent) {
  if (!POSTHOG_KEY) return

  void fetch(`${POSTHOG_HOST}/capture/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: POSTHOG_KEY,
      event,
      distinct_id,
      properties: {
        ...properties,
        $lib: 'server',
      },
    }),
  }).catch((e) => {
    console.error('[posthog-server] capture error:', e)
  })
}
