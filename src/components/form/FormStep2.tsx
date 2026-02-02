'use client'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { step2Schema, Step2Data } from '@/lib/validation'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import RadioGroup from '@/components/ui/RadioGroup'
import Checkbox from '@/components/ui/Checkbox'

interface FormStep2Props {
  defaultValues?: Partial<Step2Data>
  onNext: (data: Step2Data) => void
  onBack: () => void
  onKO: (reason: string) => void
}

const italianLevelOptions = [
  {
    value: 'high',
    label: 'Alto',
    description: 'Parlo italiano come lingua madre o a livello madrelingua',
  },
  {
    value: 'medium',
    label: 'Medio',
    description: 'Parlo italiano fluentemente con qualche imprecisione',
  },
  {
    value: 'low',
    label: 'Base',
    description: 'Parlo italiano ma con difficoltà o forte accento',
  },
]

export default function FormStep2({ defaultValues, onNext, onBack, onKO }: FormStep2Props) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      nationality: defaultValues?.nationality || '',
      native_language: defaultValues?.native_language || '',
      italian_level: defaultValues?.italian_level,
      strong_accent: defaultValues?.strong_accent ?? false,
      bio_short: defaultValues?.bio_short || '',
    },
  })

  const bioValue = watch('bio_short')

  const onSubmit = (data: Step2Data) => {
    // KO check for italian level
    if (data.italian_level === 'low') {
      onKO('Livello italiano insufficiente')
      return
    }
    onNext(data)
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Lingua e comunicazione</h2>
        <p className="text-gray-600">
          La comunicazione è il tuo strumento di lavoro — aiutaci a conoscerti.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nazionalità"
            placeholder="Es. Italiana"
            error={errors.nationality?.message}
            required
            {...register('nationality')}
          />
          <Input
            label="Lingua madre"
            placeholder="Es. Italiano"
            error={errors.native_language?.message}
            required
            {...register('native_language')}
          />
        </div>

        <Controller
          name="italian_level"
          control={control}
          render={({ field }) => (
            <RadioGroup
              label="Livello di italiano"
              options={italianLevelOptions}
              error={errors.italian_level?.message}
              {...field}
            />
          )}
        />

        <Controller
          name="strong_accent"
          control={control}
          render={({ field: { value, onChange, ...field } }) => (
            <Checkbox
              label="Ho un accento straniero marcato"
              description="Indica se il tuo accento potrebbe essere percepito come non italiano da un ascoltatore nativo"
              checked={value}
              onChange={(e) => onChange(e.target.checked)}
              {...field}
            />
          )}
        />

        <Controller
          name="bio_short"
          control={control}
          render={({ field }) => (
            <Textarea
              label="Presentati in 2 righe"
              placeholder="Scrivi una breve presentazione di te stessa..."
              hint="Chi sei, cosa ti caratterizza, perché questa opportunità ti interessa"
              error={errors.bio_short?.message}
              showCount
              maxLength={300}
              required
              {...field}
              value={bioValue}
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
