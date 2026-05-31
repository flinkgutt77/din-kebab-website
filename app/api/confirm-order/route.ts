// app/api/confirm-order/route.ts
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { menuItems } from '@/lib/menu'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const N8N_WEBHOOK = 'https://n8n.ujstudionorge.com/webhook/kebab-orders'
const N8N_SAVE_ORDER = 'https://n8n.ujstudionorge.com/webhook/kebab-save-order'

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json()
    if (!sessionId) return NextResponse.json({ error: 'Mangler sessionId' }, { status: 400 })

    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Betaling ikke fullført' }, { status: 402 })
    }

    const meta = session.metadata!
    const { orderNumber, customerName, customerPhone, pickupTime, notat } = meta

    // Parse items — may be truncated for very large orders, fallback to empty
    let items: { menuItemId: string; name: string; size: string; quantity: number }[] = []
    try { items = JSON.parse(meta.items || '[]') } catch { items = [] }

    // Recompute total server-side
    const verifiedTotal = items.reduce((sum, item) => {
      const menuItem = menuItems.find(m => m.id === item.menuItemId)
      const size = menuItem?.sizes.find(s => s.label === item.size)
      return sum + (size?.price ?? 0) * item.quantity
    }, 0)

    const itemLines = items.map(item => {
      const menuItem = menuItems.find(m => m.id === item.menuItemId)
      const size = menuItem?.sizes.find(s => s.label === item.size)
      const price = size?.price ?? 0
      return `• ${item.name} (${item.size}) × ${item.quantity} — ${price * item.quantity},–`
    }).join('\n')

    const telegramMessage = `✅ Betalt nettbestilling #${orderNumber}!\n\n👤 ${customerName}\n📞 ${customerPhone}\n⏰ Hentes: ${pickupTime}\n\n${itemLines}\n\n💰 Totalt: ${verifiedTotal},– (BETALT online)${notat ? `\n\n📝 Notat: ${notat}` : ''}`

    // Send to Telegram + save to kiosk store in parallel
    await Promise.allSettled([
      fetch(N8N_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_number: orderNumber,
          customer_name: customerName,
          customer_phone: customerPhone,
          pickup_time: pickupTime,
          items,
          total: verifiedTotal,
          message: telegramMessage,
          source: 'website',
        }),
      }),
      fetch(N8N_SAVE_ORDER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderNumber,
          customerName,
          customerPhone,
          pickupTime,
          notat: notat || '',
          items,
          total: verifiedTotal,
        }),
      }),
    ])

    return NextResponse.json({ success: true, orderNumber, customerName, total: verifiedTotal })
  } catch (err) {
    console.error('Confirm order error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
