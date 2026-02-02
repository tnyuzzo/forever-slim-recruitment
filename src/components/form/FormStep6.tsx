'use client'

import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { step6Schema, Step6Data } from '@/lib/validation'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import { Mic, Upload, X, Play, Pause, Check } from 'lucide-react'

interface FormStep6Props {
  defaultValues?: Partial<Step6Data>
  candidateId?: string
  onNext: (data: Step6Data) => void
  onBack: () => void
}

export default function FormStep6({ defaultValues, candidateId, onNext, onBack }: FormStep6Props) {
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(defaultValues?.audio_url || null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadSuccess, setUploadSuccess] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { handleSubmit, setValue } = useForm<Step6Data>({
    resolver: zodResolver(step6Schema),
    defaultValues: {
      audio_url: defaultValues?.audio_url || '',
      audio_uploaded: defaultValues?.audio_uploaded || false,
    },
  })

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        setAudioBlob(blob)
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setUploadError(null)
      setUploadSuccess(false)
    } catch {
      setUploadError('Impossibile accedere al microfono. Verifica i permessi del browser.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Il file è troppo grande. Massimo 10MB.')
      return
    }

    // Validate file type
    const validTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/webm', 'audio/mp4']
    if (!validTypes.includes(file.type)) {
      setUploadError('Formato non supportato. Usa MP3, WAV, OGG, WebM o M4A.')
      return
    }

    setAudioBlob(file)
    const url = URL.createObjectURL(file)
    setAudioUrl(url)
    setUploadError(null)
    setUploadSuccess(false)
  }

  const clearAudio = () => {
    if (audioUrl && !audioUrl.startsWith('http')) {
      URL.revokeObjectURL(audioUrl)
    }
    setAudioBlob(null)
    setAudioUrl(null)
    setUploadSuccess(false)
    setValue('audio_url', '')
    setValue('audio_uploaded', false)
  }

  const togglePlayback = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const uploadAudio = async () => {
    if (!audioBlob) return

    setIsUploading(true)
    setUploadError(null)

    try {
      const supabase = createClient()
      const timestamp = Date.now()
      const extension = audioBlob.type.split('/')[1] || 'webm'
      const filename = `${candidateId || 'temp'}_${timestamp}.${extension}`

      const { data, error } = await supabase.storage
        .from('candidate-audio')
        .upload(filename, audioBlob, {
          contentType: audioBlob.type,
          upsert: true,
        })

      if (error) throw error

      const { data: urlData } = supabase.storage
        .from('candidate-audio')
        .getPublicUrl(data.path)

      setValue('audio_url', urlData.publicUrl)
      setValue('audio_uploaded', true)
      setUploadSuccess(true)
    } catch (err) {
      console.error('Upload error:', err)
      setUploadError('Errore durante il caricamento. Riprova.')
    } finally {
      setIsUploading(false)
    }
  }

  const onSubmit = (data: Step6Data) => {
    onNext(data)
  }

  const handleSkip = () => {
    onNext({ audio_url: '', audio_uploaded: false })
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Audio di presentazione</h2>
        <p className="text-gray-600">
          Facoltativo: un breve audio di presentazione (30-45 secondi). Accelera la valutazione ma puoi saltarlo.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Recording/Upload Section */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          {!audioUrl ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 text-center mb-4">
                Registra direttamente o carica un file audio esistente
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {!isRecording ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={startRecording}
                    className="flex items-center gap-2"
                  >
                    <Mic className="w-4 h-4" />
                    Registra audio
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="danger"
                    onClick={stopRecording}
                    className="flex items-center gap-2 animate-pulse"
                  >
                    <div className="w-3 h-3 bg-white rounded-full" />
                    Stop registrazione
                  </Button>
                )}

                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Carica file
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {isRecording && (
                <div className="flex items-center justify-center gap-2 text-red-600">
                  <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                  <span className="text-sm">Registrazione in corso...</span>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Audio Player */}
              <div className="flex items-center gap-4 bg-white rounded-lg p-4 border border-gray-200">
                <button
                  type="button"
                  onClick={togglePlayback}
                  className="w-12 h-12 rounded-full bg-[#D946A8] text-white flex items-center justify-center hover:bg-[#C026A0] transition-colors"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </button>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Audio registrato</p>
                  <p className="text-xs text-gray-500">Premi play per ascoltare</p>
                </div>
                <button
                  type="button"
                  onClick={clearAudio}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <audio
                ref={audioRef}
                src={audioUrl}
                onEnded={() => setIsPlaying(false)}
                className="hidden"
              />

              {/* Upload Button */}
              {!uploadSuccess && (
                <Button
                  type="button"
                  onClick={uploadAudio}
                  isLoading={isUploading}
                  fullWidth
                  className="flex items-center justify-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Carica audio
                </Button>
              )}

              {uploadSuccess && (
                <div className="flex items-center gap-2 justify-center text-green-600 bg-green-50 rounded-lg p-3">
                  <Check className="w-5 h-5" />
                  <span className="font-medium">Audio caricato con successo</span>
                </div>
              )}
            </div>
          )}

          {uploadError && (
            <p className="mt-3 text-sm text-red-600 text-center">{uploadError}</p>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-[#FDF2F8] rounded-lg p-4 border border-[#D946A8]/20">
          <p className="text-sm text-gray-700">
            <strong>Cosa dire nel tuo audio (30-45 secondi):</strong>
          </p>
          <ul className="mt-2 text-sm text-gray-600 space-y-1 list-disc list-inside">
            <li>Chi sei e da dove vieni</li>
            <li>La tua esperienza rilevante</li>
            <li>Perché ti interessa questa opportunità</li>
          </ul>
        </div>

        <div className="flex gap-4 pt-4">
          <Button type="button" variant="outline" onClick={onBack} className="flex-1">
            Indietro
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={handleSkip}
            className="flex-1"
          >
            Salta
          </Button>
          <Button
            type="submit"
            disabled={audioBlob !== null && !uploadSuccess}
            className="flex-1"
          >
            Continua
          </Button>
        </div>
      </form>
    </div>
  )
}
