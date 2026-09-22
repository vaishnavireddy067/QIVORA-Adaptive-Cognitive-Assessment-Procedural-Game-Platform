import React, { useState, useEffect } from 'react';
import { GameId } from '../../types';
import { Play, RotateCcw, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

interface AILivePlayDemoProps {
  gameId: GameId;
  onProceedToPractice: () => void;
}

export const AILivePlayDemo: React.FC<AILivePlayDemoProps> = ({ gameId, onProceedToPractice }) => {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Switch game state for live demonstration (Image 2 style)
  const [selectedDemoSwitch, setSelectedDemoSwitch] = useState<number | null>(null);

  // Math game state for live demonstration (Image 4 style)
  const [mathDemoSlots, setMathDemoSlots] = useState<(number | null)[]>([null, null, null]);
  const [mathDemoActiveDigit, setMathDemoActiveDigit] = useState<number | null>(null);

  // Inductive sequence demonstration state
  const inductiveDemoSteps = [1, 2, 3];
  const [inductiveHighlightedIdx, setInductiveHighlightedIdx] = useState<number | null>(null);

  // Grid demo state
  const [gridSolved, setGridSolved] = useState(false);

  // Deductive demo state
  const [deductiveStep, setDeductiveStep] = useState(0);

  // Motion demo state
  const [motionLaserActive, setMotionLaserActive] = useState(false);

  // Memory demo state
  const [memoryPhase, setMemoryPhase] = useState<'memorize' | 'distractor' | 'recall' | 'solved'>('memorize');

  // Attention demo state
  const [attentionTargetFound, setAttentionTargetFound] = useState(false);

  // Reaction demo state
  const [reactionPhase, setReactionPhase] = useState<'ready' | 'green' | 'reacted' | 'red_inhibit'>('ready');

  // Automatic AI player step sequence
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (isPlaying) {
      if (gameId === 'switch') {
        if (step === 0) {
          setSelectedDemoSwitch(null);
          timer = setTimeout(() => setStep(1), 1600);
        } else if (step === 1) {
          timer = setTimeout(() => setStep(2), 2000);
        } else if (step === 2) {
          setSelectedDemoSwitch(2); // Clicks switch 3 [3 2 4 1]
          timer = setTimeout(() => setStep(3), 2000);
        } else if (step === 3) {
          timer = setTimeout(() => {}, 3000);
        }
      } else if (gameId === 'math') {
        if (step === 0) {
          setMathDemoSlots([null, null, null]);
          setMathDemoActiveDigit(null);
          timer = setTimeout(() => setStep(1), 1600);
        } else if (step === 1) {
          setMathDemoActiveDigit(6);
          setMathDemoSlots([6, null, null]);
          timer = setTimeout(() => setStep(2), 1800);
        } else if (step === 2) {
          setMathDemoActiveDigit(3);
          setMathDemoSlots([6, 3, null]);
          timer = setTimeout(() => setStep(3), 1800);
        } else if (step === 3) {
          setMathDemoActiveDigit(1);
          setMathDemoSlots([6, 3, 1]);
          timer = setTimeout(() => setStep(4), 2000);
        }
      } else if (gameId === 'inductive') {
        if (step === 0) {
          setInductiveHighlightedIdx(0);
          timer = setTimeout(() => setStep(1), 1600);
        } else if (step === 1) {
          setInductiveHighlightedIdx(1);
          timer = setTimeout(() => setStep(2), 1600);
        } else if (step === 2) {
          setInductiveHighlightedIdx(2);
          timer = setTimeout(() => setStep(3), 1600);
        } else if (step === 3) {
          // AI clicks Shape: Circle
          setInductiveHighlightedIdx(3);
          timer = setTimeout(() => setStep(4), 1600);
        } else if (step === 4) {
          // AI clicks Rotation: 270°
          setInductiveHighlightedIdx(3);
          timer = setTimeout(() => setStep(5), 1600);
        } else if (step === 5) {
          // AI submits & celebrates
          timer = setTimeout(() => setStep(6), 1800);
        }
      } else if (gameId === 'grid') {
        if (step === 0) {
          setGridSolved(false);
          timer = setTimeout(() => setStep(1), 1800);
        } else if (step === 1) {
          setGridSolved(true);
          timer = setTimeout(() => setStep(2), 2000);
        }
      } else if (gameId === 'deductive') {
        if (step === 0) {
          setDeductiveStep(0);
          timer = setTimeout(() => setStep(1), 1600);
        } else if (step === 1) {
          setDeductiveStep(1);
          timer = setTimeout(() => setStep(2), 1800);
        } else if (step === 2) {
          setDeductiveStep(2);
          timer = setTimeout(() => setStep(3), 2000);
        }
      } else if (gameId === 'motion') {
        if (step === 0) {
          setMotionLaserActive(false);
          timer = setTimeout(() => setStep(1), 1600);
        } else if (step === 1) {
          setMotionLaserActive(false);
          timer = setTimeout(() => setStep(2), 1800);
        } else if (step === 2) {
          setMotionLaserActive(true);
          timer = setTimeout(() => setStep(3), 2200);
        }
      } else if (gameId === 'memory') {
        if (step === 0) {
          setMemoryPhase('memorize');
          timer = setTimeout(() => setStep(1), 1800);
        } else if (step === 1) {
          setMemoryPhase('distractor');
          timer = setTimeout(() => setStep(2), 1800);
        } else if (step === 2) {
          setMemoryPhase('recall');
          timer = setTimeout(() => setStep(3), 1600);
        } else if (step === 3) {
          setMemoryPhase('solved');
          timer = setTimeout(() => {}, 2000);
        }
      } else if (gameId === 'attention') {
        if (step === 0) {
          setAttentionTargetFound(false);
          timer = setTimeout(() => setStep(1), 1600);
        } else if (step === 1) {
          setAttentionTargetFound(true);
          timer = setTimeout(() => setStep(2), 1800);
        }
      } else if (gameId === 'reaction') {
        if (step === 0) {
          setReactionPhase('ready');
          timer = setTimeout(() => setStep(1), 1400);
        } else if (step === 1) {
          setReactionPhase('green');
          timer = setTimeout(() => setStep(2), 1200);
        } else if (step === 2) {
          setReactionPhase('reacted');
          timer = setTimeout(() => setStep(3), 1800);
        } else if (step === 3) {
          setReactionPhase('red_inhibit');
          timer = setTimeout(() => {}, 2200);
        }
      } else {
        if (step < 2) {
          timer = setTimeout(() => setStep(prev => prev + 1), 1800);
        }
      }
    }

    return () => clearTimeout(timer);
  }, [step, isPlaying, gameId]);

  const handleRestartDemo = () => {
    setStep(0);
    setSelectedDemoSwitch(null);
    setMathDemoSlots([null, null, null]);
    setMathDemoActiveDigit(null);
    setGridSolved(false);
    setInductiveHighlightedIdx(null);
    setDeductiveStep(0);
    setMotionLaserActive(false);
    setMemoryPhase('memorize');
    setAttentionTargetFound(false);
    setReactionPhase('ready');
    setIsPlaying(true);
  };

  return (
    <div style={{
      background: 'var(--bg-main)',
      border: '2.5px solid var(--border-ink)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-tactile)',
      padding: '32px 28px',
      margin: '24px 0'
    }}>
      {/* AI Demo Top Header Banner */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '20px',
        paddingBottom: '16px',
        borderBottom: '1.5px solid var(--border-subtle)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="ai-demo-badge">
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-vermillion)', display: 'inline-block' }} />
            <span>AI AGENT LIVE DEMO</span>
          </div>
          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
            Watch the computer solve this step-by-step
          </span>
        </div>

        <button
          onClick={handleRestartDemo}
          className="btn-pill-small"
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <RotateCcw size={12} />
          <span>Replay Demo</span>
        </button>
      </div>

      {/* 1. SWITCH GAME LIVE AI DEMO */}
      {gameId === 'switch' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', width: '100%', maxWidth: '580px' }}>
          
          {/* Top Input Shapes */}
          <div style={{
            background: '#FAF8F5',
            border: '2px solid #CBD5E1',
            borderRadius: '16px',
            padding: '14px 24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%'
          }}>
            <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', fontWeight: 900, color: '#64748B', letterSpacing: '0.08em', marginBottom: '8px' }}>
              INPUT SEQUENCE (1 TO 4)
            </div>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              {[
                { shape: 'square', color: '#EF4444', id: 1 },
                { shape: 'triangle', color: '#F59E0B', id: 2 },
                { shape: 'cross', color: '#06B6D4', id: 3 },
                { shape: 'circle', color: '#84CC16', id: 4 }
              ].map(item => (
                <div key={item.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <div style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '12px',
                    background: '#FFFFFF',
                    border: '2px solid #E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.04)'
                  }}>
                    {item.shape === 'square' && <div style={{ width: '22px', height: '22px', background: item.color, borderRadius: '4px' }} />}
                    {item.shape === 'triangle' && (
                      <svg width="24" height="24" viewBox="0 0 32 32">
                        <polygon points="16,4 29,28 3,28" fill={item.color} />
                      </svg>
                    )}
                    {item.shape === 'cross' && (
                      <svg width="24" height="24" viewBox="0 0 32 32">
                        <path d="M12,4 L20,4 L20,12 L28,12 L28,20 L20,20 L20,28 L12,28 L12,20 L4,20 L4,12 L12,12 Z" fill={item.color} />
                      </svg>
                    )}
                    {item.shape === 'circle' && <div style={{ width: '22px', height: '22px', background: item.color, borderRadius: '50%' }} />}
                  </div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#64748B' }}>
                    #{item.id}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Upper Funnel & Piping */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
              width: '52px',
              height: '18px',
              background: 'linear-gradient(180deg, #94A3B8 0%, #64748B 100%)',
              clipPath: 'polygon(15% 0%, 85% 0%, 65% 100%, 35% 100%)'
            }} />
            <div style={{ width: '6px', height: '10px', background: '#64748B' }} />
            <div style={{ width: '74%', height: '6px', background: '#CBD5E1', borderRadius: '3px', position: 'relative' }}>
              <div style={{ position: 'absolute', left: '16%', top: '4px', width: '6px', height: '10px', background: '#94A3B8' }} />
              <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: '4px', width: '6px', height: '10px', background: '#94A3B8' }} />
              <div style={{ position: 'absolute', right: '16%', top: '4px', width: '6px', height: '10px', background: '#94A3B8' }} />
            </div>
          </div>

          {/* Candidate Switch Blocks with AI Pointer */}
          <div style={{ display: 'flex', gap: '14px', width: '100%', justifyContent: 'center' }}>
            {[
              { code: '2 3 4 1', id: 0 },
              { code: '4 3 2 1', id: 1 },
              { code: '3 2 4 1', id: 2 }
            ].map(sw => {
              const isAiSelected = selectedDemoSwitch === sw.id;

              return (
                <div
                  key={sw.id}
                  style={{
                    flex: 1,
                    maxWidth: '130px',
                    padding: '14px 8px',
                    borderRadius: '14px',
                    background: isAiSelected ? '#F0FDFA' : '#F8FAFC',
                    border: isAiSelected ? '2.5px solid #0D9488' : '2px solid #CBD5E1',
                    boxShadow: isAiSelected ? '0 4px 12px rgba(13, 148, 136, 0.25)' : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    transform: isAiSelected ? 'scale(1.05)' : 'none',
                    transition: 'all 0.2s ease',
                    position: 'relative'
                  }}
                >
                  {isAiSelected && (
                    <div style={{
                      position: 'absolute',
                      top: '-12px',
                      background: '#0D9488',
                      color: '#FFF',
                      fontSize: '0.62rem',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 900,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      boxShadow: '1px 1px 0px #121110'
                    }}>
                      👈 AI CLICK!
                    </div>
                  )}

                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '1.25rem',
                    fontWeight: 950,
                    letterSpacing: '0.1em',
                    color: isAiSelected ? '#0D9488' : '#334155'
                  }}>
                    {sw.code}
                  </span>
                  <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: '#94A3B8' }}>
                    Switch {sw.id + 1}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Lower Funnel & Piping */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '74%', height: '6px', background: '#CBD5E1', borderRadius: '3px', position: 'relative' }}>
              <div style={{ position: 'absolute', left: '16%', bottom: '4px', width: '6px', height: '10px', background: '#94A3B8' }} />
              <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', bottom: '4px', width: '6px', height: '10px', background: '#94A3B8' }} />
              <div style={{ position: 'absolute', right: '16%', bottom: '4px', width: '6px', height: '10px', background: '#94A3B8' }} />
            </div>
            <div style={{ width: '6px', height: '10px', background: '#64748B' }} />
            <div style={{
              width: '52px',
              height: '18px',
              background: 'linear-gradient(180deg, #64748B 0%, #94A3B8 100%)',
              clipPath: 'polygon(35% 0%, 65% 0%, 85% 100%, 15% 100%)'
            }} />
          </div>

          {/* Target Output Shapes */}
          <div style={{
            background: '#FFFFFF',
            border: '2px solid #141312',
            borderRadius: '16px',
            padding: '14px 24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            boxShadow: '3px 3px 0px #141312'
          }}>
            <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', fontWeight: 900, color: '#121110', letterSpacing: '0.08em', marginBottom: '8px' }}>
              TARGET OUTPUT SEQUENCE (BLUE, YELLOW, GREEN, RED)
            </div>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              {[
                { shape: 'cross', color: '#06B6D4', originId: 3 },
                { shape: 'triangle', color: '#F59E0B', originId: 2 },
                { shape: 'circle', color: '#84CC16', originId: 4 },
                { shape: 'square', color: '#EF4444', originId: 1 }
              ].map((item, idx) => (
                <div key={idx} style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '12px',
                  background: '#FFFFFF',
                  border: '2px solid #E2E8F0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.04)'
                }}>
                  {item.shape === 'square' && <div style={{ width: '22px', height: '22px', background: item.color, borderRadius: '4px' }} />}
                  {item.shape === 'triangle' && (
                    <svg width="24" height="24" viewBox="0 0 32 32">
                      <polygon points="16,4 29,28 3,28" fill={item.color} />
                    </svg>
                  )}
                  {item.shape === 'cross' && (
                    <svg width="24" height="24" viewBox="0 0 32 32">
                      <path d="M12,4 L20,4 L20,12 L28,12 L28,20 L20,20 L20,28 L12,28 L12,20 L4,20 L4,12 L12,12 Z" fill={item.color} />
                    </svg>
                  )}
                  {item.shape === 'circle' && <div style={{ width: '22px', height: '22px', background: item.color, borderRadius: '50%' }} />}
                </div>
              ))}
            </div>
          </div>

          {/* AI Narrative Commentary Box */}
          <div style={{
            width: '100%',
            background: step === 3 ? '#ECFDF5' : '#FFFFFF',
            border: step === 3 ? '2px solid #10B981' : '2px solid #141312',
            borderRadius: '14px',
            padding: '16px 20px',
            fontSize: '0.92rem',
            lineHeight: 1.5,
            fontWeight: 600
          }}>
            {step === 0 && (
              <span>🤖 <strong>AI Analysis:</strong> Comparing input sequence [1: Red, 2: Yellow, 3: Blue, 4: Green] with target output [Blue, Yellow, Green, Red].</span>
            )}
            {step === 1 && (
              <span style={{ color: '#0D9488' }}>
                🤖 <strong>Position Mapping:</strong> Slot 1 needs Blue (#3), Slot 2 needs Yellow (#2), Slot 3 needs Green (#4), Slot 4 needs Red (#1). Target permutation is <strong>3 2 4 1</strong>!
              </span>
            )}
            {step === 2 && (
              <span style={{ color: '#0D9488' }}>
                🤖 <strong>AI Action:</strong> Clicking Switch 3 <strong>[ 3 2 4 1 ]</strong>! Activating circuit...
              </span>
            )}
            {step === 3 && (
              <span style={{ color: '#047857' }}>
                🎉 <strong>Permutation Validated:</strong> Switch [3 2 4 1] successfully routes the shapes into the exact target sequence!
              </span>
            )}
          </div>
        </div>
      )}

      {/* 2. INDUCTIVE REASONING LIVE AI DEMO */}
      {gameId === 'inductive' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', alignItems: 'center', width: '100%' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap',
            justifyContent: 'center',
            padding: '24px 20px',
            background: '#FFFFFF',
            border: '2.5px solid var(--border-ink)',
            borderRadius: 'var(--radius-md)',
            boxShadow: '4px 4px 0px #121110',
            width: '100%',
            maxWidth: '680px',
            position: 'relative'
          }}>
            {step < 3 && (
              <div style={{
                position: 'absolute',
                top: '-12px',
                left: step === 0 ? '18%' : step === 1 ? '42%' : '66%',
                background: 'var(--accent-vermillion)',
                color: '#FFF',
                padding: '2px 8px',
                borderRadius: '3px',
                fontSize: '0.68rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 900,
                boxShadow: '2px 2px 0px #121110',
                transition: 'left 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                zIndex: 10
              }}>
                🤖 AI INSPECTING
              </div>
            )}

            <div style={{
              width: '95px',
              height: '95px',
              background: step === 0 ? 'var(--accent-yellow)' : 'var(--bg-main)',
              border: step === 0 ? '2.5px solid var(--accent-vermillion)' : '2px solid var(--border-ink)',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              boxShadow: step === 0 ? '3px 3px 0px #FF3B20' : 'none',
              transition: 'all 0.2s ease'
            }}>
              <span style={{ position: 'absolute', top: '4px', left: '6px', fontSize: '0.65rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>#1</span>
              <svg width="34" height="34" viewBox="0 0 40 40">
                <polygon points="20,6 34,34 6,34" fill="#121110" stroke="#121110" strokeWidth="2" />
              </svg>
              <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#8E8B85', marginTop: '2px' }}>0°</span>
            </div>

            <span style={{ fontWeight: 900, fontSize: '1.2rem' }}>→</span>

            <div style={{
              width: '95px',
              height: '95px',
              background: step === 1 ? 'var(--accent-yellow)' : 'var(--bg-main)',
              border: step === 1 ? '2.5px solid var(--accent-vermillion)' : '2px solid var(--border-ink)',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              boxShadow: step === 1 ? '3px 3px 0px #FF3B20' : 'none',
              transition: 'all 0.2s ease'
            }}>
              <span style={{ position: 'absolute', top: '4px', left: '6px', fontSize: '0.65rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>#2</span>
              <svg width="32" height="32" viewBox="0 0 40 40" style={{ transform: 'rotate(90deg)' }}>
                <rect x="8" y="8" width="24" height="24" rx="2" fill="#121110" stroke="#121110" strokeWidth="2" />
              </svg>
              <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#8E8B85', marginTop: '2px' }}>90°</span>
            </div>

            <span style={{ fontWeight: 900, fontSize: '1.2rem' }}>→</span>

            <div style={{
              width: '95px',
              height: '95px',
              background: step === 2 ? 'var(--accent-yellow)' : 'var(--bg-main)',
              border: step === 2 ? '2.5px solid var(--accent-vermillion)' : '2px solid var(--border-ink)',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              boxShadow: step === 2 ? '3px 3px 0px #FF3B20' : 'none',
              transition: 'all 0.2s ease'
            }}>
              <span style={{ position: 'absolute', top: '4px', left: '6px', fontSize: '0.65rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>#3</span>
              <svg width="34" height="34" viewBox="0 0 40 40" style={{ transform: 'rotate(180deg)' }}>
                <polygon points="20,5 35,20 20,35 5,20" fill="#121110" stroke="#121110" strokeWidth="2" />
              </svg>
              <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#8E8B85', marginTop: '2px' }}>180°</span>
            </div>

            <span style={{ fontWeight: 900, fontSize: '1.2rem' }}>→</span>

            <div style={{
              width: '105px',
              height: '105px',
              background: step >= 5 ? '#D9F8E4' : '#FFFFFF',
              border: step >= 5 ? '3px solid #10B981' : step >= 3 ? '3px solid var(--accent-vermillion)' : '2.5px dashed var(--border-ink)',
              borderRadius: 'var(--radius-sm)',
              boxShadow: step >= 3 ? '4px 4px 0px #121110' : 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              transition: 'all 0.25s ease'
            }}>
              {step >= 3 ? (
                <>
                  <div style={{
                    position: 'absolute',
                    top: '4px',
                    right: '6px',
                    fontSize: '0.6rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 900,
                    background: step >= 5 ? '#10B981' : 'var(--accent-vermillion)',
                    color: '#FFF',
                    padding: '1px 4px',
                    borderRadius: '2px'
                  }}>
                    {step >= 5 ? 'SOLVED' : 'CONSTRUCTING'}
                  </div>
                  <svg width="34" height="34" viewBox="0 0 40 40" style={{
                    transform: step >= 4 ? 'rotate(270deg)' : 'rotate(0deg)',
                    transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}>
                    <circle cx="20" cy="20" r="14" fill="#121110" stroke="#121110" strokeWidth="2" />
                  </svg>
                  <span style={{ fontSize: '0.62rem', fontWeight: 800, color: step >= 5 ? '#10B981' : '#8E8B85', marginTop: '2px' }}>
                    {step >= 4 ? '270°' : '0°'}
                  </span>
                </>
              ) : (
                <span style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--accent-vermillion)' }}>?</span>
              )}
            </div>
          </div>

          <div style={{
            width: '100%',
            maxWidth: '680px',
            background: '#FAF8F5',
            border: '2px solid var(--border-ink)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 900, fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
                AI SYNTHESIZER ACTIONS:
              </span>
              {step >= 3 && step <= 4 && (
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 900,
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--accent-vermillion)',
                  animation: 'pulse 1s infinite'
                }}>
                  👈 AI ACTIVATING CONTROLS
                </span>
              )}
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-xs)',
                background: step >= 3 ? 'var(--accent-yellow)' : '#FFFFFF',
                border: step >= 3 ? '2px solid var(--accent-vermillion)' : '1.5px solid #121110',
                boxShadow: step >= 3 ? '3px 3px 0px #FF3B20' : 'none',
                fontWeight: 900,
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono)',
                transform: step === 3 ? 'scale(1.08)' : 'none',
                transition: 'all 0.2s ease'
              }}>
                SHAPE: CIRCLE {step === 3 && '✓ CLICKED!'}
              </button>

              <button style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-xs)',
                background: step >= 4 ? 'var(--accent-yellow)' : '#FFFFFF',
                border: step >= 4 ? '2px solid var(--accent-vermillion)' : '1.5px solid #121110',
                boxShadow: step >= 4 ? '3px 3px 0px #FF3B20' : 'none',
                fontWeight: 900,
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono)',
                transform: step === 4 ? 'scale(1.08)' : 'none',
                transition: 'all 0.2s ease'
              }}>
                ROTATE: 270° {step === 4 && '✓ CLICKED!'}
              </button>

              <button style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-xs)',
                background: step >= 5 ? '#10B981' : '#E5E0D8',
                color: step >= 5 ? '#FFFFFF' : '#8E8B85',
                border: step >= 5 ? '2px solid #121110' : '1.5px solid #A8A29E',
                boxShadow: step >= 5 ? '3px 3px 0px #121110' : 'none',
                fontWeight: 900,
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono)',
                transition: 'all 0.2s ease'
              }}>
                SUBMIT PREDICTION {step >= 5 && '✓ SUBMITTED!'}
              </button>
            </div>
          </div>

          <div style={{
            width: '100%',
            maxWidth: '680px',
            background: step >= 5 ? 'var(--accent-mint-light)' : '#FFFFFF',
            border: '2px solid var(--border-ink)',
            borderRadius: 'var(--radius-md)',
            padding: '16px 20px',
            fontSize: '0.92rem',
            lineHeight: 1.5,
            fontWeight: 600
          }}>
            {step === 0 && (
              <span>🤖 <strong>AI Scan:</strong> Inspecting State 1: Triangle with 0° rotation.</span>
            )}
            {step === 1 && (
              <span>🤖 <strong>AI Scan:</strong> State 2 transformed to Square and rotated <strong>+90°</strong>. Two properties evolving!</span>
            )}
            {step === 2 && (
              <span>🤖 <strong>AI Scan:</strong> State 3 changed to Diamond and rotated <strong>+90° to 180°</strong>. Pattern identified!</span>
            )}
            {step === 3 && (
              <span style={{ color: 'var(--accent-vermillion)' }}>🤖 <strong>AI Manipulation:</strong> Next shape in cycle is <strong>Circle</strong>. Selecting Circle on the workbench!</span>
            )}
            {step === 4 && (
              <span style={{ color: 'var(--accent-vermillion)' }}>🤖 <strong>AI Manipulation:</strong> Continuing rotation (+90°): 180° → <strong>270°</strong>. Dialing rotation to 270°!</span>
            )}
            {step >= 5 && (
              <span style={{ color: '#065F46' }}>🎉 <strong>AI Complete:</strong> State prediction verified! Now you know how the workbench works. <strong>YOUR TURN!</strong></span>
            )}
          </div>
        </div>
      )}

      {/* 3. GRID / SPATIAL REASONING LIVE AI DEMO */}
      {gameId === 'grid' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', alignItems: 'center' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 64px)',
            gridTemplateRows: 'repeat(4, 64px)',
            gap: '6px',
            background: '#FFFFFF',
            border: '2.5px solid var(--border-ink)',
            boxShadow: '4px 4px 0px #121110',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: '-12px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'var(--accent-vermillion)',
              color: '#FFF',
              padding: '2px 10px',
              borderRadius: '3px',
              fontSize: '0.7rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 900,
              boxShadow: '2px 2px 0px #121110',
              zIndex: 10
            }}>
              {gridSolved ? '🤖 PLACED CORRECT CANDIDATE [c. ▲]' : '🤖 SCANNING ROW 2 LATIN-SQUARE ELIMINATION'}
            </div>

            {[
              { s: '', bg: '#FFF' }, { s: '', bg: '#FFF' }, { s: '+', bg: '#F1EFEA' }, { s: '', bg: '#FFF' },
              { s: '+', bg: '#F1EFEA' }, { s: '', bg: '#F1EFEA' }, { s: '■', bg: '#F1EFEA' }, { s: '●', bg: '#F1EFEA' },
              { s: '', bg: '#FFF' }, { s: '', bg: '#FFF' }, { s: '▲', bg: '#F1EFEA' }, { s: '', bg: '#FFF' },
              { s: '', bg: '#FFF' }, { s: '', bg: '#FFF' }, { s: '●', bg: '#F1EFEA' }, { s: '', bg: '#FFF' }
            ].map((cell, idx) => {
              const isTarget = idx === 5;
              const isRowHighlighted = idx >= 4 && idx <= 7;

              return (
                <div
                  key={idx}
                  style={{
                    background: isTarget
                      ? (gridSolved ? '#D9F8E4' : '#FFF5F3')
                      : isRowHighlighted
                      ? (cell.s ? '#FAF8F5' : '#FFF')
                      : cell.bg,
                    border: isTarget
                      ? (gridSolved ? '2.5px solid #10B981' : '2.5px dashed var(--accent-vermillion)')
                      : isRowHighlighted
                      ? '2px solid #121110'
                      : '1.5px solid #CBD5E1',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    fontWeight: 900,
                    color: isTarget ? (gridSolved ? '#065F46' : 'var(--accent-vermillion)') : '#334155',
                    position: 'relative',
                    transition: 'all 0.25s ease'
                  }}
                >
                  {isTarget ? (gridSolved ? '▲' : '?') : cell.s}
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {[
              { key: 'a', s: '+' },
              { key: 'b', s: '■' },
              { key: 'c', s: '▲' },
              { key: 'd', s: '●' }
            ].map((opt) => {
              const isChosen = opt.key === 'c' && gridSolved;
              return (
                <div
                  key={opt.key}
                  style={{
                    width: '68px',
                    height: '68px',
                    background: isChosen ? '#FEF08A' : '#FFFFFF',
                    border: isChosen ? '3px solid #121110' : '2px solid #CBD5E1',
                    boxShadow: isChosen ? '3px 3px 0px #121110' : '1px 1px 0px rgba(0,0,0,0.1)',
                    borderRadius: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    transition: 'all 0.2s ease',
                    transform: isChosen ? 'scale(1.06)' : 'none'
                  }}
                >
                  <span style={{ position: 'absolute', top: '4px', left: '6px', fontSize: '0.7rem', fontWeight: 900, color: '#64748B' }}>
                    {opt.key}.
                  </span>
                  <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#1E293B' }}>
                    {opt.s}
                  </span>
                </div>
              );
            })}
          </div>

          <div style={{
            width: '100%',
            maxWidth: '560px',
            background: gridSolved ? 'var(--accent-mint-light)' : '#FFFFFF',
            border: '2px solid var(--border-ink)',
            borderRadius: 'var(--radius-md)',
            padding: '16px 20px',
            fontSize: '0.92rem',
            fontWeight: 600,
            lineHeight: 1.5
          }}>
            {gridSolved ? (
              <span style={{ color: '#065F46' }}>
                🎉 <strong>AI Latin-Square Deduction:</strong> In Row 2, we already have <strong>+</strong>, <strong>■</strong>, and <strong>●</strong>. Column 3 also contains <strong>+</strong>, <strong>■</strong>, <strong>▲</strong>, <strong>●</strong>. The only missing shape in Row 2 is <strong>▲ (Option c)</strong>! Option [c] selected!
              </span>
            ) : (
              <span>
                🤖 <strong>AI Latin Square Elimination:</strong> Scanning Row 2: Visible cells contain <strong>+</strong>, <strong>■</strong>, and <strong>●</strong>. Calculating missing candidate...
              </span>
            )}
          </div>
        </div>
      )}

      {/* 4. MENTAL MATH LIVE AI DEMO */}
      {gameId === 'math' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', width: '100%', maxWidth: '460px' }}>
          <div style={{
            background: '#FAF8F5',
            border: '2px solid #141312',
            borderRadius: '20px',
            padding: '20px 24px',
            boxShadow: '3px 3px 0px #141312',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', fontWeight: 900, color: '#78716C', marginBottom: '8px' }}>
              TARGET: BALANCE EQUATION TO EQUAL 2
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '2.2rem', fontWeight: 950 }}>
              <div style={{
                width: '50px',
                height: '52px',
                borderRadius: '10px',
                background: '#FFF',
                border: step >= 1 ? '2px solid #141312' : '2px dashed #CBD5E1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: step >= 1 ? '#121110' : '#CBD5E1',
                fontFamily: 'var(--font-mono)'
              }}>
                {mathDemoSlots[0] || '_'}
              </div>
              <span>÷</span>
              <div style={{
                width: '50px',
                height: '52px',
                borderRadius: '10px',
                background: '#FFF',
                border: step >= 2 ? '2px solid #141312' : '2px dashed #CBD5E1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: step >= 2 ? '#121110' : '#CBD5E1',
                fontFamily: 'var(--font-mono)'
              }}>
                {mathDemoSlots[1] || '_'}
              </div>
              <span>×</span>
              <div style={{
                width: '50px',
                height: '52px',
                borderRadius: '10px',
                background: '#FFF',
                border: step >= 3 ? '2px solid #141312' : '2px dashed #CBD5E1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: step >= 3 ? '#121110' : '#CBD5E1',
                fontFamily: 'var(--font-mono)'
              }}>
                {mathDemoSlots[2] || '_'}
              </div>
              <span>=</span>
              <span style={{ color: '#FF3B20', fontFamily: 'var(--font-mono)' }}>2</span>
            </div>
          </div>

          <div style={{
            background: '#FAF8F5',
            border: '1.5px solid #CBD5E1',
            borderRadius: '20px',
            padding: '16px',
            width: '100%'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => {
                const isPressed = mathDemoActiveDigit === num;
                return (
                  <div
                    key={num}
                    style={{
                      height: '54px',
                      borderRadius: '12px',
                      background: isPressed ? '#FEF08A' : '#FFF',
                      border: isPressed ? '2.5px solid #141312' : '1.5px solid #CBD5E1',
                      boxShadow: isPressed ? '0 0 0 3px rgba(255, 59, 32, 0.2)' : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.4rem',
                      fontWeight: 900,
                      fontFamily: 'var(--font-mono)',
                      color: '#1E293B',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {num}
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{
            width: '100%',
            background: step >= 3 ? '#ECFDF5' : '#FFFFFF',
            border: step >= 3 ? '2px solid #10B981' : '2px solid #141312',
            borderRadius: '14px',
            padding: '14px 18px',
            fontSize: '0.88rem',
            lineHeight: 1.5,
            fontWeight: 600
          }}>
            {step === 0 && (
              <span>🤖 <strong>AI Analysis:</strong> Evaluating equation <code>_ ÷ _ × _ = 2</code>. Finding factors from 1–9.</span>
            )}
            {step === 1 && (
              <span style={{ color: '#0D9488' }}>
                🤖 <strong>AI Action 1:</strong> Tapped <strong>6</strong> on keypad. Slot 1 = 6 (<code>6 ÷ _ × _ = 2</code>).
              </span>
            )}
            {step === 2 && (
              <span style={{ color: '#0D9488' }}>
                🤖 <strong>AI Action 2:</strong> Tapped <strong>3</strong> on keypad. Slot 2 = 3. Notice <code>6 ÷ 3 = 2</code>!
              </span>
            )}
            {step >= 3 && (
              <span style={{ color: '#047857' }}>
                🎉 <strong>Equation Balanced:</strong> Tapped <strong>1</strong> on keypad. <code>6 ÷ 3 × 1 = 2</code> holds true!
              </span>
            )}
          </div>
        </div>
      )}

      {/* 5. DEDUCTIVE REASONING LIVE AI DEMO */}
      {gameId === 'deductive' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', width: '100%', maxWidth: '620px' }}>
          <div style={{
            background: '#FAF8F5',
            border: '2px solid #141312',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '4px 4px 0px #141312',
            width: '100%'
          }}>
            <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', fontWeight: 900, color: '#64748B', marginBottom: '10px' }}>
              FORMAL SYLLOGISM PREMISES
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{
                background: '#FFFFFF',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1.5px solid #CBD5E1',
                fontSize: '0.9rem',
                fontWeight: 700
              }}>
                <strong>Premise 1:</strong> All Hexagons are colored Cobalt Blue.
              </div>
              <div style={{
                background: '#FFFFFF',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1.5px solid #CBD5E1',
                fontSize: '0.9rem',
                fontWeight: 700
              }}>
                <strong>Premise 2:</strong> Figure X is a Hexagon.
              </div>
            </div>
          </div>

          {/* Deductive Conclusions with AI Highlighting */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
            {[
              { id: 'A', text: 'Figure X is definitely Cobalt Blue.', isCorrect: true },
              { id: 'B', text: 'Figure X is Crimson Red.', isCorrect: false },
              { id: 'C', text: 'Cannot be determined with given premises.', isCorrect: false }
            ].map((opt) => {
              const isSelected = deductiveStep >= 2 && opt.isCorrect;
              return (
                <div
                  key={opt.id}
                  style={{
                    padding: '14px 18px',
                    borderRadius: '12px',
                    background: isSelected ? '#ECFDF5' : '#FFFFFF',
                    border: isSelected ? '2.5px solid #10B981' : '2px solid #CBD5E1',
                    boxShadow: isSelected ? '3px 3px 0px #10B981' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontWeight: 700,
                    fontSize: '0.95rem'
                  }}
                >
                  <span><strong>{opt.id}.</strong> {opt.text}</span>
                  {isSelected && (
                    <span style={{
                      background: '#10B981',
                      color: '#FFF',
                      fontSize: '0.7rem',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 900,
                      padding: '3px 8px',
                      borderRadius: '4px'
                    }}>
                      ✓ AI GUARANTEED VALID
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{
            width: '100%',
            background: deductiveStep >= 2 ? '#ECFDF5' : '#FFFFFF',
            border: deductiveStep >= 2 ? '2px solid #10B981' : '2px solid #141312',
            borderRadius: '14px',
            padding: '14px 18px',
            fontSize: '0.88rem',
            lineHeight: 1.5,
            fontWeight: 600
          }}>
            {deductiveStep === 0 && (
              <span>🤖 <strong>AI Premise Parsing:</strong> Extracting ground truth axioms: (X ∈ Hexagons) ∧ (∀h ∈ Hexagons, color(h) = Cobalt).</span>
            )}
            {deductiveStep === 1 && (
              <span style={{ color: '#0D9488' }}>
                🤖 <strong>Modus Ponens Application:</strong> Substituting Figure X into universal property yields color(X) = Cobalt Blue without ambiguity.
              </span>
            )}
            {deductiveStep >= 2 && (
              <span style={{ color: '#047857' }}>
                🎉 <strong>Deduction Complete:</strong> Option [A] is mathematically necessary. Eliminating invalid distractors B and C!
              </span>
            )}
          </div>
        </div>
      )}

      {/* 6. MOTION CHALLENGE LIVE AI DEMO */}
      {gameId === 'motion' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', width: '100%', maxWidth: '580px' }}>
          <div style={{
            background: '#0F172A',
            border: '2.5px solid #141312',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '4px 4px 0px #141312',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative'
          }}>
            <div style={{ color: '#94A3B8', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', fontWeight: 900, marginBottom: '14px', letterSpacing: '0.08em' }}>
              OPTICAL LASER DEFLECTION BOARD
            </div>

            {/* Grid with Laser source & Target Gate */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 50px)',
              gridTemplateRows: 'repeat(4, 50px)',
              gap: '6px',
              background: '#1E293B',
              padding: '12px',
              borderRadius: '12px',
              border: '1.5px solid #334155',
              position: 'relative'
            }}>
              {/* Laser Beam path SVG overlay */}
              {motionLaserActive && (
                <svg style={{ position: 'absolute', top: 12, left: 12, width: 274, height: 218, pointerEvents: 'none', zIndex: 10 }}>
                  {/* From (0, 1) -> (2, 1) -> (2, 3) */}
                  <line x1="25" y1="83" x2="137" y2="83" stroke="#FF3B20" strokeWidth="4" strokeDasharray="6 3" />
                  <line x1="137" y1="83" x2="137" y2="195" stroke="#FF3B20" strokeWidth="4" strokeDasharray="6 3" />
                  <circle cx="137" cy="195" r="8" fill="#10B981" />
                </svg>
              )}

              {Array.from({ length: 20 }).map((_, idx) => {
                const isSource = idx === 5; // (0, 1)
                const isMirror = idx === 7; // (2, 1)
                const isGate = idx === 17;  // (2, 3)

                return (
                  <div
                    key={idx}
                    style={{
                      borderRadius: '8px',
                      background: isSource ? '#FF3B20' : isMirror ? (motionLaserActive ? '#FEF08A' : '#38BDF8') : isGate ? '#10B981' : '#0F172A',
                      border: '1px solid #475569',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFF',
                      fontSize: '0.8rem',
                      fontWeight: 900,
                      fontFamily: 'var(--font-mono)'
                    }}
                  >
                    {isSource && 'LASER'}
                    {isMirror && (motionLaserActive ? '◢' : '◤')}
                    {isGate && 'GATE B'}
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{
            width: '100%',
            background: motionLaserActive ? '#ECFDF5' : '#FFFFFF',
            border: motionLaserActive ? '2px solid #10B981' : '2px solid #141312',
            borderRadius: '14px',
            padding: '14px 18px',
            fontSize: '0.88rem',
            lineHeight: 1.5,
            fontWeight: 600
          }}>
            {step === 0 && (
              <span>🤖 <strong>AI Trajectory Vectoring:</strong> Laser enters from left at (0, 1) traveling eastward. Target Gate B is located at (2, 3).</span>
            )}
            {step === 1 && (
              <span style={{ color: '#0D9488' }}>
                🤖 <strong>Mirror Positioning:</strong> Inserting 45° prism reflector at intersection (2, 1) to divert beam 90° south.
              </span>
            )}
            {step >= 2 && (
              <span style={{ color: '#047857' }}>
                🎉 <strong>Optical Intercept Verified:</strong> Laser beam deflected at 90° directly enters Target Gate B! Zero optical loss.
              </span>
            )}
          </div>
        </div>
      )}

      {/* 7. WORKING MEMORY LIVE AI DEMO */}
      {gameId === 'memory' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', width: '100%', maxWidth: '560px' }}>
          <div style={{
            background: '#FAF8F5',
            border: '2.5px solid #141312',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '4px 4px 0px #141312',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <div style={{
              fontSize: '0.75rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 900,
              color: memoryPhase === 'distractor' ? '#FF3B20' : '#64748B',
              marginBottom: '14px'
            }}>
              {memoryPhase === 'memorize' && 'PHASE 1: MEMORIZE FLASHING DOTS'}
              {memoryPhase === 'distractor' && 'PHASE 2: ACTIVE INTERFERENCE DISTRACTOR'}
              {memoryPhase === 'recall' && 'PHASE 3: AI RECALLING EXACT TARGET NODES'}
              {memoryPhase === 'solved' && 'PHASE 4: 100% RECALL ACCURACY'}
            </div>

            {memoryPhase === 'distractor' ? (
              <div style={{
                background: '#FEF08A',
                border: '2px solid #141312',
                borderRadius: '12px',
                padding: '20px 30px',
                textAlign: 'center',
                boxShadow: '3px 3px 0px #141312'
              }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#78716C' }}>CALCULATE EQUATION:</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, fontFamily: 'var(--font-mono)' }}>14 + 7 = ?</div>
                <div style={{ marginTop: '8px', fontSize: '0.9rem', color: '#047857', fontWeight: 800 }}>🤖 AI Solves: 21 (Filtered Distractor)</div>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 56px)',
                gridTemplateRows: 'repeat(4, 56px)',
                gap: '8px'
              }}>
                {Array.from({ length: 16 }).map((_, idx) => {
                  const isTarget = idx === 2 || idx === 7 || idx === 13;
                  const isHighlighted = (memoryPhase === 'memorize' || memoryPhase === 'solved') && isTarget;
                  const isRecalled = memoryPhase === 'recall' && (idx === 2 || idx === 7);

                  return (
                    <div
                      key={idx}
                      style={{
                        borderRadius: '10px',
                        background: isHighlighted ? '#FF3B20' : isRecalled ? '#10B981' : '#FFFFFF',
                        border: isHighlighted || isRecalled ? '2px solid #141312' : '1.5px solid #CBD5E1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#FFF',
                        fontSize: '0.85rem',
                        fontWeight: 900,
                        transition: 'all 0.2s ease',
                        boxShadow: isHighlighted ? '0 0 10px rgba(255, 59, 32, 0.4)' : 'none'
                      }}
                    >
                      {isHighlighted && '●'}
                      {isRecalled && '✓'}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div style={{
            width: '100%',
            background: memoryPhase === 'solved' ? '#ECFDF5' : '#FFFFFF',
            border: memoryPhase === 'solved' ? '2px solid #10B981' : '2px solid #141312',
            borderRadius: '14px',
            padding: '14px 18px',
            fontSize: '0.88rem',
            lineHeight: 1.5,
            fontWeight: 600
          }}>
            {memoryPhase === 'memorize' && (
              <span>🤖 <strong>Encoding Spatial Nodes:</strong> Storing coordinates [(0, 2), (1, 3), (3, 1)] in phonological buffer.</span>
            )}
            {memoryPhase === 'distractor' && (
              <span style={{ color: '#D97706' }}>
                🤖 <strong>Interference Filtering:</strong> Rapidly solving arithmetic distractor while preserving spatial grid memory buffer.
              </span>
            )}
            {memoryPhase === 'recall' && (
              <span style={{ color: '#0D9488' }}>
                🤖 <strong>Node Reproduction:</strong> Sequentially tapping the memorized dot slots with zero decay.
              </span>
            )}
            {memoryPhase === 'solved' && (
              <span style={{ color: '#047857' }}>
                🎉 <strong>Perfect Recall:</strong> All 3 coordinates accurately retrieved post-distractor! Working memory index: 100%.
              </span>
            )}
          </div>
        </div>
      )}

      {/* 8. ATTENTION & FOCUS LIVE AI DEMO */}
      {gameId === 'attention' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', width: '100%', maxWidth: '560px' }}>
          <div style={{
            background: '#FAF8F5',
            border: '2.5px solid #141312',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '4px 4px 0px #141312',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', fontWeight: 900, color: '#64748B', marginBottom: '14px' }}>
              TARGET ANOMALY SEARCH: FIND THE UNIQUE ROTATED COMPONENT
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 56px)',
              gridTemplateRows: 'repeat(3, 56px)',
              gap: '10px'
            }}>
              {Array.from({ length: 12 }).map((_, idx) => {
                const isAnomaly = idx === 6;
                const isLocked = attentionTargetFound && isAnomaly;

                return (
                  <div
                    key={idx}
                    style={{
                      borderRadius: '10px',
                      background: isLocked ? '#FEF08A' : '#FFFFFF',
                      border: isLocked ? '3px solid #FF3B20' : '1.5px solid #CBD5E1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: isLocked ? '3px 3px 0px #FF3B20' : 'none',
                      transform: isLocked ? 'scale(1.12)' : 'none',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <svg width="28" height="28" viewBox="0 0 32 32" style={{ transform: isAnomaly ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                      <path d="M16 4 L26 24 L6 24 Z" fill={isAnomaly ? '#FF3B20' : '#334155'} />
                    </svg>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{
            width: '100%',
            background: attentionTargetFound ? '#ECFDF5' : '#FFFFFF',
            border: attentionTargetFound ? '2px solid #10B981' : '2px solid #141312',
            borderRadius: '14px',
            padding: '14px 18px',
            fontSize: '0.88rem',
            lineHeight: 1.5,
            fontWeight: 600
          }}>
            {!attentionTargetFound ? (
              <span>🤖 <strong>Parallel Visual Saccade:</strong> Filtering homogenous upward-pointing triangles across the 12-item matrix...</span>
            ) : (
              <span style={{ color: '#047857' }}>
                🎉 <strong>Target Lock-On:</strong> Inverted triangle anomaly pinpointed at Cell #7 in 214ms! Flawless feature-binding speed.
              </span>
            )}
          </div>
        </div>
      )}

      {/* 9. REACTION SPEED & INHIBITION LIVE AI DEMO */}
      {gameId === 'reaction' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', width: '100%', maxWidth: '540px' }}>
          <div style={{
            background: reactionPhase === 'green' || reactionPhase === 'reacted' ? '#ECFDF5' : reactionPhase === 'red_inhibit' ? '#FEF2F2' : '#FAF8F5',
            border: '2.5px solid #141312',
            borderRadius: '16px',
            padding: '30px',
            boxShadow: '4px 4px 0px #141312',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transition: 'background 0.2s ease'
          }}>
            <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', fontWeight: 900, color: '#64748B', marginBottom: '14px' }}>
              GO / NO-GO REACTION RADAR
            </div>

            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: reactionPhase === 'green' || reactionPhase === 'reacted' ? '#10B981' : reactionPhase === 'red_inhibit' ? '#EF4444' : '#E2E8F0',
              border: '3px solid #141312',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFF',
              fontWeight: 900,
              fontSize: '1.2rem',
              boxShadow: '4px 4px 0px #141312',
              transition: 'all 0.15s ease'
            }}>
              {reactionPhase === 'ready' && <span style={{ color: '#64748B' }}>WAIT...</span>}
              {reactionPhase === 'green' && <span>GO!</span>}
              {reactionPhase === 'reacted' && <span>184 ms</span>}
              {reactionPhase === 'red_inhibit' && <span>STOP!</span>}
            </div>
          </div>

          <div style={{
            width: '100%',
            background: '#FFFFFF',
            border: '2px solid #141312',
            borderRadius: '14px',
            padding: '14px 18px',
            fontSize: '0.88rem',
            lineHeight: 1.5,
            fontWeight: 600
          }}>
            {reactionPhase === 'ready' && (
              <span>🤖 <strong>Pre-stimulus Baseline:</strong> Motor cortex primed, awaiting visual cue...</span>
            )}
            {reactionPhase === 'green' && (
              <span style={{ color: '#0D9488' }}>🤖 <strong>Green Signal Detected:</strong> Triggering instant sub-200ms reflex click!</span>
            )}
            {reactionPhase === 'reacted' && (
              <span style={{ color: '#047857' }}>🎉 <strong>Latency: 184ms:</strong> Elite 99th percentile motor execution time recorded!</span>
            )}
            {reactionPhase === 'red_inhibit' && (
              <span style={{ color: '#DC2626' }}>🛡️ <strong>Red Signal (No-Go):</strong> Response successfully inhibited! Zero commission errors.</span>
            )}
          </div>
        </div>
      )}

      {/* Action to proceed to Try Example & Practice */}
      <div style={{
        marginTop: '28px',
        paddingTop: '20px',
        borderTop: '1.5px solid var(--border-subtle)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Understood the movements? Try the sandbox yourself!
        </span>

        <button
          className="btn-vermillion"
          onClick={onProceedToPractice}
        >
          <span>I GOT IT! TRY EXAMPLE</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};
