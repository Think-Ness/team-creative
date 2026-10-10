'use client';

import { useState } from 'react';
import { Building2, Plus, Users, MapPin, Layers, X, Edit3, Trash2 } from 'lucide-react';

interface Campus {
  id: string;
  name: string;
  code: string;
  city: string;
  units: { name: string; lead: string; members: number }[];
}

const INITIAL_CAMPUSES: Campus[] = [
  {
    id: '1',
    name: 'Kampus Utama Jakarta',
    code: 'JKT-01',
    city: 'DKI Jakarta',
    units: [
      { name: 'Brand & Visual Identity', lead: 'Ahmad Fauzi', members: 4 },
      { name: 'Digital Publishing & Copy', lead: 'Dewi Lestari', members: 3 },
    ],
  },
  {
    id: '2',
    name: 'Kampus Bandung Hub',
    code: 'BDG-01',
    city: 'Bandung, Jawa Barat',
    units: [
      { name: 'Motion Graphics & 3D Lab', lead: 'Reza Pratama', members: 3 },
    ],
  },
  {
    id: '3',
    name: 'Kampus Surabaya Studio',
    code: 'SBY-01',
    city: 'Surabaya, Jawa Timur',
    units: [
      { name: 'Video & Audio Production', lead: 'Siti Sarah', members: 2 },
    ],
  },
  {
    id: '4',
    name: 'Kampus Yogyakarta Art Space',
    code: 'JOG-01',
    city: 'DI Yogyakarta',
    units: [
      { name: 'Illustration & Printmaking', lead: 'Budi Wicaksono', members: 2 },
    ],
  },
];

export default function CampusesPage() {
  const [campuses, setCampuses] = useState<Campus[]>(INITIAL_CAMPUSES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCampus, setEditingCampus] = useState<Campus | null>(null);

  const [form, setForm] = useState({ name: '', code: '', city: '' });

  const handleCreateOrUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    if (editingCampus) {
      setCampuses(campuses.map(c => c.id === editingCampus.id ? {
        ...c,
        name: form.name,
        code: form.code,
        city: form.city,
      } : c));
      setEditingCampus(null);
    } else {
      const newCampus: Campus = {
        id: String(Date.now()),
        name: form.name,
        code: form.code || `CMP-${campuses.length + 1}`,
        city: form.city || 'Indonesia',
        units: [],
      };
      setCampuses([...campuses, newCampus]);
    }

    setIsModalOpen(false);
    setForm({ name: '', code: '', city: '' });
  };

  const startEdit = (campus: Campus) => {
    setEditingCampus(campus);
    setForm({
      name: campus.name,
      code: campus.code,
      city: campus.city,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Hapus kampus "${name}" beserta unitnya?`)) {
      setCampuses(campuses.filter(c => c.id !== id));
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-6)' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Campuses & Creative Units
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Pemetaan simpul fasilitas, studio produksi, dan unit kerja kreatif di setiap kampus jaringan 6102.
          </p>
        </div>

        <button 
          onClick={() => {
            setEditingCampus(null);
            setForm({ name: '', code: '', city: '' });
            setIsModalOpen(true);
          }} 
          className="btn btn-primary"
        >
          <Plus size={16} /> Tambah Kampus
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 'var(--space-6)' }}>
        {campuses.map((c) => (
          <div key={c.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                  {c.code}
                </span>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
                  {c.name}
                </h3>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                  <MapPin size={12} /> {c.city}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <span className="badge">
                  {c.units.length} Unit
                </span>
                <button
                  onClick={() => startEdit(c)}
                  className="btn btn-secondary"
                  style={{ fontSize: '11px', padding: '3px 6px' }}
                >
                  <Edit3 size={12} />
                </button>
                <button
                  onClick={() => handleDelete(c.id, c.name)}
                  className="btn btn-secondary"
                  style={{ fontSize: '11px', padding: '3px 6px', color: 'var(--danger-color)' }}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 'var(--space-3)' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 'var(--space-2)' }}>
                UNIT KREATIF AKTIF
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {c.units.length > 0 ? (
                  c.units.map((u, i) => (
                    <div 
                      key={i} 
                      style={{ 
                        padding: 'var(--space-2) var(--space-3)', 
                        background: 'var(--bg-color)', 
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '12px'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{u.name}</div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>Lead: {u.lead}</div>
                      </div>
                      <span className="metadata-text">{u.members} Anggota</span>
                    </div>
                  ))
                ) : (
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Belum ada unit terdaftar.</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '16px', fontWeight: 600 }}>
                {editingCampus ? 'Edit Data Kampus' : 'Daftarkan Kampus Jaringan Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateOrUpdate}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Nama Kampus / Fasilitas *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Kampus Malang Creative Space"
                    className="form-input"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                  <div className="form-group">
                    <label className="form-label">Kode Kampus</label>
                    <input
                      type="text"
                      placeholder="MLG-01"
                      className="form-input"
                      value={form.code}
                      onChange={(e) => setForm({ ...form, code: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Kota / Lokasi</label>
                    <input
                      type="text"
                      placeholder="Malang, Jawa Timur"
                      className="form-input"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingCampus ? 'Simpan Perubahan' : 'Simpan Kampus'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
