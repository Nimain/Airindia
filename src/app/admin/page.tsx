'use client';
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
const API_BASE = 'https://airindia.solutionbriz.com/api';
// const API_BASE = 'http://localhost:8000/api';

interface Candidate {
  id?: string;
  student_id?: string;
  name?: string;
  legal_full_name?: string;
  email: string;
  stream: string;
  step_completed: number;
  overall_status: string;
  // Personal
  mobile?: string;
  date_of_birth?: string;
  // Education
  highest_qualification?: string;
  institute_name?: string;
  graduation_year?: string;
  // Experience
  flight_hours?: string;
  mro_certification?: string | null;
  other_experience?: string | null;
  // Timestamps
  created_at?: string;
  updated_at?: string;
  // Documents
  documents?: {
    total?: number;
    approved?: number;
    rejected?: number;
    list?: Array<{
      doc_type: string;
      file_name: string;
      file_url?: string | null;
      status: string;
      confidence?: number;
      doc_type_detected?: string | null;
      message: string;
      verified_at: string;
    }>;
  } | Array<{
    doc_type: string;
    file_name: string;
    file_url?: string | null;
    status: string;
    confidence?: number;
    doc_type_detected?: string | null;
    message: string;
    verified_at: string;
  }>;
  [key: string]: unknown;
}

/** Resolve the real Mongo _id regardless of which field name the API used */
const cid = (c: Candidate) => (c.id ?? c.student_id ?? '') as string;
/** Resolve display name */
const cname = (c: Candidate) => (c.name ?? c.legal_full_name ?? '—') as string;
/** Pretty-print status labels */
const statusLabel = (s: string) => {
  if (s === 'documents_uploaded') return 'Docs Uploaded';
  return s.charAt(0).toUpperCase() + s.slice(1);
};
/** Whether admin can still decide */
const canDecide = (status: string) => status === 'pending' || status === 'documents_uploaded';

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  approved: { bg: '#DCFCE7', color: '#16A34A' },
  rejected: { bg: '#FFF1F2', color: '#C8102E' },
  pending: { bg: '#FEF3C7', color: '#B8952A' },
  completed: { bg: '#EEF2FF', color: '#1A2B6D' },
  documents_uploaded: { bg: '#F0F9FF', color: '#0369A1' },
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
      setCandidates(prev => prev.map(c => cid(c) === id ? { ...c, overall_status: newStatus } : c));
      if (selected && cid(selected) === id) setSelected({ ...selected, overall_status: newStatus });
    } catch (err: unknown) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = candidates.filter(c => {
    const matchStatus = filterStatus === 'all' || c.overall_status === filterStatus;
    const matchStream = filterStream === 'all' || c.stream === filterStream;
    const matchSearch = !searchQuery || cname(c).toLowerCase().includes(searchQuery.toLowerCase()) || c.email?.toLowerCase().includes(searchQuery.toLowerCase()) || cid(c).includes(searchQuery);
    return matchStatus && matchStream && matchSearch;
  });

  const counts = {
    total: candidates.length,
    approved: candidates.filter(c => c.overall_status === 'approved').length,
    rejected: candidates.filter(c => c.overall_status === 'rejected').length,
    pending: candidates.filter(c =>
      c.overall_status === 'pending' ||
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
        <div className="rsp-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
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
        <div className="rsp-filters" style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
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
                      <tr key={`${cid(c)}-${i}`} style={{
                        borderBottom: '1px solid #F1F5F9',
                        background: selected && cid(selected) === cid(c) ? '#EEF2FF' : i % 2 === 0 ? 'white' : '#FAFAFA',
                        transition: 'background 0.15s'
                      }}>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontWeight: 700, color: '#1A2B6D', fontSize: '14px', marginBottom: '2px' }}>{cname(c)}</div>
                          <div style={{ fontSize: '12px', color: '#94A3B8' }}>{c.email}</div>
                          <div style={{ fontSize: '11px', color: '#CBD5E1', marginTop: '2px', fontFamily: 'monospace' }}>{cid(c).substring(0, 16)}...</div>
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
                          <span className="tag" style={{ background: sc.bg, color: sc.color }}>
                            {statusLabel(c.overall_status)}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                            <button
                              onClick={() => fetchDetail(cid(c))}
                              style={{ fontSize: '12px', fontWeight: 600, color: '#1A2B6D', border: '1px solid #E2E8F0', background: 'white', borderRadius: '6px', padding: '5px 10px', cursor: 'pointer' }}
                            >
                              View
                            </button>
                            {canDecide(c.overall_status) ? (
                              <>
                                <button
                                  onClick={() => updateStatus(cid(c), 'approved')}
                                  disabled={actionLoading === `${cid(c)}-approved`}
                                  style={{ fontSize: '12px', fontWeight: 600, color: '#16A34A', border: '1px solid #86EFAC', background: '#F0FDF4', borderRadius: '6px', padding: '5px 10px', cursor: 'pointer' }}
                                >
                                  ✓ Approve
                                </button>
                                <button
                                  onClick={() => updateStatus(cid(c), 'rejected')}
                                  disabled={actionLoading === `${cid(c)}-rejected`}
                                  style={{ fontSize: '12px', fontWeight: 600, color: '#C8102E', border: '1px solid #FECDD3', background: '#FFF1F2', borderRadius: '6px', padding: '5px 10px', cursor: 'pointer' }}
                                >
                                  ✕ Reject
                                </button>
                              </>
                            ) : (
                              <span style={{
                                fontSize: '10px', fontWeight: 700, letterSpacing: '0.06em',
                                color: c.overall_status === 'approved' ? '#16A34A' : '#C8102E',
                                background: c.overall_status === 'approved' ? '#F0FDF4' : '#FFF1F2',
                                border: `1px solid ${c.overall_status === 'approved' ? '#BBF7D0' : '#FECDD3'}`,
                                borderRadius: '6px', padding: '4px 10px'
                              }}>
                                {c.overall_status === 'approved' ? '✓ Approved' : '✕ Rejected'}
                              </span>
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
                  {/* — Header — */}
                  <div style={{ marginBottom: '18px', paddingBottom: '16px', borderBottom: '1px solid #F1F5F9' }}>
                    <div style={{ fontSize: '20px', fontWeight: 900, color: '#1A2B6D', marginBottom: '3px' }}>{cname(selected)}</div>
                    <div style={{ fontSize: '12px', color: '#64748B' }}>{selected.email}</div>
                    {selected.mobile && <div style={{ fontSize: '12px', color: '#64748B' }}>📱 {selected.mobile}</div>}
                    <div style={{ fontFamily: 'monospace', fontSize: '9px', color: '#CBD5E1', marginTop: '4px', wordBreak: 'break-all' }}>ID: {cid(selected)}</div>
                  </div>

                  {/* — Status Grid — */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '18px' }}>
                    {[
                      { label: 'Stream', value: selected.stream === 'PILOT_CADET' ? '✈ Pilot Cadet' : '🔧 Tech MRO' },
                      { label: 'Status', value: selected.overall_status },
                      { label: 'Step Completed', value: `${selected.step_completed}/3` },
                      { label: 'Documents', value: `${Array.isArray(selected.documents) ? selected.documents.length : (selected.documents as { total?: number })?.total ?? 0} uploaded` },
                    ].map((item, i) => (
                      <div key={i} style={{ background: '#F8FAFC', borderRadius: '8px', padding: '9px 12px' }}>
                        <div style={{ fontSize: '9px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '2px' }}>{item.label}</div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#1A2B6D', textTransform: 'capitalize' }}>{item.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* — Personal Info — */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>👤 Personal</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                      {[
                        { label: 'Date of Birth', value: selected.date_of_birth ?? '—' },
                        { label: 'Mobile', value: selected.mobile ?? '—' },
                      ].map((item, i) => (
                        <div key={i} style={{ background: '#F8FAFC', borderRadius: '7px', padding: '8px 11px' }}>
                          <div style={{ fontSize: '9px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>{item.label}</div>
                          <div style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>{item.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* — Education — */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>🎓 Education</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                      {[
                        { label: 'Qualification', value: selected.highest_qualification ?? '—' },
                        { label: 'Institute', value: selected.institute_name ?? '—' },
                        { label: 'Graduation Year', value: selected.graduation_year ?? '—' },
                      ].map((item, i) => (
                        <div key={i} style={{ background: '#EEF2FF', borderRadius: '7px', padding: '8px 11px' }}>
                          <div style={{ fontSize: '9px', color: '#6366F1', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>{item.label}</div>
                          <div style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>{item.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* — Experience — */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>✈ Experience</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                      {[
                        { label: 'Flight Hours', value: selected.flight_hours ? `${selected.flight_hours} hrs` : '—' },
                        { label: 'MRO Certification', value: selected.mro_certification ?? '—' },
                        { label: 'Other Experience', value: selected.other_experience ?? '—' },
                      ].map((item, i) => (
                        <div key={i} style={{ background: '#FFF7ED', borderRadius: '7px', padding: '8px 11px' }}>
                          <div style={{ fontSize: '9px', color: '#B8952A', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>{item.label}</div>
                          <div style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>{item.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* — Timestamps — */}
                  <div style={{ marginBottom: '16px', background: '#F8FAFC', borderRadius: '8px', padding: '10px 12px' }}>
                    <div style={{ fontSize: '9px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>🕐 Timeline</div>
                    <div style={{ fontSize: '11px', color: '#64748B', marginBottom: '3px' }}>
                      <span style={{ fontWeight: 600 }}>Applied:</span> {selected.created_at ? new Date(selected.created_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748B' }}>
                      <span style={{ fontWeight: 600 }}>Last Updated:</span> {selected.updated_at ? new Date(selected.updated_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
                    </div>
                  </div>

                  {/* — Documents — */}
                  {(() => {
                    const docList = Array.isArray(selected.documents)
                      ? selected.documents
                      : (selected.documents as { list?: unknown[] })?.list ?? [];
                    return docList.length > 0 && (
                      <div style={{ marginBottom: '16px' }}>
                        <div style={{ fontSize: '10px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>📁 Documents</div>
                        {(docList as Array<{ doc_type: string; file_name: string; file_url?: string | null; status: string; confidence?: number; doc_type_detected?: string | null; message: string; verified_at: string }>).map((doc, i) => {
                          const isApproved = doc.status === 'approved';
                          const isRejected = doc.status === 'rejected';
                          return (
                            <div key={i} style={{
                              padding: '10px 12px', borderRadius: '8px', marginBottom: '7px',
                              background: isApproved ? '#F0FDF4' : isRejected ? '#FFF1F2' : '#F8FAFC',
                              border: `1px solid ${isApproved ? '#BBF7D0' : isRejected ? '#FECDD3' : '#E2E8F0'}`
                            }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                                <span style={{ fontSize: '12px', fontWeight: 700, color: '#1A2B6D', textTransform: 'capitalize' }}>{doc.doc_type}</span>
                                <span style={{ fontSize: '10px', fontWeight: 700, color: isApproved ? '#16A34A' : isRejected ? '#C8102E' : '#64748B', textTransform: 'uppercase' }}>{doc.status}</span>
                              </div>
                              <div style={{ fontSize: '11px', color: '#64748B', marginBottom: '3px', fontFamily: 'monospace' }}>{doc.file_name}</div>
                              {/* {doc.doc_type_detected && (
                                <div style={{ fontSize: '10px', color: '#6366F1', marginBottom: '3px' }}>
                                  🤖 AI detected: <strong>{doc.doc_type_detected}</strong>
                                </div>
                              )} */}
                              {doc.message && <div style={{ fontSize: '10px', color: isRejected ? '#C8102E' : '#64748B', fontStyle: 'italic', marginBottom: '4px' }}>{doc.message}</div>}
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                                <div style={{ fontSize: '10px', color: '#94A3B8' }}>{doc.verified_at ? new Date(doc.verified_at).toLocaleDateString('en-IN') : ''}</div>
                                {doc.file_url && (
                                  <a
                                    href={doc.file_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                      fontSize: '10px', fontWeight: 700, color: '#1A2B6D',
                                      background: '#EEF2FF', border: '1px solid #C7D2FE',
                                      borderRadius: '5px', padding: '3px 8px',
                                      textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '3px'
                                    }}
                                  >
                                    👁 View File
                                  </a>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}

                  {/* Action Buttons — shown only while awaiting admin decision */}
                  {canDecide(selected.overall_status) ? (
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        onClick={() => updateStatus(cid(selected), 'approved')}
                        className="btn-primary"
                        style={{ flex: 1, padding: '11px 16px', fontSize: '14px', background: '#16A34A', justifyContent: 'center' }}
                        disabled={!!actionLoading}
                      >
                        ✓ Approve
                      </button>
                      <button
                        onClick={() => updateStatus(cid(selected), 'rejected')}
                        className="btn-red"
                        style={{ flex: 1, padding: '11px 16px', fontSize: '14px', justifyContent: 'center' }}
                        disabled={!!actionLoading}
                      >
                        ✕ Reject
                      </button>
                    </div>
                  ) : (
                    <div style={{
                      textAlign: 'center', padding: '14px 16px', borderRadius: '10px',
                      background: selected.overall_status === 'approved' ? '#F0FDF4' : '#FFF1F2',
                      border: `1px solid ${selected.overall_status === 'approved' ? '#BBF7D0' : '#FECDD3'}`,
                      fontSize: '14px', fontWeight: 700,
                      color: selected.overall_status === 'approved' ? '#16A34A' : '#C8102E'
                    }}>
                      {selected.overall_status === 'approved' ? '✓ Application Approved' : '✕ Application Rejected'}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
