import React, { useState, useEffect } from 'react';
import { ColorGridTask, ColorGridTable, IndicatorColor } from '../../engine/generators/colorGridGenerator';

interface ColorGridRendererProps {
  task: ColorGridTask;
  onComplete: (success: boolean) => void;
  showExplanation?: boolean;
  isDemo?: boolean;
}

const COLOR_MAP: Record<IndicatorColor, { bg: string; border: string; label: string }> = {
  none: { bg: '#FFFFFF', border: '#CBD5E1', label: 'Empty' },
  orange: { bg: '#EA580C', border: '#C2410C', label: 'Orange' },
  blue: { bg: '#1E293B', border: '#0F172A', label: 'Blue-Black' },
  green: { bg: '#16A34A', border: '#15803D', label: 'Green' },
  gray: { bg: '#94A3B8', border: '#64748B', label: 'Gray' }
};

// Diamond 3x3 Grid Table Component
const DiamondTable: React.FC<{
  table: ColorGridTable;
  isInteractive?: boolean;
  onTopClick?: () => void;
  onBottomClick?: () => void;
  availableColors?: IndicatorColor[];
}> = ({
  table,
  isInteractive = false,
  onTopClick,
  onBottomClick
}) => {
  const topInfo = COLOR_MAP[table.topColor] || COLOR_MAP.none;
  const bottomInfo = COLOR_MAP[table.bottomColor] || COLOR_MAP.none;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '8px',
      userSelect: 'none'
    }}>
      {/* Top Indicator Dot */}
      <button
        onClick={isInteractive ? onTopClick : undefined}
        disabled={!isInteractive}
        title={isInteractive ? `Top Dot: ${topInfo.label} (Click to change)` : undefined}
        style={{
          width: '18px',
          height: '18px',
          borderRadius: '50%',
          backgroundColor: topInfo.bg,
          border: `2px solid ${topInfo.border}`,
          cursor: isInteractive ? 'pointer' : 'default',
          boxShadow: table.topColor !== 'none' ? '0 2px 5px rgba(0,0,0,0.2)' : 'none',
          transition: 'all 0.15s ease',
          padding: 0
        }}
      />

      {/* 3x3 Diamond Grid Body */}
      <div style={{
        width: '90px',
        height: '90px',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Diamond Box rotated 45 deg */}
        <div style={{
          width: '64px',
          height: '64px',
          transform: 'rotate(45deg)',
          backgroundColor: '#F1F5F9',
          border: '1.5px solid #CBD5E1',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridTemplateRows: 'repeat(3, 1fr)',
          gap: '1px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
        }}>
          {table.cells.map((row, rIdx) =>
            row.map((cell, cIdx) => (
              <div
                key={`${rIdx}-${cIdx}`}
                style={{
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '0.5px solid #E2E8F0'
                }}
              >
                {/* Text counter-rotated so letters are upright */}
                <span style={{
                  transform: 'rotate(-45deg)',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: '#1E293B'
                }}>
                  {cell}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Bottom Indicator Dot */}
      <button
        onClick={isInteractive ? onBottomClick : undefined}
        disabled={!isInteractive}
        title={isInteractive ? `Bottom Dot: ${bottomInfo.label} (Click to change)` : undefined}
        style={{
          width: '18px',
          height: '18px',
          borderRadius: '50%',
          backgroundColor: bottomInfo.bg,
          border: `2px solid ${bottomInfo.border}`,
          cursor: isInteractive ? 'pointer' : 'default',
          boxShadow: table.bottomColor !== 'none' ? '0 2px 5px rgba(0,0,0,0.2)' : 'none',
          transition: 'all 0.15s ease',
          padding: 0
        }}
      />
    </div>
  );
};

export const ColorGridRenderer: React.FC<ColorGridRendererProps> = ({
  task,
  onComplete,
  showExplanation = false,
  isDemo = false
}) => {
  // User answers for the 4 query grids
  const [userQueryGrids, setUserQueryGrids] = useState<ColorGridTable[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    // Initialize query grids with empty colors
    setUserQueryGrids(task.queryGrids.map(g => ({
      ...g,
      topColor: 'none',
      bottomColor: 'none'
    })));
    setIsSubmitted(false);
    setIsCorrect(null);
  }, [task]);

  const cycleColor = (currentColor: IndicatorColor): IndicatorColor => {
    const cycle = task.availableColors;
    const currentIndex = cycle.indexOf(currentColor);
    const nextIndex = (currentIndex + 1) % cycle.length;
    return cycle[nextIndex];
  };

  const handleToggleTop = (gridIndex: number) => {
    if (isDemo || isSubmitted) return;
    setUserQueryGrids(prev => {
      const next = [...prev];
      next[gridIndex] = {
        ...next[gridIndex],
        topColor: cycleColor(next[gridIndex].topColor)
      };
      return next;
    });
  };

  const handleToggleBottom = (gridIndex: number) => {
    if (isDemo || isSubmitted) return;
    setUserQueryGrids(prev => {
      const next = [...prev];
      next[gridIndex] = {
        ...next[gridIndex],
        bottomColor: cycleColor(next[gridIndex].bottomColor)
      };
      return next;
    });
  };

  const handleSubmit = () => {
    if (isSubmitted) return;
    
    // Check correctness against task.correctQueryAnswers
    let correct = true;
    for (let i = 0; i < task.correctQueryAnswers.length; i++) {
      const expected = task.correctQueryAnswers[i];
      const actual = userQueryGrids[i];
      if (actual.topColor !== expected.topColor || actual.bottomColor !== expected.bottomColor) {
        correct = false;
        break;
      }
    }

    setIsSubmitted(true);
    setIsCorrect(correct);
    onComplete(correct);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      maxWidth: '820px',
      margin: '0 auto',
      gap: '16px',
      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif"
    }}>
      {/* Header Info */}
      <div style={{ textAlign: 'center' }}>
        <h3 style={{ margin: '0 0 4px 0', fontSize: '1.2rem', fontWeight: 800, color: '#0F172A' }}>
          Color the Grid Challenge
        </h3>
        <p style={{ margin: 0, fontSize: '0.86rem', color: '#64748B', fontWeight: 600 }}>
          Observe the 6 reference diamond tables above, deduce the pattern, and color the indicator dots on the 4 query tables below.
        </p>
      </div>

      {/* Observation Section (6 Diamond Tables) */}
      <div style={{
        width: '100%',
        padding: '16px 20px',
        backgroundColor: '#FFFFFF',
        borderRadius: '14px',
        border: '1.5px solid #E2E8F0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{
          fontSize: '0.78rem',
          fontWeight: 800,
          color: '#2563EB',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          Observation Tables (6 Reference Grids)
        </div>

        {/* 2 rows of 3 diamond tables */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px 40px',
          justifyItems: 'center'
        }}>
          {task.referenceGrids.map((table) => (
            <DiamondTable
              key={table.id}
              table={table}
              isInteractive={false}
            />
          ))}
        </div>
      </div>

      {/* Sleek Horizontal Bar Divider */}
      <div style={{
        width: '100%',
        height: '4px',
        backgroundColor: '#CBD5E1',
        borderRadius: '2px',
        position: 'relative',
        margin: '4px 0'
      }}>
        <div style={{
          position: 'absolute',
          top: '-8px',
          left: '12px',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          backgroundColor: '#3B82F6',
          boxShadow: '0 2px 5px rgba(59,130,246,0.4)'
        }} />
      </div>

      {/* Query Section (4 Diamond Tables to Color) */}
      <div style={{
        width: '100%',
        padding: '16px 20px',
        backgroundColor: '#F8FAFC',
        borderRadius: '14px',
        border: '1.5px solid #E2E8F0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{
          fontSize: '0.78rem',
          fontWeight: 800,
          color: '#EA580C',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          Target Tables (Click the top and bottom circles to apply colors)
        </div>

        {/* 4 diamond tables in a single row */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          width: '100%',
          gap: '16px',
          flexWrap: 'wrap'
        }}>
          {userQueryGrids.map((table, idx) => (
            <DiamondTable
              key={table.id}
              table={table}
              isInteractive={!isSubmitted && !isDemo}
              onTopClick={() => handleToggleTop(idx)}
              onBottomClick={() => handleToggleBottom(idx)}
              availableColors={task.availableColors}
            />
          ))}
        </div>

        {/* Action Button */}
        {!isSubmitted && (
          <button
            onClick={handleSubmit}
            disabled={isDemo}
            style={{
              marginTop: '10px',
              padding: '10px 28px',
              borderRadius: '10px',
              backgroundColor: '#EA580C',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '0.92rem',
              fontWeight: 800,
              cursor: isDemo ? 'default' : 'pointer',
              boxShadow: '0 4px 12px rgba(234,88,12,0.25)',
              transition: 'all 0.15s ease'
            }}
          >
            Submit Coloring
          </button>
        )}
      </div>

      {/* Result / Explanation */}
      {(isSubmitted || showExplanation) && (
        <div style={{
          width: '100%',
          padding: '14px 18px',
          backgroundColor: isCorrect ? '#ECFDF5' : '#FEF2F2',
          border: `1.5px solid ${isCorrect ? '#10B981' : '#EF4444'}`,
          borderRadius: '12px',
          fontSize: '0.88rem',
          color: isCorrect ? '#065F46' : '#991B1B',
          lineHeight: 1.5
        }}>
          <strong>{isCorrect ? '✓ Correct Deduction!' : '✗ Rule Mismatch:'}</strong> {task.ruleExplanation}
        </div>
      )}
    </div>
  );
};
