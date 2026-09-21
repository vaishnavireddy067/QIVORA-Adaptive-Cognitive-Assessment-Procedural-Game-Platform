import React, { useState, useEffect, useRef } from 'react';
import { GameId, AssessmentResult } from '../types';
import { generateInductiveQuestion } from '../engine/generators/inductiveGenerator';
import { generateDeductiveQuestion } from '../engine/generators/deductiveGenerator';
import { generateGridQuestion } from '../engine/generators/gridGenerator';
import { generateSwitchPuzzle } from '../engine/generators/switchGenerator';
import { generateMemoryPuzzle } from '../engine/generators/memoryGenerator';
import { generateAttentionQuestion } from '../engine/generators/attentionGenerator';
import { generateMathQuestion } from '../engine/generators/mathGenerator';
import { generateMotionPuzzle } from '../engine/generators/motionGenerator';
import { generateColorGridTask } from '../engine/generators/colorGridGenerator';

import { InductiveRenderer } from '../components/games/InductiveRenderer';
import { DeductiveRenderer } from '../components/games/DeductiveRenderer';
import { GridRenderer } from '../components/games/GridRenderer';
import { SwitchRenderer } from '../components/games/SwitchRenderer';
import { MemoryRenderer } from '../components/games/MemoryRenderer';
import { AttentionRenderer } from '../components/games/AttentionRenderer';
import { ReactionRenderer } from '../components/games/ReactionRenderer';
import { MathRenderer } from '../components/games/MathRenderer';
import { MotionRenderer } from '../components/games/MotionRenderer';
import { ColorGridRenderer } from '../components/games/ColorGridRenderer';

import { calculatePercentile, determineArchetype, rankStrengthsAndWeaknesses } from '../engine/scoring';
import { recordAssessmentResult } from '../services/storage';
import { Timer, ArrowRight, ShieldCheck, Zap, AlertTriangle, CheckCircle2, ChevronRight, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AssessmentPageProps {
  onAssessmentComplete: (result: AssessmentResult) => void;
  onExit: () => void;
}

interface StageConfig {
  gameId: GameId;
  label: string;
  category: string;
  questionCount: number;
  description: string;
}

const ASSESSMENT_ORDER: StageConfig[] = [
  { gameId: 'inductive', label: 'Inductive Logic', category: 'Spacio & Spatial Patterns', questionCount: 3, description: 'Extract transforming geometric rules and identify identical rule pairs.' },
  { gameId: 'color_grid', label: 'Color the Grid', category: 'Diamond Rule Decoding', questionCount: 2, description: 'Deduce indicator rules from 6 reference tables and color 4 query tables.' },
  { gameId: 'grid', label: 'Grid Challenge', category: 'Spatial Memory & Symmetry', questionCount: 3, description: 'Memorize dot coordinates, solve interleaved symmetry/rotation, and recall nodes.' },
  { gameId: 'switch', label: 'Switch Challenge', category: 'Transformation Operators', questionCount: 3, description: 'Deduce numerical position switch codes between input and output.' },
  { gameId: 'deductive', label: 'Deductive Logic', category: 'GeoStudio Sudoku & Syllogisms', questionCount: 3, description: 'Solve Latin square geometrical Sudoku grids and syllogistic conclusions.' },
  { gameId: 'motion', label: 'Motion Challenge', category: 'Maze Navigation', questionCount: 2, description: 'Navigate tokens through obstacles to the target exit in minimal steps.' },
  { gameId: 'math', label: 'Digit Challenge', category: 'Numerical Constraints', questionCount: 3, description: 'Fill equation slots with unique digits 1–9 using left-to-right evaluation.' }
];

export const AssessmentPage: React.FC<AssessmentPageProps> = ({ onAssessmentComplete, onExit }) => {
  // Assessment Configuration: Standard 6-Minute Pace vs Rapid (35s) vs Standard (50s)
  const [speedMode, setSpeedMode] = useState<'standard_6m' | 'rapid' | 'standard'>('standard_6m');
  const questionTimeLimit = speedMode === 'standard_6m' ? 360 : speedMode === 'rapid' ? 35 : 50;

  const [phase, setPhase] = useState<'briefing' | 'playing' | 'transition'>('briefing');
  const [currentStageIdx, setCurrentStageIdx] = useState<number>(0);
  const [gameScores, setGameScores] = useState<Partial<Record<GameId, number>>>({});

  const currentStage = ASSESSMENT_ORDER[currentStageIdx];
  const [qCount, setQCount] = useState<number>(1);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(questionTimeLimit);
  const [isTimeExpiring, setIsTimeExpiring] = useState<boolean>(false);
  const [timeoutAlert, setTimeoutAlert] = useState<string | null>(null);

  // Active question objects
  const [activeInductive, setActiveInductive] = useState(generateInductiveQuestion('medium'));
  const [activeDeductive, setActiveDeductive] = useState(generateDeductiveQuestion('medium'));
  const [activeGrid, setActiveGrid] = useState(generateGridQuestion('medium'));
  const [activeSwitch, setActiveSwitch] = useState(generateSwitchPuzzle('medium'));
  const [activeMemory, setActiveMemory] = useState(generateMemoryPuzzle('medium', 1));
  const [activeAttention, setActiveAttention] = useState(generateAttentionQuestion('medium'));
  const [activeMath, setActiveMath] = useState(generateMathQuestion('medium'));
  const [activeMotion, setActiveMotion] = useState(generateMotionPuzzle(1));
  const [activeColorGrid, setActiveColorGrid] = useState(generateColorGridTask('medium', 1));

  const [selectedAns, setSelectedAns] = useState<any>(null);
  const timerRef = useRef<any>(null);

  // Per-Question Tight Countdown Clock
  useEffect(() => {
    if (phase !== 'playing') {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    setTimeLeft(questionTimeLimit);
    setIsTimeExpiring(false);
    setTimeoutAlert(null);

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 10) {
          setIsTimeExpiring(true);
        }
        if (prev <= 1) {
          // Strict Auto-Advance on Question Timeout
          clearInterval(timerRef.current!);
          handleQuestionTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, currentStageIdx, qCount]);

  const handleQuestionTimeout = () => {
    setTimeoutAlert("Time expired! 0 points for this question.");
    setTimeout(() => {
      setTimeoutAlert(null);
      advanceQuestion(false);
    }, 900);
  };

  const loadStageQuestion = (gameId: GameId, count: number) => {
    setSelectedAns(null);
    switch (gameId) {
      case 'inductive':
        setActiveInductive(generateInductiveQuestion('medium', count));
        break;
      case 'deductive':
        setActiveDeductive(generateDeductiveQuestion('medium', count));
        break;
      case 'grid':
        setActiveGrid(generateGridQuestion('medium'));
        break;
      case 'switch': {
        const p = generateSwitchPuzzle('medium');
        setActiveSwitch(p);
        break;
      }
      case 'memory':
        setActiveMemory(generateMemoryPuzzle('medium', count));
        break;
      case 'attention':
        setActiveAttention(generateAttentionQuestion('medium'));
        break;
      case 'math':
        setActiveMath(generateMathQuestion('medium'));
        break;
      case 'motion':
        setActiveMotion(generateMotionPuzzle(count));
        break;
      case 'color_grid':
        setActiveColorGrid(generateColorGridTask('medium', count));
        break;
    }
  };

  const advanceQuestion = (isCorrect: boolean) => {
    const updatedCorrect = isCorrect ? correctCount + 1 : correctCount;
    if (isCorrect) setCorrectCount(prev => prev + 1);

    if (qCount >= currentStage.questionCount) {
      completeCurrentStage(updatedCorrect);
    } else {
      setQCount(prev => prev + 1);
      loadStageQuestion(currentStage.gameId, qCount + 1);
    }
  };

  const completeCurrentStage = (finalCorrect: number) => {
    const accuracy = (finalCorrect / Math.max(1, currentStage.questionCount)) * 100;
    // Speed bonus calculation based on remaining time
    const speedBonus = timeLeft > 10 ? 10 : 0;
    const computedScore = Math.max(40, Math.min(100, Math.round(accuracy * 0.75 + speedBonus + 15)));

    const updatedScores = {
      ...gameScores,
      [currentStage.gameId]: computedScore
    };
    setGameScores(updatedScores);

    if (currentStageIdx < ASSESSMENT_ORDER.length - 1) {
      setPhase('transition');
    } else {
      finishAssessment(updatedScores as Record<GameId, number>);
    }
  };

  const startNextStage = () => {
    const nextIdx = currentStageIdx + 1;
    setCurrentStageIdx(nextIdx);
    setQCount(1);
    setCorrectCount(0);
    loadStageQuestion(ASSESSMENT_ORDER[nextIdx].gameId, 1);
    setPhase('playing');
  };

  const finishAssessment = (finalScores: Record<GameId, number>) => {
    const scoresArray = Object.values(finalScores);
    const overallScore = Math.round(scoresArray.reduce((a, b) => a + b, 0) / scoresArray.length);
    const percentile = calculatePercentile(overallScore);
    const archetype = determineArchetype(finalScores);
    const { strengths, weaknesses, recommendation } = rankStrengthsAndWeaknesses(finalScores);

    const result: AssessmentResult = {
      id: 'mock_res_' + Math.random().toString(36).substring(2, 9),
      overallScore,
      percentile,
      archetype,
      skillScores: finalScores,
      strengths,
      weaknesses,
      recommendation,
      completedAt: new Date().toISOString(),
      durationMin: speedMode === 'rapid' ? 8 : 12
    };

    recordAssessmentResult(result);
    confetti({ particleCount: 120, spread: 80 });
    onAssessmentComplete(result);
  };

  // ============================================================
  // 1. BRIEFING SCREEN (Clean, Serious, Speed Selector)
  // ============================================================
  if (phase === 'briefing') {
    return (
      <div style={{ padding: '60px 0', minHeight: 'calc(100vh - 76px)', display: 'flex', alignItems: 'center' }}>
        <div className="container-narrow">
          <div className="editorial-tile" style={{ padding: '48px 40px', background: '#FFFFFF', borderRadius: '24px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              fontWeight: 800,
              color: 'var(--accent-vermillion)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '16px'
            }}>
              <Zap size={16} />
              <span>QIVORA FULL BATTERY MOCK TEST</span>
            </div>

            <h1 style={{ fontSize: 'clamp(2.4rem, 5vw, 3.2rem)', fontWeight: 950, letterSpacing: '-0.04em', lineHeight: 1.08, marginBottom: '16px' }}>
              Standardized Cognitive Agility Battery
            </h1>

            <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', lineHeight: 1.55, marginBottom: '28px' }}>
              A high-intensity simulation testing all cognitive domains in sequence. Each challenge has a strict countdown timer matching competitive assessment standards.
            </p>

            {/* Time Mode Selection */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Select Assessment Pace (Standard 6-Min Format)
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
                {/* 6-Minute Official Pace (Default) */}
                <div
                  onClick={() => setSpeedMode('standard_6m')}
                  style={{
                    padding: '18px 16px',
                    borderRadius: '16px',
                    border: speedMode === 'standard_6m' ? '2.5px solid var(--accent-vermillion)' : '1.5px solid var(--border-subtle)',
                    background: speedMode === 'standard_6m' ? '#FFF8F6' : '#FAF8F5',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 900, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                        🏆 Standard 6-Min
                      </span>
                    </div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 950, color: 'var(--accent-vermillion)', marginBottom: '4px' }}>
                      6 Minutes
                    </div>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
                    Official 360s section duration as per enterprise test formats.
                  </div>
                </div>

                {/* Rapid Speed Option */}
                <div
                  onClick={() => setSpeedMode('rapid')}
                  style={{
                    padding: '18px 16px',
                    borderRadius: '16px',
                    border: speedMode === 'rapid' ? '2.5px solid var(--accent-vermillion)' : '1.5px solid var(--border-subtle)',
                    background: speedMode === 'rapid' ? '#FFF8F6' : '#FAF8F5',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 900, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                        ⚡ Rapid Mode
                      </span>
                    </div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 950, color: 'var(--text-primary)', marginBottom: '4px' }}>
                      35 Seconds
                    </div>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
                    High-pressure fast drills per question.
                  </div>
                </div>

                {/* Standard Pace Option */}
                <div
                  onClick={() => setSpeedMode('standard')}
                  style={{
                    padding: '18px 16px',
                    borderRadius: '16px',
                    border: speedMode === 'standard' ? '2.5px solid var(--accent-vermillion)' : '1.5px solid var(--border-subtle)',
                    background: speedMode === 'standard' ? '#FFF8F6' : '#FAF8F5',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 900, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                        Standard Pace
                      </span>
                    </div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 950, color: 'var(--text-primary)', marginBottom: '4px' }}>
                      50 Seconds
                    </div>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
                    Measured analytical speed per question.
                  </div>
                </div>
              </div>
            </div>

            {/* Test Rules List */}
            <div style={{
              background: 'var(--bg-main)',
              border: '1.5px solid var(--border-ink)',
              borderRadius: 'var(--radius-md)',
              padding: '22px 24px',
              marginBottom: '36px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.92rem', fontWeight: 700 }}>
                <ShieldCheck size={18} color="var(--accent-vermillion)" />
                <span><strong>7 Consecutive Stages:</strong> Inductive, Matrix Grid, Switch, Deductive, Memory, Attention, Math</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.92rem', fontWeight: 700 }}>
                <Timer size={18} color="var(--accent-vermillion)" />
                <span><strong>Strict Timer:</strong> {questionTimeLimit}s per question • Auto-skips with 0 points if time runs out</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.92rem', fontWeight: 700 }}>
                <CheckCircle2 size={18} color="var(--accent-vermillion)" />
                <span><strong>Instant Profiling:</strong> Automatically computes CQ Score, Speed Index, Percentile, & Weaknesses</span>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                className="btn-editorial-light"
                onClick={onExit}
              >
                Back to Dashboard
              </button>

              <button
                className="btn-vermillion"
                onClick={() => {
                  setPhase('playing');
                  setQCount(1);
                  setCorrectCount(0);
                  loadStageQuestion(currentStage.gameId, 1);
                }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <span>START MOCK TEST ({questionTimeLimit}s / Q)</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // 2. INTERSTITIAL BREATHER SCREEN (Between Game Stages)
  // ============================================================
  if (phase === 'transition') {
    const nextStage = ASSESSMENT_ORDER[currentStageIdx + 1];

    return (
      <div style={{ padding: '80px 0', minHeight: 'calc(100vh - 76px)', display: 'flex', alignItems: 'center' }}>
        <div className="container-narrow" style={{ textAlign: 'center' }}>
          <div className="editorial-tile" style={{ padding: '52px 40px', background: '#FFFFFF', borderRadius: '24px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              fontWeight: 800,
              color: 'var(--accent-vermillion)',
              textTransform: 'uppercase',
              marginBottom: '12px'
            }}>
              <span>Stage {currentStageIdx + 1} of {ASSESSMENT_ORDER.length} Complete</span>
            </div>

            <h2 style={{ fontSize: '2.5rem', fontWeight: 950, margin: '8px 0 10px 0', letterSpacing: '-0.03em' }}>
              Next: {nextStage.label}
            </h2>

            <div style={{
              display: 'inline-block',
              padding: '6px 16px',
              borderRadius: '9999px',
              background: '#FAF8F5',
              border: '1px solid #E7E5E4',
              fontSize: '0.82rem',
              fontWeight: 800,
              color: 'var(--text-secondary)',
              marginBottom: '20px'
            }}>
              {nextStage.category}
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '480px', margin: '0 auto 36px auto', lineHeight: 1.5 }}>
              {nextStage.description} You will have {questionTimeLimit}s per challenge.
            </p>

            <button className="btn-vermillion" onClick={startNextStage} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <span>CONTINUE TO {nextStage.label.toUpperCase()}</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // 3. HIGH-INTENSITY ASSESSMENT HUD & TEST CANVAS
  // ============================================================
  const timerPercentage = (timeLeft / questionTimeLimit) * 100;

  return (
    <div style={{ padding: '20px 0 60px 0' }}>
      <div className="container-narrow">
        {/* Top Assessment HUD */}
        <div style={{
          background: '#FFFFFF',
          border: '2px solid var(--border-ink)',
          borderRadius: '18px',
          boxShadow: 'var(--shadow-tactile-sm)',
          overflow: 'hidden',
          marginBottom: '24px'
        }}>
          {/* Status Bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 24px',
            borderBottom: '1px solid #F0EEE9'
          }}>
            <div>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                fontWeight: 900,
                color: 'var(--text-muted)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase'
              }}>
                STAGE {currentStageIdx + 1} OF {ASSESSMENT_ORDER.length} · {currentStage.category}
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 950, color: 'var(--text-primary)', marginTop: '2px' }}>
                {currentStage.label}
              </div>
            </div>

            {/* Question Counter Dots */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {Array.from({ length: currentStage.questionCount }).map((_, idx) => (
                  <div
                    key={idx}
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: idx + 1 === qCount ? 'var(--accent-vermillion)' : idx + 1 < qCount ? '#10B981' : '#E7E5E4',
                      border: '1.5px solid #141312',
                      transition: 'all 0.15s ease'
                    }}
                    title={`Question ${idx + 1}`}
                  />
                ))}
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-secondary)' }}>
                Q {qCount}/{currentStage.questionCount}
              </span>
            </div>

            {/* Countdown Badge with Alert Warning */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: 'var(--font-mono)',
              fontSize: '1.15rem',
              fontWeight: 900,
              padding: '6px 14px',
              borderRadius: '9999px',
              border: '2px solid #141312',
              background: isTimeExpiring ? '#FEE2E2' : '#FAF8F5',
              color: isTimeExpiring ? '#DC2626' : 'var(--text-primary)',
              boxShadow: isTimeExpiring ? '0 0 10px rgba(239, 68, 68, 0.4)' : 'none',
              animation: isTimeExpiring ? 'pulse 1s infinite' : 'none'
            }}>
              <Timer size={18} color={isTimeExpiring ? '#DC2626' : 'var(--accent-vermillion)'} />
              <span>00:{timeLeft.toString().padStart(2, '0')}s</span>
            </div>
          </div>

          {/* Dynamic Shrinking Progress Bar */}
          <div style={{ height: '6px', width: '100%', background: '#F0EEE9' }}>
            <div style={{
              height: '100%',
              width: `${timerPercentage}%`,
              background: timeLeft <= 10 ? '#EF4444' : timeLeft <= 18 ? '#F59E0B' : '#10B981',
              transition: 'width 1s linear, background-color 0.3s ease'
            }} />
          </div>
        </div>

        {/* Timeout Toast Alert */}
        {timeoutAlert && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '12px',
            borderRadius: '12px',
            background: '#FEE2E2',
            border: '2px solid #EF4444',
            color: '#B91C1C',
            fontWeight: 900,
            fontSize: '0.92rem',
            marginBottom: '16px',
            animation: 'shake 0.3s ease'
          }}>
            <AlertTriangle size={18} />
            <span>{timeoutAlert}</span>
          </div>
        )}

        {/* Main Centered Game Arena */}
        <div className="editorial-tile" style={{ padding: '40px 36px', background: '#FFFFFF', minHeight: '460px', borderRadius: '24px' }}>
          {currentStage.gameId === 'inductive' && (
            <InductiveRenderer
              question={activeInductive}
              selectedOptionIndex={selectedAns}
              onSelectOption={idx => {
                setSelectedAns(idx);
                advanceQuestion(idx === activeInductive.correctOptionIndex);
              }}
            />
          )}

          {currentStage.gameId === 'grid' && (
            <GridRenderer
              question={activeGrid}
              selectedOptionIndex={selectedAns}
              onSelectOption={idx => {
                setSelectedAns(idx);
                if (activeGrid.isYesNo) {
                  advanceQuestion(idx === 0);
                } else {
                  advanceQuestion(idx === activeGrid.correctOptionIndex);
                }
              }}
              onSelectYesNo={choice => {
                advanceQuestion(choice === activeGrid.correctAnswerBool);
              }}
            />
          )}

          {currentStage.gameId === 'switch' && (
            <SwitchRenderer
              puzzle={activeSwitch}
              selectedSwitchIndex={selectedAns}
              onSelectSwitch={idx => {
                setSelectedAns(idx);
                advanceQuestion(idx === activeSwitch.correctSwitchIndex);
              }}
            />
          )}

          {currentStage.gameId === 'deductive' && (
            <DeductiveRenderer
              question={activeDeductive}
              selectedOptionIndex={selectedAns}
              onSelectOption={idx => {
                setSelectedAns(idx);
                advanceQuestion(idx === activeDeductive.correctOptionIndex);
              }}
            />
          )}

          {currentStage.gameId === 'memory' && (
            <MemoryRenderer
              puzzle={activeMemory}
              onSubmitAnswer={cells => {
                const targetSet = new Set(activeMemory.targetSequence ?? []);
                const matches = cells.filter(c => targetSet.has(c)).length;
                advanceQuestion(matches === (activeMemory.targetSequence?.length ?? 0));
              }}
            />
          )}

          {currentStage.gameId === 'attention' && (
            <AttentionRenderer
              question={activeAttention}
              onSelectIndex={idx => {
                advanceQuestion(idx === activeAttention.targetIndex);
              }}
            />
          )}

          {currentStage.gameId === 'math' && (
            <MathRenderer
              question={activeMath}
              onSelectAnswer={ans => {
                setSelectedAns(ans);
                advanceQuestion(ans === activeMath.target);
              }}
            />
          )}

          {currentStage.gameId === 'color_grid' && (
            <ColorGridRenderer
              task={activeColorGrid}
              onComplete={success => {
                advanceQuestion(success);
              }}
            />
          )}

          {currentStage.gameId === 'motion' && (
            <MotionRenderer
              puzzle={activeMotion}
              onSolved={() => advanceQuestion(true)}
            />
          )}

          {/* Quick Skip Control for assessment candidates */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: '32px',
            paddingTop: '20px',
            borderTop: '1px solid #F0EEE9'
          }}>
            <button
              onClick={() => advanceQuestion(false)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'transparent',
                border: 'none',
                color: '#A8A29E',
                fontSize: '0.85rem',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'color 0.15s ease'
              }}
            >
              <span>Skip Question (0 pts)</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
