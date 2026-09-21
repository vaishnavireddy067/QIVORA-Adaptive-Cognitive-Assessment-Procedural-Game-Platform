// QIVORA Authoritative Backend API Client
const API_BASE_URL = 'http://127.0.0.1:8001/api';

export interface BackendGameSessionResponse {
  session_id: string;
  game_type: string;
  mode: string;
  difficulty: number;
  question: any;
  state: any;
  is_completed: boolean;
}

export interface BackendActionResponse {
  session_id: string;
  state: any;
  is_completed: boolean;
}

export interface BackendSubmissionResponse {
  session_id: string;
  validation: {
    is_valid: boolean;
    is_correct: boolean;
    message?: string;
    explanation?: string;
    details?: any;
  };
  score: {
    score: number;
    accuracy: number;
    speed_factor: number;
    efficiency?: number;
    time_taken_ms: number;
  };
  next_difficulty: number;
  is_completed: boolean;
}

export interface BackendSessionResult {
  session_id: string;
  mode: string;
  overall_score: number;
  profile: {
    total_completed: number;
    accuracy: number;
    speed_tier: string;
    efficiency_rating: string;
    headline: string;
    strength: string;
    growth_edge: string;
    next_recommendation: string;
  };
  attempts: any[];
}

export class QivoraApiClient {
  private static isServerAvailable: boolean | null = null;

  static async isAvailable(): Promise<boolean> {
    try {
      const res = await fetch('http://127.0.0.1:8001/health', { method: 'GET', signal: AbortSignal.timeout(1500) });
      QivoraApiClient.isServerAvailable = res.ok;
      return res.ok;
    } catch {
      QivoraApiClient.isServerAvailable = false;
      return false;
    }
  }

  static async startGame(
    gameType: 'grid' | 'inductive' | 'switch',
    difficulty: number = 1,
    mode: 'demo' | 'guided' | 'practice' | 'test' = 'practice',
    seed?: string
  ): Promise<BackendGameSessionResponse | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/games/${gameType}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ game_type: gameType, difficulty, mode, seed }),
        signal: AbortSignal.timeout(3000)
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      console.warn('Backend API startGame fallback to local:', e);
      return null;
    }
  }

  static async submitAction(
    gameType: 'grid' | 'inductive' | 'switch',
    sessionId: string,
    actionType: string,
    payload: Record<string, any> = {}
  ): Promise<BackendActionResponse | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/games/${gameType}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, action_type: actionType, payload }),
        signal: AbortSignal.timeout(3000)
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      console.warn('Backend API submitAction error:', e);
      return null;
    }
  }

  static async submitAnswer(
    gameType: 'grid' | 'inductive' | 'switch',
    sessionId: string,
    submission: any,
    timeTakenMs: number
  ): Promise<BackendSubmissionResponse | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/games/${gameType}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, submission, time_taken_ms: timeTakenMs }),
        signal: AbortSignal.timeout(3000)
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      console.warn('Backend API submitAnswer error:', e);
      return null;
    }
  }

  static async createSession(mode: 'practice' | 'test', gameTypes: string[]): Promise<string | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/sessions/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode, game_types: gameTypes }),
        signal: AbortSignal.timeout(3000)
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.session_id;
    } catch (e) {
      console.warn('Backend API createSession error:', e);
      return null;
    }
  }

  static async recordAttempt(
    sessionId: string,
    attempt: {
      game_type: string;
      difficulty: number;
      is_correct: boolean;
      time_taken_ms: number;
      efficiency?: number;
      details?: Record<string, any>;
    }
  ): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/sessions/${sessionId}/attempt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(attempt),
        signal: AbortSignal.timeout(3000)
      });
      return res.ok;
    } catch (e) {
      console.warn('Backend API recordAttempt error:', e);
      return false;
    }
  }

  static async getResults(sessionId: string): Promise<BackendSessionResult | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/results/${sessionId}`, {
        method: 'GET',
        signal: AbortSignal.timeout(3000)
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      console.warn('Backend API getResults error:', e);
      return null;
    }
  }
}
