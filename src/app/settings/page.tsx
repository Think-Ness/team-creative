'use client';

import { useState } from 'react';
import { HardDrive, Database, ShieldCheck, Check, RefreshCw, ExternalLink } from 'lucide-react';

export default function SettingsPage() {
  const [seeding, setSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<string | null>(null);

  const handleSeedDatabase = async () => {
    setSeeding(true);
    setSeedResult(null);
    try {
      const res = await fetch('/api/seed', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setSeedResult('✓ Database berhasil diisi dengan data awal (seed dummy data). Silakan cek Dashboard!');
      } else {
        setSeedResult(`Info: ${data.message || data.error}`);
      }
    } catch (err: any) {
      setSeedResult(`Gagal seed: ${err.message}`);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>
          System Settings & Integrations
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Konfigurasi koneksi cloud Supabase, akun Google Drive pribadi OAuth2, dan preferensi organisasi.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        
        {/* 1. Google Drive Integration */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <HardDrive size={18} color="#2563eb" />
                <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Google Drive Personal OAuth2</h3>
                <span className="status-pill status-active" style={{ fontSize: '11px', padding: '1px 6px' }}>
                  Terkonfigurasi
                </span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Penyimpanan berkas aset master langsung di akun Google Drive pribadi Anda (bukan service account).
              </p>
            </div>

            <a 
              href="/api/auth/google" 
              className="btn btn-secondary" 
              style={{ fontSize: '12px', padding: '6px 12px' }}
            >
              <ExternalLink size={14} /> Hubungkan Akun Google
            </a>
          </div>

          <div style={{ 
            background: 'var(--bg-color)', 
            padding: 'var(--space-4)', 
            borderRadius: 'var(--radius-md)',
            fontSize: '12px',
            fontFamily: 'monospace',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-1)'
          }}>
            <div><strong>Client ID:</strong> 101469723242-5fe6ohchgob4f8ej9hlidb440j0sknsh.apps.googleusercontent.com</div>
            <div><strong>Redirect URI:</strong> http://localhost:3000/api/auth/google/callback</div>
            <div><strong>Status Kuota:</strong> 15 GB Penyimpanan Google Akun Pribadi Aktif</div>
          </div>
        </div>

        {/* 2. Supabase Database & Seeder */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <Database size={18} color="#059669" />
                <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Supabase PostgreSQL Database</h3>
                <span className="status-pill status-active" style={{ fontSize: '11px', padding: '1px 6px' }}>
                  Online
                </span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Backend database & Row Level Security (RLS) terhubung ke project Supabase Anda.
              </p>
            </div>

            <button
              onClick={handleSeedDatabase}
              disabled={seeding}
              className="btn btn-primary"
              style={{ fontSize: '12px', padding: '6px 14px' }}
            >
              <RefreshCw size={14} className={seeding ? 'spin' : ''} />
              {seeding ? 'Memproses Data...' : 'Isi Database Dummy (Seed)'}
            </button>
          </div>

          {seedResult && (
            <div style={{ 
              padding: 'var(--space-3)', 
              borderRadius: 'var(--radius-sm)', 
              fontSize: '13px',
              background: '#ecfdf5',
              color: '#065f46',
              border: '1px solid #a7f3d0',
              marginBottom: 'var(--space-4)'
            }}>
              {seedResult}
            </div>
          )}

          <div style={{ 
            background: 'var(--bg-color)', 
            padding: 'var(--space-4)', 
            borderRadius: 'var(--radius-md)',
            fontSize: '12px',
            fontFamily: 'monospace',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-1)'
          }}>
            <div><strong>Supabase Host:</strong> https://zggmsaisyhvzeasviryt.supabase.co</div>
            <div><strong>PostgreSQL Engine:</strong> Postgres 15+ dengan pgcrypto & RLS Policies</div>
            <div><strong>Total Tabel:</strong> 18 Core Tables + 25 Performance Indexes</div>
          </div>
        </div>

        {/* 3. Organization Profile */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
            <ShieldCheck size={18} />
            <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Organisasi & Hak Akses Tim</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', fontSize: '13px' }}>
            <div>
              <span className="metadata-text">NAMA ENTITAS</span>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
                6102 Creative Network
              </div>
            </div>

            <div>
              <span className="metadata-text">SLUG IDENTITAS</span>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
                creative-network
              </div>
            </div>

            <div>
              <span className="metadata-text">PERAN ANDA</span>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
                Owner & Head of Creative (Ahmad Fauzi)
              </div>
            </div>

            <div>
              <span className="metadata-text">CAKUPAN OPERASIONAL</span>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
                4 Kampus & 4 Unit Kreatif
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
