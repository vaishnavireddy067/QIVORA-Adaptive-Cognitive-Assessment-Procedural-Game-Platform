import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCw, 
  Zap, 
  Sparkles, 
  ArrowRight, 
  Volume2, 
  VolumeX,
  Compass,
  Layers
} from 'lucide-react';
import { GameId } from '../types';
import { sounds } from '../services/soundEngine';

interface LandingPageProps {
  onPlay: (gameId?: GameId) => void;
  onTakeTest: () => void;
  onOpenDashboard: () => void;
  onOpenAuth?: () => void;
}

interface ConstellationNode {
  id: GameId;
  name: string;
  category: string;
  icon: string;
  color: string;
  bg: string;
  border: string;
  desc: string;
}

const NODES: ConstellationNode[] = [
  { id: 'inductive', name: 'Inductive', category: 'Rule Logic', icon: '📐', color: '#B45309', bg: '#FEF3C7', border: '#F59E0B', desc: 'Identify latent geometric rules & sequences' },
  { id: 'grid', name: 'Matrix', category: 'Spatial', icon: '🟦', color: '#1D4ED8', bg: '#DBEAFE', border: '#3B82F6', desc: 'Raven-style progressive 3×3 matrix completion' },
  { id: 'switch', name: 'Switch', category: 'Problem Solving', icon: '🔘', color: '#047857', bg: '#D1FAE5', border: '#10B981', desc: 'Graph state toggles & shortest path search' },
  { id: 'memory', name: 'Memory', category: 'Retention', icon: '🧠', color: '#6D28D9', bg: '#EDE9FE', border: '#8B5CF6', desc: 'Visual-spatial retention & working memory' },
  { id: 'attention', name: 'Attention', category: 'Vigilance', icon: '👁️', color: '#BE123C', bg: '#FFE4E6', border: '#F43F5E', desc: 'High-density visual anomaly detection' },
  { id: 'reaction', name: 'Reaction', category: 'Speed', icon: '⚡', color: '#C2410C', bg: '#FFEDD5', border: '#F97316', desc: 'Sub-millisecond impulse response & latency' },
  { id: 'math', name: 'Math', category: 'Quantitative', icon: '🔢', color: '#0369A1', bg: '#E0F2FE', border: '#0EA5E9', desc: 'Rapid mental arithmetic under time pressure' },
  { id: 'deductive', name: 'Deductive', category: 'Inference', icon: '💡', color: '#0F766E', bg: '#CCFBF1', border: '#14B8A6', desc: 'Evaluate premise validity & formal syllogisms' }
];

export const LandingPage: React.FC<LandingPageProps> = ({
  onPlay,
  onTakeTest,
  onOpenDashboard
}) => {
  const [isRotating, setIsRotating] = useState(true);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);

  // Smooth continuous rotation using requestAnimationFrame
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      if (isRotating && hoveredIdx === null) {
        setRotationAngle(prev => (prev + delta * 9 * speedMultiplier) % 360);
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isRotating, hoveredIdx, speedMultiplier]);

  const activeNode = hoveredIdx !== null ? NODES[hoveredIdx] : null;
  const radius = 230; // Clean, compact orbital radius

  return (
    <div style={{
      minHeight: 'calc(100vh - 70px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      padding: '20px',
      overflow: 'hidden',
      background: 'radial-gradient(circle at 50% 50%, #FAF8F5 0%, #F5EFE6 100%)'
    }}>

      {/* Subtle Ambient Dot Grid */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'radial-gradient(#D5CEBF 1px, transparent 1px)',
        backgroundSize: '28px 28px',
        opacity: 0.45,
        pointerEvents: 'none'
      }} />

      {/* Top Floating Mini Header */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '16px'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '4px 14px',
          borderRadius: '9999px',
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(8px)',
          border: '1.5px solid #E2DBCF',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          fontSize: '0.74rem',
          fontWeight: 800,
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-secondary)'
        }}>
          <span style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            background: 'var(--accent-vermillion)',
            boxShadow: '0 0 6px rgba(255,59,32,0.8)'
          }} />
          <span>NEURAL MATRIX // 8 CONNECTED COGNITIVE NODES</span>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────
          CENTRAL INTERCONNECTED CONSTELLATION STAGE
      ──────────────────────────────────────────────────────────── */}
      <div style={{
        position: 'relative',
        width: '640px',
        height: '600px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none'
      }}>

        {/* SVG INTERCONNECTED NODES & ORBIT TRACKS */}
        <svg
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            overflow: 'visible'
          }}
          viewBox="-320 -300 640 600"
        >
          {/* Outer Orbit Guide Ring */}
          <circle
            cx="0"
            cy="0"
            r={radius}
            fill="none"
            stroke="#DCD6C9"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            opacity="0.8"
          />

          {/* Inner Accent Ring */}
          <circle
            cx="0"
            cy="0"
            r={radius * 0.58}
            fill="none"
            stroke="#E8E2D5"
            strokeWidth="1"
            opacity="0.6"
          />

          {/* Interconnecting Constellation Lines Between Adjacent Nodes */}
          {NODES.map((node, idx) => {
            const nextIdx = (idx + 1) % NODES.length;
            const currentAngle = ((idx / NODES.length) * 360 + rotationAngle) * (Math.PI / 180);
            const nextAngle = ((nextIdx / NODES.length) * 360 + rotationAngle) * (Math.PI / 180);

            const x1 = Math.cos(currentAngle) * radius;
            const y1 = Math.sin(currentAngle) * radius;
            const x2 = Math.cos(nextAngle) * radius;
            const y2 = Math.sin(nextAngle) * radius;

            const isHighlighted = hoveredIdx === idx || hoveredIdx === nextIdx;

            return (
              <line
                key={`edge-${idx}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={isHighlighted ? 'rgba(255, 59, 32, 0.45)' : '#E0D9CC'}
                strokeWidth={isHighlighted ? '2' : '1.2'}
                strokeDasharray={isHighlighted ? 'none' : '3 3'}
                style={{ transition: 'all 0.3s ease' }}
              />
            );
          })}

          {/* Radial Spokes Connecting Center Core to Each Node */}
          {NODES.map((node, idx) => {
            const angle = ((idx / NODES.length) * 360 + rotationAngle) * (Math.PI / 180);
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            const isHovered = hoveredIdx === idx;

            return (
              <g key={`spoke-${idx}`}>
                <line
                  x1="0"
                  y1="0"
                  x2={x}
                  y2={y}
                  stroke={isHovered ? node.border : '#E4DDD0'}
                  strokeWidth={isHovered ? '2.5' : '1.2'}
                  opacity={isHovered ? '1' : '0.7'}
                />
                {/* Subtle Traveling Signal Dot on Hover */}
                {isHovered && (
                  <circle
                    cx={x * 0.55}
                    cy={y * 0.55}
                    r="3.5"
                    fill={node.border}
                    className="anim-pulse"
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* ───────────────────────────────────────────────────────────
            8 CLEAN SATELLITE NODES (INTERACTIVE & SLEEK)
        ──────────────────────────────────────────────────────────── */}
        {NODES.map((node, idx) => {
          const angle = ((idx / NODES.length) * 360 + rotationAngle) * (Math.PI / 180);
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          const isHovered = hoveredIdx === idx;

          return (
            <div
              key={node.id}
              onClick={() => {
                sounds.playClick();
                onPlay(node.id);
              }}
              onMouseEnter={() => {
                sounds.playClick();
                setHoveredIdx(idx);
              }}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{
                position: 'absolute',
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                transform: 'translate(-50%, -50%)',
                zIndex: isHovered ? 35 : 20,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              {/* Sleek Node Circle */}
              <div style={{
                width: isHovered ? '62px' : '52px',
                height: isHovered ? '62px' : '52px',
                borderRadius: '50%',
                background: isHovered ? node.bg : '#FFFFFF',
                border: `2px solid ${isHovered ? node.border : '#121110'}`,
                boxShadow: isHovered 
                  ? `0 0 16px ${node.border}66, 3px 3px 0px #121110` 
                  : '2px 2px 0px #121110',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: isHovered ? '1.55rem' : '1.35rem',
                transition: 'all 0.25s ease'
              }}>
                {node.icon}
              </div>

              {/* Clean External Label Below Circle (No overlapping text!) */}
              <div style={{
                marginTop: '6px',
                padding: '2px 8px',
                borderRadius: '9999px',
                background: isHovered ? '#121110' : 'rgba(255, 255, 255, 0.9)',
                color: isHovered ? '#FFFFFF' : 'var(--text-primary)',
                border: '1px solid ' + (isHovered ? '#121110' : '#E2DBCF'),
                fontSize: '0.68rem',
                fontWeight: 800,
                fontFamily: 'var(--font-mono)',
                whiteSpace: 'nowrap',
                boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
                transition: 'all 0.2s ease'
              }}>
                {node.name}
              </div>
            </div>
          );
        })}

        {/* ───────────────────────────────────────────────────────────
            THE CENTRAL QIVORA CORE
        ──────────────────────────────────────────────────────────── */}
        <div style={{
          position: 'relative',
          zIndex: 30,
          width: '230px',
          height: '230px',
          borderRadius: '50%',
          background: '#FFFFFF',
          border: '2.5px solid var(--border-ink)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.06), 4px 4px 0px #121110',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '20px',
          boxSizing: 'border-box',
          transition: 'all 0.3s ease'
        }}>
          
          {/* Inner Dashed Dial */}
          <div style={{
            position: 'absolute',
            inset: '6px',
            borderRadius: '50%',
            border: '1px dashed #E2DBCF',
            pointerEvents: 'none'
          }} />

          {/* If a node is hovered: show that node's clean info */}
          {activeNode ? (
            <div style={{ animation: 'floatGentle 3s ease infinite', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '1.8rem', lineHeight: 1 }}>{activeNode.icon}</span>
              <div style={{
                fontFamily: 'var(--font-poster)',
                fontSize: '1.25rem',
                fontWeight: 900,
                color: 'var(--text-primary)',
                marginTop: '4px',
                textTransform: 'uppercase'
              }}>
                {activeNode.name}
              </div>
              <div style={{
                fontSize: '0.66rem',
                fontFamily: 'var(--font-mono)',
                color: activeNode.color,
                fontWeight: 800,
                marginTop: '1px',
                textTransform: 'uppercase'
              }}>
                {activeNode.category}
              </div>
              <button
                onClick={() => {
                  sounds.playClick();
                  onPlay(activeNode.id);
                }}
                className="btn-vermillion"
                style={{
                  marginTop: '10px',
                  padding: '5px 14px',
                  fontSize: '0.74rem',
                  boxShadow: '2px 2px 0px #121110',
                  gap: '4px'
                }}
              >
                <Play size={11} />
                <span>PLAY NOW</span>
              </button>
            </div>
          ) : (
            /* Default Idle QIVORA Logo & Actions */
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              
              {/* Logo Dot Accent */}
              <div style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: 'var(--accent-vermillion)',
                marginBottom: '4px',
                boxShadow: '0 0 8px rgba(255,59,32,0.6)'
              }} />

              {/* BRAND LOGO */}
              <h1 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '2.3rem',
                fontWeight: 900,
                letterSpacing: '-0.04em',
                lineHeight: 1,
                color: 'var(--text-primary)',
                margin: 0
              }}>
                QIVORA
              </h1>

              <div style={{
                fontSize: '0.58rem',
                fontWeight: 800,
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-muted)',
                letterSpacing: '0.14em',
                marginTop: '4px',
                marginBottom: '12px'
              }}>
                THINK FASTER · PLAY SMARTER
              </div>

              {/* Clean Quick Launch Buttons */}
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={onOpenDashboard}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '9999px',
                    background: '#121110',
                    color: '#FFFFFF',
                    border: '1.5px solid #121110',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    fontFamily: 'var(--font-mono)',
                    cursor: 'pointer',
                    boxShadow: '1.5px 1.5px 0px var(--accent-vermillion)'
                  }}
                >
                  ENTER →
                </button>

                <button
                  onClick={onTakeTest}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '9999px',
                    background: 'var(--bg-cream)',
                    color: 'var(--text-primary)',
                    border: '1.5px solid #121110',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    fontFamily: 'var(--font-mono)',
                    cursor: 'pointer'
                  }}
                >
                  ⚡ TEST
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* ───────────────────────────────────────────────────────────
          BOTTOM COMPACT ORBIT CONTROLS BAR
      ──────────────────────────────────────────────────────────── */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginTop: '8px',
        padding: '6px 16px',
        borderRadius: '9999px',
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(8px)',
        border: '1.5px solid #E2DBCF',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
      }}>
        {/* Play/Pause Rotation */}
        <button
          onClick={() => {
            sounds.playClick();
            setIsRotating(!isRotating);
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '4px 10px',
            borderRadius: '9999px',
            border: '1px solid #121110',
            background: isRotating ? '#121110' : 'var(--accent-yellow)',
            color: isRotating ? '#FFFFFF' : '#121110',
            cursor: 'pointer',
            fontSize: '0.72rem',
            fontWeight: 800,
            fontFamily: 'var(--font-mono)'
          }}
        >
          {isRotating ? <Pause size={11} /> : <Play size={11} />}
          <span>{isRotating ? 'PAUSE' : 'ROTATE'}</span>
        </button>

        {/* Speed Control Toggle */}
        <button
          onClick={() => {
            sounds.playClick();
            setSpeedMultiplier(prev => (prev === 1 ? 2 : prev === 2 ? 0.5 : 1));
          }}
          style={{
            padding: '4px 10px',
            borderRadius: '9999px',
            border: '1px solid #E2DBCF',
            background: 'var(--bg-main)',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            fontSize: '0.72rem',
            fontWeight: 800,
            fontFamily: 'var(--font-mono)'
          }}
        >
          SPEED: {speedMultiplier}x
        </button>

        <span style={{ width: '1px', height: '14px', background: '#D5CEBF' }} />

        {/* Direct Link to Full Dashboard */}
        <button
          onClick={onOpenDashboard}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '4px 10px',
            borderRadius: '9999px',
            border: 'none',
            background: 'transparent',
            color: 'var(--accent-vermillion)',
            cursor: 'pointer',
            fontSize: '0.74rem',
            fontWeight: 800,
            fontFamily: 'var(--font-mono)'
          }}
        >
          <span>ALL 8 GAMES & DASHBOARD</span>
          <ArrowRight size={12} />
        </button>
      </div>

    </div>
  );
};
