# Automated Tests for Inductive Reasoning Engine
import pytest
from backend.app.engine.inductive import InductiveGameEngine, InductiveStateItem
from backend.app.engine.base import GameAction

def test_inductive_all_difficulty_levels_generate():
    engine = InductiveGameEngine()
    for diff in range(1, 6):
        q = engine.generate(difficulty=diff, seed=f"test-ind-{diff}")
        assert q.difficulty == diff
        assert len(q.sequence) >= 3
        assert q.correct_state is not None
        assert len(q.options) >= 4
        assert q.rule_type != ""

def test_inductive_single_unique_solution():
    engine = InductiveGameEngine()
    for diff in range(1, 6):
        q = engine.generate(difficulty=diff, seed=f"test-ind-uniq-{diff}")
        correct_key = q.correct_state.to_key()

        # Check that exactly one option matches correct_state
        matches = [opt for opt in q.options if opt.to_key() == correct_key]
        assert len(matches) == 1, f"Ambiguity or missing correct answer in difficulty {diff}!"

        # Ensure distractors are not duplicate of each other
        option_keys = [opt.to_key() for opt in q.options]
        assert len(option_keys) == len(set(option_keys)), f"Duplicate distractors generated in difficulty {diff}!"

def test_inductive_interactive_action_and_validation():
    engine = InductiveGameEngine()
    q = engine.generate(difficulty=2, seed="test-ind-state")
    state = engine.initialize_state(q)

    assert state.selected_option_index is None
    assert state.placed_state is None
    assert engine.is_complete(state, q) is False

    # Find correct option index
    correct_idx = next(i for i, opt in enumerate(q.options) if opt.to_key() == q.correct_state.to_key())

    # Apply select option action
    state = engine.apply_action(state, GameAction(action_type="select_option", payload={"option_index": correct_idx}), q)
    assert state.selected_option_index == correct_idx
    assert state.placed_state is not None
    assert engine.is_complete(state, q) is True

    # Validate correct submission
    val = engine.validate_submission(state, None, q)
    assert val.is_valid is True
    assert val.is_correct is True

    # Test incorrect submission
    wrong_idx = (correct_idx + 1) % len(q.options)
    state = engine.apply_action(state, GameAction(action_type="select_option", payload={"option_index": wrong_idx}), q)
    val_wrong = engine.validate_submission(state, None, q)
    assert val_wrong.is_correct is False
