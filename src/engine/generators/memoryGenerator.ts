import { Difficulty } from '../../types';

export interface InterferenceTask {
  id: string;
  type: 'symmetry' | 'rotation_match' | 'quick_math';
  questionPrompt: string;
  visualData: any;
  correctAnswer: boolean; // true = YES / TRUE, false = NO / FALSE
  explanation: string;
}

export interface MemoryInterferenceStep {
  stepIndex: number;
  dotPosition: number; // 0 to 15 in a 4x4 grid
  interference: InterferenceTask;
}

export type MemorySubtype = 'digit_span' | 'spatial_span' | 'sequence_recall' | 'delayed_recall' | 'interference_task';

export interface MemoryInterferenceTask {
  id: string;
  subtype: MemorySubtype;
  level: number; // 1 to 5
  difficulty: Difficulty;
  gridSize: number; // 4 (for 4x4 grid)
  steps: MemoryInterferenceStep[];
  targetSequence: number[]; // e.g. [3, 11, 6]
  
  // Digit Span Specific
  digitSequence?: number[];
  recallDirection?: 'forward' | 'reverse';

  // Sequence Recall Specific (Symbols) ⭐
  symbolSequence?: string[];
  targetSymbolSequence?: string[];

  // Delayed Recall Specific
  delaySeconds?: number;

  displayDotDurationMs: number; // 1500 ms
  interferenceTimeLimitSec: number; // 3.5s
  explanation: string;
  aiDemoSteps: {
    phase: 'dot' | 'interference' | 'recall';
    actionPayload: any;
    rationale: string;
  }[];
}

// Backward compatibility
export type MemoryPuzzle = MemoryInterferenceTask;

function generateInterferenceTask(id: string): InterferenceTask {
  const r = Math.random();

  if (r < 0.4) {
    // Symmetry check in 4x4 binary matrix
    const isSymmetric = Math.random() > 0.45;
    const grid: boolean[][] = [];
    for (let rIdx = 0; rIdx < 4; rIdx++) {
      const row: boolean[] = [];
      for (let cIdx = 0; cIdx < 4; cIdx++) {
        if (cIdx < 2) {
          row.push(Math.random() > 0.5);
        } else {
          const mirrorCol = 3 - cIdx;
          if (isSymmetric) {
            row.push(row[mirrorCol]);
          } else {
            row.push(Math.random() > 0.5);
          }
        }
      }
      grid.push(row);
    }

    return {
      id,
      type: 'symmetry',
      questionPrompt: 'Is this shape vertically symmetrical?',
      visualData: { grid },
      correctAnswer: isSymmetric,
      explanation: isSymmetric
        ? 'Left and right halves mirror each other vertically.'
        : 'Left and right halves are not mirror images.'
    };
  } else if (r < 0.75) {
    // Quick Math equivalence (e.g. 8 + 6 = 14)
    const n1 = Math.floor(Math.random() * 8) + 3;
    const n2 = Math.floor(Math.random() * 8) + 2;
    const isTrue = Math.random() > 0.45;
    const result = isTrue ? n1 + n2 : n1 + n2 + (Math.random() > 0.5 ? 1 : -1);

    return {
      id,
      type: 'quick_math',
      questionPrompt: `Is this statement true? ${n1} + ${n2} = ${result}`,
      visualData: { statement: `${n1} + ${n2} = ${result}` },
      correctAnswer: isTrue,
      explanation: `${n1} + ${n2} = ${n1 + n2}. Statement was ${isTrue ? 'correct' : 'incorrect'}.`
    };
  } else {
    // Rotation match
    const isMatch = Math.random() > 0.5;
    return {
      id,
      type: 'rotation_match',
      questionPrompt: 'Are these two symbols identical if rotated?',
      visualData: { symbolA: '★', rotA: 0, symbolB: isMatch ? '★' : '✦', rotB: 90 },
      correctAnswer: isMatch,
      explanation: isMatch ? 'Symbols are identical.' : 'Symbols are different geometric shapes.'
    };
  }
}

export const MEMORY_SYMBOLS = ['▲', '●', '■', '★', '◆', '✦', '⬟', '⬣'];

export function generateMemoryPuzzle(
  difficulty: Difficulty = 'medium',
  level: number = 2,
  subtypeIndex: number = 0
): MemoryInterferenceTask {
  const taskId = Math.random().toString(36).substring(2, 9);
  const gridSize = 4;
  const totalCells = gridSize * gridSize; // 16

  const subtypes: MemorySubtype[] = [
    'digit_span',
    'spatial_span',
    'sequence_recall',
    'delayed_recall',
    'interference_task'
  ];
  const subtype = subtypes[subtypeIndex % subtypes.length];

  const clampedLevel = Math.max(1, Math.min(5, level));
  // Sequence length based on level:
  // Level 1: 3 items, Level 2: 4 items, Level 3: 5 items, Level 4: 6 items, Level 5: 7 items
  const seqLength = clampedLevel + 2;
  const dotDurationMs = clampedLevel === 1 ? 1800 : clampedLevel === 2 ? 1500 : clampedLevel === 3 ? 1200 : clampedLevel === 4 ? 1000 : 800;

  // Subtype A: Sequence Recall (Symbols) ⭐
  if (subtype === 'sequence_recall') {
    const symbolSeq: string[] = [];
    for (let i = 0; i < seqLength; i++) {
      symbolSeq.push(MEMORY_SYMBOLS[Math.floor(Math.random() * MEMORY_SYMBOLS.length)]);
    }

    const targetIndices = symbolSeq.map(s => MEMORY_SYMBOLS.indexOf(s));

    return {
      id: taskId,
      subtype: 'sequence_recall',
      level,
      difficulty,
      gridSize,
      steps: [],
      targetSequence: targetIndices,
      symbolSequence: symbolSeq,
      targetSymbolSequence: symbolSeq,
      displayDotDurationMs: 1200,
      interferenceTimeLimitSec: 0,
      explanation: `Symbol sequence [${symbolSeq.join(' ')}] memorized and reproduced in order.`,
      aiDemoSteps: [
        {
          phase: 'dot',
          actionPayload: symbolSeq,
          rationale: `Memorize ${seqLength}-symbol sequence [${symbolSeq.join(' ')}].`
        },
        {
          phase: 'recall',
          actionPayload: symbolSeq,
          rationale: `Reproduce the exact sequence [${symbolSeq.join(' ')}] using the symbol bank.`
        }
      ]
    };
  }

  // Subtype B: Digit Span
  if (subtype === 'digit_span') {
    const digitSequence = Array.from({ length: seqLength }, () => Math.floor(Math.random() * 9) + 1);
    const recallDirection: 'forward' | 'reverse' = level >= 3 && Math.random() > 0.5 ? 'reverse' : 'forward';
    const targetDigits = recallDirection === 'reverse' ? [...digitSequence].reverse() : digitSequence;

    return {
      id: taskId,
      subtype: 'digit_span',
      level,
      difficulty,
      gridSize,
      steps: [],
      targetSequence: targetDigits,
      digitSequence,
      recallDirection,
      displayDotDurationMs: 1200,
      interferenceTimeLimitSec: 0,
      explanation: `Digit string [${digitSequence.join(' - ')}] recalled in ${recallDirection.toUpperCase()} order: [${targetDigits.join(' - ')}].`,
      aiDemoSteps: [
        {
          phase: 'dot',
          actionPayload: digitSequence,
          rationale: `Encoded ${seqLength}-digit sequence into phonological loop.`
        },
        {
          phase: 'recall',
          actionPayload: targetDigits,
          rationale: `Reconstructed digit sequence in ${recallDirection} order.`
        }
      ]
    };
  }

  // Pick distinct random cells
  const allIndices = Array.from({ length: totalCells }, (_, i) => i);
  const shuffled = allIndices.sort(() => Math.random() - 0.5);
  const targetSequence = shuffled.slice(0, seqLength);

  const steps: MemoryInterferenceStep[] = targetSequence.map((pos, idx) => ({
    stepIndex: idx,
    dotPosition: pos,
    interference: generateInterferenceTask(`${taskId}_distract_${idx}`)
  }));

  // Build AI demo steps
  const aiDemoSteps: MemoryInterferenceTask['aiDemoSteps'] = [];
  steps.forEach((s) => {
    aiDemoSteps.push({
      phase: 'dot',
      actionPayload: s.dotPosition,
      rationale: `Store location #${s.stepIndex + 1} at grid cell index ${s.dotPosition}.`
    });
    if (subtype === 'interference_task') {
      aiDemoSteps.push({
        phase: 'interference',
        actionPayload: s.interference.correctAnswer,
        rationale: `Solve distraction task: "${s.interference.questionPrompt}" -> Answer: ${s.interference.correctAnswer ? 'YES' : 'NO'}.`
      });
    }
  });
  aiDemoSteps.push({
    phase: 'recall',
    actionPayload: targetSequence,
    rationale: `Recall all ${seqLength} stored locations in chronological order: [${targetSequence.map(p => p + 1).join(' → ')}].`
  });

  return {
    id: taskId,
    subtype,
    level,
    difficulty,
    gridSize,
    steps,
    targetSequence,
    delaySeconds: subtype === 'delayed_recall' ? 4 : 0,
    displayDotDurationMs: 1500,
    interferenceTimeLimitSec: 3.5,
    explanation: `Target sequence had ${seqLength} spatial matrix locations with ${subtype.replace('_', ' ')} protocol.`,
    aiDemoSteps
  };
}
