'use client';

import { useState } from 'react';
import { Activity, ShieldCheck, Clock, User, Filter } from 'lucide-react';

interface ActivityLog {
  id: string;
  actor: string;
  action: string;
  target: string;
  timestamp: string;
  category: 'project' | 'content' | 'approval' | 'asset' | 'system';
}

const INITIAL_LOGS: ActivityLog[] = [
  { id: '1', actor: 'Ahmad Fauzi', action: 'menyetujui pengajuan approval', target: 'Brand Guidelines Booklet v2.1', timestamp: '10 Okt 2026, 21:15 WIB', category: 'approval' },
  { id: '2', actor: 'Budi Wicaksono', action: 'menyelesaikan tugas', target: 'Finalisasi Color Palette & Typography Tokens (Figma)', timestamp: '10 Okt 2026, 20:45 WIB', category: 'project' },
  { id: '3', actor: 'Reza Pratama', action: 'mengunggah berkas ke Google Drive', target: 'Teaser_Ramadhan_Cut_01.mp4', timestamp: '10 Okt 2026, 18:30 WIB', category: 'asset' },
  { id: '4', actor: 'Siti Sarah', action: 'membuat proyek baru', target: 'Ramadhan Creative Campaign: Berbagi Cahaya', timestamp: '10 Okt 2026, 16:10 WIB', category: 'project' },
  { id: '5', actor: 'Dewi Lestari', action: 'mempublikasikan konten', target: 'Carousel IG: 5 Prinsip Visual Design 6102', timestamp: '10 Okt 2026, 14:00 WIB', category: 'content' },
  { id: '6', actor: 'System', action: 'menjalankan sinkronisasi database', target: 'Supabase PostgreSQL Migration 0000', timestamp: '10 Okt 2026, 13:22 WIB', category: 'system' },
];

export default function ActivityPage() {
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all'
    ? INITIAL_LOGS
    : INITIAL_LOGS.filter(l => l.category === filter);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>
          Audit Trail & Activity Stream
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Jejak riwayat operasional, perubahan status, dan interaksi seluruh anggota tim.
        </p>
      </div>

      <div className="filter-pills">
        {['all', 'project', 'content', 'approval', 'asset', 'system'].map((cat) => (
          <button
            key={cat}
            className={`filter-pill ${filter === cat ? 'active' : ''}`}
            onClick={() => setFilter(cat)}
          >
            {cat === 'all' ? 'Semua Log' : cat.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="card">
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {filtered.map((log, index) => (
            <div 
              key={log.id} 
              style={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                gap: 'var(--space-4)',
                padding: 'var(--space-4) 0',
                borderBottom: index < filtered.length - 1 ? '1px solid var(--border-color)' : 'none'
              }}
            >
              <div style={{ 
                width: '36px', 
                height: '36px', 
                borderRadius: '50%', 
                background: 'var(--bg-color)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Activity size={16} color="var(--text-primary)" />
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
                  <strong>{log.actor}</strong> {log.action}: <span style={{ fontWeight: 600 }}>{log.target}</span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={12} /> {log.timestamp} • <span className="badge" style={{ fontSize: '10px', textTransform: 'uppercase' }}>{log.category}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
