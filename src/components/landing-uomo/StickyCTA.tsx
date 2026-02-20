'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function StickyCTA() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Mostra il pulsante sticky solo quando si è scrollato un po' 
      // e specialmente su dispositivi mobili
      if (window.scrollY > 400 && window.innerWidth < 768) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 w-full p-4 bg-white/80 backdrop-blur-md border-t border-slate-200 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.1)] z-50 md:hidden animate-fade-in-up">
      <Link
        href="/apply-uomo"
        className="flex items-center justify-center w-full gap-2 px-6 py-4 bg-blue-600 text-white font-bold text-lg rounded-2xl active:scale-[0.98] transition-all shadow-lg shadow-blue-600/30"
      >
        CANDIDATI ORA
        <ArrowRight className="w-5 h-5" />
      </Link>
      <p className="text-center text-xs text-slate-500 font-semibold mt-2">
        Compilazione in 3 minuti
      </p>
    </div>
  )
}
