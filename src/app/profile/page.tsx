'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { 
  User, 
  Mail, 
  Building2, 
  Layers, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  ExternalLink, 
  Edit3, 
  Shield, 
  Briefcase, 
  Award, 
  Check, 
  ChevronRight,
  Sparkles as _NoSparkles,
  Camera,
  FolderOpen
} from 'lucide-react';

interface JobRecord {
  id: string;
  title: string;
  project: string;
  role: string;
  division: string;
  campus: string;
  status: 'done' | 'in_progress' | 'review';
  dueDate: string;
  completedDate?: string;
  deliverableLink?: string;
  notes?: string;
}

const DEFAULT_JOBS: Record<string, JobRecord[]> = {
  'usr-super-admin': [
    {
      id: 'job-001',
      title: 'Penyusunan Master Direction & Blueprint 6102 Creative System',
      project: '6102 Creative Blueprint',
      role: 'Creative Director / Lead',
      division: 'Creative Management',
      campus: 'Kantor Pusat / Multi-Kampus',
      status: 'done',
      dueDate: '2026-02-15',
      completedDate: '2026-02-14',
      deliverableLink: 'https://drive.google.com/file/d/11hIc4hsM-AfKwX_0nrCGNXv7G12Br8i8/view?usp=sharing',
      notes: 'Disahkan melalui musyawarah Creative Council lintas kampus.',
    },
    {
      id: 'job-002',
      title: 'Review Akhir & Final Approval Desain Logo Angkatan 6102',
      project: 'Logo Angkatan 6102',
      role: 'Council Lead Approver',
      division: 'Creative Management',
      campus: 'Kantor Pusat / Multi-Kampus',
      status: 'review',
      dueDate: '2026-03-01',
      deliverableLink: 'https://drive.google.com/file/d/1HMsNgOkbZA_rl3NxshxFLEapHdI8UZvu/view?usp=sharing',
      notes: 'Sedang dalam tahap review visual QC & representasi multi-kampus.',
    },
    {
      id: 'job-003',
      title: 'Kurasi Konten Tier 01 Official Announcement 2026',
      project: 'Official Media Campaign',
      role: 'Head of Quality Control',
      division: 'Creative Management',
      campus: 'Kantor Pusat / Multi-Kampus',
      status: 'done',
      dueDate: '2026-02-25',
      completedDate: '2026-02-24',
      deliverableLink: 'https://drive.google.com/file/d/1MjmEUVo6IXKyFY5QJBnjGuSih7Puj9yf/view?usp=sharing',
      notes: 'Diterbitkan di akun resmi 6102 Instagram.',
    },
  ],
  'usr-admin-bdg': [
    {
      id: 'job-004',
      title: 'Storyboard & Directing Teaser Ramadhan 30 Detik',
      project: 'Ramadhan Campaign 1448H',
      role: 'Video Director',
      division: 'Film Production',
      campus: 'Kampus Bandung Hub',
      status: 'review',
      dueDate: '2026-02-28',
      deliverableLink: 'https://drive.google.com/file/d/11hIc4hsM-AfKwX_0nrCGNXv7G12Br8i8/view?usp=sharing',
      notes: 'Animatic sudah masuk tahap review internal.',
    },
    {
      id: 'job-005',
      title: 'Liputan Sinematik Pameran Seni Bandung Hub (Aftermovie)',
      project: 'Campus Story Bandung',
      role: 'Director of Photography',
      division: 'Camera & Editorial',
      campus: 'Kampus Bandung Hub',
      status: 'done',
      dueDate: '2026-02-18',
      completedDate: '2026-02-17',
      deliverableLink: 'https://drive.google.com/file/d/1_MPbH-P3owSm0QLS11AwbWziF3nzBCJG/view?usp=sharing',
      notes: 'Color grading menggunakan LUT resmi 6102.',
    },
    {
      id: 'job-006',
      title: 'Registrasi & Seleksi 5 Talenta Baru Kampus Bandung',
      project: 'Talent Pool Onboarding',
      role: 'Admin Kampus PIC',
      division: 'Creative Management',
      campus: 'Kampus Bandung Hub',
      status: 'done',
      dueDate: '2026-02-10',
      completedDate: '2026-02-09',
      notes: 'Talenta fotografer dan motion designer siap kolaborasi lintas kampus.',
    },
  ],
  'usr-member-design': [
    {
      id: 'job-007',
      title: 'Finalisasi Color Palette & Typography Tokens (Figma Master)',
      project: 'Brand Refresh 2026',
      role: 'Lead Visual Designer',
      division: 'Graphic Design',
      campus: 'Kampus Utama Jakarta',
      status: 'done',
      dueDate: '2026-02-20',
      completedDate: '2026-02-19',
      deliverableLink: 'https://drive.google.com/file/d/1HMsNgOkbZA_rl3NxshxFLEapHdI8UZvu/view?usp=sharing',
      notes: 'Sesuai dengan 5 warna primer dan sekunder panduan brand.',
    },
    {
      id: 'job-008',
      title: 'Susun Booklet Brand Guidelines 2026 PDF',
      project: 'Brand Refresh 2026',
      role: 'Layout Specialist',
      division: 'Graphic Design',
      campus: 'Kampus Utama Jakarta',
      status: 'in_progress',
      dueDate: '2026-03-05',
      deliverableLink: 'https://drive.google.com/file/d/1MjmEUVo6IXKyFY5QJBnjGuSih7Puj9yf/view?usp=sharing',
      notes: 'Mencakup aturan logo usage, do & donts, dan grid media sosial.',
    },
    {
      id: 'job-009',
      title: 'Desain Banner & Merchandise Panggung Gembira (PG 6102)',
      project: 'Panggung Gembira 6102',
      role: 'Graphic Designer',
      division: 'Graphic Design',
      campus: 'Kampus Utama Jakarta',
      status: 'in_progress',
      dueDate: '2026-03-12',
      notes: 'Mockup kaos, lanyard, dan backdrop panggung utama.',
    },
  ],
  'usr-member-copy': [
    {
      id: 'job-010',
      title: 'Draft Copywriting 10 Slide Carousel Tren Desain AI',
      project: 'Editorial Sprint Q1',
      role: 'Senior Copywriter',
      division: 'Copywriting',
      campus: 'Kampus Surabaya Studio',
      status: 'in_progress',
      dueDate: '2026-03-02',
      notes: 'Fokus pada sudut pandang kolaborasi manusia dan integritas karya.',
    },
    {
      id: 'job-011',
      title: 'Takarir Resmi (Caption) Peluncuran Logo Angkatan 6102',
      project: 'Logo Angkatan 6102',
      role: 'Brand Voice Writer',
      division: 'Copywriting',
      campus: 'Kampus Surabaya Studio',
      status: 'done',
      dueDate: '2026-02-22',
      completedDate: '2026-02-21',
      notes: 'Ditinjau oleh Creative Lead untuk tone of voice angkatan.',
    },
  ],
  'usr-admin-jkt': [
    {
      id: 'job-012',
      title: 'Koordinasi Produksi Media & Jadwal Liputan Jakarta',
      project: 'Creative Management JKT',
      role: 'Admin Kampus PIC',
      division: 'Creative Management',
      campus: 'Kampus Utama Jakarta',
      status: 'done',
      dueDate: '2026-02-15',
      completedDate: '2026-02-14',
      notes: 'Memastikan 1 PIC per campus siap mengawal pengajuan konten.',
    },
    {
      id: 'job-013',
      title: 'Submission Creative Request: Liputan Workshop Nasional',
      project: 'Event Coverage 6102',
      role: 'Event Liaison',
      division: 'Event Coordinator',
      campus: 'Kampus Utama Jakarta',
      status: 'review',
      dueDate: '2026-03-04',
      deliverableLink: 'https://drive.google.com/file/d/1_MPbH-P3owSm0QLS11AwbWziF3nzBCJG/view?usp=sharing',
      notes: 'Menunggu review alokasi tim kamera dari Bandung.',
    },
  ],
};

export default function ProfilePage() {
  const { currentUser, updateUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'jobs' | 'edit' | 'governance'>('jobs');
  const [filterStatus, setFilterStatus] = useState<'all' | 'done' | 'in_progress' | 'review'>('all');

  // Edit form state
  const [name, setName] = useState(currentUser.name);
  const [campus, setCampus] = useState(currentUser.campus);
  const [division, setDivision] = useState(currentUser.division);
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [bio, setBio] = useState('Anggota aktif ekosistem kolaborasi kreatif 6102. Mengutamakan kolaborasi di atas ego.');
  const [portfolioLink, setPortfolioLink] = useState('https://drive.google.com/drive/folders/sample');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Retrieve user's jobs or fallback
  const userJobs: JobRecord[] = DEFAULT_JOBS[currentUser.id] || [
    {
      id: `job-custom-${currentUser.id}`,
      title: `Penugasan Proyek Aktif — ${currentUser.division}`,
      project: 'Proyek Divisi Kreatif 6102',
      role: currentUser.role === 'super_admin' ? 'Super Admin Lead' : currentUser.role === 'campus_admin' ? 'Admin Kampus PIC' : 'Spesialis Divisi',
      division: currentUser.division,
      campus: currentUser.campus,
      status: 'in_progress',
      dueDate: '2026-03-15',
      notes: 'Tugas sedang berjalan sesuai arahan Creative Management.',
    },
  ];

  const filteredJobs = userJobs.filter((job) => {
    if (filterStatus === 'all') return true;
    return job.status === filterStatus;
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(currentUser.id, {
      name,
      campus,
      division: division as any,
      avatar,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const completedCount = userJobs.filter(j => j.status === 'done').length;
  const inProgressCount = userJobs.filter(j => j.status === 'in_progress').length;
  const reviewCount = userJobs.filter(j => j.status === 'review').length;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* Profile Header Banner */}
      <div className="card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)' }}>
            <div style={{ position: 'relative' }}>
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name} 
                style={{ width: '84px', height: '84px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--surface-color)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} 
              />
              <div style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                backgroundColor: '#10b981',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                border: '2px solid #ffffff'
              }} title="Online / Aktif" />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  {currentUser.name}
                </h1>
                <span className={`status-pill ${currentUser.role === 'super_admin' ? 'status-active' : 'status-draft'}`} style={{ fontSize: '11px', textTransform: 'uppercase' }}>
                  {currentUser.role === 'super_admin' ? 'Super Admin Pusat' : currentUser.role === 'campus_admin' ? 'Admin Kampus' : 'Anggota Divisi'}
                </span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 6px 0' }}>
                {currentUser.email} • ID: <code style={{ fontSize: '12px' }}>{currentUser.id}</code>
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '12px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: '#f1f5f9', padding: '3px 8px', borderRadius: '4px', color: '#334155' }}>
                  <Building2 size={13} /> {currentUser.campus}
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: '#eff6ff', padding: '3px 8px', borderRadius: '4px', color: '#1d4ed8', fontWeight: 500 }}>
                  <Layers size={13} /> Divisi {currentUser.division}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={() => setActiveTab('jobs')}
              className={`btn ${activeTab === 'jobs' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '13px', padding: '8px 14px' }}
            >
              <Briefcase size={14} style={{ marginRight: '6px' }} />
              Riwayat Job ({userJobs.length})
            </button>
            <button 
              onClick={() => setActiveTab('edit')}
              className={`btn ${activeTab === 'edit' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '13px', padding: '8px 14px' }}
            >
              <Edit3 size={14} style={{ marginRight: '6px' }} />
              Edit Profil
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
          gap: 'var(--space-4)', 
          marginTop: 'var(--space-6)', 
          paddingTop: 'var(--space-5)', 
          borderTop: '1px solid var(--border-color)' 
        }}>
          <div style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>TOTAL PEKERJAAN</div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>{userJobs.length}</div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>Tercatat di sistem 6102</div>
          </div>

          <div style={{ padding: '12px', backgroundColor: '#f0fdf4', borderRadius: '8px' }}>
            <div style={{ fontSize: '11px', color: '#166534', fontWeight: 600 }}>SELESAI (DONE)</div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: '#15803d', marginTop: '2px' }}>{completedCount}</div>
            <div style={{ fontSize: '11px', color: '#166534', marginTop: '2px' }}>Telah diarsipkan / terbit</div>
          </div>

          <div style={{ padding: '12px', backgroundColor: '#eff6ff', borderRadius: '8px' }}>
            <div style={{ fontSize: '11px', color: '#1e40af', fontWeight: 600 }}>SEDANG BERJALAN</div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: '#2563eb', marginTop: '2px' }}>{inProgressCount}</div>
            <div style={{ fontSize: '11px', color: '#1e40af', marginTop: '2px' }}>Fase produksi & editing</div>
          </div>

          <div style={{ padding: '12px', backgroundColor: '#fffbeb', borderRadius: '8px' }}>
            <div style={{ fontSize: '11px', color: '#92400e', fontWeight: 600 }}>DALAM REVIEW / QC</div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: '#d97706', marginTop: '2px' }}>{reviewCount}</div>
            <div style={{ fontSize: '11px', color: '#92400e', marginTop: '2px' }}>Menunggu approval</div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-color)', marginBottom: 'var(--space-6)' }}>
        <button
          onClick={() => setActiveTab('jobs')}
          style={{
            padding: '10px 16px',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'jobs' ? '2px solid var(--accent-primary)' : '2px solid transparent',
            color: activeTab === 'jobs' ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'jobs' ? 600 : 400,
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Briefcase size={16} /> Riwayat Job & Tugas ({userJobs.length})
        </button>
        <button
          onClick={() => setActiveTab('edit')}
          style={{
            padding: '10px 16px',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'edit' ? '2px solid var(--accent-primary)' : '2px solid transparent',
            color: activeTab === 'edit' ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'edit' ? 600 : 400,
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Edit3 size={16} /> Pengaturan Profil
        </button>
        <button
          onClick={() => setActiveTab('governance')}
          style={{
            padding: '10px 16px',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'governance' ? '2px solid var(--accent-primary)' : '2px solid transparent',
            color: activeTab === 'governance' ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'governance' ? 600 : 400,
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Shield size={16} /> Wewenang Akun (Blueprint 6102)
        </button>
      </div>

      {/* Tab Content 1: Job History */}
      {activeTab === 'jobs' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                Riwayat Portofolio Kerja & Penugasan
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
                Setiap project dan tugas yang pernah dikerjakan oleh {currentUser.name}
              </p>
            </div>

            {/* Status Filter */}
            <div style={{ display: 'flex', gap: '6px' }}>
              {(['all', 'in_progress', 'review', 'done'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`btn ${filterStatus === st ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '12px', padding: '4px 10px' }}
                >
                  {st === 'all' ? 'Semua' : st === 'done' ? 'Selesai' : st === 'in_progress' ? 'Berjalan' : 'Review'}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {filteredJobs.map((job) => (
              <div 
                key={job.id} 
                className="card"
                style={{
                  borderLeft: `4px solid ${
                    job.status === 'done' ? '#10b981' : job.status === 'review' ? '#f59e0b' : '#3b82f6'
                  }`,
                  padding: 'var(--space-5)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ flex: 1, minWidth: '280px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span className={`status-pill ${
                        job.status === 'done' ? 'status-active' : job.status === 'review' ? 'status-draft' : 'status-archived'
                      }`} style={{ fontSize: '11px' }}>
                        {job.status === 'done' ? 'Selesai (Done)' : job.status === 'review' ? 'Dalam Review (QC)' : 'Sedang Dikerjakan'}
                      </span>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>• {job.project}</span>
                    </div>

                    <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
                      {job.title}
                    </h3>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                      <span><strong>Peran:</strong> {job.role}</span>
                      <span><strong>Divisi:</strong> {job.division}</span>
                      <span><strong>Kampus:</strong> {job.campus}</span>
                      <span><strong>Tenggat:</strong> {job.dueDate}</span>
                      {job.completedDate && (
                        <span style={{ color: '#059669', fontWeight: 500 }}>
                          <strong>Selesai:</strong> {job.completedDate}
                        </span>
                      )}
                    </div>

                    {job.notes && (
                      <p style={{ fontSize: '13px', color: '#475569', backgroundColor: '#f8fafc', padding: '8px 12px', borderRadius: '6px', margin: 0 }}>
                        {job.notes}
                      </p>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                    {job.deliverableLink && (
                      <a
                        href={job.deliverableLink}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-secondary"
                        style={{ fontSize: '12px', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <ExternalLink size={13} />
                        Lihat File Kerja / Drive
                      </a>
                    )}
                    <Link
                      href="/approvals"
                      className="btn btn-secondary"
                      style={{ fontSize: '12px', padding: '6px 12px' }}
                    >
                      Buka di Approvals →
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            {filteredJobs.length === 0 && (
              <div className="card" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
                <FolderOpen size={32} color="#94a3b8" style={{ margin: '0 auto 8px auto' }} />
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Tidak ada pekerjaan dengan filter ini
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Ganti filter di atas untuk melihat status tugas lainnya.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab Content 2: Edit Profile */}
      {activeTab === 'edit' && (
        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}>
            Perbarui Informasi Akun & Portofolio
          </h2>

          {savedSuccess && (
            <div style={{ 
              backgroundColor: '#f0fdf4', 
              border: '1px solid #bbf7d0', 
              color: '#166534', 
              padding: '10px 14px', 
              borderRadius: '6px', 
              fontSize: '13px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              marginBottom: 'var(--space-4)' 
            }}>
              <Check size={16} />
              <span>Profil berhasil diperbarui dan disinkronkan ke sistem!</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
              <div className="form-group">
                <label className="form-label">Nama Lengkap</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Pengguna (Akun)</label>
                <input 
                  type="email" 
                  className="form-input" 
                  value={currentUser.email} 
                  disabled 
                  style={{ backgroundColor: '#f1f5f9', cursor: 'not-allowed' }}
                />
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Email akun terdaftar tidak dapat diubah sendiri.</span>
              </div>

              <div className="form-group">
                <label className="form-label">Kampus Asal</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={campus} 
                  onChange={(e) => setCampus(e.target.value)} 
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Spesialisasi Divisi Resmi (8 Divisi)</label>
                <select 
                  className="form-input" 
                  value={division} 
                  onChange={(e) => setDivision(e.target.value as any)}
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

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">URL Foto Avatar</label>
                <input 
                  type="url" 
                  className="form-input" 
                  value={avatar} 
                  onChange={(e) => setAvatar(e.target.value)} 
                  required 
                />
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Link Portofolio / Drive / Behance</label>
                <input 
                  type="url" 
                  className="form-input" 
                  value={portfolioLink} 
                  onChange={(e) => setPortfolioLink(e.target.value)} 
                />
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Bio & Keahlian Singkat</label>
                <textarea 
                  className="form-input" 
                  rows={3} 
                  value={bio} 
                  onChange={(e) => setBio(e.target.value)} 
                />
              </div>
            </div>

            <div style={{ marginTop: 'var(--space-4)', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button type="submit" className="btn btn-primary" style={{ padding: '8px 20px' }}>
                Simpan Perubahan Profil
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab Content 3: Governance & Permissions */}
      {activeTab === 'governance' && (
        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>
            Tingkat Wewenang & Hak Akses Sesuai Blueprint 6102
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>
            Peran Anda saat ini: <strong>{currentUser.role.toUpperCase()}</strong> ({currentUser.campus})
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
            
            <div style={{ 
              border: currentUser.role === 'super_admin' ? '2px solid #7c3aed' : '1px solid var(--border-color)', 
              borderRadius: '8px', 
              padding: '16px',
              backgroundColor: currentUser.role === 'super_admin' ? '#faf5ff' : '#ffffff'
            }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#7c3aed', marginBottom: '4px' }}>
                LEVEL 03 — SUPER ADMIN / COUNCIL
              </div>
              <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                • Penjaga Brand Identity, Logo Angkatan, & PG 6102.<br />
                • Pemegang hak rilis One Official Instagram.<br />
                • Menentukan akun Admin Kampus dan arah strategis.<br />
                • Pengambil keputusan musyawarah tingkat tinggi.
              </p>
            </div>

            <div style={{ 
              border: currentUser.role === 'campus_admin' ? '2px solid #2563eb' : '1px solid var(--border-color)', 
              borderRadius: '8px', 
              padding: '16px',
              backgroundColor: currentUser.role === 'campus_admin' ? '#eff6ff' : '#ffffff'
            }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#2563eb', marginBottom: '4px' }}>
                LEVEL 01 & 02 — ADMIN KAMPUS (REPRESENTATIVE)
              </div>
              <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                • 1 PIC resmi penghubung kampus ke pusat.<br />
                • Mendaftarkan anggota tim dan talenta kampusnya.<br />
                • Mengajukan Content Request ke Creative Management.<br />
                • Mengelola proyek lokal kampusnya sendiri.
              </p>
            </div>

            <div style={{ 
              border: currentUser.role === 'member' ? '2px solid #059669' : '1px solid var(--border-color)', 
              borderRadius: '8px', 
              padding: '16px',
              backgroundColor: currentUser.role === 'member' ? '#f0fdf4' : '#ffffff'
            }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#059669', marginBottom: '4px' }}>
                SPESIALIS DIVISI / TALENT POOL
              </div>
              <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                • Menjalankan eksekusi 8 divisi spesialis.<br />
                • Mengirim draft ke review gateway (Visual, Content, Brand QC).<br />
                • Berpartisipasi dalam kolaborasi lintas kampus.<br />
                • Membangun portofolio digital di arsip terpusat.
              </p>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
