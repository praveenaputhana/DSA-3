import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGraph } from '../context/GraphContext';

export default function Home() {
  const navigate = useNavigate();
  const { nodes, edges, loadDefaultSample } = useGraph();

  const handleStartSimulation = () => {
    navigate('/simulation', { state: { autoPlay: true } });
  };

  const handleLoadSample = () => {
    loadDefaultSample();
    navigate('/workbench');
  };

  return (
    <div className="page-wrapper">
      {/* Hero Section */}
      <section className="hero-section" id="hero">
        <div className="hero-container">
          <div className="hero-content-col">
            <div className="hero-badge-pill">
              <span class="hero-badge-dot"></span>
              <span>DSA 3 Project • Breadth-First Search (BFS)</span>
            </div>

            <h1 className="hero-title">
              Edmonds–Karp <br />
              <span className="hero-title-highlight">Maximum Flow Visualization</span> <br />
              Using BFS
            </h1>

            <p className="hero-subtitle">
              Interactive Water Distribution Network
            </p>

            <p className="hero-description">
              Demonstrating how municipal water flows from an uphill reservoir to an urban destination city through interconnected pipes with strict capacity constraints. Experience how Breadth-First Search systematically calculates the absolute peak water throughput using augmenting paths and reverse residual edges.
            </p>

            {/* Direct Multi-Page Navigation Buttons */}
            <div className="hero-actions">
              <button
                className="btn-primary"
                onClick={handleStartSimulation}
                id="btn-home-start-sim"
              >
                <span>🌊 Start Simulation</span>
              </button>

              <Link to="/algorithm" className="btn-secondary" id="btn-home-learn-algo">
                <span>📘 Learn the Algorithm</span>
              </Link>

              <Link to="/results" className="btn-secondary" id="btn-home-view-results">
                <span>📊 View Results</span>
              </Link>

              <button
                className="btn-ctrl"
                onClick={handleLoadSample}
                title="Loads sample network and opens Workbench"
                style={{ padding: '0.85rem 1.25rem', borderRadius: '12px', background: 'white' }}
              >
                <span>⚡ Load Sample Network</span>
              </button>
            </div>

            <div className="hero-stats-row">
              <div className="hero-stat-card">
                <div className="hero-stat-val">O(V · E²)</div>
                <div className="hero-stat-label">Time Complexity</div>
              </div>
              <div className="hero-stat-card">
                <div className="hero-stat-val">BFS Shortest</div>
                <div className="hero-stat-label">Augmenting Strategy</div>
              </div>
              <div className="hero-stat-card">
                <div className="hero-stat-val">Max-Flow = Min-Cut</div>
                <div className="hero-stat-label">Dual Optimality</div>
              </div>
            </div>
          </div>

          {/* Hero Illustration Card */}
          <div className="hero-illustration">
            <div className="hero-card-header">
              <div className="font-bold text-blue">Hydraulic Network Simulation</div>
              <span className="hero-badge-status">System Online</span>
            </div>

            {/* SVG Schematic representing Reservoir to City pipes */}
            <svg className="hydraulic-schematic" viewBox="0 0 460 210" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="20" y1="50" x2="440" y2="50" stroke="#bae6fd" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="20" y1="105" x2="440" y2="105" stroke="#bae6fd" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="20" y1="160" x2="440" y2="160" stroke="#bae6fd" strokeWidth="1" strokeDasharray="4 4" />

              {/* Conduits */}
              <path d="M 60 105 L 170 50" stroke="#0284c7" strokeWidth="6" strokeLinecap="round" />
              <text x="95" y="65" fill="#0369a1" fontSize="11" fontWeight="bold">10 L/s</text>

              <path d="M 60 105 L 170 160" stroke="#0284c7" strokeWidth="5" strokeLinecap="round" />
              <text x="95" y="150" fill="#0369a1" fontSize="11" fontWeight="bold">8 L/s</text>

              <path d="M 170 50 L 170 160" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" strokeDasharray="5 3" />
              <text x="175" y="105" fill="#0284c7" fontSize="10" fontWeight="bold">2 L/s</text>

              <path d="M 170 50 L 290 50" stroke="#0284c7" strokeWidth="4" strokeLinecap="round" />
              <text x="220" y="42" fill="#0369a1" fontSize="11" fontWeight="bold">5 L/s</text>

              <path d="M 170 160 L 290 50" stroke="#0284c7" strokeWidth="6" strokeLinecap="round" />
              <text x="215" y="115" fill="#0369a1" fontSize="11" fontWeight="bold">10 L/s</text>

              <path d="M 170 160 L 290 160" stroke="#0284c7" strokeWidth="4" strokeLinecap="round" />
              <text x="220" y="180" fill="#0369a1" fontSize="11" fontWeight="bold">5 L/s</text>

              <path d="M 290 50 L 400 105" stroke="#0284c7" strokeWidth="5" strokeLinecap="round" />
              <text x="350" y="65" fill="#0369a1" fontSize="11" fontWeight="bold">7 L/s</text>

              <path d="M 290 160 L 400 105" stroke="#0284c7" strokeWidth="5.5" strokeLinecap="round" />
              <text x="350" y="150" fill="#0369a1" fontSize="11" fontWeight="bold">8 L/s</text>

              {/* Nodes */}
              <rect x="25" y="75" width="55" height="60" rx="8" fill="#0369a1" stroke="#082f49" strokeWidth="2" />
              <text x="52" y="102" fill="white" fontSize="16" fontWeight="bold" textAnchor="middle">S</text>
              <text x="52" y="122" fill="#bae6fd" fontSize="9" textAnchor="middle">Reservoir</text>

              <circle cx="170" cy="50" r="22" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2.5" />
              <text x="170" y="55" fill="#0f172a" fontSize="13" fontWeight="bold" textAnchor="middle">A</text>

              <circle cx="170" cy="160" r="22" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2.5" />
              <text x="170" y="165" fill="#0f172a" fontSize="13" fontWeight="bold" textAnchor="middle">B</text>

              <circle cx="290" cy="50" r="22" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2.5" />
              <text x="290" y="55" fill="#0f172a" fontSize="13" fontWeight="bold" textAnchor="middle">C</text>

              <circle cx="290" cy="160" r="22" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2.5" />
              <text x="290" y="165" fill="#0f172a" fontSize="13" fontWeight="bold" textAnchor="middle">D</text>

              <rect x="375" y="75" width="60" height="60" rx="8" fill="#059669" stroke="#064e3b" strokeWidth="2" />
              <text x="405" y="102" fill="white" fontSize="16" fontWeight="bold" textAnchor="middle">T</text>
              <text x="405" y="122" fill="#a7f3d0" fontSize="9" textAnchor="middle">City Sink</text>
            </svg>

            <div className="hydraulic-tanks-widget">
              <div className="tank-indicator">
                <span className="tank-label">Reservoir Supply (S)</span>
                <div className="tank-visual">
                  <div className="tank-water-level" style={{ height: '90%' }}></div>
                </div>
                <span className="text-sm text-muted">Head Source</span>
              </div>

              <div className="tank-pipe-flow">
                <span className="flow-pipe-arrow">➔➔</span>
                <span className="flow-meter-text">{edges.length} Pipes Connected</span>
                <span className="text-sm text-muted">Active Topology</span>
              </div>

              <div className="tank-indicator">
                <span className="tank-label">City Demand (T)</span>
                <div className="tank-visual">
                  <div className="tank-water-level" style={{ height: '70%' }}></div>
                </div>
                <span className="text-sm text-muted">Urban Sink</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Overview Feature Cards Section */}
      <section className="workbench-section">
        <div className="section-header-centered">
          <span className="section-tag">Project Architecture</span>
          <h2 className="section-title">Explore the Multi-Page Application</h2>
          <p className="section-subtitle">
            Navigate through dedicated pages designed for graph construction, real-time algorithm execution, results analysis, and academic theory.
          </p>
        </div>

        <div className="theory-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          <div className="theory-card">
            <div className="theory-card-icon">🛠️</div>
            <h3 className="theory-card-title">Network Workbench</h3>
            <p className="theory-card-desc">
              Create, customize, and edit the water network. Add reservoirs, storage tanks, junction valves, and directed water conduits with capacities.
            </p>
            <div style={{ marginTop: '1.25rem' }}>
              <Link to="/workbench" className="btn-secondary" style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}>
                Open Workbench →
              </Link>
            </div>
          </div>

          <div className="theory-card">
            <div className="theory-card-icon">▶️</div>
            <h3 className="theory-card-title">Live Simulation</h3>
            <p className="theory-card-desc">
              Watch Edmonds-Karp Breadth-First Search traverse the residual graph in real time. Step forward, step backward, or play the automated animation.
            </p>
            <div style={{ marginTop: '1.25rem' }}>
              <Link to="/simulation" state={{ autoPlay: true }} className="btn-primary" style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}>
                Start Simulation →
              </Link>
            </div>
          </div>

          <div className="theory-card">
            <div className="theory-card-icon">📊</div>
            <h3 className="theory-card-title">Results Dashboard</h3>
            <p className="theory-card-desc">
              Inspect the calculated maximum throughput, augmentation path sequence, pipe utilization percentage, and the minimum bottleneck cut verification.
            </p>
            <div style={{ marginTop: '1.25rem' }}>
              <Link to="/results" className="btn-secondary" style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}>
                View Dashboard →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
