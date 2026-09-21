export interface MotionBlock {
  id: string;
  type: 'ball' | 'target' | 'rock' | 'horizontal_bar' | 'vertical_bar';
  color: string;
  r: number;
  c: number;
  length: number; // 1 for ball/target/rock, 2 or 3 for bars
  texture?: 'stripes' | 'bars' | 'dots' | 'faceted';
}

export type MotionSubtype = 'slide_puzzle' | 'trajectory_prediction' | 'collision_intercept';

export interface TrajectoryReflector {
  r: number;
  c: number;
  direction: '/' | '\\';
}

export interface MotionPuzzle {
  id: string;
  subtype: MotionSubtype;
  gridRows: number;
  gridCols: number;
  blocks: MotionBlock[];
  minMoves: number;
  targetPos: { r: number; c: number };

  // Trajectory Prediction Specific
  entryGate?: string;
  reflectors?: TrajectoryReflector[];
  exitGates?: { id: string; label: string; r: number; c: number }[];
  correctExitGateId?: string;

  // Collision Intercept Specific
  collisionOptions?: { id: string; label: string; coordinate: string }[];
  correctCollisionId?: string;

  explanation: string;
  solutionSteps?: { blockId: string; action: string; desc: string }[];
}

export function generateMotionPuzzle(level: number = 1, subtypeIndex: number = 0): MotionPuzzle {
  const pId = 'motion_' + Math.random().toString(36).substring(2, 7);
  const subtypes: MotionSubtype[] = ['slide_puzzle', 'trajectory_prediction', 'collision_intercept'];
  const subtype = subtypes[subtypeIndex % subtypes.length];

  // 1. Trajectory Prediction (4 Optical Layouts)
  if (subtype === 'trajectory_prediction') {
    const layoutIdx = Math.floor(Math.random() * 3);
    const exitGates = [
      { id: 'A', label: 'Gate A (Top)', r: 0, c: 1 },
      { id: 'B', label: 'Gate B (Right)', r: 1, c: 3 },
      { id: 'C', label: 'Gate C (Bottom)', r: 3, c: 2 },
      { id: 'D', label: 'Gate D (Left)', r: 2, c: 0 }
    ];

    let reflectors: TrajectoryReflector[] = [];
    let correctExit = exitGates[0];
    let entryGate = 'Port Alpha (Row 0, Col 0)';

    if (layoutIdx === 0) {
      reflectors = [
        { r: 0, c: 2, direction: '\\' },
        { r: 2, c: 2, direction: '/' }
      ];
      correctExit = exitGates[3]; // Gate D
      entryGate = 'Port 1 (Row 0, Col 0 heading East)';
    } else if (layoutIdx === 1) {
      reflectors = [
        { r: 1, c: 1, direction: '/' },
        { r: 1, c: 3, direction: '\\' },
        { r: 3, c: 3, direction: '/' }
      ];
      correctExit = exitGates[2]; // Gate C
      entryGate = 'Port 2 (Row 3, Col 1 heading North)';
    } else {
      reflectors = [
        { r: 2, c: 0, direction: '/' },
        { r: 0, c: 0, direction: '\\' },
        { r: 0, c: 3, direction: '\\' }
      ];
      correctExit = exitGates[1]; // Gate B
      entryGate = 'Port 3 (Row 2, Col 3 heading West)';
    }

    return {
      id: pId,
      subtype: 'trajectory_prediction',
      gridRows: 4,
      gridCols: 4,
      blocks: [],
      minMoves: 1,
      targetPos: { r: correctExit.r, c: correctExit.c },
      entryGate,
      reflectors,
      exitGates,
      correctExitGateId: correctExit.id,
      explanation: `Ray tracing: Projectile fired from ${entryGate}, undergoes internal 90° deflections off the optical reflectors, exiting squarely at ${correctExit.label}.`
    };
  }

  // 2. Collision Interception
  if (subtype === 'collision_intercept') {
    const scenarios = [
      {
        p1: { r: 0, c: 0, color: '#EF4444' },
        p2: { r: 0, c: 3, color: '#3B82F6' },
        target: { r: 2, c: 2 },
        options: [
          { id: '1', label: 'Sector Alpha', coordinate: 'Coordinate (2, 2)' },
          { id: '2', label: 'Sector Beta', coordinate: 'Coordinate (1, 3)' },
          { id: '3', label: 'Sector Gamma', coordinate: 'Coordinate (3, 1)' }
        ],
        correctId: '1',
        desc: 'Red (dx=+1, dy=+1) and Blue (dx=-1, dy=+1) converge at (2, 2).'
      },
      {
        p1: { r: 3, c: 0, color: '#EF4444' },
        p2: { r: 0, c: 1, color: '#3B82F6' },
        target: { r: 1, c: 1 },
        options: [
          { id: '1', label: 'Sector Delta', coordinate: 'Coordinate (1, 1)' },
          { id: '2', label: 'Sector Epsilon', coordinate: 'Coordinate (2, 0)' },
          { id: '3', label: 'Sector Zeta', coordinate: 'Coordinate (0, 2)' }
        ],
        correctId: '1',
        desc: 'Red Particle and Blue Particle cross trajectories at Sector Delta (1, 1).'
      }
    ];

    const chosen = scenarios[Math.floor(Math.random() * scenarios.length)];

    return {
      id: pId,
      subtype: 'collision_intercept',
      gridRows: 4,
      gridCols: 4,
      blocks: [
        { id: 'p1', type: 'ball', color: chosen.p1.color, r: chosen.p1.r, c: chosen.p1.c, length: 1 },
        { id: 'p2', type: 'ball', color: chosen.p2.color, r: chosen.p2.r, c: chosen.p2.c, length: 1 }
      ],
      minMoves: 1,
      targetPos: chosen.target,
      collisionOptions: chosen.options,
      correctCollisionId: chosen.correctId,
      explanation: chosen.desc
    };
  }

  // 3. Authentic Slide Motion Challenge Mazes (6x4 & 5x4 Grid Levels)
  if (level === 1) {
    // Beginner 5x4 Maze (3 min moves)
    return {
      id: pId,
      subtype: 'slide_puzzle',
      gridRows: 5,
      gridCols: 4,
      targetPos: { r: 0, c: 3 },
      minMoves: 3,
      blocks: [
        { id: 'target', type: 'target', color: '#0F172A', r: 0, c: 3, length: 1 },
        { id: 'rock1', type: 'rock', color: '#94A3B8', r: 1, c: 1, length: 1, texture: 'faceted' },
        { id: 'v_orange', type: 'vertical_bar', color: '#EA580C', r: 0, c: 0, length: 3, texture: 'bars' },
        { id: 'h_green', type: 'horizontal_bar', color: '#16A34A', r: 1, c: 2, length: 2, texture: 'stripes' },
        { id: 'v_blue', type: 'vertical_bar', color: '#0284C7', r: 2, c: 1, length: 3, texture: 'bars' },
        { id: 'ball', type: 'ball', color: '#DC2626', r: 4, c: 0, length: 1 }
      ],
      solutionSteps: [
        { blockId: 'v_blue', action: 'up', desc: 'Step 1 - Slide Blue vertical block up' },
        { blockId: 'h_green', action: 'left', desc: 'Step 2 - Slide Green horizontal block left' },
        { blockId: 'ball', action: 'up_right', desc: 'Step 3 - Move Red ball right and up into the black hole' }
      ],
      explanation: 'Slide Motion: Move Blue block up, shift Green block left to clear the path, then guide Red ball into the black hole.'
    };
  } else if (level === 2) {
    // Level 2: 5x4 Maze (4 min moves)
    return {
      id: pId,
      subtype: 'slide_puzzle',
      gridRows: 5,
      gridCols: 4,
      targetPos: { r: 0, c: 3 },
      minMoves: 4,
      blocks: [
        { id: 'target', type: 'target', color: '#0F172A', r: 0, c: 3, length: 1 },
        { id: 'rock1', type: 'rock', color: '#94A3B8', r: 1, c: 2, length: 1, texture: 'faceted' },
        { id: 'v_orange', type: 'vertical_bar', color: '#EA580C', r: 0, c: 0, length: 3, texture: 'bars' },
        { id: 'h_green', type: 'horizontal_bar', color: '#16A34A', r: 2, c: 1, length: 2, texture: 'stripes' },
        { id: 'v_purple', type: 'vertical_bar', color: '#581C87', r: 3, c: 2, length: 2, texture: 'bars' },
        { id: 'v_blue', type: 'vertical_bar', color: '#0284C7', r: 2, c: 3, length: 3, texture: 'bars' },
        { id: 'ball', type: 'ball', color: '#DC2626', r: 4, c: 0, length: 1 }
      ],
      solutionSteps: [
        { blockId: 'v_purple', action: 'up', desc: 'Step 1 - Slide Purple block up' },
        { blockId: 'h_green', action: 'right', desc: 'Step 2 - Slide Green block right' },
        { blockId: 'v_blue', action: 'down', desc: 'Step 3 - Slide Blue block down' },
        { blockId: 'ball', action: 'target', desc: 'Step 4 - Move Red ball into the target hole' }
      ],
      explanation: 'Slide Purple block up, shift Green block right, clear the column channel and steer the Red ball to the target.'
    };
  } else if (level === 3 || level === 4) {
    // Level 3 & 4: Authentic 6x4 Motion Challenge (6 min moves)
    return {
      id: pId,
      subtype: 'slide_puzzle',
      gridRows: 6,
      gridCols: 4,
      targetPos: { r: 0, c: 3 },
      minMoves: 6,
      blocks: [
        { id: 'target', type: 'target', color: '#0F172A', r: 0, c: 3, length: 1 },
        { id: 'v_orange', type: 'vertical_bar', color: '#EA580C', r: 0, c: 0, length: 3, texture: 'bars' }, // Orange 3x1 at (R0..R2, C0)
        { id: 'rock1', type: 'rock', color: '#94A3B8', r: 1, c: 1, length: 1, texture: 'faceted' },       // Fixed rock at (R1, C1)
        { id: 'h_green', type: 'horizontal_bar', color: '#16A34A', r: 1, c: 2, length: 2, texture: 'stripes' }, // Green 1x2 at (R1, C2..C3)
        { id: 'rock2', type: 'rock', color: '#94A3B8', r: 2, c: 2, length: 1, texture: 'faceted' },       // Fixed rock at (R2, C2)
        { id: 'v_blue', type: 'vertical_bar', color: '#0284C7', r: 3, c: 1, length: 3, texture: 'bars' },   // Blue 3x1 at (R3..R5, C1)
        { id: 'v_purple', type: 'vertical_bar', color: '#581C87', r: 4, c: 2, length: 2, texture: 'bars' }, // Purple 2x1 at (R4..R5, C2)
        { id: 'ball', type: 'ball', color: '#DC2626', r: 5, c: 0, length: 1 }                              // Red Ball at (R5, C0)
      ],
      solutionSteps: [
        { blockId: 'v_blue', action: 'up', desc: 'Step 1 - Blue block up (to R2..R4)' },
        { blockId: 'v_purple', action: 'up', desc: 'Step 2 - Purple block up (to R3..R4)' },
        { blockId: 'v_purple', action: 'left', desc: 'Step 3 - Purple block left (into C1)' },
        { blockId: 'h_green', action: 'up', desc: 'Step 4 - Green block up (to R0, over target)' },
        { blockId: 'h_green', action: 'left', desc: 'Step 5 - Green block left (to R0, C1..C2)' },
        { blockId: 'ball', action: 'target', desc: 'Step 6 - Red Ball right and up into the black hole!' }
      ],
      explanation: 'Slide Motion Challenge: 1) Blue block up -> 2) Purple block up -> 3) Purple block left -> 4) Green block up over target -> 5) Green block left -> 6) Ball rolls right and straight up into the black hole!'
    };
  } else {
    // Level 5: Expert 6x4 Maze (7 min moves)
    return {
      id: pId,
      subtype: 'slide_puzzle',
      gridRows: 6,
      gridCols: 4,
      targetPos: { r: 0, c: 0 },
      minMoves: 7,
      blocks: [
        { id: 'target', type: 'target', color: '#0F172A', r: 0, c: 0, length: 1 },
        { id: 'rock1', type: 'rock', color: '#94A3B8', r: 1, c: 1, length: 1, texture: 'faceted' },
        { id: 'rock2', type: 'rock', color: '#94A3B8', r: 3, c: 2, length: 1, texture: 'faceted' },
        { id: 'v_orange', type: 'vertical_bar', color: '#EA580C', r: 0, c: 3, length: 3, texture: 'bars' },
        { id: 'h_green', type: 'horizontal_bar', color: '#16A34A', r: 2, c: 0, length: 2, texture: 'stripes' },
        { id: 'v_blue', type: 'vertical_bar', color: '#0284C7', r: 3, c: 1, length: 3, texture: 'bars' },
        { id: 'v_purple', type: 'vertical_bar', color: '#581C87', r: 4, c: 3, length: 2, texture: 'bars' },
        { id: 'ball', type: 'ball', color: '#DC2626', r: 5, c: 0, length: 1 }
      ],
      solutionSteps: [
        { blockId: 'h_green', action: 'right', desc: 'Step 1 - Green block right' },
        { blockId: 'v_blue', action: 'up', desc: 'Step 2 - Blue block up' },
        { blockId: 'v_purple', action: 'up', desc: 'Step 3 - Purple block up' },
        { blockId: 'ball', action: 'target', desc: 'Step 4-7 - Navigate ball through cleared corridors into top-left target' }
      ],
      explanation: 'Expert Motion Challenge: Coordinate multi-block clearances around fixed stone obstacles to reach the extraction hole in minimum moves.'
    };
  }
}
