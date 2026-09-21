# QIVORA Master FastAPI Application
import os
import sys

# Ensure repository root is in python path
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.api.games import router as games_router
from backend.app.api.sessions import router as sessions_router

app = FastAPI(
    title="QIVORA Cognitive Game Platform API",
    description="Authoritative game-engine, procedural generation, and validation for Qivora",
    version="1.0.0"
)

# Enable CORS for local React/Vite development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from backend.app.api.sessions import get_session_results
from backend.app.models.schemas import SessionResultResponse

app.include_router(games_router, prefix="/api")
app.include_router(sessions_router, prefix="/api")

@app.get("/health")
@app.get("/api/health")
def health_check():
    return {"status": "active", "service": "qivora-backend"}

@app.get("/api/results/{session_id}", response_model=SessionResultResponse)
def api_results_alias(session_id: str):
    return get_session_results(session_id)

@app.get("/api/dashboard/summary")
def api_dashboard_summary():
    return {
        "status": "healthy",
        "total_active_sessions": 3,
        "supported_engines": ["grid", "inductive", "switch"],
        "telemetry_version": "2.4.0",
        "global_percentile_baseline": 70
    }

@app.get("/")
def read_root():
    return {
        "platform": "QIVORA",
        "tagline": "THINK FASTER. PLAY SMARTER.",
        "status": "online",
        "engines": ["grid", "inductive", "switch"]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="127.0.0.1", port=8001, reload=True)
