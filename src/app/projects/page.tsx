'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  FolderOpen, 
  Calendar, 
  User, 
  Edit3, 
  Trash2, 
  X, 
  ExternalLink, 
  CheckSquare, 
  ArrowRight,
  Eye,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
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
  const { data: tasks, addItem: addTaskItem } = usePersistentData<any>('tasks', []);
  const [filter, setFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  
  // Detail and Direct Task modals
  const [detailProject, setDetailProject] = useState<Project | null>(null);
  const [taskModalProject, setTaskModalProject] = useState<Project | null>(null);
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    status: 'todo' as any,
    priority: 'medium' as any,
    due_date: '',
    assignee: 'Budi Wicaksono',
    image_url: '',
  });

  const getProjectTasks = (projectName: string) => {
    return tasks.filter(t => 
      t.project && (
        t.project.toLowerCase() === projectName.toLowerCase() ||
        projectName.toLowerCase().includes(t.project.toLowerCase())
      )
    );
  };

  const getProjectTaskStats = (projectName: string, fallbackProgress: number) => {
    const projectTasks = getProjectTasks(projectName);
    if (projectTasks.length === 0) {
      return { total: 0, done: 0, progress: fallbackProgress };
    }
    const done = projectTasks.filter(t => t.status === 'done').length;
    const progress = Math.round((done / projectTasks.length) * 100);
    return { total: projectTasks.length, done, progress };
  };

  const getProjectTeam = (projectName: string, pm: string) => {
    const projectTasks = getProjectTasks(projectName);
    const memberMap: { [key: string]: number } = {};
    if (pm) memberMap[pm] = 0;
    projectTasks.forEach(t => {
      if (t.assignee) {
        memberMap[t.assignee] = (memberMap[t.assignee] || 0) + 1;
      }
    });
    return Object.entries(memberMap).map(([name, count]) => ({
      name,
      role: name === pm ? 'Project Manager' : 'Creative Talent',
      taskCount: count,
    }));
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

  const handleCreateTaskForProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskForm.title.trim() || !taskModalProject) return;

    const newTask = {
      id: `t${Date.now()}`,
      title: taskForm.title,
      description: taskForm.description,
      project: taskModalProject.name,
      status: taskForm.status,
      priority: taskForm.priority,
      due_date: taskForm.due_date || taskModalProject.due_date,
      assignee: taskForm.assignee,
      image_url: taskForm.image_url,
    };

    addTaskItem(newTask);
    setTaskModalProject(null);
    setTaskForm({
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      due_date: '',
      assignee: 'Budi Wicaksono',
      image_url: '',
    });
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
                  <div style={{ 
                    borderTop: '1px solid var(--border-color)', 
                    paddingTop: 'var(--space-2)', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '6px'
                  }}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button
                        onClick={() => setDetailProject(p)}
                        className="btn btn-secondary"
                        style={{ fontSize: '11px', padding: '4px 8px', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Eye size={12} /> Detail
                      </button>

                      <button
                        onClick={() => {
                          setTaskModalProject(p);
                          setTaskForm({
                            title: '',
                            description: '',
                            status: 'todo',
                            priority: 'medium',
                            due_date: p.due_date,
                            assignee: 'Budi Wicaksono',
                            image_url: '',
                          });
                        }}
                        className="btn btn-primary"
                        style={{ fontSize: '11px', padding: '4px 8px', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Plus size={12} /> + Task
                      </button>

                      <Link
                        href={`/tasks?project=${encodeURIComponent(p.name)}`}
                        className="btn btn-secondary"
                        style={{ fontSize: '11px', padding: '4px 8px', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <CheckSquare size={12} /> Tasks ({taskStats.total})
                      </Link>
                    </div>

                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button
                        onClick={() => startEdit(p)}
                        className="btn btn-secondary"
                        style={{ fontSize: '11px', padding: '4px 6px' }}
                        title="Edit Data Proyek"
                      >
                        <Edit3 size={12} />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        className="btn btn-secondary"
                        style={{ fontSize: '11px', padding: '4px 6px', color: 'var(--danger-color)' }}
                        title="Hapus Proyek"
                      >
                        <Trash2 size={12} />
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

      {/* Project Detail & Review Modal */}
      {detailProject && (
        <div className="modal-overlay" onClick={() => setDetailProject(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '750px', width: '90%' }}>
            <div className="modal-header">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                    {detailProject.code}
                  </span>
                  <span className={`badge ${
                    detailProject.status === 'active' ? 'badge-info' :
                    detailProject.status === 'completed' ? 'badge-success' : 'badge-neutral'
                  }`}>
                    {detailProject.status}
                  </span>
                  <span className={`badge ${
                    detailProject.priority === 'urgent' ? 'badge-danger' :
                    detailProject.priority === 'high' ? 'badge-warning' : 'badge-neutral'
                  }`}>
                    {detailProject.priority}
                  </span>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {detailProject.name}
                </h3>
              </div>
              <button onClick={() => setDetailProject(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              {/* Media Preview if available */}
              {detailProject.image_url && (
                <div style={{ 
                  borderRadius: '6px', 
                  overflow: 'hidden', 
                  maxHeight: '260px', 
                  marginBottom: 'var(--space-4)', 
                  border: '1px solid var(--border-color)',
                  backgroundColor: '#f8fafc'
                }}>
                  <img 
                    src={detailProject.image_url} 
                    alt={detailProject.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                  />
                </div>
              )}

              {/* Description */}
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <label className="form-label">Deskripsi & Ruang Lingkup</label>
                <div style={{ 
                  fontSize: '13px', 
                  lineHeight: 1.6, 
                  color: 'var(--text-primary)', 
                  backgroundColor: 'var(--surface-color)', 
                  padding: '12px', 
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)'
                }}>
                  {detailProject.description}
                </div>
              </div>

              {/* Metadata Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                <div style={{ padding: '10px', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Project Manager (PM)</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>{detailProject.pm}</div>
                </div>
                <div style={{ padding: '10px', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Kampus & Unit</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>{detailProject.campus}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{detailProject.unit}</div>
                </div>
                <div style={{ padding: '10px', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Jadwal / Tenggat</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>{detailProject.due_date}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Mulai: {detailProject.start_date}</div>
                </div>
              </div>

              {/* Team Members Working on This Project */}
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label className="form-label" style={{ marginBottom: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Users size={14} /> Tim & Talenta yang Bertugas
                  </label>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    Sinkron otomatis ke dasbor masing-masing
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px' }}>
                  {getProjectTeam(detailProject.name, detailProject.pm).map((member, idx) => (
                    <div key={idx} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px', 
                      padding: '8px 12px', 
                      backgroundColor: '#f8fafc', 
                      borderRadius: '6px', 
                      border: '1px solid var(--border-color)' 
                    }}>
                      <div style={{ 
                        width: '28px', 
                        height: '28px', 
                        borderRadius: '50%', 
                        backgroundColor: '#e2e8f0', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: 'var(--text-primary)'
                      }}>
                        {member.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
                      </div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {member.name}
                        </div>
                        <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                          {member.role} {member.taskCount > 0 ? `(${member.taskCount} task)` : ''}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tasks Breakdown Table */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label className="form-label" style={{ marginBottom: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckSquare size={14} /> Daftar Tugas dalam Proyek ({getProjectTasks(detailProject.name).length})
                  </label>
                  <button
                    onClick={() => {
                      setTaskModalProject(detailProject);
                      setTaskForm({
                        title: '',
                        description: '',
                        status: 'todo',
                        priority: 'medium',
                        due_date: detailProject.due_date,
                        assignee: 'Budi Wicaksono',
                        image_url: '',
                      });
                    }}
                    className="btn btn-secondary"
                    style={{ fontSize: '11px', padding: '3px 8px', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Plus size={11} /> Tambah Task
                  </button>
                </div>

                <div className="table-container" style={{ border: '1px solid var(--border-color)', borderRadius: '6px' }}>
                  <table className="table" style={{ fontSize: '12px' }}>
                    <thead>
                      <tr>
                        <th>Judul Tugas</th>
                        <th>Penanggung Jawab</th>
                        <th>Prioritas</th>
                        <th>Status</th>
                        <th>Tenggat</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getProjectTasks(detailProject.name).length === 0 ? (
                        <tr>
                          <td colSpan={5} style={{ textAlign: 'center', padding: '16px', color: 'var(--text-secondary)' }}>
                            Belum ada tugas spesifik untuk proyek ini. Klik &quot;Tambah Task&quot; di atas untuk menyusun tugas.
                          </td>
                        </tr>
                      ) : (
                        getProjectTasks(detailProject.name).map((t: any) => (
                          <tr key={t.id}>
                            <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{t.title}</td>
                            <td>{t.assignee}</td>
                            <td>
                              <span className={`badge ${
                                t.priority === 'urgent' ? 'badge-danger' :
                                t.priority === 'high' ? 'badge-warning' : 'badge-neutral'
                              }`} style={{ fontSize: '10px' }}>
                                {t.priority}
                              </span>
                            </td>
                            <td>
                              <span className={`badge ${
                                t.status === 'done' ? 'badge-success' :
                                t.status === 'review' ? 'badge-warning' :
                                t.status === 'in_progress' ? 'badge-info' : 'badge-neutral'
                              }`} style={{ fontSize: '10px' }}>
                                {t.status}
                              </span>
                            </td>
                            <td>{t.due_date}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Link
                href={`/tasks?project=${encodeURIComponent(detailProject.name)}`}
                className="btn btn-secondary"
                style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <CheckSquare size={13} /> Buka di Kanban Board
              </Link>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => {
                    const target = detailProject;
                    setDetailProject(null);
                    startEdit(target);
                  }}
                  className="btn btn-secondary"
                  style={{ fontSize: '12px' }}
                >
                  <Edit3 size={13} /> Edit Proyek
                </button>
                <button
                  type="button"
                  onClick={() => setDetailProject(null)}
                  className="btn btn-primary"
                  style={{ fontSize: '12px' }}
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Add Task directly to Project Modal */}
      {taskModalProject && (
        <div className="modal-overlay" onClick={() => setTaskModalProject(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Tambah Tugas ke Proyek</span>
                <h3 style={{ fontSize: '16px', fontWeight: 600 }}>{taskModalProject.name}</h3>
              </div>
              <button onClick={() => setTaskModalProject(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateTaskForProject}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Judul Tugas *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Finalisasi Motion Graphic Teaser Episode 1"
                    className="form-input"
                    value={taskForm.title}
                    onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Deskripsi & Instruksi Pengerjaan</label>
                  <textarea
                    rows={2}
                    placeholder="Tuliskan catatan teknis atau arahan visual..."
                    className="form-input"
                    value={taskForm.description}
                    onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                  <div className="form-group">
                    <label className="form-label">Ditugaskan Kepada (PIC) *</label>
                    <select
                      className="form-input"
                      value={taskForm.assignee}
                      onChange={(e) => setTaskForm({ ...taskForm, assignee: e.target.value })}
                    >
                      <option value="Budi Wicaksono">Budi Wicaksono (Desain JKT)</option>
                      <option value="Reza Pratama">Reza Pratama (Video/Motion BDG)</option>
                      <option value="Dewi Lestari">Dewi Lestari (Copywriter SBY)</option>
                      <option value="Siti Sarah">Siti Sarah (Producer JKT)</option>
                      <option value="Ahmad Fauzi">Ahmad Fauzi (Creative Lead)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Tenggat Waktu</label>
                    <input
                      type="date"
                      className="form-input"
                      value={taskForm.due_date}
                      onChange={(e) => setTaskForm({ ...taskForm, due_date: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                  <div className="form-group">
                    <label className="form-label">Status Kolom</label>
                    <select
                      className="form-input"
                      value={taskForm.status}
                      onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value as any })}
                    >
                      <option value="todo">To Do</option>
                      <option value="in_progress">In Progress</option>
                      <option value="review">In Review</option>
                      <option value="done">Completed</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Prioritas</label>
                    <select
                      className="form-input"
                      value={taskForm.priority}
                      onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value as any })}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <DriveImageUploader
                  label="Lampiran Referensi / Asset Awal (Google Drive)"
                  currentImageUrl={taskForm.image_url}
                  onImageUploaded={(url) => setTaskForm({ ...taskForm, image_url: url })}
                />
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setTaskModalProject(null)} className="btn btn-secondary">
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  Simpan Tugas ke Proyek
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
