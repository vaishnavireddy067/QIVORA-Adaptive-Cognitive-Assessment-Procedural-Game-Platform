import React, { useState, useEffect, useRef } from 'react';
import { GameId, Difficulty } from '../../types';
import { GAMES_DATA } from '../../engine/gamesData';

// Generators
import { generateInductiveQuestion, InductiveQuestion } from '../../engine/generators/inductiveGenerator';
import { generateDeductiveQuestion, DeductiveQuestion } from '../../engine/generators/deductiveGenerator';
import { generateGridQuestion, GridQuestion } from '../../engine/generators/gridGenerator';
import { generateSwitchPuzzle, SwitchTask } from '../../engine/generators/switchGenerator';
import { generateMemoryPuzzle, MemoryInterferenceTask } from '../../engine/generators/memoryGenerator';
import { generateAttentionQuestion, AttentionQuestion } from '../../engine/generators/attentionGenerator';
import { generateMathQuestion, MathTask } from '../../engine/generators/mathGenerator';
import { generateMotionPuzzle, MotionPuzzle } from '../../engine/generators/motionGenerator';
import { generateReactionTask, ReactionTask } from '../../engine/generators/reactionEngine';
import { generateColorGridTask, ColorGridTask } from '../../engine/generators/colorGridGenerator';

// Renderers
import { InductiveRenderer } from './InductiveRenderer';
import { DeductiveRenderer } from './DeductiveRenderer';
import { GridRenderer } from './GridRenderer';
import { SwitchRenderer } from './SwitchRenderer';
import { MemoryRenderer } from './MemoryRenderer';
import { AttentionRenderer } from './AttentionRenderer';
import { ReactionRenderer } from './ReactionRenderer';
import { MathRenderer } from './MathRenderer';
import { MotionRenderer } from './MotionRenderer';
import { ColorGridRenderer } from './ColorGridRenderer';
import { sounds } from '../../services/soundEngine';
import { recordGameAttempt } from '../../services/storage';
import { CognitiveIllustration } from '../common/CognitiveIllustrations';

// ─── Types ────────────────────────────────────────────────────────
export type Stage =
  | 'rules'              // 1. HOW IT WORKS
  | 'demo'               // 2. WATCH QIVORA PLAY (AI Live Solver)
  | 'try'                // 3. YOUR FIRST TRY
  | 'practice_levels'    // 4. PRACTICE LEVELS (Level 1-5 continuous)
  | 'timed_assessment'   // 5. TIMED ASSESSMENT (Pure employer-style test)
  | 'performance_review';// 6. COGNITIVE PERFORMANCE REVIEW

type AnyQuestion =
  | InductiveQuestion | DeductiveQuestion | GridQuestion
  | SwitchTask | MemoryInterferenceTask | AttentionQuestion | MathTask | MotionPuzzle
  | ReactionTask | ColorGridTask
  | null;

interface GameArenaShellProps {
  gameId: GameId;
  onBack: () => void;
  onLaunchTimedAssessment?: () => void;
  onComplete?: (score: number) => void;
}

const TOTAL_ASSESSMENT_TASKS = 6;
const PER_TASK_TIME_SEC = 25;

// Helper to generate procedural question for given game, level, and subtypeIndex
function freshTask(gameId: GameId, diff: Difficulty = 'medium', level: number = 1, subtypeIndex?: number): AnyQuestion {
  switch (gameId) {
    case 'math': return generateMathQuestion(diff, level, subtypeIndex);
    case 'switch': return generateSwitchPuzzle(diff, level, subtypeIndex ?? 0);
    case 'memory': return generateMemoryPuzzle(diff, level, subtypeIndex ?? 0);
    case 'inductive': {
      const modes: ('sequence' | 'transformation' | 'analogy' | 'scales_clx' | 'classification')[] = [
        'sequence',
        'transformation',
        'analogy',
        'scales_clx',
        'classification'
      ];
      const mode = subtypeIndex !== undefined ? modes[subtypeIndex % 5] : undefined;
      return generateInductiveQuestion(diff, level, mode);
    }
    case 'deductive': {
      return generateDeductiveQuestion(diff, level, subtypeIndex);
    }
    case 'grid': {
      const challengeTypes: ('symmetry' | 'rotation' | 'overlay' | 'missing_cell' | 'full_grid_challenge')[] = [
        'symmetry',
        'rotation',
        'overlay',
        'missing_cell',
        'full_grid_challenge'
      ];
      const cType = subtypeIndex !== undefined ? challengeTypes[subtypeIndex % 5] : undefined;
      return generateGridQuestion(diff, cType, level);
    }
    case 'attention': return generateAttentionQuestion(diff, level, subtypeIndex);
    case 'motion': return generateMotionPuzzle(level, subtypeIndex ?? 0);
    case 'reaction': return generateReactionTask(subtypeIndex ?? 0);
    case 'color_grid': return generateColorGridTask(diff, level);
    default: return null;
  }
}

// ── Stage Label Pill ──────────────────────────────────────────────
const StagePill: React.FC<{ label: string; active: boolean; done: boolean; onClick?: () => void }> = ({
  label, active, done, onClick
}) => (
  <button
    onClick={onClick}
    style={{
      display: 'flex', alignItems: 'center', gap: 6,
      padding: '5px 14px',
      borderRadius: 20,
      fontSize: '0.78rem',
      fontWeight: 800,
      background: active ? '#141312' : done ? '#E8F5E9' : '#F1F5F9',
      color: active ? '#FFFFFF' : done ? '#15803D' : '#64748B',
      border: active ? '1.5px solid #141312' : done ? '1.5px solid #86EFAC' : '1.5px solid #E2E8F0',
      cursor: onClick ? 'pointer' : 'default',
      whiteSpace: 'nowrap',
      fontFamily: 'inherit',
      transition: 'all 0.15s ease'
    }}
  >
    {done && !active ? '✓ ' : ''}{label}
  </button>
);

export const GameArenaShell: React.FC<GameArenaShellProps> = ({ gameId, onBack, onComplete }) => {
  const meta = GAMES_DATA[gameId];
  const [stage, setStage] = useState<Stage>('rules');

  // Shared task state
  const [task, setTask] = useState<AnyQuestion>(null);
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [selectedSubtypeIndex, setSelectedSubtypeIndex] = useState<number>(0);
  const [inductiveSelected, setInductiveSelected] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<any>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [wasCorrect, setWasCorrect] = useState<boolean | null>(null);

  // Practice session state
  const [practiceRound, setPracticeRound] = useState<number>(1);
  const [practiceScore, setPracticeScore] = useState<number>(0);

  // Reset subtype selection when game changes
  useEffect(() => {
    setSelectedSubtypeIndex(0);
    setCurrentLevel(1);
    setPracticeRound(1);
    setPracticeScore(0);
  }, [gameId]);

  // Timed Assessment Session state
  const [assessmentIndex, setAssessmentIndex] = useState(0);
  const [assessmentCorrectCount, setAssessmentCorrectCount] = useState(0);
  const [assessmentTimes, setAssessmentTimes] = useState<number[]>([]);
  const [assessmentInterferenceScores, setAssessmentInterferenceScores] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(PER_TASK_TIME_SEC);
  const [isAssessmentActive, setIsAssessmentActive] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const taskStartTimeRef = useRef<number>(0);

  // Load fresh task on stage change
  useEffect(() => {
    if (stage === 'demo') {
      loadTask(1, selectedSubtypeIndex);
    } else if (stage === 'try') {
      loadTask(1, selectedSubtypeIndex);
    } else if (stage === 'practice_levels') {
      loadTask(currentLevel, selectedSubtypeIndex);
    } else if (stage === 'timed_assessment' && assessmentIndex === 0) {
      loadTask(1);
    }
  }, [stage]);

  // Timed assessment countdown
  useEffect(() => {
    if (stage !== 'timed_assessment' || !isAssessmentActive) return;

    setTimeLeft(PER_TASK_TIME_SEC);
    taskStartTimeRef.current = performance.now();

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleAssessmentTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current!);
  }, [assessmentIndex, isAssessmentActive, stage]);

  const loadTask = (level: number, subtypeIdx?: number) => {
    const sIdx = subtypeIdx !== undefined ? subtypeIdx : selectedSubtypeIndex;
    const diff: Difficulty = level <= 2 ? 'easy' : level <= 4 ? 'medium' : 'hard';
    setTask(freshTask(gameId, diff, level, sIdx));
    setSelectedAnswer(null);
    setInductiveSelected([]);
    setShowExplanation(false);
    setWasCorrect(null);
  };

  const handleAssessmentTimeout = () => {
    const elapsed = Math.round(performance.now() - taskStartTimeRef.current);
    setAssessmentTimes(prev => [...prev, elapsed]);
    advanceAssessment(false);
  };

  const handleCorrectSubmission = (correct: boolean, extraTelemetry?: { interferenceScore?: number }) => {
    if (correct) {
      sounds.playCorrect(assessmentCorrectCount + 1);
    } else {
      sounds.playError();
    }

    if (stage === 'timed_assessment') {
      clearInterval(timerRef.current!);
      const elapsed = Math.round(performance.now() - taskStartTimeRef.current);
      setAssessmentTimes(prev => [...prev, elapsed]);
      if (correct) setAssessmentCorrectCount(prev => prev + 1);
      if (extraTelemetry?.interferenceScore !== undefined) {
        setAssessmentInterferenceScores(prev => [...prev, extraTelemetry.interferenceScore!]);
      }
      advanceAssessment(correct);
    } else if (stage === 'try') {
      setWasCorrect(correct);
      setShowExplanation(true);
    } else if (stage === 'practice_levels') {
      setWasCorrect(correct);
      setShowExplanation(true);
    }
  };

  const advanceAssessment = (lastCorrect: boolean) => {
    const nextIdx = assessmentIndex + 1;
    if (nextIdx >= TOTAL_ASSESSMENT_TASKS) {
      setIsAssessmentActive(false);
      setStage('performance_review');
      sounds.playVictory();
      
      const finalScorePct = Math.round((assessmentCorrectCount / TOTAL_ASSESSMENT_TASKS) * 100);
      const avgSpeedMs = assessmentTimes.length > 0
        ? Math.round(assessmentTimes.reduce((a, b) => a + b, 0) / assessmentTimes.length)
        : 2200;

      recordGameAttempt({
        id: 'att_' + Date.now(),
        gameId,
        difficulty: 'medium',
        score: finalScorePct,
        accuracy: finalScorePct,
        speedMs: avgSpeedMs,
        completedAt: new Date().toISOString()
      });

      if (onComplete) {
        onComplete(finalScorePct);
      }
    } else {
      setAssessmentIndex(nextIdx);
      const nextLevel = Math.min(5, Math.floor(nextIdx * 1) + 1);
      loadTask(nextLevel);
    }
  };

  const handleAdvancePracticeLevel = () => {
    const nextLvl = Math.min(5, currentLevel + 1);
    setCurrentLevel(nextLvl);
    loadTask(nextLvl);
  };

  const stages: { id: Stage; label: string }[] = [
    { id: 'rules', label: '1. How It Works' },
    { id: 'demo', label: '2. Watch Qivora Play' },
    { id: 'try', label: '3. Your First Try' },
    { id: 'practice_levels', label: `4. Practice (Lvl ${currentLevel})` },
    { id: 'timed_assessment', label: '5. Timed Assessment' },
    { id: 'performance_review', label: '6. Review' }
  ];

  const currentStageIndex = stages.findIndex(s => s.id === stage);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#FCF9F2',
      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* ── Top Bar with 6-Stage Progress Indicator ───────────── */}
      {stage !== 'timed_assessment' ? (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 36px',
          height: 64,
          background: '#FFFFFF',
          borderBottom: '1.5px solid #ECE7DD',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          gap: 16,
        }}>
          <button onClick={onBack} style={{
            padding: '6px 14px',
            background: 'transparent',
            border: '1.5px solid #D1D5DB',
            borderRadius: 20,
            fontWeight: 800,
            fontSize: '0.82rem',
            cursor: 'pointer',
            color: '#374151',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            ← All Games
          </button>

          {/* Stage pills */}
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', overflowX: 'auto' }}>
            {stages.map((st, idx) => (
              <React.Fragment key={st.id}>
                <StagePill
                  label={st.label}
                  active={stage === st.id}
                  done={currentStageIndex > idx}
                  onClick={() => {
                    if (idx <= currentStageIndex) setStage(st.id);
                  }}
                />
                {idx < stages.length - 1 && <span style={{ color: '#CBD5E1', fontSize: '0.8rem' }}>›</span>}
              </React.Fragment>
            ))}
          </div>

          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#6B7280' }}>
            {meta?.title || gameId}
          </div>
        </div>
      ) : (
        /* Minimalist Employer Assessment Header */
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 36px',
          height: 64,
          background: '#FFFFFF',
          borderBottom: '1.5px solid #ECE7DD',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: '#FFF1EA',
              border: '1px solid #FED7AA',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CognitiveIllustration gameId={gameId} size={20} color="#FF3B20" />
            </div>
            <span style={{ fontWeight: 900, letterSpacing: '-0.02em', fontSize: '1rem', color: '#121110', fontFamily: 'var(--font-poster)' }}>
              QIVORA ASSESSMENT
            </span>
            <span style={{ color: '#64748B', fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}>
              // {meta?.title}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <span style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
              TASK {assessmentIndex + 1}/{TOTAL_ASSESSMENT_TASKS}
            </span>
            <span style={{
              fontSize: '0.95rem',
              fontWeight: 900,
              fontFamily: 'var(--font-mono)',
              color: timeLeft <= 5 ? '#DC2626' : '#D97706',
              background: timeLeft <= 5 ? '#FEE2E2' : '#FEF3C7',
              border: `1.5px solid ${timeLeft <= 5 ? '#FCA5A5' : '#FDE68A'}`,
              padding: '4px 14px',
              borderRadius: '9999px',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}>
              <span>⏱</span>
              <span>{timeLeft}s</span>
            </span>
            <button
              onClick={() => {
                setIsAssessmentActive(false);
                setStage('performance_review');
              }}
              style={{
                background: 'transparent',
                border: '1.5px solid #CBD5E1',
                color: '#64748B',
                padding: '5px 12px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#121110';
                e.currentTarget.style.color = '#121110';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#CBD5E1';
                e.currentTarget.style.color = '#64748B';
              }}
            >
              End Test
            </button>
          </div>
        </div>
      )}

      {/* ── Content Viewport ─────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '36px 24px' }}>

        {/* ━━━━━━━━ STAGE 1: HOW IT WORKS ━━━━━━━━━━━━━━━━━━━━━━ */}
        {stage === 'rules' && (
          <div style={{ maxWidth: 580, width: '100%', display: 'flex', flexDirection: 'column', gap: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{
                width: 58,
                height: 58,
                borderRadius: 16,
                background: '#FFFFFF',
                border: '2px solid #E2DBCF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                flexShrink: 0
              }}>
                <CognitiveIllustration gameId={gameId} size={36} color="#FF3B20" />
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#9CA3AF', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 2 }}>
                  COGNITIVE ARCHITECTURE &amp; ASSESSMENT RULES
                </div>
                <h1 style={{ fontSize: '2rem', fontWeight: 950, color: '#141312', letterSpacing: '-0.03em', margin: 0, fontFamily: "'Syne', sans-serif" }}>
                  {meta?.title}
                </h1>
              </div>
            </div>
            <p style={{ fontSize: '0.98rem', color: '#4B5563', lineHeight: 1.5, margin: 0 }}>
              {meta?.description}
            </p>

            <div style={{
              background: '#FFFFFF',
              border: '1.5px solid #E5E7EB',
              borderRadius: 16,
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Assessment Mechanics
              </div>
              {(meta?.rules || []).map((rule, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: '50%',
                    background: '#141312', color: '#FFF',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.78rem', fontWeight: 800, flexShrink: 0
                  }}>
                    {i + 1}
                  </div>
                  <p style={{ fontSize: '0.92rem', color: '#374151', lineHeight: 1.5, margin: 0 }}>{rule}</p>
                </div>
              ))}
            </div>

            {/* Subtypes / Challenge Models Overview */}
            {meta?.subtypes && meta.subtypes.length > 0 && (
              <div style={{
                background: '#FFFFFF',
                border: '1.5px solid #E5E7EB',
                borderRadius: 16,
                padding: '22px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
              }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Task Variations &amp; Challenge Models
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                  {meta.subtypes.map((st, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        setSelectedSubtypeIndex(i);
                        setStage('practice_levels');
                        loadTask(currentLevel, i);
                      }}
                      style={{
                        background: '#F8FAFC',
                        border: '1.5px solid #E2E8F0',
                        borderRadius: '12px',
                        padding: '12px 16px',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = '#FF5733';
                        e.currentTarget.style.background = '#FFF9F6';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = '#E2E8F0';
                        e.currentTarget.style.background = '#F8FAFC';
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 800, fontSize: '0.88rem', color: '#1E293B' }}>{st.name}</span>
                        <span style={{ fontSize: '0.72rem', color: '#FF5733', fontWeight: 800 }}>Practice →</span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#64748B', lineHeight: 1.4 }}>
                        {st.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => setStage('demo')}
              style={{
                padding: '14px 0',
                background: '#141312',
                color: '#FFF',
                border: 'none',
                borderRadius: 30,
                fontWeight: 800,
                fontSize: '1rem',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'background 0.15s ease'
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#FF5733')}
              onMouseLeave={e => (e.currentTarget.style.background = '#141312')}
            >
              <span>Watch Qivora Play (AI Demo)</span>
              <span>→</span>
            </button>
          </div>
        )}

        {/* ━━━━━━━━ STAGE 2: WATCH QIVORA PLAY (REAL AI SOLVER) ━━ */}
        {stage === 'demo' && (
          <div style={{ maxWidth: 680, width: '100%', display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '6px 16px', background: '#FEF3C7', border: '1px solid #FDE68A',
                borderRadius: 20, fontWeight: 800, fontSize: '0.8rem', color: '#B45309', marginBottom: 8
              }}>
                🤖 WATCH QIVORA PLAY — Automated State Solver
              </div>
              <p style={{ fontSize: '0.88rem', color: '#6B7280', margin: 0 }}>
                Observe the automated step-by-step cognitive solution path before attempting yourself.
              </p>
            </div>

            {/* Subtype Switcher in Demo Mode */}
            {meta?.subtypes && meta.subtypes.length > 1 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', width: '100%', marginBottom: '4px' }}>
                {meta.subtypes.map((st, i) => {
                  const isSelected = selectedSubtypeIndex === i;
                  return (
                    <button
                      key={i}
                      onClick={() => {
                        setSelectedSubtypeIndex(i);
                        loadTask(1, i);
                      }}
                      style={{
                        padding: '7px 16px',
                        borderRadius: '24px',
                        border: isSelected ? '2px solid #FF5733' : '1.5px solid #E2E8F0',
                        background: isSelected ? '#FFF1EA' : '#FFFFFF',
                        color: isSelected ? '#FF5733' : '#64748B',
                        fontWeight: 800,
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        transition: 'all 0.15s ease',
                        boxShadow: isSelected ? '0 2px 8px rgba(255,87,51,0.15)' : 'none'
                      }}
                    >
                      {st.name}
                    </button>
                  );
                })}
              </div>
            )}

            <div style={{
              background: '#FFFFFF',
              borderRadius: 20,
              border: '1.5px solid #E5E7EB',
              padding: '32px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
            }}>
              {task && (
                <QuestionCanvas
                  gameId={gameId}
                  question={task}
                  inductiveSelected={inductiveSelected}
                  setInductiveSelected={setInductiveSelected}
                  selectedAnswer={selectedAnswer}
                  setSelectedAnswer={setSelectedAnswer}
                  showExplanation={true}
                  onCorrect={handleCorrectSubmission}
                  isDemo={true}
                />
              )}
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => loadTask(1)}
                style={{
                  flex: 1, padding: '13px 0', background: '#FFF',
                  border: '1.5px solid #D1D5DB', borderRadius: 30,
                  fontWeight: 800, fontSize: '0.92rem', cursor: 'pointer', color: '#374151'
                }}
              >
                ↺ Generate Another Example
              </button>
              <button
                onClick={() => {
                  setStage('try');
                  loadTask(1);
                }}
                style={{
                  flex: 1, padding: '13px 0', background: '#141312',
                  border: 'none', borderRadius: 30,
                  fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer', color: '#FFF'
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#FF5733')}
                onMouseLeave={e => (e.currentTarget.style.background = '#141312')}
              >
                I Understand — Your First Try →
              </button>
            </div>
          </div>
        )}

        {/* ━━━━━━━━ STAGE 3: YOUR FIRST TRY ━━━━━━━━━━━━━━━━━━━━━ */}
        {stage === 'try' && (
          <div style={{ maxWidth: 680, width: '100%', display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#9CA3AF', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                GUIDED PRACTICE — NO TIMER
              </span>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#141312', margin: '4px 0 0 0' }}>
                Your First Try
              </h2>
            </div>

            <div style={{
              background: '#FFFFFF',
              borderRadius: 20,
              border: '1.5px solid #E5E7EB',
              padding: '32px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
            }}>
              {task && (
                <QuestionCanvas
                  gameId={gameId}
                  question={task}
                  inductiveSelected={inductiveSelected}
                  setInductiveSelected={setInductiveSelected}
                  selectedAnswer={selectedAnswer}
                  setSelectedAnswer={setSelectedAnswer}
                  showExplanation={showExplanation}
                  onCorrect={handleCorrectSubmission}
                  isDemo={false}
                />
              )}
            </div>

            {wasCorrect !== null && (
              <div style={{
                padding: '14px 20px',
                background: wasCorrect ? '#ECFDF5' : '#FEF2F2',
                border: `1.5px solid ${wasCorrect ? '#10B981' : '#EF4444'}`,
                borderRadius: 12,
                fontWeight: 700,
                color: wasCorrect ? '#065F46' : '#991B1B',
                fontSize: '0.9rem',
                textAlign: 'center'
              }}>
                {wasCorrect ? '✓ Excellent! You verified the state transition.' : '✗ Try adjusting the constraints to reach the target.'}
              </div>
            )}

            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => {
                  loadTask(1);
                  setWasCorrect(null);
                }}
                style={{
                  flex: 1, padding: '13px 0', background: '#FFF',
                  border: '1.5px solid #D1D5DB', borderRadius: 30,
                  fontWeight: 800, fontSize: '0.92rem', cursor: 'pointer', color: '#374151'
                }}
              >
                Try Another
              </button>
              <button
                onClick={() => {
                  setStage('practice_levels');
                  setCurrentLevel(1);
                  loadTask(1);
                }}
                style={{
                  flex: 1, padding: '13px 0', background: '#141312',
                  border: 'none', borderRadius: 30,
                  fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer', color: '#FFF'
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#FF5733')}
                onMouseLeave={e => (e.currentTarget.style.background = '#141312')}
              >
                Enter Practice Levels (1–5) →
              </button>
            </div>
          </div>
        )}

        {/* ━━━━━━━━ STAGE 4: PRACTICE LEVELS (1-5 CONTINUOUS) ━━━ */}
        {stage === 'practice_levels' && (
          <div style={{ maxWidth: 680, width: '100%', display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Level Selector Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#141312' }}>Level:</span>
                {[1, 2, 3, 4, 5].map(lvl => (
                  <button
                    key={lvl}
                    onClick={() => {
                      setCurrentLevel(lvl);
                      loadTask(lvl);
                    }}
                    style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: currentLevel === lvl ? '#FF5733' : '#FFFFFF',
                      color: currentLevel === lvl ? '#FFFFFF' : '#374151',
                      border: currentLevel === lvl ? 'none' : '1.5px solid #D1D5DB',
                      fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer'
                    }}
                  >
                    {lvl}
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  setStage('timed_assessment');
                  setAssessmentIndex(0);
                  setAssessmentCorrectCount(0);
                  setAssessmentTimes([]);
                  setAssessmentInterferenceScores([]);
                  setIsAssessmentActive(true);
                  loadTask(1);
                }}
                style={{
                  padding: '8px 18px', background: '#141312', color: '#FFF',
                  borderRadius: 20, border: 'none', fontWeight: 800, fontSize: '0.82rem',
                  cursor: 'pointer'
                }}
              >
                ⚡ Start Timed Assessment
              </button>
            </div>

            {/* Subtype Selector Tabs in Practice Mode */}
            {meta?.subtypes && meta.subtypes.length > 1 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', width: '100%', marginBottom: '6px' }}>
                {meta.subtypes.map((st, i) => {
                  const isSelected = selectedSubtypeIndex === i;
                  return (
                    <button
                      key={i}
                      onClick={() => {
                        setSelectedSubtypeIndex(i);
                        loadTask(currentLevel, i);
                      }}
                      style={{
                        padding: '7px 14px',
                        borderRadius: '20px',
                        border: isSelected ? '2px solid #FF5733' : '1.5px solid #E2E8F0',
                        background: isSelected ? '#FFF1EA' : '#FFFFFF',
                        color: isSelected ? '#FF5733' : '#64748B',
                        fontWeight: 800,
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        transition: 'all 0.15s ease',
                        boxShadow: isSelected ? '0 2px 8px rgba(255,87,51,0.15)' : 'none'
                      }}
                    >
                      {st.name}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Active Challenge Model Pill */}
            {meta?.subtypes && meta.subtypes.length > 0 && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 18px',
                background: '#FFFFFF',
                border: '1.5px solid #ECE7DD',
                borderRadius: '12px',
                fontSize: '0.84rem',
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#9CA3AF', fontWeight: 800, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Active Model:
                  </span>
                  <span style={{ fontWeight: 800, color: '#141312' }}>
                    {(task as any)?.subtypeName || (task as any)?.subRuleLabel || meta.subtypes[(currentLevel - 1) % meta.subtypes.length]?.name}
                  </span>
                </div>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: '#FF5733',
                  background: '#FFF1EA',
                  padding: '3px 8px',
                  borderRadius: '6px'
                }}>
                  LEVEL {currentLevel} of 5
                </span>
              </div>
            )}

            <div style={{
              background: '#FFFFFF',
              borderRadius: 20,
              border: '1.5px solid #E5E7EB',
              padding: '32px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
            }}>
              {task && (
                <QuestionCanvas
                  gameId={gameId}
                  question={task}
                  inductiveSelected={inductiveSelected}
                  setInductiveSelected={setInductiveSelected}
                  selectedAnswer={selectedAnswer}
                  setSelectedAnswer={setSelectedAnswer}
                  showExplanation={showExplanation}
                  onCorrect={handleCorrectSubmission}
                  isDemo={false}
                />
              )}
            </div>

            {wasCorrect !== null && (
              <div style={{
                padding: '14px 20px',
                background: wasCorrect ? '#ECFDF5' : '#FEF2F2',
                border: `1.5px solid ${wasCorrect ? '#10B981' : '#EF4444'}`,
                borderRadius: 14,
                fontWeight: 700,
                color: wasCorrect ? '#065F46' : '#991B1B',
                fontSize: '0.92rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12
              }}>
                <div>
                  <div style={{ fontWeight: 800 }}>
                    {wasCorrect
                      ? `✓ Excellent! Question ${practiceRound} verified.`
                      : '✗ Constraint not met. Review the state and try the next variation.'}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: wasCorrect ? '#047857' : '#B91C1C', marginTop: 2 }}>
                    Continuous Practice: Level {currentLevel} • Model #{selectedSubtypeIndex + 1}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setPracticeRound(prev => prev + 1);
                    if (wasCorrect) setPracticeScore(prev => prev + 1);
                    loadTask(currentLevel);
                  }}
                  style={{
                    padding: '8px 18px',
                    background: wasCorrect ? '#059669' : '#DC2626',
                    color: '#FFF',
                    border: 'none',
                    borderRadius: 20,
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                >
                  Next Question →
                </button>
              </div>
            )}

            <div style={{ display: 'flex', gap: 12, width: '100%' }}>
              <button
                onClick={() => {
                  setPracticeRound(prev => prev + 1);
                  loadTask(currentLevel);
                }}
                style={{
                  flex: 1, padding: '13px 0', background: '#FFF',
                  border: '1.5px solid #D1D5DB', borderRadius: 30,
                  fontWeight: 800, fontSize: '0.92rem', cursor: 'pointer', color: '#374151',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#141312';
                  e.currentTarget.style.background = '#F9FAFB';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#D1D5DB';
                  e.currentTarget.style.background = '#FFF';
                }}
              >
                ↻ New Question (Level {currentLevel})
              </button>
              {currentLevel < 5 && (
                <button
                  onClick={() => {
                    handleAdvancePracticeLevel();
                    setPracticeRound(prev => prev + 1);
                  }}
                  style={{
                    flex: 1, padding: '13px 0', background: '#141312',
                    border: 'none', borderRadius: 30,
                    fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer', color: '#FFF',
                    transition: 'background 0.15s ease'
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#FF5733')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#141312')}
                >
                  Advance to Level {currentLevel + 1} →
                </button>
              )}
            </div>
          </div>
        )}

        {/* ━━━━━━━━ STAGE 5: TIMED ASSESSMENT ━━━━━━━━━━━━━━━━━━━ */}
        {stage === 'timed_assessment' && (
          <div style={{ maxWidth: 740, width: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Countdown progress bar */}
            <div style={{ width: '100%', height: 6, background: '#E2E8F0', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{
                width: `${(timeLeft / PER_TASK_TIME_SEC) * 100}%`,
                height: '100%',
                background: timeLeft <= 5 ? '#EF4444' : '#10B981',
                transition: 'width 0.9s linear'
              }} />
            </div>

            <div style={{
              background: '#FFFFFF',
              borderRadius: 20,
              border: '1.5px solid #E5E7EB',
              padding: '36px 28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 6px 24px rgba(0,0,0,0.04)'
            }}>
              {task && (
                <QuestionCanvas
                  gameId={gameId}
                  question={task}
                  inductiveSelected={inductiveSelected}
                  setInductiveSelected={setInductiveSelected}
                  selectedAnswer={selectedAnswer}
                  setSelectedAnswer={setSelectedAnswer}
                  showExplanation={false} // Strict assessment mode: no hints!
                  onCorrect={handleCorrectSubmission}
                  isDemo={false}
                />
              )}
            </div>
          </div>
        )}

        {/* ━━━━━━━━ STAGE 6: PERFORMANCE REVIEW ━━━━━━━━━━━━━━━━━ */}
        {stage === 'performance_review' && (
          <CognitivePerformanceReview
            gameId={gameId}
            gameName={meta?.title || gameId}
            correctCount={assessmentCorrectCount}
            totalTasks={TOTAL_ASSESSMENT_TASKS}
            times={assessmentTimes}
            interferenceScores={assessmentInterferenceScores}
            onRetry={() => {
              setStage('timed_assessment');
              setAssessmentIndex(0);
              setAssessmentCorrectCount(0);
              setAssessmentTimes([]);
              setAssessmentInterferenceScores([]);
              setIsAssessmentActive(true);
              loadTask(1);
            }}
            onBack={onBack}
          />
        )}
      </div>
    </div>
  );
};

// ─── Question Canvas Dispatcher ───────────────────────────────────
interface QCProps {
  gameId: GameId;
  question: AnyQuestion;
  inductiveSelected: number[];
  setInductiveSelected: any;
  selectedAnswer: any;
  setSelectedAnswer: any;
  showExplanation: boolean;
  onCorrect: (correct: boolean, extraTelemetry?: any) => void;
  isDemo?: boolean;
}

const QuestionCanvas: React.FC<QCProps> = ({
  gameId, question, inductiveSelected, setInductiveSelected,
  selectedAnswer, setSelectedAnswer, showExplanation, onCorrect, isDemo
}) => {
  if (!question) return <div style={{ padding: 40, color: '#94A3B8' }}>Loading task...</div>;

  switch (gameId) {
    case 'math': {
      const q = question as MathTask;
      return (
        <MathRenderer
          question={q}
          onSelectAnswer={(ans) => {
            sounds.playClick();
            if (q.subtype === 'digit_equation') {
              onCorrect(ans === q.target);
            } else if (q.subtype === 'number_series') {
              onCorrect(ans === q.correctSeriesAnswer);
            } else if (q.subtype === 'rapid_comparison') {
              onCorrect(ans === q.correctComparisonIndex);
            }
          }}
          showExplanation={showExplanation}
          isDemo={isDemo}
        />
      );
    }
    case 'switch': {
      const p = question as SwitchTask;
      return (
        <SwitchRenderer
          puzzle={p}
          selectedSwitchIndex={selectedAnswer}
          onSelectSwitch={(idx) => {
            sounds.playClick();
            setSelectedAnswer(idx);
            onCorrect(idx === p.correctSwitchIndex);
          }}
          showExplanation={showExplanation}
          isDemo={isDemo}
        />
      );
    }
    case 'memory': {
      const p = question as MemoryInterferenceTask;
      return (
        <MemoryRenderer
          puzzle={p}
          onSubmitAnswer={(userSeq, interferenceScore) => {
            sounds.playClick();
            const isMatch = JSON.stringify(userSeq) === JSON.stringify(p.targetSequence);
            onCorrect(isMatch, { interferenceScore });
          }}
          showExplanation={showExplanation}
          isDemo={isDemo}
        />
      );
    }
    case 'inductive': {
      const q = question as InductiveQuestion;
      return (
        <InductiveRenderer
          question={q}
          selectedOptionIndex={selectedAnswer}
          selectedOptionIndices={inductiveSelected}
          onSelectOption={idx => {
            sounds.playClick();
            if (q.challengeType === 'classification' && q.correctIndices) {
              const reqCount = q.requiredPickCount ?? q.correctIndices.length;
              if (reqCount === 1) {
                setSelectedAnswer(idx);
                onCorrect(idx === q.correctIndices[0]);
              } else {
                setInductiveSelected((prev: number[]) => {
                  if (prev.includes(idx)) return prev.filter((i: number) => i !== idx);
                  const next = [...prev, idx];
                  if (next.length === reqCount) {
                    const correct = q.correctIndices!;
                    onCorrect(next.sort().join(',') === [...correct].sort().join(','));
                  }
                  return next.slice(-reqCount);
                });
              }
            } else {
              setSelectedAnswer(idx);
              onCorrect(idx === q.correctOptionIndex);
            }
          }}
          showExplanation={showExplanation}
          isDemo={isDemo}
        />
      );
    }
    case 'deductive': {
      const q = question as DeductiveQuestion;
      return (
        <DeductiveRenderer
          question={q}
          selectedOptionIndex={selectedAnswer}
          onSelectOption={idx => {
            sounds.playClick();
            setSelectedAnswer(idx);
            onCorrect(idx === q.correctOptionIndex);
          }}
          showExplanation={showExplanation}
          isDemo={isDemo}
        />
      );
    }
    case 'grid': {
      const q = question as GridQuestion;
      return (
        <GridRenderer
          question={q}
          selectedOptionIndex={selectedAnswer}
          onSelectOption={idx => {
            sounds.playClick();
            setSelectedAnswer(idx);
            if (q.isYesNo) {
              onCorrect(idx === 0);
            } else {
              onCorrect(idx === q.correctOptionIndex);
            }
          }}
          onSelectYesNo={isCorrect => {
            sounds.playClick();
            onCorrect(isCorrect);
          }}
          showExplanation={showExplanation}
          isDemo={isDemo}
        />
      );
    }
    case 'attention': {
      const q = question as AttentionQuestion;
      return (
        <AttentionRenderer
          question={q}
          onSelectIndex={(idx) => {
            sounds.playClick();
            if (q.subtype === 'target_anomaly') {
              onCorrect(idx === q.targetIndex);
            } else if (q.subtype === 'feature_frequency') {
              onCorrect(idx === q.correctOptionIndex);
            } else if (q.subtype === 'rapid_comparison') {
              const isMatch = idx === 0;
              onCorrect(isMatch === q.isIdentical);
            } else if (q.subtype === 'change_detection') {
              onCorrect(idx === q.changedIndex);
            }
          }}
          showExplanation={showExplanation}
          isDemo={isDemo}
        />
      );
    }
    case 'motion': {
      const p = question as MotionPuzzle;
      return (
        <MotionRenderer
          puzzle={p}
          onSolved={() => onCorrect(true)}
          showExplanation={showExplanation}
        />
      );
    }
    case 'reaction': {
      const t = question as ReactionTask;
      return (
        <ReactionRenderer
          task={t}
          onTrialComplete={(rt, falseStart, sc) => {
            onCorrect(!falseStart && sc > 0);
          }}
          trialsLeft={3}
          showExplanation={showExplanation}
          isDemo={isDemo}
        />
      );
    }
    case 'color_grid': {
      const t = question as ColorGridTask;
      return (
        <ColorGridRenderer
          task={t}
          onComplete={isCorrect => {
            sounds.playClick();
            onCorrect(isCorrect);
          }}
          showExplanation={showExplanation}
          isDemo={isDemo}
        />
      );
    }
    default:
      return <div>Task format not found</div>;
  }
};

// ─── Cognitive Performance Review Component ───────────────────────
const CognitivePerformanceReview: React.FC<{
  gameId: GameId;
  gameName: string;
  correctCount: number;
  totalTasks: number;
  times: number[];
  interferenceScores: number[];
  onRetry: () => void;
  onBack: () => void;
}> = ({ gameId, gameName, correctCount, totalTasks, times, interferenceScores, onRetry, onBack }) => {
  const accuracyPct = Math.round((correctCount / totalTasks) * 100);
  const avgTimeMs = times.length ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 0;
  const avgTimeSec = (avgTimeMs / 1000).toFixed(1);

  const avgInterference = interferenceScores.length
    ? Math.round(interferenceScores.reduce((a, b) => a + b, 0) / interferenceScores.length)
    : null;

  return (
    <div style={{ maxWidth: 540, width: '100%', display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'center' }}>
      {/* Assessment Completed Badge */}
      <div style={{
        padding: '6px 16px', background: '#DCFCE7', border: '1.5px solid #86EFAC',
        borderRadius: 30, color: '#15803D', fontWeight: 800, fontSize: '0.82rem'
      }}>
        ASSESSMENT COMPLETED • COGNITIVE TELEMETRY
      </div>

      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 950, color: '#141312', margin: '0 0 6px 0', fontFamily: "'Syne', sans-serif" }}>
          {gameName} Performance Review
        </h2>
        <p style={{ color: '#6B7280', fontSize: '0.92rem', margin: 0 }}>
          Continuous assessment analytics across {totalTasks} procedural tasks
        </p>
      </div>

      {/* Cognitive Dimensions Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14, width: '100%' }}>
        <div style={{
          background: '#FFFFFF', border: '1.5px solid #E5E7EB', borderRadius: 16, padding: '18px',
          display: 'flex', flexDirection: 'column', gap: 4
        }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase' }}>
            Task Accuracy
          </span>
          <span style={{ fontSize: '1.8rem', fontWeight: 900, color: '#10B981', fontFamily: 'monospace' }}>
            {accuracyPct}%
          </span>
          <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>
            {correctCount} of {totalTasks} tasks validated
          </span>
        </div>

        <div style={{
          background: '#FFFFFF', border: '1.5px solid #E5E7EB', borderRadius: 16, padding: '18px',
          display: 'flex', flexDirection: 'column', gap: 4
        }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase' }}>
            Cognitive Processing Speed
          </span>
          <span style={{ fontSize: '1.8rem', fontWeight: 900, color: '#3B82F6', fontFamily: 'monospace' }}>
            {avgTimeSec}s
          </span>
          <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>
            Avg response per task
          </span>
        </div>

        {avgInterference !== null && (
          <div style={{
            background: '#FFFFFF', border: '1.5px solid #E5E7EB', borderRadius: 16, padding: '18px',
            display: 'flex', flexDirection: 'column', gap: 4, gridColumn: 'span 2'
          }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase' }}>
              Interference Resistance Index
            </span>
            <span style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0D9488', fontFamily: 'monospace' }}>
              {avgInterference}%
            </span>
            <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>
              Memory retention resilience under dual-task distraction
            </span>
          </div>
        )}
      </div>

      {/* Recommended Next Practice */}
      <div style={{
        width: '100%',
        padding: '16px 20px',
        background: '#FFFDF9',
        border: '1.5px solid #F3ECE1',
        borderRadius: 16,
        display: 'flex',
        alignItems: 'center',
        gap: 14
      }}>
        <div style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: '#FFFFFF',
          border: '1px solid #E2DBCF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <CognitiveIllustration gameId={gameId} size={24} color="#FF3B20" />
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase' }}>
            Recommended Next Step
          </div>
          <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#141312' }}>
            {gameId === 'math' && 'Numerical Constraint — Level 4 (Interacting Precedence)'}
            {gameId === 'switch' && 'Chained Symbol Transformations — Level 4 (Two-Layer Pipelines)'}
            {gameId === 'memory' && 'Memory Under Interference — Level 3 (4 Spatial Targets)'}
            {!['math', 'switch', 'memory'].includes(gameId) && `${gameName} Advanced Level 4`}
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div style={{ display: 'flex', gap: 12, width: '100%' }}>
        <button
          onClick={onBack}
          style={{
            flex: 1, padding: '13px 0', background: '#FFFFFF',
            border: '1.5px solid #D1D5DB', borderRadius: 30,
            fontWeight: 800, fontSize: '0.92rem', cursor: 'pointer', color: '#374151'
          }}
        >
          ← Return to Dashboard
        </button>
        <button
          onClick={onRetry}
          style={{
            flex: 1, padding: '13px 0', background: '#141312',
            border: 'none', borderRadius: 30,
            fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer', color: '#FFFFFF'
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#FF5733')}
          onMouseLeave={e => (e.currentTarget.style.background = '#141312')}
        >
          Retake Assessment →
        </button>
      </div>
    </div>
  );
};
