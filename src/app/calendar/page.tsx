'use client';

import { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock, 
  Video, 
  Image as ImageIcon, 
  FileText, 
  X, 
  Check, 
  Filter, 
  Layers,
  CalendarDays,
  List
} from 'lucide-react';
import { usePersistentData } from '@/lib/usePersistentData';

interface CalendarEvent {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  type: 'publish' | 'deadline' | 'event';
  channel?: string;
  project: string;
  description?: string;
}

const INITIAL_EVENTS: CalendarEvent[] = [
  { id: 'ev-1', date: '2026-03-02', title: 'Tenggat Copywriting 10 Carousel Tren AI', type: 'deadline', project: 'Editorial Sprint Q1' },
  { id: 'ev-2', date: '2026-03-04', title: 'Tayang Reels: Behind The Design Process', type: 'publish', channel: 'Instagram', project: 'Editorial Sprint Q1' },
  { id: 'ev-3', date: '2026-03-05', title: 'Tenggat Booklet Brand Guidelines 2026', type: 'deadline', project: 'Brand Refresh 2026' },
  { id: 'ev-4', date: '2026-03-10', title: 'Tayang Video Teaser: Sambut Ramadhan 1448H', type: 'publish', channel: 'YouTube', project: 'Ramadhan Campaign' },
  { id: 'ev-5', date: '2026-03-15', title: 'Rilis Artikel Web: Identitas Baru 6102', type: 'publish', channel: 'Website', project: 'Brand Refresh 2026' },
  { id: 'ev-6', date: '2026-03-20', title: 'Event Kampus: Workshop Visual Creative Bandung', type: 'event', project: 'Bandung Creative Hub' },
  { id: 'ev-7', date: '2026-03-25', title: 'Peluncuran Logo Panggung Gembira (PG 6102)', type: 'publish', channel: 'Instagram', project: 'Panggung Gembira 6102' },
  { id: 'ev-8', date: '2026-03-28', title: 'Review Akhir Produksi Musik & Jingle 6102', type: 'deadline', project: 'Divisi Musik 6102' },
];

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const DAYS_HEADER = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

export default function CalendarPage() {
  const { data: events, addItem, deleteItem } = usePersistentData<CalendarEvent>('calendar_events', INITIAL_EVENTS);

  // Active Month & Year (Default: Maret 2026)
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(2); // 2 = Maret (0-indexed)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterType, setFilterType] = useState<string>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('2026-03-15');
  const [newType, setNewType] = useState<'publish' | 'deadline' | 'event'>('publish');
  const [newProject, setNewProject] = useState('Ramadhan Campaign');
  const [newChannel, setNewChannel] = useState('Instagram');

  // Month navigation handlers
  const handlePrevMonth = () => {
    if (currentMonthIndex === 0) {
      setCurrentMonthIndex(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonthIndex(currentMonthIndex - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonthIndex === 11) {
      setCurrentMonthIndex(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonthIndex(currentMonthIndex + 1);
    }
  };

  const handleResetToday = () => {
    setCurrentYear(2026);
    setCurrentMonthIndex(2); // Maret 2026
  };

  // Generate Days for the Month Grid
  const daysInMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonthIndex, 1).getDay(); // 0 is Sunday
  const startDayOffset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1; // 0 for Monday

  const totalGridCells = Math.ceil((daysInMonth + startDayOffset) / 7) * 7;

  // Filter events
  const filteredEvents = events.filter((ev) => {
    if (filterType !== 'all' && ev.type !== filterType) return false;
    return true;
  });

  const getEventsForDay = (dayNum: number) => {
    const formattedDate = `${currentYear}-${String(currentMonthIndex + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    return filteredEvents.filter(e => e.date === formattedDate);
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newEv: CalendarEvent = {
      id: `ev-${Date.now()}`,
      title: newTitle,
      date: newDate,
      type: newType,
      project: newProject,
      channel: newType === 'publish' ? newChannel : undefined,
    };

    addItem(newEv);
    setIsModalOpen(false);
    setNewTitle('');
  };

  const getBadgeStyle = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'publish':
        return { backgroundColor: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' };
      case 'deadline':
        return { backgroundColor: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca' };
      case 'event':
        return { backgroundColor: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0' };
    }
  };

  return (
    <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
      
      {/* Top Header & Action Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <span className="status-pill status-active" style={{ fontSize: '11px', padding: '2px 8px' }}>
              6102 Production Timeline
            </span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Kalender Editorial & Agenda Rilis 6102
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Plotting visual seluruh jadwal tayang Instagram, tenggat tugas divisi, dan agenda kreatif multi-kampus.
          </p>
        </div>

        {/* View Switcher & Add Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div style={{ display: 'flex', backgroundColor: '#f1f5f9', borderRadius: '6px', padding: '2px' }}>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                border: 'none',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                backgroundColor: viewMode === 'grid' ? '#ffffff' : 'transparent',
                color: viewMode === 'grid' ? '#0f172a' : '#64748b',
                boxShadow: viewMode === 'grid' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              <CalendarDays size={14} /> Kalender Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                border: 'none',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                backgroundColor: viewMode === 'list' ? '#ffffff' : 'transparent',
                color: viewMode === 'list' ? '#0f172a' : '#64748b',
                boxShadow: viewMode === 'list' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              <List size={14} /> Daftar List
            </button>
          </div>

          <button
            onClick={() => {
              setNewDate(`${currentYear}-${String(currentMonthIndex + 1).padStart(2, '0')}-15`);
              setIsModalOpen(true);
            }}
            className="btn btn-primary"
            style={{ fontSize: '13px', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={16} /> Tambah Agenda
          </button>
        </div>
      </div>

      {/* Month Navigator & Type Filters */}
      <div className="card" style={{ padding: 'var(--space-4)', marginBottom: 'var(--space-5)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button 
                onClick={handlePrevMonth}
                className="btn btn-secondary" 
                style={{ padding: '6px 10px', fontSize: '12px' }}
                title="Bulan Sebelumnya"
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                onClick={handleNextMonth}
                className="btn btn-secondary" 
                style={{ padding: '6px 10px', fontSize: '12px' }}
                title="Bulan Berikutnya"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: 0, minWidth: '160px' }}>
              {MONTH_NAMES[currentMonthIndex]} {currentYear}
            </h2>

            <button 
              onClick={handleResetToday}
              className="btn btn-secondary" 
              style={{ fontSize: '12px', padding: '4px 10px' }}
            >
              Bulan Ini
            </button>
          </div>

          {/* Type Filters */}
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', marginRight: '4px' }}>Filter:</span>
            {[
              { id: 'all', label: 'Semua' },
              { id: 'publish', label: 'Rilis Konten' },
              { id: 'deadline', label: 'Tenggat Tugas' },
              { id: 'event', label: 'Event Kampus' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id)}
                className={`btn ${filterType === f.id ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '11px', padding: '4px 10px' }}
              >
                {f.label}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* VIEW MODE 1: REAL CALENDAR GRID */}
      {viewMode === 'grid' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--border-color)' }}>
          
          {/* Days of week header */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(7, 1fr)', 
            backgroundColor: '#f8fafc', 
            borderBottom: '1px solid var(--border-color)',
            textAlign: 'center',
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--text-secondary)'
          }}>
            {DAYS_HEADER.map((day, idx) => (
              <div key={day} style={{ 
                padding: '10px 4px', 
                borderRight: idx < 6 ? '1px solid var(--border-color)' : 'none',
                color: idx === 5 || idx === 6 ? '#2563eb' : 'inherit'
              }}>
                {day}
              </div>
            ))}
          </div>

          {/* 7-column calendar day cells */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
            {Array.from({ length: totalGridCells }).map((_, index) => {
              const dayNumber = index - startDayOffset + 1;
              const isCurrentMonthDay = dayNumber > 0 && dayNumber <= daysInMonth;
              const dayEvents = isCurrentMonthDay ? getEventsForDay(dayNumber) : [];
              const isToday = isCurrentMonthDay && dayNumber === 15 && currentMonthIndex === 2 && currentYear === 2026;

              return (
                <div
                  key={index}
                  onClick={() => {
                    if (isCurrentMonthDay) {
                      setNewDate(`${currentYear}-${String(currentMonthIndex + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`);
                      setIsModalOpen(true);
                    }
                  }}
                  style={{
                    minHeight: '110px',
                    padding: '8px',
                    borderRight: (index + 1) % 7 !== 0 ? '1px solid #e2e8f0' : 'none',
                    borderBottom: '1px solid #e2e8f0',
                    backgroundColor: isCurrentMonthDay ? '#ffffff' : '#f8fafc',
                    cursor: isCurrentMonthDay ? 'pointer' : 'default',
                    transition: 'background-color 0.15s ease',
                  }}
                >
                  {isCurrentMonthDay && (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{
                          fontSize: '13px',
                          fontWeight: isToday ? 700 : 500,
                          color: isToday ? '#ffffff' : '#0f172a',
                          backgroundColor: isToday ? '#0f172a' : 'transparent',
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          {dayNumber}
                        </span>
                        {dayEvents.length > 0 && (
                          <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>
                            {dayEvents.length} agenda
                          </span>
                        )}
                      </div>

                      {/* Event Chips plotted on this day */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {dayEvents.slice(0, 3).map((ev) => {
                          const badge = getBadgeStyle(ev.type);
                          return (
                            <div
                              key={ev.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedEvent(ev);
                              }}
                              style={{
                                ...badge,
                                padding: '3px 6px',
                                borderRadius: '4px',
                                fontSize: '11px',
                                fontWeight: 500,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                cursor: 'pointer',
                              }}
                              title={`${ev.title} (${ev.project})`}
                            >
                              {ev.title}
                            </div>
                          );
                        })}
                        {dayEvents.length > 3 && (
                          <span style={{ fontSize: '10px', color: '#2563eb', fontWeight: 500 }}>
                            +{dayEvents.length - 3} agenda lagi
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* VIEW MODE 2: LIST VIEW */}
      {viewMode === 'list' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {filteredEvents.map((ev) => {
            const badge = getBadgeStyle(ev.type);
            return (
              <div 
                key={ev.id} 
                className="card"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  padding: '14px 18px',
                  borderLeft: `4px solid ${ev.type === 'publish' ? '#2563eb' : ev.type === 'deadline' ? '#dc2626' : '#16a34a'}`
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    backgroundColor: '#f1f5f9',
                    borderRadius: '6px',
                    width: '54px',
                    height: '54px',
                  }}>
                    <span style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>{ev.date.split('-')[2]}</span>
                    <span style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase' }}>
                      {MONTH_NAMES[parseInt(ev.date.split('-')[1], 10) - 1]?.slice(0, 3)}
                    </span>
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ ...badge, fontSize: '10px', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase', fontWeight: 600 }}>
                        {ev.type === 'publish' ? 'Tayang Medsos' : ev.type === 'deadline' ? 'Tenggat Tugas' : 'Event'}
                      </span>
                      {ev.channel && <span className="badge">{ev.channel}</span>}
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>• {ev.project}</span>
                    </div>

                    <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                      {ev.title}
                    </h3>
                  </div>
                </div>

                <button 
                  onClick={() => deleteItem(ev.id)}
                  className="btn btn-secondary" 
                  style={{ fontSize: '11px', color: 'var(--danger-color)', padding: '4px 8px' }}
                >
                  Hapus
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Detail Agenda */}
      {selectedEvent && (
        <div className="modal-overlay" onClick={() => setSelectedEvent(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Rincian Agenda Ploting</h3>
              <button onClick={() => setSelectedEvent(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body" style={{ padding: 'var(--space-5)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span className={`status-pill ${selectedEvent.type === 'publish' ? 'status-active' : 'status-draft'}`} style={{ fontSize: '11px' }}>
                  {selectedEvent.type.toUpperCase()}
                </span>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Tanggal: <strong>{selectedEvent.date}</strong></span>
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                {selectedEvent.title}
              </h2>
              <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5 }}>
                Terkait Proyek: <strong>{selectedEvent.project}</strong><br />
                {selectedEvent.channel && <>Kanal Publikasi: <strong>{selectedEvent.channel}</strong><br /></>}
              </p>
            </div>
            <div className="modal-footer">
              <button 
                onClick={() => {
                  deleteItem(selectedEvent.id);
                  setSelectedEvent(null);
                }} 
                className="btn btn-secondary" 
                style={{ color: 'var(--danger-color)' }}
              >
                Hapus Agenda
              </button>
              <button onClick={() => setSelectedEvent(null)} className="btn btn-primary">
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tambah Agenda Baru */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Plot Agenda Baru ke Kalender</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddEvent}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Judul Agenda / Nama Konten</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Tayang Video Teaser Ramadhan..."
                    className="form-input"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                  <div className="form-group">
                    <label className="form-label">Tanggal Ploting</label>
                    <input
                      type="date"
                      required
                      className="form-input"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Kategori Agenda</label>
                    <select
                      className="form-input"
                      value={newType}
                      onChange={(e) => setNewType(e.target.value as any)}
                    >
                      <option value="publish">Rilis Konten Medsos</option>
                      <option value="deadline">Tenggat Waktu Tugas</option>
                      <option value="event">Event & Kegiatan Kampus</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                  <div className="form-group">
                    <label className="form-label">Terkait Proyek</label>
                    <input
                      type="text"
                      className="form-input"
                      value={newProject}
                      onChange={(e) => setNewProject(e.target.value)}
                    />
                  </div>

                  {newType === 'publish' && (
                    <div className="form-group">
                      <label className="form-label">Kanal Publikasi</label>
                      <select
                        className="form-input"
                        value={newChannel}
                        onChange={(e) => setNewChannel(e.target.value)}
                      >
                        <option value="Instagram">Instagram 6102</option>
                        <option value="YouTube">YouTube</option>
                        <option value="TikTok">TikTok</option>
                        <option value="Website">Website</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  Simpan ke Kalender
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
