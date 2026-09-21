# QIVORA Scoring & Adaptive Difficulty Engine
from typing import Dict, List, Optional
from pydantic import BaseModel
from backend.app.engine.base import ScoreResult

class AdaptiveTracker(BaseModel):
    current_difficulty: int = 1
    consecutive_correct: int = 0
    consecutive_struggles: int = 0

    def record_attempt(self, is_correct: bool, time_taken_ms: float, benchmark_ms: float, efficiency: Optional[float] = None) -> int:
        is_fast = time_taken_ms <= benchmark_ms * 1.1
        is_efficient = (efficiency is None) or (efficiency >= 0.8)

        if is_correct and is_fast and is_efficient:
            self.consecutive_correct += 1
            self.consecutive_struggles = 0
            if self.consecutive_correct >= 2:
                self.current_difficulty = min(5, self.current_difficulty + 1)
                self.consecutive_correct = 0
        elif is_correct:
            # Correct but slow or inefficient -> maintain
            self.consecutive_correct = max(0, self.consecutive_correct)
            self.consecutive_struggles = 0
        else:
            # Incorrect -> count struggle
            self.consecutive_struggles += 1
            self.consecutive_correct = 0
            if self.consecutive_struggles >= 2:
                self.current_difficulty = max(1, self.current_difficulty - 1)
                self.consecutive_struggles = 0

        return self.current_difficulty

def compute_cognitive_profile(attempts: List[Dict]) -> Dict:
    """Computes narrative insights and cognitive archetype from real session telemetry."""
    if not attempts:
        return {
            "headline": "HOW YOU THINK",
            "narrative": "Complete practice or test challenges to generate your cognitive profile.",
            "strength": "Pattern Recognition",
            "edge": "Working Memory",
            "challenge": "Cognitive Flexibility"
        }

    total_attempts = len(attempts)
    correct_count = sum(1 for a in attempts if a.get("is_correct"))
    accuracy = correct_count / max(1, total_attempts)
    avg_speed = sum(a.get("time_taken_ms", 3000) for a in attempts) / max(1, total_attempts)

    # Breakdown by game type
    game_stats: Dict[str, Dict] = {}
    for a in attempts:
        gt = a.get("game_type", "general")
        if gt not in game_stats:
            game_stats[gt] = {"correct": 0, "total": 0, "efficiencies": []}
        game_stats[gt]["total"] += 1
        if a.get("is_correct"):
            game_stats[gt]["correct"] += 1
        if a.get("efficiency") is not None:
            game_stats[gt]["efficiencies"].append(a.get("efficiency"))

    # Determine qualitative narrative
    grid_acc = game_stats.get("grid", {}).get("correct", 0) / max(1, game_stats.get("grid", {}).get("total", 1))
    ind_acc = game_stats.get("inductive", {}).get("correct", 0) / max(1, game_stats.get("inductive", {}).get("total", 1))
    sw_acc = game_stats.get("switch", {}).get("correct", 0) / max(1, game_stats.get("switch", {}).get("total", 1))

    if ind_acc >= 0.8:
        strength = "Pattern Recognition"
        narrative = "You identify latent geometric rules with high accuracy."
    elif grid_acc >= 0.8:
        strength = "Spatial Reasoning"
        narrative = "You excel at multi-dimensional matrix transformations and spatial modeling."
    else:
        strength = "Analytical Precision"
        narrative = "You demonstrate steady analytical methodology across sequential tasks."

    if sw_acc < 0.7:
        challenge = "Cognitive Flexibility"
        narrative += " Complex state-space switching and multi-switch overlapping tasks represent your greatest area for rapid improvement."
    else:
        challenge = "Speed Under Pressure"
        narrative += " Maintaining minimal move counts under tighter time limits will elevate your performance ceiling."

    return {
        "headline": "HOW YOU THINK",
        "narrative": narrative,
        "strength": strength,
        "edge": "Visual Memory",
        "challenge": challenge,
        "overall_accuracy": round(accuracy * 100, 1),
        "average_speed_ms": round(avg_speed)
    }
