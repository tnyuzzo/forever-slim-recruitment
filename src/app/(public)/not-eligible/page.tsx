import Link from 'next/link'

export default function NotEligiblePage() {
    return (
        <div className="min-h-screen bg-bg-alt flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-lg border border-gray-100 text-center space-y-6">
                <h1 className="text-3xl font-black text-text-main">Grazie per l'interesse</h1>
                <p className="text-text-muted leading-relaxed">
                    Abbiamo esaminato le tue risposte al questionario iniziale. Purtroppo, in questo momento, il tuo profilo non rispetta i requisiti minimi fondamentali (di tempo libero, linguistici o organizzativi) necessari per questa specifica collaborazione.
                </p>
                <p className="text-text-muted text-sm border-t border-gray-100 pt-6">
                    Ti ringraziamo sinceramente per il tempo dedicato e ti auguriamo il meglio per le tue future ricerche professionali.
                </p>
                <div className="pt-2">
                    <Link href="/" className="inline-block px-6 py-3 rounded-xl border border-gray-200 font-semibold text-text-main hover:bg-gray-50 transition-colors mt-4">
                        Torna alla Home
                    </Link>
                </div>
            </div>
        </div>
    )
}
