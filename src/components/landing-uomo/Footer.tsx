'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Disclaimers */}
        <div className="space-y-6 mb-12">
          {/* Collaborazione disclaimer */}
          <div className="text-xs leading-relaxed">
            <p className="text-gray-500 uppercase tracking-wider mb-2 text-[10px]">Disclaimer Collaborazione</p>
            <p>
              Questa opportunità si configura come collaborazione autonoma/freelance a provvigione.
              Non costituisce un rapporto di lavoro subordinato. Non è previsto alcun compenso fisso,
              minimo garantito o rimborso spese. Le provvigioni vengono corrisposte esclusivamente
              sulle vendite effettivamente concluse.
            </p>
          </div>

          {/* Guadagni disclaimer */}
          <div className="text-xs leading-relaxed">
            <p className="text-gray-500 uppercase tracking-wider mb-2 text-[10px]">Disclaimer Guadagni</p>
            <p>
              Tutti i riferimenti a guadagni, range e scenari economici presenti in questa pagina
              sono puramente indicativi e basati su dati interni osservati. Non costituiscono una
              promessa, garanzia o previsione di risultato. I guadagni effettivi dipendono da
              molteplici fattori individuali e di mercato, tra cui: ore lavorate, giorni di attività,
              competenze, esperienza e condizioni generali del settore.
            </p>
          </div>

          {/* Meta/Google disclaimer */}
          <div className="text-xs leading-relaxed">
            <p className="text-gray-500 uppercase tracking-wider mb-2 text-[10px]">Dichiarazione di Non Affiliazione</p>
            <p>
              Questo sito non è affiliato, associato, autorizzato, approvato o in alcun modo
              ufficialmente collegato a Meta Platforms, Inc. (Facebook/Instagram) o a Google LLC.
              Tutti i nomi e i marchi citati sono di proprietà dei rispettivi titolari.
            </p>
          </div>

          {/* Health disclaimer */}
          <div className="text-xs leading-relaxed">
            <p className="text-gray-500 uppercase tracking-wider mb-2 text-[10px]">Dichiarazione sui Risultati e Salute</p>
            <p>
              Questo prodotto non è inteso per diagnosticare, trattare, curare o prevenire alcuna malattia.
              I risultati possono variare da persona a persona e dipendono da diversi fattori, tra cui
              la costituzione fisica, la dieta e l&apos;esercizio fisico. Le testimonianze riportate sono
              esperienze individuali reali e non garantiscono risultati simili per tutti. Consultare
              sempre un medico prima di iniziare qualsiasi programma di perdita di peso.
            </p>
          </div>
        </div>

        {/* Legal links */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-sm">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span className="text-gray-700">|</span>
            <Link href="/cookies" className="hover:text-white transition-colors">
              Cookie Policy
            </Link>
            <span className="text-gray-700">|</span>
            <Link href="/terms" className="hover:text-white transition-colors">
              Termini &amp; Condizioni
            </Link>
          </div>

          <div className="text-center md:text-right">
            <p className="text-sm font-medium text-gray-300">Swiss Research Labs GmbH</p>
            <p className="text-xs">Industriestrasse 47, 6300 Zug, Svizzera</p>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-xs">
          <p>© 2026 Swiss Research Labs. Tutti i diritti riservati.</p>
        </div>
      </div>
    </footer>
  )
}
