'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0)

  const faqs = [
    {
      q: '1. Devo avere esperienza nella vendita?',
      a: 'L\'esperienza nella vendita telefonica o consulenziale è preferita, ma non è l\'unico criterio. Valutiamo rigorosamente la dialettica, l\'empatia e la forza comunicativa. La formazione intensiva iniziale copre il nostro metodo specifico.'
    },
    {
      q: '2. C\'è un fisso mensile?',
      a: 'No, la collaborazione è a chiusura. 10% di provvigione secca su ogni acquisto, senza fisso né tetti massimi. Guadagni in base alle tua precisione e performance. È un modello meritocratico reale.'
    },
    {
      q: '3. Si lavora nel weekend?',
      a: 'Non è strettamente obbligatorio, ma essere operativi o disponibili a sbloccare slot appuntamenti per le clienti anche il Sabato o Domenica aumenta esponenzialmente la chiusura e i guadagni.'
    },
    {
      q: '4. Quali sono gli orari?',
      a: 'Scegli tu blocchi orari secondo la tua disponibilità, minimo 4 ore/giorno per 3 giorni/settimana. Ma attenzione: una volta aperto lo slot e prenotato dalla cliente, la puntualità è imperativa e non scusabile.'
    },
    {
      q: '5. Mi serve aprire la Partita IVA?',
      a: 'La collaborazione è di natura commerciale autonoma o freelance. Durante l\'onboarding discuteremo del tracking e dell\'eventuale corretto inquadramento fiscale secondo le normative in corso.'
    },
    {
      q: '6. Che prodotti venderò?',
      a: 'Integratori premium e protocolli di controllo del peso per il target femminile. Prodotti di altissima efficacia con recensioni fortissime; il tuo fine è aiutare le clienti ad arrivarci senza finte promesse mediche.'
    },
    {
      q: '7. Cosa accade se la cliente non vuole comprare?',
      a: 'Ci saluti. Nessuna pressione, nessun imbarazzo, zero manipolazione. Un NO veloce è molto meglio di un compromesso a forza. Il nostro standard etico è altissimo.'
    },
    {
      q: '8. Posso candidarmi se vivo all\'estero?',
      a: 'Assolutamente sì. Dubai, Canarie, Asia, basta avere una fibra potente, fuso orario gestibile e un italiano ineccepibile (le clienti sono tutte In Italia).'
    }
  ]

  return (
    <section className="py-20 md:py-32 bg-white">
      <div className="max-w-4xl mx-auto px-4">

        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
            Domande Frequenti.
          </h2>
          <p className="text-lg text-slate-600 font-medium">Le risposte trasparenti ai dubbi più comuni.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx
            return (
              <div
                key={idx}
                className={`border rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'border-blue-200 bg-blue-50/30' : 'border-slate-200 bg-white hover:border-blue-200 hover:bg-slate-50'
                  }`}
              >
                <button
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                >
                  <span className={`font-bold pr-8 transition-colors ${isOpen ? 'text-blue-900' : 'text-slate-900'}`}>
                    {faq.q}
                  </span>
                  <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                    <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                >
                  <p className="px-6 pb-6 text-slate-600 font-medium leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
