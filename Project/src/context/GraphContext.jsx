import React, { createContext, useContext, useState, useEffect } from 'react';
import { solveEdmondsKarp } from '../algorithms/edmondsKarp';

const GraphContext = createContext(null);

// Default Project Sample Network
const DEFAULT_NODES = [
  { id: 'S', label: 'S (Main Reservoir)', role: 'reservoir', x: -300, y: 0 },
  { id: 'A', label: 'A (Pump Station A)', role: 'tank', x: -120, y: -140 },
  { id: 'B', label: 'B (Pump Station B)', role: 'tank', x: -120, y: 140 },
  { id: 'C', label: 'C (Junction C)', role: 'junction', x: 120, y: -140 },
  { id: 'D', label: 'D (Booster Station D)', role: 'junction', x: 120, y: 140 },
  { id: 'T', label: 'T (Destination City)', role: 'city', x: 300, y: 0 }
];

const DEFAULT_EDGES = [
  { id: 'S_to_A', from: 'S', to: 'A', capacity: 10, flow: 0 },
  { id: 'S_to_B', from: 'S', to: 'B', capacity: 8, flow: 0 },
  { id: 'A_to_B', from: 'A', to: 'B', capacity: 2, flow: 0 },
  { id: 'A_to_C', from: 'A', to: 'C', capacity: 5, flow: 0 },
  { id: 'B_to_C', from: 'B', to: 'C', capacity: 10, flow: 0 },
  { id: 'B_to_D', from: 'B', to: 'D', capacity: 8, flow: 0 }, // Set to 8 L/s so destination conduits (C->T:7, D->T:8) achieve the mathematically verified 15 L/s
  { id: 'C_to_T', from: 'C', to: 'T', capacity: 7, flow: 0 },
  { id: 'D_to_T', from: 'D', to: 'T', capacity: 8, flow: 0 }
];

export function GraphProvider({ children }) {
  // Initialize state from localStorage or defaults
  const [nodes, setNodes] = useState(() => {
    try {
      const saved = localStorage.getItem('ek_nodes');
      return saved ? JSON.parse(saved) : DEFAULT_NODES;
    } catch {
      return DEFAULT_NODES;
    }
  });

  const [edges, setEdges] = useState(() => {
    try {
      const saved = localStorage.getItem('ek_edges');
      return saved ? JSON.parse(saved) : DEFAULT_EDGES;
    } catch {
      return DEFAULT_EDGES;
    }
  });

  const [sourceId, setSourceId] = useState(() => {
    try {
      return localStorage.getItem('ek_sourceId') || 'S';
    } catch {
      return 'S';
    }
  });

  const [sinkId, setSinkId] = useState(() => {
    try {
      return localStorage.getItem('ek_sinkId') || 'T';
    } catch {
      return 'T';
    }
  });

  const [simulationResults, setSimulationResults] = useState(() => {
    try {
      const saved = localStorage.getItem('ek_results');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ek_nodes', JSON.stringify(nodes));
      localStorage.setItem('ek_edges', JSON.stringify(edges));
      localStorage.setItem('ek_sourceId', sourceId);
      localStorage.setItem('ek_sinkId', sinkId);
      if (simulationResults) {
        localStorage.setItem('ek_results', JSON.stringify(simulationResults));
      } else {
        localStorage.removeItem('ek_results');
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [nodes, edges, sourceId, sinkId, simulationResults]);

  // Load the default sample network (Calibrated 15 L/s)
  const loadDefaultSample = () => {
    setNodes(DEFAULT_NODES);
    setEdges(DEFAULT_EDGES);
    setSourceId('S');
    setSinkId('T');
    setSimulationResults(null);
  };

  // Load bottlenecked sample network (B->D = 5 L/s -> 12 L/s Max Flow)
  const loadBottleneckSample = () => {
    const bEdges = DEFAULT_EDGES.map(e => e.id === 'B_to_D' ? { ...e, capacity: 5 } : { ...e });
    setNodes(DEFAULT_NODES);
    setEdges(bEdges);
    setSourceId('S');
    setSinkId('T');
    setSimulationResults(null);
  };

  // Load flow cancellation demo
  const loadCancellationDemo = () => {
    const demoNodes = [
      { id: 'S', label: 'S (Main Reservoir)', role: 'reservoir', x: -250, y: 0 },
      { id: 'A', label: 'A (North Tank)', role: 'tank', x: -80, y: -120 },
      { id: 'B', label: 'B (South Tank)', role: 'tank', x: -80, y: 120 },
      { id: 'T', label: 'T (Destination City)', role: 'city', x: 250, y: 0 }
    ];
    const demoEdges = [
      { id: 'S_to_A', from: 'S', to: 'A', capacity: 10, flow: 0 },
      { id: 'S_to_B', from: 'S', to: 'B', capacity: 10, flow: 0 },
      { id: 'A_to_B', from: 'A', to: 'B', capacity: 1, flow: 0 },
      { id: 'A_to_T', from: 'A', to: 'T', capacity: 10, flow: 0 },
      { id: 'B_to_T', from: 'B', to: 'T', capacity: 10, flow: 0 }
    ];
    setNodes(demoNodes);
    setEdges(demoEdges);
    setSourceId('S');
    setSinkId('T');
    setSimulationResults(null);
  };

  // Load Metropolitan Multi-Tier Grid
  const loadMetropolitanGrid = () => {
    const metroNodes = [
      { id: 'S', label: 'S (Central Reservoir)', role: 'reservoir', x: -350, y: 0 },
      { id: 'A', label: 'Tank 1', role: 'tank', x: -180, y: -160 },
      { id: 'B', label: 'Tank 2', role: 'tank', x: -180, y: 0 },
      { id: 'C', label: 'Tank 3', role: 'tank', x: -180, y: 160 },
      { id: 'D', label: 'Junction 1', role: 'junction', x: 80, y: -160 },
      { id: 'E', label: 'Junction 2', role: 'junction', x: 80, y: 0 },
      { id: 'F', label: 'Junction 3', role: 'junction', x: 80, y: 160 },
      { id: 'T', label: 'T (Metropolitan City)', role: 'city', x: 350, y: 0 }
    ];
    const metroEdges = [
      { id: 'S_to_A', from: 'S', to: 'A', capacity: 12, flow: 0 },
      { id: 'S_to_B', from: 'S', to: 'B', capacity: 15, flow: 0 },
      { id: 'S_to_C', from: 'S', to: 'C', capacity: 10, flow: 0 },
      { id: 'A_to_D', from: 'A', to: 'D', capacity: 9, flow: 0 },
      { id: 'A_to_E', from: 'A', to: 'E', capacity: 4, flow: 0 },
      { id: 'B_to_D', from: 'B', to: 'D', capacity: 6, flow: 0 },
      { id: 'B_to_E', from: 'B', to: 'E', capacity: 8, flow: 0 },
      { id: 'B_to_F', from: 'B', to: 'F', capacity: 5, flow: 0 },
      { id: 'C_to_E', from: 'C', to: 'E', capacity: 3, flow: 0 },
      { id: 'C_to_F', from: 'C', to: 'F', capacity: 8, flow: 0 },
      { id: 'D_to_T', from: 'D', to: 'T', capacity: 14, flow: 0 },
      { id: 'E_to_T', from: 'E', to: 'T', capacity: 12, flow: 0 },
      { id: 'F_to_T', from: 'F', to: 'T', capacity: 10, flow: 0 }
    ];
    setNodes(metroNodes);
    setEdges(metroEdges);
    setSourceId('S');
    setSinkId('T');
    setSimulationResults(null);
  };

  // Add a new node
  const addNode = (id, label, role = 'junction') => {
    const cleanId = id.trim().toUpperCase();
    if (!cleanId) throw new Error('Node ID cannot be empty.');
    if (nodes.some(n => n.id === cleanId)) {
      throw new Error(`Node "${cleanId}" already exists.`);
    }
    const newNode = {
      id: cleanId,
      label: label?.trim() || cleanId,
      role: role || 'junction'
    };
    setNodes(prev => [...prev, newNode]);
    setSimulationResults(null);
    return newNode;
  };

  // Remove a node and connected edges
  const removeNode = (id) => {
    const cleanId = id.trim().toUpperCase();
    setNodes(prev => prev.filter(n => n.id !== cleanId));
    setEdges(prev => prev.filter(e => e.from !== cleanId && e.to !== cleanId));
    if (sourceId === cleanId) setSourceId(null);
    if (sinkId === cleanId) setSinkId(null);
    setSimulationResults(null);
  };

  // Add directed edge
  const addEdge = (from, to, capacity) => {
    const fromId = from.trim().toUpperCase();
    const toId = to.trim().toUpperCase();
    const capNum = parseFloat(capacity);

    if (!nodes.some(n => n.id === fromId)) throw new Error(`Source node "${fromId}" does not exist.`);
    if (!nodes.some(n => n.id === toId)) throw new Error(`Destination node "${toId}" does not exist.`);
    if (fromId === toId) throw new Error('Self-loops are not allowed in a water flow network.');
    if (isNaN(capNum) || capNum <= 0) throw new Error('Pipe capacity must be a positive number (> 0).');

    const edgeId = `${fromId}_to_${toId}`;
    if (edges.some(e => e.id === edgeId || (e.from === fromId && e.to === toId))) {
      throw new Error(`Pipe from "${fromId}" to "${toId}" already exists. Edit its capacity instead.`);
    }

    const newEdge = { id: edgeId, from: fromId, to: toId, capacity: capNum, flow: 0 };
    setEdges(prev => [...prev, newEdge]);
    setSimulationResults(null);
    return newEdge;
  };

  // Update pipe capacity
  const updateEdgeCapacity = (edgeId, newCapacity) => {
    const capNum = parseFloat(newCapacity);
    if (isNaN(capNum) || capNum <= 0) throw new Error('Pipe capacity must be a positive number (> 0).');

    setEdges(prev => prev.map(e => {
      if (e.id === edgeId) {
        return { ...e, capacity: capNum, flow: Math.min(e.flow, capNum) };
      }
      return e;
    }));
    setSimulationResults(null);
  };

  // Remove pipe
  const removeEdge = (edgeId) => {
    setEdges(prev => prev.filter(e => e.id !== edgeId));
    setSimulationResults(null);
  };

  // Set terminals (Source and Sink)
  const setTerminals = (newSource, newSink) => {
    const s = newSource?.trim().toUpperCase();
    const t = newSink?.trim().toUpperCase();

    if (!s || !nodes.some(n => n.id === s)) throw new Error(`Invalid source node "${s}".`);
    if (!t || !nodes.some(n => n.id === t)) throw new Error(`Invalid sink node "${t}".`);
    if (s === t) throw new Error('Source Reservoir and Destination City cannot be the same node.');

    setSourceId(s);
    setSinkId(t);
    setNodes(prev => prev.map(n => {
      if (n.id === s) return { ...n, role: 'reservoir' };
      if (n.id === t) return { ...n, role: 'city' };
      if (n.role === 'reservoir' || n.role === 'city') return { ...n, role: 'junction' };
      return n;
    }));
    setSimulationResults(null);
  };

  // Reset entire graph
  const resetGraph = () => {
    setNodes([]);
    setEdges([]);
    setSourceId(null);
    setSinkId(null);
    setSimulationResults(null);
  };

  // Reset flows to 0 while maintaining graph structure
  const resetFlows = () => {
    setEdges(prev => prev.map(e => ({ ...e, flow: 0 })));
    setSimulationResults(null);
  };

  // Execute full algorithm without mutating base topology
  const executeSimulation = (options = { detailedBfs: true }) => {
    const results = solveEdmondsKarp(nodes, edges, sourceId, sinkId, options);
    setSimulationResults(results);
    return results;
  };

  return (
    <GraphContext.Provider
      value={{
        nodes,
        edges,
        sourceId,
        sinkId,
        simulationResults,
        loadDefaultSample,
        loadBottleneckSample,
        loadCancellationDemo,
        loadMetropolitanGrid,
        addNode,
        removeNode,
        addEdge,
        updateEdgeCapacity,
        removeEdge,
        setTerminals,
        resetGraph,
        resetFlows,
        executeSimulation,
        hasRunSimulation: simulationResults !== null
      }}
    >
      {children}
    </GraphContext.Provider>
  );
}

export function useGraph() {
  const context = useContext(GraphContext);
  if (!context) {
    throw new Error('useGraph must be used within a GraphProvider');
  }
  return context;
}
