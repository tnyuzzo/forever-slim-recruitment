'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function StickyCTA() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling 500px
      setIsVisible(window.scrollY > 500)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      className={`
        fixed bottom-0 left-0 right-0 z-50 md:hidden
        transform transition-transform duration-300 ease-out
        ${isVisible ? 'translate-y-0' : 'translate-y-full'}
      `}
    >
      <div className="bg-white border-t border-gray-200 px-4 py-3 shadow-2xl">
        <Link
          href="/apply"
          className="block w-full py-4 bg-[#D946A8] hover:bg-[#C026A0] text-white font-semibold text-center rounded-xl transition-colors"
        >
          CANDIDATI ORA →
        </Link>
      </div>
    </div>
  )
}
