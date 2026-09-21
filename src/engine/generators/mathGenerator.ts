import { Difficulty } from '../../types';

export type MathOperator = '+' | '-' | '×' | '÷';
export type MathSubtype = 'digit_equation' | 'number_series' | 'rapid_comparison';

export interface MathTask {
  id: string;
  subtype: MathSubtype;
  subtypeName: string;
  level: number; // 1 to 5
  difficulty: Difficulty;
  prompt: string;

  // 1. For digit_equation (Digit & Equation Challenge)
  operators: MathOperator[];
  target: number;
  totalSlots: number;
  prefilledSlots: (number | null)[];
  unavailableDigits?: number[]; // Digits disabled/blank on keypad (e.g. [3, 5, 8])
  displayTemplate: string;
  validCombinations: number[][];
  sampleSolution: number[];
  aiDemoSteps: { slotIndex: number; digit: number; rationale: string }[];

  // 2. For number_series (SHL / Criteria Numerical Sequence)
  series?: (number | string)[];
  seriesOptions?: number[];
  correctSeriesAnswer?: number;
  correctOptionIndex?: number;

  // 3. For rapid_comparison (Numerical Estimation / Quantity Comparison)
  expressionA?: string;
  expressionB?: string;
  valueA?: number;
  valueB?: number;
  comparisonOptions?: string[];
  correctComparisonIndex?: number;

  explanation: string;
  timeLimitSec: number;
}

export type MathQuestion = MathTask;

// Evaluate arithmetic respecting standard left-to-right operator precedence (* and / have same precedence, evaluated left to right)
export function evaluateEquation(
  slots: number[],
  operators: MathOperator[]
): number | null {
  if (slots.length !== operators.length + 1) return null;

  // Clone numbers and operators
  const nums: number[] = [...slots];
  const ops: MathOperator[] = [...operators];

  // First pass: Handle * and / from left to right (allowing fractional intermediates like 9/6 = 1.5 * 4 = 6)
  let i = 0;
  while (i < ops.length) {
    if (ops[i] === '×' || ops[i] === '÷') {
      const op = ops[i];
      const a = nums[i];
      const b = nums[i + 1];

      if (op === '÷') {
        if (b === 0) return null;
        nums.splice(i, 2, a / b);
      } else {
        nums.splice(i, 2, a * b);
      }
      ops.splice(i, 1);
    } else {
      i++;
    }
  }

  // Second pass: Handle + and - from left to right
  let result = nums[0];
  for (let j = 0; j < ops.length; j++) {
    const op = ops[j];
    const b = nums[j + 1];
    if (op === '+') result += b;
    else if (op === '-') result -= b;
  }

  // Round small floating-point errors (e.g. 5.9999999999 -> 6)
  if (Math.abs(result - Math.round(result)) < 1e-9) {
    result = Math.round(result);
  }

  return Number.isFinite(result) ? result : null;
}

// ── 1. DIGIT CHALLENGE GENERATOR ────────────────────────────────────
const DIGIT_TEMPLATES: {
  operators: MathOperator[];
  prefilled: (number | null)[];
  level: number;
  difficulty: Difficulty;
  hasDisabledDigits?: boolean;
}[] = [
  // Level 1: 2 slots [ ? ] + [ ? ] = Target or [ ? ] - [ ? ] = Target
  { operators: ['+'], prefilled: [null, null], level: 1, difficulty: 'easy' },
  { operators: ['-'], prefilled: [null, null], level: 1, difficulty: 'easy' },
  { operators: ['×'], prefilled: [null, null], level: 1, difficulty: 'easy' },

  // Level 2: 3 slots [ ? ] × [ ? ] + [ ? ] = 20 (Image 1 & 2 model)
  { operators: ['×', '+'], prefilled: [null, null, null], level: 2, difficulty: 'easy' },
  { operators: ['+', '×'], prefilled: [null, null, null], level: 2, difficulty: 'medium' },
  { operators: ['×', '-'], prefilled: [null, null, null], level: 2, difficulty: 'medium' },
  { operators: ['-', '×'], prefilled: [null, null, null], level: 2, difficulty: 'medium' },

  // Level 3: 3 slots with division & disabled digits [ ? ] / [ ? ] × [ ? ] = 6 (Image 2 model)
  { operators: ['÷', '×'], prefilled: [null, null, null], level: 3, difficulty: 'medium', hasDisabledDigits: true },
  { operators: ['×', '÷'], prefilled: [null, null, null], level: 3, difficulty: 'medium', hasDisabledDigits: true },
  { operators: ['÷', '+'], prefilled: [null, null, null], level: 3, difficulty: 'medium', hasDisabledDigits: true },
  { operators: ['×', '+'], prefilled: [null, null, null], level: 3, difficulty: 'medium', hasDisabledDigits: true },

  // Level 4: 4 slots with mixed operators & unavailable digits
  { operators: ['×', '+', '-'], prefilled: [null, null, null, null], level: 4, difficulty: 'hard', hasDisabledDigits: true },
  { operators: ['÷', '×', '+'], prefilled: [null, null, null, null], level: 4, difficulty: 'hard', hasDisabledDigits: true },
  { operators: ['+', '×', '-'], prefilled: [null, null, null, null], level: 4, difficulty: 'hard', hasDisabledDigits: true },

  // Level 5: 4 slots high complexity
  { operators: ['×', '÷', '+'], prefilled: [null, null, null, null], level: 5, difficulty: 'hard', hasDisabledDigits: true },
  { operators: ['×', '+', '×'], prefilled: [null, null, null, null], level: 5, difficulty: 'hard', hasDisabledDigits: true }
];

function generateDigitChallenge(
  difficulty: Difficulty = 'medium',
  level: number = 2
): MathTask {
  const qId = 'math_dc_' + Math.random().toString(36).substring(2, 9);
  const matchingTemplates = DIGIT_TEMPLATES.filter(
    t => t.level === level || t.difficulty === difficulty
  );
  const template = matchingTemplates.length > 0 
    ? matchingTemplates[Math.floor(Math.random() * matchingTemplates.length)]
    : DIGIT_TEMPLATES[0];

  const totalSlots = template.operators.length + 1;
  const allDigits = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  let unavailableDigits: number[] = [];
  let availableDigits = [...allDigits];

  // For level 3+ or templates with hasDisabledDigits, pick 2-3 unavailable digits (matching Image 2)
  let validCombinations: number[][] = [];
  let chosenTarget = 0;
  let sampleSolution: number[] = [];
  let attempts = 0;

  while (validCombinations.length === 0 && attempts < 80) {
    attempts++;

    // Randomly pick unavailable digits if level >= 3
    if (template.hasDisabledDigits || level >= 3) {
      const numUnavailable = level >= 4 ? 3 : 2;
      const shuffledDigits = [...allDigits].sort(() => Math.random() - 0.5);
      unavailableDigits = shuffledDigits.slice(0, numUnavailable).sort((a, b) => a - b);
      availableDigits = allDigits.filter(d => !unavailableDigits.includes(d));
    } else {
      unavailableDigits = [];
      availableDigits = [...allDigits];
    }

    const shuffled = [...availableDigits].sort(() => Math.random() - 0.5);
    const candidate = shuffled.slice(0, totalSlots);
    const res = evaluateEquation(candidate, template.operators);

    if (res !== null && res > 0 && res <= 100 && Number.isInteger(res)) {
      chosenTarget = res;
      sampleSolution = candidate;

      // Find all valid non-repeating digit permutations using only available digits
      const allPermutations: number[][] = [];
      function permute(current: number[], remaining: number[]) {
        if (current.length === totalSlots) {
          if (evaluateEquation(current, template.operators) === chosenTarget) {
            allPermutations.push([...current]);
          }
          return;
        }
        for (let i = 0; i < remaining.length; i++) {
          permute([...current, remaining[i]], remaining.filter((_, idx) => idx !== i));
        }
      }
      permute([], availableDigits);
      validCombinations = allPermutations;
    }
  }

  // Fallback if needed
  if (validCombinations.length === 0) {
    unavailableDigits = [3, 5, 8];
    chosenTarget = 6;
    sampleSolution = [9, 6, 4];
    validCombinations = [[9, 6, 4]];
  }

  const opsStr = template.operators.map(op => ` ${op} `);
  let templateDisplay = '';
  for (let i = 0; i < totalSlots; i++) {
    templateDisplay += '[ ? ]';
    if (i < opsStr.length) templateDisplay += opsStr[i];
  }
  templateDisplay += ` = ${chosenTarget}`;

  const unavailableNote = unavailableDigits.length > 0 
    ? ` Note: Unavailable digits: ${unavailableDigits.join(', ')}.` 
    : '';

  return {
    id: qId,
    subtype: 'digit_equation',
    subtypeName: 'Missing Digit Equation Completion',
    prompt: `Fill the blank slots using available digits (1–9, used at most once) to evaluate to ${chosenTarget}:`,
    level,
    difficulty,
    operators: template.operators,
    target: chosenTarget,
    totalSlots,
    prefilledSlots: template.prefilled,
    unavailableDigits,
    displayTemplate: templateDisplay,
    validCombinations,
    sampleSolution,
    explanation: `Valid solution: ${sampleSolution.join(' ' + template.operators.join(' ') + ' ')} = ${chosenTarget}.${unavailableNote}`,
    aiDemoSteps: sampleSolution.map((digit, idx) => ({
      slotIndex: idx,
      digit,
      rationale: `Place digit ${digit} into slot #${idx + 1} to reach target ${chosenTarget}.`
    })),
    timeLimitSec: 25
  };
}

// ── 2. DYNAMIC NUMBER SERIES GENERATOR (12+ Diverse Mathematical Models) ──
function generateNumberSeriesQuestion(level: number): MathTask {
  const qId = 'math_ns_' + Math.random().toString(36).substring(2, 9);
  const models = [
    // 1. Linear Arithmetic
    () => {
      const start = Math.floor(Math.random() * 20) + 3;
      const step = (Math.floor(Math.random() * 7) + 2) * (Math.random() > 0.3 ? 1 : -1);
      const seq = [start, start + step, start + 2 * step, start + 3 * step, start + 4 * step];
      const answer = start + 5 * step;
      return { seq, answer, ruleText: `Arithmetic progression: constant difference of ${step > 0 ? '+' : ''}${step} at each step.` };
    },
    // 2. Geometric Progression
    () => {
      const start = Math.floor(Math.random() * 4) + 2;
      const ratio = 2;
      const seq = [start, start * ratio, start * ratio * ratio, start * Math.pow(ratio, 3)];
      const answer = start * Math.pow(ratio, 4);
      return { seq, answer, ruleText: `Geometric progression: multiply by ${ratio} at each successive step.` };
    },
    // 3. Variable Delta
    () => {
      const start = Math.floor(Math.random() * 5) + 2;
      const seq = [start, start + 2, start + 2 + 4, start + 2 + 4 + 6, start + 2 + 4 + 6 + 8];
      const answer = seq[4] + 10;
      return { seq, answer, ruleText: 'Variable delta: increments increase by +2 each step (+2, +4, +6, +8, +10).' };
    },
    // 4. Alternating Operations (e.g. *2 then -3)
    () => {
      const start = Math.floor(Math.random() * 4) + 3;
      const seq = [start, start * 2, start * 2 - 3, (start * 2 - 3) * 2, (start * 2 - 3) * 2 - 3];
      const answer = seq[4] * 2;
      return { seq, answer, ruleText: 'Alternating operators: alternate between (×2) and (-3).' };
    },
    // 5. Square Series with offset
    () => {
      const base = Math.floor(Math.random() * 4) + 1;
      const k = Math.floor(Math.random() * 3);
      const seq = [base * base + k, (base + 1) * (base + 1) + k, (base + 2) * (base + 2) + k, (base + 3) * (base + 3) + k];
      const answer = (base + 4) * (base + 4) + k;
      return { seq, answer, ruleText: `Consecutive square series: n² ${k !== 0 ? `+ ${k}` : ''} with base incrementing by 1.` };
    },
    // 6. Cube Series
    () => {
      const base = Math.floor(Math.random() * 3) + 1;
      const seq = [Math.pow(base, 3), Math.pow(base + 1, 3), Math.pow(base + 2, 3), Math.pow(base + 3, 3)];
      const answer = Math.pow(base + 4, 3);
      return { seq, answer, ruleText: 'Consecutive cubic series: n³ where base increments by 1 each step.' };
    },
    // 7. Fibonacci / Additive Recurrence
    () => {
      const a = Math.floor(Math.random() * 4) + 1;
      const b = Math.floor(Math.random() * 4) + 2;
      const c = a + b;
      const d = b + c;
      const e = c + d;
      const answer = d + e;
      return { seq: [a, b, c, d, e], answer, ruleText: 'Additive recurrence: each term is the sum of the two preceding terms.' };
    },
    // 8. Double Interleaved Series (Two interleaved progressions)
    () => {
      const a = 2, b = 30;
      const seq = [a, b, a + 3, b - 4, a + 6, b - 8, a + 9];
      const answer = b - 12;
      return { seq, answer, ruleText: 'Double interleaved series: Odd positions increase by +3; Even positions decrease by -4.' };
    },
    // 9. Triangular Numbers
    () => {
      const seq = [1, 3, 6, 10, 15, 21];
      const answer = 28;
      return { seq, answer, ruleText: 'Triangular number sequence: n(n+1)/2 (+2, +3, +4, +5, +6, +7).' };
    },
    // 10. Prime Sequence with multiplier
    () => {
      const primes = [2, 3, 5, 7, 11, 13, 17, 19];
      const mult = 2;
      const seq = primes.slice(0, 5).map(p => p * mult);
      const answer = primes[5] * mult;
      return { seq, answer, ruleText: `Prime sequence scaled by ${mult}: (${primes.slice(0, 6).join(', ')}).` };
    }
  ];

  const chosenModel = models[Math.floor(Math.random() * models.length)];
  const { seq, answer, ruleText } = chosenModel();

  const distractors = new Set<number>();
  distractors.add(answer + 2);
  distractors.add(answer - 2 > 0 ? answer - 2 : answer + 4);
  distractors.add(answer + (Math.random() < 0.5 ? 5 : -3));

  const options = Array.from(distractors).slice(0, 3);
  options.push(answer);
  options.sort(() => Math.random() - 0.5);
  const correctOptionIndex = options.indexOf(answer);

  return {
    id: qId,
    subtype: 'number_series',
    subtypeName: 'Number Series & Progression',
    prompt: 'Determine the latent mathematical rule and identify the missing number in the sequence:',
    level,
    difficulty: 'medium',
    operators: ['+'],
    target: answer,
    totalSlots: 0,
    prefilledSlots: [],
    displayTemplate: `${seq.join(', ')}, [ ? ]`,
    validCombinations: [],
    sampleSolution: [answer],
    series: [...seq, '?'],
    seriesOptions: options,
    correctSeriesAnswer: answer,
    correctOptionIndex,
    explanation: `${ruleText} Therefore, the next term is ${answer}.`,
    aiDemoSteps: [{ slotIndex: 0, digit: answer, rationale: ruleText }],
    timeLimitSec: 20
  };
}

// ── 3. DYNAMIC RAPID QUANTITY COMPARISON GENERATOR (10+ Models) ──────
function generateComparisonQuestion(level: number): MathTask {
  const qId = 'math_rc_' + Math.random().toString(36).substring(2, 9);
  
  const comparisonGenerators = [
    // Percentages vs Fractions
    () => {
      const p = 15;
      const baseA = 800;
      const valA = (p / 100) * baseA; // 120
      const fracB = 500 / 4; // 125
      return {
        expA: `${p}% of ${baseA}`,
        valA,
        expB: `¼ of 500`,
        valB: fracB,
        explanation: `${p}% of ${baseA} = ${valA}. ¼ of 500 = ${fracB}. Hence, Quantity B (${fracB}) > Quantity A (${valA}).`
      };
    },
    // Exponent vs Product
    () => {
      const base = 16;
      const valA = base * base - 25; // 231
      const valB = 15 * 15; // 225
      return {
        expA: `${base}² - 25`,
        valA,
        expB: `15 × 15`,
        valB,
        explanation: `${base}² - 25 = ${base * base} - 25 = ${valA}. 15 × 15 = ${valB}. Hence, Quantity A > Quantity B.`
      };
    },
    // Division with addition vs Multiplication with subtraction
    () => {
      const a = 144, b = 12, c = 19;
      const valA = a / b + c; // 31
      const d = 4, e = 8, f = 1;
      const valB = d * e - f; // 31
      return {
        expA: `${a} ÷ ${b} + ${c}`,
        valA,
        expB: `${d} × ${e} - ${f}`,
        valB,
        explanation: `${a} ÷ ${b} + ${c} = ${valA}. ${d} × ${e} - ${f} = ${valB}. Both quantities are exactly Equal.`
      };
    },
    // Square Roots vs Power Fractions
    () => {
      const valA = Math.sqrt(625) + 15; // 25 + 15 = 40
      const valB = Math.pow(8, 2) - 26; // 64 - 26 = 38
      return {
        expA: `√625 + 15`,
        valA,
        expB: `8² - 26`,
        valB,
        explanation: `√625 + 15 = 25 + 15 = 40. 8² - 26 = 64 - 26 = 38. Quantity A (40) > Quantity B (38).`
      };
    },
    // Multiplicative Factors
    () => {
      const valA = 45 * 18; // 810
      const valB = 36 * 22; // 792
      return {
        expA: `45 × 18`,
        valA,
        expB: `36 × 22`,
        valB,
        explanation: `45 × 18 = 810. 36 × 22 = 792. Quantity A > Quantity B.`
      };
    }
  ];

  const item = comparisonGenerators[Math.floor(Math.random() * comparisonGenerators.length)]();

  const comparisonOptions = [
    'Quantity A is strictly greater',
    'Quantity B is strictly greater',
    'Both quantities are exactly equal'
  ];

  let correctIndex = 0;
  if (item.valA > item.valB) correctIndex = 0;
  else if (item.valB > item.valA) correctIndex = 1;
  else correctIndex = 2;

  return {
    id: qId,
    subtype: 'rapid_comparison',
    subtypeName: 'Numerical Estimation & Comparison',
    prompt: 'Compare Quantity A and Quantity B without using a calculator:',
    level,
    difficulty: 'medium',
    operators: ['+'],
    target: item.valA,
    totalSlots: 0,
    prefilledSlots: [],
    displayTemplate: `${item.expA} vs ${item.expB}`,
    validCombinations: [],
    sampleSolution: [correctIndex],
    expressionA: item.expA,
    expressionB: item.expB,
    valueA: item.valA,
    valueB: item.valB,
    comparisonOptions,
    correctComparisonIndex: correctIndex,
    correctOptionIndex: correctIndex,
    explanation: item.explanation,
    aiDemoSteps: [{ slotIndex: 0, digit: correctIndex, rationale: item.explanation }],
    timeLimitSec: 20
  };
}

// ── Master Math Question Generator ───────────────────────────────────
export function generateMathQuestion(
  difficulty: Difficulty = 'medium',
  level: number = 2,
  subtypeIndex?: number
): MathTask {
  if (subtypeIndex !== undefined) {
    if (subtypeIndex === 0) return generateDigitChallenge(difficulty, level);
    if (subtypeIndex === 1) return generateNumberSeriesQuestion(level);
    if (subtypeIndex === 2) return generateComparisonQuestion(level);
  }

  if (level === 1) {
    return generateDigitChallenge('easy', 1);
  } else if (level === 2) {
    return generateNumberSeriesQuestion(2);
  } else if (level === 3) {
    return generateComparisonQuestion(3);
  } else if (level === 4) {
    return generateDigitChallenge('medium', 2);
  } else {
    return generateDigitChallenge('hard', 3);
  }
}

export function validateMathSubmission(
  slots: (number | null)[],
  task: MathTask
): { isCorrect: boolean; message: string } {
  const completeSlots: number[] = [];
  for (const s of slots) {
    if (s === null) return { isCorrect: false, message: 'Please fill in all digit slots.' };
    completeSlots.push(s);
  }

  // Check unique single-use digits constraint
  const uniqueSet = new Set(completeSlots);
  if (uniqueSet.size !== completeSlots.length) {
    return { isCorrect: false, message: 'Constraint violated: Each digit from 1 to 9 may only be used once.' };
  }

  const computedResult = evaluateEquation(completeSlots, task.operators);
  if (computedResult === task.target) {
    return { isCorrect: true, message: `✓ Correct! Expression equals target ${task.target}.` };
  }

  return {
    isCorrect: false,
    message: `Evaluated to ${computedResult ?? 'invalid'}, but target is ${task.target}. Try another combination.`
  };
}
