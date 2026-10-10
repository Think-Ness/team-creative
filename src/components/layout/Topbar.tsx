'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Bell, Search, User, ChevronDown, Shield, LogOut, Check } from 'lucide-react';

export default function Topbar() {
  const { currentUser, switchUser, users, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'super_admin': return 'Super Admin Pusat';
      case 'campus_admin': return 'Admin Kampus';
      default: return 'Anggota Tim';
    }
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  return (
    <header className="topbar" style={{ justifyContent: 'space-between', position: 'relative' }}>
      <div className="breadcrumbs" style={{ fontSize: '14px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>6102 Network</span>
        <span>/</span>
        <span suppressHydrationWarning style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{currentUser.campus}</span>
      </div>

      <div className="topbar-actions" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
        {/* User Switcher & Profile Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              background: 'transparent',
              border: '1px solid var(--border-color)',
              padding: '5px 12px',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              color: 'var(--text-primary)',
            }}
          >
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name} 
              style={{ width: '26px', height: '26px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
              <div suppressHydrationWarning style={{ fontSize: '13px', fontWeight: 600 }}>{currentUser.name}</div>
              <div suppressHydrationWarning style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                {getRoleLabel(currentUser.role)} • {currentUser.division}
              </div>
            </div>
            <ChevronDown size={14} color="var(--text-secondary)" />
          </button>

          {dropdownOpen && (
            <div 
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '8px',
                width: '320px',
                background: 'var(--surface-color)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                boxShadow: '0 12px 24px -4px rgba(0, 0, 0, 0.12)',
                zIndex: 50,
                overflow: 'hidden',
              }}
            >
              {/* Profile Card Header */}
              <div style={{ padding: '14px', background: '#f8fafc', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img 
                    src={currentUser.avatar} 
                    alt={currentUser.name} 
                    style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {currentUser.name}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                      {currentUser.email}
                    </div>
                    <div style={{ fontSize: '11px', color: '#2563eb', fontWeight: 500, marginTop: '2px' }}>
                      {currentUser.campus} • Divisi {currentUser.division}
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                  <Link
                    href="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="btn btn-primary"
                    style={{ flex: 1, fontSize: '12px', padding: '6px 10px', textAlign: 'center', justifyContent: 'center' }}
                  >
                    Profil & Riwayat Job
                  </Link>
                </div>
              </div>

              {/* Fast Role Switcher */}
              <div style={{ padding: '8px 12px', background: 'var(--bg-color)', borderBottom: '1px solid var(--border-color)', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                GANTI PERAN / KAMPUS LAIN (DEMO)
              </div>

              <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {users.map((u) => (
                  <div
                    key={u.id}
                    onClick={() => {
                      switchUser(u.id);
                      setDropdownOpen(false);
                    }}
                    style={{
                      padding: '8px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      background: currentUser.id === u.id ? '#f1f5f9' : 'transparent',
                      borderBottom: '1px solid #f8fafc',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <img src={u.avatar} alt={u.name} style={{ width: '26px', height: '26px', borderRadius: '50%', objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-primary)' }}>{u.name}</div>
                        <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                          {getRoleLabel(u.role)} • {u.division}
                        </div>
                      </div>
                    </div>
                    {currentUser.id === u.id && <Check size={14} color="#059669" />}
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div style={{ borderTop: '1px solid var(--border-color)', padding: '8px 12px', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link
                  href="/login"
                  onClick={() => setDropdownOpen(false)}
                  style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Shield size={13} /> Login Form
                </Link>

                <button
                  onClick={handleLogout}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#dc2626',
                    fontSize: '12px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 6px',
                  }}
                >
                  <LogOut size={13} /> Keluar (Logout)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
