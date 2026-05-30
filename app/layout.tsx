// app/layout.tsx
import type { Metadata } from 'next'
import { CartProvider } from '@/lib/cart'
import './globals.css'

export const metadata: Metadata = {
  title: 'Din Kebab Pizza & Grill — Lambertseter',
  description: 'Bestill pizza, kebab og hamburger online. Hentes i restauranten på Lambertseter, Oslo.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="no">
      <body>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  )
}
