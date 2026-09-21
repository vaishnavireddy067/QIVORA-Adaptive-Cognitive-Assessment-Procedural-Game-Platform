# Automated Tests for FastAPI Endpoints
import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_health_endpoint():
    res = client.get("/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "active"

def test_game_start_and_answer_stripping_in_test_mode():
    # Test mode: sensitive answer keys MUST be stripped
    res = client.post("/api/games/grid/start", json={"difficulty": 2, "mode": "test"})
    assert res.status_code == 200
    data = res.json()
    q = data["question"]
    assert "correct_tile" not in q
    assert "explanation" not in q
    assert len(q["options"]) >= 4

    # Practice mode: explanation and answers may be preserved or revealed on submit
    res_prac = client.post("/api/games/grid/start", json={"difficulty": 2, "mode": "practice"})
    assert res_prac.status_code == 200

def test_switch_api_flow():
    # Start switch game
    res = client.post("/api/games/switch/start", json={"difficulty": 1, "mode": "practice"})
    assert res.status_code == 200
    data = res.json()
    sess_id = data["session_id"]
    q = data["question"]
    assert len(q["switches"]) >= 2
    sw_0 = q["switches"][0]

    # Perform action: toggle switch
    res_act = client.post("/api/games/switch/action", json={
        "session_id": sess_id,
        "action_type": "toggle_switch",
        "payload": {"switch_id": sw_0["id"]}
    })
    assert res_act.status_code == 200
    act_data = res_act.json()
    assert act_data["state"]["move_count"] == 1

    # Submit answer
    res_sub = client.post("/api/games/switch/submit", json={
        "session_id": sess_id,
        "time_taken_ms": 5200.0
    })
    assert res_sub.status_code == 200
    sub_data = res_sub.json()
    assert "score" in sub_data
    assert "next_difficulty" in sub_data

def test_inductive_api_flow():
    res = client.post("/api/games/inductive/start", json={"difficulty": 1, "mode": "practice"})
    assert res.status_code == 200
    data = res.json()
    sess_id = data["session_id"]

    # Select option 0
    res_act = client.post("/api/games/inductive/action", json={
        "session_id": sess_id,
        "action_type": "select_option",
        "payload": {"option_index": 0}
    })
    assert res_act.status_code == 200

    # Submit
    res_sub = client.post("/api/games/inductive/submit", json={
        "session_id": sess_id,
        "time_taken_ms": 3100.0
    })
    assert res_sub.status_code == 200
    sub_data = res_sub.json()
    assert "validation" in sub_data
    assert "is_correct" in sub_data["validation"]

def test_session_lifecycle_and_results():
    # Create practice session
    res = client.post("/api/sessions/practice", json={"game_types": ["grid", "switch"]})
    assert res.status_code == 200
    sess_data = res.json()
    sess_id = sess_data["session_id"]

    # Record attempt
    res_rec = client.post(f"/api/sessions/{sess_id}/attempt", json={
        "game_type": "grid",
        "difficulty": 2,
        "is_correct": True,
        "time_taken_ms": 4200.0,
        "efficiency": 1.0,
        "details": {}
    })
    assert res_rec.status_code == 200

    # Fetch result
    res_res = client.get(f"/api/results/{sess_id}")
    assert res_res.status_code == 200
    result_data = res_res.json()
    assert result_data["overall_score"] == 100
    assert "profile" in result_data
    assert "headline" in result_data["profile"]
