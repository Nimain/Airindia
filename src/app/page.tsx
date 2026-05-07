'use client';
import Navbar from './components/Navbar';
import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #F5F7FA 0%, #EEF2FF 100%)' }}>
      <Navbar />
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '80px 24px' }}>
        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: '80px' }} className="animate-fadeInUp">
          <span style={{
            display: 'inline-block',
            background: '#FEF3C7',
            color: '#B8952A',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            padding: '6px 16px',
            borderRadius: '20px',
            marginBottom: '20px'
          }}>
            ✦ Airindia&apos; Aviation
          </span>
          <h1 style={{ fontSize: '54px', fontWeight: 900, color: '#1A2B6D', lineHeight: 1.1, marginBottom: '20px' }}>
            Cadet Pilot Program<br />
            <span style={{ color: '#C8102E' }}>Admission Portal</span>
          </h1>
          <p style={{ fontSize: '18px', color: '#64748B', maxWidth: '560px', margin: '0 auto 40px', lineHeight: 1.7 }}>
            Join the legacy of India&apos;s premier carrier. Your journey towards the captain&apos;s seat begins with a world-class education.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/apply">
              <button className="btn-red" style={{ fontSize: '16px', padding: '14px 36px' }}>
                Start Application →
              </button>
            </Link>
            <Link href="/status">
              <button className="btn-ghost" style={{ fontSize: '16px', padding: '14px 36px' }}>
                Check My Status
              </button>
            </Link>
          </div>
        </div>

        {/* Program Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '60px' }}>
          <div className="card" style={{ padding: '36px', borderTop: '4px solid #1A2B6D' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>✈️</div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#1A2B6D', marginBottom: '10px' }}>Pilot Cadet</h2>
            <p style={{ color: '#64748B', fontSize: '15px', lineHeight: 1.6, marginBottom: '20px' }}>
              Comprehensive pilot training from ground school to CPL. Train on state-of-the-art simulators and aircraft.
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['CPL Track', 'ATPL Track', 'Simulator Access'].map(t => (
                <span key={t} className="tag" style={{ background: '#EEF2FF', color: '#1A2B6D' }}>{t}</span>
              ))}
            </div>
          </div>
          <div className="card" style={{ padding: '36px', borderTop: '4px solid #C8102E' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>🔧</div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#C8102E', marginBottom: '10px' }}>Tech MRO</h2>
            <p style={{ color: '#64748B', fontSize: '15px', lineHeight: 1.6, marginBottom: '20px' }}>
              Aviation maintenance, repair & overhaul engineering track. Get DGCA-approved AME licensing.
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['AME License', 'DGCA Approved', 'Hands-on Training'].map(t => (
                <span key={t} className="tag" style={{ background: '#FFF1F2', color: '#C8102E' }}>{t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#1A2B6D', marginBottom: '40px' }}>
            Your 3-Step Journey
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '32px' }}>
            {[
              { step: '01', title: 'Personal Identity', desc: 'Share your basic info, contact details and choose your stream' },
              { step: '02', title: 'Education & Experience', desc: 'Provide academic background and aviation experience' },
              { step: '03', title: 'Documents & Review', desc: 'Upload credentials for AI-powered verification' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{
                  width: '60px', height: '60px', borderRadius: '50%',
                  background: i === 0 ? '#1A2B6D' : '#EEF2FF',
                  color: i === 0 ? 'white' : '#1A2B6D',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '22px', fontWeight: 800, margin: '0 auto 16px'
                }}>
                  {s.step}
                </div>
                <h3 style={{ fontWeight: 700, color: '#1A2B6D', marginBottom: '8px' }}>{s.title}</h3>
                <p style={{ color: '#64748B', fontSize: '14px', lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '40px' }}>
            <Link href="/apply">
              <button className="btn-red" style={{ fontSize: '16px', padding: '14px 44px' }}>
                Begin Application →
              </button>
            </Link>
          </div>
        </div>

        {/* Admin Link */}
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link href="/admin" style={{ color: '#64748B', fontSize: '14px', textDecoration: 'none' }}>
            Admin Panel → View Candidates
          </Link>
        </div>
      </main>
    </div>
  );
}
