# QIVORA Grid Game Engine
import random
from typing import Any, Dict, List, Optional, Tuple
from pydantic import BaseModel, Field
from backend.app.engine.base import GameEngine, GameAction, ValidationResult, ScoreResult

class GridTile(BaseModel):
    shape: str # "circle", "triangle", "square", "diamond", "star", "hexagon"
    color: str # "#FF3B20", "#121110", "#1D4ED8", "#15D888"
    size: str # "small", "medium", "large"
    rotation: int # 0, 90, 180, 270
    fill: str # "solid", "outline", "striped"
    count: int # 1, 2, 3
    position: str = "center"

    def to_key(self) -> str:
        return f"{self.shape}-{self.color}-{self.size}-{self.rotation}-{self.fill}-{self.count}"

class GridQuestion(BaseModel):
    question_id: str
    game_type: str = "grid"
    difficulty: int # 1 to 5
    seed: str
    matrix: List[List[Optional[GridTile]]] # 3x3 matrix, exactly one cell is None
    missing_row: int = 2
    missing_col: int = 2
    correct_tile: GridTile
    options: List[GridTile] # 4 to 6 options containing exactly one correct tile
    rule_type: str
    explanation: str

class GridState(BaseModel):
    board: List[List[Optional[GridTile]]]
    selected_option_index: Optional[int] = None
    placed_tile: Optional[GridTile] = None
    is_submitted: bool = False

SHAPES = ["circle", "triangle", "square", "diamond", "hexagon"]
COLORS = ["#121110", "#FF3B20", "#1D4ED8", "#15D888"]
SIZES = ["small", "medium", "large"]
ROTATIONS = [0, 90, 180, 270]
FILLS = ["solid", "outline", "striped"]
COUNTS = [1, 2, 3]

class GridGameEngine(GameEngine[GridState, GameAction, GridQuestion]):
    
    def generate(self, difficulty: int = 1, seed: Optional[str] = None) -> GridQuestion:
        difficulty = max(1, min(5, difficulty))
        if seed is None:
            seed = f"grid-{difficulty}-{random.randint(100000, 999999)}"
        rng = random.Random(seed)

        matrix: List[List[Optional[GridTile]]] = [[None for _ in range(3)] for _ in range(3)]
        rule_type = "single_shape_progression"
        explanation = ""

        if difficulty == 1:
            # Level 1: Single property shape progression across rows (Latin Square)
            # Row 0: A, B, C; Row 1: B, C, A; Row 2: C, A, B
            chosen_shapes = rng.sample(SHAPES, 3)
            color = rng.choice(COLORS)
            fill = "solid"
            rule_type = "latin_square_shapes"
            
            for r in range(3):
                for c in range(3):
                    shape_idx = (r + c) % 3
                    matrix[r][c] = GridTile(
                        shape=chosen_shapes[shape_idx],
                        color=color,
                        size="medium",
                        rotation=0,
                        fill=fill,
                        count=1
                    )
            explanation = (
                f"Each row and column contains exactly one of each shape ({chosen_shapes[0]}, "
                f"{chosen_shapes[1]}, {chosen_shapes[2]}). Row 3 is missing {chosen_shapes[(2+2)%3]}."
            )

        elif difficulty == 2:
            # Level 2: Rotation progression (+90 deg across columns)
            shape = rng.choice(SHAPES)
            color = rng.choice(COLORS)
            base_rot = rng.choice([0, 90])
            rule_type = "rotation_progression"

            for r in range(3):
                for c in range(3):
                    rot = (base_rot + (r * 90) + (c * 90)) % 360
                    matrix[r][c] = GridTile(
                        shape=shape,
                        color=color,
                        size="medium",
                        rotation=rot,
                        fill="solid",
                        count=1
                    )
            explanation = (
                "Each tile rotates 90° clockwise horizontally across rows and vertically across columns. "
                "The missing tile completes this rotation."
            )

        elif difficulty == 3:
            # Level 3: Dual simultaneous properties (Shape cycling + Count increment)
            chosen_shapes = rng.sample(SHAPES, 3)
            color = rng.choice(COLORS)
            rule_type = "shape_cycle_and_count"

            for r in range(3):
                for c in range(3):
                    matrix[r][c] = GridTile(
                        shape=chosen_shapes[(r + c) % 3],
                        color=color,
                        size="medium",
                        rotation=0,
                        fill="solid",
                        count=c + 1
                    )
            explanation = (
                f"Shapes cycle diagonally across the matrix, while element count increases from 1 to 3 "
                f"across every row. The missing cell requires {chosen_shapes[(2+2)%3]} with count 3."
            )

        elif difficulty == 4:
            # Level 4: Row + column interaction (Latin square shapes + Fill alternation)
            chosen_shapes = rng.sample(SHAPES, 3)
            chosen_fills = ["solid", "outline", "striped"]
            color = rng.choice(COLORS)
            rule_type = "shape_latin_square_and_fill_cycling"

            for r in range(3):
                for c in range(3):
                    matrix[r][c] = GridTile(
                        shape=chosen_shapes[(r + c) % 3],
                        color=color,
                        size="medium",
                        rotation=0,
                        fill=chosen_fills[c % 3],
                        count=1
                    )
            explanation = (
                "Shapes shift cyclically according to a Latin square, while the fill pattern "
                "cycles [solid, outline, striped] across columns. The missing cell requires "
                f"{chosen_shapes[(2+2)%3]} with {chosen_fills[2]} fill."
            )

        else:
            # Level 5: Complex multi-property interaction (Shape + Fill + 90 deg rotation per row)
            chosen_shapes = rng.sample(SHAPES, 3)
            chosen_fills = ["solid", "outline", "striped"]
            color = rng.choice(COLORS)
            rule_type = "multi_property_latin_rotation"

            for r in range(3):
                for c in range(3):
                    matrix[r][c] = GridTile(
                        shape=chosen_shapes[(r + c) % 3],
                        color=color,
                        size="medium",
                        rotation=(r * 90) % 360,
                        fill=chosen_fills[c % 3],
                        count=1
                    )
            explanation = (
                "Row progression rotates shapes by +90° per row, columns alternate fill patterns, "
                "and shapes cycle cyclically. The missing tile requires the final rotation and fill combination."
            )

        # The missing tile is at bottom right (2, 2)
        correct_tile = matrix[2][2].copy()
        matrix[2][2] = None

        # Generate 4 to 5 high-quality distractors mutating exactly 1 or 2 attributes
        options_map: Dict[str, GridTile] = {correct_tile.to_key(): correct_tile}
        
        # Distractor 1: Wrong shape, same other properties
        other_shapes = [s for s in SHAPES if s != correct_tile.shape]
        d1 = correct_tile.copy(update={"shape": rng.choice(other_shapes)})
        options_map[d1.to_key()] = d1

        # Distractor 2: Correct shape, wrong count
        other_counts = [cnt for cnt in COUNTS if cnt != correct_tile.count]
        d2 = correct_tile.copy(update={"count": rng.choice(other_counts)})
        options_map[d2.to_key()] = d2

        # Distractor 3: Correct shape, wrong rotation
        other_rotations = [rot for rot in ROTATIONS if rot != correct_tile.rotation]
        d3 = correct_tile.copy(update={"rotation": rng.choice(other_rotations)})
        options_map[d3.to_key()] = d3

        # Distractor 4: Correct shape, wrong fill
        other_fills = [f for f in FILLS if f != correct_tile.fill]
        d4 = correct_tile.copy(update={"fill": rng.choice(other_fills)})
        options_map[d4.to_key()] = d4

        # Validate that only ONE tile matches the logical ground truth
        options_list = list(options_map.values())
        rng.shuffle(options_list)

        # Internal validation check
        matching_count = sum(1 for opt in options_list if opt.to_key() == correct_tile.to_key())
        assert matching_count == 1, "Validation failed: Non-unique solution in Grid generator"

        return GridQuestion(
            question_id=f"q-grid-{seed}",
            game_type="grid",
            difficulty=difficulty,
            seed=seed,
            matrix=matrix,
            missing_row=2,
            missing_col=2,
            correct_tile=correct_tile,
            options=options_list,
            rule_type=rule_type,
            explanation=explanation
        )

    def initialize_state(self, question: GridQuestion) -> GridState:
        return GridState(
            board=[[tile.copy() if tile else None for tile in row] for row in question.matrix],
            selected_option_index=None,
            placed_tile=None,
            is_submitted=False
        )

    def apply_action(self, state: GridState, action: GameAction, question: GridQuestion) -> GridState:
        action_type = action.action_type
        payload = action.payload

        if action_type == "place_tile":
            option_index = payload.get("option_index")
            if option_index is not None and 0 <= option_index < len(question.options):
                placed = question.options[option_index]
                state.selected_option_index = option_index
                state.placed_tile = placed
                state.board[question.missing_row][question.missing_col] = placed
        elif action_type == "remove_tile":
            state.selected_option_index = None
            state.placed_tile = None
            state.board[question.missing_row][question.missing_col] = None
        
        return state

    def validate_submission(self, state: GridState, submission: Any, question: GridQuestion) -> ValidationResult:
        placed = state.placed_tile
        if placed is None and isinstance(submission, dict):
            placed = GridTile(**submission)

        if placed is None:
            return ValidationResult(
                is_valid=False,
                is_correct=False,
                message="No tile has been placed in the missing cell.",
                explanation=question.explanation
            )

        is_correct = placed.to_key() == question.correct_tile.to_key()
        return ValidationResult(
            is_valid=True,
            is_correct=is_correct,
            message="Correct! The pattern is satisfied." if is_correct else "Incorrect tile placed.",
            explanation=question.explanation,
            details={"expected": question.correct_tile.dict(), "placed": placed.dict()}
        )

    def is_complete(self, state: GridState, question: GridQuestion) -> bool:
        return state.placed_tile is not None

    def calculate_score(self, question: GridQuestion, state: GridState, time_taken_ms: float, is_correct: bool) -> ScoreResult:
        if not is_correct:
            return ScoreResult(
                score=0,
                accuracy=0.0,
                time_taken_ms=time_taken_ms,
                difficulty=question.difficulty,
                breakdown={"correct": False, "speed_bonus": 0}
            )
        
        # Benchmark time per difficulty (e.g. 15s to 30s)
        benchmark_ms = 15000 + (question.difficulty * 4000)
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
