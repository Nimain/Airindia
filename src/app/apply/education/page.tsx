'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';

const API_BASE = 'http://localhost:8000/api';

const MRO_CERTS = [
  'AME Part 66',
  'DGCA Cat A',
  'DGCA Cat B1',
  'DGCA Cat B2',
  'FAA A&P License',
  'EASA Part 147',
  'Other',
];

const QUALIFICATIONS = [
  'B.Sc Physics',
  'B.Sc Mathematics',
  'B.Sc Chemistry',
  'Bachelor of Technology (Aeronautical)',
  'Bachelor of Technology (Mechanical)',
  'Bachelor of Technology (Electronics)',
  'B.E (Aerospace)',
  'M.Sc Physics',
  'M.Tech Aerospace',
  'Diploma in Aviation',
  'Other',
];

export default function EducationPage() {
  const router = useRouter();
  const [studentId, setStudentId] = useState('');
  const [name, setName] = useState('');
  const [form, setForm] = useState({
    highest_qualification: '',
    graduation_year: '',
    institute_name: '',
    flight_hours: '',
    mro_certification: '',
    other_experience: '',
  });
  const [hasFlightHours, setHasFlightHours] = useState(false);
  const [hasMRO, setHasMRO] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showTip, setShowTip] = useState(true);

  useEffect(() => {
    const id = localStorage.getItem('student_id') || '';
    const n = localStorage.getItem('student_name') || '';
    if (!id) { router.push('/apply'); return; }
    setStudentId(id);
    setName(n);
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = {
        student_id: studentId,
        highest_qualification: form.highest_qualification,
        graduation_year: form.graduation_year,
        institute_name: form.institute_name,
        flight_hours: hasFlightHours && form.flight_hours ? form.flight_hours : null,
        mro_certification: hasMRO && form.mro_certification ? form.mro_certification : null,
        other_experience: form.other_experience || null,
      };
      const res = await fetch(`${API_BASE}/student/education`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || data.message || 'Education submission failed');
      router.push('/apply/documents');
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F5F7FA' }}>
      <Navbar />

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px', display: 'grid', gridTemplateColumns: '280px 1fr', gap: '32px' }}>
        {/* Left Sidebar */}
        <div className="animate-slideIn">
          <div style={{ marginBottom: '24px' }}>
            <span style={{ color: '#C8102E', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Application Journey
            </span>
            <h1 style={{ fontSize: '36px', fontWeight: 900, color: '#1A2B6D', lineHeight: 1.15, marginTop: '8px', marginBottom: '12px' }}>
              Education &<br />Experience
            </h1>
            <p style={{ color: '#64748B', fontSize: '14px', lineHeight: 1.7 }}>
              Your professional foundation is the flight path to your future in the skies.
            </p>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <div style={{ fontSize: '52px', fontWeight: 900, color: '#1A2B6D', lineHeight: 1 }}>02</div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Step of 03</div>
          </div>

          {/* Steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {[
              { num: 1, label: 'Personal Information', done: true },
              { num: 2, label: 'Education & Experience', active: true },
              { num: 3, label: 'Documents & Review', done: false },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: i < 2 ? '0' : '0', paddingBottom: '16px', borderLeft: i < 2 ? '2px solid #E2E8F0' : 'none', marginLeft: '17px', paddingLeft: '20px', marginTop: i === 0 ? '0' : '-8px' }}>
                <div style={{
                  width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0,
                  background: s.done ? '#22C55E' : s.active ? 'white' : 'white',
                  border: s.done ? 'none' : s.active ? '2px solid #1A2B6D' : '2px solid #E2E8F0',
                  color: s.done ? 'white' : s.active ? '#1A2B6D' : '#94A3B8',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '14px', fontWeight: 800, marginLeft: '-31px'
                }}>
                  {s.done ? '✓' : s.num}
                </div>
                <div style={{ paddingTop: '6px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: s.done ? '#22C55E' : s.active ? '#1A2B6D' : '#94A3B8' }}>
                    {s.label}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Plane card */}
          <div style={{
            background: 'linear-gradient(135deg, #1A2B6D 0%, #0d1a4a 100%)',
            borderRadius: '16px', padding: '24px', marginTop: '24px',
            position: 'relative', overflow: 'hidden'
          }}>
            <div style={{ fontSize: '60px', opacity: 0.15, position: 'absolute', bottom: '-10px', right: '-10px' }}>✈</div>
            <div style={{ fontSize: '44px', marginBottom: '12px' }}>✈️</div>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px', fontStyle: 'italic', lineHeight: 1.5 }}>
              &ldquo;Precision is the hallmark of a great aviator.&rdquo;
            </p>
            {name && (
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginTop: '10px' }}>
                — {name}
              </p>
            )}
          </div>
        </div>

        {/* Right Form */}
        <div className="animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
          <form onSubmit={handleSubmit}>
            {/* Academic Background */}
            <div className="card" style={{ padding: '32px', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#1A2B6D', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span>🎓</span> Academic Background
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label className="form-label">Highest Qualification</label>
                  <select
                    id="highest_qualification"
                    name="highest_qualification"
                    className="form-input"
                    value={form.highest_qualification}
                    onChange={handleChange}
                    required
                    style={{ appearance: 'none', background: `white url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2364748B' d='M6 8L1 3h10z'/%3E%3C/svg%3E") no-repeat right 12px center` }}
                  >
                    <option value="">Select qualification</option>
                    {QUALIFICATIONS.map(q => <option key={q} value={q}>{q}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Graduation Year</label>
                  <input
                    id="graduation_year"
                    className="form-input"
                    name="graduation_year"
                    placeholder="e.g. 2022"
                    value={form.graduation_year}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="form-label">Institute Name</label>
                <input
                  id="institute_name"
                  className="form-input"
                  name="institute_name"
                  placeholder="Full name of your university or college"
                  value={form.institute_name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Aviation Experience */}
            <div className="card" style={{ padding: '32px', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#1A2B6D', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span>✈️</span> Aviation Experience
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                {/* Flight Hours Card */}
                <div className="card" style={{ padding: '20px', cursor: 'pointer', border: hasFlightHours ? '2px solid #1A2B6D' : '1px solid #E2E8F0' }}
                  onClick={() => setHasFlightHours(!hasFlightHours)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>⏱️</div>
                    <input type="checkbox" checked={hasFlightHours} onChange={() => setHasFlightHours(!hasFlightHours)} style={{ width: '18px', height: '18px' }} />
                  </div>
                  <div style={{ fontWeight: 700, color: '#1A2B6D', marginBottom: '4px' }}>Flight Hours</div>
                  <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '12px' }}>For Pilot Program Applicants</div>
                  {hasFlightHours && (
                    <input
                      id="flight_hours"
                      className="form-input"
                      name="flight_hours"
                      placeholder="Total Flying Hours"
                      value={form.flight_hours}
                      onChange={handleChange}
                      onClick={e => e.stopPropagation()}
                    />
                  )}
                </div>

                {/* MRO Certifications Card */}
                <div className="card" style={{ padding: '20px', cursor: 'pointer', border: hasMRO ? '2px solid #1A2B6D' : '1px solid #E2E8F0' }}
                  onClick={() => setHasMRO(!hasMRO)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🔧</div>
                    <input type="checkbox" checked={hasMRO} onChange={() => setHasMRO(!hasMRO)} style={{ width: '18px', height: '18px' }} />
                  </div>
                  <div style={{ fontWeight: 700, color: '#1A2B6D', marginBottom: '4px' }}>MRO Certifications</div>
                  <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '12px' }}>For Engineering Applicants</div>
                  {hasMRO && (
                    <select
                      id="mro_certification"
                      name="mro_certification"
                      className="form-input"
                      value={form.mro_certification}
                      onChange={handleChange}
                      onClick={e => e.stopPropagation()}
                    >
                      <option value="">Select Certification</option>
                      {MRO_CERTS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  )}
                </div>
              </div>

              {/* Other Experience */}
              <div>
                <label className="form-label">Other Aviation Experience / Notes</label>
                <textarea
                  id="other_experience"
                  name="other_experience"
                  className="form-input"
                  style={{ minHeight: '110px', resize: 'vertical' }}
                  placeholder="Briefly describe any other relevant aviation experience, internships, or simulator sessions."
                  value={form.other_experience}
                  onChange={handleChange}
                />
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

            {/* Footer Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px' }}>
              <button type="button" className="btn-ghost" onClick={() => router.push('/apply')}>
                ← Back to Step 1
              </button>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" className="btn-ghost">Save Progress</button>
                <button id="submit-step2" type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : 'Next Phase →'}
                </button>
              </div>
            </div>
          </form>

          {/* Footer text */}
          <div style={{ textAlign: 'center', marginTop: '32px', color: '#94A3B8', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Certified by Air India Flying School ——
          </div>
        </div>
      </main>

      {/* Tip Toast */}
      {showTip && (
        <div style={{
          position: 'fixed', bottom: '24px', right: '24px',
          background: 'white', border: '1px solid #E2E8F0',
          borderRadius: '12px', padding: '16px 20px', maxWidth: '280px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
          animation: 'fadeInUp 0.4s ease'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <span style={{ fontSize: '18px' }}>💡</span>
            <button onClick={() => setShowTip(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', fontSize: '18px', lineHeight: 1 }}>×</button>
          </div>
          <div style={{ fontWeight: 700, color: '#1A2B6D', marginBottom: '6px', fontSize: '14px' }}>Admission Tip</div>
          <div style={{ color: '#64748B', fontSize: '13px', lineHeight: 1.5 }}>
            Include any MRO certificates even if they are in progress. This boosts your candidate score!
          </div>
        </div>
      )}
    </div>
  );
}
