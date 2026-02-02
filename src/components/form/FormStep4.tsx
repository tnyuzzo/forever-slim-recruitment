'use client'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { step4Schema, Step4Data } from '@/lib/validation'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Textarea from '@/components/ui/Textarea'
import RadioGroup from '@/components/ui/RadioGroup'

interface FormStep4Props {
  defaultValues?: Partial<Step4Data>
  onNext: (data: Step4Data) => void
  onBack: () => void
}

const yearsOptions = [
  { value: '0', label: 'Nessuna esperienza' },
  { value: '1', label: 'Meno di 1 anno' },
  { value: '2', label: '1-2 anni' },
  { value: '3', label: '3-5 anni' },
  { value: '6', label: '5-10 anni' },
  { value: '10', label: 'Oltre 10 anni' },
]

const experienceTypeOptions = [
  { value: 'inbound', label: 'Inbound', description: 'Chiamate in entrata / clienti che contattano' },
  { value: 'outbound', label: 'Outbound', description: 'Chiamate in uscita / vendita attiva' },
  { value: 'entrambi', label: 'Entrambi', description: 'Esperienza sia inbound che outbound' },
  { value: 'nessuno', label: 'Nessuna esperienza specifica', description: 'Non ho esperienza diretta in vendita telefonica' },
]

const closeRateOptions = [
  { value: '0-10%', label: '0-10%', description: 'Tasso di chiusura basso' },
  { value: '10-20%', label: '10-20%', description: 'Tasso di chiusura nella media' },
  { value: '20-30%', label: '20-30%', description: 'Tasso di chiusura buono' },
  { value: '30%+', label: 'Oltre 30%', description: 'Tasso di chiusura alto' },
]

export default function FormStep4({ defaultValues, onNext, onBack }: FormStep4Props) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<Step4Data>({
    resolver: zodResolver(step4Schema),
    defaultValues: {
      sales_years: defaultValues?.sales_years ?? 0,
      inbound_outbound: defaultValues?.inbound_outbound,
      sectors: defaultValues?.sectors || '',
      close_rate_range: defaultValues?.close_rate_range,
      motivation: defaultValues?.motivation || '',
    },
  })

  const motivationValue = watch('motivation')

  const onSubmit = (data: Step4Data) => {
    onNext(data)
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Esperienza</h2>
        <p className="text-gray-600">
          Non è necessaria esperienza specifica — valutiamo la persona nel suo insieme.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Controller
          name="sales_years"
          control={control}
          render={({ field }) => (
            <Select
              label="Anni di esperienza nella vendita"
              placeholder="Seleziona"
              options={yearsOptions}
              error={errors.sales_years?.message}
              required
              {...field}
              value={String(field.value)}
              onChange={(e) => field.onChange(Number(e.target.value))}
            />
          )}
        />

        <Controller
          name="inbound_outbound"
          control={control}
          render={({ field }) => (
            <RadioGroup
              label="Tipo di esperienza"
              options={experienceTypeOptions}
              error={errors.inbound_outbound?.message}
              {...field}
            />
          )}
        />

        <Input
          label="Settori di esperienza"
          placeholder="Es. Telefonia, Assicurazioni, Cosmetici..."
          hint="Opzionale: in quali settori hai lavorato"
          error={errors.sectors?.message}
          {...register('sectors')}
        />

        <Controller
          name="close_rate_range"
          control={control}
          render={({ field }) => (
            <RadioGroup
              label="Tasso di chiusura stimato"
              options={closeRateOptions}
              error={errors.close_rate_range?.message}
              {...field}
            />
          )}
        />

        <Controller
          name="motivation"
          control={control}
          render={({ field }) => (
            <Textarea
              label="Perché ti interessa questa opportunità?"
              placeholder="Raccontaci cosa ti ha attirato e perché pensi di essere la persona giusta..."
              error={errors.motivation?.message}
              showCount
              maxLength={500}
              required
              {...field}
              value={motivationValue}
            />
          )}
        />

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
