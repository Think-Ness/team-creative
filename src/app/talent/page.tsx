'use client';

import { useState } from 'react';
import { useAuth, AppUser, Division, UserRole } from '@/context/AuthContext';
import { Mail, CheckSquare, Building2, MapPin, Plus, Edit3, Trash2, Shield, X, UserCheck } from 'lucide-react';

export default function TalentPage() {
  const { currentUser, users, registerUser, updateUser, deleteUser } = useAuth();
  const [filterCampus, setFilterCampus] = useState('all');
  const [filterDivision, setFilterDivision] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AppUser | null>(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    role: (currentUser.role === 'super_admin' ? 'campus_admin' : 'member') as UserRole,
    campus: currentUser.campus.includes('Pusat') ? 'Kampus Utama Jakarta' : currentUser.campus,
    division: 'Graphic Design' as Division,
  });

  const filtered = users.filter((u) => {
    const campusMatch = filterCampus === 'all' || u.campus.toLowerCase().includes(filterCampus.toLowerCase());
    const divisionMatch = filterDivision === 'all' || u.division === filterDivision;
    return campusMatch && divisionMatch;
  });

  const handleCreateOrUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;

    if (editingUser) {
      updateUser(editingUser.id, {
        name: form.name,
        email: form.email,
        role: form.role,
        campus: form.campus,
        division: form.division,
      });
      setEditingUser(null);
    } else {
      registerUser({
        name: form.name,
        email: form.email,
        role: form.role,
        campus: form.campus,
        division: form.division,
        avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 500)}?w=150`,
      });
    }

    setIsModalOpen(false);
    setForm({
      name: '',
      email: '',
      role: (currentUser.role === 'super_admin' ? 'campus_admin' : 'member'),
      campus: currentUser.campus.includes('Pusat') ? 'Kampus Utama Jakarta' : currentUser.campus,
      division: 'Graphic Design',
    });
  };

  const startEdit = (user: AppUser) => {
    setEditingUser(user);
    setForm({
      name: user.name,
      email: user.email,
      role: user.role,
      campus: user.campus,
      division: user.division,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Hapus anggota "${name}" dari sistem?`)) {
      deleteUser(id);
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'super_admin': return <span className="status-pill status-active">Super Admin</span>;
      case 'campus_admin': return <span className="status-pill status-in_progress">Admin Kampus</span>;
      default: return <span className="status-pill status-draft">Anggota Tim</span>;
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-6)' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Creative Talent & Division Directory
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {currentUser.role === 'super_admin'
              ? 'Anda login sebagai Super Admin: Dapat mendaftarkan Admin Kampus dan mengelola seluruh anggota 8 divisi.'
              : `Anda login sebagai ${currentUser.role === 'campus_admin' ? 'Admin Kampus' : 'Anggota'}: Mengelola tim di ${currentUser.campus}.`}
          </p>
        </div>

        <button 
          onClick={() => {
            setEditingUser(null);
            setForm({
              name: '',
              email: '',
              role: currentUser.role === 'super_admin' ? 'campus_admin' : 'member',
              campus: currentUser.campus.includes('Pusat') ? 'Kampus Utama Jakarta' : currentUser.campus,
              division: 'Graphic Design',
            });
            setIsModalOpen(true);
          }} 
          className="btn btn-primary"
        >
          <Plus size={16} /> {currentUser.role === 'super_admin' ? '+ Daftarkan Admin Kampus' : '+ Tambah Anggota Divisi'}
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', marginBottom: 'var(--space-6)' }}>
        <div className="filter-pills" style={{ marginBottom: 0 }}>
          {['all', 'Jakarta', 'Bandung', 'Surabaya', 'Pusat'].map((c) => (
            <button
              key={c}
              className={`filter-pill ${filterCampus === c ? 'active' : ''}`}
              onClick={() => setFilterCampus(c)}
            >
              {c === 'all' ? 'Semua Kampus' : c}
            </button>
          ))}
        </div>

        <div className="filter-pills" style={{ marginBottom: 0 }}>
          {[
            'all', 
            'Graphic Design', 
            'Copywriting', 
            'Content', 
            'Creative Management', 
            'Event Coordinator', 
            'Film Production', 
            'Music Production', 
            'Camera & Editorial'
          ].map((d) => (
            <button
              key={d}
              className={`filter-pill ${filterDivision === d ? 'active' : ''}`}
              onClick={() => setFilterDivision(d)}
            >
              {d === 'all' ? 'Semua Divisi' : d}
            </button>
          ))}
        </div>
      </div>

      {/* Talent Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 'var(--space-6)' }}>
        {filtered.map((m) => (
          <div key={m.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <img 
                  src={m.avatar} 
                  alt={m.name} 
                  style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-color)' }}
                />
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {m.name}
                  </h3>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    Divisi <strong>{m.division}</strong>
                  </div>
                </div>
              </div>

              {getRoleBadge(m.role)}
            </div>

            <div style={{ 
              borderTop: '1px solid var(--border-color)', 
              paddingTop: 'var(--space-3)',
              fontSize: '12px',
              color: 'var(--text-secondary)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-2)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <MapPin size={13} /> {m.campus}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <Mail size={13} /> {m.email}
              </div>
            </div>

            <div style={{ 
              borderTop: '1px solid var(--border-color)', 
              paddingTop: 'var(--space-3)',
              marginTop: 'auto',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 'var(--space-2)'
            }}>
              <button
                onClick={() => startEdit(m)}
                className="btn btn-secondary"
                style={{ fontSize: '11px', padding: '4px 8px' }}
              >
                <Edit3 size={12} /> Edit
              </button>
              <button
                onClick={() => handleDelete(m.id, m.name)}
                className="btn btn-secondary"
                style={{ fontSize: '11px', padding: '4px 8px', color: 'var(--danger-color)' }}
              >
                <Trash2 size={12} /> Hapus
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Member Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '16px', fontWeight: 600 }}>
                {editingUser ? 'Edit Data Anggota Tim' : currentUser.role === 'super_admin' ? 'Daftarkan Admin Kampus Baru' : 'Daftarkan Anggota Divisi Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateOrUpdate}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Nama Lengkap *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Rian Pratama"
                    className="form-input"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Alamat Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="rian@creative.id"
                    className="form-input"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                  <div className="form-group">
                    <label className="form-label">Peran (Role)</label>
                    <select
                      className="form-input"
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value as any })}
                      disabled={currentUser.role === 'member'}
                    >
                      {currentUser.role === 'super_admin' && (
                        <option value="campus_admin">Admin Kampus</option>
                      )}
                      <option value="member">Anggota Tim</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Divisi Spesialisasi 6102</label>
                    <select
                      className="form-input"
                      value={form.division}
                      onChange={(e) => setForm({ ...form, division: e.target.value as any })}
                    >
                      <option value="Graphic Design">Graphic Design</option>
                      <option value="Copywriting">Copywriting</option>
                      <option value="Content">Content</option>
                      <option value="Creative Management">Creative Management</option>
                      <option value="Event Coordinator">Event Coordinator</option>
                      <option value="Film Production">Film Production</option>
                      <option value="Music Production">Music Production</option>
                      <option value="Camera & Editorial">Camera & Editorial</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Kampus</label>
                  <select
                    className="form-input"
                    value={form.campus}
                    onChange={(e) => setForm({ ...form, campus: e.target.value })}
                  >
                    <option value="Kampus Utama Jakarta">Kampus Utama Jakarta</option>
                    <option value="Kampus Bandung Hub">Kampus Bandung Hub</option>
                    <option value="Kampus Surabaya Studio">Kampus Surabaya Studio</option>
                    <option value="Kampus Yogyakarta Art Space">Kampus Yogyakarta Art Space</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingUser ? 'Simpan Perubahan' : 'Daftarkan Akun'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
