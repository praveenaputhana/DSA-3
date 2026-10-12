import { solveEdmondsKarp } from './src/algorithms/edmondsKarp.js';

const nodes = [
  { id: 'S' }, { id: 'A' }, { id: 'B' }, { id: 'C' }, { id: 'D' }, { id: 'T' }
];

console.log('--- TEST WITH B->D = 5 ---');
const edges5 = [
  { id: 'S_A', from: 'S', to: 'A', capacity: 10 },
  { id: 'S_B', from: 'S', to: 'B', capacity: 8 },
  { id: 'A_B', from: 'A', to: 'B', capacity: 2 },
  { id: 'A_C', from: 'A', to: 'C', capacity: 5 },
  { id: 'B_C', from: 'B', to: 'C', capacity: 10 },
  { id: 'B_D', from: 'B', to: 'D', capacity: 5 },
  { id: 'C_T', from: 'C', to: 'T', capacity: 7 },
  { id: 'D_T', from: 'D', to: 'T', capacity: 8 }
];
const r5 = solveEdmondsKarp(nodes, edges5, 'S', 'T', { detailedBfs: false });
console.log('Result with B->D=5:', r5.maxFlow);
r5.augmentingPaths.forEach((p, i) => console.log(` Path ${i+1}: ${p.pathString} (+${p.bottleneck})`));
console.log('Min Cut with B->D=5:', r5.minCut);

console.log('\n--- TEST WITH B->D = 8 ---');
const edges8 = [
  { id: 'S_A', from: 'S', to: 'A', capacity: 10 },
  { id: 'S_B', from: 'S', to: 'B', capacity: 8 },
  { id: 'A_B', from: 'A', to: 'B', capacity: 2 },
  { id: 'A_C', from: 'A', to: 'C', capacity: 5 },
  { id: 'B_C', from: 'B', to: 'C', capacity: 10 },
  { id: 'B_D', from: 'B', to: 'D', capacity: 8 },
  { id: 'C_T', from: 'C', to: 'T', capacity: 7 },
  { id: 'D_T', from: 'D', to: 'T', capacity: 8 }
];
const r8 = solveEdmondsKarp(nodes, edges8, 'S', 'T', { detailedBfs: false });
console.log('Result with B->D=8:', r8.maxFlow);
r8.augmentingPaths.forEach((p, i) => console.log(` Path ${i+1}: ${p.pathString} (+${p.bottleneck})`));
console.log('Min Cut with B->D=8:', r8.minCut);
