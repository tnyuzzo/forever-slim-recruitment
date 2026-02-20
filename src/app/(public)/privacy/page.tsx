import Link from 'next/link'

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-bg-alt py-12 px-4">
            <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-3xl border border-gray-100 shadow-sm prose prose-sm md:prose-base prose-slate">
                <h1 className="text-3xl font-black mb-8 text-text-main">Informativa sulla Privacy (Privacy Policy)</h1>

                <p className="mb-4 text-text-muted"><strong>Ultimo aggiornamento: [Data odierna]</strong></p>

                <h2 className="text-xl font-bold mt-8 mb-4">1. Titolare del Trattamento</h2>
                <p className="text-text-muted mb-4">
                    Swiss Research Labs GmbH<br />
                    Industriestrasse 47, 6300 Zug, Svizzera<br />
                    Email di contatto: dpo@swissresearchlabs.com
                </p>

                <h2 className="text-xl font-bold mt-8 mb-4">2. Dati Raccolti</h2>
                <p className="text-text-muted mb-4">Raccogliamo i seguenti Dati Personali ai fini del processo di selezione (recruiting):</p>
                <ul className="list-disc pl-6 text-text-muted space-y-2 mb-4">
                    <li>Dati anagrafici e di contatto (Nome, Cognome, Email, Numero di Telefono, Città, Nazione).</li>
                    <li>Informazioni professionali (Anni di esperienza, settori di competenza).</li>
                    <li>Dati multimediali (Eventuali registrazioni audio volontariamente fornite tramite il modulo).</li>
                    <li>Dati di navigazione e utilizzo della landing page.</li>
                </ul>

                <h2 className="text-xl font-bold mt-8 mb-4">3. Finalità del Trattamento</h2>
                <p className="text-text-muted mb-4">I dati sono trattati esclusivamente per le seguenti finalità:</p>
                <ul className="list-disc pl-6 text-text-muted space-y-2 mb-4">
                    <li>Valutazione della candidatura per l'opportunità di collaborazione indipendente proposta.</li>
                    <li>Comunicazione con il candidato (via Email, Telefono o WhatsApp) in merito alle fasi di selezione.</li>
                    <li>Gestione interna del database candidature.</li>
                </ul>

                <h2 className="text-xl font-bold mt-8 mb-4">4. Base Giuridica del Trattamento</h2>
                <p className="text-text-muted mb-4">La base giuridica è l'esecuzione di misure precontrattuali adottate su richiesta dell'interessato (art. 6 co. 1 lett. b) GDPR) e il consenso esplicito, in particolare per il trattamento dei dati audio e le comunicazioni via WhatsApp.</p>

                <h2 className="text-xl font-bold mt-8 mb-4">5. Conservazione dei Dati</h2>
                <p className="text-text-muted mb-4">I dati delle candidature non selezionate verranno conservati per un periodo massimo di 12 mesi dalla data di ricezione, al fine di valutazioni per future opportunità. Il file audio, se depositato, verrà eliminato dopo 6 mesi dalla conclusione della selezione odierna in caso di esito negativo.</p>

                <h2 className="text-xl font-bold mt-8 mb-4">6. Diritti dell'Interessato</h2>
                <p className="text-text-muted mb-4">In conformità al GDPR, hai il diritto di richiedere in qualsiasi momento l'accesso, la rettifica, la cancellazione dei dati, la limitazione del trattamento. Potrai esercitare questi diritti inviando una email all'indirizzo sopra indicato.</p>

                <div className="mt-12 pt-6 border-t border-gray-100">
                    <Link href="/" className="text-primary-main hover:underline font-semibold">&larr; Torna alla Home</Link>
                </div>
            </div>
        </div>
    )
}
