# QIVORA Switch Game Engine
import random
from collections import deque
from typing import Any, Dict, List, Optional, Tuple
from pydantic import BaseModel, Field
from backend.app.engine.base import GameEngine, GameAction, ValidationResult, ScoreResult

class SwitchDefinition(BaseModel):
    id: int
    label: str # "A", "B", "C", "D", "E"
    toggles: List[int] # 0-indexed positions affected

class SwitchQuestion(BaseModel):
    question_id: str
    game_type: str = "switch"
    difficulty: int
    seed: str
    num_positions: int
    initial_state: List[bool]
    target_state: List[bool]
    switches: List[SwitchDefinition]
    optimal_moves: int
    optimal_sequence: List[int] # list of switch IDs
    explanation: str

class SwitchState(BaseModel):
    current_state: List[bool]
    move_count: int = 0
    move_history: List[int] = Field(default_factory=list)
    is_completed: bool = False

def state_to_key(state: List[bool]) -> str:
    return "".join("1" if b else "0" for b in state)

def apply_switch(state: List[bool], toggles: List[int]) -> List[bool]:
    nxt = list(state)
    for idx in toggles:
        if 0 <= idx < len(nxt):
            nxt[idx] = not nxt[idx]
    return nxt

def solve_switch_bfs(
    initial_state: List[bool],
    target_state: List[bool],
    switches: List[SwitchDefinition]
) -> Optional[Tuple[int, List[int]]]:
    """Runs standard Breadth-First Search on state-space graph to guarantee minimum moves."""
    start_key = state_to_key(initial_state)
    target_key = state_to_key(target_state)

    if start_key == target_key:
        return 0, []

    queue = deque([(initial_state, [])])
    visited = {start_key}

    while queue:
        curr_state, path = queue.popleft()

        for sw in switches:
            next_state = apply_switch(curr_state, sw.toggles)
            next_key = state_to_key(next_state)

            if next_key == target_key:
                return len(path) + 1, path + [sw.id]

            if next_key not in visited:
                visited.add(next_key)
                queue.push((next_state, path + [sw.id])) if hasattr(queue, "push") else queue.append((next_state, path + [sw.id]))

    return None

class SwitchGameEngine(GameEngine[SwitchState, GameAction, SwitchQuestion]):

    def generate(self, difficulty: int = 1, seed: Optional[str] = None) -> SwitchQuestion:
        difficulty = max(1, min(5, difficulty))
        if seed is None:
            seed = f"switch-{difficulty}-{random.randint(100000, 999999)}"
        rng = random.Random(seed)

        num_positions = 3 if difficulty == 1 else 4 if difficulty == 2 else 5 if difficulty == 3 else 6
        num_switches = 2 if difficulty == 1 else 3 if difficulty == 2 else 4 if difficulty == 3 else 5
        target_min_moves = 2 if difficulty == 1 else 3 if difficulty == 2 else 4 if difficulty <= 4 else 5

        # Switch toggle presets ensuring rich overlapping interdependencies
        switch_presets: Dict[int, List[List[int]]] = {
            3: [[0, 1], [1, 2], [0, 2]],
            4: [[0, 1], [1, 2], [2, 3], [0, 3]],
            5: [[0, 1], [1, 2, 3], [2, 4], [0, 3, 4], [1, 4]],
            6: [[0, 1, 2], [1, 3], [2, 4, 5], [0, 3, 5], [1, 4, 5]]
        }

        chosen_toggles = switch_presets[num_positions][:num_switches]
        labels = ["A", "B", "C", "D", "E"]
        switches = [
            SwitchDefinition(id=i, label=labels[i], toggles=chosen_toggles[i])
            for i in range(num_switches)
        ]

        # Generate random start state
        initial_state = [rng.choice([True, False]) for _ in range(num_positions)]

        # Run BFS exploration to collect all reachable states and choose a target at target_min_moves
        queue = deque([(initial_state, [])])
        visited: Dict[str, List[int]] = {state_to_key(initial_state): []}
        depth_map: Dict[int, List[Tuple[List[bool], List[int]]]] = {}

        while queue:
            curr, path = queue.popleft()
            depth = len(path)
            if depth not in depth_map:
                depth_map[depth] = []
            depth_map[depth].append((curr, path))

            if depth >= target_min_moves + 1:
                continue

            for sw in switches:
                nxt = apply_switch(curr, sw.toggles)
                nxt_key = state_to_key(nxt)
                if nxt_key not in visited:
                    visited[nxt_key] = path + [sw.id]
                    queue.append((nxt, path + [sw.id]))

        # Pick candidate target at target depth
        candidates = depth_map.get(target_min_moves, [])
        if not candidates:
            # Fallback to deepest reachable
            max_depth = max(depth_map.keys())
            candidates = depth_map[max_depth]

        target_state, optimal_sequence = rng.choice(candidates)

        # Authoritative BFS verification to guarantee exact minimal moves
        bfs_solution = solve_switch_bfs(initial_state, target_state, switches)
        assert bfs_solution is not None, "BFS verification failed: Puzzle has no valid solution!"
        optimal_moves, verified_sequence = bfs_solution

        switch_desc = ", ".join(f"Switch {s.label} affects [{', '.join(str(p+1) for p in s.toggles)}]" for s in switches)
        seq_labels = " → ".join(f"Switch {labels[idx]}" for idx in verified_sequence)
        explanation = f"Optimal solution requires {optimal_moves} moves: {seq_labels}. Configurations: {switch_desc}."

        return SwitchQuestion(
            question_id=f"q-sw-{seed}",
            game_type="switch",
            difficulty=difficulty,
            seed=seed,
            num_positions=num_positions,
            initial_state=initial_state,
            target_state=target_state,
            switches=switches,
            optimal_moves=optimal_moves,
            optimal_sequence=verified_sequence,
            explanation=explanation
        )

    def initialize_state(self, question: SwitchQuestion) -> SwitchState:
        return SwitchState(
            current_state=list(question.initial_state),
            move_count=0,
            move_history=[],
            is_completed=question.initial_state == question.target_state
        )

    def apply_action(self, state: SwitchState, action: GameAction, question: SwitchQuestion) -> SwitchState:
        action_type = action.action_type
        payload = action.payload

        if action_type == "toggle_switch":
            switch_id = payload.get("switch_id")
            if switch_id is not None and 0 <= switch_id < len(question.switches):
                sw = question.switches[switch_id]
                state.current_state = apply_switch(state.current_state, sw.toggles)
                state.move_count += 1
                state.move_history.append(switch_id)
                state.is_completed = state.current_state == question.target_state
        elif action_type == "reset_board":
            state.current_state = list(question.initial_state)
            state.move_count = 0
            state.move_history = []
            state.is_completed = False

        return state

    def validate_submission(self, state: SwitchState, submission: Any, question: SwitchQuestion) -> ValidationResult:
        is_target_reached = state.current_state == question.target_state
        efficiency = round(question.optimal_moves / max(1, state.move_count), 2) if state.move_count > 0 else 0.0

        if not is_target_reached:
            return ValidationResult(
                is_valid=True,
                is_correct=False,
                message="Target state has not been reached.",
                explanation=question.explanation,
                details={"current": state.current_state, "target": question.target_state}
            )

        is_optimal = state.move_count == question.optimal_moves
        msg = f"Target matched in {state.move_count} moves! Perfect optimality (100%)." if is_optimal else f"Target matched in {state.move_count} moves (optimal was {question.optimal_moves} moves)."

        return ValidationResult(
            is_valid=True,
            is_correct=True,
            message=msg,
            explanation=question.explanation,
            details={
                "move_count": state.move_count,
                "optimal_moves": question.optimal_moves,
                "efficiency": efficiency
            }
        )

    def is_complete(self, state: SwitchState, question: SwitchQuestion) -> bool:
        return state.current_state == question.target_state

    def calculate_score(self, question: SwitchQuestion, state: SwitchState, time_taken_ms: float, is_correct: bool) -> ScoreResult:
        if not is_correct:
            return ScoreResult(
                score=0,
                accuracy=0.0,
                time_taken_ms=time_taken_ms,
                difficulty=question.difficulty,
                efficiency=0.0,
                breakdown={"correct": False}
            )

        efficiency = min(1.0, question.optimal_moves / max(1, state.move_count))
        benchmark_ms = 15000 + (question.difficulty * 4000)
        speed_factor = max(0.2, min(1.3, benchmark_ms / max(1000, time_taken_ms)))
        
        # Weighted: 50% Efficiency, 30% Speed, 20% Difficulty
        score = int((efficiency * 50) + (speed_factor * 30) + (question.difficulty * 4))
        final_score = max(10, min(100, score))

        return ScoreResult(
            score=final_score,
            accuracy=1.0,
            time_taken_ms=time_taken_ms,
            difficulty=question.difficulty,
            efficiency=round(efficiency, 2),
            breakdown={"efficiency": round(efficiency, 2), "speed_factor": round(speed_factor, 2)}
        )
