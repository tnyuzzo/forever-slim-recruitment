import Link from 'next/link'

export default function CookiesPage() {
    return (
        <div className="min-h-screen bg-bg-alt py-12 px-4">
            <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-3xl border border-gray-100 shadow-sm prose prose-sm md:prose-base prose-slate">
                <h1 className="text-3xl font-black mb-8 text-text-main">Informativa Estesa sui Cookie (Cookie Policy)</h1>

                <p className="mb-4 text-text-muted"><strong>Ultimo aggiornamento: [Data odierna]</strong></p>

                <h2 className="text-xl font-bold mt-8 mb-4">1. Cosa sono i Cookie</h2>
                <p className="text-text-muted mb-4">I cookie sono piccole stringhe di testo che i siti visitati dall'utente inviano al suo terminale, dove vengono memorizzati, per essere poi ritrasmessi agli stessi siti alla successiva visita del medesimo utente.</p>

                <h2 className="text-xl font-bold mt-8 mb-4">2. Cookie Tecnici Strettamente Necessari</h2>
                <p className="text-text-muted mb-4">Questo sito web utilizza cookie strettamente necessari per il funzionamento della piattaforma e per consentire all'utente di candidarsi in modo sicuro tramite il modulo multi-step. Questi cookie non richiedono un consenso preventivo.</p>
                <ul className="list-disc pl-6 text-text-muted space-y-2 mb-4">
                    <li><strong>Cookie di sessione:</strong> Garantiscono la normale navigazione e il corretto caricamento del form multi-step.</li>
                </ul>

                <h2 className="text-xl font-bold mt-8 mb-4">3. Cookie Analitici e di Profilazione Terze Parti</h2>
                <p className="text-text-muted mb-4">
                    Questo sito potrebbe incorporare cookie analitici (es. Google Analytics/PostHog) per analizzare il traffico sulla landing page, al solo fine di ottimizzare la conversione della campagna di reclutamento in modo aggregato.
                    Potremmo inoltre utilizzare pixel (es. Meta Pixel) per monitorare l'efficacia delle inserzioni pubblicitarie (chi ha completato il form). Il consenso per questi cookie è esplicitamente richiesto tramite banner al primo accesso.
                </p>

                <h2 className="text-xl font-bold mt-8 mb-4">4. Gestione delle Preferenze</h2>
                <p className="text-text-muted mb-4">L'utente può navigare sul sito limitando l'uso dei non essenziali tramite il banner cookie iniziale o interagendo con le impostazioni del proprio browser.</p>

                <div className="mt-12 pt-6 border-t border-gray-100">
                    <Link href="/" className="text-primary-main hover:underline font-semibold">&larr; Torna alla Home</Link>
                </div>
            </div>
        </div>
    )
}
