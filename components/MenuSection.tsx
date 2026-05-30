// components/MenuSection.tsx
'use client'

import { useState } from 'react'
import { menuItems, categories } from '@/lib/menu'
import MenuItemCard from './MenuItem'

export default function MenuSection() {
  const [activeCategory, setActiveCategory] = useState('alle')

  const filtered = activeCategory === 'alle'
    ? menuItems
    : menuItems.filter(i => i.category === activeCategory)

  return (
    <section id="meny" style={{ background: '#111', padding: '40px 24px' }}>
      <p style={{ color: '#7DC61F', fontSize: '12px', letterSpacing: '3px', textTransform: 'uppercase', textAlign: 'center', marginBottom: '8px' }}>
        VÅR MENY
      </p>
      <h2 style={{ color: '#fff', fontWeight: 900, fontSize: '28px', textAlign: 'center', marginBottom: '24px' }}>
        Velg det du har lyst på
      </h2>

      {/* Category tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '24px', justifyContent: 'center', flexWrap: 'wrap' }}>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            style={{
              background: activeCategory === cat.id ? '#7DC61F' : '#222',
              color: activeCategory === cat.id ? '#000' : '#ccc',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: activeCategory === cat.id ? 700 : 400,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Menu grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '12px',
        maxWidth: '900px',
        margin: '0 auto',
      }}>
        {filtered.map(item => (
          <MenuItemCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  )
}
