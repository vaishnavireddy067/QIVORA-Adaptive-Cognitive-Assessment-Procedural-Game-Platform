import React, { useEffect, useState } from 'react';
import { DeductiveQuestion, DeductiveSymbol, SYMBOL_CONFIG } from '../../engine/generators/deductiveGenerator';

interface DeductiveRendererProps {
  question: DeductiveQuestion;
  selectedOptionIndex: number | null;
  onSelectOption: (index: number) => void;
  showExplanation?: boolean;
  isDemo?: boolean;
}

const ShapeIcon: React.FC<{ symbol: DeductiveSymbol; size?: number }> = ({ symbol, size = 36 }) => {
  const color = SYMBOL_CONFIG[symbol]?.color || '#555';
  switch (symbol) {
    case 'circle':
      return <svg width={size} height={size} viewBox="0 0 40 40"><circle cx="20" cy="20" r="16" fill={color} /></svg>;
    case 'square':
      return <svg width={size} height={size} viewBox="0 0 40 40"><rect x="6" y="6" width="28" height="28" rx="4" fill={color} /></svg>;
    case 'triangle':
      return <svg width={size} height={size} viewBox="0 0 40 40"><polygon points="20,5 36,35 4,35" fill={color} /></svg>;
    case 'cross':
      return <svg width={size} height={size} viewBox="0 0 40 40"><path d="M14,4 L26,4 L26,14 L36,14 L36,26 L26,26 L26,36 L14,36 L14,26 L4,26 L4,14 L14,14 Z" fill={color} /></svg>;
    case 'star':
      return <svg width={size} height={size} viewBox="0 0 40 40"><polygon points="20,5 24,15 35,15 26,22 30,33 20,26 10,33 14,22 5,15 16,15" fill={color} /></svg>;
    default:
      return null;
  }
};

export const DeductiveRenderer: React.FC<DeductiveRendererProps> = ({
  question,
  selectedOptionIndex,
  onSelectOption,
  showExplanation,
  isDemo = false,
}) => {
  const [activeSelect, setActiveSelect] = useState<number | null>(selectedOptionIndex);

  useEffect(() => {
    setActiveSelect(selectedOptionIndex);
  }, [selectedOptionIndex]);

  // AI Live Demo auto-solver
  useEffect(() => {
    if (!isDemo) return;
    const timer = setTimeout(() => {
      setActiveSelect(question.correctOptionIndex);
      onSelectOption(question.correctOptionIndex);
    }, 1500);
    return () => clearTimeout(timer);
  }, [question.id, isDemo]);

  const handleSelect = (idx: number) => {
    if (isDemo) return;
    setActiveSelect(idx);
    onSelectOption(idx);
  };

  const LABELS = ['A', 'B', 'C', 'D', 'E'];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      width: '100%',
      maxWidth: '680px',
      margin: '0 auto',
      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif"
    }}>
      {/* ── Subtype Header ───────────────────────────────────── */}
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
            DEDUCTIVE REASONING // {question.subtypeName}
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
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            AI Demo Play
          </span>
        )}
      </div>

      {/* ── SUBTYPE 1: Latin Square Gap Challenge (Geo-Sudo) ──────── */}
      {question.type === 'gap_challenge' && question.grid && (
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
          {/* Grid Container with C1-Cn and R1-Rn Labels matching Image 1, 2, 3 */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Column Headers (C1, C2, C3, ...) */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: `36px repeat(${question.gridSize || 4}, 68px)`,
              gap: '6px',
              marginBottom: '6px',
              textAlign: 'center'
            }}>
              <div /> {/* Top-left corner spacer */}
              {Array.from({ length: question.gridSize || 4 }).map((_, cIdx) => (
                <div key={cIdx} style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748B', fontFamily: 'monospace' }}>
                  C{cIdx + 1}
                </div>
              ))}
            </div>

            {/* Rows with R1-Rn Labels */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {question.grid.map((row, rIdx) => (
                <div key={rIdx} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {/* Row Header Label */}
                  <div style={{
                    width: '36px',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    color: '#64748B',
                    fontFamily: 'monospace',
                    textAlign: 'center'
                  }}>
                    R{rIdx + 1}
                  </div>

                  {/* Grid Cells in this row */}
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {row.map((cell, cIdx) => {
                      const isMissing = rIdx === question.missingRow && cIdx === question.missingCol;
                      const placedSym = isMissing && activeSelect !== null && question.symbolOptions
                        ? question.symbolOptions[activeSelect]
                        : null;

                      return (
                        <div
                          key={`${rIdx}-${cIdx}`}
                          style={{
                            width: 68,
                            height: 68,
                            background: isMissing ? '#FFF7ED' : '#FFFFFF',
                            border: isMissing ? '2px dashed #EA580C' : '1.5px solid #CBD5E1',
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: isMissing
                              ? '0 0 0 3px rgba(234,88,12,0.15)'
                              : '0 1px 3px rgba(0,0,0,0.04)',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          {isMissing ? (
                            placedSym ? (
                              <ShapeIcon symbol={placedSym} size={36} />
                            ) : (
                              <span style={{ fontSize: '1.6rem', fontWeight: 900, color: '#EA580C' }}>?</span>
                            )
                          ) : cell ? (
                            <ShapeIcon symbol={cell} size={34} />
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Symbol Option Selector Bar */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', width: '100%' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Select Answer Option
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {question.symbolOptions?.map((sym, idx) => {
                const isSelected = activeSelect === idx;
                const isCorrect = showExplanation && idx === question.correctOptionIndex;
                const isWrong = showExplanation && isSelected && idx !== question.correctOptionIndex;

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    style={{
                      width: 68,
                      height: 68,
                      borderRadius: '12px',
                      background: isCorrect ? '#DCFCE7' : isWrong ? '#FEE2E2' : isSelected ? '#EFF6FF' : '#FFFFFF',
                      border: isCorrect ? '2.5px solid #16A34A'
                        : isWrong ? '2.5px solid #DC2626'
                        : isSelected ? '2.5px solid #2563EB'
                        : '1.5px solid #CBD5E1',
                      cursor: isDemo ? 'default' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: isSelected ? '0 4px 12px rgba(37,99,235,0.2)' : '0 1px 4px rgba(0,0,0,0.04)',
                      transform: isSelected ? 'translateY(-2px)' : 'none',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <ShapeIcon symbol={sym} size={36} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── SUBTYPE 2: Ordering Constraints ──────────────────── */}
      {question.type === 'ordering' && (
        <div style={{
          background: '#FFFFFF',
          border: '1.5px solid #E2E8F0',
          borderRadius: '16px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '22px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
        }}>
          {/* Visual Position Slot Array */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Sequential Arrangement (Slots 1 to {question.slotsCount || 4}):
            </span>
            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${question.slotsCount || 4}, 1fr)`,
              gap: '12px'
            }}>
              {Array.from({ length: question.slotsCount || 4 }).map((_, sIdx) => {
                const slotNum = sIdx + 1;
                const isTarget = slotNum === question.targetSlot;
                const known = question.knownSlots ? question.knownSlots[sIdx] : null;
                const placedSym = isTarget && activeSelect !== null && question.symbolOptions
                  ? question.symbolOptions[activeSelect]
                  : null;

                return (
                  <div
                    key={sIdx}
                    style={{
                      border: isTarget ? '2.5px dashed #EA580C' : '1.5px solid #E2E8F0',
                      background: isTarget ? '#FFF7ED' : '#F8FAFC',
                      borderRadius: '12px',
                      padding: '14px 10px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      minHeight: '94px'
                    }}
                  >
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      color: isTarget ? '#EA580C' : '#94A3B8',
                      textTransform: 'uppercase'
                    }}>
                      Slot {slotNum} {isTarget ? '(Target ?)' : ''}
                    </span>
                    {known ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                        <ShapeIcon symbol={known} size={34} />
                        <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#334155' }}>
                          {SYMBOL_CONFIG[known]?.label}
                        </span>
                      </div>
                    ) : isTarget ? (
                      placedSym ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                          <ShapeIcon symbol={placedSym} size={34} />
                          <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#EA580C' }}>
                            {SYMBOL_CONFIG[placedSym]?.label}
                          </span>
                        </div>
                      ) : (
                        <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#EA580C' }}>?</span>
                      )
                    ) : (
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#CBD5E1' }}>[Empty]</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stated Clues & Rules Box */}
          <div style={{
            background: '#F8FAFC',
            border: '1.5px solid #E2E8F0',
            borderRadius: '12px',
            padding: '16px 20px'
          }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '10px' }}>
              Given Positional Rules:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {question.clues?.map((clue, cIdx) => (
                <div key={cIdx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: '#1E293B' }}>
                  <span style={{ color: '#2563EB', fontWeight: 800 }}>•</span>
                  <span>{clue}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Candidate Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>
              Select Symbol for Slot {question.targetSlot}:
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
              {question.symbolOptions?.map((sym, idx) => {
                const isSelected = activeSelect === idx;
                const isCorrect = showExplanation && idx === question.correctOptionIndex;
                const isWrong = showExplanation && isSelected && idx !== question.correctOptionIndex;

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    style={{
                      padding: '14px 10px',
                      borderRadius: '12px',
                      background: isCorrect ? '#DCFCE7' : isWrong ? '#FEE2E2' : isSelected ? '#EFF6FF' : '#FFFFFF',
                      border: isCorrect ? '2.5px solid #16A34A'
                        : isWrong ? '2.5px solid #DC2626'
                        : isSelected ? '2.5px solid #2563EB'
                        : '1.5px solid #CBD5E1',
                      cursor: isDemo ? 'default' : 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      boxShadow: isSelected ? '0 4px 12px rgba(37,99,235,0.2)' : '0 1px 3px rgba(0,0,0,0.02)',
                      transform: isSelected ? 'translateY(-2px)' : 'none',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <ShapeIcon symbol={sym} size={32} />
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: isCorrect ? '#16A34A' : isWrong ? '#DC2626' : '#334155' }}>
                      {SYMBOL_CONFIG[sym]?.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── SUBTYPE 3: Conditional Elimination (Syllogisms) ──── */}
      {question.type === 'conditional' && (
        <div style={{
          background: '#FFFFFF',
          border: '1.5px solid #E2E8F0',
          borderRadius: '16px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
        }}>
          {/* Premises Box */}
          <div style={{
            background: '#F8FAFC',
            border: '1.5px solid #E2E8F0',
            borderRadius: '14px',
            padding: '18px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Ground Truth Premises:
            </span>
            {question.premises?.map((premise, pIdx) => (
              <div
                key={pIdx}
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '10px',
                  background: '#FFFFFF',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid #E2E8F0',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: '#1E293B'
                }}
              >
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '6px',
                  background: '#EFF6FF',
                  color: '#2563EB',
                  whiteSpace: 'nowrap'
                }}>
                  P{pIdx + 1}
                </span>
                <span>{premise.replace(/^Premise \d+:\s*/, '')}</span>
              </div>
            ))}
          </div>

          {/* 4 Text Candidate Conclusions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Candidate Conclusions:
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {question.options.map((opt, oIdx) => {
                const isSelected = activeSelect === oIdx;
                const isCorrect = showExplanation && oIdx === question.correctOptionIndex;
                const isWrong = showExplanation && isSelected && oIdx !== question.correctOptionIndex;

                return (
                  <button
                    key={oIdx}
                    onClick={() => handleSelect(oIdx)}
                    style={{
                      textAlign: 'left',
                      padding: '14px 18px',
                      borderRadius: '12px',
                      background: isCorrect ? '#DCFCE7' : isWrong ? '#FEE2E2' : isSelected ? '#EFF6FF' : '#FFFFFF',
                      border: isCorrect ? '2px solid #16A34A'
                        : isWrong ? '2px solid #DC2626'
                        : isSelected ? '2px solid #2563EB'
                        : '1.5px solid #E2E8F0',
                      cursor: isDemo ? 'default' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      boxShadow: isSelected ? '0 2px 8px rgba(37,99,235,0.15)' : 'none',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '8px',
                      background: isCorrect ? '#16A34A' : isWrong ? '#DC2626' : isSelected ? '#2563EB' : '#F1F5F9',
                      color: isCorrect || isWrong || isSelected ? '#FFFFFF' : '#64748B',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {LABELS[oIdx]}
                    </span>
                    <span style={{
                      fontSize: '0.9rem',
                      fontWeight: isSelected ? 700 : 500,
                      color: isCorrect ? '#15803D' : isWrong ? '#B91C1C' : '#1E293B',
                      lineHeight: 1.4
                    }}>
                      {String(opt)}
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
          color: '#92400E',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}>
          <strong style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#B45309' }}>
            <span>💡</span> Deductive Proof:
          </strong>
          <div>{question.explanation}</div>
        </div>
      )}
    </div>
  );
};
