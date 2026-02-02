'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { step1Schema, Step1Data } from '@/lib/validation'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'

interface FormStep1Props {
  defaultValues?: Partial<Step1Data>
  onNext: (data: Step1Data) => void
  onBack: () => void
}

const countries = [
  { value: 'italia', label: 'Italia' },
  { value: 'svizzera', label: 'Svizzera' },
  { value: 'germania', label: 'Germania' },
  { value: 'francia', label: 'Francia' },
  { value: 'spagna', label: 'Spagna' },
  { value: 'regno-unito', label: 'Regno Unito' },
  { value: 'altro', label: 'Altro' },
]

const ageRanges = [
  { value: '30-35', label: '30-35 anni' },
  { value: '36-40', label: '36-40 anni' },
  { value: '41-45', label: '41-45 anni' },
  { value: '46-50', label: '46-50 anni' },
  { value: '50+', label: 'Oltre 50 anni' },
]

export default function FormStep1({ defaultValues, onNext, onBack }: FormStep1Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      first_name: defaultValues?.first_name || '',
      last_name: defaultValues?.last_name || '',
      email: defaultValues?.email || '',
      whatsapp: defaultValues?.whatsapp || '',
      country: defaultValues?.country || '',
      city: defaultValues?.city || '',
      age_range: defaultValues?.age_range,
    },
  })

  const onSubmit = (data: Step1Data) => {
    onNext(data)
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">I tuoi dati</h2>
        <p className="text-gray-600">
          Ci servono solo le informazioni essenziali per contattarti.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nome"
            placeholder="Il tuo nome"
            error={errors.first_name?.message}
            required
            {...register('first_name')}
          />
          <Input
            label="Cognome"
            placeholder="Il tuo cognome"
            error={errors.last_name?.message}
            required
            {...register('last_name')}
          />
        </div>

        <Input
          label="Email"
          type="email"
          placeholder="email@esempio.com"
          error={errors.email?.message}
          required
          {...register('email')}
        />

        <Input
          label="WhatsApp"
          type="tel"
          placeholder="+39 123 456 7890"
          hint="Inserisci il numero completo di prefisso internazionale"
          error={errors.whatsapp?.message}
          required
          {...register('whatsapp')}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Paese di residenza"
            placeholder="Seleziona il paese"
            options={countries}
            error={errors.country?.message}
            required
            {...register('country')}
          />
          <Input
            label="Città"
            placeholder="La tua città"
            error={errors.city?.message}
            required
            {...register('city')}
          />
        </div>

        <Select
          label="Fascia di età"
          placeholder="Seleziona la tua fascia"
          options={ageRanges}
          error={errors.age_range?.message}
          required
          {...register('age_range')}
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
