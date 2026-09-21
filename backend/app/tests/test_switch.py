# Automated Tests for Switch Game Engine and BFS Solver
import pytest
from backend.app.engine.switch import SwitchGameEngine, SwitchDefinition, solve_switch_bfs, apply_switch
from backend.app.engine.base import GameAction

def test_switch_all_difficulty_levels_generate():
    engine = SwitchGameEngine()
    for diff in range(1, 6):
        q = engine.generate(difficulty=diff, seed=f"test-sw-{diff}")
        assert q.difficulty == diff
        assert len(q.initial_state) == q.num_positions
        assert len(q.target_state) == q.num_positions
        assert len(q.switches) >= 2
        assert q.optimal_moves > 0
        assert len(q.optimal_sequence) == q.optimal_moves

def test_switch_bfs_guarantees_solvability():
    engine = SwitchGameEngine()
    for diff in range(1, 6):
        q = engine.generate(difficulty=diff, seed=f"test-sw-solv-{diff}")
        
        # Verify BFS solver on the generated puzzle
        solution = solve_switch_bfs(q.initial_state, q.target_state, q.switches)
        assert solution is not None, f"Puzzle for difficulty {diff} is unsolveable!"
        moves, path = solution
        assert moves == q.optimal_moves
        assert len(path) == q.optimal_moves

        # Replay the solution path on initial state to ensure it lands exactly on target
        curr = list(q.initial_state)
        sw_map = {sw.id: sw for sw in q.switches}
        for sw_id in path:
            curr = apply_switch(curr, sw_map[sw_id].toggles)
        assert curr == q.target_state

def test_switch_interactive_moves_and_target_completion():
    engine = SwitchGameEngine()
    q = engine.generate(difficulty=1, seed="test-sw-interactive")
    state = engine.initialize_state(q)

    assert state.current_state == q.initial_state
    assert state.move_count == 0
    assert engine.is_complete(state, q) is False

    # Apply invalid switch ID should not crash or corrupt
    state_invalid = engine.apply_action(state, GameAction(action_type="toggle_switch", payload={"switch_id": 9999}), q)
    assert state_invalid.move_count == 0

    # Follow the optimal sequence
    curr_state = state
    for sw_id in q.optimal_sequence:
        curr_state = engine.apply_action(curr_state, GameAction(action_type="toggle_switch", payload={"switch_id": sw_id}), q)

    # Now state should match target and be marked completed
    assert curr_state.current_state == q.target_state
    assert curr_state.is_completed is True
    assert engine.is_complete(curr_state, q) is True

    # Validate submission
    val = engine.validate_submission(curr_state, None, q)
    assert val.is_valid is True
    assert val.is_correct is True

    # Test scoring: optimal efficiency should be 1.0 (100%)
    score = engine.calculate_score(q, curr_state, time_taken_ms=12500.0, is_correct=True)
    assert score.score > 0
    assert score.efficiency == 1.0
