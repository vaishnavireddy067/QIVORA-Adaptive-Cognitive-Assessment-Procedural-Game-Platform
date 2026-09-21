# QIVORA Game API Endpoints
import uuid
from typing import Dict, Optional
from fastapi import APIRouter, HTTPException
from backend.app.engine.grid import GridGameEngine
from backend.app.engine.inductive import InductiveGameEngine
from backend.app.engine.switch import SwitchGameEngine
from backend.app.engine.base import GameAction
from backend.app.engine.scoring import AdaptiveTracker
from backend.app.models.schemas import (
    StartGameRequest,
    GameActionRequest,
    SubmitAnswerRequest,
    GameSessionResponse,
    ActionResponse,
    SubmissionResponse
)

router = APIRouter(prefix="/games", tags=["games"])

# In-memory authoritative session store
ENGINES = {
    "grid": GridGameEngine(),
    "inductive": InductiveGameEngine(),
    "switch": SwitchGameEngine()
}

SESSIONS: Dict[str, Dict] = {}
ADAPTIVE_TRACKERS: Dict[str, AdaptiveTracker] = {}

def get_session_or_404(session_id: str) -> Dict:
    if session_id not in SESSIONS:
        raise HTTPException(status_code=404, detail="Game session not found or expired.")
    return SESSIONS[session_id]

def create_game_session(game_type: str, req: StartGameRequest) -> GameSessionResponse:
    if game_type not in ENGINES:
        raise HTTPException(status_code=400, detail=f"Unsupported game type: {game_type}")

    engine = ENGINES[game_type]
    session_id = f"sess-{game_type}-{uuid.uuid4().hex[:10]}"
    
    # Deterministic demo seeds if requested
    seed = req.seed
    if req.mode == "demo":
        seed = f"{game_type}-demo-001"

    question = engine.generate(difficulty=req.difficulty, seed=seed)
    state = engine.initialize_state(question)

    tracker = ADAPTIVE_TRACKERS.setdefault(session_id, AdaptiveTracker(current_difficulty=req.difficulty))

    # Strip raw correct answer from question payload if in test mode
    q_dict = question.dict()
    if req.mode == "test":
        q_dict.pop("correct_tile", None)
        q_dict.pop("correct_state", None)
        q_dict.pop("optimal_sequence", None)
        q_dict.pop("explanation", None)

    SESSIONS[session_id] = {
        "session_id": session_id,
        "game_type": game_type,
        "mode": req.mode,
        "difficulty": req.difficulty,
        "engine": engine,
        "question": question,
        "state": state,
        "tracker": tracker,
        "is_completed": False
    }

    return GameSessionResponse(
        session_id=session_id,
        game_type=game_type,
        mode=req.mode,
        difficulty=req.difficulty,
        question=q_dict,
        state=state.dict(),
        is_completed=False
    )

def handle_game_action(session_id: str, action_req: GameActionRequest) -> ActionResponse:
    sess = get_session_or_404(session_id)
    engine = sess["engine"]
    question = sess["question"]
    state = sess["state"]

    action = GameAction(action_type=action_req.action_type, payload=action_req.payload)
    next_state = engine.apply_action(state, action, question)
    sess["state"] = next_state
    is_done = engine.is_complete(next_state, question)
    sess["is_completed"] = is_done

    return ActionResponse(
        session_id=session_id,
        state=next_state.dict(),
        is_completed=is_done
    )

def handle_game_submit(session_id: str, submit_req: SubmitAnswerRequest) -> SubmissionResponse:
    sess = get_session_or_404(session_id)
    engine = sess["engine"]
    question = sess["question"]
    state = sess["state"]
    tracker = sess["tracker"]

    validation = engine.validate_submission(state, submit_req.submission, question)
    score_res = engine.calculate_score(
        question,
        state,
        submit_req.time_taken_ms,
        validation.is_correct
    )

    # Adaptive difficulty tracking
    benchmark_ms = 15000 + (question.difficulty * 4000)
    next_diff = tracker.record_attempt(
        is_correct=validation.is_correct,
        time_taken_ms=submit_req.time_taken_ms,
        benchmark_ms=benchmark_ms,
        efficiency=score_res.efficiency
    )
    sess["is_completed"] = True

    # In test mode, hide detailed explanation until overall assessment finishes
    if sess["mode"] == "test":
        validation.explanation = None

    return SubmissionResponse(
        session_id=session_id,
        validation=validation,
        score=score_res,
        next_difficulty=next_diff,
        is_completed=True
    )

# Dedicated routes per game as requested in specification
@router.post("/grid/start", response_model=GameSessionResponse)
def start_grid(req: StartGameRequest):
    return create_game_session("grid", req)

@router.post("/grid/action", response_model=ActionResponse)
@router.post("/grid/action/{session_id}", response_model=ActionResponse)
def action_grid(req: GameActionRequest, session_id: Optional[str] = None):
    sid = session_id or req.session_id
    if not sid:
        raise HTTPException(status_code=400, detail="session_id is required")
    return handle_game_action(sid, req)

@router.post("/grid/submit", response_model=SubmissionResponse)
@router.post("/grid/submit/{session_id}", response_model=SubmissionResponse)
def submit_grid(req: SubmitAnswerRequest, session_id: Optional[str] = None):
    sid = session_id or req.session_id
    if not sid:
        raise HTTPException(status_code=400, detail="session_id is required")
    return handle_game_submit(sid, req)

@router.post("/inductive/start", response_model=GameSessionResponse)
def start_inductive(req: StartGameRequest):
    return create_game_session("inductive", req)

@router.post("/inductive/action", response_model=ActionResponse)
@router.post("/inductive/action/{session_id}", response_model=ActionResponse)
def action_inductive(req: GameActionRequest, session_id: Optional[str] = None):
    sid = session_id or req.session_id
    if not sid:
        raise HTTPException(status_code=400, detail="session_id is required")
    return handle_game_action(sid, req)

@router.post("/inductive/submit", response_model=SubmissionResponse)
@router.post("/inductive/submit/{session_id}", response_model=SubmissionResponse)
def submit_inductive(req: SubmitAnswerRequest, session_id: Optional[str] = None):
    sid = session_id or req.session_id
    if not sid:
        raise HTTPException(status_code=400, detail="session_id is required")
    return handle_game_submit(sid, req)

@router.post("/switch/start", response_model=GameSessionResponse)
def start_switch(req: StartGameRequest):
    return create_game_session("switch", req)

@router.post("/switch/action", response_model=ActionResponse)
@router.post("/switch/action/{session_id}", response_model=ActionResponse)
def action_switch(req: GameActionRequest, session_id: Optional[str] = None):
    sid = session_id or req.session_id
    if not sid:
        raise HTTPException(status_code=400, detail="session_id is required")
    return handle_game_action(sid, req)

@router.post("/switch/submit", response_model=SubmissionResponse)
@router.post("/switch/submit/{session_id}", response_model=SubmissionResponse)
def submit_switch(req: SubmitAnswerRequest, session_id: Optional[str] = None):
    sid = session_id or req.session_id
    if not sid:
        raise HTTPException(status_code=400, detail="session_id is required")
    return handle_game_submit(sid, req)

