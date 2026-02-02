'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Check, Clock } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative bg-white overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FDF2F8] via-white to-white" />

      <div className="relative max-w-7xl mx-auto px-4 py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <div className="space-y-6">
            {/* Pre-headline */}
            <div className="inline-flex items-center gap-2 bg-[#FDF2F8] text-[#D946A8] px-4 py-2 rounded-full text-sm font-medium">
              <span className="w-2 h-2 bg-[#D946A8] rounded-full animate-pulse" />
              Selezione aperta — Posti limitati
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
              <p className="text-sm text-gray-700">• Italiano impeccabile e naturale — è il tuo strumento di lavoro</p>
              <p className="text-sm text-gray-700">• Puntualità assoluta sugli appuntamenti — nessuna eccezione</p>
              <p className="text-sm text-gray-700">• Empatia reale con le clienti — qui si fa consulenza, non pressione</p>
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
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-br from-[#FDF2F8] to-[#FCE7F3]">
              {/* Placeholder for hero image */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-24 h-24 mx-auto bg-[#D946A8]/10 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-12 h-12 text-[#D946A8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-[#D946A8] text-sm">Immagine Hero</p>
                </div>
              </div>
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
