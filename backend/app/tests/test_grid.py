# Automated Tests for Grid Engine
import pytest
from backend.app.engine.grid import GridGameEngine, GridTile
from backend.app.engine.base import GameAction

def test_grid_all_difficulty_levels_generate():
    engine = GridGameEngine()
    for diff in range(1, 6):
        q = engine.generate(difficulty=diff, seed=f"test-grid-{diff}")
        assert q.difficulty == diff
        assert len(q.matrix) == 3
        assert len(q.matrix[0]) == 3
        # Exactly one missing cell
        none_count = sum(1 for row in q.matrix for cell in row if cell is None)
        assert none_count == 1
        assert q.matrix[q.missing_row][q.missing_col] is None

def test_grid_single_unique_solution():
    engine = GridGameEngine()
    for diff in range(1, 6):
        q = engine.generate(difficulty=diff, seed=f"test-grid-uniq-{diff}")
        correct_key = q.correct_tile.to_key()
        
        # Check that exactly one option matches correct_tile
        matches = [opt for opt in q.options if opt.to_key() == correct_key]
        assert len(matches) == 1, f"Ambiguity detected in difficulty {diff}!"

        # Check options count between 4 and 6
        assert 4 <= len(q.options) <= 6

def test_grid_interactive_state_and_validation():
    engine = GridGameEngine()
    q = engine.generate(difficulty=2, seed="test-grid-state")
    state = engine.initialize_state(q)
    
    assert state.placed_tile is None
    assert engine.is_complete(state, q) is False

    # Find correct option index
    correct_idx = next(i for i, opt in enumerate(q.options) if opt.to_key() == q.correct_tile.to_key())
    
    # Apply place tile action
    state = engine.apply_action(state, GameAction(action_type="place_tile", payload={"option_index": correct_idx}), q)
    assert state.placed_tile is not None
    assert engine.is_complete(state, q) is True
    assert state.board[q.missing_row][q.missing_col] is not None

    # Validate submission
    val = engine.validate_submission(state, None, q)
    assert val.is_valid is True
    assert val.is_correct is True

    # Validate incorrect tile
    wrong_idx = (correct_idx + 1) % len(q.options)
    state = engine.apply_action(state, GameAction(action_type="place_tile", payload={"option_index": wrong_idx}), q)
    val_wrong = engine.validate_submission(state, None, q)
    assert val_wrong.is_correct is False
