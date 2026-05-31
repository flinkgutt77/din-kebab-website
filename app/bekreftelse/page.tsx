// app/bekreftelse/page.tsx
'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { Suspense } from 'react'

function BekreftelsContent() {
  const params = useSearchParams()
  const nr = params.get('nr')
  const navn = params.get('navn')
  const total = params.get('total')

  return (
    <main style={{ background: '#111', minHeight: '100vh', padding: '60px 24px', textAlign: 'center' }}>
      <div style={{ maxWidth: '480px', margin: '0 auto' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>✅</div>
        <h1 style={{ color: '#7DC61F', fontWeight: 900, fontSize: '28px', marginBottom: '8px' }}>
          Bestilling mottatt!
        </h1>
        <p style={{ color: '#666', fontSize: '16px', marginBottom: '32px' }}>
          Ordrenr: <strong style={{ color: '#fff' }}>#{nr}</strong>
        </p>

        <div style={{
          background: '#1a1a1a',
          border: '1px solid #2a2a2a',
          borderRadius: '10px',
          padding: '24px',
          marginBottom: '32px',
          textAlign: 'left',
        }}>
          <p style={{ color: '#ccc', margin: '0 0 8px' }}>👤 {navn}</p>
          <p style={{ color: '#ccc', margin: '0 0 8px' }}>📍 Hentes på Lambertseter</p>
          <p style={{ color: '#C8E831', fontWeight: 900, fontSize: '18px', margin: 0 }}>
            💰 Totalt: {total},–
          </p>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #3d6b00, #7DC61F)',
          borderRadius: '10px',
          padding: '16px',
          marginBottom: '24px',
        }}>
          <p style={{ color: '#fff', fontWeight: 700, margin: '0 0 4px' }}>
            📲 Restauranten er varslet!
          </p>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px', margin: 0 }}>
            Spørsmål? Ring oss på <a href="tel:+4798075638" style={{ color: '#ffff00' }}>+47 980 75 638</a>
          </p>
        </div>

        <Link href="/" style={{
          display: 'inline-block',
          color: '#7DC61F',
          fontWeight: 700,
          textDecoration: 'none',
          fontSize: '15px',
        }}>
          ← Tilbake til menyen
        </Link>
      </div>
    </main>
  )
}

export default function BekreftelsePage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div style={{ background: '#111', minHeight: '100vh' }} />}>
        <BekreftelsContent />
      </Suspense>
    </>
  )
}
