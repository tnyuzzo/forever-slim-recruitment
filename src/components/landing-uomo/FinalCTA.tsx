'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Rocket, Clock } from 'lucide-react'

export default function FinalCTA() {
  return (
    <section className="py-20 md:py-32 relative overflow-hidden bg-slate-900">
      {/* Background gradients */}
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/40 via-transparent to-transparent opacity-60" />
      <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-900/40 via-transparent to-transparent opacity-60" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-[3rem] p-8 md:p-16 lg:p-20 shadow-2xl overflow-hidden relative">

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">

            {/* Image */}
            <div className="relative aspect-square md:aspect-[4/3] lg:aspect-square rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10 group">
              <div className="absolute inset-0 bg-blue-600/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
              <Image
                src="/images/cta_finale_man.png"
                alt="Consulente professionista"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            {/* Text */}
            <div className="space-y-8 text-white">
              <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full text-sm font-bold border border-blue-500/30">
                <Rocket className="w-4 h-4" />
                Il momento per candidarsi è ora
              </div>

              <h2 className="text-3xl md:text-5xl font-black leading-tight tracking-tight">
                Le tue ambizioni.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">Il nostro sistema.</span>
              </h2>

              <div className="space-y-4 text-slate-300 text-lg font-medium leading-relaxed">
                <p>Hai letto fin qui. Sai come funziona, conosci il potenziale economico e comprendi lo standard etico che esigiamo.</p>
                <p>Se ti vedi in questo ruolo, e hai la grinta e la lucidità per chiudere chiamate in inbound, entra nel team.</p>
              </div>

              <div className="pt-6">
                <Link
                  href="/apply-uomo"
                  className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-5 bg-blue-600 hover:bg-blue-500 text-white font-black text-lg rounded-2xl transition-all duration-300 shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)] hover:shadow-[0_0_60px_-15px_rgba(37,99,235,0.6)] hover:-translate-y-1"
                >
                  INVIA CANDIDATURA ORA →
                </Link>
                <div className="mt-4 flex items-center justify-center sm:justify-start gap-3 text-sm text-slate-400 font-medium">
                  <Clock className="w-4 h-4" />
                  <span>3 Minuti • Valutazione 48h • Posti limitati</span>
                </div>
              </div>
            </div>

          </div>

          {/* Decorative globe/glow in background of the card */}
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
        </div>
      </div>
    </section>
  )
}
