'use client'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { step7Schema, Step7Data } from '@/lib/validation'
import Button from '@/components/ui/Button'
import Checkbox from '@/components/ui/Checkbox'
import Link from 'next/link'

interface FormStep7Props {
  defaultValues?: Partial<Step7Data>
  onSubmit: (data: Step7Data) => void
  onBack: () => void
  isSubmitting?: boolean
}

export default function FormStep7({ defaultValues, onSubmit, onBack, isSubmitting }: FormStep7Props) {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Step7Data>({
    resolver: zodResolver(step7Schema),
    defaultValues: {
      consent_privacy: defaultValues?.consent_privacy,
      consent_truth: defaultValues?.consent_truth,
      consent_whatsapp: defaultValues?.consent_whatsapp ?? false,
    },
  })

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Ultimo passaggio</h2>
        <p className="text-gray-600">
          Conferma e invia la tua candidatura.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 space-y-4">
          <Controller
            name="consent_privacy"
            control={control}
            render={({ field: { value, onChange, ...field } }) => (
              <Checkbox
                label={
                  <span>
                    Ho letto e accetto la{' '}
                    <Link href="/privacy" target="_blank" className="text-[#D946A8] hover:underline">
                      Privacy Policy
                    </Link>{' '}
                    e i{' '}
                    <Link href="/terms" target="_blank" className="text-[#D946A8] hover:underline">
                      Termini e Condizioni
                    </Link>
                    <span className="text-red-500 ml-1">*</span>
                  </span>
                }
                checked={value === true}
                onChange={(e) => onChange(e.target.checked ? true : false)}
                error={errors.consent_privacy?.message}
                {...field}
              />
            )}
          />

          <Controller
            name="consent_truth"
            control={control}
            render={({ field: { value, onChange, ...field } }) => (
              <Checkbox
                label={
                  <span>
                    Confermo che tutte le informazioni fornite sono veritiere e accurate
                    <span className="text-red-500 ml-1">*</span>
                  </span>
                }
                description="Dichiaro di aver risposto in modo onesto a tutte le domande del questionario"
                checked={value === true}
                onChange={(e) => onChange(e.target.checked ? true : false)}
                error={errors.consent_truth?.message}
                {...field}
              />
            )}
          />

          <div className="pt-2 border-t border-gray-200">
            <Controller
              name="consent_whatsapp"
              control={control}
              render={({ field: { value, onChange, ...field } }) => (
                <Checkbox
                  label="Acconsento a ricevere comunicazioni via WhatsApp"
                  description="Opzionale: potremo contattarti più rapidamente per aggiornamenti sulla tua candidatura"
                  checked={value ?? false}
                  onChange={(e) => onChange(e.target.checked)}
                  {...field}
                />
              )}
            />
          </div>
        </div>

        {/* Summary Box */}
        <div className="bg-[#FDF2F8] rounded-xl p-5 border border-[#D946A8]/20">
          <h3 className="font-semibold text-gray-900 mb-3">Cosa succede dopo?</h3>
          <ul className="text-sm text-gray-700 space-y-2">
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-[#D946A8] text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                1
              </span>
              <span>Esaminiamo la tua candidatura entro 24-48 ore</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-[#D946A8] text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                2
              </span>
              <span>Se il tuo profilo è in linea, ti contattiamo per un breve colloquio</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-[#D946A8] text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                3
              </span>
              <span>Dopo il colloquio, riceverai l&apos;onboarding e potrai iniziare</span>
            </li>
          </ul>
        </div>

        <div className="flex gap-4 pt-4">
          <Button type="button" variant="outline" onClick={onBack} className="flex-1">
            Indietro
          </Button>
          <Button type="submit" isLoading={isSubmitting} className="flex-1">
            Invia candidatura
          </Button>
        </div>
      </form>
    </div>
  )
}
