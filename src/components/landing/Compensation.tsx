'use client'

import Link from 'next/link'
import { TrendingUp, Clock, Star, AlertTriangle } from 'lucide-react'

export default function Compensation() {
  const scenarios = [
    {
      title: 'Scenario A',
      subtitle: 'Impegno costante',
      hours: '5 ore/giorno, 5 giorni/settimana',
      consultations: '50 consulenze/settimana',
      weekly: '~€580/settimana',
      monthly: '~€2.500/mese',
      highlight: false,
    },
    {
      title: 'Scenario B',
      subtitle: 'Ritmo sostenuto',
      hours: '6 ore/giorno, 5-6 giorni/settimana',
      consultations: '~66 consulenze/settimana',
      weekly: '~€780/settimana',
      monthly: '~€3.400/mese',
      highlight: true,
    },
    {
      title: 'Scenario C',
      subtitle: 'Performance top',
      hours: '7-8 ore/giorno, 6 giorni/settimana',
      consultations: '~84 consulenze/settimana',
      weekly: '~€1.170/settimana',
      monthly: '~€5.000/mese',
      highlight: false,
    },
  ]

  return (
    <section className="py-10 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-4">
          Quanto puoi guadagnare. I numeri, senza giri di parole.
        </h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-8">
          Questa è una collaborazione a provvigione. Nessun fisso mensile, ma anche nessun tetto massimo.
          Guadagni il <strong>10% su ogni vendita conclusa</strong>.
        </p>

        {/* Products */}
        <div className="bg-[#FDF2F8] rounded-xl p-6 mb-12 max-w-2xl mx-auto">
          <h3 className="font-semibold text-gray-900 mb-4">I prodotti e le tue provvigioni</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Kit singolo (1 mese) — €197</span>
              <span className="font-semibold text-[#D946A8]">€19,70</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Kit completo (3 mesi) — €399</span>
              <span className="font-semibold text-[#D946A8]">€39,90</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-4">
            Il kit completo è il più richiesto (offre un risparmio significativo alla cliente).
          </p>
        </div>

        {/* Scenarios */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {scenarios.map((scenario, index) => (
            <div
              key={index}
              className={`rounded-2xl p-6 ${
                scenario.highlight
                  ? 'bg-[#D946A8] text-white ring-4 ring-[#D946A8]/20'
                  : 'bg-gray-50 border border-gray-200'
              }`}
            >
              <div className="text-sm font-medium mb-1 opacity-75">{scenario.title}</div>
              <h3 className={`text-xl font-bold mb-4 ${scenario.highlight ? 'text-white' : 'text-gray-900'}`}>
                {scenario.subtitle}
              </h3>
              <div className="space-y-2 text-sm mb-6">
                <p className={scenario.highlight ? 'text-white/90' : 'text-gray-600'}>
                  <Clock className="w-4 h-4 inline mr-2" />
                  {scenario.hours}
                </p>
                <p className={scenario.highlight ? 'text-white/90' : 'text-gray-600'}>
                  {scenario.consultations}
                </p>
              </div>
              <div className={`pt-4 border-t ${scenario.highlight ? 'border-white/20' : 'border-gray-200'}`}>
                <p className="text-sm opacity-75">Guadagno stimato</p>
                <p className={`text-2xl font-bold ${scenario.highlight ? 'text-white' : 'text-gray-900'}`}>
                  {scenario.monthly}
                </p>
                <p className={`text-sm ${scenario.highlight ? 'text-white/75' : 'text-gray-500'}`}>
                  {scenario.weekly}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Daily range */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8 max-w-2xl mx-auto text-center">
          <p className="text-gray-600 mb-2">Guadagno medio giornaliero osservato</p>
          <p className="text-3xl font-bold text-gray-900">€100 — €300 <span className="text-lg font-normal text-gray-500">/giorno</span></p>
          <p className="text-sm text-gray-500 mt-2">A seconda di esperienza, ore dedicate e tasso di chiusura</p>
        </div>

        {/* Why realistic */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 max-w-4xl mx-auto">
          {[
            { icon: TrendingUp, text: 'I lead sono caldi — tasso di chiusura più alto' },
            { icon: Star, text: 'Prodotto con domanda reale e crescente' },
            { icon: Clock, text: 'Kit completo conveniente — upsell naturale' },
            { icon: TrendingUp, text: 'Più migliori, più guadagni' },
          ].map((item, index) => (
            <div key={index} className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-100">
              <item.icon className="w-5 h-5 text-[#D946A8] flex-shrink-0" />
              <p className="text-sm text-gray-700">{item.text}</p>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 max-w-4xl mx-auto">
          <div className="flex gap-4">
            <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-amber-800 mb-2">DISCLAIMER GUADAGNI</p>
              <p className="text-sm text-amber-900 leading-relaxed">
                I guadagni indicati sopra sono stime basate su scenari ipotetici e dati osservati internamente.
                Non costituiscono in alcun modo una promessa, garanzia o previsione di risultato.
                I risultati effettivi variano significativamente in base a molteplici fattori individuali,
                tra cui: ore effettivamente lavorate, competenze personali, esperienza pregressa,
                e condizioni generali di mercato. La collaborazione è a provvigione variabile —
                non è previsto alcun compenso fisso, minimo garantito o rimborso spese.
              </p>
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
