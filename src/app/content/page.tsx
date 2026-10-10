'use client';

import { useState } from 'react';
import { 
  Plus, 
  Image as ImageIcon, 
  Video, 
  FileText, 
  Send, 
  Calendar, 
  CheckCircle2, 
  X, 
  Edit3, 
  Trash2, 
  ExternalLink,
  Eye,
  Copy,
  Check,
  MessageSquare,
  Sparkles,
  Link as LinkIcon
} from 'lucide-react';
import { usePersistentData } from '@/lib/usePersistentData';
import DriveImageUploader from '@/components/common/DriveImageUploader';

interface ContentItem {
  id: string;
  title: string;
  channel: 'instagram' | 'youtube' | 'tiktok' | 'website' | 'newsletter';
  format: 'carousel' | 'video' | 'short_video' | 'article';
  status: 'draft' | 'in_production' | 'in_review' | 'approved' | 'published';
  scheduled_at: string;
  author: string;
  version: number;
  image_url?: string;
  caption?: string;
  task_ref?: string;
  qc_notes?: string;
}

const initialContent: ContentItem[] = [
  {
    id: 'c1000000-0000-0000-0000-000000000001',
    title: 'Carousel IG: 5 Prinsip Visual Design 6102',
    channel: 'instagram',
    format: 'carousel',
    status: 'published',
    scheduled_at: '2026-02-15',
    author: 'Dewi Lestari',
    version: 2,
    caption: 'Menyatukan karakter dan potensi seluruh kampus ke dalam satu harmoni visual. Simak 5 prinsip desain yang menjadi fondasi 6102 Creative System! #6102Creative #OneDirection',
    task_ref: 'Finalisasi Color Palette & Typography Tokens (Figma)',
    qc_notes: 'Layout dan typography sudah sesuai standar brand guidelines.',
  },
  {
    id: 'c1000000-0000-0000-0000-000000000002',
    title: 'Video Teaser: Sambut Cahaya Ramadhan 1448H',
    channel: 'youtube',
    format: 'video',
    status: 'in_review',
    scheduled_at: '2026-03-10',
    author: 'Reza Pratama',
    version: 1,
    caption: 'Sebuah refleksi karya kolaborasi lintas kampus menyambut bulan suci Ramadhan. Saksikan tayangan perdana serial Behind The Canvas!',
    task_ref: 'Storyboard & Animatic Teaser Ramadhan 30 Detik',
    qc_notes: 'Tone audio intro perlu dinaikkan +1.5dB agar vokal narator lebih tegas.',
  },
  {
    id: 'c1000000-0000-0000-0000-000000000003',
    title: 'Shorts/Reels: Behind The Design Process',
    channel: 'tiktok',
    format: 'short_video',
    status: 'approved',
    scheduled_at: '2026-03-04',
    author: 'Reza Pratama',
    version: 1,
    caption: 'Bocoran dapur kreatif kita saat merancang logo panggung gembira! Gimana menurut kalian? Drop comment di bawah! 👇🔥',
    task_ref: 'Export Vector Logo Asset Kit (.SVG, .EPS, .PNG)',
  },
  {
    id: 'c1000000-0000-0000-0000-000000000004',
    title: 'Artikel Web: Identitas Baru 6102 Creative Network',
    channel: 'website',
    format: 'article',
    status: 'draft',
    scheduled_at: '2026-03-15',
    author: 'Dewi Lestari',
    version: 1,
    caption: 'Dokumentasi komprehensif mengenai peluncuran ekosistem digital dan alur kerja kurasi terpusat 6102 Creative System.',
    task_ref: 'Draft Copywriting 10 Carousel Tren Desain AI',
  },
];

export default function ContentPage() {
  const { data: items, addItem, updateItem, deleteItem } = usePersistentData<ContentItem>('content', initialContent);
  const { data: tasks } = usePersistentData<any>('tasks', []);
  const [channelFilter, setChannelFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);

  // Review & Detail Modal
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [qcNoteInput, setQcNoteInput] = useState('');

  const [form, setForm] = useState({
    title: '',
    channel: 'instagram' as any,
    format: 'carousel' as any,
    status: 'draft' as any,
    scheduled_at: '',
    author: 'Dewi Lestari',
    version: 1,
    image_url: '',
    caption: '',
    task_ref: '',
  });

  const filtered = channelFilter === 'all'
    ? items
    : items.filter(i => i.channel === channelFilter);

  const handleCreateOrUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    if (editingItem) {
      updateItem(editingItem.id, {
        title: form.title,
        channel: form.channel,
        format: form.format,
        status: form.status,
        scheduled_at: form.scheduled_at || editingItem.scheduled_at,
        author: form.author,
        version: Number(form.version) || editingItem.version,
        image_url: form.image_url,
        caption: form.caption,
        task_ref: form.task_ref,
      });
      setEditingItem(null);
    } else {
      const newItem: ContentItem = {
        id: `c${Date.now()}`,
        title: form.title,
        channel: form.channel,
        format: form.format,
        status: form.status,
        scheduled_at: form.scheduled_at || '2026-03-20',
        author: form.author,
        version: 1,
        image_url: form.image_url,
        caption: form.caption,
        task_ref: form.task_ref,
      };
      addItem(newItem);
    }

    setIsModalOpen(false);
    resetForm();
  };

  const handleSaveQcNote = (contentId: string) => {
    updateItem(contentId, { qc_notes: qcNoteInput });
    if (selectedContent && selectedContent.id === contentId) {
      setSelectedContent({ ...selectedContent, qc_notes: qcNoteInput });
    }
  };

  const startEdit = (item: ContentItem) => {
    setEditingItem(item);
    setForm({
      title: item.title,
      channel: item.channel,
      format: item.format,
      status: item.status,
      scheduled_at: item.scheduled_at,
      author: item.author,
      version: item.version,
      image_url: item.image_url || '',
      caption: item.caption || '',
      task_ref: item.task_ref || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Hapus materi konten "${title}"?`)) {
      deleteItem(id);
    }
  };

  const resetForm = () => {
    setForm({
      title: '',
      channel: 'instagram',
      format: 'carousel',
      status: 'draft',
      scheduled_at: '',
      author: 'Dewi Lestari',
      version: 1,
      image_url: '',
      caption: '',
      task_ref: '',
    });
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-6)' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Content Production Pipeline
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Katalog dan tahapan publikasi konten editorial multi-kanal. Seluruh data dapat disunting dan disesuaikan.
          </p>
        </div>

        <button 
          onClick={() => {
            setEditingItem(null);
            resetForm();
            setIsModalOpen(true);
          }} 
          className="btn btn-primary"
        >
          <Plus size={16} /> Konten Baru
        </button>
      </div>

      {/* Channel Filters */}
      <div className="filter-pills">
        {['all', 'instagram', 'youtube', 'tiktok', 'website'].map((ch) => (
          <button
            key={ch}
            className={`filter-pill ${channelFilter === ch ? 'active' : ''}`}
            onClick={() => setChannelFilter(ch)}
          >
            {ch === 'all' ? 'Semua Kanal' : ch.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Content Table Container */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Judul Konten</th>
              <th>Kanal</th>
              <th>Format</th>
              <th>Status</th>
              <th>Versi</th>
              <th>Jadwal Rilis</th>
              <th>Kreator</th>
              <th style={{ textAlign: 'right' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr 
                key={c.id}
                onClick={() => { setSelectedContent(c); setQcNoteInput(c.qc_notes || ''); }}
                style={{ cursor: 'pointer' }}
              >
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {c.image_url && (
                      <img src={c.image_url} alt={c.title} style={{ width: '36px', height: '36px', borderRadius: '4px', objectFit: 'cover', border: '1px solid #e2e8f0' }} />
                    )}
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        {c.title}
                      </div>
                      {c.task_ref && (
                        <div style={{ fontSize: '11px', color: '#1d4ed8' }}>
                          Terkait: {c.task_ref}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td>
                  <span className="badge" style={{ textTransform: 'capitalize' }}>
                    {c.channel}
                  </span>
                </td>
                <td style={{ textTransform: 'capitalize', color: 'var(--text-secondary)', fontSize: '13px' }}>
                  {c.format.replace('_', ' ')}
                </td>
                <td>
                  <span className={`status-pill status-${c.status}`}>
                    {c.status.replace('_', ' ')}
                  </span>
                </td>
                <td style={{ fontFamily: 'monospace', fontSize: '12px' }}>
                  v{c.version}.0
                </td>
                <td style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  {c.scheduled_at}
                </td>
                <td style={{ fontSize: '13px' }}>
                  {c.author}
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: 'var(--space-1)' }} onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => { setSelectedContent(c); setQcNoteInput(c.qc_notes || ''); }}
                      className="btn btn-secondary"
                      style={{ fontSize: '11px', padding: '3px 6px', display: 'flex', alignItems: 'center', gap: '3px' }}
                    >
                      <Eye size={11} /> Review
                    </button>
                    <button
                      onClick={() => startEdit(c)}
                      className="btn btn-secondary"
                      style={{ fontSize: '11px', padding: '3px 6px' }}
                    >
                      <Edit3 size={11} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(c.id, c.title)}
                      className="btn btn-secondary"
                      style={{ fontSize: '11px', padding: '3px 6px', color: 'var(--danger-color)' }}
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal New / Edit Content */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '16px', fontWeight: 600 }}>
                {editingItem ? 'Edit Materi Konten' : 'Buat Rencana Konten Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateOrUpdate}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Judul / Topik Konten *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Tips Typography 101 untuk Desainer"
                    className="form-input"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <LinkIcon size={13} /> Terhubung dengan Tugas Kanban (Opsional)
                  </label>
                  <select
                    className="form-input"
                    value={form.task_ref}
                    onChange={(e) => {
                      const selectedT = tasks.find((t: any) => t.title === e.target.value);
                      if (selectedT) {
                        setForm({
                          ...form,
                          task_ref: selectedT.title,
                          title: form.title || selectedT.title,
                          author: selectedT.assignee || form.author,
                          image_url: form.image_url || selectedT.image_url || '',
                        });
                      } else {
                        setForm({ ...form, task_ref: e.target.value });
                      }
                    }}
                  >
                    <option value="">-- Tanpa Kaitan Tugas --</option>
                    {tasks.map((t: any) => (
                      <option key={t.id} value={t.title}>
                        {t.title} ({t.assignee} - {t.project || 'Umum'})
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                  <div className="form-group">
                    <label className="form-label">Kanal Distribusi</label>
                    <select
                      className="form-input"
                      value={form.channel}
                      onChange={(e) => setForm({ ...form, channel: e.target.value as any })}
                    >
                      <option value="instagram">Instagram</option>
                      <option value="youtube">YouTube</option>
                      <option value="tiktok">TikTok</option>
                      <option value="website">Website / Blog</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Format Media</label>
                    <select
                      className="form-input"
                      value={form.format}
                      onChange={(e) => setForm({ ...form, format: e.target.value as any })}
                    >
                      <option value="carousel">Carousel Post</option>
                      <option value="video">Long Video</option>
                      <option value="short_video">Shorts / Reels</option>
                      <option value="article">Artikel Teks</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select
                      className="form-input"
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                    >
                      <option value="draft">Draft</option>
                      <option value="in_production">In Production</option>
                      <option value="in_review">In Review</option>
                      <option value="approved">Approved</option>
                      <option value="published">Published</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Nomor Versi</label>
                    <input
                      type="number"
                      min={1}
                      className="form-input"
                      value={form.version}
                      onChange={(e) => setForm({ ...form, version: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                  <div className="form-group">
                    <label className="form-label">Penulis / Kreator</label>
                    <select
                      className="form-input"
                      value={form.author}
                      onChange={(e) => setForm({ ...form, author: e.target.value })}
                    >
                      <option value="Dewi Lestari">Dewi Lestari</option>
                      <option value="Reza Pratama">Reza Pratama</option>
                      <option value="Budi Wicaksono">Budi Wicaksono</option>
                      <option value="Siti Sarah">Siti Sarah</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Jadwal Target Rilis</label>
                    <input
                      type="date"
                      className="form-input"
                      value={form.scheduled_at}
                      onChange={(e) => setForm({ ...form, scheduled_at: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Naskah Copywriting & Caption Media Sosial</label>
                  <textarea
                    rows={3}
                    placeholder="Tuliskan hook headline, narasi konten, dan tagar resmi..."
                    className="form-input"
                    value={form.caption}
                    onChange={(e) => setForm({ ...form, caption: e.target.value })}
                  />
                </div>

                <DriveImageUploader
                  label="Upload Gambar / Desain Cover Konten (Google Drive)"
                  currentImageUrl={form.image_url}
                  onImageUploaded={(url) => setForm({ ...form, image_url: url })}
                />
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingItem ? 'Simpan Perubahan' : 'Jadwalkan Konten'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Content Review & Deliverable Modal */}
      {selectedContent && (
        <div className="modal-overlay" onClick={() => setSelectedContent(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '750px', width: '90%' }}>
            <div className="modal-header">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span className="badge" style={{ textTransform: 'capitalize' }}>
                    {selectedContent.channel} • {selectedContent.format.replace('_', ' ')}
                  </span>
                  <span className={`status-pill status-${selectedContent.status}`}>
                    {selectedContent.status.replace('_', ' ').toUpperCase()}
                  </span>
                  <span style={{ fontFamily: 'monospace', fontSize: '11px', color: 'var(--text-muted)' }}>
                    v{selectedContent.version}.0
                  </span>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {selectedContent.title}
                </h3>
              </div>
              <button onClick={() => setSelectedContent(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              {/* Media Preview (Photo or Drive Video Embed) */}
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {selectedContent.format === 'video' || selectedContent.format === 'short_video' ? (
                    <Video size={14} />
                  ) : (
                    <ImageIcon size={14} />
                  )}
                  Hasil Produksi / Media Review
                </label>

                {selectedContent.image_url ? (
                  <div style={{ 
                    borderRadius: '6px', 
                    overflow: 'hidden', 
                    border: '1px solid var(--border-color)', 
                    backgroundColor: '#000',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}>
                    {selectedContent.image_url.includes('drive.google.com') ? (
                      <iframe
                        src={selectedContent.image_url.replace('/view?usp=sharing', '/preview').replace('/view', '/preview')}
                        style={{ width: '100%', height: '340px', border: 'none' }}
                        allow="autoplay"
                        title={selectedContent.title}
                      />
                    ) : (
                      <img 
                        src={selectedContent.image_url} 
                        alt={selectedContent.title} 
                        style={{ maxHeight: '340px', width: '100%', objectFit: 'contain' }} 
                      />
                    )}

                    <div style={{ 
                      width: '100%', 
                      padding: '8px 12px', 
                      backgroundColor: 'var(--surface-color)', 
                      borderTop: '1px solid var(--border-color)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                        Google Drive Media Deliverable
                      </span>
                      <a 
                        href={selectedContent.image_url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="btn btn-secondary"
                        style={{ fontSize: '11px', padding: '3px 8px', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <ExternalLink size={12} /> Buka di Drive
                      </a>
                    </div>
                  </div>
                ) : (
                  <div style={{ 
                    padding: '20px', 
                    textAlign: 'center', 
                    backgroundColor: '#f8fafc', 
                    borderRadius: '6px', 
                    border: '1px dashed var(--border-color)',
                    color: 'var(--text-secondary)',
                    fontSize: '12px'
                  }}>
                    Belum ada media foto/video yang diunggah untuk konten ini.
                  </div>
                )}

                <div style={{ marginTop: '8px' }}>
                  <DriveImageUploader
                    label="Unggah / Ganti Media Konten (Google Drive)"
                    currentImageUrl={selectedContent.image_url}
                    onImageUploaded={(url) => {
                      updateItem(selectedContent.id, { image_url: url });
                      setSelectedContent({ ...selectedContent, image_url: url });
                    }}
                  />
                </div>
              </div>

              {/* Creator & Schedule Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                <div style={{ padding: '10px', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Kreator / Penulis</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>{selectedContent.author}</div>
                </div>
                <div style={{ padding: '10px', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Jadwal Rilis</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>{selectedContent.scheduled_at}</div>
                </div>
                <div style={{ padding: '10px', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Terkait Tugas</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#1d4ed8', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {selectedContent.task_ref || 'Non-Task'}
                  </div>
                </div>
              </div>

              {/* Caption Section */}
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label className="form-label" style={{ marginBottom: 0 }}>Naskah Copywriting & Caption Publikasi</label>
                  {selectedContent.caption && (
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(selectedContent.caption || '');
                        setCopiedCaption(true);
                        setTimeout(() => setCopiedCaption(false), 2000);
                      }}
                      className="btn btn-secondary"
                      style={{ fontSize: '11px', padding: '2px 8px', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      {copiedCaption ? <Check size={12} color="#059669" /> : <Copy size={12} />}
                      {copiedCaption ? 'Tersalin!' : 'Salin Caption'}
                    </button>
                  )}
                </div>
                <div style={{ 
                  fontSize: '13px', 
                  lineHeight: 1.6, 
                  color: 'var(--text-primary)', 
                  backgroundColor: 'var(--surface-color)', 
                  padding: '12px', 
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  whiteSpace: 'pre-wrap'
                }}>
                  {selectedContent.caption || 'Belum ada naskah caption ditulis.'}
                </div>
              </div>

              {/* QC Feedback Section */}
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MessageSquare size={14} /> Catatan Telaah Kurasi / QC Notes
                </label>
                <textarea
                  rows={2}
                  className="form-input"
                  placeholder="Tuliskan evaluasi kualitas visual, audio, atau narasi..."
                  value={qcNoteInput}
                  onChange={(e) => setQcNoteInput(e.target.value)}
                  style={{ marginBottom: '6px' }}
                />
                <button
                  type="button"
                  onClick={() => handleSaveQcNote(selectedContent.id)}
                  className="btn btn-secondary"
                  style={{ fontSize: '11px', padding: '4px 10px' }}
                >
                  Simpan Catatan QC
                </button>
              </div>

              {/* Status Workflow Action */}
              <div>
                <label className="form-label">Alur Status Konten</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {(['draft', 'in_production', 'in_review', 'approved', 'published'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => {
                        updateItem(selectedContent.id, { status: st });
                        setSelectedContent({ ...selectedContent, status: st });
                      }}
                      className={`btn ${selectedContent.status === st ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ fontSize: '11px', padding: '4px 10px', textTransform: 'capitalize' }}
                    >
                      {st.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => {
                    const cToEdit = selectedContent;
                    setSelectedContent(null);
                    startEdit(cToEdit);
                  }}
                  className="btn btn-secondary"
                  style={{ fontSize: '12px' }}
                >
                  <Edit3 size={13} /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleDelete(selectedContent.id, selectedContent.title);
                    setSelectedContent(null);
                  }}
                  className="btn btn-secondary"
                  style={{ fontSize: '12px', color: 'var(--danger-color)' }}
                >
                  <Trash2 size={13} /> Hapus
                </button>
              </div>

              <button
                type="button"
                onClick={() => setSelectedContent(null)}
                className="btn btn-primary"
                style={{ fontSize: '12px' }}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
