'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav style={{
      background: 'white',
      borderBottom: '1px solid #E2E8F0',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 1px 8px rgba(0,0,0,0.06)'
    }}>
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '60px'
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: '#C8102E', fontWeight: 900, fontSize: '18px', letterSpacing: '-0.5px' }}>AIR INDIA</span>
            <span style={{ fontSize: '11px', color: '#C8102E', fontWeight: 700 }}>/</span>
            <span style={{ color: '#1A2B6D', fontWeight: 700, fontSize: '14px' }}>Academy</span>
          </div>
        </Link>

        {/* Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          <Link href="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`}>Flight Training</Link>
          <Link href="/apply" className={`nav-link ${pathname?.startsWith('/apply') ? 'active' : ''}`}>Admission</Link>
          <Link href="/safety-standards" className={`nav-link ${pathname === '/safety-standards' ? 'active' : ''}`}>Safety Standards</Link>
          <Link href="/global-network" className={`nav-link ${pathname === '/global-network' ? 'active' : ''}`}>Global Network</Link>
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link
            href="/status"
            className="btn-primary"
            style={{ padding: '8px 20px', fontSize: '13px', background: '#1A2B6D', textDecoration: 'none' }}
          >
            Check Status
          </Link>
        </div>
      </div>
    </nav>
  );
}
