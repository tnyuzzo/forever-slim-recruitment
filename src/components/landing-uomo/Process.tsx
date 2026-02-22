'use client'

import Image from 'next/image'

export default function Process() {
  const steps = [
    {
      num: '01',
      title: 'Candidatura (3 Minuti)',
      desc: 'Compila il form. Chi sei, che esperienza hai, e un paio di domande logiche su come gestisci una vendita reale. Zero burocrazia o test psicologici.',
    },
    {
      num: '02',
      title: 'Valutazione Rapida (24-48h)',
      desc: 'Leggiamo noi ogni candidatura. Niente intelligenza artificiale. Se il tuo profilo è valido, ti ricontattiamo immediatamente per uno screening.',
    },
    {
      num: '03',
      title: 'Colloquio & Onboarding',
      desc: 'Una chiamata di 20 minuti. Non un interrogatorio: ascoltiamo come comunichi. Se andiamo d\'accordo, ricevi subito i materiali e la formazione per iniziare a macinare.',
    }
  ]

  return (
    <section className="py-12 md:py-32 bg-slate-50 relative border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4">

        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
            Come funziona la selezione. <br />
            <span className="text-blue-600">Tre step fluidi, zero attese.</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          <div className="space-y-8">
            {steps.map((step, idx) => (
              <div key={idx} className="relative pl-24 group">
                {/* Connecting line */}
                {idx !== steps.length - 1 && (
                  <div className="absolute left-10 top-20 bottom-[-2rem] w-0.5 bg-slate-200 group-hover:bg-blue-300 transition-colors" />
                )}

                {/* Number node */}
                <div className="absolute left-0 top-0 w-20 h-20 rounded-3xl bg-white border-4 border-slate-50 flex items-center justify-center shadow-xl shadow-slate-200/50 text-2xl font-black text-slate-300 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-100 transition-all duration-300">
                  {step.num}
                </div>

                {/* Content */}
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 group-hover:shadow-xl group-hover:shadow-blue-900/5 group-hover:-translate-y-1 transition-all duration-300">
                  <h4 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h4>
                  <p className="text-slate-600 font-medium leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}

            <div className="pt-6 pl-24">
              <p className="text-sm font-semibold text-slate-500 bg-slate-100 inline-block px-4 py-2 rounded-xl">
                Nota: Se non dovessi essere selezionato, verrai comunque avvisato con rispetto.
              </p>
            </div>
          </div>

          <div className="relative mt-12 lg:mt-0">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-indigo-50 rounded-[3rem] transform rotate-2 lg:scale-105 -z-10" />
            <div className="relative aspect-square lg:aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl shadow-slate-200/50 border-4 border-white bg-white p-8">
              <Image
                src="/images/selection_process.png"
                alt="Processo di selezione rapido"
                fill
                className="object-contain p-8 mix-blend-multiply"
              />
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
