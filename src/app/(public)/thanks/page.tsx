import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'

export default function ThanksPage() {
    return (
        <div className="min-h-screen bg-bg-alt flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-lg border border-gray-100 text-center space-y-6">
                <div className="w-20 h-20 bg-green-100 text-success rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-10 h-10" />
                </div>
                <h1 className="text-3xl font-black text-text-main">Candidatura Inviata</h1>
                <p className="text-text-muted leading-relaxed">
                    Grazie per aver dedicato del tempo per compilare il form. Abbiamo ricevuto la tua candidatura con successo.
                </p>
                <div className="bg-primary-light/50 border border-primary-light rounded-2xl p-6 space-y-3">
                    <p className="text-xl font-black text-primary-main">
                        Riceverai un aggiornamento via Email, SMS e/o WhatsApp
                    </p>
                    <p className="text-sm text-primary-hover font-medium">
                        Il nostro team valuterà il tuo profilo entro 24-48 ore. Tieni d&apos;occhio il telefono e la casella email!
                    </p>
                </div>
                <div className="pt-6">
                    <Link href="/" className="inline-block px-6 py-3 rounded-xl border border-gray-200 font-semibold text-text-main hover:bg-gray-50 transition-colors">
                        Torna alla Home
                    </Link>
                </div>
            </div>
        </div>
    )
}
