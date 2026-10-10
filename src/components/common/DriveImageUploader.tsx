'use client';

import { useState } from 'react';
import { UploadCloud, CheckCircle2, Image as ImageIcon, ExternalLink, X, Folder, AlertCircle } from 'lucide-react';

interface DriveImageUploaderProps {
  currentImageUrl?: string;
  onImageUploaded: (url: string, fileDetails?: any) => void;
  label?: string;
  defaultFolderId?: string;
}

export default function DriveImageUploader({
  currentImageUrl,
  onImageUploaded,
  label = 'Upload Gambar / File Deliverable (Google Drive)',
  defaultFolderId = '',
}: DriveImageUploaderProps) {
  const [folderId, setFolderId] = useState(defaultFolderId);
  const [showFolderInput, setShowFolderInput] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(currentImageUrl);
  const [uploadNote, setUploadNote] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setErrorMsg(null);
    setUploadNote(null);

    const formData = new FormData();
    formData.append('file', file);
    if (folderId.trim()) {
      formData.append('folderId', folderId.trim());
    }

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Gagal mengunggah file.');
      }

      const fileUrl = data.file?.thumbnailLink || data.file?.webViewLink || '';
      setPreviewUrl(fileUrl);
      if (data.note) {
        setUploadNote(data.note);
      }
      onImageUploaded(fileUrl, data.file);
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan saat upload.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreviewUrl(undefined);
    onImageUploaded('');
  };

  return (
    <div style={{ marginTop: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
        <label className="form-label" style={{ fontSize: '13px', fontWeight: 500, margin: 0 }}>
          {label}
        </label>
        <span style={{ fontSize: '11px', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <CheckCircle2 size={12} /> Auto-Sync ke Folder Majmu' 6102
        </span>
      </div>

      {errorMsg && (
        <div style={{ padding: '8px 12px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', color: '#991b1b', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
          <AlertCircle size={14} />
          <span>{errorMsg}</span>
        </div>
      )}

      {uploadNote && (
        <div style={{ padding: '6px 10px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px', color: '#1e40af', fontSize: '11px', marginBottom: '8px' }}>
          {uploadNote}
        </div>
      )}

      {previewUrl ? (
        <div style={{
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          padding: '10px',
          backgroundColor: '#f8fafc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
            {previewUrl.startsWith('data:') || previewUrl.includes('http') ? (
              <img
                src={previewUrl}
                alt="Preview"
                style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e2e8f0' }}
              />
            ) : (
              <ImageIcon size={32} color="#64748b" />
            )}
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={13} color="#10b981" /> File Terlampir
              </div>
              <a
                href={previewUrl}
                target="_blank"
                rel="noreferrer"
                style={{ fontSize: '11px', color: '#2563eb', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'underline' }}
              >
                Lihat File Asli di Tab Baru <ExternalLink size={10} />
              </a>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRemove}
            className="btn btn-secondary"
            style={{ fontSize: '11px', padding: '4px 8px', color: '#dc2626' }}
            title="Hapus lampiran"
          >
            <X size={12} style={{ marginRight: '4px' }} /> Hapus
          </button>
        </div>
      ) : (
        <label style={{
          border: '2px dashed var(--border-color)',
          borderRadius: '8px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          cursor: isUploading ? 'not-allowed' : 'pointer',
          backgroundColor: isUploading ? '#f1f5f9' : '#ffffff',
          transition: 'border-color 0.15s ease',
        }}>
          <UploadCloud size={24} color="#64748b" />
          <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>
            {isUploading ? 'Sedang Mengunggah ke Google Drive...' : 'Klik untuk Pilih & Upload Gambar'}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            Mendukung PNG, JPG, WebP, SVG, GIF (Maks 15MB)
          </div>
          <input
            type="file"
            accept="image/*,application/pdf,video/*"
            disabled={isUploading}
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </label>
      )}
    </div>
  );
}
