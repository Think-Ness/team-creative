'use client';

import { useState } from 'react';
import { CalendarDays, MapPin, Plus, Camera, X, Users, Clock, Video, Radio, Layers } from 'lucide-react';
import { usePersistentData } from '@/lib/usePersistentData';

interface EventItem {
  id: string;
  name: string;
  date: string;
  location: string;
  coverageType: string;
  assignedCrew: string[];
  status: 'upcoming' | 'ongoing' | 'completed';
  rundown?: string;
  equipment?: string;
  deliverables?: string;
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
    rundown: '07:30 Registrasi Kru & Setup • 09:00 Prosesi Masuk • 11:30 Orasi Ilmiah • 13:00 Dokumentasi Foto Studio',
    equipment: '3x Sony A7IV / FX3, DJI Mini 4 Pro Drone, Hollyland Wireless Mic, Blackmagic ATEM Mini Pro',
    deliverables: 'Live stream YouTube 1080p, Video Aftermovie 90 detik, Galeri Foto 200+ Hi-Res',
  },
  {
    id: '2',
    name: 'Pameran Desain & Seni Visual "Karsa 6102"',
    date: '2-5 Mei 2026',
    location: 'Bandung Creative Hub Gallery',
    coverageType: 'Foto Dokumentasi & Mini Dokumenter',
    assignedCrew: ['Ahmad Fauzi', 'Dewi Lestari'],
    status: 'upcoming',
    rundown: 'Hari 1: Opening & Press Conference • Hari 2: Gallery Walk & Artist Talk • Hari 3: Workshop Lintas Kampus',
    equipment: 'Sony A7IV, Lensa 24-70 GM & 85mm F1.4, Ronin Gimbal, Rode Wireless GO II',
    deliverables: 'Mini Dokumenter 3 Menit, 10 Carousel Instagram, Buku Katalog Digital PDF',
  },
  {
    id: '3',
    name: 'Workshop Motion Graphic & Generative 3D',
    date: '12 Maret 2026',
    location: 'Studio Surabaya & Online Zoom',
    coverageType: 'Rekaman Kelas & Highlight Reels',
    assignedCrew: ['Reza Pratama'],
    status: 'upcoming',
    rundown: '13:00 Intro & Teori • 14:00 Hands-on Blender 4.0 • 16:00 Showcase Peserta & Review',
    equipment: 'Camera 4K Webcam, Capture Card Elgato, Shure MV7 Microphone',
    deliverables: 'Rekaman Arsip Drive Full HD, 3x Video Reels Tips & Trik',
  },
];

export default function EventsPage() {
  const { data: events, addItem, deleteItem } = usePersistentData<EventItem>('events', INITIAL_EVENTS);

  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    name: '',
    date: '',
    location: '',
    coverageType: 'Multi-cam Live Stream',
    assignedCrew: 'Reza Pratama, Budi Wicaksono',
    status: 'upcoming' as EventItem['status'],
    rundown: '',
    equipment: '',
    deliverables: '',
  });

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    addItem({
      id: `ev-${Date.now()}`,
      name: form.name.trim(),
      date: form.date.trim() || '2026-04-15',
      location: form.location.trim() || 'Kampus Utama',
      coverageType: form.coverageType,
      assignedCrew: form.assignedCrew.split(',').map(s => s.trim()).filter(Boolean),
      status: form.status,
      rundown: form.rundown || 'Jadwal detail diatur oleh PIC Liputan.',
      equipment: form.equipment || 'Kit Kamera Standar 6102.',
      deliverables: form.deliverables || 'Aftermovie & Dokumentasi Foto.',
    });

    setIsModalOpen(false);
    setForm({
      name: '',
      date: '',
      location: '',
      coverageType: 'Multi-cam Live Stream',
      assignedCrew: 'Reza Pratama, Budi Wicaksono',
      status: 'upcoming',
      rundown: '',
      equipment: '',
      deliverables: '',
    });
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: 'var(--space-12)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-6)', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Creative Events & Coverage Plans
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Perencanaan liputan dokumentasi, siaran langsung, dan produksi multimedia acara resmi institusi.
          </p>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary"
          style={{ fontSize: '13px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Plus size={16} /> Rencanakan Event
        </button>
      </div>

      {/* Events Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 'var(--space-6)' }}>
        {events.map((ev) => (
          <div key={ev.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span className={`status-pill status-${ev.status === 'upcoming' ? 'draft' : ev.status === 'ongoing' ? 'in_progress' : 'active'}`} style={{ fontSize: '11px', textTransform: 'uppercase' }}>
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
              marginTop: 'auto',
              fontSize: '12px',
              color: 'var(--text-secondary)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <span>Tim Kru: </span>
                <strong style={{ color: 'var(--text-primary)' }}>{ev.assignedCrew.join(', ')}</strong>
              </div>

              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={() => setSelectedEvent(ev)}
                  className="btn btn-secondary"
                  style={{ fontSize: '11px', padding: '4px 10px', color: '#2563eb' }}
                >
                  Detail Event
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Hapus rencana event "${ev.name}"?`)) {
                      deleteItem(ev.id);
                    }
                  }}
                  className="btn btn-secondary"
                  style={{ fontSize: '11px', padding: '4px 8px', color: 'var(--danger-color)' }}
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="modal-overlay" onClick={() => setSelectedEvent(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '620px', padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span className="badge" style={{ textTransform: 'uppercase' }}>{selectedEvent.status}</span>
                  <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                    {selectedEvent.name}
                  </h2>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span><CalendarDays size={13} style={{ display: 'inline', verticalAlign: 'middle' }} /> {selectedEvent.date}</span>
                  <span>•</span>
                  <span><MapPin size={13} style={{ display: 'inline', verticalAlign: 'middle' }} /> {selectedEvent.location}</span>
                </div>
              </div>

              <button onClick={() => setSelectedEvent(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '70vh', overflowY: 'auto' }}>
              <div>
                <span className="metadata-text">FORMAT & METODE LIPUTAN</span>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px' }}>
                  {selectedEvent.coverageType}
                </div>
              </div>

              <div>
                <span className="metadata-text">TIM KRU PRODUKSI BERTUGAS</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                  {selectedEvent.assignedCrew.map((crew, idx) => (
                    <span key={idx} className="badge" style={{ backgroundColor: '#eff6ff', color: '#1d4ed8' }}>
                      {crew}
                    </span>
                  ))}
                </div>
              </div>

              {selectedEvent.rundown && (
                <div>
                  <span className="metadata-text">RUNDOWN & SUSUNAN ACARA</span>
                  <div style={{ fontSize: '13px', color: '#475569', marginTop: '4px', backgroundColor: '#f8fafc', padding: '10px 14px', borderRadius: '6px', border: '1px solid #e2e8f0', lineHeight: 1.5 }}>
                    {selectedEvent.rundown}
                  </div>
                </div>
              )}

              {selectedEvent.equipment && (
                <div>
                  <span className="metadata-text">DAFTAR KEBUTUHAN ALAT & GEAR</span>
                  <div style={{ fontSize: '13px', color: '#475569', marginTop: '4px', backgroundColor: '#f8fafc', padding: '10px 14px', borderRadius: '6px', border: '1px solid #e2e8f0', lineHeight: 1.5 }}>
                    {selectedEvent.equipment}
                  </div>
                </div>
              )}

              {selectedEvent.deliverables && (
                <div>
                  <span className="metadata-text">TARGET OUTPUT DELIVERABLES</span>
                  <div style={{ fontSize: '13px', color: '#15803d', fontWeight: 600, marginTop: '4px' }}>
                    {selectedEvent.deliverables}
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer" style={{ borderTop: '1px solid var(--border-color)', padding: '14px 20px', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setSelectedEvent(null)} className="btn btn-primary" style={{ fontSize: '12px', padding: '6px 16px' }}>
                Tutup Detail
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Rencanakan Event Baru */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '560px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Rencanakan Agenda Event Baru</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateEvent}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Nama Acara / Kegiatan *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Malam Penganugerahan Insan Kreatif 6102"
                    className="form-input"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                  <div className="form-group">
                    <label className="form-label">Tanggal Pelaksanaan</label>
                    <input
                      type="text"
                      placeholder="18 April 2026"
                      className="form-input"
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Lokasi Acara</label>
                    <input
                      type="text"
                      placeholder="Gedung Rektorat Lt. 3"
                      className="form-input"
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                  <div className="form-group">
                    <label className="form-label">Format Liputan</label>
                    <select
                      className="form-input"
                      value={form.coverageType}
                      onChange={(e) => setForm({ ...form, coverageType: e.target.value })}
                    >
                      <option value="Multi-cam Live Stream & Drone Footage">Multi-cam Live Stream & Drone</option>
                      <option value="Foto Dokumentasi & Mini Dokumenter">Foto & Mini Dokumenter</option>
                      <option value="Rekaman Kelas & Highlight Reels">Rekaman & Reels</option>
                      <option value="Foto Liputan Jurnalistik">Foto Jurnalistik</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Kru Bertugas (Pisahkan Koma)</label>
                    <input
                      type="text"
                      className="form-input"
                      value={form.assignedCrew}
                      onChange={(e) => setForm({ ...form, assignedCrew: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Daftar Peralatan & Kebutuhan Alat</label>
                  <input
                    type="text"
                    placeholder="Contoh: Sony A7IV, DJI Drone, Wireless Mic"
                    className="form-input"
                    value={form.equipment}
                    onChange={(e) => setForm({ ...form, equipment: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Target Output / Deliverables</label>
                  <input
                    type="text"
                    placeholder="Contoh: Video Aftermovie 60s, Album Foto Drive"
                    className="form-input"
                    value={form.deliverables}
                    onChange={(e) => setForm({ ...form, deliverables: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  Simpan Agenda Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
