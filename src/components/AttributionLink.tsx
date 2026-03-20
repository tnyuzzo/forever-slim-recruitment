'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ATTRIBUTION_PARAMS } from '@/lib/attribution'

interface AttributionLinkProps
  extends Omit<React.ComponentProps<typeof Link>, 'href'> {
  href: string
}

/**
 * Link that forwards UTM / attribution query params from the current URL
 * to the destination, so tracking is preserved across internal navigation.
 */
export default function AttributionLink({
  href,
  ...props
}: AttributionLinkProps) {
  const [fullHref, setFullHref] = useState(href)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const dest = new URL(href, window.location.origin)
    for (const key of ATTRIBUTION_PARAMS) {
      const val = params.get(key)
      if (val && !dest.searchParams.has(key)) {
        dest.searchParams.set(key, val)
      }
    }
    setFullHref(dest.pathname + dest.search)
  }, [href])

  return <Link href={fullHref} {...props} />
}
