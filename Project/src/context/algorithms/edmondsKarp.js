/**
 * Edmonds-Karp Maximum Flow Algorithm using Breadth-First Search (BFS)
 * Specifically modeled for a Municipal Water Distribution Network.
 */

export function solveEdmondsKarp(nodesList, edgesList, sourceId = 'S', sinkId = 'T', options = { detailedBfs: true }) {
  if (!nodesList || nodesList.length < 2) {
    throw new Error('Network must have at least 2 nodes.');
  }
  if (!sourceId || !nodesList.some(n => n.id === sourceId)) {
    throw new Error(`Invalid source reservoir node: "${sourceId}".`);
  }
  if (!sinkId || !nodesList.some(n => n.id === sinkId)) {
    throw new Error(`Invalid destination city sink: "${sinkId}".`);
  }
  if (sourceId === sinkId) {
    throw new Error('Source reservoir and destination city must be distinct nodes.');
  }
  if (!edgesList || edgesList.length === 0) {
    throw new Error('Please add at least one directed pipe to run the algorithm.');
  }

  const nodes = nodesList.map(n => n.id);
  const capacity = new Map();
  const flow = new Map();
  const adj = new Map();

  nodes.forEach(u => {
    capacity.set(u, new Map());
    flow.set(u, new Map());
    adj.set(u, new Set());
  });

  edgesList.forEach(e => {
    const u = e.from;
    const v = e.to;
    const cap = parseFloat(e.capacity) || 0;

    const existingCap = capacity.get(u).get(v) || 0;
    capacity.get(u).set(v, existingCap + cap);

    if (!capacity.get(v).has(u)) {
      capacity.get(v).set(u, 0); // reverse edge has capacity 0 initially
    }
    flow.get(u).set(v, 0);
    flow.get(v).set(u, 0);

    adj.get(u).add(v);
    adj.get(v).add(u);
  });

  let totalMaxFlow = 0;
  const steps = [];
  const augmentingPaths = [];
  let iteration = 0;

  // Snapshot helper
  const captureState = (extra = {}) => {
    const edgeStates = edgesList.map(e => {
      const f = flow.get(e.from)?.get(e.to) || 0;
      const c = capacity.get(e.from)?.get(e.to) || 0;
      return {
        id: e.id,
        from: e.from,
        to: e.to,
        capacity: c,
        flow: f,
        residualForward: c - f,
        residualReverse: f,
        isSaturated: f >= c && c > 0
      };
    });

    return {
      iteration,
      totalFlow: totalMaxFlow,
      edges: edgeStates,
      ...extra
    };
  };

  // Step 0: Initial State
  steps.push(captureState({
    type: 'INIT',
    title: 'Initial State: All Pipe Flows = 0 L/s',
    description: `Water Distribution Network is initialized with ${nodes.length} nodes and ${edgesList.length} pipes. All edge flows are set to 0 L/s. Water Reservoir is "${sourceId}", Destination City is "${sinkId}". No water has been pumped yet.`,
    whyContinues: `BFS will search for the first available path from Reservoir "${sourceId}" to City "${sinkId}".`,
    activePath: [],
    activePathEdges: [],
    visitedNodes: [],
    queue: [sourceId],
    bottleneck: 0,
    addedFlow: 0
  }));

  // Edmonds-Karp Outer Loop
  while (true) {
    iteration++;

    // BFS to find the shortest augmenting path (fewest edges) from source to sink in residual graph
    const parent = new Map(); // child -> { node: parent, residual, isReverse }
    const queue = [sourceId];
    const visited = new Set([sourceId]);

    if (options.detailedBfs) {
      steps.push(captureState({
        type: 'BFS_START',
        title: `Iteration #${iteration}: BFS Searching from Reservoir "${sourceId}"`,
        description: `BFS starts expanding from Source Reservoir "${sourceId}" to find the shortest route (fewest pipes) with available residual capacity > 0.`,
        whyContinues: `Searching downstream through connected pipes.`,
        queue: [...queue],
        visitedNodes: Array.from(visited),
        activePath: [],
        activePathEdges: [],
        bottleneck: 0,
        addedFlow: 0
      }));
    }

    let pathFound = false;

    while (queue.length > 0) {
      const curr = queue.shift();

      if (curr === sinkId) {
        pathFound = true;
        break;
      }

      const neighbors = Array.from(adj.get(curr) || []).sort();

      for (const next of neighbors) {
        const cap = capacity.get(curr)?.get(next) || 0;
        const fl = flow.get(curr)?.get(next) || 0;
        const residual = cap - fl;

        if (residual > 0 && !visited.has(next)) {
          visited.add(next);
          const isOriginal = (capacity.get(curr)?.get(next) || 0) > 0;
          parent.set(next, {
            node: curr,
            residual,
            isReverse: !isOriginal
          });
          queue.push(next);

          if (options.detailedBfs) {
            steps.push(captureState({
              type: 'BFS_EXPLORE',
              title: `Iteration #${iteration}: BFS Traversed Pipe ${curr} → ${next}`,
              description: `BFS reached node "${next}" from "${curr}" via available residual capacity of ${residual} L/s. Visited nodes: [${Array.from(visited).join(', ')}]. Queue: [${queue.join(', ')}].`,
              whyContinues: next === sinkId ? `Reached Destination City "${sinkId}"! Reconstructing augmenting path.` : `Continuing BFS traversal.`,
              currentNode: curr,
              targetNode: next,
              visitedNodes: Array.from(visited),
              queue: [...queue],
              activePath: [],
              activePathEdges: [],
              bottleneck: 0,
              addedFlow: 0
            }));
          }

          if (next === sinkId) {
            pathFound = true;
            break;
          }
        }
      }

      if (pathFound) break;
    }

    // If sink was not reached, no more augmenting paths exist!
    if (!pathFound) {
      break;
    }

    // Reconstruct augmenting path from sink back to source
    const pathNodes = [];
    const pathEdges = [];
    let curr = sinkId;
    let bottleneck = Infinity;

    while (curr !== sourceId) {
      const pInfo = parent.get(curr);
      const pNode = pInfo.node;
      const res = pInfo.residual;
      bottleneck = Math.min(bottleneck, res);

      pathNodes.unshift(curr);
      pathEdges.unshift({
        from: pNode,
        to: curr,
        residual: res,
        isReverse: pInfo.isReverse
      });
      curr = pNode;
    }
    pathNodes.unshift(sourceId);

    const pipeCapacityDetails = pathEdges.map(e => `${e.from}→${e.to} (res: ${e.residual} L/s)`).join(', ');

    // Step: Shortest Augmenting Path Found
    steps.push(captureState({
      type: 'PATH_FOUND',
      title: `Iteration #${iteration}: Augmenting Path Found: ${pathNodes.join(' → ')}`,
      description: `BFS identified the shortest path: ${pathNodes.join(' → ')}. Capacities along this route are: ${pipeCapacityDetails}. The bottleneck (minimum available capacity) is ${bottleneck} L/s.`,
      whyContinues: `Water throughput can now be increased by +${bottleneck} L/s along this path.`,
      activePath: pathNodes,
      activePathEdges: pathEdges,
      bottleneck,
      addedFlow: 0,
      visitedNodes: Array.from(visited),
      queue: []
    }));

    // Augment flow along the path
    for (const pEdge of pathEdges) {
      const u = pEdge.from;
      const v = pEdge.to;

      const f_uv = flow.get(u)?.get(v) || 0;
      const f_vu = flow.get(v)?.get(u) || 0;

      flow.get(u).set(v, f_uv + bottleneck);
      flow.get(v).set(u, f_vu - bottleneck);
    }

    totalMaxFlow += bottleneck;

    augmentingPaths.push({
      iteration,
      path: pathNodes,
      pathString: pathNodes.join(' → '),
      bottleneck,
      cumulativeFlow: totalMaxFlow,
      edgeBreakdown: pipeCapacityDetails
    });

    // Step: Flow Augmented
    steps.push(captureState({
      type: 'FLOW_AUGMENTED',
      title: `Iteration #${iteration}: Pushed +${bottleneck} L/s Water Flow!`,
      description: `Successfully pumped +${bottleneck} L/s along ${pathNodes.join(' → ')}. Cumulative water arriving at City "${sinkId}" is now ${totalMaxFlow} L/s. Forward residual capacities decreased by ${bottleneck} L/s and reverse residual edges increased by ${bottleneck} L/s.`,
      whyContinues: `BFS will now run again to check if another augmenting path exists in the residual graph.`,
      activePath: pathNodes,
      activePathEdges: pathEdges,
      bottleneck,
      addedFlow: bottleneck,
      visitedNodes: Array.from(visited),
      queue: []
    }));
  }

  // Find Minimum Cut: Reachable nodes from source in final residual graph
  const minCutReachable = new Set();
  const finalQueue = [sourceId];
  minCutReachable.add(sourceId);

  while (finalQueue.length > 0) {
    const curr = finalQueue.shift();
    const neighbors = adj.get(curr) || [];
    for (const next of neighbors) {
      const cap = capacity.get(curr)?.get(next) || 0;
      const fl = flow.get(curr)?.get(next) || 0;
      const residual = cap - fl;
      if (residual > 0 && !minCutReachable.has(next)) {
        minCutReachable.add(next);
        finalQueue.push(next);
      }
    }
  }

  const sourceCutSet = Array.from(minCutReachable).sort();
  const sinkCutSet = nodes.filter(n => !minCutReachable.has(n)).sort();

  const cutEdges = [];
  let minCutCapacity = 0;
  edgesList.forEach(e => {
    if (minCutReachable.has(e.from) && !minCutReachable.has(e.to)) {
      cutEdges.push({
        id: e.id,
        from: e.from,
        to: e.to,
        capacity: e.capacity,
        flow: flow.get(e.from)?.get(e.to) || 0
      });
      minCutCapacity += e.capacity;
    }
  });

  // Step: Final Termination
  steps.push(captureState({
    type: 'TERMINATION',
    title: `Algorithm Terminated — Maximum Water Flow = ${totalMaxFlow} L/s`,
    description: `BFS completed: Destination City "${sinkId}" is now completely unreachable from Reservoir "${sourceId}" in the residual network. No augmenting paths with residual capacity > 0 remain. All crossing pipes are 100% saturated. Maximum Flow is ${totalMaxFlow} L/s.`,
    whyContinues: `The Max-Flow Min-Cut Theorem verifies optimality: Max Flow (${totalMaxFlow} L/s) exactly equals Minimum Cut Capacity (${minCutCapacity} L/s).`,
    activePath: [],
    activePathEdges: [],
    visitedNodes: Array.from(minCutReachable),
    queue: [],
    sourceCutSet,
    sinkCutSet,
    cutEdges,
    bottleneck: 0,
    addedFlow: 0
  }));

  const edgeUtilization = edgesList.map(e => {
    const f = flow.get(e.from)?.get(e.to) || 0;
    const c = e.capacity;
    const utilPercent = c > 0 ? Math.round((f / c) * 100) : 0;
    return {
      id: e.id,
      from: e.from,
      to: e.to,
      capacity: c,
      flow: f,
      residualCapacity: Math.max(0, c - f),
      utilPercent,
      status: f >= c ? 'Saturated' : (f > 0 ? 'Active' : 'Unused')
    };
  });

  return {
    maxFlow: totalMaxFlow,
    steps,
    augmentingPaths,
    minCut: {
      sourceSet: sourceCutSet,
      sinkSet: sinkCutSet,
      capacity: minCutCapacity,
      isTheoremVerified: totalMaxFlow === minCutCapacity
    },
    cutEdges,
    edgeUtilization,
    summary: {
      nodeCount: nodes.length,
      edgeCount: edgesList.length,
      totalPaths: augmentingPaths.length,
      maxFlow: totalMaxFlow,
      unit: 'L/s'
    }
  };
}
