// Event tracking placeholder for future Facebook Pixel, Google Analytics, etc.

type TrackEventName =
  | 'view_landing'
  | 'click_cta'
  | 'start_application'
  | 'prequal_pass'
  | 'prequal_fail'
  | 'step_complete'
  | 'submit_application'
  | 'qualified'
  | 'ko_rejected'
  | 'interview_scheduled'
  | 'interview_completed'

interface TrackEventData {
  position?: 'hero' | 'mid' | 'final' | string
  step?: number
  reason?: string
  score?: number
  priority?: string
  outcome?: string
  [key: string]: unknown
}

export function trackEvent(event: TrackEventName, data?: TrackEventData) {
  // TODO: Implement Facebook Pixel, Google Analytics, etc.
  if (process.env.NODE_ENV === 'development') {
    console.log(`[TRACK] ${event}`, data)
  }

  // Example Facebook Pixel implementation (uncomment when ready):
  // if (typeof window !== 'undefined' && window.fbq) {
  //   window.fbq('track', event, data)
  // }

  // Example Google Analytics implementation (uncomment when ready):
  // if (typeof window !== 'undefined' && window.gtag) {
  //   window.gtag('event', event, data)
  // }
}
