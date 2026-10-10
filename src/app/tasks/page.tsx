'use client';

import { useState } from 'react';
import { Plus, CheckSquare, Clock, User, AlertCircle, X, Edit3, Trash2, ExternalLink } from 'lucide-react';
import { usePersistentData } from '@/lib/usePersistentData';
import DriveImageUploader from '@/components/common/DriveImageUploader';

interface Task {
  id: string;
  title: string;
  description: string;
  project: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date: string;
  assignee: string;
  image_url?: string;
}

const initialTasks: Task[] = [
  {
    id: 't0000000-0000-0000-0000-000000000001',
    title: 'Finalisasi Color Palette & Typography Tokens (Figma)',
    description: 'Definisikan token warna netral dan aksen di file Figma master.',
    project: 'Brand Refresh 2026',
    status: 'done',
    priority: 'high',
    due_date: '2026-02-20',
    assignee: 'Budi Wicaksono',
  },
  {
    id: 't0000000-0000-0000-0000-000000000002',
    title: 'Susun Booklet Brand Guidelines 2026 PDF',
    description: 'Kompilasi panduan logo usage, do & donts, serta grid layout ke dalam PDF.',
    project: 'Brand Refresh 2026',
    status: 'in_progress',
    priority: 'high',
    due_date: '2026-03-05',
    assignee: 'Budi Wicaksono',
  },
  {
    id: 't0000000-0000-0000-0000-000000000003',
    title: 'Storyboard & Animatic Teaser Ramadhan 30 Detik',
    description: 'Buat storyboard alur visual video pembuka bulan suci.',
    project: 'Ramadhan Campaign',
    status: 'review',
    priority: 'urgent',
    due_date: '2026-02-28',
    assignee: 'Reza Pratama',
  },
  {
    id: 't0000000-0000-0000-0000-000000000004',
    title: 'Draft Copywriting 10 Carousel Tren Desain AI',
    description: 'Riset tren tools AI generative dan etika desain untuk dipublikasi.',
    project: 'Editorial Sprint Q1',
    status: 'in_progress',
    priority: 'medium',
    due_date: '2026-03-02',
    assignee: 'Dewi Lestari',
  },
  {
    id: 't0000000-0000-0000-0000-000000000005',
    title: 'Export Vector Logo Asset Kit (.SVG, .EPS, .PNG)',
    description: 'Ekspor logo horizontal, vertikal, dan logomark variasi dark & light.',
    project: 'Brand Refresh 2026',
    status: 'todo',
    priority: 'medium',
    due_date: '2026-03-10',
    assignee: 'Budi Wicaksono',
  },
];

const COLUMNS: { key: Task['status']; label: string }[] = [
  { key: 'todo', label: 'To Do' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'review', label: 'In Review' },
  { key: 'done', label: 'Completed' },
];

export default function TasksPage() {
  const { data: tasks, addItem, updateItem, deleteItem } = usePersistentData<Task>('tasks', initialTasks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [form, setForm] = useState({
    title: '',
    description: '',
    project: 'Brand Refresh 2026',
    status: 'todo' as Task['status'],
    priority: 'medium' as any,
    due_date: '',
    assignee: 'Budi Wicaksono',
    image_url: '',
  });

  const moveStatus = (id: string, nextStatus: Task['status']) => {
    updateItem(id, { status: nextStatus });
  };

  const handleCreateOrUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    if (editingTask) {
      updateItem(editingTask.id, {
        title: form.title,
        description: form.description,
        project: form.project,
        status: form.status,
        priority: form.priority,
        due_date: form.due_date || editingTask.due_date,
        assignee: form.assignee,
        image_url: form.image_url,
      });
      setEditingTask(null);
    } else {
      const newTask: Task = {
        id: `t${Date.now()}`,
        title: form.title,
        description: form.description,
        project: form.project,
        status: form.status,
        priority: form.priority,
        due_date: form.due_date || '2026-03-15',
        assignee: form.assignee,
        image_url: form.image_url,
      };
      addItem(newTask);
    }

    setIsModalOpen(false);
    resetForm();
  };

  const startEdit = (t: Task) => {
    setEditingTask(t);
    setForm({
      title: t.title,
      description: t.description,
      project: t.project,
      status: t.status,
      priority: t.priority,
      due_date: t.due_date,
      assignee: t.assignee,
      image_url: t.image_url || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Hapus tugas "${title}"?`)) {
      deleteItem(id);
    }
  };

  const resetForm = () => {
    setForm({
      title: '',
      description: '',
      project: 'Brand Refresh 2026',
      status: 'todo',
      priority: 'medium',
      due_date: '',
      assignee: 'Budi Wicaksono',
      image_url: '',
    });
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-6)' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Tasks & Production Board
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Papan Kanban alur pengerjaan tugas kreatif. Setiap tugas dapat diedit, dipindahkan status, atau dihapus.
          </p>
        </div>

        <button 
          onClick={() => {
            setEditingTask(null);
            resetForm();
            setIsModalOpen(true);
          }} 
          className="btn btn-primary"
        >
          <Plus size={16} /> Tambah Tugas
        </button>
      </div>

      {/* Kanban Board */}
      <div className="kanban-board">
        {COLUMNS.map((col) => {
          const colTasks = tasks.filter(t => t.status === col.key);
          return (
            <div key={col.key} className="kanban-col">
              <div className="kanban-col-header">
                <span>{col.label}</span>
                <span className="badge">{colTasks.length}</span>
              </div>

              {colTasks.map((t) => (
                <div key={t.id} className="kanban-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 500 }}>
                      {t.project}
                    </span>
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                      <span className="badge" style={{ fontSize: '10px', textTransform: 'uppercase' }}>
                        {t.priority}
                      </span>
                      <button 
                        onClick={(e) => { e.stopPropagation(); startEdit(t); }}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: '2px' }}
                        title="Edit Tugas"
                      >
                        <Edit3 size={12} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDelete(t.id, t.title); }}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--danger-color)', padding: '2px' }}
                        title="Hapus Tugas"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>

                  <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                    {t.title}
                  </h4>

                  {t.image_url && (
                    <div style={{ margin: '6px 0', borderRadius: '4px', overflow: 'hidden', maxHeight: '110px', backgroundColor: '#f1f5f9' }}>
                      <img src={t.image_url} alt={t.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}

                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    {t.description}
                  </p>

                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    borderTop: '1px solid var(--border-color)', 
                    paddingTop: 'var(--space-2)',
                    marginTop: 'var(--space-1)',
                    fontSize: '11px',
                    color: 'var(--text-secondary)'
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <User size={12} /> {t.assignee}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} /> {t.due_date}
                    </span>
                  </div>

                  {/* Move status action pills */}
                  <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                    {col.key !== 'todo' && (
                      <button 
                        onClick={() => moveStatus(t.id, col.key === 'done' ? 'review' : col.key === 'review' ? 'in_progress' : 'todo')}
                        style={{ fontSize: '10px', padding: '2px 6px', background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '3px', cursor: 'pointer' }}
                      >
                        ← Geser
                      </button>
                    )}
                    {col.key !== 'done' && (
                      <button 
                        onClick={() => moveStatus(t.id, col.key === 'todo' ? 'in_progress' : col.key === 'in_progress' ? 'review' : 'done')}
                        style={{ fontSize: '10px', padding: '2px 6px', background: 'var(--accent-primary)', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer', marginLeft: 'auto' }}
                      >
                        Lanjut →
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Add / Edit Task Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '16px', fontWeight: 600 }}>
                {editingTask ? 'Edit Data Tugas' : 'Tambah Tugas Kreatif Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateOrUpdate}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Judul Tugas *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Render Video Teaser Resolusi 4K"
                    className="form-input"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Deskripsi Pengerjaan</label>
                  <textarea
                    rows={2}
                    placeholder="Instruksi spesifik atau link referensi..."
                    className="form-input"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                  <div className="form-group">
                    <label className="form-label">Status Kolom</label>
                    <select
                      className="form-input"
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value as any })}
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
                      value={form.priority}
                      onChange={(e) => setForm({ ...form, priority: e.target.value as any })}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                  <div className="form-group">
                    <label className="form-label">Ditugaskan Kepada</label>
                    <select
                      className="form-input"
                      value={form.assignee}
                      onChange={(e) => setForm({ ...form, assignee: e.target.value })}
                    >
                      <option value="Budi Wicaksono">Budi Wicaksono (Desain)</option>
                      <option value="Reza Pratama">Reza Pratama (Video/Motion)</option>
                      <option value="Dewi Lestari">Dewi Lestari (Copywriting)</option>
                      <option value="Siti Sarah">Siti Sarah (Producer)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Tenggat Waktu</label>
                    <input
                      type="date"
                      className="form-input"
                      value={form.due_date}
                      onChange={(e) => setForm({ ...form, due_date: e.target.value })}
                    />
                  </div>
                </div>

                <DriveImageUploader
                  label="Upload File Deliverable / Hasil Kerja (Google Drive)"
                  currentImageUrl={form.image_url}
                  onImageUploaded={(url) => setForm({ ...form, image_url: url })}
                />
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingTask ? 'Simpan Perubahan' : 'Buat Tugas'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
