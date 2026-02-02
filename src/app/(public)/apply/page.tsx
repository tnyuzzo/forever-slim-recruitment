import { Suspense } from 'react'
import MultiStepForm from '@/components/form/MultiStepForm'

export const metadata = {
  title: 'Candidatura | Opportunità Vendita Consulenziale',
  description: 'Compila il form di candidatura per l\'opportunità di vendita consulenziale da remoto.',
}

function FormLoading() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#D946A8] border-t-transparent" />
    </div>
  )
}

export default function ApplyPage() {
  return (
    <Suspense fallback={<FormLoading />}>
      <MultiStepForm />
    </Suspense>
  )
}
