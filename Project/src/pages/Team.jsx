import React from 'react';
import { Link } from 'react-router-dom';

export default function Team() {
  return (
    <div className="page-wrapper about-section">
      <div className="about-container">
        <div className="about-card-hero">
          <div className="section-header-centered" style={{ marginBottom: '2rem' }}>
            <span className="section-tag">Academic Credentials</span>
            <h2 className="section-title">Project Information & Engineering Team</h2>
            <p className="section-subtitle">
              Demonstrating algorithmic problem solving through real-world hydraulic engineering principles.
            </p>
          </div>

          {/* Project Metadata Grid */}
          <div className="about-meta-grid">
            <div className="about-meta-box">
              <div className="about-meta-label">Project Title</div>
              <div className="about-meta-val">Edmonds–Karp Maximum Flow Visualization Using BFS</div>
            </div>

            <div className="about-meta-box">
              <div className="about-meta-label">Engineering Application</div>
              <div className="about-meta-val">Municipal Water Distribution Network</div>
            </div>

            <div className="about-meta-box">
              <div className="about-meta-label">Subject & Course</div>
              <div className="about-meta-val">DSA 3 (Data Structures & Algorithms 3)</div>
            </div>
          </div>

          {/* Team Members Grid */}
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.25rem', textAlign: 'center' }}>
            Project Team Members
          </h3>

          <div className="team-grid">
            <div className="team-member-card">
              <div className="member-avatar">YU</div>
              <div className="member-name">Y. Uttej</div>
              <div className="member-roll">2520030439</div>
              <div className="member-role-sub">Team Member • DSA 3</div>
            </div>

            <div className="team-member-card">
              <div className="member-avatar">GH</div>
              <div className="member-name">G. Hitesh</div>
              <div className="member-roll">2520030370</div>
              <div className="member-role-sub">Team Member • DSA 3</div>
            </div>

            <div className="team-member-card">
              <div className="member-avatar">KS</div>
              <div className="member-name">K. Sudheer</div>
              <div className="member-roll">2520030470</div>
              <div className="member-role-sub">Team Member • DSA 3</div>
            </div>
          </div>

          {/* Project Guide Card */}
          <div className="guide-box">
            <div className="guide-info-left">
              <div className="guide-icon">🎓</div>
              <div>
                <div className="about-meta-label">Project Guide & Mentor</div>
                <div className="guide-name">J. Yamini Devi</div>
                <div className="guide-designation">Faculty Mentor • Department of Computer Science & Engineering</div>
              </div>
            </div>
            <span className="badge badge-blue">Faculty Guide</span>
          </div>

          {/* Return Home Button */}
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/" className="btn-primary" style={{ padding: '0.8rem 1.8rem' }}>
              ← Return to Home Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
