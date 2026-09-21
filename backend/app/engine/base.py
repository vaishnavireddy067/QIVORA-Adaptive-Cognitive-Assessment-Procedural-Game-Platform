# QIVORA Game Engine Core
from abc import ABC, abstractmethod
from typing import Any, Dict, Generic, List, Optional, TypeVar
from pydantic import BaseModel, Field

TState = TypeVar("TState", bound=BaseModel)
TAction = TypeVar("TAction", bound=BaseModel)
TQuestion = TypeVar("TQuestion", bound=BaseModel)

class GameDefinition(BaseModel):
    game_type: str
    title: str
    subtitle: str
    description: str
    rules: List[str]
    max_difficulty: int = 5

class GameAction(BaseModel):
    action_type: str
    payload: Dict[str, Any] = Field(default_factory=dict)

class ValidationResult(BaseModel):
    is_valid: bool
    is_correct: bool
    message: str
    details: Dict[str, Any] = Field(default_factory=dict)
    explanation: Optional[str] = None

class ScoreResult(BaseModel):
    score: int
    accuracy: float
    time_taken_ms: float
    difficulty: int
    efficiency: Optional[float] = None
    breakdown: Dict[str, Any] = Field(default_factory=dict)

class GameEngine(ABC, Generic[TState, TAction, TQuestion]):
    """Abstract base class for all QIVORA game engines."""
    
    @abstractmethod
    def generate(self, difficulty: int, seed: Optional[str] = None) -> TQuestion:
        """Procedurally generate a deterministic question."""
        pass

    @abstractmethod
    def initialize_state(self, question: TQuestion) -> TState:
        """Create the starting interactive game state from a question."""
        pass

    @abstractmethod
    def apply_action(self, state: TState, action: TAction, question: TQuestion) -> TState:
        """Execute a state transition based on a player action."""
        pass

    @abstractmethod
    def validate_submission(self, state: TState, submission: Any, question: TQuestion) -> ValidationResult:
        """Authoritatively validate whether the submission is correct."""
        pass

    @abstractmethod
    def is_complete(self, state: TState, question: TQuestion) -> bool:
        """Check if the game goal has been reached."""
        pass

    @abstractmethod
    def calculate_score(self, question: TQuestion, state: TState, time_taken_ms: float, is_correct: bool) -> ScoreResult:
        """Calculate scoring metrics based on performance telemetry."""
        pass
