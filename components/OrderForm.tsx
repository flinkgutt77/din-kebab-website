// components/OrderForm.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/cart'

export default function OrderForm() {
  const { items, total, clearCart } = useCart()
  const router = useRouter()
  const [form, setForm] = useState({ name: '', phone: '', pickupTime: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim()) {
      setError('Navn og telefon er påkrevd.')
      return
    }
    setLoading(true)
    setError('')

    const orderNumber = String(Date.now()).slice(-5)

    try {
      const res = await fetch('/api/bestill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderNumber,
          customerName: form.name,
          customerPhone: form.phone,
          pickupTime: form.pickupTime || 'Snarest',
          items,
          total,
        }),
      })

      if (!res.ok) throw new Error('Noe gikk galt')

      clearCart()
      router.push(`/bekreftelse?nr=${orderNumber}&navn=${encodeURIComponent(form.name)}&total=${total}`)
    } catch {
      setError('Kunne ikke sende bestillingen. Prøv igjen eller ring oss.')
      setLoading(false)
    }
  }

  const inputStyle = {
    background: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: '6px',
    padding: '12px',
    color: '#fff',
    fontSize: '15px',
    width: '100%',
    boxSizing: 'border-box' as const,
  }

  const labelStyle = {
    color: '#7DC61F',
    fontSize: '11px',
    letterSpacing: '2px',
    textTransform: 'uppercase' as const,
    display: 'block',
    marginBottom: '6px',
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: '16px' }}>
        <label style={labelStyle}>Ditt navn *</label>
        <input style={inputStyle} placeholder="Fullt navn" value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
      </div>
      <div style={{ marginBottom: '16px' }}>
        <label style={labelStyle}>Telefon *</label>
        <input style={inputStyle} placeholder="+47 xxx xx xxx" value={form.phone}
          onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} required
          type="tel" minLength={8} />
      </div>
      <div style={{ marginBottom: '24px' }}>
        <label style={labelStyle}>Ønsket hentingstid</label>
        <input style={inputStyle} placeholder="f.eks. 18:30 (valgfri)" value={form.pickupTime}
          onChange={e => setForm(f => ({ ...f, pickupTime: e.target.value }))} />
      </div>

      {error && <p style={{ color: '#ff4444', marginBottom: '16px', fontSize: '14px' }}>{error}</p>}

      <button type="submit" disabled={loading} style={{
        background: loading ? '#3d6b00' : 'linear-gradient(135deg, #3d6b00, #C8E831)',
        color: '#000',
        border: 'none',
        padding: '16px',
        borderRadius: '8px',
        width: '100%',
        fontWeight: 900,
        fontSize: '16px',
        cursor: loading ? 'not-allowed' : 'pointer',
      }}>
        {loading ? 'Sender...' : 'Send bestilling →'}
      </button>
      <p style={{ color: '#555', fontSize: '12px', textAlign: 'center', marginTop: '12px' }}>
        Betaling skjer ved henting i restauranten
      </p>
    </form>
  )
}
