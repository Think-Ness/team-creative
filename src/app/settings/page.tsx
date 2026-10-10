'use client';

import { useState, useEffect } from 'react';
import { 
  FolderKanban, 
  Database, 
  ShieldCheck, 
  Check, 
  RefreshCw, 
  ExternalLink, 
  Bot, 
  FolderTree, 
  ArrowRight, 
  Layers, 
  Save, 
  KeyRound,
  Sparkles as _NoSparkles,
  Info,
  Building2,
  Workflow
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function SettingsPage() {
  const { currentUser } = useAuth();

  // Master Folder State
  const [masterFolderId, setMasterFolderId] = useState('11hIc4hsM-AfKwX_0nrCGNXv7G12Br8i8');
  const [savedFolderSuccess, setSavedFolderSuccess] = useState(false);

  // Database seed state
  const [seeding, setSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('majmu_folder_id');
    if (saved) {
      setMasterFolderId(saved);
    }
  }, []);

  const handleSaveMasterFolder = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('majmu_folder_id', masterFolderId.trim());
    setSavedFolderSuccess(true);
    setTimeout(() => setSavedFolderSuccess(false), 3000);
  };

  const handleSeedDatabase = async () => {
    setSeeding(true);
    setSeedResult(null);
    try {
      const res = await fetch('/api/seed', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setSeedResult('✓ Database berhasil diisi dengan data awal (seed dummy data). Silakan cek Dashboard, Calendar, dan Projects!');
      } else {
        setSeedResult(`Info: ${data.message || data.error}`);
      }
    } catch (err: any) {
      setSeedResult(`Gagal seed: ${err.message}`);
    } finally {
      setSeeding(false);
    }
  };

  const isSuperAdmin = currentUser.role === 'super_admin';

  return (
    <div style={{ maxWidth: '1040px', margin: '0 auto', paddingBottom: 'var(--space-12)' }}>
      {/* Header Banner */}
      <div style={{ 
        marginBottom: 'var(--space-8)',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        color: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-6) var(--space-8)',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ 
                backgroundColor: '#7c3aed', 
                color: '#ffffff', 
                fontSize: '11px', 
                fontWeight: 700, 
                padding: '2px 8px', 
                borderRadius: '4px',
                letterSpacing: '0.5px'
              }}>
                SUPER ADMIN CONTROLLER
              </span>
              <span style={{ fontSize: '13px', color: '#94a3b8' }}>6102 Creative Blueprint Ecosystem</span>
            </div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#ffffff', margin: 0 }}>
              Pusat Pengaturan & Ekosistem Sistem
            </h1>
            <p style={{ fontSize: '14px', color: '#cbd5e1', marginTop: '6px', maxWidth: '640px', lineHeight: 1.5 }}>
              Konfigurasi penyimpanan terpusat <strong>Folder Majmu&apos;</strong>, otomatisasi Google Cloud Bot, 
              kebijakan integrasi multi-kampus, dan alur konversi workflow.
            </p>
          </div>

          <div style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.08)', 
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 18px',
            textAlign: 'right'
          }}>
            <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Otoritas Aktif</div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#f8fafc', marginTop: '2px' }}>
              {currentUser.name}
            </div>
            <div style={{ fontSize: '12px', color: '#38bdf8' }}>
              {isSuperAdmin ? 'Penguasa Penuh (Super Admin)' : 'Admin Kampus / Member'}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        
        {/* 1. Google Drive Master: Folder Majmu' 6102 & Service Account */}
        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)', marginBottom: 'var(--space-5)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FolderKanban size={20} color="#2563eb" />
                <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                  Folder Majmu&apos; 6102 & Bot Service Account
                </h2>
                <span className="status-pill status-active" style={{ fontSize: '11px', padding: '2px 8px' }}>
                  Auto-Sync Aktif
                </span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '6px', maxWidth: '720px' }}>
                Satu folder induk di Google Drive untuk seluruh dokumen & gambar website. Semua upload gambar di menu 
                <strong> Content, Tasks, Projects, dan Requests</strong> otomatis tersimpan rapi tanpa perlu meminta ID folder setiap saat.
              </p>
            </div>

            <a 
              href={`https://drive.google.com/drive/folders/${masterFolderId}`} 
              target="_blank" 
              rel="noreferrer" 
              className="btn btn-secondary" 
              style={{ fontSize: '12px', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <ExternalLink size={14} /> Buka Folder Majmu&apos; di Drive
            </a>
          </div>

          {/* Form Setup ID Folder Majmu' */}
          <form onSubmit={handleSaveMasterFolder} style={{ 
            backgroundColor: '#f8fafc', 
            border: '1px solid var(--border-color)', 
            borderRadius: 'var(--radius-md)', 
            padding: 'var(--space-5)',
            marginBottom: 'var(--space-5)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                ID Folder Induk Master (Folder Majmu&apos; ID)
              </label>
              <span style={{ fontSize: '11px', color: '#64748b' }}>
                Folder tempat bot mengalirkan seluruh berkas
              </span>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <input 
                type="text" 
                value={masterFolderId}
                onChange={(e) => setMasterFolderId(e.target.value)}
                placeholder="Masukkan Google Drive Folder ID, misal: 11hIc4hsM-AfKwX_0nrCGNXv7G12Br8i8"
                className="form-input"
                style={{ flex: 1, minWidth: '280px', fontFamily: 'monospace', fontSize: '13px' }}
                required
              />
              <button 
                type="submit" 
                className="btn btn-primary"
                style={{ fontSize: '13px', padding: '8px 18px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Save size={14} /> Simpan ID Folder
              </button>
            </div>

            {savedFolderSuccess && (
              <div style={{ 
                marginTop: '10px', 
                fontSize: '12px', 
                color: '#15803d', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px' 
              }}>
                <Check size={14} /> ID Folder Majmu&apos; berhasil disimpan dan ditetapkan sebagai default upload seluruh sistem!
              </div>
            )}
          </form>

          {/* Service Account Bot Card */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: 'var(--space-4)',
            marginBottom: 'var(--space-5)'
          }}>
            <div style={{ 
              border: '1px solid #e2e8f0', 
              borderRadius: 'var(--radius-md)', 
              padding: '14px', 
              backgroundColor: '#ffffff' 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <Bot size={16} color="#7c3aed" />
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase' }}>
                  Google Bot Service Account
                </span>
              </div>
              <div style={{ fontSize: '13px', fontFamily: 'monospace', color: '#1e293b', wordBreak: 'break-all' }}>
                creative6102@creative6102.iam.gserviceaccount.com
              </div>
              <p style={{ fontSize: '11px', color: '#64748b', marginTop: '6px', margin: 0 }}>
                Bot otomatis yang mengunggah gambar langsung dengan Service Account Key JSON resmi.
              </p>
            </div>

            <div style={{ 
              border: '1px solid #e2e8f0', 
              borderRadius: 'var(--radius-md)', 
              padding: '14px', 
              backgroundColor: '#ffffff' 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <KeyRound size={16} color="#059669" />
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#059669', textTransform: 'uppercase' }}>
                  Autentikasi & Keamanan Kunci
                </span>
              </div>
              <div style={{ fontSize: '13px', fontFamily: 'monospace', color: '#1e293b' }}>
                Project: <code>creative6102</code> • Key: <code>1b45bbbf21...</code>
              </div>
              <p style={{ fontSize: '11px', color: '#64748b', marginTop: '6px', margin: 0 }}>
                Akses terenkripsi JWT RSA-256 langsung ke Google Drive API v3.
              </p>
            </div>
          </div>

          {/* Sub-folder Hierarchy within Majmu' */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <FolderTree size={16} color="#475569" />
              <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', margin: 0, textTransform: 'uppercase' }}>
                Struktur Sub-Folder di Dalam Folder Majmu&apos; (Otomatis Rapih)
              </h4>
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
              gap: '8px',
              fontSize: '12px'
            }}>
              <div style={{ padding: '8px 12px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <strong>📁 01_REQUESTS</strong>
                <div style={{ color: '#64748b', fontSize: '11px', marginTop: '2px' }}>Materi pengajuan kampus awal</div>
              </div>
              <div style={{ padding: '8px 12px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <strong>📁 02_PROJECTS</strong>
                <div style={{ color: '#64748b', fontSize: '11px', marginTop: '2px' }}>Master project & blueprint 6102</div>
              </div>
              <div style={{ padding: '8px 12px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <strong>📁 03_TASKS</strong>
                <div style={{ color: '#64748b', fontSize: '11px', marginTop: '2px' }}>Draft kerja harian 8 divisi teknis</div>
              </div>
              <div style={{ padding: '8px 12px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <strong>📁 04_CONTENT</strong>
                <div style={{ color: '#64748b', fontSize: '11px', marginTop: '2px' }}>Konten feed, reels, & carousels</div>
              </div>
              <div style={{ padding: '8px 12px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <strong>📁 05_APPROVALS</strong>
                <div style={{ color: '#64748b', fontSize: '11px', marginTop: '2px' }}>File kurasi & Quality Control</div>
              </div>
              <div style={{ padding: '8px 12px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <strong>📁 06_ASSETS</strong>
                <div style={{ color: '#64748b', fontSize: '11px', marginTop: '2px' }}>Logo 6102, Font resmi, & LUT warna</div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Workflow Guide: Setelah Request Disetujui, Apa Selanjutnya? */}
        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-2)' }}>
            <Workflow size={20} color="#7c3aed" />
            <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              Alur Kerja Ekosistem: Setelah Request Disetujui, Apa Selanjutnya?
            </h2>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: 'var(--space-5)' }}>
            Prinsip utama 6102: <em>Centralized Direction, Decentralized Creativity</em>. Berikut adalah alur perpindahan karya setelah request disetujui:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
            
            {/* Step 1 */}
            <div style={{ 
              border: '1px solid #e2e8f0', 
              borderRadius: 'var(--radius-md)', 
              padding: '16px',
              backgroundColor: '#faf5ff'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase' }}>
                  LANGKAH 01 — SUBMISSION
                </span>
                <span className="status-pill status-draft" style={{ fontSize: '11px' }}>Status: Pending</span>
              </div>
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
                Admin Kampus Mengajukan Request
              </h4>
              <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                Kampus mengisi kebutuhan liputan, desain, atau publikasi di menu <strong>Requests</strong> beserta referensi & file kerja.
              </p>
            </div>

            {/* Step 2 */}
            <div style={{ 
              border: '1px solid #bbf7d0', 
              borderRadius: 'var(--radius-md)', 
              padding: '16px',
              backgroundColor: '#f0fdf4'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#166534', textTransform: 'uppercase' }}>
                  LANGKAH 02 — DISETUJUI
                </span>
                <span className="status-pill status-active" style={{ fontSize: '11px' }}>Status: Accepted</span>
              </div>
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
                Super Admin / Council Menyetujui
              </h4>
              <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                Super Admin mengevaluasi keselarasan dengan brand 6102. Begitu disetujui, tombol <strong>&ldquo;Lanjut: Buat Proyek&rdquo;</strong> akan aktif.
              </p>
            </div>

            {/* Step 3 */}
            <div style={{ 
              border: '1px solid #bfdbfe', 
              borderRadius: 'var(--radius-md)', 
              padding: '16px',
              backgroundColor: '#eff6ff'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#1e40af', textTransform: 'uppercase' }}>
                  LANGKAH 03 — KONVERSI KE PROYEK
                </span>
                <Link href="/requests" style={{ fontSize: '11px', color: '#2563eb', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px' }}>
                  Buka Requests <ArrowRight size={11} />
                </Link>
              </div>
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
                1-Klik Jadi Proyek Eksekusi
              </h4>
              <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                Klik tombol <strong>&ldquo;Lanjut: Buat Proyek&rdquo;</strong> di card request yang diterima. Sistem otomatis mengisi form Proyek baru dengan data brief kampus.
              </p>
            </div>

            {/* Step 4 */}
            <div style={{ 
              border: '1px solid #e2e8f0', 
              borderRadius: 'var(--radius-md)', 
              padding: '16px',
              backgroundColor: '#ffffff'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                  LANGKAH 04 — TASKS & EKSEKUSI
                </span>
                <Link href="/tasks" style={{ fontSize: '11px', color: '#2563eb', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px' }}>
                  Buka Tasks <ArrowRight size={11} />
                </Link>
              </div>
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
                Pembagian Tugas ke 8 Divisi
              </h4>
              <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                Proyek dipecah menjadi tasks spesifik untuk tim Graphic Design, Copywriting, Film, Musik, atau Fotografi lintas kampus.
              </p>
            </div>

            {/* Step 5 */}
            <div style={{ 
              border: '1px solid #fef3c7', 
              borderRadius: 'var(--radius-md)', 
              padding: '16px',
              backgroundColor: '#fffbeb'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#92400e', textTransform: 'uppercase' }}>
                  LANGKAH 05 — APPROVAL & QC
                </span>
                <Link href="/approvals" style={{ fontSize: '11px', color: '#d97706', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px' }}>
                  Buka Approvals <ArrowRight size={11} />
                </Link>
              </div>
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
                Gatekeeper Kurasi Kualitas
              </h4>
              <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                Hasil karya direview melalui 3 filter kurasi (Visual QC, Content QC, Brand Integrity). Anggota tim dapat memberi komentar revisi pin.
              </p>
            </div>

            {/* Step 6 */}
            <div style={{ 
              border: '1px solid #e0e7ff', 
              borderRadius: 'var(--radius-md)', 
              padding: '16px',
              backgroundColor: '#eef2ff'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#3730a3', textTransform: 'uppercase' }}>
                  LANGKAH 06 — PUBLISH ONE INSTAGRAM
                </span>
                <Link href="/calendar" style={{ fontSize: '11px', color: '#4f46e5', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px' }}>
                  Buka Kalender <ArrowRight size={11} />
                </Link>
              </div>
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
                Jadwal & Penayangan Resmi
              </h4>
              <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                Setelah Approved, konten masuk ke Kalender Editorial dan ditayangkan di One Official Instagram 6102 dengan arsip di Folder Majmu&apos;.
              </p>
            </div>

          </div>
        </div>

        {/* 3. Supabase Database & Data Seeder */}
        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Database size={18} color="#059669" />
                <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>
                  Supabase PostgreSQL Cloud Database
                </h3>
                <span className="status-pill status-active" style={{ fontSize: '11px', padding: '1px 6px' }}>
                  Online
                </span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Database relasional Supabase untuk menyimpan proyek, task, anggota, approval komentar, dan riwayat kegiatan.
              </p>
            </div>

            <button
              onClick={handleSeedDatabase}
              disabled={seeding}
              className="btn btn-primary"
              style={{ fontSize: '12px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <RefreshCw size={14} className={seeding ? 'spin' : ''} />
              {seeding ? 'Mengisi Data Dummy...' : 'Isi Database Dummy (Seed)'}
            </button>
          </div>

          {seedResult && (
            <div style={{ 
              padding: '12px 16px', 
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
            gap: '6px',
            border: '1px solid var(--border-color)'
          }}>
            <div><strong>Host Project:</strong> https://zggmsaisyhvzeasviryt.supabase.co</div>
            <div><strong>Tabel Utama:</strong> projects, tasks, requests, users, campuses, divisions, calendar_events, comments</div>
            <div><strong>Row Level Security:</strong> Super Admin (Bypass), Admin Kampus (Per-Kampus), Member (Read/Work)</div>
          </div>
        </div>

        {/* 4. Multi-Campus Governance & Authority */}
        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-4)' }}>
            <Building2 size={18} color="#2563eb" />
            <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>
              Cakupan 4 Hub Kampus & Wewenang Super Admin
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-3)', fontSize: '12px' }}>
            <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>🏛️ Kampus Utama Jakarta</div>
              <div style={{ color: '#64748b', marginTop: '2px' }}>PIC: Budi Santoso (Admin Kampus)</div>
              <div style={{ color: '#2563eb', fontWeight: 500, marginTop: '2px' }}>Fokus: Creative Management & Graphic</div>
            </div>

            <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>🏛️ Kampus Bandung Hub</div>
              <div style={{ color: '#64748b', marginTop: '2px' }}>PIC: Siti Rahma (Admin Kampus)</div>
              <div style={{ color: '#2563eb', fontWeight: 500, marginTop: '2px' }}>Fokus: Film Production & Sinematografi</div>
            </div>

            <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>🏛️ Kampus Surabaya Studio</div>
              <div style={{ color: '#64748b', marginTop: '2px' }}>PIC: Hendra Wijaya (Admin Kampus)</div>
              <div style={{ color: '#2563eb', fontWeight: 500, marginTop: '2px' }}>Fokus: Copywriting & Content Narrative</div>
            </div>

            <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>🏛️ Kampus Yogyakarta Creative</div>
              <div style={{ color: '#64748b', marginTop: '2px' }}>PIC: Dewi Lestari (Admin Kampus)</div>
              <div style={{ color: '#2563eb', fontWeight: 500, marginTop: '2px' }}>Fokus: Music Production & Audio Design</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
