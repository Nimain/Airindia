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

      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }} className="animate-fadeInUp">
          <span style={{ color: '#C8102E', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Maharaja&apos;s Choice
          </span>
          <h1 style={{ fontSize: '38px', fontWeight: 900, color: '#1A2B6D', margin: '8px 0 10px' }}>
            Cadet Pilot Program Admission
          </h1>
          <p style={{ color: '#64748B', fontSize: '15px', lineHeight: 1.6 }}>
            Join the legacy of India&apos;s premier carrier. Your journey towards the captain&apos;s seat begins with a world-class education.
          </p>
        </div>

        {/* Step Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px', gap: '0' }}>
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
              🔒 SECURE FORM
            </span>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
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
            <div style={{
              background: '#1A2B6D',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '28px'
            }}>
              <h3 style={{ color: 'white', fontWeight: 700, marginBottom: '6px' }}>Specialization Stream</h3>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '13px', marginBottom: '20px' }}>
                Select your intended aviation career path. Each stream includes proprietary Air India training methodologies.
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  id="stream-pilot"
                  onClick={() => handleStream('PILOT_CADET')}
                  style={{
                    padding: '14px 28px',
                    borderRadius: '10px',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: '13px',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                    background: form.stream === 'PILOT_CADET' ? '#C8102E' : 'rgba(255,255,255,0.12)',
                    color: 'white',
                    transition: 'all 0.2s'
                  }}
                >
                  <span style={{ fontSize: '22px' }}>✈</span>
                  PILOT<br />CADET
                </button>
                <button
                  type="button"
                  id="stream-mro"
                  onClick={() => handleStream('TECH_MRO')}
                  style={{
                    padding: '14px 28px',
                    borderRadius: '10px',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: '13px',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                    background: form.stream === 'TECH_MRO' ? '#C8102E' : 'rgba(255,255,255,0.12)',
                    color: 'white',
                    transition: 'all 0.2s'
                  }}
                >
                  <span style={{ fontSize: '22px' }}>🔧</span>
                  TECH<br />MRO
                </button>
              </div>
            </div>

            {/* Credential Verification Preview */}
            <div style={{ marginBottom: '28px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1A2B6D', marginBottom: '16px', paddingBottom: '10px', borderBottom: '1px solid #E2E8F0' }}>
                Credential Verification
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                {[
                  { icon: '📱', title: 'National Passport', sub: 'High-Res Scan Only', progress: null },
                  { icon: '🏥', title: 'DGCA Class I Medical', sub: '75% Complete', progress: 75 },
                  { icon: '🎓', title: 'Academic Degrees', sub: '10+2 or Equivalent', progress: null },
                ].map((doc, i) => (
                  <div key={i} className="card" style={{ padding: '16px', textAlign: 'center', borderStyle: 'dashed' }}>
                    {doc.progress !== null && (
                      <div style={{ fontSize: '10px', color: '#B8952A', fontWeight: 700, textAlign: 'right', marginBottom: '4px' }}>
                        {doc.progress}% Complete ↗
                      </div>
                    )}
                    <div style={{ fontSize: '26px', marginBottom: '8px' }}>{doc.icon}</div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#1A2B6D', marginBottom: '4px' }}>{doc.title}</div>
                    <div style={{ fontSize: '11px', color: '#64748B', marginBottom: '10px' }}>{doc.sub}</div>
                    {doc.progress !== null ? (
                      <div style={{ height: '4px', background: '#E2E8F0', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ width: `${doc.progress}%`, height: '100%', background: '#B8952A', borderRadius: '2px' }} />
                      </div>
                    ) : (
                      <button type="button" style={{
                        fontSize: '11px', fontWeight: 700, color: '#1A2B6D',
                        border: '1.5px solid #1A2B6D', borderRadius: '6px',
                        padding: '4px 14px', cursor: 'pointer', background: 'transparent'
                      }}>Upload</button>
                    )}
                  </div>
                ))}
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
      <section style={{ maxWidth: '900px', margin: '0 auto', padding: '20px 24px 60px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center' }}>
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
              Elevate your ambitions<br />with the Maharaja.
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
              © 2024 Air India Limited. All rights reserved. Member of Star Alliance.
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
