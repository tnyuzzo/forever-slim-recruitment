export const ATTRIBUTION_PARAMS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'funnel',
  'campaign_id',
  'adset_id',
  'ad_id',
  'placement',
  'site_source_name',
  'fbclid',
] as const

export type AttributionParam = (typeof ATTRIBUTION_PARAMS)[number]

/** Estrae solo i parametri di attribution da una query string */
export function getAttributionSearch(search: string): string {
  const params = new URLSearchParams(search)
  const result = new URLSearchParams()
  for (const key of ATTRIBUTION_PARAMS) {
    const val = params.get(key)
    if (val) result.set(key, val)
  }
  const str = result.toString()
  return str ? `?${str}` : ''
}

/**
 * Inietta i parametri attribution da sourceSearch in un URL di destinazione.
 * Non sovrascrive parametri già presenti in `to`.
 */
export function mergeAttributionIntoUrl(to: string, sourceSearch: string): string {
  const source = new URLSearchParams(sourceSearch)
  const url = new URL(to, 'https://placeholder.invalid')
  for (const key of ATTRIBUTION_PARAMS) {
    if (!url.searchParams.has(key)) {
      const val = source.get(key)
      if (val) url.searchParams.set(key, val)
    }
  }
  // Ricostruisce senza il fake hostname
  return url.pathname + (url.search ? url.search : '') + (url.hash ? url.hash : '')
}
