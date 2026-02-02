import Hero from '@/components/landing/Hero'
import WhatYouDo from '@/components/landing/WhatYouDo'
import WarmLeads from '@/components/landing/WarmLeads'
import Compensation from '@/components/landing/Compensation'
import Requirements from '@/components/landing/Requirements'
import Support from '@/components/landing/Support'
import Process from '@/components/landing/Process'
import FAQ from '@/components/landing/FAQ'
import FinalCTA from '@/components/landing/FinalCTA'
import Footer from '@/components/landing/Footer'
import StickyCTA from '@/components/landing/StickyCTA'

export const metadata = {
  title: 'Opportunità Vendita Consulenziale | Lavora da Casa',
  description: 'Niente chiamate a freddo: solo appuntamenti già prenotati. Lavora da casa con i tuoi orari nel settore benessere e controllo peso.',
}

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Hero />
      <WhatYouDo />
      <WarmLeads />
      <Compensation />
      <Requirements />
      <Support />
      <Process />
      <FAQ />
      <FinalCTA />
      <Footer />
      <StickyCTA />
    </main>
  )
}
