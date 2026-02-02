'use client'

import { Eye, Calendar, Phone } from 'lucide-react'

export default function WarmLeads() {
  const steps = [
    {
      icon: Eye,
      title: 'La cliente vede l\'annuncio',
      description: 'Clicca e compila il questionario di pre-qualifica',
    },
    {
      icon: Calendar,
      title: 'Prenota il suo appuntamento',
      description: 'Sceglie giorno e orario per la consulenza',
    },
    {
      icon: Phone,
      title: 'Tu la chiami all\'ora stabilita',
      description: 'Consulenza personalizzata e proposta',
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-[#FAFAFA]">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-4">
          Perché &quot;lead caldi&quot; cambia tutto.
        </h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
          Se hai lavorato nella vendita, sai che il 90% della fatica è trovare qualcuno che voglia ascoltarti. Qui quel problema non esiste.
        </p>

        {/* Process steps */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-[#D946A8]/20" />
              )}
              <div className="relative bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
                <div className="w-16 h-16 mx-auto bg-[#FDF2F8] rounded-full flex items-center justify-center mb-4">
                  <step.icon className="w-8 h-8 text-[#D946A8]" />
                </div>
                <div className="w-8 h-8 mx-auto -mt-10 mb-4 bg-[#D946A8] rounded-full flex items-center justify-center text-white font-semibold text-sm relative z-10">
                  {index + 1}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Benefits */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 max-w-3xl mx-auto">
          <p className="text-gray-700 leading-relaxed mb-4">
            Le nostre clienti arrivano da campagne pubblicitarie mirate. Prima di parlare con te, hanno già visto un contenuto informativo, compilato un questionario di pre-qualifica e scelto attivamente un giorno e un orario per la consulenza.
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            Quando rispondi, dall&apos;altra parte c&apos;è una donna che:
          </p>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#D946A8] rounded-full" />
              Sa già di cosa si tratta
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#D946A8] rounded-full" />
              Ha già mostrato interesse concreto
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#D946A8] rounded-full" />
              Ha già riservato il suo tempo per parlare con te
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#D946A8] rounded-full" />
              Vuole capire se il prodotto fa per lei
            </li>
          </ul>
          <p className="mt-6 text-[#D946A8] font-medium">
            Tu non convinci nessuno. Tu aiuti chi ha già deciso di informarsi.
          </p>
        </div>
      </div>
    </section>
  )
}
