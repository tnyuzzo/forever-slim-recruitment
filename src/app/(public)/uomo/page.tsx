import Hero from '@/components/landing-uomo/Hero'
import WhatYouDo from '@/components/landing-uomo/WhatYouDo'
import WarmLeads from '@/components/landing-uomo/WarmLeads'
import Compensation from '@/components/landing-uomo/Compensation'
import Requirements from '@/components/landing-uomo/Requirements'
import Support from '@/components/landing-uomo/Support'
import Process from '@/components/landing-uomo/Process'
import FAQ from '@/components/landing-uomo/FAQ'
import FinalCTA from '@/components/landing-uomo/FinalCTA'
import Footer from '@/components/landing-uomo/Footer'
import StickyCTA from '@/components/landing-uomo/StickyCTA'

export const metadata = {
    title: 'Opportunità Vendita Consulenziale (Uomo) | Lavora da Casa',
    description: 'Niente chiamate a freddo: solo appuntamenti già prenotati. Lavora da casa con i tuoi orari nel settore benessere e controllo peso.',
}

export default function HomePageUomo() {
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
