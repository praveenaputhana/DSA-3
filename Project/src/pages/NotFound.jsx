import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="page-wrapper" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
      <div style={{ maxWidth: '480px', margin: '0 auto', background: 'white', padding: '3rem', borderRadius: '18px', border: '1px solid #bae6fd', boxShadow: '0 8px 24px rgba(14,116,144,0.08)' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💧 404</div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.6rem' }}>
          Page Not Found
        </h2>
        <p className="text-muted" style={{ marginBottom: '2rem', fontSize: '0.95rem' }}>
          The requested URL does not exist in the Edmonds–Karp Water Distribution Network application.
        </p>
        <Link to="/" className="btn-primary" style={{ padding: '0.8rem 1.6rem' }}>
          ← Return to Home Page
        </Link>
      </div>
    </div>
  );
}
