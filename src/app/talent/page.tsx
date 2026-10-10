export default function TalentPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="page-title">Talent</h1>
        <button className="btn btn-primary">Create New</button>
      </header>
      
      <div className="card" style={{ padding: 'var(--space-12)', textAlign: 'center' }}>
        <div className="body-text" style={{ marginBottom: 'var(--space-4)' }}>
          No talent found.
        </div>
        <button className="btn btn-secondary">Get Started</button>
      </div>
    </div>
  );
}
