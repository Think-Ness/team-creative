'use client';

import { useState } from 'react';
import { Copy, Check, Download, Palette, Type, CheckCircle, XCircle } from 'lucide-react';

interface ColorToken {
  name: string;
  role: string;
  hex: string;
  dark?: boolean;
}

const BRAND_COLORS: ColorToken[] = [
  { name: 'Brand Primary Dark', role: 'Main dark accent / Primary buttons', hex: '#0F172A', dark: true },
  { name: 'Neutral Canvas', role: 'Application background', hex: '#F8FAFC' },
  { name: 'Surface White', role: 'Cards and container panels', hex: '#FFFFFF' },
  { name: 'Border Subtle', role: 'Dividers and structural borders', hex: '#E2E8F0' },
  { name: 'Text Primary', role: 'Headlines and high-contrast labels', hex: '#0F172A', dark: true },
  { name: 'Text Muted', role: 'Secondary metadata and subheadings', hex: '#64748B' },
  { name: 'Emerald Success', role: 'Approved / Completed states', hex: '#10B981', dark: true },
  { name: 'Amber Warning', role: 'In review / Urgent milestones', hex: '#F59E0B' },
];

export default function BrandPage() {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const copyColor = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>
          Brand Design System & Guidelines
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Standar resmi identitas visual 6102 Creative Network untuk seluruh unit kampus dan media publikasi.
        </p>
      </div>

      {/* 1. Color Palette Section */}
      <div className="card" style={{ marginBottom: 'var(--space-8)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
          <Palette size={20} />
          <h2 style={{ fontSize: '18px', fontWeight: 600 }}>Sistem Warna (Color Tokens)</h2>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>
          Palet netral berstandar editorial dengan kontras tinggi untuk kenyamanan membaca. Klik kartu warna untuk menyalin nilai HEX.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
          {BRAND_COLORS.map((c) => (
            <div
              key={c.name}
              onClick={() => copyColor(c.hex)}
              style={{
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                cursor: 'pointer',
                background: 'var(--surface-color)',
                transition: 'transform 0.15s ease',
              }}
            >
              <div style={{ 
                height: '80px', 
                backgroundColor: c.hex,
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
                padding: 'var(--space-2)'
              }}>
                <span style={{ 
                  fontSize: '11px', 
                  fontFamily: 'monospace', 
                  padding: '2px 6px',
                  borderRadius: '4px',
                  background: 'rgba(255,255,255,0.85)',
                  color: '#0f172a',
                  fontWeight: 600
                }}>
                  {copiedHex === c.hex ? '✓ Tersalin!' : c.hex}
                </span>
              </div>
              <div style={{ padding: 'var(--space-3)' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{c.name}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>{c.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Typography Scale */}
      <div className="card" style={{ marginBottom: 'var(--space-8)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
          <Type size={20} />
          <h2 style={{ fontSize: '18px', fontWeight: 600 }}>Tipografi & Hirarki Teks</h2>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>
          Font resmi menggunakan Inter (-apple-system / sans-serif) dengan skala ritme vertikal 4/8px.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', borderTop: '1px solid var(--border-color)', paddingTop: 'var(--space-4)' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)' }}>Display Heading (32px Bold)</span>
            <span style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>h1, .display-text</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)' }}>Section Title (20px SemiBold)</span>
            <span style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>h2, .page-title</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '14px', color: 'var(--text-primary)' }}>Body Text Reguler (14px Regular, Line height 1.5)</span>
            <span style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>p, .body-text</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Metadata & Label Subtitle (12px Medium)</span>
            <span style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>.metadata-text</span>
          </div>
        </div>
      </div>

      {/* 3. Do's & Don'ts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 'var(--space-6)' }}>
        <div className="card" style={{ borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
            <CheckCircle size={18} color="#10b981" />
            <h3 style={{ fontSize: '15px', fontWeight: 600 }}>Praktik Desain yang Dianjurkan (Do)</h3>
          </div>
          <ul style={{ paddingLeft: 'var(--space-4)', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            <li>Gunakan ruang negatif (whitespace) yang cukup di sekitar logogram (minimal 24px).</li>
            <li>Prioritaskan tipografi yang jelas dan mudah dibaca pada poster maupun feed.</li>
            <li>Gunakan palet warna netral sebagai pondasi utama sebelum menambahkan aksen.</li>
            <li>Simpan seluruh file master beresolusi tinggi di Google Drive resmi unit.</li>
          </ul>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #ef4444' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
            <XCircle size={18} color="#ef4444" />
            <h3 style={{ fontSize: '15px', fontWeight: 600 }}>Hal yang Dilarang (Don't)</h3>
          </div>
          <ul style={{ paddingLeft: 'var(--space-4)', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            <li>Jangan mengubah rasio aspek atau merenggangkan (stretch) bentuk logo 6102.</li>
            <li>Hindari efek bayangan berlebihan (heavy drop shadow) atau gradient menyala tanpa panduan.</li>
            <li>Dilarang menggunakan logo versi lama atau resolusi rendah pada publikasi resmi.</li>
            <li>Hindari penempatan logo di atas foto latar belakang yang terlalu ramai tanpa kontras memadai.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
