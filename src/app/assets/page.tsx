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
  FileCode
} from 'lucide-react';

interface Asset {
  id: string;
  name: string;
  drive_link: string;
  size_formatted: string;
  asset_type: 'logo' | 'document' | 'video' | 'template';
  unit: string;
  uploaded_by: string;
  uploaded_at: string;
}

const initialAssets: Asset[] = [
  {
    id: 'f0000000-0000-0000-0000-000000000001',
    name: '6102_Primary_Logo_Vector.svg',
    drive_link: 'https://drive.google.com/file/d/demo-vector-logo/view',
    size_formatted: '102 KB',
    asset_type: 'logo',
    unit: 'Brand & Visual Identity',
    uploaded_by: 'Budi Wicaksono',
    uploaded_at: '2026-02-20',
  },
  {
    id: 'f0000000-0000-0000-0000-000000000002',
    name: 'Brand_Guidelines_Booklet_2026.pdf',
    drive_link: 'https://drive.google.com/file/d/demo-brand-pdf/view',
    size_formatted: '5.2 MB',
    asset_type: 'document',
    unit: 'Brand & Visual Identity',
    uploaded_by: 'Budi Wicaksono',
    uploaded_at: '2026-02-22',
  },
  {
    id: 'f0000000-0000-0000-0000-000000000003',
    name: 'Teaser_Ramadhan_Cut_01.mp4',
    drive_link: 'https://drive.google.com/file/d/demo-video-cut/view',
    size_formatted: '80.0 MB',
    asset_type: 'video',
    unit: 'Motion Graphics & 3D Lab',
    uploaded_by: 'Reza Pratama',
    uploaded_at: '2026-02-26',
  },
  {
    id: 'f0000000-0000-0000-0000-000000000004',
    name: 'Social_Feed_Master_Template.psd',
    drive_link: 'https://drive.google.com/file/d/demo-psd-template/view',
    size_formatted: '42.0 MB',
    asset_type: 'template',
    unit: 'Digital Publishing',
    uploaded_by: 'Budi Wicaksono',
    uploaded_at: '2026-02-18',
  },
];

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [filterType, setFilterType] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [assetType, setAssetType] = useState<Asset['asset_type']>('document');
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

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      let driveLink = 'https://drive.google.com/drive';
      if (data.file && (data.file.webViewLink || data.file.id)) {
        driveLink = data.file.webViewLink || `https://drive.google.com/file/d/${data.file.id}/view`;
      }

      const formatSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
      };

      const newAsset: Asset = {
        id: `f${Date.now()}`,
        name: selectedFile.name,
        drive_link: driveLink,
        size_formatted: formatSize(selectedFile.size),
        asset_type: assetType,
        unit: 'Brand & Visual Identity',
        uploaded_by: 'Ahmad Fauzi (You)',
        uploaded_at: new Date().toISOString().split('T')[0],
      };

      setAssets([newAsset, ...assets]);
      setIsModalOpen(false);
      setSelectedFile(null);
    } catch (err: any) {
      setUploadError(err.message || 'Gagal mengunggah ke Google Drive');
    } finally {
      setIsUploading(false);
    }
  };

  const getAssetIcon = (type: Asset['asset_type']) => {
    switch (type) {
      case 'video': return <Video size={18} color="#2563eb" />;
      case 'logo': return <ImageIcon size={18} color="#059669" />;
      case 'template': return <FileCode size={18} color="#d97706" />;
      default: return <FileText size={18} color="#475569" />;
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-6)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: '4px' }}>
            <span className="status-pill status-active" style={{ fontSize: '11px', padding: '2px 8px' }}>
              <HardDrive size={12} /> Google Drive OAuth2 Connected
            </span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Digital Asset Management (DAM)
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Penyimpanan terpusat master aset visual, berkas video, dan panduan brand di akun Google Drive pribadi Anda.
          </p>
        </div>

        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
          <Upload size={16} /> Unggah Berkas ke Drive
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="filter-pills">
        {['all', 'logo', 'document', 'video', 'template'].map((t) => (
          <button
            key={t}
            className={`filter-pill ${filterType === t ? 'active' : ''}`}
            onClick={() => setFilterType(t)}
          >
            {t === 'all' ? 'Semua Berkas' : t.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Assets Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Nama Aset</th>
              <th>Kategori</th>
              <th>Ukuran</th>
              <th>Unit Pemilik</th>
              <th>Pengunggah</th>
              <th>Tanggal</th>
              <th style={{ textAlign: 'right' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => (
              <tr key={a.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    {getAssetIcon(a.asset_type)}
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      {a.name}
                    </span>
                  </div>
                </td>
                <td>
                  <span className="badge" style={{ textTransform: 'uppercase' }}>
                    {a.asset_type}
                  </span>
                </td>
                <td style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  {a.size_formatted}
                </td>
                <td style={{ fontSize: '13px' }}>
                  {a.unit}
                </td>
                <td style={{ fontSize: '13px' }}>
                  {a.uploaded_by}
                </td>
                <td style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  {a.uploaded_at}
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: 'var(--space-2)' }}>
                    <button
                      onClick={() => copyToClipboard(a.id, a.drive_link)}
                      className="btn btn-secondary"
                      style={{ fontSize: '11px', padding: '4px 8px' }}
                      title="Salin Link Google Drive"
                    >
                      {copiedId === a.id ? <Check size={12} color="#059669" /> : <Copy size={12} />}
                      {copiedId === a.id ? 'Tersalin' : 'Link'}
                    </button>
                    <a
                      href={a.drive_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary"
                      style={{ fontSize: '11px', padding: '4px 8px' }}
                      title="Buka di Google Drive"
                    >
                      <ExternalLink size={12} /> Buka
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => !isUploading && setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Unggah Berkas ke Akun Google Drive Pribadi</h3>
              <button 
                onClick={() => !isUploading && setIsModalOpen(false)} 
                style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
              >
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
                    Dukungan format: .PNG, .SVG, .PDF, .MP4, .PSD, .AI, .ZIP
                  </span>
                </div>

                <div className="form-group">
                  <label className="form-label">Kategori Aset Kreatif</label>
                  <select
                    className="form-input"
                    value={assetType}
                    onChange={(e) => setAssetType(e.target.value as any)}
                  >
                    <option value="logo">Logo & Identitas Visual</option>
                    <option value="document">Dokumen / PDF Panduan</option>
                    <option value="video">Rekaman Video & Motion</option>
                    <option value="template">Master Template Desain</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button 
                  type="button" 
                  disabled={isUploading} 
                  onClick={() => setIsModalOpen(false)} 
                  className="btn btn-secondary"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  disabled={isUploading || !selectedFile} 
                  className="btn btn-primary"
                >
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
