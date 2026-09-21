import React from 'react';
import { ArrowRight, CheckCircle2, Circle, Flame, Sparkles } from 'lucide-react';
import { GameId } from '../types';

interface JourneyPageProps {
  onPlayGame: (gameId: GameId) => void;
}

interface Milestone {
  id: string;
  timeframe: string;
  title: string;
  story: string;
  status: 'completed' | 'current' | 'upcoming';
  gameId?: GameId;
  badge?: string;
}

export const JourneyPage: React.FC<JourneyPageProps> = ({ onPlayGame }) => {
  const milestones: Milestone[] = [
    {
      id: 'm1',
      timeframe: '3 weeks ago',
      title: 'First Ignition: Switch Beginner',
      story: 'Discovered multi-point state transitions and completed the first untimed sandbox puzzles.',
      status: 'completed',
      badge: 'Level 1'
    },
    {
      id: 'm2',
      timeframe: '2 weeks ago',
      title: 'Matrix Spatial Mastery',
      story: 'Decoded Raven-style progressive transformations across Latin-square shape variations.',
      status: 'completed',
      badge: 'Level 2'
    },
    {
      id: 'm3',
      timeframe: 'Last week',
      title: 'Working Memory Span Expanded',
      story: 'Advanced from 3-node spatial retention to 6-element delayed recall matrix precision.',
      status: 'completed',
      badge: 'Level 3'
    },
    {
      id: 'm4',
      timeframe: 'Today',
      title: 'Switch Advanced: Shortest-Path Discovery',
      story: 'Achieved near-optimal move counts across interconnected 4-switch bitmask graphs.',
      status: 'current',
      gameId: 'switch',
      badge: 'CURRENT LEVEL'
    },
    {
      id: 'm5',
      timeframe: 'Next Move',
      title: 'Expert Assessment Battery',
      story: 'Benchmark your expanded cognitive flexibility in a standardized 18-minute evaluation.',
      status: 'upcoming',
      badge: 'NEXT CHALLENGE'
    }
  ];

  return (
    <div style={{ padding: '56px 0 90px 0' }}>
      <div className="container-narrow">
        {/* Header */}
        <div style={{ marginBottom: '48px' }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem',
            fontWeight: 900,
            color: 'var(--accent-vermillion)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em'
          }}>
            PROGRESSION ROADMAP // COGNITIVE PATH
          </span>
          <h1 className="poster-headline" style={{
            fontSize: 'clamp(3rem, 6.5vw, 5.2rem)',
            marginTop: '8px'
          }}>
            YOUR JOURNEY.
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginTop: '10px', fontWeight: 500 }}>
            Storytelling your cognitive evolution through game-like milestones.
          </p>
        </div>

        {/* Visual Path Flow */}
        <div style={{ position: 'relative', paddingLeft: '40px' }}>
          {/* Vertical Connecting Line */}
          <div style={{
            position: 'absolute',
            left: '19px',
            top: '20px',
            bottom: '20px',
            width: '3px',
            background: 'var(--border-ink)'
          }} />

          {/* Milestones */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {milestones.map((m, idx) => {
              const isCurrent = m.status === 'current';
              const isCompleted = m.status === 'completed';

              return (
                <div key={m.id} style={{ position: 'relative' }}>
                  {/* Node Pin on the line */}
                  <div style={{
                    position: 'absolute',
                    left: '-40px',
                    top: '24px',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: isCurrent ? 'var(--accent-vermillion)' : isCompleted ? 'var(--accent-mint)' : 'var(--bg-cream)',
                    border: '2px solid var(--border-ink)',
                    boxShadow: 'var(--shadow-tactile-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isCurrent ? '#FFF' : '#141312',
                    fontWeight: 800,
                    zIndex: 2
                  }}>
                    {isCompleted ? '✓' : isCurrent ? '★' : idx + 1}
                  </div>

                  {/* Milestone Card */}
                  <div
                    className="editorial-tile"
                    style={{
                      padding: '28px 32px',
                      background: isCurrent ? 'var(--bg-surface)' : '#FFFFFF',
                      border: isCurrent ? '2.5px solid var(--accent-vermillion)' : '2px solid var(--border-ink)',
                      boxShadow: isCurrent ? '6px 6px 0px #FF432A' : 'var(--shadow-tactile)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        color: isCurrent ? 'var(--accent-vermillion)' : 'var(--text-muted)'
                      }}>
                        {m.timeframe}
                      </span>
                      {m.badge && (
                        <span
                          className="btn-pill-small"
                          style={{
                            background: isCurrent ? 'var(--accent-vermillion)' : 'var(--bg-cream)',
                            color: isCurrent ? '#FFFFFF' : 'var(--text-primary)',
                            fontSize: '0.75rem'
                          }}
                        >
                          {m.badge}
                        </span>
                      )}
                    </div>

                    <h3 style={{ fontSize: '1.45rem', fontWeight: 850, color: 'var(--text-primary)' }}>
                      {m.title}
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', lineHeight: 1.5, marginTop: '6px' }}>
                      {m.story}
                    </p>

                    {isCurrent && m.gameId && (
                      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                          className="btn-vermillion"
                          style={{ padding: '10px 20px', fontSize: '0.9rem' }}
                          onClick={() => onPlayGame(m.gameId!)}
                        >
                          <span>Continue Playing</span>
                          <ArrowRight size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
