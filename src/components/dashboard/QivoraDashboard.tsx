import React, { useState, useEffect } from 'react';
import { GameId, UserProfile } from '../../types';
import { 
  Home, 
  Gamepad2, 
  Target, 
  Timer, 
  BarChart3, 
  Search, 
  Bell, 
  ChevronDown, 
  ArrowRight, 
  Sparkles, 
  Play, 
  Layers, 
  Shuffle, 
  Zap, 
  Eye, 
  Calculator, 
  Globe, 
  LogIn, 
  Swords, 
  Flame, 
  Award, 
  Brain, 
  Menu, 
  X, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  TrendingUp,
  User,
  RotateCcw
} from 'lucide-react';
import { sounds } from '../../services/soundEngine';
import { getUserProfile } from '../../services/storage';
import { RadarChart } from '../charts/RadarChart';

interface QivoraDashboardProps {
  onSelectGame: (gameId: GameId) => void;
  onNavigateTab: (tab: string) => void;
  activeTab?: string;
  userName?: string;
  onOpenAuth?: () => void;
  onOpenDailyDrill?: () => void;
  onOpenDuel?: () => void;
  onOpenCertificate?: () => void;
  onOpenCopilot?: () => void;
}

export const QivoraDashboard: React.FC<QivoraDashboardProps> = ({
  onSelectGame,
  onNavigateTab,
  activeTab = 'home',
  userName = 'Vaishnavi',
  onOpenAuth,
  onOpenDailyDrill,
  onOpenDuel,
  onOpenCertificate,
  onOpenCopilot
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(sounds.getMuted());
  const [userProfile, setUserProfile] = useState<UserProfile>(getUserProfile());
  const [showRadarSection, setShowRadarSection] = useState(true);

  // Mini AI Demo interactive simulation
  const [demoStep, setDemoStep] = useState(3);
  const [isDemoRunning, setIsDemoRunning] = useState(false);

  useEffect(() => {
    setUserProfile(getUserProfile());
  }, []);

  const displayName = userName || userProfile.name || 'Candidate';
  const scores = userProfile.bestScores as Record<GameId, number>;

  const handleToggleSound = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
    if (!muted) sounds.playClick();
  };

  const handleTabChange = (tab: string) => {
    sounds.playClick();
    setIsMobileNavOpen(false);
    onNavigateTab(tab);
  };

  const handlePlayDemo = () => {
    sounds.playClick();
    setIsDemoRunning(true);
    setDemoStep(0);
    const interval = setInterval(() => {
      setDemoStep(prev => {
        if (prev >= 3) {
          clearInterval(interval);
          setIsDemoRunning(false);
          sounds.playCorrect(1);
          return 3;
        }
        sounds.playClick();
        return prev + 1;
      });
    }, 600);
  };

  // 10 Cognitive Engines Data
  const COGNITIVE_ENGINES = [
    {
      id: 'inductive' as GameId,
      num: '01',
      title: 'Inductive Reasoning',
      desc: 'Pattern sequence extrapolation, Spacio "The Same Rule" & matrix discovery.',
      icon: <Target size={18} color="#F59E0B" />,
      badgeBg: '#FEF3C7',
      category: 'logic',
      isPlacement: true,
      accentColor: '#F59E0B',
      subtypes: ['The Same Rule', 'Sequence', 'Odd One Out', 'Analogy']
    },
    {
      id: 'deductive' as GameId,
      num: '02',
      title: 'Deductive Reasoning',
      desc: 'Geo-Sudo geometrical Latin squares, rule sets & elimination logic.',
      icon: <Zap size={18} color="#0EA5E9" />,
      badgeBg: '#E0F2FE',
      category: 'logic',
      isPlacement: true,
      accentColor: '#0EA5E9',
      subtypes: ['Geo-Sudo', 'Syllogisms', 'Ordering', 'Constraints']
    },
    {
      id: 'grid' as GameId,
      num: '03',
      title: 'Spatial Reasoning',
      desc: 'Multi-Stage Grid Challenge: coordinate memory, symmetry & rotation recall.',
      icon: <Layers size={18} color="#0284C7" />,
      badgeBg: '#E0F2FE',
      category: 'spatial',
      isPlacement: true,
      accentColor: '#0284C7',
      subtypes: ['Grid Challenge', 'Rotation', 'Symmetry', 'Missing Cell']
    },
    {
      id: 'switch' as GameId,
      num: '04',
      title: 'Cognitive Flexibility',
      desc: 'Switch Challenge: 4-digit rapid transformation operators & dual pipeline routing.',
      icon: <Shuffle size={18} color="#FB923C" />,
      badgeBg: '#FFEDD5',
      category: 'executive',
      isPlacement: true,
      accentColor: '#FB923C',
      subtypes: ['Switch Machine', 'Task Switch', 'Reverse Rule', 'Dual Pipeline']
    },
    {
      id: 'memory' as GameId,
      num: '05',
      title: 'Working Memory',
      desc: 'Recall multi-element sequences and symbols under high interference distraction.',
      icon: <Sparkles size={18} color="#0D9488" />,
      badgeBg: '#CCFBF1',
      category: 'executive',
      isPlacement: false,
      accentColor: '#0D9488',
      subtypes: ['Digit Span', 'Spatial Span', 'Interference', 'Delayed']
    },
    {
      id: 'attention' as GameId,
      num: '06',
      title: 'Attention & Focus',
      desc: 'Target anomaly detection amid high-density visual distractors and noise.',
      icon: <Eye size={18} color="#EAB308" />,
      badgeBg: '#FEF9C3',
      category: 'speed',
      isPlacement: false,
      accentColor: '#EAB308',
      subtypes: ['Anomaly Search', 'Feature Frequency', 'Rapid Match']
    },
    {
      id: 'reaction' as GameId,
      num: '07',
      title: 'Processing Speed',
      desc: 'Dynamic target latency tracking, psychomotor RT & Go/No-Go inhibition.',
      icon: <Zap size={18} color="#84CC16" />,
      badgeBg: '#ECFCCB',
      category: 'speed',
      isPlacement: false,
      accentColor: '#84CC16',
      subtypes: ['Dynamic Target RT', 'Rapid Match', 'Go/No-Go', 'Comparison']
    },
    {
      id: 'motion' as GameId,
      num: '08',
      title: 'Motion & Planning',
      desc: 'Motion Challenge: sliding token maze navigation & trajectory deflection.',
      icon: <Timer size={18} color="#EC4899" />,
      badgeBg: '#FCE7F3',
      category: 'spatial',
      isPlacement: true,
      accentColor: '#EC4899',
      subtypes: ['Slide Maze', 'Trajectory', 'Deflectors', 'Pathfinding']
    },
    {
      id: 'math' as GameId,
      num: '09',
      title: 'Numerical Reasoning',
      desc: 'Digit Challenge: fill equation slots 1–9 with exact mathematical evaluation.',
      icon: <Calculator size={18} color="#10B981" />,
      badgeBg: '#D1FAE5',
      category: 'spatial',
      isPlacement: true,
      accentColor: '#10B981',
      subtypes: ['Digit Challenge', 'Number Series', 'Constraints', 'Estimation']
    },
    {
      id: 'color_grid' as GameId,
      num: '10',
      title: 'Color the Grid',
      desc: 'Diamond Rule Coding: deduce geometric transformations from 6 rule tables.',
      icon: <Sparkles size={18} color="#F97316" />,
      badgeBg: '#FFEDD5',
      category: 'logic',
      isPlacement: true,
      accentColor: '#F97316',
      subtypes: ['Z-Count Invariance', 'Parity & Vowels', 'Diamond Coding', 'Speed Decoding']
    }
  ];

  const filteredGames = COGNITIVE_ENGINES.filter(game => {
    const matchesSearch = !searchQuery || 
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.subtypes.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'placement') return game.isPlacement;
    return game.category === selectedCategory;
  });

  const getStatus = (score: number) => {
    if (score >= 80) return { icon: '🟢', color: '#10B981', label: 'Strong' };
    if (score >= 60) return { icon: '🟡', color: '#F59E0B', label: 'Moderate' };
    if (score > 0) return { icon: '🟠', color: '#EA580C', label: 'Developing' };
    return { icon: '⚪', color: '#94A3B8', label: 'Untested' };
  };

  return (
    <div className="dashboard-layout">
      {/* ============================================================ */}
      {/* 1. DESKTOP SIDEBAR                                           */}
      {/* ============================================================ */}
      <aside className="dashboard-sidebar">
        <div>
          {/* Brand Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px',
            paddingLeft: '4px'
          }}>
            <div 
              onClick={() => handleTabChange('landing')}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
            >
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: '#FF3B20',
                border: '2px solid #141312',
                boxShadow: '2px 2px 0px #141312',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#FFFFFF' }} />
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.45rem', fontWeight: 950, letterSpacing: '-0.04em', lineHeight: 1 }}>
                  QIVORA
                </div>
                <div style={{ fontSize: '0.6rem', fontWeight: 800, color: '#A8A29E', letterSpacing: '0.12em', marginTop: '3px' }}>
                  PLAY · THINK · GROW
                </div>
              </div>
            </div>
          </div>

          {/* Nav Links */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <button
              onClick={() => handleTabChange('landing')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: '10px 14px',
                borderRadius: '12px',
                border: 'none',
                background: activeTab === 'landing' ? '#FDECE8' : 'transparent',
                color: activeTab === 'landing' ? '#F05438' : '#57534E',
                fontWeight: 800,
                fontSize: '0.9rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease'
              }}
            >
              <Globe size={18} color={activeTab === 'landing' ? '#F05438' : '#78716C'} />
              <span>Orbit Landing</span>
            </button>

            <button
              onClick={() => handleTabChange('home')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: '10px 14px',
                borderRadius: '12px',
                border: 'none',
                background: activeTab === 'home' || activeTab === 'dashboard' ? '#FDECE8' : 'transparent',
                color: activeTab === 'home' || activeTab === 'dashboard' ? '#F05438' : '#57534E',
                fontWeight: 800,
                fontSize: '0.9rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease'
              }}
            >
              <Home size={18} color={activeTab === 'home' || activeTab === 'dashboard' ? '#F05438' : '#78716C'} />
              <span>Dashboard Home</span>
            </button>

            <button
              onClick={() => handleTabChange('games')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: '10px 14px',
                borderRadius: '12px',
                border: 'none',
                background: activeTab === 'games' || activeTab === 'play' ? '#FDECE8' : 'transparent',
                color: activeTab === 'games' || activeTab === 'play' ? '#F05438' : '#57534E',
                fontWeight: 800,
                fontSize: '0.9rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease'
              }}
            >
              <Gamepad2 size={18} color={activeTab === 'games' || activeTab === 'play' ? '#F05438' : '#78716C'} />
              <span>10 Game Catalog</span>
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                if (onOpenDuel) onOpenDuel();
                else onNavigateTab('duel');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: '10px 14px',
                borderRadius: '12px',
                border: 'none',
                background: activeTab === 'duel' ? '#FEF3C7' : 'transparent',
                color: activeTab === 'duel' ? '#D97706' : '#57534E',
                fontWeight: 800,
                fontSize: '0.9rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease'
              }}
            >
              <Swords size={18} color={activeTab === 'duel' ? '#D97706' : '#F59E0B'} />
              <span>1v1 Ghost Duel</span>
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                if (onOpenDailyDrill) onOpenDailyDrill();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: '10px 14px',
                borderRadius: '12px',
                border: 'none',
                background: '#FFF7ED',
                color: '#EA580C',
                fontWeight: 800,
                fontSize: '0.9rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease'
              }}
            >
              <Flame size={18} color="#EA580C" />
              <span>Daily Drill 🔥</span>
            </button>

            <button
              onClick={() => handleTabChange('practice')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: '10px 14px',
                borderRadius: '12px',
                border: 'none',
                background: activeTab === 'practice' ? '#FDECE8' : 'transparent',
                color: activeTab === 'practice' ? '#F05438' : '#57534E',
                fontWeight: 800,
                fontSize: '0.9rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease'
              }}
            >
              <Target size={18} color={activeTab === 'practice' ? '#F05438' : '#78716C'} />
              <span>Practice Lab</span>
            </button>

            <button
              onClick={() => handleTabChange('test')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: '10px 14px',
                borderRadius: '12px',
                border: 'none',
                background: activeTab === 'test' ? '#FDECE8' : 'transparent',
                color: activeTab === 'test' ? '#F05438' : '#57534E',
                fontWeight: 800,
                fontSize: '0.9rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease'
              }}
            >
              <Timer size={18} color={activeTab === 'test' ? '#F05438' : '#78716C'} />
              <span>⚡ Mock Assessment</span>
            </button>

            <button
              onClick={() => handleTabChange('results')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: '10px 14px',
                borderRadius: '12px',
                border: 'none',
                background: activeTab === 'results' ? '#FDECE8' : 'transparent',
                color: activeTab === 'results' ? '#F05438' : '#57534E',
                fontWeight: 800,
                fontSize: '0.9rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease'
              }}
            >
              <BarChart3 size={18} color={activeTab === 'results' ? '#F05438' : '#78716C'} />
              <span>Results & CQ</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Bottom Progress & Quote */}
        <div style={{ padding: '16px 6px 0 6px', borderTop: '1.5px solid #EAE6DF' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#A8A29E', letterSpacing: '0.08em', marginBottom: '10px' }}>
            COGNITIVE STREAK
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: '#FFF7ED',
              border: '1.5px solid #FDBA74',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Flame size={24} color="#EA580C" />
            </div>
            <div>
              <div style={{ fontSize: '1.2rem', fontWeight: 900, fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
                {userProfile.streakDays} <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#78716C' }}>Days</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#16A34A', fontWeight: 800, marginTop: '2px' }}>
                Active Training
              </div>
            </div>
          </div>

          <div style={{
            fontSize: '0.78rem',
            color: '#78716C',
            fontStyle: 'italic',
            lineHeight: 1.35
          }}>
            "Cognitive stamina grows with deliberate daily repetition."
          </div>
        </div>
      </aside>

      {/* ============================================================ */}
      {/* 2. MAIN DASHBOARD CONTENT AREA                               */}
      {/* ============================================================ */}
      <main className="dashboard-main">

        {/* ── Top Header Bar (Adaptive for Mobile & Desktop) ─────── */}
        <header className="dashboard-header-bar">
          
          {/* Mobile Top Brand (Visible only on mobile header) */}
          <div className="mobile-menu-btn" style={{ alignItems: 'center', gap: '10px' }}>
            <div 
              onClick={() => handleTabChange('landing')}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
            >
              <div style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                background: '#FF3B20',
                border: '2px solid #141312',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#FFFFFF' }} />
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 950, letterSpacing: '-0.04em' }}>
                QIVORA
              </span>
            </div>
          </div>

          {/* Search Input Wrap */}
          <div className="dashboard-search-wrap">
            <Search size={16} color="#A8A29E" />
            <input
              type="text"
              placeholder="Search 10 games, rules, skills..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: '0.85rem',
                width: '100%',
                color: '#121110',
                fontWeight: 600
              }}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 0, color: '#A8A29E' }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Right Header Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Sound Mute Toggle */}
            <button
              onClick={handleToggleSound}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: isMuted ? '#F1F5F9' : '#ECFDF5',
                border: `1.5px solid ${isMuted ? '#CBD5E1' : '#10B981'}`,
                color: isMuted ? '#64748B' : '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              title={isMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>

            {/* Daily Drill Trigger (Quick button on desktop/tablet) */}
            {onOpenDailyDrill && (
              <button
                className="desktop-nav"
                onClick={() => {
                  sounds.playClick();
                  onOpenDailyDrill();
                }}
                style={{
                  alignItems: 'center',
                  gap: '6px',
                  background: '#FFF7ED',
                  border: '1.5px solid #FDBA74',
                  borderRadius: '9999px',
                  padding: '6px 14px',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  color: '#C2410C',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                <Flame size={14} color="#EA580C" />
                <span>Daily Drill</span>
              </button>
            )}

            {/* Profile Avatar Chip */}
            <div
              onClick={onOpenAuth}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: '#FAF8F5',
                border: '1.5px solid #141312',
                boxShadow: '2px 2px 0px #141312',
                borderRadius: '9999px',
                padding: '4px 12px 4px 6px',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              title="Click to view profile / authenticate"
            >
              <div style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                background: '#121110',
                color: '#FFF',
                fontWeight: 900,
                fontSize: '0.78rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {displayName.charAt(0).toUpperCase()}
              </div>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {displayName}
              </span>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              className="mobile-menu-btn"
              onClick={() => {
                sounds.playClick();
                setIsMobileNavOpen(!isMobileNavOpen);
              }}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: '#FFFFFF',
                border: '1.5px solid var(--border-ink)',
                boxShadow: '2px 2px 0px #121110',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--text-primary)'
              }}
              aria-label="Toggle navigation menu"
            >
              {isMobileNavOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </header>

        {/* ── Mobile Navigation Drawer Menu ───────────────────────── */}
        {isMobileNavOpen && (
          <div style={{
            background: '#FFFFFF',
            border: '2px solid var(--border-ink)',
            borderRadius: '20px',
            boxShadow: 'var(--shadow-tactile)',
            padding: '16px',
            marginBottom: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px', borderBottom: '1px solid #E7E5E4' }}>
              <span style={{ fontWeight: 900, fontSize: '0.85rem', color: '#78716C' }}>QUICK NAVIGATION</span>
              <button onClick={() => setIsMobileNavOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <button className="nav-link" onClick={() => handleTabChange('landing')} style={{ textAlign: 'left', padding: '10px 12px' }}>
              🪐 Orbit Landing Map
            </button>
            <button className="nav-link" onClick={() => handleTabChange('home')} style={{ textAlign: 'left', padding: '10px 12px' }}>
              📊 Dashboard Home
            </button>
            <button className="nav-link" onClick={() => handleTabChange('games')} style={{ textAlign: 'left', padding: '10px 12px' }}>
              🎮 10 Cognitive Games
            </button>
            <button className="nav-link" onClick={() => { sounds.playClick(); setIsMobileNavOpen(false); if (onOpenDuel) onOpenDuel(); else onNavigateTab('duel'); }} style={{ textAlign: 'left', padding: '10px 12px', color: '#D97706', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Swords size={16} />
              <span>1v1 Ghost Duel</span>
            </button>
            <button className="nav-link" onClick={() => { sounds.playClick(); setIsMobileNavOpen(false); if (onOpenDailyDrill) onOpenDailyDrill(); }} style={{ textAlign: 'left', padding: '10px 12px', color: '#EA580C', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Flame size={16} />
              <span>Daily Drill Workout</span>
            </button>
            <button className="nav-link" onClick={() => handleTabChange('practice')} style={{ textAlign: 'left', padding: '10px 12px' }}>
              🎯 Practice Lab (All Levels)
            </button>
            <button className="nav-link" onClick={() => handleTabChange('test')} style={{ textAlign: 'left', padding: '10px 12px', color: '#FF3B20', fontWeight: 900 }}>
              ⚡ Full Mock Assessment
            </button>
            <button className="nav-link" onClick={() => handleTabChange('results')} style={{ textAlign: 'left', padding: '10px 12px' }}>
              📈 Cognitive Analytics & Scores
            </button>
          </div>
        )}

        {/* ============================================================ */}
        {/* 3. HERO ROW (ADAPTIVE FOR MOBILE & DESKTOP)                  */}
        {/* ============================================================ */}
        <div className="dashboard-hero-container">
          
          {/* Main Hero Card */}
          <div className="dashboard-hero-card">
            <div style={{ flex: 1, minWidth: '240px', zIndex: 2 }}>
              
              {/* Category Pill Tag */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.72rem',
                fontWeight: 900,
                fontFamily: 'var(--font-mono)',
                color: '#65A30D',
                letterSpacing: '0.08em',
                marginBottom: '12px'
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#84CC16' }} />
                <span>THE COGNITIVE GAME PLAYGROUND</span>
              </div>

              {/* Display Headline */}
              <h1 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 3.8vw, 3.2rem)',
                fontWeight: 950,
                lineHeight: 1.04,
                letterSpacing: '-0.04em',
                marginBottom: '12px',
                color: '#121110'
              }}>
                THINK FASTER.<br />
                <span style={{ color: '#FF3B20' }}>PLAY SMARTER.</span>
              </h1>

              <p style={{ fontSize: '0.92rem', color: '#78716C', lineHeight: 1.45, marginBottom: '22px', maxWidth: '440px' }}>
                Procedural adaptive games that challenge how you reason, calculate, remember, react and plan.
              </p>

              {/* Responsive CTAs */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => onSelectGame('inductive')}
                  className="btn-vermillion"
                  style={{
                    padding: '12px 22px',
                    fontSize: '0.88rem',
                    borderRadius: '9999px',
                    cursor: 'pointer'
                  }}
                >
                  <span>EXPLORE 10 GAMES</span>
                  <ArrowRight size={16} />
                </button>

                <button
                  onClick={() => onNavigateTab('test')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: '#FFFFFF',
                    color: '#121110',
                    padding: '12px 20px',
                    borderRadius: '9999px',
                    border: '2px solid #141312',
                    boxShadow: '2px 2px 0px #141312',
                    fontSize: '0.88rem',
                    fontWeight: 900,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Timer size={16} color="#FF3B20" />
                  <span>⚡ MOCK TEST</span>
                </button>
              </div>
            </div>

            {/* 3D Brain Visual Illustration */}
            <div className="dashboard-hero-visual">
              <img
                src="/assets/brain_hero.jpg"
                alt="3D Cognitive Brain"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '20px',
                  border: '1.5px solid rgba(0,0,0,0.06)'
                }}
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div style={{
                position: 'absolute',
                bottom: '-4px',
                right: '-2px',
                background: 'rgba(255, 255, 255, 0.94)',
                backdropFilter: 'blur(8px)',
                padding: '4px 10px',
                borderRadius: '8px',
                fontSize: '0.68rem',
                fontWeight: 800,
                color: '#57534E',
                border: '1px solid #EAE6DF',
                boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
              }}>
                Small challenges. Big changes.
              </div>
            </div>
          </div>

          {/* Watch Qivora Play Demo Card */}
          <div style={{
            background: '#FAF8F3',
            border: '1.5px solid #EAE6DF',
            borderRadius: '24px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={16} color="#8B5CF6" />
                  <span style={{ fontSize: '0.85rem', fontWeight: 900, letterSpacing: '0.04em' }}>
                    WATCH QIVORA PLAY
                  </span>
                </div>
                <button 
                  onClick={handlePlayDemo}
                  disabled={isDemoRunning}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#6366F1',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <RotateCcw size={12} />
                  <span>Replay</span>
                </button>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#78716C', margin: '0 0 14px 0' }}>
                See how AI discovers patterns and solves step-by-step.
              </p>

              {/* Dark Demo Mini Viewport */}
              <div style={{
                background: '#18181B',
                borderRadius: '16px',
                padding: '16px',
                border: '1px solid #27272A',
                color: '#FFFFFF'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#A1A1AA' }}>
                    ⤳ INDUCTIVE / STEP {demoStep + 1} OF 4
                  </span>
                  <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#4ADE80', background: 'rgba(74, 222, 128, 0.12)', padding: '2px 8px', borderRadius: '10px' }}>
                    {isDemoRunning ? 'SOLVING...' : 'AI SOLVER'}
                  </span>
                </div>

                {/* Mini Visual Sequence */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  background: '#09090B',
                  borderRadius: '10px',
                  padding: '12px 6px',
                  marginBottom: '12px',
                  position: 'relative'
                }}>
                  <div style={{ width: '28px', height: '28px', background: demoStep >= 0 ? '#27272A' : '#18181B', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A78BFA', fontWeight: 800 }}>▲</div>
                  <span style={{ fontSize: '0.7rem', color: '#71717A' }}>→</span>
                  <div style={{ width: '28px', height: '28px', background: demoStep >= 1 ? '#27272A' : '#18181B', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60A5FA', fontWeight: 800 }}>■</div>
                  <span style={{ fontSize: '0.7rem', color: '#71717A' }}>→</span>
                  <div style={{ width: '28px', height: '28px', background: demoStep >= 2 ? '#27272A' : '#18181B', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FACC15', fontWeight: 800 }}>◆</div>
                  <span style={{ fontSize: '0.7rem', color: '#71717A' }}>→</span>
                  <div style={{ 
                    width: '28px', 
                    height: '28px', 
                    background: demoStep >= 3 ? '#15803D' : '#3F3F46', 
                    border: demoStep >= 3 ? '1.5px solid #4ADE80' : '1.5px dashed #FF3B20', 
                    borderRadius: '4px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    color: demoStep >= 3 ? '#FFFFFF' : '#FF3B20', 
                    fontWeight: 900 
                  }}>
                    {demoStep >= 3 ? '★' : '?'}
                  </div>
                </div>

                {/* Robot Mascot Speech Bubble */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: '#8B5CF6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Brain size={16} color="#FFFFFF" />
                  </div>
                  <div style={{
                    background: '#FFFFFF',
                    color: '#18181B',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '6px 10px',
                    borderRadius: '8px',
                    lineHeight: 1.3,
                    flex: 1
                  }}>
                    {demoStep >= 3 ? 'Pattern complete! 3-shape rotational sequence.' : 'Extrapolating geometric rotation rules...'}
                  </div>
                </div>

                {/* Play Demo Button */}
                <button
                  onClick={() => onSelectGame('inductive')}
                  style={{
                    width: '100%',
                    background: '#FF3B20',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '10px',
                    borderRadius: '9999px',
                    fontSize: '0.82rem',
                    fontWeight: 900,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <span>TRY INDUCTIVE ENGINE</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 4. KEY COGNITIVE METRICS RIBBON                              */}
        {/* ============================================================ */}
        <div className="dashboard-stats-grid">
          
          {/* Card 1: CQ Score */}
          <div style={{
            background: '#FAF8F3',
            border: '1.5px solid #EAE6DF',
            borderRadius: '20px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#78716C', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Overall Cognitive Quotient
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '8px' }}>
              <span style={{ fontSize: '2.6rem', fontWeight: 950, color: '#121110', fontFamily: 'var(--font-mono)' }}>
                {userProfile.cqScore || 82}
              </span>
              <span style={{ fontSize: '1rem', color: '#A8A29E', fontWeight: 800 }}>/ 100</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#16A34A', fontWeight: 800, marginTop: '4px' }}>
              ✦ Top {Math.max(1, 100 - (userProfile.cqScore || 82))}% of assessment cohort
            </div>
          </div>

          {/* Card 2: Training Streak */}
          <div style={{
            background: '#FAF8F3',
            border: '1.5px solid #EAE6DF',
            borderRadius: '20px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#78716C', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Daily Drill Streak
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
              <Flame size={32} color="#EA580C" fill="#EA580C" />
              <span style={{ fontSize: '2.4rem', fontWeight: 950, color: '#EA580C', fontFamily: 'var(--font-mono)' }}>
                {userProfile.streakDays || 5}
              </span>
              <span style={{ fontSize: '0.9rem', color: '#78716C', fontWeight: 800 }}>Days</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#D97706', fontWeight: 800, marginTop: '4px' }}>
              +15% retention consistency boost
            </div>
          </div>

          {/* Card 3: Puzzles Solved */}
          <div style={{
            background: '#FAF8F3',
            border: '1.5px solid #EAE6DF',
            borderRadius: '20px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#78716C', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Puzzles Mastered
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: 950, color: '#6366F1', fontFamily: 'var(--font-mono)', marginTop: '8px' }}>
              {userProfile.puzzlesSolved || 48}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#78716C', fontWeight: 700, marginTop: '4px' }}>
              Across 10 procedural challenge engines
            </div>
          </div>

          {/* Card 4: Battery Completed */}
          <div style={{
            background: '#FAF8F3',
            border: '1.5px solid #EAE6DF',
            borderRadius: '20px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#78716C', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Mock Batteries Completed
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: 950, color: '#0D9488', fontFamily: 'var(--font-mono)', marginTop: '8px' }}>
              {userProfile.testsCompleted || 3}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#0D9488', fontWeight: 800, marginTop: '4px' }}>
              Ready for Corporate Assessment
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 5. FEATURE SUITE: 1V1 DUEL, DAILY DRILL & AI COPILOT         */}
        {/* ============================================================ */}
        <div className="dashboard-feature-grid">
          
          {/* Feature 1: 1v1 Ghost Duel */}
          <div style={{
            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
            borderRadius: '20px',
            padding: '22px',
            color: '#FFFFFF',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            border: '1px solid #334155',
            boxShadow: '0 8px 24px -4px rgba(15, 23, 42, 0.35)'
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{
                  background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                  padding: '8px',
                  borderRadius: '10px',
                  display: 'flex'
                }}>
                  <Swords size={18} color="#FFFFFF" />
                </div>
                <span style={{ fontSize: '0.68rem', fontWeight: 800, background: 'rgba(245, 158, 11, 0.2)', color: '#FCD34D', padding: '3px 8px', borderRadius: '6px' }}>
                  1v1 LIVE ARENA
                </span>
              </div>
              <h3 style={{ margin: '0 0 6px', fontSize: '1.15rem', fontWeight: 900 }}>1v1 Ghost Duel</h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#94A3B8', lineHeight: 1.4 }}>
                Race against adaptive neural AI bots in real-time. First to 5 points claims ELO ranking.
              </p>
            </div>

            <button
              onClick={() => {
                sounds.playClick();
                if (onOpenDuel) onOpenDuel();
                else onNavigateTab('duel');
              }}
              style={{
                marginTop: '16px',
                background: '#F59E0B',
                color: '#0F172A',
                border: 'none',
                borderRadius: '9999px',
                padding: '10px 16px',
                fontWeight: 900,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <span>Enter 1v1 Battle Arena</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Feature 2: Daily Workout */}
          <div style={{
            background: 'linear-gradient(135deg, #431407 0%, #9A3412 100%)',
            borderRadius: '20px',
            padding: '22px',
            color: '#FFFFFF',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            border: '1px solid #7C2D12',
            boxShadow: '0 8px 24px -4px rgba(124, 45, 18, 0.35)'
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{
                  background: 'linear-gradient(135deg, #EA580C, #C2410C)',
                  padding: '8px',
                  borderRadius: '10px',
                  display: 'flex'
                }}>
                  <Flame size={18} color="#FFFFFF" />
                </div>
                <span style={{ fontSize: '0.68rem', fontWeight: 800, background: 'rgba(254, 215, 170, 0.2)', color: '#FED7AA', padding: '3px 8px', borderRadius: '6px' }}>
                  🔥 5-DAY STREAK
                </span>
              </div>
              <h3 style={{ margin: '0 0 6px', fontSize: '1.15rem', fontWeight: 900 }}>Daily 3-Min Drill</h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#FFEDD5', lineHeight: 1.4 }}>
                Curated 3-challenge circuit refreshed daily with 12-week habit heatmap tracking.
              </p>
            </div>

            <button
              onClick={() => {
                sounds.playClick();
                if (onOpenDailyDrill) onOpenDailyDrill();
              }}
              style={{
                marginTop: '16px',
                background: '#FFFFFF',
                color: '#9A3412',
                border: 'none',
                borderRadius: '9999px',
                padding: '10px 16px',
                fontWeight: 900,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <span>Launch Today's Drill</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Feature 3: Cognitive Copilot & Certificate */}
          <div style={{
            background: 'linear-gradient(135deg, #1E1B4B 0%, #3730A3 100%)',
            borderRadius: '20px',
            padding: '22px',
            color: '#FFFFFF',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            border: '1px solid #4338CA',
            boxShadow: '0 8px 24px -4px rgba(67, 56, 202, 0.35)'
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{
                  background: 'linear-gradient(135deg, #6366F1, #4F46E5)',
                  padding: '8px',
                  borderRadius: '10px',
                  display: 'flex'
                }}>
                  <Brain size={18} color="#FFFFFF" />
                </div>
                <span style={{ fontSize: '0.68rem', fontWeight: 800, background: 'rgba(199, 210, 254, 0.2)', color: '#C7D2FE', padding: '3px 8px', borderRadius: '6px' }}>
                  AI TELEMETRY
                </span>
              </div>
              <h3 style={{ margin: '0 0 6px', fontSize: '1.15rem', fontWeight: 900 }}>Cognitive Copilot</h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#C7D2FE', lineHeight: 1.4 }}>
                Real-time error diagnosis, speed decay curve and verified assessment credential PDF.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              <button
                onClick={() => {
                  sounds.playClick();
                  if (onOpenCopilot) onOpenCopilot();
                }}
                style={{
                  flex: 1,
                  background: '#818CF8',
                  color: '#0F172A',
                  border: 'none',
                  borderRadius: '9999px',
                  padding: '10px 12px',
                  fontWeight: 900,
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px'
                }}
              >
                <span>AI Diagnosis</span>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  if (onOpenCertificate) onOpenCertificate();
                }}
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  color: '#FFFFFF',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '9999px',
                  padding: '10px 14px',
                  fontWeight: 900,
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
                title="View Official Certificate"
              >
                <Award size={14} color="#FDE047" />
                <span>Certificate</span>
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 6. COGNITIVE MULTI-AXIS PROFILE & RADAR CHART                */}
        {/* ============================================================ */}
        <div style={{ marginBottom: '36px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 950, letterSpacing: '-0.02em', margin: 0, fontFamily: 'var(--font-display)' }}>
                COGNITIVE MULTI-AXIS DIAGNOSIS
              </h2>
              <p style={{ fontSize: '0.8rem', color: '#78716C', margin: '4px 0 0 0' }}>
                Normalized against elite corporate recruitment cohorts & percentile benchmarks.
              </p>
            </div>

            <button
              onClick={() => setShowRadarSection(!showRadarSection)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: '#FAF8F3',
                border: '1.5px solid #E7E5E4',
                borderRadius: '9999px',
                padding: '6px 14px',
                fontSize: '0.78rem',
                fontWeight: 800,
                color: '#57534E',
                cursor: 'pointer'
              }}
            >
              <span>{showRadarSection ? 'Hide Multi-Axis Chart' : 'Show Multi-Axis Chart'}</span>
              <ChevronDown size={14} style={{ transform: showRadarSection ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>
          </div>

          {showRadarSection && (
            <div className="dashboard-radar-grid">
              {/* Radar Chart Panel */}
              <div style={{
                background: '#090D16',
                borderRadius: '24px',
                padding: '24px',
                border: '1px solid #1E293B',
                color: '#FFFFFF',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 30px rgba(0,0,0,0.25)',
                minHeight: '380px'
              }}>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#38BDF8', fontFamily: 'var(--font-mono)' }}>
                      RADAR POLYGON
                    </span>
                    <div style={{ fontSize: '0.92rem', fontWeight: 800 }}>10-Domain Competency Map</div>
                  </div>
                  <span style={{ fontSize: '0.7rem', background: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', padding: '3px 10px', borderRadius: '12px', fontWeight: 800 }}>
                    BENCHMARK ACTIVE
                  </span>
                </div>

                {/* Fluid Responsive Radar Chart */}
                <RadarChart scores={scores} size={360} showBenchmark={true} />
              </div>

              {/* Skills Breakdown Mini Table */}
              <div style={{
                background: '#FAF8F3',
                border: '1.5px solid #EAE6DF',
                borderRadius: '24px',
                padding: '20px 24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 900, marginBottom: '4px' }}>
                    Competency Strengths & Target Areas
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#78716C', margin: '0 0 14px 0' }}>
                    Tap any skill to jump straight into targeted adaptive training drills.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '310px', overflowY: 'auto', paddingRight: '4px' }}>
                    {COGNITIVE_ENGINES.map(engine => {
                      const score = scores[engine.id] || 0;
                      const status = getStatus(score);

                      return (
                        <div
                          key={engine.id}
                          onClick={() => onSelectGame(engine.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '8px 12px',
                            background: '#FFFFFF',
                            border: '1.5px solid #EAE6DF',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '0.85rem' }}>{status.icon}</span>
                            <div>
                              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#121110' }}>
                                {engine.title}
                              </div>
                              <div style={{ fontSize: '0.68rem', color: '#78716C' }}>
                                {engine.category.toUpperCase()} · {engine.subtypes[0]}
                              </div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{
                              fontSize: '0.88rem',
                              fontWeight: 900,
                              fontFamily: 'var(--font-mono)',
                              color: status.color
                            }}>
                              {score > 0 ? `${score}%` : '—'}
                            </span>
                            <ArrowRight size={13} color="#A8A29E" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <button
                  onClick={() => onNavigateTab('results')}
                  style={{
                    marginTop: '12px',
                    width: '100%',
                    background: '#121110',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '9999px',
                    padding: '10px',
                    fontWeight: 900,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <span>View Detailed Analytics & Percentiles</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ============================================================ */}
        {/* 7. WHAT DO YOU WANT TO PLAY? (10 COGNITIVE ENGINES)          */}
        {/* ============================================================ */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 950, letterSpacing: '-0.02em', margin: 0, fontFamily: 'var(--font-display)' }}>
                WHAT DO YOU WANT TO PLAY?
              </h2>
              <p style={{ fontSize: '0.8rem', color: '#78716C', margin: '4px 0 0 0' }}>
                Select any of the 10 procedural engines with live AI solver and timed evaluations.
              </p>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#16A34A', background: '#DCFCE7', padding: '4px 10px', borderRadius: '12px' }}>
                ● 10 ENGINES ACTIVE
              </span>
              <button
                onClick={() => onNavigateTab('games')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#121110',
                  color: '#FFFFFF',
                  padding: '7px 14px',
                  borderRadius: '9999px',
                  border: 'none',
                  fontSize: '0.78rem',
                  fontWeight: 900,
                  cursor: 'pointer'
                }}
              >
                <span>Full Catalog</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>

          {/* Cognitive Category Filter Bar (Smooth Touch Scroll on Mobile) */}
          <div className="touch-scroll-x" style={{
            display: 'flex',
            gap: '8px',
            paddingBottom: '8px',
            marginBottom: '18px'
          }}>
            {[
              { id: 'all', label: 'All 10 Engines' },
              { id: 'placement', label: '🎯 Placement Aptitude Battery' },
              { id: 'logic', label: 'Logical (Inductive, Deductive)' },
              { id: 'spatial', label: 'Spatial (Grid, Math, Motion)' },
              { id: 'speed', label: 'Attention & Speed (Reaction, Focus)' },
              { id: 'executive', label: 'Executive (Switch, Memory)' }
            ].map(cat => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    sounds.playClick();
                    setSelectedCategory(cat.id);
                  }}
                  style={{
                    padding: '7px 15px',
                    borderRadius: '9999px',
                    border: isActive ? '2px solid #FF3B20' : '1.5px solid #E7E5E4',
                    background: isActive ? '#FFF1EA' : '#FAF8F5',
                    color: isActive ? '#FF3B20' : '#78716C',
                    fontWeight: 800,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* 10 Domains Primary Grid */}
          <div className="dashboard-games-grid">
            {filteredGames.map((game) => (
              <div
                key={game.id}
                style={{
                  background: '#18181B',
                  borderRadius: '20px',
                  padding: '22px',
                  color: '#FFFFFF',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '230px',
                  border: '1px solid #27272A',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                  transition: 'transform 0.15s ease, border-color 0.15s ease'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.borderColor = game.accentColor;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.borderColor = '#27272A';
                }}
              >
                <div>
                  {/* Header: Icon and Status Badge */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '10px',
                        background: '#27272A',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {game.icon}
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#A1A1AA', fontFamily: 'var(--font-mono)' }}>
                        {game.num}
                      </span>
                    </div>

                    <span style={{
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      color: '#4ADE80',
                      background: 'rgba(74, 222, 128, 0.12)',
                      padding: '3px 8px',
                      borderRadius: '10px'
                    }}>
                      READY
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.08rem', fontWeight: 900, marginBottom: '6px', color: '#FFFFFF' }}>
                    {game.title}
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: '#A1A1AA', lineHeight: 1.4, margin: '0 0 12px 0' }}>
                    {game.desc}
                  </p>

                  {/* Subtypes Pills */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '16px' }}>
                    {game.subtypes.map((st, i) => (
                      <span key={i} style={{
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        color: '#CBD5E1',
                        background: '#27272A',
                        padding: '2px 7px',
                        borderRadius: '6px'
                      }}>
                        {st}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Play Drill Button */}
                <button
                  onClick={() => onSelectGame(game.id)}
                  style={{
                    width: '100%',
                    background: '#27272A',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '10px 14px',
                    borderRadius: '9999px',
                    fontSize: '0.8rem',
                    fontWeight: 900,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'background 0.15s ease'
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#FF3B20')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#27272A')}
                >
                  <span>PLAY COGNITIVE DRILL</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            ))}
          </div>

          {/* Lime Assessment Banner Callout */}
          <div style={{
            background: '#E6F893',
            borderRadius: '20px',
            padding: '24px 28px',
            color: '#121110',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            marginTop: '8px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: '1.2rem' }}>✦</span>
                <span style={{ fontSize: '0.78rem', fontWeight: 900, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#3F6212' }}>
                  COMPLETE COGNITIVE ASSESSMENT ARCHITECTURE
                </span>
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 950, margin: '0 0 4px 0', letterSpacing: '-0.02em', fontFamily: 'var(--font-display)' }}>
                Master All 10 Domains with Continuous Practice &amp; Level Progression
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#44403C', margin: 0 }}>
                Procedural question generation guarantees unique puzzles every trial without duplicates.
              </p>
            </div>

            <button
              onClick={() => onNavigateTab('practice')}
              style={{
                background: '#121110',
                color: '#FFFFFF',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '9999px',
                fontSize: '0.88rem',
                fontWeight: 900,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            >
              <span>Launch Practice Lab</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

      </main>

      {/* ============================================================ */}
      {/* 8. MOBILE BOTTOM APP BAR (NATIVE THUMB NAVIGATION)           */}
      {/* ============================================================ */}
      <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
        <button
          className={`mobile-bottom-nav-item ${activeTab === 'home' || activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => handleTabChange('home')}
        >
          <Home size={20} className="mobile-nav-icon" />
          <span>Home</span>
        </button>

        <button
          className={`mobile-bottom-nav-item ${activeTab === 'games' || activeTab === 'play' ? 'active' : ''}`}
          onClick={() => handleTabChange('games')}
        >
          <Gamepad2 size={20} className="mobile-nav-icon" />
          <span>Games</span>
        </button>

        <button
          className={`mobile-bottom-nav-item ${activeTab === 'duel' ? 'active' : ''}`}
          onClick={() => {
            sounds.playClick();
            if (onOpenDuel) onOpenDuel();
            else onNavigateTab('duel');
          }}
        >
          <Swords size={20} className="mobile-nav-icon" color={activeTab === 'duel' ? '#D97706' : undefined} />
          <span>1v1 Duel</span>
        </button>

        <button
          className="mobile-bottom-nav-item"
          onClick={() => {
            sounds.playClick();
            if (onOpenDailyDrill) onOpenDailyDrill();
          }}
        >
          <Flame size={20} className="mobile-nav-icon" color="#EA580C" />
          <span>Drill</span>
        </button>

        <button
          className={`mobile-bottom-nav-item ${activeTab === 'test' ? 'active' : ''}`}
          onClick={() => handleTabChange('test')}
        >
          <Timer size={20} className="mobile-nav-icon" color={activeTab === 'test' ? '#FF3B20' : undefined} />
          <span>Test</span>
        </button>

        <button
          className={`mobile-bottom-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => {
            if (onOpenAuth) onOpenAuth();
            else handleTabChange('profile');
          }}
        >
          <User size={20} className="mobile-nav-icon" />
          <span>Profile</span>
        </button>
      </nav>
    </div>
  );
};
