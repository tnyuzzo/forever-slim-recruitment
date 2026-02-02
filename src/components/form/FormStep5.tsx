'use client'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { step5Schema, Step5Data } from '@/lib/validation'
import Button from '@/components/ui/Button'
import Textarea from '@/components/ui/Textarea'

interface FormStep5Props {
  defaultValues?: Partial<Step5Data>
  onNext: (data: Step5Data) => void
  onBack: () => void
}

export default function FormStep5({ defaultValues, onNext, onBack }: FormStep5Props) {
  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<Step5Data>({
    resolver: zodResolver(step5Schema),
    defaultValues: {
      roleplay_think_about_it: defaultValues?.roleplay_think_about_it || '',
      roleplay_bundle3: defaultValues?.roleplay_bundle3 || '',
    },
  })

  const rp1Value = watch('roleplay_think_about_it')
  const rp2Value = watch('roleplay_bundle3')

  const onSubmit = (data: Step5Data) => {
    onNext(data)
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Prove pratiche</h2>
        <p className="text-gray-600">
          Due brevi esercizi per capire come comunichi. Non esiste una risposta sbagliata.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Roleplay 1 */}
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
          <div className="mb-4">
            <h3 className="font-semibold text-gray-900 mb-2">Scenario 1: &quot;Ci devo pensare&quot;</h3>
            <p className="text-gray-600 text-sm">
              Una cliente ha ascoltato la tua presentazione del prodotto. Alla fine ti dice:
            </p>
            <blockquote className="mt-2 pl-4 border-l-4 border-[#D946A8] text-gray-800 italic">
              &quot;Grazie, molto interessante. Ci devo pensare, ne parlo con mio marito e vi faccio sapere.&quot;
            </blockquote>
          </div>
          <Controller
            name="roleplay_think_about_it"
            control={control}
            render={({ field }) => (
              <Textarea
                label="Come rispondi?"
                placeholder="Scrivi la tua risposta come se stessi parlando con la cliente..."
                hint="Minimo 200 caratteri. Mostraci come gestisci questa obiezione comune."
                error={errors.roleplay_think_about_it?.message}
                showCount
                maxLength={1000}
                required
                {...field}
                value={rp1Value}
                className="min-h-[150px]"
              />
            )}
          />
        </div>

        {/* Roleplay 2 */}
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
          <div className="mb-4">
            <h3 className="font-semibold text-gray-900 mb-2">Scenario 2: Proposta kit 3 mesi</h3>
            <p className="text-gray-600 text-sm">
              Una cliente è interessata al prodotto ma sta considerando solo il kit da 1 mese (€197).
              Tu sai che il kit da 3 mesi (€399) offre un risparmio significativo e risultati migliori.
            </p>
            <p className="mt-2 text-gray-600 text-sm">
              <strong>La cliente ti chiede:</strong>
            </p>
            <blockquote className="mt-2 pl-4 border-l-4 border-[#D946A8] text-gray-800 italic">
              &quot;Preferisco partire con un mese solo, vediamo come va.&quot;
            </blockquote>
          </div>
          <Controller
            name="roleplay_bundle3"
            control={control}
            render={({ field }) => (
              <Textarea
                label="Come proponi il kit 3 mesi?"
                placeholder="Scrivi come presenteresti il valore del kit completo..."
                hint="Minimo 200 caratteri. Mostraci come fai upselling in modo naturale e non forzato."
                error={errors.roleplay_bundle3?.message}
                showCount
                maxLength={1000}
                required
                {...field}
                value={rp2Value}
                className="min-h-[150px]"
              />
            )}
          />
        </div>

        <div className="bg-[#FDF2F8] rounded-lg p-4 border border-[#D946A8]/20">
          <p className="text-sm text-gray-700">
            <strong>Suggerimento:</strong> Non cercare la risposta &quot;giusta&quot;. Scrivi come parleresti
            realmente con una cliente. La naturalezza e l&apos;empatia sono più importanti delle tecniche di vendita.
          </p>
        </div>

        <div className="flex gap-4 pt-4">
          <Button type="button" variant="outline" onClick={onBack} className="flex-1">
            Indietro
          </Button>
          <Button type="submit" className="flex-1">
            Continua
          </Button>
        </div>
      </form>
    </div>
  )
}
