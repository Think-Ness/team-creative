'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Filter, Check, X, ArrowRight, DollarSign, Users, Clock, Edit3, Trash2, ExternalLink } from 'lucide-react';
import { usePersistentData } from '@/lib/usePersistentData';
import DriveImageUploader from '@/components/common/DriveImageUploader';

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
  image_url?: string;
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
  const router = useRouter();
  const { data: ideas, addItem, updateItem, deleteItem } = usePersistentData<Idea>('requests', initialIdeas);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIdea, setEditingIdea] = useState<Idea | null>(null);

  const [form, setForm] = useState({
    title: '',
    description: '',
    target_audience: '',
    estimated_budget: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    status: 'submitted' as any,
    image_url: '',
  });

  const filteredIdeas = filterStatus === 'all' 
    ? ideas 
    : ideas.filter((i) => i.status === filterStatus);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    if (editingIdea) {
      updateItem(editingIdea.id, {
        title: form.title,
        description: form.description,
        target_audience: form.target_audience || editingIdea.target_audience,
        estimated_budget: Number(form.estimated_budget) || 0,
        priority: form.priority,
        status: form.status,
        image_url: form.image_url,
      });
      setEditingIdea(null);
    } else {
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
        image_url: form.image_url,
      };
      addItem(newIdea);
    }

    setIsModalOpen(false);
    resetForm();
  };

  const startEdit = (idea: Idea) => {
    setEditingIdea(idea);
    setForm({
      title: idea.title,
      description: idea.description,
      target_audience: idea.target_audience,
      estimated_budget: String(idea.estimated_budget),
      priority: idea.priority,
      status: idea.status,
      image_url: idea.image_url || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Hapus usulan ide "${title}"?`)) {
      deleteItem(id);
    }
  };

  const resetForm = () => {
    setForm({
      title: '',
      description: '',
      target_audience: '',
      estimated_budget: '',
      priority: 'medium',
      status: 'submitted',
      image_url: '',
    });
  };

  const updateStatus = (id: string, newStatus: Idea['status']) => {
    updateItem(id, { status: newStatus });
  };

  const handleConvertToProject = (idea: Idea) => {
    try {
      const storageKey = '6102_projects_data';
      let existingProjects: any[] = [];
      const saved = typeof window !== 'undefined' ? localStorage.getItem(storageKey) : null;
      if (saved) {
        try {
          existingProjects = JSON.parse(saved);
        } catch {
          existingProjects = [];
        }
      }

      // Check if project already exists
      const existing = existingProjects.find((p: any) => p.name.toLowerCase() === idea.title.toLowerCase());
      if (existing) {
        router.push('/projects');
        return;
      }

      const newProjectId = `p${Date.now()}`;
      const newProject = {
        id: newProjectId,
        name: idea.title,
        code: `PRJ-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
        description: idea.description,
        status: 'planning',
        priority: idea.priority || 'medium',
        start_date: new Date().toISOString().split('T')[0],
        due_date: new Date(Date.now() + 21 * 86400000).toISOString().split('T')[0],
        campus: 'Kampus Utama Jakarta',
        unit: 'Brand & Visual Identity',
        pm: idea.submitted_by || 'Ahmad Fauzi',
        progress: 0,
        image_url: idea.image_url,
      };

      const updated = [newProject, ...existingProjects];
      if (typeof window !== 'undefined') {
        localStorage.setItem(storageKey, JSON.stringify(updated));
        window.dispatchEvent(new Event('storage'));
      }

      router.push(`/projects?created_id=${newProjectId}`);
    } catch (err) {
      console.error('Failed to convert to project:', err);
      router.push('/projects');
    }
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

        <button 
          onClick={() => {
            setEditingIdea(null);
            resetForm();
            setIsModalOpen(true);
          }} 
          className="btn btn-primary"
        >
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

                {idea.image_url && (
                  <div style={{ marginTop: '8px', marginBottom: '8px', borderRadius: '6px', overflow: 'hidden', maxWidth: '280px', maxHeight: '160px', backgroundColor: '#f1f5f9' }}>
                    <img src={idea.image_url} alt={idea.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '12px', color: '#059669', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Check size={14} /> Disetujui
                    </span>
                    <button 
                      onClick={() => handleConvertToProject(idea)}
                      className="btn btn-primary"
                      style={{ fontSize: '11px', padding: '5px 12px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
                    >
                      <span>Lanjut: Jadi Proyek</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Metadata Footer & Edit Bar */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '1px solid var(--border-color)',
              paddingTop: 'var(--space-2)',
              marginTop: 'var(--space-1)'
            }}>
              <div style={{ display: 'flex', gap: 'var(--space-4)', fontSize: '12px', color: 'var(--text-secondary)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Users size={13} /> Sasaran: {idea.target_audience}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <DollarSign size={13} /> Rp {idea.estimated_budget.toLocaleString('id-ID')}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={13} /> {idea.submitted_by} ({idea.created_at})
                </span>
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <button
                  onClick={() => startEdit(idea)}
                  className="btn btn-secondary"
                  style={{ fontSize: '11px', padding: '3px 8px' }}
                >
                  <Edit3 size={11} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(idea.id, idea.title)}
                  className="btn btn-secondary"
                  style={{ fontSize: '11px', padding: '3px 8px', color: 'var(--danger-color)' }}
                >
                  <Trash2 size={11} /> Hapus
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New / Edit Idea Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '16px', fontWeight: 600 }}>
                {editingIdea ? 'Edit Usulan Ide Kreatif' : 'Formulir Usulan Ide Kreatif'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
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

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
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

                  <div className="form-group">
                    <label className="form-label">Status Usulan</label>
                    <select
                      className="form-input"
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                    >
                      <option value="draft">Draft</option>
                      <option value="submitted">Submitted</option>
                      <option value="under_review">Under Review</option>
                      <option value="accepted">Accepted</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                <DriveImageUploader
                  label="Upload Contoh Visual / Moodboard Referensi (Google Drive)"
                  currentImageUrl={form.image_url}
                  onImageUploaded={(url) => setForm({ ...form, image_url: url })}
                />
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingIdea ? 'Simpan Perubahan' : 'Kirim Usulan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
