import { Difficulty } from '../../types';

export interface SwitchItem {
  id: number; // 1, 2, 3, 4
  shape: 'square' | 'triangle' | 'cross' | 'circle' | 'diamond' | 'star' | 'hexagon';
  color: string;
  name: string;
}

export interface SwitchPermutation {
  id: number;
  digits: number[]; // e.g. [2, 3, 4, 1]
  code: string;     // "2341"
}

export type SwitchSubtype = 'rule_switch' | 'task_switch' | 'reverse_rule' | 'dual_rule';

export interface SwitchTask {
  id: string;
  subtype: SwitchSubtype;
  level: number; // 1 to 5
  difficulty: Difficulty;
  isChained: boolean; // Level 4-5 are chained transformations
  inputItems: SwitchItem[];
  
  // Single Layer (Level 1-3)
  candidateSwitches: SwitchPermutation[];
  correctSwitchIndex: number;

  // Reverse Rule Specific
  reverseGivenSwitch?: SwitchPermutation;
  candidateInputs?: SwitchItem[][];
  correctInputIndex?: number;

  // Task Switch Specific
  taskRuleCue?: 'shape' | 'color' | 'count';
  taskRulePrompt?: string;

  // Chained Layer (Level 4-5)
  upperSwitches?: SwitchPermutation[];
  correctUpperIndex?: number;
  intermediateItems?: SwitchItem[];
  lowerSwitches?: SwitchPermutation[];
  correctLowerIndex?: number;

  targetOutput: SwitchItem[];
  explanation: string;
  aiDemoSteps: {
    stepTitle: string;
    focusIndex: number;
    chosenUpperIndex?: number;
    chosenLowerIndex?: number;
    rationale: string;
  }[];
  timeLimitSec: number;
}

// Backward compatibility
export type SwitchPuzzle = SwitchTask;

const PALETTES: { shape: SwitchItem['shape']; color: string; name: string }[][] = [
  // Image 4 palette: Red Square, Yellow Triangle, Blue Cross, Green Circle
  [
    { shape: 'square', color: '#EF4444', name: 'Red Square' },
    { shape: 'triangle', color: '#F59E0B', name: 'Yellow Triangle' },
    { shape: 'cross', color: '#0082E6', name: 'Blue Cross' },
    { shape: 'circle', color: '#10B981', name: 'Green Circle' }
  ],
  // Alternate high-contrast palette
  [
    { shape: 'circle', color: '#8B5CF6', name: 'Purple Circle' },
    { shape: 'triangle', color: '#EC4899', name: 'Pink Triangle' },
    { shape: 'diamond', color: '#F59E0B', name: 'Yellow Diamond' },
    { shape: 'cross', color: '#06B6D4', name: 'Cyan Cross' }
  ]
];

// Position mapping: digits [d1, d2, d3, d4] means output slot i gets input item at index (di - 1)
export function applyPermutation(items: SwitchItem[], digits: number[]): SwitchItem[] {
  return digits.map(d => items[d - 1]);
}

function generateRandomPermutation(): number[] {
  const arr = [1, 2, 3, 4];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  // Guarantee non-identity
  if (arr[0] === 1 && arr[1] === 2 && arr[2] === 3 && arr[3] === 4) {
    return [2, 3, 4, 1];
  }
  return arr;
}

export function generateSwitchPuzzle(
  difficulty: Difficulty = 'medium',
  level: number = 2,
  subtypeIndex: number = 0
): SwitchTask {
  const pId = Math.random().toString(36).substring(2, 9);
  const clampedLevel = Math.max(1, Math.min(5, level));
  const palette = PALETTES[clampedLevel >= 4 ? 1 : 0];

  const inputItems: SwitchItem[] = palette.map((p, idx) => ({
    id: idx + 1,
    shape: p.shape,
    color: p.color,
    name: p.name
  }));

  const subtypes: SwitchSubtype[] = ['rule_switch', 'task_switch', 'reverse_rule', 'dual_rule'];
  // If subtypeIndex is passed explicitly, use it; otherwise map automatically to level
  let subtype: SwitchSubtype = subtypes[subtypeIndex % subtypes.length];
  if (subtypeIndex === 0) {
    if (clampedLevel === 1) subtype = 'rule_switch';
    else if (clampedLevel === 2) subtype = 'rule_switch';
    else if (clampedLevel === 3) subtype = 'reverse_rule';
    else if (clampedLevel === 4) subtype = 'dual_rule';
    else subtype = 'dual_rule';
  }

  // Subtype 1: Task Switch (Dynamic rule switching: Sort by Shape vs Color vs Count)
  if (subtype === 'task_switch') {
    const cues: ('shape' | 'color' | 'count')[] = ['shape', 'color', 'count'];
    const cue = cues[Math.floor(Math.random() * cues.length)];
    const correctDigits = generateRandomPermutation();
    const targetOutput = applyPermutation(inputItems, correctDigits);

    const promptMap = {
      shape: `ACTIVE RULE: Sort by Shape Identity (Order: Square → Triangle → Cross → Circle)`,
      color: `ACTIVE RULE: Sort by Color Spectrum (Order: Red → Yellow → Blue → Green)`,
      count: `ACTIVE RULE: Match Position Progression Shift`
    };

    const candidatesList: number[][] = [correctDigits];
    while (candidatesList.length < 3) {
      const p = generateRandomPermutation();
      if (!candidatesList.some(c => c.join('') === p.join(''))) {
        candidatesList.push(p);
      }
    }
    const shuffled = [...candidatesList].sort(() => Math.random() - 0.5);
    const correctIndex = shuffled.findIndex(c => c.join('') === correctDigits.join(''));
    const candidateSwitches: SwitchPermutation[] = shuffled.map((digits, idx) => ({
      id: idx,
      digits,
      code: digits.join('')
    }));

    return {
      id: pId,
      subtype: 'task_switch',
      level,
      difficulty,
      isChained: false,
      inputItems,
      candidateSwitches,
      correctSwitchIndex: correctIndex,
      taskRuleCue: cue,
      taskRulePrompt: promptMap[cue],
      targetOutput,
      explanation: `Under ${cue.toUpperCase()} rule, transformation operator ${candidateSwitches[correctIndex].code} produces the target sorting.`,
      aiDemoSteps: [
        {
          stepTitle: `Verify ${cue.toUpperCase()} Rule`,
          focusIndex: 0,
          chosenUpperIndex: correctIndex,
          rationale: `Applied current sorting rule (${cue}): Identified operator ${candidateSwitches[correctIndex].code}.`
        }
      ],
      timeLimitSec: 20
    };
  }

  // Subtype 2: Reverse Rule (Given output + switch code, deduce original input sequence)
  if (subtype === 'reverse_rule') {
    const switchDigits = generateRandomPermutation();
    const givenSwitch: SwitchPermutation = { id: 0, digits: switchDigits, code: switchDigits.join('') };
    const targetOutput = applyPermutation(inputItems, switchDigits);

    // Generate distractor input sequences
    const candInputs: SwitchItem[][] = [inputItems];
    while (candInputs.length < 3) {
      const perm = generateRandomPermutation();
      const variant = applyPermutation(inputItems, perm);
      if (!candInputs.some(ci => ci.map(it => it.id).join('') === variant.map(it => it.id).join(''))) {
        candInputs.push(variant);
      }
    }
    const shuffledInputs = [...candInputs].sort(() => Math.random() - 0.5);
    const correctInputIdx = shuffledInputs.findIndex(ci => ci.map(it => it.id).join('') === inputItems.map(it => it.id).join(''));

    return {
      id: pId,
      subtype: 'reverse_rule',
      level,
      difficulty,
      isChained: false,
      inputItems,
      candidateSwitches: [givenSwitch],
      correctSwitchIndex: 0,
      reverseGivenSwitch: givenSwitch,
      candidateInputs: shuffledInputs,
      correctInputIndex: correctInputIdx,
      targetOutput,
      explanation: `Reverse mapping: Given operator ${givenSwitch.code} and the output, input Option #${correctInputIdx + 1} transforms exactly into the target.`,
      aiDemoSteps: [
        {
          stepTitle: 'Invert Transformation Operator',
          focusIndex: 0,
          chosenUpperIndex: correctInputIdx,
          rationale: `Operator ${givenSwitch.code} maps position shifts. Reversing this points uniquely to input candidate #${correctInputIdx + 1}.`
        }
      ],
      timeLimitSec: 25
    };
  }

  // Subtype 3: Dual Rule Funnel (Chained Transformations: Level 4-5) or if requested
  const isChained = subtype === 'dual_rule' || level >= 4;

  if (!isChained) {
    // Standard Rule Switch: Single Layer
    const correctDigits = generateRandomPermutation();
    const targetOutput = applyPermutation(inputItems, correctDigits);

    const candidatesList: number[][] = [correctDigits];
    while (candidatesList.length < 3) {
      const p = generateRandomPermutation();
      if (!candidatesList.some(c => c.join('') === p.join(''))) {
        candidatesList.push(p);
      }
    }

    const shuffled = [...candidatesList].sort(() => Math.random() - 0.5);
    const correctIndex = shuffled.findIndex(c => c.join('') === correctDigits.join(''));

    const candidateSwitches: SwitchPermutation[] = shuffled.map((digits, idx) => ({
      id: idx,
      digits,
      code: digits.join('')
    }));

    const correctCode = candidateSwitches[correctIndex].code;

    return {
      id: pId,
      subtype: 'rule_switch',
      level,
      difficulty,
      isChained: false,
      inputItems,
      candidateSwitches,
      correctSwitchIndex: correctIndex,
      targetOutput,
      explanation: `Switch ${correctCode} moves: Slot 1 gets item ${correctDigits[0]}, Slot 2 gets item ${correctDigits[1]}, Slot 3 gets item ${correctDigits[2]}, Slot 4 gets item ${correctDigits[3]}.`,
      aiDemoSteps: [
        {
          stepTitle: 'Analyze Output Slot 1',
          focusIndex: 0,
          chosenUpperIndex: correctIndex,
          rationale: `Output slot 1 has ${targetOutput[0].name} (Item #${targetOutput[0].id} in input). Therefore switch must start with digit ${targetOutput[0].id}.`
        },
        {
          stepTitle: 'Verify Remaining Positions',
          focusIndex: 1,
          chosenUpperIndex: correctIndex,
          rationale: `Switch ${correctCode} perfectly matches all 4 position shifts.`
        }
      ],
      timeLimitSec: 20
    };
  }

  // Dual Rule Funnel (Chained Upper + Lower)
  const upperDigits = generateRandomPermutation();
  const lowerDigits = generateRandomPermutation();

  const intermediateItems = applyPermutation(inputItems, upperDigits);
  const targetOutput = applyPermutation(intermediateItems, lowerDigits);

  // Upper candidates
  const upperList: number[][] = [upperDigits];
  while (upperList.length < 3) {
    const p = generateRandomPermutation();
    if (!upperList.some(c => c.join('') === p.join(''))) upperList.push(p);
  }
  const shuffledUpper = [...upperList].sort(() => Math.random() - 0.5);
  const correctUpperIndex = shuffledUpper.findIndex(c => c.join('') === upperDigits.join(''));
  const upperSwitches: SwitchPermutation[] = shuffledUpper.map((digits, idx) => ({
    id: idx,
    digits,
    code: digits.join('')
  }));

  // Lower candidates
  const lowerList: number[][] = [lowerDigits];
  while (lowerList.length < 3) {
    const p = generateRandomPermutation();
    if (!lowerList.some(c => c.join('') === p.join(''))) lowerList.push(p);
  }
  const shuffledLower = [...lowerList].sort(() => Math.random() - 0.5);
  const correctLowerIndex = shuffledLower.findIndex(c => c.join('') === lowerDigits.join(''));
  const lowerSwitches: SwitchPermutation[] = shuffledLower.map((digits, idx) => ({
    id: idx,
    digits,
    code: digits.join('')
  }));

  return {
    id: pId,
    subtype: 'dual_rule',
    level,
    difficulty: 'hard',
    isChained: true,
    inputItems,
    candidateSwitches: upperSwitches,
    correctSwitchIndex: correctUpperIndex,
    upperSwitches,
    correctUpperIndex,
    intermediateItems,
    lowerSwitches,
    correctLowerIndex,
    targetOutput,
    explanation: `Dual chained pipeline: Upper switch ${upperSwitches[correctUpperIndex].code} transforms input into intermediate conduit, then Lower switch ${lowerSwitches[correctLowerIndex].code} produces the final output.`,
    aiDemoSteps: [
      {
        stepTitle: 'Analyze Upper Funnel Pipeline',
        focusIndex: 0,
        chosenUpperIndex: correctUpperIndex,
        rationale: `Tracing intermediate ordering through upper switch ${upperSwitches[correctUpperIndex].code}.`
      },
      {
        stepTitle: 'Analyze Lower Funnel Pipeline',
        focusIndex: 1,
        chosenUpperIndex: correctUpperIndex,
        chosenLowerIndex: correctLowerIndex,
        rationale: `Lower switch ${lowerSwitches[correctLowerIndex].code} re-maps the intermediate state into final target output.`
      }
    ],
    timeLimitSec: 25
  };
}
