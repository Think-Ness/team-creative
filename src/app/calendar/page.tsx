'use client';

import { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, Video, Image as ImageIcon, FileText } from 'lucide-react';

interface CalendarEvent {
  id: string;
  date: string;
  title: string;
  type: 'publish' | 'deadline' | 'event';
  channel?: string;
  project: string;
}

const EVENTS: CalendarEvent[] = [
  { id: '1', date: '2026-02-15', title: 'Tayang: Carousel 5 Prinsip Visual', type: 'publish', channel: 'Instagram', project: 'Editorial Sprint Q1' },
  { id: '2', date: '2026-02-20', title: 'Tenggat: Finalisasi Color Palette Master', type: 'deadline', project: 'Brand Refresh 2026' },
  { id: '3', date: '2026-02-28', title: 'Review: Storyboard Video Teaser Ramadhan', type: 'deadline', project: 'Ramadhan Campaign' },
  { id: '4', date: '2026-03-04', title: 'Tayang: Shorts Behind The Design Process', type: 'publish', channel: 'TikTok', project: 'Editorial Sprint Q1' },
  { id: '5', date: '2026-03-10', title: 'Tayang: Video Teaser Sambut Ramadhan', type: 'publish', channel: 'YouTube', project: 'Ramadhan Campaign' },
  { id: '6', date: '2026-03-15', title: 'Rilis: Artikel Web Identitas Baru 6102', type: 'publish', channel: 'Website', project: 'Brand Refresh 2026' },
];

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState('Maret 2026');

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Editorial & Production Calendar
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Jadwal terpadu rilis konten publikasi, tenggat pengerjaan tugas, dan momen kampanye kreatif.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <span style={{ fontSize: '15px', fontWeight: 600 }}>{currentMonth}</span>
        </div>
      </div>

      {/* Upcoming Milestones List */}
      <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
        <h3 className="section-title" style={{ marginBottom: 'var(--space-4)' }}>Agenda Mendatang</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {EVENTS.map((ev) => (
            <div 
              key={ev.id} 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                padding: 'var(--space-3) var(--space-4)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                background: 'var(--surface-color)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  width: '50px',
                  height: '50px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-color)',
                  fontWeight: 700,
                  fontSize: '13px',
                  color: 'var(--text-primary)'
                }}>
                  <span>{ev.date.split('-')[2]}</span>
                  <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>MAR</span>
                </div>

                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {ev.title}
                  </h4>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Proyek: {ev.project} {ev.channel && `• Kanal: ${ev.channel}`}
                  </div>
                </div>
              </div>

              <span className={`status-pill ${ev.type === 'publish' ? 'status-active' : 'status-review'}`}>
                {ev.type === 'publish' ? 'Jadwal Tayang' : 'Tenggat Waktu'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
