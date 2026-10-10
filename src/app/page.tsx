export default function Dashboard() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      <header>
        <h1 className="page-title">Dashboard</h1>
        <p className="body-text">Good morning, Ahmad.</p>
      </header>

      {/* Global Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)' }}>
        <div className="card">
          <div className="metadata-text">Active Projects</div>
          <div style={{ fontSize: '24px', fontWeight: 600, marginTop: 'var(--space-2)' }}>12</div>
        </div>
        <div className="card">
          <div className="metadata-text">Pending Requests</div>
          <div style={{ fontSize: '24px', fontWeight: 600, marginTop: 'var(--space-2)' }}>5</div>
        </div>
        <div className="card">
          <div className="metadata-text">Approvals</div>
          <div style={{ fontSize: '24px', fontWeight: 600, marginTop: 'var(--space-2)' }}>3</div>
        </div>
        <div className="card">
          <div className="metadata-text">Upcoming Deadlines</div>
          <div style={{ fontSize: '24px', fontWeight: 600, marginTop: 'var(--space-2)' }}>8</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
        {/* My Tasks */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <h3 className="section-title" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: 'var(--space-2)' }}>My Tasks</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Project</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Review Logo Draft</td>
                  <td>PG Identity</td>
                  <td><span className="badge" style={{ borderColor: 'var(--warning-color)', color: 'var(--warning-color)' }}>Review</span></td>
                </tr>
                <tr>
                  <td>Update Brand Guidelines</td>
                  <td>6102 Identity</td>
                  <td><span className="badge" style={{ borderColor: 'var(--info-color)', color: 'var(--info-color)' }}>In Progress</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Active Projects */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <h3 className="section-title" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: 'var(--space-2)' }}>Active Projects</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Deadline</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>PG Identity</td>
                  <td>24 Oct 2026</td>
                  <td><span className="badge">Production</span></td>
                </tr>
                <tr>
                  <td>Documentary Campus A</td>
                  <td>28 Oct 2026</td>
                  <td><span className="badge" style={{ borderColor: 'var(--warning-color)', color: 'var(--warning-color)' }}>Review</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <h3 className="section-title" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: 'var(--space-2)' }}>Recent Activity</h3>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
            <div className="metadata-text" style={{ width: '60px' }}>10:21</div>
            <div className="body-text">Ahmad submitted Logo 6102 v3</div>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
            <div className="metadata-text" style={{ width: '60px' }}>10:45</div>
            <div className="body-text">Creative Lead requested revision</div>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
            <div className="metadata-text" style={{ width: '60px' }}>11:20</div>
            <div className="body-text">Ahmad uploaded revision</div>
          </div>
        </div>
      </div>

    </div>
  );
}
