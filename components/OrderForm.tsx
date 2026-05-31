// components/OrderForm.tsx
'use client'

import { useState } from 'react'
import { useCart } from '@/lib/cart'

export default function OrderForm() {
  const { items, total } = useCart()
  const [form, setForm] = useState({ name: '', phone: '', pickupTime: '', notat: '' })
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
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderNumber,
          customerName: form.name,
          customerPhone: form.phone,
          pickupTime: form.pickupTime || 'Snarest',
          notat: form.notat.trim(),
          items,
          total,
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.url) throw new Error(data.error || 'Noe gikk galt')

      // Redirect to Stripe — cart is cleared on the success page after payment is confirmed
      window.location.href = data.url
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Ukjent feil'
      setError(msg || 'Kunne ikke starte betaling. Prøv igjen eller ring oss.')
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
      <div style={{ marginBottom: '16px' }}>
        <label style={labelStyle}>Ønsket hentingstid</label>
        <input style={inputStyle} placeholder="f.eks. 18:30 (valgfri)" value={form.pickupTime}
          onChange={e => setForm(f => ({ ...f, pickupTime: e.target.value }))} />
      </div>
      <div style={{ marginBottom: '24px' }}>
        <label style={labelStyle}>Notat til restauranten</label>
        <textarea
          style={{ ...inputStyle, resize: 'vertical', minHeight: '80px', lineHeight: '1.5' }}
          placeholder="f.eks. ingen løk, ekstra saus, allergi... (valgfri)"
          value={form.notat}
          onChange={e => setForm(f => ({ ...f, notat: e.target.value }))}
          maxLength={300}
        />
        {form.notat.length > 0 && (
          <div style={{ textAlign: 'right', fontSize: '11px', color: '#555', marginTop: '4px' }}>
            {form.notat.length}/300
          </div>
        )}
      </div>

      {/* Payment method icons */}
      <div style={{
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
        marginBottom: '16px',
        padding: '12px',
        background: '#1a1a1a',
        borderRadius: '8px',
        border: '1px solid #2a2a2a',
      }}>
        <span style={{ fontSize: '12px', color: '#555', marginRight: '4px' }}>Betaling:</span>
        <span style={{ background: '#fff', borderRadius: '4px', padding: '2px 8px', fontSize: '12px', fontWeight: 700, color: '#1a1a72' }}>VIPPS</span>
        <span style={{ background: '#fff', borderRadius: '4px', padding: '2px 8px', fontSize: '11px', fontWeight: 700, color: '#000' }}>💳 Kort</span>
        <span style={{ background: '#000', borderRadius: '4px', padding: '2px 8px', fontSize: '11px', fontWeight: 700, color: '#fff', border: '1px solid #444' }}> Apple Pay</span>
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
        {loading ? 'Videresender til betaling...' : '🔒 Betal nå →'}
      </button>

      <p style={{ textAlign: 'center', color: '#555', fontSize: '12px', marginTop: '12px' }}>
        Sikker betaling via Stripe
      </p>
    </form>
  )
}
