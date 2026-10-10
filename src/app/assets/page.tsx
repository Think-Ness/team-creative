'use client';

import { useState } from 'react';
import { 
  Upload, 
  FolderOpen, 
  FileText, 
  Image as ImageIcon, 
  Video, 
  ExternalLink, 
  Copy, 
  Check, 
  X, 
  HardDrive,
  FileCode,
  Edit3,
  Trash2,
  Eye
} from 'lucide-react';
import { usePersistentData } from '@/lib/usePersistentData';

interface Asset {
  id: string;
  name: string;
  drive_id?: string;
  drive_link: string;
  size_formatted: string;
  asset_type: 'logo' | 'document' | 'video' | 'template' | 'photo';
  unit: string;
  uploaded_by: string;
  uploaded_at: string;
}

const initialAssets: Asset[] = [
  {
    id: 'f001',
    name: 'Key Visual & Poster Ramadhan (Karya Desain 01)',
    drive_id: '11hIc4hsM-AfKwX_0nrCGNXv7G12Br8i8',
    drive_link: 'https://drive.google.com/file/d/11hIc4hsM-AfKwX_0nrCGNXv7G12Br8i8/view?usp=sharing',
    size_formatted: '2.4 MB',
    asset_type: 'photo',
    unit: 'Brand & Visual Identity',
    uploaded_by: 'Budi Wicaksono',
    uploaded_at: '2026-02-28',
  },
  {
    id: 'f002',
    name: 'Editorial Feed & Headline Typography (Karya Desain 02)',
    drive_id: '1HMsNgOkbZA_rl3NxshxFLEapHdI8UZvu',
    drive_link: 'https://drive.google.com/file/d/1HMsNgOkbZA_rl3NxshxFLEapHdI8UZvu/view?usp=sharing',
    size_formatted: '3.1 MB',
    asset_type: 'photo',
    unit: 'Digital Publishing & Copy',
    uploaded_by: 'Dewi Lestari',
    uploaded_at: '2026-02-28',
  },
  {
    id: 'f003',
    name: 'Mascot & Character Bandung Hub (Karya Desain 03)',
    drive_id: '1MjmEUVo6IXKyFY5QJBnjGuSih7Puj9yf',
    drive_link: 'https://drive.google.com/file/d/1MjmEUVo6IXKyFY5QJBnjGuSih7Puj9yf/view?usp=sharing',
    size_formatted: '4.8 MB',
    asset_type: 'photo',
    unit: 'Motion Graphics & 3D Lab',
    uploaded_by: 'Reza Pratama',
    uploaded_at: '2026-02-27',
  },
  {
    id: 'f004',
    name: 'Billboard Display & Standing Banner (Karya Desain 04)',
    drive_id: '1_MPbH-P3owSm0QLS11AwbWziF3nzBCJG',
    drive_link: 'https://drive.google.com/file/d/1_MPbH-P3owSm0QLS11AwbWziF3nzBCJG/view?usp=sharing',
    size_formatted: '5.2 MB',
    asset_type: 'photo',
    unit: 'Brand & Visual Identity',
    uploaded_by: 'Budi Wicaksono',
    uploaded_at: '2026-02-26',
  },
  {
    id: 'f005',
    name: 'Merchandise & Jersey Apparel Mockup (Karya Desain 05)',
    drive_id: '1tOM13LlNo_bj7iKXglvPrux_nA53Nq0z',
    drive_link: 'https://drive.google.com/file/d/1tOM13LlNo_bj7iKXglvPrux_nA53Nq0z/view?usp=sharing',
    size_formatted: '1.8 MB',
    asset_type: 'photo',
    unit: 'Motion Graphics & 3D Lab',
    uploaded_by: 'Reza Pratama',
    uploaded_at: '2026-02-25',
  },
  {
    id: 'f006',
    name: 'Brand_Guidelines_Booklet_2026.pdf',
    drive_link: 'https://drive.google.com/drive',
    size_formatted: '5.2 MB',
    asset_type: 'document',
    unit: 'Brand & Visual Identity',
    uploaded_by: 'Ahmad Fauzi',
    uploaded_at: '2026-02-22',
  },
];

export default function AssetsPage() {
  const { data: assets, addItem, updateItem, deleteItem } = usePersistentData<Asset>('assets', initialAssets);
  const [filterType, setFilterType] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<Asset | null>(null);

  // Upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [assetType, setAssetType] = useState<Asset['asset_type']>('photo');
  const [folderId, setFolderId] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const filtered = filterType === 'all'
    ? assets
    : assets.filter(a => a.asset_type === filterType);

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      if (folderId.trim()) {
        formData.append('folderId', folderId.trim());
      }

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      let driveLink = 'https://drive.google.com/drive';
      let driveId = '';
      if (data.file && (data.file.webViewLink || data.file.id)) {
        driveLink = data.file.webViewLink || `https://drive.google.com/file/d/${data.file.id}/view`;
        driveId = data.file.id || '';
      }

      const formatSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
      };

      const newAsset: Asset = {
        id: `f${Date.now()}`,
        name: selectedFile.name,
        drive_id: driveId,
        drive_link: driveLink,
        size_formatted: formatSize(selectedFile.size),
        asset_type: assetType,
        unit: 'Brand & Visual Identity',
        uploaded_by: 'Ahmad Fauzi (You)',
        uploaded_at: new Date().toISOString().split('T')[0],
      };

      addItem(newAsset);
      setIsModalOpen(false);
      setSelectedFile(null);
    } catch (err: any) {
      setUploadError(err.message || 'Gagal mengunggah ke Google Drive');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAsset) return;

    updateItem(editingAsset.id, editingAsset);
    setEditingAsset(null);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Hapus berkas "${name}"?`)) {
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
              <HardDrive size={12} /> Google Drive Personal OAuth2 Connected
            </span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Digital Asset Management (DAM)
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Galeri master berkas, karya desain yang di-review bersama, dan berkas panduan di Google Drive.
          </p>
        </div>

        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
          <Upload size={16} /> Unggah Berkas ke Drive
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="filter-pills">
        {['all', 'photo', 'document', 'logo', 'video', 'template'].map((t) => (
          <button
            key={t}
            className={`filter-pill ${filterType === t ? 'active' : ''}`}
            onClick={() => setFilterType(t)}
          >
            {t === 'all' ? 'Semua Berkas' : t === 'photo' ? 'Karya Desain' : t.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Assets Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
        {filtered.map((a) => (
          <div key={a.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {a.drive_id ? (
              <div 
                style={{ 
                  height: '160px', 
                  borderRadius: 'var(--radius-sm)', 
                  overflow: 'hidden', 
                  position: 'relative',
                  backgroundColor: '#f1f5f9',
                  cursor: 'pointer',
                  border: '1px solid var(--border-color)'
                }}
                onClick={() => setPreviewImage(a)}
              >
                <img 
                  src={`https://lh3.googleusercontent.com/d/${a.drive_id}`} 
                  alt={a.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ 
                  position: 'absolute', 
                  bottom: '6px', 
                  right: '6px',
                  background: 'rgba(15, 23, 42, 0.75)',
                  color: '#fff',
                  padding: '2px 6px',
                  borderRadius: '3px',
                  fontSize: '10px'
                }}>
                  Klik Perbesar
                </div>
              </div>
            ) : (
              <div style={{ 
                height: '100px', 
                borderRadius: 'var(--radius-sm)', 
                backgroundColor: '#f8fafc', 
                border: '1px dashed var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-secondary)'
              }}>
                <FileText size={32} />
              </div>
            )}

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="badge" style={{ fontSize: '10px', textTransform: 'uppercase' }}>
                  {a.asset_type}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                  {a.size_formatted}
                </span>
              </div>

              <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px', lineHeight: 1.3 }}>
                {a.name}
              </h4>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {a.unit} • Oleh {a.uploaded_by}
              </div>
            </div>

            <div style={{ 
              borderTop: '1px solid var(--border-color)', 
              paddingTop: 'var(--space-2)',
              marginTop: 'auto',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
                <button
                  onClick={() => setEditingAsset(a)}
                  className="btn btn-secondary"
                  style={{ fontSize: '11px', padding: '3px 6px' }}
                >
                  <Edit3 size={11} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(a.id, a.name)}
                  className="btn btn-secondary"
                  style={{ fontSize: '11px', padding: '3px 6px', color: 'var(--danger-color)' }}
                >
                  <Trash2 size={11} />
                </button>
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
                <button
                  onClick={() => copyToClipboard(a.id, a.drive_link)}
                  className="btn btn-secondary"
                  style={{ fontSize: '11px', padding: '3px 6px' }}
                >
                  {copiedId === a.id ? <Check size={11} color="#059669" /> : <Copy size={11} />}
                </button>
                <a
                  href={a.drive_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                  style={{ fontSize: '11px', padding: '3px 6px' }}
                >
                  <ExternalLink size={11} />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Image Zoom Modal */}
      {previewImage && (
        <div className="modal-overlay" onClick={() => setPreviewImage(null)}>
          <div className="modal-content" style={{ maxWidth: '850px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '16px', fontWeight: 600 }}>{previewImage.name}</h3>
              <button onClick={() => setPreviewImage(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body" style={{ textAlign: 'center', backgroundColor: '#0f172a', padding: 'var(--space-4)' }}>
              <img 
                src={`https://lh3.googleusercontent.com/d/${previewImage.drive_id}`} 
                alt={previewImage.name}
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
                <ExternalLink size={14} /> Buka di Google Drive Asli
              </a>
              <button onClick={() => setPreviewImage(null)} className="btn btn-primary" style={{ fontSize: '12px' }}>
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Asset Modal */}
      {editingAsset && (
        <div className="modal-overlay" onClick={() => setEditingAsset(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Edit Informasi Aset</h3>
              <button onClick={() => setEditingAsset(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Nama Berkas *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={editingAsset.name}
                    onChange={(e) => setEditingAsset({ ...editingAsset, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Unit Pemilik</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editingAsset.unit}
                    onChange={(e) => setEditingAsset({ ...editingAsset, unit: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Kategori</label>
                  <select
                    className="form-input"
                    value={editingAsset.asset_type}
                    onChange={(e) => setEditingAsset({ ...editingAsset, asset_type: e.target.value as any })}
                  >
                    <option value="photo">Karya Desain / Foto</option>
                    <option value="document">Dokumen / PDF</option>
                    <option value="logo">Logo & Identitas</option>
                    <option value="video">Video & Animasi</option>
                    <option value="template">Template Desain</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setEditingAsset(null)} className="btn btn-secondary">
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

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => !isUploading && setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Unggah Berkas ke Akun Google Drive Pribadi</h3>
              <button onClick={() => !isUploading && setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpload}>
              <div className="modal-body">
                {uploadError && (
                  <div style={{ padding: 'var(--space-3)', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 'var(--radius-sm)', color: '#991b1b', fontSize: '13px', marginBottom: 'var(--space-4)' }}>
                    {uploadError}
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Pilih Berkas dari Komputer *</label>
                  <input
                    type="file"
                    required
                    className="form-input"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  />
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Dukungan format: .PNG, .JPG, .SVG, .PDF, .MP4, .PSD, .AI, .ZIP
                  </span>
                </div>

                <div className="form-group">
                  <label className="form-label">Kategori Aset Kreatif</label>
                  <select
                    className="form-input"
                    value={assetType}
                    onChange={(e) => setAssetType(e.target.value as any)}
                  >
                    <option value="photo">Karya Desain / Foto Review</option>
                    <option value="logo">Logo & Identitas Visual</option>
                    <option value="document">Dokumen / PDF Panduan</option>
                    <option value="video">Rekaman Video & Motion</option>
                    <option value="template">Master Template Desain</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">ID Folder Google Drive Target (Opsional)</label>
                  <input
                    type="text"
                    placeholder="Contoh: 1B2c3D4e5F6g7H8i9J0kL..."
                    className="form-input"
                    value={folderId}
                    onChange={(e) => setFolderId(e.target.value)}
                  />
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Jika dikosongkan, file akan masuk ke root drive atau folder shared bawaan sistem.
                  </span>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" disabled={isUploading} onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                  Batal
                </button>
                <button type="submit" disabled={isUploading || !selectedFile} className="btn btn-primary">
                  {isUploading ? 'Sedang Mengunggah...' : 'Unggah ke Drive'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
