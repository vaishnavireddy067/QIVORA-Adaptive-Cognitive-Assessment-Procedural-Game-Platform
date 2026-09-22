import { UserProfile, GameAttempt, AssessmentResult, GameId } from '../types';

const USER_KEY = 'qivora_user_profile';
const ATTEMPTS_KEY = 'qivora_attempts';
const ASSESSMENTS_KEY = 'qivora_assessments';

const DEFAULT_USER: UserProfile = {
  id: 'usr_candidate_01',
  name: 'Candidate',
  email: 'candidate@qivora.io',
  cqScore: 0,
  streakDays: 0,
  testsCompleted: 0,
  puzzlesSolved: 0,
  joinedDate: 'September 2026',
  bestScores: {
    inductive: 0,
    deductive: 0,
    grid: 0,
    switch: 0,
    memory: 0,
    attention: 0,
    reaction: 0,
    math: 0
  }
};

export function getUserProfile(): UserProfile {
  const saved = localStorage.getItem(USER_KEY);
  if (!saved) {
    localStorage.setItem(USER_KEY, JSON.stringify(DEFAULT_USER));
    return DEFAULT_USER;
  }
  try {
    return JSON.parse(saved);
  } catch {
    return DEFAULT_USER;
  }
}

export function saveUserProfile(profile: UserProfile): void {
  localStorage.setItem(USER_KEY, JSON.stringify(profile));
}

export function recordGameAttempt(attempt: GameAttempt): void {
  const attempts: GameAttempt[] = getGameAttempts();
  attempts.unshift(attempt);
  localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(attempts.slice(0, 50)));

  // Update profile
  const profile = getUserProfile();
  profile.puzzlesSolved += 1;
  const currentBest = profile.bestScores[attempt.gameId] || 0;
  if (attempt.score > currentBest) {
    profile.bestScores[attempt.gameId] = attempt.score;
  }
  saveUserProfile(profile);
}

export function getGameAttempts(): GameAttempt[] {
  const saved = localStorage.getItem(ATTEMPTS_KEY);
  if (!saved) return [];
  try {
    return JSON.parse(saved);
  } catch {
    return [];
  }
}

export function recordAssessmentResult(result: AssessmentResult): void {
  const assessments: AssessmentResult[] = getAssessmentResults();
  assessments.unshift(result);
  localStorage.setItem(ASSESSMENTS_KEY, JSON.stringify(assessments.slice(0, 20)));

  // Update profile overall CQ
  const profile = getUserProfile();
  profile.testsCompleted += 1;
  profile.cqScore = result.overallScore;
  profile.bestScores = { ...profile.bestScores, ...result.skillScores };
  saveUserProfile(profile);
}

export function getAssessmentResults(): AssessmentResult[] {
  const saved = localStorage.getItem(ASSESSMENTS_KEY);
  if (!saved) return [];
  try {
    return JSON.parse(saved);
  } catch {
    return [];
  }
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  tag: string;
  score: number;
  percentile: number;
  topSkill: string;
  isCurrentUser?: boolean;
}

export function getLeaderboardData(): LeaderboardEntry[] {
  const user = getUserProfile();
  return [
    { rank: 1, name: 'Elena Rostova', avatar: '👩‍💻', tag: 'MIT / CS', score: 96, percentile: 99, topSkill: 'Working Memory' },
    { rank: 2, name: 'Marcus Sterling', avatar: '👨‍🔬', tag: 'Oxford / Physics', score: 94, percentile: 98, topSkill: 'Spatial Matrices' },
    { rank: 3, name: 'Aarav Nair', avatar: '👨‍💼', tag: 'IITB / EE', score: 92, percentile: 97, topSkill: 'Inductive Logic' },
    { rank: 4, name: `${user.name} (You)`, avatar: '🚀', tag: 'Candidate', score: user.cqScore, percentile: 86, topSkill: 'Working Memory', isCurrentUser: true },
    { rank: 5, name: 'Sophia Chen', avatar: '👩‍🎨', tag: 'Stanford / CogSci', score: 77, percentile: 84, topSkill: 'Attention Focus' },
    { rank: 6, name: 'David Kim', avatar: '👨‍💻', tag: 'Berkeley / Data', score: 75, percentile: 81, topSkill: 'Mental Math Sprint' },
    { rank: 7, name: 'Amara Okafor', avatar: '👩‍💼', tag: 'LSE / Finance', score: 73, percentile: 78, topSkill: 'Deductive Logic' },
    { rank: 8, name: 'Lucas Silva', avatar: '🧑‍💻', tag: 'Tech Candidate', score: 70, percentile: 72, topSkill: 'Switch Game' }
  ].sort((a, b) => b.score - a.score).map((entry, idx) => ({ ...entry, rank: idx + 1 }));
}
