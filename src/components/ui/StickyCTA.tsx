"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'

export function StickyCTA() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            // Show sticky CTA after scrolling past the first 500px (roughly the hero section)
            if (window.scrollY > 500) {
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
        <div className="fixed bottom-0 left-0 w-full p-4 bg-white/90 backdrop-blur-md border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50 md:hidden animate-in slide-in-from-bottom-full duration-300">
            <Link
                href="/apply"
                className="block w-full text-center bg-[#D946A8] hover:bg-[#C026A0] text-white rounded-xl px-6 py-4 font-semibold text-lg transition-colors shadow-sm"
            >
                CANDIDATI IN 3 MINUTI →
            </Link>
        </div>
    )
}
