# 🪐 QIVORA — Think Faster. Play Smarter.
### Adaptive Cognitive Assessment & Procedural Game Platform

[![React](https://img.shields.io/badge/Frontend-React_19_+_TypeScript-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Bundler-Vite_8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**QIVORA** is a next-generation cognitive agility and psychometric evaluation platform. Powered by an authoritative **FastAPI** procedural generation backend and an interactive **React 19 / Vite** tactile frontend, QIVORA delivers 8 bespoke mental arenas designed to measure and elevate fluid intelligence, working memory, attention, executive control, and quantitative reasoning.

---

## 🌟 Key Features

- 🌀 **Orbital Interactive Hub**: Kinetic, rotating circular navigation interface for exploring cognitive domains in real time.
- 📐 **8 Procedural Game Arenas**:
  1. **Inductive Logic**: Infer latent transformation rules governing geometric shapes and sequences.
  2. **Grid Matrix**: Raven-style progressive 3×3 matrix completion across spatial topology.
  3. **Switch Challenge**: Graph BFS state toggle transitions with minimal move verification.
  4. **Memory Matrix**: Spatial working memory, visual retention, and dual N-Back recall.
  5. **Attention Lens**: High-density visual anomaly detection under latency pressure.
  6. **Reaction Pulse**: Sub-millisecond impulse response and false-start inhibition.
  7. **Speed Math**: Rapid mental arithmetic and numerical agility sprints.
  8. **Deductive Syllogisms**: Multi-step formal logic and premise validity verification.
- ⚡ **Authoritative FastAPI Backend**: Real-time algorithmic validation, seeded reproducibility, graph exploration, and anti-cheat telemetry.
- ⚔️ **Ghost Duel 1v1 Arena**: Competitive turn-based PvP and AI bot cognitive battles.
- 📊 **Psychometric Profiling**: Standardized CQ scoring, percentile benchmarking, cognitive archetypes, and personalized growth recommendations.
- 🎵 **Adaptive Sound Engine**: Web Audio API tactile auditory feedback and synth chords.

---

## 🏗️ Architecture & Tech Stack

```
QIVORA/
├── backend/                  # FastAPI Authoritative Game Engine
│   └── app/
│       ├── api/              # Game sessions and telemetry endpoints
│       ├── engine/           # Procedural generator logic (Grid, Inductive, Switch)
│       ├── models/           # Pydantic schemas & state validation
│       └── tests/            # Automated test suite
├── src/                      # React 19 + TypeScript Frontend
│   ├── components/           # UI components, modals, and game shells
│   ├── engine/               # Client-side generators & fallback logic
│   ├── pages/                # LandingPage (Orbital), Dashboard, Arena, Duel, Results
│   ├── services/             # API Client, Web Audio Engine, Local Storage
│   └── types/                # TypeScript interfaces and game types
├── run_backend.py            # FastAPI uvicorn runner
└── package.json              # Vite scripts and dependencies
```

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js** (v18+)
- **Python** (v3.10+)

### 2. Installation

Clone the repository:
```bash
git clone https://github.com/vaishnavireddy067/QIVORA-Adaptive-Cognitive-Assessment-Procedural-Game-Platform.git
cd QIVORA-Adaptive-Cognitive-Assessment-Procedural-Game-Platform
```

Install frontend dependencies:
```bash
npm install
```

Install backend dependencies:
```bash
pip install fastapi uvicorn pydantic pytest
```

---

### 3. Running Locally

#### Start the FastAPI Backend:
```bash
python run_backend.py
```
> The API will be live at `http://127.0.0.1:8001` (Interactive Swagger Docs: `http://127.0.0.1:8001/docs`).

#### Start the Vite Frontend (in a second terminal):
```bash
npm run dev
```
> Open your browser at `http://localhost:5173`.

---

## 🧪 Testing

Run backend tests:
```bash
pytest backend/app/tests
```

Run frontend linting & production build:
```bash
npm run lint
npm run build
```

---

## 📜 License
Distributed under the MIT License. See `LICENSE` for details.
