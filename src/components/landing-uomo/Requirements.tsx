import { CheckCircle, XCircle } from 'lucide-react'

export default function Requirements() {
  const goodFit = [
    { title: 'Parli italiano in modo impeccabile.', desc: 'Nessun accento marcato straniero o dialettale troppo forte. I nostri clienti sono italiani.' },
    { title: 'Sei puntuale. Punto.', desc: 'Nessun ritardo alle consulenze, nessuna scusa. Il cliente ha prenotato il TUO tempo.' },
    { title: 'Sai ascoltare prima di parlare.', desc: 'La vendita consulenziale parte dall\'ascolto e comprensione del bisogno reale.' },
    { title: 'Hai empatia autentica.', desc: 'Parli con uomini che spesso si portano dietro frustrazione per il loro peso e la forma fisica. Serve rispetto, fermezza e zero giudizio.' },
    { title: 'Hai almeno 4 ore/giorno e 3 gg/settimana.', desc: 'Questo è il minimo indispensabile per avere un flusso di clienti continuativo.' },
    { title: 'Sei autonomo e affidabile.', desc: 'Nessun capo col fiato sul collo. C\'è un sistema che ti supporta, ma la responsabilità e la costanza sono tue.' },
  ]

  const badFit = [
    'Cerchi un fisso mensile garantito (qui si lavora a provvigione)',
    'Non puoi garantire costanza fissa (sparire per giorni senza preavviso è inaccettabile)',
    'Pensi che vendere significhi raggirare o opprimere la persona',
    'Non hai un ambiente di lavoro silenzioso per le tue call da casa',
    'Ti senti in imbarazzo a parlare di peso e benessere fisico femminile'
  ]

  return (
    <section className="py-12 md:py-32 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
            Chi cerchiamo. <br className="hidden md:block" />
            <span className="text-slate-400">E chi NON cerchiamo.</span>
          </h2>
          <p className="text-lg text-slate-600 font-medium leading-relaxed">
            Non giudichiamo il CV accademico. Valutiamo le tue skill di persuasione, il tuo rigore e la tua etica lavorativa.
          </p>
        </div>

        <div className="grid md:grid-cols-12 gap-8 lg:gap-12">

          {/* Cerchiamo Te */}
          <div className="md:col-span-7 bg-white p-8 md:p-10 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100">
            <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-blue-600" />
              Cerchiamo TE se:
            </h3>
            <div className="space-y-6">
              {goodFit.map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{item.title}</h4>
                    <p className="text-slate-600 text-sm font-medium mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* NON è per te */}
          <div className="md:col-span-5 bg-slate-900 p-8 md:p-10 rounded-[2rem] shadow-2xl shadow-slate-900/20 text-white">
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
              <XCircle className="w-8 h-8 text-red-500" />
              NON fa per te se:
            </h3>
            <ul className="space-y-6">
              {badFit.map((item, index) => (
                <li key={index} className="flex items-start gap-4">
                  <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <span className="text-slate-300 font-medium leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </section>
  )
}
