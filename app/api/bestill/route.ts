// app/api/bestill/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { menuItems } from '@/lib/menu'

const N8N_WEBHOOK = 'https://n8n.ujstudionorge.com/webhook/kebab-orders'
const N8N_SAVE_ORDER = 'https://n8n.ujstudionorge.com/webhook/kebab-save-order'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { orderNumber, customerName, customerPhone, pickupTime, items } = body

    if (!customerName || !customerPhone || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Mangler påkrevde felt' }, { status: 400 })
    }

    // Recompute total server-side from authoritative menu prices
    const verifiedTotal = items.reduce((sum: number, item: { menuItemId: string; size: string; quantity: number }) => {
      const menuItem = menuItems.find(m => m.id === item.menuItemId)
      if (!menuItem) return sum
      const size = menuItem.sizes.find(s => s.label === item.size)
      if (!size) return sum
      return sum + size.price * item.quantity
    }, 0)

    // Build Telegram-friendly order text using verified prices
    const itemLines = items.map((item: { menuItemId: string; name: string; size: string; quantity: number }) => {
      const menuItem = menuItems.find(m => m.id === item.menuItemId)
      const size = menuItem?.sizes.find(s => s.label === item.size)
      const price = size?.price ?? 0
      return `• ${item.name} (${item.size}) × ${item.quantity} — ${price * item.quantity},–`
    }).join('\n')

    const payload = {
      order_number: orderNumber,
      customer_name: customerName,
      customer_phone: customerPhone,
      pickup_time: pickupTime || 'Snarest',
      items,
      total: verifiedTotal,
      message: `🆕 Ny nettbestilling #${orderNumber}!\n\n👤 ${customerName}\n📞 ${customerPhone}\n⏰ Hentes: ${pickupTime || 'Snarest'}\n\n${itemLines}\n\n💰 Totalt: ${verifiedTotal},–\n💳 Betales ved henting`,
      source: 'website',
    }

    const res = await fetch(N8N_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      console.error('n8n webhook error:', await res.text())
      return NextResponse.json({ error: 'Webhook failed' }, { status: 502 })
    }

    // Also save to order store for kiosk display (fire-and-forget, don't block on failure)
    fetch(N8N_SAVE_ORDER, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderNumber,
        customerName,
        customerPhone,
        pickupTime: pickupTime || 'Snarest',
        items,
        total: verifiedTotal,
      }),
    }).catch(e => console.error('Order store save failed:', e))

    return NextResponse.json({ success: true, orderNumber, total: verifiedTotal })
  } catch (err) {
    console.error('API route error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
