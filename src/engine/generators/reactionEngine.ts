export type ReactionSubtype = 'pure_latency' | 'go_no_go' | 'speed_match';
export type ReactionState = 'idle' | 'waiting' | 'ready' | 'early' | 'success';

export interface ReactionTask {
  id: string;
  subtype: ReactionSubtype;
  subtypeName: string;
  prompt: string;

  // 1. For Go / No-Go
  isGoCue?: boolean; // true = Green Circle (GO), false = Red Cross (NO-GO)

  // 2. For Symbol Speed Match
  symbolA?: string;
  symbolB?: string;
  isMatch?: boolean;

  explanation: string;
}

export function calculateReactionScore(rtMs: number, falseStart: boolean): number {
  if (falseStart) return 0;
  if (rtMs < 180) return 100;
  if (rtMs > 600) return Math.max(10, Math.round(100 - (rtMs - 180) / 6));
  const score = Math.round(100 - ((rtMs - 180) / 420) * 70);
  return Math.max(10, Math.min(100, score));
}

export function getRandomDelayMs(min: number = 1400, max: number = 3600): number {
  return Math.floor(Math.random() * (max - min)) + min;
}

export function generateReactionTask(subtypeIndex: number = 0): ReactionTask {
  const qId = 'react_' + Math.random().toString(36).substring(2, 9);

  if (subtypeIndex === 1) {
    // Go / No-Go
    const isGo = Math.random() < 0.65;
    return {
      id: qId,
      subtype: 'go_no_go',
      subtypeName: 'Go / No-Go Inhibition',
      prompt: isGo
        ? 'GREEN CIRCLE DETECTED: Tap IMMEDIATELY!'
        : 'RED CROSS DETECTED: INHIBIT! Do NOT tap!',
      isGoCue: isGo,
      explanation: isGo
        ? 'Target Go cue (Green Circle) requires an immediate speed reaction.'
        : 'Distractor No-Go cue (Red Cross) strictly demands motor inhibition.'
    };
  }

  if (subtypeIndex === 2) {
    // Speed Match
    const symbols = ['▲', '■', '●', '◆', '★', '✚'];
    const symA = symbols[Math.floor(Math.random() * symbols.length)];
    const isMatch = Math.random() < 0.5;
    const symB = isMatch ? symA : symbols.filter(s => s !== symA)[Math.floor(Math.random() * (symbols.length - 1))];

    return {
      id: qId,
      subtype: 'speed_match',
      subtypeName: 'Symbol Speed Match',
      prompt: 'Decide in under 400ms: Are both symbols IDENTICAL?',
      symbolA: symA,
      symbolB: symB,
      isMatch,
      explanation: isMatch
        ? `Both symbols are ${symA} (Identical match).`
        : `Discrepancy: Symbol A (${symA}) differs from Symbol B (${symB}).`
    };
  }

  // Subtype 0: Pure Latency
  return {
    id: qId,
    subtype: 'pure_latency',
    subtypeName: 'Pure Latency Reaction',
    prompt: 'Wait for the canvas to illuminate GREEN, then tap as fast as humanly possible:',
    explanation: 'Measures raw visual-motor conduction speed from retina to peripheral muscle response.'
  };
}
