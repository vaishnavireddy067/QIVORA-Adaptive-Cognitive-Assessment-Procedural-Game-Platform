import React, { useState, useEffect, useRef } from 'react';
import { Swords, Bot, User, Trophy, Zap, Clock, Shield, RotateCcw, ArrowLeft, CheckCircle2, XCircle, Flame } from 'lucide-react';
import { sounds } from '../services/soundEngine';
import confetti from 'canvas-confetti';

interface GhostDuelPageProps {
  onBack: () => void;
  userName?: string;
}

interface BotPersona {
  id: string;
  name: string;
  elo: number;
  avatar: string;
  speedMs: [number, number]; // min and max reaction time per question
  accuracy: number; // probability of correct answer
  badge: string;
  color: string;
}

const BOTS: BotPersona[] = [
  {
    id: 'spark',
    name: 'Novice Spark',
    elo: 950,
    avatar: '⚡',
    speedMs: [2400, 3800],
    accuracy: 0.72,
    badge: 'Apprentice',
    color: '#3B82F6'
  },
  {
    id: 'synapse',
    name: 'Synapse AI',
    elo: 1450,
    avatar: '🧠',
    speedMs: [1600, 2600],
    accuracy: 0.88,
    badge: 'Challenger',
    color: '#8B5CF6'
  },
  {
    id: 'cortex',
    name: 'Quantum Cortex',
    elo: 1980,
    avatar: '🌌',
    speedMs: [1000, 1800],
    accuracy: 0.96,
    badge: 'Grandmaster',
    color: '#EC4899'
  }
];

// Duel Question Schema
interface DuelQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  type: 'pattern' | 'switch' | 'math' | 'memory';
}

function generateDuelQuestion(): DuelQuestion {
  const category = ['math', 'pattern', 'switch', 'spatial', 'logic'][Math.floor(Math.random() * 5)];

  if (category === 'math') {
    const mathType = Math.floor(Math.random() * 3);
    if (mathType === 0) {
      // (A * B) - (C / D)
      const a = Math.floor(Math.random() * 10) + 11; // 11-20
      const b = Math.floor(Math.random() * 7) + 3;  // 3-9
      const d = Math.floor(Math.random() * 4) + 2;  // 2-5
      const mult = Math.floor(Math.random() * 10) + 5; // 5-14
      const c = d * mult;
      const ans = (a * b) - mult;
      const opts = [ans, ans + 4, ans - 4, ans + 8].sort(() => Math.random() - 0.5);
      return {
        question: `Rapid Math: (${a} × ${b}) - (${c} ÷ ${d}) = ?`,
        options: opts.map(String),
        correctIndex: opts.indexOf(ans),
        explanation: `${a * b} - ${mult} = ${ans}`,
        type: 'math'
      };
    } else if (mathType === 1) {
      // (A + B) * C - D
      const a = Math.floor(Math.random() * 15) + 10;
      const b = Math.floor(Math.random() * 15) + 5;
      const c = Math.floor(Math.random() * 3) + 2;
      const d = Math.floor(Math.random() * 20) + 5;
      const ans = (a + b) * c - d;
      const opts = [ans, ans + 6, ans - 10, ans + 12].sort(() => Math.random() - 0.5);
      return {
        question: `Mental Arithmetic: (${a} + ${b}) × ${c} - ${d} = ?`,
        options: opts.map(String),
        correctIndex: opts.indexOf(ans),
        explanation: `${a + b} × ${c} - ${d} = ${(a + b) * c} - ${d} = ${ans}`,
        type: 'math'
      };
    } else {
      // Missing operand: A * ? + B = C
      const a = Math.floor(Math.random() * 6) + 4; // 4-9
      const ans = Math.floor(Math.random() * 7) + 3; // 3-9
      const b = Math.floor(Math.random() * 15) + 5;
      const c = a * ans + b;
      const opts = [ans, ans + 1, ans - 1, ans + 2].sort(() => Math.random() - 0.5);
      return {
        question: `Constraint Equation: ${a} × [ ? ] + ${b} = ${c}`,
        options: opts.map(String),
        correctIndex: opts.indexOf(ans),
        explanation: `[ ? ] = (${c} - ${b}) ÷ ${a} = ${c - b} ÷ ${a} = ${ans}`,
        type: 'math'
      };
    }
  }

  if (category === 'pattern') {
    const seqType = Math.floor(Math.random() * 4);
    if (seqType === 0) {
      // 2n + k
      const k = Math.floor(Math.random() * 3) + 1;
      const start = Math.floor(Math.random() * 4) + 2;
      const n1 = start;
      const n2 = 2 * n1 + k;
      const n3 = 2 * n2 + k;
      const n4 = 2 * n3 + k;
      const ans = 2 * n4 + k;
      const opts = [ans, ans + 4, ans - 6, ans + 10].sort(() => Math.random() - 0.5);
      return {
        question: `Complete the Sequence: ${n1}, ${n2}, ${n3}, ${n4}, ?`,
        options: opts.map(String),
        correctIndex: opts.indexOf(ans),
        explanation: `Rule: 2n + ${k} (${n4} × 2 + ${k} = ${ans})`,
        type: 'pattern'
      };
    } else if (seqType === 1) {
      // Polynomial series: n^2 + offset
      const offset = Math.floor(Math.random() * 4) + 1;
      const s = Math.floor(Math.random() * 3) + 2;
      const nums = [s, s + 1, s + 2, s + 3].map(x => x * x + offset);
      const ans = (s + 4) * (s + 4) + offset;
      const opts = [ans, ans + 5, ans - 7, ans + 11].sort(() => Math.random() - 0.5);
      return {
        question: `Polynomial Series: ${nums.join(', ')}, ?`,
        options: opts.map(String),
        correctIndex: opts.indexOf(ans),
        explanation: `Rule: n² + ${offset} (${s + 4}² + ${offset} = ${(s + 4) * (s + 4)} + ${offset} = ${ans})`,
        type: 'pattern'
      };
    } else if (seqType === 2) {
      // Fibonacci style: a, b, a+b, a+2b, 2a+3b...
      const a = Math.floor(Math.random() * 5) + 2;
      const b = Math.floor(Math.random() * 5) + 3;
      const s1 = a;
      const s2 = b;
      const s3 = s1 + s2;
      const s4 = s2 + s3;
      const s5 = s3 + s4;
      const ans = s4 + s5;
      const opts = [ans, ans + 3, ans - 4, ans + 7].sort(() => Math.random() - 0.5);
      return {
        question: `Fibonacci Progression: ${s1}, ${s2}, ${s3}, ${s4}, ${s5}, ?`,
        options: opts.map(String),
        correctIndex: opts.indexOf(ans),
        explanation: `Rule: Sum of previous two terms (${s4} + ${s5} = ${ans})`,
        type: 'pattern'
      };
    } else {
      // Alternating step (+x, -y)
      const inc = Math.floor(Math.random() * 4) + 5;
      const dec = Math.floor(Math.random() * 3) + 2;
      const start = Math.floor(Math.random() * 10) + 15;
      const s1 = start;
      const s2 = s1 + inc;
      const s3 = s2 - dec;
      const s4 = s3 + inc;
      const s5 = s4 - dec;
      const ans = s5 + inc;
      const opts = [ans, ans + 2, ans - 3, ans + 5].sort(() => Math.random() - 0.5);
      return {
        question: `Alternating Series: ${s1}, ${s2}, ${s3}, ${s4}, ${s5}, ?`,
        options: opts.map(String),
        correctIndex: opts.indexOf(ans),
        explanation: `Rule: Alternating (+${inc}, -${dec}) -> Next is ${s5} + ${inc} = ${ans}`,
        type: 'pattern'
      };
    }
  }

  if (category === 'switch') {
    const shapes = ['Triangle', 'Square', 'Circle', 'Diamond', 'Star', 'Cross'];
    const colors = ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange'];
    const targetShape = shapes[Math.floor(Math.random() * shapes.length)];
    const targetColor = colors[Math.floor(Math.random() * colors.length)];
    const matchByColor = Math.random() > 0.5;

    if (matchByColor) {
      const correctShape = shapes.filter(s => s !== targetShape)[Math.floor(Math.random() * (shapes.length - 1))];
      const correct = `${targetColor} ${correctShape}`;
      const wrongColors = colors.filter(c => c !== targetColor);
      const wrong1 = `${wrongColors[0]} ${targetShape}`;
      const wrong2 = `${wrongColors[1]} ${shapes[0]}`;
      const wrong3 = `${wrongColors[2]} ${shapes[1]}`;
      const opts = [correct, wrong1, wrong2, wrong3].sort(() => Math.random() - 0.5);
      return {
        question: `Switch Rule: Match by COLOR, not SHAPE. Target: ${targetColor.toUpperCase()} ${targetShape.toUpperCase()}`,
        options: opts,
        correctIndex: opts.indexOf(correct),
        explanation: `Rule requires matching COLOR (${targetColor}). Selected ${correct}.`,
        type: 'switch'
      };
    } else {
      const correctColor = colors.filter(c => c !== targetColor)[Math.floor(Math.random() * (colors.length - 1))];
      const correct = `${correctColor} ${targetShape}`;
      const wrongShapes = shapes.filter(s => s !== targetShape);
      const wrong1 = `${targetColor} ${wrongShapes[0]}`;
      const wrong2 = `${colors[0]} ${wrongShapes[1]}`;
      const wrong3 = `${colors[1]} ${wrongShapes[2]}`;
      const opts = [correct, wrong1, wrong2, wrong3].sort(() => Math.random() - 0.5);
      return {
        question: `Switch Rule: Match by SHAPE, not COLOR. Target: ${targetColor.toUpperCase()} ${targetShape.toUpperCase()}`,
        options: opts,
        correctIndex: opts.indexOf(correct),
        explanation: `Rule requires matching SHAPE (${targetShape}). Selected ${correct}.`,
        type: 'switch'
      };
    }
  }

  if (category === 'spatial') {
    const spatialPuzzles = [
      {
        q: 'Spatial Rotation: Rotate symbol 90° Clockwise: ◢',
        options: ['◣', '◤', '◥', '▲'],
        ans: '◣',
        exp: '90° clockwise rotation turns the bottom-right corner ◢ into bottom-left ◣.'
      },
      {
        q: 'Spatial Inversion: Rotate 180°, then invert vertically: ◀',
        options: ['▶', '▲', '▼', '◀'],
        ans: '▶',
        exp: '180° rotation yields ▶, vertical inversion preserves horizontal arrow ▶.'
      },
      {
        q: 'Axis Reflection: Reflect across the Vertical Axis: ◧',
        options: ['◨', '◩', '◪', '■'],
        ans: '◨',
        exp: 'Vertical reflection mirrors left-half fill ◧ into right-half fill ◨.'
      },
      {
        q: 'Coordinate Vector: Start at (2,3), move 2 units West, 3 units North:',
        options: ['(0, 6)', '(4, 6)', '(0, 0)', '(4, 0)'],
        ans: '(0, 6)',
        exp: 'West reduces X by 2 (2 - 2 = 0), North increases Y by 3 (3 + 3 = 6) -> (0, 6).'
      },
      {
        q: 'Grid Symmetry: Which pair has identical 180° rotational symmetry?',
        options: ['Z and S', 'A and B', 'E and F', 'L and T'],
        ans: 'Z and S',
        exp: 'Letters Z and S both look identical when rotated 180 degrees.'
      }
    ];
    const p = spatialPuzzles[Math.floor(Math.random() * spatialPuzzles.length)];
    const opts = [...p.options].sort(() => Math.random() - 0.5);
    return {
      question: p.q,
      options: opts,
      correctIndex: opts.indexOf(p.ans),
      explanation: p.exp,
      type: 'pattern'
    };
  }

  // Logic / Deduction
  const logicPuzzles = [
    {
      q: 'Deductive Logic: If all Glyphs are Tokens, and no Tokens are Units, which is guaranteed?',
      options: ['No Glyphs are Units', 'Some Glyphs are Units', 'All Units are Glyphs', 'Some Units are Tokens'],
      ans: 'No Glyphs are Units',
      exp: 'Syllogism: Since Glyphs are a subset of Tokens and no Tokens are Units, no Glyphs can be Units.'
    },
    {
      q: 'Ordering Rule: Maya finished before Leo. Sam finished after Leo. Who finished first?',
      options: ['Maya', 'Leo', 'Sam', 'Cannot be determined'],
      ans: 'Maya',
      exp: 'Order: Maya -> Leo -> Sam. Maya finished first.'
    },
    {
      q: 'Conditional Logic: A > B, B = C, C > D. Which statement MUST be false?',
      options: ['D > A', 'A > D', 'A > C', 'B > D'],
      ans: 'D > A',
      exp: 'Since A > B = C > D, A is strictly greater than D. Therefore D > A is impossible.'
    },
    {
      q: 'Seating Constraints: In slots 1 to 5, Kai is not in an odd slot, and is right of Mia (slot 1):',
      options: ['Slot 2 or Slot 4', 'Slot 3', 'Slot 5', 'Slot 1'],
      ans: 'Slot 2 or Slot 4',
      exp: 'Even slots are 2 and 4. Both are to the right of Slot 1.'
    }
  ];
  const lp = logicPuzzles[Math.floor(Math.random() * logicPuzzles.length)];
  const lOpts = [...lp.options].sort(() => Math.random() - 0.5);
  return {
    question: lp.q,
    options: lOpts,
    correctIndex: lOpts.indexOf(lp.ans),
    explanation: lp.exp,
    type: 'pattern'
  };
}

export const GhostDuelPage: React.FC<GhostDuelPageProps> = ({ onBack, userName = 'Player' }) => {
  const [selectedBot, setSelectedBot] = useState<BotPersona>(BOTS[1]);
  const [gameState, setGameState] = useState<'lobby' | 'countdown' | 'playing' | 'gameover'>('lobby');
  const [countdown, setCountdown] = useState(3);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [currentQ, setCurrentQ] = useState<DuelQuestion>(generateDuelQuestion());
  
  // Scores
  const [playerScore, setPlayerScore] = useState(0);
  const [botScore, setBotScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answerFeedback, setAnswerFeedback] = useState<'correct' | 'wrong' | null>(null);

  // Bot simulation state
  const [botStatusText, setBotStatusText] = useState('Analyzing pattern...');
  const botTimerRef = useRef<any>(null);

  const TARGET_POINTS = 5;

  // Start Duel Countdown
  const startDuel = (bot: BotPersona) => {
    setSelectedBot(bot);
    setGameState('countdown');
    setCountdown(3);
    setPlayerScore(0);
    setBotScore(0);
    setCurrentQIndex(0);
    setCurrentQ(generateDuelQuestion()); // Brand new question on every start/rematch!
    setSelectedOption(null);
    setAnswerFeedback(null);
    sounds.playClick();
  };

  // Countdown timer effect
  useEffect(() => {
    if (gameState === 'countdown') {
      sounds.playTick(countdown <= 1);
      if (countdown > 1) {
        const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
        return () => clearTimeout(timer);
      } else if (countdown === 1) {
        const timer = setTimeout(() => {
          setGameState('playing');
          sounds.playDuelClash();
          startBotTurn();
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [gameState, countdown]);

  // Bot Turn Simulation
  const startBotTurn = () => {
    if (botTimerRef.current) clearTimeout(botTimerRef.current);

    const [minSpeed, maxSpeed] = selectedBot.speedMs;
    const botThinkingTime = Math.floor(minSpeed + Math.random() * (maxSpeed - minSpeed));

    setBotStatusText(`${selectedBot.name} is calculating...`);

    botTimerRef.current = setTimeout(() => {
      const isBotCorrect = Math.random() < selectedBot.accuracy;
      if (isBotCorrect) {
        setBotScore(prev => {
          const newScore = prev + 1;
          if (newScore >= TARGET_POINTS) {
            endGame('defeat');
          }
          return newScore;
        });
        setBotStatusText(`⚡ ${selectedBot.name} locked the correct answer!`);
      } else {
        setBotStatusText(`❌ ${selectedBot.name} miscalculated!`);
      }
    }, botThinkingTime);
  };

  // Player Option Selection
  const handleSelectOption = (idx: number) => {
    if (selectedOption !== null || gameState !== 'playing') return;

    setSelectedOption(idx);
    const isCorrect = idx === currentQ.correctIndex;

    if (isCorrect) {
      sounds.playCorrect(playerScore + 1);
      setAnswerFeedback('correct');
      const newScore = playerScore + 1;
      setPlayerScore(newScore);

      if (newScore >= TARGET_POINTS) {
        endGame('victory');
        return;
      }
    } else {
      sounds.playError();
      setAnswerFeedback('wrong');
    }

    setTimeout(() => {
      setSelectedOption(null);
      setAnswerFeedback(null);
      setCurrentQIndex(i => i + 1);
      setCurrentQ(generateDuelQuestion()); // Dynamically generate fresh question for next round!
      startBotTurn();
    }, 1200);
  };

  const endGame = (outcome: 'victory' | 'defeat') => {
    if (botTimerRef.current) clearTimeout(botTimerRef.current);
    setGameState('gameover');
    if (outcome === 'victory') {
      sounds.playVictory();
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
    } else {
      sounds.playError();
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #090D16 0%, #0F172A 100%)',
      color: '#FFFFFF',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'var(--font-sans)'
    }}>
      {/* Top Duel Navigation Bar */}
      <header style={{
        padding: '16px 24px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(12px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            onClick={() => {
              sounds.playClick();
              if (botTimerRef.current) clearTimeout(botTimerRef.current);
              onBack();
            }}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '10px',
              padding: '8px 14px',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.85rem'
            }}
          >
            <ArrowLeft size={16} /> Exit Arena
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Swords size={22} color="#F59E0B" />
            <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, letterSpacing: '0.04em', color: '#FFFFFF' }}>
              QIVORA 1v1 GHOST DUEL
            </h1>
          </div>
        </div>

        {gameState === 'playing' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              background: playerScore >= botScore ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
              border: `1px solid ${playerScore >= botScore ? '#10B981' : '#EF4444'}`,
              color: playerScore >= botScore ? '#6EE7B7' : '#FCA5A5',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 800
            }}>
              {playerScore >= botScore ? `🔥 Ahead by ${playerScore - botScore}` : `⚠️ Behind by ${botScore - playerScore}`}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#94A3B8' }}>
              Race to <strong>{TARGET_POINTS} Points</strong>
            </div>
          </div>
        )}
      </header>

      {/* Main Duel Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        {/* 1. LOBBY STATE */}
        {gameState === 'lobby' && (
          <div style={{ maxWidth: '840px', width: '100%', textAlign: 'center' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(245, 158, 11, 0.15)',
              color: '#FCD34D',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              padding: '6px 16px',
              borderRadius: '20px',
              fontSize: '0.82rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              marginBottom: '16px'
            }}>
              <Zap size={16} /> Real-Time Cognitive AI Duel
            </div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, margin: '0 0 12px', letterSpacing: '-0.02em', color: '#FFFFFF' }}>
              Select Your Opponent
            </h2>
            <p style={{ color: '#94A3B8', maxWidth: '560px', margin: '0 auto 36px', fontSize: '1rem', lineHeight: 1.5 }}>
              Compete side-by-side against neural bots calibrated with authoritative reaction latency and error rates. First to reach 5 points wins the ELO rating.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '36px' }}>
              {BOTS.map(bot => {
                const isSelected = selectedBot.id === bot.id;
                return (
                  <div
                    key={bot.id}
                    onClick={() => {
                      sounds.playClick();
                      setSelectedBot(bot);
                    }}
                    style={{
                      background: isSelected ? 'rgba(30, 41, 59, 0.9)' : 'rgba(15, 23, 42, 0.6)',
                      border: isSelected ? `2.5px solid ${bot.color}` : '1.5px solid #334155',
                      borderRadius: '20px',
                      padding: '24px 20px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: isSelected ? `0 0 25px ${bot.color}40` : 'none',
                      transform: isSelected ? 'translateY(-4px)' : 'none',
                      textAlign: 'left'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <span style={{ fontSize: '2.4rem' }}>{bot.avatar}</span>
                      <span style={{
                        background: `${bot.color}25`,
                        color: bot.color,
                        padding: '4px 10px',
                        borderRadius: '8px',
                        fontSize: '0.75rem',
                        fontWeight: 800
                      }}>
                        {bot.badge}
                      </span>
                    </div>
                    <h3 style={{ margin: '0 0 4px', fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF' }}>{bot.name}</h3>
                    <div style={{ fontSize: '0.85rem', color: '#94A3B8', marginBottom: '16px' }}>
                      Rating: <strong style={{ color: '#FFFFFF' }}>{bot.elo} ELO</strong>
                    </div>

                    <div style={{ fontSize: '0.78rem', color: '#64748B', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div>Avg Speed: <strong style={{ color: '#E2E8F0' }}>{(bot.speedMs[0] / 1000).toFixed(1)}s - {(bot.speedMs[1] / 1000).toFixed(1)}s</strong></div>
                      <div>Accuracy: <strong style={{ color: '#E2E8F0' }}>{Math.round(bot.accuracy * 100)}%</strong></div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => startDuel(selectedBot)}
              style={{
                background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                color: '#0F172A',
                padding: '16px 48px',
                borderRadius: '16px',
                border: 'none',
                fontSize: '1.1rem',
                fontWeight: 900,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 10px 30px rgba(245, 158, 11, 0.4)',
                transition: 'transform 0.15s ease'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <Swords size={22} /> Enter Duel vs {selectedBot.name}
            </button>
          </div>
        )}

        {/* 2. COUNTDOWN STATE */}
        {gameState === 'countdown' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '7rem',
              fontWeight: 900,
              fontFamily: 'monospace',
              color: '#F59E0B',
              textShadow: '0 0 50px rgba(245, 158, 11, 0.6)',
              animation: 'pulse 1s infinite'
            }}>
              {countdown}
            </div>
            <p style={{ fontSize: '1.2rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Preparing Battle Matrix...
            </p>
          </div>
        )}

        {/* 3. PLAYING STATE (SPLIT RACE HUD) */}
        {gameState === 'playing' && (
          <div style={{ maxWidth: '900px', width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Live Progress Race Bar */}
            <div style={{
              background: 'rgba(30, 41, 59, 0.8)',
              border: '1px solid #334155',
              borderRadius: '20px',
              padding: '16px 24px',
              display: 'grid',
              gridTemplateColumns: '1fr auto 1fr',
              gap: '20px',
              alignItems: 'center'
            }}>
              {/* Player Side */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#60A5FA' }}>👤 {userName}</span>
                  <span style={{ fontWeight: 900, fontSize: '1.1rem', color: '#FFFFFF' }}>{playerScore} / {TARGET_POINTS}</span>
                </div>
                <div style={{ height: '10px', background: '#1E293B', borderRadius: '6px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${(playerScore / TARGET_POINTS) * 100}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #3B82F6, #60A5FA)',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              </div>

              {/* VS Emblem */}
              <div style={{
                background: '#0F172A',
                border: '1.5px solid #F59E0B',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '0.75rem',
                color: '#F59E0B'
              }}>
                VS
              </div>

              {/* Bot Side */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 900, fontSize: '1.1rem', color: '#FFFFFF' }}>{botScore} / {TARGET_POINTS}</span>
                  <span style={{ fontWeight: 800, fontSize: '0.9rem', color: selectedBot.color }}>
                    {selectedBot.avatar} {selectedBot.name}
                  </span>
                </div>
                <div style={{ height: '10px', background: '#1E293B', borderRadius: '6px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${(botScore / TARGET_POINTS) * 100}%`,
                    height: '100%',
                    background: `linear-gradient(90deg, ${selectedBot.color}, #F43F5E)`,
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              </div>
            </div>

            {/* Live Bot Activity Stream */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '8px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.82rem',
              color: '#94A3B8'
            }}>
              <span>Live Bot Stream: <strong style={{ color: '#E2E8F0' }}>{botStatusText}</strong></span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={14} /> Round {currentQIndex + 1}
              </span>
            </div>

            {/* Question Card */}
            <div style={{
              background: 'rgba(30, 41, 59, 0.95)',
              border: '1.5px solid #475569',
              borderRadius: '24px',
              padding: '32px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)'
            }}>
              <div style={{
                fontSize: '0.78rem',
                textTransform: 'uppercase',
                fontWeight: 800,
                color: '#F59E0B',
                letterSpacing: '0.08em',
                marginBottom: '10px'
              }}>
                {currentQ.type} Challenge
              </div>
              <h3 style={{
                fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
                fontSize: '1.28rem',
                fontWeight: 700,
                margin: '0 0 24px',
                lineHeight: 1.5,
                color: '#F8FAFC',
                letterSpacing: '-0.01em'
              }}>
                {currentQ.question}
              </h3>

              {/* Options Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
                {currentQ.options.map((opt, i) => {
                  let bg = 'rgba(15, 23, 42, 0.8)';
                  let border = '1px solid #334155';

                  if (selectedOption === i) {
                    if (answerFeedback === 'correct') {
                      bg = '#065F46';
                      border = '2px solid #34D399';
                    } else if (answerFeedback === 'wrong') {
                      bg = '#881337';
                      border = '2px solid #F87171';
                    }
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => handleSelectOption(i)}
                      disabled={selectedOption !== null}
                      style={{
                        padding: '18px 20px',
                        borderRadius: '16px',
                        background: bg,
                        border: border,
                        color: '#FFFFFF',
                        fontSize: '1.05rem',
                        fontWeight: 700,
                        cursor: selectedOption === null ? 'pointer' : 'default',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        textAlign: 'left',
                        transition: 'transform 0.1s ease'
                      }}
                    >
                      <span>{opt}</span>
                      <kbd style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        color: '#94A3B8'
                      }}>
                        {i + 1}
                      </kbd>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 4. GAME OVER STATE */}
        {gameState === 'gameover' && (
          <div style={{
            maxWidth: '560px',
            width: '100%',
            textAlign: 'center',
            background: 'rgba(30, 41, 59, 0.95)',
            border: '2px solid #334155',
            borderRadius: '28px',
            padding: '40px',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5)'
          }}>
            {playerScore >= TARGET_POINTS ? (
              <>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #10B981, #059669)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  boxShadow: '0 0 30px rgba(16, 185, 129, 0.5)'
                }}>
                  <Trophy size={40} color="#FFFFFF" />
                </div>
                <h2 style={{ fontSize: '2.2rem', fontWeight: 900, margin: '0 0 8px', color: '#6EE7B7' }}>
                  VICTORY!
                </h2>
                <p style={{ color: '#94A3B8', margin: '0 0 24px', fontSize: '1rem' }}>
                  You defeated <strong>{selectedBot.name}</strong> ({playerScore} - {botScore}). Your cognitive reaction speed overwhelmed the AI model!
                </p>
                <div style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid #10B981',
                  borderRadius: '14px',
                  padding: '12px',
                  color: '#A7F3D0',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  marginBottom: '28px'
                }}>
                  🏆 +35 ELO Rating Gained (Current: 1520)
                </div>
              </>
            ) : (
              <>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #EF4444, #B91C1C)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  boxShadow: '0 0 30px rgba(239, 68, 68, 0.5)'
                }}>
                  <XCircle size={40} color="#FFFFFF" />
                </div>
                <h2 style={{ fontSize: '2.2rem', fontWeight: 900, margin: '0 0 8px', color: '#FCA5A5' }}>
                  DEFEAT
                </h2>
                <p style={{ color: '#94A3B8', margin: '0 0 24px', fontSize: '1rem' }}>
                  <strong>{selectedBot.name}</strong> reached 5 points first ({botScore} - {playerScore}). Sharpen your inductive speed and try again!
                </p>
              </>
            )}

            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center' }}>
              <button
                onClick={() => startDuel(selectedBot)}
                style={{
                  padding: '12px 24px',
                  borderRadius: '12px',
                  background: '#F59E0B',
                  color: '#0F172A',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <RotateCcw size={16} /> Rematch
              </button>
              <button
                onClick={() => setGameState('lobby')}
                style={{
                  padding: '12px 24px',
                  borderRadius: '12px',
                  background: '#1E293B',
                  color: '#FFFFFF',
                  border: '1px solid #475569',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: 'pointer'
                }}
              >
                Choose Another Bot
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
