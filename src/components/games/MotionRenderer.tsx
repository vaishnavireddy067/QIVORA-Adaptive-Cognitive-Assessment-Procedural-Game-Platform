import React, { useState, useEffect } from 'react';
import { MotionPuzzle, MotionBlock } from '../../engine/generators/motionGenerator';
import { sounds } from '../../services/soundEngine';

interface MotionRendererProps {
  puzzle: MotionPuzzle;
  onSolved?: (moves: number) => void;
  showExplanation?: boolean;
  isDemo?: boolean;
}

const CELL_PX = 68;

const renderBlock = (block: MotionBlock, selected: boolean, onClick: () => void) => {
  const isBall = block.type === 'ball';
  const isRock = block.type === 'rock';
  const isH = block.type === 'horizontal_bar';
  const isV = block.type === 'vertical_bar';

  const w = isBall || isRock ? CELL_PX - 12 : isH ? block.length * CELL_PX - 10 : CELL_PX - 12;
  const h = isBall || isRock ? CELL_PX - 12 : isV ? block.length * CELL_PX - 10 : CELL_PX - 12;
  const top = block.r * CELL_PX + 6;
  const left = block.c * CELL_PX + 6;

  if (isRock) {
    // Immovable Fixed Stone / Rock (Faceted X pattern)
    return (
      <div
        key={block.id}
        title="Immovable Rock Obstacle"
        style={{
          position: 'absolute',
          top, left, width: w, height: h,
          borderRadius: 8,
          background: 'linear-gradient(135deg, #E2E8F0 0%, #CBD5E1 50%, #94A3B8 100%)',
          border: '2px solid #64748B',
          boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.8), 0 3px 6px rgba(0,0,0,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 8,
          userSelect: 'none',
        }}
      >
        {/* Faceted X texture */}
        <svg width="32" height="32" viewBox="0 0 32 32">
          <polygon points="0,0 16,16 0,32" fill="rgba(0,0,0,0.06)" />
          <polygon points="32,0 16,16 32,32" fill="rgba(0,0,0,0.12)" />
          <polygon points="0,0 16,16 32,0" fill="rgba(255,255,255,0.4)" />
          <polygon points="0,32 16,16 32,32" fill="rgba(0,0,0,0.18)" />
          <line x1="0" y1="0" x2="32" y2="32" stroke="#64748B" strokeWidth="1.5" />
          <line x1="32" y1="0" x2="0" y2="32" stroke="#64748B" strokeWidth="1.5" />
        </svg>
      </div>
    );
  }

  return (
    <div
      key={block.id}
      onClick={onClick}
      title={`${block.id} (${block.type})`}
      style={{
        position: 'absolute',
        top, left, width: w, height: h,
        borderRadius: isBall ? '50%' : 10,
        background: isBall
          ? 'radial-gradient(circle at 35% 35%, #F87171 0%, #EF4444 40%, #B91C1C 100%)'
          : block.color,
        border: selected ? '3px solid #141312' : '2px solid rgba(0,0,0,0.15)',
        boxShadow: selected
          ? '0 0 0 3px rgba(245,158,11,0.8), 0 4px 12px rgba(0,0,0,0.25)'
          : isBall
          ? '0 4px 10px rgba(220,38,38,0.4), inset 0 2px 4px rgba(255,255,255,0.4)'
          : '0 3px 8px rgba(0,0,0,0.15), inset 0 1px 2px rgba(255,255,255,0.3)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 900,
        color: '#FFFFFF',
        fontSize: isBall ? '0.65rem' : '0.9rem',
        fontFamily: 'monospace',
        zIndex: isBall ? 25 : 12,
        transition: 'top 0.18s cubic-bezier(0.2, 0.8, 0.2, 1), left 0.18s cubic-bezier(0.2, 0.8, 0.2, 1)',
        userSelect: 'none',
      }}
    >
      {isBall ? null : isH ? (
        <span style={{ letterSpacing: '3px', opacity: 0.85, fontSize: '0.85rem' }}>|||</span>
      ) : (
        <span style={{ fontSize: '1rem', opacity: 0.85, lineHeight: 0.8 }}>≡</span>
      )}
    </div>
  );
};

export const MotionRenderer: React.FC<MotionRendererProps> = ({
  puzzle,
  onSolved,
  showExplanation,
}) => {
  const [blocks, setBlocks] = useState<MotionBlock[]>(puzzle.blocks);
  const [moveCount, setMoveCount] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>('ball');
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [solved, setSolved] = useState(false);

  useEffect(() => {
    setBlocks(puzzle.blocks);
    setMoveCount(0);
    setSelectedId(puzzle.blocks.some(b => b.id === 'ball') ? 'ball' : null);
    setSelectedChoice(null);
    setSolved(false);
  }, [puzzle.id]);

  const R = puzzle.gridRows || 4;
  const C = puzzle.gridCols || 4;

  const isCellOccupied = (r: number, c: number, ignoreId: string): boolean => {
    if (r < 0 || r >= R || c < 0 || c >= C) return true;
    for (const b of blocks) {
      if (b.id === ignoreId || b.type === 'target') continue;
      if (b.type === 'rock' && b.r === r && b.c === c) return true;
      if (b.type === 'ball' && b.r === r && b.c === c) return true;
      if (b.type === 'horizontal_bar' && b.r === r && c >= b.c && c < b.c + b.length) return true;
      if (b.type === 'vertical_bar' && b.c === c && r >= b.r && r < b.r + b.length) return true;
    }
    return false;
  };

  const moveBlock = (id: string, dr: number, dc: number) => {
    if (solved) return;
    const block = blocks.find(b => b.id === id);
    if (!block || block.type === 'rock' || block.type === 'target') return;
    if (block.type === 'horizontal_bar' && dr !== 0) return;
    if (block.type === 'vertical_bar' && dc !== 0) return;

    const nR = block.r + dr;
    const nC = block.c + dc;

    let canMove = false;
    if (block.type === 'ball') {
      canMove = !isCellOccupied(nR, nC, id);
    } else if (block.type === 'horizontal_bar') {
      canMove = dc < 0
        ? !isCellOccupied(nR, nC, id)
        : !isCellOccupied(nR, nC + block.length - 1, id);
    } else if (block.type === 'vertical_bar') {
      canMove = dr < 0
        ? !isCellOccupied(nR, nC, id)
        : !isCellOccupied(nR + block.length - 1, nC, id);
    }

    if (!canMove) return;
    sounds.playClick();
    const updated = blocks.map(b => b.id === id ? { ...b, r: nR, c: nC } : b);
    setBlocks(updated);
    setMoveCount(m => m + 1);

    if (block.type === 'ball' && nR === puzzle.targetPos.r && nC === puzzle.targetPos.c) {
      sounds.playCorrect(1);
      setSolved(true);
      if (onSolved) onSolved(moveCount + 1);
    }
  };

  const handleChoiceSelect = (id: string) => {
    sounds.playClick();
    setSelectedChoice(id);
    const isCorrect =
      puzzle.subtype === 'trajectory_prediction'
        ? id === puzzle.correctExitGateId
        : id === puzzle.correctCollisionId;

    if (isCorrect) {
      sounds.playCorrect(1);
      setSolved(true);
      if (onSolved) onSolved(1);
    } else {
      sounds.playError();
    }
  };

  const subtypeTitle = 
    puzzle.subtype === 'slide_puzzle'
      ? 'Slide Motion Challenge'
      : puzzle.subtype === 'trajectory_prediction'
      ? 'Optical Trajectory & Reflectors'
      : 'Collision Interception';

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '16px',
      width: '100%',
      maxWidth: '560px',
      margin: '0 auto',
      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      outline: 'none',
    }}>
      {/* ── Header ──────────────────────────────────────────── */}
      <div style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 18px',
        background: '#FFFDF9',
        border: '1.5px solid #F3ECE1',
        borderRadius: '16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontSize: '0.78rem',
            fontWeight: 800,
            color: '#EA580C',
            background: '#FFF7ED',
            border: '1px solid #FFEDD5',
            padding: '4px 10px',
            borderRadius: '16px',
            textTransform: 'uppercase'
          }}>
            {subtypeTitle}
          </span>
        </div>
        {puzzle.subtype === 'slide_puzzle' && (
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
              Moves: <strong style={{ color: '#EA580C', fontSize: '1rem' }}>{moveCount}</strong>
              {puzzle.minMoves && <span style={{ color: '#94A3B8' }}> / min {puzzle.minMoves}</span>}
            </span>
            <button
              onClick={() => { 
                sounds.playClick();
                setBlocks(puzzle.blocks); 
                setMoveCount(0); 
                setSelectedId('ball'); 
                setSolved(false); 
              }}
              style={{
                padding: '5px 12px',
                background: '#FFFFFF',
                border: '1.5px solid #CBD5E1',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: 800,
                color: '#475569',
              }}
            >
              Reset
            </button>
          </div>
        )}
      </div>

      {/* ── 1. SUBTYPE: SLIDE PUZZLE ─────────────────────────── */}
      {puzzle.subtype === 'slide_puzzle' && (
        <>
          <div style={{ fontSize: '0.84rem', color: '#64748B', textAlign: 'center', maxWidth: '440px', lineHeight: 1.4 }}>
            Slide the colored plastic blocks along their tracks to clear the path and guide the <strong>Red Ball</strong> into the <strong>Black Hole</strong>.
          </div>

          <div style={{
            position: 'relative',
            width: C * CELL_PX,
            height: R * CELL_PX,
            background: '#F8FAFC',
            border: '2px solid #CBD5E1',
            borderRadius: '14px',
            overflow: 'hidden',
            boxShadow: '0 6px 20px rgba(0,0,0,0.06)',
            display: 'grid',
            gridTemplateRows: `repeat(${R}, ${CELL_PX}px)`,
            gridTemplateColumns: `repeat(${C}, ${CELL_PX}px)`,
          }}>
            {/* Grid background tiles */}
            {Array.from({ length: R }).map((_, r) =>
              Array.from({ length: C }).map((_, c) => (
                <div
                  key={`tile-${r}-${c}`}
                  style={{
                    width: CELL_PX,
                    height: CELL_PX,
                    borderRight: c < C - 1 ? '1px solid #E2E8F0' : 'none',
                    borderBottom: r < R - 1 ? '1px solid #E2E8F0' : 'none',
                    background: (r + c) % 2 === 0 ? '#FFFFFF' : '#F8FAFC'
                  }}
                />
              ))
            )}

            {/* Target Black Hole */}
            <div
              title="Target Hole"
              style={{
                position: 'absolute',
                top: puzzle.targetPos.r * CELL_PX + 9,
                left: puzzle.targetPos.c * CELL_PX + 9,
                width: CELL_PX - 18,
                height: CELL_PX - 18,
                borderRadius: '50%',
                background: 'radial-gradient(circle at 50% 50%, #000000 0%, #0F172A 70%, #334155 100%)',
                boxShadow: 'inset 0 3px 8px rgba(0,0,0,0.9), 0 0 0 2px #475569',
                zIndex: 6,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }} />
            </div>

            {/* Blocks & Rocks */}
            {blocks.filter(b => b.type !== 'target').map(block =>
              renderBlock(
                block,
                selectedId === block.id,
                () => {
                  if (block.type !== 'rock') setSelectedId(block.id);
                }
              )
            )}
          </div>

          {/* Directional arrow controls */}
          {selectedId && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700 }}>
                Selected: <strong style={{ color: '#1E293B', textTransform: 'capitalize' }}>{selectedId.replace('_', ' ')}</strong>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 48px)', gap: '6px' }}>
                <div />
                <button onClick={() => moveBlock(selectedId, -1, 0)} style={btnStyle}>▲</button>
                <div />
                <button onClick={() => moveBlock(selectedId, 0, -1)} style={btnStyle}>◀</button>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.62rem', color: '#94A3B8', fontWeight: 900 }}>SLIDE</div>
                <button onClick={() => moveBlock(selectedId, 0, 1)} style={btnStyle}>▶</button>
                <div />
                <button onClick={() => moveBlock(selectedId, 1, 0)} style={btnStyle}>▼</button>
                <div />
              </div>
            </div>
          )}
        </>
      )}

      {/* ── 2. SUBTYPE: TRAJECTORY PREDICTION (OPTICAL LASER) ── */}
      {puzzle.subtype === 'trajectory_prediction' && (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
          <div style={{ fontSize: '0.86rem', color: '#475569', textAlign: 'center', maxWidth: '440px', lineHeight: 1.4 }}>
            Trace the optical laser beam fired from <strong>{puzzle.entryGate}</strong>. Each mirror deflects the beam at a <strong>90° angle</strong>. Which Exit Gate will it emerge from?
          </div>

          {/* Optical Matrix Grid Canvas */}
          <div style={{
            position: 'relative',
            width: '280px',
            height: '280px',
            background: '#0B132B',
            borderRadius: '16px',
            border: '2.5px solid #1E293B',
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            display: 'grid',
            gridTemplateRows: 'repeat(4, 1fr)',
            gridTemplateColumns: 'repeat(4, 1fr)',
            padding: '8px'
          }}>
            {/* Grid Cells & Reflectors */}
            {Array.from({ length: 4 }).map((_, r) =>
              Array.from({ length: 4 }).map((_, c) => {
                const mirror = puzzle.reflectors?.find(ref => ref.r === r && ref.c === c);
                return (
                  <div
                    key={`${r}-${c}`}
                    style={{
                      border: '1px dashed rgba(255,255,255,0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative'
                    }}
                  >
                    {mirror && (
                      <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '8px',
                        background: 'rgba(56, 189, 248, 0.15)',
                        border: '1.5px solid #38BDF8',
                        boxShadow: '0 0 10px rgba(56, 189, 248, 0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#38BDF8',
                        fontWeight: 900,
                        fontSize: '1.4rem'
                      }}>
                        {mirror.direction}
                      </div>
                    )}
                  </div>
                );
              })
            )}

            {/* Perimeter Exit Gate Indicators */}
            {puzzle.exitGates?.map(gate => (
              <div
                key={gate.id}
                style={{
                  position: 'absolute',
                  top: gate.r === 0 ? '-10px' : gate.r === 3 ? 'calc(100% - 14px)' : `${gate.r * 25 + 8}%`,
                  left: gate.c === 0 ? '-10px' : gate.c === 3 ? 'calc(100% - 14px)' : `${gate.c * 25 + 8}%`,
                  background: '#FF3B20',
                  color: '#FFFFFF',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  fontSize: '0.65rem',
                  fontWeight: 900,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
                  zIndex: 20
                }}
              >
                {gate.id}
              </div>
            ))}
          </div>

          {/* Candidate Gate Options */}
          <div style={{ width: '100%', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginTop: '6px' }}>
            {puzzle.exitGates?.map(gate => {
              const isSelected = selectedChoice === gate.id;
              const isCorrect = (showExplanation || solved) && gate.id === puzzle.correctExitGateId;
              const isWrong = isSelected && !isCorrect && selectedChoice !== null;

              return (
                <button
                  key={gate.id}
                  onClick={() => handleChoiceSelect(gate.id)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '12px',
                    background: isCorrect ? '#DCFCE7' : isWrong ? '#FEE2E2' : isSelected ? '#FEF3C7' : '#FFFFFF',
                    border: isCorrect ? '2px solid #16A34A' : isWrong ? '2px solid #DC2626' : isSelected ? '2px solid #F59E0B' : '1.5px solid #CBD5E1',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontWeight: 800,
                    fontSize: '0.88rem',
                    color: isCorrect ? '#166534' : isWrong ? '#991B1B' : '#1E293B',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>{gate.label}</span>
                  <span style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: isCorrect ? '#16A34A' : '#1E293B',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem'
                  }}>
                    {gate.id}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── 3. SUBTYPE: COLLISION INTERCEPTION ────────────────── */}
      {puzzle.subtype === 'collision_intercept' && (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
          <div style={{ fontSize: '0.86rem', color: '#475569', textAlign: 'center', maxWidth: '440px', lineHeight: 1.4 }}>
            Particles are moving across the radar field. Identify the predicted coordinate where their trajectories will <strong>intersect and collide</strong>.
          </div>

          {/* Collision Plane View */}
          <div style={{
            position: 'relative',
            width: '280px',
            height: '280px',
            background: '#030712',
            borderRadius: '16px',
            border: '2.5px solid #1F2937',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            display: 'grid',
            gridTemplateRows: 'repeat(4, 1fr)',
            gridTemplateColumns: 'repeat(4, 1fr)',
            padding: '8px'
          }}>
            {/* Grid Sectors */}
            {Array.from({ length: 4 }).map((_, r) =>
              Array.from({ length: 4 }).map((_, c) => (
                <div
                  key={`${r}-${c}`}
                  style={{
                    border: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.6rem',
                    color: 'rgba(255,255,255,0.2)',
                    fontFamily: 'monospace'
                  }}
                >
                  {r},{c}
                </div>
              ))
            )}

            {/* Render Red & Blue Particles */}
            {puzzle.blocks?.map((p, idx) => (
              <div
                key={p.id || idx}
                style={{
                  position: 'absolute',
                  top: `${p.r * 25 + 5}%`,
                  left: `${p.c * 25 + 5}%`,
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: p.color,
                  boxShadow: `0 0 14px ${p.color}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  fontWeight: 900,
                  fontSize: '0.72rem',
                  zIndex: 10
                }}
              >
                P{idx + 1}
              </div>
            ))}
          </div>

          {/* Sector Options */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
            {puzzle.collisionOptions?.map(opt => {
              const isSelected = selectedChoice === opt.id;
              const isCorrect = (showExplanation || solved) && opt.id === puzzle.correctCollisionId;
              const isWrong = isSelected && !isCorrect && selectedChoice !== null;

              return (
                <button
                  key={opt.id}
                  onClick={() => handleChoiceSelect(opt.id)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '12px',
                    background: isCorrect ? '#DCFCE7' : isWrong ? '#FEE2E2' : isSelected ? '#FEF3C7' : '#FFFFFF',
                    border: isCorrect ? '2px solid #16A34A' : isWrong ? '2px solid #DC2626' : isSelected ? '2px solid #F59E0B' : '1.5px solid #CBD5E1',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontWeight: 800,
                    fontSize: '0.88rem',
                    color: isCorrect ? '#166534' : isWrong ? '#991B1B' : '#1E293B',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>{opt.label}</span>
                  <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#64748B' }}>
                    {opt.coordinate}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Solved banner ───────────────────────────────────── */}
      {solved && (
        <div style={{
          width: '100%',
          padding: '12px 18px',
          background: '#ECFDF5',
          border: '2px solid #10B981',
          borderRadius: '10px',
          fontWeight: 800,
          color: '#065F46',
          textAlign: 'center',
          fontSize: '0.92rem',
        }}>
          🎉 Correct solution verified!
        </div>
      )}

      {showExplanation && (
        <div style={{
          width: '100%',
          padding: '12px 16px',
          background: '#FFFBEB',
          border: '1.5px solid #F59E0B',
          borderRadius: '10px',
          fontSize: '0.85rem',
          color: '#92400E',
        }}>
          <strong>✓ Solution Logic:</strong> {puzzle.explanation}
        </div>
      )}
    </div>
  );
};

const btnStyle: React.CSSProperties = {
  height: 40,
  background: '#fff',
  border: '1.5px solid #ddd',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '1.1rem',
  fontWeight: 700,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
  transition: 'all 0.1s',
};

