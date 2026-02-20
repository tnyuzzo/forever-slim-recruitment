'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Check, Clock } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative bg-white overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-white" />

      <div className="relative max-w-7xl mx-auto px-4 py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <div className="space-y-6">
            {/* Pre-headline */}
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-bold">
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
              Selezione aperta — Posti limitati
            </div>

            {/* Headline */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 leading-tight tracking-tight">
              Niente chiamate a freddo: solo appuntamenti già confermati.
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-medium">
              Lavora da casa. Solo provvigioni. Vendita consulenziale nel settore benessere e controllo peso.
            </p>

            {/* 3 Benefits */}
            <div className="space-y-3 py-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-blue-700" />
                </div>
                <p className="text-slate-700">
                  <strong>Lead già caldi:</strong> ricevi contatti che hanno già prenotato il loro appuntamento — non devi cercare nessuno
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-blue-700" />
                </div>
                <p className="text-slate-700">
                  <strong>Da casa tua, con i tuoi orari:</strong> bastano 4 ore al giorno, minimo 3 giorni a settimana
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-blue-700" />
                </div>
                <p className="text-slate-700">
                  <strong>Prodotto che si vende da solo:</strong> settore in esplosione, domanda altissima, clienti già informati e motivati
                </p>
              </div>
            </div>

            {/* 3 Requirements */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-2">
              <p className="text-sm font-bold text-slate-900 mb-3">Requisiti essenziali:</p>
              <p className="text-sm text-slate-700 font-medium">• Italiano impeccabile e naturale — è il tuo strumento di lavoro</p>
              <p className="text-sm text-slate-700 font-medium">• Puntualità assoluta sugli appuntamenti — nessuna eccezione</p>
              <p className="text-sm text-slate-700 font-medium">• Empatia reale con i clienti — qui si fa consulenza, non pressione</p>
            </div>

            {/* CTA */}
            <div className="pt-4 flex flex-col items-start">
              <Link
                href="/apply-uomo"
                className="inline-flex items-center justify-center w-full md:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-2xl transition-all duration-200 shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30"
              >
                CANDIDATI IN 3 MINUTI →
              </Link>
              <p className="mt-3 text-sm font-semibold text-slate-500 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                7 step rapidi • Risposta entro 48h • Selezione riservata
              </p>
            </div>
          </div>

          {/* Image */}
          <div className="relative lg:pl-8 mt-8 lg:mt-0" style={{ animationDelay: '0.2s' }}>
            <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl shadow-blue-900/10 border-4 border-white">
              <Image
                src="/images/hero_professional_man.jpg"
                alt="Consulente telefonico al lavoro da casa"
                fill
                unoptimized
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-blue-100 rounded-full blur-3xl -z-10" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-50 rounded-full blur-3xl -z-10" />

            {/* Floating badge */}
            <div className="absolute bottom-8 -left-6 bg-white p-4 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center gap-4 animate-bounce-slow">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 shrink-0">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Alte Provvigioni</p>
                <p className="text-xs text-slate-500 font-medium">Pagamenti rapidi</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
