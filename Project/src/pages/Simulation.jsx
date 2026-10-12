import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useGraph } from '../context/GraphContext';
import NetworkGraph from '../components/NetworkGraph';

export default function Simulation({ showToast }) {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    nodes,
    edges,
    sourceId,
    sinkId,
    simulationResults,
    executeSimulation,
    loadDefaultSample,
    loadBottleneckSample
  } = useGraph();

  // Step & Playback state
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(1.5);
  const [viewMode, setViewMode] = useState('physical'); // 'physical' or 'residual'
  const [pathsOnlyFilter, setPathsOnlyFilter] = useState(false);
  const [physicsOn, setPhysicsOn] = useState(false);

  const playTimerRef = useRef(null);

  // Derive a stable signature of network topology & capacities
  const topologySignature = React.useMemo(() => {
    const nSig = nodes.map(n => `${n.id}:${n.role}:${n.x || 0}:${n.y || 0}`).join(';');
    const eSig = edges.map(e => `${e.id}:${e.from}->${e.to}:${e.capacity}`).join(';');
    return `${sourceId}->${sinkId}|N:${nSig}|E:${eSig}`;
  }, [nodes, edges, sourceId, sinkId]);

  const lastTopologyRef = useRef(topologySignature);

  // Compute initial solver results
  const [localResults, setLocalResults] = useState(() => {
    if (simulationResults) return simulationResults;
    try {
      if (nodes.length >= 2 && edges.length > 0 && sourceId && sinkId) {
        return executeSimulation();
      }
    } catch {
      return null;
    }
    return null;
  });

  // Re-run solver ONLY when topology/capacities actually change (from Workbench or Presets)
  useEffect(() => {
    if (lastTopologyRef.current !== topologySignature) {
      lastTopologyRef.current = topologySignature;
      try {
        if (nodes.length >= 2 && edges.length > 0 && sourceId && sinkId) {
          const res = executeSimulation();
          setLocalResults(res);
          setCurrentStepIndex(0);
        }
      } catch (err) {
        console.warn('Simulation solve error:', err);
      }
    }
  }, [topologySignature, nodes, edges, sourceId, sinkId]);

  // If navigated with autoPlay state (e.g. from "Start Simulation" button), auto-start playback
  useEffect(() => {
    if (location.state?.autoPlay) {
      setCurrentStepIndex(0);
      setIsPlaying(true);
    }
  }, [location.state]);

  // Filtered steps (if paths only toggle is on)
  const filteredIndices = React.useMemo(() => {
    if (!localResults || !localResults.steps) return [];
    if (!pathsOnlyFilter) return localResults.steps.map((_, i) => i);

    const indices = [];
    localResults.steps.forEach((s, idx) => {
      if (s.type === 'INIT' || s.type === 'PATH_FOUND' || s.type === 'FLOW_AUGMENTED' || s.type === 'TERMINATION') {
        indices.push(idx);
      }
    });
    return indices;
  }, [localResults, pathsOnlyFilter]);

  const currentStep = localResults?.steps ? localResults.steps[currentStepIndex] : null;
  const isFinished = localResults?.steps && currentStepIndex >= localResults.steps.length - 1;

  // Animation Playback Interval
  useEffect(() => {
    if (isPlaying) {
      const delay = Math.round(1500 / speedMultiplier);
      playTimerRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (!localResults?.steps) return prev;
          if (pathsOnlyFilter) {
            const currentPos = filteredIndices.findIndex(idx => idx >= prev);
            if (currentPos >= 0 && currentPos < filteredIndices.length - 1) {
              return filteredIndices[currentPos + 1];
            } else {
              setIsPlaying(false);
              showToast('Max Flow computation finished!', 'success');
              return prev;
            }
          } else {
            if (prev < localResults.steps.length - 1) {
              return prev + 1;
            } else {
              setIsPlaying(false);
              showToast('Max Flow computation finished!', 'success');
              return prev;
            }
          }
        });
      }, delay);
    } else {
      if (playTimerRef.current) {
        clearInterval(playTimerRef.current);
        playTimerRef.current = null;
      }
    }

    return () => {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    };
  }, [isPlaying, speedMultiplier, localResults, pathsOnlyFilter, filteredIndices]);

  // Button Handlers
  const handleRunFull = () => {
    setIsPlaying(false);
    if (!localResults?.steps) return;
    const finalIdx = localResults.steps.length - 1;
    setCurrentStepIndex(finalIdx);
    showToast(`Simulation Complete! Maximum Flow is ${localResults.maxFlow} L/s`, 'success');
  };

  const handlePlay = () => {
    if (!localResults?.steps) return;
    if (currentStepIndex >= localResults.steps.length - 1) {
      setCurrentStepIndex(0);
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleNextStep = () => {
    setIsPlaying(false);
    if (!localResults?.steps) return;

    if (pathsOnlyFilter) {
      const currentPos = filteredIndices.findIndex(idx => idx >= currentStepIndex);
      if (currentPos >= 0 && currentPos < filteredIndices.length - 1) {
        setCurrentStepIndex(filteredIndices[currentPos + 1]);
      } else {
        showToast('Reached final step of algorithm.', 'info');
      }
    } else {
      if (currentStepIndex < localResults.steps.length - 1) {
        setCurrentStepIndex(currentStepIndex + 1);
      } else {
        showToast('Reached final step of algorithm.', 'info');
      }
    }
  };

  const handlePrevStep = () => {
    setIsPlaying(false);
    if (!localResults?.steps) return;

    if (pathsOnlyFilter) {
      const currentPos = filteredIndices.findIndex(idx => idx >= currentStepIndex);
      if (currentPos > 0) {
        setCurrentStepIndex(filteredIndices[currentPos - 1]);
      }
    } else {
      if (currentStepIndex > 0) {
        setCurrentStepIndex(currentStepIndex - 1);
      }
    }
  };

  const handleResetSimulation = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
    showToast('Simulation reset to Step 0 (Initial flow 0 L/s).', 'info');
  };

  const handleReloadSample = () => {
    setIsPlaying(false);
    loadDefaultSample();
    setCurrentStepIndex(0);
    showToast('Default calibrated sample network restored (Max Flow = 15 L/s).', 'success');
  };

  const handleLoadBottleneckSample = () => {
    setIsPlaying(false);
    loadBottleneckSample();
    setCurrentStepIndex(0);
    showToast('Bottleneck sample network loaded (B→D = 5 L/s, Max Flow = 12 L/s).', 'info');
  };

  // Find affected edges for current step
  const affectedEdges = React.useMemo(() => {
    if (!currentStep || !currentStep.edges) return [];
    if (currentStep.activePathEdges && currentStep.activePathEdges.length > 0) {
      const edgePairs = new Set(currentStep.activePathEdges.map(e => `${e.from}->${e.to}`));
      return currentStep.edges.filter(e => edgePairs.has(`${e.from}->${e.to}`));
    }
    return currentStep.edges.filter(e => e.flow > 0);
  }, [currentStep]);

  return (
    <div className="page-wrapper workbench-section">
      <div className="section-header-centered">
        <span className="section-tag">Algorithm Execution</span>
        <h2 className="section-title">Edmonds–Karp Simulation Workbench</h2>
        <p className="section-subtitle">
          Observe Breadth-First Search finding shortest augmenting paths, residual capacities dynamically updating, and reverse edges rerouting water throughput.
        </p>
      </div>

      {/* Student Instruction Panel */}
      <div className="student-instruction-panel" id="student-instruction-panel">
        <div className="instruction-header">
          <div className="instruction-badge">🎓 Student Quick-Start Guide</div>
          <div className="instruction-title">How to Demonstrate this Project:</div>
        </div>
        <ol className="instruction-steps">
          <li className="instruction-step-item">
            <b>1. Load the sample network:</b> Click <span className="kbd-badge">↻ Reload Sample</span> to initialize the standard 6-node network (Nodes S, A, B, C, D, T with 0 initial flow).
          </li>
          <li className="instruction-step-item">
            <b>2. Click Run Full:</b> Click <span className="kbd-badge">⚡ Run Full</span> to immediately calculate the final mathematically verified Maximum Flow of <b>{localResults?.maxFlow || 15} L/s</b>.
          </li>
          <li className="instruction-step-item">
            <b>3. Use Next Step & Prev Step:</b> Click <span className="kbd-badge">⏭ Next Step</span> and <span className="kbd-badge">⏮ Prev</span> to step through each BFS queue traversal and flow augmentation.
          </li>
          <li className="instruction-step-item">
            <b>4. Observe BFS Path & Updates:</b> Watch the highlighted pipes, bottleneck capacity calculations, and dynamic residual/reverse edge updates.
          </li>
          <li className="instruction-step-item">
            <b>5. Open Results Dashboard:</b> Click <span className="kbd-badge">View Results Dashboard →</span> to verify the Max-Flow Min-Cut Theorem and view the complete pipe utilization report.
          </li>
        </ol>
      </div>

      {/* Control Buttons Toolbar */}
      <div className="workbench-toolbar">
        {/* Playback Group */}
        <div className="toolbar-group">
          <span className="toolbar-label">Playback:</span>
          <button className="btn-ctrl btn-primary-action" onClick={handleRunFull} id="btn-run-full" title="Run full algorithm and show final result">
            ⚡ Run Full
          </button>

          {isPlaying ? (
            <button className="btn-ctrl btn-pause-state" onClick={handlePause} id="btn-pause" title="Pause simulation">
              ⏸ Pause
            </button>
          ) : (
            <button className="btn-ctrl" onClick={handlePlay} id="btn-play" title="Animate algorithm steps">
              ▶ Play
            </button>
          )}

          <button className="btn-ctrl" onClick={handlePrevStep} id="btn-prev-step" disabled={currentStepIndex === 0} title="Previous step">
            ⏮ Previous Step
          </button>
          <button className="btn-ctrl" onClick={handleNextStep} id="btn-next-step" disabled={isFinished} title="Next step">
            ⏭ Next Step
          </button>
          <button className="btn-ctrl" onClick={handleResetSimulation} id="btn-reset-sim" title="Restore initial zero-flow state">
            ↺ Reset
          </button>
          <button className="btn-ctrl" onClick={handleReloadSample} id="btn-reload-sample" title="Restore sample network (Max Flow = 15 L/s)">
            ↻ Reload Sample (15 L/s)
          </button>
        </div>

        {/* View Mode & Filter Controls */}
        <div className="toolbar-group">
          <span className="toolbar-label">View:</span>
          <button
            className={`btn-ctrl ${viewMode === 'physical' ? 'btn-primary-action' : ''}`}
            onClick={() => setViewMode('physical')}
            id="btn-physical"
            title="Show original physical water network"
          >
            Physical Pipes
          </button>

          <button
            className={`btn-ctrl ${viewMode === 'residual' ? 'btn-primary-action' : ''}`}
            onClick={() => setViewMode('residual')}
            id="btn-residual"
            title="Show remaining capacities and reverse edges"
          >
            Residual Graph
          </button>

          <button
            className={`btn-ctrl ${pathsOnlyFilter ? 'btn-primary-action' : ''}`}
            onClick={() => setPathsOnlyFilter(!pathsOnlyFilter)}
            id="btn-paths-only"
            title="Highlight augmenting paths only"
          >
            {pathsOnlyFilter ? '✓ Paths Only' : 'Paths Only'}
          </button>

          <div className="speed-control-container">
            <span className="text-sm font-bold text-muted">Speed:</span>
            <input
              type="range"
              className="speed-slider"
              min="0.5"
              max="3"
              step="0.5"
              value={speedMultiplier}
              onChange={(e) => setSpeedMultiplier(parseFloat(e.target.value))}
            />
            <span className="speed-label">{speedMultiplier.toFixed(1)}x</span>
          </div>
        </div>

        {/* Presets & Navigation */}
        <div className="toolbar-group">
          <button
            className="btn-ctrl"
            onClick={handleLoadBottleneckSample}
            id="btn-sample-12"
            title="Load network with B→D = 5 L/s (Yields 12 L/s bottleneck)"
            style={{ fontSize: '0.82rem' }}
          >
            Test 12 L/s Bottleneck
          </button>
          <button
            className="btn-secondary"
            onClick={() => navigate('/results')}
            id="btn-go-results"
            style={{ padding: '0.55rem 1.15rem', fontSize: '0.88rem' }}
          >
            <span>View Results Dashboard →</span>
          </button>
        </div>
      </div>

      {/* Main Simulation View Grid */}
      <div className="workbench-grid">
        {/* Graph Card */}
        <div className="canvas-card">
          <div className="canvas-header">
            <div className="canvas-title">
              <span>💧</span>
              <span>Water Distribution Graph ({viewMode === 'physical' ? 'Physical Water Pipes' : 'Residual Network with Reverse Edges'})</span>
            </div>

            <div className="canvas-toolbar-actions">
              <span className="badge badge-blue" style={{ fontSize: '0.8rem' }}>
                Flow: {currentStep?.totalFlow ?? 0} L/s
              </span>
              <button
                className={`btn-icon-sm ${physicsOn ? 'active' : ''}`}
                onClick={() => setPhysicsOn(!physicsOn)}
                title={physicsOn ? 'Disable Physics' : 'Enable Physics'}
              >
                {physicsOn ? '🔓' : '🔒'}
              </button>
            </div>
          </div>

          <NetworkGraph
            nodes={nodes}
            edges={edges}
            sourceId={sourceId}
            sinkId={sinkId}
            stepState={currentStep}
            viewMode={viewMode}
            physicsEnabled={physicsOn}
            height="540px"
          />

          <div className="canvas-legend">
            <div className="legend-item">
              <span className="legend-color-dot dot-source"></span>
              <span>Reservoir (S)</span>
            </div>
            <div className="legend-item">
              <span className="legend-color-dot dot-sink"></span>
              <span>City (T)</span>
            </div>
            <div className="legend-item">
              <span className="legend-color-dot dot-path"></span>
              <span>BFS Augmenting Path</span>
            </div>
            <div className="legend-item">
              <span className="legend-color-dot dot-flow"></span>
              <span>Active Water Flow</span>
            </div>
            <div className="legend-item">
              <span className="legend-color-dot dot-saturated"></span>
              <span>Saturated Bottleneck</span>
            </div>
            {viewMode === 'residual' && (
              <div className="legend-item">
                <span className="legend-color-dot dot-residual-rev"></span>
                <span>Reverse Residual Edge</span>
              </div>
            )}
          </div>
        </div>

        {/* Step Inspector Card */}
        <div className="inspector-card">
          <div className="inspector-header">
            <div className="inspector-title">Simulation Step Inspector</div>
            {currentStep?.type === 'TERMINATION' ? (
              <span className="badge badge-purple">Max Flow Achieved</span>
            ) : currentStep?.type === 'PATH_FOUND' ? (
              <span className="badge badge-cyan">Augmenting Path Found</span>
            ) : currentStep?.type === 'FLOW_AUGMENTED' ? (
              <span className="badge badge-green">Flow Augmented (+{currentStep.bottleneck} L/s)</span>
            ) : currentStep?.type === 'INIT' ? (
              <span className="badge badge-blue">Initialization</span>
            ) : (
              <span className="badge badge-blue">BFS Traversal</span>
            )}
          </div>

          {/* Progress Tracker */}
          <div className="step-progress-wrapper">
            <div className="step-progress-meta">
              <span id="step-counter-label">
                Step {localResults?.steps ? currentStepIndex + 1 : 0} of {localResults?.steps ? localResults.steps.length : 0}
              </span>
              <span>Edmonds–Karp BFS</span>
            </div>
            <div className="step-progress-track">
              <div
                className="step-progress-bar"
                style={{
                  width: `${localResults?.steps ? Math.round(((currentStepIndex + 1) / localResults.steps.length) * 100) : 0}%`
                }}
              ></div>
            </div>
          </div>

          {/* Step Details Content */}
          <div className="inspector-content" style={{ maxHeight: '520px', overflowY: 'auto' }}>
            <div className="step-summary-banner">
              <div className="step-heading">{currentStep?.title || 'Simulation Ready'}</div>
              <p className="step-desc-text" style={{ marginTop: '0.4rem' }}>
                {currentStep?.description || 'Click "Play" or "Next Step" to begin Edmonds-Karp Breadth-First Search calculation.'}
              </p>
            </div>

            {/* Why Algorithm Continues / Terminates */}
            <div className="inspector-field-group">
              <div className="field-group-title">
                <span>💡</span> Why Algorithm Continues / Terminates
              </div>
              <div className="why-box">
                {currentStep?.whyContinues || 'BFS searches for the shortest path from Reservoir S to City T with residual capacity > 0.'}
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="inspector-data-grid">
              <div className="data-metric-box">
                <div className="data-metric-title">Bottleneck Capacity</div>
                <div className="data-metric-value text-bottleneck">
                  {currentStep?.bottleneck ? `${currentStep.bottleneck} L/s` : '—'}
                </div>
              </div>
              <div className="data-metric-box">
                <div className="data-metric-title">Additional Flow</div>
                <div className="data-metric-value text-green">
                  {currentStep?.addedFlow ? `+${currentStep.addedFlow} L/s` : '0 L/s'}
                </div>
              </div>
              <div className="data-metric-box">
                <div className="data-metric-title">Cumulative Flow</div>
                <div className="data-metric-value text-flow">
                  {currentStep?.totalFlow ?? 0} L/s
                </div>
              </div>
            </div>

            {/* Active Path Display */}
            <div className="inspector-field-group">
              <div className="field-group-title">
                <span>📍</span> Selected Augmenting Path
              </div>
              <div className="path-pills-display">
                {currentStep?.activePath && currentStep.activePath.length > 0 ? (
                  currentStep.activePath.map((node, i) => (
                    <React.Fragment key={i}>
                      <span className="path-node-pill">{node}</span>
                      {i < currentStep.activePath.length - 1 && <span className="path-arrow">→</span>}
                    </React.Fragment>
                  ))
                ) : (
                  <span className="text-muted">No active augmenting path</span>
                )}
              </div>
            </div>

            {/* Selected Path Pipe Capacities */}
            {currentStep?.activePathEdges && currentStep.activePathEdges.length > 0 && (
              <div className="inspector-field-group">
                <div className="field-group-title">
                  <span>📏</span> Capacities Along Selected Path
                </div>
                <table className="path-edges-table">
                  <thead>
                    <tr>
                      <th>Pipe</th>
                      <th>Available Residual</th>
                      <th>Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentStep.activePathEdges.map((pe, idx) => (
                      <tr key={idx}>
                        <td className="font-bold">{pe.from} → {pe.to}</td>
                        <td className={pe.residual === currentStep.bottleneck ? 'font-bold text-bottleneck' : ''}>
                          {pe.residual} L/s {pe.residual === currentStep.bottleneck ? '(Bottleneck ★)' : ''}
                        </td>
                        <td>{pe.isReverse ? 'Reverse Residual Edge' : 'Original Pipe'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Active BFS Queue */}
            <div className="inspector-field-group">
              <div className="field-group-title">
                <span>🔄</span> Current BFS Queue
              </div>
              <div className="path-pills-display pills-list">
                {currentStep?.queue && currentStep.queue.length > 0 ? (
                  currentStep.queue.map((q, i) => (
                    <span key={i} className="queue-item">{q}</span>
                  ))
                ) : (
                  <span className="text-muted">Empty (Queue exhausted)</span>
                )}
              </div>
            </div>

            {/* Visited Nodes */}
            <div className="inspector-field-group">
              <div className="field-group-title">
                <span>👁️</span> Nodes Visited by BFS
              </div>
              <div className="path-pills-display pills-list">
                {currentStep?.visitedNodes && currentStep.visitedNodes.length > 0 ? (
                  currentStep.visitedNodes.map((v, i) => (
                    <span key={i} className="visited-item">{v}</span>
                  ))
                ) : (
                  <span className="text-muted">None</span>
                )}
              </div>
            </div>

            {/* Affected Edges / Active Flow Status */}
            {affectedEdges.length > 0 && (
              <div className="inspector-field-group">
                <div className="field-group-title">
                  <span>🌊</span> Live Pipe Flows & Residual Capacities
                </div>
                <table className="path-edges-table">
                  <thead>
                    <tr>
                      <th>Pipe</th>
                      <th>Flow / Capacity</th>
                      <th>Forward Residual</th>
                    </tr>
                  </thead>
                  <tbody>
                    {affectedEdges.slice(0, 6).map(e => (
                      <tr key={e.id}>
                        <td className="font-bold">{e.from} → {e.to}</td>
                        <td className={e.isSaturated ? 'font-bold text-bottleneck' : 'font-bold text-blue'}>
                          {e.flow} / {e.capacity} L/s {e.isSaturated ? '[FULL]' : ''}
                        </td>
                        <td>{e.residualForward} L/s</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Completion Banner if finished */}
            {isFinished && (
              <div style={{ marginTop: '0.75rem', textAlign: 'center' }}>
                <Link to="/results" className="btn-primary" style={{ display: 'block', textAlign: 'center' }}>
                  📊 View Full Results Dashboard (Max Flow: {localResults?.maxFlow} L/s)
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
