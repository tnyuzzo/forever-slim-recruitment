import { Check, X } from 'lucide-react'

export default function WhatYouDo() {
  const doItems = [
    'Ricevi un\'agenda con appuntamenti già confermati ogni giorno',
    'Parli con donne che hanno già mostrato interesse e scelto un orario',
    'Ascolti la cliente, capisci la sua situazione, e la guidi verso la soluzione',
    'Scegli tu il canale: telefono, WhatsApp o Zoom',
    'Offri una consulenza, non vendi un prodotto',
  ]

  const dontItems = [
    { text: 'Chiamate a freddo', desc: 'Zero. Nessuna lista di numeri da chiamare.' },
    { text: 'Lead da cercare', desc: 'Non devi fare prospecting né usare i social.' },
    { text: 'Pressione o manipolazione', desc: 'Se la cliente non è convinta, la saluti con rispetto.' },
    { text: 'Gestione ordini o logistica', desc: 'Tu parli con le clienti. Il resto lo gestiamo noi.' },
    { text: 'Burocrazia interna', desc: 'CRM precompilato, agenda automatica, procedure chiare.' },
  ]

  return (
    <section className="py-10 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-4">
          Ecco esattamente cosa farai. E cosa NON dovrai fare mai.
        </h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
          Ogni giorno riceverai appuntamenti già confermati con donne che hanno già mostrato interesse.
        </p>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Cosa farai */}
          <div className="bg-green-50 rounded-2xl p-6 md:p-8">
            <h3 className="text-xl font-semibold text-green-800 mb-6 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                <Check className="w-5 h-5 text-white" />
              </div>
              Cosa farai
            </h3>
            <div className="space-y-4">
              {doItems.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700">{item}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-green-200">
              <p className="text-gray-700 text-sm leading-relaxed">
                Non vendi un prodotto. Offri una consulenza. Parli con donne che hanno un problema reale — il rapporto con il proprio peso — e tu hai qualcosa di concreto da proporre. Quando il prodotto è giusto e la conversazione è onesta, la vendita è una conseguenza naturale.
              </p>
            </div>
          </div>

          {/* Cosa NON farai */}
          <div className="bg-gray-50 rounded-2xl p-6 md:p-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center">
                <X className="w-5 h-5 text-white" />
              </div>
              Cosa NON farai — mai
            </h3>
            <div className="space-y-4">
              {dontItems.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <X className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-gray-900 font-medium">{item.text}</p>
                    <p className="text-gray-500 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
