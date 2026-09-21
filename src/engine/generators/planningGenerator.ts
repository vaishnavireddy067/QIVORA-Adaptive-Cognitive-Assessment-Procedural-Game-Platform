import { Difficulty } from '../../types';

export type PlanningSubtype = 'route_planning' | 'minimum_moves' | 'resource_allocation' | 'multi_step' | 'goal_achievement';

export interface RouteNode {
  id: string;
  label: string;
  x: number;
  y: number;
}

export interface RouteEdge {
  from: string;
  to: string;
  cost: number;
}

export interface PlanningQuestion {
  id: string;
  subtype: PlanningSubtype;
  subtypeName: string;
  prompt: string;
  level: number;
  
  // Route / Graph Data
  nodes?: RouteNode[];
  edges?: RouteEdge[];
  startNodeId?: string;
  targetNodeId?: string;

  // Resource / Step Data
  resourceBudget?: number;
  constraintsList?: string[];

  options: (string | number)[];
  correctOptionIndex: number;
  explanation: string;
  timeLimitSec: number;
}

// ── 1. Route Planning & Shortest Path Graph ───────────────────────────
function generateRoutePlanning(difficulty: Difficulty, level: number): PlanningQuestion {
  const qId = 'plan_rt_' + Math.random().toString(36).substring(2, 9);
  
  const nodes: RouteNode[] = [
    { id: 'A', label: 'Origin (A)', x: 15, y: 50 },
    { id: 'B', label: 'Hub B', x: 40, y: 20 },
    { id: 'C', label: 'Hub C', x: 40, y: 80 },
    { id: 'D', label: 'Hub D', x: 65, y: 30 },
    { id: 'E', label: 'Hub E', x: 65, y: 70 },
    { id: 'F', label: 'Goal (F)', x: 88, y: 50 }
  ];

  // Dynamic edge weights
  const wAB = Math.floor(Math.random() * 3) + 3; // 3-5
  const wAC = Math.floor(Math.random() * 3) + 4; // 4-6
  const wBD = Math.floor(Math.random() * 3) + 2; // 2-4
  const wBC = Math.floor(Math.random() * 2) + 2; // 2-3
  const wCE = Math.floor(Math.random() * 3) + 3; // 3-5
  const wDE = Math.floor(Math.random() * 2) + 2; // 2-3
  const wDF = Math.floor(Math.random() * 3) + 4; // 4-6
  const wEF = Math.floor(Math.random() * 3) + 3; // 3-5

  const edges: RouteEdge[] = [
    { from: 'A', to: 'B', cost: wAB },
    { from: 'A', to: 'C', cost: wAC },
    { from: 'B', to: 'D', cost: wBD },
    { from: 'B', to: 'C', cost: wBC },
    { from: 'C', to: 'E', cost: wCE },
    { from: 'D', to: 'E', cost: wDE },
    { from: 'D', to: 'F', cost: wDF },
    { from: 'E', to: 'F', cost: wEF }
  ];

  // Calculate distinct path costs from A to F
  const path1 = wAB + wBD + wDF; // A->B->D->F
  const path2 = wAB + wBD + wDE + wEF; // A->B->D->E->F
  const path3 = wAB + wBC + wCE + wEF; // A->B->C->E->F
  const path4 = wAC + wCE + wEF; // A->C->E->F

  const shortestCost = Math.min(path1, path2, path3, path4);

  const distractors = new Set<number>();
  distractors.add(shortestCost + 2);
  distractors.add(shortestCost + 3);
  distractors.add(Math.max(4, shortestCost - 2));

  const options = Array.from(distractors).slice(0, 3);
  options.push(shortestCost);
  options.sort((a, b) => a - b);
  const correctOptionIndex = options.indexOf(shortestCost);

  return {
    id: qId,
    subtype: 'route_planning',
    subtypeName: 'Route Planning & Shortest Path',
    prompt: 'Calculate the absolute minimum cost path from Origin Node (A) to Goal Node (F):',
    level,
    nodes,
    edges,
    startNodeId: 'A',
    targetNodeId: 'F',
    options,
    correctOptionIndex,
    explanation: `Dijkstra path evaluation: Path A→B→D→F (${path1}), A→C→E→F (${path4}), and A→B→C→E→F (${path3}). The optimal shortest route has a total cost of ${shortestCost}.`,
    timeLimitSec: 25
  };
}

// ── 2. Minimum Moves & Resource Allocation ───────────────────────────
function generateResourceAllocation(difficulty: Difficulty, level: number): PlanningQuestion {
  const qId = 'plan_res_' + Math.random().toString(36).substring(2, 9);
  
  const budget = 100;
  const scenarios = [
    {
      prompt: 'A server farm must deploy 3 microservices (Alpha, Beta, Gamma). Alpha requires 30 units, Beta requires 45 units, and Gamma requires 35 units. Upgrading a priority booster saves 10 units on Beta. What is the minimum deficit/surplus with a 100 unit power budget?',
      correct: 'Exactly 0 units (Balanced)',
      distractors: ['Deficit of 10 units', 'Surplus of 10 units', 'Deficit of 20 units'],
      explanation: 'Base: 30 + 45 + 35 = 110 units. With the 10-unit saving on Beta, total demand becomes 100 units, perfectly matching the 100-unit budget.'
    },
    {
      prompt: 'Three distribution trucks have capacities of 18 tons, 24 tons, and 30 tons. What is the minimum trips required to transport 144 tons of freight at 100% capacity utilization?',
      correct: '2 full fleet cycles (6 trips total)',
      distractors: ['3 fleet cycles (9 trips)', '1 fleet cycle (3 trips)', '4 fleet cycles (12 trips)'],
      explanation: 'Combined fleet capacity per single cycle = 18 + 24 + 30 = 72 tons. 144 tons / 72 tons = exactly 2 fleet cycles (6 vehicle trips).'
    }
  ];

  const chosen = scenarios[Math.floor(Math.random() * scenarios.length)];
  const options = [chosen.correct, ...chosen.distractors].sort(() => Math.random() - 0.5);
  const correctOptionIndex = options.indexOf(chosen.correct);

  return {
    id: qId,
    subtype: 'resource_allocation',
    subtypeName: 'Constraint Optimization & Resource Allocation',
    prompt: chosen.prompt,
    level,
    resourceBudget: budget,
    options,
    correctOptionIndex,
    explanation: chosen.explanation,
    timeLimitSec: 25
  };
}

// ── Primary Dispatcher ────────────────────────────────────────────────
export function generatePlanningQuestion(
  difficulty: Difficulty = 'medium',
  level: number = 1,
  subtypeIndex?: number
): PlanningQuestion {
  if (subtypeIndex !== undefined) {
    if (subtypeIndex === 0 || subtypeIndex === 1) return generateRoutePlanning(difficulty, level);
    return generateResourceAllocation(difficulty, level);
  }

  if (level <= 2) return generateRoutePlanning(difficulty, level);
  return generateResourceAllocation(difficulty, level);
}
