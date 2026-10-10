'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, PRESET_USERS } from '@/context/AuthContext';
import { Shield, Users, Building2, Check, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { currentUser, switchUser, users } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      switchUser(found.id);
      router.push('/');
    } else {
      alert('Email belum terdaftar. Silakan pilih salah satu akun demo di bawah.');
    }
  };

  const handleSelectPreset = (id: string) => {
    switchUser(id);
    router.push('/');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: 'var(--space-8) 0' }}>
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
        <span className="status-pill status-active" style={{ marginBottom: '8px' }}>
          Sistem Autentikasi & Hirarki Akun
        </span>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)' }}>
          Masuk ke 6102 Creative System
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px', maxWidth: '540px', margin: '4px auto 0' }}>
          Akses multi-kampus dengan peran: <strong>Super Admin</strong>, <strong>Admin Kampus</strong>, dan <strong>Anggota Divisi</strong>.
        </p>
      </div>

      {/* Preset Quick Login Grid */}
      <div className="card" style={{ marginBottom: 'var(--space-8)' }}>
        <h3 className="section-title" style={{ marginBottom: 'var(--space-3)' }}>
          Pilih Akun Demo (Simulasi Peran Instan)
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
          Klik salah satu profil untuk langsung masuk dengan hak akses yang sesuai:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-3)' }}>
          {users.map((u) => {
            const isCurrent = currentUser.id === u.id;
            return (
              <div
                key={u.id}
                onClick={() => handleSelectPreset(u.id)}
                style={{
                  border: isCurrent ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-3)',
                  cursor: 'pointer',
                  background: isCurrent ? '#f8fafc' : 'var(--surface-color)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)',
                  transition: 'all 0.15s ease',
                }}
              >
                <img src={u.avatar} alt={u.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {u.name}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
                    {u.role.replace('_', ' ')} • <strong>{u.division}</strong>
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                    {u.campus}
                  </div>
                </div>
                {isCurrent && <Check size={16} color="#059669" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Alur Hirarki Penjelasan */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
        <div className="card" style={{ borderLeft: '4px solid #0f172a' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <Shield size={16} />
            <h4 style={{ fontSize: '14px', fontWeight: 600 }}>1. Super Admin (Pusat)</h4>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Dapat membuat dan mendaftarkan <strong>Admin Kampus</strong> baru, mengelola semua kampus dan mengontrol seluruh brand guidelines.
          </p>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #2563eb' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <Building2 size={16} color="#2563eb" />
            <h4 style={{ fontSize: '14px', fontWeight: 600 }}>2. Admin Kampus</h4>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Bertanggung jawab mendaftarkan <strong>Anggota Tim</strong> di kampusnya masing-masing dan menentukan divisinya (Desain, Copywriter, dll).
          </p>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #059669' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <Users size={16} color="#059669" />
            <h4 style={{ fontSize: '14px', fontWeight: 600 }}>3. Anggota Divisi</h4>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Mengerjakan tugas sesuai spesialisasi: Tim Desain (visual), Tim Copywriter (naskah), Tim Video (motion/rekaman), dll.
          </p>
        </div>
      </div>
    </div>
  );
}
