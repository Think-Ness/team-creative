'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Shield, Users, Check, Lock, Mail, ArrowRight, AlertCircle, Building2, UserCheck } from 'lucide-react';

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
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 'var(--space-8) var(--space-4)',
      backgroundColor: '#f8fafc',
    }}>
      
      {/* Brand Header */}
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)', maxWidth: '580px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <span style={{ 
            fontSize: '11px', 
            fontWeight: 700, 
            letterSpacing: '0.08em', 
            textTransform: 'uppercase',
            padding: '4px 12px',
            borderRadius: '9999px',
            backgroundColor: '#0f172a',
            color: '#ffffff'
          }}>
            6102 CREATIVE SYSTEM
          </span>
        </div>
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: 700, 
          color: '#0f172a', 
          letterSpacing: '-0.025em',
          lineHeight: 1.25,
          marginBottom: '8px'
        }}>
          Masuk ke Portal Ekosistem Kreatif
        </h1>
        <p style={{ fontSize: '14px', color: '#64748b', fontStyle: 'italic', margin: 0 }}>
          “Different Campuses. Different Talents. One Creative Direction.”
        </p>
      </div>

      {/* Main Dual Cards Container */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', 
        gap: 'var(--space-6)', 
        maxWidth: '920px', 
        width: '100%',
        marginBottom: 'var(--space-8)'
      }}>
        
        {/* Form Login Super Admin & Regular Accounts */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
          padding: 'var(--space-6)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 'var(--space-4)' }}>
              <div style={{ 
                width: '36px', 
                height: '36px', 
                borderRadius: '8px', 
                backgroundColor: '#f1f5f9', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: '#0f172a'
              }}>
                <Lock size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a', margin: 0 }}>Autentikasi Akun</h3>
                <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Super Admin, Admin Kampus, & Anggota</p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {errorMsg && (
                <div style={{ 
                  padding: '10px 14px', 
                  backgroundColor: '#fef2f2', 
                  border: '1px solid #fecaca', 
                  borderRadius: '6px', 
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

              <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
                <label className="form-label" style={{ fontSize: '13px', fontWeight: 500, color: '#334155' }}>
                  Email Pengguna
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    required
                    placeholder="superadmin@creative.id"
                    className="form-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', fontSize: '14px' }}
                  />
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                  Akun Super Admin: <strong>superadmin@creative.id</strong>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 'var(--space-5)' }}>
                <label className="form-label" style={{ fontSize: '13px', fontWeight: 500, color: '#334155' }}>
                  Kata Sandi (Password)
                </label>
                <input
                  type="password"
                  required
                  placeholder="123123"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', fontSize: '14px' }}
                />
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                  Password default: <strong>123123</strong>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="btn btn-primary" 
                style={{ 
                  width: '100%', 
                  padding: '12px 0', 
                  backgroundColor: '#0f172a',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '14px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'background-color 0.15s ease'
                }}
              >
                <span>{loading ? 'Memverifikasi...' : 'Masuk ke Sistem'}</span>
                <ArrowRight size={16} />
              </button>
            </form>
          </div>

          <div style={{ 
            marginTop: 'var(--space-6)', 
            paddingTop: 'var(--space-4)', 
            borderTop: '1px solid #e2e8f0', 
            fontSize: '12px', 
            color: '#64748b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span>Status sesi login:</span>
            <span style={{ fontWeight: 600, color: '#0f172a' }}>{currentUser.name}</span>
          </div>
        </div>

        {/* Demo Fast Switcher without any Star/Sparkle icons */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
          padding: 'var(--space-6)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 'var(--space-3)' }}>
            <div style={{ 
              width: '36px', 
              height: '36px', 
              borderRadius: '8px', 
              backgroundColor: '#eff6ff', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: '#2563eb'
            }}>
              <UserCheck size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a', margin: 0 }}>
                Simulasi Peran Multi-Kampus
              </h3>
              <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
                Pilih profil untuk menguji hak akses masing-masing level:
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: 'var(--space-4)' }}>
            {users.map((u) => {
              const isCurrent = currentUser.id === u.id;
              return (
                <div
                  key={u.id}
                  onClick={() => handleSelectPreset(u.id)}
                  style={{
                    border: isCurrent ? '2px solid #0f172a' : '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    cursor: 'pointer',
                    backgroundColor: isCurrent ? '#f8fafc' : '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img 
                      src={u.avatar} 
                      alt={u.name} 
                      style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} 
                    />
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>
                        {u.name}
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>
                        <span style={{ 
                          fontWeight: 600, 
                          color: u.role === 'super_admin' ? '#7c3aed' : u.role === 'campus_admin' ? '#2563eb' : '#059669' 
                        }}>
                          {u.role === 'super_admin' ? 'Super Admin' : u.role === 'campus_admin' ? 'Admin Kampus' : 'Anggota'}
                        </span>
                        {' • '}
                        {u.division} ({u.campus})
                      </div>
                    </div>
                  </div>
                  {isCurrent && (
                    <div style={{
                      backgroundColor: '#0f172a',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff'
                    }}>
                      <Check size={12} strokeWidth={3} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Blueprint Core Philosophy Note */}
      <div style={{
        maxWidth: '920px',
        width: '100%',
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderLeft: '4px solid #0f172a',
        borderRadius: '8px',
        padding: '16px 20px',
      }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a', marginBottom: '4px' }}>
          Filosofi Sistem: Centralized Direction, Decentralized Creativity
        </div>
        <p style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
          <strong>Pusat (Super Admin / Creative Lead):</strong> Mengatur Identitas Brand, Akun Instagram Resmi 6102, Major Campaign, Panduan Brand, dan Quality Control.<br />
          <strong>Kampus (Admin Kampus & Anggota):</strong> Memiliki otonomi penuh atas talenta lokal, ide cerita kampus, produksi lapangan, dan liputan acara.
        </p>
      </div>

    </div>
  );
}
