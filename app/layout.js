import './globals.css'
import { Playfair_Display, Poppins } from 'next/font/google'
import { config } from '@/lib/config'

// Tipografía elegante para títulos (estilo boutique) + sans moderna para el texto.
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--fuente-titulo',
  display: 'swap',
})
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--fuente-texto',
  display: 'swap',
})

export const metadata = {
  title: `${config.nombreTienda} · ${config.eslogan}`,
  description: `Catálogo de ${config.nombreTienda}. ${config.eslogan}.`,
  icons: { icon: '/logo.svg' },
}

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${playfair.variable} ${poppins.variable}`}>
      <body>{children}</body>
    </html>
  )
}
