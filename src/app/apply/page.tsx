'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Navbar from '../components/Navbar';

const API_BASE = 'http://localhost:8000/api';

export default function ApplyPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    legal_full_name: '',
    email: '',
    mobile: '',
    date_of_birth: '',
    stream: 'PILOT_CADET',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleStream = (stream: string) => {
    setForm({ ...form, stream });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/student/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || data.message || 'Registration failed');
      const studentId = data.student_id || data.id;
      if (!studentId) throw new Error('No student ID returned');
      localStorage.setItem('student_id', studentId);
      localStorage.setItem('student_name', form.legal_full_name);
      localStorage.setItem('student_stream', form.stream);
      router.push('/apply/education');
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F5F7FA', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main className="rsp-main-form" style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }} className="animate-fadeInUp">
          <span style={{ color: '#C8102E', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Airindia&apos;s Aviation
          </span>
          <h1 style={{ fontSize: '38px', fontWeight: 900, color: '#1A2B6D', margin: '8px 0 10px' }}>
            Cadet Pilot Program Admission
          </h1>
          <p style={{ color: '#64748B', fontSize: '15px', lineHeight: 1.6 }}>
            Join the legacy of India&apos;s premier carrier. Your journey towards the captain&apos;s seat begins with a world-class education.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="rsp-step-indicator" style={{ display: 'flex', alignItems: 'center', marginBottom: '32px', gap: '0' }}>
          {[
            { num: 1, label: 'Personal Identity', sub: 'Current Step' },
            { num: 2, label: 'Education', sub: 'Pending' },
            { num: 3, label: 'Documentation', sub: 'Pending' },
          ].map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < 2 ? 1 : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: i === 0 ? '#C8102E' : 'white',
                  border: `2px solid ${i === 0 ? '#C8102E' : '#E2E8F0'}`,
                  color: i === 0 ? 'white' : '#94A3B8',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '15px', fontWeight: 700, flexShrink: 0
                }}>
                  {s.num}
                </div>
                <div>
                  <div style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: i === 0 ? '#C8102E' : '#94A3B8' }}>
                    {s.sub}
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: i === 0 ? '#1A2B6D' : '#94A3B8' }}>
                    {s.label}
                  </div>
                </div>
              </div>
              {i < 2 && (
                <div style={{ flex: 1, height: '1.5px', background: '#E2E8F0', margin: '0 16px' }} />
              )}
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div className="card animate-fadeInUp" style={{ padding: '40px', animationDelay: '0.1s' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
            <div>
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#1A2B6D', marginBottom: '6px' }}>Personal Identity</h2>
              <p style={{ color: '#64748B', fontSize: '14px' }}>Please provide details exactly as they appear on your passport for aviation security clearance.</p>
            </div>
            <span style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              fontSize: '11px', fontWeight: 700, color: '#B8952A',
              border: '1px solid #B8952A', padding: '5px 12px', borderRadius: '20px'
            }}>
              🔒
            </span>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="rsp-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label className="form-label">Legal Full Name</label>
                <input
                  id="legal_full_name"
                  className="form-input"
                  name="legal_full_name"
                  placeholder="Enter name as per Passport"
                  value={form.legal_full_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="form-label">Corporate Email Address</label>
                <input
                  id="email"
                  className="form-input"
                  name="email"
                  type="email"
                  placeholder="candidate@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="form-label">Mobile Contact (with country code)</label>
                <input
                  id="mobile"
                  className="form-input"
                  name="mobile"
                  placeholder="+91"
                  value={form.mobile}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="form-label">Date of Birth</label>
                <input
                  id="date_of_birth"
                  className="form-input"
                  name="date_of_birth"
                  type="date"
                  placeholder="mm/dd/yyyy"
                  value={form.date_of_birth}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Stream Selection */}
            <div className="rsp-stream-box" style={{
              background: '#1A2B6D',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '24px'
            }}>
              {/* Left — text */}
              <div style={{ flex: 1 }}>
                <h3 style={{ color: 'white', fontWeight: 700, marginBottom: '6px', margin: '0 0 6px' }}>Specialization Stream</h3>
                <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '13px', margin: 0, lineHeight: 1.55 }}>
                  Select your intended aviation career path. Each stream includes proprietary Air India training methodologies.
                </p>
              </div>

              {/* Right — buttons */}
              <div style={{ display: 'flex', gap: '12px', flexShrink: 0 }}>
                <button
                  type="button"
                  id="stream-pilot"
                  onClick={() => handleStream('PILOT_CADET')}
                  style={{
                    padding: '14px 24px',
                    borderRadius: '10px',
                    border: form.stream === 'PILOT_CADET' ? 'none' : '1.5px solid rgba(255,255,255,0.2)',
                    cursor: 'pointer',
                    fontWeight: 800,
                    fontSize: '12px',
                    letterSpacing: '0.05em',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                    background: form.stream === 'PILOT_CADET' ? '#C8102E' : 'rgba(255,255,255,0.08)',
                    color: 'white',
                    transition: 'all 0.2s',
                    minWidth: '90px'
                  }}
                >
                  <span style={{ fontSize: '24px' }}>✈</span>
                  PILOT CADET
                </button>
                <button
                  type="button"
                  id="stream-mro"
                  onClick={() => handleStream('TECH_MRO')}
                  style={{
                    padding: '14px 24px',
                    borderRadius: '10px',
                    border: form.stream === 'TECH_MRO' ? 'none' : '1.5px solid rgba(255,255,255,0.2)',
                    cursor: 'pointer',
                    fontWeight: 800,
                    fontSize: '12px',
                    letterSpacing: '0.05em',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                    background: form.stream === 'TECH_MRO' ? '#C8102E' : 'rgba(255,255,255,0.08)',
                    color: 'white',
                    transition: 'all 0.2s',
                    minWidth: '90px'
                  }}
                >
                  <span style={{ fontSize: '24px' }}>🔧</span>
                  TECH MRO
                </button>
              </div>
            </div>

            {/* Eligibility & Requirements Info */}
            <div style={{ marginBottom: '28px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1A2B6D', marginBottom: '16px', paddingBottom: '10px', borderBottom: '1px solid #E2E8F0' }}>
                Eligibility Criteria
              </h3>
              <div className="rsp-grid-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>

                {/* Academic Requirements */}
                <div style={{
                  background: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)',
                  borderRadius: '14px', padding: '20px',
                  border: '1px solid #C7D2FE'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                    <span style={{ fontSize: '20px' }}>🎓</span>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: '#1A2B6D' }}>Academic Requirements</span>
                  </div>
                  <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {[
                      '10th & 12th passed with PCM',
                      'Minimum 70% in Physics',
                      'Minimum 70% in Mathematics',
                    ].map((item, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12px', color: '#374151', lineHeight: 1.45 }}>
                        <span style={{ marginTop: '1px', flexShrink: 0, width: '16px', height: '16px', borderRadius: '50%', background: '#1A2B6D', color: 'white', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 700 }}>✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Age & Documents */}
                <div style={{
                  background: 'linear-gradient(135deg, #FFF7ED 0%, #FEF3C7 100%)',
                  borderRadius: '14px', padding: '20px',
                  border: '1px solid #FDE68A'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                    <span style={{ fontSize: '20px' }}>📋</span>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: '#1A2B6D' }}>Age & Documents</span>
                  </div>
                  <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {[
                      'Age: 17–28 years',
                      'Valid medical certificate',
                      'All required documents',
                    ].map((item, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12px', color: '#374151', lineHeight: 1.45 }}>
                        <span style={{ marginTop: '1px', flexShrink: 0, width: '16px', height: '16px', borderRadius: '50%', background: '#B8952A', color: 'white', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 700 }}>✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Required Documents */}
                <div style={{
                  background: 'linear-gradient(135deg, #FFF1F2 0%, #FFE4E6 100%)',
                  borderRadius: '14px', padding: '20px',
                  border: '1px solid #FECDD3'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                    <span style={{ fontSize: '20px' }}>📁</span>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: '#1A2B6D' }}>Required Documents</span>
                  </div>
                  <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {[
                      '10th Marksheet',
                      '12th Marksheet',
                      'Government ID Proof',
                    ].map((item, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12px', color: '#374151', lineHeight: 1.45 }}>
                        <span style={{ marginTop: '1px', flexShrink: 0, width: '16px', height: '16px', borderRadius: '50%', background: '#C8102E', color: 'white', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 700 }}>✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div style={{ marginTop: '12px', fontSize: '10px', color: '#9CA3AF', fontStyle: 'italic' }}>
                    Upload in Step 3 — Documentation
                  </div>
                </div>

              </div>
            </div>

            {error && (
              <div style={{
                background: '#FFF1F2', border: '1px solid #FCA5A5', borderRadius: '8px',
                padding: '12px 16px', marginBottom: '20px', color: '#C8102E', fontSize: '14px'
              }}>
                ⚠️ {error}
              </div>
            )}

            {/* Footer */}
            <div className="rsp-form-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px' }}>
                ✦ Application integrity verified by Air India Security.
              </span>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" className="btn-ghost">Save as Draft</button>
                <button id="submit-step1" type="submit" className="btn-red" disabled={loading}>
                  {loading ? 'Submitting...' : 'Continue to Education →'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>

      {/* Premium Cadet Status Section */}
      <section className="rsp-promo-section" style={{ maxWidth: '900px', margin: '0 auto', padding: '20px 24px 60px' }}>
        <div className="rsp-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center' }}>
          {/* Left — Airplane image card */}
          <div style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', aspectRatio: '4/3', boxShadow: '0 12px 40px rgba(0,0,0,0.2)' }}>
            <Image
              src="/hangar.png"
              alt="Air India aircraft in hangar — Wings of Change"
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
            {/* Overlay */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(180deg, transparent 45%, rgba(10,20,60,0.75) 100%)'
            }} />
            <div style={{
              position: 'absolute', bottom: '18px', left: '20px',
              color: 'white', fontSize: '11px', fontWeight: 800,
              letterSpacing: '0.14em', textTransform: 'uppercase'
            }}>
              Wings of Change
            </div>
          </div>

          {/* Right — Text + stats */}
          <div>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em',
              textTransform: 'uppercase', color: '#B8952A',
              border: '1px solid #B8952A', padding: '4px 14px',
              borderRadius: '20px', marginBottom: '20px'
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#B8952A', display: 'inline-block' }} />
              Premium Cadet Status
            </span>

            <h2 style={{
              fontSize: '36px', fontWeight: 900, color: '#1A2B6D',
              lineHeight: 1.15, marginBottom: '16px'
            }}>
              Elevate your ambitions<br />with the Airindia Aviation
            </h2>

            <p style={{ color: '#64748B', fontSize: '15px', lineHeight: 1.7, marginBottom: '28px' }}>
              As part of the Air India global family, you gain access to the most advanced fleet in the subcontinent. We don&apos;t just train pilots; we craft the future of global aviation.
            </p>

            {/* Stats */}
            <div style={{ display: 'flex', gap: '0', alignItems: 'center' }}>
              <div style={{ paddingRight: '28px' }}>
                <div style={{ fontSize: '36px', fontWeight: 900, color: '#C8102E', lineHeight: 1 }}>100%</div>
                <div style={{ fontSize: '10px', fontWeight: 700, color: '#64748B', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '4px' }}>Direct Absorption</div>
              </div>
              <div style={{ width: '1px', height: '48px', background: '#E2E8F0', marginRight: '28px' }} />
              <div>
                <div style={{ fontSize: '36px', fontWeight: 900, color: '#C8102E', lineHeight: 1 }}>470+</div>
                <div style={{ fontSize: '10px', fontWeight: 700, color: '#64748B', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '4px' }}>Aircraft on Order</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dark Footer */}
      <footer style={{
        background: '#1A2B6D',
        marginTop: 'auto'
      }}>
        <div style={{
          maxWidth: '1100px', margin: '0 auto',
          padding: '28px 24px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: '16px'
        }}>
          {/* Logo + copyright */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
              <span style={{ color: 'white', fontWeight: 900, fontSize: '16px', letterSpacing: '-0.3px' }}>AIR INDIA</span>
              <span style={{ color: '#C8102E', fontWeight: 900, fontSize: '18px', lineHeight: 1 }}> /</span>
            </div>
            <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '12px' }}>
              © 2026 Air India Limited. All rights reserved. Member of Star Alliance.
            </div>
          </div>

          {/* Footer links */}
          <div style={{ display: 'flex', gap: '28px', flexWrap: 'wrap' }}>
            {['Privacy Policy', 'Conditions of Carriage', 'Accreditations', 'Contact Hub'].map(link => (
              <a
                key={link}
                href="#"
                style={{
                  color: 'rgba(255,255,255,0.55)',
                  fontSize: '11px', fontWeight: 600,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  textDecoration: 'none',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={e => (e.currentTarget.style.color = 'white')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
