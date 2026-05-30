// app/bestilling/page.tsx
'use client'

import Link from 'next/link'
import Navbar from '@/components/Navbar'
import OrderForm from '@/components/OrderForm'
import { useCart } from '@/lib/cart'

export default function BestillingPage() {
  const { items, total, removeItem } = useCart()

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <main style={{ background: '#111', minHeight: '100vh', padding: '60px 24px', textAlign: 'center' }}>
          <p style={{ color: '#666', fontSize: '18px', marginBottom: '24px' }}>Handlekurven er tom.</p>
          <Link href="/" style={{ color: '#7DC61F', fontWeight: 700 }}>← Gå til menyen</Link>
        </main>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main style={{ background: '#111', minHeight: '100vh', padding: '40px 24px' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <Link href="/" style={{ color: '#7DC61F', fontSize: '14px', textDecoration: 'none' }}>← Tilbake til meny</Link>

          <h1 style={{ color: '#fff', fontWeight: 900, fontSize: '28px', margin: '16px 0 24px' }}>
            Din bestilling
          </h1>

          {/* Order summary */}
          <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '10px', padding: '20px', marginBottom: '24px' }}>
            {items.map(item => (
              <div key={`${item.menuItemId}-${item.size}`} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '8px 0', borderBottom: '1px solid #2a2a2a',
              }}>
                <div>
                  <p style={{ color: '#fff', fontSize: '14px', margin: 0 }}>{item.name}</p>
                  <p style={{ color: '#666', fontSize: '12px', margin: 0 }}>{item.size} × {item.quantity}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <p style={{ color: '#C8E831', fontWeight: 700, margin: 0 }}>{item.price * item.quantity},–</p>
                  <button onClick={() => removeItem(item.menuItemId, item.size)}
                    style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '16px' }}>
                    ✕
                  </button>
                </div>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px' }}>
              <p style={{ color: '#fff', fontWeight: 900, fontSize: '16px', margin: 0 }}>Totalt</p>
              <p style={{ color: '#C8E831', fontWeight: 900, fontSize: '20px', margin: 0 }}>{total},–</p>
            </div>
          </div>

          {/* Form */}
          <OrderForm />
        </div>
      </main>
    </>
  )
}
