'use client';

import { useState } from 'react';
import { Plus, FolderOpen, Calendar, User, CheckCircle2, AlertCircle, X } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  code: string;
  description: string;
  status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  start_date: string;
  due_date: string;
  campus: string;
  unit: string;
  pm: string;
  progress: number;
}

const initialProjects: Project[] = [
  {
    id: 'p0000000-0000-0000-0000-000000000001',
    name: 'Annual Brand Refresh & Design System 2026',
    code: 'PRJ-2026-001',
    description: 'Standardisasi visual seluruh media sosial, banner, merchandise, dan booklet resmi.',
    status: 'active',
    priority: 'high',
    start_date: '2026-02-01',
    due_date: '2026-04-30',
    campus: 'Kampus Utama Jakarta',
    unit: 'Brand & Visual Identity',
    pm: 'Siti Sarah',
    progress: 65,
  },
  {
    id: 'p0000000-0000-0000-0000-000000000002',
    name: 'Ramadhan Creative Campaign: Berbagi Cahaya',
    code: 'PRJ-2026-002',
    description: 'Produksi serial video renungan harian dan visual quote bertema Ramadhan.',
    status: 'planning',
    priority: 'urgent',
    start_date: '2026-03-01',
    due_date: '2026-03-25',
    campus: 'Kampus Bandung Hub',
    unit: 'Motion Graphics & 3D Lab',
    pm: 'Siti Sarah',
    progress: 25,
  },
  {
    id: 'p0000000-0000-0000-0000-000000000003',
    name: 'Social Media Daily Editorial Sprint Q1',
    code: 'PRJ-2026-003',
    description: 'Eksekusi 30 konten edukatif, infografis tren teknologi, dan showcase karya mahasiswa.',
    status: 'active',
    priority: 'medium',
    start_date: '2026-01-15',
    due_date: '2026-03-31',
    campus: 'Kampus Utama Jakarta',
    unit: 'Digital Publishing & Copy',
    pm: 'Dewi Lestari',
    progress: 80,
  },
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [filter, setFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    code: '',
    description: '',
    campus: 'Kampus Utama Jakarta',
    unit: 'Brand & Visual Identity',
    pm: 'Siti Sarah',
    priority: 'medium' as any,
    start_date: '',
    due_date: '',
  });

  const filteredProjects = filter === 'all'
    ? projects
    : projects.filter(p => p.status === filter);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    const newProj: Project = {
      id: `p${Date.now()}`,
      name: form.name,
      code: form.code || `PRJ-2026-${String(projects.length + 1).padStart(3, '0')}`,
      description: form.description,
      status: 'planning',
      priority: form.priority,
      start_date: form.start_date || '2026-03-01',
      due_date: form.due_date || '2026-05-30',
      campus: form.campus,
      unit: form.unit,
      pm: form.pm,
      progress: 0,
    };

    setProjects([newProj, ...projects]);
    setIsModalOpen(false);
    setForm({
      name: '',
      code: '',
      description: '',
      campus: 'Kampus Utama Jakarta',
      unit: 'Brand & Visual Identity',
      pm: 'Siti Sarah',
      priority: 'medium',
      start_date: '',
      due_date: '',
    });
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-6)' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Creative Projects
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Portofolio proyek produksi kreatif aktif, lini masa, dan alokasi tim lintas kampus.
          </p>
        </div>

        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
          <Plus size={16} /> Proyek Baru
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="filter-pills">
        {['all', 'planning', 'active', 'completed'].map((st) => (
          <button
            key={st}
            className={`filter-pill ${filter === st ? 'active' : ''}`}
            onClick={() => setFilter(st)}
          >
            {st === 'all' ? 'Semua Proyek' : st.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 'var(--space-6)' }}>
        {filteredProjects.map((p) => (
          <div key={p.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                <span style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  {p.code}
                </span>
                <span className={`status-pill status-${p.status}`}>
                  {p.status}
                </span>
              </div>

              <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>
                {p.name}
              </h3>

              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)', lineHeight: 1.5 }}>
                {p.description}
              </p>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                <span>Progres</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p.progress}%</span>
              </div>
              <div className="progress-bar" style={{ marginBottom: 'var(--space-4)' }}>
                <div className="progress-fill" style={{ width: `${p.progress}%` }}></div>
              </div>

              <div style={{ 
                borderTop: '1px solid var(--border-color)', 
                paddingTop: 'var(--space-3)', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 'var(--space-1)',
                fontSize: '12px',
                color: 'var(--text-secondary)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Unit: {p.unit}</span>
                  <span>PM: {p.pm}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Kampus: {p.campus}</span>
                  <span>Tenggat: {p.due_date}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Project Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Inisiasi Proyek Kreatif Baru</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Nama Proyek *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Kampanye Visual Wisuda 2026"
                    className="form-input"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Kode Proyek</label>
                  <input
                    type="text"
                    placeholder="PRJ-2026-004"
                    className="form-input"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Deskripsi & Tujuan</label>
                  <textarea
                    rows={3}
                    placeholder="Jelaskan output akhir dan ekspektasi capaian proyek..."
                    className="form-input"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                  <div className="form-group">
                    <label className="form-label">Kampus</label>
                    <select
                      className="form-input"
                      value={form.campus}
                      onChange={(e) => setForm({ ...form, campus: e.target.value })}
                    >
                      <option value="Kampus Utama Jakarta">Jakarta</option>
                      <option value="Kampus Bandung Hub">Bandung</option>
                      <option value="Kampus Surabaya Studio">Surabaya</option>
                      <option value="Kampus Yogyakarta Art Space">Yogyakarta</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Unit Kreatif</label>
                    <select
                      className="form-input"
                      value={form.unit}
                      onChange={(e) => setForm({ ...form, unit: e.target.value })}
                    >
                      <option value="Brand & Visual Identity">Brand & Visual Identity</option>
                      <option value="Motion Graphics & 3D Lab">Motion Graphics & 3D Lab</option>
                      <option value="Digital Publishing & Copy">Digital Publishing</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                  <div className="form-group">
                    <label className="form-label">Project Manager (PM)</label>
                    <select
                      className="form-input"
                      value={form.pm}
                      onChange={(e) => setForm({ ...form, pm: e.target.value })}
                    >
                      <option value="Siti Sarah">Siti Sarah</option>
                      <option value="Ahmad Fauzi">Ahmad Fauzi</option>
                      <option value="Dewi Lestari">Dewi Lestari</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Target Tenggat Selesai</label>
                    <input
                      type="date"
                      className="form-input"
                      value={form.due_date}
                      onChange={(e) => setForm({ ...form, due_date: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  Simpan Proyek
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
