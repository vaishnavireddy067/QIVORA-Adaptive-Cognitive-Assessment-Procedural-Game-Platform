# QIVORA API Request & Response Schemas
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field
from backend.app.engine.base import ValidationResult, ScoreResult

class StartGameRequest(BaseModel):
    game_type: Optional[str] = None # "grid", "inductive", "switch"
    difficulty: int = 1
    seed: Optional[str] = None
    mode: str = "practice" # "demo", "guided", "practice", "test"

class GameActionRequest(BaseModel):
    session_id: Optional[str] = None
    action_type: str
    payload: Dict[str, Any] = Field(default_factory=dict)

class SubmitAnswerRequest(BaseModel):
    session_id: Optional[str] = None
    submission: Any = None
    time_taken_ms: float = 0.0

class GameSessionResponse(BaseModel):
    session_id: str
    game_type: str
    mode: str
    difficulty: int
    question: Dict[str, Any] # Question metadata without exposing raw answer in test mode
    state: Dict[str, Any]
    is_completed: bool

class ActionResponse(BaseModel):
    session_id: str
    state: Dict[str, Any]
    is_completed: bool

class SubmissionResponse(BaseModel):
    session_id: str
    validation: ValidationResult
    score: ScoreResult
    next_difficulty: int
    is_completed: bool

class SessionResultResponse(BaseModel):
    session_id: str
    mode: str
    overall_score: int
    profile: Dict[str, Any]
    attempts: List[Dict[str, Any]]
