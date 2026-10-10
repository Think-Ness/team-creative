'use client';

import { useState } from 'react';
import { CalendarDays, MapPin, Plus, Video, Camera, Check, X } from 'lucide-react';

interface EventItem {
  id: string;
  name: string;
  date: string;
  location: string;
  coverageType: string;
  assignedCrew: string[];
  status: 'upcoming' | 'ongoing' | 'completed';
}

const INITIAL_EVENTS: EventItem[] = [
  {
    id: '1',
    name: 'Wisuda Akbar Semester Genap 2025/2026',
    date: '18 April 2026',
    location: 'Auditorium Kampus Utama Jakarta',
    coverageType: 'Multi-cam Live Stream & Drone Footage',
    assignedCrew: ['Reza Pratama', 'Budi Wicaksono'],
    status: 'upcoming',
  },
  {
    id: '2',
    name: 'Pameran Desain & Seni Visual "Karsa 6102"',
    date: '2-5 Mei 2026',
    location: 'Bandung Creative Hub Gallery',
    coverageType: 'Foto Dokumentasi & Mini Dokumenter',
    assignedCrew: ['Ahmad Fauzi', 'Dewi Lestari'],
    status: 'upcoming',
  },
  {
    id: '3',
    name: 'Workshop Motion Graphic & Generative 3D',
    date: '12 Maret 2026',
    location: 'Studio Surabaya & Online Zoom',
    coverageType: 'Rekaman Kelas & Highlight Reels',
    assignedCrew: ['Reza Pratama'],
    status: 'upcoming',
  },
];

export default function EventsPage() {
  const [events] = useState<EventItem[]>(INITIAL_EVENTS);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>
          Creative Events & Coverage Plans
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Perencanaan dokumentasi, siaran langsung, dan liputan multimedia acara resmi institusi.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 'var(--space-6)' }}>
        {events.map((ev) => (
          <div key={ev.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span className="status-pill status-in_progress" style={{ fontSize: '11px' }}>
                  {ev.status}
                </span>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '6px' }}>
                  {ev.name}
                </h3>
              </div>
            </div>

            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CalendarDays size={14} /> Tanggal: <strong style={{ color: 'var(--text-primary)' }}>{ev.date}</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={14} /> Lokasi: {ev.location}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Camera size={14} /> Rencana Liputan: {ev.coverageType}
              </div>
            </div>

            <div style={{ 
              borderTop: '1px solid var(--border-color)', 
              paddingTop: 'var(--space-3)',
              fontSize: '12px',
              color: 'var(--text-secondary)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span>Tim Bertugas:</span>
              <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
                {ev.assignedCrew.join(', ')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
