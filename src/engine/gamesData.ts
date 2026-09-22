import { GameId, GameMetadata } from '../types';

export const GAMES_DATA: Record<GameId, GameMetadata> = {
  // ── 01 Inductive Reasoning ──────────────────────────────────────────
  inductive: {
    id: 'inductive',
    title: 'Inductive Reasoning',
    subtitle: 'Spacio & Latent Rules',
    skill: 'Pattern Recognition',
    category: 'Logical Reasoning',
    description: 'Infer latent geometric rules, Spacio "The Same Rule" grid pairs, 9-card sequence progressions, visual analogies, and Aon Scales CLX classification.',
    targetMetric: 'Rule inference speed & precision',
    avgTimeSec: 360, // 6 mins (Standard section duration)
    badgeColor: 'indigo',
    rules: [
      'Observe the sequence, analogy, or reference sets carefully.',
      'Identify the underlying transformation rule (e.g., element count, rotational cycles, shape parity, or color shifts).',
      'Select the option that correctly satisfies the next step or latent classification rule.'
    ],
    subtypes: [
      { name: 'The Same Rule [Spacio Challenge]', description: 'Analyze 2 example 3x3 grids sharing a latent rule and select which candidate pair follows the identical rule.' },
      { name: 'Linear Sequence [Pattern Progression]', description: 'Infer progressive multi-attribute transformations in object count, scale, rotation, and positional shifts.' },
      { name: 'Transformation Rules', description: 'Infer multi-attribute geometric state transitions across sequential frames.' },
      { name: 'Visual Analogy (A:B :: C:?)', description: 'Discover how Figure A maps to Figure B and apply identical logic from Figure C to target.' },
      { name: 'Aon Scales CLX (Set A vs Set B)', description: 'Discover the latent geometric rule separating Set A from Set B and classify target patterns.' },
      { name: 'Structural Outlier / Classification', description: 'Identify the shared structural geometric invariant across candidate figures and spot the anomaly.' }
    ]
  },

  // ── 02 Deductive Reasoning ──────────────────────────────────────────
  deductive: {
    id: 'deductive',
    title: 'Deductive Reasoning',
    subtitle: 'GeoStudio & Formal Logic',
    skill: 'Deductive Logic',
    category: 'Logical Reasoning',
    description: 'Derive non-ambiguous logical conclusions purely from stated premises, ordering rules, and Aon Scales SX / GeoStudio 4x4 & 5x5 geometrical Sudoku.',
    targetMetric: 'Logical validity & syllogistic accuracy',
    avgTimeSec: 360, // 6 mins (Standard section duration)
    badgeColor: 'indigo',
    rules: [
      'Read the given premises, constraints, or Latin square grid carefully.',
      'Treat the statements as absolute ground truth regardless of real-world knowledge.',
      'Select the only conclusion or symbol that is logically guaranteed to follow without duplication.'
    ],
    subtypes: [
      { name: 'Geometrical Sudoku [GeoStudio / Scales SX]', description: '4x4 & 5x5 Sudoku-style symbol deduction where each shape appears exactly once per row and column.' },
      { name: 'Conditional Syllogisms [Formal Logic]', description: 'Formal categorical and disjunctive syllogisms with absolute ground truth premises.' },
      { name: 'Linear Ordering Constraints', description: 'Apply directional, spatial, and linear sequence rules (left of, between, not adjacent) to assign positions.' },
      { name: 'Positional Seating Constraints', description: 'Apply boundary conditions and relative spacing to determine target slot assignments.' }
    ]
  },

  // ── 03 Spatial Reasoning ────────────────────────────────────────────
  grid: {
    id: 'grid',
    title: 'Spatial Reasoning',
    subtitle: 'Spatial Grid & Symmetry Challenge',
    skill: 'Spatial Reasoning',
    category: 'Spatial & Quantitative',
    description: 'Master the authentic Multi-Stage Grid Challenge (Memorize Dot → Symmetrical / Rotational Distractor → Recall Dot), Mental Rotation, and Matrix Overlays.',
    targetMetric: 'Visual-spatial transformation & mental rotation',
    avgTimeSec: 360, // 6 mins (Standard section duration)
    badgeColor: 'emerald',
    rules: [
      'For Grid Challenge: Memorize the flashing red dot coordinates on the 5x5 grid.',
      'Answer the interleaved spatial question (Is it vertically symmetrical? / Are rotated shapes identical?).',
      'At the recall stage, click the memorized dot coordinates in exact sequence!'
    ],
    subtypes: [
      { name: 'Full Grid Challenge (Multi-Step Loop)', description: 'Complete 3-phase cognitive loop: Dot Coordinate Memorization → Interleaved Spatial Task → Spatial Node Recall.' },
      { name: 'Axial Symmetry [Symmetry Distractor]', description: 'Evaluate whether dot patterns reflect symmetrically across the central vertical axis (Yes / No).' },
      { name: 'Mental Rotation [Spatial Matrix]', description: 'Mentally rotate dot matrices (90°, 180°, 270°) to verify if patterns are preserved or altered.' },
      { name: 'Boolean Overlay (AND/OR/XOR)', description: 'Superimpose Shape A + Shape B via Union, XOR, or Subtraction transformations to deduce the resulting shape.' },
      { name: 'Missing Cell Matrix', description: '3x3 multi-attribute progressive matrix missing cell completion.' }
    ]
  },

  // ── 04 Cognitive Flexibility ────────────────────────────────────────
  switch: {
    id: 'switch',
    title: 'Switch Challenge',
    subtitle: 'Cognitive Flexibility & Operators',
    skill: 'Cognitive Flexibility',
    category: 'Logical Reasoning',
    description: 'Infer positional transformation operators (e.g. 4321, 2413), reverse operators, and double chained pipelines between inputs and outputs.',
    targetMetric: 'Transformation deduction speed & precision',
    avgTimeSec: 360, // 6 mins (Standard section duration)
    badgeColor: 'amber',
    rules: [
      'Inspect the starting input sequence of 4 colored shapes.',
      'Compare with the final target output sequence to deduce the 4-digit switch operator code.',
      'For chained pipelines, trace the intermediate sequence across both upper and lower transformation layers.'
    ],
    subtypes: [
      { name: 'Classic Switch Operator [Position Operator]', description: 'Deduce the 4-digit numerical position reordering code (e.g., 3 2 4 1) between input and output.' },
      { name: 'Task Switch', description: 'Rapidly alternate between sorting by shape, color, or magnitude under dynamic cues.' },
      { name: 'Reverse Switch Inversion', description: 'Given target output and switch operator, invert the transformation to find the original input.' },
      { name: 'Double Chained Pipeline [Level 4-5]', description: 'Trace two-stage cascading transformation branches across intermediate states.' }
    ]
  },

  // ── 05 Working Memory ───────────────────────────────────────────────
  memory: {
    id: 'memory',
    title: 'Working Memory',
    subtitle: 'Spatial Span & Dual Interference',
    skill: 'Working Memory',
    category: 'Working Memory',
    description: 'Retain transient spatial arrays, symbol sequences, and digits under delay before accurately reconstructing them under active interference.',
    targetMetric: 'Visual-spatial span & retention capacity',
    avgTimeSec: 360, // 6 mins (Standard section duration)
    badgeColor: 'indigo',
    rules: [
      'Memorize the illuminated positions, symbol sequence, or number sequence shown during the brief display phase.',
      'When the grid or recall pad resets, reproduce the exact target sequence in chronological order.',
      'Difficulty dynamically scales: higher accuracy increases sequence length from 4 up to 9 items.'
    ],
    subtypes: [
      { name: 'Digit Span (Forward & Reverse)', description: 'Retain sequential digit strings and recall them in forward or reverse chronological order.' },
      { name: 'Spatial Span (Corsi Blocks)', description: 'Encode transient illuminated dot coordinates on a 4x4 or 5x5 matrix.' },
      { name: 'Symbol Sequence Recall', description: 'Flash symbol sequences (▲ ● ■ ★ ◆) for 2–3s and reproduce them in exact order.' },
      { name: 'Interference Dual-Task [Dual Working Memory]', description: 'Maintain memory retention while actively solving intervening symmetry or math distraction tasks.' },
      { name: 'Delayed Recall', description: 'Maintain memory representations across extended temporal decay delays.' }
    ]
  },

  // ── 06 Attention & Focus ────────────────────────────────────────────
  attention: {
    id: 'attention',
    title: 'Attention & Focus',
    subtitle: 'Visual Search & Perceptual Speed',
    skill: 'Concentration & Scanning',
    category: 'Attention & Speed',
    description: 'Rapidly scan an array of distractors to isolate subtle geometric irregularities, count target features, and detect visual changes.',
    targetMetric: 'Target detection latency (ms)',
    avgTimeSec: 360, // 6 mins (Standard section duration)
    badgeColor: 'rose',
    rules: [
      'Scan the array of symbols or visual scenes as quickly and accurately as possible.',
      'Identify the single symbol that differs or the item that changed between scenes.',
      'Click the anomaly immediately. Both speed and precision directly determine your score.'
    ],
    subtypes: [
      { name: 'Anomaly Search', description: 'Spot single geometric orientation anomalies (e.g. inverted arrow) among identical items.' },
      { name: 'Feature Frequency', description: 'Scan complex multi-attribute distractor matrices to count target feature frequencies.' },
      { name: 'Distractor Filtering [Aon Scales CLS]', description: 'Isolate high-priority signals amidst dense distractor matrices without false positives.' },
      { name: 'Change Detection', description: 'Compare Scene 1 vs Scene 2 and instantly identify which item changed shape or color.' },
      { name: 'Rapid Alphanumeric Match', description: 'Detect subtle alphanumeric and symbol discrepancies across side-by-side strings.' }
    ]
  },

  // ── 07 Processing Speed ─────────────────────────────────────────────
  reaction: {
    id: 'reaction',
    title: 'Processing Speed',
    subtitle: 'Rapid Match & Reaction Latency',
    skill: 'Response Speed & Inhibition',
    category: 'Attention & Speed',
    description: 'Test rapid cognitive categorization, visual reaction latency, and inhibitory control while penalizing anticipatory false starts.',
    targetMetric: 'Pure reaction time (ms) & false-start rate',
    avgTimeSec: 360, // 6 mins (Standard section duration)
    badgeColor: 'rose',
    rules: [
      'Keep your finger ready on your mouse or spacebar.',
      'Wait patiently during the red/amber "WAIT..." phase.',
      'The instant the signal flashes neon green "STRIKE!", click as fast as humanly possible.',
      'Clicking before the green signal triggers a False Start penalty.'
    ],
    subtypes: [
      { name: 'Pure Latency Reaction', description: 'Measure raw sensorimotor delay when the neutral cue turns green.' },
      { name: 'Rapid Symbol Match', description: 'Decide in under 400ms whether two side-by-side complex symbols are identical.' },
      { name: 'Go / No-Go Inhibition', description: 'Rapidly strike valid target tokens while strictly inhibiting responses to red No-Go distractors.' },
      { name: 'Speed Comparison', description: 'High-velocity comparison of flashing visual stimuli under strict countdown clocks.' }
    ]
  },

  // ── 08 Motion & Prediction ──────────────────────────────────────────
  motion: {
    id: 'motion',
    title: 'Motion & Planning',
    subtitle: 'Motion & Path Planning Challenge',
    skill: 'Visuospatial Prediction & Planning',
    category: 'Attention & Speed',
    description: 'Navigate obstacle mazes in minimum steps (Slide Motion Challenge), connect pipe flows, and predict dynamic collision vectors.',
    targetMetric: 'Planning efficiency & trajectory accuracy',
    avgTimeSec: 360, // 6 mins (Standard section duration)
    badgeColor: 'rose',
    rules: [
      'Analyze the grid obstacles, blockers, and target destination.',
      'For Slide Puzzle: Slide the primary block/ball to the target exit in minimal steps.',
      'For Trajectory: Predict laser deflections across optical reflectors to determine the exit gate.'
    ],
    subtypes: [
      { name: 'Slide Motion Challenge', description: 'Slide blocks and navigate obstacles on a grid to guide the target token to the exit in minimum moves.' },
      { name: 'Optical Trajectory & Reflectors', description: 'Project internal 90° deflections off angled reflectors to determine the correct exit gate.' },
      { name: 'Collision Interception', description: 'Accurately time and place interceptors to catch moving targets at intersection points.' }
    ]
  },

  // ── 09 Numerical Reasoning ──────────────────────────────────────────
  math: {
    id: 'math',
    title: 'Numerical Reasoning',
    subtitle: 'Digit & Numerical Challenge',
    skill: 'Numerical Ability',
    category: 'Spatial & Quantitative',
    description: 'Solve the authentic Digit Challenge (fill digit slots using 1–9 once to reach target with left-to-right evaluation), sequence progressions, and quantitative comparisons.',
    targetMetric: 'Arithmetic throughput & constraint satisfaction',
    avgTimeSec: 360, // 6 mins (Standard section duration)
    badgeColor: 'emerald',
    rules: [
      'Calculate expressions respecting left-to-right calculation evaluation.',
      'For Digit Challenge: Place digits 1–9 into the equation slots so the expression equals the target number.',
      'Remember: Each available digit can only be used once in the equation!'
    ],
    subtypes: [
      { name: 'Digit Challenge [Equation Solver]', description: 'Fill equation slots `[ ? ] + [ ? ] × [ ? ] = Target` using unique available digits from 1–9.' },
      { name: 'Number Series & Sequences [SHL Pattern]', description: 'Identify latent mathematical progressions (polynomial, geometric, Fibonacci).' },
      { name: 'Numerical Estimation & Comparison', description: 'Rapidly evaluate complex arithmetic expressions without a calculator.' }
    ]
  },

  // ── 10 Color the Grid Challenge ─────────────────────────────────────
  color_grid: {
    id: 'color_grid',
    title: 'Color the Grid',
    subtitle: 'Diamond Rule Decoding',
    skill: 'Rule Induction & Decoding',
    category: 'Logical Reasoning',
    description: 'Observe 6 diamond alphanumeric tables with colored indicators, discover the latent coloring rule, and apply it to 4 target query tables.',
    targetMetric: 'Rule decoding accuracy & speed',
    avgTimeSec: 360, // 6 mins (Standard section duration)
    badgeColor: 'amber',
    rules: [
      'Study the 6 observation diamond tables in the top section.',
      'Deduce the rule that governs top and bottom indicator dot colors (e.g. counts of target letters, number parity, or vowels vs consonants).',
      'Click the top and bottom indicator dots on the 4 target tables below to assign the correct colors.'
    ],
    subtypes: [
      { name: 'Target Frequency Invariance [Image 3 Model]', description: 'Identify frequency thresholds (e.g. grids with exactly 4 "Z"s) and assign orange top vs blue bottom indicators.' },
      { name: 'Alphanumeric Parity & Vowels [Image 4 Model]', description: 'Top circle coded by odd/even digit parity; bottom circle coded by consonant/vowel letter category.' }
    ]
  }
};

