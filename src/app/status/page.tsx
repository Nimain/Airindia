'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '../components/Navbar';

const API_BASE = 'https://airindialms.solutionbriz.com/api';

interface Document {
  doc_type: string;
  file_name: string;
  status: string;
  confidence: number;
  message: string;
  verified_at: string;
}

interface StudentStatus {
  student_id: string;
  name: string;
  email: string;
  stream: string;
  step_completed: number;
  overall_status: string;
  documents: {
    total: number;
    approved: number;
    rejected: number;
    list: Document[];
  };
}

function StatusContent() {
  const searchParams = useSearchParams();
  const [idInput, setIdInput] = useState('');
  const [status, setStatus] = useState<StudentStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const idFromQuery = searchParams.get('id') || localStorage.getItem('student_id') || '';
    if (idFromQuery) {
      setIdInput(idFromQuery);
      fetchStatus(idFromQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchStatus = async (id: string) => {
    if (!id.trim()) { setError('Please enter a Student ID'); return; }
    setLoading(true);
    setError('');
    setStatus(null);
    try {
      const res = await fetch(`${API_BASE}/student/status/${id.trim()}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || data.message || 'Student not found');
      setStatus(data);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const overallStatusConfig: Record<string, { label: string; color: string; bg: string; icon: string }> = {
    approved: { label: 'Approved ✓', color: '#16A34A', bg: '#DCFCE7', icon: '🎉' },
    rejected: { label: 'Rejected', color: '#C8102E', bg: '#FFF1F2', icon: '❌' },
    pending: { label: 'Under Review', color: '#B8952A', bg: '#FEF3C7', icon: '⏳' },
    completed: { label: 'Completed', color: '#1A2B6D', bg: '#EEF2FF', icon: '📋' },
  };

  const cfg = status ? (overallStatusConfig[status.overall_status] || overallStatusConfig.pending) : null;

  return (
    <div style={{ minHeight: '100vh', background: '#F5F7FA' }}>
      <Navbar />
      <main style={{ maxWidth: '760px', margin: '0 auto', padding: '60px 24px' }}>
        <div className="animate-fadeInUp" style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '38px', fontWeight: 900, color: '#1A2B6D', marginBottom: '10px' }}>
            Check Application Status
          </h1>
          <p style={{ color: '#64748B', fontSize: '15px' }}>
            Enter your Student ID to see where your application stands.
          </p>
        </div>

        {/* Search */}
        <div className="card animate-fadeInUp" style={{ padding: '32px', marginBottom: '28px', animationDelay: '0.1s' }}>
          <label className="form-label">Student ID</label>
          <div style={{ display: 'flex', gap: '12px' }}>
            <input
              id="status-search-input"
              className="form-input"
              placeholder="e.g. 69f30e4d15295513410b2165"
              value={idInput}
              onChange={e => setIdInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetchStatus(idInput)}
            />
            <button
              id="check-status-btn"
              className="btn-primary"
              onClick={() => fetchStatus(idInput)}
              disabled={loading}
              style={{ flexShrink: 0, padding: '12px 28px' }}
            >
              {loading ? '...' : 'Check →'}
            </button>
          </div>
          {error && (
            <div style={{ marginTop: '12px', color: '#C8102E', fontSize: '14px' }}>⚠️ {error}</div>
          )}
        </div>

        {status && cfg && (
          <div className="animate-fadeInUp">
            {/* Status Hero Card */}
            <div className="card" style={{ padding: '32px', marginBottom: '20px', borderTop: `4px solid ${cfg.color}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>{cfg.icon}</div>
                  <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#1A2B6D', marginBottom: '4px' }}>
                    {status.name}
                  </h2>
                  <div style={{ color: '#64748B', fontSize: '14px' }}>{status.email}</div>
                </div>
                <div style={{
                  background: cfg.bg, color: cfg.color,
                  padding: '10px 20px', borderRadius: '24px', fontWeight: 700, fontSize: '15px'
                }}>
                  {cfg.label}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px' }}>
                {[
                  { label: 'Stream', value: status.stream === 'PILOT_CADET' ? '✈ Pilot Cadet' : '🔧 Tech MRO' },
                  { label: 'Step Completed', value: `${status.step_completed} / 3` },
                  { label: 'Documents', value: `${status.documents.total} uploaded` },
                  { label: 'Approved Docs', value: `${status.documents.approved} / ${status.documents.total}` },
                ].map((item, i) => (
                  <div key={i} style={{ background: '#F8FAFC', borderRadius: '10px', padding: '14px 16px' }}>
                    <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#1A2B6D' }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Documents List */}
            {status.documents.list.length > 0 && (
              <div className="card" style={{ padding: '28px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#1A2B6D', marginBottom: '20px' }}>
                  Document Verification Results
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {status.documents.list.map((doc, i) => {
                    const isApproved = doc.status === 'approved';
                    const isRejected = doc.status === 'rejected';
                    return (
                      <div key={i} style={{
                        display: 'flex', gap: '14px', alignItems: 'flex-start',
                        padding: '16px', borderRadius: '10px',
                        background: isApproved ? '#F0FDF4' : isRejected ? '#FFF1F2' : '#F8FAFC',
                        border: `1px solid ${isApproved ? '#BBF7D0' : isRejected ? '#FECDD3' : '#E2E8F0'}`
                      }}>
                        <span style={{ fontSize: '22px', flexShrink: 0 }}>
                          {isApproved ? '✅' : isRejected ? '❌' : '⏳'}
                        </span>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                            <div style={{ fontWeight: 700, color: '#1A2B6D', fontSize: '14px', textTransform: 'capitalize' }}>
                              {doc.doc_type} — {doc.file_name}
                            </div>
                            <span style={{
                              fontSize: '11px', fontWeight: 700, padding: '2px 10px', borderRadius: '12px',
                              background: isApproved ? '#DCFCE7' : isRejected ? '#FFF1F2' : '#F1F5F9',
                              color: isApproved ? '#16A34A' : isRejected ? '#C8102E' : '#64748B',
                              textTransform: 'capitalize'
                            }}>
                              {doc.status}
                            </span>
                          </div>
                          {doc.message && (
                            <div style={{ fontSize: '13px', color: '#64748B', marginBottom: '6px' }}>{doc.message}</div>
                          )}
                          <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#94A3B8' }}>
                            {/* <span>AI Confidence: <strong style={{ color: '#1A2B6D' }}>{doc.confidence?.toFixed(1)}%</strong></span> */}
                            <span>Verified: {new Date(doc.verified_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* CTA */}
            {status.step_completed < 3 && (
              <div className="card" style={{ padding: '24px', marginTop: '20px', textAlign: 'center', background: '#EEF2FF' }}>
                <p style={{ color: '#1A2B6D', fontWeight: 600, marginBottom: '12px' }}>
                  Your application is not complete yet. Continue from where you left off.
                </p>
                <a href={status.step_completed === 1 ? '/apply/education' : status.step_completed === 2 ? '/apply/documents' : '/apply'}>
                  <button className="btn-primary">Continue Application →</button>
                </a>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default function StatusPage() {
  return (
    <Suspense fallback={<div style={{ padding: '60px', textAlign: 'center', color: '#64748B' }}>Loading...</div>}>
      <StatusContent />
    </Suspense>
  );
}
