// app/page.tsx
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import MenuSection from '@/components/MenuSection'
import CartBar from '@/components/CartBar'

export default function Home() {
  return (
    <>
      <Navbar />
      <main style={{ background: '#111', minHeight: '100vh' }}>
        <Hero />
        <MenuSection />
        {/* Info section */}
        <section id="om-oss" style={{ background: '#0a0a0a', padding: '40px 24px', textAlign: 'center' }}>
          <h2 style={{ color: '#7DC61F', fontWeight: 900, fontSize: '24px', marginBottom: '16px' }}>
            📍 Finn oss
          </h2>
          <p style={{ color: '#ccc', fontSize: '16px', marginBottom: '8px' }}>📍 Feltspatveien 25, 1155 Oslo</p>
          <p style={{ color: '#ccc', fontSize: '16px', marginBottom: '8px' }}>📞 <a href="tel:+4798075638" style={{ color: '#7DC61F' }}>+47 980 75 638</a></p>
          <p style={{ color: '#ccc', fontSize: '16px', marginBottom: '8px' }}>🕐 Man–Søn: 12:00–22:00</p>
          <p style={{ color: '#666', fontSize: '13px', marginTop: '16px' }}>
            Bestill online og hent i restauranten. Betaling ved henting.
          </p>
        </section>
      </main>
      <CartBar />
    </>
  )
}
