'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';

const API_BASE = 'https://airindia.solutionbriz.com/api';

type DocStatus = 'uploaded' | 'pending' | 'error';

interface DocCard {
  id: string;
  doc_type: string;
  icon: string;
  title: string;
  description: string;
  status: DocStatus;
  fileName?: string;
  fileSize?: string;
  errorMsg?: string;
}

const INITIAL_DOCS: DocCard[] = [
  {
    id: 'aadhaar',
    doc_type: 'aadhaar',
    icon: '🪪',
    title: 'Aadhaar Card / Passport',
    description: 'Clear color scan of your Aadhaar card (front side) or Passport identity page.',
    status: 'pending',
  },
  {
    id: '10th',
    doc_type: '10th',
    icon: '📄',
    title: '10th Marksheet / Certificate',
    description: 'Secondary School Certificate or SSLC marksheet issued by your Board of Education.',
    status: 'pending',
  },
  {
    id: '12th',
    doc_type: '12th',
    icon: '📋',
    title: '12th Marksheet / Certificate',
    description: 'Higher Secondary or Intermediate certificate issued by your Board of Education.',
    status: 'pending',
  },
];

export default function DocumentsPage() {
  const router = useRouter();
  const [studentId, setStudentId] = useState('');
  const [docs, setDocs] = useState<DocCard[]>(INITIAL_DOCS);
  const [completing, setCompleting] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState<string | null>(null);
  const fileRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  useEffect(() => {
    const id = localStorage.getItem('student_id') || '';
    if (!id) { router.push('/apply'); return; }
    setStudentId(id);
  }, [router]);

  const handleFileSelect = async (docId: string, file: File) => {
    const doc = docs.find(d => d.id === docId);
    if (!doc || !studentId) return;
    setUploading(docId);
    try {
      const formData = new FormData();
      formData.append('student_id', studentId);
      formData.append('doc_type', doc.doc_type);
      formData.append('file', file);

      const res = await fetch(`${API_BASE}/student/upload-document`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        setDocs(prev => prev.map(d => d.id === docId ? {
          ...d,
          status: 'error',
          fileName: file.name,
          errorMsg: data.detail || data.message || 'Upload failed',
        } : d));
      } else {
        const aiStatus = data.ai_result?.status || 'uploaded';
        const aiMsg = data.ai_result?.message || '';
        setDocs(prev => prev.map(d => d.id === docId ? {
          ...d,
          status: aiStatus === 'rejected' ? 'error' : 'uploaded',
          fileName: file.name,
          fileSize: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
          errorMsg: aiStatus === 'rejected' ? aiMsg : undefined,
        } : d));
      }
    } catch {
      setDocs(prev => prev.map(d => d.id === docId ? {
        ...d, status: 'error', fileName: file.name, errorMsg: 'Network error'
      } : d));
    } finally {
      setUploading(null);
    }
  };

  const handleComplete = async () => {
    if (!studentId) return;
    setCompleting(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/student/complete/${studentId}`, { method: 'PATCH' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || data.message || 'Completion failed');
      router.push(`/status?id=${studentId}`);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Something went wrong');
    } finally {
      setCompleting(false);
    }
  };

  const uploadedCount = docs.filter(d => d.status === 'uploaded').length;
  const progressPct = Math.round((uploadedCount / docs.length) * 100);

  const statusBadge = (status: DocStatus) => {
    const map: Record<DocStatus, { label: string; bg: string; color: string }> = {
      uploaded: { label: 'Uploaded', bg: '#DCFCE7', color: '#16A34A' },
      pending: { label: 'Pending', bg: '#F1F5F9', color: '#64748B' },
      error: { label: 'Error', bg: '#FFF1F2', color: '#C8102E' },
    };
    const s = map[status];
    return (
      <span className="tag" style={{ background: s.bg, color: s.color }}>
        {s.label}
      </span>
    );
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F5F7FA' }}>
      <Navbar />

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px' }}>
        {/* Header */}
        <div className="rsp-docs-header animate-fadeInUp" style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'flex-start', marginBottom: '36px' }}>
          <div>
            <span style={{ color: '#1A2B6D', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Admission Journey
            </span>
            <h1 style={{ fontSize: '40px', fontWeight: 900, color: '#1A2B6D', margin: '8px 0 12px' }}>
              Finalizing Your Credentials
            </h1>
            <p style={{ color: '#64748B', fontSize: '15px', lineHeight: 1.6, maxWidth: '480px' }}>
              To maintain our standards of excellence, please provide high-resolution digital copies of your professional certifications and travel documents.
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#1A2B6D', marginBottom: '6px' }}>
              Step 3 of 3 &nbsp;&nbsp; <span style={{ color: '#22C55E', fontWeight: 700 }}>{progressPct}% Complete</span>
            </div>
            <div style={{ width: '260px', height: '8px', background: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${progressPct}%`, height: '100%', background: '#1A2B6D', borderRadius: '4px', transition: 'width 0.5s ease' }} />
            </div>
          </div>
        </div>

        {/* Document Cards */}
        <div className="rsp-grid-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '32px' }}>
          {docs.map((doc) => (
            <div key={doc.id} className="card animate-fadeInUp" style={{ padding: '24px', position: 'relative' }}>
              {/* Status badge */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '12px',
                  background: doc.status === 'error' ? '#FFF1F2' : doc.status === 'uploaded' ? '#EEF2FF' : '#F8FAFC',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '22px', border: '1px solid #E2E8F0'
                }}>
                  {doc.icon}
                </div>
                {statusBadge(doc.status)}
              </div>

              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1A2B6D', marginBottom: '6px' }}>{doc.title}</h3>
              <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.5, marginBottom: '16px' }}>{doc.description}</p>

              {/* Uploaded state */}
              {doc.status === 'uploaded' && (
                <>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    background: '#F8FAFC', borderRadius: '8px', padding: '10px 14px',
                    border: '1px solid #E2E8F0', marginBottom: '12px'
                  }}>
                    <span style={{ fontSize: '16px' }}>📄</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#1A2B6D', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {doc.fileName}
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>{doc.fileSize}</div>
                    </div>
                    <span style={{ fontSize: '18px' }}>✅</span>
                  </div>
                  <button
                    onClick={() => fileRefs.current[doc.id]?.click()}
                    style={{
                      width: '100%', padding: '10px', borderRadius: '8px',
                      border: '1.5px solid #E2E8F0', background: 'white',
                      fontWeight: 600, fontSize: '14px', color: '#1A2B6D',
                      cursor: 'pointer', transition: 'all 0.2s'
                    }}
                  >
                    Replace Document
                  </button>
                </>
              )}

              {/* Pending state */}
              {doc.status === 'pending' && (
                <div
                  style={{
                    border: '2px dashed #CBD5E1', borderRadius: '10px', padding: '24px',
                    textAlign: 'center', cursor: 'pointer',
                    transition: 'all 0.2s', background: uploading === doc.id ? '#F0F3FF' : 'transparent'
                  }}
                  onClick={() => fileRefs.current[doc.id]?.click()}
                  onDragOver={e => { e.preventDefault(); }}
                  onDrop={e => {
                    e.preventDefault();
                    const file = e.dataTransfer.files[0];
                    if (file) handleFileSelect(doc.id, file);
                  }}
                >
                  {uploading === doc.id ? (
                    <div style={{ color: '#1A2B6D', fontSize: '13px', fontWeight: 600 }}>Uploading...</div>
                  ) : (
                    <>
                      <div style={{ fontSize: '28px', marginBottom: '8px', color: '#94A3B8' }}>☁️</div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Drag and drop file here</div>
                      <div style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '14px' }}>PDF, JPG up to 10MB</div>
                      <button
                        type="button"
                        className="btn-primary"
                        style={{ fontSize: '13px', padding: '9px 20px' }}
                      >
                        Browse Files
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* Error state */}
              {doc.status === 'error' && (
                <>
                  <div style={{
                    background: '#FFF1F2', border: '1px solid #FECDD3',
                    borderRadius: '8px', padding: '10px 14px',
                    display: 'flex', alignItems: 'center', gap: '8px',
                    marginBottom: '12px'
                  }}>
                    <span style={{ color: '#C8102E', fontSize: '16px' }}>⚠</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#1A2B6D' }}>{doc.fileName}</div>
                      <div style={{ fontSize: '11px', color: '#C8102E' }}>{doc.errorMsg || 'Resolution too low. Please rescan.'}</div>
                    </div>
                    <button onClick={() => setDocs(prev => prev.map(d => d.id === doc.id ? { ...d, status: 'pending', fileName: undefined } : d))}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C8102E', fontSize: '18px' }}>×</button>
                  </div>
                  <div
                    style={{ border: '2px dashed #CBD5E1', borderRadius: '8px', padding: '16px', textAlign: 'center', cursor: 'pointer' }}
                    onClick={() => fileRefs.current[doc.id]?.click()}
                  >
                    <div style={{ fontSize: '20px', color: '#94A3B8', marginBottom: '4px' }}>⊕</div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#64748B' }}>Upload Replacement</div>
                  </div>
                </>
              )}

              {/* Hidden file input */}
              <input
                ref={el => { fileRefs.current[doc.id] = el; }}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                style={{ display: 'none' }}
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(doc.id, file);
                  e.target.value = '';
                }}
              />
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '28px' }}>
          {/* Security Banner */}
          <div style={{
            background: 'linear-gradient(135deg, #1A2B6D 0%, #0d1a4a 100%)',
            borderRadius: '16px', padding: '32px', position: 'relative', overflow: 'hidden', minHeight: '200px'
          }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 200 200\'%3E%3Ccircle cx=\'100\' cy=\'120\' r=\'80\' fill=\'rgba(255,255,255,0.03)\'/%3E%3C/svg%3E")', opacity: 0.5 }} />
            <h3 style={{ color: 'white', fontSize: '20px', fontWeight: 800, marginBottom: '12px' }}>
              Security &amp; Verification
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', lineHeight: 1.7 }}>
              All documents are encrypted and stored in our secure administrative vault.
              Verification typically takes 3-5 business days. Once approved, you will receive your digital enrollment badge.
            </p>
          </div>

          {/* Assistance Box */}
          <div className="card" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1A2B6D', marginBottom: '8px' }}>Need Assistance?</h3>
            <p style={{ color: '#64748B', fontSize: '14px', lineHeight: 1.6, marginBottom: '20px' }}>
              Our admissions officers are standing by to help with any technical or document-related questions.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                👥
              </div>
              <a href="mailto:admissions@airindia.in" style={{ color: '#1A2B6D', fontWeight: 700, fontSize: '15px', textDecoration: 'none' }}>
                Contact Support →
              </a>
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

        {/* Footer Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button className="btn-ghost" onClick={() => router.push('/apply/education')}>
            Save &amp; Exit
          </button>
          <button
            id="complete-application"
            className="btn-primary"
            onClick={handleComplete}
            disabled={completing}
            style={{ padding: '13px 32px', fontSize: '15px' }}
          >
            {completing ? 'Completing...' : 'Complete Application'}
          </button>
        </div>
      </main>
    </div>
  );
}
