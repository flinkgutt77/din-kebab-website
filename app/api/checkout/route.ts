// app/api/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { menuItems } from '@/lib/menu'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://din-kebab.vercel.app'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { orderNumber, customerName, customerPhone, pickupTime, notat, items } = body

    if (!customerName || !customerPhone || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Mangler påkrevde felt' }, { status: 400 })
    }

    // Build line items using verified server-side prices
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = []
    for (const item of items as { menuItemId: string; name: string; size: string; quantity: number }[]) {
      const menuItem = menuItems.find(m => m.id === item.menuItemId)
      if (!menuItem) continue
      const size = menuItem.sizes.find(s => s.label === item.size)
      if (!size) continue

      lineItems.push({
        price_data: {
          currency: 'nok',
          product_data: {
            name: item.name,
            ...(size.label !== 'Standard' && { description: size.label }),
          },
          unit_amount: size.price * 100, // øre
        },
        quantity: item.quantity,
      })
    }

    if (lineItems.length === 0) {
      return NextResponse.json({ error: 'Ingen gyldige varer' }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card', 'vipps'] as Stripe.Checkout.SessionCreateParams.PaymentMethodType[],
      locale: 'nb',
      line_items: lineItems,
      success_url: `${SITE_URL}/bekreftelse?session_id={CHECKOUT_SESSION_ID}&nr=${orderNumber}`,
      cancel_url: `${SITE_URL}/bestilling`,
      metadata: {
        orderNumber,
        customerName,
        customerPhone,
        pickupTime: pickupTime || 'Snarest',
        notat: (notat || '').slice(0, 490),
        items: JSON.stringify(items).slice(0, 490),
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Checkout error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
