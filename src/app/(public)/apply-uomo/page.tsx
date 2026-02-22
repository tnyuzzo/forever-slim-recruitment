"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, DefaultValues } from 'react-hook-form'
import { z } from 'zod'
import { Check, ChevronRight, ChevronLeft, Loader2, Upload, Headphones, Camera, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

// --- DATA ---
const COUNTRIES = [
    'Italia', 'Albania', 'Argentina', 'Australia', 'Austria', 'Belgio', 'Bosnia ed Erzegovina',
    'Brasile', 'Bulgaria', 'Canada', 'Cile', 'Cina', 'Colombia', 'Croazia', 'Danimarca',
    'Ecuador', 'Egitto', 'Estonia', 'Filippine', 'Finlandia', 'Francia', 'Germania', 'Giappone',
    'Grecia', 'India', 'Irlanda', 'Kosovo', 'Lettonia', 'Lituania', 'Lussemburgo',
    'Macedonia del Nord', 'Malta', 'Marocco', 'Messico', 'Moldova', 'Montenegro', 'Nigeria',
    'Norvegia', 'Paesi Bassi', 'Pakistan', 'Perù', 'Polonia', 'Portogallo', 'Regno Unito',
    'Repubblica Ceca', 'Romania', 'Russia', 'Senegal', 'Serbia', 'Slovacchia', 'Slovenia',
    'Spagna', 'Sri Lanka', 'Stati Uniti', 'Svezia', 'Svizzera', 'Tunisia', 'Turchia', 'Ucraina',
    'Ungheria', 'Venezuela', 'Altro'
]

const COUNTRY_PREFIXES: Record<string, string> = {
    'Italia': '+39', 'Albania': '+355', 'Argentina': '+54', 'Australia': '+61', 'Austria': '+43',
    'Belgio': '+32', 'Bosnia ed Erzegovina': '+387', 'Brasile': '+55', 'Bulgaria': '+359',
    'Canada': '+1', 'Cile': '+56', 'Cina': '+86', 'Colombia': '+57', 'Croazia': '+385',
    'Danimarca': '+45', 'Ecuador': '+593', 'Egitto': '+20', 'Estonia': '+372', 'Filippine': '+63',
    'Finlandia': '+358', 'Francia': '+33', 'Germania': '+49', 'Giappone': '+81', 'Grecia': '+30',
    'India': '+91', 'Irlanda': '+353', 'Kosovo': '+383', 'Lettonia': '+371', 'Lituania': '+370',
    'Lussemburgo': '+352', 'Macedonia del Nord': '+389', 'Malta': '+356', 'Marocco': '+212',
    'Messico': '+52', 'Moldova': '+373', 'Montenegro': '+382', 'Nigeria': '+234', 'Norvegia': '+47',
    'Paesi Bassi': '+31', 'Pakistan': '+92', 'Perù': '+51', 'Polonia': '+48', 'Portogallo': '+351',
    'Regno Unito': '+44', 'Repubblica Ceca': '+420', 'Romania': '+40', 'Russia': '+7',
    'Senegal': '+221', 'Serbia': '+381', 'Slovacchia': '+421', 'Slovenia': '+386', 'Spagna': '+34',
    'Sri Lanka': '+94', 'Stati Uniti': '+1', 'Svezia': '+46', 'Svizzera': '+41', 'Tunisia': '+216',
    'Turchia': '+90', 'Ucraina': '+380', 'Ungheria': '+36', 'Venezuela': '+58'
}

const NATIONALITIES = [
    'Italiana', 'Albanese', 'Argentina', 'Australiana', 'Austriaca', 'Belga', 'Bosniaca',
    'Brasiliana', 'Bulgara', 'Canadese', 'Cilena', 'Cinese', 'Colombiana', 'Croata', 'Danese',
    'Ecuadoriana', 'Egiziana', 'Estone', 'Filippina', 'Finlandese', 'Francese', 'Tedesca',
    'Giapponese', 'Greca', 'Indiana', 'Irlandese', 'Kosovara', 'Lettone', 'Lituana',
    'Lussemburghese', 'Macedone', 'Maltese', 'Marocchina', 'Messicana', 'Moldava', 'Montenegrina',
    'Nigeriana', 'Norvegese', 'Olandese', 'Pakistana', 'Peruviana', 'Polacca', 'Portoghese',
    'Britannica', 'Ceca', 'Rumena', 'Russa', 'Senegalese', 'Serba', 'Slovacca', 'Slovena',
    'Spagnola', 'Singalese', 'Statunitense', 'Svedese', 'Svizzera', 'Tunisina', 'Turca',
    'Ucraina', 'Ungherese', 'Venezuelana', 'Altra'
]

// --- SCHEMAS ---
const step0Schema = z.object({
    pq_hours: z.boolean().refine(val => val === true, "Questo requisito è necessario"),
    pq_days: z.boolean().refine(val => val === true, "Questo requisito è necessario"),
    pq_punctuality: z.boolean().refine(val => val === true, "Questo requisito è necessario"),
    pq_italian: z.boolean().refine(val => val === true, "Questo requisito è necessario"),
})

const step1Schema = z.object({
    first_name: z.string().min(2, "Inserisci il tuo nome"),
    last_name: z.string().min(2, "Inserisci il tuo cognome"),
    email: z.string().email("Email non valida"),
    whatsapp: z.string().min(6, "Inserisci il numero di telefono"),
    country: z.string().min(2, "Seleziona/Inserisci il paese"),
    city: z.string().min(2, "Inserisci la città"),
    birth_date: z.string().min(1, "Inserisci la data di nascita"),
})

const LANGUAGE_OPTIONS = [
    'Francese', 'Spagnolo', 'Tedesco', 'Portoghese', 'Arabo', 'Russo', 'Cinese', 'Rumeno'
]

const step2Schema = z.object({
    nationality: z.string().min(2, "Inserisci la nazionalità"),
    native_language: z.string().min(2, "Inserisci la lingua madre"),
    italian_level: z.string().min(1, "Seleziona il livello di italiano"),
    english_level: z.string().min(1, "Seleziona il livello di inglese"),
    strong_accent: z.boolean(),
    bio_short: z.string().max(300, "Massimo 300 caratteri").min(20, "Scrivi almeno 20 caratteri"),
})

const step3Schema = z.object({
    hours_per_day: z.coerce.number().min(1, "Minimo 1").max(12, "Massimo 12"),
    days_per_week: z.coerce.number().min(1, "Minimo 1").max(7, "Massimo 7"),
    time_slots: z.string().min(1, "Descrivi le tue fasce orarie"),
    start_date: z.string().min(2, "Indica quando puoi iniziare"),
    weekend_availability: z.string().min(1, "Seleziona la tua disponibilità nel weekend"),
    weekend_details: z.string().optional(),
    holidays: z.boolean(),
})

const step4Schema = z.object({
    sales_years: z.coerce.number().min(0, "Minimo 0"),
    inbound_outbound: z.string().min(1, "Seleziona un'opzione"),
    sectors: z.string().optional(),
    close_rate_range: z.string().min(1, "Seleziona una stima (o 0-10% se non hai esperienza)"),
    motivation: z.string().min(30, "Scrivi almeno 30 caratteri (Perché vuoi questo ruolo?)"),
})

const step5Schema = z.object({
    roleplay_think_about_it: z.string().min(30, "Minimo 30 caratteri"),
    roleplay_bundle3: z.string().min(30, "Minimo 30 caratteri"),
})

const step6Schema = z.object({
    // audio is handled separately as file upload state
    audio_uploaded: z.boolean().optional()
})

const step7Schema = z.object({
    consent_privacy: z.boolean().refine(val => val === true, "Il consenso privacy è obbligatorio"),
    consent_truth: z.boolean().refine(val => val === true, "Devi confermare la veridicità dei dati"),
    consent_whatsapp: z.boolean().optional(),
})

// Combined Schema for final submit (not strictly used for step validation but good reference)
const submitSchema = step0Schema.and(step1Schema).and(step2Schema).and(step3Schema).and(step4Schema).and(step5Schema).and(step6Schema).and(step7Schema)
type CandidateFormData = z.infer<typeof submitSchema>

const schemas = [
    step0Schema, step1Schema, step2Schema, step3Schema,
    step4Schema, step5Schema, step6Schema, step7Schema
]

const stepTitles = [
    "Pre-qualifica", "Dati base", "Comunicazione", "Disponibilità",
    "Esperienza", "Prove Pratiche", "Audio & Foto", "Consenso e Invio"
]

export default function ApplyPage() {
    const router = useRouter()
    const [step, setStep] = useState(0)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [audioFile, setAudioFile] = useState<File | null>(null)
    const [audioUrl, setAudioUrl] = useState<string | null>(null)
    const [photoFile, setPhotoFile] = useState<File | null>(null)
    const [photoPreview, setPhotoPreview] = useState<string | null>(null)
    const [phonePrefix, setPhonePrefix] = useState('+39')
    const [spokenLanguages, setSpokenLanguages] = useState<string[]>([])
    const [otherLanguagesText, setOtherLanguagesText] = useState('')
    const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([])
    const [stepSuccess, setStepSuccess] = useState(false)

    const currentSchema = schemas[step]

    const form = useForm<CandidateFormData>({
        // @ts-ignore - Dynamic resolver type mismatch with overall form data
        resolver: zodResolver(currentSchema as any),
        mode: "onChange",
        defaultValues: {
            strong_accent: false,
            weekend_availability: '',
            holidays: false,
            audio_uploaded: false,
            country: 'Italia',
            nationality: 'Italiana',
        } as DefaultValues<CandidateFormData>
    })

    const { register, handleSubmit, formState: { errors, isValid }, trigger, getValues } = form

    const handleNext = async () => {
        const isStepValid = await trigger()
        if (isStepValid) {
            setStepSuccess(true)
            setTimeout(() => {
                setStepSuccess(false)
                setStep((p) => Math.min(schemas.length - 1, p + 1))
                window.scrollTo(0, 0)
            }, 600)
        }
    }

    const handlePrev = () => {
        setStep((p) => Math.max(0, p - 1))
        window.scrollTo(0, 0)
    }

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert("La foto non può superare i 5MB.")
                return
            }
            setPhotoFile(file)
            const reader = new FileReader()
            reader.onloadend = () => setPhotoPreview(reader.result as string)
            reader.readAsDataURL(file)
        }
    }

    const removePhoto = () => {
        setPhotoFile(null)
        setPhotoPreview(null)
    }

    const handleAudioChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                alert("Il file audio non può superare i 10MB.")
                return
            }
            setAudioFile(file)
            form.setValue('audio_uploaded', true)
        }
    }

    const onSubmit = async (_stepData: CandidateFormData) => {
        if (step !== schemas.length - 1) {
            return handleNext()
        }

        try {
            setIsSubmitting(true)
            const supabase = createClient()

            // Get ALL form values — the zodResolver only returns current step's fields,
            // so we must use getValues() to retrieve fields from all previous steps.
            const data = getValues() as CandidateFormData

            // 0. Validate photo
            if (!photoFile) {
                alert("La foto è obbligatoria. Torna allo Step 7 (Audio & Foto) e carica una tua foto.")
                setIsSubmitting(false)
                return
            }

            // 1. Calculate KO Rules
            let isKO = false
            let koReason = null

            if (!data.pq_hours) { isKO = true; koReason = "Non può garantire 4 ore/giorno" }
            else if (!data.pq_days) { isKO = true; koReason = "Non può lavorare 3 giorni/settimana" }
            else if (!data.pq_punctuality) { isKO = true; koReason = "Non può garantire puntualità" }
            else if (!data.pq_italian) { isKO = true; koReason = "Italiano non fluido" }
            else if (data.italian_level === "low") { isKO = true; koReason = "Livello italiano insufficiente" }
            else if (data.hours_per_day < 4) { isKO = true; koReason = "Disponibilità oraria insufficiente (< 4h/giorno)" }
            else if (data.days_per_week < 3) { isKO = true; koReason = "Disponibilità giornaliera insufficiente (< 3gg/settimana)" }

            // 1b. Upload Photo
            let finalPhotoUrl = null
            if (photoFile) {
                const photoExt = photoFile.name.split('.').pop()
                const photoName = `${data.first_name.toLowerCase()}_${data.last_name.toLowerCase()}_${Date.now()}.${photoExt}`
                const { error: photoUploadError, data: photoUploadData } = await supabase.storage
                    .from('candidate-photos')
                    .upload(photoName, photoFile)

                if (!photoUploadError && photoUploadData) {
                    finalPhotoUrl = supabase.storage.from('candidate-photos').getPublicUrl(photoName).data.publicUrl
                }
            }

            // 2. Upload Audio if exists
            let finalAudioUrl = null
            if (audioFile) {
                const fileExt = audioFile.name.split('.').pop()
                const fileName = `${data.first_name.toLowerCase()}_${data.last_name.toLowerCase()}_${Date.now()}.${fileExt}`
                const { error: uploadError, data: uploadData } = await supabase.storage
                    .from('candidate-audio')
                    .upload(fileName, audioFile)

                if (!uploadError && uploadData) {
                    finalAudioUrl = supabase.storage.from('candidate-audio').getPublicUrl(fileName).data.publicUrl
                }
            }

            // 3. Scoring (Simplified here, in production it should fetch weights from admin_settings, but we hardcode the defaults for the edge function / frontend for simplicity as per spec)
            let score = 0
            let priority = 'low'

            if (!isKO) {
                score += data.italian_level === 'high' ? 20 : (data.italian_level === 'medium' ? 10 : 0)
                score += (data.inbound_outbound === "inbound" || data.inbound_outbound === "entrambi") ? 15 : 0
                score += data.close_rate_range === "30%+" ? 10 : 0
                score += data.hours_per_day >= 6 ? 10 : 0
                score += (data.weekend_availability && data.weekend_availability !== 'no') ? 5 : 0

                let roleplayScore = 0
                if ((data.roleplay_think_about_it?.length || 0) >= 200) roleplayScore += 5
                if ((data.roleplay_think_about_it?.length || 0) >= 350) roleplayScore += 3
                if ((data.roleplay_think_about_it?.length || 0) >= 500) roleplayScore += 2

                if ((data.roleplay_bundle3?.length || 0) >= 200) roleplayScore += 5
                if ((data.roleplay_bundle3?.length || 0) >= 350) roleplayScore += 3
                if ((data.roleplay_bundle3?.length || 0) >= 500) roleplayScore += 2
                score += Math.min(roleplayScore, 20)

                score += finalAudioUrl ? 5 : 0

                if (score >= 75) priority = 'high'
                else if (score >= 55) priority = 'medium'
            }

            // 4. Build score breakdown
            const scoreBreakdown = isKO ? {} : {
                italian: data.italian_level === 'high' ? 20 : (data.italian_level === 'medium' ? 10 : 0),
                experience: (data.inbound_outbound === "inbound" || data.inbound_outbound === "entrambi") ? 15 : 0,
                close_rate: data.close_rate_range === "30%+" ? 10 : 0,
                availability: data.hours_per_day >= 6 ? 10 : 0,
                weekend: (data.weekend_availability && data.weekend_availability !== 'no') ? 5 : 0,
                roleplay: Math.min(
                    ((data.roleplay_think_about_it?.length || 0) >= 200 ? 5 : 0) +
                    ((data.roleplay_think_about_it?.length || 0) >= 350 ? 3 : 0) +
                    ((data.roleplay_think_about_it?.length || 0) >= 500 ? 2 : 0) +
                    ((data.roleplay_bundle3?.length || 0) >= 200 ? 5 : 0) +
                    ((data.roleplay_bundle3?.length || 0) >= 350 ? 3 : 0) +
                    ((data.roleplay_bundle3?.length || 0) >= 500 ? 2 : 0),
                    20
                ),
                audio: finalAudioUrl ? 5 : 0,
            }

            // 5. Save to DB
            const dbPayload = {
                first_name: data.first_name,
                last_name: data.last_name,
                email: data.email,
                whatsapp: phonePrefix + ' ' + (data.whatsapp || '').replace(/^\+?\d+\s*/, ''),
                city: data.city,
                country: data.country,
                birth_date: data.birth_date,
                nationality: data.nationality,
                native_language: data.native_language,
                italian_level: data.italian_level,
                english_level: data.english_level,
                other_languages: [...spokenLanguages, otherLanguagesText].filter(Boolean).join(', ') || null,
                strong_accent: data.strong_accent,
                bio_short: data.bio_short,
                hours_per_day: data.hours_per_day,
                days_per_week: data.days_per_week,
                time_slots: data.time_slots,
                start_date: data.start_date,
                weekend_sat: ['sempre', 'solo_sabato'].includes(data.weekend_availability || ''),
                weekend_sun: ['sempre', 'solo_domenica'].includes(data.weekend_availability || ''),
                weekend_details: data.weekend_details || null,
                holidays: data.holidays,
                sales_years: data.sales_years,
                inbound_outbound: data.inbound_outbound,
                sectors: data.sectors,
                close_rate_range: data.close_rate_range,
                motivation: data.motivation,
                roleplay_think_about_it: data.roleplay_think_about_it,
                roleplay_bundle3: data.roleplay_bundle3,
                photo_url: finalPhotoUrl,
                audio_url: finalAudioUrl,
                audio_uploaded: !!finalAudioUrl,
                score_total: score,
                score_breakdown: scoreBreakdown,
                priority: priority,
                status: isKO ? 'rejected' : 'new',
                ko_reason: isKO ? koReason : null,
                pq_hours: !!data.pq_hours,
                pq_days: !!data.pq_days,
                pq_punctuality: !!data.pq_punctuality,
                pq_italian: !!data.pq_italian,
                consent_privacy: data.consent_privacy,
                consent_truth: data.consent_truth,
                consent_whatsapp: data.consent_whatsapp || false,
            }

            const { error } = await supabase.from('candidates').insert(dbPayload)

            if (error) {
                console.error("DB Error", error)
                alert("Si è verificato un errore durante l'invio. Riprova più tardi.")
                return
            }

            // 4.5. Invia notifica via Email (Resend webhook interno)
            try {
                await fetch('/api/send-notification', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        first_name: data.first_name,
                        last_name: data.last_name,
                        email: data.email,
                        whatsapp: phonePrefix + ' ' + (data.whatsapp || '').replace(/^\+?\d+\s*/, ''),
                        score_total: score,
                        priority: priority,
                        isKO: isKO
                    })
                })
            } catch (err) {
                console.error("Errore notifica email:", err)
            }

            // 5. Redirect based on KO
            if (isKO) {
                router.push('/not-eligible')
            } else {
                router.push('/thanks')
            }

        } catch (err) {
            console.error(err)
            alert("Errore imprevisto. Riprova.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const renderStepContent = () => {
        switch (step) {
            case 0:
                return (
                    <div className="space-y-6">
                        <p className="text-text-muted mb-6">Prima di iniziare, abbiamo bisogno di confermare con la massima onestà alcuni requisiti base. Se non li possiedi, questa opportunità purtroppo non farà per te.</p>
                        {[
                            { id: 'pq_hours', label: 'Posso garantire minimo 4 ore al giorno per il lavoro di consulenza.' },
                            { id: 'pq_days', label: 'Posso lavorare almeno 3 giorni a settimana costantemente.' },
                            { id: 'pq_punctuality', label: 'Posso rispettare gli appuntamenti presi senza ritardi o assenze ingiustificate.' },
                            { id: 'pq_italian', label: 'Parlo italiano in modo fluido, naturale e comprensibile (clientela 100% ITA).' }
                        ].map((q) => (
                            <label key={q.id} className="flex items-start gap-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                                <input type="checkbox" {...register(q.id as keyof CandidateFormData)} className="mt-1 w-5 h-5 text-blue-600 rounded accent-blue-600" />
                                <span className="text-text-main font-medium">{q.label}</span>
                            </label>
                        ))}
                        {(errors.pq_hours || errors.pq_days || errors.pq_punctuality || errors.pq_italian) && (
                            <p className="text-error text-sm font-semibold">Devi spuntare tutti i requisiti per continuare.</p>
                        )}
                    </div>
                )
            case 1:
                return (
                    <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-text-main">Nome *</label>
                                <input {...register("first_name")} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600" placeholder="Es. Marco" />
                                {errors.first_name && <span className="text-error text-xs">{errors.first_name.message}</span>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-text-main">Cognome *</label>
                                <input {...register("last_name")} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600" placeholder="Es. Rossi" />
                                {errors.last_name && <span className="text-error text-xs">{errors.last_name.message}</span>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-text-main">Email *</label>
                            <input type="email" {...register("email")} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600" placeholder="marco.rossi@email.com" />
                            {errors.email && <span className="text-error text-xs">{errors.email.message}</span>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-text-main">Numero WhatsApp * <span className="font-normal text-text-muted">(usato per le comunicazioni)</span></label>
                            <div className="flex gap-2">
                                <select
                                    value={phonePrefix}
                                    onChange={(e) => setPhonePrefix(e.target.value)}
                                    className="shrink-0 w-[72px] border border-gray-300 rounded-xl px-3 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 appearance-none text-sm font-medium"
                                >
                                    {COUNTRIES.filter(c => c !== 'Altro').map(c => (
                                        <option key={c} value={COUNTRY_PREFIXES[c]}>{COUNTRY_PREFIXES[c]}</option>
                                    ))}
                                </select>
                                <input type="tel" {...register("whatsapp")} className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600" placeholder="333 000 0000" />
                            </div>
                            {errors.whatsapp && <span className="text-error text-xs">{errors.whatsapp.message}</span>}
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-text-main">Paese di residenza *</label>
                                <select {...register("country", {
                                    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => {
                                        const prefix = COUNTRY_PREFIXES[e.target.value]
                                        if (prefix) setPhonePrefix(prefix)
                                    }
                                })} className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 appearance-none">
                                    {COUNTRIES.map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                                {errors.country && <span className="text-error text-xs">{errors.country.message}</span>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-text-main">Città *</label>
                                <input {...register("city")} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600" placeholder="Es. Milano" />
                                {errors.city && <span className="text-error text-xs">{errors.city.message}</span>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-text-main">Data di nascita *</label>
                            <input type="date" {...register("birth_date")} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600" />
                            {errors.birth_date && <span className="text-error text-xs">{errors.birth_date.message}</span>}
                        </div>
                    </div>
                )
            case 2:
                return (
                    <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-text-main">Cittadinanza *</label>
                                <select {...register("nationality")} className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 appearance-none">
                                    {NATIONALITIES.map(n => (
                                        <option key={n} value={n}>{n}</option>
                                    ))}
                                </select>
                                {errors.nationality && <span className="text-error text-xs">{errors.nationality.message}</span>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-text-main">Lingua madre *</label>
                                <input {...register("native_language")} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600" />
                                {errors.native_language && <span className="text-error text-xs">{errors.native_language.message}</span>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-text-main">Livello di italiano parlato *</label>
                            <select {...register("italian_level")} className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 appearance-none">
                                <option value="">Seleziona...</option>
                                <option value="high">Madrelingua / Bilingue</option>
                                <option value="medium">Avanzato / Fluente con piccolo accento</option>
                                <option value="low">Scolastico / Base (Mi arrangio)</option>
                            </select>
                            {errors.italian_level && <span className="text-error text-xs">{errors.italian_level.message}</span>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-text-main">Livello di inglese *</label>
                            <select {...register("english_level")} className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 appearance-none">
                                <option value="">Seleziona...</option>
                                <option value="none">Nessuna conoscenza</option>
                                <option value="basic">Base (A1-A2)</option>
                                <option value="intermediate">Intermedio (B1-B2)</option>
                                <option value="advanced">Avanzato (C1-C2)</option>
                                <option value="native">Madrelingua / Bilingue</option>
                            </select>
                            {errors.english_level && <span className="text-error text-xs">{errors.english_level.message}</span>}
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-text-main">Altre lingue parlate <span className="font-normal text-text-muted">(oltre italiano e inglese)</span></label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {LANGUAGE_OPTIONS.map(lang => (
                                    <label key={lang} className="flex items-center gap-2 p-2.5 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 text-sm">
                                        <input
                                            type="checkbox"
                                            checked={spokenLanguages.includes(lang)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSpokenLanguages(prev => [...prev, lang])
                                                } else {
                                                    setSpokenLanguages(prev => prev.filter(l => l !== lang))
                                                }
                                            }}
                                            className="w-4 h-4 accent-blue-600 rounded"
                                        />
                                        <span>{lang}</span>
                                    </label>
                                ))}
                            </div>
                            <input
                                value={otherLanguagesText}
                                onChange={(e) => setOtherLanguagesText(e.target.value)}
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                                placeholder="Altre lingue non in elenco (es. Giapponese, Hindi...)"
                            />
                        </div>

                        <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
                            <input type="checkbox" {...register("strong_accent")} className="w-5 h-5 accent-blue-600 rounded" />
                            <span className="text-sm font-medium">Ho un forte accento dialettale (regionale o straniero) molto marcato.</span>
                        </label>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-text-main">Presentati in 2 righe (Breve Bio) *</label>
                            <textarea {...register("bio_short")} rows={3} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none" placeholder="Chi sei? Cosa fai di bello nella vita? (max 300 caratteri)"></textarea>
                            <p className="text-xs text-text-muted text-right">Minimo 20 caratteri</p>
                            {errors.bio_short && <span className="text-error text-xs">{errors.bio_short.message}</span>}
                        </div>
                    </div>
                )
            case 3:
                return (
                    <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-text-main">Ore medie disponibili al giorno *</label>
                                <input type="number" {...register("hours_per_day")} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600" placeholder="Es. 4" />
                                {errors.hours_per_day && <span className="text-error text-xs">{errors.hours_per_day.message}</span>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-text-main">Giorni disponibili a settimana *</label>
                                <input type="number" {...register("days_per_week")} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600" placeholder="Es. 5" />
                                {errors.days_per_week && <span className="text-error text-xs">{errors.days_per_week.message}</span>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-text-main">Quali sono le tue fasce orarie ideali? * <span className="font-normal text-text-muted">(seleziona tutte quelle che ti si addicono)</span></label>
                            <div className="grid grid-cols-1 gap-2">
                                {[
                                    'Mattina (9:00 – 13:00)',
                                    'Pomeriggio (13:00 – 17:00)',
                                    'Sera (17:00 – 21:00)',
                                ].map(slot => (
                                    <label key={slot} className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
                                        <input
                                            type="checkbox"
                                            checked={selectedTimeSlots.includes(slot)}
                                            onChange={(e) => {
                                                const updated = e.target.checked
                                                    ? [...selectedTimeSlots, slot]
                                                    : selectedTimeSlots.filter(s => s !== slot)
                                                setSelectedTimeSlots(updated)
                                                form.setValue('time_slots', updated.join(', '), { shouldValidate: true })
                                            }}
                                            className="w-4 h-4 accent-blue-600"
                                        />
                                        <span className="text-sm font-medium">{slot}</span>
                                    </label>
                                ))}
                            </div>
                            <input type="hidden" {...register("time_slots")} />
                            {errors.time_slots && <span className="text-error text-xs">{errors.time_slots.message}</span>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-text-main">Da quando saresti operativo? *</label>
                            <select {...register("start_date")} className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 appearance-none">
                                <option value="">Seleziona...</option>
                                <option value="Da subito">Da subito</option>
                                <option value="Entro 1 settimana">Entro 1 settimana</option>
                                <option value="Entro 2 settimane">Entro 2 settimane</option>
                                <option value="Entro 1 mese">Entro 1 mese</option>
                                <option value="Da concordare">Da concordare</option>
                            </select>
                            {errors.start_date && <span className="text-error text-xs">{errors.start_date.message}</span>}
                        </div>

                        <div className="pt-4 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-text-main">Puoi lavorare nel fine settimana? *</label>
                                <select {...register("weekend_availability")} className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 appearance-none">
                                    <option value="">Seleziona...</option>
                                    <option value="sempre">Sì, sempre (sabato e domenica)</option>
                                    <option value="solo_sabato">Solo il sabato</option>
                                    <option value="solo_domenica">Solo la domenica</option>
                                    <option value="qualche_weekend">Qualche weekend (non tutti)</option>
                                    <option value="no">No, non sono disponibile nel weekend</option>
                                </select>
                                {errors.weekend_availability && <span className="text-error text-xs">{errors.weekend_availability.message}</span>}
                            </div>

                            {form.watch("weekend_availability") && form.watch("weekend_availability") !== "no" && (
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-text-main">Dettagli disponibilità weekend <span className="font-normal text-text-muted">(fasce orarie, frequenza, ecc.)</span></label>
                                    <input {...register("weekend_details")} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600" placeholder="Es. Sabato mattina 9-13, qualche domenica pomeriggio" />
                                </div>
                            )}

                            <label className="flex items-center gap-3">
                                <input type="checkbox" {...register("holidays")} className="w-4 h-4 accent-blue-600" />
                                <span className="text-sm">Disponibile anche nei giorni festivi (rossi sul calendario)</span>
                            </label>
                        </div>
                    </div>
                )
            case 4:
                return (
                    <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-text-main">Anni di esperienza nella vendita *</label>
                                <input type="number" {...register("sales_years")} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600" placeholder="Metti 0 se non l'hai mai fatto" />
                                {errors.sales_years && <span className="text-error text-xs">{errors.sales_years.message}</span>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-text-main">Tipologia chiamate *</label>
                                <select {...register("inbound_outbound")} className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 appearance-none">
                                    <option value="">Seleziona...</option>
                                    <option value="inbound">Solo Inbound (contatti caldi)</option>
                                    <option value="outbound">Solo Outbound (liste a freddo)</option>
                                    <option value="entrambi">Entrambi</option>
                                    <option value="nessuno">Nessuna esperienza</option>
                                </select>
                                {errors.inbound_outbound && <span className="text-error text-xs">{errors.inbound_outbound.message}</span>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-text-main">In quali settori hai venduto? <span className="font-normal text-text-muted">(Se hai esperienza)</span></label>
                            <input {...register("sectors")} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600" placeholder="Es. Energia, Fitness, Assicurazioni, ecc." />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-text-main">Qual è stato il tuo Close Rate (Tasso di chiusura) finora? *</label>
                            <select {...register("close_rate_range")} className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 appearance-none">
                                <option value="">Seleziona...</option>
                                <option value="0-10%">0-10% (o Nessuna Esperienza)</option>
                                <option value="10-20%">10-20%</option>
                                <option value="20-30%">20-30%</option>
                                <option value="30%+">30% o superiore</option>
                            </select>
                            {errors.close_rate_range && <span className="text-error text-xs">{errors.close_rate_range.message}</span>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-text-main">Perché vorresti questo ruolo? *</label>
                            <textarea {...register("motivation")} rows={4} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none" placeholder="Cosa ti spinge a candidarti per questa posizione in Forever Slim?"></textarea>
                            <p className="text-xs text-text-muted text-right">Minimo 30 caratteri</p>
                            {errors.motivation && <span className="text-error text-xs">{errors.motivation.message}</span>}
                        </div>
                    </div>
                )
            case 5:
                return (
                    <div className="space-y-8">
                        <p className="text-text-muted">Questa è la parte più importante per noi. Vogliamo capire come ragioni e come guidi le persone verso la scelta migliore. Non usare l'intelligenza artificiale, apprezziamo la genuinità.</p>

                        <div className="space-y-4 bg-blue-100/30 p-6 rounded-2xl border border-blue-100">
                            <h4 className="font-bold text-lg">Scenario 1: L'Obiezione</h4>
                            <p className="text-sm italic">"Il prodotto mi piace molto e ne ho sicuramente bisogno visti i chili da scalare, ma per me sono soldi, ci devo pensare..."</p>
                            <div className="space-y-2 mt-4">
                                <label className="text-sm font-semibold text-text-main">Ascolti queste parole dal cliente. Cosa dici esattamente per rispondergli e provare a chiuderlo senza sembrare aggressivo? *</label>
                                <textarea {...register("roleplay_think_about_it")} rows={6} className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none" placeholder="Scrivi parola per parola cosa diresti..."></textarea>
                                <p className="text-xs text-text-muted text-right">Minimo 30 caratteri. Valutiamo l'empatia e la tecnica.</p>
                                {errors.roleplay_think_about_it && <span className="text-error text-xs">{errors.roleplay_think_about_it.message}</span>}
                            </div>
                        </div>

                        <div className="space-y-4 bg-blue-100/30 p-6 rounded-2xl border border-blue-100">
                            <h4 className="font-bold text-lg">Scenario 2: L'Upsell Protettivo</h4>
                            <p className="text-sm italic">Il cliente vuole acquistare solo 1 scatola per "provare". Tu sai che per avere risultati visibili gli servono almeno 3 mesi, e offrite un kit da 3 scatole con forte sconto.</p>
                            <div className="space-y-2 mt-4">
                                <label className="text-sm font-semibold text-text-main">Cosa e come glielo dici per convincerlo a prendere il kit da 3 scatole (che conviene sia a lui che al tuo portafoglio) invece di quello da 1 scatola? *</label>
                                <textarea {...register("roleplay_bundle3")} rows={6} className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none" placeholder="Scrivi la tua spiegazione/presentazione della proposta..."></textarea>
                                <p className="text-xs text-text-muted text-right">Minimo 30 caratteri</p>
                                {errors.roleplay_bundle3 && <span className="text-error text-xs">{errors.roleplay_bundle3.message}</span>}
                            </div>
                        </div>
                    </div>
                )
            case 6:
                return (
                    <div className="space-y-8">
                        {/* Audio */}
                        <div className="flex flex-col items-center space-y-4">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-2">
                                <Headphones className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold text-center">Inviaci un breve memo vocale</h3>
                            <p className="text-text-muted text-center max-w-md">
                                Il tuo strumento di lavoro è la voce. Un breve audio in cui ti presenti (chi sei, perché dovremmo sceglierti) di 30-45 secondi vale più di mille parole scritte e accelera nettamente la valutazione.
                            </p>
                            <div className="w-full max-w-md mt-4">
                                <label className="w-full flex justify-center items-center px-4 py-6 bg-white border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:bg-gray-50 hover:border-blue-600 transition-colors">
                                    <input type="file" accept="audio/*" className="hidden" onChange={handleAudioChange} />
                                    <div className="flex flex-col items-center gap-2">
                                        <Upload className="w-6 h-6 text-gray-400" />
                                        {audioFile ? (
                                            <span className="text-sm font-semibold text-success flex items-center gap-2"><Check className="w-4 h-4" /> {audioFile.name} (Pronto)</span>
                                        ) : (
                                            <span className="text-sm font-medium text-text-muted">Tocca per caricare un file audio (.mp3, .m4a)</span>
                                        )}
                                    </div>
                                </label>
                            </div>
                            <p className="text-xs text-text-muted uppercase font-semibold tracking-wider">L'audio è facoltativo ma consigliatissimo</p>
                        </div>

                        {/* Foto */}
                        <div className="border-t border-gray-200 pt-8">
                            <div className="space-y-3">
                                <label className="text-sm font-semibold text-text-main">La tua foto *</label>
                                <p className="text-xs text-text-muted">Carica una tua foto recente e ben visibile (volto in primo piano). Formati: JPG, PNG, WebP. Max 5MB.</p>
                                {photoPreview ? (
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <img src={photoPreview} alt="Anteprima foto" className="w-24 h-24 rounded-2xl object-cover border-2 border-blue-600 shadow-sm" />
                                            <button type="button" onClick={removePhoto} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-sm">
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                        <div className="text-sm text-green-600 font-semibold flex items-center gap-1.5">
                                            <Check className="w-4 h-4" /> Foto caricata
                                        </div>
                                    </div>
                                ) : (
                                    <label className="flex items-center justify-center gap-3 px-4 py-6 bg-white border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:bg-gray-50 hover:border-blue-600 transition-colors">
                                        <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handlePhotoChange} />
                                        <Camera className="w-6 h-6 text-gray-400" />
                                        <span className="text-sm font-medium text-text-muted">Tocca per caricare la tua foto</span>
                                    </label>
                                )}
                            </div>
                        </div>
                    </div>
                )
            case 7:
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold border-b border-gray-100 pb-4 mb-6">Ultimo step: conferme</h3>

                        <div className="space-y-4">
                            <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                                <input type="checkbox" {...register("consent_truth")} className="mt-1 w-5 h-5 text-blue-600 rounded accent-blue-600" />
                                <span className="text-text-main text-sm">Dichiaro formalmente che tutte le informazioni fornite (incluse le prove pratiche) sono state redatte in completa autonomia, senza l'uso di Intelligenza Artificiale, e riflettono la realtà.</span>
                            </label>
                            {errors.consent_truth && <span className="text-error text-xs font-semibold">{errors.consent_truth.message}</span>}

                            <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                                <input type="checkbox" {...register("consent_privacy")} className="mt-1 w-5 h-5 text-blue-600 rounded accent-blue-600" />
                                <span className="text-text-main text-sm">Acconsento al trattamento dei miei dati personali ai fini del processo di selezione e dichiaro di aver letto la Privacy Policy.</span>
                            </label>
                            {errors.consent_privacy && <span className="text-error text-xs font-semibold">{errors.consent_privacy.message}</span>}

                            <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                                <input type="checkbox" {...register("consent_whatsapp")} className="mt-1 w-5 h-5 text-blue-600 rounded accent-blue-600" />
                                <span className="text-text-main text-sm">Acconsento a ricevere comunicazioni via WhatsApp sul numero inserito relative all'esito della selezione ed eventuale onboarding.</span>
                            </label>
                        </div>
                    </div>
                )
        }
    }

    return (
        <div className="min-h-screen bg-bg-alt py-12 px-4 pb-28 md:pb-12 selection:bg-blue-600 selection:text-white">
            {stepSuccess && (
                <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
                    <div className="bg-green-500 text-white text-sm font-semibold px-6 py-3 rounded-2xl shadow-lg flex items-center gap-2">
                        <Check className="w-4 h-4" /> Ottimo! Continua così.
                    </div>
                </div>
            )}
            <div className="max-w-3xl mx-auto">
                <div className="mb-8 p-6 bg-white rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex justify-center mb-6">
                        <img src="/images/closer-agency-logo.png" alt="Closer Agency" className="h-14 w-auto" />
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 border-b border-gray-100 pb-6">
                        {/* Progress Stepper Visuals (Simplified mobile-friendly line) */}
                        <div className="col-span-2 lg:col-span-4 flex items-center">
                            <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                                <div
                                    className="bg-blue-600 h-full transition-all duration-500 ease-in-out"
                                    style={{ width: `${Math.round(((step + 1) / schemas.length) * 100)}%` }}
                                />
                            </div>
                            <div className="ml-3 text-xs font-bold text-blue-600 shrink-0">
                                {Math.round(((step + 1) / schemas.length) * 100)}%
                            </div>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-text-main mb-6">{stepTitles[step]}</h2>
                        <form onSubmit={handleSubmit(onSubmit as any)} autoComplete="off" className="space-y-8">

                            <div key={step}>{renderStepContent()}</div>

                            <div className="fixed bottom-0 left-0 right-0 z-40 md:static bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] md:shadow-none md:border-gray-100 px-4 pb-4 pt-3 md:px-0 md:pt-6 md:pb-0 md:mt-8">
                                <div className="flex gap-4 max-w-3xl mx-auto md:mx-0">
                                    {step > 0 && (
                                        <button
                                            type="button"
                                            onClick={handlePrev}
                                            className="px-6 py-3 rounded-xl border border-gray-200 font-semibold text-text-main hover:bg-gray-50 transition-colors flex items-center gap-2"
                                        >
                                            <ChevronLeft className="w-5 h-5" /> Indietro
                                        </button>
                                    )}

                                    <button
                                        type="button"
                                        onClick={handleSubmit(onSubmit as any)}
                                        disabled={isSubmitting}
                                        className="flex-1 px-6 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {isSubmitting ? (
                                            <><Loader2 className="w-5 h-5 animate-spin" /> Elaborazione...</>
                                        ) : (
                                            step === schemas.length - 1 ? (
                                                <><Check className="w-5 h-5" /> Invia Candidatura</>
                                            ) : (
                                                <>Avanti <ChevronRight className="w-5 h-5" /></>
                                            )
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
