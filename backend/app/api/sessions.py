# QIVORA Sessions & Results API Endpoints
import uuid
from typing import Dict, List, Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from backend.app.engine.scoring import compute_cognitive_profile
from backend.app.models.schemas import SessionResultResponse

router = APIRouter(prefix="/sessions", tags=["sessions"])

GLOBAL_TEST_SESSIONS: Dict[str, Dict] = {}

class CreateSessionRequest(BaseModel):
    mode: str = "practice" # "practice", "test"
    game_types: List[str] = ["grid", "inductive", "switch"]
    seed: Optional[str] = None

class SessionCreatedResponse(BaseModel):
    session_id: str
    mode: str
    game_types: List[str]
    total_stages: int

class RecordAttemptRequest(BaseModel):
    game_type: str
    difficulty: int
    is_correct: bool
    time_taken_ms: float
    efficiency: Optional[float] = None
    details: Dict = {}

@router.post("/practice", response_model=SessionCreatedResponse)
def create_practice_session(req: CreateSessionRequest):
    sess_id = f"practice-{uuid.uuid4().hex[:10]}"
    GLOBAL_TEST_SESSIONS[sess_id] = {
        "session_id": sess_id,
        "mode": "practice",
        "game_types": req.game_types,
        "attempts": []
    }
    return SessionCreatedResponse(
        session_id=sess_id,
        mode="practice",
        game_types=req.game_types,
        total_stages=len(req.game_types)
    )

@router.post("/test", response_model=SessionCreatedResponse)
def create_test_session(req: CreateSessionRequest):
    sess_id = f"test-{uuid.uuid4().hex[:10]}"
    GLOBAL_TEST_SESSIONS[sess_id] = {
        "session_id": sess_id,
        "mode": "test",
        "game_types": req.game_types,
        "attempts": []
    }
    return SessionCreatedResponse(
        session_id=sess_id,
        mode="test",
        game_types=req.game_types,
        total_stages=len(req.game_types)
    )

@router.post("/{session_id}/attempt")
def record_session_attempt(session_id: str, req: RecordAttemptRequest):
    if session_id not in GLOBAL_TEST_SESSIONS:
        raise HTTPException(status_code=404, detail="Session not found.")
    sess = GLOBAL_TEST_SESSIONS[session_id]
    sess["attempts"].append(req.dict())
    return {"status": "recorded", "total_attempts": len(sess["attempts"])}

@router.get("/results/{session_id}", response_model=SessionResultResponse)
def get_session_results(session_id: str):
    if session_id not in GLOBAL_TEST_SESSIONS:
        # Fallback sample result if direct query
        profile = compute_cognitive_profile([
            {"game_type": "grid", "is_correct": True, "time_taken_ms": 7800},
            {"game_type": "inductive", "is_correct": True, "time_taken_ms": 6200},
            {"game_type": "switch", "is_correct": True, "time_taken_ms": 9400, "efficiency": 0.85}
        ])
        return SessionResultResponse(
            session_id=session_id,
            mode="practice",
            overall_score=84,
            profile=profile,
            attempts=[]
        )

    sess = GLOBAL_TEST_SESSIONS[session_id]
    attempts = sess["attempts"]
    profile = compute_cognitive_profile(attempts)
    
    correct_count = sum(1 for a in attempts if a.get("is_correct"))
    overall_score = int((correct_count / max(1, len(attempts))) * 100) if attempts else 75

    return SessionResultResponse(
        session_id=session_id,
        mode=sess["mode"],
        overall_score=overall_score,
        profile=profile,
        attempts=attempts
    )
