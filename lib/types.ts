// lib/types.ts

export type MenuSize = {
  label: string      // "H" | "S" | "M" | "Medium" | "Stor" | "100g" etc
  price: number      // NOK
}

export type MenuItem = {
  id: string
  category: 'pizza' | 'kebab' | 'hamburger' | 'sides' | 'salat' | 'drikke'
  name: string
  description: string
  sizes: MenuSize[]  // one entry = no size choice, multiple = customer picks
}

export type CartItem = {
  menuItemId: string
  name: string
  size: string
  price: number
  quantity: number
}

export type Order = {
  orderNumber: string
  customerName: string
  customerPhone: string
  pickupTime: string
  items: CartItem[]
  total: number
}
