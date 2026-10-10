'use client';

import { useState } from 'react';
import { 
  Check, 
  X, 
  MessageSquare, 
  ExternalLink, 
  Eye, 
  Edit3, 
  Trash2, 
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { usePersistentData } from '@/lib/usePersistentData';

interface ApprovalItem {
  id: string;
  title: string;
  division: string;
  project: string;
  requested_by: string;
  reviewer: string;
  status: 'pending' | 'approved' | 'changes_requested' | 'rejected';
  submitted_at: string;
  drive_id: string;
  drive_link: string;
  notes?: string;
}

const SAMPLE_APPROVALS: ApprovalItem[] = [
  {
    id: 'a001',
    title: 'Eksplorasi Key Visual & Poster Utama (Desain 01)',
    division: 'Tim Desain',
    project: 'Ramadhan Creative Campaign 2026',
    requested_by: 'Budi Wicaksono (Desain JKT)',
    reviewer: 'Ahmad Fauzi (Super Admin)',
    status: 'pending',
    submitted_at: 'Hari ini, 10:30 WIB',
    drive_id: '11hIc4hsM-AfKwX_0nrCGNXv7G12Br8i8',
    drive_link: 'https://drive.google.com/file/d/11hIc4hsM-AfKwX_0nrCGNXv7G12Br8i8/view?usp=sharing',
  },
  {
    id: 'a002',
    title: 'Layout Feed Instagram & Tipografi Headline (Desain 02)',
    division: 'Tim Desain & Copy',
    project: 'Social Media Editorial Sprint Q1',
    requested_by: 'Dewi Lestari (Copywriter SBY)',
    reviewer: 'Siti Sarah (Admin Kampus JKT)',
    status: 'pending',
    submitted_at: 'Hari ini, 11:15 WIB',
    drive_id: '1HMsNgOkbZA_rl3NxshxFLEapHdI8UZvu',
    drive_link: 'https://drive.google.com/file/d/1HMsNgOkbZA_rl3NxshxFLEapHdI8UZvu/view?usp=sharing',
  },
  {
    id: 'a003',
    title: 'Ilustrasi & Karakter Kampus Bandung Hub (Desain 03)',
    division: 'Tim Desain & 3D',
    project: 'Annual Brand Refresh & Design System',
    requested_by: 'Reza Pratama (Admin BDG)',
    reviewer: 'Ahmad Fauzi (Super Admin)',
    status: 'approved',
    submitted_at: 'Kemarin, 14:00 WIB',
    drive_id: '1MjmEUVo6IXKyFY5QJBnjGuSih7Puj9yf',
    drive_link: 'https://drive.google.com/file/d/1MjmEUVo6IXKyFY5QJBnjGuSih7Puj9yf/view?usp=sharing',
    notes: 'Komposisi warna hangat dan kontras sudah sangat pas. Disetujui untuk diteruskan ke master kit.',
  },
  {
    id: 'a004',
    title: 'Banner Baliho & Standing Display Wisuda (Desain 04)',
    division: 'Tim Desain',
    project: 'Wisuda Akbar Semester Genap',
    requested_by: 'Budi Wicaksono (Desain JKT)',
    reviewer: 'Siti Sarah (Admin Kampus JKT)',
    status: 'changes_requested',
    submitted_at: 'Kemarin, 16:45 WIB',
    drive_id: '1_MPbH-P3owSm0QLS11AwbWziF3nzBCJG',
    drive_link: 'https://drive.google.com/file/d/1_MPbH-P3owSm0QLS11AwbWziF3nzBCJG/view?usp=sharing',
    notes: 'Mohon geser logo ke sudut kiri atas dengan margin 32px dan perjelas teks tanggal acara.',
  },
  {
    id: 'a005',
    title: 'Mockup Merchandise & Kaos Unit Kreatif (Desain 05)',
    division: 'Tim Desain',
    project: 'Merchandise Kit Mahasiswa Kreatif',
    requested_by: 'Reza Pratama (Admin BDG)',
    reviewer: 'Ahmad Fauzi (Super Admin)',
    status: 'pending',
    submitted_at: '2 hari lalu',
    drive_id: '1tOM13LlNo_bj7iKXglvPrux_nA53Nq0z',
    drive_link: 'https://drive.google.com/file/d/1tOM13LlNo_bj7iKXglvPrux_nA53Nq0z/view?usp=sharing',
  },
];

export default function ApprovalsPage() {
  const { currentUser } = useAuth();
  const { data: approvals, updateItem, deleteItem, addItem } = usePersistentData<ApprovalItem>('approvals', SAMPLE_APPROVALS);
  const [activeItem, setActiveItem] = useState<ApprovalItem | null>(null);
  const [feedbackNote, setFeedbackNote] = useState('');
  
  // Edit state
  const [editingItem, setEditingItem] = useState<ApprovalItem | null>(null);
  const [previewImage, setPreviewImage] = useState<ApprovalItem | null>(null);

  const handleDecision = (id: string, newStatus: ApprovalItem['status']) => {
    updateItem(id, {
      status: newStatus,
      reviewer: `${currentUser.name} (${currentUser.role})`,
      notes: feedbackNote || (newStatus === 'approved' ? 'Disetujui tanpa catatan khusus.' : 'Perlu revisi sesuai catatan review tim.')
    });
    setActiveItem(null);
    setFeedbackNote('');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    updateItem(editingItem.id, editingItem);
    setEditingItem(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Yakin ingin menghapus berkas review ini?')) {
      deleteItem(id);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-6)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: '4px' }}>
            <span className="status-pill status-active" style={{ fontSize: '11px', padding: '2px 8px' }}>
              Quality Control & Feedback Queue
            </span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Review Desain & Materi Kreatif Bersama
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Periksa hasil karya tim dari Google Drive, diskusikan masukan visual, dan berikan persetujuan (*approval*).
          </p>
        </div>
      </div>

      {/* Approvals Grid with Visual Image Previews */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 'var(--space-6)' }}>
        {approvals.map((app) => (
          <div key={app.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            
            {/* Visual Thumbnail from Google Drive */}
            <div 
              style={{ 
                position: 'relative', 
                height: '200px', 
                backgroundColor: '#f1f5f9', 
                borderRadius: 'var(--radius-sm)',
                overflow: 'hidden',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              onClick={() => setPreviewImage(app)}
            >
              <img 
                src={`https://lh3.googleusercontent.com/d/${app.drive_id}`}
                alt={app.title}
                onError={(e) => {
                  // Fallback if direct thumbnail block occurs
                  (e.target as HTMLElement).style.display = 'none';
                }}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{ 
                position: 'absolute', 
                bottom: '8px', 
                right: '8px',
                background: 'rgba(15, 23, 42, 0.75)',
                color: '#fff',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '11px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <Eye size={12} /> Klik untuk Perbesar
              </div>
            </div>

            {/* Content Details */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="badge" style={{ fontSize: '11px', textTransform: 'uppercase' }}>
                  {app.division}
                </span>
                <span className={`status-pill status-${app.status}`}>
                  {app.status.replace('_', ' ')}
                </span>
              </div>

              <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '8px' }}>
                {app.title}
              </h3>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Proyek: <strong>{app.project}</strong>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Oleh: {app.requested_by} • {app.submitted_at}
              </div>
            </div>

            {/* Notes if any */}
            {app.notes && (
              <div style={{ 
                padding: 'var(--space-2) var(--space-3)', 
                background: '#f8fafc', 
                borderLeft: '3px solid var(--text-primary)',
                fontSize: '12px',
                color: 'var(--text-primary)'
              }}>
                <strong>Catatan Review:</strong> {app.notes}
              </div>
            )}

            {/* Action Bar */}
            <div style={{ 
              borderTop: '1px solid var(--border-color)', 
              paddingTop: 'var(--space-3)',
              marginTop: 'auto',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <button
                  onClick={() => setEditingItem(app)}
                  className="btn btn-secondary"
                  style={{ fontSize: '11px', padding: '4px 8px' }}
                  title="Edit Data Materi"
                >
                  <Edit3 size={12} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(app.id)}
                  className="btn btn-secondary"
                  style={{ fontSize: '11px', padding: '4px 8px', color: 'var(--danger-color)' }}
                  title="Hapus"
                >
                  <Trash2 size={12} />
                </button>
                <a
                  href={app.drive_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                  style={{ fontSize: '11px', padding: '4px 8px' }}
                  title="Buka File Asli di Google Drive"
                >
                  <ExternalLink size={12} /> Drive
                </a>
              </div>

              {app.status === 'pending' ? (
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <button
                    onClick={() => handleDecision(app.id, 'approved')}
                    className="btn btn-primary"
                    style={{ fontSize: '11px', padding: '5px 10px' }}
                  >
                    <Check size={12} /> Setujui
                  </button>
                  <button
                    onClick={() => {
                      setActiveItem(app);
                      setFeedbackNote('');
                    }}
                    className="btn btn-secondary"
                    style={{ fontSize: '11px', padding: '5px 10px' }}
                  >
                    <MessageSquare size={12} /> Revisi
                  </button>
                </div>
              ) : (
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                  {app.reviewer}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Image Zoom Modal */}
      {previewImage && (
        <div className="modal-overlay" onClick={() => setPreviewImage(null)}>
          <div className="modal-content" style={{ maxWidth: '850px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '16px', fontWeight: 600 }}>{previewImage.title}</h3>
              <button onClick={() => setPreviewImage(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body" style={{ textAlign: 'center', backgroundColor: '#0f172a', padding: 'var(--space-4)' }}>
              <img 
                src={`https://lh3.googleusercontent.com/d/${previewImage.drive_id}`} 
                alt={previewImage.title}
                style={{ maxWidth: '100%', maxHeight: '65vh', objectFit: 'contain', borderRadius: '4px' }}
              />
            </div>
            <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
              <a 
                href={previewImage.drive_link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-secondary"
                style={{ fontSize: '12px' }}
              >
                <ExternalLink size={14} /> Buka Berkas Resolusi Penuh di Drive
              </a>
              <button onClick={() => setPreviewImage(null)} className="btn btn-primary" style={{ fontSize: '12px' }}>
                Tutup Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Item Modal */}
      {editingItem && (
        <div className="modal-overlay" onClick={() => setEditingItem(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Edit Data Materi Review</h3>
              <button onClick={() => setEditingItem(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Judul Materi *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={editingItem.title}
                    onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Proyek Terkait</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editingItem.project}
                    onChange={(e) => setEditingItem({ ...editingItem, project: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Divisi / Tim</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editingItem.division}
                    onChange={(e) => setEditingItem({ ...editingItem, division: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Google Drive File ID / URL</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editingItem.drive_id}
                    onChange={(e) => setEditingItem({ 
                      ...editingItem, 
                      drive_id: e.target.value,
                      drive_link: `https://drive.google.com/file/d/${e.target.value}/view`
                    })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setEditingItem(null)} className="btn btn-secondary">
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Feedback Modal */}
      {activeItem && (
        <div className="modal-overlay" onClick={() => setActiveItem(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Kirim Masukan & Revisi Desain</h3>
              <button onClick={() => setActiveItem(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
                Materi: <strong>{activeItem.title}</strong><br />
                Diajukan oleh: {activeItem.requested_by}
              </p>

              <div className="form-group">
                <label className="form-label">Catatan Revisi untuk Tim Kreator</label>
                <textarea
                  rows={4}
                  className="form-input"
                  placeholder="Contoh: Tolong sesuaikan ukuran logo dan perjelas kontras warna pada background..."
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
                Tolak
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
