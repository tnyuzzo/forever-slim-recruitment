'use client'

import Link from 'next/link'
import { Clock } from 'lucide-react'

export default function FinalCTA() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-[#D946A8] to-[#C026A0]">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
          Hai letto fin qui. Sai come funziona, cosa offriamo, cosa chiediamo.
        </h2>
        <p className="text-white/90 text-lg mb-8 leading-relaxed">
          Se ti ci rivedi — se cerchi un lavoro flessibile, da casa, basato sulle tue capacità di comunicazione e sulla tua affidabilità — questo potrebbe essere il ruolo giusto per te.
        </p>
        <p className="text-white/80 mb-8">
          La candidatura richiede 3 minuti. Il processo è rispettoso. E se non dovesse essere il momento giusto, puoi sempre ripresentarti in futuro.
        </p>

        <Link
          href="/apply"
          className="inline-flex items-center justify-center px-10 py-5 bg-white text-[#D946A8] font-bold text-xl rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-xl"
        >
          INVIA LA TUA CANDIDATURA →
        </Link>

        <p className="mt-6 text-white/70 text-sm flex items-center justify-center gap-2">
          <Clock className="w-4 h-4" />
          Compilazione in 3 minuti • Valutazione entro 48h • Rispondiamo a tutte
        </p>
      </div>
    </section>
  )
}
