'use client';

import { useState } from 'react';
import { Check, X, Clock, MessageSquare, AlertCircle, Eye, FileText } from 'lucide-react';

interface ApprovalItem {
  id: string;
  title: string;
  type: string;
  project: string;
  requested_by: string;
  reviewer: string;
  status: 'pending' | 'approved' | 'changes_requested' | 'rejected';
  submitted_at: string;
  notes?: string;
}

const initialApprovals: ApprovalItem[] = [
  {
    id: 'a0000000-0000-0000-0000-000000000001',
    title: 'Video Teaser: Sambut Cahaya Ramadhan 1448H (Rough Cut 01)',
    type: 'Video Cut',
    project: 'Ramadhan Campaign 2026',
    requested_by: 'Reza Pratama',
    reviewer: 'Ahmad Fauzi (Creative Lead)',
    status: 'pending',
    submitted_at: 'Hari ini, 10:30 WIB',
  },
  {
    id: 'a0000000-0000-0000-0000-000000000002',
    title: 'Brand Guidelines Booklet 2026 PDF (Draft v2.1)',
    type: 'Dokumen Panduan',
    project: 'Annual Brand Refresh',
    requested_by: 'Budi Wicaksono',
    reviewer: 'Siti Sarah (Producer)',
    status: 'approved',
    submitted_at: 'Kemarin, 14:15 WIB',
    notes: 'Visual rapi, tata letak seimbang dan panduan warna sudah sesuai standar.',
  },
  {
    id: 'a0000000-0000-0000-0000-000000000003',
    title: 'Desain Baliho Gerbang Utama Kampus Bandung',
    type: 'Key Visual Cetak',
    project: 'Penerimaan Mahasiswa Baru',
    requested_by: 'Budi Wicaksono',
    reviewer: 'Ahmad Fauzi (Creative Lead)',
    status: 'changes_requested',
    submitted_at: '2 hari lalu',
    notes: 'Perbesar kontras teks pada nama hotline dan ganti foto mahasiswa dengan resolusi 300dpi.',
  },
];

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<ApprovalItem[]>(initialApprovals);
  const [activeItem, setActiveItem] = useState<ApprovalItem | null>(null);
  const [feedbackNote, setFeedbackNote] = useState('');

  const handleDecision = (id: string, newStatus: ApprovalItem['status']) => {
    setApprovals(approvals.map(a => 
      a.id === id 
        ? { ...a, status: newStatus, notes: feedbackNote || (newStatus === 'approved' ? 'Disetujui tanpa catatan khusus.' : 'Perlu revisi sesuai catatan.') }
        : a
    ));
    setActiveItem(null);
    setFeedbackNote('');
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>
          Review & Sign-Off Queue
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Gerbang kendali kualitas (quality control) sebelum aset dan materi kreatif dipublikasikan.
        </p>
      </div>

      {/* Approvals List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {approvals.map((app) => (
          <div key={app.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <span className="badge" style={{ fontSize: '11px', textTransform: 'uppercase' }}>
                    {app.type}
                  </span>
                  <span className={`status-pill status-${app.status}`}>
                    {app.status.replace('_', ' ')}
                  </span>
                </div>

                <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '6px' }}>
                  {app.title}
                </h3>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Proyek: <strong>{app.project}</strong> • Diajukan oleh: {app.requested_by} ({app.submitted_at})
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                {app.status === 'pending' ? (
                  <>
                    <button
                      onClick={() => handleDecision(app.id, 'approved')}
                      className="btn btn-primary"
                      style={{ fontSize: '12px', padding: '6px 12px' }}
                    >
                      <Check size={14} /> Setujui
                    </button>
                    <button
                      onClick={() => {
                        setActiveItem(app);
                        setFeedbackNote('');
                      }}
                      className="btn btn-secondary"
                      style={{ fontSize: '12px', padding: '6px 12px' }}
                    >
                      <MessageSquare size={14} /> Beri Catatan
                    </button>
                  </>
                ) : (
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    Ditangani oleh {app.reviewer}
                  </span>
                )}
              </div>
            </div>

            {/* Decision Notes if any */}
            {app.notes && (
              <div style={{ 
                padding: 'var(--space-3)', 
                background: '#f8fafc', 
                borderLeft: '3px solid var(--text-primary)',
                fontSize: '13px',
                color: 'var(--text-primary)',
                marginTop: 'var(--space-2)'
              }}>
                <strong>Catatan Review:</strong> {app.notes}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Feedback Modal */}
      {activeItem && (
        <div className="modal-overlay" onClick={() => setActiveItem(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Tanggapan & Revisi Materi</h3>
              <button onClick={() => setActiveItem(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
                Tuliskan poin-poin perbaikan yang perlu diperbaiki oleh <strong>{activeItem.requested_by}</strong>.
              </p>

              <div className="form-group">
                <label className="form-label">Catatan Revisi / Alasan</label>
                <textarea
                  rows={4}
                  className="form-input"
                  placeholder="Contoh: Koreksi warna pada menit 00:15 dan sesuaikan font credit..."
                  value={feedbackNote}
                  onChange={(e) => setFeedbackNote(e.target.value)}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button 
                type="button" 
                onClick={() => handleDecision(activeItem.id, 'rejected')} 
                className="btn btn-secondary"
                style={{ color: 'var(--danger-color)', marginRight: 'auto' }}
              >
                Tolak Pengajuan
              </button>
              <button 
                type="button" 
                onClick={() => handleDecision(activeItem.id, 'changes_requested')} 
                className="btn btn-primary"
              >
                Kirim Permintaan Revisi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
