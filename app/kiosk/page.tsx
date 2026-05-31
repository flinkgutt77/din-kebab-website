// app/kiosk/page.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'

const GET_ORDERS_URL = 'https://n8n.ujstudionorge.com/webhook/kebab-get-orders'
const MARK_DONE_URL = 'https://n8n.ujstudionorge.com/webhook/kebab-mark-done'

type OrderItem = {
  name: string
  size: string
  price: number
  quantity: number
}

type Order = {
  orderNumber: string
  customerName: string
  customerPhone: string
  pickupTime: string
  notat?: string
  items: OrderItem[]
  total: number
  time: string
  done: boolean
}

export default function KioskPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [lastUpdated, setLastUpdated] = useState<string>('')
  const [markingDone, setMarkingDone] = useState<string | null>(null)
  const [showDone, setShowDone] = useState(false)

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch(GET_ORDERS_URL, { cache: 'no-store' })
      if (!res.ok) return
      const data = await res.json()
      setOrders(data.orders || [])
      setLastUpdated(new Date().toLocaleTimeString('no-NO', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    } catch {
      // silent fail, will retry
    }
  }, [])

  useEffect(() => {
    fetchOrders()
    const interval = setInterval(fetchOrders, 5000)
    return () => clearInterval(interval)
  }, [fetchOrders])

  async function markDone(orderNumber: string) {
    setMarkingDone(orderNumber)
    try {
      await fetch(MARK_DONE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderNumber }),
      })
      await fetchOrders()
    } finally {
      setMarkingDone(null)
    }
  }

  const activeOrders = orders.filter(o => !o.done)
  const doneOrders = orders.filter(o => o.done)
  const visibleOrders = showDone ? orders : activeOrders

  return (
    <div style={{
      background: '#0a0a0a',
      minHeight: '100vh',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: '#fff',
      padding: '0',
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a1a, #222)',
        borderBottom: '3px solid #7DC61F',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '28px' }}>🍕</span>
          <div>
            <div style={{ fontWeight: 900, fontSize: '20px', color: '#7DC61F' }}>Din Kebab — Ordrer</div>
            <div style={{ fontSize: '12px', color: '#666' }}>Oppdateres hvert 5. sekund · {lastUpdated}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            background: activeOrders.length > 0 ? '#3d6b00' : '#1a1a1a',
            border: `2px solid ${activeOrders.length > 0 ? '#7DC61F' : '#333'}`,
            borderRadius: '20px',
            padding: '6px 16px',
            fontSize: '14px',
            fontWeight: 700,
            color: activeOrders.length > 0 ? '#C8E831' : '#555',
          }}>
            {activeOrders.length} aktive
          </div>
          <button
            onClick={() => setShowDone(s => !s)}
            style={{
              background: showDone ? '#333' : 'transparent',
              border: '1px solid #444',
              borderRadius: '8px',
              padding: '6px 14px',
              color: '#888',
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            {showDone ? 'Skjul ferdige' : `Vis ferdige (${doneOrders.length})`}
          </button>
        </div>
      </div>

      {/* Order Grid */}
      <div style={{ padding: '20px' }}>
        {visibleOrders.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '80px 24px',
            color: '#444',
          }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🛒</div>
            <div style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>
              {showDone ? 'Ingen ordrer i dag' : 'Ingen aktive ordrer'}
            </div>
            <div style={{ fontSize: '14px' }}>Venter på nye bestillinger...</div>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '16px',
          }}>
            {visibleOrders.map(order => (
              <OrderCard
                key={order.orderNumber}
                order={order}
                onMarkDone={markDone}
                isMarking={markingDone === order.orderNumber}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function OrderCard({
  order,
  onMarkDone,
  isMarking,
}: {
  order: Order
  onMarkDone: (num: string) => void
  isMarking: boolean
}) {
  return (
    <div style={{
      background: order.done ? '#111' : '#1a2a0a',
      border: `2px solid ${order.done ? '#2a2a2a' : '#7DC61F'}`,
      borderRadius: '12px',
      overflow: 'hidden',
      opacity: order.done ? 0.55 : 1,
      transition: 'opacity 0.3s',
    }}>
      {/* Card header */}
      <div style={{
        background: order.done ? '#1a1a1a' : 'linear-gradient(135deg, #2d5200, #3d6b00)',
        padding: '12px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div>
          <div style={{ fontWeight: 900, fontSize: '18px', color: order.done ? '#555' : '#C8E831' }}>
            #{order.orderNumber}
          </div>
          <div style={{ fontSize: '12px', color: '#888' }}>{order.time}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontWeight: 700, fontSize: '16px', color: order.done ? '#555' : '#fff' }}>
            {order.total},–
          </div>
          {order.done && (
            <div style={{ fontSize: '11px', color: '#3d6b00', fontWeight: 700 }}>✓ FERDIG</div>
          )}
        </div>
      </div>

      {/* Customer info */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #222' }}>
        <div style={{ fontWeight: 700, fontSize: '15px', color: order.done ? '#555' : '#fff', marginBottom: '2px' }}>
          {order.customerName}
        </div>
        <div style={{ fontSize: '13px', color: '#666' }}>📞 {order.customerPhone}</div>
        <div style={{
          marginTop: '6px',
          display: 'inline-block',
          background: order.done ? '#1a1a1a' : '#0d1f00',
          border: `1px solid ${order.done ? '#2a2a2a' : '#3d6b00'}`,
          borderRadius: '6px',
          padding: '3px 10px',
          fontSize: '12px',
          color: order.done ? '#444' : '#7DC61F',
          fontWeight: 700,
        }}>
          ⏰ {order.pickupTime}
        </div>
      </div>

      {/* Notat */}
      {order.notat && (
        <div style={{
          padding: '8px 16px',
          borderBottom: '1px solid #222',
          background: order.done ? 'transparent' : '#0d1a00',
        }}>
          <span style={{ fontSize: '11px', color: '#7DC61F', fontWeight: 700, letterSpacing: '1px' }}>📝 NOTAT: </span>
          <span style={{ fontSize: '13px', color: order.done ? '#444' : '#e0e0e0' }}>{order.notat}</span>
        </div>
      )}

      {/* Items */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #222' }}>
        {(order.items || []).map((item, i) => (
          <div key={i} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '4px 0',
            fontSize: '13px',
            color: order.done ? '#444' : '#ccc',
            borderBottom: i < order.items.length - 1 ? '1px solid #1a1a1a' : 'none',
          }}>
            <span>
              <span style={{ fontWeight: 700, color: order.done ? '#444' : '#7DC61F' }}>×{item.quantity}</span>
              {' '}{item.name}
              {item.size && item.size !== 'Standard' && (
                <span style={{ color: '#555' }}> ({item.size})</span>
              )}
            </span>
            <span style={{ fontWeight: 700 }}>{(item.price * item.quantity)},–</span>
          </div>
        ))}
      </div>

      {/* Footer / action */}
      {!order.done && (
        <div style={{ padding: '12px 16px' }}>
          <button
            onClick={() => onMarkDone(order.orderNumber)}
            disabled={isMarking}
            style={{
              width: '100%',
              background: isMarking ? '#1a2a0a' : 'linear-gradient(135deg, #3d6b00, #7DC61F)',
              color: isMarking ? '#444' : '#000',
              border: 'none',
              borderRadius: '8px',
              padding: '12px',
              fontWeight: 900,
              fontSize: '15px',
              cursor: isMarking ? 'not-allowed' : 'pointer',
              letterSpacing: '1px',
            }}
          >
            {isMarking ? 'Markerer...' : '✓ FERDIG'}
          </button>
        </div>
      )}
    </div>
  )
}
