'use client'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { step3Schema, Step3Data } from '@/lib/validation'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Checkbox from '@/components/ui/Checkbox'

interface FormStep3Props {
  defaultValues?: Partial<Step3Data>
  onNext: (data: Step3Data) => void
  onBack: () => void
  onKO: (reason: string) => void
}

const hoursOptions = Array.from({ length: 12 }, (_, i) => ({
  value: String(i + 1),
  label: `${i + 1} ${i + 1 === 1 ? 'ora' : 'ore'}`,
}))

const daysOptions = Array.from({ length: 7 }, (_, i) => ({
  value: String(i + 1),
  label: `${i + 1} ${i + 1 === 1 ? 'giorno' : 'giorni'}`,
}))

const timeSlotOptions = [
  { value: 'mattina', label: 'Mattina (9:00-13:00)' },
  { value: 'pomeriggio', label: 'Pomeriggio (14:00-18:00)' },
  { value: 'sera', label: 'Sera (18:00-21:00)' },
  { value: 'flessibile', label: 'Flessibile' },
]

const startDateOptions = [
  { value: 'immediato', label: 'Subito / Immediato' },
  { value: '1-settimana', label: 'Entro 1 settimana' },
  { value: '2-settimane', label: 'Entro 2 settimane' },
  { value: '1-mese', label: 'Entro 1 mese' },
  { value: 'altro', label: 'Da concordare' },
]

export default function FormStep3({ defaultValues, onNext, onBack, onKO }: FormStep3Props) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      hours_per_day: defaultValues?.hours_per_day || 4,
      days_per_week: defaultValues?.days_per_week || 3,
      time_slots: defaultValues?.time_slots || '',
      start_date: defaultValues?.start_date || '',
      weekend_sat: defaultValues?.weekend_sat ?? false,
      weekend_sun: defaultValues?.weekend_sun ?? false,
      holidays: defaultValues?.holidays ?? false,
    },
  })

  const onSubmit = (data: Step3Data) => {
    // KO checks
    if (data.hours_per_day < 4) {
      onKO('Disponibilità oraria insufficiente (< 4h/giorno)')
      return
    }
    if (data.days_per_week < 3) {
      onKO('Disponibilità giornaliera insufficiente (< 3gg/settimana)')
      return
    }
    onNext(data)
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Disponibilità</h2>
        <p className="text-gray-600">
          Più tempo dedichi, più appuntamenti ricevi. Indica la tua disponibilità reale.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            name="hours_per_day"
            control={control}
            render={({ field }) => (
              <Select
                label="Ore al giorno"
                placeholder="Seleziona"
                options={hoursOptions}
                error={errors.hours_per_day?.message}
                required
                {...field}
                value={String(field.value)}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            )}
          />
          <Controller
            name="days_per_week"
            control={control}
            render={({ field }) => (
              <Select
                label="Giorni a settimana"
                placeholder="Seleziona"
                options={daysOptions}
                error={errors.days_per_week?.message}
                required
                {...field}
                value={String(field.value)}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            )}
          />
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-amber-800 text-sm">
            <strong>Requisito minimo:</strong> 4 ore al giorno per almeno 3 giorni a settimana.
            Questo è il minimo per ricevere appuntamenti sufficienti.
          </p>
        </div>

        <Select
          label="Fascia oraria preferita"
          placeholder="Seleziona la fascia"
          options={timeSlotOptions}
          error={errors.time_slots?.message}
          required
          {...register('time_slots')}
        />

        <Select
          label="Quando puoi iniziare?"
          placeholder="Seleziona"
          options={startDateOptions}
          error={errors.start_date?.message}
          required
          {...register('start_date')}
        />

        <div className="space-y-3 pt-2">
          <p className="text-sm font-medium text-gray-700">Disponibilità extra (opzionale)</p>
          <Controller
            name="weekend_sat"
            control={control}
            render={({ field: { value, onChange, ...field } }) => (
              <Checkbox
                label="Disponibile il sabato"
                checked={value}
                onChange={(e) => onChange(e.target.checked)}
                {...field}
              />
            )}
          />
          <Controller
            name="weekend_sun"
            control={control}
            render={({ field: { value, onChange, ...field } }) => (
              <Checkbox
                label="Disponibile la domenica"
                checked={value}
                onChange={(e) => onChange(e.target.checked)}
                {...field}
              />
            )}
          />
          <Controller
            name="holidays"
            control={control}
            render={({ field: { value, onChange, ...field } }) => (
              <Checkbox
                label="Disponibile nei festivi"
                checked={value}
                onChange={(e) => onChange(e.target.checked)}
                {...field}
              />
            )}
          />
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
