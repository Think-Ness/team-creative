'use client';

import { useState } from 'react';
import { Plus, Filter, Sparkles, Check, X, ArrowRight, DollarSign, Users, Clock } from 'lucide-react';

interface Idea {
  id: string;
  title: string;
  description: string;
  target_audience: string;
  estimated_budget: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'draft' | 'submitted' | 'under_review' | 'accepted' | 'rejected';
  submitted_by: string;
  created_at: string;
}

const initialIdeas: Idea[] = [
  {
    id: 'i0000000-0000-0000-0000-000000000001',
    title: 'Revamp Visual Identity 6102 (2026 Edition)',
    description: 'Pembaruan panduan warna, tipografi, dan aset digital terpadu untuk semua kampus.',
    target_audience: 'Seluruh sivitas akademika & mitra eksternal',
    estimated_budget: 15000000,
    priority: 'high',
    status: 'accepted',
    submitted_by: 'Ahmad Fauzi',
    created_at: '2026-02-01',
  },
  {
    id: 'i0000000-0000-0000-0000-000000000002',
    title: 'Mini Seri Podcast: Behind the Canvas',
    description: 'Podcast audio visual 6 episode mewawancarai talenta dan mahasiswa kreatif lintas kampus.',
    target_audience: 'Mahasiswa & Gen Z Kreatif',
    estimated_budget: 7500000,
    priority: 'medium',
    status: 'under_review',
    submitted_by: 'Dewi Lestari',
    created_at: '2026-02-10',
  },
  {
    id: 'i0000000-0000-0000-0000-000000000003',
    title: 'Motion Graphics Ramadhan 1448H',
    description: 'Paket animasi ucapan, bumper video, dan lower-thirds bernuansa islami kontemporer.',
    target_audience: 'Komunitas & Publik Media Sosial',
    estimated_budget: 5000000,
    priority: 'urgent',
    status: 'accepted',
    submitted_by: 'Siti Sarah',
    created_at: '2026-02-12',
  },
  {
    id: 'i0000000-0000-0000-0000-000000000004',
    title: 'Virtual 3D Interactive Campus Showcase',
    description: 'Aplikasi web 3D eksplorasi fasilitas kampus karya unit kreatif Bandung & Surabaya.',
    target_audience: 'Calon Mahasiswa Baru & Pengunjung Web',
    estimated_budget: 20000000,
    priority: 'low',
    status: 'submitted',
    submitted_by: 'Reza Pratama',
    created_at: '2026-02-18',
  },
];

export default function RequestsPage() {
  const [ideas, setIdeas] = useState<Idea[]>(initialIdeas);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    target_audience: '',
    estimated_budget: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
  });

  const filteredIdeas = filterStatus === 'all' 
    ? ideas 
    : ideas.filter((i) => i.status === filterStatus);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    const newIdea: Idea = {
      id: `i${Date.now()}`,
      title: form.title,
      description: form.description,
      target_audience: form.target_audience || 'Publik Kampus',
      estimated_budget: Number(form.estimated_budget) || 0,
      priority: form.priority,
      status: 'submitted',
      submitted_by: 'Ahmad Fauzi (You)',
      created_at: new Date().toISOString().split('T')[0],
    };

    setIdeas([newIdea, ...ideas]);
    setIsModalOpen(false);
    setForm({
      title: '',
      description: '',
      target_audience: '',
      estimated_budget: '',
      priority: 'medium',
    });
  };

  const updateStatus = (id: string, newStatus: Idea['status']) => {
    setIdeas(ideas.map(item => item.id === id ? { ...item, status: newStatus } : item));
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-6)' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Creative Requests & Ideas
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Usulan inisiatif kreatif baru dari seluruh unit dan kampus sebelum dikonversi menjadi proyek resmi.
          </p>
        </div>

        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
          <Plus size={16} /> Ajukan Ide Baru
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="filter-pills">
        {['all', 'submitted', 'under_review', 'accepted', 'rejected'].map((st) => (
          <button
            key={st}
            className={`filter-pill ${filterStatus === st ? 'active' : ''}`}
            onClick={() => setFilterStatus(st)}
          >
            {st === 'all' ? 'Semua Usulan' : st.replace('_', ' ').toUpperCase()}
          </button>
        ))}
      </div>

      {/* Requests List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {filteredIdeas.map((idea) => (
          <div key={idea.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {idea.title}
                  </h3>
                  <span className={`status-pill status-${idea.status}`}>
                    {idea.status.replace('_', ' ')}
                  </span>
                  <span className="badge" style={{ textTransform: 'uppercase', fontSize: '10px' }}>
                    {idea.priority}
                  </span>
                </div>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  {idea.description}
                </p>
              </div>

              {/* Status Action Buttons */}
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                {idea.status === 'submitted' && (
                  <button 
                    onClick={() => updateStatus(idea.id, 'under_review')}
                    className="btn btn-secondary" 
                    style={{ fontSize: '12px', padding: '4px 10px' }}
                  >
                    Mulai Telaah
                  </button>
                )}
                {idea.status === 'under_review' && (
                  <>
                    <button 
                      onClick={() => updateStatus(idea.id, 'accepted')}
                      className="btn btn-primary" 
                      style={{ fontSize: '12px', padding: '4px 10px' }}
                    >
                      <Check size={14} /> Setujui
                    </button>
                    <button 
                      onClick={() => updateStatus(idea.id, 'rejected')}
                      className="btn btn-secondary" 
                      style={{ fontSize: '12px', padding: '4px 10px', color: 'var(--danger-color)' }}
                    >
                      <X size={14} /> Tolak
                    </button>
                  </>
                )}
                {idea.status === 'accepted' && (
                  <span style={{ fontSize: '12px', color: '#059669', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Check size={14} /> Siap Di-convert ke Proyek
                  </span>
                )}
              </div>
            </div>

            {/* Metadata Footer */}
            <div style={{ 
              display: 'flex', 
              gap: 'var(--space-6)', 
              fontSize: '12px', 
              color: 'var(--text-secondary)',
              borderTop: '1px solid var(--border-color)',
              paddingTop: 'var(--space-2)',
              marginTop: 'var(--space-1)'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Users size={13} /> Sasaran: {idea.target_audience}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <DollarSign size={13} /> Estimasi: Rp {idea.estimated_budget.toLocaleString('id-ID')}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={13} /> Diajukan oleh: {idea.submitted_by} ({idea.created_at})
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* New Idea Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Formulir Usulan Ide Kreatif</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Judul Usulan / Inisiatif *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Kampanye Video Profil Kampus 2026"
                    className="form-input"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Deskripsi & Ruang Lingkup *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Jelaskan tujuan dan output kreatif yang diharapkan..."
                    className="form-input"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                  <div className="form-group">
                    <label className="form-label">Target Audiens</label>
                    <input
                      type="text"
                      placeholder="Mahasiswa / Publik"
                      className="form-input"
                      value={form.target_audience}
                      onChange={(e) => setForm({ ...form, target_audience: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Estimasi Anggaran (IDR)</label>
                    <input
                      type="number"
                      placeholder="5000000"
                      className="form-input"
                      value={form.estimated_budget}
                      onChange={(e) => setForm({ ...form, estimated_budget: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Prioritas</label>
                  <select
                    className="form-input"
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value as any })}
                  >
                    <option value="low">Rendah (Low)</option>
                    <option value="medium">Sedang (Medium)</option>
                    <option value="high">Tinggi (High)</option>
                    <option value="urgent">Mendesak (Urgent)</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  Kirim Usulan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
