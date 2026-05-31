// app/layout.tsx
import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import { CartProvider } from '@/lib/cart'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: 'Din Kebab Pizza & Grill — Lambertseter',
  description: 'Bestill pizza, kebab og hamburger online. Hentes i restauranten på Lambertseter, Oslo.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="no" className={poppins.variable}>
      <body style={{ fontFamily: 'var(--font-poppins), sans-serif' }}>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  )
}
