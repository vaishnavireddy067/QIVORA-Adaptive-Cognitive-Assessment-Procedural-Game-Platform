import React from 'react';
import { GameId } from '../types';
import { CognitiveIllustration } from '../components/common/CognitiveIllustrations';

interface GamesLobbyPageProps {
  onSelectGame: (gameId: GameId) => void;
  onNavigateTab: (tab: string) => void;
  activeTab?: string;
  userName?: string;
  onOpenAuth?: () => void;
}

interface GameCardItem {
  id: GameId;
  num: string;
  badgeBg: string;
  badgeColor: string;
  badgeIcon: React.ReactNode;
  title: string;
  desc: string;
  subtypes: string[];
  cardBg: string;
  renderVisual: () => React.ReactNode;
}

export const GamesLobbyPage: React.FC<GamesLobbyPageProps> = ({
  onSelectGame,
  onNavigateTab,
  activeTab = 'games',
  userName = 'Vaishnavi',
  onOpenAuth,
}) => {
  const games: GameCardItem[] = [
    // 01 Inductive Reasoning
    {
      id: 'inductive',
      num: '01',
      badgeBg: '#F59E0B',
      badgeColor: '#FFFFFF',
      badgeIcon: <CognitiveIllustration gameId="inductive" size={16} color="#FFFFFF" />,
      title: 'Inductive Reasoning',
      desc: 'Pattern extrapolation & latent rule discovery.',
      subtypes: ['Sequence', 'Matrix', 'Analogy', 'Rule Discovery'],
      cardBg: '#FFF8E7',
      renderVisual: () => (
        <div style={{
          height: '100%',
          width: '100%',
          background: '#FFFDF9',
          border: '1.5px solid #F1ECE1',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}>
          <div style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24"><polygon points="12,3 22,21 2,21" fill="#6366F1" /></svg>
          </div>
          <div style={{ width: '20px', height: '20px', borderRadius: '4px', background: '#38BDF8' }} />
          <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#F43F5E' }} />
          <span style={{ fontSize: '0.9rem', color: '#F97316', fontWeight: 900 }}>→</span>
          <div style={{
            width: '26px', height: '26px',
            border: '2px dashed #94A3B8',
            borderRadius: '6px',
            background: '#F8FAFC',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#64748B', fontWeight: 900, fontSize: '0.9rem'
          }}>?</div>
        </div>
      )
    },

    // 02 Deductive Reasoning
    {
      id: 'deductive',
      num: '02',
      badgeBg: '#0EA5E9',
      badgeColor: '#FFFFFF',
      badgeIcon: <CognitiveIllustration gameId="deductive" size={16} color="#FFFFFF" />,
      title: 'Deductive Reasoning',
      desc: 'Constraint satisfaction & formal logic.',
      subtypes: ['Conditional Logic', 'Ordering', 'Constraints', 'Logical Elimination'],
      cardBg: '#EEF6FC',
      renderVisual: () => (
        <div style={{
          height: '100%',
          width: '100%',
          background: '#0A192F',
          borderRadius: '12px',
          padding: '8px',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '6px',
          alignItems: 'center',
          justifyItems: 'center',
          boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.5)'
        }}>
          {['●', '✕', '✕', '▲', '✕', '✕', '●', '●', '◎'].map((symbol, idx) => (
            <div key={idx} style={{
              width: '26px', height: '26px',
              borderRadius: '6px',
              background: 'rgba(255,255,255,0.06)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: symbol === '✕' ? '#0284C7' : symbol === '◎' ? '#F43F5E' : '#38BDF8',
              fontWeight: 900,
              fontSize: '0.85rem'
            }}>
              {symbol}
            </div>
          ))}
        </div>
      )
    },

    // 03 Spatial Reasoning
    {
      id: 'grid',
      num: '03',
      badgeBg: '#0284C7',
      badgeColor: '#FFFFFF',
      badgeIcon: <CognitiveIllustration gameId="grid" size={16} color="#FFFFFF" />,
      title: 'Spatial Reasoning',
      desc: 'Mental rotation, symmetry & spatial grids.',
      subtypes: ['Grid', 'Rotation', 'Mirror', 'Symmetry', 'Transformation'],
      cardBg: '#E0F2FE',
      renderVisual: () => (
        <div style={{
          height: '100%',
          width: '100%',
          background: 'linear-gradient(145deg, #0284C7, #0369A1)',
          borderRadius: '12px',
          padding: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          position: 'relative',
          boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.2)'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px' }}>
            <div style={{ width: '12px', height: '12px', background: '#FFF', borderRadius: '3px' }} />
            <div style={{ width: '4px', height: '4px', background: 'rgba(255,255,255,0.4)', borderRadius: '50%', margin: 'auto' }} />
            <div style={{ width: '4px', height: '4px', background: 'rgba(255,255,255,0.4)', borderRadius: '50%', margin: 'auto' }} />
            <div style={{ width: '12px', height: '12px', background: '#FFF', borderRadius: '3px' }} />
          </div>
          <div style={{ width: '1px', height: '70%', borderLeft: '1.5px dashed rgba(255,255,255,0.6)' }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px' }}>
            <div style={{ width: '4px', height: '4px', background: 'rgba(255,255,255,0.4)', borderRadius: '50%', margin: 'auto' }} />
            <div style={{ width: '12px', height: '12px', background: '#FFF', borderRadius: '3px' }} />
            <div style={{ width: '12px', height: '12px', background: '#FFF', borderRadius: '3px' }} />
            <div style={{ width: '4px', height: '4px', background: 'rgba(255,255,255,0.4)', borderRadius: '50%', margin: 'auto' }} />
          </div>
          <div style={{
            position: 'absolute', bottom: '6px',
            background: 'rgba(219,39,119,0.85)', color: '#FFF',
            padding: '2px 8px', borderRadius: '6px', fontSize: '0.62rem', fontWeight: 800
          }}>
            is it symmetrical?
          </div>
        </div>
      )
    },

    // 04 Switch Challenge (Cognitive Flexibility)
    {
      id: 'switch',
      num: '04',
      badgeBg: '#F97316',
      badgeColor: '#FFFFFF',
      badgeIcon: <CognitiveIllustration gameId="switch" size={16} color="#FFFFFF" />,
      title: 'Switch Challenge',
      desc: 'Pipeline operators, symbol permutations & reverse rules.',
      subtypes: ['Switch Operator', 'Task Switch', 'Reverse Rule', 'Dual Pipeline'],
      cardBg: '#FFF1EA',
      renderVisual: () => (
        <div style={{
          height: '100%',
          width: '100%',
          background: '#0B132B',
          borderRadius: '12px',
          padding: '8px 12px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '2px', background: '#3A506B' }} />
            {['#F43F5E', '#FBBF24', '#F97316', '#34D399', '#38BDF8'].map((c, i) => (
              <div key={i} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c, zIndex: 2 }} />
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            {['4', '3', '2', '1'].map((val, i) => (
              <div key={i} style={{
                width: '20px', height: '20px', borderRadius: '50%',
                background: '#1C2541', border: '1px solid #48CAE4',
                color: '#FBBF24', fontSize: '0.65rem', fontWeight: 900,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>{val}</div>
            ))}
          </div>
        </div>
      )
    },

    // 05 Working Memory
    {
      id: 'memory',
      num: '05',
      badgeBg: '#14B8A6',
      badgeColor: '#FFFFFF',
      badgeIcon: <CognitiveIllustration gameId="memory" size={16} color="#FFFFFF" />,
      title: 'Working Memory',
      desc: 'Dual-stage recall under active interference.',
      subtypes: ['Digit', 'Spatial', 'Sequence', 'Delayed', 'Interference'],
      cardBg: '#E9F9F8',
      renderVisual: () => (
        <div style={{
          height: '100%',
          width: '100%',
          background: '#0F172A',
          borderRadius: '12px',
          padding: '8px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-around'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
            <span style={{ color: '#FBBF24', fontSize: '0.85rem' }}>★</span>
            <span style={{ color: '#F43F5E', fontSize: '0.85rem' }}>▲</span>
            <span style={{ color: '#38BDF8', fontSize: '0.85rem' }}>●</span>
            <span style={{ color: '#34D399', fontSize: '0.85rem' }}>■</span>
          </div>
          <div style={{ height: '4px', background: 'linear-gradient(90deg, #38BDF8, #F43F5E)', borderRadius: '4px' }} />
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            {[0, 1, 2, 3].map(i => (
              <div key={i} style={{ width: '18px', height: '18px', border: '1.5px dashed #475569', borderRadius: '4px' }} />
            ))}
          </div>
        </div>
      )
    },

    // 06 Attention & Focus
    {
      id: 'attention',
      num: '06',
      badgeBg: '#A855F7',
      badgeColor: '#FFFFFF',
      badgeIcon: <CognitiveIllustration gameId="attention" size={16} color="#FFFFFF" />,
      title: 'Attention & Focus',
      desc: 'Selective visual scanning & distractor filtering.',
      subtypes: ['Target Detection', 'Visual Search', 'Distractors', 'Change Detection'],
      cardBg: '#F5EEFD',
      renderVisual: () => (
        <div style={{
          height: '100%',
          width: '100%',
          background: '#0F172A',
          borderRadius: '12px',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {[
            { x: '20%', y: '25%', c: '#38BDF8' }, { x: '80%', y: '20%', c: '#F472B6' },
            { x: '15%', y: '70%', c: '#FBBF24' }, { x: '75%', y: '75%', c: '#34D399' },
            { x: '40%', y: '15%', c: '#A78BFA' }, { x: '85%', y: '50%', c: '#F87171' }
          ].map((dot, i) => (
            <div key={i} style={{
              position: 'absolute', left: dot.x, top: dot.y,
              width: '8px', height: '8px', borderRadius: '50%', background: dot.c,
              opacity: 0.85
            }} />
          ))}
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%',
            border: '2px solid #FACC15',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', boxShadow: '0 0 12px rgba(250,204,21,0.5)'
          }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#FACC15' }} />
          </div>
        </div>
      )
    },

    // 07 Processing Speed
    {
      id: 'reaction',
      num: '07',
      badgeBg: '#EAB308',
      badgeColor: '#FFFFFF',
      badgeIcon: <CognitiveIllustration gameId="reaction" size={16} color="#FFFFFF" />,
      title: 'Processing Speed',
      desc: 'Rapid categorization & reaction latency.',
      subtypes: ['Reaction', 'Rapid Match', 'Go/No-Go', 'Comparison'],
      cardBg: '#FCF5E9',
      renderVisual: () => (
        <div style={{
          height: '100%',
          width: '100%',
          background: '#0F172A',
          borderRadius: '12px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4px'
        }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '50%',
            border: '2px solid #06B6D4',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 14px rgba(6,182,212,0.4)'
          }}>
            <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#FBBF24' }} />
          </div>
          <span style={{ fontSize: '0.68rem', fontWeight: 900, color: '#FFF', letterSpacing: '0.04em' }}>Tap!</span>
        </div>
      )
    },

    // 08 Motion & Prediction
    {
      id: 'motion',
      num: '08',
      badgeBg: '#EC4899',
      badgeColor: '#FFFFFF',
      badgeIcon: <CognitiveIllustration gameId="motion" size={16} color="#FFFFFF" />,
      title: 'Motion & Prediction',
      desc: 'Dynamic trajectory tracking & collision timing.',
      subtypes: ['Tracking', 'Trajectory', 'Prediction', 'Collision'],
      cardBg: '#FEEFEF',
      renderVisual: () => (
        <div style={{
          height: '100%',
          width: '100%',
          background: '#0F172A',
          borderRadius: '12px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
            <path d="M 20 45 Q 60 70 90 35 T 140 25" fill="none" stroke="#06B6D4" strokeWidth="2" strokeDasharray="3 3" />
          </svg>
          <div style={{
            position: 'absolute', left: '30px', top: '40px',
            width: '12px', height: '12px', borderRadius: '50%',
            background: '#22D3EE', boxShadow: '0 0 10px #22D3EE'
          }} />
          <div style={{
            position: 'absolute', right: '25px', top: '18px',
            width: '18px', height: '18px', borderRadius: '50%',
            border: '2px solid #FACC15',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#FACC15' }} />
          </div>
        </div>
      )
    },

    // 09 Numerical Reasoning
    {
      id: 'math',
      num: '09',
      badgeBg: '#10B981',
      badgeColor: '#FFFFFF',
      badgeIcon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M4 12h16M12 4v16" />
        </svg>
      ),
      title: 'Numerical Reasoning',
      desc: 'Mental arithmetic, sequences & constraint equations.',
      subtypes: ['Arithmetic', 'Equation', 'Constraints', 'Sequences', 'Target Number'],
      cardBg: '#EDF8EE',
      renderVisual: () => (
        <div style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          background: 'linear-gradient(135deg, #e3f5e5 0%, #d5eed8 100%)',
          borderRadius: '12px'
        }}>
          <div style={{
            width: '38px', height: '38px', borderRadius: '10px',
            background: 'linear-gradient(145deg, #FF6B81, #EE5253)',
            boxShadow: '0 4px 10px rgba(238,82,83,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#FFF', fontWeight: 900, fontSize: '1.2rem',
            transform: 'rotate(-6deg)'
          }}>+</div>
          <div style={{
            width: '38px', height: '38px', borderRadius: '10px',
            background: 'linear-gradient(145deg, #2ED573, #10AC84)',
            boxShadow: '0 4px 10px rgba(16,172,132,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#FFF', fontWeight: 900, fontSize: '1.2rem',
            transform: 'rotate(6deg)'
          }}>−</div>
          <div style={{
            width: '38px', height: '38px', borderRadius: '10px',
            background: 'linear-gradient(145deg, #FFA502, #FF7F50)',
            boxShadow: '0 4px 10px rgba(255,127,80,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#FFF', fontWeight: 900, fontSize: '1.2rem',
            transform: 'rotate(-4deg)'
          }}>×</div>
          <div style={{
            width: '38px', height: '38px', borderRadius: '10px',
            background: 'linear-gradient(145deg, #1E90FF, #3742FA)',
            boxShadow: '0 4px 10px rgba(55,66,250,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#FFF', fontWeight: 900, fontSize: '1.2rem',
            transform: 'rotate(8deg)'
          }}>÷</div>
        </div>
      )
    }
  ];

  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const [searchTerm, setSearchTerm] = React.useState<string>('');

  const categoryMap: Record<string, GameId[]> = {
    all: ['inductive', 'deductive', 'grid', 'switch', 'memory', 'attention', 'reaction', 'motion', 'math'],
    logic: ['inductive', 'deductive'],
    spatial_math: ['grid', 'math', 'motion'],
    attention_speed: ['attention', 'reaction'],
    executive: ['switch', 'memory']
  };

  const filteredGames = games.filter(g => {
    const matchesCat = categoryMap[selectedCategory]?.includes(g.id);
    const matchesSearch = searchTerm.trim() === '' || 
      g.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.subtypes.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div style={{
      minHeight: '100vh',
      background: '#FCF9F2',
      color: '#121110',
      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif"
    }}>
      {/* ── Main Container ───────────────────────────────────── */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 16px 60px' }}>
        
        {/* Hero Section */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '20px',
          marginBottom: '32px',
          position: 'relative'
        }}>
          <div>
            {/* Tagline */}
            <div style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              letterSpacing: '0.18em',
              color: '#9CA3AF',
              textTransform: 'uppercase',
              marginBottom: '10px'
            }}>
              COGNITIVE ASSESSMENT PLATFORM • 9 GAME-BASED ENGINES
            </div>

            {/* Display Headline */}
            <h1 style={{
              fontSize: 'clamp(2.5rem, 4.5vw, 4rem)',
              fontWeight: 950,
              lineHeight: 1.06,
              letterSpacing: '-0.04em',
              color: '#141312',
              margin: '0 0 14px 0',
              fontFamily: "'Syne', sans-serif"
            }}>
              Train Your Thinking. <br />
              <span style={{ color: '#FF4D36' }}>Get Assessment-Ready.</span>
            </h1>

            <p style={{
              fontSize: '1.05rem',
              color: '#52504C',
              fontWeight: 500,
              margin: 0
            }}>
              Practice the 9 pure game-based cognitive aptitude engines with procedural tests and live AI solvers.
            </p>
          </div>

          {/* Right Side Playful Handwritten Doodle & Geometric Art */}
          <div style={{
            position: 'relative',
            paddingTop: '8px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px'
            }}>
              <div style={{
                fontFamily: "'Caveat', cursive, sans-serif",
                fontSize: '1.25rem',
                lineHeight: 1.35,
                color: '#4B5563',
                textAlign: 'left',
                transform: 'rotate(-4deg)'
              }}>
                9 Assessment Engines.<br />
                Real task models.<br />
                Targeted practice.
              </div>

              {/* Curved Hand-drawn arrow */}
              <svg width="40" height="40" viewBox="0 0 50 50" style={{ transform: 'rotate(10deg)', marginTop: '10px' }}>
                <path d="M10 15 Q 35 15 35 38" fill="none" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
                <path d="M28 32 L35 39 L42 32" fill="none" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* Colorful Geometric Shapes matching Image 2 */}
            <div style={{ position: 'relative', width: '130px', height: '100px', marginTop: '10px' }}>
              {/* Lilac Sparkle Star */}
              <div style={{
                position: 'absolute',
                top: '-20px',
                left: '-10px',
                color: '#818CF8',
                fontSize: '2rem'
              }}>✦</div>

              {/* Lime/Yellow Quarter/Semi Circle */}
              <div style={{
                position: 'absolute',
                bottom: '0',
                right: '10px',
                width: '100px',
                height: '50px',
                borderTopLeftRadius: '100px',
                borderTopRightRadius: '100px',
                background: '#D4F562'
              }} />

              {/* Coral Red Circle */}
              <div style={{
                position: 'absolute',
                bottom: '10px',
                right: '-10px',
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: '#FF5733'
              }} />
            </div>
          </div>
        </div>

        {/* ── Category Filter Bar & Search Controls ────────────── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '28px',
          background: '#FFFFFF',
          border: '1.5px solid #ECE7DD',
          borderRadius: '16px',
          padding: '12px 20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
        }}>
          {/* Category Tabs */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: 'All 9 Engines' },
              { id: 'logic', label: 'Logical Reasoning' },
              { id: 'spatial_math', label: 'Spatial & Quantitative' },
              { id: 'attention_speed', label: 'Attention & Speed' },
              { id: 'executive', label: 'Executive Control' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  padding: '7px 16px',
                  borderRadius: '20px',
                  border: selectedCategory === cat.id ? '2px solid #FF5733' : '1.5px solid #E2E8F0',
                  background: selectedCategory === cat.id ? '#FFF1EA' : '#F8FAFC',
                  color: selectedCategory === cat.id ? '#FF5733' : '#64748B',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#F8FAFC',
            border: '1.5px solid #E2E8F0',
            borderRadius: '20px',
            padding: '6px 14px',
            minWidth: '220px'
          }}>
            <span style={{ color: '#94A3B8', fontSize: '0.9rem' }}>🔍</span>
            <input
              type="text"
              placeholder="Search cognitive domain..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: '0.82rem',
                color: '#1E293B',
                width: '100%',
                fontWeight: 600
              }}
            />
          </div>
        </div>

        {/* ── 13 Cognitive Assessment Cards Grid ───────────────── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '22px',
          marginBottom: '48px'
        }}>
          {filteredGames.map((game) => (
            <div
              key={game.id}
              style={{
                background: game.cardBg,
                borderRadius: '20px',
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '340px',
                border: '1px solid rgba(0,0,0,0.05)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.07)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.03)';
              }}
            >
              <div>
                {/* Top Icon Badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: game.badgeBg,
                    color: game.badgeColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.85rem',
                    fontWeight: 800
                  }}>
                    {game.badgeIcon}
                  </div>
                </div>

                {/* Illustration Preview Box */}
                <div style={{
                  height: '110px',
                  width: '100%',
                  borderRadius: '14px',
                  marginBottom: '14px',
                  overflow: 'hidden'
                }}>
                  {game.renderVisual()}
                </div>

                {/* Title */}
                <h3 style={{
                  fontSize: '1.2rem',
                  fontWeight: 900,
                  color: '#141312',
                  margin: '0 0 4px 0',
                  letterSpacing: '-0.02em',
                  fontFamily: "'Syne', sans-serif"
                }}>
                  {game.title}
                </h3>

                {/* Description */}
                <p style={{
                  fontSize: '0.82rem',
                  color: '#64748B',
                  lineHeight: 1.4,
                  margin: '0 0 10px 0'
                }}>
                  {game.desc}
                </p>

                {/* Challenge Subtypes Tags */}
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '4px',
                  marginBottom: '12px'
                }}>
                  {game.subtypes.map((st, sIdx) => (
                    <span key={sIdx} style={{
                      fontSize: '0.66rem',
                      fontWeight: 700,
                      color: '#475569',
                      background: 'rgba(0,0,0,0.06)',
                      padding: '2px 7px',
                      borderRadius: '5px',
                      letterSpacing: '0.01em'
                    }}>
                      {st}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div style={{ marginTop: '6px' }}>
                <button
                  onClick={() => onSelectGame(game.id as GameId)}
                  style={{
                    width: '100%',
                    padding: '10px 0',
                    borderRadius: '9999px',
                    background: '#141312',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'background 0.15s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#FF5733')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#141312')}
                >
                  <span>Start Training</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ── Bottom Section with Doodle & Geometric Art ───────── */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '28px',
          borderTop: '1px solid #ECE7DD',
          flexWrap: 'wrap',
          gap: '24px'
        }}>
          {/* Handwritten slogan with arrow */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <svg width="60" height="30" viewBox="0 0 80 40">
              <path d="M5 25 Q 40 5 70 20" fill="none" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
              <path d="M62 13 L72 20 L64 27" fill="none" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div style={{
              fontFamily: "'Caveat', cursive, sans-serif",
              fontSize: '1.25rem',
              color: '#334155',
              lineHeight: 1.3
            }}>
              Play the games.<br />
              Build your skills.<br />
              Get hired.
            </div>
          </div>

          {/* Abstract Geometric Art on right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ position: 'relative', width: '100px', height: '60px' }}>
              {/* Red triangle */}
              <div style={{
                position: 'absolute',
                top: 0,
                right: '10px',
                width: 0,
                height: 0,
                borderLeft: '28px solid transparent',
                borderRight: '28px solid transparent',
                borderBottom: '46px solid #FF5733',
                transform: 'rotate(25deg)'
              }} />
              {/* Yellow semi-circle */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: '10px',
                width: '50px',
                height: '25px',
                borderTopLeftRadius: '50px',
                borderTopRightRadius: '50px',
                background: '#D4F562'
              }} />
              {/* Sparkle */}
              <div style={{ position: 'absolute', top: '10px', left: '-5px', color: '#F59E0B', fontSize: '1rem' }}>✦</div>
            </div>

            {/* Footer tiny tracking caption */}
            <div style={{
              fontSize: '0.68rem',
              fontWeight: 800,
              letterSpacing: '0.16em',
              color: '#94A3B8',
              textTransform: 'uppercase'
            }}>
              COGNITIVE GAMES &nbsp;•&nbsp; BETTER TALENT &nbsp;•&nbsp; BIGGER OPPORTUNITIES
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
