'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    question: 'Devo avere esperienza nella vendita?',
    answer: 'Esperienza pregressa nella vendita telefonica o consulenziale è fortemente preferita, ma non è l\'unico criterio. Valutiamo la persona nel suo insieme: capacità comunicative, empatia, affidabilità. Se non hai esperienza diretta ma hai lavorato a contatto con il pubblico (assistenza clienti, reception, consulenza), potresti comunque essere un buon profilo.',
  },
  {
    question: 'C\'è un fisso mensile?',
    answer: 'No. La collaborazione è interamente a provvigione — 10% su ogni vendita conclusa. Non è previsto alcun compenso fisso, minimo garantito o rimborso spese. Guadagni in proporzione diretta ai risultati che ottieni.',
  },
  {
    question: 'Come funziona il pagamento delle provvigioni?',
    answer: 'Le provvigioni vengono calcolate sulle vendite effettivamente concluse e pagate. Riceverai un riepilogo periodico e il pagamento secondo le tempistiche concordate al momento dell\'onboarding.',
  },
  {
    question: 'Quante ore devo lavorare?',
    answer: 'Il minimo richiesto è 4 ore al giorno per almeno 3 giorni a settimana. Questo è il livello minimo per ricevere un numero sufficiente di appuntamenti. Molte collaboratrici lavorano 5-6 ore al giorno, 5 giorni a settimana, e ottengono risultati significativamente migliori.',
  },
  {
    question: 'Posso scegliere i miei orari?',
    answer: 'Hai flessibilità nella scelta delle fasce orarie, che concorderai in fase di onboarding. Gli appuntamenti vengono assegnati nelle fasce che hai indicato come disponibili. Una volta confermata una fascia, però, è fondamentale essere presente e puntuale.',
  },
  {
    question: 'Si lavora anche nel weekend o nei festivi?',
    answer: 'La disponibilità nel weekend e nei giorni festivi non è obbligatoria, ma è un plus che viene valutato positivamente. Te lo chiederemo nel form di candidatura.',
  },
  {
    question: 'Da dove posso lavorare? Mi serve attrezzatura speciale?',
    answer: 'Da qualsiasi luogo con una connessione internet stabile e un ambiente ragionevolmente tranquillo. Non servono cuffiette professionali, microfoni esterni o attrezzatura speciale — basta il tuo telefono o il tuo computer.',
  },
  {
    question: 'Che tipo di prodotti venderò?',
    answer: 'Opererai nel settore cosmetici e integratori alimentari per il controllo del peso. Si tratta di prodotti di alta qualità destinati a donne adulte. Riceverai una formazione completa sul prodotto prima di iniziare.',
  },
  {
    question: 'Cosa succede se una cliente non è convinta?',
    answer: 'La ringrazi e la saluti con rispetto. Non c\'è alcuna pressione per "chiudere a tutti i costi". Se il prodotto non è adatto alla cliente, la conversazione si chiude cordialmente. L\'etica nella vendita è il nostro standard.',
  },
  {
    question: 'Ho bisogno di partita IVA?',
    answer: 'La collaborazione è di natura autonoma/freelance. Le specifiche fiscali e contrattuali vengono discusse in fase di onboarding. È responsabilità di ogni collaboratrice assicurarsi di operare in conformità con la normativa fiscale del proprio paese.',
  },
  {
    question: 'C\'è un periodo di prova?',
    answer: 'Sì, è previsto un periodo iniziale di valutazione reciproca. Serve a te per capire se questa collaborazione è adatta, e a noi per valutare la qualità della tua attività. Le condizioni specifiche vengono definite all\'onboarding.',
  },
  {
    question: 'Posso candidarmi se vivo fuori dall\'Italia?',
    answer: 'Sì, a condizione che il tuo italiano sia perfetto e naturale — senza accento straniero marcato. Le clienti sono italiane e devono sentirsi completamente a loro agio nella conversazione. Questo è un criterio non negoziabile.',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-10 md:py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-4">
          Domande frequenti — le risposte che cercavi.
        </h2>
        <p className="text-gray-600 text-center mb-12">
          Tutto quello che devi sapere prima di candidarti.
        </p>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => toggle(index)}
                className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-200 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="p-5 pt-0 text-gray-600 text-sm leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
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
