import Link from 'next/link'

export function Footer() {
    return (
        <footer className="bg-gray-50 border-t border-gray-200 py-12 px-4 md:px-8 mt-auto">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Disclaimer Collaborazione */}
                <div className="text-xs text-text-muted leading-relaxed">
                    <p className="mb-2"><strong>Disclaimer collaborazione:</strong> Questa opportunità si configura come collaborazione autonoma/freelance a provvigione. Non costituisce un rapporto di lavoro subordinato. Non è previsto alcun compenso fisso, minimo garantito o rimborso spese. Le provvigioni vengono corrisposte esclusivamente sulle vendite effettivamente concluse.</p>

                    <p className="mb-2"><strong>Disclaimer guadagni:</strong> Tutti i riferimenti a guadagni, range e scenari economici presenti in questa pagina sono puramente indicativi e basati su dati interni osservati. Non costituiscono una promessa, garanzia o previsione di risultato. I guadagni effettivi dipendono da molteplici fattori individuali e di mercato, tra cui: ore lavorate, giorni di attività, competenze, esperienza e condizioni generali del settore.</p>

                    <p className="mb-2"><strong>Disclaimer Meta/Google:</strong> Dichiarazione di esclusione di responsabilità: Questo sito non è affiliato, associato, autorizzato, approvato o in alcun modo ufficialmente collegato a Meta Platforms, Inc. (Facebook/Instagram) o a Google LLC. Tutti i nomi e i marchi citati sono di proprietà dei rispettivi titolari.</p>

                    <p><strong>Disclaimer risultati e salute:</strong> Questo prodotto non è inteso per diagnosticare, trattare, curare o prevenire alcuna malattia. I risultati possono variare da persona a persona e dipendono da diversi fattori, tra cui la costituzione fisica, la dieta e l'esercizio fisico. Le testimonianze riportate sono esperienze individuali reali e non garantiscono risultati simili per tutti. Consultare sempre un medico prima di iniziare qualsiasi programma di perdita di peso o modifica del proprio stile di vita.</p>
                </div>

                {/* Links Legali */}
                <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-text-muted">
                    <div className="flex flex-wrapjustify-center gap-4">
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
