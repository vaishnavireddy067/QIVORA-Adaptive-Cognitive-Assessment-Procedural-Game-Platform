import { Difficulty } from '../../types';

export type MultitaskSubtype = 'dual_task' | 'split_attention' | 'priority_switching' | 'signal_tracking' | 'interrupt_handling';

export interface MultitaskQuestion {
  id: string;
  subtype: MultitaskSubtype;
  subtypeName: string;
  prompt: string;
  
  // Stream 1: Continuous gauge / visual beacon
  gaugeValue: number; // 0 to 100
  targetSafeZone: [number, number]; // e.g. [40, 60]
  isGaugeInZone: boolean;

  // Stream 2: Concurrent discrete arithmetic / verification task
  secondaryTask: {
    question: string;
    correctAnswer: string | number;
    options: (string | number)[];
  };

  // Priority interrupt alert
  interruptAlert?: {
    isActive: boolean;
    overrideCode: string;
  };

  options: string[];
  correctOptionIndex: number;
  explanation: string;
  timeLimitSec: number;
}

export function generateMultitaskQuestion(
  difficulty: Difficulty = 'medium',
  level: number = 1,
  subtypeIndex?: number
): MultitaskQuestion {
  const qId = 'multi_' + Math.random().toString(36).substring(2, 9);
  
  const gaugeVal = Math.floor(Math.random() * 90) + 5;
  const safeMin = 40;
  const safeMax = 65;
  const isGaugeInZone = gaugeVal >= safeMin && gaugeVal <= safeMax;

  // Discrete task
  const n1 = Math.floor(Math.random() * 8) + 12;
  const n2 = Math.floor(Math.random() * 7) + 6;
  const mathAns = n1 + n2;
  const isSumEven = mathAns % 2 === 0;

  const prompt = `Dual-Stream Executive Task: 1) Verify if the Reactor Gauge pointer is in the GREEN Safe Zone (${safeMin}-${safeMax}%). 2) Verify if the arithmetic sum (${n1} + ${n2}) is EVEN or ODD.`;

  const condition1 = isGaugeInZone ? 'Gauge SAFE' : 'Gauge CRITICAL';
  const condition2 = isSumEven ? 'Sum is EVEN' : 'Sum is ODD';

  const correctCombined = `${condition1} & ${condition2}`;
  
  const options = [
    'Gauge SAFE & Sum is EVEN',
    'Gauge SAFE & Sum is ODD',
    'Gauge CRITICAL & Sum is EVEN',
    'Gauge CRITICAL & Sum is ODD'
  ];

  const correctOptionIndex = options.indexOf(correctCombined);

  return {
    id: qId,
    subtype: 'dual_task',
    subtypeName: 'Dual-Stream Divided Executive Control',
    prompt,
    gaugeValue: gaugeVal,
    targetSafeZone: [safeMin, safeMax],
    isGaugeInZone,
    secondaryTask: {
      question: `${n1} + ${n2} = ?`,
      correctAnswer: mathAns,
      options: [mathAns - 1, mathAns, mathAns + 1]
    },
    options,
    correctOptionIndex,
    explanation: `Gauge reading is ${gaugeVal}% (${isGaugeInZone ? 'Inside Safe Zone 40-65%' : 'Outside Safe Zone'}). ${n1} + ${n2} = ${mathAns} (${isSumEven ? 'EVEN' : 'ODD'}). Correct decision: ${correctCombined}.`,
    timeLimitSec: 20
  };
}
