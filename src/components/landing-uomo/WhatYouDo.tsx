import { CheckCircle2, XOctagon } from 'lucide-react'

export default function WhatYouDo() {
  const doItems = [
    'Ricevi un\'agenda con appuntamenti già confermati ogni giorno',
    'Parli con uomini che hanno già mostrato interesse e scelto un orario',
    'Ascolti il cliente, capisci la sua situazione, e lo guidi verso la soluzione',
    'Scegli tu il canale: telefono, WhatsApp o Zoom',
    'Offri una consulenza mirata, non "spingi" un prodotto a caso',
  ]

  const dontItems = [
    { text: 'Chiamate a freddo', desc: 'Zero. Nessuna lista di contatti non richiesti da chiamare.' },
    { text: 'Target da cercare', desc: 'Non devi fare prospecting né usare i tuoi social personali.' },
    { text: 'Pressione o manipolazione', desc: 'Se il cliente non è adatto, lo saluti con enorme rispetto.' },
    { text: 'Gestione logistica', desc: 'Tu fai la consulenza. Il resto (ordini, spedizione) lo gestiamo noi.' },
    { text: 'Burocrazia interna', desc: 'CRM precompilato, massima chiarezza e procedure agili.' },
  ]

  return (
    <section className="py-12 md:py-32 bg-slate-50 relative">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6 tracking-tight">
            Ecco esattamente cosa farai. <br className="hidden md:block" />
            <span className="text-blue-600">E cosa NON dovrai fare mai.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Cosa farai */}
          <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-xl shadow-slate-200/50 border border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">
                Cosa farai
              </h3>
            </div>

            <div className="space-y-6">
              {doItems.map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="mt-1 shrink-0">
                    <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                    </div>
                  </div>
                  <p className="text-slate-700 font-medium leading-relaxed">{item}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-slate-700 text-sm leading-relaxed font-medium">
                <span className="font-bold text-slate-900">In sintesi:</span> Non vendi a freddo. Offri consulenza. Parli con uomini che hanno un problema reale legato al controllo del peso e tu proponi loro la soluzione aziendale. Quando il prodotto è valido, la conversazione scorre liscia e naturale.
              </p>
            </div>
          </div>

          {/* Cosa NON farai */}
          <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-xl shadow-slate-200/50 border border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center shrink-0">
                <XOctagon className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">
                Cosa NON farai
              </h3>
            </div>

            <div className="space-y-8">
              {dontItems.map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="mt-1 shrink-0">
                    <div className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center">
                      <div className="w-2 h-0.5 rounded-full bg-red-500" />
                    </div>
                  </div>
                  <div>
                    <p className="text-slate-900 font-bold mb-1">{item.text}</p>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed">{item.desc}</p>
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
