export default function Loading() {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: 'var(--space-4) 0' }}>
      <div style={{ 
        width: '240px', 
        height: '32px', 
        backgroundColor: '#e2e8f0', 
        borderRadius: 'var(--radius-sm)',
        marginBottom: 'var(--space-2)' 
      }} />
      <div style={{ 
        width: '380px', 
        height: '18px', 
        backgroundColor: '#f1f5f9', 
        borderRadius: 'var(--radius-sm)',
        marginBottom: 'var(--space-8)' 
      }} />

      <div className="stat-grid">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="stat-card" style={{ height: '110px', backgroundColor: '#f8fafc' }} />
        ))}
      </div>

      <div style={{ 
        height: '350px', 
        backgroundColor: '#f8fafc', 
        border: '1px solid var(--border-color)', 
        borderRadius: 'var(--radius-lg)' 
      }} />
    </div>
  );
}
