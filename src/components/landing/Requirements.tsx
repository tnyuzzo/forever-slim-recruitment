'use client'

import Link from 'next/link'
import { Check, X } from 'lucide-react'

export default function Requirements() {
  const seekingItems = [
    {
      title: 'Parli italiano in modo impeccabile e naturale.',
      description: 'Nessun accento marcato, nessuna esitazione. Le nostre clienti sono italiane.',
    },
    {
      title: 'Sei puntuale. Punto.',
      description: 'Quando una cliente prenota alle 15:00, tu sei pronta alle 14:55.',
    },
    {
      title: 'Sai ascoltare prima di parlare.',
      description: 'La vendita consulenziale parte dall\'ascolto.',
    },
    {
      title: 'Hai empatia autentica.',
      description: 'Servono delicatezza, rispetto e zero giudizio.',
    },
    {
      title: 'Hai almeno 4 ore al giorno e 3 giorni a settimana.',
      description: 'Questo è il minimo per ricevere appuntamenti sufficienti.',
    },
    {
      title: 'Sei autonoma e affidabile.',
      description: 'Non c\'è un capo che ti controlla. La responsabilità è tua.',
    },
  ]

  const notForYouItems = [
    'Cerchi un fisso mensile garantito — qui si lavora a provvigione, senza rete',
    'Non puoi garantire costanza — sparire per giorni senza preavviso non è accettabile',
    'Non ti senti a tuo agio a parlare di peso, corpo e benessere femminile',
    'Pensi che vendere significhi "convincere" qualcuno a comprare qualcosa che non vuole',
    'Non hai una connessione internet stabile e un ambiente tranquillo per le chiamate',
  ]

  return (
    <section className="py-10 md:py-24 bg-[#FAFAFA]">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-4">
          Chi cerchiamo. E chi non cerchiamo.
        </h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
          Non selezioniamo in base al curriculum. Selezioniamo in base a chi sei, come comunichi, e quanto sei affidabile.
        </p>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Cerchiamo te se */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="w-5 h-5 text-green-600" />
              </div>
              Cerchiamo te se:
            </h3>
            <div className="space-y-5">
              {seekingItems.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">{item.title}</p>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* NON è per te se */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <X className="w-5 h-5 text-red-600" />
              </div>
              NON è per te se:
            </h3>
            <div className="space-y-4">
              {notForYouItems.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <X className="w-5 h-5 text-red-400 flex-shrink-0 mt-1" />
                  <p className="text-gray-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            href="/apply"
            className="inline-flex items-center justify-center px-8 py-4 bg-[#D946A8] hover:bg-[#C026A0] text-white font-semibold text-lg rounded-xl transition-all duration-200"
          >
            CANDIDATI ORA →
          </Link>
        </div>
      </div>
    </section>
  )
}
