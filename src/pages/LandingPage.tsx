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
import { CognitiveIllustration } from '../components/common/CognitiveIllustrations';

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
  color: string;
  bg: string;
  border: string;
  desc: string;
}

const NODES: ConstellationNode[] = [
  { id: 'inductive', name: 'Inductive', category: 'Rule Logic', color: '#B45309', bg: '#FEF3C7', border: '#F59E0B', desc: 'Identify latent geometric rules & sequences' },
  { id: 'grid', name: 'Matrix', category: 'Spatial', color: '#1D4ED8', bg: '#DBEAFE', border: '#3B82F6', desc: 'Raven-style progressive 3×3 matrix completion' },
  { id: 'switch', name: 'Switch', category: 'Problem Solving', color: '#047857', bg: '#D1FAE5', border: '#10B981', desc: 'Graph state toggles & shortest path search' },
  { id: 'memory', name: 'Memory', category: 'Retention', color: '#6D28D9', bg: '#EDE9FE', border: '#8B5CF6', desc: 'Visual-spatial retention & working memory' },
  { id: 'attention', name: 'Attention', category: 'Vigilance', color: '#BE123C', bg: '#FFE4E6', border: '#F43F5E', desc: 'High-density visual anomaly detection' },
  { id: 'reaction', name: 'Reaction', category: 'Speed', color: '#C2410C', bg: '#FFEDD5', border: '#F97316', desc: 'Sub-millisecond impulse response & latency' },
  { id: 'math', name: 'Math', category: 'Quantitative', color: '#0369A1', bg: '#E0F2FE', border: '#0EA5E9', desc: 'Rapid mental arithmetic under time pressure' },
  { id: 'deductive', name: 'Deductive', category: 'Inference', color: '#0F766E', bg: '#CCFBF1', border: '#14B8A6', desc: 'Evaluate premise validity & formal syllogisms' }
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
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 640;
  const isTablet = windowWidth < 900;
  const radius = isMobile ? 122 : isTablet ? 170 : 230;
  const stageWidth = isMobile ? 320 : isTablet ? 460 : 640;
  const stageHeight = isMobile ? 320 : isTablet ? 460 : 600;
  const viewBox = isMobile ? "-160 -160 320 320" : isTablet ? "-230 -230 460 460" : "-320 -300 640 600";
  const coreSize = isMobile ? 132 : isTablet ? 175 : 230;

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

  return (
    <div style={{
      minHeight: 'calc(100vh - 64px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      padding: isMobile ? '12px 8px 24px' : '20px',
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
        marginBottom: isMobile ? '8px' : '16px'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '3px 10px',
          borderRadius: '9999px',
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(8px)',
          border: '1.5px solid #E2DBCF',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          fontSize: isMobile ? '0.65rem' : '0.74rem',
          fontWeight: 800,
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-secondary)'
        }}>
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: 'var(--accent-vermillion)',
            boxShadow: '0 0 6px rgba(255,59,32,0.8)'
          }} />
          <span>NEURAL MATRIX // 8 COGNITIVE NODES</span>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────
          CENTRAL INTERCONNECTED CONSTELLATION STAGE
      ──────────────────────────────────────────────────────────── */}
      <div style={{
        position: 'relative',
        width: `${stageWidth}px`,
        height: `${stageHeight}px`,
        maxWidth: '100vw',
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
          viewBox={viewBox}
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
          const nodeWidth = isMobile ? (isHovered ? 44 : 36) : (isHovered ? 64 : 54);
          const iconSize = isMobile ? (isHovered ? 22 : 18) : (isHovered ? 34 : 26);

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
                width: `${nodeWidth}px`,
                height: `${nodeWidth}px`,
                borderRadius: '50%',
                background: isHovered ? node.bg : '#FFFFFF',
                border: `2px solid ${isHovered ? node.border : '#121110'}`,
                boxShadow: isHovered 
                  ? `0 0 14px ${node.border}66, 2px 2px 0px #121110` 
                  : '1.5px 1.5px 0px #121110',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.25s ease'
              }}>
                <CognitiveIllustration 
                  gameId={node.id} 
                  size={iconSize} 
                  color={node.color} 
                />
              </div>

              {/* Clean External Label */}
              <div style={{
                marginTop: isMobile ? '3px' : '6px',
                padding: isMobile ? '1px 5px' : '2px 8px',
                borderRadius: '9999px',
                background: isHovered ? '#121110' : 'rgba(255, 255, 255, 0.95)',
                color: isHovered ? '#FFFFFF' : 'var(--text-primary)',
                border: '1px solid ' + (isHovered ? '#121110' : '#E2DBCF'),
                fontSize: isMobile ? '0.56rem' : '0.68rem',
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
          width: `${coreSize}px`,
          height: `${coreSize}px`,
          borderRadius: '50%',
          background: '#FFFFFF',
          border: '2.5px solid var(--border-ink)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.06), 3px 3px 0px #121110',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: isMobile ? '10px' : '20px',
          boxSizing: 'border-box',
          transition: 'all 0.3s ease'
        }}>
          
          {/* Inner Dashed Dial */}
          <div style={{
            position: 'absolute',
            inset: '5px',
            borderRadius: '50%',
            border: '1px dashed #E2DBCF',
            pointerEvents: 'none'
          }} />

          {/* If a node is hovered: show that node's clean info */}
          {activeNode ? (
            <div style={{ animation: 'floatGentle 3s ease infinite', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: isMobile ? '32px' : '46px',
                height: isMobile ? '32px' : '46px',
                borderRadius: '10px',
                background: activeNode.bg,
                border: `1.5px solid ${activeNode.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '2px',
                boxShadow: `0 2px 8px ${activeNode.border}33`
              }}>
                <CognitiveIllustration 
                  gameId={activeNode.id} 
                  size={isMobile ? 20 : 30} 
                  color={activeNode.color} 
                />
              </div>
              <div style={{
                fontFamily: 'var(--font-poster)',
                fontSize: isMobile ? '0.9rem' : '1.25rem',
                fontWeight: 900,
                color: 'var(--text-primary)',
                marginTop: '1px',
                textTransform: 'uppercase'
              }}>
                {activeNode.name}
              </div>
              <div style={{
                fontSize: isMobile ? '0.52rem' : '0.66rem',
                fontFamily: 'var(--font-mono)',
                color: activeNode.color,
                fontWeight: 800,
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
                  marginTop: isMobile ? '6px' : '10px',
                  padding: isMobile ? '4px 10px' : '5px 14px',
                  fontSize: isMobile ? '0.64rem' : '0.74rem',
                  boxShadow: '2px 2px 0px #121110',
                  gap: '3px'
                }}
              >
                <Play size={10} />
                <span>PLAY NOW</span>
              </button>
            </div>
          ) : (
            /* Default Idle QIVORA Logo & Actions */
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              
              {/* Logo Dot Accent */}
              <div style={{
                width: isMobile ? '7px' : '10px',
                height: isMobile ? '7px' : '10px',
                borderRadius: '50%',
                background: 'var(--accent-vermillion)',
                marginBottom: '2px',
                boxShadow: '0 0 8px rgba(255,59,32,0.6)'
              }} />

              {/* BRAND LOGO */}
              <h1 style={{
                fontFamily: 'var(--font-display)',
                fontSize: isMobile ? '1.5rem' : '2.3rem',
                fontWeight: 900,
                letterSpacing: '-0.04em',
                lineHeight: 1,
                color: 'var(--text-primary)',
                margin: 0
              }}>
                QIVORA
              </h1>

              <div style={{
                fontSize: isMobile ? '0.48rem' : '0.58rem',
                fontWeight: 800,
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-muted)',
                letterSpacing: '0.1em',
                marginTop: '3px',
                marginBottom: isMobile ? '6px' : '12px'
              }}>
                THINK FASTER · PLAY SMARTER
              </div>

              {/* Clean Quick Launch Buttons */}
              <div style={{ display: 'flex', gap: isMobile ? '4px' : '6px' }}>
                <button
                  onClick={onOpenDashboard}
                  style={{
                    padding: isMobile ? '4px 8px' : '6px 12px',
                    borderRadius: '9999px',
                    background: '#121110',
                    color: '#FFFFFF',
                    border: '1.5px solid #121110',
                    fontSize: isMobile ? '0.62rem' : '0.72rem',
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
                    padding: isMobile ? '4px 8px' : '6px 10px',
                    borderRadius: '9999px',
                    background: 'var(--bg-cream)',
                    color: 'var(--text-primary)',
                    border: '1.5px solid #121110',
                    fontSize: isMobile ? '0.62rem' : '0.72rem',
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
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap: isMobile ? '6px' : '10px',
        marginTop: isMobile ? '6px' : '12px',
        padding: isMobile ? '4px 12px' : '6px 16px',
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
            gap: '4px',
            padding: '3px 8px',
            borderRadius: '9999px',
            border: '1px solid #121110',
            background: isRotating ? '#121110' : 'var(--accent-yellow)',
            color: isRotating ? '#FFFFFF' : '#121110',
            cursor: 'pointer',
            fontSize: isMobile ? '0.65rem' : '0.72rem',
            fontWeight: 800,
            fontFamily: 'var(--font-mono)'
          }}
        >
          {isRotating ? <Pause size={10} /> : <Play size={10} />}
          <span>{isRotating ? 'PAUSE' : 'ROTATE'}</span>
        </button>

        {/* Speed Control Toggle */}
        <button
          onClick={() => {
            sounds.playClick();
            setSpeedMultiplier(prev => (prev === 1 ? 2 : prev === 2 ? 0.5 : 1));
          }}
          style={{
            padding: '3px 8px',
            borderRadius: '9999px',
            border: '1px solid #E2DBCF',
            background: 'var(--bg-main)',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            fontSize: isMobile ? '0.65rem' : '0.72rem',
            fontWeight: 800,
            fontFamily: 'var(--font-mono)'
          }}
        >
          {speedMultiplier}x
        </button>

        {/* Direct Link to Full Dashboard */}
        <button
          onClick={onOpenDashboard}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '3px 8px',
            borderRadius: '9999px',
            border: 'none',
            background: 'transparent',
            color: 'var(--accent-vermillion)',
            cursor: 'pointer',
            fontSize: isMobile ? '0.68rem' : '0.74rem',
            fontWeight: 800,
            fontFamily: 'var(--font-mono)'
          }}
        >
          <span>DASHBOARD</span>
          <ArrowRight size={11} />
        </button>
      </div>

    </div>
  );
};

