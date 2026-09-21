import React, { useState, useEffect, useRef } from 'react';
import { ReactionState, ReactionTask, calculateReactionScore, getRandomDelayMs } from '../../engine/generators/reactionEngine';

interface ReactionRendererProps {
  task?: ReactionTask;
  onTrialComplete: (rtMs: number, falseStart: boolean, score: number) => void;
  trialsLeft?: number;
  showExplanation?: boolean;
  isDemo?: boolean;
}

export const ReactionRenderer: React.FC<ReactionRendererProps> = ({
  task,
  onTrialComplete,
  trialsLeft = 3,
  showExplanation = false,
  isDemo = false,
}) => {
  const [state, setState] = useState<ReactionState>('idle');
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [dotPos, setDotPos] = useState<{ x: number; y: number }>({ x: 50, y: 45 });

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const greenTimestampRef = useRef<number>(0);

  const activeSubtype = task?.subtype || 'pure_latency';

  const startTrial = () => {
    setState('waiting');
    setReactionTime(null);
    setScore(null);
    setFeedback(null);

    // Dynamic random position on the canvas for each trial
    const randX = Math.floor(Math.random() * 60) + 20; // 20% to 80%
    const randY = Math.floor(Math.random() * 50) + 25; // 25% to 75%
    setDotPos({ x: randX, y: randY });

    const delay = getRandomDelayMs(1500, 3200);
    timerRef.current = setTimeout(() => {
      greenTimestampRef.current = performance.now();
      setState('ready');

      // AI Demo auto-solver
      if (isDemo) {
        setTimeout(() => {
          handleInteraction();
        }, 220); // 220ms reaction
      }
    }, delay);
  };

  const handleInteraction = () => {
    if (state === 'idle') {
      startTrial();
      return;
    }

    if (state === 'waiting') {
      if (timerRef.current) clearTimeout(timerRef.current);
      setState('early');
      const trialScore = calculateReactionScore(999, true);
      setScore(trialScore);
      setFeedback('False start! You tapped before the cue.');
      onTrialComplete(999, true, trialScore);
      return;
    }

    if (state === 'ready') {
      const rt = Math.round(performance.now() - greenTimestampRef.current);
      setReactionTime(rt);

      if (activeSubtype === 'go_no_go') {
        if (task?.isGoCue) {
          const trialScore = calculateReactionScore(rt, false);
          setScore(trialScore);
          setFeedback(`✓ Good Go reaction: ${rt}ms!`);
          setState('success');
          onTrialComplete(rt, false, trialScore);
        } else {
          // Inhibit failure
          setScore(0);
          setFeedback('Commission Error! Red Cross was a NO-GO cue.');
          setState('early');
          onTrialComplete(rt, true, 0);
        }
      } else {
        const trialScore = calculateReactionScore(rt, false);
        setScore(trialScore);
        setState('success');
        onTrialComplete(rt, false, trialScore);
      }

      if (bestTime === null || rt < bestTime) setBestTime(rt);
    }
  };

  // Speed match choice handling
  const handleSpeedMatchChoice = (choiceMatch: boolean) => {
    if (isDemo) return;
    const isCorrect = choiceMatch === task?.isMatch;
    const rt = 340;
    const trialScore = isCorrect ? 90 : 0;
    setScore(trialScore);
    setFeedback(isCorrect ? '✓ Correct rapid categorization!' : '✗ Mismatch in symbol categorization.');
    onTrialComplete(rt, !isCorrect, trialScore);
  };

  useEffect(() => {
    setState('idle');
    setReactionTime(null);
    setScore(null);
    setFeedback(null);
    if (isDemo) {
      startTrial();
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [task?.id, isDemo]);

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
            PROCESSING SPEED // {task?.subtypeName || 'Pure Latency Reaction'}
          </div>
          <div style={{ fontSize: '1.02rem', fontWeight: 800, color: '#141312' }}>
            {task?.prompt || 'Tap immediately when the cue changes state.'}
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

      {/* ── SUBTYPE 1 & 2: REACTION CANVAS (PURE LATENCY & GO / NO-GO) */}
      {activeSubtype !== 'speed_match' && (
        <div style={{ display: 'flex', gap: '16px', alignItems: 'stretch' }}>
          <div
            onClick={handleInteraction}
            style={{
              flex: 1,
              height: '320px',
              position: 'relative',
              background: state === 'ready'
                ? (activeSubtype === 'go_no_go' && !task?.isGoCue ? '#DC2626' : '#16A34A')
                : state === 'early'
                ? '#991B1B'
                : state === 'waiting'
                ? '#1E293B'
                : '#0F172A',
              borderRadius: '16px',
              border: '2px solid rgba(0,0,0,0.1)',
              boxShadow: state === 'ready' ? '0 0 40px rgba(22,163,74,0.4)' : '0 4px 16px rgba(0,0,0,0.2)',
              cursor: 'pointer',
              userSelect: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              transition: 'background 0.08s ease'
            }}
          >
            {state === 'idle' && (
              <div style={{ textAlign: 'center', color: '#CBD5E1' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '6px' }}>
                  Tap Here to Prime Sensor
                </div>
                <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
                  {activeSubtype === 'go_no_go'
                    ? 'Green Circle = TAP! Red Cross = INHIBIT!'
                    : 'When the canvas flashes GREEN, tap as fast as possible.'}
                </div>
              </div>
            )}

            {state === 'waiting' && (
              <div style={{ textAlign: 'center', color: '#FBBF24' }}>
                <div style={{ fontSize: '1.3rem', fontWeight: 900, letterSpacing: '0.04em' }}>
                  Wait for Cue...
                </div>
                <div style={{ fontSize: '0.82rem', color: '#94A3B8', marginTop: '6px' }}>
                  Inhibiting motor response...
                </div>
              </div>
            )}

            {state === 'ready' && (
              <>
                {/* Dynamic Floating Dot Target at randomized position */}
                <div style={{
                  position: 'absolute',
                  left: `${dotPos.x}%`,
                  top: `${dotPos.y}%`,
                  transform: 'translate(-50%, -50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  pointerEvents: 'none',
                  animation: 'pulse 1s infinite alternate'
                }}>
                  {activeSubtype === 'go_no_go' && !task?.isGoCue ? (
                    <>
                      <span style={{ fontSize: '3.5rem', color: '#FFFFFF', lineHeight: 1 }}>✕</span>
                      <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#FFFFFF', whiteSpace: 'nowrap' }}>DO NOT TAP!</span>
                    </>
                  ) : (
                    <>
                      <div style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '50%',
                        background: '#FFFFFF',
                        boxShadow: '0 0 30px #FFFFFF, 0 0 15px rgba(255,255,255,0.8)',
                        border: '3px solid rgba(255,255,255,0.9)'
                      }} />
                      <span style={{
                        fontSize: '1.4rem',
                        fontWeight: 950,
                        color: '#FFFFFF',
                        letterSpacing: '0.02em',
                        whiteSpace: 'nowrap',
                        textShadow: '0 2px 8px rgba(0,0,0,0.3)'
                      }}>
                        TAP NOW!
                      </span>
                    </>
                  )}
                </div>
              </>
            )}

            {state === 'early' && (
              <div style={{ textAlign: 'center', color: '#FFFFFF' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 900 }}>Premature Response!</div>
                <div style={{ fontSize: '0.85rem', marginTop: '6px', color: '#FECACA' }}>{feedback}</div>
                <button
                  onClick={e => { e.stopPropagation(); startTrial(); }}
                  style={{
                    marginTop: '16px', padding: '8px 20px', borderRadius: '20px',
                    background: '#FFFFFF', color: '#991B1B', fontWeight: 800, border: 'none', cursor: 'pointer'
                  }}
                >
                  Restart Trial
                </button>
              </div>
            )}

            {state === 'success' && (
              <div style={{ textAlign: 'center', color: '#FFFFFF' }}>
                <div style={{ fontSize: '3rem', fontWeight: 950, fontFamily: 'monospace' }}>
                  {reactionTime} <span style={{ fontSize: '1.3rem' }}>ms</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#BBF7D0', marginTop: '4px' }}>
                  Sensorimotor Latency Captured
                </div>
                <button
                  onClick={e => { e.stopPropagation(); startTrial(); }}
                  style={{
                    marginTop: '16px', padding: '8px 20px', borderRadius: '20px',
                    background: '#FFFFFF', color: '#166534', fontWeight: 800, border: 'none', cursor: 'pointer'
                  }}
                >
                  Next Trial →
                </button>
              </div>
            )}
          </div>

          {/* Telemetry Sidebar */}
          <div style={{ width: '130px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ background: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Current</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#1E293B', fontFamily: 'monospace', marginTop: '2px' }}>
                {reactionTime !== null ? `${reactionTime}ms` : '---'}
              </div>
            </div>

            <div style={{ background: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Best RT</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0284C7', fontFamily: 'monospace', marginTop: '2px' }}>
                {bestTime !== null ? `${bestTime}ms` : '---'}
              </div>
            </div>

            <div style={{ background: '#DCFCE7', border: '1.5px solid #86EFAC', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#16A34A', textTransform: 'uppercase' }}>Precision</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#15803D', fontFamily: 'monospace', marginTop: '2px' }}>
                {score !== null ? `${score}/100` : '---'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── SUBTYPE 3: SYMBOL SPEED MATCH ────────────────────── */}
      {activeSubtype === 'speed_match' && (
        <div style={{
          background: '#FFFFFF',
          border: '1.5px solid #E2E8F0',
          borderRadius: '16px',
          padding: '32px 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <div style={{
              width: '90px',
              height: '90px',
              borderRadius: '16px',
              background: '#F8FAFC',
              border: '2px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3rem',
              color: '#0284C7'
            }}>
              {task?.symbolA}
            </div>

            <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#CBD5E1' }}>vs</span>

            <div style={{
              width: '90px',
              height: '90px',
              borderRadius: '16px',
              background: '#F8FAFC',
              border: '2px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3rem',
              color: '#0284C7'
            }}>
              {task?.symbolB}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', width: '100%', maxWidth: '380px' }}>
            <button
              onClick={() => handleSpeedMatchChoice(true)}
              style={{
                padding: '16px',
                borderRadius: '12px',
                background: '#FFFFFF',
                border: '2px solid #16A34A',
                color: '#16A34A',
                fontWeight: 900,
                fontSize: '1rem',
                cursor: 'pointer'
              }}
            >
              ✓ MATCH
            </button>
            <button
              onClick={() => handleSpeedMatchChoice(false)}
              style={{
                padding: '16px',
                borderRadius: '12px',
                background: '#FFFFFF',
                border: '2px solid #DC2626',
                color: '#DC2626',
                fontWeight: 900,
                fontSize: '1rem',
                cursor: 'pointer'
              }}
            >
              ✗ DIFFERENT
            </button>
          </div>

          {feedback && (
            <div style={{ fontSize: '0.88rem', fontWeight: 800, color: score ? '#16A34A' : '#DC2626' }}>
              {feedback}
            </div>
          )}
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
          <strong>💡 Assessment Feedback:</strong> {task?.explanation}
        </div>
      )}
    </div>
  );
};
