import Navbar from '../components/Navbar';
import Link from 'next/link';

export default function GlobalNetworkPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#F5F7FA', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 24px',
        textAlign: 'center',
      }}>
        {/* Icon */}
        <div style={{
          width: '90px', height: '90px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #FFF7ED 0%, #FEF3C7 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '40px', marginBottom: '32px',
          boxShadow: '0 8px 32px rgba(184,149,42,0.15)'
        }}>
          🌐
        </div>

        {/* Badge */}
        <span style={{
          display: 'inline-block',
          fontSize: '10px', fontWeight: 700,
          letterSpacing: '0.14em', textTransform: 'uppercase',
          color: '#B8952A', border: '1px solid #B8952A',
          padding: '4px 16px', borderRadius: '20px',
          marginBottom: '20px'
        }}>
          Coming Soon
        </span>

        <h1 style={{
          fontSize: '46px', fontWeight: 900, color: '#1A2B6D',
          lineHeight: 1.1, marginBottom: '16px'
        }}>
          Global Network
        </h1>

        <p style={{
          color: '#64748B', fontSize: '16px', lineHeight: 1.7,
          maxWidth: '480px', marginBottom: '40px'
        }}>
          Explore Air India&apos;s worldwide training partnerships, international route network, and global campus
          locations. A world-class aviation career starts here — more details launching soon.
        </p>

        {/* Divider */}
        <div style={{ width: '48px', height: '3px', background: '#C8102E', borderRadius: '2px', marginBottom: '40px' }} />

        {/* Stats row */}
        <div style={{ display: 'flex', gap: '48px', marginBottom: '48px' }}>
          {[
            { value: '40+', label: 'Partner Countries' },
            { value: '100+', label: 'Global Routes' },
            { value: '5', label: 'Training Campuses' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 900, color: '#C8102E' }}>{s.value}</div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '4px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        <Link href="/">
          <button style={{
            background: '#1A2B6D', color: 'white',
            padding: '12px 28px', borderRadius: '8px',
            fontWeight: 600, fontSize: '14px',
            border: 'none', cursor: 'pointer',
            transition: 'all 0.2s'
          }}>
            ← Back to Home
          </button>
        </Link>
      </main>

      {/* Footer */}
      <footer style={{ background: '#1A2B6D' }}>
        <div style={{
          maxWidth: '1100px', margin: '0 auto',
          padding: '24px 24px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: '12px'
        }}>
          <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '12px' }}>
            © 2026 Air India Limited. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '24px' }}>
            {['Privacy Policy', 'Conditions of Carriage', 'Contact Hub'].map(link => (
              <a key={link} href="#" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none' }}>
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
