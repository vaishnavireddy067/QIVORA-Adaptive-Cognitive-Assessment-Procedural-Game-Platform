import { Difficulty } from '../../types';

export type InductiveChallengeType =
  | 'same_rule_pairs'
  | 'odd_one_out'
  | 'sequence'
  | 'transformation'
  | 'analogy'
  | 'classification'
  | 'scales_clx';

export type ShapeSymbol = 'circle' | 'square' | 'triangle' | 'cross' | 'star' | 'diamond' | 'hexagon' | 'parallelogram';
export type ColorName = 'purple' | 'green' | 'red' | 'blue' | 'orange' | 'black' | 'gray';

export interface GridCell {
  shape: ShapeSymbol;
  color: string;
  fill?: 'solid' | 'outline';
}

export type SmallGrid = (GridCell | null)[][];

export interface SequenceItem {
  shape: ShapeSymbol;
  color: string;
  count: number;
  rotation: number;
  scale?: 'small' | 'medium' | 'large';
  fill?: 'solid' | 'outline';
  label?: string;
  // Specific data for 9-card odd one out models
  brokenLineIndex?: number; // 0 to 4 (which of the 5 horizontal lines is broken)
  dualShapes?: {
    filled: { shape: ShapeSymbol; x: number; y: number; size: number };
    outline: { shape: ShapeSymbol; x: number; y: number; size: number };
    isOverlapping: boolean;
  };
  plusGrid?: boolean[][]; // 3x3 matrix of plus signs
}

export interface InductiveQuestion {
  id: string;
  challengeType: InductiveChallengeType;
  prompt: string;
  subRuleLabel: string;
  ruleExplanation: string;

  // 0. SPACIO "THE SAME RULE" PAIRS (Image 1 Pattern)
  sameRulePairsData?: {
    exampleGrids: SmallGrid[]; // 2 grids following the rule
    candidateGroups: { grids: SmallGrid[]; label: string; isCorrect: boolean }[]; // Candidate groups of 2 grids each
    correctGroupIndex: number;
    ruleText: string;
  };

  // 1. ODD ONE OUT 9-CARD PATTERN ("Doesn't fit the rule" - Images 1, 2, 3)
  nineCards?: SequenceItem[];
  oddCardIndex?: number; // 0 to 8 (Card 1 to 9)

  // 2. SEQUENCE & TRANSFORMATION PROGRESSION (A -> B -> C -> ?)
  sequenceItems?: SequenceItem[];
  sequenceOptions?: SequenceItem[];
  correctOptionIndex?: number;

  // 3. VISUAL ANALOGY (A : B :: C : ?)
  analogyData?: {
    itemA: SequenceItem;
    itemB: SequenceItem;
    itemC: SequenceItem;
    options: SequenceItem[];
    correctOptionIndex: number;
    relationRule: string;
  };

  // 4. STRUCTURAL CLASSIFICATION (Pick 1 of 4 or Pick 2 of 4)
  exampleGrids?: SmallGrid[];
  candidateGrids?: SmallGrid[];
  correctIndices?: number[];
  requiredPickCount?: number; // 1 or 2

  // 5. AON SCALES CLX (Set A vs Set B Rule Assignment)
  scalesClxData?: {
    setAExamples: SmallGrid[];
    setBExamples: SmallGrid[];
    targetGrid: SmallGrid;
    correctSet: 'Set A' | 'Set B' | 'Neither';
    ruleA: string;
    ruleB: string;
  };
}

const COLOR_MAP: Record<ColorName, string> = {
  purple: '#7C3AED',
  green: '#16A34A',
  red: '#DC2626',
  blue: '#2563EB',
  orange: '#EA580C',
  black: '#1E293B',
  gray: '#64748B',
};

const SHAPES: ShapeSymbol[] = ['circle', 'square', 'triangle', 'cross', 'star', 'diamond'];
const COLORS: ColorName[] = ['purple', 'green', 'red', 'blue', 'orange'];

function randOf<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function makeCell(shape: ShapeSymbol, color: ColorName): GridCell {
  return { shape, color: COLOR_MAP[color] };
}

// ─────────────────────────────────────────────────────────────────
// 1. DYNAMIC SEQUENCE DISCOVERY (Multi-Pattern Engine with 8+ Models)
// ─────────────────────────────────────────────────────────────────
function generateSequenceTask(difficulty: Difficulty, level: number = 1): InductiveQuestion {
  const qId = 'ind_seq_' + Math.random().toString(36).substring(2, 9);
  
  // 8 distinct mathematical & geometric sequence models
  const patternType = Math.floor(Math.random() * 8);
  const baseShape = randOf(SHAPES);
  const baseColor = randOf(COLORS);
  const altColor = randOf(COLORS.filter(c => c !== baseColor));
  const altShape = randOf(SHAPES.filter(s => s !== baseShape));

  let sequenceItems: SequenceItem[] = [];
  let correctItem: SequenceItem;
  let ruleExplanation = '';

  if (patternType === 0) {
    // Model 1: Progressive Count & 90° clockwise rotation
    const stepCount = 3;
    for (let i = 0; i < stepCount; i++) {
      sequenceItems.push({
        shape: baseShape,
        color: COLOR_MAP[baseColor],
        count: i + 1,
        rotation: (i * 90) % 360,
        scale: 'medium'
      });
    }
    correctItem = {
      shape: baseShape,
      color: COLOR_MAP[baseColor],
      count: stepCount + 1,
      rotation: (stepCount * 90) % 360,
      scale: 'medium'
    };
    ruleExplanation = `Progressive Rule: Shape is ${baseShape.toUpperCase()}. Count increments by +1 (1 → 2 → 3 → 4) while rotating clockwise by +90° each step.`;
  } else if (patternType === 1) {
    // Model 2: Color Alternation & 45° Rotation Steps
    for (let i = 0; i < 3; i++) {
      sequenceItems.push({
        shape: baseShape,
        color: i % 2 === 0 ? COLOR_MAP[baseColor] : COLOR_MAP[altColor],
        count: 2,
        rotation: i * 45,
        scale: 'medium'
      });
    }
    correctItem = {
      shape: baseShape,
      color: COLOR_MAP[altColor],
      count: 2,
      rotation: 135,
      scale: 'medium'
    };
    ruleExplanation = `Alternating Rule: Color alternates (${baseColor} ↔ ${altColor}), count remains 2, rotation steps clockwise by +45° (0° → 45° → 90° → 135°).`;
  } else if (patternType === 2) {
    // Model 3: Shape Cycling with Progressive Scale
    const shapeCycle: ShapeSymbol[] = ['circle', 'square', 'triangle', 'star'];
    for (let i = 0; i < 3; i++) {
      sequenceItems.push({
        shape: shapeCycle[i],
        color: COLOR_MAP[baseColor],
        count: 1,
        rotation: 0,
        scale: i === 0 ? 'small' : i === 1 ? 'medium' : 'large'
      });
    }
    correctItem = {
      shape: shapeCycle[3],
      color: COLOR_MAP[baseColor],
      count: 1,
      rotation: 0,
      scale: 'large'
    };
    ruleExplanation = 'Geometric Cycle: Shapes cycle in fixed order (Circle → Square → Triangle → Star) while size expands from Small to Large.';
  } else if (patternType === 3) {
    // Model 4: Multiplicative Element Count (Doubling) with 180° Inversion
    for (let i = 0; i < 3; i++) {
      sequenceItems.push({
        shape: baseShape,
        color: COLOR_MAP[baseColor],
        count: Math.pow(2, i),
        rotation: (i * 180) % 360,
        scale: 'medium'
      });
    }
    correctItem = {
      shape: baseShape,
      color: COLOR_MAP[baseColor],
      count: 8,
      rotation: (3 * 180) % 360,
      scale: 'medium'
    };
    ruleExplanation = 'Geometric Doubling: Element count doubles at each interval (1 → 2 → 4 → 8) with an alternating 180° vertical inversion.';
  } else if (patternType === 4) {
    // Model 5: Fibonacci Count Progression
    const fib = [1, 2, 3, 5];
    for (let i = 0; i < 3; i++) {
      sequenceItems.push({
        shape: altShape,
        color: COLOR_MAP[baseColor],
        count: fib[i],
        rotation: i * 30,
        scale: 'medium'
      });
    }
    correctItem = {
      shape: altShape,
      color: COLOR_MAP[baseColor],
      count: 5,
      rotation: 90,
      scale: 'medium'
    };
    ruleExplanation = 'Fibonacci Accumulation: Item count follows the sequence 1 → 2 → 3 → 5 (each count is sum of prior two), with +30° angular drift.';
  } else if (patternType === 5) {
    // Model 6: Shape + Color Dual Alternation
    for (let i = 0; i < 3; i++) {
      sequenceItems.push({
        shape: i % 2 === 0 ? baseShape : altShape,
        color: i % 2 === 0 ? COLOR_MAP[baseColor] : COLOR_MAP[altColor],
        count: i === 1 ? 2 : 1,
        rotation: (i * 90) % 360,
        scale: 'medium'
      });
    }
    correctItem = {
      shape: altShape,
      color: COLOR_MAP[altColor],
      count: 2,
      rotation: 270,
      scale: 'medium'
    };
    ruleExplanation = `Dual Toggle: Even steps are (${baseShape}, ${baseColor}, count 1), odd steps are (${altShape}, ${altColor}, count 2), with +90° rotation.`;
  } else if (patternType === 6) {
    // Model 7: Polygon Vertices Step (Triangle 3 -> Square 4 -> Diamond 4 -> Star 5)
    const polygonStep: ShapeSymbol[] = ['triangle', 'square', 'cross', 'star'];
    for (let i = 0; i < 3; i++) {
      sequenceItems.push({
        shape: polygonStep[i],
        color: COLOR_MAP[baseColor],
        count: 1,
        rotation: (i * 45) % 360,
        scale: 'medium'
      });
    }
    correctItem = {
      shape: polygonStep[3],
      color: COLOR_MAP[baseColor],
      count: 1,
      rotation: 135,
      scale: 'medium'
    };
    ruleExplanation = 'Vertex Complexity Step: Geometric complexity expands from Triangle (3) → Square (4) → Cross (4) → Star (5) with +45° rotation.';
  } else {
    // Model 8: Count Decrement & Color Inversion
    for (let i = 0; i < 3; i++) {
      sequenceItems.push({
        shape: baseShape,
        color: COLOR_MAP[COLORS[i % COLORS.length]],
        count: 4 - i,
        rotation: 0,
        scale: 'medium'
      });
    }
    correctItem = {
      shape: baseShape,
      color: COLOR_MAP[COLORS[3 % COLORS.length]],
      count: 1,
      rotation: 0,
      scale: 'medium'
    };
    ruleExplanation = 'Countdown Shift: Element count reduces linearly (4 → 3 → 2 → 1) while color shifts along the palette spectrum.';
  }

  const distractors: SequenceItem[] = [
    { ...correctItem, count: Math.max(1, correctItem.count === 1 ? 3 : correctItem.count - 1) },
    { ...correctItem, rotation: (correctItem.rotation + 90) % 360 },
    { ...correctItem, shape: randOf(SHAPES.filter(s => s !== correctItem.shape)) },
    { ...correctItem, color: COLOR_MAP[randOf(COLORS.filter(c => COLOR_MAP[c] !== correctItem.color))] }
  ];

  const options = [correctItem, ...distractors.slice(0, 3)].sort(() => Math.random() - 0.5);
  const correctIdx = options.findIndex(
    o => o.shape === correctItem.shape && o.count === correctItem.count && o.rotation === correctItem.rotation && o.color === correctItem.color
  );

  return {
    id: qId,
    challengeType: 'sequence',
    prompt: 'What comes next in the sequence?',
    subRuleLabel: 'Geometric Sequence Discovery',
    ruleExplanation,
    sequenceItems,
    sequenceOptions: options,
    correctOptionIndex: correctIdx
  };
}

// ─────────────────────────────────────────────────────────────────
// 2. TRANSFORMATION DISCOVERY (Multi-Attribute State Transitions)
// ─────────────────────────────────────────────────────────────────
function generateTransformationTask(difficulty: Difficulty, level: number = 1): InductiveQuestion {
  const qId = 'ind_tr_' + Math.random().toString(36).substring(2, 9);
  const shapeA = randOf(['circle', 'square', 'diamond'] as ShapeSymbol[]);
  const shapeB = randOf(['triangle', 'star', 'cross'] as ShapeSymbol[]);
  const color1 = randOf(['purple', 'blue'] as ColorName[]);
  const color2 = randOf(['green', 'red', 'orange'] as ColorName[]);

  const modelIdx = Math.floor(Math.random() * 3);
  let sequenceItems: SequenceItem[] = [];
  let correctItem: SequenceItem;
  let ruleExplanation = '';

  if (modelIdx === 0) {
    sequenceItems = [
      { shape: shapeA, color: COLOR_MAP[color1], count: 1, rotation: 0, scale: 'small' },
      { shape: shapeB, color: COLOR_MAP[color1], count: 2, rotation: 45, scale: 'medium' },
      { shape: shapeA, color: COLOR_MAP[color2], count: 3, rotation: 90, scale: 'large' }
    ];
    correctItem = {
      shape: shapeB,
      color: COLOR_MAP[color2],
      count: 4,
      rotation: 135,
      scale: 'large'
    };
    ruleExplanation = `Multi-Attribute Rules: 1) Shape alternates (${shapeA.toUpperCase()} ↔ ${shapeB.toUpperCase()}). 2) Color shifts from ${color1} to ${color2} after step 2. 3) Count increments linearly (1 → 2 → 3 → 4). 4) Rotation advances by +45°.`;
  } else if (modelIdx === 1) {
    sequenceItems = [
      { shape: shapeA, color: COLOR_MAP[color1], count: 4, rotation: 0, scale: 'large' },
      { shape: shapeA, color: COLOR_MAP[color2], count: 3, rotation: 90, scale: 'medium' },
      { shape: shapeA, color: COLOR_MAP[color1], count: 2, rotation: 180, scale: 'small' }
    ];
    correctItem = {
      shape: shapeA,
      color: COLOR_MAP[color2],
      count: 1,
      rotation: 270,
      scale: 'small'
    };
    ruleExplanation = `Inverse Reduction: Count decreases (4 → 3 → 2 → 1), rotation advances +90°, color toggles (${color1} ↔ ${color2}), and scale reduces.`;
  } else {
    sequenceItems = [
      { shape: shapeA, color: COLOR_MAP[color1], count: 1, rotation: 0, scale: 'medium' },
      { shape: shapeB, color: COLOR_MAP[color2], count: 2, rotation: 60, scale: 'medium' },
      { shape: shapeA, color: COLOR_MAP[color1], count: 3, rotation: 120, scale: 'medium' }
    ];
    correctItem = {
      shape: shapeB,
      color: COLOR_MAP[color2],
      count: 4,
      rotation: 180,
      scale: 'medium'
    };
    ruleExplanation = `Interleaved Pairing: Odd steps are ${shapeA} (${color1}), even steps are ${shapeB} (${color2}), count is +1 per step, angle steps +60°.`;
  }

  const distractors: SequenceItem[] = [
    { shape: correctItem.shape === shapeA ? shapeB : shapeA, color: correctItem.color, count: correctItem.count, rotation: correctItem.rotation, scale: correctItem.scale },
    { shape: correctItem.shape, color: COLOR_MAP[color1 === color2 ? 'purple' : color1], count: correctItem.count, rotation: correctItem.rotation, scale: correctItem.scale },
    { shape: correctItem.shape, color: correctItem.color, count: Math.max(1, correctItem.count - 1), rotation: (correctItem.rotation + 90) % 360, scale: correctItem.scale }
  ];

  const options = [correctItem, ...distractors].sort(() => Math.random() - 0.5);
  const correctIdx = options.findIndex(
    o => o.shape === correctItem.shape && o.color === correctItem.color && o.count === correctItem.count && o.rotation === correctItem.rotation
  );

  return {
    id: qId,
    challengeType: 'transformation',
    prompt: 'Identify the transformation rule and select the missing state:',
    subRuleLabel: 'Multi-Attribute State Transition',
    ruleExplanation,
    sequenceItems,
    sequenceOptions: options,
    correctOptionIndex: correctIdx
  };
}

// ─────────────────────────────────────────────────────────────────
// 3. VISUAL ANALOGY (A : B :: C : ?) (8 Distinct Model Templates)
// ─────────────────────────────────────────────────────────────────
function generateAnalogyTask(difficulty: Difficulty, level: number = 1): InductiveQuestion {
  const qId = 'ind_ana_' + Math.random().toString(36).substring(2, 9);
  
  const cA = randOf(['blue', 'purple'] as ColorName[]);
  const cB = randOf(['red', 'green', 'orange'] as ColorName[]);
  const sA = randOf(['square', 'circle', 'diamond'] as ShapeSymbol[]);
  const sB = randOf(['triangle', 'star', 'cross'] as ShapeSymbol[]);

  const analogyTemplates = [
    // Template 1: Color Inversion + Count Tripling + 90° Rotation
    () => ({
      itemA: { shape: sA, color: COLOR_MAP[cA], count: 1, rotation: 0, scale: 'small' as const },
      itemB: { shape: sA, color: COLOR_MAP[cB], count: 3, rotation: 90, scale: 'large' as const },
      itemC: { shape: sB, color: COLOR_MAP[cA], count: 1, rotation: 0, scale: 'small' as const },
      correctItem: { shape: sB, color: COLOR_MAP[cB], count: 3, rotation: 90, scale: 'large' as const },
      rule: `${cA.toUpperCase()} changes to ${cB.toUpperCase()}, count triples (1 → 3), scale enlarges, and item rotates +90°.`
    }),
    // Template 2: 180° Flip + Count Doubling
    () => ({
      itemA: { shape: 'triangle' as ShapeSymbol, color: COLOR_MAP[cA], count: 2, rotation: 0, scale: 'medium' as const },
      itemB: { shape: 'triangle' as ShapeSymbol, color: COLOR_MAP[cB], count: 4, rotation: 180, scale: 'medium' as const },
      itemC: { shape: 'diamond' as ShapeSymbol, color: COLOR_MAP[cA], count: 2, rotation: 0, scale: 'medium' as const },
      correctItem: { shape: 'diamond' as ShapeSymbol, color: COLOR_MAP[cB], count: 4, rotation: 180, scale: 'medium' as const },
      rule: `Color shifts to ${cB.toUpperCase()}, count doubles from 2 to 4, and elements invert 180°.`
    }),
    // Template 3: Shape Morphing to Next Higher Poly (Circle -> Square; Triangle -> Star)
    () => ({
      itemA: { shape: 'circle' as ShapeSymbol, color: COLOR_MAP[cA], count: 2, rotation: 0, scale: 'small' as const },
      itemB: { shape: 'square' as ShapeSymbol, color: COLOR_MAP[cA], count: 2, rotation: 45, scale: 'large' as const },
      itemC: { shape: 'triangle' as ShapeSymbol, color: COLOR_MAP[cB], count: 2, rotation: 0, scale: 'small' as const },
      correctItem: { shape: 'star' as ShapeSymbol, color: COLOR_MAP[cB], count: 2, rotation: 45, scale: 'large' as const },
      rule: 'Shape increments vertex complexity, scale enlarges, and element rotates by 45°.'
    }),
    // Template 4: Count Halving + Color Complement
    () => ({
      itemA: { shape: 'cross' as ShapeSymbol, color: COLOR_MAP['red'], count: 4, rotation: 45, scale: 'large' as const },
      itemB: { shape: 'cross' as ShapeSymbol, color: COLOR_MAP['green'], count: 2, rotation: 0, scale: 'small' as const },
      itemC: { shape: 'star' as ShapeSymbol, color: COLOR_MAP['red'], count: 4, rotation: 45, scale: 'large' as const },
      correctItem: { shape: 'star' as ShapeSymbol, color: COLOR_MAP['green'], count: 2, rotation: 0, scale: 'small' as const },
      rule: 'Red becomes Green, count is halved (4 → 2), rotation subtracts 45°, and scale contracts.'
    })
  ];

  const selectedAnalogy = analogyTemplates[Math.floor(Math.random() * analogyTemplates.length)]();

  const distractors: SequenceItem[] = [
    { ...selectedAnalogy.correctItem, count: selectedAnalogy.correctItem.count === 2 ? 1 : 2 },
    { ...selectedAnalogy.correctItem, color: COLOR_MAP[cA] },
    { ...selectedAnalogy.correctItem, rotation: (selectedAnalogy.correctItem.rotation + 90) % 360 }
  ];

  const options = [selectedAnalogy.correctItem, ...distractors].sort(() => Math.random() - 0.5);
  const correctIdx = options.indexOf(selectedAnalogy.correctItem);

  return {
    id: qId,
    challengeType: 'analogy',
    prompt: 'Figure A is to Figure B as Figure C is to which option?',
    subRuleLabel: 'Visual Geometric Analogy (A : B :: C : ?)',
    ruleExplanation: `Analogy Mapping: ${selectedAnalogy.rule}`,
    analogyData: {
      itemA: selectedAnalogy.itemA,
      itemB: selectedAnalogy.itemB,
      itemC: selectedAnalogy.itemC,
      options,
      correctOptionIndex: correctIdx,
      relationRule: selectedAnalogy.rule
    }
  };
}

// ─────────────────────────────────────────────────────────────────
// 4. AON SCALES CLX (8 Dynamic Rule Discovery Models)
// ─────────────────────────────────────────────────────────────────
function generateScalesClxTask(difficulty: Difficulty, level: number = 1): InductiveQuestion {
  const qId = 'ind_clx_' + Math.random().toString(36).substring(2, 9);
  const ruleType = Math.floor(Math.random() * 6);

  let setAExamples: SmallGrid[];
  let setBExamples: SmallGrid[];
  let targetGrid: SmallGrid;
  let correctSet: 'Set A' | 'Set B' | 'Neither';
  let ruleA = '';
  let ruleB = '';

  const makeGrid = (cells: { r: number; c: number; shape: ShapeSymbol; color: ColorName }[]): SmallGrid => {
    const grid: SmallGrid = [
      [null, null, null],
      [null, null, null],
      [null, null, null]
    ];
    cells.forEach(c => {
      grid[c.r][c.c] = makeCell(c.shape, c.color);
    });
    return grid;
  };

  if (ruleType === 0) {
    // Model 1: Even Count vs Odd Count
    setAExamples = [
      makeGrid([{ r: 0, c: 0, shape: 'circle', color: 'blue' }, { r: 2, c: 2, shape: 'circle', color: 'blue' }]),
      makeGrid([{ r: 0, c: 1, shape: 'circle', color: 'blue' }, { r: 1, c: 1, shape: 'circle', color: 'blue' }, { r: 2, c: 0, shape: 'circle', color: 'blue' }, { r: 2, c: 2, shape: 'circle', color: 'blue' }]),
      makeGrid([{ r: 1, c: 0, shape: 'circle', color: 'blue' }, { r: 1, c: 2, shape: 'circle', color: 'blue' }])
    ];
    setBExamples = [
      makeGrid([{ r: 1, c: 1, shape: 'circle', color: 'blue' }]),
      makeGrid([{ r: 0, c: 0, shape: 'circle', color: 'blue' }, { r: 1, c: 1, shape: 'circle', color: 'blue' }, { r: 2, c: 2, shape: 'circle', color: 'blue' }]),
      makeGrid([{ r: 0, c: 2, shape: 'circle', color: 'blue' }])
    ];
    const targetIsA = Math.random() > 0.5;
    targetGrid = targetIsA
      ? makeGrid([{ r: 0, c: 0, shape: 'circle', color: 'blue' }, { r: 0, c: 2, shape: 'circle', color: 'blue' }])
      : makeGrid([{ r: 0, c: 1, shape: 'circle', color: 'blue' }, { r: 1, c: 1, shape: 'circle', color: 'blue' }, { r: 2, c: 1, shape: 'circle', color: 'blue' }]);
    correctSet = targetIsA ? 'Set A' : 'Set B';
    ruleA = 'Contains an EVEN number of blue circles (2 or 4)';
    ruleB = 'Contains an ODD number of blue circles (1 or 3)';
  } else if (ruleType === 1) {
    // Model 2: Diagonal Alignment vs Horizontal Row Alignment
    setAExamples = [
      makeGrid([{ r: 0, c: 0, shape: 'square', color: 'red' }, { r: 1, c: 1, shape: 'square', color: 'red' }, { r: 2, c: 2, shape: 'square', color: 'red' }]),
      makeGrid([{ r: 0, c: 2, shape: 'triangle', color: 'green' }, { r: 1, c: 1, shape: 'triangle', color: 'green' }, { r: 2, c: 0, shape: 'triangle', color: 'green' }]),
      makeGrid([{ r: 0, c: 0, shape: 'diamond', color: 'purple' }, { r: 2, c: 2, shape: 'diamond', color: 'purple' }])
    ];
    setBExamples = [
      makeGrid([{ r: 0, c: 0, shape: 'square', color: 'red' }, { r: 0, c: 1, shape: 'square', color: 'red' }, { r: 0, c: 2, shape: 'square', color: 'red' }]),
      makeGrid([{ r: 2, c: 0, shape: 'triangle', color: 'green' }, { r: 2, c: 1, shape: 'triangle', color: 'green' }, { r: 2, c: 2, shape: 'triangle', color: 'green' }]),
      makeGrid([{ r: 1, c: 0, shape: 'diamond', color: 'purple' }, { r: 1, c: 2, shape: 'diamond', color: 'purple' }])
    ];
    const targetIsA = Math.random() > 0.5;
    targetGrid = targetIsA
      ? makeGrid([{ r: 0, c: 0, shape: 'star', color: 'blue' }, { r: 1, c: 1, shape: 'star', color: 'blue' }])
      : makeGrid([{ r: 1, c: 0, shape: 'star', color: 'blue' }, { r: 1, c: 1, shape: 'star', color: 'blue' }, { r: 1, c: 2, shape: 'star', color: 'blue' }]);
    correctSet = targetIsA ? 'Set A' : 'Set B';
    ruleA = 'Elements strictly align along a diagonal';
    ruleB = 'Elements strictly align along a horizontal row';
  } else if (ruleType === 2) {
    // Model 3: Single Color Monotone vs Dual Color Mixed
    setAExamples = [
      makeGrid([{ r: 0, c: 0, shape: 'circle', color: 'purple' }, { r: 1, c: 1, shape: 'square', color: 'purple' }]),
      makeGrid([{ r: 0, c: 2, shape: 'triangle', color: 'green' }, { r: 2, c: 0, shape: 'diamond', color: 'green' }]),
      makeGrid([{ r: 1, c: 0, shape: 'star', color: 'red' }, { r: 1, c: 2, shape: 'circle', color: 'red' }])
    ];
    setBExamples = [
      makeGrid([{ r: 0, c: 0, shape: 'circle', color: 'purple' }, { r: 1, c: 1, shape: 'square', color: 'green' }]),
      makeGrid([{ r: 0, c: 2, shape: 'triangle', color: 'red' }, { r: 2, c: 0, shape: 'diamond', color: 'blue' }]),
      makeGrid([{ r: 1, c: 0, shape: 'star', color: 'orange' }, { r: 1, c: 2, shape: 'circle', color: 'purple' }])
    ];
    const targetIsA = Math.random() > 0.5;
    targetGrid = targetIsA
      ? makeGrid([{ r: 0, c: 1, shape: 'cross', color: 'blue' }, { r: 2, c: 1, shape: 'square', color: 'blue' }])
      : makeGrid([{ r: 0, c: 1, shape: 'cross', color: 'blue' }, { r: 2, c: 1, shape: 'square', color: 'red' }]);
    correctSet = targetIsA ? 'Set A' : 'Set B';
    ruleA = 'All elements share exactly the SAME uniform color';
    ruleB = 'Elements have DIFFERENT contrasting colors';
  } else if (ruleType === 3) {
    // Model 4: Center Cell Occupied vs Center Cell Empty
    setAExamples = [
      makeGrid([{ r: 1, c: 1, shape: 'circle', color: 'purple' }, { r: 0, c: 0, shape: 'cross', color: 'red' }]),
      makeGrid([{ r: 1, c: 1, shape: 'square', color: 'green' }, { r: 2, c: 2, shape: 'triangle', color: 'green' }]),
      makeGrid([{ r: 1, c: 1, shape: 'star', color: 'blue' }, { r: 0, c: 2, shape: 'diamond', color: 'orange' }])
    ];
    setBExamples = [
      makeGrid([{ r: 0, c: 0, shape: 'circle', color: 'purple' }, { r: 2, c: 2, shape: 'cross', color: 'red' }]),
      makeGrid([{ r: 0, c: 1, shape: 'square', color: 'green' }, { r: 2, c: 1, shape: 'triangle', color: 'green' }]),
      makeGrid([{ r: 1, c: 0, shape: 'star', color: 'blue' }, { r: 1, c: 2, shape: 'diamond', color: 'orange' }])
    ];
    const targetIsA = Math.random() > 0.5;
    targetGrid = targetIsA
      ? makeGrid([{ r: 1, c: 1, shape: 'cross', color: 'red' }, { r: 2, c: 0, shape: 'diamond', color: 'blue' }])
      : makeGrid([{ r: 0, c: 0, shape: 'cross', color: 'red' }, { r: 2, c: 0, shape: 'diamond', color: 'blue' }]);
    correctSet = targetIsA ? 'Set A' : 'Set B';
    ruleA = 'The CENTER cell (1, 1) is always occupied';
    ruleB = 'The CENTER cell (1, 1) is always EMPTY';
  } else if (ruleType === 4) {
    // Model 5: Perimeter Corners vs Perimeter Edges
    setAExamples = [
      makeGrid([{ r: 0, c: 0, shape: 'star', color: 'purple' }, { r: 2, c: 2, shape: 'star', color: 'purple' }]),
      makeGrid([{ r: 0, c: 2, shape: 'circle', color: 'blue' }, { r: 2, c: 0, shape: 'circle', color: 'blue' }]),
      makeGrid([{ r: 0, c: 0, shape: 'square', color: 'red' }, { r: 0, c: 2, shape: 'square', color: 'red' }])
    ];
    setBExamples = [
      makeGrid([{ r: 0, c: 1, shape: 'star', color: 'purple' }, { r: 2, c: 1, shape: 'star', color: 'purple' }]),
      makeGrid([{ r: 1, c: 0, shape: 'circle', color: 'blue' }, { r: 1, c: 2, shape: 'circle', color: 'blue' }]),
      makeGrid([{ r: 0, c: 1, shape: 'square', color: 'red' }, { r: 1, c: 0, shape: 'square', color: 'red' }])
    ];
    const targetIsA = Math.random() > 0.5;
    targetGrid = targetIsA
      ? makeGrid([{ r: 2, c: 0, shape: 'diamond', color: 'orange' }, { r: 2, c: 2, shape: 'diamond', color: 'orange' }])
      : makeGrid([{ r: 1, c: 0, shape: 'diamond', color: 'orange' }, { r: 2, c: 1, shape: 'diamond', color: 'orange' }]);
    correctSet = targetIsA ? 'Set A' : 'Set B';
    ruleA = 'Elements occupy CORNER cells of the grid';
    ruleB = 'Elements occupy EDGE / MIDDLE cells of the grid';
  } else {
    // Model 6: More Circles than Squares vs More Squares than Circles
    setAExamples = [
      makeGrid([{ r: 0, c: 0, shape: 'circle', color: 'purple' }, { r: 1, c: 1, shape: 'circle', color: 'purple' }, { r: 2, c: 2, shape: 'square', color: 'green' }]),
      makeGrid([{ r: 0, c: 1, shape: 'circle', color: 'purple' }, { r: 2, c: 1, shape: 'circle', color: 'purple' }])
    ];
    setBExamples = [
      makeGrid([{ r: 0, c: 0, shape: 'square', color: 'green' }, { r: 1, c: 1, shape: 'square', color: 'green' }, { r: 2, c: 2, shape: 'circle', color: 'purple' }]),
      makeGrid([{ r: 0, c: 1, shape: 'square', color: 'green' }, { r: 2, c: 1, shape: 'square', color: 'green' }])
    ];
    const targetIsA = Math.random() > 0.5;
    targetGrid = targetIsA
      ? makeGrid([{ r: 0, c: 0, shape: 'circle', color: 'purple' }, { r: 1, c: 2, shape: 'circle', color: 'purple' }])
      : makeGrid([{ r: 0, c: 0, shape: 'square', color: 'green' }, { r: 1, c: 2, shape: 'square', color: 'green' }]);
    correctSet = targetIsA ? 'Set A' : 'Set B';
    ruleA = 'CIRCLES strictly outnumber Squares';
    ruleB = 'SQUARES strictly outnumber Circles';
  }

  return {
    id: qId,
    challengeType: 'scales_clx',
    prompt: 'Discover the rule separating Set A and Set B. Which set does the Target Grid belong to?',
    subRuleLabel: 'Aon Scales CLX (Set A vs Set B Classification)',
    ruleExplanation: `Rule Discovery: Set A → ${ruleA}. Set B → ${ruleB}. The Target Grid matches ${correctSet}.`,
    scalesClxData: {
      setAExamples,
      setBExamples,
      targetGrid,
      correctSet,
      ruleA,
      ruleB
    }
  };
}

// ─────────────────────────────────────────────────────────────────
// 5. STRUCTURAL CLASSIFICATION (Dynamic 1-Pick and 2-Pick with 1 or 2 Examples)
// ─────────────────────────────────────────────────────────────────
function generateClassificationTask(difficulty: Difficulty, level: number = 1): InductiveQuestion {
  const qId = 'ind_cls_' + Math.random().toString(36).substring(2, 9);
  
  // Choose pickCount (1 or 2) - alternate or randomize
  const pickCount = Math.random() < 0.5 ? 1 : 2;
  const exampleCount = pickCount === 1 && Math.random() < 0.5 ? 1 : 2;

  const model = Math.floor(Math.random() * 5);
  let ex1: SmallGrid, ex2: SmallGrid;
  let candCorrect1: SmallGrid, candCorrect2: SmallGrid;
  let candWrong1: SmallGrid, candWrong2: SmallGrid, candWrong3: SmallGrid;
  let ruleText = '';

  if (model === 0) {
    // Main Diagonal Invariance
    ex1 = [
      [makeCell('circle', 'purple'), null, null],
      [null, makeCell('circle', 'purple'), null],
      [null, null, makeCell('circle', 'purple')]
    ];
    ex2 = [
      [makeCell('square', 'green'), null, null],
      [null, makeCell('square', 'green'), null],
      [null, null, makeCell('square', 'green')]
    ];
    candCorrect1 = [
      [makeCell('triangle', 'blue'), null, null],
      [null, makeCell('triangle', 'blue'), null],
      [null, null, makeCell('triangle', 'blue')]
    ];
    candCorrect2 = [
      [makeCell('diamond', 'red'), null, null],
      [null, makeCell('diamond', 'red'), null],
      [null, null, makeCell('diamond', 'red')]
    ];
    candWrong1 = [
      [makeCell('star', 'purple'), makeCell('star', 'purple'), null],
      [null, null, null],
      [null, null, makeCell('star', 'purple')]
    ];
    candWrong2 = [
      [null, makeCell('cross', 'green'), null],
      [null, makeCell('cross', 'green'), null],
      [null, makeCell('cross', 'green'), null]
    ];
    candWrong3 = [
      [null, null, makeCell('circle', 'blue')],
      [null, makeCell('circle', 'blue'), null],
      [makeCell('circle', 'blue'), null, null]
    ];
    ruleText = 'Shared Invariant: Elements must lie strictly along the top-left to bottom-right main diagonal.';
  } else if (model === 1) {
    // 4-Corner Invariance
    ex1 = [
      [makeCell('circle', 'blue'), null, makeCell('circle', 'blue')],
      [null, null, null],
      [makeCell('circle', 'blue'), null, makeCell('circle', 'blue')]
    ];
    ex2 = [
      [makeCell('star', 'purple'), null, makeCell('star', 'purple')],
      [null, null, null],
      [makeCell('star', 'purple'), null, makeCell('star', 'purple')]
    ];
    candCorrect1 = [
      [makeCell('square', 'red'), null, makeCell('square', 'red')],
      [null, null, null],
      [makeCell('square', 'red'), null, makeCell('square', 'red')]
    ];
    candCorrect2 = [
      [makeCell('triangle', 'green'), null, makeCell('triangle', 'green')],
      [null, null, null],
      [makeCell('triangle', 'green'), null, makeCell('triangle', 'green')]
    ];
    candWrong1 = [
      [makeCell('square', 'red'), makeCell('square', 'red'), null],
      [null, null, null],
      [null, makeCell('square', 'red'), makeCell('square', 'red')]
    ];
    candWrong2 = [
      [null, makeCell('diamond', 'orange'), null],
      [makeCell('diamond', 'orange'), null, makeCell('diamond', 'orange')],
      [null, makeCell('diamond', 'orange'), null]
    ];
    candWrong3 = [
      [null, null, null],
      [null, makeCell('star', 'purple'), null],
      [null, null, null]
    ];
    ruleText = 'Shared Invariant: Exactly 4 elements placed in the 4 extreme outer corners.';
  } else if (model === 2) {
    // Horizontal Center Row Invariance
    ex1 = [
      [null, null, null],
      [makeCell('cross', 'orange'), makeCell('cross', 'orange'), makeCell('cross', 'orange')],
      [null, null, null]
    ];
    ex2 = [
      [null, null, null],
      [makeCell('diamond', 'green'), makeCell('diamond', 'green'), makeCell('diamond', 'green')],
      [null, null, null]
    ];
    candCorrect1 = [
      [null, null, null],
      [makeCell('star', 'purple'), makeCell('star', 'purple'), makeCell('star', 'purple')],
      [null, null, null]
    ];
    candCorrect2 = [
      [null, null, null],
      [makeCell('circle', 'blue'), makeCell('circle', 'blue'), makeCell('circle', 'blue')],
      [null, null, null]
    ];
    candWrong1 = [
      [makeCell('star', 'purple'), null, null],
      [null, makeCell('star', 'purple'), null],
      [null, null, makeCell('star', 'purple')]
    ];
    candWrong2 = [
      [makeCell('diamond', 'green'), makeCell('diamond', 'green'), makeCell('diamond', 'green')],
      [null, null, null],
      [null, null, null]
    ];
    candWrong3 = [
      [null, null, null],
      [null, null, null],
      [makeCell('cross', 'orange'), makeCell('cross', 'orange'), makeCell('cross', 'orange')]
    ];
    ruleText = 'Shared Invariant: Entire middle row (Row 2) is filled completely.';
  } else if (model === 3) {
    // Plus / Cross Symmetry Invariance
    ex1 = [
      [null, makeCell('diamond', 'red'), null],
      [makeCell('diamond', 'red'), makeCell('diamond', 'red'), makeCell('diamond', 'red')],
      [null, makeCell('diamond', 'red'), null]
    ];
    ex2 = [
      [null, makeCell('triangle', 'green'), null],
      [makeCell('triangle', 'green'), makeCell('triangle', 'green'), makeCell('triangle', 'green')],
      [null, makeCell('triangle', 'green'), null]
    ];
    candCorrect1 = [
      [null, makeCell('circle', 'blue'), null],
      [makeCell('circle', 'blue'), makeCell('circle', 'blue'), makeCell('circle', 'blue')],
      [null, makeCell('circle', 'blue'), null]
    ];
    candCorrect2 = [
      [null, makeCell('star', 'purple'), null],
      [makeCell('star', 'purple'), makeCell('star', 'purple'), makeCell('star', 'purple')],
      [null, makeCell('star', 'purple'), null]
    ];
    candWrong1 = [
      [makeCell('circle', 'blue'), null, makeCell('circle', 'blue')],
      [null, null, null],
      [makeCell('circle', 'blue'), null, makeCell('circle', 'blue')]
    ];
    candWrong2 = [
      [null, makeCell('star', 'purple'), null],
      [null, makeCell('star', 'purple'), null],
      [null, makeCell('star', 'purple'), null]
    ];
    candWrong3 = [
      [makeCell('diamond', 'red'), null, null],
      [null, makeCell('diamond', 'red'), null],
      [null, null, makeCell('diamond', 'red')]
    ];
    ruleText = 'Shared Invariant: Plus/Cross formation with center and all 4 edge midpoints filled.';
  } else {
    // Vertical Center Column Invariance
    ex1 = [
      [null, makeCell('star', 'purple'), null],
      [null, makeCell('star', 'purple'), null],
      [null, makeCell('star', 'purple'), null]
    ];
    ex2 = [
      [null, makeCell('triangle', 'blue'), null],
      [null, makeCell('triangle', 'blue'), null],
      [null, makeCell('triangle', 'blue'), null]
    ];
    candCorrect1 = [
      [null, makeCell('diamond', 'orange'), null],
      [null, makeCell('diamond', 'orange'), null],
      [null, makeCell('diamond', 'orange'), null]
    ];
    candCorrect2 = [
      [null, makeCell('square', 'red'), null],
      [null, makeCell('square', 'red'), null],
      [null, makeCell('square', 'red'), null]
    ];
    candWrong1 = [
      [makeCell('star', 'purple'), makeCell('star', 'purple'), makeCell('star', 'purple')],
      [null, null, null],
      [null, null, null]
    ];
    candWrong2 = [
      [makeCell('diamond', 'orange'), null, null],
      [null, makeCell('diamond', 'orange'), null],
      [null, null, makeCell('diamond', 'orange')]
    ];
    candWrong3 = [
      [null, null, makeCell('square', 'red')],
      [null, null, makeCell('square', 'red')],
      [null, null, makeCell('square', 'red')]
    ];
    ruleText = 'Shared Invariant: Entire middle column (Column 2) is filled vertically.';
  }

  // Build candidate pool based on pickCount
  let candidates: { grid: SmallGrid; isCorrect: boolean }[];
  if (pickCount === 1) {
    candidates = [
      { grid: candCorrect1, isCorrect: true },
      { grid: candWrong1, isCorrect: false },
      { grid: candWrong2, isCorrect: false },
      { grid: candWrong3, isCorrect: false }
    ].sort(() => Math.random() - 0.5);
  } else {
    candidates = [
      { grid: candCorrect1, isCorrect: true },
      { grid: candWrong1, isCorrect: false },
      { grid: candCorrect2, isCorrect: true },
      { grid: candWrong2, isCorrect: false }
    ].sort(() => Math.random() - 0.5);
  }

  const matchingIndices = candidates
    .map((c, idx) => (c.isCorrect ? idx : -1))
    .filter(idx => idx !== -1);

  const exampleGrids = exampleCount === 1 ? [ex1] : [ex1, ex2];

  const prompt = pickCount === 1
    ? (exampleCount === 1
        ? 'Examine the example grid. Which candidate grid follows the exact same rule?'
        : 'Examine the example grids. Which candidate grid follows the exact same rule?')
    : 'Examine the example grids. Which 2 candidate grids follow the exact same rule?';

  const subRuleLabel = pickCount === 1
    ? `Structural Invariance (Pick 1 of 4)`
    : `Structural Invariance (Pick 2 of 4)`;

  return {
    id: qId,
    challengeType: 'classification',
    prompt,
    subRuleLabel,
    ruleExplanation: ruleText,
    exampleGrids,
    candidateGrids: candidates.map(c => c.grid),
    correctIndices: matchingIndices,
    correctOptionIndex: matchingIndices[0],
    requiredPickCount: pickCount
  };
}

// ─────────────────────────────────────────────────────────────────
// 6. ODD ONE OUT / DOESN'T FIT THE RULE (Images 1, 2, 3 Models)
// ─────────────────────────────────────────────────────────────────
export function generateOddOneOutTask(difficulty: Difficulty, level: number = 1): InductiveQuestion {
  const qId = 'ind_ooo_' + Math.random().toString(36).substring(2, 9);
  const modelType = Math.floor(Math.random() * 4);

  // Model 0: Broken Horizontal Lines (Image 1 & 2 Model 1)
  if (modelType === 0) {
    const validCycle = [4, 3, 2, 1, 0, 1, 2, 3, 4]; // 5th, 4th, 3rd, 2nd, 1st, 2nd, 3rd, 4th, 5th
    const oddIdx = Math.floor(Math.random() * 5) + 2; // e.g. Card 3, 4, 5, 6, or 7
    const expected = validCycle[oddIdx];
    const corrupted = (expected + 2) % 5;

    const nineCards: SequenceItem[] = validCycle.map((lineIdx, i) => {
      const activeLine = i === oddIdx ? corrupted : lineIdx;
      return {
        shape: 'square',
        color: '#1E293B',
        count: 5,
        rotation: 0,
        brokenLineIndex: activeLine,
        label: `Card ${i + 1}`
      };
    });

    const ruleExplanation = `Broken Line Cycle Rule: Broken lines follow a continuous bounce sequence (5th → 4th → 3rd → 2nd → 1st → 2nd → 3rd → 4th → 5th). In image ${oddIdx + 1}, instead of the ${expected + 1}th line being broken, the ${corrupted + 1}th line is broken, violating the rule.`;

    return {
      id: qId,
      challengeType: 'odd_one_out',
      prompt: 'Identify and mark the image that does not logically follow the given rule:',
      subRuleLabel: "Doesn't Fit the Rule (9-Card Sequence)",
      ruleExplanation,
      nineCards,
      oddCardIndex: oddIdx,
      correctOptionIndex: oddIdx
    };
  }

  // Model 1: Dual Shape Overlap Invariance (Image 2 Model 2)
  if (modelType === 1) {
    const filledShapes: ShapeSymbol[] = ['square', 'circle', 'triangle', 'diamond', 'hexagon', 'parallelogram', 'cross', 'star'];
    const outlineShapes: ShapeSymbol[] = ['circle', 'triangle', 'square', 'diamond', 'cross', 'triangle', 'diamond', 'circle'];

    const oddIdx = Math.floor(Math.random() * 7) + 1; // e.g. Card 2 to 8

    const nineCards: SequenceItem[] = Array.from({ length: 9 }, (_, i) => {
      const isOdd = i === oddIdx;
      const fShape = filledShapes[i % filledShapes.length];
      const oShape = outlineShapes[i % outlineShapes.length];

      return {
        shape: fShape,
        color: '#1E293B',
        count: 2,
        rotation: 0,
        dualShapes: {
          filled: { shape: fShape, x: isOdd ? 46 : 28, y: isOdd ? 48 : 50, size: 28 },
          outline: { shape: oShape, x: isOdd ? 54 : 72, y: isOdd ? 52 : 50, size: 20 },
          isOverlapping: isOdd
        },
        label: `Card ${i + 1}`
      };
    });

    const ruleExplanation = `Non-Overlap Invariance: In all normal images, there is one solid black filled shape and one outline shape that do NOT overlap. In image ${oddIdx + 1}, the two shapes overlap and intersect each other.`;

    return {
      id: qId,
      challengeType: 'odd_one_out',
      prompt: 'Identify and mark the image that does not logically follow the given rule:',
      subRuleLabel: "Doesn't Fit the Rule (Shape Overlap Invariance)",
      ruleExplanation,
      nineCards,
      oddCardIndex: oddIdx,
      correctOptionIndex: oddIdx
    };
  }

  // Model 2: 3x3 Plus/Cross Grid Progression (Image 2 & 3 Model 3)
  if (modelType === 2) {
    // 9 stages of 3x3 plus grid
    // Alternate center plus: 1(on), 2(off), 3(on -2), 4(off -2), 5(on -4), 6(off -4), 7(on -6), 8(off -6), 9(on -8)
    const baseGrid = () => Array.from({ length: 3 }, () => Array(3).fill(true));
    const oddIdx = 4; // Card 5 matching image 2 & 3

    const nineCards: SequenceItem[] = Array.from({ length: 9 }, (_, i) => {
      const grid = baseGrid();
      const isOddStep = i % 2 === 0; // 0, 2, 4, 6, 8 (Cards 1, 3, 5, 7, 9)

      // Center toggle
      if (!isOddStep) {
        grid[1][1] = false; // center removed
      }

      // Step 2 & 3 (Cards 3 & 4): remove left & right (1,0) and (1,2)
      if (i >= 2) {
        grid[1][0] = false;
        grid[1][2] = false;
      }
      // Step 4 & 5 (Cards 5 & 6): remove top & bottom (0,1) and (2,1)
      if (i >= 4) {
        if (i === oddIdx) {
          // Corrupted in Card 5: instead of top & bottom, removes wrong diagonal
          grid[0][0] = false;
          grid[2][2] = false;
        } else {
          grid[0][1] = false;
          grid[2][1] = false;
        }
      }
      // Step 6 & 7 (Cards 7 & 8): remove top-right & bottom-left
      if (i >= 6) {
        grid[0][2] = false;
        grid[2][0] = false;
      }
      // Step 8 (Card 9): remove top-left & bottom-right
      if (i >= 8) {
        grid[0][0] = false;
        grid[2][2] = false;
      }

      return {
        shape: 'cross',
        color: '#1E293B',
        count: 9,
        rotation: 0,
        plusGrid: grid,
        label: `Card ${i + 1}`
      };
    });

    const ruleExplanation = `Plus Grid Progression: 1) The center '+' alternates (vanishes on even cards, reappears on odd cards). 2) Each time center '+' reappears, a symmetric pair of outer '+' signs is removed. In image ${oddIdx + 1}, the wrong pair was removed, breaking the pattern.`;

    return {
      id: qId,
      challengeType: 'odd_one_out',
      prompt: 'Identify and mark the image that does not logically follow the given rule:',
      subRuleLabel: "Doesn't Fit the Rule (3x3 Plus Grid Progression)",
      ruleExplanation,
      nineCards,
      oddCardIndex: oddIdx,
      correctOptionIndex: oddIdx
    };
  }

  // Model 3: Continuous Angle Rotation Progression
  const baseShape = randOf(['triangle', 'star', 'diamond'] as ShapeSymbol[]);
  const startAngle = 0;
  const stepAngle = 45;
  const oddIdx = Math.floor(Math.random() * 6) + 2; // Card 3 to 8

  const nineCards: SequenceItem[] = Array.from({ length: 9 }, (_, i) => {
    const expectedAngle = (startAngle + i * stepAngle) % 360;
    const actualAngle = i === oddIdx ? (expectedAngle + 180) % 360 : expectedAngle;

    return {
      shape: baseShape,
      color: '#1E293B',
      count: 1,
      rotation: actualAngle,
      scale: 'medium',
      label: `Card ${i + 1}`
    };
  });

  const ruleExplanation = `Rotational Progression: The shape rotates clockwise by exactly +${stepAngle}° at each step. In image ${oddIdx + 1}, the shape is rotated out of sequence.`;

  return {
    id: qId,
    challengeType: 'odd_one_out',
    prompt: 'Identify and mark the image that does not logically follow the given rule:',
    subRuleLabel: "Doesn't Fit the Rule (Rotational Sequence)",
    ruleExplanation,
    nineCards,
    oddCardIndex: oddIdx,
    correctOptionIndex: oddIdx
  };
}

// ─────────────────────────────────────────────────────────────────
// 7. SPACIO "THE SAME RULE" PAIR DISCOVERY (Spacio Discovery Challenge)
// ─────────────────────────────────────────────────────────────────
export function generateSameRulePairsTask(difficulty: Difficulty = 'medium', level: number = 1): InductiveQuestion {
  const qId = 'ind_srp_' + Math.random().toString(36).substring(2, 9);
  const modelType = Math.floor(Math.random() * 3);

  const makeEmptyGrid = (): SmallGrid => [
    [null, null, null],
    [null, null, null],
    [null, null, null]
  ];

  if (modelType === 0) {
    // Model 0 (Image 1 Model 1): First and last row all contain + signs
    const nonPlusShapes: ShapeSymbol[] = ['circle', 'triangle', 'square'];
    const nonPlusColors: ColorName[] = ['purple', 'blue', 'green'];

    const makePlusRowGrid = (row1Shapes: ShapeSymbol[], row1Colors: ColorName[]): SmallGrid => {
      const g = makeEmptyGrid();
      for (let c = 0; c < 3; c++) {
        g[0][c] = makeCell('cross', 'red');
        g[1][c] = makeCell(row1Shapes[c], row1Colors[c]);
        g[2][c] = makeCell('cross', 'red');
      }
      return g;
    };

    const ex1 = makePlusRowGrid(['triangle', 'square', 'circle'], ['blue', 'green', 'purple']);
    const ex2 = makePlusRowGrid(['circle', 'triangle', 'square'], ['purple', 'blue', 'green']);

    // Correct Candidate Group (both grids follow rule)
    const corGrid1 = makePlusRowGrid(['square', 'circle', 'triangle'], ['green', 'purple', 'blue']);
    const corGrid2 = makePlusRowGrid(['circle', 'square', 'triangle'], ['purple', 'green', 'blue']);

    // Distractor Candidate Group (one or both grids violate rule)
    const distGrid1 = makeEmptyGrid();
    for (let c = 0; c < 3; c++) {
      distGrid1[0][c] = makeCell(nonPlusShapes[c], nonPlusColors[c]);
      distGrid1[1][c] = makeCell('cross', 'red');
      distGrid1[2][c] = makeCell('cross', 'red');
    }
    const distGrid2 = makePlusRowGrid(['square', 'triangle', 'circle'], ['green', 'blue', 'purple']);

    const candidateGroups = [
      { grids: [corGrid1, corGrid2], label: 'Group 1', isCorrect: true },
      { grids: [distGrid1, distGrid2], label: 'Group 2', isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    const correctGroupIndex = candidateGroups.findIndex(g => g.isCorrect);
    const ruleExplanation = "Rule: Both Grids have their FIRST (top) and LAST (bottom) rows entirely filled with red '+' signs.";

    return {
      id: qId,
      challengeType: 'same_rule_pairs',
      prompt: 'These two Grids follow the same rule. Which of these groups follow the same rule?',
      subRuleLabel: 'The Same Rule (Spacio Challenge)',
      ruleExplanation,
      sameRulePairsData: {
        exampleGrids: [ex1, ex2],
        candidateGroups,
        correctGroupIndex,
        ruleText: ruleExplanation
      },
      correctOptionIndex: correctGroupIndex
    };
  } else if (modelType === 1) {
    // Model 1 (Image 1 Model 2): Shape Inventory Count Invariance
    // Each grid has: 1 cross (red), 2 triangles (blue), 3 circles (purple), 3 squares (green)
    const makeInventoryGrid = (corruptCrossCount?: number): SmallGrid => {
      let pool: { shape: ShapeSymbol; color: ColorName }[] = [];
      const crossCount = corruptCrossCount !== undefined ? corruptCrossCount : 1;
      const triangleCount = corruptCrossCount !== undefined ? (corruptCrossCount > 1 ? 1 : 3) : 2;

      for (let i = 0; i < crossCount; i++) pool.push({ shape: 'cross', color: 'red' });
      for (let i = 0; i < triangleCount; i++) pool.push({ shape: 'triangle', color: 'blue' });
      for (let i = 0; i < 3; i++) pool.push({ shape: 'circle', color: 'purple' });
      for (let i = 0; i < 3; i++) pool.push({ shape: 'square', color: 'green' });

      pool = pool.sort(() => Math.random() - 0.5);
      const g = makeEmptyGrid();
      let idx = 0;
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          g[r][c] = makeCell(pool[idx].shape, pool[idx].color);
          idx++;
        }
      }
      return g;
    };

    const ex1 = makeInventoryGrid();
    const ex2 = makeInventoryGrid();

    const corGrid1 = makeInventoryGrid();
    const corGrid2 = makeInventoryGrid();

    const distGrid1 = makeInventoryGrid(2); // Corrupted with 2 crosses and 1 triangle
    const distGrid2 = makeInventoryGrid();

    const candidateGroups = [
      { grids: [corGrid1, corGrid2], label: 'Group 1', isCorrect: true },
      { grids: [distGrid1, distGrid2], label: 'Group 2', isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    const correctGroupIndex = candidateGroups.findIndex(g => g.isCorrect);
    const ruleExplanation = "Rule: Every grid contains exactly 1 Red Cross (+), 2 Blue Triangles, 3 Purple Circles, and 3 Green Squares.";

    return {
      id: qId,
      challengeType: 'same_rule_pairs',
      prompt: 'These two Grids follow the same rule. Which of these groups follow the same rule?',
      subRuleLabel: 'The Same Rule (Symbol Inventory Invariance)',
      ruleExplanation,
      sameRulePairsData: {
        exampleGrids: [ex1, ex2],
        candidateGroups,
        correctGroupIndex,
        ruleText: ruleExplanation
      },
      correctOptionIndex: correctGroupIndex
    };
  } else {
    // Model 2: Middle Column Invariant
    const makeColGrid = (isCorrupt: boolean = false): SmallGrid => {
      const g = makeEmptyGrid();
      const shapes: ShapeSymbol[] = ['circle', 'square', 'cross'];
      const colors: ColorName[] = ['purple', 'green', 'red'];

      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          if (c === 1 && !isCorrupt) {
            g[r][c] = makeCell('triangle', 'blue');
          } else if (c === 0 && isCorrupt) {
            g[r][c] = makeCell('triangle', 'blue');
          } else {
            g[r][c] = makeCell(randOf(shapes), randOf(colors));
          }
        }
      }
      return g;
    };

    const ex1 = makeColGrid(false);
    const ex2 = makeColGrid(false);

    const corGrid1 = makeColGrid(false);
    const corGrid2 = makeColGrid(false);

    const distGrid1 = makeColGrid(true); // Column 0 instead of Column 1
    const distGrid2 = makeColGrid(false);

    const candidateGroups = [
      { grids: [corGrid1, corGrid2], label: 'Group 1', isCorrect: true },
      { grids: [distGrid1, distGrid2], label: 'Group 2', isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    const correctGroupIndex = candidateGroups.findIndex(g => g.isCorrect);
    const ruleExplanation = "Rule: Column 2 (the middle vertical column) is filled entirely with Blue Triangles.";

    return {
      id: qId,
      challengeType: 'same_rule_pairs',
      prompt: 'These two Grids follow the same rule. Which of these groups follow the same rule?',
      subRuleLabel: 'The Same Rule (Column Alignment Invariance)',
      ruleExplanation,
      sameRulePairsData: {
        exampleGrids: [ex1, ex2],
        candidateGroups,
        correctGroupIndex,
        ruleText: ruleExplanation
      },
      correctOptionIndex: correctGroupIndex
    };
  }
}

// ─────────────────────────────────────────────────────────────────
// PRIMARY DISPATCHER
// ─────────────────────────────────────────────────────────────────
export function generateInductiveQuestion(
  difficulty: Difficulty = 'medium',
  level: number = 1,
  forcedMode?: InductiveChallengeType
): InductiveQuestion {
  if (forcedMode === 'same_rule_pairs') return generateSameRulePairsTask(difficulty, level);
  if (forcedMode === 'odd_one_out') return generateOddOneOutTask(difficulty, level);
  if (forcedMode === 'sequence') return generateSequenceTask(difficulty, level);
  if (forcedMode === 'transformation') return generateTransformationTask(difficulty, level);
  if (forcedMode === 'analogy') return generateAnalogyTask(difficulty, level);
  if (forcedMode === 'scales_clx') return generateScalesClxTask(difficulty, level);
  if (forcedMode === 'classification') return generateClassificationTask(difficulty, level);

  if (level === 1) return generateSameRulePairsTask(difficulty, 1);
  if (level === 2) return generateOddOneOutTask(difficulty, 2);
  if (level === 3) return generateSameRulePairsTask(difficulty, 3);
  if (level === 4) return generateOddOneOutTask(difficulty, 4);
  if (level === 5) return generateSequenceTask(difficulty, level);
  return generateSameRulePairsTask(difficulty, level);
}

