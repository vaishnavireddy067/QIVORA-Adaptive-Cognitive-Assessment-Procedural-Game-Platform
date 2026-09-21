import React, { useRef, useEffect, useState } from 'react';
import { AttentionQuestion, AttentionItem } from '../../engine/generators/attentionGenerator';

interface AttentionRendererProps {
  question: AttentionQuestion;
  onSelectIndex: (index: number, reactionMs: number) => void;
  showExplanation?: boolean;
  isDemo?: boolean;
}

const ShapeIcon: React.FC<{ shape: string; color: string; size?: number; rotation?: number }> = ({
  shape, color, size = 28, rotation = 0
}) => {
  return (
    <div style={{
      transform: `rotate(${rotation}deg)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'transform 0.15s ease'
    }}>
      {shape === 'arrow' && (
        <svg width={size} height={size} viewBox="0 0 40 40">
          <path d="M20,6 L34,22 L24,22 L24,34 L16,34 L16,22 L6,22 Z" fill={color} />
        </svg>
      )}
      {shape === 'ring' && (
        <svg width={size} height={size} viewBox="0 0 40 40">
          <path d="M20,6 A14,14 0 1,1 19.9,6" fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" />
        </svg>
      )}
      {shape === 'circle' && (
        <svg width={size} height={size} viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="15" fill={color} />
        </svg>
      )}
      {shape === 'square' && (
        <svg width={size} height={size} viewBox="0 0 40 40">
          <rect x="6" y="6" width="28" height="28" rx="4" fill={color} />
        </svg>
      )}
      {shape === 'triangle' && (
        <svg width={size} height={size} viewBox="0 0 40 40">
          <polygon points="20,6 35,34 5,34" fill={color} />
        </svg>
      )}
      {shape === 'star' && (
        <svg width={size} height={size} viewBox="0 0 40 40">
          <polygon points="20,5 24,15 35,15 26,22 30,33 20,26 10,33 14,22 5,15 16,15" fill={color} />
        </svg>
      )}
    </div>
  );
};

export const AttentionRenderer: React.FC<AttentionRendererProps> = ({
  question,
  onSelectIndex,
  showExplanation,
  isDemo = false,
}) => {
  const startTimeRef = useRef<number>(performance.now());
  const [clickedIdx, setClickedIdx] = useState<number | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  useEffect(() => {
    startTimeRef.current = performance.now();
    setClickedIdx(null);
    setSelectedOption(null);

    // AI Demo auto-solver
    if (isDemo) {
      if (question.subtype === 'target_anomaly' && question.targetIndex !== undefined) {
        const timer = setTimeout(() => {
          setClickedIdx(question.targetIndex!);
          onSelectIndex(question.targetIndex!, 420);
        }, 1500);
        return () => clearTimeout(timer);
      } else if (question.subtype === 'feature_frequency' && question.correctOptionIndex !== undefined) {
        const timer = setTimeout(() => {
          setSelectedOption(question.correctOptionIndex!);
          onSelectIndex(question.correctOptionIndex!, 500);
        }, 1500);
        return () => clearTimeout(timer);
      } else if (question.subtype === 'rapid_comparison' && question.isIdentical !== undefined) {
        const timer = setTimeout(() => {
          const ansIdx = question.isIdentical ? 0 : 1;
          setSelectedOption(ansIdx);
          onSelectIndex(ansIdx, 380);
        }, 1400);
        return () => clearTimeout(timer);
      } else if (question.subtype === 'change_detection' && question.changedIndex !== undefined) {
        const timer = setTimeout(() => {
          setClickedIdx(question.changedIndex!);
          onSelectIndex(question.changedIndex!, 450);
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [question.id, isDemo]);

  const handleAnomalyClick = (idx: number) => {
    if (isDemo || clickedIdx !== null) return;
    setClickedIdx(idx);
    const elapsed = Math.round(performance.now() - startTimeRef.current);
    onSelectIndex(idx, elapsed);
  };

  const handleOptionClick = (idx: number) => {
    if (isDemo || selectedOption !== null) return;
    setSelectedOption(idx);
    const elapsed = Math.round(performance.now() - startTimeRef.current);
    onSelectIndex(idx, elapsed);
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
            ATTENTION &amp; FOCUS // {question.subtypeName}
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

      {/* ── SUBTYPE 1: TARGET ANOMALY DETECTION ──────────────── */}
      {question.subtype === 'target_anomaly' && question.items && (
        <div style={{
          background: '#FFFFFF',
          border: '1.5px solid #E2E8F0',
          borderRadius: '16px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${question.gridCols || 4}, 64px)`,
            gap: '8px',
            background: '#F8FAFC',
            padding: '16px',
            borderRadius: '16px',
            border: '1.5px solid #E2E8F0'
          }}>
            {question.items.map((item, idx) => {
              const isSelected = clickedIdx === idx;
              const isTarget = idx === question.targetIndex;
              const isCorrect = isSelected && isTarget;
              const isWrong = isSelected && !isTarget;

              return (
                <button
                  key={idx}
                  onClick={() => handleAnomalyClick(idx)}
                  disabled={isDemo}
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '12px',
                    background: isCorrect ? '#DCFCE7' : isWrong ? '#FEE2E2' : '#FFFFFF',
                    border: isCorrect ? '2.5px solid #16A34A'
                      : isWrong ? '2.5px solid #DC2626'
                      : (showExplanation && isTarget) ? '2.5px solid #16A34A'
                      : '1.5px solid #CBD5E1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: isDemo ? 'default' : 'pointer',
                    boxShadow: isSelected ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
                    transition: 'all 0.1s ease'
                  }}
                >
                  <ShapeIcon
                    shape={item.shape}
                    color={item.color || '#0284C7'}
                    rotation={item.rotation}
                    size={32}
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── SUBTYPE 2: FEATURE FREQUENCY SEARCH ──────────────── */}
      {question.subtype === 'feature_frequency' && question.featureItems && (
        <div style={{
          background: '#FFFFFF',
          border: '1.5px solid #E2E8F0',
          borderRadius: '16px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
        }}>
          {/* Target Key Banner */}
          {question.targetFeature && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 18px',
              borderRadius: '24px',
              background: '#FFF7ED',
              border: '1.5px solid #FDBA74'
            }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#C2410C' }}>TARGET TO COUNT:</span>
              <ShapeIcon shape={question.targetFeature.shape} color={question.targetFeature.color} size={24} />
              <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#9A3412' }}>
                {question.targetFeature.label}
              </span>
            </div>
          )}

          {/* 5x5 Field */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 56px)',
            gap: '8px',
            background: '#F8FAFC',
            padding: '14px',
            borderRadius: '14px',
            border: '1.5px solid #E2E8F0'
          }}>
            {question.featureItems.map(item => (
              <div
                key={item.id}
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '10px',
                  background: '#FFFFFF',
                  border: '1.5px solid #E2E8F0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <ShapeIcon shape={item.shape} color={item.color} size={28} />
              </div>
            ))}
          </div>

          {/* Count Option Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', width: '100%' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>
              Select Count:
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', width: '100%', maxWidth: '360px' }}>
              {question.countOptions?.map((count, cIdx) => {
                const isSelected = selectedOption === cIdx;
                const isCorrect = showExplanation && cIdx === question.correctOptionIndex;
                const isWrong = showExplanation && isSelected && cIdx !== question.correctOptionIndex;

                return (
                  <button
                    key={cIdx}
                    onClick={() => handleOptionClick(cIdx)}
                    disabled={isDemo}
                    style={{
                      padding: '14px 0',
                      borderRadius: '12px',
                      background: isCorrect ? '#DCFCE7' : isWrong ? '#FEE2E2' : isSelected ? '#EFF6FF' : '#FFFFFF',
                      border: isCorrect ? '2.5px solid #16A34A'
                        : isWrong ? '2.5px solid #DC2626'
                        : isSelected ? '2.5px solid #2563EB'
                        : '1.5px solid #CBD5E1',
                      fontSize: '1.2rem',
                      fontWeight: 900,
                      color: isCorrect ? '#16A34A' : isWrong ? '#DC2626' : isSelected ? '#2563EB' : '#1E293B',
                      cursor: isDemo ? 'default' : 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {count}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── SUBTYPE 3: RAPID VISUAL COMPARISON ────────────────── */}
      {question.subtype === 'rapid_comparison' && (
        <div style={{
          background: '#FFFFFF',
          border: '1.5px solid #E2E8F0',
          borderRadius: '16px',
          padding: '28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
        }}>
          {/* Side by side code strips */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{
              background: '#F8FAFC',
              border: '2px solid #E2E8F0',
              borderRadius: '12px',
              padding: '20px 16px',
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>
                Code A
              </span>
              <div style={{
                fontFamily: 'monospace',
                fontSize: '1.4rem',
                fontWeight: 900,
                letterSpacing: '0.08em',
                color: '#1E293B',
                marginTop: '8px'
              }}>
                {question.codeA}
              </div>
            </div>

            <div style={{
              background: '#F8FAFC',
              border: '2px solid #E2E8F0',
              borderRadius: '12px',
              padding: '20px 16px',
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>
                Code B
              </span>
              <div style={{
                fontFamily: 'monospace',
                fontSize: '1.4rem',
                fontWeight: 900,
                letterSpacing: '0.08em',
                color: '#1E293B',
                marginTop: '8px'
              }}>
                {question.codeB}
              </div>
            </div>
          </div>

          {/* Decision Buttons: [ YES — IDENTICAL ] [ NO — DIFFERENT ] */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {[
              { label: '✓ YES — IDENTICAL', isMatchChoice: true },
              { label: '✗ NO — DIFFERENT', isMatchChoice: false }
            ].map((btn, bIdx) => {
              const isSelected = selectedOption === bIdx;
              const isCorrectAnswer = (bIdx === 0 && question.isIdentical) || (bIdx === 1 && !question.isIdentical);
              const isCorrect = showExplanation && isCorrectAnswer;
              const isWrong = showExplanation && isSelected && !isCorrectAnswer;

              return (
                <button
                  key={bIdx}
                  onClick={() => handleOptionClick(bIdx)}
                  disabled={isDemo}
                  style={{
                    padding: '18px',
                    borderRadius: '14px',
                    background: isCorrect ? '#DCFCE7' : isWrong ? '#FEE2E2' : isSelected ? '#EFF6FF' : '#FFFFFF',
                    border: isCorrect ? '2.5px solid #16A34A'
                      : isWrong ? '2.5px solid #DC2626'
                      : isSelected ? '2.5px solid #2563EB'
                      : '1.5px solid #CBD5E1',
                    fontSize: '1rem',
                    fontWeight: 900,
                    color: isCorrect ? '#16A34A' : isWrong ? '#DC2626' : isSelected ? '#2563EB' : '#1E293B',
                    cursor: isDemo ? 'default' : 'pointer',
                    boxShadow: isSelected ? '0 4px 12px rgba(37,99,235,0.2)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {btn.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── SUBTYPE 4: CHANGE DETECTION (SCENE 1 vs SCENE 2) ─── */}
      {question.subtype === 'change_detection' && question.scene1Items && question.scene2Items && (
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
          {/* Scene 1 (Original) */}
          <div style={{
            width: '100%',
            background: '#F8FAFC',
            border: '1.5px solid #E2E8F0',
            borderRadius: '14px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              SCENE 1 (ORIGINAL STATE)
            </span>
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              {question.scene1Items.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '12px',
                    background: '#FFFFFF',
                    border: '1.5px solid #CBD5E1',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
                  }}
                >
                  <ShapeIcon shape={item.shape} color={item.color} size={30} />
                  <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94A3B8', marginTop: '2px' }}>
                    #{idx + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Transformation Arrow */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6366F1' }}>
            <span style={{ fontSize: '1.4rem', fontWeight: 900 }}>↓</span>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase' }}>
              One item mutated below — Tap the changed item
            </span>
            <span style={{ fontSize: '1.4rem', fontWeight: 900 }}>↓</span>
          </div>

          {/* Scene 2 (Mutated State - Interactive) */}
          <div style={{
            width: '100%',
            background: '#F8FAFC',
            border: '2px solid #C7D2FE',
            borderRadius: '14px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#4338CA', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              SCENE 2 (WHICH ITEM CHANGED?)
            </span>
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              {question.scene2Items.map((item, idx) => {
                const isSelected = clickedIdx === idx;
                const isTarget = idx === question.changedIndex;
                const isCorrect = isSelected && isTarget;
                const isWrong = isSelected && !isTarget;

                return (
                  <button
                    key={idx}
                    onClick={() => handleAnomalyClick(idx)}
                    disabled={isDemo}
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '12px',
                      background: isCorrect ? '#DCFCE7' : isWrong ? '#FEE2E2' : '#FFFFFF',
                      border: isCorrect ? '2.5px solid #16A34A'
                        : isWrong ? '2.5px solid #DC2626'
                        : (showExplanation && isTarget) ? '2.5px solid #16A34A'
                        : '1.5px solid #CBD5E1',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: isDemo ? 'default' : 'pointer',
                      boxShadow: isSelected ? '0 4px 12px rgba(0,0,0,0.1)' : '0 2px 4px rgba(0,0,0,0.03)',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={e => {
                      if (!isSelected && !isDemo) e.currentTarget.style.borderColor = '#4F46E5';
                    }}
                    onMouseLeave={e => {
                      if (!isSelected && !isDemo) e.currentTarget.style.borderColor = '#CBD5E1';
                    }}
                  >
                    <ShapeIcon shape={item.shape} color={item.color} size={30} />
                    <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#64748B', marginTop: '2px' }}>
                      #{idx + 1}
                    </span>
                  </button>
                );
              })}
            </div>
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
          <strong>💡 Solution &amp; Inspection:</strong> {question.explanation}
        </div>
      )}
    </div>
  );
};
