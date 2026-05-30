// app/api/bestill/route.ts
import { NextRequest, NextResponse } from 'next/server'

const N8N_WEBHOOK = 'https://n8n.ujstudionorge.com/webhook/kebab-orders'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { orderNumber, customerName, customerPhone, pickupTime, items, total } = body

  // Build Telegram-friendly order text
  const itemLines = items.map((item: { name: string; size: string; quantity: number; price: number }) =>
    `• ${item.name} (${item.size}) × ${item.quantity} — ${item.price * item.quantity},–`
  ).join('\n')

  const payload = {
    order_number: orderNumber,
    customer_name: customerName,
    customer_phone: customerPhone,
    pickup_time: pickupTime,
    items,
    total,
    message: `🆕 Ny nettbestilling #${orderNumber}!\n\n👤 ${customerName}\n📞 ${customerPhone}\n⏰ Hentes: ${pickupTime}\n\n${itemLines}\n\n💰 Totalt: ${total},–\n💳 Betales ved henting`,
    source: 'website',
  }

  try {
    const res = await fetch(N8N_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      console.error('n8n webhook error:', await res.text())
      return NextResponse.json({ error: 'Webhook failed' }, { status: 502 })
    }

    return NextResponse.json({ success: true, orderNumber })
  } catch (err) {
    console.error('Failed to reach n8n:', err)
    return NextResponse.json({ error: 'Network error' }, { status: 500 })
  }
}
