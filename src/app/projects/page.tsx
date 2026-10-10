'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, FolderOpen, Calendar, User, Edit3, Trash2, X, ExternalLink, CheckSquare, ArrowRight } from 'lucide-react';
import { usePersistentData } from '@/lib/usePersistentData';
import DriveImageUploader from '@/components/common/DriveImageUploader';

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
  image_url?: string;
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
  const { data: projects, addItem, updateItem, deleteItem } = usePersistentData<Project>('projects', initialProjects);
  const { data: tasks } = usePersistentData<any>('tasks', []);
  const [filter, setFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const getProjectTaskStats = (projectName: string, fallbackProgress: number) => {
    const projectTasks = tasks.filter(t => 
      t.project && (
        t.project.toLowerCase() === projectName.toLowerCase() ||
        projectName.toLowerCase().includes(t.project.toLowerCase())
      )
    );
    if (projectTasks.length === 0) {
      return { total: 0, done: 0, progress: fallbackProgress };
    }
    const done = projectTasks.filter(t => t.status === 'done').length;
    const progress = Math.round((done / projectTasks.length) * 100);
    return { total: projectTasks.length, done, progress };
  };

  const [form, setForm] = useState({
    name: '',
    code: '',
    description: '',
    campus: 'Kampus Utama Jakarta',
    unit: 'Brand & Visual Identity',
    pm: 'Siti Sarah',
    status: 'planning' as any,
    priority: 'medium' as any,
    progress: 0,
    start_date: '',
    due_date: '',
    image_url: '',
  });

  const filteredProjects = filter === 'all'
    ? projects
    : projects.filter(p => p.status === filter);

  const handleCreateOrUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    if (editingProject) {
      updateItem(editingProject.id, {
        name: form.name,
        code: form.code,
        description: form.description,
        campus: form.campus,
        unit: form.unit,
        pm: form.pm,
        status: form.status,
        priority: form.priority,
        progress: Number(form.progress) || 0,
        due_date: form.due_date || editingProject.due_date,
        image_url: form.image_url,
      });
      setEditingProject(null);
    } else {
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
        image_url: form.image_url,
      };
      addItem(newProj);
    }

    setIsModalOpen(false);
    resetForm();
  };

  const startEdit = (proj: Project) => {
    setEditingProject(proj);
    setForm({
      name: proj.name,
      code: proj.code,
      description: proj.description,
      campus: proj.campus,
      unit: proj.unit,
      pm: proj.pm,
      status: proj.status,
      priority: proj.priority,
      progress: proj.progress,
      start_date: proj.start_date,
      due_date: proj.due_date,
      image_url: proj.image_url || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Yakin ingin menghapus proyek "${name}"?`)) {
      deleteItem(id);
    }
  };

  const resetForm = () => {
    setForm({
      name: '',
      code: '',
      description: '',
      campus: 'Kampus Utama Jakarta',
      unit: 'Brand & Visual Identity',
      pm: 'Siti Sarah',
      status: 'planning',
      priority: 'medium',
      progress: 0,
      start_date: '',
      due_date: '',
      image_url: '',
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

        <button 
          onClick={() => {
            setEditingProject(null);
            resetForm();
            setIsModalOpen(true);
          }} 
          className="btn btn-primary"
        >
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

              {p.image_url && (
                <div style={{ marginBottom: '12px', borderRadius: '6px', overflow: 'hidden', height: '140px', backgroundColor: '#f1f5f9' }}>
                  <img src={p.image_url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}

              <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>
                {p.name}
              </h3>

              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)', lineHeight: 1.5 }}>
                {p.description}
              </p>
            </div>

            {(() => {
              const taskStats = getProjectTaskStats(p.name, p.progress);
              return (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    <span>
                      Progres {taskStats.total > 0 ? `(${taskStats.done}/${taskStats.total} Task Selesai)` : '(Manual)'}
                    </span>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{taskStats.progress}%</span>
                  </div>
                  <div className="progress-bar" style={{ marginBottom: 'var(--space-4)' }}>
                    <div className="progress-fill" style={{ width: `${taskStats.progress}%` }}></div>
                  </div>

                  <div style={{ 
                    borderTop: '1px solid var(--border-color)', 
                    paddingTop: 'var(--space-3)', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: 'var(--space-1)',
                    fontSize: '12px',
                    color: 'var(--text-secondary)',
                    marginBottom: 'var(--space-3)'
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

                  {/* Actions Bar */}
                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 'var(--space-2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Link
                      href={`/tasks?project=${encodeURIComponent(p.name)}`}
                      className="btn btn-secondary"
                      style={{ fontSize: '11px', padding: '4px 8px', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <CheckSquare size={12} /> Buka Tasks ({taskStats.total})
                    </Link>

                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                      <button
                        onClick={() => startEdit(p)}
                        className="btn btn-secondary"
                        style={{ fontSize: '11px', padding: '4px 8px' }}
                      >
                        <Edit3 size={12} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        className="btn btn-secondary"
                        style={{ fontSize: '11px', padding: '4px 8px', color: 'var(--danger-color)' }}
                      >
                        <Trash2 size={12} /> Hapus
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        ))}
      </div>

      {/* New/Edit Project Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '16px', fontWeight: 600 }}>
                {editingProject ? 'Edit Data Proyek Kreatif' : 'Inisiasi Proyek Kreatif Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateOrUpdate}>
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
                    rows={2}
                    placeholder="Jelaskan output akhir dan ekspektasi capaian proyek..."
                    className="form-input"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                  <div className="form-group">
                    <label className="form-label">Status Proyek</label>
                    <select
                      className="form-input"
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                    >
                      <option value="planning">Planning</option>
                      <option value="active">Active</option>
                      <option value="on_hold">On Hold</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Progres Capaian (%)</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      className="form-input"
                      value={form.progress}
                      onChange={(e) => setForm({ ...form, progress: Number(e.target.value) })}
                    />
                  </div>
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

                <DriveImageUploader
                  label="Upload Poster / Cover / Moodboard Proyek (Google Drive)"
                  currentImageUrl={form.image_url}
                  onImageUploaded={(url) => setForm({ ...form, image_url: url })}
                />
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingProject ? 'Simpan Perubahan' : 'Buat Proyek'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
