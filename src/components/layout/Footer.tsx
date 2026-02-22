"use client"

import Link from 'next/link'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const DISCLAIMERS = [
    {
        title: 'Disclaimer collaborazione',
        body: 'Questa opportunità si configura come collaborazione autonoma/freelance a provvigione. Non costituisce un rapporto di lavoro subordinato. Non è previsto alcun compenso fisso, minimo garantito o rimborso spese. Le provvigioni vengono corrisposte esclusivamente sulle vendite effettivamente concluse.'
    },
    {
        title: 'Disclaimer guadagni',
        body: 'Tutti i riferimenti a guadagni, range e scenari economici presenti in questa pagina sono puramente indicativi e basati su dati interni osservati. Non costituiscono una promessa, garanzia o previsione di risultato. I guadagni effettivi dipendono da molteplici fattori individuali e di mercato, tra cui: ore lavorate, giorni di attività, competenze, esperienza e condizioni generali del settore.'
    },
    {
        title: 'Disclaimer Meta / Google',
        body: 'Questo sito non è affiliato, associato, autorizzato, approvato o in alcun modo ufficialmente collegato a Meta Platforms, Inc. (Facebook/Instagram) o a Google LLC. Tutti i nomi e i marchi citati sono di proprietà dei rispettivi titolari.'
    },
    {
        title: 'Disclaimer risultati e salute',
        body: 'Questo prodotto non è inteso per diagnosticare, trattare, curare o prevenire alcuna malattia. I risultati possono variare da persona a persona e dipendono da diversi fattori, tra cui la costituzione fisica, la dieta e l\'esercizio fisico. Le testimonianze riportate sono esperienze individuali reali e non garantiscono risultati simili per tutti. Consultare sempre un medico prima di iniziare qualsiasi programma di perdita di peso o modifica del proprio stile di vita.'
    },
]

export function Footer() {
    const [openIndex, setOpenIndex] = useState<number | null>(null)

    return (
        <footer className="bg-gray-50 border-t border-gray-200 py-12 px-4 md:px-8 mt-auto">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Disclaimer Accordion */}
                <div className="space-y-2">
                    <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Note legali</p>
                    {DISCLAIMERS.map((d, i) => (
                        <div key={i} className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                            <button
                                type="button"
                                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                className="w-full flex items-center justify-between px-4 py-3 text-left"
                            >
                                <span className="text-xs font-semibold text-text-muted">{d.title}</span>
                                <ChevronDown
                                    className={`w-4 h-4 text-text-muted shrink-0 transition-transform duration-200 ${openIndex === i ? 'rotate-180' : ''}`}
                                />
                            </button>
                            {openIndex === i && (
                                <div className="px-4 pb-4 text-xs text-text-muted leading-relaxed border-t border-gray-100 pt-3">
                                    {d.body}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Links Legali */}
                <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-text-muted">
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/privacy" className="hover:text-primary-main">Privacy Policy</Link>
                        <span>|</span>
                        <Link href="/cookies" className="hover:text-primary-main">Cookie Policy</Link>
                        <span>|</span>
                        <Link href="/terms" className="hover:text-primary-main">Termini & Condizioni</Link>
                    </div>

                    <div className="text-center md:text-right">
                        <p><strong>Swiss Research Labs GmbH</strong></p>
                        <p>Industriestrasse 47, 6300 Zug, Svizzera</p>
                        <p className="mt-2">© {new Date().getFullYear()} Swiss Research Labs. Tutti i diritti riservati.</p>
                    </div>
                </div>

            </div>
        </footer>
    )
}
