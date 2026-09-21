import React, { useState, useEffect, useRef } from 'react';
import { MathTask, validateMathSubmission } from '../../engine/generators/mathGenerator';

interface MathRendererProps {
  question: MathTask;
  selectedAnswer?: number | null;
  onSelectAnswer: (ans: number) => void;
  showExplanation?: boolean;
  isDemo?: boolean;
}

export const MathRenderer: React.FC<MathRendererProps> = ({
  question,
  onSelectAnswer,
  showExplanation = false,
  isDemo = false,
}) => {
  // State for Digit Equation subtype
  const [slots, setSlots] = useState<(number | null)[]>([]);
  const [activeSlotIdx, setActiveSlotIdx] = useState<number>(0);
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null);

  // State for Series & Comparison options
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const demoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setSelectedOption(null);
    setFeedback(null);

    if (question.subtype === 'digit_equation') {
      const initial = question.prefilledSlots.length > 0
        ? [...question.prefilledSlots]
        : Array(question.totalSlots).fill(null);
      setSlots(initial);

      const firstEmpty = initial.findIndex(s => s === null);
      setActiveSlotIdx(firstEmpty !== -1 ? firstEmpty : 0);

      // AI Demo solver for digit equation
      if (isDemo && question.aiDemoSteps.length > 0) {
        let step = 0;
        const runNextStep = () => {
          if (step < question.aiDemoSteps.length) {
            const action = question.aiDemoSteps[step];
            setActiveSlotIdx(action.slotIndex);

            demoTimerRef.current = setTimeout(() => {
              setSlots(prev => {
                const updated = [...prev];
                updated[action.slotIndex] = action.digit;
                return updated;
              });
              setFeedback({ ok: true, msg: `🤖 Qivora AI: ${action.rationale}` });
              step++;
              demoTimerRef.current = setTimeout(runNextStep, 900);
            }, 700);
          } else {
            demoTimerRef.current = setTimeout(() => {
              setFeedback({ ok: true, msg: `✓ Evaluates exactly to target ${question.target}!` });
              onSelectAnswer(question.target);
            }, 800);
          }
        };
        demoTimerRef.current = setTimeout(runNextStep, 500);
      }
    } else if (question.subtype === 'number_series') {
      // AI Demo solver for number series
      if (isDemo && question.correctOptionIndex !== undefined) {
        demoTimerRef.current = setTimeout(() => {
          setSelectedOption(question.correctOptionIndex!);
          onSelectAnswer(question.correctSeriesAnswer || 0);
        }, 1400);
      }
    } else if (question.subtype === 'rapid_comparison') {
      // AI Demo solver for rapid comparison
      if (isDemo && question.correctComparisonIndex !== undefined) {
        demoTimerRef.current = setTimeout(() => {
          setSelectedOption(question.correctComparisonIndex!);
          onSelectAnswer(question.correctComparisonIndex!);
        }, 1400);
      }
    }

    return () => {
      if (demoTimerRef.current) clearTimeout(demoTimerRef.current);
    };
  }, [question.id, isDemo]);

  // Handle Digit Numpad tap
  const handleDigitTap = (digit: number) => {
    if (isDemo) return;

    if (question.prefilledSlots[activeSlotIdx] !== null) {
      const nextAvailable = slots.findIndex((s, idx) => s === null && question.prefilledSlots[idx] === null);
      if (nextAvailable === -1) return;
      setActiveSlotIdx(nextAvailable);
    }

    const next = [...slots];
    next[activeSlotIdx] = digit;
    setSlots(next);

    const nextEmpty = next.findIndex((s, idx) => s === null && question.prefilledSlots[idx] === null);
    if (nextEmpty !== -1) {
      setActiveSlotIdx(nextEmpty);
      setFeedback(null);
    } else {
      const res = validateMathSubmission(next, question);
      setFeedback({ ok: res.isCorrect, msg: res.message });
      if (res.isCorrect) {
        setTimeout(() => onSelectAnswer(question.target), 600);
      }
    }
  };

  const handleClear = () => {
    if (isDemo) return;
    const initial = [...question.prefilledSlots];
    setSlots(initial);
    const firstEmpty = initial.findIndex(s => s === null);
    setActiveSlotIdx(firstEmpty !== -1 ? firstEmpty : 0);
    setFeedback(null);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      width: '100%',
      maxWidth: '640px',
      margin: '0 auto',
      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif"
    }}>
      {/* ── Subtype Header ────────────────────────────────────── */}
      <div style={{
        background: '#FFFDF9',
        border: '1.5px solid #F3ECE1',
        borderRadius: '16px',
        padding: '16px 22px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <div style={{
            fontSize: '0.72rem',
            fontWeight: 800,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#9CA3AF',
            marginBottom: '4px'
          }}>
            NUMERICAL REASONING // {question.subtypeName}
          </div>
          <div style={{ fontSize: '1.02rem', fontWeight: 800, color: '#141312' }}>
            {question.prompt}
          </div>
        </div>
        {isDemo && (
          <span style={{
            padding: '4px 10px',
            borderRadius: '12px',
            background: '#FEE2E2',
            color: '#DC2626',
            fontSize: '0.72rem',
            fontWeight: 800,
            textTransform: 'uppercase'
          }}>
            AI Demo Play
          </span>
        )}
      </div>

      {/* ── SUBTYPE 1: DIGIT CHALLENGE (EQUATION SLOTS + NUMPAD) ─ */}
      {question.subtype === 'digit_equation' && (
        <div style={{
          background: '#F9FAFB',
          border: '1.5px solid #E5E7EB',
          borderRadius: '20px',
          padding: '24px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
        }}>
          {/* Main Equation Box (Matching Image 1 & 2 device frame) */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: '#E5E7EB',
            padding: '12px 20px',
            borderRadius: '14px',
            border: '1px solid #D1D5DB'
          }}>
            {slots.map((val, sIdx) => {
              const isLocked = question.prefilledSlots[sIdx] !== null;
              const isActive = activeSlotIdx === sIdx && !isLocked;
              const op = question.operators[sIdx];

              return (
                <React.Fragment key={sIdx}>
                  <div
                    onClick={() => !isLocked && !isDemo && setActiveSlotIdx(sIdx)}
                    style={{
                      width: '46px',
                      height: '56px',
                      borderRadius: '8px',
                      background: val !== null || isActive ? '#374151' : '#9CA3AF',
                      border: isActive ? '2.5px solid #F97316' : '1px solid #4B5563',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.6rem',
                      fontWeight: 900,
                      color: '#FFFFFF',
                      cursor: isLocked || isDemo ? 'default' : 'pointer',
                      boxShadow: isActive ? '0 0 0 3px rgba(249,115,22,0.3)' : 'inset 0 2px 4px rgba(0,0,0,0.2)',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {val !== null ? val : ''}
                  </div>
                  {op && (
                    <span style={{ fontSize: '1.3rem', fontWeight: 900, color: '#374151' }}>
                      {op}
                    </span>
                  )}
                </React.Fragment>
              );
            })}

            <span style={{ fontSize: '1.3rem', fontWeight: 900, color: '#374151', margin: '0 2px' }}>=</span>

            <div style={{
              fontSize: '1.6rem',
              fontWeight: 900,
              color: '#1F2937',
              paddingLeft: '4px'
            }}>
              {question.target}
            </div>
          </div>

          {/* Feedback message */}
          {feedback && (
            <div style={{
              fontSize: '0.88rem',
              fontWeight: 800,
              color: feedback.ok ? '#16A34A' : '#DC2626',
              background: feedback.ok ? '#DCFCE7' : '#FEE2E2',
              padding: '8px 16px',
              borderRadius: '20px'
            }}>
              {feedback.msg}
            </div>
          )}

          {/* Unavailable Digits Hint if applicable */}
          {question.unavailableDigits && question.unavailableDigits.length > 0 && (
            <div style={{
              fontSize: '0.78rem',
              fontWeight: 700,
              color: '#DC2626',
              background: '#FEF2F2',
              padding: '4px 12px',
              borderRadius: '8px',
              border: '1px solid #FECACA'
            }}>
              Unavailable Digits: {question.unavailableDigits.join(', ')}
            </div>
          )}

          {/* 3x3 Keypad (1–9) with disabled/blank tiles + Trash button */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            alignItems: 'center',
            background: '#F3F4F6',
            padding: '12px',
            borderRadius: '16px',
            border: '1px solid #E5E7EB'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 72px)',
              gridTemplateRows: 'repeat(3, 56px)',
              gap: '8px'
            }}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => {
                const isUnavailable = question.unavailableDigits?.includes(num);
                const isAlreadyUsed = slots.includes(num);

                if (isUnavailable) {
                  return (
                    <div
                      key={num}
                      style={{
                        height: '56px',
                        borderRadius: '10px',
                        background: '#E5E7EB',
                        border: '1px dashed #D1D5DB'
                      }}
                    />
                  );
                }

                return (
                  <button
                    key={num}
                    onClick={() => handleDigitTap(num)}
                    disabled={isDemo || isAlreadyUsed}
                    style={{
                      height: '56px',
                      borderRadius: '10px',
                      border: isAlreadyUsed ? '1px solid #E5E7EB' : '1px solid #D1D5DB',
                      background: isAlreadyUsed ? '#E5E7EB' : '#FFFFFF',
                      fontSize: '1.4rem',
                      fontWeight: 700,
                      color: isAlreadyUsed ? '#9CA3AF' : '#374151',
                      cursor: isDemo || isAlreadyUsed ? 'default' : 'pointer',
                      boxShadow: isAlreadyUsed ? 'none' : '0 2px 4px rgba(0,0,0,0.06)',
                      transition: 'all 0.1s ease'
                    }}
                    onMouseEnter={e => !isDemo && !isAlreadyUsed && (e.currentTarget.style.background = '#F9FAFB')}
                    onMouseLeave={e => !isDemo && !isAlreadyUsed && (e.currentTarget.style.background = '#FFFFFF')}
                  >
                    {num}
                  </button>
                );
              })}
            </div>

            {/* Trash button spanning keypad width (matching Image 1 & 2) */}
            <button
              onClick={handleClear}
              disabled={isDemo}
              title="Clear all digit inputs"
              style={{
                width: '100%',
                height: '46px',
                borderRadius: '10px',
                border: '1px solid #D1D5DB',
                background: '#FFFFFF',
                color: '#6B7280',
                fontSize: '1.2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: isDemo ? 'default' : 'pointer',
                boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
                transition: 'all 0.1s ease'
              }}
              onMouseEnter={e => !isDemo && (e.currentTarget.style.background = '#FEE2E2')}
              onMouseLeave={e => !isDemo && (e.currentTarget.style.background = '#FFFFFF')}
            >
              🗑
            </button>
          </div>
        </div>
      )}

      {/* ── SUBTYPE 2: NUMBER SERIES & PROGRESSION ───────────── */}
      {question.subtype === 'number_series' && question.series && (
        <div style={{
          background: '#FFFFFF',
          border: '1.5px solid #E2E8F0',
          borderRadius: '16px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
        }}>
          {/* Visual Sequence Boxes */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {question.series.map((item, idx) => {
              const isTarget = item === '?';
              return (
                <React.Fragment key={idx}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '12px',
                    background: isTarget ? '#FFF7ED' : '#F8FAFC',
                    border: isTarget ? '2.5px dashed #EA580C' : '1.5px solid #E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.4rem',
                    fontWeight: 900,
                    color: isTarget ? '#EA580C' : '#1E293B',
                    boxShadow: isTarget ? '0 0 0 3px rgba(234,88,12,0.1)' : 'none'
                  }}>
                    {isTarget && selectedOption !== null && question.seriesOptions
                      ? question.seriesOptions[selectedOption]
                      : item}
                  </div>
                  {idx < (question.series?.length ?? 0) - 1 && (
                    <span style={{ fontSize: '1.2rem', color: '#CBD5E1', fontWeight: 800 }}>→</span>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* 4 Candidate Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>
              Select the next number in sequence:
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
              {question.seriesOptions?.map((opt, oIdx) => {
                const isSelected = selectedOption === oIdx;
                const isCorrect = showExplanation && oIdx === question.correctOptionIndex;
                const isWrong = showExplanation && isSelected && oIdx !== question.correctOptionIndex;

                return (
                  <button
                    key={oIdx}
                    onClick={() => {
                      if (isDemo) return;
                      setSelectedOption(oIdx);
                      onSelectAnswer(opt);
                    }}
                    style={{
                      padding: '16px 0',
                      borderRadius: '12px',
                      background: isCorrect ? '#DCFCE7' : isWrong ? '#FEE2E2' : isSelected ? '#FFF1EA' : '#FFFFFF',
                      border: isCorrect ? '2.5px solid #16A34A'
                        : isWrong ? '2.5px solid #DC2626'
                        : isSelected ? '2.5px solid #FF5733'
                        : '1.5px solid #E2E8F0',
                      fontSize: '1.3rem',
                      fontWeight: 900,
                      color: isCorrect ? '#16A34A' : isWrong ? '#DC2626' : isSelected ? '#FF5733' : '#1E293B',
                      cursor: isDemo ? 'default' : 'pointer',
                      boxShadow: isSelected ? '0 4px 12px rgba(255,87,51,0.2)' : '0 1px 3px rgba(0,0,0,0.02)',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── SUBTYPE 3: NUMERICAL ESTIMATION & COMPARISON ──────── */}
      {question.subtype === 'rapid_comparison' && (
        <div style={{
          background: '#FFFFFF',
          border: '1.5px solid #E2E8F0',
          borderRadius: '16px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
        }}>
          {/* Two Comparison Expression Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{
              background: '#F8FAFC',
              border: '1.5px solid #E2E8F0',
              borderRadius: '14px',
              padding: '20px',
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Quantity A
              </span>
              <div style={{ fontSize: '1.6rem', fontWeight: 950, color: '#1E293B', marginTop: '8px' }}>
                {question.expressionA}
              </div>
            </div>

            <div style={{
              background: '#F8FAFC',
              border: '1.5px solid #E2E8F0',
              borderRadius: '14px',
              padding: '20px',
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Quantity B
              </span>
              <div style={{ fontSize: '1.6rem', fontWeight: 950, color: '#1E293B', marginTop: '8px' }}>
                {question.expressionB}
              </div>
            </div>
          </div>

          {/* 3 Comparison Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {question.comparisonOptions?.map((opt, oIdx) => {
              const isSelected = selectedOption === oIdx;
              const isCorrect = showExplanation && oIdx === question.correctComparisonIndex;
              const isWrong = showExplanation && isSelected && oIdx !== question.correctComparisonIndex;

              return (
                <button
                  key={oIdx}
                  onClick={() => {
                    if (isDemo) return;
                    setSelectedOption(oIdx);
                    onSelectAnswer(oIdx);
                  }}
                  style={{
                    padding: '16px 20px',
                    borderRadius: '12px',
                    background: isCorrect ? '#DCFCE7' : isWrong ? '#FEE2E2' : isSelected ? '#EFF6FF' : '#FFFFFF',
                    border: isCorrect ? '2px solid #16A34A'
                      : isWrong ? '2px solid #DC2626'
                      : isSelected ? '2px solid #2563EB'
                      : '1.5px solid #E2E8F0',
                    fontSize: '0.95rem',
                    fontWeight: 800,
                    color: isCorrect ? '#15803D' : isWrong ? '#B91C1C' : isSelected ? '#1D4ED8' : '#334155',
                    cursor: isDemo ? 'default' : 'pointer',
                    textAlign: 'left',
                    boxShadow: isSelected ? '0 2px 8px rgba(37,99,235,0.15)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Explanation Card ─────────────────────────────────── */}
      {showExplanation && (
        <div style={{
          padding: '16px 20px',
          background: '#FFFBEB',
          border: '1.5px solid #FDE68A',
          borderRadius: '12px',
          fontSize: '0.88rem',
          lineHeight: 1.6,
          color: '#92400E'
        }}>
          <strong>💡 Solution &amp; Mathematical Rule:</strong> {question.explanation}
        </div>
      )}
    </div>
  );
};
