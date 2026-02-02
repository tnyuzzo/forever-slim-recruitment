'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { checkKO, calculateScore, getPriority } from '@/lib/scoring'
import { trackEvent } from '@/lib/tracking'
import type {
  FullFormData,
  Step0Data,
  Step1Data,
  Step2Data,
  Step3Data,
  Step4Data,
  Step5Data,
  Step6Data,
  Step7Data
} from '@/lib/validation'

// Extended form data with UTM tracking
interface ExtendedFormData extends FullFormData {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_adset?: string
  utm_ad?: string
}
import ProgressBar from '@/components/ui/ProgressBar'
import FormStep0 from './FormStep0'
import FormStep1 from './FormStep1'
import FormStep2 from './FormStep2'
import FormStep3 from './FormStep3'
import FormStep4 from './FormStep4'
import FormStep5 from './FormStep5'
import FormStep6 from './FormStep6'
import FormStep7 from './FormStep7'

const TOTAL_STEPS = 8
const STEP_LABELS = ['Pre-qualifica', 'Dati', 'Lingua', 'Tempo', 'Esperienza', 'Prove', 'Audio', 'Consensi']

export default function MultiStepForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<Partial<ExtendedFormData>>({})

  // Track UTM params on mount
  useEffect(() => {
    const utm_source = searchParams.get('utm_source')
    const utm_medium = searchParams.get('utm_medium')
    const utm_campaign = searchParams.get('utm_campaign')
    const utm_adset = searchParams.get('utm_adset')
    const utm_ad = searchParams.get('utm_ad')

    setFormData((prev) => ({
      ...prev,
      utm_source: utm_source || undefined,
      utm_medium: utm_medium || undefined,
      utm_campaign: utm_campaign || undefined,
      utm_adset: utm_adset || undefined,
      utm_ad: utm_ad || undefined,
    }))

    trackEvent('start_application')
  }, [searchParams])

  const handleKO = async (reason: string) => {
    trackEvent('ko_rejected', { reason })

    // Save rejected candidate to database
    const supabase = createClient()
    await supabase.from('candidates').insert({
      first_name: formData.first_name || 'N/A',
      last_name: formData.last_name || 'N/A',
      email: formData.email || 'rejected@temp.com',
      whatsapp: formData.whatsapp || 'N/A',
      status: 'rejected',
      ko_reason: reason,
      consent_privacy: false,
      consent_truth: false,
      ...formData,
    })

    router.push('/not-eligible')
  }

  const handleStep0 = (data: Step0Data) => {
    setFormData((prev) => ({ ...prev, ...data }))
    trackEvent('prequal_pass')
    trackEvent('step_complete', { step: 0 })
    setCurrentStep(1)
  }

  const handleStep1 = (data: Step1Data) => {
    setFormData((prev) => ({ ...prev, ...data }))
    trackEvent('step_complete', { step: 1 })
    setCurrentStep(2)
  }

  const handleStep2 = (data: Step2Data) => {
    setFormData((prev) => ({ ...prev, ...data }))
    trackEvent('step_complete', { step: 2 })
    setCurrentStep(3)
  }

  const handleStep3 = (data: Step3Data) => {
    setFormData((prev) => ({ ...prev, ...data }))
    trackEvent('step_complete', { step: 3 })
    setCurrentStep(4)
  }

  const handleStep4 = (data: Step4Data) => {
    setFormData((prev) => ({ ...prev, ...data }))
    trackEvent('step_complete', { step: 4 })
    setCurrentStep(5)
  }

  const handleStep5 = (data: Step5Data) => {
    setFormData((prev) => ({ ...prev, ...data }))
    trackEvent('step_complete', { step: 5 })
    setCurrentStep(6)
  }

  const handleStep6 = (data: Step6Data) => {
    setFormData((prev) => ({ ...prev, ...data }))
    trackEvent('step_complete', { step: 6 })
    setCurrentStep(7)
  }

  const handleFinalSubmit = async (data: Step7Data) => {
    setIsSubmitting(true)

    const finalData = { ...formData, ...data } as ExtendedFormData

    try {
      // Check KO conditions
      const koResult = checkKO(finalData)
      if (koResult.isKO) {
        await handleKO(koResult.reason!)
        return
      }

      // Calculate score
      const { total, breakdown } = calculateScore(finalData)
      const priority = getPriority(total)

      // Save to Supabase
      const supabase = createClient()
      const { error } = await supabase.from('candidates').insert({
        first_name: finalData.first_name,
        last_name: finalData.last_name,
        email: finalData.email,
        whatsapp: finalData.whatsapp,
        city: finalData.city,
        country: finalData.country,
        age_range: finalData.age_range,
        nationality: finalData.nationality,
        native_language: finalData.native_language,
        italian_level: finalData.italian_level,
        strong_accent: finalData.strong_accent,
        bio_short: finalData.bio_short,
        hours_per_day: finalData.hours_per_day,
        days_per_week: finalData.days_per_week,
        time_slots: finalData.time_slots,
        start_date: finalData.start_date,
        weekend_sat: finalData.weekend_sat,
        weekend_sun: finalData.weekend_sun,
        holidays: finalData.holidays,
        sales_years: finalData.sales_years,
        inbound_outbound: finalData.inbound_outbound,
        sectors: finalData.sectors || null,
        close_rate_range: finalData.close_rate_range,
        motivation: finalData.motivation,
        roleplay_think_about_it: finalData.roleplay_think_about_it,
        roleplay_bundle3: finalData.roleplay_bundle3,
        audio_url: finalData.audio_url || null,
        audio_uploaded: finalData.audio_uploaded || false,
        score_total: total,
        score_breakdown: breakdown,
        priority: priority,
        status: 'new',
        consent_privacy: finalData.consent_privacy,
        consent_truth: finalData.consent_truth,
        consent_whatsapp: finalData.consent_whatsapp || false,
        utm_source: finalData.utm_source || null,
        utm_medium: finalData.utm_medium || null,
        utm_campaign: finalData.utm_campaign || null,
        utm_adset: finalData.utm_adset || null,
        utm_ad: finalData.utm_ad || null,
      })

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      trackEvent('submit_application', { score: total, priority })
      trackEvent('qualified')

      router.push('/thanks')
    } catch (error) {
      console.error('Submit error:', error)
      alert('Si è verificato un errore. Riprova.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header with progress */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-4">
        <div className="max-w-md mx-auto">
          <ProgressBar
            currentStep={currentStep}
            totalSteps={TOTAL_STEPS}
            stepLabels={STEP_LABELS}
          />
        </div>
      </div>

      {/* Form content */}
      <div className="max-w-md mx-auto px-4 py-8">
        {currentStep === 0 && (
          <FormStep0
            defaultValues={formData}
            onNext={handleStep0}
            onKO={handleKO}
          />
        )}
        {currentStep === 1 && (
          <FormStep1
            defaultValues={formData}
            onNext={handleStep1}
            onBack={goBack}
          />
        )}
        {currentStep === 2 && (
          <FormStep2
            defaultValues={formData}
            onNext={handleStep2}
            onBack={goBack}
            onKO={handleKO}
          />
        )}
        {currentStep === 3 && (
          <FormStep3
            defaultValues={formData}
            onNext={handleStep3}
            onBack={goBack}
            onKO={handleKO}
          />
        )}
        {currentStep === 4 && (
          <FormStep4
            defaultValues={formData}
            onNext={handleStep4}
            onBack={goBack}
          />
        )}
        {currentStep === 5 && (
          <FormStep5
            defaultValues={formData}
            onNext={handleStep5}
            onBack={goBack}
          />
        )}
        {currentStep === 6 && (
          <FormStep6
            defaultValues={formData}
            onNext={handleStep6}
            onBack={goBack}
          />
        )}
        {currentStep === 7 && (
          <FormStep7
            defaultValues={formData}
            onSubmit={handleFinalSubmit}
            onBack={goBack}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </div>
  )
}
