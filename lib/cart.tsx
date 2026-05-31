// lib/cart.tsx
'use client'

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react'
import { CartItem } from './types'

type CartContextType = {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (menuItemId: string, size: string) => void
  clearCart: () => void
  total: number
  count: number
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const hydrated = useRef(false)

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('din-kebab-cart')
    if (saved) {
      try {
        setItems(JSON.parse(saved))
      } catch {
        localStorage.removeItem('din-kebab-cart')
      }
    }
    hydrated.current = true
  }, [])

  // Save to localStorage on change
  useEffect(() => {
    if (!hydrated.current) return
    localStorage.setItem('din-kebab-cart', JSON.stringify(items))
  }, [items])

  function addItem(newItem: Omit<CartItem, 'quantity'>) {
    setItems(prev => {
      const existing = prev.find(
        i => i.menuItemId === newItem.menuItemId && i.size === newItem.size
      )
      if (existing) {
        return prev.map(i =>
          i.menuItemId === newItem.menuItemId && i.size === newItem.size
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      }
      return [...prev, { ...newItem, quantity: 1 }]
    })
  }

  function removeItem(menuItemId: string, size: string) {
    setItems(prev => prev.filter(
      i => !(i.menuItemId === menuItemId && i.size === size)
    ))
  }

  function clearCart() {
    setItems([])
  }

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const count = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
