import Link from 'next/link'
import { CheckCircle, Clock, Phone, ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'Candidatura Inviata | Grazie',
  description: 'La tua candidatura è stata ricevuta con successo.',
}

export default function ThanksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDF2F8] to-white">
      <div className="max-w-lg mx-auto px-4 py-16">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Candidatura ricevuta!
          </h1>
          <p className="text-lg text-gray-600">
            Grazie per aver completato il questionario. Abbiamo ricevuto la tua candidatura.
          </p>
        </div>

        {/* What happens next */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="font-semibold text-gray-900 mb-4">Cosa succede adesso?</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-[#FDF2F8] flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-[#D946A8]" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Valutazione (24-48 ore)</p>
                <p className="text-sm text-gray-600">
                  Il nostro team esaminerà la tua candidatura con attenzione.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-[#FDF2F8] flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-[#D946A8]" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Contatto</p>
                <p className="text-sm text-gray-600">
                  Se il tuo profilo è in linea, ti contatteremo per un breve colloquio conoscitivo.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-[#FDF2F8] flex items-center justify-center flex-shrink-0">
                <ArrowRight className="w-5 h-5 text-[#D946A8]" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Onboarding</p>
                <p className="text-sm text-gray-600">
                  Dopo il colloquio, riceverai tutto il necessario per iniziare.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Important note */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8">
          <p className="text-sm text-amber-800">
            <strong>Importante:</strong> Controlla la tua email (anche la cartella spam) e tieni il telefono a portata di mano. Ti contatteremo al numero WhatsApp che hai indicato.
          </p>
        </div>

        {/* Back to home */}
        <div className="text-center">
          <Link
            href="/"
            className="text-[#D946A8] hover:text-[#C026A0] font-medium transition-colors"
          >
            Torna alla home
          </Link>
        </div>
      </div>
    </div>
  )
}
