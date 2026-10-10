'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Bell, Search, User, ChevronDown, Shield, LogOut, Check } from 'lucide-react';

export default function Topbar() {
  const { currentUser, switchUser, users } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'super_admin': return 'Super Admin Pusat';
      case 'campus_admin': return 'Admin Kampus';
      default: return 'Anggota Tim';
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
        {/* User Switcher Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              background: 'transparent',
              border: '1px solid var(--border-color)',
              padding: '4px 10px',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              color: 'var(--text-primary)',
            }}
          >
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name} 
              style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }}
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
                marginTop: '6px',
                width: '280px',
                background: 'var(--surface-color)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                zIndex: 50,
                overflow: 'hidden',
              }}
            >
              <div style={{ padding: '8px 12px', background: 'var(--bg-color)', borderBottom: '1px solid var(--border-color)', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                GANTI PERAN / AKUN AKTIF
              </div>

              <div style={{ maxHeight: '240px', overflowY: 'auto' }}>
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
                      <img src={u.avatar} alt={u.name} style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>{u.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                          {getRoleLabel(u.role)} ({u.division})
                        </div>
                      </div>
                    </div>
                    {currentUser.id === u.id && <Check size={14} color="#059669" />}
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', padding: '6px 12px', background: '#f8fafc' }}>
                <Link
                  href="/login"
                  onClick={() => setDropdownOpen(false)}
                  style={{ fontSize: '12px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Shield size={12} /> Halaman Kelola Login & Akun
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
