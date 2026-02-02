'use client'

import { GraduationCap, LayoutDashboard, FileText, Headphones, TrendingUp } from 'lucide-react'

export default function Support() {
  const features = [
    {
      icon: GraduationCap,
      title: 'Formazione iniziale completa',
      description: 'Prima di fare la tua prima chiamata, riceverai una formazione strutturata: come funziona il prodotto, come si svolge una consulenza tipo, quali sono le domande più frequenti e come rispondere con sicurezza.',
    },
    {
      icon: LayoutDashboard,
      title: 'CRM e agenda preconfigurati',
      description: 'Non devi imparare software complicati. Non devi comprare attrezzatura. Basta il tuo telefono o computer. Accedi a un pannello semplice dove vedi tutto: appuntamenti, dettagli cliente, esito chiamata.',
    },
    {
      icon: FileText,
      title: 'Script di conversazione (flessibile)',
      description: 'Una traccia testata e ottimizzata — non un copione rigido, ma una struttura collaudata che ti guida: apertura, scoperta dei bisogni, presentazione, gestione obiezioni, chiusura.',
    },
    {
      icon: Headphones,
      title: 'Supporto continuo',
      description: 'Hai una domanda? Un caso particolare? Una cliente difficile? C\'è sempre qualcuno a cui scrivere. Canale diretto, risposte rapide, nessuna burocrazia.',
    },
    {
      icon: TrendingUp,
      title: 'Aggiornamenti e best practice',
      description: 'Il mercato cambia, i prodotti si evolvono. Riceverai periodicamente nuovi materiali, suggerimenti dalle migliori venditrici, e aggiornamenti sui prodotti.',
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-4">
          Non ti lasciamo sola. Mai.
        </h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
          Entrare nella squadra significa ricevere tutto ciò che ti serve per iniziare a vendere — anche se non hai mai lavorato in questo settore specifico.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`bg-gray-50 rounded-2xl p-6 ${
                index === features.length - 1 && features.length % 3 !== 0
                  ? 'lg:col-span-1 md:col-span-2 lg:col-start-2'
                  : ''
              }`}
            >
              <div className="w-12 h-12 bg-[#FDF2F8] rounded-xl flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-[#D946A8]" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
