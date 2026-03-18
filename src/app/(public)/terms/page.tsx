import Link from 'next/link'

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-bg-alt py-12 px-4">
            <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-3xl border border-gray-100 shadow-sm prose prose-sm md:prose-base prose-slate">
                <h1 className="text-3xl font-black mb-8 text-text-main">Termini & Condizioni</h1>

                <p className="mb-4 text-text-muted"><strong>Ultimo aggiornamento: {new Date().toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })}</strong></p>

                <h2 className="text-xl font-bold mt-8 mb-4">1. Natura dell&apos;Opportunità</h2>
                <p className="text-text-muted mb-4">La presente pagina web promuove un&apos;opportunità di collaborazione autonoma (freelance) per conto di Swiss Research Labs GmbH nel settore del benessere e della cura della persona.</p>
                <p className="text-text-muted mb-4">Questa candidatura NON costituisce una promessa di assunzione, né avvia un processo per l&apos;instaurazione di un rapporto di lavoro subordinato (dipendente).</p>

                <h2 className="text-xl font-bold mt-8 mb-4">2. Assenza di Esclusiva ed Etica</h2>
                <p className="text-text-muted mb-4">La collaborazione offerta non prevede vincolo di esclusiva, subordinazione gerarchica o rigidità oraria, se non quelle funzionali e concordate per l&apos;ottimale gestione del flusso di contatti forniti dall&apos;azienda. È richiesta massima serietà ed etica nella gestione delle comunicazioni verso le clienti finali.</p>

                <h2 className="text-xl font-bold mt-8 mb-4">3. Compensi e Risultati</h2>
                <p className="text-text-muted mb-4">Le provvigioni e i potenziali ritorni economici citati nelle simulazioni della pagina hanno finalità illustrativa e sono calcolati su dati aggregati. Nessun risultato economico netto è garantito. Il compenso è maturato unicamente sulla base delle vendite (con pagamento a buon fine) generate.</p>

                <h2 className="text-xl font-bold mt-8 mb-4">4. Obbligo di Riservatezza</h2>
                <p className="text-text-muted mb-4">Compilando il modulo di candidatura in tutte le sue fasi, l&apos;utente si impegna a: non diffondere o copiare i testi delle prove pratiche; mantenere riservate le informazioni eventualmente fornite in sede di colloquio conoscitivo, incluse le specifiche commerciali discusse con i referenti aziendali.</p>

                <h2 className="text-xl font-bold mt-8 mb-4">5. Reiezione della Candidatura</h2>
                <p className="text-text-muted mb-4">L&apos;azienda si riserva il diritto insindacabile di rifiutare una candidatura in qualunque momento, inclusa la qualifica attraverso regole automatiche del questionario motivato dalla difformità ai requisiti minimi di tempo e livello linguistico.</p>

                <h2 className="text-xl font-bold mt-8 mb-4">6. Proprietà Intellettuale</h2>
                <p className="text-text-muted mb-4">Tutti i contenuti presenti su questo sito (testi, immagini, loghi, grafica, struttura) sono di proprietà di Swiss Research Labs GmbH e sono protetti dalle leggi vigenti in materia di proprietà intellettuale. È vietata la riproduzione, anche parziale, senza autorizzazione scritta.</p>

                <h2 className="text-xl font-bold mt-8 mb-4">7. Limitazione di Responsabilità</h2>
                <p className="text-text-muted mb-4">Swiss Research Labs GmbH non garantisce risultati economici specifici derivanti dalla collaborazione. Tutti gli scenari di guadagno presentati nel sito hanno finalità puramente illustrativa. L&apos;azienda non è responsabile per eventuali decisioni prese dall&apos;utente sulla base delle informazioni presenti nel sito.</p>

                <h2 className="text-xl font-bold mt-8 mb-4">8. Legge Applicabile e Foro Competente</h2>
                <p className="text-text-muted mb-4">I presenti Termini & Condizioni sono regolati dalla legge svizzera. Per qualsiasi controversia derivante dall&apos;interpretazione o esecuzione dei presenti Termini sarà competente in via esclusiva il foro di Zug, Svizzera.</p>

                <h2 className="text-xl font-bold mt-8 mb-4">9. Contatti</h2>
                <p className="text-text-muted mb-4">Per qualsiasi domanda relativa ai presenti Termini, contattaci all&apos;indirizzo: <a href="mailto:info@closeragency.eu" className="text-primary-main underline">info@closeragency.eu</a>.</p>

                <div className="mt-12 pt-6 border-t border-gray-100">
                    <Link href="/" className="text-primary-main hover:underline font-semibold">&larr; Torna alla Home</Link>
                </div>
            </div>
        </div>
    )
}
