import React, { useState, useEffect } from 'react';
import { InductiveQuestion, SmallGrid, GridCell, SequenceItem, ShapeSymbol } from '../../engine/generators/inductiveGenerator';

interface InductiveRendererProps {
  question: InductiveQuestion;
  selectedOptionIndex?: number | null;
  selectedOptionIndices?: number[];
  onSelectOption: (index: number) => void;
  showExplanation?: boolean;
  isDemo?: boolean;
}

// ─── Shape SVG Component ──────────────────────────────────────────
const ShapeIcon: React.FC<{
  shape: ShapeSymbol;
  color: string;
  size?: number;
  rotation?: number;
  fill?: 'solid' | 'outline';
}> = ({
  shape,
  color,
  size = 28,
  rotation = 0,
  fill = 'solid'
}) => {
  const isOutline = fill === 'outline';
  const fillColor = isOutline ? 'none' : color;
  const strokeColor = isOutline ? color : 'none';
  const strokeWidth = isOutline ? 2.5 : 0;

  return (
    <div style={{
      transform: `rotate(${rotation}deg)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'transform 0.2s ease'
    }}>
      {shape === 'circle' && (
        <svg width={size} height={size} viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="16" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
        </svg>
      )}
      {shape === 'square' && (
        <svg width={size} height={size} viewBox="0 0 40 40">
          <rect x="6" y="6" width="28" height="28" rx="4" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
        </svg>
      )}
      {shape === 'triangle' && (
        <svg width={size} height={size} viewBox="0 0 40 40">
          <polygon points="20,5 36,35 4,35" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
        </svg>
      )}
      {shape === 'cross' && (
        <svg width={size} height={size} viewBox="0 0 40 40">
          <path d="M14,4 L26,4 L26,14 L36,14 L36,26 L26,26 L26,36 L14,36 L14,26 L4,26 L4,14 L14,14 Z" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
        </svg>
      )}
      {shape === 'star' && (
        <svg width={size} height={size} viewBox="0 0 40 40">
          <polygon points="20,5 24,15 35,15 26,22 30,33 20,26 10,33 14,22 5,15 16,15" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
        </svg>
      )}
      {shape === 'diamond' && (
        <svg width={size} height={size} viewBox="0 0 40 40">
          <polygon points="20,5 35,20 20,35 5,20" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
        </svg>
      )}
      {shape === 'hexagon' && (
        <svg width={size} height={size} viewBox="0 0 40 40">
          <polygon points="20,4 34,12 34,28 20,36 6,28 6,12" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
        </svg>
      )}
      {shape === 'parallelogram' && (
        <svg width={size} height={size} viewBox="0 0 40 40">
          <polygon points="12,6 36,6 28,34 4,34" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
        </svg>
      )}
    </div>
  );
};

// ─── 9-Card Visual Item Renderer (Images 1, 2, 3) ──────────────────
const NineCardVisualItem: React.FC<{ item: SequenceItem; size?: number }> = ({ item, size = 62 }) => {
  // 1. Broken horizontal lines model (Image 1 & 2 Model 1)
  if (item.brokenLineIndex !== undefined) {
    return (
      <div style={{
        width: `${size}px`,
        height: `${size * 1.12}px`,
        background: '#FFFFFF',
        borderRadius: '8px',
        border: '1.5px solid #E2E8F0',
        padding: '8px 10px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxSizing: 'border-box',
        boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
      }}>
        {[0, 1, 2, 3, 4].map(lineIdx => {
          const isBroken = item.brokenLineIndex === lineIdx;
          if (isBroken) {
            return (
              <div key={lineIdx} style={{ display: 'flex', justifyContent: 'space-between', width: '100%', height: '3px' }}>
                <div style={{ width: '38%', height: '100%', background: '#334155', borderRadius: '1.5px' }} />
                <div style={{ width: '38%', height: '100%', background: '#334155', borderRadius: '1.5px' }} />
              </div>
            );
          }
          return (
            <div
              key={lineIdx}
              style={{
                width: '100%',
                height: '3px',
                background: '#334155',
                borderRadius: '1.5px'
              }}
            />
          );
        })}
      </div>
    );
  }

  // 2. Dual Shape Overlap Model (Image 2 Model 2)
  if (item.dualShapes) {
    const { filled, outline } = item.dualShapes;
    return (
      <div style={{
        width: `${size}px`,
        height: `${size * 1.12}px`,
        background: '#FFFFFF',
        borderRadius: '8px',
        border: '1.5px solid #E2E8F0',
        position: 'relative',
        boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          left: `${filled.x}%`,
          top: `${filled.y}%`,
          transform: 'translate(-50%, -50%)'
        }}>
          <ShapeIcon shape={filled.shape} color="#1E293B" size={filled.size} fill="solid" />
        </div>
        <div style={{
          position: 'absolute',
          left: `${outline.x}%`,
          top: `${outline.y}%`,
          transform: 'translate(-50%, -50%)'
        }}>
          <ShapeIcon shape={outline.shape} color="#1E293B" size={outline.size} fill="outline" />
        </div>
      </div>
    );
  }

  // 3. 3x3 Plus Grid Model (Image 2 & 3 Model 3)
  if (item.plusGrid) {
    return (
      <div style={{
        width: `${size}px`,
        height: `${size * 1.12}px`,
        background: '#FFFFFF',
        borderRadius: '8px',
        border: '1.5px solid #E2E8F0',
        padding: '6px',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridTemplateRows: 'repeat(3, 1fr)',
        gap: '2px',
        boxSizing: 'border-box',
        boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
        alignItems: 'center',
        justifyItems: 'center'
      }}>
        {item.plusGrid.map((row, r) =>
          row.map((active, c) => (
            <div key={`${r}-${c}`} style={{ width: '12px', height: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {active ? (
                <span style={{ fontSize: '0.82rem', fontWeight: 900, color: '#334155', lineHeight: 1 }}>+</span>
              ) : null}
            </div>
          ))
        )}
      </div>
    );
  }

  // 4. Fallback sequence item
  return (
    <div style={{
      width: `${size}px`,
      height: `${size * 1.12}px`,
      background: '#FFFFFF',
      borderRadius: '8px',
      border: '1.5px solid #E2E8F0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
    }}>
      <ShapeIcon shape={item.shape} color={item.color} size={size * 0.45} rotation={item.rotation} />
    </div>
  );
};

const SequenceDisplayItem: React.FC<{ item: SequenceItem; isQuestionMark?: boolean; size?: number }> = ({
  item,
  isQuestionMark = false,
  size = 76,
}) => {
  if (isQuestionMark) {
    return (
      <div style={{
        width: `${size}px`,
        height: `${size}px`,
        border: '2.5px dashed #F97316',
        borderRadius: '14px',
        background: '#FFF7ED',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#EA580C',
        fontSize: '1.6rem',
        fontWeight: 900,
        boxShadow: '0 2px 8px rgba(249,115,22,0.15)',
        flexShrink: 0
      }}>
        ?
      </div>
    );
  }

  const count = item.count || 1;
  const iconPx = count === 1 
    ? size * 0.48 
    : count === 2 
    ? size * 0.34 
    : count <= 4 
    ? size * 0.25 
    : count <= 6 
    ? size * 0.20 
    : size * 0.17;

  return (
    <div style={{
      width: `${size}px`,
      height: `${size}px`,
      border: '1.5px solid #E2E8F0',
      borderRadius: '14px',
      background: '#FFFFFF',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      position: 'relative',
      overflow: 'hidden',
      padding: '4px',
      boxSizing: 'border-box',
      flexShrink: 0
    }}>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: count >= 4 ? '2px' : '4px',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        overflow: 'hidden'
      }}>
        {Array.from({ length: count }, (_, i) => (
          <ShapeIcon key={i} shape={item.shape} color={item.color} size={iconPx} rotation={item.rotation} />
        ))}
      </div>
    </div>
  );
};

// ─── Mini Grid Canvas for Structural & Scales CLX Tasks ───────────
const MiniGridCard: React.FC<{ grid: SmallGrid; size?: number; label?: string }> = ({ grid, size = 88, label }) => {
  const cellSize = Math.floor(size / 3);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(3, ${cellSize}px)`,
        gridTemplateRows: `repeat(3, ${cellSize}px)`,
        gap: '2px',
        padding: '4px',
        background: '#F1F5F9',
        borderRadius: '10px',
        border: '1.5px solid #CBD5E1'
      }}>
        {grid.map((row, r) =>
          row.map((cell, c) => (
            <div
              key={`${r}-${c}`}
              style={{
                width: cellSize,
                height: cellSize,
                borderRadius: '4px',
                background: cell ? '#FFFFFF' : 'rgba(255,255,255,0.4)',
                border: cell ? '1px solid #E2E8F0' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {cell && <ShapeIcon shape={cell.shape} color={cell.color} size={cellSize * 0.72} />}
            </div>
          ))
        )}
      </div>
      {label && (
        <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B' }}>
          {label}
        </span>
      )}
    </div>
  );
};

export const InductiveRenderer: React.FC<InductiveRendererProps> = ({
  question,
  selectedOptionIndex,
  selectedOptionIndices = [],
  onSelectOption,
  showExplanation = false,
  isDemo = false,
}) => {
  const [selectedClxChoice, setSelectedClxChoice] = useState<'Set A' | 'Set B' | 'Neither' | null>(null);

  useEffect(() => {
    setSelectedClxChoice(null);
  }, [question.id]);

  const handleClxSelect = (choice: 'Set A' | 'Set B' | 'Neither', idx: number) => {
    if (isDemo) return;
    setSelectedClxChoice(choice);
    onSelectOption(idx);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      maxWidth: '520px',
      margin: '0 auto',
      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif"
    }}>
      {/* ── Level & Subtype Header ─────────────────────────────── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: '10px'
      }}>
        <span style={{
          fontSize: '0.78rem',
          fontWeight: 800,
          color: '#EA580C',
          background: '#FFEDD5',
          padding: '4px 12px',
          borderRadius: '20px',
          textTransform: 'uppercase'
        }}>
          {question.subRuleLabel}
        </span>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B' }}>
          Pattern Deduction
        </span>
      </div>

      <div style={{ fontSize: '1rem', fontWeight: 800, color: '#1E293B', textAlign: 'center', marginBottom: '16px' }}>
        {question.prompt}
      </div>

      {/* ── 0. THE SAME RULE PAIR DISCOVERY (Spacio Pairs Model) ──── */}
      {question.challengeType === 'same_rule_pairs' && question.sameRulePairsData && (
        <div style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.5fr',
            gap: '24px',
            width: '100%',
            alignItems: 'start'
          }}>
            {/* Left Box: These two Grids follow the same rule */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
              padding: '16px',
              background: '#F8FAFC',
              borderRadius: '14px',
              border: '1.5px solid #E2E8F0'
            }}>
              <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#334155', textAlign: 'center' }}>
                These two Grids follow the same rule
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {question.sameRulePairsData.exampleGrids.map((g, idx) => (
                  <MiniGridCard key={idx} grid={g} size={84} />
                ))}
              </div>
            </div>

            {/* Right Box: Which of these groups follow the same rule? */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
              padding: '16px',
              background: '#FFFFFF',
              borderRadius: '14px',
              border: '1.5px solid #E2E8F0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}>
              <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#EA580C', textAlign: 'center' }}>
                Which of these groups follow the same rule?
              </span>
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', width: '100%', flexWrap: 'wrap' }}>
                {question.sameRulePairsData.candidateGroups.map((grp, grpIdx) => {
                  const isSelected = selectedOptionIndex === grpIdx;
                  const isCorrect = showExplanation && grp.isCorrect;
                  const isWrong = showExplanation && isSelected && !grp.isCorrect;

                  return (
                    <button
                      key={grpIdx}
                      onClick={() => !isDemo && onSelectOption(grpIdx)}
                      disabled={isDemo}
                      style={{
                        padding: '12px 10px',
                        borderRadius: '12px',
                        background: isCorrect ? '#ECFDF5' : isWrong ? '#FEF2F2' : isSelected ? '#FFF7ED' : '#F8FAFC',
                        border: isCorrect
                          ? '2.5px solid #10B981'
                          : isWrong
                          ? '2.5px solid #EF4444'
                          : isSelected
                          ? '2.5px solid #EA580C'
                          : '1.5px solid #CBD5E1',
                        cursor: isDemo ? 'default' : 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '10px',
                        transition: 'all 0.15s ease',
                        boxShadow: isSelected ? '0 4px 12px rgba(234,88,12,0.15)' : 'none'
                      }}
                    >
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748B' }}>
                        {grp.label}
                      </span>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {grp.grids.map((g, gIdx) => (
                          <MiniGridCard key={gIdx} grid={g} size={76} />
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 1. ODD ONE OUT / DOESN'T FIT THE RULE (Images 1, 2, 3) ──── */}
      {question.challengeType === 'odd_one_out' && question.nineCards && (
        <div style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '14px',
          background: '#F8FAFC',
          border: '1.5px solid #E2E8F0',
          borderRadius: '16px',
          padding: '24px 12px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.03)'
        }}>
          <div style={{
            display: 'flex',
            gap: '8px',
            justifyContent: 'center',
            alignItems: 'flex-start',
            width: '100%',
            overflowX: 'auto',
            paddingBottom: '8px'
          }}>
            {question.nineCards.map((item, idx) => {
              const isSelected = selectedOptionIndex === idx;
              const isCorrect = showExplanation && idx === question.oddCardIndex;
              const isWrong = showExplanation && isSelected && idx !== question.oddCardIndex;

              return (
                <div
                  key={idx}
                  onClick={() => !isDemo && onSelectOption(idx)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: isDemo ? 'default' : 'pointer',
                    position: 'relative'
                  }}
                >
                  {/* Red ❌ Badge (Matching Images 2 & 3) */}
                  <div style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: isSelected || isCorrect ? '#EF4444' : 'transparent',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.85rem',
                    fontWeight: 900,
                    boxShadow: isSelected || isCorrect ? '0 2px 6px rgba(239,68,68,0.4)' : 'none',
                    visibility: isSelected || isCorrect ? 'visible' : 'hidden',
                    transition: 'all 0.15s ease'
                  }}>
                    ✕
                  </div>

                  {/* Card Frame */}
                  <div style={{
                    border: isCorrect
                      ? '2.5px solid #10B981'
                      : isWrong
                      ? '2.5px solid #EF4444'
                      : isSelected
                      ? '2.5px solid #EF4444'
                      : '1px solid #CBD5E1',
                    borderRadius: '10px',
                    background: isSelected ? '#FEF2F2' : '#FFFFFF',
                    padding: '2px',
                    boxShadow: isSelected ? '0 0 0 3px rgba(239,68,68,0.15)' : '0 1px 3px rgba(0,0,0,0.04)',
                    transition: 'all 0.15s ease'
                  }}>
                    <NineCardVisualItem item={item} size={44} />
                  </div>

                  {/* Card Index Numeral 1–9 */}
                  <span style={{
                    fontSize: '0.95rem',
                    fontWeight: 800,
                    color: isSelected ? '#EF4444' : '#1E293B',
                    fontFamily: 'monospace'
                  }}>
                    {idx + 1}
                  </span>
                </div>
              );
            })}
          </div>

          <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700 }}>
            Click on the card number that violates the latent pattern
          </span>
        </div>
      )}

      {/* ── 1. SEQUENCE & TRANSFORMATION PROGRESSION ─────────── */}
      {(question.challengeType === 'sequence' || question.challengeType === 'transformation') && question.sequenceItems && (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
            {question.sequenceItems.map((item, idx) => (
              <React.Fragment key={idx}>
                <SequenceDisplayItem item={item} />
                <span style={{ color: '#CBD5E1', fontWeight: 900, fontSize: '1.2rem' }}>→</span>
              </React.Fragment>
            ))}
            <SequenceDisplayItem item={question.sequenceItems[0]} isQuestionMark={true} />
          </div>

          {/* Options */}
          {question.sequenceOptions && (
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', width: '100%', marginTop: '6px' }}>
              {question.sequenceOptions.map((opt, idx) => {
                const isSelected = selectedOptionIndex === idx;
                const isCorrect = showExplanation && idx === question.correctOptionIndex;
                return (
                  <button
                    key={idx}
                    onClick={() => onSelectOption(idx)}
                    disabled={isDemo}
                    style={{
                      background: isCorrect ? '#ECFDF5' : isSelected ? '#EFF6FF' : '#FFFFFF',
                      border: isCorrect ? '2.5px solid #10B981' : isSelected ? '2.5px solid #EA580C' : '1.5px solid #E2E8F0',
                      borderRadius: '16px',
                      padding: '4px',
                      cursor: isDemo ? 'default' : 'pointer',
                      transition: 'all 0.15s ease',
                      transform: isSelected ? 'scale(1.05)' : 'none'
                    }}
                  >
                    <SequenceDisplayItem item={opt} size={64} />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── 2. VISUAL ANALOGY (A : B :: C : ?) ────────────────── */}
      {question.challengeType === 'analogy' && question.analogyData && (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
            <SequenceDisplayItem item={question.analogyData.itemA} />
            <span style={{ fontWeight: 900, color: '#64748B', fontSize: '1.2rem' }}>:</span>
            <SequenceDisplayItem item={question.analogyData.itemB} />
            <span style={{ fontWeight: 900, color: '#EA580C', fontSize: '1.2rem', margin: '0 4px' }}>::</span>
            <SequenceDisplayItem item={question.analogyData.itemC} />
            <span style={{ fontWeight: 900, color: '#64748B', fontSize: '1.2rem' }}>:</span>
            <SequenceDisplayItem item={question.analogyData.itemA} isQuestionMark={true} />
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', width: '100%', marginTop: '6px' }}>
            {question.analogyData.options.map((opt, idx) => {
              const isSelected = selectedOptionIndex === idx;
              const isCorrect = showExplanation && idx === question.analogyData?.correctOptionIndex;
              return (
                <button
                  key={idx}
                  onClick={() => onSelectOption(idx)}
                  disabled={isDemo}
                  style={{
                    background: isCorrect ? '#ECFDF5' : isSelected ? '#EFF6FF' : '#FFFFFF',
                    border: isCorrect ? '2.5px solid #10B981' : isSelected ? '2.5px solid #EA580C' : '1.5px solid #E2E8F0',
                    borderRadius: '16px',
                    padding: '4px',
                    cursor: isDemo ? 'default' : 'pointer'
                  }}
                >
                  <SequenceDisplayItem item={opt} size={64} />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── 3. AON SCALES CLX (Set A vs Set B Classification) ─── */}
      {question.challengeType === 'scales_clx' && question.scalesClxData && (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
          {/* Set A vs Set B Example Columns */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', width: '100%' }}>
            <div style={{
              padding: '10px',
              background: '#F0FDF4',
              borderRadius: '12px',
              border: '1.5px solid #86EFAC',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 900, color: '#166534' }}>SET A</span>
              <div style={{ display: 'flex', gap: '6px' }}>
                {question.scalesClxData.setAExamples.map((g, i) => (
                  <MiniGridCard key={i} grid={g} size={64} />
                ))}
              </div>
            </div>

            <div style={{
              padding: '10px',
              background: '#EFF6FF',
              borderRadius: '12px',
              border: '1.5px solid #93C5FD',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 900, color: '#1E40AF' }}>SET B</span>
              <div style={{ display: 'flex', gap: '6px' }}>
                {question.scalesClxData.setBExamples.map((g, i) => (
                  <MiniGridCard key={i} grid={g} size={64} />
                ))}
              </div>
            </div>
          </div>

          {/* Target Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', margin: '4px 0' }}>
            <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#1E293B' }}>Target Grid:</span>
            <MiniGridCard grid={question.scalesClxData.targetGrid} size={80} />
          </div>

          {/* Set A / Set B Choice Buttons */}
          <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
            {['Set A', 'Set B', 'Neither'].map((choice, idx) => {
              const isSelected = selectedClxChoice === choice;
              const isCorrect = showExplanation && choice === question.scalesClxData?.correctSet;
              return (
                <button
                  key={choice}
                  onClick={() => handleClxSelect(choice as any, idx)}
                  disabled={isDemo}
                  style={{
                    flex: 1,
                    padding: '12px 6px',
                    borderRadius: '10px',
                    background: isCorrect
                      ? '#10B981'
                      : isSelected
                      ? '#EA580C'
                      : choice === 'Set A'
                      ? '#DCFCE7'
                      : choice === 'Set B'
                      ? '#DBEAFE'
                      : '#F1F5F9',
                    color: isCorrect || isSelected ? '#FFFFFF' : '#1E293B',
                    border: isCorrect || isSelected ? 'none' : '1.5px solid #CBD5E1',
                    fontSize: '0.92rem',
                    fontWeight: 800,
                    cursor: isDemo ? 'default' : 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {choice}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── 4. STRUCTURAL CLASSIFICATION (Pick 1 of 4 or Pick 2 of 4) ────────── */}
      {question.challengeType === 'classification' && question.exampleGrids && question.candidateGrids && (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', justifyContent: 'center' }}>
            {question.exampleGrids.map((g, i) => (
              <MiniGridCard
                key={i}
                grid={g}
                size={74}
                label={question.exampleGrids!.length === 1 ? 'Example Rule' : `Example ${i + 1}`}
              />
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', width: '100%' }}>
            {question.candidateGrids.map((g, idx) => {
              const isSingle = (question.requiredPickCount ?? question.correctIndices?.length ?? 2) === 1;
              const isSelected = isSingle
                ? selectedOptionIndex === idx
                : selectedOptionIndices.includes(idx);
              const isCorrect = showExplanation && question.correctIndices?.includes(idx);

              return (
                <button
                  key={idx}
                  onClick={() => onSelectOption(idx)}
                  disabled={isDemo}
                  style={{
                    padding: '8px 4px',
                    borderRadius: '12px',
                    background: isCorrect ? '#ECFDF5' : isSelected ? '#FFF7ED' : '#FFFFFF',
                    border: isCorrect ? '2.5px solid #10B981' : isSelected ? '2.5px solid #EA580C' : '1.5px solid #E2E8F0',
                    cursor: isDemo ? 'default' : 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <MiniGridCard grid={g} size={64} label={`#${idx + 1}`} />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Explanation Banner ─────────────────────────────────── */}
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
          <strong>✓ Inductive Discovery:</strong> {question.ruleExplanation}
        </div>
      )}
    </div>
  );
};
