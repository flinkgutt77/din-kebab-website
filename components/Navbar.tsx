// components/Navbar.tsx
'use client'

import Link from 'next/link'
import { useCart } from '@/lib/cart'

export default function Navbar() {
  const { count } = useCart()

  return (
    <nav style={{
      background: '#111',
      borderBottom: '2px solid #7DC61F',
      padding: '12px 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      <Link href="/" style={{ color: '#7DC61F', fontWeight: 900, fontSize: '18px', textDecoration: 'none' }}>
        🍕 DIN KEBAB
      </Link>

      <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
        <Link href="/#meny" style={{ color: '#ccc', textDecoration: 'none', fontSize: '14px' }}>Meny</Link>
        <Link href="/#om-oss" style={{ color: '#ccc', textDecoration: 'none', fontSize: '14px' }}>Om oss</Link>
        <Link href="/bestilling" style={{
          background: count > 0 ? '#7DC61F' : '#222',
          color: count > 0 ? '#000' : '#ccc',
          padding: '8px 16px',
          borderRadius: '6px',
          fontWeight: 700,
          fontSize: '14px',
          textDecoration: 'none',
          transition: 'all 0.2s',
        }}>
          🛒 {count > 0 ? `${count} vare${count > 1 ? 'r' : ''}` : 'Handlekurv'}
        </Link>
      </div>
    </nav>
  )
}
