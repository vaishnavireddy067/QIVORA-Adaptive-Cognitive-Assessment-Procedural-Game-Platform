import React from 'react';
import { UserProfile, GameId } from '../types';
import { RadarChart } from '../components/charts/RadarChart';
import { GAMES_DATA } from '../engine/gamesData';
import { ArrowRight, Play, Flame, CheckCircle, TrendingUp, Sparkles, Brain } from 'lucide-react';

interface DashboardPageProps {
  user: UserProfile;
  onStartGame: (gameId: GameId) => void;
  onTakeAssessment: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ user, onStartGame, onTakeAssessment }) => {
  const scores = user.bestScores as Record<GameId, number>;
  
  // Categorize status by score threshold
  const getStatusColor = (score: number) => {
    if (score >= 80) return { icon: '🟢', color: '#10B981', label: 'Strong' };
    if (score >= 70) return { icon: '🟡', color: '#F59E0B', label: 'Moderate' };
    return { icon: '🔴', color: '#F43F5E', label: 'Improvement Area' };
  };

  const gameEntries = Object.keys(GAMES_DATA) as GameId[];

  // Find lowest scores for recommendations
  const sortedByScore = [...gameEntries].sort((a, b) => (scores[a] || 0) - (scores[b] || 0));
  const recommendedGames = sortedByScore.slice(0, 2);

  return (
    <div style={{ padding: '36px 0 60px 0' }}>
      <div className="container">
        {/* Welcome Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px', marginBottom: '36px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-indigo">Candidate Profile</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>ID: {user.id}</span>
            </div>
            <h1 style={{ fontSize: '2.4rem', fontWeight: 800 }}>Welcome back, {user.name}!</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '4px' }}>
              Your continuous cognitive training and aptitude performance overview.
            </p>
          </div>

          <button className="btn btn-emerald btn-lg" onClick={onTakeAssessment}>
            <Brain size={18} />
            <span>Launch Full Assessment</span>
          </button>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-4 gap-4" style={{ marginBottom: '32px' }}>
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Overall Cognitive Quotient
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '10px' }}>
              <span style={{ fontSize: '3rem', fontWeight: 900, color: '#F8FAFC', fontFamily: 'var(--font-mono)' }}>
                {user.cqScore}
              </span>
              <span style={{ fontSize: '1.2rem', color: 'var(--text-dim)' }}>/ 100</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#10B981', fontWeight: 700, marginTop: '4px' }}>
              Top 14% of applicants (86th percentile)
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Active Training Streak
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
              <Flame size={36} fill="#F59E0B" color="#F59E0B" />
              <span style={{ fontSize: '2.6rem', fontWeight: 900, color: '#FCD34D', fontFamily: 'var(--font-mono)' }}>
                {user.streakDays}
              </span>
              <span style={{ fontSize: '1rem', color: 'var(--text-dim)' }}>Days</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              +15% retention consistency boost
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Puzzles Solved
            </div>
            <div style={{ fontSize: '2.6rem', fontWeight: 900, color: '#A5B4FC', fontFamily: 'var(--font-mono)', marginTop: '10px' }}>
              {user.puzzlesSolved}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Across all 8 procedural games
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Completed Batteries
            </div>
            <div style={{ fontSize: '2.6rem', fontWeight: 900, color: '#6EE7B7', fontFamily: 'var(--font-mono)', marginTop: '10px' }}>
              {user.testsCompleted}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Standardized assessments
            </div>
          </div>
        </div>

        {/* Middle Section: Radar Chart & Skills Breakdown */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', marginBottom: '32px' }}>
          {/* Radar Visualization */}
          <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Cognitive Multi-Axis Profile</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Normalized against elite university and corporate cohorts</p>
              </div>
              <span className="badge badge-indigo">Dynamic Polygon</span>
            </div>
            <RadarChart scores={scores} size={360} showBenchmark={true} />
          </div>

          {/* 8 Skills Table Breakdown */}
          <div className="glass-panel" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '6px' }}>
              Detailed Competency Breakdown
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Click any dimension to jump straight into targeted practice.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {gameEntries.map(g => {
                const gameMeta = GAMES_DATA[g];
                const score = scores[g] || 0;
                const status = getStatusColor(score);

                return (
                  <div
                    key={g}
                    onClick={() => onStartGame(g)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      background: '#0B1120',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '1rem' }}>{status.icon}</span>
                      <div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#F1F5F9' }}>
                          {gameMeta.title}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                          {gameMeta.skill}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <span style={{
                        fontSize: '1rem',
                        fontWeight: 700,
                        fontFamily: 'var(--font-mono)',
                        color: status.color
                      }}>
                        {score}%
                      </span>
                      <ArrowRight size={14} color="var(--text-dim)" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recommendations Callout Banner */}
        <div className="glass-panel-glow" style={{ padding: '28px 32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <Sparkles size={18} color="#F59E0B" />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: '#FCD34D' }}>
                  Targeted Training Recommendations
                </span>
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
                Elevate your lowest percentiles for the highest overall CQ gain.
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '4px' }}>
                Based on your last test, focus specifically on <strong>Switch Game ({scores.switch}%)</strong> and <strong>Deductive Reasoning ({scores.deductive}%)</strong>.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              {recommendedGames.map(g => (
                <button
                  key={g}
                  className="btn btn-primary"
                  onClick={() => onStartGame(g)}
                >
                  <Play size={16} />
                  <span>Practice {GAMES_DATA[g].title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
