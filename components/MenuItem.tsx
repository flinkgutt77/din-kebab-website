// components/MenuItem.tsx
'use client'

import { useState } from 'react'
import { MenuItemData } from '@/lib/types'
import { useCart } from '@/lib/cart'

export default function MenuItemCard({ item }: { item: MenuItemData }) {
  const { addItem } = useCart()
  const [selectedSize, setSelectedSize] = useState(item.sizes[0])
  const [added, setAdded] = useState(false)

  function handleAdd() {
    addItem({
      menuItemId: item.id,
      name: item.name,
      size: selectedSize.label,
      price: selectedSize.price,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div style={{
      background: '#1a1a1a',
      border: '1px solid #2a2a2a',
      borderRadius: '10px',
      padding: '14px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: '12px',
    }}>
      <div style={{ flex: 1 }}>
        <p style={{ color: '#fff', fontWeight: 700, fontSize: '14px', margin: '0 0 4px' }}>{item.name}</p>
        {item.description && (
          <p style={{ color: '#666', fontSize: '12px', margin: '0 0 8px' }}>{item.description}</p>
        )}
        {item.sizes.length > 1 && (
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {item.sizes.map(size => (
              <button
                key={size.label}
                onClick={() => setSelectedSize(size)}
                style={{
                  background: selectedSize.label === size.label ? '#7DC61F' : '#222',
                  border: `1px solid ${selectedSize.label === size.label ? '#7DC61F' : '#444'}`,
                  color: selectedSize.label === size.label ? '#000' : '#ccc',
                  padding: '3px 10px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: selectedSize.label === size.label ? 700 : 400,
                  cursor: 'pointer',
                }}
              >
                {size.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <p style={{ color: '#C8E831', fontWeight: 900, fontSize: '15px', margin: '0 0 8px' }}>
          {selectedSize.price},–
        </p>
        <button
          onClick={handleAdd}
          style={{
            background: added ? '#3d6b00' : '#7DC61F',
            color: '#000',
            border: 'none',
            padding: '8px 14px',
            borderRadius: '6px',
            fontWeight: 900,
            fontSize: '13px',
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
        >
          {added ? '✓ Lagt til' : '+ Legg til'}
        </button>
      </div>
    </div>
  )
}
