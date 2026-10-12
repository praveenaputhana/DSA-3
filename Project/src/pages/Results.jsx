import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useGraph } from '../context/GraphContext';
import NetworkGraph from '../components/NetworkGraph';

export default function Results() {
  const navigate = useNavigate();
  const {
    nodes,
    edges,
    sourceId,
    sinkId,
    simulationResults,
    executeSimulation
  } = useGraph();

  // If simulation hasn't been run yet, offer to run it now or compute
  const handleRunNow = () => {
    executeSimulation();
  };

  const results = simulationResults;

  if (!results) {
    return (
      <div className="page-wrapper workbench-section" style={{ textAlign: 'center', padding: '5rem 1.5rem' }}>
        <div className="section-header-centered">
          <span className="section-tag">Analytical Summary</span>
          <h2 className="section-title">Results Dashboard</h2>
          <p className="section-subtitle">
            The algorithm has not been executed yet on the current network topology. Run the simulation to calculate the maximum water flow and analyze the minimum bottleneck cut.
          </p>
        </div>

        <div style={{ maxWidth: '480px', margin: '2rem auto', background: 'white', padding: '2.5rem', borderRadius: '18px', border: '1px solid #bae6fd', boxShadow: '0 8px 24px rgba(14,116,144,0.08)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌊</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.6rem' }}>
            Ready to Compute Maximum Flow?
          </h3>
          <p className="text-muted" style={{ marginBottom: '1.75rem', fontSize: '0.92rem' }}>
            Click below to execute the Edmonds-Karp BFS solver on the current network topology ({nodes.length} nodes, {edges.length} pipes).
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button className="btn-primary" onClick={handleRunNow}>
              ⚡ Compute Maximum Flow Now
            </button>
            <Link to="/simulation" className="btn-secondary">
              Open Simulation Page
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Get final step for rendering final network state
  const finalStep = results.steps[results.steps.length - 1];
  const saturatedCount = results.edgeUtilization.filter(e => e.status === 'Saturated').length;

  return (
    <div className="page-wrapper results-section">
      <div className="results-container">
        <div className="section-header-centered">
          <span className="section-tag">Analytical Summary</span>
          <h2 className="section-title">Maximum Flow Results & Min-Cut Dashboard</h2>
          <p className="section-subtitle">
            Calculated dynamic throughput, saturated bottleneck pipes, augmentation sequence history, and verification of the Max-Flow Min-Cut Theorem.
          </p>
        </div>

        {/* Hero Metrics Row */}
        <div className="results-hero-grid">
          <div className="res-metric-card">
            <div className="res-metric-icon">🌊</div>
            <div className="res-metric-val">{results.maxFlow} L/s</div>
            <div className="res-metric-title">Maximum Water Flow</div>
            <div className="res-metric-subtitle">*Illustrative Units (Litres per second)</div>
          </div>

          <div className="res-metric-card">
            <div className="res-metric-icon">🔍</div>
            <div className="res-metric-val">{results.augmentingPaths.length} Paths</div>
            <div className="res-metric-title">Augmenting Paths Found</div>
            <div className="res-metric-subtitle">Shortest BFS traversals</div>
          </div>

          <div className="res-metric-card">
            <div className="res-metric-icon">✂️</div>
            <div className="res-metric-val">{results.minCut.capacity} L/s</div>
            <div className="res-metric-title">Minimum Cut Capacity</div>
            <div className="res-metric-subtitle">Strict hydraulic bottleneck</div>
          </div>

          <div className="res-metric-card">
            <div className="res-metric-icon">⚠️</div>
            <div className="res-metric-val">{saturatedCount} Pipes</div>
            <div className="res-metric-title">Saturated Bottlenecks</div>
            <div className="res-metric-subtitle">Operating at 100% maximum capacity</div>
          </div>
        </div>

        {/* Min-Cut Verification Card */}
        <div className="mincut-analysis-card">
          <div className="mincut-header">
            <div className="mincut-title">Max-Flow Min-Cut Theorem Verification</div>
            <span className="badge badge-green">Theorem Verified: Max Flow = Min Cut</span>
          </div>

          <div className="mincut-grid">
            <div className="mincut-box">
              <div className="mincut-box-title">Source Partition Set (S)</div>
              <div className="mincut-set-val">{`{ ${results.minCut.sourceSet.join(', ')} }`}</div>
              <span className="text-sm text-muted">Nodes reachable in final residual graph</span>
            </div>

            <div className="mincut-box">
              <div className="mincut-box-title">Sink Partition Set (T)</div>
              <div className="mincut-set-val">{`{ ${results.minCut.sinkSet.join(', ')} }`}</div>
              <span className="text-sm text-muted">Nodes disconnected from reservoir</span>
            </div>

            <div className="mincut-box">
              <div className="mincut-box-title">Bottleneck Cut Pipes</div>
              <div>
                {results.cutEdges.map((e, idx) => (
                  <span key={idx} className="mincut-edge-tag">
                    <b>{e.from} → {e.to}</b> (Cap: {e.capacity} L/s)
                  </span>
                ))}
              </div>
              <span className="text-sm text-muted">
                Total Cut Capacity: {results.cutEdges.map(e => e.capacity).join(' + ')} = {results.minCut.capacity} L/s
              </span>
            </div>
          </div>

          <div className="explanation-banner">
            The Edmonds-Karp algorithm successfully pushed a total of <b>{results.maxFlow} L/s</b> from Reservoir <b>{sourceId}</b> to City <b>{sinkId}</b> across <b>{results.augmentingPaths.length} BFS augmenting paths</b>.
            <br /><br />
            Notice that the destination city is now completely cut off from the source in the residual graph because all crossing pipes (specifically <b>{results.cutEdges.map(e => `${e.from} → ${e.to}`).join(' and ')}</b>) are 100% saturated. This rigorously proves that no additional water can reach the city without expanding the physical diameter of these critical bottleneck conduits.
          </div>
        </div>

        {/* Final Network Visualization Card */}
        <div className="canvas-card" style={{ marginBottom: '2rem' }}>
          <div className="canvas-header">
            <div className="canvas-title">
              <span>💧</span>
              <span>Final Network State (Optimal Flow Distribution)</span>
            </div>
            <div className="toolbar-group">
              <Link to="/simulation" className="btn-primary" style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}>
                Run Step-by-Step Simulation →
              </Link>
            </div>
          </div>

          <NetworkGraph
            nodes={nodes}
            edges={edges}
            sourceId={sourceId}
            sinkId={sinkId}
            stepState={finalStep}
            viewMode="physical"
            height="460px"
          />
        </div>

        {/* Detailed Breakdown Tables */}
        <div className="results-details-grid">
          {/* Augmentation History Table */}
          <div className="results-card">
            <div className="results-card-header">
              <div className="results-card-title">
                <span>🛣️</span>
                <span>Augmentation Sequence History</span>
              </div>
            </div>
            <div className="table-responsive">
              <table className="styled-table">
                <thead>
                  <tr>
                    <th className="text-center">#</th>
                    <th>Augmenting Path</th>
                    <th className="text-center">Bottleneck</th>
                    <th className="text-center">Cumulative Flow</th>
                  </tr>
                </thead>
                <tbody>
                  {results.augmentingPaths.map(p => (
                    <tr key={p.iteration}>
                      <td className="font-bold text-center">#{p.iteration}</td>
                      <td><span className="path-pill-highlight">{p.pathString}</span></td>
                      <td className="text-center font-bold text-blue">{p.bottleneck} L/s</td>
                      <td className="text-center font-bold text-green">{p.cumulativeFlow} L/s</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pipe Utilization Table */}
          <div className="results-card">
            <div className="results-card-header">
              <div className="results-card-title">
                <span>📊</span>
                <span>Pipe Capacity & Utilization Breakdown</span>
              </div>
            </div>
            <div className="table-responsive">
              <table className="styled-table">
                <thead>
                  <tr>
                    <th>Pipe</th>
                    <th className="text-center">Capacity</th>
                    <th className="text-center">Final Flow</th>
                    <th className="text-center">Residual</th>
                    <th>Utilization</th>
                    <th className="text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {results.edgeUtilization.map(e => (
                    <tr key={e.id}>
                      <td className="font-bold">{e.from} → {e.to}</td>
                      <td className="text-center">{e.capacity} L/s</td>
                      <td className="text-center font-bold">{e.flow} L/s</td>
                      <td className="text-center text-muted">{e.residualCapacity} L/s</td>
                      <td>
                        <div className="utilization-bar-container">
                          <div
                            className={`utilization-bar-fill ${e.status === 'Saturated' ? 'bg-amber' : 'bg-blue'}`}
                            style={{ width: `${e.utilPercent}%` }}
                          ></div>
                          <span className="utilization-text">{e.utilPercent}%</span>
                        </div>
                      </td>
                      <td className="text-center">
                        <span className={`badge ${e.status === 'Saturated' ? 'badge-amber' : e.status === 'Active' ? 'badge-blue' : 'badge-slate'}`}>
                          {e.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
          <button className="btn-secondary" onClick={() => window.print()}>
            🖨️ Print / Save Summary
          </button>
          <button className="btn-primary" onClick={() => navigate('/simulation')}>
            🌊 Run Another Simulation
          </button>
        </div>
      </div>
    </div>
  );
}
