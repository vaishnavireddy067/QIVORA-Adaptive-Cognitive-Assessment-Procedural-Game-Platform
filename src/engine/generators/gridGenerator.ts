import { Difficulty } from '../../types';

export type SpatialChallengeType =
  | 'symmetry'
  | 'rotation'
  | 'overlay'
  | 'missing_cell'
  | 'full_grid_challenge'
  | 'spatial_sequence';

export type GridShape = 'circle' | 'square' | 'triangle' | 'diamond' | 'cross' | 'star';
export type GridFill = 'solid' | 'outline' | 'striped';

export interface GridCell {
  shape: GridShape;
  fill: GridFill;
  count: number;
  rotation: number; // 0, 90, 180, 270
  color?: string;
}

export interface ScatteredNode {
  id: number;
  xPct: number; // 0 to 100
  yPct: number; // 0 to 100
}

export interface GridChallengeStep {
  stepIndex: number;
  targetNodeIndex: number;
  spatialTask: {
    prompt: string;
    challengeType: 'symmetry' | 'rotation' | 'overlay';
    subRuleLabel: string;
    isYesNo: boolean;
    correctAnswerBool: boolean;
    symmetryData?: {
      rows: number;
      cols: number;
      grid: boolean[][];
      isSymmetrical: boolean;
      mismatchCells?: { r: number; c: number }[];
    };
    rotationData?: {
      size: number;
      gridLeft: boolean[][];
      gridRight: boolean[][];
      isRotatedIdentical: boolean;
      appliedAngle: number;
    };
    overlayData?: {
      size: number;
      gridA: boolean[][];
      gridB: boolean[][];
      resultGrid: boolean[][];
      isCorrect: boolean;
      operation: 'UNION' | 'XOR';
    };
    explanation: string;
  };
}

export type GridPatternType = 'latin_square' | 'diagonal_symmetry' | 'rotation_matrix' | SpatialChallengeType;

export interface GridQuestion {
  id: string;
  level: number;
  challengeType: SpatialChallengeType;
  prompt: string;
  subRuleLabel: string;
  isYesNo: boolean;
  correctAnswerBool?: boolean;

  // Multi-step P&G Dot Challenge Coordination (2 to 5 dots + tasks in series)
  scatteredNodes?: ScatteredNode[];
  steps?: GridChallengeStep[];
  targetNodeIndices?: number[];
  targetNodeSequence?: number[];

  // Single-task fallback data
  symmetryData?: {
    rows: number;
    cols: number;
    grid: boolean[][];
    isSymmetrical: boolean;
    mismatchCells?: { r: number; c: number }[];
  };
  rotationData?: {
    size: number;
    gridLeft: boolean[][];
    gridRight: boolean[][];
    isRotatedIdentical: boolean;
    appliedAngle: number;
  };
  overlayData?: {
    size: number;
    gridA: boolean[][];
    gridB: boolean[][];
    resultGrid: boolean[][];
    isCorrect: boolean;
    operation: 'UNION' | 'XOR';
  };

  // Matrix Progression
  gridSize?: number;
  patternType?: GridPatternType;
  matrix?: (GridCell | null)[][];
  missingRow?: number;
  missingCol?: number;
  options?: GridCell[];
  correctOptionIndex?: number;

  explanation: string;
}

// ─── Preset Coordinates for Scattered Nodes (Matching Images 3 & 5) ───
export const FIXED_SCATTERED_NODES: ScatteredNode[] = [
  { id: 0, xPct: 50, yPct: 12 },
  { id: 1, xPct: 35, yPct: 16 },
  { id: 2, xPct: 65, yPct: 16 },
  { id: 3, xPct: 20, yPct: 22 },
  { id: 4, xPct: 80, yPct: 22 },
  { id: 5, xPct: 45, yPct: 26 },
  { id: 6, xPct: 55, yPct: 26 },
  { id: 7, xPct: 15, yPct: 34 },
  { id: 8, xPct: 30, yPct: 35 },
  { id: 9, xPct: 70, yPct: 35 },
  { id: 10, xPct: 85, yPct: 34 },
  { id: 11, xPct: 46, yPct: 44 },
  { id: 12, xPct: 54, yPct: 44 },
  { id: 13, xPct: 24, yPct: 48 },
  { id: 14, xPct: 76, yPct: 48 },
  { id: 15, xPct: 86, yPct: 54 },
  { id: 16, xPct: 16, yPct: 58 },
  { id: 17, xPct: 38, yPct: 60 },
  { id: 18, xPct: 62, yPct: 60 },
  { id: 19, xPct: 22, yPct: 72 },
  { id: 20, xPct: 46, yPct: 70 },
  { id: 21, xPct: 54, yPct: 70 },
  { id: 22, xPct: 78, yPct: 72 },
  { id: 23, xPct: 32, yPct: 82 },
  { id: 24, xPct: 50, yPct: 84 },
  { id: 25, xPct: 68, yPct: 82 },
  { id: 26, xPct: 50, yPct: 92 }
];

const COLOR_PALETTE: Record<GridShape, string> = {
  cross: '#475569',
  square: '#DC2626',
  triangle: '#2563EB',
  circle: '#16A34A',
  star: '#9333EA',
  diamond: '#EA580C'
};

function createEmptyGrid(rows: number, cols: number): boolean[][] {
  return Array.from({ length: rows }, () => Array(cols).fill(false));
}

function rotateGridClockwise(grid: boolean[][], angle: number): boolean[][] {
  const n = grid.length;
  let current = grid.map(row => [...row]);
  const steps = ((angle % 360) + 360) % 360 / 90;

  for (let s = 0; s < steps; s++) {
    const next = createEmptyGrid(n, n);
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        next[c][n - 1 - r] = current[r][c];
      }
    }
    current = next;
  }
  return current;
}

// ──────────────────────────────────────────────────────────────────
// 1. SYMMETRY TASK GENERATOR (8 Rows x 6 Cols Matching Images 4 & 5)
// ──────────────────────────────────────────────────────────────────
export function generateSymmetryTask(difficulty: Difficulty, level: number = 1): GridQuestion {
  const rows = 8;
  const cols = 6;
  const halfCols = 3;
  const isSymmetrical = Math.random() < 0.5;

  const grid = createEmptyGrid(rows, cols);
  const activeDotCount = difficulty === 'easy' ? 7 : difficulty === 'medium' ? 9 : 11;

  const leftCoords: { r: number; c: number }[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < halfCols; c++) {
      leftCoords.push({ r, c });
    }
  }
  leftCoords.sort(() => Math.random() - 0.5);

  const selectedLeft = leftCoords.slice(0, activeDotCount);
  for (const { r, c } of selectedLeft) {
    grid[r][c] = true;
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < halfCols; c++) {
      const mirrorCol = cols - 1 - c;
      grid[r][mirrorCol] = grid[r][c];
    }
  }

  const mismatchCells: { r: number; c: number }[] = [];

  if (!isSymmetrical) {
    const flipRow = Math.floor(Math.random() * rows);
    const flipCol = halfCols + Math.floor(Math.random() * halfCols);
    grid[flipRow][flipCol] = !grid[flipRow][flipCol];
    mismatchCells.push({ r: flipRow, c: flipCol });

    if (difficulty === 'hard') {
      const flipRow2 = (flipRow + 2) % rows;
      const flipCol2 = halfCols + Math.floor(Math.random() * halfCols);
      grid[flipRow2][flipCol2] = !grid[flipRow2][flipCol2];
      mismatchCells.push({ r: flipRow2, c: flipCol2 });
    }
  }

  const mismatchDesc = mismatchCells.length > 0 
    ? ` Asymmetry detected at row ${mismatchCells[0].r + 1}, column ${mismatchCells[0].c + 1} (does not match mirror counterpart).`
    : ' Every block on the left has an identical mirror counterpart across the vertical midline.';

  // Determine number of sequential circles based on level (2 up to 5)
  const dotCount = Math.min(5, Math.max(2, level + 1));
  const nodeIds = Array.from({ length: FIXED_SCATTERED_NODES.length }, (_, i) => i).sort(() => Math.random() - 0.5);
  const targetSequence = nodeIds.slice(0, dotCount);

  const steps: GridChallengeStep[] = targetSequence.map((targetIdx, i) => {
    // Generate fresh symmetry pattern for each step
    const stepIsSymm = Math.random() < 0.5;
    const stepGrid = createEmptyGrid(rows, cols);
    const stepLeft = [...leftCoords].sort(() => Math.random() - 0.5).slice(0, activeDotCount);
    for (const { r, c } of stepLeft) {
      stepGrid[r][c] = true;
    }
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < halfCols; c++) {
        stepGrid[r][cols - 1 - c] = stepGrid[r][c];
      }
    }
    const stepMismatches: { r: number; c: number }[] = [];
    if (!stepIsSymm) {
      const fr = Math.floor(Math.random() * rows);
      const fc = halfCols + Math.floor(Math.random() * halfCols);
      stepGrid[fr][fc] = !stepGrid[fr][fc];
      stepMismatches.push({ r: fr, c: fc });
    }

    return {
      stepIndex: i,
      targetNodeIndex: targetIdx,
      spatialTask: {
        prompt: 'Is it symmetrical?',
        challengeType: 'symmetry',
        subRuleLabel: `Step ${i + 1} of ${dotCount}: Axial Symmetry`,
        isYesNo: true,
        correctAnswerBool: stepIsSymm,
        symmetryData: {
          rows,
          cols,
          grid: stepGrid,
          isSymmetrical: stepIsSymm,
          mismatchCells: stepMismatches
        },
        explanation: stepIsSymm
          ? `YES — Symmetrical across vertical midline.`
          : `NO — Pattern is not symmetrical.`
      }
    };
  });

  return {
    id: Math.random().toString(36).substring(2, 9),
    level,
    challengeType: 'symmetry',
    prompt: 'Where on the grid and which order did the dots appear?',
    subRuleLabel: `Round 1: Axial Symmetry (${dotCount} Circles)`,
    isYesNo: true,
    correctAnswerBool: isSymmetrical,
    scatteredNodes: FIXED_SCATTERED_NODES,
    steps,
    targetNodeSequence: targetSequence,
    targetNodeIndices: targetSequence,
    symmetryData: {
      rows,
      cols,
      grid,
      isSymmetrical,
      mismatchCells
    },
    explanation: isSymmetrical
      ? `YES — The pattern reflects perfectly across the central vertical axis.${mismatchDesc}`
      : `NO — The pattern is not symmetrical.${mismatchDesc}`
  };
}

// ──────────────────────────────────────────────────────────────────
// 2. MENTAL ROTATION TASK
// ──────────────────────────────────────────────────────────────────
export function generateRotationTask(difficulty: Difficulty, level: number = 2): GridQuestion {
  const size = difficulty === 'easy' ? 4 : 5;
  const isRotatedIdentical = Math.random() < 0.5;
  const angles = [90, 180, 270];
  const appliedAngle = angles[Math.floor(Math.random() * angles.length)];

  const gridLeft = createEmptyGrid(size, size);
  const dotCount = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 6 : 7;

  const allCoords: { r: number; c: number }[] = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      allCoords.push({ r, c });
    }
  }
  allCoords.sort(() => Math.random() - 0.5);

  for (let i = 0; i < dotCount; i++) {
    const { r, c } = allCoords[i];
    gridLeft[r][c] = true;
  }

  let gridRight = rotateGridClockwise(gridLeft, appliedAngle);

  if (!isRotatedIdentical) {
    gridRight = gridRight.map(row => [...row]);
    const rIdx = Math.floor(Math.random() * size);
    const cIdx = Math.floor(Math.random() * size);
    gridRight[rIdx][cIdx] = !gridRight[rIdx][cIdx];
  }

  const stepCount = Math.min(5, Math.max(2, level + 1));
  const nodeIds = Array.from({ length: FIXED_SCATTERED_NODES.length }, (_, i) => i).sort(() => Math.random() - 0.5);
  const targetSequence = nodeIds.slice(0, stepCount);

  const steps: GridChallengeStep[] = targetSequence.map((targetIdx, i) => {
    return {
      stepIndex: i,
      targetNodeIndex: targetIdx,
      spatialTask: {
        prompt: 'Rotated but identical?',
        challengeType: 'rotation',
        subRuleLabel: `Step ${i + 1} of ${stepCount}: Mental Rotation (${appliedAngle}°)`,
        isYesNo: true,
        correctAnswerBool: isRotatedIdentical,
        rotationData: {
          size,
          gridLeft,
          gridRight,
          isRotatedIdentical,
          appliedAngle
        },
        explanation: isRotatedIdentical
          ? `YES — Exact match when rotated ${appliedAngle}°.`
          : `NO — Pattern is altered when rotated.`
      }
    };
  });

  return {
    id: Math.random().toString(36).substring(2, 9),
    level,
    challengeType: 'rotation',
    prompt: 'Rotated but identical?',
    subRuleLabel: `Round 2: Mental Rotation (${stepCount} Circles)`,
    isYesNo: true,
    correctAnswerBool: isRotatedIdentical,
    scatteredNodes: FIXED_SCATTERED_NODES,
    steps,
    targetNodeSequence: targetSequence,
    targetNodeIndices: targetSequence,
    rotationData: {
      size,
      gridLeft,
      gridRight,
      isRotatedIdentical,
      appliedAngle
    },
    explanation: isRotatedIdentical
      ? `YES — Rotating the left grid ${appliedAngle}° clockwise reproduces the exact same dot distribution.`
      : `NO — When rotated by ${appliedAngle}°, dot positions do not match. The pattern has been altered.`
  };
}

// ──────────────────────────────────────────────────────────────────
// 3. PATTERN OVERLAY / COMBINATION
// ──────────────────────────────────────────────────────────────────
export function generateOverlayTask(difficulty: Difficulty, level: number = 3): GridQuestion {
  const size = 4;
  const isCorrect = Math.random() < 0.5;
  const gridA = createEmptyGrid(size, size);
  const gridB = createEmptyGrid(size, size);

  const dotsA = difficulty === 'easy' ? 3 : 4;
  const dotsB = difficulty === 'easy' ? 3 : 4;

  const coords: { r: number; c: number }[] = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) coords.push({ r, c });
  }
  coords.sort(() => Math.random() - 0.5);

  for (let i = 0; i < dotsA; i++) {
    gridA[coords[i].r][coords[i].c] = true;
  }
  for (let i = dotsA; i < dotsA + dotsB; i++) {
    gridB[coords[i].r][coords[i].c] = true;
  }

  const correctResult = createEmptyGrid(size, size);
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      correctResult[r][c] = gridA[r][c] || gridB[r][c];
    }
  }

  let displayedResult = correctResult.map(row => [...row]);
  if (!isCorrect) {
    const rIdx = Math.floor(Math.random() * size);
    const cIdx = Math.floor(Math.random() * size);
    displayedResult[rIdx][cIdx] = !displayedResult[rIdx][cIdx];
  }

  const stepCount = Math.min(5, Math.max(2, level + 1));
  const nodeIds = Array.from({ length: FIXED_SCATTERED_NODES.length }, (_, i) => i).sort(() => Math.random() - 0.5);
  const targetSequence = nodeIds.slice(0, stepCount);

  const steps: GridChallengeStep[] = targetSequence.map((targetIdx, i) => {
    return {
      stepIndex: i,
      targetNodeIndex: targetIdx,
      spatialTask: {
        prompt: 'Correct?',
        challengeType: 'overlay',
        subRuleLabel: `Step ${i + 1} of ${stepCount}: Pattern Combination`,
        isYesNo: true,
        correctAnswerBool: isCorrect,
        overlayData: {
          size,
          gridA,
          gridB,
          resultGrid: displayedResult,
          isCorrect,
          operation: 'UNION'
        },
        explanation: isCorrect
          ? 'YES — Superimposing Grid A and Grid B matches the combined result.'
          : 'NO — The proposed combination has an error.'
      }
    };
  });

  return {
    id: Math.random().toString(36).substring(2, 9),
    level,
    challengeType: 'overlay',
    prompt: 'Correct?',
    subRuleLabel: `Round 3: Pattern Combination (${stepCount} Circles)`,
    isYesNo: true,
    correctAnswerBool: isCorrect,
    scatteredNodes: FIXED_SCATTERED_NODES,
    steps,
    targetNodeSequence: targetSequence,
    targetNodeIndices: targetSequence,
    overlayData: {
      size,
      gridA,
      gridB,
      resultGrid: displayedResult,
      isCorrect,
      operation: 'UNION'
    },
    explanation: isCorrect
      ? 'YES — Superimposing Grid A and Grid B produces the exact resulting pattern shown below.'
      : 'NO — The proposed combined grid has a discrepancy (missing or extraneous dot) compared to Grid A + Grid B.'
  };
}

// ──────────────────────────────────────────────────────────────────
// 4. MISSING CELL / MATRIX PROGRESSION
// ──────────────────────────────────────────────────────────────────
export function generateMatrixTask(difficulty: Difficulty): GridQuestion {
  const size = 3;
  const shapes: GridShape[] = ['square', 'circle', 'triangle'];
  const matrix: (GridCell | null)[][] = [];

  for (let r = 0; r < 3; r++) {
    const row: (GridCell | null)[] = [];
    for (let c = 0; c < 3; c++) {
      if (r === 2 && c === 2) {
        row.push(null);
      } else {
        const sh = shapes[(r + c) % 3];
        row.push({
          shape: sh,
          fill: 'solid',
          count: c + 1,
          rotation: (r * 90) % 360,
          color: COLOR_PALETTE[sh]
        });
      }
    }
    matrix.push(row);
  }

  const correctShape = shapes[(2 + 2) % 3];
  const correctCell: GridCell = {
    shape: correctShape,
    fill: 'solid',
    count: 3,
    rotation: (2 * 90) % 360,
    color: COLOR_PALETTE[correctShape]
  };

  const distractors: GridCell[] = [
    { ...correctCell, shape: shapes[0] },
    { ...correctCell, rotation: 90 },
    { ...correctCell, count: 1 }
  ];

  const options = [correctCell, ...distractors].sort(() => Math.random() - 0.5);
  const correctIdx = options.findIndex(
    o => o.shape === correctCell.shape && o.rotation === correctCell.rotation && o.count === correctCell.count
  );

  return {
    id: Math.random().toString(36).substring(2, 9),
    level: 4,
    challengeType: 'missing_cell',
    prompt: 'What replaces the question mark?',
    subRuleLabel: '3x3 Shape & Count Progression',
    isYesNo: false,
    gridSize: size,
    patternType: 'rotation_matrix',
    matrix,
    missingRow: 2,
    missingCol: 2,
    options,
    correctOptionIndex: correctIdx,
    explanation: `Multi-attribute Rule: Shape shifts cyclically across diagonals, rows rotate elements by +90°, and columns increment element count. Missing cell requires ${correctCell.shape.toUpperCase()} rotated by ${correctCell.rotation}°.`
  };
}

// ──────────────────────────────────────────────────────────────────
// 5. P&G FULL GRID CHALLENGE (Dynamic Sequence 2 up to 5 Circles)
// ──────────────────────────────────────────────────────────────────
export function generateFullGridChallenge(difficulty: Difficulty, level: number = 1): GridQuestion {
  const qId = Math.random().toString(36).substring(2, 9);
  
  // Level 1: 2 circles, Level 2: 3 circles, Level 3: 4 circles, Level 4: 4 circles, Level 5: 5 circles
  const dotCount = level === 1 ? 2 : level === 2 ? 3 : level === 3 ? 4 : level === 4 ? 4 : 5;
  const nodeIds = Array.from({ length: FIXED_SCATTERED_NODES.length }, (_, i) => i).sort(() => Math.random() - 0.5);
  const targetSequence = nodeIds.slice(0, dotCount);

  const steps: GridChallengeStep[] = targetSequence.map((targetIdx, i) => {
    const taskType: 'symmetry' | 'rotation' | 'overlay' =
      i % 3 === 0 ? 'symmetry' : i % 3 === 1 ? 'rotation' : 'overlay';

    const baseTask =
      taskType === 'symmetry'
        ? generateSymmetryTask(difficulty, level)
        : taskType === 'rotation'
        ? generateRotationTask(difficulty, level)
        : generateOverlayTask(difficulty, level);

    return {
      stepIndex: i,
      targetNodeIndex: targetIdx,
      spatialTask: {
        prompt: baseTask.prompt,
        challengeType: taskType,
        subRuleLabel: `Cycle ${i + 1} of ${dotCount}: ${baseTask.subRuleLabel}`,
        isYesNo: true,
        correctAnswerBool: baseTask.correctAnswerBool ?? true,
        symmetryData: baseTask.symmetryData,
        rotationData: baseTask.rotationData,
        overlayData: baseTask.overlayData,
        explanation: baseTask.explanation
      }
    };
  });

  return {
    id: qId,
    level,
    challengeType: 'full_grid_challenge',
    prompt: `Recall ${dotCount} sequential target circles`,
    subRuleLabel: `P&G Full Grid Challenge (Level ${level}: ${dotCount} Circles Sequence)`,
    isYesNo: true,
    correctAnswerBool: true,
    scatteredNodes: FIXED_SCATTERED_NODES,
    steps,
    targetNodeSequence: targetSequence,
    targetNodeIndices: targetSequence,
    explanation: `Full sequence required memorizing ${dotCount} sequential circle coordinates with interleaved spatial validation tasks.`
  };
}

// ──────────────────────────────────────────────────────────────────
// PRIMARY DISPATCHER
// ──────────────────────────────────────────────────────────────────
export function generateGridQuestion(
  difficulty: Difficulty = 'medium',
  forcedPattern?: GridPatternType,
  level: number = 1
): GridQuestion {
  if (forcedPattern === 'symmetry') return generateSymmetryTask(difficulty, level);
  if (forcedPattern === 'rotation') return generateRotationTask(difficulty, level);
  if (forcedPattern === 'overlay') return generateOverlayTask(difficulty, level);
  if (forcedPattern === 'latin_square' || forcedPattern === 'missing_cell') return generateMatrixTask(difficulty);
  if (forcedPattern === 'full_grid_challenge') return generateFullGridChallenge(difficulty, level);

  if (level === 1) return generateSymmetryTask(difficulty, 1);
  if (level === 2) return generateRotationTask(difficulty, 2);
  if (level === 3) return generateOverlayTask(difficulty, 3);
  if (level === 4) return generateMatrixTask(difficulty);
  return generateFullGridChallenge(difficulty, level);
}
