import React, { useState, useEffect, useRef } from 'react';
import { MemoryInterferenceTask, InterferenceTask, MEMORY_SYMBOLS } from '../../engine/generators/memoryGenerator';

interface MemoryRendererProps {
  puzzle: MemoryInterferenceTask;
  onSubmitAnswer: (userSequence: number[], interferenceScore?: number) => void;
  showExplanation?: boolean;
  isDemo?: boolean;
}

type Phase = 'dot' | 'interference' | 'delay' | 'recall' | 'result';

export const MemoryRenderer: React.FC<MemoryRendererProps> = ({
  puzzle,
  onSubmitAnswer,
  showExplanation = false,
  isDemo = false,
}) => {
  const [phase, setPhase] = useState<Phase>('dot');
  const [stepIdx, setStepIdx] = useState<number>(0);
  const [interferenceTimeLeft, setInterferenceTimeLeft] = useState<number>(puzzle.interferenceTimeLimitSec);
  const [userInterferenceAnswers, setUserInterferenceAnswers] = useState<boolean[]>([]);
  const [userRecallSequence, setUserRecallSequence] = useState<number[]>([]);
  const [digitInput, setDigitInput] = useState<string>('');
  const [userSymbolRecall, setUserSymbolRecall] = useState<string[]>([]);
  const [delayCountdown, setDelayCountdown] = useState<number>(puzzle.delaySeconds || 3);
  const [demoBanner, setDemoBanner] = useState<string | null>(null);

  const phaseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isDigitMode = puzzle.subtype === 'digit_span';
  const isSymbolMode = puzzle.subtype === 'sequence_recall';
  const totalSteps = isDigitMode ? (puzzle.digitSequence?.length || 0) : isSymbolMode ? (puzzle.symbolSequence?.length || 0) : puzzle.steps.length;

  useEffect(() => {
    setPhase('dot');
    setStepIdx(0);
    setUserInterferenceAnswers([]);
    setUserRecallSequence([]);
    setUserSymbolRecall([]);
    setDigitInput('');
    setDemoBanner(null);

    runPhaseCycle(0);

    return () => {
      clearAllTimers();
    };
  }, [puzzle.id, isDemo]);

  const clearAllTimers = () => {
    if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
  };

  const runPhaseCycle = (step: number) => {
    clearAllTimers();

    if (step >= totalSteps) {
      if (puzzle.subtype === 'delayed_recall') {
        setPhase('delay');
        setDelayCountdown(puzzle.delaySeconds || 3);
        let count = puzzle.delaySeconds || 3;
        countdownIntervalRef.current = setInterval(() => {
          count -= 1;
          setDelayCountdown(count);
          if (count <= 0) {
            clearInterval(countdownIntervalRef.current!);
            startRecallPhase();
          }
        }, 1000);
      } else {
        startRecallPhase();
      }
      return;
    }

    // Step A: Display item (dot, digit, or symbol)
    setPhase('dot');
    setStepIdx(step);
    if (isDemo) {
      if (isDigitMode) {
        setDemoBanner(`🤖 Qivora AI: Memorizing digit #${step + 1} (${puzzle.digitSequence?.[step]})...`);
      } else if (isSymbolMode) {
        setDemoBanner(`🤖 Qivora AI: Memorizing symbol #${step + 1} (${puzzle.symbolSequence?.[step]})...`);
      } else {
        setDemoBanner(`🤖 Qivora AI: Encoding Dot #${step + 1} at position ${puzzle.steps[step]?.dotPosition + 1}...`);
      }
    }

    const duration = isDigitMode || isSymbolMode ? 1100 : puzzle.displayDotDurationMs;

    phaseTimerRef.current = setTimeout(() => {
      if (puzzle.subtype === 'interference_task') {
        // Step B: Transition to Interference Task
        setPhase('interference');
        setInterferenceTimeLeft(puzzle.interferenceTimeLimitSec);

        if (isDemo) {
          const correctAns = puzzle.steps[step].interference.correctAnswer;
          setDemoBanner(`🤖 Qivora AI Distraction Task: "${puzzle.steps[step].interference.questionPrompt}" -> Evaluating ${correctAns ? 'YES' : 'NO'}`);
          phaseTimerRef.current = setTimeout(() => {
            handleInterferenceSubmit(correctAns, step);
          }, 1200);
        } else {
          countdownIntervalRef.current = setInterval(() => {
            setInterferenceTimeLeft(prev => {
              if (prev <= 0.5) {
                clearInterval(countdownIntervalRef.current!);
                handleInterferenceSubmit(false, step);
                return 0;
              }
              return Math.round((prev - 0.5) * 10) / 10;
            });
          }, 500);
        }
      } else {
        // Proceed to next item directly
        runPhaseCycle(step + 1);
      }
    }, duration);
  };

  const startRecallPhase = () => {
    setPhase('recall');
    if (isDemo) {
      if (isDigitMode) {
        setDemoBanner(`🤖 Qivora AI: Recalling digit sequence in ${puzzle.recallDirection} order...`);
        phaseTimerRef.current = setTimeout(() => {
          const res = (puzzle.targetSequence || []).join('');
          setDigitInput(res);
          setDemoBanner(`🤖 Qivora AI: Reconstructed digits [${res}] with 100% fidelity.`);
        }, 1200);
      } else if (isSymbolMode) {
        setDemoBanner(`🤖 Qivora AI: Recalling symbol sequence [${puzzle.symbolSequence?.join(' ')}]...`);
        phaseTimerRef.current = setTimeout(() => {
          const syms = puzzle.symbolSequence || [];
          setUserSymbolRecall(syms);
          const indices = syms.map(s => MEMORY_SYMBOLS.indexOf(s));
          setUserRecallSequence(indices);
          setDemoBanner(`🤖 Qivora AI: Reconstructed symbol sequence with 100% fidelity.`);
        }, 1200);
      } else {
        setDemoBanner(`🤖 Qivora AI: Recalling sequential locations [${puzzle.targetSequence.map(p => p + 1).join(', ')}]...`);
        phaseTimerRef.current = setTimeout(() => {
          setUserRecallSequence(puzzle.targetSequence);
          setDemoBanner(`🤖 Qivora AI: Finished sequence recall with 100% precision.`);
        }, 1200);
      }
    }
  };

  const handleInterferenceSubmit = (answer: boolean, step: number) => {
    clearAllTimers();
    setUserInterferenceAnswers(prev => [...prev, answer]);
    runPhaseCycle(step + 1);
  };

  const handleCellClick = (cellIdx: number) => {
    if (phase !== 'recall' || isDemo) return;

    if (userRecallSequence.includes(cellIdx)) {
      setUserRecallSequence(prev => prev.filter(c => c !== cellIdx));
    } else {
      if (userRecallSequence.length < puzzle.targetSequence.length) {
        const nextSeq = [...userRecallSequence, cellIdx];
        setUserRecallSequence(nextSeq);
        if (nextSeq.length === puzzle.targetSequence.length) {
          submitFinalAnswer(nextSeq);
        }
      }
    }
  };

  const handleDigitNumpad = (digit: number) => {
    if (phase !== 'recall' || isDemo) return;
    const nextStr = digitInput + digit;
    setDigitInput(nextStr);
    if (nextStr.length === (puzzle.digitSequence?.length || 0)) {
      const parsed = nextStr.split('').map(Number);
      setUserRecallSequence(parsed);
      submitFinalAnswer(parsed);
    }
  };

  const handleSymbolTap = (sym: string) => {
    if (phase !== 'recall' || isDemo) return;
    const nextList = [...userSymbolRecall, sym];
    setUserSymbolRecall(nextList);

    if (nextList.length === (puzzle.symbolSequence?.length || 0)) {
      const indices = nextList.map(s => MEMORY_SYMBOLS.indexOf(s));
      setUserRecallSequence(indices);
      submitFinalAnswer(indices);
    }
  };

  const submitFinalAnswer = (recallSeq: number[]) => {
    let interScore = 1;
    if (puzzle.subtype === 'interference_task' && puzzle.steps.length > 0) {
      const correctInter = puzzle.steps.filter((s, i) => userInterferenceAnswers[i] === s.interference.correctAnswer).length;
      interScore = correctInter / puzzle.steps.length;
    }
    onSubmitAnswer(recallSeq, interScore);
  };

  const gridSize = puzzle.gridSize || 4;
  const currentInterference = puzzle.steps[stepIdx]?.interference;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      maxWidth: '480px',
      margin: '0 auto',
      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif"
    }}>
      {/* ── Level & Subtype Header ─────────────────────────────── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: '12px'
      }}>
        <span style={{
          fontSize: '0.78rem',
          fontWeight: 800,
          color: '#4F46E5',
          background: '#EEF2FF',
          padding: '4px 12px',
          borderRadius: '20px',
          textTransform: 'uppercase'
        }}>
          {puzzle.subtype.replace('_', ' ')} • LVL {puzzle.level}
        </span>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B' }}>
          {phase === 'dot' ? `Memorize (${stepIdx + 1}/${totalSteps})` :
           phase === 'interference' ? 'Distraction Task' :
           phase === 'delay' ? 'Retention Delay' :
           'Active Recall'}
        </span>
      </div>

      {/* ── PHASE 1: DISPLAY ITEM / FLASH ─────────────────────── */}
      {phase === 'dot' && (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {isSymbolMode ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
              margin: '20px 0'
            }}>
              <div style={{
                width: '180px',
                height: '180px',
                borderRadius: '24px',
                background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '5rem',
                color: '#FFFFFF',
                boxShadow: '0 12px 36px rgba(79,70,229,0.4)',
                border: '2px solid rgba(255,255,255,0.3)',
                animation: 'pulse 0.6s ease'
              }}>
                {puzzle.symbolSequence?.[stepIdx]}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {puzzle.symbolSequence?.map((_, s) => (
                  <div
                    key={s}
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: s === stepIdx ? '#4F46E5' : s < stepIdx ? '#A5B4FC' : '#E2E8F0',
                      transition: 'all 0.2s ease'
                    }}
                  />
                ))}
              </div>
            </div>
          ) : isDigitMode ? (
            <div style={{
              width: '180px',
              height: '180px',
              borderRadius: '24px',
              background: '#4F46E5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '4.5rem',
              fontWeight: 900,
              color: '#FFFFFF',
              boxShadow: '0 8px 30px rgba(79,70,229,0.35)',
              margin: '20px 0'
            }}>
              {puzzle.digitSequence?.[stepIdx]}
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
              gap: '8px',
              width: '280px',
              height: '280px',
              padding: '12px',
              background: '#F1F5F9',
              borderRadius: '16px',
              border: '2px solid #E2E8F0'
            }}>
              {Array.from({ length: gridSize * gridSize }, (_, idx) => {
                const isTargetDot = puzzle.steps[stepIdx]?.dotPosition === idx;
                return (
                  <div
                    key={idx}
                    style={{
                      borderRadius: '10px',
                      background: isTargetDot ? '#4F46E5' : '#FFFFFF',
                      border: isTargetDot ? '2px solid #3730A3' : '1px solid #CBD5E1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.1s ease',
                      boxShadow: isTargetDot ? '0 0 14px rgba(79,70,229,0.6)' : 'none'
                    }}
                  >
                    {isTargetDot && (
                      <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#FFFFFF' }} />
                    )}
                  </div>
                );
              })}
            </div>
          )}
          <div style={{ marginTop: '12px', fontSize: '0.85rem', fontWeight: 700, color: '#4F46E5' }}>
            ✦ Memorize this {isSymbolMode ? 'symbol' : isDigitMode ? 'digit' : 'dot position'}...
          </div>
        </div>
      )}

      {/* ── PHASE 2: INTERFERENCE DISTRACTOR TASK ──────────────── */}
      {phase === 'interference' && currentInterference && (
        <div style={{
          width: '100%',
          padding: '16px',
          background: '#F8FAFC',
          borderRadius: '16px',
          border: '2px solid #E2E8F0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#EF4444' }}>
              DISTRACTION TASK (INTERFERENCE)
            </span>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#DC2626' }}>
              ⏱ {interferenceTimeLeft}s
            </span>
          </div>

          <div style={{ fontSize: '0.96rem', fontWeight: 800, color: '#1E293B', textAlign: 'center' }}>
            {currentInterference.questionPrompt}
          </div>

          {currentInterference.type === 'symmetry' && currentInterference.visualData?.grid && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '4px',
              width: '140px',
              height: '140px',
              padding: '8px',
              background: '#FFFFFF',
              borderRadius: '10px',
              border: '1.5px solid #CBD5E1'
            }}>
              {currentInterference.visualData.grid.flat().map((filled: boolean, i: number) => (
                <div
                  key={i}
                  style={{
                    borderRadius: '4px',
                    background: filled ? '#1E293B' : '#F1F5F9'
                  }}
                />
              ))}
            </div>
          )}

          <div style={{ display: 'flex', gap: '14px', width: '100%', marginTop: '8px' }}>
            <button
              onClick={() => handleInterferenceSubmit(true, stepIdx)}
              disabled={isDemo}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '10px',
                background: '#10B981',
                color: '#FFFFFF',
                border: 'none',
                fontWeight: 800,
                fontSize: '1rem',
                cursor: isDemo ? 'default' : 'pointer'
              }}
            >
              YES / TRUE
            </button>
            <button
              onClick={() => handleInterferenceSubmit(false, stepIdx)}
              disabled={isDemo}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '10px',
                background: '#EF4444',
                color: '#FFFFFF',
                border: 'none',
                fontWeight: 800,
                fontSize: '1rem',
                cursor: isDemo ? 'default' : 'pointer'
              }}
            >
              NO / FALSE
            </button>
          </div>
        </div>
      )}

      {/* ── PHASE 2.5: RETENTION DELAY COUNTDOWN ──────────────── */}
      {phase === 'delay' && (
        <div style={{
          width: '100%',
          padding: '30px',
          background: '#EEF2FF',
          borderRadius: '16px',
          border: '2px solid #C7D2FE',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#4338CA', textTransform: 'uppercase' }}>
            ⏳ Maintain Memory Buffer...
          </div>
          <div style={{ fontSize: '3rem', fontWeight: 900, color: '#3730A3' }}>
            {delayCountdown}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#6366F1' }}>
            Hold spatial representation in working memory
          </div>
        </div>
      )}

      {/* ── PHASE 3: RECALL PHASE ─────────────────────────────── */}
      {phase === 'recall' && (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {isSymbolMode ? (
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <div style={{
                fontSize: '0.85rem',
                fontWeight: 800,
                color: '#4F46E5',
                background: '#EEF2FF',
                padding: '6px 14px',
                borderRadius: '20px'
              }}>
                REPRODUCE SYMBOL SEQUENCE ({userSymbolRecall.length}/{(puzzle.symbolSequence?.length || 0)})
              </div>

              {/* Target Slots */}
              <div style={{
                display: 'flex',
                gap: '8px',
                padding: '12px 18px',
                background: '#F8FAFC',
                borderRadius: '16px',
                border: '2px solid #CBD5E1',
                minHeight: '68px',
                alignItems: 'center',
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}>
                {Array.from({ length: puzzle.symbolSequence?.length || 0 }).map((_, idx) => {
                  const sym = userSymbolRecall[idx];
                  return (
                    <div
                      key={idx}
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '10px',
                        background: sym ? '#4F46E5' : '#FFFFFF',
                        border: sym ? '2px solid #3730A3' : '2px dashed #94A3B8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.6rem',
                        color: sym ? '#FFFFFF' : '#CBD5E1',
                        fontWeight: 900,
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {sym || '?'}
                    </div>
                  );
                })}
              </div>

              {/* Symbol Bank Keypad */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 60px)', gap: '10px' }}>
                {MEMORY_SYMBOLS.map((sym) => (
                  <button
                    key={sym}
                    onClick={() => handleSymbolTap(sym)}
                    disabled={isDemo}
                    style={{
                      height: '56px',
                      borderRadius: '12px',
                      background: '#FFFFFF',
                      border: '2px solid #E2E8F0',
                      fontSize: '1.8rem',
                      color: '#1E293B',
                      cursor: isDemo ? 'default' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
                      transition: 'transform 0.1s ease, border-color 0.1s ease'
                    }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = '#4F46E5')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = '#E2E8F0')}
                  >
                    {sym}
                  </button>
                ))}
              </div>

              {/* Clear / Backspace Button */}
              {userSymbolRecall.length > 0 && !isDemo && (
                <button
                  onClick={() => {
                    const next = userSymbolRecall.slice(0, -1);
                    setUserSymbolRecall(next);
                  }}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '20px',
                    background: '#F1F5F9',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    color: '#64748B',
                    cursor: 'pointer'
                  }}
                >
                  ⌫ Backspace
                </button>
              )}
            </div>
          ) : isDigitMode ? (
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
              <div style={{
                fontSize: '0.85rem',
                fontWeight: 800,
                color: '#4F46E5',
                background: '#EEF2FF',
                padding: '6px 14px',
                borderRadius: '20px'
              }}>
                RECALL IN {puzzle.recallDirection?.toUpperCase()} ORDER
              </div>
              <div style={{
                width: '100%',
                padding: '14px',
                background: '#F8FAFC',
                borderRadius: '12px',
                border: '2px solid #CBD5E1',
                fontSize: '1.8rem',
                fontWeight: 900,
                textAlign: 'center',
                letterSpacing: '0.25em',
                fontFamily: 'monospace',
                minHeight: '58px',
                color: '#1E293B'
              }}>
                {digitInput || '—'}
              </div>

              {/* Numpad */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 70px)', gap: '10px' }}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleDigitNumpad(num)}
                    disabled={isDemo}
                    style={{
                      height: '52px',
                      borderRadius: '10px',
                      background: '#FFFFFF',
                      border: '1.5px solid #E2E8F0',
                      fontSize: '1.25rem',
                      fontWeight: 800,
                      color: '#1E293B',
                      cursor: isDemo ? 'default' : 'pointer',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
                    }}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                gap: '8px',
                width: '280px',
                height: '280px',
                padding: '12px',
                background: '#F1F5F9',
                borderRadius: '16px',
                border: '2px solid #E2E8F0'
              }}>
                {Array.from({ length: gridSize * gridSize }, (_, idx) => {
                  const clickOrder = userRecallSequence.indexOf(idx);
                  const isSelected = clickOrder !== -1;
                  const isCorrectPos = showExplanation && puzzle.targetSequence.includes(idx);
                  return (
                    <button
                      key={idx}
                      onClick={() => handleCellClick(idx)}
                      disabled={isDemo}
                      style={{
                        borderRadius: '10px',
                        background: isCorrectPos ? '#10B981' : isSelected ? '#4F46E5' : '#FFFFFF',
                        border: isSelected ? '2px solid #3730A3' : '1px solid #CBD5E1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: isDemo ? 'default' : 'pointer',
                        fontSize: '1rem',
                        fontWeight: 900,
                        color: '#FFFFFF',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {isSelected && (clickOrder + 1)}
                    </button>
                  );
                })}
              </div>
              <div style={{ marginTop: '10px', fontSize: '0.82rem', fontWeight: 700, color: '#64748B' }}>
                Select {puzzle.targetSequence.length - userRecallSequence.length} more target positions in order
              </div>
            </>
          )}
        </div>
      )}

      {/* ── AI Demo Banner ───────────────────────────────────── */}
      {demoBanner && (
        <div style={{
          marginTop: '16px',
          width: '100%',
          padding: '10px 14px',
          background: '#EFF6FF',
          border: '1.5px solid #3B82F6',
          borderRadius: '10px',
          fontSize: '0.84rem',
          color: '#1E40AF',
          lineHeight: 1.5
        }}>
          {demoBanner}
        </div>
      )}

      {showExplanation && (
        <div style={{
          marginTop: '16px',
          width: '100%',
          padding: '12px 16px',
          background: '#ECFDF5',
          border: '1.5px solid #10B981',
          borderRadius: '12px',
          fontSize: '0.86rem',
          color: '#065F46',
          lineHeight: 1.5
        }}>
          <strong>✓ Memory Strategy:</strong> {puzzle.explanation}
        </div>
      )}
    </div>
  );
};
