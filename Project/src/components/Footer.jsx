import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div>
          <div className="footer-brand-title">Edmonds–Karp Maximum Flow Visualization Using BFS</div>
          <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.25rem' }}>
            Real-World Application: Municipal Water Distribution Network • DSA 3 Project
          </div>
          <div style={{ marginTop: '0.75rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/" style={{ color: '#38bdf8', fontSize: '0.82rem', textDecoration: 'none' }}>Home</Link>
            <Link to="/workbench" style={{ color: '#38bdf8', fontSize: '0.82rem', textDecoration: 'none' }}>Workbench</Link>
            <Link to="/simulation" style={{ color: '#38bdf8', fontSize: '0.82rem', textDecoration: 'none' }}>Simulation</Link>
            <Link to="/results" style={{ color: '#38bdf8', fontSize: '0.82rem', textDecoration: 'none' }}>Results</Link>
            <Link to="/algorithm" style={{ color: '#38bdf8', fontSize: '0.82rem', textDecoration: 'none' }}>Algorithm Theory</Link>
            <Link to="/team" style={{ color: '#38bdf8', fontSize: '0.82rem', textDecoration: 'none' }}>Project Team</Link>
          </div>
        </div>
        <div style={{ textAlign: 'right', fontSize: '0.85rem' }}>
          <div>Guided by: <b>J. Yamini Devi</b></div>
          <div style={{ color: '#64748b' }}>Team: Y. Uttej | G. Hitesh | K. Sudheer</div>
          <div style={{ color: '#64748b', fontSize: '0.78rem', marginTop: '0.25rem' }}>Course: Data Structures & Algorithms 3</div>
        </div>
      </div>
      <div className="footer-copy">
        © 2026 Edmonds–Karp Water Distribution Simulator. Built with React.js, React Router, CSS & Vis Network.
      </div>
    </footer>
  );
}
