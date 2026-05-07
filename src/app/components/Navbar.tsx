'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Flight Training', active: pathname === '/' },
    { href: '/apply', label: 'Admission', active: pathname?.startsWith('/apply') },
    { href: '/safety-standards', label: 'Safety Standards', active: pathname === '/safety-standards' },
    { href: '/global-network', label: 'Global Network', active: pathname === '/global-network' },
  ];

  return (
    <nav style={{
      background: 'white',
      borderBottom: '1px solid #E2E8F0',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 1px 8px rgba(0,0,0,0.06)'
    }}>
      {/* ── Desktop bar (unchanged from original) ── */}
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

        {/* Nav Links — hidden on mobile via CSS */}
        <div className="navbar-links" style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          {navLinks.map(l => (
            <Link key={l.href} href={l.href} className={`nav-link ${l.active ? 'active' : ''}`}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right side — hidden on mobile via CSS */}
        <div className="navbar-cta" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link
            href="/status"
            className="btn-primary"
            style={{ padding: '8px 20px', fontSize: '13px', background: '#1A2B6D', textDecoration: 'none' }}
          >
            Check Status
          </Link>
        </div>

        {/* Hamburger — only visible on mobile via CSS */}
        <button
          className="navbar-hamburger"
          onClick={() => setMenuOpen(prev => !prev)}
          aria-label="Toggle menu"
          style={{
            display: 'none',           /* overridden to flex by CSS on mobile */
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '6px',
            flexDirection: 'column',
            gap: '5px',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Three bars → X when open */}
          <span style={{
            display: 'block', width: '22px', height: '2px',
            background: '#1A2B6D', borderRadius: '2px',
            transition: 'all 0.25s',
            transform: menuOpen ? 'translateY(7px) rotate(45deg)' : 'none',
          }} />
          <span style={{
            display: 'block', width: '22px', height: '2px',
            background: '#1A2B6D', borderRadius: '2px',
            transition: 'all 0.25s',
            opacity: menuOpen ? 0 : 1,
          }} />
          <span style={{
            display: 'block', width: '22px', height: '2px',
            background: '#1A2B6D', borderRadius: '2px',
            transition: 'all 0.25s',
            transform: menuOpen ? 'translateY(-7px) rotate(-45deg)' : 'none',
          }} />
        </button>
      </div>

      {/* ── Mobile slide-down menu ── */}
      <div
        className="navbar-mobile-menu"
        style={{
          display: 'none',            /* overridden to block by CSS on mobile */
          overflow: 'hidden',
          maxHeight: menuOpen ? '400px' : '0',
          transition: 'max-height 0.3s ease',
          background: 'white',
          borderTop: menuOpen ? '1px solid #E2E8F0' : 'none',
        }}
      >
        <div style={{ padding: '12px 24px 20px' }}>
          {navLinks.map(l => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              style={{
                display: 'block',
                padding: '12px 0',
                borderBottom: '1px solid #F1F5F9',
                color: l.active ? '#1A2B6D' : '#374151',
                fontWeight: l.active ? 700 : 500,
                fontSize: '15px',
                textDecoration: 'none',
              }}
            >
              {l.label}
              {l.active && <span style={{ color: '#C8102E', marginLeft: '8px' }}>•</span>}
            </Link>
          ))}
          <Link
            href="/status"
            onClick={() => setMenuOpen(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '16px',
              padding: '12px',
              background: '#1A2B6D',
              color: 'white',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '14px',
              textDecoration: 'none',
            }}
          >
            Check Status →
          </Link>
        </div>
      </div>
    </nav>
  );
}
