'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Shield, Users, Building2, Check, Lock, Mail, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { currentUser, switchUser, users, loginWithCredentials } = useAuth();
  
  const [email, setEmail] = useState('superadmin@creative.id');
  const [password, setPassword] = useState('123123');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    const result = loginWithCredentials(email, password);
    setLoading(false);

    if (result.success) {
      router.push('/');
    } else {
      setErrorMsg(result.error || 'Login gagal.');
    }
  };

  const handleSelectPreset = (id: string) => {
    switchUser(id);
    router.push('/');
  };

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto', padding: 'var(--space-6) 0' }}>
      
      {/* Title & Tagline */}
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
          <span className="status-pill status-active" style={{ fontSize: '11px', padding: '3px 10px' }}>
            6102 CREATIVE SYSTEM
          </span>
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Masuk ke Portal Kreatif 6102
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px', fontStyle: 'italic' }}>
          “Different Campuses. Different Talents. One Creative Direction.”
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
        
        {/* Form Login Super Admin / User */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-4)' }}>
            <Lock size={18} color="var(--text-primary)" />
            <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Formulir Masuk Akun</h3>
          </div>

          <form onSubmit={handleSubmit}>
            {errorMsg && (
              <div style={{ 
                padding: 'var(--space-3)', 
                background: '#fef2f2', 
                border: '1px solid #fecaca', 
                borderRadius: 'var(--radius-sm)', 
                color: '#991b1b', 
                fontSize: '13px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                marginBottom: 'var(--space-4)' 
              }}>
                <AlertCircle size={16} />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email Pengguna</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  required
                  placeholder="superadmin@creative.id"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Default Super Admin: <strong>superadmin@creative.id</strong>
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">Kata Sandi (Password)</label>
              <input
                type="password"
                required
                placeholder="123123"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%' }}
              />
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Password bawaan: <strong>123123</strong>
              </span>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn btn-primary" 
              style={{ width: '100%', padding: '10px 0', marginTop: 'var(--space-2)' }}
            >
              {loading ? 'Memverifikasi...' : 'Masuk Sekarang →'}
            </button>
          </form>

          <div style={{ marginTop: 'var(--space-4)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-color)', fontSize: '12px', color: 'var(--text-secondary)' }}>
            Akun aktif saat ini: <strong>{currentUser.name}</strong> ({currentUser.email})
          </div>
        </div>

        {/* 1-Click Fast Role Switcher */}
        <div className="card" style={{ background: '#f8fafc' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-3)' }}>
            <Sparkles size={18} color="#2563eb" />
            <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Akses Instan Peran Demo (1-Click)</h3>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
            Klik profil di bawah untuk langsung mencoba tampilan dan wewenang masing-masing peran:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {users.map((u) => {
              const isCurrent = currentUser.id === u.id;
              return (
                <div
                  key={u.id}
                  onClick={() => handleSelectPreset(u.id)}
                  style={{
                    border: isCurrent ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '8px 12px',
                    cursor: 'pointer',
                    background: isCurrent ? '#ffffff' : 'var(--surface-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <img src={u.avatar} alt={u.name} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {u.name}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                        {u.role === 'super_admin' ? 'Super Admin' : u.role === 'campus_admin' ? 'Admin Kampus' : 'Anggota'} • <strong>{u.division}</strong> ({u.campus})
                      </div>
                    </div>
                  </div>
                  {isCurrent && <Check size={16} color="#059669" />}
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Ekosistem & Prinsip 6102 */}
      <div className="card" style={{ borderLeft: '4px solid var(--accent-primary)' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>
          Filosofi Utama: Centralized Direction, Decentralized Creativity
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          <strong>Yang Dipusatkan:</strong> Brand, Identitas Visual, Akun Media Resmi 6102, Major Campaign, Panduan Brand, dan Kendali Mutu (Quality Control).<br />
          <strong>Yang Didesentralisasikan:</strong> Talenta, Produksi Lokal, Ide Kreatif, Dokumentasi Acara, dan Konten Khas Kampus.
        </p>
      </div>

    </div>
  );
}
