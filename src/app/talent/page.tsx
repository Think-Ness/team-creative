'use client';

import { useState } from 'react';
import { Mail, CheckSquare, Building2, MapPin } from 'lucide-react';

interface Member {
  id: string;
  name: string;
  role: string;
  campus: string;
  unit: string;
  email: string;
  activeTasks: number;
  avatar: string;
}

const MEMBERS: Member[] = [
  {
    id: '1',
    name: 'Ahmad Fauzi',
    role: 'Head of Creative / Lead',
    campus: 'Kampus Utama Jakarta',
    unit: 'Brand & Visual Identity',
    email: 'ahmad@6102creative.com',
    activeTasks: 2,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  },
  {
    id: '2',
    name: 'Siti Sarah',
    role: 'Creative Producer & PM',
    campus: 'Kampus Utama Jakarta',
    unit: 'Digital Publishing & Production',
    email: 'siti@6102creative.com',
    activeTasks: 3,
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
  },
  {
    id: '3',
    name: 'Budi Wicaksono',
    role: 'Senior Visual Designer',
    campus: 'Kampus Utama Jakarta',
    unit: 'Brand & Visual Identity',
    email: 'budi@6102creative.com',
    activeTasks: 4,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  },
  {
    id: '4',
    name: 'Reza Pratama',
    role: 'Motion Graphics & Video Lead',
    campus: 'Kampus Bandung Hub',
    unit: 'Motion Graphics & 3D Lab',
    email: 'reza@6102creative.com',
    activeTasks: 2,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
  },
  {
    id: '5',
    name: 'Dewi Lestari',
    role: 'Content Strategist & Copywriter',
    campus: 'Kampus Surabaya Studio',
    unit: 'Digital Publishing & Copy',
    email: 'dewi@6102creative.com',
    activeTasks: 3,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  },
];

export default function TalentPage() {
  const [filterCampus, setFilterCampus] = useState('all');

  const filtered = filterCampus === 'all'
    ? MEMBERS
    : MEMBERS.filter(m => m.campus.includes(filterCampus));

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>
          Creative Talent & Roster
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Direktori kreator, desainer, videografer, dan copywriter di seluruh unit kampus.
        </p>
      </div>

      <div className="filter-pills">
        {['all', 'Jakarta', 'Bandung', 'Surabaya'].map((c) => (
          <button
            key={c}
            className={`filter-pill ${filterCampus === c ? 'active' : ''}`}
            onClick={() => setFilterCampus(c)}
          >
            {c === 'all' ? 'Semua Kampus' : c}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
        {filtered.map((m) => (
          <div key={m.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
              <img 
                src={m.avatar} 
                alt={m.name} 
                style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-color)' }}
              />
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {m.name}
                </h3>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  {m.role}
                </div>
              </div>
            </div>

            <div style={{ 
              borderTop: '1px solid var(--border-color)', 
              paddingTop: 'var(--space-3)',
              fontSize: '12px',
              color: 'var(--text-secondary)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-2)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <Building2 size={14} /> {m.unit}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <MapPin size={14} /> {m.campus}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <Mail size={14} /> {m.email}
              </div>
            </div>

            <div style={{ 
              borderTop: '1px solid var(--border-color)', 
              paddingTop: 'var(--space-3)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '12px'
            }}>
              <span style={{ color: 'var(--text-secondary)' }}>Beban Kerja Aktif:</span>
              <span className="badge" style={{ fontWeight: 600 }}>
                <CheckSquare size={12} /> {m.activeTasks} Tugas Berjalan
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
