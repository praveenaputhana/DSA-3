import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Algorithm() {
  const navigate = useNavigate();

  return (
    <div className="page-wrapper theory-section">
      <div className="section-header-centered">
        <span className="section-tag">Academic Foundations</span>
        <h2 className="section-title">Edmonds–Karp Algorithm & Flow Theory</h2>
        <p className="section-subtitle">
          A comprehensive mathematical and hydraulic engineering breakdown designed for college examinations, presentations, and algorithmic mastery.
        </p>
      </div>

      {/* Main Concept Cards */}
      <div className="theory-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="theory-card">
          <div className="theory-card-icon">🌊</div>
          <h3 className="theory-card-title">1. Flow Network & Capacity</h3>
          <p className="theory-card-desc">
            A flow network is a directed graph G = (V, E) where each directed edge (u, v) has a non-negative capacity c(u, v) ≥ 0. In our hydraulic distribution analogy, capacities represent the physical diameter limit of pipes carrying water from reservoirs to intermediate tanks.
          </p>
          <div className="theory-highlight-box">
            Capacity Constraint: 0 ≤ f(u, v) ≤ c(u, v)
          </div>
        </div>

        <div className="theory-card">
          <div className="theory-card-icon">⚖️</div>
          <h3 className="theory-card-title">2. Conservation of Flow</h3>
          <p className="theory-card-desc">
            For every intermediate junction or storage tank (every vertex other than Source S and City Sink T), the total rate of water flowing into the node must strictly equal the total rate of water flowing out. Water neither accumulates nor leaks.
          </p>
          <div className="theory-highlight-box">
            Flow Conservation: Σ f(u, v) = Σ f(v, w)
          </div>
        </div>

        <div className="theory-card">
          <div className="theory-card-icon">🔍</div>
          <h3 className="theory-card-title">3. BFS Shortest Path Guarantee</h3>
          <p className="theory-card-desc">
            While the general Ford-Fulkerson method permits any arbitrary path search (which may loop infinitely on irrational capacities or take O(E · |f|) steps), the <b>Edmonds–Karp variation</b> enforces <b>Breadth-First Search (BFS)</b> to select the path with the fewest edges.
          </p>
          <div className="theory-highlight-box">
            Guarantees monotonically non-decreasing shortest path lengths.
          </div>
        </div>

        <div className="theory-card">
          <div className="theory-card-icon">⚡</div>
          <h3 className="theory-card-title">4. Augmenting Path & Bottleneck</h3>
          <p className="theory-card-desc">
            An augmenting path is a simple directed path from source S to sink T in the residual graph where every edge has positive remaining capacity. The bottleneck capacity is the smallest available residual capacity along this path.
          </p>
          <div className="theory-highlight-box">
            Bottleneck: Δ = min &#123; c_f(u, v) : (u, v) ∈ Path &#125;
          </div>
        </div>

        <div className="theory-card">
          <div className="theory-card-icon">↩️</div>
          <h3 className="theory-card-title">5. Residual Graph & Reverse Edges</h3>
          <p className="theory-card-desc">
            Whenever water flow f(u, v) is pushed forward along an edge, a reverse edge (v, u) with capacity equal to f(u, v) is recorded in the residual graph.
          </p>
          <div className="theory-highlight-box">
            Why reverse edges? They permit the algorithm to cancel or reroute earlier suboptimal flow choices!
          </div>
        </div>

        <div className="theory-card">
          <div className="theory-card-icon">🏁</div>
          <h3 className="theory-card-title">6. Max-Flow Min-Cut Theorem</h3>
          <p className="theory-card-desc">
            The algorithm terminates when BFS can no longer find any augmenting path from S to T. The set of vertices reachable from S forms a cut (S, T) whose total capacity equals the maximum flow, proving global optimality.
          </p>
          <div className="theory-highlight-box">
            Max Flow = Min Cut Capacity (Dual Optimality)
          </div>
        </div>
      </div>

      {/* Asymptotic Complexity Section */}
      <div className="complexity-card">
        <div>
          <span className="section-tag">Asymptotic Analysis</span>
          <h3 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', margin: '0.5rem 0' }}>
            Edmonds–Karp Complexity
          </h3>
          <div className="complexity-big-metric">O(V · E²)</div>
          <p className="text-muted" style={{ marginTop: '0.75rem' }}>
            where <b>V</b> is the number of vertices (reservoirs, tanks, junctions, city) and <b>E</b> is the number of pipes.
          </p>
        </div>

        <div>
          <div className="complexity-proof-item">
            <span className="proof-check">✓</span>
            <div>
              <b>Monotonic Distances:</b> In each augmentation, the shortest distance from source S to any node v never decreases: δ_(i+1)(S, v) ≥ δ_i(S, v).
            </div>
          </div>

          <div className="complexity-proof-item">
            <span className="proof-check">✓</span>
            <div>
              <b>Critical Edge Bound:</b> An edge becomes critical (bottlenecked) at most O(V) times. Across all E edges, total augmentations cannot exceed O(V · E).
            </div>
          </div>

          <div className="complexity-proof-item">
            <span className="proof-check">✓</span>
            <div>
              <b>BFS Traversal Cost:</b> Each BFS step runs in O(E) time. Multiplying yields the rigorous polynomial upper bound O(V · E · E) = O(V · E²).
            </div>
          </div>

          <div className="complexity-proof-item">
            <span className="proof-check">✓</span>
            <div>
              <b>Space Complexity:</b> O(V + E) to maintain adjacency lists, residual capacities, queue structures, and parent backtracking maps.
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="results-card" style={{ marginBottom: '2.5rem' }}>
        <div className="results-card-header">
          <div className="results-card-title">
            <span>⚖️</span>
            <span>Maximum Flow Algorithms Comparison</span>
          </div>
        </div>
        <div className="table-responsive">
          <table className="styled-table">
            <thead>
              <tr>
                <th>Algorithm</th>
                <th>Augmenting Strategy</th>
                <th>Time Complexity</th>
                <th>Key Characteristic</th>
                <th>Hydraulic Fit</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ background: '#f0f9ff' }}>
                <td className="font-bold text-blue">Edmonds–Karp (Our Project)</td>
                <td>Breadth-First Search (BFS)</td>
                <td className="font-bold text-blue">O(V · E²)</td>
                <td>Polynomial guarantee, avoids infinite loops</td>
                <td>Ideal for educational visualization & municipal grids</td>
              </tr>
              <tr>
                <td className="font-bold">Ford–Fulkerson</td>
                <td>Depth-First Search (DFS) / Any Path</td>
                <td>O(E · |f|)</td>
                <td>Pseudopolynomial; depends on capacity magnitude</td>
                <td>Small integer networks only</td>
              </tr>
              <tr>
                <td className="font-bold">Dinic’s Algorithm</td>
                <td>Layered Level Graph + Blocking Flow</td>
                <td>O(V² · E)</td>
                <td>Faster for dense networks</td>
                <td>High-throughput national grids</td>
              </tr>
              <tr>
                <td className="font-bold">Push-Relabel (Goldberg-Tarjan)</td>
                <td>Local Node Excess + Height Labels</td>
                <td>O(V³) or O(V² √E)</td>
                <td>Does not search global end-to-end paths</td>
                <td>Massive industrial flow networks</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* CTA Button */}
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <button
          className="btn-primary"
          onClick={() => navigate('/simulation')}
          style={{ padding: '0.85rem 2rem', fontSize: '1.05rem' }}
        >
          🌊 Try Simulation Now →
        </button>
      </div>
    </div>
  );
}
