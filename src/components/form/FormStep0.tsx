'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { step0Schema, Step0Data } from '@/lib/validation'
import Button from '@/components/ui/Button'

interface FormStep0Props {
  defaultValues?: Partial<Step0Data>
  onNext: (data: Step0Data) => void
  onKO: (reason: string) => void
}

interface PrequalQuestion {
  name: keyof Step0Data
  question: string
}

const questions: PrequalQuestion[] = [
  {
    name: 'pq_hours',
    question: 'Posso garantire minimo 4 ore al giorno?',
  },
  {
    name: 'pq_days',
    question: 'Posso lavorare almeno 3 giorni a settimana?',
  },
  {
    name: 'pq_punctuality',
    question: 'Posso rispettare gli appuntamenti senza ritardi?',
  },
  {
    name: 'pq_italian',
    question: 'Parlo italiano in modo fluido e naturale con clientela italiana?',
  },
]

export default function FormStep0({ defaultValues, onNext, onKO }: FormStep0Props) {
  const {
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<Step0Data>({
    resolver: zodResolver(step0Schema),
    defaultValues: {
      pq_hours: defaultValues?.pq_hours ?? undefined,
      pq_days: defaultValues?.pq_days ?? undefined,
      pq_punctuality: defaultValues?.pq_punctuality ?? undefined,
      pq_italian: defaultValues?.pq_italian ?? undefined,
    },
  })

  const values = watch()

  const handleAnswer = (name: keyof Step0Data, answer: boolean) => {
    if (!answer) {
      // KO immediato
      const questionText = questions.find((q) => q.name === name)?.question || name
      onKO(`Pre-qualifica: non soddisfa requisito "${questionText}"`)
      return
    }
    setValue(name, true as never, { shouldValidate: true })
  }

  const onSubmit = (data: Step0Data) => {
    onNext(data)
  }

  const allAnswered = values.pq_hours && values.pq_days && values.pq_punctuality && values.pq_italian

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Pre-qualifica</h2>
        <p className="text-gray-600">
          Prima di iniziare, verifichiamo che questa opportunità sia adatta a te.
        </p>
      </div>

      <div className="space-y-4">
        {questions.map((q) => {
          const answered = values[q.name] === true
          const hasError = errors[q.name]

          return (
            <div
              key={q.name}
              className={`
                p-5 border rounded-xl transition-all duration-200
                ${answered ? 'border-[#D946A8] bg-[#FDF2F8]' : 'border-gray-200'}
                ${hasError ? 'border-red-300' : ''}
              `}
            >
              <p className="text-gray-900 font-medium mb-4">{q.question}</p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => handleAnswer(q.name, true)}
                  className={`
                    flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200
                    ${
                      answered
                        ? 'bg-[#D946A8] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  Si
                </button>
                <button
                  type="button"
                  onClick={() => handleAnswer(q.name, false)}
                  className="flex-1 py-3 px-4 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                >
                  No
                </button>
              </div>
              {hasError && (
                <p className="mt-2 text-sm text-red-600">{errors[q.name]?.message}</p>
              )}
            </div>
          )
        })}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Button
          type="submit"
          fullWidth
          size="lg"
          disabled={!allAnswered}
          className="mt-6"
        >
          Continua
        </Button>
      </form>
    </div>
  )
}
