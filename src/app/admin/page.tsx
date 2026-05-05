'use client';
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

const API_BASE = 'http://localhost:8000/api';

interface Candidate {
  student_id: string;
  name: string;
  email: string;
  stream: string;
  step_completed: number;
  overall_status: string;
  mobile?: string;
  date_of_birth?: string;
  documents?: {
    total: number;
    approved: number;
    rejected: number;
    list: Array<{
      doc_type: string;
      file_name: string;
      status: string;
      confidence: number;
      message: string;
      verified_at: string;
    }>;
  };
}

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  approved: { bg: '#DCFCE7', color: '#16A34A' },
  rejected: { bg: '#FFF1F2', color: '#C8102E' },
  pending: { bg: '#FEF3C7', color: '#B8952A' },
  completed: { bg: '#EEF2FF', color: '#1A2B6D' },
  documents_uploaded:  { bg: '#F0F9FF', color: '#0369A1' },
};

export default function AdminPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState<Candidate | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterStream, setFilterStream] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => { fetchCandidates(); }, []);

  const fetchCandidates = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/admin/candidates`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Failed to fetch candidates');
      setCandidates(Array.isArray(data) ? data : data.candidates || []);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Failed to load candidates');
    } finally {
      setLoading(false);
    }
  };

  const fetchDetail = async (id: string) => {
    setDetailLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/candidate/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Failed to fetch detail');
      setSelected(data);
    } catch (err: unknown) {
      console.error(err);
    } finally {
      setDetailLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: 'approved' | 'rejected') => {
    setActionLoading(`${id}-${newStatus}`);
    try {
      const res = await fetch(`${API_BASE}/admin/candidate/${id}/status?status=${newStatus}`, { method: 'PATCH' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Action failed');
      setCandidates(prev => prev.map(c => c.student_id === id ? { ...c, overall_status: newStatus } : c));
      if (selected?.student_id === id) setSelected({ ...selected, overall_status: newStatus });
    } catch (err: unknown) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = candidates.filter(c => {
    const matchStatus = filterStatus === 'all' || c.overall_status === filterStatus;
    const matchStream = filterStream === 'all' || c.stream === filterStream;
    const matchSearch = !searchQuery || c.name?.toLowerCase().includes(searchQuery.toLowerCase()) || c.email?.toLowerCase().includes(searchQuery.toLowerCase()) || c.student_id?.includes(searchQuery);
    return matchStatus && matchStream && matchSearch;
  });

  const counts = {
      total:    candidates.length,
      approved: candidates.filter(c => c.overall_status === 'approved').length,
      rejected: candidates.filter(c => c.overall_status === 'rejected').length,
      pending:  candidates.filter(c =>
        c.overall_status === 'pending' ||
        c.overall_status === 'completed' ||
        c.overall_status === 'documents_uploaded'
      ).length,
    };

  return (
    <div style={{ minHeight: '100vh', background: '#F5F7FA' }}>
      <Navbar />
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '36px 24px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }} className="animate-fadeInUp">
          <div>
            <span style={{ color: '#C8102E', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Admin Dashboard</span>
            <h1 style={{ fontSize: '34px', fontWeight: 900, color: '#1A2B6D', margin: '8px 0 6px' }}>All Candidates</h1>
            <p style={{ color: '#64748B', fontSize: '14px' }}>Review, approve or reject admission applications.</p>
          </div>
          <button
              className="btn-ghost"
              onClick={fetchCandidates}
              style={{ alignSelf: 'flex-start' }}
              suppressHydrationWarning
            >
              ↻ Refresh
            </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
          {[
            { label: 'Total', value: counts.total, color: '#1A2B6D', bg: '#EEF2FF' },
            { label: 'Approved', value: counts.approved, color: '#16A34A', bg: '#DCFCE7' },
            { label: 'Rejected', value: counts.rejected, color: '#C8102E', bg: '#FFF1F2' },
            { label: 'Pending', value: counts.pending, color: '#B8952A', bg: '#FEF3C7' },
          ].map((s, i) => (
            <div key={i} className="card" style={{ padding: '20px 24px', borderTop: `3px solid ${s.color}` }}>
              <div style={{ fontSize: '32px', fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 600, marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <input
            className="form-input"
            placeholder="Search by name, email, or ID..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ maxWidth: '300px' }}
            suppressHydrationWarning
          />
          <select
            className="form-input"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            style={{ maxWidth: '160px' }}
            suppressHydrationWarning
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="documents_uploaded">Docs Uploaded</option>
            <option value="completed">Completed</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <select
              className="form-input"
              value={filterStream}
              onChange={e => setFilterStream(e.target.value)}
              style={{ maxWidth: '160px' }}
              suppressHydrationWarning
            >
            <option value="all">All Streams</option>
            <option value="PILOT_CADET">Pilot Cadet</option>
            <option value="TECH_MRO">Tech MRO</option>
          </select>
        </div>

        {error && (
          <div style={{ background: '#FFF1F2', border: '1px solid #FCA5A5', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', color: '#C8102E', fontSize: '14px' }}>
            ⚠️ {error}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 400px' : '1fr', gap: '20px' }}>
          {/* Candidates Table */}
          <div className="card" style={{ overflow: 'hidden' }}>
            {loading ? (
              <div style={{ padding: '60px', textAlign: 'center', color: '#64748B' }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>⏳</div>
                Loading candidates...
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: '60px', textAlign: 'center', color: '#64748B' }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔍</div>
                No candidates found.
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                    {['Candidate', 'Stream', 'Step', 'Status', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '13px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c, i) => {
                    const sc = STATUS_COLORS[c.overall_status] || STATUS_COLORS.pending;
                    return (
                      <tr key={`${c.student_id}-${i}`} style={{
                        borderBottom: '1px solid #F1F5F9',
                        background: selected?.student_id === c.student_id ? '#EEF2FF' : i % 2 === 0 ? 'white' : '#FAFAFA',
                        transition: 'background 0.15s'
                      }}>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontWeight: 700, color: '#1A2B6D', fontSize: '14px', marginBottom: '2px' }}>{c.name}</div>
                          <div style={{ fontSize: '12px', color: '#94A3B8' }}>{c.email}</div>
                          <div style={{ fontSize: '11px', color: '#CBD5E1', marginTop: '2px', fontFamily: 'monospace' }}>{c.student_id?.substring(0, 16)}...</div>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span className="tag" style={{ background: c.stream === 'PILOT_CADET' ? '#EEF2FF' : '#FFF1F2', color: c.stream === 'PILOT_CADET' ? '#1A2B6D' : '#C8102E' }}>
                            {c.stream === 'PILOT_CADET' ? '✈ Pilot' : '🔧 MRO'}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            {[1, 2, 3].map(step => (
                              <div key={step} style={{
                                width: '22px', height: '6px', borderRadius: '3px',
                                background: c.step_completed >= step ? '#1A2B6D' : '#E2E8F0'
                              }} />
                            ))}
                          </div>
                          <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px' }}>{c.step_completed}/3</div>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span className="tag" style={{ background: sc.bg, color: sc.color, textTransform: 'capitalize' }}>
                            {c.overall_status}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            <button
                              onClick={() => fetchDetail(c.student_id)}
                              style={{ fontSize: '12px', fontWeight: 600, color: '#1A2B6D', border: '1px solid #E2E8F0', background: 'white', borderRadius: '6px', padding: '5px 10px', cursor: 'pointer' }}
                            >
                              View
                            </button>
                            {c.overall_status !== 'approved' && (
                              <button
                                onClick={() => updateStatus(c.student_id, 'approved')}
                                disabled={actionLoading === `${c.student_id}-approved`}
                                style={{ fontSize: '12px', fontWeight: 600, color: '#16A34A', border: '1px solid #86EFAC', background: '#F0FDF4', borderRadius: '6px', padding: '5px 10px', cursor: 'pointer' }}
                              >
                                ✓ Approve
                              </button>
                            )}
                            {c.overall_status !== 'rejected' && (
                              <button
                                onClick={() => updateStatus(c.student_id, 'rejected')}
                                disabled={actionLoading === `${c.student_id}-rejected`}
                                style={{ fontSize: '12px', fontWeight: 600, color: '#C8102E', border: '1px solid #FECDD3', background: '#FFF1F2', borderRadius: '6px', padding: '5px 10px', cursor: 'pointer' }}
                              >
                                ✕ Reject
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Detail Panel */}
          {selected && (
            <div className="card animate-slideIn" style={{ padding: '28px', alignSelf: 'flex-start', position: 'sticky', top: '80px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '17px', fontWeight: 800, color: '#1A2B6D' }}>Candidate Detail</h2>
                <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', fontSize: '20px' }}>×</button>
              </div>

              {detailLoading ? (
                <div style={{ textAlign: 'center', color: '#64748B', padding: '30px' }}>Loading...</div>
              ) : (
                <>
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ fontSize: '22px', fontWeight: 900, color: '#1A2B6D', marginBottom: '4px' }}>{selected.name}</div>
                    <div style={{ fontSize: '13px', color: '#64748B' }}>{selected.email}</div>
                    {selected.mobile && <div style={{ fontSize: '13px', color: '#64748B' }}>📱 {selected.mobile}</div>}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                    {[
                      { label: 'Stream', value: selected.stream === 'PILOT_CADET' ? '✈ Pilot Cadet' : '🔧 Tech MRO' },
                      { label: 'Status', value: selected.overall_status },
                      { label: 'Step', value: `${selected.step_completed}/3` },
                      { label: 'Docs', value: `${selected.documents?.total ?? 0} uploaded` },
                    ].map((item, i) => (
                      <div key={i} style={{ background: '#F8FAFC', borderRadius: '8px', padding: '10px 14px' }}>
                        <div style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '2px' }}>{item.label}</div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#1A2B6D', textTransform: 'capitalize' }}>{item.value}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ fontFamily: 'monospace', fontSize: '10px', color: '#94A3B8', wordBreak: 'break-all', marginBottom: '20px', background: '#F8FAFC', padding: '8px 12px', borderRadius: '8px' }}>
                    ID: {selected.student_id}
                  </div>

                  {/* Documents */}
                  {selected.documents?.list && selected.documents.list.length > 0 && (
                    <div style={{ marginBottom: '20px' }}>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>Documents</div>
                      {selected.documents.list.map((doc, i) => {
                        const isApproved = doc.status === 'approved';
                        const isRejected = doc.status === 'rejected';
                        return (
                          <div key={i} style={{
                            padding: '12px', borderRadius: '8px', marginBottom: '8px',
                            background: isApproved ? '#F0FDF4' : isRejected ? '#FFF1F2' : '#F8FAFC',
                            border: `1px solid ${isApproved ? '#BBF7D0' : isRejected ? '#FECDD3' : '#E2E8F0'}`
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                              <span style={{ fontSize: '13px', fontWeight: 600, color: '#1A2B6D', textTransform: 'capitalize' }}>{doc.doc_type}</span>
                              <span style={{ fontSize: '11px', fontWeight: 700, color: isApproved ? '#16A34A' : isRejected ? '#C8102E' : '#64748B', textTransform: 'capitalize' }}>{doc.status}</span>
                            </div>
                            <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>{doc.file_name}</div>
                            {doc.message && <div style={{ fontSize: '11px', color: isRejected ? '#C8102E' : '#64748B', fontStyle: 'italic' }}>{doc.message}</div>}
                            <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px' }}>AI Confidence: {doc.confidence?.toFixed(1)}%</div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {selected.overall_status !== 'approved' && (
                      <button
                        onClick={() => updateStatus(selected.student_id, 'approved')}
                        className="btn-primary"
                        style={{ flex: 1, padding: '11px 16px', fontSize: '14px', background: '#16A34A', justifyContent: 'center' }}
                        disabled={!!actionLoading}
                      >
                        ✓ Approve
                      </button>
                    )}
                    {selected.overall_status !== 'rejected' && (
                      <button
                        onClick={() => updateStatus(selected.student_id, 'rejected')}
                        className="btn-red"
                        style={{ flex: 1, padding: '11px 16px', fontSize: '14px', justifyContent: 'center' }}
                        disabled={!!actionLoading}
                      >
                        ✕ Reject
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
