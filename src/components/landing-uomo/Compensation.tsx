'use client'

import { Info, TrendingUp, AlertTriangle } from 'lucide-react'

export default function Compensation() {
  return (
    <section className="py-20 md:py-32 bg-slate-900 text-white relative">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">
            I numeri. <span className="text-blue-400">Senza giri di parole.</span>
          </h2>
          <p className="text-lg text-slate-400 font-medium leading-relaxed">
            Collaborazione a provvigione pura. Nessun tetto massimo. <br className="hidden md:block" />Guadagni il <strong className="text-white">10% su ogni singola vendita conclusa</strong>, in modo trasparente e diretto.
          </p>
        </div>

        {/* Product Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-16">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-8 rounded-3xl flex flex-col items-center justify-center text-center">
            <h3 className="text-slate-400 font-bold mb-2 uppercase tracking-widest text-sm">Kit Singolo (1 Mese)</h3>
            <div className="text-3xl font-black text-white mb-1">€19,70 <span className="text-base font-medium text-slate-500">/ vendita</span></div>
            <p className="text-sm font-medium text-slate-500 mt-2">(Su prezzo cliente €197)</p>
          </div>
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 rounded-3xl flex flex-col items-center justify-center text-center shadow-xl shadow-blue-900/50 border border-blue-500">
            <div className="inline-flex items-center gap-1.5 bg-blue-500/30 text-blue-100 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
              <TrendingUp className="w-3.5 h-3.5" /> Il più venduto
            </div>
            <h3 className="text-blue-200 font-bold mb-2 uppercase tracking-widest text-sm">Kit Completo (3 Mesi)</h3>
            <div className="text-3xl lg:text-4xl font-black text-white mb-1">€39,90 <span className="text-base font-medium text-blue-300">/ vendita</span></div>
            <p className="text-sm font-medium text-blue-300 mt-2">(Su prezzo cliente €399)</p>
          </div>
        </div>

        <div className="text-center mb-10">
          <h3 className="text-2xl font-bold text-white mb-4">Simulazioni Scenari Mensili</h3>
          <p className="text-slate-400 font-medium">Calcolati considerando una maggioranza di pacchetti da 3 mesi, come statisticamente avviene.</p>
        </div>

        {/* Scenarios */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {/* Scenario A */}
          <div className="bg-slate-800 p-8 rounded-[2rem] border border-slate-700">
            <h4 className="font-bold text-slate-300 mb-2">Impegno Costante</h4>
            <div className="text-3xl font-black text-white mb-4">~€2.500<span className="text-lg text-slate-500">/mese</span></div>
            <ul className="space-y-3 text-sm text-slate-400 font-medium">
              <li className="flex justify-between border-b border-slate-700 pb-2"><span>Ore/Giorno</span> <span className="text-white">5 ore</span></li>
              <li className="flex justify-between border-b border-slate-700 pb-2"><span>Giorni/Sett.</span> <span className="text-white">5 giorni</span></li>
              <li className="flex justify-between"><span>Close Rate</span> <span className="text-white">35%</span></li>
            </ul>
          </div>

          {/* Scenario B */}
          <div className="bg-slate-800 p-8 rounded-[2rem] border border-blue-500/30 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-blue-500" />
            <h4 className="font-bold text-blue-400 mb-2">Ritmo Sostenuto</h4>
            <div className="text-4xl font-black text-white mb-4">~€3.400<span className="text-lg text-slate-500">/mese</span></div>
            <ul className="space-y-3 text-sm text-slate-400 font-medium">
              <li className="flex justify-between border-b border-slate-700 pb-2"><span>Ore/Giorno</span> <span className="text-white">6 ore</span></li>
              <li className="flex justify-between border-b border-slate-700 pb-2"><span>Giorni/Sett.</span> <span className="text-white">5-6 giorni</span></li>
              <li className="flex justify-between"><span>Close Rate</span> <span className="text-white">35%</span></li>
            </ul>
          </div>

          {/* Scenario C */}
          <div className="bg-slate-800 p-8 rounded-[2rem] border border-slate-700">
            <h4 className="font-bold text-slate-300 mb-2">Performance Top</h4>
            <div className="text-3xl font-black text-white mb-4">~€5.000<span className="text-lg text-slate-500">/mese</span></div>
            <ul className="space-y-3 text-sm text-slate-400 font-medium">
              <li className="flex justify-between border-b border-slate-700 pb-2"><span>Ore/Giorno</span> <span className="text-white">7-8 ore</span></li>
              <li className="flex justify-between border-b border-slate-700 pb-2"><span>Giorni/Sett.</span> <span className="text-white">6 giorni</span></li>
              <li className="flex justify-between"><span>Close Rate</span> <span className="text-white">40%</span></li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 text-slate-400 text-xs leading-relaxed max-w-5xl mx-auto flex items-start gap-4">
          <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5 text-slate-500" />
          <p>
            <strong>DISCLAIMER GUADAGNI:</strong> I guadagni indicati sopra sono stime basate su scenari ipotetici e dati osservati internamente. Non costituiscono in alcun modo una promessa, garanzia o previsione di risultato. I risultati effettivi variano significativamente in base a molteplici fattori individuali, tra cui: ore effettivamente lavorate, giorni di attività, competenze personali di vendita e comunicazione, esperienza pregressa, capacità di ascolto e gestione delle obiezioni, e condizioni generali di mercato. Molti collaboratori ottengono risultati superiori agli scenari indicati, altri ampiamente inferiori. La collaborazione è a provvigione variabile — non è previsto alcun compenso fisso o minimo garantito.
          </p>
        </div>

      </div>
    </section>
  )
}
