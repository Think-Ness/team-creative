'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  FolderOpen, 
  CheckSquare, 
  Clock, 
  CheckCircle2, 
  Plus, 
  ArrowUpRight, 
  Lightbulb,
  Calendar,
  Layers,
  TrendingUp
} from 'lucide-react';

export default function Dashboard() {
  const [stats] = useState({
    activeProjects: 3,
    pendingRequests: 4,
    openTasks: 5,
    pendingApprovals: 2,
  });

  const [activeProjects] = useState([
    {
      id: 'p0000000-0000-0000-0000-000000000001',
      name: 'Annual Brand Refresh & Design System 2026',
      code: 'PRJ-2026-001',
      unit: 'Brand & Visual Identity',
      progress: 65,
      dueDate: '30 Apr 2026',
      status: 'active',
      priority: 'high',
    },
    {
      id: 'p0000000-0000-0000-0000-000000000002',
      name: 'Ramadhan Creative Campaign: Berbagi Cahaya',
      code: 'PRJ-2026-002',
      unit: 'Motion & 3D Lab',
      progress: 25,
      dueDate: '25 Mar 2026',
      status: 'planning',
      priority: 'urgent',
    },
    {
      id: 'p0000000-0000-0000-0000-000000000003',
      name: 'Social Media Daily Editorial Sprint Q1',
      code: 'PRJ-2026-003',
      unit: 'Digital Publishing',
      progress: 80,
      dueDate: '31 Mar 2026',
      status: 'active',
      priority: 'medium',
    },
  ]);

  const [recentActivities] = useState([
    {
      id: 1,
      user: 'Ahmad Fauzi',
      action: 'menyetujui konten',
      target: 'Carousel IG: 5 Prinsip Visual Design 6102',
      time: '15 menit yang lalu',
      type: 'approval',
    },
    {
      id: 2,
      user: 'Budi Wicaksono',
      action: 'menyelesaikan tugas',
      target: 'Finalisasi Color Palette & Typography Tokens',
      time: '1 jam yang lalu',
      type: 'task',
    },
    {
      id: 3,
      user: 'Reza Pratama',
      action: 'mengunggah video ke Drive',
      target: 'Teaser_Ramadhan_Cut_01.mp4',
      time: '3 jam yang lalu',
      type: 'upload',
    },
    {
      id: 4,
      user: 'Dewi Lestari',
      action: 'mengajukan ide baru',
      target: 'Mini Seri Podcast: Behind the Canvas',
      time: '5 jam yang lalu',
      type: 'request',
    },
  ]);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Top Banner */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        marginBottom: 'var(--space-8)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
            <span className="status-pill status-active" style={{ fontSize: '11px', padding: '2px 8px' }}>
              6102 Multi-Campus Network
            </span>
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
            Creative Operations Control
          </h1>
          <p style={{ marginTop: '4px', fontSize: '14px', color: 'var(--text-secondary)' }}>
            Ringkasan progres produksi, antrean persetujuan, dan kolaborasi kreatif lintas kampus.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <Link href="/requests" className="btn btn-secondary">
            <Plus size={16} /> Ajukan Ide
          </Link>
          <Link href="/projects" className="btn btn-primary">
            <FolderOpen size={16} /> Buat Proyek
          </Link>
        </div>
      </div>

      {/* Metrics Stat Grid */}
      <div className="stat-grid">
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="stat-label">PROYEK AKTIF</span>
            <FolderOpen size={18} color="var(--text-secondary)" />
          </div>
          <div className="stat-value">{stats.activeProjects}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            2 sedang berjalan, 1 tahap perencanaan
          </div>
        </div>

        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="stat-label">USULAN KREATIF</span>
            <Lightbulb size={18} color="var(--text-secondary)" />
          </div>
          <div className="stat-value">{stats.pendingRequests}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            2 disetujui, 2 dalam telaah
          </div>
        </div>

        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="stat-label">TUGAS TERBUKA</span>
            <CheckSquare size={18} color="var(--text-secondary)" />
          </div>
          <div className="stat-value">{stats.openTasks}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            1 mendesak, 3 tenggat minggu ini
          </div>
        </div>

        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="stat-label">ANTREAN APPROVAL</span>
            <Clock size={18} color="#b45309" />
          </div>
          <div className="stat-value" style={{ color: '#b45309' }}>{stats.pendingApprovals}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Membutuhkan sign-off Creative Lead
          </div>
        </div>
      </div>

      {/* 2-Column Section: Active Projects & Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: 'var(--space-6)' }}>
        
        {/* Active Projects Card */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <div>
              <h3 className="section-title">Proyek Berjalan</h3>
              <p className="metadata-text">Target penyelesaian dan laju produksi</p>
            </div>
            <Link href="/projects" style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              Semua <ArrowUpRight size={14} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {activeProjects.map((proj) => (
              <div 
                key={proj.id} 
                style={{ 
                  padding: 'var(--space-4)', 
                  border: '1px solid var(--border-color)', 
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--surface-color)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{proj.code}</span>
                    <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
                      {proj.name}
                    </h4>
                  </div>
                  <span className={`status-pill status-${proj.status}`}>
                    {proj.status}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  <span>{proj.unit}</span>
                  <span>Tenggat: {proj.dueDate}</span>
                </div>

                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${proj.progress}%` }}></div>
                </div>
                <div style={{ textAlign: 'right', fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Progres: {proj.progress}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity & Approvals Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {/* Action Callout */}
          <div className="card" style={{ background: '#f8fafc', borderLeft: '4px solid var(--text-primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Persetujuan Konten Menunggu Tindakan
                </h4>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Video Teaser Ramadhan diajukan oleh Reza Pratama untuk review Creative Lead.
                </p>
              </div>
              <Link href="/approvals" className="btn btn-primary" style={{ fontSize: '13px', padding: '6px 14px' }}>
                Review Sekarang
              </Link>
            </div>
          </div>

          {/* Activity Stream */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <div>
                <h3 className="section-title">Aktivitas Tim Terkini</h3>
                <p className="metadata-text">Jejak koordinasi dan pembaruan berkas</p>
              </div>
              <Link href="/activity" style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                Log Lengkap <ArrowUpRight size={14} />
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {recentActivities.map((act) => (
                <div 
                  key={act.id} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    gap: 'var(--space-3)',
                    paddingBottom: 'var(--space-3)',
                    borderBottom: '1px solid var(--border-color)'
                  }}
                >
                  <div style={{ 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '50%', 
                    background: '#e2e8f0', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    flexShrink: 0
                  }}>
                    {act.user.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
                      <strong>{act.user}</strong> {act.action}: <em>{act.target}</em>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {act.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
