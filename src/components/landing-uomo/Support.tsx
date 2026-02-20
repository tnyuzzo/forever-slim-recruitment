'use client'

import Image from 'next/image'
import { GraduationCap, MonitorSmartphone, MessageCircle, Laptop } from 'lucide-react'

export default function Support() {
  const supports = [
    {
      icon: <GraduationCap className="w-6 h-6 text-blue-600" />,
      title: 'Formazione iniziale completa',
      desc: 'Senza dover diventare un nutrizionista. Impari come funziona il prodotto, come condurre una consulenza tipo, le obiezioni frequenti e le risposte strutturate. Un metodo, non uno script rigido.'
    },
    {
      icon: <Laptop className="w-6 h-6 text-blue-600" />,
      title: 'CRM e agenda pronti all\'uso',
      desc: 'Siti complessi? Burocrazia? No. Accedi a un pannello immediato, vedi i tuoi appuntamenti del giorno, e aggiorni l\'esito della consultazione in 3 secondi. Basta il tuo telefono o computer.'
    },
    {
      icon: <MessageCircle className="w-6 h-6 text-blue-600" />,
      title: 'Traccia di conversazione testata',
      desc: 'Ricevi una struttura ottimizzata che ti guida nei momenti chiave. Dall\'apertura, alla scoperta dei bisogni, fino alla presentazione dell\'offerta e al colpo finale della vendita.'
    },
    {
      icon: <MonitorSmartphone className="w-6 h-6 text-blue-600" />,
      title: 'Supporto continuo del team',
      desc: 'Hai un dubbio? Un cliente difficile? Noi ci siamo sempre. Canale diretto e risposte immediate dal team di supervisione e dai top performer internazionali.'
    }
  ]

  return (
    <section className="py-20 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4">

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          <div className="relative order-2 lg:order-1">
            <div className="absolute inset-0 bg-blue-100 rounded-[3rem] transform -rotate-3 scale-105" />
            <div className="relative aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl shadow-blue-900/10 border-4 border-white">
              <Image
                src="/images/support_team_man.png"
                alt="Supporto remoto del team"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            {/* Badge floating */}
            <div className="absolute -bottom-6 -right-6 bg-white p-5 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
                <span className="text-xl font-black">24/7</span>
              </div>
              <p className="text-sm font-bold text-slate-900 leading-tight">Team<br /><span className="text-slate-500 font-medium">di Supporto</span></p>
            </div>
          </div>

          <div className="space-y-12 order-1 lg:order-2">
            <div>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
                Non ti lasciamo solo. <span className="text-blue-600">Mai.</span>
              </h2>
              <p className="text-lg text-slate-600 font-medium leading-relaxed">
                Entrare nella nostra rete significa ricevere immediatamente tutto ciò che ti serve per vendere e chiudere, anche se vieni da settori completamente diversi.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-8">
              {supports.map((s, idx) => (
                <div key={idx} className="bg-slate-50 p-6 rounded-3xl border border-slate-100 hover:shadow-lg hover:shadow-slate-200/50 transition-all">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 mb-6">
                    {s.icon}
                  </div>
                  <h4 className="font-bold text-slate-900 mb-3">{s.title}</h4>
                  <p className="text-sm text-slate-600 font-medium leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
