'use client'

import { FileText, Search, Phone } from 'lucide-react'

export default function Process() {
  const steps = [
    {
      icon: FileText,
      number: '1',
      title: 'Candidatura online',
      time: '3 minuti',
      description: 'Compili il form con le informazioni essenziali: chi sei, che esperienza hai, quanto tempo puoi dedicare, e un paio di domande pratiche. Niente test psicologici, niente prove impossibili.',
    },
    {
      icon: Search,
      number: '2',
      title: 'Valutazione',
      time: '24-48 ore',
      description: 'Il nostro team esamina ogni candidatura individualmente. Non è un algoritmo che decide — sono persone. Se il tuo profilo è in linea, ti contattiamo per un breve colloquio.',
    },
    {
      icon: Phone,
      number: '3',
      title: 'Colloquio',
      time: '15-20 minuti',
      description: 'Una chiamata informale — non un interrogatorio. Vogliamo conoscerti, capire come comunichi, rispondere alle tue domande. Se ci troviamo bene, puoi iniziare entro pochi giorni.',
    },
  ]

  return (
    <section className="py-10 md:py-24 bg-[#FAFAFA]">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-4">
          Come funziona la selezione. 3 step, nessuna sorpresa.
        </h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
          Un processo semplice e rispettoso del tuo tempo.
        </p>

        {/* Timeline */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-[#D946A8]/20 -translate-x-1/2" />

            {steps.map((step, index) => (
              <div
                key={index}
                className={`relative flex flex-col md:flex-row gap-6 md:gap-12 mb-12 last:mb-0 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Content */}
                <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'} pl-16 md:pl-0`}>
                  <div
                    className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 inline-block ${
                      index % 2 === 0 ? 'md:mr-0' : 'md:ml-0'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-[#FDF2F8] rounded-lg flex items-center justify-center md:hidden">
                        <step.icon className="w-5 h-5 text-[#D946A8]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                        <p className="text-sm text-[#D946A8] font-medium">{step.time}</p>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
                  </div>
                </div>

                {/* Number circle */}
                <div className="absolute left-6 md:left-1/2 md:relative w-12 h-12 bg-[#D946A8] rounded-full flex items-center justify-center text-white font-bold text-lg -translate-x-1/2 md:translate-x-0 md:flex-shrink-0 z-10">
                  {step.number}
                </div>

                {/* Hidden spacer for desktop layout */}
                <div className="hidden md:block flex-1" />
              </div>
            ))}
          </div>
        </div>

        {/* Note */}
        <div className="max-w-2xl mx-auto mt-12 bg-white rounded-xl p-6 border border-gray-100">
          <p className="text-gray-600 text-sm text-center">
            <strong>Nota di trasparenza:</strong> Non accettiamo tutte le candidature. Non per cattiveria, ma perché le nostre clienti meritano consulenti preparate e affidabili. Se non dovessi essere selezionata, riceverai comunque una comunicazione rispettosa.
          </p>
        </div>
      </div>
    </section>
  )
}
