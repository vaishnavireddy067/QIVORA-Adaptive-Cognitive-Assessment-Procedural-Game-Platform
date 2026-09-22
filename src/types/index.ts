export type GameId = 
  | 'inductive' 
  | 'deductive' 
  | 'grid' 
  | 'switch' 
  | 'memory' 
  | 'attention' 
  | 'reaction' 
  | 'motion'
  | 'math'
  | 'color_grid';

export type GameMode = 'tutorial' | 'practice' | 'test';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface GameMetadata {
  id: GameId;
  title: string;
  subtitle: string;
  skill: string;
  category: 'Logical Reasoning' | 'Working Memory' | 'Attention & Speed' | 'Spatial & Quantitative' | 'Executive Control';
  description: string;
  targetMetric: string;
  avgTimeSec: number;
  badgeColor: 'indigo' | 'emerald' | 'amber' | 'rose' | 'purple' | 'cyan';
  rules: string[];
  subtypes?: { name: string; description: string }[];
}

export interface GameAttempt {
  id: string;
  gameId: GameId;
  score: number;        // 0 - 100
  accuracy: number;     // 0 - 100
  speedMs: number;      // average response time in ms
  difficulty: Difficulty;
  completedAt: string;
  details?: Record<string, any>;
}

export interface AssessmentResult {
  id: string;
  overallScore: number;       // 0 - 100
  percentile: number;         // 1 - 99
  archetype: {
    title: string;
    description: string;
    traits: string[];
  };
  skillScores: Record<GameId, number>;
  strengths: { gameId: GameId; label: string; score: number }[];
  weaknesses: { gameId: GameId; label: string; score: number }[];
  recommendation: {
    gameId: GameId;
    reason: string;
    difficulty: Difficulty;
  };
  completedAt: string;
  durationMin: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  googleId?: string;
  emailVerified?: boolean;
  authProvider?: 'google' | 'guest';
  cqScore: number;
  streakDays: number;
  testsCompleted: number;
  puzzlesSolved: number;
  joinedDate: string;
  bestScores: Partial<Record<GameId, number>>;
}
