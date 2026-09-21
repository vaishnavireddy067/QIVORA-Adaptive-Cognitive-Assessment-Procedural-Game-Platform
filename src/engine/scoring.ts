import { GameId, AssessmentResult, Difficulty } from '../types';

export function calculateTriFactorScore(
  accuracyPercent: number,
  avgResponseTimeMs: number,
  benchmarkMs: number,
  difficulty: Difficulty
): { finalScore: number; accuracyScore: number; speedScore: number; difficultyScore: number } {
  // 1. Accuracy Component (0 - 100)
  const accuracyScore = Math.max(0, Math.min(100, Math.round(accuracyPercent)));

  // 2. Speed Component (0 - 100)
  // Ratio of speed relative to benchmark ceiling
  const speedRatio = Math.max(0.1, Math.min(1.5, avgResponseTimeMs / benchmarkMs));
  const speedScore = Math.max(10, Math.min(100, Math.round(100 - (speedRatio - 0.2) * 65)));

  // 3. Difficulty Component (Easy = 70, Med = 85, Hard = 100)
  const difficultyScore = difficulty === 'easy' ? 70 : difficulty === 'medium' ? 85 : 100;

  // Tri-factor weighting: 50% Accuracy, 30% Speed, 20% Difficulty
  const finalScore = Math.round(
    accuracyScore * 0.50 +
    speedScore * 0.30 +
    difficultyScore * 0.20
  );

  return {
    finalScore: Math.max(5, Math.min(100, finalScore)),
    accuracyScore,
    speedScore,
    difficultyScore
  };
}

// Gaussian percentile approximation
export function calculatePercentile(score: number): number {
  const mean = 62;
  const stdDev = 14;
  const z = (score - mean) / stdDev;
  
  // Standard normal cumulative distribution approximation
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp(-z * z / 2);
  const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  const cdf = z > 0 ? 1 - p : p;
  
  return Math.max(1, Math.min(99, Math.round(cdf * 100)));
}

export function determineArchetype(scores: Record<GameId, number>): AssessmentResult['archetype'] {
  const avg = Object.values(scores).reduce((a, b) => a + b, 0) / 8;
  const spatialMem = (scores.grid + scores.memory) / 2;
  const logical = (scores.inductive + scores.deductive) / 2;
  const agile = (scores.switch + scores.attention) / 2;
  const quantitative = (scores.reaction + scores.math) / 2;

  if (spatialMem > avg + 4 && spatialMem >= logical) {
    return {
      title: 'Systems Architect',
      description: 'Exceptional spatial modeling, working memory capacity, and holistic mental representation.',
      traits: ['High Spatial Matrix Precision', 'Resilient Working Memory', 'Multi-Component Visualization']
    };
  }

  if (logical > avg + 4 && logical >= spatialMem) {
    return {
      title: 'Strategic Analyst',
      description: 'Superior pattern extrapolation, syllogistic clarity, and formal deductive rigor.',
      traits: ['Rapid Pattern Extraction', 'Formal Logic Mastery', 'Low Fallacy Susceptibility']
    };
  }

  if (agile > avg + 4) {
    return {
      title: 'Agile Synthesizer',
      description: 'High cognitive flexibility under changing rules, paired with sharp visual discrimination.',
      traits: ['Fluid State Switching', 'High-Speed Anomaly Detection', 'Rapid Task Re-orientation']
    };
  }

  if (quantitative > avg + 4) {
    return {
      title: 'Tactical Quant',
      description: 'Ultra-fast neuromotor reaction response paired with high working arithmetic throughput.',
      traits: ['Sub-250ms Reaction Speed', 'Mental Arithmetic Fluency', 'Tight Motor Inhibition']
    };
  }

  return {
    title: 'Balanced Polymath',
    description: 'Well-rounded cognitive baseline showing harmonious equilibrium across speed, memory, and reasoning.',
    traits: ['Equilibrium across Dimensions', 'Adaptable Cognitive Strategy', 'Consistent Performance Profile']
  };
}

export function rankStrengthsAndWeaknesses(scores: Record<GameId, number>): {
  strengths: { gameId: GameId; label: string; score: number }[];
  weaknesses: { gameId: GameId; label: string; score: number }[];
  recommendation: { gameId: GameId; reason: string; difficulty: Difficulty };
} {
  const labels: Record<GameId, string> = {
    inductive: 'Inductive Patterns',
    deductive: 'Deductive Logic',
    grid: 'Spatial Matrices',
    switch: 'Cognitive Flexibility',
    memory: 'Working Memory',
    attention: 'Visual Attention',
    reaction: 'Reaction & Inhibition',
    math: 'Mental Math Sprint',
    motion: 'Motion & Prediction',
    color_grid: 'Color the Grid Challenge'
  };

  const sorted = (Object.keys(scores) as GameId[])
    .map(g => ({ gameId: g, label: labels[g], score: scores[g] }))
    .sort((a, b) => b.score - a.score);

  const strengths = sorted.slice(0, 3);
  const weaknesses = sorted.slice(-2).reverse();

  const lowest = weaknesses[0];
  const recDifficulty: Difficulty = lowest.score < 50 ? 'easy' : lowest.score < 75 ? 'medium' : 'hard';

  return {
    strengths,
    weaknesses,
    recommendation: {
      gameId: lowest.gameId,
      reason: `Your score in ${lowest.label} (${lowest.score}%) presents your greatest growth potential. Practicing this game will elevate your overall Cognitive Quotient.`,
      difficulty: recDifficulty
    }
  };
}
