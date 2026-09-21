import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCw, 
  RotateCcw, 
  Zap, 
  Brain, 
  Sparkles, 
  Target, 
  Activity, 
  Layers, 
  ArrowRight, 
  ShieldCheck, 
  Cpu, 
  Flame,
  CheckCircle2,
  Compass,
  Gauge
} from 'lucide-react';
import { GameId } from '../types';
import { sounds } from '../services/soundEngine';

interface LandingPageProps {
  onPlay: (gameId?: GameId) => void;
  onTakeTest: () => void;
  onOpenDashboard: () => void;
  onOpenAuth?: () => void;
}

interface OrbitGameNode {
  id: GameId;
  title: string;
  tagline: string;
  category: string;
  icon: string;
  accentBg: string;
  accentColor: string;
  borderAccent: string;
  metrics: string;
}

const ORBIT_GAMES: OrbitGameNode[] = [
  {
    id: 'inductive',
    title: 'Inductive Logic',
    tagline: 'Discover latent transformation rules',
    category: 'Reasoning',
    icon: '📐',
    accentBg: '#FEF08A',
    accentColor: '#854D0E',
    borderAccent: '#CA8A04',
    metrics: 'Rule Induction'
  },
  {
    id: 'grid',
    title: 'Grid Matrix',
    tagline: 'Raven progressive 3×3 matrix completion',
    category: 'Abstract',
    icon: '🟦',
    accentBg: '#DBEAFE',
    accentColor: '#1E40AF',
    borderAccent: '#2563EB',
    metrics: 'Spatial Topology'
  },
  {
    id: 'switch',
    title: 'Switch Challenge',
    tagline: 'Graph BFS state toggle transitions',
    category: 'Problem Solving',
    icon: '🔘',
    accentBg: '#D1FAE5',
    accentColor: '#065F46',
    borderAccent: '#059669',
    metrics: 'State Space Search'
  },
  {
    id: 'memory',
    title: 'Memory Matrix',
    tagline: 'Spatial working memory & visual retention',
    category: 'Working Memory',
    icon: '🧠',
    accentBg: '#EDE9FE',
    accentColor: '#5B21B6',
    borderAccent: '#7C3AED',
    metrics: 'Visual-Spatial N-Back'
  },
  {
    id: 'attention',
    title: 'Attention Lens',
    tagline: 'High-density visual anomaly detection',
    category: 'Vigilance',
    icon: '👁️',
    accentBg: '#FFE4E6',
    accentColor: '#9F1239',
    borderAccent: '#E11D48',
    metrics: 'Selective Focus'
  },
  {
    id: 'reaction',
    title: 'Reaction Pulse',
    tagline: 'Millisecond impulse response & latency',
    category: 'Speed',
    icon: '⚡',
    accentBg: '#FEF3C7',
    accentColor: '#92400E',
    borderAccent: '#D97706',
    metrics: 'Inhibition & Speed'
  },
  {
    id: 'math',
    title: 'Speed Math',
    tagline: 'Rapid mental arithmetic under time pressure',
    category: 'Quantitative',
    icon: '🔢',
    accentBg: '#E0F2FE',
    accentColor: '#075985',
    borderAccent: '#0284C7',
    metrics: 'Numerical Agility'
  },
  {
    id: 'deductive',
    title: 'Deductive Syllogisms',
    tagline: 'Evaluate premise validity & formal logic',
    category: 'Deductive',
    icon: '💡',
    accentBg: '#CFFAFE',
    accentColor: '#155E75',
    borderAccent: '#0891B2',
    metrics: 'Formal Inference'
  }
];

export const LandingPage: React.FC<LandingPageProps> = ({ 
  onPlay, 
  onTakeTest, 
  onOpenDashboard 
}) => {
  // Orbit Controls State
  const [isRotating, setIsRotating] = useState(true);
  const [rotationSpeed, setRotationSpeed] = useState<'normal' | 'fast' | 'slow'>('normal');
  const [isReverse, setIsReverse] = useState(false);
  const [activeGameIndex, setActiveGameIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Interactive Live Demo Mini-State
  const [activeInteractiveSwitch, setActiveInteractiveSwitch] = useState<boolean[]>([true, false, true, false]);
  const [switchMoveCount, setSwitchMoveCount] = useState(0);

  const activeGame = ORBIT_GAMES[activeGameIndex];

  // Auto-cycle active game when rotating if not hovered
  useEffect(() => {
    if (!isRotating || isHovered) return;
    const intervalTime = rotationSpeed === 'fast' ? 2200 : rotationSpeed === 'slow' ? 6000 : 3800;
    const interval = setInterval(() => {
      setActiveGameIndex(prev => (prev + 1) % ORBIT_GAMES.length);
    }, intervalTime);
    return () => clearInterval(interval);
  }, [isRotating, rotationSpeed, isHovered]);

  const toggleDemoSwitch = (idx1: number, idx2: number) => {
    sounds.playClick();
    setActiveInteractiveSwitch(prev => {
      const next = [...prev];
      next[idx1] = !next[idx1];
      next[idx2] = !next[idx2];
      return next;
    });
    setSwitchMoveCount(c => c + 1);
  };

  const selectGameNode = (index: number) => {
    sounds.playClick();
    setActiveGameIndex(index);
  };

  return (
    <div style={{ paddingBottom: '100px' }}>
      
      {/* ───────────────────────────────────────────────────────────
          1. HERO HEADER: INTRO & BADGE
      ──────────────────────────────────────────────────────────── */}
      <section style={{
        padding: '50px 0 20px 0',
        textAlign: 'center',
        position: 'relative'
      }}>
        <div className="container" style={{ maxWidth: '1100px' }}>
          
          {/* Top Pill Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            padding: '7px 20px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--accent-yellow)',
            border: '2.5px solid var(--border-ink)',
            boxShadow: 'var(--shadow-tactile-sm)',
            fontSize: '0.85rem',
            fontWeight: 900,
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-primary)',
            marginBottom: '24px'
          }}>
            <span style={{ 
              width: '10px', 
              height: '10px', 
              borderRadius: '50%', 
              background: 'var(--accent-vermillion)',
              boxShadow: '0 0 8px rgba(255,59,32,0.6)'
            }} />
            <span>AUTHORITATIVE COGNITIVE PLATFORM // ORBITAL ENGINE</span>
          </div>

          {/* ULTRA-BOLD POSTER HEADLINE */}
          <h1 className="poster-headline" style={{
            fontSize: 'clamp(3rem, 6.8vw, 5.4rem)',
            letterSpacing: '-0.04em',
            marginBottom: '18px',
            lineHeight: 0.92
          }}>
            THINK FASTER.<br />
            <span style={{ color: 'var(--accent-vermillion)' }}>PLAY SMARTER.</span>
          </h1>

          <p style={{
            fontSize: 'clamp(1.1rem, 2vw, 1.35rem)',
            color: 'var(--text-secondary)',
            lineHeight: 1.5,
            maxWidth: '680px',
            margin: '0 auto 36px auto',
            fontWeight: 500
          }}>
            Eight scientifically engineered mental arenas revolving around fluid intelligence, pattern discovery, and executive processing.
          </p>

          {/* Quick Header CTA Action Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '14px',
            flexWrap: 'wrap'
          }}>
            <button
              className="btn-vermillion"
              onClick={onOpenDashboard}
              style={{
                background: '#121110',
                color: '#FFFFFF',
                border: '2.5px solid #121110',
                boxShadow: '4px 4px 0px var(--accent-vermillion)',
                padding: '12px 28px'
              }}
            >
              <span>ENTER DASHBOARD →</span>
            </button>

            <button 
              className="btn-vermillion" 
              onClick={() => onPlay(activeGame.id)}
              style={{ padding: '12px 28px' }}
            >
              <span>PLAY {activeGame.title.toUpperCase()}</span>
            </button>

            <button 
              className="btn-editorial-light" 
              onClick={onTakeTest}
              style={{ padding: '12px 24px' }}
            >
              <span>⚡ RAPID BENCHMARK (10 MIN)</span>
            </button>
          </div>
        </div>
      </section>


      {/* ───────────────────────────────────────────────────────────
          2. CENTRAL ROTATING CIRCULAR LANDING PAGE HERO
      ──────────────────────────────────────────────────────────── */}
      <section style={{
        padding: '30px 0 70px 0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="container" style={{ maxWidth: '1280px' }}>
          
          {/* Orbit Controls & Telemetry Header Bar */}
          <div style={{
            maxWidth: '900px',
            margin: '0 auto 30px auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px',
            background: 'var(--bg-surface)',
            border: '2px solid var(--border-ink)',
            borderRadius: 'var(--radius-lg)',
            padding: '12px 24px',
            boxShadow: 'var(--shadow-tactile-sm)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                fontWeight: 900,
                color: 'var(--accent-vermillion)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <Compass size={16} />
                ORBITAL STATUS:
              </span>
              <span style={{
                fontSize: '0.85rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                background: isRotating ? 'var(--accent-mint-light)' : 'var(--bg-cream)',
                color: isRotating ? '#065F46' : 'var(--text-secondary)',
                padding: '3px 10px',
                borderRadius: 'var(--radius-full)',
                border: '1.5px solid var(--border-ink)'
              }}>
                {isRotating ? '● ROTATING LIVE' : '⏸ PAUSED'}
              </span>
            </div>

            {/* Orbit Controls: Play/Pause, Direction, Speed */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* Play / Pause */}
              <button
                onClick={() => {
                  sounds.playClick();
                  setIsRotating(!isRotating);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-full)',
                  border: '1.5px solid var(--border-ink)',
                  background: isRotating ? '#121110' : 'var(--accent-yellow)',
                  color: isRotating ? '#FFFFFF' : '#121110',
                  cursor: 'pointer',
                  fontWeight: 800,
                  fontSize: '0.78rem',
                  fontFamily: 'var(--font-mono)'
                }}
                title={isRotating ? 'Pause Rotation' : 'Resume Rotation'}
              >
                {isRotating ? <Pause size={13} /> : <Play size={13} />}
                <span>{isRotating ? 'PAUSE' : 'ROTATE'}</span>
              </button>

              {/* Direction Toggle */}
              <button
                onClick={() => {
                  sounds.playClick();
                  setIsReverse(!isReverse);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-full)',
                  border: '1.5px solid var(--border-ink)',
                  background: 'var(--bg-cream)',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  fontWeight: 800,
                  fontSize: '0.78rem',
                  fontFamily: 'var(--font-mono)'
                }}
                title="Change Rotation Direction"
              >
                {isReverse ? <RotateCcw size={13} /> : <RotateCw size={13} />}
                <span>{isReverse ? 'CCW' : 'CW'}</span>
              </button>

              {/* Speed Preset Buttons */}
              {(['slow', 'normal', 'fast'] as const).map(speed => (
                <button
                  key={speed}
                  onClick={() => {
                    sounds.playClick();
                    setRotationSpeed(speed);
                  }}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 'var(--radius-full)',
                    border: '1.5px solid var(--border-ink)',
                    background: rotationSpeed === speed ? 'var(--accent-vermillion)' : 'transparent',
                    color: rotationSpeed === speed ? '#FFFFFF' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontWeight: 800,
                    fontSize: '0.75rem',
                    fontFamily: 'var(--font-mono)',
                    textTransform: 'uppercase'
                  }}
                >
                  {speed === 'slow' ? '0.5x' : speed === 'normal' ? '1.0x' : '2.0x'}
                </button>
              ))}
            </div>
          </div>

          {/* MAIN CIRCULAR ROTATING STAGE */}
          <div 
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '860px',
              height: '760px',
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              userSelect: 'none'
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >

            {/* 1. Ambient Background Glow Rings */}
            <div style={{
              position: 'absolute',
              width: '720px',
              height: '720px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,59,32,0.06) 0%, rgba(229,249,53,0.08) 50%, transparent 75%)',
              pointerEvents: 'none'
            }} />

            {/* 2. Outer Static Compass Ring with Cardinal Ticks */}
            <div style={{
              position: 'absolute',
              width: '680px',
              height: '680px',
              borderRadius: '50%',
              border: '2px dashed #D5CEBF',
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {/* Cardinal Labels */}
              <span style={{ position: 'absolute', top: '10px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-muted)' }}>000° // NORTH</span>
              <span style={{ position: 'absolute', right: '12px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-muted)' }}>090° // REASONING</span>
              <span style={{ position: 'absolute', bottom: '10px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-muted)' }}>180° // MEMORY</span>
              <span style={{ position: 'absolute', left: '12px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-muted)' }}>270° // ATTENTION</span>
            </div>

            {/* 3. Middle Rotating Decorative Track with SVG Orbit Path */}
            <div 
              className={`qivora-orbit-track ${!isRotating || isHovered ? 'paused' : ''} ${rotationSpeed} ${isReverse ? 'reverse' : ''}`}
              style={{
                position: 'absolute',
                width: '580px',
                height: '580px',
                borderRadius: '50%',
                border: '2.5px solid var(--border-ink)',
                boxShadow: 'inset 0 0 20px rgba(0,0,0,0.04)',
                pointerEvents: 'none'
              }}
            >
              {/* Rotating Dot Accents on Orbit */}
              <div style={{ position: 'absolute', top: '-6px', left: '50%', transform: 'translateX(-50%)', width: '12px', height: '12px', borderRadius: '50%', background: 'var(--accent-vermillion)', border: '2px solid #121110' }} />
              <div style={{ position: 'absolute', bottom: '-6px', left: '50%', transform: 'translateX(-50%)', width: '12px', height: '12px', borderRadius: '50%', background: 'var(--accent-yellow)', border: '2px solid #121110' }} />
              <div style={{ position: 'absolute', left: '-6px', top: '50%', transform: 'translateY(-50%)', width: '12px', height: '12px', borderRadius: '50%', background: 'var(--accent-mint)', border: '2px solid #121110' }} />
              <div style={{ position: 'absolute', right: '-6px', top: '50%', transform: 'translateY(-50%)', width: '12px', height: '12px', borderRadius: '50%', background: 'var(--accent-lavender)', border: '2px solid #121110' }} />
            </div>

            {/* 4. The Planetary Satellite Orbiting Nodes (8 Games) */}
            <div 
              className={`qivora-orbit-track ${!isRotating || isHovered ? 'paused' : ''} ${rotationSpeed} ${isReverse ? 'reverse' : ''}`}
              style={{
                position: 'absolute',
                width: '580px',
                height: '580px',
                borderRadius: '50%',
                pointerEvents: 'none'
              }}
            >
              {ORBIT_GAMES.map((game, idx) => {
                const total = ORBIT_GAMES.length;
                const angle = (idx / total) * 2 * Math.PI - Math.PI / 2;
                const radius = 290; // Half of 580px
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                const isActive = activeGameIndex === idx;

                return (
                  <div
                    key={game.id}
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                      pointerEvents: 'auto',
                      zIndex: isActive ? 20 : 10
                    }}
                  >
                    {/* Node Counter-Rotation Container (Keeps text/icon upright) */}
                    <div 
                      className={`qivora-node-counter ${!isRotating || isHovered ? 'paused' : ''} ${rotationSpeed} ${isReverse ? 'reverse' : ''}`}
                      onClick={() => selectGameNode(idx)}
                      onMouseEnter={() => {
                        sounds.playClick();
                        setActiveGameIndex(idx);
                      }}
                      style={{
                        width: isActive ? '118px' : '96px',
                        height: isActive ? '118px' : '96px',
                        borderRadius: '50%',
                        background: game.accentBg,
                        border: `3px solid var(--border-ink)`,
                        boxShadow: isActive 
                          ? `6px 6px 0px #121110, 0 0 24px ${game.accentColor}55` 
                          : '3px 3px 0px #121110',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transform: isActive ? 'scale(1.15)' : 'scale(1)',
                        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                        textAlign: 'center',
                        padding: '6px'
                      }}
                    >
                      <span style={{ fontSize: isActive ? '1.9rem' : '1.45rem', lineHeight: 1 }}>
                        {game.icon}
                      </span>
                      <span style={{
                        fontFamily: 'var(--font-poster)',
                        fontWeight: 900,
                        fontSize: isActive ? '0.78rem' : '0.66rem',
                        color: '#121110',
                        marginTop: '4px',
                        lineHeight: 1.1,
                        textTransform: 'uppercase',
                        maxWidth: '90px'
                      }}>
                        {game.title.split(' ')[0]}
                      </span>
                      {isActive && (
                        <span style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.52rem',
                          fontWeight: 900,
                          color: game.accentColor,
                          marginTop: '2px',
                          textTransform: 'uppercase'
                        }}>
                          ACTIVE
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>


            {/* 5. THE CENTRAL QIVORA ROTATING COGNITIVE CORE */}
            <div 
              className="qivora-core-pulse"
              style={{
                position: 'relative',
                zIndex: 30,
                width: '370px',
                height: '370px',
                borderRadius: '50%',
                background: '#FFFFFF',
                border: '3.5px solid var(--border-ink)',
                boxShadow: 'var(--shadow-tactile-lg)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '28px',
                boxSizing: 'border-box'
              }}
            >
              {/* Inner Decorative Dashed Ring */}
              <div style={{
                position: 'absolute',
                width: '340px',
                height: '340px',
                borderRadius: '50%',
                border: '1.5px dashed #E2DBCF',
                pointerEvents: 'none'
              }} />

              {/* Top Status Pill */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--bg-cream)',
                border: '1.5px solid var(--border-ink)',
                fontSize: '0.68rem',
                fontWeight: 900,
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-primary)',
                marginBottom: '8px'
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-vermillion)' }} />
                <span>CORE // {activeGame.category.toUpperCase()}</span>
              </div>

              {/* BIG BRAND LOGO IN CENTER */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '4px'
              }}>
                <h2 className="poster-headline" style={{
                  fontSize: '2.8rem',
                  letterSpacing: '-0.05em',
                  color: 'var(--text-primary)',
                  margin: 0,
                  lineHeight: 1
                }}>
                  QIVORA
                </h2>
              </div>

              {/* Tagline / Focused Game Detail */}
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                fontWeight: 800,
                color: 'var(--accent-vermillion)',
                textTransform: 'uppercase',
                marginBottom: '6px'
              }}>
                {activeGame.icon} {activeGame.title}
              </div>

              <p style={{
                fontSize: '0.82rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.35,
                maxWidth: '260px',
                marginBottom: '14px',
                fontWeight: 600
              }}>
                {activeGame.tagline}
              </p>

              {/* Action Buttons in Center Core */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', maxWidth: '220px' }}>
                <button
                  className="btn-vermillion"
                  onClick={() => onPlay(activeGame.id)}
                  style={{
                    padding: '8px 16px',
                    fontSize: '0.82rem',
                    boxShadow: '2px 2px 0px #121110',
                    width: '100%',
                    justifyContent: 'center'
                  }}
                >
                  <Play size={14} />
                  <span>PLAY {activeGame.title.split(' ')[0].toUpperCase()}</span>
                </button>

                <button
                  onClick={onOpenDashboard}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--bg-main)',
                    border: '1.5px solid var(--border-ink)',
                    boxShadow: '1.5px 1.5px 0px #121110',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                >
                  <span>ALL 8 ARENAS</span>
                  <ArrowRight size={12} />
                </button>
              </div>

              {/* Bottom Mini Metric Indicator */}
              <div style={{
                marginTop: '10px',
                fontSize: '0.62rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-muted)',
                fontWeight: 700
              }}>
                METRIC: {activeGame.metrics}
              </div>
            </div>
          </div>

          {/* Quick Selection Navigation Bar Under Orbital */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            flexWrap: 'wrap',
            marginTop: '20px'
          }}>
            {ORBIT_GAMES.map((game, idx) => (
              <button
                key={game.id}
                onClick={() => selectGameNode(idx)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: '2px solid var(--border-ink)',
                  background: activeGameIndex === idx ? game.accentBg : 'var(--bg-surface)',
                  boxShadow: activeGameIndex === idx ? '2.5px 2.5px 0px #121110' : 'none',
                  color: '#121110',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  fontFamily: 'var(--font-body)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{game.icon}</span>
                <span>{game.title}</span>
              </button>
            ))}
          </div>
        </div>
      </section>


      {/* ───────────────────────────────────────────────────────────
          3. INTERACTIVE MINI DEMO & TELEMETRY SECTION
      ──────────────────────────────────────────────────────────── */}
      <section style={{ padding: '40px 0 60px 0' }}>
        <div className="container" style={{ maxWidth: '1200px' }}>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '32px',
            alignItems: 'center'
          }}>
            {/* Left: Interactive Demo Card */}
            <div className="editorial-tile" style={{ padding: '36px', background: '#FFFFFF' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.82rem',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  color: 'var(--accent-vermillion)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <Cpu size={16} />
                  LIVE DEMO // SWITCH ENGINE
                </span>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-primary)', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                  Moves: {switchMoveCount}
                </span>
              </div>

              <h3 className="poster-sub" style={{ fontSize: '1.7rem', marginBottom: '8px' }}>
                Interactive state toggling.
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '24px' }}>
                Click below to toggle coupled light switches. The authoritative backend engine solves minimal move shortest paths in real-time.
              </p>

              {/* State Circles */}
              <div style={{ display: 'flex', justifyContent: 'space-around', margin: '24px 0' }}>
                {activeInteractiveSwitch.map((on, idx) => (
                  <div
                    key={idx}
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '50%',
                      background: on ? 'var(--accent-vermillion)' : 'var(--bg-cream)',
                      border: '3px solid var(--border-ink)',
                      boxShadow: on ? '4px 4px 0px #121110' : 'none',
                      transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.4rem',
                      fontWeight: 900,
                      color: on ? '#FFFFFF' : '#121110'
                    }}
                  >
                    {on ? '●' : '○'}
                  </div>
                ))}
              </div>

              {/* Toggles */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <button
                  onClick={() => toggleDemoSwitch(0, 1)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-main)',
                    border: '2px solid var(--border-ink)',
                    boxShadow: '2.5px 2.5px 0px #121110',
                    fontWeight: 800,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-mono)'
                  }}
                >
                  Toggle [1, 2]
                </button>
                <button
                  onClick={() => toggleDemoSwitch(2, 3)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-main)',
                    border: '2px solid var(--border-ink)',
                    boxShadow: '2.5px 2.5px 0px #121110',
                    fontWeight: 800,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-mono)'
                  }}
                >
                  Toggle [3, 4]
                </button>
              </div>
            </div>

            {/* Right: Key Platform Architecture Features */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div className="editorial-tile" style={{ padding: '24px', background: 'var(--accent-yellow)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <Zap size={24} color="#121110" />
                  <h4 className="poster-sub" style={{ fontSize: '1.3rem', margin: 0 }}>Procedural Generative Puzzles</h4>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', margin: 0 }}>
                  Every problem is generated mathematically on the fly. Infinite variations with seeded reproducibility.
                </p>
              </div>

              <div className="editorial-tile" style={{ padding: '24px', background: 'var(--accent-mint-light)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <Activity size={24} color="#065F46" />
                  <h4 className="poster-sub" style={{ fontSize: '1.3rem', margin: 0 }}>Adaptive Difficulty Scaling</h4>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', margin: 0 }}>
                  Dynamic latency tracking and error modeling calibrate challenge levels to the user's cognitive frontier.
                </p>
              </div>

              <div className="editorial-tile" style={{ padding: '24px', background: 'var(--accent-lavender-light)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <ShieldCheck size={24} color="#5B21B6" />
                  <h4 className="poster-sub" style={{ fontSize: '1.3rem', margin: 0 }}>Verified Psychometric Metrics</h4>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', margin: 0 }}>
                  Standardized CQ scores, percentile baselines, and granular cognitive profiles for comprehensive talent benchmarking.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ───────────────────────────────────────────────────────────
          4. ALL 8 BESPOKE ARENAS GRID SHOWCASE
      ──────────────────────────────────────────────────────────── */}
      <section style={{ padding: '50px 0' }}>
        <div className="container" style={{ maxWidth: '1200px' }}>
          
          <div style={{ marginBottom: '40px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 900, color: 'var(--accent-vermillion)', textTransform: 'uppercase' }}>
              COGNITIVE ARCHITECTURE
            </span>
            <h2 className="poster-headline" style={{ fontSize: 'clamp(2.4rem, 5vw, 3.6rem)', marginTop: '8px' }}>
              EIGHT SPECIALIZED MENTAL ARENAS.
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', maxWidth: '640px', marginTop: '8px', fontWeight: 500 }}>
              Engineered for deliberate practice across distinct neurological subsystems.
            </p>
          </div>

          {/* 4x2 Grid of Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '22px' }}>
            {ORBIT_GAMES.map(game => (
              <div 
                key={game.id}
                className="editorial-tile" 
                style={{ padding: '28px', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                onClick={() => onPlay(game.id)}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                    <span className="btn-pill-small" style={{ background: game.accentBg, color: '#121110' }}>
                      {game.category}
                    </span>
                    <span style={{ fontSize: '2rem' }}>{game.icon}</span>
                  </div>
                  <h3 className="poster-sub" style={{ fontSize: '1.5rem', marginBottom: '8px' }}>
                    {game.title}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.45 }}>
                    {game.tagline}
                  </p>
                </div>

                <div style={{ 
                  marginTop: '24px', 
                  paddingTop: '16px',
                  borderTop: '1.5px solid var(--border-subtle)',
                  fontWeight: 900, 
                  color: 'var(--accent-vermillion)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.82rem'
                }}>
                  <span>PLAY ARENA</span>
                  <ArrowRight size={16} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ───────────────────────────────────────────────────────────
          5. BOTTOM HERO CALLOUT BANNER
      ──────────────────────────────────────────────────────────── */}
      <section style={{ padding: '30px 0 20px 0' }}>
        <div className="container" style={{ maxWidth: '1200px' }}>
          <div style={{
            background: 'var(--text-primary)',
            color: 'var(--text-inverse)',
            borderRadius: 'var(--radius-xl)',
            padding: '56px 48px',
            boxShadow: 'var(--shadow-tactile-lg)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '32px'
          }}>
            <div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--accent-yellow)', textTransform: 'uppercase', fontWeight: 900 }}>
                DUAL OPERATING MODES
              </span>
              <h2 className="poster-headline" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#FAF8F5', marginTop: '8px' }}>
                PLAY TO LEARN. TEST TO BENCHMARK.
              </h2>
              <p style={{ color: '#C5C0B6', fontSize: '1.05rem', maxWidth: '580px', marginTop: '8px' }}>
                Practice provides instant hints, generative explanations, and step-by-step logic. The Test simulates an authentic assessment battery with zero distractions.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <button 
                className="btn-vermillion" 
                onClick={onOpenDashboard}
                style={{ padding: '14px 28px' }}
              >
                <span>OPEN DASHBOARD →</span>
              </button>
              
              <button 
                className="btn-editorial-light" 
                onClick={onTakeTest}
                style={{ padding: '14px 24px', background: '#FFFFFF', color: '#121110' }}
              >
                <span>⚡ TAKE FULL TEST</span>
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
