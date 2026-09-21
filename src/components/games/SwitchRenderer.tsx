import React, { useState, useEffect, useRef } from 'react';
import { SwitchTask, SwitchItem, applyPermutation } from '../../engine/generators/switchGenerator';

interface SwitchRendererProps {
  puzzle: SwitchTask;
  selectedSwitchIndex: number | null;
  onSelectSwitch: (index: number) => void;
  showExplanation?: boolean;
  isDemo?: boolean;
}

const ShapeTile: React.FC<{ item: SwitchItem; size?: number; label?: string | number }> = ({
  item,
  size = 58,
  label,
}) => {
  const iconSize = Math.round(size * 0.48);

  const renderShape = () => {
    switch (item.shape) {
      case 'circle':
        return (
          <div style={{
            width: iconSize,
            height: iconSize,
            borderRadius: '50%',
            background: item.color || '#10B981',
          }} />
        );
      case 'square':
        return (
          <div style={{
            width: iconSize,
            height: iconSize,
            background: item.color || '#EF4444',
            borderRadius: '4px',
          }} />
        );
      case 'triangle':
        return (
          <svg width={iconSize + 4} height={iconSize + 4} viewBox="0 0 32 32">
            <polygon points="16,4 29,28 3,28" fill={item.color || '#FACC15'} />
          </svg>
        );
      case 'cross':
        return (
          <svg width={iconSize + 4} height={iconSize + 4} viewBox="0 0 32 32">
            <path d="M11,4 L21,4 L21,11 L28,11 L28,21 L21,21 L21,28 L11,28 L11,21 L4,21 L4,11 L11,11 Z" fill={item.color || '#0082E6'} />
          </svg>
        );
      case 'diamond':
        return (
          <div style={{
            width: iconSize,
            height: iconSize,
            background: item.color || '#8B5CF6',
            transform: 'rotate(45deg)',
            borderRadius: '3px',
          }} />
        );
      default:
        return (
          <div style={{
            width: iconSize,
            height: iconSize,
            borderRadius: '50%',
            background: item.color || '#10B981',
          }} />
        );
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
      <div style={{
        width: size,
        height: size,
        borderRadius: '14px',
        background: '#E2E8F0',
        border: '1.5px solid #CBD5E1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.06), 0 2px 6px rgba(0,0,0,0.04)',
      }}>
        {renderShape()}
      </div>
      {label !== undefined && (
        <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94A3B8', fontFamily: 'monospace' }}>
          {label}
        </span>
      )}
    </div>
  );
};

export const SwitchRenderer: React.FC<SwitchRendererProps> = ({
  puzzle,
  selectedSwitchIndex,
  onSelectSwitch,
  showExplanation,
  isDemo = false,
}) => {
  const [selectedUpper, setSelectedUpper] = useState<number | null>(selectedSwitchIndex ?? null);
  const [selectedLower, setSelectedLower] = useState<number | null>(null);
  const [selectedReverseInput, setSelectedReverseInput] = useState<number | null>(null);
  const [demoRationale, setDemoRationale] = useState<string | null>(null);
  const demoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setSelectedUpper(selectedSwitchIndex ?? null);
    setSelectedLower(null);
    setSelectedReverseInput(null);
    setDemoRationale(null);

    // If demo mode, run AI live solver playback
    if (isDemo && puzzle.aiDemoSteps.length > 0) {
      let step = 0;
      const runStep = () => {
        if (step < puzzle.aiDemoSteps.length) {
          const action = puzzle.aiDemoSteps[step];
          setDemoRationale(`🤖 Qivora AI (${action.stepTitle}): ${action.rationale}`);
          if (puzzle.subtype === 'reverse_rule' && action.chosenUpperIndex !== undefined) {
            setSelectedReverseInput(action.chosenUpperIndex);
          } else {
            if (action.chosenUpperIndex !== undefined) {
              setSelectedUpper(action.chosenUpperIndex);
            }
            if (action.chosenLowerIndex !== undefined) {
              setSelectedLower(action.chosenLowerIndex);
            }
          }
          step++;
          demoTimerRef.current = setTimeout(runStep, 1500);
        } else {
          demoTimerRef.current = setTimeout(() => {
            setDemoRationale(`🤖 Qivora AI Solved: Full transformation verified.`);
          }, 1000);
        }
      };

      demoTimerRef.current = setTimeout(runStep, 600);
    }

    return () => {
      if (demoTimerRef.current) clearTimeout(demoTimerRef.current);
    };
  }, [puzzle.id, isDemo, selectedSwitchIndex]);

  const handleUpperSelect = (idx: number) => {
    if (isDemo) return;
    setSelectedUpper(idx);
    if (!puzzle.isChained && puzzle.subtype !== 'reverse_rule') {
      onSelectSwitch(idx);
    }
  };

  const handleLowerSelect = (idx: number) => {
    if (isDemo) return;
    setSelectedLower(idx);
    if (puzzle.isChained && selectedUpper !== null) {
      const isCorrect = selectedUpper === puzzle.correctUpperIndex && idx === puzzle.correctLowerIndex;
      onSelectSwitch(isCorrect ? puzzle.correctSwitchIndex : -1);
    }
  };

  const handleReverseInputSelect = (idx: number) => {
    if (isDemo) return;
    setSelectedReverseInput(idx);
    const isCorrect = idx === puzzle.correctInputIndex;
    onSelectSwitch(isCorrect ? 0 : -1);
  };

  const handleSubmit = () => {
    if (isDemo) return;
    if (puzzle.subtype === 'reverse_rule') {
      if (selectedReverseInput !== null) {
        onSelectSwitch(selectedReverseInput === puzzle.correctInputIndex ? 0 : -1);
      }
    } else if (puzzle.isChained) {
      if (selectedUpper !== null && selectedLower !== null) {
        const isCorrect = selectedUpper === puzzle.correctUpperIndex && selectedLower === puzzle.correctLowerIndex;
        onSelectSwitch(isCorrect ? puzzle.correctSwitchIndex : -1);
      }
    } else {
      if (selectedUpper !== null) {
        onSelectSwitch(selectedUpper);
      }
    }
  };

  const currentIntermediate =
    selectedUpper !== null && puzzle.candidateSwitches[selectedUpper]
      ? applyPermutation(puzzle.inputItems, puzzle.candidateSwitches[selectedUpper].digits)
      : puzzle.intermediateItems || puzzle.inputItems;

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
      {/* Level and Mode Header */}
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
          color: '#0284C7',
          background: '#E0F2FE',
          padding: '4px 12px',
          borderRadius: '20px',
          textTransform: 'uppercase'
        }}>
          {puzzle.subtype.replace('_', ' ')} • LVL {puzzle.level || 1}
        </span>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B' }}>
          {puzzle.subtype === 'reverse_rule' ? 'Deduce Original Input' : 'Rule: Position Transformation'}
        </span>
      </div>

      {/* Task Switch Cue Prompt */}
      {puzzle.taskRulePrompt && (
        <div style={{
          width: '100%',
          padding: '8px 14px',
          background: '#FEF3C7',
          border: '1.5px solid #F59E0B',
          borderRadius: '10px',
          fontSize: '0.82rem',
          fontWeight: 800,
          color: '#92400E',
          textAlign: 'center',
          marginBottom: '10px'
        }}>
          ⚡ {puzzle.taskRulePrompt}
        </div>
      )}

      {/* ── REVERSE RULE MODE ────────────────────────────────── */}
      {puzzle.subtype === 'reverse_rule' && puzzle.reverseGivenSwitch && puzzle.candidateInputs ? (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569' }}>
            Given Fixed Switch Operator:
          </div>
          <div style={{
            padding: '8px 24px',
            background: '#003E92',
            color: '#FFFFFF',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '1.4rem',
            fontWeight: 800,
            letterSpacing: '0.15em'
          }}>
            {puzzle.reverseGivenSwitch.code}
          </div>

          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginTop: '4px' }}>
            Produces Target Output:
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            {puzzle.targetOutput.map((item, i) => (
              <ShapeTile key={i} item={item} size={52} label={i + 1} />
            ))}
          </div>

          <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#1E293B', marginTop: '12px' }}>
            Which Input Configuration produced this output?
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
            {puzzle.candidateInputs.map((cand, idx) => {
              const isSelected = selectedReverseInput === idx;
              const isCorrect = showExplanation && idx === puzzle.correctInputIndex;
              return (
                <button
                  key={idx}
                  onClick={() => handleReverseInputSelect(idx)}
                  disabled={isDemo}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 16px',
                    borderRadius: '12px',
                    background: isCorrect ? '#ECFDF5' : isSelected ? '#EFF6FF' : '#F8FAFC',
                    border: isCorrect ? '2px solid #10B981' : isSelected ? '2px solid #0082E6' : '1.5px solid #E2E8F0',
                    cursor: isDemo ? 'default' : 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#64748B' }}>
                    Option {idx + 1}
                  </span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {cand.map((item, ci) => (
                      <ShapeTile key={ci} item={item} size={42} />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <>
          {/* ── TOP INPUT SHAPE TILES ────────────────────────────── */}
          <div style={{
            display: 'flex',
            gap: '14px',
            justifyContent: 'center',
            marginBottom: '4px'
          }}>
            {puzzle.inputItems.map((item, i) => (
              <ShapeTile key={item.id} item={item} size={58} label={i + 1} />
            ))}
          </div>

          {/* ── UPPER FUNNEL MACHINE (Matching Images 4 & 5) ──────── */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <svg width="68" height="28" viewBox="0 0 80 40">
              <polygon points="5,2 75,2 55,38 25,38" fill="#475569" />
              <rect x="25" y="34" width="30" height="6" fill="#334155" />
            </svg>
            <div style={{ width: '4px', height: '10px', background: '#94A3B8' }} />
            <div style={{
              width: '280px',
              height: '4px',
              borderRadius: '2px',
              background: '#94A3B8',
              position: 'relative'
            }}>
              {[16, 50, 84].map((pct, i) => (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    left: `${pct}%`,
                    top: '4px',
                    width: '4px',
                    height: '10px',
                    background: '#94A3B8',
                    transform: 'translateX(-50%)'
                  }}
                />
              ))}
            </div>
          </div>

          {/* ── UPPER CANDIDATE SWITCH BUTTONS (Images 4 & 5) ────── */}
          <div style={{
            display: 'flex',
            gap: '14px',
            justifyContent: 'center',
            margin: '8px 0',
            width: '100%'
          }}>
            {(puzzle.upperSwitches || puzzle.candidateSwitches).map((sw, idx) => {
              const isSelected = selectedUpper === idx;
              const isCorrect = showExplanation && idx === (puzzle.correctUpperIndex ?? puzzle.correctSwitchIndex);
              const isWrong = showExplanation && isSelected && !isCorrect;

              return (
                <button
                  key={sw.id}
                  onClick={() => handleUpperSelect(idx)}
                  disabled={isDemo}
                  style={{
                    flex: 1,
                    maxWidth: '100px',
                    padding: '12px 6px',
                    borderRadius: '8px',
                    background: isCorrect
                      ? '#DCFCE7'
                      : isWrong
                      ? '#FEE2E2'
                      : isSelected
                      ? '#E0F2FE'
                      : '#E2E8F0',
                    color: isCorrect
                      ? '#166534'
                      : isWrong
                      ? '#991B1B'
                      : isSelected
                      ? '#0369A1'
                      : '#475569',
                    border: isCorrect
                      ? '2.5px solid #16A34A'
                      : isWrong
                      ? '2.5px solid #DC2626'
                      : isSelected
                      ? '2.5px solid #0284C7'
                      : '1.5px solid #CBD5E1',
                    cursor: isDemo ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'monospace',
                    fontSize: '1.35rem',
                    fontWeight: 900,
                    letterSpacing: '0.08em',
                    boxShadow: isSelected
                      ? '0 0 0 3px rgba(2,132,199,0.2)'
                      : '0 1px 3px rgba(0,0,0,0.04)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {sw.code}
                </button>
              );
            })}
          </div>

          {/* ── IF CHAINED: INTERMEDIATE STATE & LOWER FUNNEL ───── */}
          {puzzle.isChained && puzzle.lowerSwitches && (
            <>
              <div style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                color: '#64748B',
                textTransform: 'uppercase',
                margin: '6px 0 2px'
              }}>
                Intermediate Conduits
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', margin: '4px 0' }}>
                {currentIntermediate.map((item, i) => (
                  <ShapeTile key={i} item={item} size={46} />
                ))}
              </div>

              {/* Lower Funnel candidate switches */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <svg width="58" height="24" viewBox="0 0 80 40">
                  <polygon points="5,2 75,2 55,38 25,38" fill="#475569" />
                </svg>
              </div>

              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'center',
                margin: '8px 0',
                width: '100%'
              }}>
                {puzzle.lowerSwitches.map((sw, idx) => {
                  const isSelected = selectedLower === idx;
                  const isCorrect = showExplanation && idx === puzzle.correctLowerIndex;
                  return (
                    <button
                      key={sw.id}
                      onClick={() => handleLowerSelect(idx)}
                      disabled={isDemo}
                      style={{
                        flex: 1,
                        maxWidth: '100px',
                        padding: '10px 4px',
                        borderRadius: '8px',
                        background: isCorrect
                          ? '#DCFCE7'
                          : isSelected
                          ? '#E0F2FE'
                          : '#E2E8F0',
                        color: isCorrect ? '#166534' : isSelected ? '#0369A1' : '#475569',
                        border: isCorrect
                          ? '2.5px solid #16A34A'
                          : isSelected
                          ? '2.5px solid #0284C7'
                          : '1.5px solid #CBD5E1',
                        cursor: isDemo ? 'default' : 'pointer',
                        fontFamily: 'monospace',
                        fontSize: '1.25rem',
                        fontWeight: 900,
                        letterSpacing: '0.08em'
                      }}
                    >
                      {sw.code}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* ── LOWER FUNNEL OUTLET (Matching Images 4 & 5) ──────── */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
              width: '280px',
              height: '4px',
              borderRadius: '2px',
              background: '#94A3B8',
              position: 'relative'
            }}>
              {[16, 50, 84].map((pct, i) => (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    left: `${pct}%`,
                    bottom: '4px',
                    width: '4px',
                    height: '10px',
                    background: '#94A3B8',
                    transform: 'translateX(-50%)'
                  }}
                />
              ))}
            </div>
            <div style={{ width: '4px', height: '10px', background: '#94A3B8' }} />
            <svg width="68" height="28" viewBox="0 0 80 40">
              <rect x="25" y="0" width="30" height="6" fill="#334155" />
              <polygon points="25,2 55,2 75,38 5,38" fill="#475569" />
            </svg>
          </div>

          {/* ── TARGET OUTPUT SHAPE TILES ────────────────────────── */}
          <div style={{
            display: 'flex',
            gap: '14px',
            justifyContent: 'center',
            marginTop: '6px',
            marginBottom: '10px'
          }}>
            {puzzle.targetOutput.map((item) => (
              <ShapeTile key={item.id} item={item} size={58} />
            ))}
          </div>
        </>
      )}

      {/* ── Demo Rationale or Explanation Banner (Images 4 & 5) ── */}
      {demoRationale && (
        <div style={{
          marginTop: '12px',
          width: '100%',
          padding: '12px 16px',
          background: '#EFF6FF',
          border: '1.5px solid #3B82F6',
          borderRadius: '12px',
          fontSize: '0.86rem',
          color: '#1E40AF',
          lineHeight: 1.5
        }}>
          {demoRationale}
        </div>
      )}

      {showExplanation && (
        <div style={{
          marginTop: '14px',
          width: '100%',
          padding: '16px 20px',
          background: '#F8FAFC',
          border: '1.5px solid #CBD5E1',
          borderRadius: '14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1E293B' }}>
            💡 Step-by-Step Value Assignment (Image 5 Method):
          </div>

          {/* Input Values Mapping */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748B' }}>1. Assign Input:</span>
            {puzzle.inputItems.map((item, idx) => (
              <span key={idx} style={{ fontSize: '0.84rem', fontWeight: 800, color: '#1E293B', background: '#E2E8F0', padding: '2px 8px', borderRadius: '6px' }}>
                {item.name} = {idx + 1}
              </span>
            ))}
          </div>

          {/* Output Values Mapping */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748B' }}>2. Output Positions:</span>
            {puzzle.targetOutput.map((item, idx) => (
              <span key={idx} style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0369A1', background: '#E0F2FE', padding: '2px 8px', borderRadius: '6px' }}>
                Pos {idx + 1} ({item.name}) = {item.id}
              </span>
            ))}
          </div>

          <div style={{ fontSize: '0.92rem', fontWeight: 900, color: '#166534', marginTop: '4px' }}>
            ✓ Correct Operator Code = {puzzle.candidateSwitches[puzzle.correctSwitchIndex]?.code || puzzle.upperSwitches?.[puzzle.correctUpperIndex ?? 0]?.code}
          </div>
        </div>
      )}
    </div>
  );
};
