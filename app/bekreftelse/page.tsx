// app/bekreftelse/page.tsx
'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { Suspense, useEffect, useState } from 'react'

function BekreftelsContent() {
  const params = useSearchParams()
  const sessionId = params.get('session_id')
  const nr = params.get('nr')

  const [status, setStatus] = useState<'loading' | 'ok' | 'error'>('loading')
  const [orderData, setOrderData] = useState<{ orderNumber: string; customerName: string; total: number } | null>(null)

  useEffect(() => {
    if (!sessionId) {
      setStatus('error')
      return
    }

    // Confirm payment and notify restaurant
    fetch('/api/confirm-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setOrderData(data)
          setStatus('ok')
        } else {
          setStatus('error')
        }
      })
      .catch(() => setStatus('error'))
  }, [sessionId])

  if (status === 'loading') {
    return (
      <main style={{ background: '#111', minHeight: '100vh', padding: '60px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '480px', margin: '0 auto' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
          <p style={{ color: '#7DC61F', fontSize: '18px', fontWeight: 700 }}>Bekrefter betaling...</p>
        </div>
      </main>
    )
  }

  if (status === 'error') {
    return (
      <main style={{ background: '#111', minHeight: '100vh', padding: '60px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '480px', margin: '0 auto' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
          <h1 style={{ color: '#ff4444', fontWeight: 900, fontSize: '24px', marginBottom: '12px' }}>
            Noe gikk galt
          </h1>
          <p style={{ color: '#888', marginBottom: '24px' }}>
            Betalingen kan ha gått gjennom — ring oss på{' '}
            <a href="tel:+4722284000" style={{ color: '#7DC61F' }}>+47 22 28 40 00</a> for å bekrefte.
          </p>
          <Link href="/" style={{ color: '#7DC61F', fontWeight: 700, textDecoration: 'none' }}>
            ← Tilbake til menyen
          </Link>
        </div>
      </main>
    )
  }

  const { orderNumber, customerName, total } = orderData!

  return (
    <main style={{ background: '#111', minHeight: '100vh', padding: '60px 24px', textAlign: 'center' }}>
      <div style={{ maxWidth: '480px', margin: '0 auto' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>✅</div>
        <h1 style={{ color: '#7DC61F', fontWeight: 900, fontSize: '28px', marginBottom: '8px' }}>
          Bestilling mottatt!
        </h1>
        <p style={{ color: '#666', fontSize: '16px', marginBottom: '32px' }}>
          Ordrenr: <strong style={{ color: '#fff' }}>#{orderNumber || nr}</strong>
        </p>

        <div style={{
          background: '#1a1a1a',
          border: '1px solid #2a2a2a',
          borderRadius: '10px',
          padding: '24px',
          marginBottom: '32px',
          textAlign: 'left',
        }}>
          <p style={{ color: '#ccc', margin: '0 0 8px' }}>👤 {customerName}</p>
          <p style={{ color: '#ccc', margin: '0 0 8px' }}>📍 Hentes på Feltspatveien 25, Oslo</p>
          <p style={{ color: '#C8E831', fontWeight: 900, fontSize: '18px', margin: '0 0 8px' }}>
            💰 Totalt: {total},–
          </p>
          <p style={{ color: '#7DC61F', fontSize: '13px', margin: 0 }}>
            ✓ Betalt online
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
            Spørsmål? Ring oss på <a href="tel:+4722284000" style={{ color: '#ffff00' }}>+47 22 28 40 00</a>
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
