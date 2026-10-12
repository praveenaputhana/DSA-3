# Edmonds–Karp Maximum Flow Visualization Using BFS (Water Distribution Network)
### Multi-Page React.js Web Application • DSA 3 Project

> **Subject:** Data Structures & Algorithms 3 (DSA 3)  
> **Faculty Guide:** J. Yamini Devi  
> **Engineering Application:** Municipal Water Distribution Network  
> **Team Members:**  
> - **Y. Uttej** — `2520030439`  
> - **G. Hitesh** — `2520030370`  
> - **K. Sudheer** — `2520030470`  

---

## 🌟 1. Project Overview

This project is a complete, responsive, **multi-page web application** built with **React.js**, **React Router DOM**, and **Vis Network** to demonstrate the **Edmonds–Karp Maximum Flow Algorithm** using **Breadth-First Search (BFS)**.

Every page has its own dedicated URL and route (not single-page section scrolling):
1. **Home Page (`/`)**: Landing showcase with project summary, interactive hydraulic SVG schematic, and quick navigation.
2. **Network Workbench (`/workbench`)**: Interactive topology editor to add/edit/delete reservoirs, storage tanks, and pipes, set capacities, and select source/sink terminals.
3. **Simulation Page (`/simulation`)**: Main demonstration page with interactive step-by-step playback, BFS exploration queues, augmenting paths, and bottleneck detection.
4. **Results Dashboard (`/results`)**: Comprehensive analytical summary showing dynamic maximum throughput, augmentation history, pipe utilization percentages, and the Max-Flow Min-Cut Theorem proof.
5. **Algorithm Theory (`/algorithm`)**: Complete conceptual and mathematical breakdown explaining flow networks, BFS shortest path guarantee, reverse residual edges, and the $O(V \cdot E^2)$ complexity proof.
6. **Project Team (`/team`)**: Academic credentials, team members, faculty mentor details, and department affiliations.
7. **Custom 404 (`*`)**: Route recovery with Home navigation.

---

## 🛠️ 2. Technology Stack

- **Frontend Library:** React.js (v18.3)
- **Routing Engine:** React Router DOM (v6.28) — full client-side routing with URL synchronization and browser history support (Back/Forward).
- **Graph Visualization:** Vis Network (v9.1) — canvas-rendered directed water pipelines, capacity labels, flow gauges, and residual/physical dual-view modes.
- **State Management:** Centralized React Context (`GraphContext.jsx`) with automatic `localStorage` synchronization across all pages.
- **Styling:** Custom Vanilla CSS with a clean white/light-blue water theme, dark navy text, glassmorphism cards, and responsive layout.
- **Build Tool:** Vite (v6.0) for fast HMR and optimized production bundling.

---

## 🚦 3. Separate Page Breakdown

### 🏠 Page 1: Home (`/`)
- Project Title & Subtitle.
- Interactive SVG hydraulic schematic showing water flowing from Reservoir $S$ to City $T$.
- Direct page transition buttons:
  - **Start Simulation** → Navigates to `/simulation`
  - **Learn the Algorithm** → Navigates to `/algorithm`
  - **View Results** → Navigates to `/results`
  - **Load Sample Network** → Loads default assignment sample and navigates to `/workbench`.

### 🛠️ Page 2: Network Workbench (`/workbench`)
- Interactive Vis Network canvas rendering nodes and directed pipes immediately upon opening.
- **Add Node Modal:** Create custom nodes with designated hydraulic roles (*Reservoir, Tank, Junction, City*).
- **Add Pipe Modal:** Connect directed pipes between any pair of nodes with custom capacity (L/s).
- **Edit & Delete Pipes:** Click any pipe on the canvas or in the configuration table to update capacity or remove the conduit.
- **Terminals Selector:** Designate Source Reservoir ($S$) and Destination City Sink ($T$).
- **Presets Selector:**
  - *Default Sample Network* ($S \rightarrow A: 10, S \rightarrow B: 8, A \rightarrow B: 2, A \rightarrow C: 5, B \rightarrow C: 10, B \rightarrow D: 5, C \rightarrow T: 7, D \rightarrow T: 8$).
  - *Flow Cancellation / Reverse Edge Demo*.
  - *Metropolitan Multi-Tier Water Grid*.
- Changes instantly update the shared `GraphContext` for use in Simulation and Results!

### ▶️ Page 3: Simulation Page (`/simulation`)
- Full simulation workbench with real-time graph rendering.
- **Interactive Controls:**
  - `Run Full`: Executes the full Edmonds-Karp BFS solver and jumps to the optimal maximum flow state.
  - `Play / Pause`: Automated step-by-step playback with speed regulation (0.5x, 1x, 1.5x, 2x, 3x).
  - `Next Step / Prev Step`: Granular stepping through BFS queue expansions and path augmentations.
  - `Reset`: Restores flow to zero while maintaining network layout.
  - `Reload Sample`: Restores the default assignment network.
  - `Show Physical Pipes`: Displays actual pipes with `flow / capacity` labels.
  - `Show Residual Graph`: Displays forward residual capacities and reverse cancellation edges (purple dashed lines).
  - `Paths Only Toggle`: Filters execution to show either every individual BFS exploration or only path augmentations.
- **Live Step Inspector:**
  - Real-time Phase Badge (BFS Traversal, Augmenting Path Found, Flow Augmented, Max Flow Achieved).
  - Active BFS Queue display (e.g., `[S] → [A, B]`).
  - Visited Residual Nodes list.
  - Selected Augmenting Path chain (`S → A → C → T`).
  - Bottleneck capacity: $\min(c_f(u, v))$.
  - Real-time cumulative flow counter.

### 📊 Page 4: Results Dashboard (`/results`)
- **Calculated Maximum Flow:** Dynamic metric (e.g., **12 L/s** for default sample), never hardcoded.
- **Augmentation Sequence History Table:** Every augmenting path, bottleneck value, and cumulative flow.
- **Pipe Utilization Breakdown Table:** Pipe ID, capacity, actual flow, remaining residual, visual utilization bar (0%–100%), and status (`Saturated`, `Active`, `Unused`).
- **Final Network State Visualization:** Graph displayed in its final completed flow state.
- **Max-Flow Min-Cut Theorem Verification:**
  - Source Set $S = \{S, A, B, C\}$
  - Sink Set $T = \{D, T\}$
  - Cut Pipes: $B \rightarrow D$ ($5\text{ L/s}$) and $C \rightarrow T$ ($7\text{ L/s}$)
  - Verification: $\text{Maximum Flow } (12\text{ L/s}) = \text{Capacity of Minimum Cut } (12\text{ L/s})$.
- If the simulation has not yet run, displays an invitation card with a "Compute Maximum Flow Now" action.

### 📘 Page 5: Algorithm Theory (`/algorithm`)
- Theoretical breakdown of Flow Networks, Capacity Constraints, and Flow Conservation.
- Importance of BFS in Edmonds–Karp: guarantees polynomial time and prevents infinite loops on irrational capacities.
- Mathematical complexity proof: **$O(V \cdot E^2)$** Time Complexity and **$O(V + E)$** Space Complexity.
- Comparison table: **Ford-Fulkerson vs Edmonds-Karp vs Dinic's vs Push-Relabel**.
- "Try Simulation Now" action navigating directly to `/simulation`.

### 👥 Page 6: Project Team (`/team`)
- Academic credentials, project title, and subject information.
- Member profile cards with registration numbers:
  - **Y. Uttej** — `2520030439`
  - **G. Hitesh** — `2520030370`
  - **K. Sudheer** — `2520030470`
- Faculty Mentor: **J. Yamini Devi**
- "Return to Home Page" button.

### 🚫 Page 7: Custom 404 Page (`*`)
- Graceful recovery page with a return button to Home (`/`).

---

## 💻 4. Running the Website Locally in Visual Studio Code

### Step 1: Install Dependencies
Open the VS Code Terminal (`Ctrl + ~`) in the project directory:
```bash
npm install
```

### Step 2: Start the Local Development Server
Run:
```bash
npm run dev
```
The application will launch on:
```
http://localhost:3000/
```
Open this URL in Google Chrome or any modern web browser.

### Step 3: Production Build (Optional)
To verify the production bundle:
```bash
npm run build
```
The optimized bundle will be compiled into the `dist/` folder.

---

## 📁 5. Project Directory Structure

```
DSA-3 PROJECT/
├── index.html                   # HTML entry point mounting React root
├── vite.config.js               # Vite configuration (port 3000, React plugin)
├── package.json                 # React, React Router DOM, Vis Network dependencies
├── src/
│   ├── main.jsx                 # React DOM mount with BrowserRouter & GraphProvider
│   ├── App.jsx                  # Main route definitions & layout
│   ├── context/
│   │   └── GraphContext.jsx     # Shared reactive graph state & localStorage sync
│   ├── algorithms/
│   │   └── edmondsKarp.js       # Pure BFS Edmonds-Karp solver & min-cut engine
│   ├── components/
│   │   ├── Navbar.jsx           # Global multi-page navigation with active links
│   │   ├── Footer.jsx           # Site footer with route links and credentials
│   │   ├── NetworkGraph.jsx     # Vis Network graph component with dual view modes
│   │   └── Toast.jsx            # Toast notifications container
│   ├── pages/
│   │   ├── Home.jsx             # / — Landing page with hero illustration
│   │   ├── Workbench.jsx        # /workbench — Interactive graph editor & presets
│   │   ├── Simulation.jsx       # /simulation — Algorithm playback & step inspector
│   │   ├── Results.jsx          # /results — Analytical metrics & min-cut dashboard
│   │   ├── Algorithm.jsx        # /algorithm — Educational theory & O(VE²) proof
│   │   ├── Team.jsx             # /team — Project credentials & team cards
│   │   └── NotFound.jsx         # * — Custom 404 recovery page
│   └── styles/
│       └── index.css            # Responsive styles, water gradients & glassmorphism
├── README.md                    # Project documentation
├── DSA-3_Project PPT.pptx       # Presentation slides
└── Edmonds_Karp_Abstract.docx   # Abstract document
```

---

## 🎓 6. Academic Information

- **Subject:** Data Structures & Algorithms 3 (DSA 3)
- **Project Topic:** Edmonds–Karp Maximum Flow Visualization Using Breadth-First Search (BFS)
- **Application:** Water Distribution Network
- **Faculty Guide:** J. Yamini Devi
- **Team Members:**
  - **Y. Uttej** — `2520030439`
  - **G. Hitesh** — `2520030370`
  - **K. Sudheer** — `2520030470`
