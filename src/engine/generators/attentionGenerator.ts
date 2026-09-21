import { Difficulty } from '../../types';

export type AttentionSubtype = 'target_anomaly' | 'feature_frequency' | 'rapid_comparison' | 'change_detection';

export interface AttentionItem {
  id: number;
  rotation: number;
  isTarget: boolean;
  shape: 'ring' | 'cross' | 'arrow' | 'diamond' | 'star' | 'c_gap' | 'circle' | 'square' | 'triangle';
  color?: string;
}

export interface AttentionQuestion {
  id: string;
  subtype: AttentionSubtype;
  subtypeName: string;
  prompt: string;

  // 1. For target_anomaly
  gridCols?: number;
  items?: AttentionItem[];
  targetIndex?: number;

  // 2. For feature_frequency
  targetFeature?: { shape: string; color: string; label: string };
  featureItems?: { id: number; shape: string; color: string }[];
  correctCount?: number;
  countOptions?: number[];
  correctOptionIndex?: number;

  // 3. For rapid_comparison
  codeA?: string;
  codeB?: string;
  isIdentical?: boolean;

  // 4. For change_detection ⭐
  scene1Items?: { id: number; shape: string; color: string }[];
  scene2Items?: { id: number; shape: string; color: string }[];
  changedIndex?: number;
  changeType?: 'color' | 'shape';
  originalItem?: { shape: string; color: string };
  newItem?: { shape: string; color: string };

  explanation: string;
  timeLimitSec: number;
}

// ── 1. Target Detection (Orientation & Gap Anomaly Engine) ────────────
function generateTargetAnomaly(difficulty: Difficulty): AttentionQuestion {
  const qId = 'att_ta_' + Math.random().toString(36).substring(2, 9);
  const gridCols = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 5 : 6;
  const total = gridCols * gridCols;
  const targetIndex = Math.floor(Math.random() * total);

  const shapes: ('arrow' | 'ring' | 'diamond' | 'cross')[] = ['arrow', 'ring', 'diamond', 'cross'];
  const shape = shapes[Math.floor(Math.random() * shapes.length)];

  // Angles: 0, 45, 90, 135, 180, 225, 270, 315
  const baseRotation = (Math.floor(Math.random() * 4) * 90);
  const offsetAngle = difficulty === 'easy' ? 180 : difficulty === 'medium' ? 90 : 45;
  const targetRotation = (baseRotation + offsetAngle) % 360;

  const colors = ['#0284C7', '#7C3AED', '#EA580C', '#16A34A', '#DC2626'];
  const chosenColor = colors[Math.floor(Math.random() * colors.length)];

  const items: AttentionItem[] = Array.from({ length: total }, (_, i) => ({
    id: i,
    rotation: i === targetIndex ? targetRotation : baseRotation,
    isTarget: i === targetIndex,
    shape,
    color: chosenColor
  }));

  const row = Math.floor(targetIndex / gridCols) + 1;
  const col = (targetIndex % gridCols) + 1;

  return {
    id: qId,
    subtype: 'target_anomaly',
    subtypeName: 'Target Anomaly Detection',
    prompt: 'Rapidly scan the matrix and tap the single symbol with a divergent orientation:',
    gridCols,
    items,
    targetIndex,
    explanation: `Target anomaly is located at Row ${row}, Column ${col} (rotation is ${targetRotation}° while all others are ${baseRotation}°).`,
    timeLimitSec: 15
  };
}

// ── 2. Feature Frequency Search (Multi-Conjunction Field) ───────────
const SHAPE_COLOR_PAIRS = [
  { shape: 'triangle', color: '#16A34A', label: 'Green Triangle' },
  { shape: 'circle', color: '#DC2626', label: 'Red Circle' },
  { shape: 'square', color: '#2563EB', label: 'Blue Square' },
  { shape: 'star', color: '#CA8A04', label: 'Gold Star' },
  { shape: 'diamond', color: '#9333EA', label: 'Purple Diamond' },
  { shape: 'cross', color: '#EA580C', label: 'Orange Cross' }
];

function generateFeatureFrequency(): AttentionQuestion {
  const qId = 'att_ff_' + Math.random().toString(36).substring(2, 9);
  const total = 25; // 5x5 field
  const targetFeature = SHAPE_COLOR_PAIRS[Math.floor(Math.random() * SHAPE_COLOR_PAIRS.length)];

  const targetCount = Math.floor(Math.random() * 4) + 3; // 3, 4, 5, or 6

  const items: { id: number; shape: string; color: string }[] = [];
  const targetSlots = new Set<number>();
  while (targetSlots.size < targetCount) {
    targetSlots.add(Math.floor(Math.random() * total));
  }

  for (let i = 0; i < total; i++) {
    if (targetSlots.has(i)) {
      items.push({ id: i, shape: targetFeature.shape, color: targetFeature.color });
    } else {
      const otherPairs = SHAPE_COLOR_PAIRS.filter(p => p.shape !== targetFeature.shape || p.color !== targetFeature.color);
      const randomPair = otherPairs[Math.floor(Math.random() * otherPairs.length)];
      items.push({ id: i, shape: randomPair.shape, color: randomPair.color });
    }
  }

  const countOptions = [targetCount - 1, targetCount, targetCount + 1, targetCount + 2].sort(() => Math.random() - 0.5);
  const correctOptionIndex = countOptions.indexOf(targetCount);

  return {
    id: qId,
    subtype: 'feature_frequency',
    subtypeName: 'Feature Frequency & Attribute Counting',
    prompt: `Count the exact number of occurrences of "${targetFeature.label}":`,
    targetFeature,
    featureItems: items,
    correctCount: targetCount,
    countOptions,
    correctOptionIndex,
    explanation: `There are exactly ${targetCount} instances of ${targetFeature.label} in the field.`,
    timeLimitSec: 15
  };
}

// ── 3. Dynamic Rapid Comparison (Alphanumeric Code Matching) ────────
function generateRapidComparison(): AttentionQuestion {
  const qId = 'att_rc_' + Math.random().toString(36).substring(2, 9);
  const isIdentical = Math.random() > 0.5;

  const charSets = [
    '7K9X2M4P',
    '3829-QX71-88A',
    'X79B-4921-KL0',
    '8190248194',
    'AZ99-PX20-W8',
    'QR77-9912-MC3',
    '994102-KX91'
  ];
  const base = charSets[Math.floor(Math.random() * charSets.length)];

  let codeA = base;
  let codeB = base;

  if (!isIdentical) {
    // Perturb one character in codeB
    const chars = base.split('');
    const mutateIdx = Math.floor(Math.random() * chars.length);
    const curr = chars[mutateIdx];
    const replacements = curr >= '0' && curr <= '9' ? ['3', '7', '8', '9', '2', '5'] : ['X', 'Z', 'M', 'Q', 'P', 'K'];
    const rep = replacements.find(r => r !== curr) || 'Z';
    chars[mutateIdx] = rep;
    codeB = chars.join('');
  }

  return {
    id: qId,
    subtype: 'rapid_comparison',
    subtypeName: 'Rapid Alphanumeric String Matching',
    prompt: 'Compare String A and String B. Are they EXACTLY identical?',
    codeA,
    codeB,
    isIdentical,
    explanation: isIdentical
      ? `YES — String A and String B match character for character.`
      : `NO — String A and String B have a subtle discrepancy (${codeA} vs ${codeB}).`,
    timeLimitSec: 10
  };
}

// ── 4. Change Detection ⭐ (Flicker Scene Difference) ────────────────
function generateChangeDetection(difficulty: Difficulty): AttentionQuestion {
  const qId = 'att_cd_' + Math.random().toString(36).substring(2, 9);
  const count = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 5 : 6;
  const changedIndex = Math.floor(Math.random() * count);

  const baseItems: { id: number; shape: string; color: string }[] = [];
  const used = new Set<string>();

  for (let i = 0; i < count; i++) {
    const pair = SHAPE_COLOR_PAIRS[i % SHAPE_COLOR_PAIRS.length];
    baseItems.push({ id: i, shape: pair.shape, color: pair.color });
    used.add(`${pair.shape}_${pair.color}`);
  }

  // Scene 2: clone and mutate only changedIndex
  const scene2Items = baseItems.map(item => ({ ...item }));
  const original = baseItems[changedIndex];

  // Pick new color or shape
  const otherPairs = SHAPE_COLOR_PAIRS.filter(p => p.shape !== original.shape || p.color !== original.color);
  const replacement = otherPairs[Math.floor(Math.random() * otherPairs.length)];
  scene2Items[changedIndex] = { id: changedIndex, shape: replacement.shape, color: replacement.color };

  return {
    id: qId,
    subtype: 'change_detection',
    subtypeName: 'Change Detection & Visual Memory',
    prompt: 'Observe Scene 1, then identify which item CHANGED in Scene 2:',
    scene1Items: baseItems,
    scene2Items,
    changedIndex,
    originalItem: { shape: original.shape, color: original.color },
    newItem: { shape: replacement.shape, color: replacement.color },
    explanation: `Item #${changedIndex + 1} changed from ${original.shape} to ${replacement.shape} (${replacement.color}).`,
    timeLimitSec: 12
  };
}

// ── Master Attention Question Generator ──────────────────────────────
export function generateAttentionQuestion(
  difficulty: Difficulty = 'medium',
  level: number = 1,
  subtypeIndex?: number
): AttentionQuestion {
  if (subtypeIndex !== undefined) {
    if (subtypeIndex === 0) return generateTargetAnomaly(difficulty);
    if (subtypeIndex === 1) return generateFeatureFrequency();
    if (subtypeIndex === 2) return generateRapidComparison();
    if (subtypeIndex === 3) return generateChangeDetection(difficulty);
  }

  if (level === 1) return generateTargetAnomaly('easy');
  if (level === 2) return generateFeatureFrequency();
  if (level === 3) return generateRapidComparison();
  if (level === 4) return generateChangeDetection('medium');
  return generateTargetAnomaly('hard');
}
