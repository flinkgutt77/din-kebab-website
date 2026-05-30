// components/CartBar.tsx
'use client'

import Link from 'next/link'
import { useCart } from '@/lib/cart'

export default function CartBar() {
  const { count, total } = useCart()

  if (count === 0) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'linear-gradient(135deg, #3d6b00, #7DC61F)',
      padding: '16px 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 100,
      boxShadow: '0 -4px 20px rgba(0,0,0,0.4)',
    }}>
      <div>
        <p style={{ color: '#fff', fontWeight: 700, fontSize: '14px', margin: 0 }}>
          🛒 {count} vare{count > 1 ? 'r' : ''} i handlekurven
        </p>
        <p style={{ color: '#ffff00', fontWeight: 900, fontSize: '18px', margin: 0 }}>
          {total},– NOK
        </p>
      </div>
      <Link href="/bestilling" style={{
        background: '#fff',
        color: '#3d6b00',
        padding: '12px 24px',
        borderRadius: '8px',
        fontWeight: 900,
        fontSize: '15px',
        textDecoration: 'none',
      }}>
        Gå til bestilling →
      </Link>
    </div>
  )
}
