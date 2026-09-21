import React, { useState } from 'react';
import { GameId } from '../types';
import { ArrowRight, Play, RotateCw } from 'lucide-react';

interface PlaygroundLobbyProps {
  onSelectGame: (gameId: GameId) => void;
  lastPlayedGame?: {
    gameId: GameId;
    label: string;
    level: string;
  };
}

export const PlaygroundLobby: React.FC<PlaygroundLobbyProps> = ({
  onSelectGame,
  lastPlayedGame = { gameId: 'switch', label: 'Switch', level: 'Level 4' }
}) => {
  // Interactive mini preview for Switch tile
  const [switchMini, setSwitchMini] = useState<boolean[]>([true, false, false, true]);
  const handleMiniToggle = (e: React.MouseEvent, idx1: number, idx2: number) => {
    e.stopPropagation();
    setSwitchMini(prev => {
      const next = [...prev];
      next[idx1] = !next[idx1];
      next[idx2] = !next[idx2];
      return next;
    });
  };

  return (
    <div style={{ padding: '48px 0 80px 0' }}>
      <div className="container">
        {/* Main Headline in Poster Typography */}
        <div style={{ marginBottom: '48px' }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem',
            fontWeight: 900,
            color: 'var(--accent-vermillion)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em'
          }}>
            COGNITIVE PLAYGROUND // SELECTION
          </span>
          <h1 className="poster-headline" style={{
            fontSize: 'clamp(3rem, 6.5vw, 5.2rem)',
            marginTop: '8px'
          }}>
            WHAT DO YOU WANT TO PLAY?
          </h1>
        </div>

        {/* Asymmetric Visual Collection of Game Tiles */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: '24px',
          marginBottom: '56px'
        }}>
          {/* Tile 1: INDUCTIVE (Spans 7 cols) - Rotating geometric visuals */}
          <div
            className="editorial-tile"
            onClick={() => onSelectGame('inductive')}
            style={{
              gridColumn: 'span 7',
              padding: '38px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '350px',
              background: '#FFFFFF'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span className="btn-pill-small" style={{ background: 'var(--bg-cream)' }}>INDUCTIVE</span>
                <h3 className="poster-sub" style={{ fontSize: '2.4rem', marginTop: '14px' }}>FIND THE RULE.</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '400px', marginTop: '8px' }}>
                  Extract underlying patterns across shape cycling, count permutations, and rotational sequences.
                </p>
              </div>

              {/* Animated Geometric Playground Visual */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <div className="anim-spin" style={{ width: '52px', height: '52px' }}>
                  <svg width="52" height="52" viewBox="0 0 50 50">
                    <polygon points="25,4 46,42 4,42" fill="var(--accent-vermillion)" stroke="#121110" strokeWidth="2.5" />
                  </svg>
                </div>
                <div className="anim-spin" style={{ width: '52px', height: '52px', animationDirection: 'reverse' }}>
                  <svg width="52" height="52" viewBox="0 0 50 50">
                    <rect x="8" y="8" width="34" height="34" rx="4" fill="var(--accent-yellow)" stroke="#121110" strokeWidth="2.5" />
                  </svg>
                </div>
                <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'var(--accent-mint)', border: '2.5px solid #121110', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.2rem' }}>
                  ?
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', borderTop: '2px solid var(--border-subtle)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                Rule Extrapolation • AI Demo Included
              </span>
              <span style={{ fontWeight: 900, color: 'var(--accent-vermillion)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                PLAY NOW →
              </span>
            </div>
          </div>

          {/* Tile 2: GRID / MATRIX (Spans 5 cols) - Modular tiles */}
          <div
            className="editorial-tile"
            onClick={() => onSelectGame('grid')}
            style={{
              gridColumn: 'span 5',
              padding: '38px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '350px',
              background: 'var(--bg-cream)'
            }}
          >
            <div>
              <span className="btn-pill-small" style={{ background: 'var(--accent-yellow)' }}>GRID</span>
              <h3 className="poster-sub" style={{ fontSize: '2.1rem', marginTop: '14px' }}>COMPLETE THE PATTERN.</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '6px' }}>
                Raven's progressive matrices with dual-axis transformations.
              </p>
            </div>

            {/* 3x3 Mini Grid Visual */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 40px)',
              gridTemplateRows: 'repeat(3, 40px)',
              gap: '6px',
              margin: '20px 0',
              alignSelf: 'center'
            }}>
              {Array.from({ length: 8 }, (_, i) => (
                <div key={i} style={{
                  background: '#FFFFFF',
                  border: '2px solid var(--border-ink)',
                  borderRadius: 'var(--radius-xs)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.9rem',
                  fontWeight: 900
                }}>
                  {['▲', '■', '●', '●', '▲', '■', '■', '●'][i]}
                </div>
              ))}
              <div style={{
                background: 'var(--accent-vermillion)',
                color: '#FFF',
                border: '2px solid var(--border-ink)',
                borderRadius: 'var(--radius-xs)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '1rem'
              }}>
                ?
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '2px solid var(--border-subtle)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                Spatial Matrices
              </span>
              <span style={{ fontWeight: 900, color: 'var(--accent-vermillion)' }}>PLAY →</span>
            </div>
          </div>

          {/* Tile 3: SWITCH (Spans 6 cols) - Live toggle graphics directly on card */}
          <div
            className="editorial-tile"
            onClick={() => onSelectGame('switch')}
            style={{
              gridColumn: 'span 6',
              padding: '38px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '340px',
              background: '#FFFFFF'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="btn-pill-small" style={{ background: 'var(--accent-mint-light)', color: '#065F46' }}>SWITCH</span>
                <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--accent-vermillion)' }}>INTERACTIVE TOGGLES</span>
              </div>
              <h3 className="poster-sub" style={{ fontSize: '2.2rem', marginTop: '14px' }}>REACH THE TARGET.</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '6px' }}>
                Interconnected switch bitmasks verified by BFS graph exploration to ensure shortest paths.
              </p>
            </div>

            {/* Live Interactive Toggles on Card */}
            <div style={{
              background: 'var(--bg-main)',
              border: '2px solid var(--border-ink)',
              borderRadius: 'var(--radius-md)',
              padding: '18px',
              margin: '18px 0'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '14px' }}>
                {switchMini.map((on, i) => (
                  <div
                    key={i}
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      background: on ? 'var(--accent-vermillion)' : '#FFFFFF',
                      border: '2.5px solid var(--border-ink)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.9rem',
                      color: on ? '#FFF' : '#121110',
                      fontWeight: 900
                    }}
                  >
                    {on ? '●' : '○'}
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={(e) => handleMiniToggle(e, 0, 1)}
                  style={{ flex: 1, padding: '8px', fontSize: '0.8rem', fontWeight: 800, borderRadius: 'var(--radius-xs)', border: '1.5px solid #121110', background: '#FFF', cursor: 'pointer', fontFamily: 'var(--font-mono)' }}
                >
                  S1 [1, 2]
                </button>
                <button
                  onClick={(e) => handleMiniToggle(e, 1, 3)}
                  style={{ flex: 1, padding: '8px', fontSize: '0.8rem', fontWeight: 800, borderRadius: 'var(--radius-xs)', border: '1.5px solid #121110', background: '#FFF', cursor: 'pointer', fontFamily: 'var(--font-mono)' }}
                >
                  S2 [2, 4]
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                Cognitive Flexibility
              </span>
              <span style={{ fontWeight: 900, color: 'var(--accent-vermillion)' }}>PLAY →</span>
            </div>
          </div>

          {/* Tile 4: MEMORY (Spans 6 cols) - Flickering objects */}
          <div
            className="editorial-tile"
            onClick={() => onSelectGame('memory')}
            style={{
              gridColumn: 'span 6',
              padding: '38px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '340px',
              background: '#FFFFFF'
            }}
          >
            <div>
              <span className="btn-pill-small" style={{ background: 'var(--accent-lavender-light)', color: '#4C1D95' }}>MEMORY</span>
              <h3 className="poster-sub" style={{ fontSize: '2.2rem', marginTop: '14px' }}>REMEMBER WHAT YOU SEE.</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '6px' }}>
                Transient spatial arrays flash for 2 seconds then vanish. Reconstruct the coordinates.
              </p>
            </div>

            {/* Visual demo: disappearing tiles */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', margin: '20px 0' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: 'var(--radius-sm)', background: 'var(--text-primary)', border: '2.5px solid #121110' }} />
              <div className="anim-pulse" style={{ width: '52px', height: '52px', borderRadius: 'var(--radius-sm)', background: 'var(--accent-lavender)', border: '2.5px solid #121110' }} />
              <div style={{ width: '52px', height: '52px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-cream)', border: '2.5px solid #121110' }} />
              <div style={{ width: '52px', height: '52px', borderRadius: 'var(--radius-sm)', background: 'var(--text-primary)', border: '2.5px solid #121110' }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '2px solid var(--border-subtle)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                Visual-Spatial Capacity
              </span>
              <span style={{ fontWeight: 900, color: 'var(--accent-vermillion)' }}>PLAY →</span>
            </div>
          </div>

          {/* Tile 5: ATTENTION (Spans 4 cols) */}
          <div
            className="editorial-tile"
            onClick={() => onSelectGame('attention')}
            style={{
              gridColumn: 'span 4',
              padding: '30px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '270px',
              background: '#FFFFFF'
            }}
          >
            <div>
              <span className="btn-pill-small" style={{ background: '#FEE2E2', color: '#991B1B' }}>ATTENTION</span>
              <h3 className="poster-sub" style={{ fontSize: '1.8rem', marginTop: '12px' }}>SPOT THE DIFFERENCE.</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '6px' }}>
                High-speed selective scanning against distractor noise.
              </p>
            </div>
            <div style={{ fontWeight: 900, color: 'var(--accent-vermillion)', marginTop: '16px' }}>PLAY →</div>
          </div>

          {/* Tile 6: REACTION (Spans 4 cols) */}
          <div
            className="editorial-tile"
            onClick={() => onSelectGame('reaction')}
            style={{
              gridColumn: 'span 4',
              padding: '30px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '270px',
              background: 'var(--accent-vermillion)',
              color: '#FFFFFF'
            }}
          >
            <div>
              <span className="btn-pill-small" style={{ background: '#FFFFFF', color: '#121110' }}>REACTION</span>
              <h3 className="poster-sub" style={{ fontSize: '1.8rem', marginTop: '12px', color: '#FFFFFF' }}>REACT ON TIME.</h3>
              <p style={{ color: '#FFEAE6', fontSize: '0.9rem', marginTop: '6px' }}>
                Pure millisecond latency with anti-anticipation false-start penalty.
              </p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
              <div className="anim-pulse" style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#FFFFFF' }} />
              <div style={{ fontWeight: 900, color: '#FFFFFF' }}>PLAY →</div>
            </div>
          </div>

          {/* Tile 7: DEDUCTIVE (Spans 4 cols) */}
          <div
            className="editorial-tile"
            onClick={() => onSelectGame('deductive')}
            style={{
              gridColumn: 'span 4',
              padding: '30px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '270px',
              background: 'var(--bg-cream)'
            }}
          >
            <div>
              <span className="btn-pill-small" style={{ background: '#FFFFFF' }}>DEDUCTIVE</span>
              <h3 className="poster-sub" style={{ fontSize: '1.8rem', marginTop: '12px' }}>FOLLOW THE LOGIC.</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '6px' }}>
                Categorical syllogisms and propositional constraint satisfaction.
              </p>
            </div>
            <div style={{ fontWeight: 900, color: 'var(--accent-vermillion)', marginTop: '16px' }}>PLAY →</div>
          </div>
        </div>

        {/* BOTTOM: CONTINUE (Only latest unfinished activity, no 10 statistics!) */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '2.5px solid var(--border-ink)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-tactile)',
          padding: '28px 36px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              CONTINUE WHERE YOU LEFT OFF:
            </span>
            <div className="poster-sub" style={{ fontSize: '1.6rem', color: 'var(--text-primary)', marginTop: '4px' }}>
              {lastPlayedGame.label} — {lastPlayedGame.level}.
            </div>
          </div>

          <button
            className="btn-vermillion"
            onClick={() => onSelectGame(lastPlayedGame.gameId)}
          >
            <span>CONTINUE →</span>
          </button>
        </div>
      </div>
    </div>
  );
};
