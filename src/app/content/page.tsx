'use client';

import { useState } from 'react';
import { Plus, Image as ImageIcon, Video, FileText, Send, Calendar, CheckCircle2, X, Eye } from 'lucide-react';

interface ContentItem {
  id: string;
  title: string;
  channel: 'instagram' | 'youtube' | 'tiktok' | 'website' | 'newsletter';
  format: 'carousel' | 'video' | 'short_video' | 'article';
  status: 'draft' | 'in_production' | 'in_review' | 'approved' | 'published';
  scheduled_at: string;
  author: string;
  version: number;
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
  },
];

export default function ContentPage() {
  const [items, setItems] = useState<ContentItem[]>(initialContent);
  const [channelFilter, setChannelFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    channel: 'instagram' as any,
    format: 'carousel' as any,
    scheduled_at: '',
    author: 'Dewi Lestari',
  });

  const filtered = channelFilter === 'all'
    ? items
    : items.filter(i => i.channel === channelFilter);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    const newItem: ContentItem = {
      id: `c${Date.now()}`,
      title: form.title,
      channel: form.channel,
      format: form.format,
      status: 'draft',
      scheduled_at: form.scheduled_at || '2026-03-20',
      author: form.author,
      version: 1,
    };

    setItems([newItem, ...items]);
    setIsModalOpen(false);
    setForm({
      title: '',
      channel: 'instagram',
      format: 'carousel',
      scheduled_at: '',
      author: 'Dewi Lestari',
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
            Katalog dan tahapan publikasi konten editorial multi-kanal dari draft hingga tayang.
          </p>
        </div>

        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
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
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id}>
                <td>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                    {c.title}
                  </span>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal New Content */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Buat Rencana Konten Baru</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate}>
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
                    <label className="form-label">Penulis / Kreator</label>
                    <select
                      className="form-input"
                      value={form.author}
                      onChange={(e) => setForm({ ...form, author: e.target.value })}
                    >
                      <option value="Dewi Lestari">Dewi Lestari</option>
                      <option value="Reza Pratama">Reza Pratama</option>
                      <option value="Budi Wicaksono">Budi Wicaksono</option>
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
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  Jadwalkan Konten
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
