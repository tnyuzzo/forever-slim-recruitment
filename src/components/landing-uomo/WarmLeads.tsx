'use client'

import { Flame, Target, CalendarDays, ThumbsUp } from 'lucide-react'

export default function WarmLeads() {
  return (
    <section className="py-20 md:py-32 bg-white relative overflow-hidden">
      {/* Decorative background blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-50/50 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Content */}
          <div className="space-y-8">
            <div>
              <div className="inline-flex items-center justify-center p-3 bg-red-50 text-red-500 rounded-2xl mb-6">
                <Flame className="w-8 h-8" />
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight mb-6">
                Perché lavorare con "lead caldi"
                <span className="text-blue-600 block mt-2">cambia le regole del gioco.</span>
              </h2>
              <p className="text-lg text-slate-600 font-medium leading-relaxed">
                Se hai lavorato nella vendita, sai che il 90% della fatica è trovare qualcuno che voglia ascoltarti. <strong className="text-slate-900">Qui quel problema è a zero.</strong>
              </p>
            </div>

            <div className="space-y-6">
              <p className="text-slate-600 leading-relaxed font-medium">
                Le nostre potenziali clienti arrivano da campagne pubblicitarie mirate e massicce. Prima di parlare con te, una donna ha già:
              </p>

              <ul className="space-y-4">
                {[
                  'Visto un nostro contenuto informativo e cliccato',
                  'Compilato un questionario di pre-qualifica',
                  'Scelto attivamente un giorno e un orario per la consulenza'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0 font-bold">
                      {idx + 1}
                    </div>
                    <span className="text-slate-700 font-semibold mt-1">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="p-6 bg-blue-600 rounded-2xl text-white shadow-xl shadow-blue-600/20 mt-8">
                <p className="font-medium text-lg leading-relaxed">
                  Tu non devi convincere a restare al telefono nessuno. Tu aiuti chi <strong className="font-black text-white decoration-white underline underline-offset-4 decoration-2">ha già deciso</strong> di informarsi.
                </p>
              </div>
            </div>
          </div>

          {/* Visual / Infographic */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-indigo-50 rounded-[3rem] transform rotate-3 scale-105 -z-10" />
            <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 mb-8 text-center uppercase tracking-wider text-sm">Flusso Operativo</h3>

              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-[31px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-blue-200 before:via-blue-200 before:to-transparent">

                {/* Step 1 */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full border-4 border-white bg-blue-50 text-blue-600 shadow-lg shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-transform hover:scale-110">
                    <Target className="w-6 h-6" />
                  </div>
                  <div className="w-[calc(100%-5rem)] md:w-[calc(50%-3rem)] bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                    <h4 className="font-bold text-slate-900">La cliente vede l'annuncio</h4>
                    <p className="text-sm text-slate-500 font-medium mt-1">Clicca e compila il questionario di idoneità</p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full border-4 border-white bg-blue-50 text-blue-600 shadow-lg shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-transform hover:scale-110">
                    <CalendarDays className="w-6 h-6" />
                  </div>
                  <div className="w-[calc(100%-5rem)] md:w-[calc(50%-3rem)] bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                    <h4 className="font-bold text-slate-900">Prenota l'appuntamento</h4>
                    <p className="text-sm text-slate-500 font-medium mt-1">Sceglie un giorno e orario nella tua agenda</p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full border-4 border-white bg-blue-600 text-white shadow-lg shadow-blue-600/30 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-transform hover:scale-110">
                    <ThumbsUp className="w-6 h-6" />
                  </div>
                  <div className="w-[calc(100%-5rem)] md:w-[calc(50%-3rem)] bg-blue-50 p-5 rounded-2xl border border-blue-100">
                    <h4 className="font-bold text-blue-900">Tu la chiami</h4>
                    <p className="text-sm text-blue-700 font-medium mt-1">Esegui la consulenza e chiudi la proposta in totale comfort</p>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
