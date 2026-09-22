import React from 'react';
import { GameId } from '../../types';

interface IllustrationProps {
  size?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

// 1. Inductive Reasoning Illustration: Geometric transformation sequence with rule vector
export const InductiveIllustration: React.FC<IllustrationProps> = ({
  size = 28,
  color = '#B45309',
  style
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ display: 'block', flexShrink: 0, ...style }}
  >
    {/* Background soft geometric guide ring */}
    <circle cx="24" cy="24" r="21" stroke={color} strokeWidth="1.5" strokeDasharray="3 3" opacity="0.3" />
    {/* Shape 1: Circle */}
    <circle cx="14" cy="18" r="6" stroke={color} strokeWidth="2.5" fill="none" />
    {/* Shape 2: Diamond */}
    <polygon points="34,12 40,18 34,24 28,18" stroke={color} strokeWidth="2.5" fill="none" />
    {/* Shape 3: Triangle with target dot */}
    <polygon points="24,28 32,40 16,40" stroke={color} strokeWidth="2.5" fill={color} fillOpacity="0.15" />
    <circle cx="24" cy="35" r="2.5" fill={color} />
    {/* Connection rule arrows / path */}
    <path d="M20 18H28" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M30 22L26 27" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// 2. Matrix / Spatial Grid Illustration: 3x3 Raven matrix array with dynamic focal cell
export const GridIllustration: React.FC<IllustrationProps> = ({
  size = 28,
  color = '#1D4ED8',
  style
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ display: 'block', flexShrink: 0, ...style }}
  >
    {/* Outer rounded matrix container */}
    <rect x="6" y="6" width="36" height="36" rx="8" stroke={color} strokeWidth="2" fill="none" opacity="0.4" />
    {/* 3x3 Cells */}
    <rect x="10" y="10" width="7" height="7" rx="2" fill={color} fillOpacity="0.75" />
    <rect x="20.5" y="10" width="7" height="7" rx="2" fill={color} fillOpacity="0.4" />
    <rect x="31" y="10" width="7" height="7" rx="2" fill={color} fillOpacity="0.2" />

    <rect x="10" y="20.5" width="7" height="7" rx="2" fill={color} fillOpacity="0.4" />
    <rect x="20.5" y="20.5" width="7" height="7" rx="2" fill={color} fillOpacity="0.75" />
    <rect x="31" y="20.5" width="7" height="7" rx="2" fill={color} fillOpacity="0.4" />

    <rect x="10" y="31" width="7" height="7" rx="2" fill={color} fillOpacity="0.2" />
    <rect x="20.5" y="31" width="7" height="7" rx="2" fill={color} fillOpacity="0.4" />
    {/* Focal candidate cell */}
    <rect x="31" y="31" width="7" height="7" rx="2" stroke={color} strokeWidth="2" strokeDasharray="2 2" fill={color} fillOpacity="0.1" />
    <circle cx="34.5" cy="34.5" r="1.5" fill={color} />
  </svg>
);

// 3. Switch Challenge Illustration: Permutation circuit node with rerouting toggles
export const SwitchIllustration: React.FC<IllustrationProps> = ({
  size = 28,
  color = '#047857',
  style
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ display: 'block', flexShrink: 0, ...style }}
  >
    {/* Outer guide */}
    <rect x="8" y="12" width="32" height="24" rx="6" stroke={color} strokeWidth="2" fill={color} fillOpacity="0.08" />
    {/* Parallel node lines */}
    <circle cx="14" cy="18" r="3" fill={color} />
    <circle cx="14" cy="30" r="3" fill={color} />
    <circle cx="34" cy="18" r="3" stroke={color} strokeWidth="2" fill="none" />
    <circle cx="34" cy="30" r="3" stroke={color} strokeWidth="2" fill="none" />
    {/* Crossing permutation switch tracks */}
    <path d="M17 18C22 18 26 30 31 30" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <path d="M17 30C22 30 26 18 31 18" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeDasharray="3 2" />
    {/* Switch toggle node */}
    <circle cx="24" cy="24" r="3" fill="#FFFFFF" stroke={color} strokeWidth="2" />
  </svg>
);

// 4. Memory / Retention Illustration: Synaptic memory matrix & dual-tier retention nodes
export const MemoryIllustration: React.FC<IllustrationProps> = ({
  size = 28,
  color = '#6D28D9',
  style
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ display: 'block', flexShrink: 0, ...style }}
  >
    {/* Hexagonal neural node framework */}
    <polygon points="24,6 40,15 40,33 24,42 8,33 8,15" stroke={color} strokeWidth="1.5" strokeDasharray="3 3" opacity="0.35" />
    {/* Interconnected memory synapses */}
    <path d="M24 12V24L34 30" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M24 24L14 30" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M14 18L24 24" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
    <path d="M34 18L24 24" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
    {/* Nodes */}
    <circle cx="24" cy="12" r="3.5" fill={color} />
    <circle cx="34" cy="18" r="2.5" fill={color} fillOpacity="0.5" />
    <circle cx="14" cy="18" r="2.5" fill={color} fillOpacity="0.5" />
    <circle cx="34" cy="30" r="3.5" fill={color} />
    <circle cx="14" cy="30" r="3.5" fill={color} />
    {/* Central core memory spark */}
    <circle cx="24" cy="24" r="4.5" fill={color} stroke="#FFFFFF" strokeWidth="2" />
  </svg>
);

// 5. Attention / Vigilance Illustration: Precision optical reticle with anomaly focus aperture
export const AttentionIllustration: React.FC<IllustrationProps> = ({
  size = 28,
  color = '#BE123C',
  style
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ display: 'block', flexShrink: 0, ...style }}
  >
    {/* Outer radar circle */}
    <circle cx="24" cy="24" r="18" stroke={color} strokeWidth="2" opacity="0.4" />
    {/* Inner focus reticle */}
    <circle cx="24" cy="24" r="10" stroke={color} strokeWidth="2.5" fill={color} fillOpacity="0.08" />
    {/* Crosshairs */}
    <line x1="24" y1="4" x2="24" y2="10" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <line x1="24" y1="38" x2="24" y2="44" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <line x1="4" y1="24" x2="10" y2="24" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <line x1="38" y1="24" x2="44" y2="24" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    {/* Target anomaly point */}
    <circle cx="24" cy="24" r="3.5" fill={color} />
    <circle cx="31" cy="17" r="2" fill={color} opacity="0.6" />
  </svg>
);

// 6. Reaction / Speed Illustration: Kinetic velocity spark / lightning impulse with speed calibration
export const ReactionIllustration: React.FC<IllustrationProps> = ({
  size = 28,
  color = '#C2410C',
  style
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ display: 'block', flexShrink: 0, ...style }}
  >
    {/* Outer velocity burst arcs */}
    <path d="M10 24C10 16.268 16.268 10 24 10" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.35" />
    <path d="M38 24C38 31.732 31.732 38 24 38" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.35" />
    {/* Precision Lightning bolt */}
    <path
      d="M26 6L14 26H24L22 42L34 22H24L26 6Z"
      stroke={color}
      strokeWidth="2.5"
      strokeLinejoin="round"
      fill={color}
      fillOpacity="0.15"
    />
    {/* Latency mark dots */}
    <circle cx="38" cy="14" r="2" fill={color} />
    <circle cx="10" cy="34" r="2" fill={color} />
  </svg>
);

// 7. Math / Quantitative Illustration: Balanced arithmetic operators matrix
export const MathIllustration: React.FC<IllustrationProps> = ({
  size = 28,
  color = '#0369A1',
  style
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ display: 'block', flexShrink: 0, ...style }}
  >
    {/* Balanced grid boundary */}
    <rect x="8" y="8" width="32" height="32" rx="8" stroke={color} strokeWidth="2" fill={color} fillOpacity="0.06" />
    <line x1="24" y1="10" x2="24" y2="38" stroke={color} strokeWidth="1.5" strokeDasharray="3 3" opacity="0.3" />
    <line x1="10" y1="24" x2="38" y2="24" stroke={color} strokeWidth="1.5" strokeDasharray="3 3" opacity="0.3" />
    {/* Plus (Top-Left) */}
    <path d="M16 13V19M13 16H19" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    {/* Multiply (Top-Right) */}
    <path d="M29 13L35 19M35 13L29 19" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    {/* Equals (Bottom-Left) */}
    <path d="M13 30H19M13 34H19" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    {/* Divide (Bottom-Right) */}
    <path d="M29 32H35" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="32" cy="29" r="1.2" fill={color} />
    <circle cx="32" cy="35" r="1.2" fill={color} />
  </svg>
);

// 8. Deductive / Inference Illustration: Formal logic-gate premise intersection
export const DeductiveIllustration: React.FC<IllustrationProps> = ({
  size = 28,
  color = '#0F766E',
  style
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ display: 'block', flexShrink: 0, ...style }}
  >
    {/* Two overlapping premise sets (Venn logic) */}
    <circle cx="19" cy="24" r="12" stroke={color} strokeWidth="2" opacity="0.4" />
    <circle cx="29" cy="24" r="12" stroke={color} strokeWidth="2" opacity="0.4" />
    {/* Intersecting deduction focal core */}
    <path
      d="M24 14.5C26.5 17 28 20.3 28 24C28 27.7 26.5 31 24 33.5C21.5 31 20 27.7 20 24C20 20.3 21.5 17 24 14.5Z"
      fill={color}
      fillOpacity="0.2"
      stroke={color}
      strokeWidth="2.5"
    />
    {/* Insight spark / proof node */}
    <circle cx="24" cy="24" r="2.5" fill={color} />
    <line x1="24" y1="8" x2="24" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// 9. Motion / Spatial Illustration: Trajectory path vector through geometric waypoints
export const MotionIllustration: React.FC<IllustrationProps> = ({
  size = 28,
  color = '#E11D48',
  style
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ display: 'block', flexShrink: 0, ...style }}
  >
    {/* Path vector coordinate grid */}
    <rect x="8" y="8" width="32" height="32" rx="6" stroke={color} strokeWidth="1.5" strokeDasharray="3 3" opacity="0.3" />
    {/* Navigational trajectory line */}
    <path d="M14 34L22 22L30 28L36 12" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    {/* Waypoints */}
    <circle cx="14" cy="34" r="3.5" fill={color} />
    <circle cx="22" cy="22" r="2.5" fill={color} fillOpacity="0.5" />
    <circle cx="30" cy="28" r="2.5" fill={color} fillOpacity="0.5" />
    {/* Target endpoint */}
    <circle cx="36" cy="12" r="4.5" stroke={color} strokeWidth="2" fill="#FFFFFF" />
    <circle cx="36" cy="12" r="2" fill={color} />
  </svg>
);

// 10. Color Grid Illustration: Diamond rule chromatic matrix
export const ColorGridIllustration: React.FC<IllustrationProps> = ({
  size = 28,
  color = '#7C3AED',
  style
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ display: 'block', flexShrink: 0, ...style }}
  >
    {/* 4 Quadrants */}
    <rect x="10" y="10" width="12" height="12" rx="3" fill="#3B82F6" fillOpacity="0.8" />
    <rect x="26" y="10" width="12" height="12" rx="3" fill="#10B981" fillOpacity="0.8" />
    <rect x="10" y="26" width="12" height="12" rx="3" fill="#F59E0B" fillOpacity="0.8" />
    <rect x="26" y="26" width="12" height="12" rx="3" fill="#EC4899" fillOpacity="0.8" />
    {/* Center rule diamond */}
    <polygon points="24,17 31,24 24,31 17,24" fill="#FFFFFF" stroke={color} strokeWidth="2" />
    <circle cx="24" cy="24" r="2" fill={color} />
  </svg>
);

// Map of GameId to Illustration Component
export const CognitiveIllustrationMap: Record<string, React.FC<IllustrationProps>> = {
  inductive: InductiveIllustration,
  grid: GridIllustration,
  switch: SwitchIllustration,
  memory: MemoryIllustration,
  attention: AttentionIllustration,
  reaction: ReactionIllustration,
  math: MathIllustration,
  deductive: DeductiveIllustration,
  motion: MotionIllustration,
  color_grid: ColorGridIllustration,
};

export const CognitiveIllustration: React.FC<{
  gameId: GameId | string;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({ gameId, size = 28, color, style }) => {
  const Component = CognitiveIllustrationMap[gameId] || InductiveIllustration;
  return <Component size={size} color={color} style={style} />;
};
