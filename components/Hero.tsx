// components/Hero.tsx
import Link from 'next/link'

export default function Hero() {
  return (
    <section style={{
      background: 'linear-gradient(135deg, #3d6b00 0%, #7DC61F 50%, #C8E831 100%)',
      padding: '60px 24px',
      textAlign: 'center',
    }}>
      <h1 style={{
        color: '#fff',
        fontSize: 'clamp(32px, 6vw, 64px)',
        fontWeight: 900,
        lineHeight: 1.1,
        textShadow: '0 4px 20px rgba(0,0,0,0.4)',
        marginBottom: '12px',
      }}>
        Din Kebab<br />Pizza &amp; Grill
      </h1>
      <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '16px', marginBottom: '32px' }}>
        Pizza · Kebab · Hamburger
      </p>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '40px' }}>
        <Link href="/#meny" style={{
          background: '#fff',
          color: '#3d6b00',
          padding: '14px 32px',
          borderRadius: '6px',
          fontWeight: 900,
          fontSize: '16px',
          textDecoration: 'none',
        }}>
          🛒 Bestill nå
        </Link>
        <a href="tel:+4798075638" style={{
          background: 'rgba(0,0,0,0.2)',
          color: '#fff',
          padding: '14px 32px',
          borderRadius: '6px',
          fontWeight: 700,
          fontSize: '16px',
          textDecoration: 'none',
          border: '2px solid rgba(255,255,255,0.4)',
        }}>
          📞 Ring oss
        </a>
      </div>

      <div style={{ display: 'flex', gap: '32px', justifyContent: 'center' }}>
        {[['50+', 'Retter'], ['99,-', 'Fra'], ['⭐ 4.8', 'Vurdering']].map(([val, label]) => (
          <div key={label} style={{ textAlign: 'center' }}>
            <p style={{ color: '#ffff00', fontSize: '24px', fontWeight: 900, margin: 0 }}>{val}</p>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', margin: 0 }}>{label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
