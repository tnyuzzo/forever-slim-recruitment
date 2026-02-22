'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Check, Clock } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative bg-white overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FDF2F8] via-white to-white" />

      <div className="relative max-w-7xl mx-auto px-4 pt-6 pb-12 md:pt-8 md:pb-16">
        {/* Logo centrato */}
        <div className="flex justify-center mb-8">
          <img src="/images/closer-agency-logo.png" alt="Closer Agency" className="h-14 w-auto" />
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <div className="space-y-6">
            {/* Pre-headline */}
            <div className="inline-flex items-center gap-2 bg-[#FDF2F8] text-[#D946A8] px-4 py-2 rounded-full text-sm font-medium">
              <span className="w-2 h-2 bg-[#D946A8] rounded-full animate-pulse" />
              Selezione aperta — Posti limitati
            </div>

            {/* Hero image crop 16:9 — solo mobile */}
            <div className="lg:hidden relative aspect-[16/9] rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/images/hero_professional_woman_1771577958488.png"
                alt="Lavora da casa con i tuoi orari"
                fill
                unoptimized
                className="object-cover object-[center_15%]"
                priority
              />
            </div>

            {/* Headline */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight tracking-tight">
              Niente chiamate a freddo: solo appuntamenti già prenotati.
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              Lavora da casa. Solo provvigioni. Vendita consulenziale donna-donna nel settore benessere e controllo peso.
            </p>

            {/* 3 Benefits */}
            <div className="space-y-3 py-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-green-600" />
                </div>
                <p className="text-gray-700">
                  <strong>Lead già caldi:</strong> ricevi contatti che hanno già prenotato il loro appuntamento — non devi cercare nessuno
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-green-600" />
                </div>
                <p className="text-gray-700">
                  <strong>Da casa tua, con i tuoi orari:</strong> bastano 4 ore al giorno, minimo 3 giorni a settimana
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-green-600" />
                </div>
                <p className="text-gray-700">
                  <strong>Prodotto che si vende da solo:</strong> settore in esplosione, domanda altissima, clienti già informate e motivate
                </p>
              </div>
            </div>

            {/* 3 Requirements */}
            <div className="bg-gray-50 rounded-xl p-5 space-y-2">
              <p className="text-sm font-semibold text-gray-900 mb-3">Requisiti essenziali:</p>
              <div className="text-sm space-y-0.5">
                <p className="font-semibold text-gray-900">• Italiano impeccabile e naturale</p>
                <p className="text-gray-600 pl-3">è il tuo strumento di lavoro</p>
              </div>
              <div className="text-sm space-y-0.5">
                <p className="font-semibold text-gray-900">• Puntualità assoluta sugli appuntamenti</p>
                <p className="text-gray-600 pl-3">nessuna eccezione</p>
              </div>
              <div className="text-sm space-y-0.5">
                <p className="font-semibold text-gray-900">• Empatia reale con le clienti</p>
                <p className="text-gray-600 pl-3">qui si fa consulenza, non pressione</p>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-4">
              <Link
                href="/apply"
                className="inline-flex items-center justify-center w-full md:w-auto px-8 py-4 bg-[#D946A8] hover:bg-[#C026A0] text-white font-semibold text-lg rounded-xl transition-all duration-200 shadow-lg shadow-[#D946A8]/25 hover:shadow-xl hover:shadow-[#D946A8]/30"
              >
                CANDIDATI IN 3 MINUTI →
              </Link>
              <p className="mt-3 text-sm text-gray-500 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                7 step rapidi • Risposta entro 48h • Selezione riservata
              </p>
            </div>
          </div>

          {/* Image */}
          <div className="relative lg:pl-8">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl shadow-pink-900/10 border-4 border-white">
              <Image
                src="/images/hero_professional_woman_1771577958488.png"
                alt="Donna professionista che lavora da casa"
                fill
                unoptimized
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#D946A8]/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-[#FDF2F8] rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  )
}
