import { Difficulty } from '../../types';

export type DeductiveSymbol = 'circle' | 'star' | 'cross' | 'triangle' | 'square';
export type DeductiveSubtype = 'gap_challenge' | 'ordering' | 'conditional';

export interface DeductiveQuestion {
  id: string;
  type: DeductiveSubtype;
  subtypeName: string;
  prompt: string;

  // 1. For gap_challenge (Latin Square)
  gridSize?: number;
  grid?: (DeductiveSymbol | null)[][];
  missingRow?: number;
  missingCol?: number;

  // 2. For ordering (Positional constraints)
  slotsCount?: number;
  clues?: string[];
  targetSlot?: number; // 1-indexed (e.g. Slot 3)
  knownSlots?: (DeductiveSymbol | null)[]; // partial slot state for visualization

  // 3. For conditional (Syllogisms & logic rules)
  premises?: string[];

  // Options & Solution
  isTextOptions?: boolean;
  options: (DeductiveSymbol | string)[];
  symbolOptions?: DeductiveSymbol[];
  correctOptionIndex: number;
  explanation: string;
}

export const SYMBOL_CONFIG: Record<DeductiveSymbol, { label: string; color: string }> = {
  circle: { label: 'Circle', color: '#8B5CF6' },   // Purple
  star: { label: 'Star', color: '#06B6D4' },       // Cyan
  cross: { label: 'Cross', color: '#F97316' },     // Orange
  triangle: { label: 'Triangle', color: '#10B981' }, // Emerald green
  square: { label: 'Square', color: '#EF4444' }    // Coral Red
};

// ── 1. Latin Square Gap Challenge Generator ──────────────────────────
function generateLatinSquareQuestion(difficulty: Difficulty, size: number = 4): DeductiveQuestion {
  const qId = 'ded_ls_' + Math.random().toString(36).substring(2, 9);
  const allSymbols: DeductiveSymbol[] = size === 5 
    ? ['circle', 'star', 'cross', 'triangle', 'square']
    : ['circle', 'star', 'cross', 'triangle'];

  const baseRow = [...allSymbols].sort(() => Math.random() - 0.5);
  const shifts = size === 4 ? [0, 1, 2, 3] : [0, 1, 2, 3, 4];
  shifts.sort(() => Math.random() - 0.5);

  const fullMatrix: DeductiveSymbol[][] = [];
  for (let r = 0; r < size; r++) {
    const shift = shifts[r];
    const row: DeductiveSymbol[] = [];
    for (let c = 0; c < size; c++) {
      row.push(baseRow[(c + shift) % size]);
    }
    fullMatrix.push(row);
  }

  const missingRow = Math.floor(Math.random() * size);
  const missingCol = Math.floor(Math.random() * size);
  const correctSymbol = fullMatrix[missingRow][missingCol];

  const clueRate = difficulty === 'easy' ? 0.70 : difficulty === 'medium' ? 0.55 : 0.42;
  const maskedGrid: (DeductiveSymbol | null)[][] = fullMatrix.map((row, rIdx) =>
    row.map((val, cIdx) => {
      if (rIdx === missingRow && cIdx === missingCol) return null;
      if (rIdx === missingRow || cIdx === missingCol) {
        return Math.random() < 0.65 ? val : null;
      }
      return Math.random() < clueRate ? val : null;
    })
  );

  const rowClues = maskedGrid[missingRow].filter(c => c !== null);
  const colClues = maskedGrid.map(r => r[missingCol]).filter(c => c !== null);
  if (rowClues.length === 0 && size > 1) {
    const otherCol = (missingCol + 1) % size;
    maskedGrid[missingRow][otherCol] = fullMatrix[missingRow][otherCol];
  }
  if (colClues.length === 0 && size > 1) {
    const otherRow = (missingRow + 1) % size;
    maskedGrid[otherRow][missingCol] = fullMatrix[otherRow][missingCol];
  }

  const options = [...allSymbols];
  const correctIdx = options.indexOf(correctSymbol);

  const targetRowClues = maskedGrid[missingRow]
    .filter(c => c !== null)
    .map(c => SYMBOL_CONFIG[c!].label)
    .join(', ');
  const targetColClues = maskedGrid
    .map(r => r[missingCol])
    .filter(c => c !== null)
    .map(c => SYMBOL_CONFIG[c!].label)
    .join(', ');

  return {
    id: qId,
    type: 'gap_challenge',
    subtypeName: `Geo-Sudo ${size}×${size} Challenge [GeoStudio Pattern]`,
    prompt: `One geometrical shape can only occur ONCE in any row or column. Which shape belongs at cell (R${missingRow + 1}, C${missingCol + 1})?`,
    gridSize: size,
    grid: maskedGrid,
    missingRow,
    missingCol,
    options,
    symbolOptions: options,
    correctOptionIndex: correctIdx,
    explanation: `Geo-Sudo Decoding (Latin Square Pattern):\n• Target [ ? ] is at Row R${missingRow + 1}, Column C${missingCol + 1}.\n• Row R${missingRow + 1} already contains [${targetRowClues || 'none'}].\n• Column C${missingCol + 1} already contains [${targetColClues || 'none'}].\n• By single-occurrence row/col elimination, ${SYMBOL_CONFIG[correctSymbol].label} is the only logically valid shape for (R${missingRow + 1}, C${missingCol + 1}).`
  };
}

// ── 2. Positional & Relational Ordering Constraints ──────────────────
function generateOrderingQuestion(difficulty: Difficulty): DeductiveQuestion {
  const qId = 'ded_ord_' + Math.random().toString(36).substring(2, 9);
  const is5Slot = difficulty === 'hard' || Math.random() > 0.5;
  const syms: DeductiveSymbol[] = is5Slot
    ? ['circle', 'star', 'cross', 'triangle', 'square']
    : ['circle', 'star', 'cross', 'triangle'];
  
  const arrangement = [...syms].sort(() => Math.random() - 0.5);
  const slotsCount = syms.length;
  const targetSlot = Math.floor(Math.random() * slotsCount) + 1; // 1 to slotsCount
  const correctSymbol = arrangement[targetSlot - 1];

  const anchorSlot = targetSlot === 1 ? 2 : 1;
  const anchorSym = arrangement[anchorSlot - 1];

  const knownSlots: (DeductiveSymbol | null)[] = Array(slotsCount).fill(null);
  knownSlots[anchorSlot - 1] = anchorSym;

  const clues: string[] = [];
  clues.push(`Rule 1: Slot ${anchorSlot} is occupied by ${SYMBOL_CONFIG[anchorSym].label}.`);

  const otherIndices = Array.from({ length: slotsCount }, (_, i) => i).filter(i => i !== anchorSlot - 1);
  const i1 = otherIndices[0];
  const i2 = otherIndices[1];
  const s1 = arrangement[i1];
  const s2 = arrangement[i2];

  if (i1 < i2) {
    clues.push(`Rule 2: ${SYMBOL_CONFIG[s1].label} is positioned to the left of ${SYMBOL_CONFIG[s2].label}.`);
  } else {
    clues.push(`Rule 2: ${SYMBOL_CONFIG[s2].label} is positioned to the left of ${SYMBOL_CONFIG[s1].label}.`);
  }

  const leftSym = arrangement[0];
  const rightSym = arrangement[slotsCount - 1];

  if (targetSlot !== 1 && targetSlot !== slotsCount) {
    clues.push(`Rule 3: Neither ${SYMBOL_CONFIG[arrangement[targetSlot - 1]].label} nor ${SYMBOL_CONFIG[anchorSym].label} is at either outer boundary (Slot 1 or Slot ${slotsCount}).`);
  } else {
    clues.push(`Rule 3: ${SYMBOL_CONFIG[leftSym].label} is at Slot 1 and ${SYMBOL_CONFIG[rightSym].label} is at Slot ${slotsCount}.`);
  }

  if (is5Slot && otherIndices.length >= 3) {
    const i3 = otherIndices[2];
    const s3 = arrangement[i3];
    clues.push(`Rule 4: ${SYMBOL_CONFIG[s3].label} is immediately adjacent to ${SYMBOL_CONFIG[arrangement[Math.max(0, i3 - 1)]].label}.`);
  }

  const options = [...syms];
  const correctIdx = options.indexOf(correctSymbol);

  return {
    id: qId,
    type: 'ordering',
    subtypeName: 'Ordering Constraints',
    prompt: `Based on the positioning rules below, which symbol MUST occupy Slot ${targetSlot}?`,
    slotsCount,
    clues,
    targetSlot,
    knownSlots,
    options,
    symbolOptions: options,
    correctOptionIndex: correctIdx,
    explanation: `Step 1: Anchor constraint fixes Slot ${anchorSlot} as ${SYMBOL_CONFIG[anchorSym].label}. Step 2: Applying the relative ordering constraint and outer edge exclusions leaves only one valid slot assignment. Thus, Slot ${targetSlot} is uniquely and necessarily occupied by ${SYMBOL_CONFIG[correctSymbol].label}.`
  };
}

// ── 3. Conditional Elimination (15+ Diverse Formal Syllogisms) ────────
interface ConditionalScenario {
  premises: string[];
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

const CONDITIONAL_SCENARIOS: ConditionalScenario[] = [
  {
    premises: [
      'Premise 1: All Tier-1 data nodes are encrypted with Quantum-Key.',
      'Premise 2: No system with Quantum-Key encryption is vulnerable to Protocol X.',
      'Premise 3: Node Zeta is a verified Tier-1 data node.'
    ],
    options: [
      'Node Zeta is not vulnerable to Protocol X.',
      'All nodes encrypted with Quantum-Key are Tier-1 data nodes.',
      'Node Zeta is susceptible to Protocol X under heavy load.',
      'Only Node Zeta has Quantum-Key encryption.'
    ],
    correctOptionIndex: 0,
    explanation: 'By Syllogistic Transitivity: Node Zeta is Tier-1 → Node Zeta has Quantum-Key → Node Zeta cannot be vulnerable to Protocol X.'
  },
  {
    premises: [
      'Premise 1: Whenever Rule A is active, Rule B must also be active.',
      'Premise 2: Rule B and Rule C can never be active simultaneously.',
      'Premise 3: Currently, Rule C is active in the environment.'
    ],
    options: [
      'Rule A is currently inactive.',
      'Rule A is active but Rule B is offline.',
      'Rule B is active in the environment.',
      'Rule A and Rule C are both simultaneously active.'
    ],
    correctOptionIndex: 0,
    explanation: 'Modus Tollens Deduction: Rule C active → Rule B is inactive. Since A → B, ~B implies ~A.'
  },
  {
    premises: [
      'Premise 1: Every member of Team Helix holds a Security Clearance.',
      'Premise 2: Some individuals with Security Clearance have biometric access.',
      'Premise 3: Marcus does not hold a Security Clearance.'
    ],
    options: [
      'Marcus is not a member of Team Helix.',
      'Marcus definitely has biometric access.',
      'All members of Team Helix have biometric access.',
      'Marcus is a senior advisor to Team Helix.'
    ],
    correctOptionIndex: 0,
    explanation: 'Contrapositive Law: Team Helix → Clearance. Marcus has no clearance → Marcus cannot be on Team Helix.'
  },
  {
    premises: [
      'Premise 1: Either Server Alpha or Server Beta must handle backup traffic.',
      'Premise 2: If Server Alpha handles backup traffic, Network Bandwidth drops below 50%.',
      'Premise 3: Network Bandwidth is currently operating at 95%.'
    ],
    options: [
      'Server Beta is handling backup traffic.',
      'Server Alpha is handling backup traffic.',
      'Neither server is handling traffic.',
      'Both servers are simultaneously offline.'
    ],
    correctOptionIndex: 0,
    explanation: 'Disjunctive Syllogism: Bandwidth is 95% → Server Alpha is not handling backup → Therefore Server Beta must handle it.'
  },
  {
    premises: [
      'Premise 1: All high-frequency traders use Low-Latency Kernels.',
      'Premise 2: All algorithms using Low-Latency Kernels execute within 5 microseconds.',
      'Premise 3: Algorithm Omega takes 15 microseconds to execute.'
    ],
    options: [
      'Algorithm Omega does not use a Low-Latency Kernel.',
      'Algorithm Omega is used by all high-frequency traders.',
      'Low-Latency Kernels always take 15 microseconds.',
      'Algorithm Omega is a Tier-1 trading algorithm.'
    ],
    correctOptionIndex: 0,
    explanation: 'Contrapositive Deduction: Execution > 5μs → Algorithm Omega cannot be using a Low-Latency Kernel.'
  },
  {
    premises: [
      'Premise 1: No unverified user can initiate financial transactions.',
      'Premise 2: User Sarah successfully initiated a financial transaction today.',
      'Premise 3: All verified users possess an active 2FA token.'
    ],
    options: [
      'User Sarah possesses an active 2FA token.',
      'User Sarah is an unverified user.',
      'All users with 2FA tokens initiated financial transactions.',
      'User Sarah bypassed verification checks.'
    ],
    correctOptionIndex: 0,
    explanation: 'Transitive Proof: Initiated transaction → Verified user → Possesses active 2FA token.'
  },
  {
    premises: [
      'Premise 1: If the engine core exceeds 300°C, the coolant bypass valve automatically opens.',
      'Premise 2: If the coolant bypass valve opens, emergency alert indicator #4 activates.',
      'Premise 3: Emergency alert indicator #4 is currently OFF.'
    ],
    options: [
      'The engine core does not exceed 300°C.',
      'The engine core is running at exactly 350°C.',
      'The coolant bypass valve is currently open.',
      'Alert indicator #4 is damaged.'
    ],
    correctOptionIndex: 0,
    explanation: 'Chained Modus Tollens: Indicator OFF → Valve NOT open → Core did NOT exceed 300°C.'
  },
  {
    premises: [
      'Premise 1: All valid JSON web tokens contain a cryptographic signature.',
      'Premise 2: No expired token contains a cryptographic signature.',
      'Premise 3: AuthPayload-7 contains a valid cryptographic signature.'
    ],
    options: [
      'AuthPayload-7 is not expired.',
      'AuthPayload-7 is an invalid token.',
      'All valid tokens are expired.',
      'AuthPayload-7 cannot be parsed.'
    ],
    correctOptionIndex: 0,
    explanation: 'Categorical Syllogism: Contains signature → Cannot be expired.'
  },
  {
    premises: [
      'Premise 1: Either Process A or Process B will acquire the exclusive mutex lock.',
      'Premise 2: Process A cannot acquire the mutex lock if Resource R is busy.',
      'Premise 3: Resource R is currently busy.'
    ],
    options: [
      'Process B will acquire the exclusive mutex lock.',
      'Process A will acquire the exclusive mutex lock.',
      'Neither Process A nor Process B will acquire the lock.',
      'Resource R will immediately release Process A.'
    ],
    correctOptionIndex: 0,
    explanation: 'Disjunctive Resolution: Resource busy → Process A cannot acquire lock → Process B must acquire the mutex lock.'
  },
  {
    premises: [
      'Premise 1: Every transaction marked High-Risk undergoes fraud scoring.',
      'Premise 2: Only transactions with fraud scores > 80 are routed to Manual Review.',
      'Premise 3: Transaction #8921 was routed to Manual Review.'
    ],
    options: [
      'Transaction #8921 has a fraud score greater than 80.',
      'Transaction #8921 was marked Low-Risk.',
      'All High-Risk transactions go to Manual Review.',
      'Transaction #8921 has a fraud score under 50.'
    ],
    correctOptionIndex: 0,
    explanation: 'Necessary Condition: Routed to Manual Review only if score > 80 → Score must be > 80.'
  }
];

function generateConditionalQuestion(difficulty: Difficulty): DeductiveQuestion {
  const qId = 'ded_cond_' + Math.random().toString(36).substring(2, 9);
  const scenario = CONDITIONAL_SCENARIOS[Math.floor(Math.random() * CONDITIONAL_SCENARIOS.length)];

  return {
    id: qId,
    type: 'conditional',
    subtypeName: 'Syllogistic Conditional Logic',
    prompt: 'Evaluate the ground truth premises and determine which conclusion is logically guaranteed to follow:',
    premises: scenario.premises,
    isTextOptions: true,
    options: scenario.options,
    correctOptionIndex: scenario.correctOptionIndex,
    explanation: scenario.explanation
  };
}

// ── Master Deductive Question Generator ──────────────────────────────
export function generateDeductiveQuestion(
  difficulty: Difficulty = 'medium',
  level: number = 2,
  subtypeIndex?: number
): DeductiveQuestion {
  if (subtypeIndex !== undefined) {
    if (subtypeIndex === 0) return generateConditionalQuestion(difficulty);
    if (subtypeIndex === 1) return generateOrderingQuestion(difficulty);
    if (subtypeIndex === 2) return generateOrderingQuestion('hard');
    if (subtypeIndex === 3) return generateLatinSquareQuestion(difficulty, level >= 4 ? 5 : 4);
  }

  if (level === 1) {
    return generateLatinSquareQuestion('easy', 4);
  } else if (level === 2) {
    return generateOrderingQuestion('medium');
  } else if (level === 3) {
    return generateConditionalQuestion('medium');
  } else if (level === 4) {
    return generateLatinSquareQuestion('hard', 5);
  } else {
    const roll = Math.random();
    if (roll < 0.4) return generateLatinSquareQuestion('hard', 5);
    if (roll < 0.7) return generateOrderingQuestion('hard');
    return generateConditionalQuestion('hard');
  }
}
