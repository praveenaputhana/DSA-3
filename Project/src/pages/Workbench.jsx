import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGraph } from '../context/GraphContext';
import NetworkGraph from '../components/NetworkGraph';

export default function Workbench({ showToast }) {
  const navigate = useNavigate();
  const {
    nodes,
    edges,
    sourceId,
    sinkId,
    loadDefaultSample,
    loadCancellationDemo,
    loadMetropolitanGrid,
    addNode,
    removeNode,
    addEdge,
    updateEdgeCapacity,
    removeEdge,
    setTerminals,
    resetGraph
  } = useGraph();

  // Modals & form state
  const [showAddNodeModal, setShowAddNodeModal] = useState(false);
  const [showAddPipeModal, setShowAddPipeModal] = useState(false);
  const [showEditPipeModal, setShowEditPipeModal] = useState(false);

  const [newNodeId, setNewNodeId] = useState('');
  const [newNodeLabel, setNewNodeLabel] = useState('');
  const [newNodeRole, setNewNodeRole] = useState('junction');

  const [pipeFrom, setPipeFrom] = useState('');
  const [pipeTo, setPipeTo] = useState('');
  const [pipeCapacity, setPipeCapacity] = useState('10');

  const [editingEdgeId, setEditingEdgeId] = useState('');
  const [editingEdgeTitle, setEditingEdgeTitle] = useState('');
  const [editingEdgeCap, setEditingEdgeCap] = useState('');

  const [selectedSource, setSelectedSource] = useState(sourceId || 'S');
  const [selectedSink, setSelectedSink] = useState(sinkId || 'T');

  const [physicsOn, setPhysicsOn] = useState(false);

  // Handle preset change
  const handlePresetChange = (e) => {
    const val = e.target.value;
    if (val === 'default') {
      loadDefaultSample();
      showToast('Loaded Default Sample Network (8 pipes, Max Flow 12 L/s)', 'success');
    } else if (val === 'cancellation') {
      loadCancellationDemo();
      showToast('Loaded Flow Cancellation / Reverse Edge Demo', 'info');
    } else if (val === 'complex') {
      loadMetropolitanGrid();
      showToast('Loaded Metropolitan Water Grid', 'info');
    }
  };

  // Add Node Submit
  const handleAddNodeSubmit = (e) => {
    e.preventDefault();
    try {
      addNode(newNodeId, newNodeLabel || newNodeId, newNodeRole);
      setShowAddNodeModal(false);
      setNewNodeId('');
      setNewNodeLabel('');
      showToast(`Node "${newNodeId.toUpperCase()}" added.`, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Add Pipe Submit
  const handleAddPipeSubmit = (e) => {
    e.preventDefault();
    try {
      addEdge(pipeFrom, pipeTo, pipeCapacity);
      setShowAddPipeModal(false);
      setPipeCapacity('10');
      showToast(`Pipe "${pipeFrom} → ${pipeTo}" (${pipeCapacity} L/s) added.`, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Edit Pipe Submit
  const handleEditPipeSubmit = (e) => {
    e.preventDefault();
    try {
      updateEdgeCapacity(editingEdgeId, editingEdgeCap);
      setShowEditPipeModal(false);
      showToast(`Pipe capacity updated to ${editingEdgeCap} L/s.`, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Delete Pipe
  const handleDeletePipe = () => {
    try {
      removeEdge(editingEdgeId);
      setShowEditPipeModal(false);
      showToast(`Pipe "${editingEdgeId}" deleted.`, 'info');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Terminal Set Submit
  const handleSetTerminals = () => {
    try {
      setTerminals(selectedSource, selectedSink);
      showToast(`Terminals updated: Source = ${selectedSource}, City = ${selectedSink}`, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Canvas element click selection
  const handleGraphSelect = (info) => {
    if (info.type === 'edge') {
      const edge = edges.find(e => e.id === info.id);
      if (edge) {
        setEditingEdgeId(edge.id);
        setEditingEdgeTitle(`Pipe ${edge.from} → ${edge.to}`);
        setEditingEdgeCap(edge.capacity.toString());
        setShowEditPipeModal(true);
      }
    } else if (info.type === 'node') {
      showToast(`Selected Node "${info.id}"`, 'info');
    }
  };

  return (
    <div className="page-wrapper workbench-section">
      <div className="section-header-centered">
        <span className="section-tag">Network Architecture</span>
        <h2 className="section-title">Network Workbench</h2>
        <p className="section-subtitle">
          Construct and configure the municipal water distribution topology. Add water tanks, set pipe capacities, modify conduits, and define reservoir terminals.
        </p>
      </div>

      {/* Main Workbench Toolbar */}
      <div className="workbench-toolbar">
        <div className="toolbar-group">
          <span className="toolbar-label">Topology Actions:</span>
          <button
            className="btn-ctrl btn-primary-action"
            onClick={() => {
              if (nodes.length > 0) setPipeFrom(nodes[0].id);
              if (nodes.length > 1) setPipeTo(nodes[1].id);
              setShowAddPipeModal(true);
            }}
          >
            + Add Pipe
          </button>
          <button
            className="btn-ctrl"
            onClick={() => setShowAddNodeModal(true)}
          >
            + Add Node
          </button>
          <button
            className="btn-ctrl"
            onClick={() => {
              if (window.confirm('Reset the entire network to empty?')) {
                resetGraph();
                showToast('Network reset to empty.', 'info');
              }
            }}
          >
            🗑️ Clear Graph
          </button>
          <button
            className="btn-ctrl"
            onClick={() => {
              loadDefaultSample();
              showToast('Reloaded default sample network.', 'success');
            }}
          >
            ↻ Reload Default
          </button>
        </div>

        <div className="toolbar-group">
          <span className="toolbar-label">Preset Networks:</span>
          <select className="form-select" onChange={handlePresetChange} defaultValue="default">
            <option value="default">Default Sample (8 Pipes, Max Flow 12 L/s)</option>
            <option value="cancellation">Flow Cancellation / Reverse Edge Demo</option>
            <option value="complex">Metropolitan Water Grid</option>
          </select>
        </div>

        <div className="toolbar-group">
          <button
            className="btn-primary"
            onClick={() => navigate('/simulation', { state: { autoPlay: true } })}
            id="btn-workbench-start-sim"
            style={{ padding: '0.6rem 1.4rem', fontSize: '0.9rem' }}
          >
            <span>🌊 Start Simulation →</span>
          </button>
        </div>
      </div>

      {/* Grid: Graph Canvas on Left, Configuration & Table on Right */}
      <div className="workbench-grid">
        {/* Canvas Card */}
        <div className="canvas-card">
          <div className="canvas-header">
            <div className="canvas-title">
              <span>💧</span>
              <span>Water Network Canvas</span>
            </div>
            <div className="canvas-toolbar-actions">
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
            viewMode="physical"
            physicsEnabled={physicsOn}
            onSelect={handleGraphSelect}
            height="520px"
          />

          <div className="canvas-legend">
            <div className="legend-item">
              <span className="legend-color-dot dot-source"></span>
              <span>Reservoir (S)</span>
            </div>
            <div className="legend-item">
              <span className="legend-color-dot dot-sink"></span>
              <span>Destination City (T)</span>
            </div>
            <div className="legend-item">
              <span className="legend-color-dot" style={{ background: '#38bdf8' }}></span>
              <span>Storage Tank</span>
            </div>
            <div className="legend-item">
              <span className="legend-color-dot" style={{ background: '#e0f2fe', border: '1px solid #0284c7' }}></span>
              <span>Junction Valve</span>
            </div>
          </div>
        </div>

        {/* Configuration & Pipes Table Card */}
        <div className="inspector-card">
          <div className="inspector-header">
            <div className="inspector-title">Network Configuration</div>
            <span className="badge badge-blue">{edges.length} Pipes | {nodes.length} Nodes</span>
          </div>

          <div className="inspector-content" style={{ maxHeight: '520px' }}>
            {/* Terminals Form */}
            <div className="step-summary-banner" style={{ background: '#f8fbfe' }}>
              <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a', marginBottom: '0.6rem' }}>
                Designated Source & Destination
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '0.5rem', alignItems: 'center' }}>
                <div>
                  <label className="text-sm font-bold text-muted">Source (S):</label>
                  <select
                    className="form-select"
                    style={{ width: '100%', marginTop: '0.2rem' }}
                    value={selectedSource}
                    onChange={(e) => setSelectedSource(e.target.value)}
                  >
                    {nodes.map(n => (
                      <option key={n.id} value={n.id}>{n.id} ({n.label || n.id})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-bold text-muted">City Sink (T):</label>
                  <select
                    className="form-select"
                    style={{ width: '100%', marginTop: '0.2rem' }}
                    value={selectedSink}
                    onChange={(e) => setSelectedSink(e.target.value)}
                  >
                    {nodes.map(n => (
                      <option key={n.id} value={n.id}>{n.id} ({n.label || n.id})</option>
                    ))}
                  </select>
                </div>

                <div style={{ alignSelf: 'flex-end' }}>
                  <button
                    className="btn-terminal-apply"
                    onClick={handleSetTerminals}
                    style={{ padding: '0.55rem 0.85rem' }}
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>

            {/* Pipes Table */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span className="field-group-title">Pipe Conduits & Capacities</span>
                <span className="text-sm text-muted">Click a row to edit</span>
              </div>

              <div className="table-responsive" style={{ maxHeight: '240px', overflowY: 'auto' }}>
                <table className="styled-table">
                  <thead>
                    <tr>
                      <th>Conduit</th>
                      <th className="text-center">Capacity</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {edges.map(e => (
                      <tr
                        key={e.id}
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          setEditingEdgeId(e.id);
                          setEditingEdgeTitle(`Pipe ${e.from} → ${e.to}`);
                          setEditingEdgeCap(e.capacity.toString());
                          setShowEditPipeModal(true);
                        }}
                      >
                        <td className="font-bold">{e.from} → {e.to}</td>
                        <td className="text-center font-bold text-blue">{e.capacity} L/s</td>
                        <td className="text-center">
                          <button
                            type="button"
                            className="btn-ctrl"
                            style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                            onClick={(ev) => {
                              ev.stopPropagation();
                              removeEdge(e.id);
                              showToast(`Pipe ${e.from} → ${e.to} removed.`, 'info');
                            }}
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Node Modal */}
      {showAddNodeModal && (
        <div className="modal active">
          <div className="modal-backdrop" onClick={() => setShowAddNodeModal(false)}></div>
          <div className="modal-dialog">
            <div className="modal-header">
              <h3 className="modal-title">+ Add Network Node</h3>
              <button className="modal-close" onClick={() => setShowAddNodeModal(false)}>✕</button>
            </div>
            <form onSubmit={handleAddNodeSubmit} className="modal-body">
              <div className="form-group">
                <label className="form-label" htmlFor="new-node-id">Node ID (e.g., E, F, G)</label>
                <input
                  type="text"
                  id="new-node-id"
                  className="form-input"
                  maxLength={5}
                  value={newNodeId}
                  onChange={(e) => setNewNodeId(e.target.value)}
                  placeholder="E"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="new-node-label">Label (Optional)</label>
                <input
                  type="text"
                  id="new-node-label"
                  className="form-input"
                  value={newNodeLabel}
                  onChange={(e) => setNewNodeLabel(e.target.value)}
                  placeholder="Booster Station E"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="new-node-role">Hydraulic Role</label>
                <select
                  id="new-node-role"
                  className="form-input"
                  value={newNodeRole}
                  onChange={(e) => setNewNodeRole(e.target.value)}
                >
                  <option value="tank">Water Storage Tank</option>
                  <option value="junction">Distribution Junction / Valve</option>
                  <option value="reservoir">Water Reservoir</option>
                  <option value="city">Destination City</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowAddNodeModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Add Node</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Pipe Modal */}
      {showAddPipeModal && (
        <div className="modal active">
          <div className="modal-backdrop" onClick={() => setShowAddPipeModal(false)}></div>
          <div className="modal-dialog">
            <div className="modal-header">
              <h3 className="modal-title">+ Add Water Pipe (Directed Edge)</h3>
              <button className="modal-close" onClick={() => setShowAddPipeModal(false)}>✕</button>
            </div>
            <form onSubmit={handleAddPipeSubmit} className="modal-body">
              <div className="form-group">
                <label className="form-label">Origin Node</label>
                <select className="form-input" value={pipeFrom} onChange={(e) => setPipeFrom(e.target.value)} required>
                  {nodes.map(n => <option key={n.id} value={n.id}>{n.id}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Destination Node</label>
                <select className="form-input" value={pipeTo} onChange={(e) => setPipeTo(e.target.value)} required>
                  {nodes.map(n => <option key={n.id} value={n.id}>{n.id}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Pipe Capacity (L/s)</label>
                <input
                  type="number"
                  className="form-input"
                  min="1"
                  step="1"
                  value={pipeCapacity}
                  onChange={(e) => setPipeCapacity(e.target.value)}
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowAddPipeModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Connect Pipe</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Pipe Capacity Modal */}
      {showEditPipeModal && (
        <div className="modal active">
          <div className="modal-backdrop" onClick={() => setShowEditPipeModal(false)}></div>
          <div className="modal-dialog">
            <div className="modal-header">
              <h3 className="modal-title">{editingEdgeTitle}</h3>
              <button className="modal-close" onClick={() => setShowEditPipeModal(false)}>✕</button>
            </div>
            <form onSubmit={handleEditPipeSubmit} className="modal-body">
              <div className="form-group">
                <label className="form-label">Capacity (L/s)</label>
                <input
                  type="number"
                  className="form-input"
                  min="1"
                  step="1"
                  value={editingEdgeCap}
                  onChange={(e) => setEditingEdgeCap(e.target.value)}
                  required
                />
              </div>

              <div className="modal-actions" style={{ justifyContent: 'space-between' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleDeletePipe}
                  style={{ color: '#ef4444', borderColor: '#fca5a5' }}
                >
                  🗑️ Delete Pipe
                </button>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button type="button" className="btn-secondary" onClick={() => setShowEditPipeModal(false)}>Cancel</button>
                  <button type="submit" className="btn-primary">Update</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
