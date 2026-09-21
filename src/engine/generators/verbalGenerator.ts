import { Difficulty } from '../../types';

export type VerbalSubtype = 'word_relationships' | 'classification' | 'sentence_logic' | 'assumptions' | 'inference';

export interface VerbalQuestion {
  id: string;
  subtype: VerbalSubtype;
  subtypeName: string;
  prompt: string;
  contextText?: string;
  basePair?: { left: string; right: string };
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  timeLimitSec: number;
}

// ── 1. Lexical Word Relationships (Analogies) ────────────────────────
const ANALOGY_POOLS: {
  pair: [string, string];
  correct: [string, string];
  distractors: [string, string][];
  relation: string;
}[] = [
  {
    pair: ['THERMOMETER', 'TEMPERATURE'],
    correct: ['SPEEDOMETER', 'VELOCITY'],
    distractors: [['CLOCK', 'BATTERY'], ['MICROSCOPE', 'GLASS'], ['COMPASS', 'WEIGHT']],
    relation: 'Instrument to measured physical dimension'
  },
  {
    pair: ['CATALYST', 'REACTION'],
    correct: ['INCENTIVE', 'PRODUCTIVITY'],
    distractors: [['BRAKE', 'MOTION'], ['FUEL', 'ENGINE'], ['BALLAST', 'SHIP']],
    relation: 'Agent that accelerates or stimulates an outcome'
  },
  {
    pair: ['METAPHOR', 'LITERAL'],
    correct: ['ANOMALY', 'NORMAL'],
    distractors: [['POEM', 'RHYME'], ['ALLEGORY', 'FICTION'], ['SYNONYM', 'MEANING']],
    relation: 'Figurative or divergent concept versus standard/literal baseline'
  },
  {
    pair: ['ARCHIPELAGO', 'ISLAND'],
    correct: ['CONSTELLATION', 'STAR'],
    distractors: [['FOREST', 'ANIMAL'], ['DESERT', 'OASIS'], ['OCEAN', 'WAVE']],
    relation: 'Collective whole composed of individual discrete units'
  },
  {
    pair: ['CENSOR', 'INFORMATION'],
    correct: ['PURIFY', 'CONTAMINANT'],
    distractors: [['EDIT', 'BOOK'], ['INSPECT', 'GOODS'], ['TRANSMIT', 'SIGNAL']],
    relation: 'Action aimed at suppressing or eliminating specific undesirable elements'
  }
];

function generateWordRelationships(difficulty: Difficulty): VerbalQuestion {
  const qId = 'verb_ana_' + Math.random().toString(36).substring(2, 9);
  const item = ANALOGY_POOLS[Math.floor(Math.random() * ANALOGY_POOLS.length)];
  
  const correctStr = `${item.correct[0]} : ${item.correct[1]}`;
  const options = [correctStr, ...item.distractors.map(d => `${d[0]} : ${d[1]}`)].sort(() => Math.random() - 0.5);
  const correctOptionIndex = options.indexOf(correctStr);

  return {
    id: qId,
    subtype: 'word_relationships',
    subtypeName: 'Word Relationships & Lexical Analogy',
    prompt: `Identify the word pair that expresses the EXACT relational logic as ${item.pair[0]} : ${item.pair[1]}`,
    basePair: { left: item.pair[0], right: item.pair[1] },
    options,
    correctOptionIndex,
    explanation: `Analogy Relationship (${item.relation}): Just as a ${item.pair[0]} directly measures/relates to ${item.pair[1]}, a ${item.correct[0]} relates to ${item.correct[1]}.`,
    timeLimitSec: 20
  };
}

// ── 2. Lexical Classification (Odd One Out) ──────────────────────────
const CLASSIFICATION_POOLS = [
  {
    category: 'Biochemical Enzymes (Proteins)',
    correctOdd: 'GLUCOSE',
    members: ['PEPSIN', 'AMYLASE', 'LIPASE', 'LACTASE'],
    explanation: 'Pepsin, Amylase, Lipase, and Lactase are metabolic enzymes (proteins), whereas Glucose is a simple monosaccharide carbohydrate.'
  },
  {
    category: 'Non-Renewable Fossil Energy Sources',
    correctOdd: 'GEOTHERMAL',
    members: ['ANTHRACITE', 'LIGNITE', 'PETROLEUM', 'BITUMEN'],
    explanation: 'Anthracite, Lignite, Petroleum, and Bitumen are finite hydrocarbon fossil fuels, whereas Geothermal is a renewable thermal energy source.'
  },
  {
    category: 'Sovereign Landlocked Nations',
    correctOdd: 'VIETNAM',
    members: ['PARAGUAY', 'SWITZERLAND', 'BOLIVIA', 'AUSTRIA'],
    explanation: 'Paraguay, Switzerland, Bolivia, and Austria are completely landlocked without direct oceanic coastline, whereas Vietnam has an extensive maritime coastline.'
  }
];

function generateClassification(difficulty: Difficulty): VerbalQuestion {
  const qId = 'verb_cls_' + Math.random().toString(36).substring(2, 9);
  const pool = CLASSIFICATION_POOLS[Math.floor(Math.random() * CLASSIFICATION_POOLS.length)];
  
  const options = [pool.correctOdd, ...pool.members.slice(0, 3)].sort(() => Math.random() - 0.5);
  const correctOptionIndex = options.indexOf(pool.correctOdd);

  return {
    id: qId,
    subtype: 'classification',
    subtypeName: 'Categorical Invariance & Odd-One-Out',
    prompt: 'Four of the following words share a strict categorical invariant. Identify the single exception:',
    options,
    correctOptionIndex,
    explanation: pool.explanation,
    timeLimitSec: 20
  };
}

// ── 3. Critical Inference & Assumptions ──────────────────────────────
const INFERENCE_POOLS = [
  {
    context: 'A multinational logistics provider reported that transitioning 40% of its regional fleet to electric powertrains reduced urban particulate emissions by 28% while simultaneously lowering per-kilometer maintenance expenses by 14%. However, total operational power costs increased by 6% due to high daytime commercial charging tariff rates.',
    prompt: 'Which conclusion is NECESSARILY TRUE based strictly on the passage above?',
    correct: 'Daytime commercial electricity rates contributed to an increase in total energy costs despite fleet maintenance savings.',
    distractors: [
      'Electric powertrains will completely eliminate urban particulate emissions within five years.',
      'Nighttime charging would have yielded an overall 14% net financial profit.',
      'The company plans to revert back to diesel powertrains due to commercial charging tariffs.'
    ],
    explanation: 'The passage explicitly states that total power costs increased by 6% due to daytime commercial charging tariff rates.'
  },
  {
    context: 'Recent clinical trials demonstrate that compound KX-409 suppresses viral replication by 92% in vitro. However, systemic bioavailability drops to under 8% when administered orally due to first-pass hepatic enzymatic degradation.',
    prompt: 'What unstated assumption underlies the proposal that KX-409 must be delivered via intravenous or sublingual formulations?',
    correct: 'Alternative delivery pathways can bypass the hepatic first-pass enzymatic degradation that degrades oral doses.',
    distractors: [
      'Oral administration is always fatal for patients with viral infections.',
      'Compound KX-409 is ineffective against all bacterial pathogens.',
      'Enzymatic degradation only occurs when body temperature exceeds 37°C.'
    ],
    explanation: 'Proposing IV or sublingual delivery assumes these methods successfully circumvent the liver first-pass metabolism that ruins oral bioavailability.'
  }
];

function generateInference(difficulty: Difficulty): VerbalQuestion {
  const qId = 'verb_inf_' + Math.random().toString(36).substring(2, 9);
  const item = INFERENCE_POOLS[Math.floor(Math.random() * INFERENCE_POOLS.length)];
  
  const options = [item.correct, ...item.distractors].sort(() => Math.random() - 0.5);
  const correctOptionIndex = options.indexOf(item.correct);

  return {
    id: qId,
    subtype: 'inference',
    subtypeName: 'Critical Inference & Reading Logic',
    prompt: item.prompt,
    contextText: item.context,
    options,
    correctOptionIndex,
    explanation: item.explanation,
    timeLimitSec: 30
  };
}

// ── Primary Dispatcher ────────────────────────────────────────────────
export function generateVerbalQuestion(
  difficulty: Difficulty = 'medium',
  level: number = 1,
  subtypeIndex?: number
): VerbalQuestion {
  if (subtypeIndex !== undefined) {
    if (subtypeIndex === 0) return generateWordRelationships(difficulty);
    if (subtypeIndex === 1) return generateClassification(difficulty);
    if (subtypeIndex === 2 || subtypeIndex === 3 || subtypeIndex === 4) return generateInference(difficulty);
  }

  if (level <= 2) return generateWordRelationships(difficulty);
  if (level === 3) return generateClassification(difficulty);
  return generateInference(difficulty);
}
