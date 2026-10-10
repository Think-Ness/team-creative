'use client';

import { useState } from 'react';
import Link from 'next/link';
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
  List, 
  ExternalLink, 
  Sparkles, 
  User, 
  Building2 
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
  assignee?: string;
}

interface MergedCalendarEvent {
  id: string;
  date: string;
  title: string;
  type: 'publish' | 'deadline' | 'event';
  channel?: string;
  project: string;
  description?: string;
  assignee?: string;
  source: string;
  sourceLink?: string;
  isManual?: boolean;
}

const INITIAL_EVENTS: CalendarEvent[] = [
  { id: 'ev-1', date: '2026-03-02', title: 'Tenggat Copywriting 10 Carousel Tren AI', type: 'deadline', project: 'Editorial Sprint Q1', assignee: 'Dewi Lestari' },
  { id: 'ev-2', date: '2026-03-04', title: 'Tayang Reels: Behind The Design Process', type: 'publish', channel: 'Instagram', project: 'Editorial Sprint Q1', assignee: 'Budi Santoso' },
  { id: 'ev-3', date: '2026-03-05', title: 'Tenggat Booklet Brand Guidelines 2026', type: 'deadline', project: 'Brand Refresh 2026', assignee: 'Budi Wicaksono' },
  { id: 'ev-4', date: '2026-03-10', title: 'Tayang Video Teaser: Sambut Ramadhan 1448H', type: 'publish', channel: 'YouTube', project: 'Ramadhan Campaign', assignee: 'Reza Pratama' },
  { id: 'ev-5', date: '2026-03-15', title: 'Rilis Artikel Web: Identitas Baru 6102', type: 'publish', channel: 'Website', project: 'Brand Refresh 2026', assignee: 'Ahmad Fauzi' },
  { id: 'ev-6', date: '2026-03-20', title: 'Event Kampus: Workshop Visual Creative Bandung', type: 'event', project: 'Bandung Creative Hub', assignee: 'Siti Sarah' },
  { id: 'ev-7', date: '2026-03-25', title: 'Peluncuran Logo Panggung Gembira (PG 6102)', type: 'publish', channel: 'Instagram', project: 'Panggung Gembira 6102', assignee: 'Ahmad Fauzi' },
  { id: 'ev-8', date: '2026-03-28', title: 'Review Akhir Produksi Musik & Jingle 6102', type: 'deadline', project: 'Divisi Musik 6102', assignee: 'Hendra Wijaya' },
];

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const DAYS_HEADER = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

export default function CalendarPage() {
  const { data: manualEvents, addItem, deleteItem } = usePersistentData<CalendarEvent>('calendar_events', INITIAL_EVENTS);
  const { data: tasks } = usePersistentData<any>('tasks', []);
  const { data: projects } = usePersistentData<any>('projects', []);
  const { data: contentItems } = usePersistentData<any>('content', []);
  const { data: productionEvents } = usePersistentData<any>('events', []);

  // Active Month & Year (Default: Maret 2026)
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(2); // 2 = Maret (0-indexed)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterType, setFilterType] = useState<string>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<MergedCalendarEvent | null>(null);

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('2026-03-15');
  const [newType, setNewType] = useState<'publish' | 'deadline' | 'event'>('publish');
  const [newProject, setNewProject] = useState('Ramadhan Campaign');
  const [newChannel, setNewChannel] = useState('Instagram');
  const [newAssignee, setNewAssignee] = useState('Budi Wicaksono');
  const [newDescription, setNewDescription] = useState('');

  // Synthesize events across entire ecosystem (Centralized Calendar Aggregation)
  const allEvents: MergedCalendarEvent[] = [
    ...manualEvents.map(e => ({ 
      ...e, 
      source: 'Agenda Manual', 
      isManual: true 
    })),
    ...tasks.filter((t: any) => t.due_date).map((t: any) => ({
      id: `task-${t.id}`,
      date: t.due_date,
      title: `[Tugas] ${t.title}`,
      type: 'deadline' as const,
      project: t.project || 'Tugas Umum',
      assignee: t.assignee || 'Tim 6102',
      description: t.description || 'Tenggat penyelesaian deliverable di Kanban board.',
      source: 'Tugas Kanban',
      sourceLink: `/tasks?project=${encodeURIComponent(t.project || '')}`,
    })),
    ...projects.filter((p: any) => p.due_date).map((p: any) => ({
      id: `proj-${p.id}`,
      date: p.due_date,
      title: `[Proyek] ${p.name}`,
      type: 'deadline' as const,
      project: p.name,
      assignee: p.pm || 'Project Manager',
      description: p.description || 'Target penyelesaian proyek utama.',
      source: 'Proyek',
      sourceLink: '/projects',
    })),
    ...contentItems.filter((c: any) => c.scheduled_at).map((c: any) => ({
      id: `content-${c.id}`,
      date: c.scheduled_at,
      title: `[Tayang] ${c.title}`,
      type: 'publish' as const,
      channel: c.channel,
      project: c.task_ref || 'Sosial Media',
      assignee: c.author || 'Tim Konten',
      description: c.caption || 'Jadwal publikasi konten ke media sosial.',
      source: 'Konten Pipeline',
      sourceLink: '/content',
    })),
    ...productionEvents.filter((e: any) => e.date).map((e: any) => ({
      id: `event-${e.id}`,
      date: e.date,
      title: `[Event] ${e.title}`,
      type: 'event' as const,
      project: e.campus || 'Acara Kampus',
      assignee: e.lead || 'Tim Event',
      description: e.description || 'Pelaksanaan kegiatan / liputan event kampus.',
      source: 'Event Produksi',
      sourceLink: '/events',
    })),
  ];

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
  const filteredEvents = allEvents.filter((ev) => {
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
      assignee: newAssignee.trim() || 'Tim 6102',
      description: newDescription,
    };

    addItem(newEv);
    setIsModalOpen(false);
    setNewTitle('');
    setNewDescription('');
  };

  const handleAutoFillFromModule = (sourceVal: string) => {
    if (!sourceVal) return;
    const [prefix, id] = sourceVal.split('::');
    if (prefix === 'task') {
      const t = tasks.find((item: any) => item.id === id);
      if (t) {
        setNewTitle(`Tenggat: ${t.title}`);
        setNewDate(t.due_date || '2026-03-15');
        setNewType('deadline');
        setNewProject(t.project || 'Tugas Umum');
        setNewAssignee(t.assignee || 'Tim 6102');
        setNewDescription(t.description || '');
      }
    } else if (prefix === 'project') {
      const p = projects.find((item: any) => item.id === id);
      if (p) {
        setNewTitle(`Milestone: ${p.name}`);
        setNewDate(p.due_date || '2026-03-30');
        setNewType('deadline');
        setNewProject(p.name);
        setNewAssignee(p.pm || 'Project Manager');
        setNewDescription(p.description || '');
      }
    } else if (prefix === 'content') {
      const c = contentItems.find((item: any) => item.id === id);
      if (c) {
        setNewTitle(`Tayang: ${c.title}`);
        setNewDate(c.scheduled_at || '2026-03-15');
        setNewType('publish');
        setNewChannel(c.channel === 'instagram' ? 'Instagram' : c.channel === 'youtube' ? 'YouTube' : 'TikTok');
        setNewProject(c.task_ref || 'Sosial Media');
        setNewAssignee(c.author || 'Tim Konten');
        setNewDescription(c.caption || '');
      }
    }
  };

  const getBadgeStyle = (type: MergedCalendarEvent['type']) => {
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
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-6)' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
            Production Calendar & Agenda Terpadu
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Sinkronisasi jadwal otomatis dari seluruh tenggat tugas, jadwal rilis konten medsos, dan event angkatan.
          </p>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
        >
          <Plus size={16} />
          Plot Agenda Manual
        </button>
      </div>

      {/* Control Bar: Month Switcher, View Switcher & Filters */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: 'var(--space-4)',
        flexWrap: 'wrap',
        gap: 'var(--space-3)'
      }}>
        {/* Month Navigator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
            <button 
              onClick={handlePrevMonth}
              style={{ background: 'none', border: 'none', padding: '6px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              title="Bulan Sebelumnya"
            >
              <ChevronLeft size={16} />
            </button>
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', padding: '0 8px', minWidth: '130px', textAlign: 'center' }}>
              {MONTH_NAMES[currentMonthIndex]} {currentYear}
            </span>
            <button 
              onClick={handleNextMonth}
              style={{ background: 'none', border: 'none', padding: '6px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              title="Bulan Berikutnya"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <button 
            onClick={handleResetToday}
            className="btn btn-secondary" 
            style={{ fontSize: '12px', padding: '6px 12px' }}
          >
            Hari Ini
          </button>
        </div>

        {/* View Mode Toggle & Filter Type */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          {/* Category Filter Pills */}
          <div className="filter-group" style={{ margin: 0 }}>
            <button 
              className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
              onClick={() => setFilterType('all')}
              style={{ fontSize: '12px', padding: '4px 10px' }}
            >
              Semua ({allEvents.length})
            </button>
            <button 
              className={`filter-btn ${filterType === 'publish' ? 'active' : ''}`}
              onClick={() => setFilterType('publish')}
              style={{ fontSize: '12px', padding: '4px 10px' }}
            >
              Tayang Medsos
            </button>
            <button 
              className={`filter-btn ${filterType === 'deadline' ? 'active' : ''}`}
              onClick={() => setFilterType('deadline')}
              style={{ fontSize: '12px', padding: '4px 10px' }}
            >
              Tenggat Tugas
            </button>
            <button 
              className={`filter-btn ${filterType === 'event' ? 'active' : ''}`}
              onClick={() => setFilterType('event')}
              style={{ fontSize: '12px', padding: '4px 10px' }}
            >
              Event
            </button>
          </div>

          {/* View Mode */}
          <div style={{ display: 'flex', border: '1px solid var(--border-color)', borderRadius: '6px', overflow: 'hidden' }}>
            <button
              onClick={() => setViewMode('grid')}
              style={{ 
                padding: '6px 10px', 
                border: 'none', 
                background: viewMode === 'grid' ? 'var(--text-primary)' : 'var(--surface-color)',
                color: viewMode === 'grid' ? '#fff' : 'var(--text-secondary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '12px'
              }}
            >
              <CalendarDays size={14} /> Kalender
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={{ 
                padding: '6px 10px', 
                border: 'none', 
                background: viewMode === 'list' ? 'var(--text-primary)' : 'var(--surface-color)',
                color: viewMode === 'list' ? '#fff' : 'var(--text-secondary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '12px'
              }}
            >
              <List size={14} /> Daftar List
            </button>
          </div>
        </div>
      </div>

      {/* VIEW MODE 1: GRID VIEW (7 Days per row) */}
      {viewMode === 'grid' && (
        <div style={{ 
          backgroundColor: 'var(--surface-color)', 
          border: '1px solid var(--border-color)', 
          borderRadius: '8px', 
          overflow: 'hidden',
          width: '100%'
        }}>
          {/* Days of Week Header */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', 
            borderBottom: '1px solid var(--border-color)',
            backgroundColor: '#f8fafc',
            width: '100%'
          }}>
            {DAYS_HEADER.map((day, idx) => (
              <div 
                key={day} 
                style={{ 
                  padding: '10px 4px', 
                  textAlign: 'center', 
                  fontSize: '12px', 
                  fontWeight: 600, 
                  color: idx >= 5 ? '#ef4444' : 'var(--text-secondary)',
                  borderRight: idx < 6 ? '1px solid var(--border-color)' : 'none',
                  minWidth: 0,
                  overflow: 'hidden'
                }}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid Cells */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
            width: '100%'
          }}>
            {Array.from({ length: totalGridCells }).map((_, index) => {
              const dayNumber = index - startDayOffset + 1;
              const isCurrentMonth = dayNumber > 0 && dayNumber <= daysInMonth;
              const dayEvents = isCurrentMonth ? getEventsForDay(dayNumber) : [];
              const isToday = isCurrentMonth && dayNumber === 11 && currentMonthIndex === 2 && currentYear === 2026;

              return (
                <div
                  key={index}
                  style={{
                    minHeight: '115px',
                    padding: '8px',
                    backgroundColor: isCurrentMonth ? (isToday ? '#f0f9ff' : 'var(--surface-color)') : '#f8fafc',
                    borderRight: (index + 1) % 7 !== 0 ? '1px solid var(--border-color)' : 'none',
                    borderBottom: '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    opacity: isCurrentMonth ? 1 : 0.45,
                    minWidth: 0,
                    overflow: 'hidden'
                  }}
                >
                  {isCurrentMonth && (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px', minWidth: 0 }}>
                        <span style={{ 
                          fontSize: '12px', 
                          fontWeight: isToday ? 700 : 500, 
                          color: isToday ? '#0284c7' : 'var(--text-primary)',
                          backgroundColor: isToday ? '#e0f2fe' : 'transparent',
                          width: '22px',
                          height: '22px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          {dayNumber}
                        </span>
                        {dayEvents.length > 0 && (
                          <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 600, whiteSpace: 'nowrap' }}>
                            {dayEvents.length}
                          </span>
                        )}
                      </div>

                      {/* Event Chips plotted on this day */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', minWidth: 0, overflow: 'hidden' }}>
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
                                padding: '2px 5px',
                                borderRadius: '3px',
                                fontSize: '10.5px',
                                fontWeight: 500,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                cursor: 'pointer',
                                display: 'block',
                                minWidth: 0,
                              }}
                              title={`${ev.title} (${ev.project}) • PIC: ${ev.assignee || 'Tim 6102'} • Sumber: ${ev.source}`}
                            >
                              <span>{ev.title}</span>
                              {ev.assignee && (
                                <span style={{ opacity: 0.75, fontSize: '9.5px', marginLeft: '3px' }}>
                                  ({ev.assignee})
                                </span>
                              )}
                            </div>
                          );
                        })}
                        {dayEvents.length > 3 && (
                          <span style={{ fontSize: '10px', color: '#2563eb', fontWeight: 500 }}>
                            +{dayEvents.length - 3} agenda
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
          {filteredEvents.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-secondary)' }}>
              Tidak ada agenda atau jadwal produksi untuk kategori yang dipilih.
            </div>
          ) : (
            filteredEvents.map((ev) => {
              const badge = getBadgeStyle(ev.type);
              return (
                <div 
                  key={ev.id} 
                  className="card"
                  onClick={() => setSelectedEvent(ev)}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    padding: '12px 16px',
                    borderLeft: `4px solid ${ev.type === 'publish' ? '#2563eb' : ev.type === 'deadline' ? '#dc2626' : '#16a34a'}`,
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
                    <div style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      backgroundColor: '#f1f5f9',
                      borderRadius: '6px', 
                      width: '50px', 
                      height: '50px',
                      flexShrink: 0
                    }}>
                      <span style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>{ev.date.split('-')[2]}</span>
                      <span style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase' }}>
                        {MONTH_NAMES[parseInt(ev.date.split('-')[1], 10) - 1]?.slice(0, 3)}
                      </span>
                    </div>

                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px', flexWrap: 'wrap' }}>
                        <span style={{ ...badge, fontSize: '10px', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase', fontWeight: 600 }}>
                          {ev.type === 'publish' ? 'Tayang Medsos' : ev.type === 'deadline' ? 'Tenggat Tugas' : 'Event'}
                        </span>
                        <span style={{ fontSize: '10px', padding: '2px 6px', backgroundColor: '#e2e8f0', color: '#334155', borderRadius: '4px', fontWeight: 600 }}>
                          {ev.source}
                        </span>
                        {ev.channel && <span className="badge" style={{ fontSize: '10px' }}>{ev.channel}</span>}
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>• {ev.project}</span>
                        {ev.assignee && (
                          <span style={{ fontSize: '11px', color: '#334155', backgroundColor: '#f1f5f9', padding: '1px 6px', borderRadius: '4px', fontWeight: 500 }}>
                            PIC: {ev.assignee}
                          </span>
                        )}
                      </div>

                      <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {ev.title}
                      </h3>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setSelectedEvent(ev)}
                      className="btn btn-secondary"
                      style={{ fontSize: '11px', padding: '4px 10px' }}
                    >
                      Detail
                    </button>
                    {ev.isManual && (
                      <button 
                        onClick={() => deleteItem(ev.id)}
                        className="btn btn-secondary" 
                        style={{ fontSize: '11px', color: 'var(--danger-color)', padding: '4px 8px' }}
                      >
                        Hapus
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Modal Detail Agenda Terpadu */}
      {selectedEvent && (
        <div className="modal-overlay" onClick={() => setSelectedEvent(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '560px', width: '90%' }}>
            <div className="modal-header">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <span style={{ ...getBadgeStyle(selectedEvent.type), fontSize: '10px', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase', fontWeight: 600 }}>
                    {selectedEvent.type === 'publish' ? 'Tayang Medsos' : selectedEvent.type === 'deadline' ? 'Tenggat Tugas' : 'Event'}
                  </span>
                  <span style={{ fontSize: '10px', padding: '2px 6px', backgroundColor: '#e2e8f0', color: '#334155', borderRadius: '4px', fontWeight: 600 }}>
                    {selectedEvent.source}
                  </span>
                </div>
                <h3 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {selectedEvent.title}
                </h3>
              </div>
              <button onClick={() => setSelectedEvent(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              {/* Structured Metadata Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: 'var(--space-4)' }}>
                <div style={{ padding: '10px 12px', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Tanggal Pelaksanaan / Tenggat</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
                    {selectedEvent.date}
                  </div>
                </div>

                <div style={{ padding: '10px 12px', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Penanggung Jawab (PIC)</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
                    {selectedEvent.assignee || 'Tim 6102'}
                  </div>
                </div>

                <div style={{ padding: '10px 12px', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Terkait Proyek</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
                    {selectedEvent.project || '-'}
                  </div>
                </div>

                <div style={{ padding: '10px 12px', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Kanal Publikasi / Saluran</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
                    {selectedEvent.channel || 'Internal Team'}
                  </div>
                </div>
              </div>

              {/* Description & Instruction */}
              <div>
                <label className="form-label">Keterangan & Rincian Agenda</label>
                <div style={{ 
                  fontSize: '13px', 
                  lineHeight: 1.6, 
                  color: 'var(--text-primary)', 
                  backgroundColor: 'var(--surface-color)', 
                  padding: '12px', 
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)'
                }}>
                  {selectedEvent.description || 'Tidak ada deskripsi rinci untuk agenda ini.'}
                </div>
              </div>
            </div>

            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                {selectedEvent.sourceLink ? (
                  <Link
                    href={selectedEvent.sourceLink}
                    className="btn btn-secondary"
                    style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <ExternalLink size={13} /> Buka di Modul {selectedEvent.source}
                  </Link>
                ) : selectedEvent.isManual ? (
                  <button 
                    onClick={() => {
                      deleteItem(selectedEvent.id);
                      setSelectedEvent(null);
                    }} 
                    className="btn btn-secondary" 
                    style={{ color: 'var(--danger-color)', fontSize: '12px' }}
                  >
                    Hapus Agenda
                  </button>
                ) : null}
              </div>

              <button onClick={() => setSelectedEvent(null)} className="btn btn-primary" style={{ fontSize: '12px' }}>
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Plot Agenda Baru ke Kalender (dengan Auto-Fill) */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Plot Agenda Baru ke Kalender</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddEvent}>
              <div className="modal-body">
                {/* Auto Fill Selector */}
                <div className="form-group" style={{ backgroundColor: '#f8fafc', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#1d4ed8' }}>
                    <Sparkles size={13} /> Auto-Fill dari Modul Lain (Otomatis Isi Data)
                  </label>
                  <select
                    className="form-input"
                    defaultValue=""
                    onChange={(e) => handleAutoFillFromModule(e.target.value)}
                    style={{ fontSize: '12px' }}
                  >
                    <option value="">-- Ketik Manual (Agenda Bebas) --</option>
                    <optgroup label="Tugas Kanban">
                      {tasks.map((t: any) => (
                        <option key={t.id} value={`task::${t.id}`}>
                          Task: {t.title} ({t.due_date || 'No Date'})
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Proyek Utama">
                      {projects.map((p: any) => (
                        <option key={p.id} value={`project::${p.id}`}>
                          Proyek: {p.name} ({p.due_date || 'No Date'})
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Konten Pipeline">
                      {contentItems.map((c: any) => (
                        <option key={c.id} value={`content::${c.id}`}>
                          Konten: {c.title} ({c.scheduled_at || 'No Date'})
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Judul Agenda / Nama Konten *</label>
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
                    <label className="form-label">Tanggal Ploting *</label>
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

                  <div className="form-group">
                    <label className="form-label">Penanggung Jawab (PIC)</label>
                    <input
                      type="text"
                      className="form-input"
                      value={newAssignee}
                      onChange={(e) => setNewAssignee(e.target.value)}
                      placeholder="Nama PIC (contoh: Budi, Reza)"
                    />
                  </div>
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

                <div className="form-group">
                  <label className="form-label">Catatan / Deskripsi Tambahan</label>
                  <textarea
                    rows={2}
                    className="form-input"
                    placeholder="Catatan rundown atau instruksi pengerjaan..."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                  />
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
