# QIVORA Inductive Reasoning Game Engine
import random
from typing import Any, Dict, List, Optional
from pydantic import BaseModel
from backend.app.engine.base import GameEngine, GameAction, ValidationResult, ScoreResult

class InductiveStateItem(BaseModel):
    shape: str # "circle", "square", "triangle", "diamond", "star"
    color: str # "#FF3B20", "#121110", "#1D4ED8", "#15D888"
    size: str # "small", "medium", "large"
    rotation: int # 0, 90, 180, 270
    count: int # 1, 2, 3, 4, 5
    fill: str # "solid", "outline", "striped"

    def to_key(self) -> str:
        return f"{self.shape}-{self.color}-{self.size}-{self.rotation}-{self.count}-{self.fill}"

class InductiveQuestion(BaseModel):
    question_id: str
    game_type: str = "inductive"
    difficulty: int
    seed: str
    sequence: List[InductiveStateItem] # 3 to 4 sequential visual states
    correct_state: InductiveStateItem
    options: List[InductiveStateItem] # 4 options containing exactly 1 correct solution
    rule_type: str
    explanation: str

class InductiveState(BaseModel):
    selected_option_index: Optional[int] = None
    placed_state: Optional[InductiveStateItem] = None
    is_submitted: bool = False

SHAPES = ["circle", "square", "triangle", "diamond", "star"]
COLORS = ["#121110", "#FF3B20", "#1D4ED8", "#15D888"]
ROTATIONS = [0, 90, 180, 270]
FILLS = ["solid", "outline", "striped"]

class InductiveGameEngine(GameEngine[InductiveState, GameAction, InductiveQuestion]):

    def generate(self, difficulty: int = 1, seed: Optional[str] = None) -> InductiveQuestion:
        difficulty = max(1, min(5, difficulty))
        if seed is None:
            seed = f"inductive-{difficulty}-{random.randint(100000, 999999)}"
        rng = random.Random(seed)

        sequence: List[InductiveStateItem] = []
        rule_type = "single_property"
        explanation = ""

        if difficulty == 1:
            # Level 1: Count progression (+1) with constant shape & color
            shape = rng.choice(SHAPES)
            color = rng.choice(COLORS)
            fill = "solid"
            start_count = rng.choice([1, 2])
            rule_type = "count_arithmetic_plus_one"

            for i in range(4):
                sequence.append(InductiveStateItem(
                    shape=shape,
                    color=color,
                    size="medium",
                    rotation=0,
                    count=start_count + i,
                    fill=fill
                ))
            
            correct_state = InductiveStateItem(
                shape=shape,
                color=color,
                size="medium",
                rotation=0,
                count=start_count + 4,
                fill=fill
            )
            explanation = (
                f"Element count increases steadily by +1 at each step "
                f"({start_count} → {start_count+1} → {start_count+2} → {start_count+3} → {start_count+4})."
            )

        elif difficulty == 2:
            # Level 2: Alternating rule (+90 rotation or alternating fill)
            shape = rng.choice(SHAPES)
            color = rng.choice(COLORS)
            rule_type = "rotation_quarter_turn"

            for i in range(4):
                sequence.append(InductiveStateItem(
                    shape=shape,
                    color=color,
                    size="medium",
                    rotation=(i * 90) % 360,
                    count=1,
                    fill="solid"
                ))

            correct_state = InductiveStateItem(
                shape=shape,
                color=color,
                size="medium",
                rotation=(4 * 90) % 360,
                count=1,
                fill="solid"
            )
            explanation = "Shape rotates 90° clockwise at every transition (0° → 90° → 180° → 270° → 0°)."

        elif difficulty == 3:
            # Level 3: Two properties change (Shape cycle + Count progression)
            shape_cycle = rng.sample(SHAPES, 3)
            color = rng.choice(COLORS)
            rule_type = "shape_cycle_and_count"

            for i in range(4):
                sequence.append(InductiveStateItem(
                    shape=shape_cycle[i % 3],
                    color=color,
                    size="medium",
                    rotation=0,
                    count=i + 1,
                    fill="solid"
                ))

            correct_state = InductiveStateItem(
                shape=shape_cycle[4 % 3],
                color=color,
                size="medium",
                rotation=0,
                count=5,
                fill="solid"
            )
            explanation = (
                f"Dual Rule: Shapes cycle in sequence ({shape_cycle[0]} → {shape_cycle[1]} → {shape_cycle[2]}), "
                f"while element count increments by +1 (1 → 2 → 3 → 4 → 5)."
            )

        elif difficulty == 4:
            # Level 4: Multiple interacting rules (Shape cycle + Rotation + Color toggle)
            shape_cycle = rng.sample(SHAPES, 3)
            color_pair = rng.sample(COLORS, 2)
            rule_type = "shape_rotation_color_toggle"

            for i in range(4):
                sequence.append(InductiveStateItem(
                    shape=shape_cycle[i % 3],
                    color=color_pair[i % 2],
                    size="medium",
                    rotation=(i * 90) % 360,
                    count=1,
                    fill="solid"
                ))

            correct_state = InductiveStateItem(
                shape=shape_cycle[4 % 3],
                color=color_pair[4 % 2],
                size="medium",
                rotation=(4 * 90) % 360,
                count=1,
                fill="solid"
            )
            explanation = (
                "Triple Rule: Shapes cycle across 3 types, color alternates between two states, "
                "and orientation turns 90° clockwise per frame."
            )

        else:
            # Level 5: Interacting transformation (Fill pattern cycle + modular count modulation)
            shape_cycle = rng.sample(SHAPES, 3)
            rule_type = "complex_fill_count_modulation"

            for i in range(4):
                sequence.append(InductiveStateItem(
                    shape=shape_cycle[i % 3],
                    color="#121110",
                    size="medium",
                    rotation=(i * 90) % 360,
                    count=(i % 2) + 1,
                    fill=FILLS[i % len(FILLS)]
                ))

            correct_state = InductiveStateItem(
                shape=shape_cycle[4 % 3],
                color="#121110",
                size="medium",
                rotation=(4 * 90) % 360,
                count=(4 % 2) + 1,
                fill=FILLS[4 % len(FILLS)]
            )
            explanation = (
                "Complex Multi-Variable Rule: Shape advances through cycle, fill transitions "
                "[solid → outline → striped], count alternates [1 ↔ 2], and angle rotates 90°."
            )

        # Distractor generation with single-attribute mutations
        options_map: Dict[str, InductiveStateItem] = {correct_state.to_key(): correct_state}

        # D1: Wrong count
        d1 = correct_state.copy(update={"count": correct_state.count + (1 if correct_state.count < 4 else -1)})
        options_map[d1.to_key()] = d1

        # D2: Wrong shape
        other_shapes = [s for s in SHAPES if s != correct_state.shape]
        d2 = correct_state.copy(update={"shape": rng.choice(other_shapes)})
        options_map[d2.to_key()] = d2

        # D3: Wrong rotation
        other_rot = [(correct_state.rotation + 90) % 360]
        d3 = correct_state.copy(update={"rotation": other_rot[0]})
        options_map[d3.to_key()] = d3

        # D4: Wrong fill
        other_fills = [f for f in FILLS if f != correct_state.fill]
        if other_fills:
            d4 = correct_state.copy(update={"fill": rng.choice(other_fills)})
            options_map[d4.to_key()] = d4

        options_list = list(options_map.values())
        rng.shuffle(options_list)

        # Non-ambiguity verification
        matches = sum(1 for o in options_list if o.to_key() == correct_state.to_key())
        assert matches == 1, "Validation failed: Non-unique answer in Inductive generator"

        return InductiveQuestion(
            question_id=f"q-ind-{seed}",
            game_type="inductive",
            difficulty=difficulty,
            seed=seed,
            sequence=sequence,
            correct_state=correct_state,
            options=options_list,
            rule_type=rule_type,
            explanation=explanation
        )

    def initialize_state(self, question: InductiveQuestion) -> InductiveState:
        return InductiveState(selected_option_index=None, placed_state=None, is_submitted=False)

    def apply_action(self, state: InductiveState, action: GameAction, question: InductiveQuestion) -> InductiveState:
        if action.action_type == "select_option":
            idx = action.payload.get("option_index")
            if idx is not None and 0 <= idx < len(question.options):
                state.selected_option_index = idx
                state.placed_state = question.options[idx]
        elif action.action_type == "construct_state":
            item_data = action.payload.get("state") or action.payload
            if isinstance(item_data, dict):
                state.placed_state = InductiveStateItem(
                    shape=item_data.get("shape", "circle"),
                    color=item_data.get("color", "#121110"),
                    size=item_data.get("size", "medium"),
                    rotation=item_data.get("rotation", 0),
                    count=item_data.get("count", 1),
                    fill=item_data.get("fill", "solid")
                )
                state.selected_option_index = None
        elif action.action_type == "update_property":
            prop = action.payload.get("property")
            val = action.payload.get("value")
            if state.placed_state is None:
                # initialize with baseline from state 0
                first = question.sequence[0]
                state.placed_state = InductiveStateItem(
                    shape=first.shape,
                    color=first.color,
                    size=first.size,
                    rotation=first.rotation,
                    count=first.count,
                    fill=first.fill
                )
            if prop and hasattr(state.placed_state, prop):
                setattr(state.placed_state, prop, val)
                state.selected_option_index = None
        return state

    def validate_submission(self, state: InductiveState, submission: Any, question: InductiveQuestion) -> ValidationResult:
        placed = state.placed_state
        if placed is None and isinstance(submission, dict):
            placed = InductiveStateItem(**submission)

        if placed is None:
            return ValidationResult(
                is_valid=False,
                is_correct=False,
                message="No option has been selected.",
                explanation=question.explanation
            )

        is_correct = placed.to_key() == question.correct_state.to_key()
        return ValidationResult(
            is_valid=True,
            is_correct=is_correct,
            message="Correct! Predicted state satisfies the rule sequence." if is_correct else "Incorrect prediction.",
            explanation=question.explanation,
            details={"expected": question.correct_state.dict(), "placed": placed.dict()}
        )

    def is_complete(self, state: InductiveState, question: InductiveQuestion) -> bool:
        return state.placed_state is not None

    def calculate_score(self, question: InductiveQuestion, state: InductiveState, time_taken_ms: float, is_correct: bool) -> ScoreResult:
        if not is_correct:
            return ScoreResult(
                score=0,
                accuracy=0.0,
                time_taken_ms=time_taken_ms,
                difficulty=question.difficulty,
                breakdown={"correct": False}
            )

        benchmark_ms = 12000 + (question.difficulty * 3500)
        speed_factor = max(0.2, min(1.5, benchmark_ms / max(1000, time_taken_ms)))
        base_points = 50 + (question.difficulty * 10)
        final_score = int(min(100, base_points * speed_factor))

        return ScoreResult(
            score=final_score,
            accuracy=1.0,
            time_taken_ms=time_taken_ms,
            difficulty=question.difficulty,
            breakdown={"correct": True, "speed_factor": round(speed_factor, 2)}
        )
