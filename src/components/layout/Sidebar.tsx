import Link from 'next/link';
import { 
  LayoutDashboard, 
  FolderOpen, 
  CheckSquare, 
  Calendar, 
  Users, 
  Building2,
  CalendarDays,
  Palette,
  Image as ImageIcon,
  CheckCircle,
  Activity,
  Settings,
  inbox
} from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div style={{ padding: 'var(--space-4) var(--space-6)', borderBottom: '1px solid var(--border-color)', fontWeight: 600 }}>
        6102 CREATIVE
      </div>
      <div style={{ padding: 'var(--space-4) 0', flex: 1, overflowY: 'auto' }}>
        <div className="nav-section">
          <div className="nav-section-title" style={{ padding: '0 var(--space-6)', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: 'var(--space-2)', fontWeight: 500 }}>
            WORK
          </div>
          <Link href="/requests" className="nav-item" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-2) var(--space-6)', color: 'var(--text-primary)' }}>
            <FolderOpen size={16} /> Requests
          </Link>
          <Link href="/projects" className="nav-item" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-2) var(--space-6)', color: 'var(--text-primary)' }}>
            <LayoutDashboard size={16} /> Projects
          </Link>
          <Link href="/tasks" className="nav-item" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-2) var(--space-6)', color: 'var(--text-primary)' }}>
            <CheckSquare size={16} /> Tasks
          </Link>
          <Link href="/content" className="nav-item" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-2) var(--space-6)', color: 'var(--text-primary)' }}>
            <ImageIcon size={16} /> Content
          </Link>
          <Link href="/calendar" className="nav-item" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-2) var(--space-6)', color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}>
            <Calendar size={16} /> Calendar
          </Link>
        </div>
        
        <div className="nav-section">
          <div className="nav-section-title" style={{ padding: '0 var(--space-6)', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: 'var(--space-2)', fontWeight: 500 }}>
            NETWORK
          </div>
          <Link href="/talent" className="nav-item" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-2) var(--space-6)', color: 'var(--text-primary)' }}>
            <Users size={16} /> Talent
          </Link>
          <Link href="/campuses" className="nav-item" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-2) var(--space-6)', color: 'var(--text-primary)' }}>
            <Building2 size={16} /> Campuses
          </Link>
          <Link href="/events" className="nav-item" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-2) var(--space-6)', color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}>
            <CalendarDays size={16} /> Events
          </Link>
        </div>

        <div className="nav-section">
          <div className="nav-section-title" style={{ padding: '0 var(--space-6)', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: 'var(--space-2)', fontWeight: 500 }}>
            LIBRARY
          </div>
          <Link href="/brand" className="nav-item" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-2) var(--space-6)', color: 'var(--text-primary)' }}>
            <Palette size={16} /> Brand
          </Link>
          <Link href="/assets" className="nav-item" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-2) var(--space-6)', color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}>
            <FolderOpen size={16} /> Assets
          </Link>
        </div>

        <div className="nav-section">
          <div className="nav-section-title" style={{ padding: '0 var(--space-6)', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: 'var(--space-2)', fontWeight: 500 }}>
            GOVERNANCE
          </div>
          <Link href="/approvals" className="nav-item" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-2) var(--space-6)', color: 'var(--text-primary)' }}>
            <CheckCircle size={16} /> Approvals
          </Link>
          <Link href="/activity" className="nav-item" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-2) var(--space-6)', color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}>
            <Activity size={16} /> Activity
          </Link>
        </div>
      </div>
      
      <div style={{ padding: 'var(--space-4) 0', borderTop: '1px solid var(--border-color)' }}>
        <Link href="/settings" className="nav-item" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-2) var(--space-6)', color: 'var(--text-primary)' }}>
          <Settings size={16} /> Settings
        </Link>
      </div>
    </aside>
  );
}
