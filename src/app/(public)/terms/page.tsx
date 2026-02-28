import Link from 'next/link'

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-bg-alt py-12 px-4">
            <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-3xl border border-gray-100 shadow-sm prose prose-sm md:prose-base prose-slate">
                <h1 className="text-3xl font-black mb-8 text-text-main">Termini & Condizioni</h1>

                <p className="mb-4 text-text-muted"><strong>Ultimo aggiornamento: {new Date().toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })}</strong></p>

                <h2 className="text-xl font-bold mt-8 mb-4">1. Natura dell'Opportunità</h2>
                <p className="text-text-muted mb-4">La presente pagina web promuove un'opportunità di collaborazione autonoma (freelance) per conto di Swiss Research Labs GmbH nel settore della vendita di prodotti per il controllo del peso.</p>
                <p className="text-text-muted mb-4">Questa candidatura NON costituisce una promessa di assunzione, né avvia un processo per l'instaurazione di un rapporto di lavoro subordinato (dipendente).</p>

                <h2 className="text-xl font-bold mt-8 mb-4">2. Assenza di Esclusiva ed Etica</h2>
                <p className="text-text-muted mb-4">La collaborazione offerta non prevede vincolo di esclusiva, subordinazione gerarchica o rigidità oraria, se non quelle funzionali e concordate per l'ottimale gestione del flusso di contatti forniti dall'azienda. È richiesta massima serietà ed etica nella gestione delle comunicazioni verso le clienti finali.</p>

                <h2 className="text-xl font-bold mt-8 mb-4">3. Compensi e Risultati</h2>
                <p className="text-text-muted mb-4">Le provvigioni e i potenziali ritorni economici citati nelle simulazioni della pagina hanno finalità illustrativa e sono calcolati su dati aggregati. Nessun risultato economico netto è garantito. Il compenso è maturato unicamente sulla base delle vendite (con pagamento a buon fine) generate.</p>

                <h2 className="text-xl font-bold mt-8 mb-4">4. Obbligo di Riservatezza</h2>
                <p className="text-text-muted mb-4">Compilando il modulo di candidatura in tutte le sue fasi, l'utente si impegna a: non diffondere o copiare i testi delle prove pratiche; mantenere riservate le informazioni eventualmente fornite in sede di colloquio conoscitivo, incluse le specifiche commerciali discusse con i referenti aziendali.</p>

                <h2 className="text-xl font-bold mt-8 mb-4">5. Reiezione della Candidatura</h2>
                <p className="text-text-muted mb-4">L'azienda si riserva il diritto insindacabile di rifiutare una candidatura in qualunque momento, inclusa la qualifica attraverso regole automatiche del questionario motivato dalla difformità ai requisiti minimi di tempo e livello linguistico.</p>

                <div className="mt-12 pt-6 border-t border-gray-100">
                    <Link href="/" className="text-primary-main hover:underline font-semibold">&larr; Torna alla Home</Link>
                </div>
            </div>
        </div>
    )
}
