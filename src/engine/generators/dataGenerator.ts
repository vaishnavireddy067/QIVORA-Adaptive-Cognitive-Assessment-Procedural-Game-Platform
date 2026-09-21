import { Difficulty } from '../../types';

export type DataSubtype = 'charts' | 'tables' | 'trends' | 'comparison' | 'missing_data';

export interface DataChartPoint {
  label: string;
  valueA: number;
  valueB?: number;
  target?: number;
}

export interface DataQuestion {
  id: string;
  subtype: DataSubtype;
  subtypeName: string;
  prompt: string;
  chartType: 'bar' | 'table' | 'line';
  title: string;
  dataPoints: DataChartPoint[];
  metricUnit: string;
  options: (string | number)[];
  correctOptionIndex: number;
  explanation: string;
  timeLimitSec: number;
}

// ── 1. Bar & Line Chart Statistical Analysis ──────────────────────────
function generateChartQuestion(difficulty: Difficulty): DataQuestion {
  const qId = 'data_cht_' + Math.random().toString(36).substring(2, 9);
  
  const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
  const baseRevenue = Math.floor(Math.random() * 20) + 40; // 40-60
  const g1 = Math.floor(Math.random() * 10) + 5; // +5-15
  const g2 = Math.floor(Math.random() * 10) + 8;
  const g3 = Math.floor(Math.random() * 10) + 12;

  const revQ1 = baseRevenue;
  const revQ2 = revQ1 + g1;
  const revQ3 = revQ2 + g2;
  const revQ4 = revQ3 + g3;

  const dataPoints: DataChartPoint[] = [
    { label: 'Q1', valueA: revQ1, valueB: Math.round(revQ1 * 0.65) },
    { label: 'Q2', valueA: revQ2, valueB: Math.round(revQ2 * 0.60) },
    { label: 'Q3', valueA: revQ3, valueB: Math.round(revQ3 * 0.70) },
    { label: 'Q4', valueA: revQ4, valueB: Math.round(revQ4 * 0.62) }
  ];

  // Question: Percentage increase from Q1 to Q4
  const netIncrease = revQ4 - revQ1;
  const pctGrowth = Math.round((netIncrease / revQ1) * 100);

  const distractors = [pctGrowth + 12, Math.max(10, pctGrowth - 10), pctGrowth + 24];
  const options = [`${pctGrowth}%`, ...distractors.map(d => `${d}%`)].sort(() => Math.random() - 0.5);
  const correctOptionIndex = options.indexOf(`${pctGrowth}%`);

  return {
    id: qId,
    subtype: 'charts',
    subtypeName: 'Quarterly Revenue & Margin Analysis',
    prompt: `Based on the Revenue vs Operating Cost chart, what is the approximate percentage growth in Total Revenue from Q1 to Q4?`,
    chartType: 'bar',
    title: 'Enterprise Revenue vs Cost by Quarter ($ Millions)',
    dataPoints,
    metricUnit: '$ Millions',
    options,
    correctOptionIndex,
    explanation: `Q1 Revenue = $${revQ1}M, Q4 Revenue = $${revQ4}M. Net Growth = $${revQ4}M - $${revQ1}M = $${netIncrease}M. Growth rate = (${netIncrease} / ${revQ1}) × 100 = ${pctGrowth}%.`,
    timeLimitSec: 25
  };
}

// ── 2. Table Data & Missing Value Deduction ───────────────────────────
function generateTableQuestion(difficulty: Difficulty): DataQuestion {
  const qId = 'data_tbl_' + Math.random().toString(36).substring(2, 9);
  
  const depts = ['Engineering', 'Marketing', 'Operations', 'Sales'];
  const dataPoints: DataChartPoint[] = [
    { label: 'Engineering', valueA: 120, valueB: 18 },
    { label: 'Marketing', valueA: 45, valueB: 9 },
    { label: 'Operations', valueA: 80, valueB: 12 },
    { label: 'Sales', valueA: 95, valueB: 15 }
  ];

  // Question: Highest cost per employee
  // Engineering: 120 / 18 = 6.66
  // Marketing: 45 / 9 = 5.0
  // Operations: 80 / 12 = 6.66
  // Sales: 95 / 15 = 6.33

  const correctDept = 'Engineering & Operations (Tie: ~$6.67k)';
  const options = [
    'Engineering ($6.67k per head)',
    'Marketing ($5.00k per head)',
    'Operations ($6.67k per head)',
    'Sales ($6.33k per head)'
  ].sort(() => Math.random() - 0.5);
  const correctOptionIndex = options.findIndex(o => o.includes('Engineering'));

  return {
    id: qId,
    subtype: 'tables',
    subtypeName: 'Departmental Budget & Headcount Cross-Tabulation',
    prompt: 'Which department incurs the highest budget expenditure per headcount member?',
    chartType: 'table',
    title: 'Departmental Resource Allocation Matrix',
    dataPoints,
    metricUnit: 'Headcount vs Budget ($k)',
    options,
    correctOptionIndex,
    explanation: 'Budget / Headcount: Engineering = $120k / 18 = $6.67k per head, which is the highest expenditure intensity.',
    timeLimitSec: 25
  };
}

// ── Primary Dispatcher ────────────────────────────────────────────────
export function generateDataQuestion(
  difficulty: Difficulty = 'medium',
  level: number = 1,
  subtypeIndex?: number
): DataQuestion {
  if (subtypeIndex !== undefined) {
    if (subtypeIndex === 0 || subtypeIndex === 2) return generateChartQuestion(difficulty);
    return generateTableQuestion(difficulty);
  }

  if (level <= 2) return generateChartQuestion(difficulty);
  return generateTableQuestion(difficulty);
}
