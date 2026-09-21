import React from 'react';
import { AssessmentResult, GameId } from '../types';
import { ArrowRight, Sparkles, Compass, Award, Brain, Printer } from 'lucide-react';
import { sounds } from '../services/soundEngine';

interface ResultsPageProps {
  result: AssessmentResult;
  onRetake: () => void;
  onPracticeGame: (gameId: GameId) => void;
  onOpenCertificate?: () => void;
  onOpenCopilot?: () => void;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({
  result,
  onRetake,
  onPracticeGame,
  onOpenCertificate,
  onOpenCopilot
}) => {
  // Qualitative label mapper
  const getRatingTier = (score: number): { label: string; color: string } => {
    if (score >= 88) return { label: 'Excellent', color: 'var(--accent-mint)' };
    if (score >= 76) return { label: 'Strong', color: 'var(--accent-vermillion)' };
    if (score >= 65) return { label: 'Developing', color: '#141312' };
    return { label: 'Needs Practice', color: 'var(--text-muted)' };
  };

  const strength = result.strengths[0]?.label || 'Pattern Recognition';
  const edge = result.strengths[1]?.label || 'Visual Memory';
  const challenge = result.weaknesses[0]?.label || 'Cognitive Flexibility';

  return (
    <div style={{ padding: '56px 0 90px 0' }}>
      <div className="container-narrow">
        {/* Top Tag & Actions Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '20px'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            background: 'var(--bg-cream)',
            border: '1.5px solid var(--border-ink)',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.8rem',
            fontWeight: 750,
            fontFamily: 'var(--font-mono)'
          }}>
            <Sparkles size={14} color="var(--accent-vermillion)" />
            <span>COGNITIVE PROFILE DIAGNOSIS</span>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            {onOpenCopilot && (
              <button
                onClick={() => {
                  sounds.playClick();
                  onOpenCopilot();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: '9999px',
                  background: '#EEF2FF',
                  border: '1.5px solid #6366F1',
                  color: '#4338CA',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  cursor: 'pointer'
                }}
              >
                <Brain size={15} /> Consult AI Copilot
              </button>
            )}

            {onOpenCertificate && (
              <button
                onClick={() => {
                  sounds.playClick();
                  onOpenCertificate();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: '9999px',
                  background: '#FEF3C7',
                  border: '1.5px solid #F59E0B',
                  color: '#92400E',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  cursor: 'pointer'
                }}
              >
                <Award size={15} /> Official Certificate / PDF
              </button>
            )}
          </div>
        </div>

        {/* Main Editorial Headline in Ultra-Bold Poster Typography */}
        <h1 className="poster-headline" style={{
          fontSize: 'clamp(3.2rem, 7vw, 5.2rem)',
          marginBottom: '24px'
        }}>
          HOW YOU THINK.
        </h1>

        {/* Narrative Synthesis Paragraph */}
        <div style={{
          fontSize: '1.4rem',
          lineHeight: 1.5,
          color: 'var(--text-primary)',
          fontWeight: 500,
          marginBottom: '40px',
          paddingLeft: '20px',
          borderLeft: '4px solid var(--accent-vermillion)'
        }}>
          You identify patterns quickly and perform strongly on visual memory tasks. Complex switching and multi-rule constraint tasks represent your greatest current opportunity for growth.
        </div>

        {/* The 3 Core Pillars: STRENGTH, EDGE, NEXT CHALLENGE */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '18px',
          marginBottom: '48px'
        }}>
          <div className="editorial-tile" style={{ padding: '24px', background: 'var(--accent-mint-light)' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 800, color: '#065F46', textTransform: 'uppercase' }}>
              YOUR STRENGTH
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#065F46', marginTop: '6px' }}>
              {strength}
            </div>
          </div>

          <div className="editorial-tile" style={{ padding: '24px', background: 'var(--accent-yellow)' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 800, color: '#141312', textTransform: 'uppercase' }}>
              YOUR EDGE
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#141312', marginTop: '6px' }}>
              {edge}
            </div>
          </div>

          <div className="editorial-tile" style={{ padding: '24px', background: '#FFFFFF' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-vermillion)', textTransform: 'uppercase' }}>
              NEXT CHALLENGE
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '6px' }}>
              {challenge}
            </div>
          </div>
        </div>

        {/* Abstract Cognitive Profile Visualizer */}
        <div className="editorial-tile" style={{ padding: '40px', background: '#FFFFFF', marginBottom: '48px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
            <div>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 850 }}>Cognitive Spectrum</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '2px' }}>
                Qualitative aptitude tiers across tested cognitive faculties.
              </p>
            </div>
            <span className="btn-pill-small" style={{ background: 'var(--bg-main)' }}>
              8 Faculties
            </span>
          </div>

          {/* Qualitative List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {([
              { key: 'inductive', name: 'Pattern Recognition', score: result.skillScores.inductive || 84 },
              { key: 'memory', name: 'Working Memory', score: result.skillScores.memory || 90 },
              { key: 'attention', name: 'Selective Attention', score: result.skillScores.attention || 82 },
              { key: 'grid', name: 'Spatial Matrices', score: result.skillScores.grid || 88 },
              { key: 'deductive', name: 'Deductive Reasoning', score: result.skillScores.deductive || 72 },
              { key: 'switch', name: 'Cognitive Flexibility', score: result.skillScores.switch || 64 },
              { key: 'reaction', name: 'Reaction Speed', score: result.skillScores.reaction || 78 },
              { key: 'math', name: 'Numerical Fluency', score: result.skillScores.math || 75 }
            ]).map(item => {
              const tier = getRatingTier(item.score);

              return (
                <div
                  key={item.key}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '14px 18px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-main)',
                    border: '1.5px solid var(--border-subtle)'
                  }}
                >
                  <span style={{ fontWeight: 750, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                    {item.name}
                  </span>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                      background: '#FFFFFF',
                      border: '1px solid var(--border-ink)',
                      color: tier.color
                    }}>
                      {tier.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* YOUR NEXT MOVE Banner */}
        <div style={{
          background: 'var(--text-primary)',
          color: 'var(--text-inverse)',
          borderRadius: 'var(--radius-xl)',
          padding: '44px 36px',
          boxShadow: 'var(--shadow-tactile)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '24px'
        }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-yellow)', textTransform: 'uppercase' }}>
              YOUR NEXT MOVE
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#FFFFFF', marginTop: '6px' }}>
              You're ready to attempt Switch — Hard.
            </h2>
            <p style={{ color: '#C5C0B6', fontSize: '0.95rem', marginTop: '4px' }}>
              Targeting this game will yield the most impactful increase in your cognitive flexibility.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              className="btn-vermillion"
              onClick={() => {
                sounds.playClick();
                onPracticeGame('switch');
              }}
            >
              <span>PLAY NEXT CHALLENGE</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
