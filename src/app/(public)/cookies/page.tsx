import Link from 'next/link'

export default function CookiesPage() {
    return (
        <div className="min-h-screen bg-bg-alt py-12 px-4">
            <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-3xl border border-gray-100 shadow-sm prose prose-sm md:prose-base prose-slate">
                <h1 className="text-3xl font-black mb-8 text-text-main">Informativa Estesa sui Cookie (Cookie Policy)</h1>

                <p className="mb-4 text-text-muted"><strong>Ultimo aggiornamento: {new Date().toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })}</strong></p>

                <h2 className="text-xl font-bold mt-8 mb-4">1. Cosa sono i Cookie</h2>
                <p className="text-text-muted mb-4">I cookie sono piccole stringhe di testo che i siti visitati dall&apos;utente inviano al suo terminale, dove vengono memorizzati, per essere poi ritrasmessi agli stessi siti alla successiva visita del medesimo utente.</p>

                <h2 className="text-xl font-bold mt-8 mb-4">2. Cookie Tecnici Strettamente Necessari</h2>
                <p className="text-text-muted mb-4">Questo sito web utilizza cookie strettamente necessari per il funzionamento della piattaforma e per consentire all&apos;utente di candidarsi in modo sicuro tramite il modulo multi-step. Questi cookie non richiedono un consenso preventivo.</p>
                <ul className="list-disc pl-6 text-text-muted space-y-2 mb-4">
                    <li><strong>Cookie di sessione:</strong> Garantiscono la normale navigazione e il corretto caricamento del form multi-step.</li>
                </ul>

                <h2 className="text-xl font-bold mt-8 mb-4">3. Cookie Analitici e di Profilazione Terze Parti</h2>
                <p className="text-text-muted mb-4">
                    Questo sito utilizza i seguenti servizi di terze parti:
                </p>
                <ul className="list-disc pl-6 text-text-muted space-y-2 mb-4">
                    <li><strong>PostHog</strong> — Piattaforma di analisi prodotto per comprendere come gli utenti interagiscono con il sito (pageview, funnel di candidatura). I dati sono ospitati su server nell&apos;Unione Europea (eu.posthog.com).</li>
                    <li><strong>Meta Pixel</strong> — Pixel di tracciamento per monitorare l&apos;efficacia delle inserzioni pubblicitarie su Facebook e Instagram (es. completamento candidatura).</li>
                    <li><strong>Sentry</strong> — Servizio di monitoraggio errori per garantire il corretto funzionamento tecnico del sito. Non raccoglie dati personali identificativi.</li>
                </ul>
                <p className="text-text-muted mb-4">
                    Il consenso per i cookie analitici e di profilazione è richiesto tramite il banner informativo al primo accesso al sito.
                </p>

                <h2 className="text-xl font-bold mt-8 mb-4">4. Gestione delle Preferenze</h2>
                <p className="text-text-muted mb-4">L&apos;utente può navigare sul sito limitando l&apos;uso dei cookie non essenziali tramite il banner iniziale o interagendo con le impostazioni del proprio browser. La disattivazione dei cookie analitici non pregiudica la funzionalità del sito.</p>

                <h2 className="text-xl font-bold mt-8 mb-4">5. Ulteriori Informazioni</h2>
                <p className="text-text-muted mb-4">Per qualsiasi domanda relativa alla gestione dei cookie, contattaci all&apos;indirizzo <a href="mailto:info@closeragency.eu" className="text-primary-main underline">info@closeragency.eu</a>.</p>

                <div className="mt-12 pt-6 border-t border-gray-100">
                    <Link href="/" className="text-primary-main hover:underline font-semibold">&larr; Torna alla Home</Link>
                </div>
            </div>
        </div>
    )
}
