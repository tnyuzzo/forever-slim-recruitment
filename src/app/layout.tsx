import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Opportunità Vendita Consulenziale | Lavora da Casa',
  description: 'Niente chiamate a freddo: solo appuntamenti già prenotati. Lavora da casa con i tuoi orari nel settore benessere e controllo peso.',
  robots: 'noindex, nofollow',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="it">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
