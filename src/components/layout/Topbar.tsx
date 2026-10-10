import { Bell, Search, User } from 'lucide-react';

export default function Topbar() {
  return (
    <header className="topbar" style={{ justifyContent: 'space-between' }}>
      <div className="breadcrumbs" style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
        Dashboard
      </div>
      <div className="topbar-actions" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
        <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
          <Search size={18} />
        </button>
        <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
          <Bell size={18} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginLeft: 'var(--space-2)' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={16} color="var(--text-secondary)" />
          </div>
        </div>
      </div>
    </header>
  );
}
