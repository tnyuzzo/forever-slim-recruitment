import Link from 'next/link'
import { XCircle, Heart, ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Non Idoneo | Grazie per il tuo interesse',
  description: 'Grazie per il tuo interesse. Al momento il tuo profilo non è in linea con i requisiti.',
}

export default function NotEligiblePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-lg mx-auto px-4 py-16">
        {/* Icon */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <XCircle className="w-10 h-10 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Grazie per il tuo interesse
          </h1>
          <p className="text-lg text-gray-600">
            Apprezziamo il tempo che hai dedicato alla candidatura.
          </p>
        </div>

        {/* Message */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex gap-4 mb-4">
            <Heart className="w-6 h-6 text-[#D946A8] flex-shrink-0" />
            <div>
              <p className="text-gray-700 leading-relaxed">
                Al momento il tuo profilo non è in linea con i requisiti specifici di questa posizione.
              </p>
            </div>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">
            Questo non riflette in alcun modo il tuo valore professionale — ogni ruolo ha requisiti diversi, e ciò che non è adatto oggi potrebbe esserlo domani o in un contesto diverso.
          </p>
        </div>

        {/* Encouragement */}
        <div className="bg-[#FDF2F8] rounded-xl p-5 mb-8">
          <p className="text-gray-700 text-sm">
            <strong>Non scoraggiarti.</strong> Le nostre posizioni cambiano nel tempo e i requisiti possono variare. Se pensi che la tua situazione possa cambiare in futuro, ti invitiamo a ripresentare la tua candidatura.
          </p>
        </div>

        {/* Back to home */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#D946A8] hover:text-[#C026A0] font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Torna alla home
          </Link>
        </div>
      </div>
    </div>
  )
}
