import React from 'react';
import { GameId } from '../../types';

interface RadarChartProps {
  scores: Record<GameId, number>;
  size?: number;
  showBenchmark?: boolean;
}

const AXIS_CONFIG: { id: GameId; label: string }[] = [
  { id: 'inductive', label: 'Inductive' },
  { id: 'deductive', label: 'Deductive' },
  { id: 'grid', label: 'Spatial Matrix' },
  { id: 'switch', label: 'Switch Flex' },
  { id: 'memory', label: 'Working Memory' },
  { id: 'attention', label: 'Attention' },
  { id: 'reaction', label: 'Reaction' },
  { id: 'math', label: 'Mental Math' },
  { id: 'motion', label: 'Motion' },
  { id: 'color_grid', label: 'Color Grid' }
];

const BENCHMARK_SCORES: Record<GameId, number> = {
  inductive: 70,
  deductive: 68,
  grid: 65,
  switch: 62,
  memory: 72,
  attention: 75,
  reaction: 70,
  math: 66,
  motion: 68,
  color_grid: 70
};

export const RadarChart: React.FC<RadarChartProps> = ({ scores, size = 380, showBenchmark = true }) => {
  const center = size / 2;
  const radius = (size / 2) - 55;
  const numAxes = AXIS_CONFIG.length;
  const angleStep = (Math.PI * 2) / numAxes;

  // Generate concentric grid rings (20%, 40%, 60%, 80%, 100%)
  const levels = [0.25, 0.5, 0.75, 1.0];

  const getCoordinates = (value: number, index: number) => {
    const angle = index * angleStep - Math.PI / 2;
    const r = (value / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle)
    };
  };

  // Build polygon path string
  const userPolygonPoints = AXIS_CONFIG.map((axis, i) => {
    const val = scores[axis.id] ?? 50;
    const { x, y } = getCoordinates(val, i);
    return `${x},${y}`;
  }).join(' ');

  const benchmarkPolygonPoints = AXIS_CONFIG.map((axis, i) => {
    const val = BENCHMARK_SCORES[axis.id];
    const { x, y } = getCoordinates(val, i);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div style={{ position: 'relative', width: size, height: size, margin: '0 auto' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id="radarUserGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366F1" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0.35" />
          </linearGradient>
          <radialGradient id="radarCenterGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(99, 102, 241, 0.25)" />
            <stop offset="100%" stopColor="rgba(99, 102, 241, 0)" />
          </radialGradient>
        </defs>

        {/* Ambient center glow */}
        <circle cx={center} cy={center} r={radius} fill="url(#radarCenterGlow)" />

        {/* Concentric Web Rings */}
        {levels.map((lvl, idx) => {
          const points = AXIS_CONFIG.map((_, i) => {
            const { x, y } = getCoordinates(lvl * 100, i);
            return `${x},${y}`;
          }).join(' ');
          return (
            <polygon
              key={`ring-${idx}`}
              points={points}
              fill="none"
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="1"
            />
          );
        })}

        {/* Spokes */}
        {AXIS_CONFIG.map((_, i) => {
          const { x, y } = getCoordinates(100, i);
          return (
            <line
              key={`spoke-${i}`}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="rgba(255, 255, 255, 0.12)"
              strokeWidth="1"
              strokeDasharray="2 2"
            />
          );
        })}

        {/* Benchmark Silhouette */}
        {showBenchmark && (
          <polygon
            points={benchmarkPolygonPoints}
            fill="none"
            stroke="rgba(255, 255, 255, 0.25)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
        )}

        {/* User Polygon Area */}
        <polygon
          points={userPolygonPoints}
          fill="url(#radarUserGrad)"
          stroke="#6366F1"
          strokeWidth="2.5"
          style={{ filter: 'drop-shadow(0 0 10px rgba(99, 102, 241, 0.5))' }}
        />

        {/* Data points & Labels */}
        {AXIS_CONFIG.map((axis, i) => {
          const userVal = scores[axis.id] ?? 50;
          const { x, y } = getCoordinates(userVal, i);
          const labelCoord = getCoordinates(118, i);

          return (
            <g key={`data-${axis.id}`}>
              {/* Point */}
              <circle
                cx={x}
                cy={y}
                r="4.5"
                fill="#10B981"
                stroke="#080C14"
                strokeWidth="2"
              />
              {/* Text Label */}
              <text
                x={labelCoord.x}
                y={labelCoord.y + 4}
                textAnchor="middle"
                fill="#94A3B8"
                fontSize="11"
                fontWeight="600"
                fontFamily="var(--font-sans)"
              >
                {axis.label}
              </text>
              <text
                x={labelCoord.x}
                y={labelCoord.y + 16}
                textAnchor="middle"
                fill="#F8FAFC"
                fontSize="10"
                fontWeight="700"
                fontFamily="var(--font-mono)"
              >
                {userVal}%
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
        marginTop: '-10px',
        fontSize: '0.78rem',
        color: 'var(--text-muted)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'linear-gradient(135deg, #6366F1, #10B981)' }} />
          <span>Your Profile</span>
        </div>
        {showBenchmark && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '14px', height: '2px', borderTop: '2px dashed rgba(255,255,255,0.4)' }} />
            <span>Cohort Average (68%)</span>
          </div>
        )}
      </div>
    </div>
  );
};
