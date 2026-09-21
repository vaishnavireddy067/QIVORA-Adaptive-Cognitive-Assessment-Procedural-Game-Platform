import React, { useState, useEffect, useRef } from 'react';
import { GridQuestion, GridCell, GridShape, ScatteredNode } from '../../engine/generators/gridGenerator';

interface GridRendererProps {
  question: GridQuestion;
  selectedOptionIndex?: number | null;
  onSelectOption?: (index: number) => void;
  onSelectYesNo?: (isCorrect: boolean) => void;
  showExplanation?: boolean;
  isDemo?: boolean;
}

type ChallengePhase = 'dot_memorize' | 'spatial_task' | 'dot_recall';

// ─── Shape SVG Component for Matrix Tasks ─────────────────────────
const ShapeIcon: React.FC<{ shape: GridShape; color?: string; size?: number; rotation?: number }> = ({
  shape,
  color = '#374151',
  size = 32,
  rotation = 0,
}) => {
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
          <circle cx="20" cy="20" r="15" fill={color} />
        </svg>
      )}
      {shape === 'square' && (
        <svg width={size} height={size} viewBox="0 0 40 40">
          <rect x="7" y="7" width="26" height="26" rx="4" fill={color} />
        </svg>
      )}
      {shape === 'triangle' && (
        <svg width={size} height={size} viewBox="0 0 40 40">
          <polygon points="20,6 35,34 5,34" fill={color} />
        </svg>
      )}
      {shape === 'cross' && (
        <svg width={size} height={size} viewBox="0 0 40 40">
          <path d="M14,5 L26,5 L26,14 L35,14 L35,26 L26,26 L26,35 L14,35 L14,26 L5,26 L5,14 L14,14 Z" fill={color} />
        </svg>
      )}
      {shape === 'star' && (
        <svg width={size} height={size} viewBox="0 0 40 40">
          <polygon points="20,5 24,15 35,15 26,22 30,33 20,26 10,33 14,22 5,15 16,15" fill={color} />
        </svg>
      )}
      {shape === 'diamond' && (
        <svg width={size} height={size} viewBox="0 0 40 40">
          <polygon points="20,5 35,20 20,35 5,20" fill={color} />
        </svg>
      )}
    </div>
  );
};

// ─── Dot Grid Canvas (Matching Images 4 & 5 Symmetry & Spatial Grids) ───
const DotGridCanvas: React.FC<{
  grid: boolean[][];
  hasMidline?: boolean;
  sizePx?: number;
  highlightMismatches?: { r: number; c: number }[];
}> = ({ grid, hasMidline = false, sizePx = 280, highlightMismatches = [] }) => {
  const rows = grid.length;
  const cols = grid[0]?.length || 1;
  const cellSize = Math.min(32, Math.floor((sizePx - 24) / Math.max(rows, cols)));

  return (
    <div style={{
      position: 'relative',
      display: 'grid',
      gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
      gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
      gap: '8px',
      padding: '20px 24px',
      background: '#F8FAFC',
      borderRadius: '12px',
      boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.05)',
      border: '1.5px solid #E2E8F0'
    }}>
      {hasMidline && (
        <div style={{
          position: 'absolute',
          top: 14,
          bottom: 14,
          left: '50%',
          width: '2px',
          borderLeft: '2px dashed #94A3B8',
          transform: 'translateX(-50%)',
          pointerEvents: 'none',
          zIndex: 2
        }} />
      )}

      {grid.map((row, r) =>
        row.map((active, c) => {
          const isMismatch = highlightMismatches.some(m => m.r === r && m.c === c);
          return (
            <div
              key={`${r}-${c}`}
              style={{
                width: cellSize,
                height: cellSize,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}
            >
              {active ? (
                <div style={{
                  width: `${cellSize * 0.88}px`,
                  height: `${cellSize * 0.88}px`,
                  background: isMismatch ? '#DC2626' : '#1E293B', // Solid black/dark square from image 4
                  borderRadius: '3px',
                  boxShadow: isMismatch ? '0 0 8px rgba(220,38,38,0.6)' : '0 1px 3px rgba(0,0,0,0.2)',
                  transition: 'transform 0.15s ease'
                }} />
              ) : (
                <div style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#CBD5E1' // Small circular dot
                }} />
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

// ─── Scattered Node Canvas with Numbered Sequential Badges (Images 3 & 5) ─
const ScatteredNodeCanvas: React.FC<{
  nodes: ScatteredNode[];
  illuminatedIndex?: number | null;
  selectedSequence?: number[];
  onNodeClick?: (idx: number) => void;
  isInteractive?: boolean;
}> = ({ nodes, illuminatedIndex, selectedSequence = [], onNodeClick, isInteractive = false }) => {
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      maxWidth: '420px',
      height: '380px',
      background: '#F1F5F9', // Clean light grey from image 3 & 5
      borderRadius: '12px',
      overflow: 'hidden',
      border: '1.5px solid #E2E8F0',
      boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.04)'
    }}>
      {nodes.map((node) => {
        const isIlluminated = illuminatedIndex === node.id;
        const selectedOrder = selectedSequence.indexOf(node.id);
        const isSelected = selectedOrder !== -1;

        return (
          <div
            key={node.id}
            onClick={() => isInteractive && onNodeClick && onNodeClick(node.id)}
            style={{
              position: 'absolute',
              left: `${node.xPct}%`,
              top: `${node.yPct}%`,
              transform: 'translate(-50%, -50%)',
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: isIlluminated
                ? '#1E293B' // Solid dark charcoal/black for active dot (Image 3 & 5)
                : isSelected
                ? '#1E293B' // Solid dark charcoal with number badge (Image 5 slide 5)
                : '#CBD5E1', // Smooth grey dot
              border: isIlluminated
                ? '2px solid #0F172A'
                : isSelected
                ? '2px solid #0F172A'
                : '1px solid #94A3B8',
              boxShadow: isIlluminated
                ? '0 0 12px rgba(30,41,59,0.5), 0 2px 6px rgba(0,0,0,0.2)'
                : '0 1px 3px rgba(0,0,0,0.08)',
              cursor: isInteractive ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease',
              color: '#FFFFFF',
              fontWeight: 900,
              fontSize: '0.85rem',
              userSelect: 'none'
            }}
          >
            {isSelected && (
              <span>{selectedOrder + 1}</span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export const GridRenderer: React.FC<GridRendererProps> = ({
  question,
  selectedOptionIndex,
  onSelectOption,
  onSelectYesNo,
  showExplanation = false,
  isDemo = false,
}) => {
  const steps = question.steps && question.steps.length > 0 ? question.steps : [];
  const totalSteps = steps.length > 0 ? steps.length : 1;
  const targetSequence = question.targetNodeSequence || question.targetNodeIndices || [];

  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [phase, setPhase] = useState<ChallengePhase>(
    question.scatteredNodes && question.challengeType !== 'missing_cell' ? 'dot_memorize' : 'spatial_task'
  );
  const [userSpatialAnswers, setUserSpatialAnswers] = useState<boolean[]>([]);
  const [userRecallSequence, setUserRecallSequence] = useState<number[]>([]);
  const [timerProgress, setTimerProgress] = useState<number>(100);

  const phaseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setCurrentStepIdx(0);
    setUserSpatialAnswers([]);
    setUserRecallSequence([]);
    clearAllTimers();

    if (question.scatteredNodes && question.challengeType !== 'missing_cell') {
      runStepFlow(0);
    } else {
      setPhase('spatial_task');
    }

    return () => {
      clearAllTimers();
    };
  }, [question.id]);

  const clearAllTimers = () => {
    if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
  };

  const runStepFlow = (stepIdx: number) => {
    clearAllTimers();

    if (stepIdx >= totalSteps) {
      // All sequential dots and tasks shown! Enter Recall Phase
      setPhase('dot_recall');
      return;
    }

    setCurrentStepIdx(stepIdx);
    setPhase('dot_memorize');
    setTimerProgress(100);

    const startTime = Date.now();
    const duration = 3000; // 3 seconds matching Image 5: "Note: You get 3 seconds for remembering dot position"

    timerIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setTimerProgress(remaining);
    }, 40);

    phaseTimerRef.current = setTimeout(() => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      setPhase('spatial_task');
    }, duration);
  };

  const handleSpatialYesNo = (choice: boolean) => {
    if (isDemo) return;
    const nextSpatialAnswers = [...userSpatialAnswers, choice];
    setUserSpatialAnswers(nextSpatialAnswers);

    if (question.scatteredNodes && question.challengeType !== 'missing_cell') {
      const nextStep = currentStepIdx + 1;
      if (nextStep < totalSteps) {
        // Run next dot+task cycle
        runStepFlow(nextStep);
      } else {
        // Enter Recall Phase
        setPhase('dot_recall');
      }
    } else if (onSelectYesNo) {
      onSelectYesNo(choice === question.correctAnswerBool);
    }
  };

  const handleRecallNodeClick = (nodeId: number) => {
    if (isDemo) return;

    let updatedSequence: number[];
    if (userRecallSequence.includes(nodeId)) {
      // Deselect if already clicked
      updatedSequence = userRecallSequence.filter(id => id !== nodeId);
    } else {
      if (userRecallSequence.length < targetSequence.length) {
        updatedSequence = [...userRecallSequence, nodeId];
      } else {
        updatedSequence = userRecallSequence;
      }
    }

    setUserRecallSequence(updatedSequence);

    // If user has selected all required dots in the sequence
    if (updatedSequence.length === targetSequence.length && onSelectYesNo) {
      const isSequenceCorrect = updatedSequence.every((id, idx) => id === targetSequence[idx]);
      const areSpatialTasksCorrect = steps.every((s, idx) => userSpatialAnswers[idx] === s.spatialTask.correctAnswerBool);
      const isAllCorrect = isSequenceCorrect && (steps.length === 0 || areSpatialTasksCorrect);
      onSelectYesNo(isAllCorrect);
    }
  };

  const currentStep = steps[currentStepIdx];
  const currentTask = currentStep ? currentStep.spatialTask : {
    prompt: question.prompt,
    challengeType: question.challengeType,
    subRuleLabel: question.subRuleLabel,
    isYesNo: question.isYesNo,
    correctAnswerBool: question.correctAnswerBool,
    symmetryData: question.symmetryData,
    rotationData: question.rotationData,
    overlayData: question.overlayData,
    explanation: question.explanation
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      maxWidth: '540px',
      margin: '0 auto',
      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif"
    }}>
      {/* ── Main Game Card ────────────────────────────────────── */}
      <div style={{
        width: '100%',
        background: '#FFFFFF',
        border: '1.5px solid #E2E8F0',
        borderRadius: '20px',
        padding: '24px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.04)'
      }}>
        {/* Step Indicator & Timer Progress */}
        {question.scatteredNodes && question.challengeType !== 'missing_cell' && (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {phase === 'dot_recall'
                  ? `Final Recall: ${targetSequence.length} Dots`
                  : `Cycle ${currentStepIdx + 1} of ${totalSteps} • ${phase === 'dot_memorize' ? 'Memorize Dot' : 'Symmetry Check'}`}
              </span>
              {phase === 'dot_memorize' && (
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#EA580C', fontFamily: 'monospace' }}>
                  {Math.ceil(timerProgress / 33)}s
                </span>
              )}
            </div>
            {phase === 'dot_memorize' && (
              <div style={{ width: '100%', height: '4px', background: '#F1F5F9', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: `${timerProgress}%`, height: '100%', background: '#EA580C', transition: 'width 0.05s linear' }} />
              </div>
            )}
          </div>
        )}

        {/* PHASE 1: DOT MEMORIZATION (Images 3 & 5) */}
        {phase === 'dot_memorize' && question.scatteredNodes && (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1E293B', marginBottom: '4px' }}>
                Where on the grid and which order did the dots appear?
              </div>
              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#64748B' }}>
                Remember the Position of Dot {currentStepIdx + 1}
              </div>
            </div>
            <ScatteredNodeCanvas
              nodes={question.scatteredNodes}
              illuminatedIndex={currentStep?.targetNodeIndex ?? question.targetNodeIndices?.[0]}
            />
          </div>
        )}

        {/* PHASE 3: MULTI-DOT RECALL (Image 5 slide 5) */}
        {phase === 'dot_recall' && question.scatteredNodes && (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1E293B', marginBottom: '4px' }}>
                Where on the grid and which order did the dots appear?
              </div>
              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#EA580C' }}>
                Mark the dots position, in the correct Order (imp)
              </div>
            </div>
            <ScatteredNodeCanvas
              nodes={question.scatteredNodes}
              selectedSequence={userRecallSequence}
              onNodeClick={handleRecallNodeClick}
              isInteractive={true}
            />
            <div style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 700 }}>
              Marked {userRecallSequence.length} / {targetSequence.length} dots
            </div>
          </div>
        )}

        {/* PHASE 2: INTERMEDIATE SPATIAL QUESTION (Images 4 & 5) */}
        {phase === 'spatial_task' && (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1E293B', marginBottom: '4px' }}>
                {currentTask.prompt}
              </div>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748B' }}>
                Mark Yes, if these are symmetrical, otherwise No
              </div>
            </div>

            {/* Symmetry Task (8x6 Dual Grid from Image 4) */}
            {currentTask.challengeType === 'symmetry' && currentTask.symmetryData && (
              <DotGridCanvas
                grid={currentTask.symmetryData.grid}
                hasMidline={true}
                highlightMismatches={showExplanation ? currentTask.symmetryData.mismatchCells : []}
              />
            )}

            {/* Rotation Task */}
            {currentTask.challengeType === 'rotation' && currentTask.rotationData && (
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                <DotGridCanvas grid={currentTask.rotationData.gridLeft} sizePx={180} />
                <DotGridCanvas grid={currentTask.rotationData.gridRight} sizePx={180} />
              </div>
            )}

            {/* Overlay Task */}
            {currentTask.challengeType === 'overlay' && currentTask.overlayData && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <DotGridCanvas grid={currentTask.overlayData.gridA} sizePx={140} />
                  <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#64748B' }}>+</span>
                  <DotGridCanvas grid={currentTask.overlayData.gridB} sizePx={140} />
                </div>
                <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#64748B' }}>=</span>
                <DotGridCanvas grid={currentTask.overlayData.resultGrid} sizePx={160} />
              </div>
            )}

            {/* Missing Cell Task */}
            {question.challengeType === 'missing_cell' && question.matrix && (
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 75px)',
                  gridTemplateRows: 'repeat(3, 75px)',
                  gap: '6px',
                  padding: '10px',
                  background: '#F8FAFC',
                  borderRadius: '12px',
                  border: '1.5px solid #E2E8F0'
                }}>
                  {question.matrix.map((row, r) =>
                    row.map((cell, c) => (
                      <div
                        key={`${r}-${c}`}
                        style={{
                          background: cell ? '#FFFFFF' : '#FEF3C7',
                          border: cell ? '1px solid #CBD5E1' : '2px dashed #F59E0B',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: cell ? undefined : '1.4rem',
                          fontWeight: 900,
                          color: '#D97706'
                        }}
                      >
                        {cell ? (
                          <ShapeIcon shape={cell.shape} color={cell.color} rotation={cell.rotation} size={32} />
                        ) : (
                          '?'
                        )}
                      </div>
                    ))
                  )}
                </div>

                {question.options && (
                  <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
                    {question.options.map((opt, idx) => {
                      const isSelected = selectedOptionIndex === idx;
                      const isCorrect = showExplanation && idx === question.correctOptionIndex;
                      return (
                        <button
                          key={idx}
                          onClick={() => onSelectOption && onSelectOption(idx)}
                          style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '10px',
                            background: isCorrect ? '#ECFDF5' : isSelected ? '#EFF6FF' : '#FFFFFF',
                            border: isCorrect ? '2px solid #10B981' : isSelected ? '2px solid #0B4F8A' : '1.5px solid #E2E8F0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                          }}
                        >
                          <ShapeIcon shape={opt.shape} color={opt.color} rotation={opt.rotation} size={30} />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* YES / NO BUTTONS (Dark Navy Blue matching Image 4 & 5) */}
            {currentTask.isYesNo && (
              <div style={{ display: 'flex', gap: '16px', width: '100%', maxWidth: '280px', marginTop: '10px' }}>
                <button
                  onClick={() => handleSpatialYesNo(true)}
                  disabled={isDemo}
                  style={{
                    flex: 1,
                    padding: '10px 0',
                    borderRadius: '6px',
                    background: '#0B4F8A', // Dark Navy Blue from Image 4 & 5
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: '1rem',
                    fontWeight: 700,
                    cursor: isDemo ? 'default' : 'pointer',
                    boxShadow: '0 2px 6px rgba(11,79,138,0.3)',
                    transition: 'all 0.1s ease'
                  }}
                  onMouseEnter={e => !isDemo && (e.currentTarget.style.background = '#093E6D')}
                  onMouseLeave={e => !isDemo && (e.currentTarget.style.background = '#0B4F8A')}
                >
                  yes
                </button>
                <button
                  onClick={() => handleSpatialYesNo(false)}
                  disabled={isDemo}
                  style={{
                    flex: 1,
                    padding: '10px 0',
                    borderRadius: '6px',
                    background: '#0B4F8A', // Dark Navy Blue from Image 4 & 5
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: '1rem',
                    fontWeight: 700,
                    cursor: isDemo ? 'default' : 'pointer',
                    boxShadow: '0 2px 6px rgba(11,79,138,0.3)',
                    transition: 'all 0.1s ease'
                  }}
                  onMouseEnter={e => !isDemo && (e.currentTarget.style.background = '#093E6D')}
                  onMouseLeave={e => !isDemo && (e.currentTarget.style.background = '#0B4F8A')}
                >
                  no
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Explanation Banner ─────────────────────────────────── */}
      {showExplanation && (
        <div style={{
          marginTop: '16px',
          width: '100%',
          padding: '14px 18px',
          background: '#ECFDF5',
          border: '1.5px solid #10B981',
          borderRadius: '12px',
          fontSize: '0.86rem',
          color: '#065F46',
          lineHeight: 1.5
        }}>
          <strong>✓ Solution:</strong> {question.explanation}
        </div>
      )}
    </div>
  );
};
