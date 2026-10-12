import React, { useEffect, useRef } from 'react';
import { Network, DataSet } from 'vis-network/standalone';

export default function NetworkGraph({
  nodes = [],
  edges = [],
  sourceId = 'S',
  sinkId = 'T',
  stepState = null,
  viewMode = 'physical', // 'physical' or 'residual'
  physicsEnabled = false,
  onSelect = null,
  height = '520px'
}) {
  const containerRef = useRef(null);
  const networkRef = useRef(null);
  const nodesDataSetRef = useRef(null);
  const edgesDataSetRef = useRef(null);

  // Initialize network instance once on mount
  useEffect(() => {
    if (!containerRef.current) return;

    nodesDataSetRef.current = new DataSet();
    edgesDataSetRef.current = new DataSet();

    const data = {
      nodes: nodesDataSetRef.current,
      edges: edgesDataSetRef.current
    };

    const options = {
      autoResize: true,
      interaction: {
        hover: true,
        tooltipDelay: 150,
        selectConnectedEdges: false,
        navigationButtons: true,
        keyboard: false
      },
      physics: {
        enabled: physicsEnabled,
        barnesHut: {
          gravitationalConstant: -2500,
          centralGravity: 0.2,
          springLength: 130,
          springConstant: 0.04,
          damping: 0.09
        }
      },
      nodes: {
        font: {
          face: 'Plus Jakarta Sans, sans-serif',
          size: 14,
          color: '#0f172a',
          strokeWidth: 3,
          strokeColor: '#ffffff'
        },
        borderWidth: 2,
        shadow: {
          enabled: true,
          color: 'rgba(14, 116, 144, 0.15)',
          size: 6,
          x: 2,
          y: 4
        }
      },
      edges: {
        arrows: {
          to: { enabled: true, scaleFactor: 1.1 }
        },
        font: {
          face: 'Plus Jakarta Sans, sans-serif',
          size: 12,
          align: 'middle',
          background: 'rgba(255, 255, 255, 0.95)',
          strokeWidth: 2,
          strokeColor: '#e0f2fe'
        },
        smooth: {
          type: 'curvedCW',
          roundness: 0.15
        }
      }
    };

    networkRef.current = new Network(containerRef.current, data, options);

    networkRef.current.on('click', (params) => {
      if (onSelect) {
        if (params.nodes.length > 0) {
          onSelect({ type: 'node', id: params.nodes[0] });
        } else if (params.edges.length > 0) {
          const rawId = params.edges[0].replace('_fwd', '').replace('_rev', '');
          onSelect({ type: 'edge', id: rawId });
        } else {
          onSelect({ type: 'canvas' });
        }
      }
    });

    return () => {
      if (networkRef.current) {
        networkRef.current.destroy();
        networkRef.current = null;
      }
    };
  }, []);

  // Update physics options dynamically
  useEffect(() => {
    if (networkRef.current) {
      networkRef.current.setOptions({ physics: { enabled: physicsEnabled } });
    }
  }, [physicsEnabled]);

  // Update nodes & edges when props change
  useEffect(() => {
    if (!nodesDataSetRef.current || !edgesDataSetRef.current) return;

    const activePathEdges = new Set();
    const activePathNodes = new Set(stepState?.activePath || []);
    const visitedNodes = new Set(stepState?.visitedNodes || []);
    const queueNodes = new Set(stepState?.queue || []);
    const currentNode = stepState?.currentNode;
    const targetNode = stepState?.targetNode;

    if (stepState?.activePathEdges) {
      stepState.activePathEdges.forEach(e => {
        activePathEdges.add(`${e.from}->${e.to}`);
      });
    }

    // Build Node items
    const nodesArray = nodes.map(n => {
      const isSource = n.id === sourceId;
      const isSink = n.id === sinkId;
      const isInActivePath = activePathNodes.has(n.id);
      const isCurrentBfs = (n.id === currentNode);
      const isTargetBfs = (n.id === targetNode);
      const isInQueue = queueNodes.has(n.id);
      const isVisited = visitedNodes.has(n.id);

      let backgroundColor = '#e0f2fe';
      let borderColor = '#0284c7';
      let borderWidth = 2;
      let shape = 'dot';
      let size = 26;

      if (isSource) {
        backgroundColor = '#0369a1';
        borderColor = '#082f49';
        shape = 'box';
        size = 32;
      } else if (isSink) {
        backgroundColor = '#059669';
        borderColor = '#064e3b';
        shape = 'box';
        size = 32;
      } else if (n.role === 'tank') {
        backgroundColor = '#38bdf8';
        borderColor = '#0284c7';
        size = 28;
      }

      // Dynamic highlights for BFS execution
      if (isInActivePath) {
        borderColor = '#1d4ed8';
        backgroundColor = '#3b82f6';
        borderWidth = 4;
      } else if (isCurrentBfs) {
        borderColor = '#b45309';
        backgroundColor = '#f59e0b';
        borderWidth = 4;
      } else if (isTargetBfs) {
        borderColor = '#0e7490';
        backgroundColor = '#06b6d4';
        borderWidth = 3;
      } else if (isInQueue && !isSource && !isSink) {
        borderColor = '#ca8a04';
        backgroundColor = '#fef08a';
        borderWidth = 2.5;
      } else if (isVisited && !isSource && !isSink) {
        borderColor = '#0d9488';
        backgroundColor = '#ccfbf1';
        borderWidth = 2;
      }

      const fontColor = (isSource || isSink || isInActivePath || isCurrentBfs) ? '#ffffff' : '#0f172a';

      return {
        id: n.id,
        label: isSource ? `S: Reservoir` : (isSink ? `T: City Sink` : `${n.label || n.id}`),
        x: n.x,
        y: n.y,
        shape,
        size,
        color: {
          background: backgroundColor,
          border: borderColor,
          highlight: { background: '#38bdf8', border: '#0369a1' }
        },
        font: {
          color: fontColor,
          bold: isSource || isSink || isInActivePath || isCurrentBfs,
          size: isSource || isSink ? 15 : 13
        },
        borderWidth,
        title: `<b>${n.label || n.id}</b><br>Role: ${n.role}<br>ID: ${n.id}${isVisited ? '<br>Status: Visited by BFS' : ''}`
      };
    });

    // Build Edge items with robust multi-key matching
    const edgeDataMap = new Map();
    if (stepState?.edges) {
      stepState.edges.forEach(e => {
        if (e.id) edgeDataMap.set(e.id, e);
        edgeDataMap.set(`${e.from}->${e.to}`, e);
        edgeDataMap.set(`${e.from}_to_${e.to}`, e);
      });
    }

    const edgesArray = [];

    edges.forEach(e => {
      const state = edgeDataMap.get(e.id)
        || edgeDataMap.get(`${e.from}->${e.to}`)
        || edgeDataMap.get(`${e.from}_to_${e.to}`)
        || {
          flow: e.flow || 0,
          capacity: e.capacity,
          residualForward: e.capacity - (e.flow || 0),
          residualReverse: e.flow || 0,
          isSaturated: (e.flow || 0) >= e.capacity && e.capacity > 0
        };

      const isPathEdge = activePathEdges.has(`${e.from}->${e.to}`);
      const isReversePathEdge = activePathEdges.has(`${e.to}->${e.from}`);
      const isExploringEdge = (currentNode === e.from && targetNode === e.to);

      if (viewMode === 'physical') {
        let edgeColor = '#94a3b8';
        let edgeWidth = 2.5;
        let dashes = false;
        let fontColor = '#475569';
        let fontBold = false;
        let labelText = `${state.flow} / ${state.capacity} L/s`;

        if (state.flow > 0) {
          edgeColor = '#0284c7';
          edgeWidth = Math.min(8, 3 + (state.flow / state.capacity) * 5);
          fontColor = '#0369a1';
          fontBold = true;
        }

        if (state.isSaturated) {
          edgeColor = '#f59e0b';
          edgeWidth = 5.5;
          fontColor = '#b45309';
          fontBold = true;
          labelText = `${state.flow} / ${state.capacity} L/s [FULL]`;
        }

        if (isExploringEdge) {
          edgeColor = '#06b6d4';
          edgeWidth = 5.5;
          dashes = [5, 5];
          fontColor = '#0e7490';
          fontBold = true;
        }

        if (isPathEdge) {
          edgeColor = '#2563eb';
          edgeWidth = 7;
          dashes = false;
          fontColor = '#1d4ed8';
          fontBold = true;
        }

        edgesArray.push({
          id: e.id,
          from: e.from,
          to: e.to,
          label: labelText,
          width: edgeWidth,
          dashes,
          color: { color: edgeColor, highlight: '#2563eb', hover: '#0369a1' },
          arrows: { to: { enabled: true, scaleFactor: isPathEdge ? 1.3 : 1.1 } },
          font: {
            color: fontColor,
            bold: fontBold,
            background: 'rgba(255, 255, 255, 0.95)'
          },
          title: `<b>Pipe ${e.from} → ${e.to}</b><br>Flow: ${state.flow} L/s<br>Capacity: ${state.capacity} L/s<br>Available Residual: ${state.residualForward} L/s${state.isSaturated ? '<br><b>100% Saturated Bottleneck</b>' : ''}`
        });
      } else {
        // Residual Graph Mode
        const forwardRes = state.residualForward;
        if (forwardRes > 0 || isPathEdge) {
          edgesArray.push({
            id: `${e.id}_fwd`,
            from: e.from,
            to: e.to,
            label: `Res: ${forwardRes} L/s`,
            width: isPathEdge ? 6 : 2.5,
            color: { color: isPathEdge ? '#2563eb' : '#0284c7', highlight: '#0284c7' },
            font: { color: isPathEdge ? '#1d4ed8' : '#0369a1', bold: true, background: 'rgba(240, 249, 255, 0.95)' },
            arrows: { to: { enabled: true, scaleFactor: isPathEdge ? 1.25 : 1.0 } },
            title: `Forward Residual Edge: ${forwardRes} L/s available`
          });
        }

        const reverseRes = state.residualReverse;
        if (reverseRes > 0 || isReversePathEdge) {
          edgesArray.push({
            id: `${e.id}_rev`,
            from: e.to,
            to: e.from,
            label: `Rev: ${reverseRes} L/s`,
            width: isReversePathEdge ? 5.5 : 2.5,
            color: { color: isReversePathEdge ? '#dc2626' : '#9333ea', highlight: '#9333ea' },
            dashes: [6, 6],
            font: { color: '#9333ea', bold: true, background: 'rgba(250, 245, 255, 0.95)' },
            arrows: { to: { enabled: true, scaleFactor: 1.0 } },
            title: `Reverse Residual Edge: ${reverseRes} L/s (Available for flow cancellation/rerouting)`
          });
        }
      }
    });

    // Efficiently synchronize DataSet items without destroying node positions
    const existingNodeIds = new Set(nodesDataSetRef.current.getIds());
    const newNodeIds = new Set(nodesArray.map(n => n.id));
    existingNodeIds.forEach(id => {
      if (!newNodeIds.has(id)) nodesDataSetRef.current.remove(id);
    });
    nodesDataSetRef.current.update(nodesArray);

    const existingEdgeIds = new Set(edgesDataSetRef.current.getIds());
    const newEdgeIds = new Set(edgesArray.map(e => e.id));
    existingEdgeIds.forEach(id => {
      if (!newEdgeIds.has(id)) edgesDataSetRef.current.remove(id);
    });
    edgesDataSetRef.current.update(edgesArray);

    // Force an immediate canvas redraw so updates are visibly instantaneous
    if (networkRef.current) {
      networkRef.current.redraw();
    }
  }, [nodes, edges, sourceId, sinkId, stepState, viewMode]);

  const handleFit = () => {
    if (networkRef.current) {
      networkRef.current.fit({ animation: { duration: 400, easingFunction: 'easeInOutQuad' } });
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height,
          background: 'radial-gradient(#bae6fd 0.85px, transparent 0.85px), radial-gradient(#bae6fd 0.85px, #ffffff 0.85px)',
          backgroundSize: '24px 24px',
          backgroundPosition: '0 0, 12px 12px',
          borderRadius: '12px',
          overflow: 'hidden'
        }}
      />
      <button
        type="button"
        onClick={handleFit}
        className="btn-icon-sm"
        title="Fit network to view"
        style={{ position: 'absolute', top: 12, right: 12, zIndex: 5 }}
      >
        ⛶
      </button>
    </div>
  );
}
