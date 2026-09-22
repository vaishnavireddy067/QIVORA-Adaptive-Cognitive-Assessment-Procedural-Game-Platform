import React, { useState } from 'react';
import { GameId } from '../../types';
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
  HelpCircle,
  Eye,
  Calculator,
  Globe,
  LogIn,
  Swords,
  Flame,
  Award,
  Brain,
  Menu,
  X
} from 'lucide-react';
import { sounds } from '../../services/soundEngine';

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
  const [isDemoHovered, setIsDemoHovered] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const displayName = userName || 'Vaishnavi';

  const handleTabChange = (tab: string) => {
    sounds.playClick();
    setIsMobileNavOpen(false);
    onNavigateTab(tab);
  };

  return (
    <div className="dashboard-layout">
      {/* ============================================================ */}
      {/* 1. SIDEBAR (RESPONSIVE ON MOBILE)                            */}
      {/* ============================================================ */}
      <aside className="dashboard-sidebar">
        {/* Top: Logo & Mobile Toggle */}
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
            paddingLeft: '4px'
          }}>
            {/* Brand Logo */}
            <div 
              onClick={() => handleTabChange('landing')}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
            >
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#FF3B20',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(255, 59, 32, 0.3)'
              }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#FFFFFF' }} />
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1 }}>
                  QIVORA
                </div>
                <div style={{ fontSize: '0.62rem', fontWeight: 800, color: '#A8A29E', letterSpacing: '0.12em', marginTop: '2px' }}>
                  PLAY · THINK · GROW
                </div>
              </div>
            </div>

            {/* Mobile Hamburger Toggle Button */}
            <button
              className="mobile-menu-btn"
              onClick={() => {
                sounds.playClick();
                setIsMobileNavOpen(!isMobileNavOpen);
              }}
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                background: '#FFFFFF',
                border: '1.5px solid var(--border-ink)',
                boxShadow: '2px 2px 0px #121110',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--text-primary)'
              }}
            >
              {isMobileNavOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav 
            className={`dashboard-nav-links ${isMobileNavOpen ? 'mobile-open' : 'desktop-nav'}`}
            style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}
          >
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
                fontSize: '0.92rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease'
              }}
            >
              <Globe size={18} color={activeTab === 'landing' ? '#F05438' : '#78716C'} />
              <span>Orbit (Landing)</span>
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
                fontSize: '0.92rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease'
              }}
            >
              <Home size={18} color={activeTab === 'home' || activeTab === 'dashboard' ? '#F05438' : '#78716C'} />
              <span>Dashboard Home</span>
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                onNavigateTab('games');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                border: 'none',
                background: activeTab === 'games' || activeTab === 'play' ? '#FDECE8' : 'transparent',
                color: activeTab === 'games' || activeTab === 'play' ? '#F05438' : '#57534E',
                fontWeight: 800,
                fontSize: '0.95rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease'
              }}
            >
              <Gamepad2 size={18} color={activeTab === 'games' || activeTab === 'play' ? '#F05438' : '#78716C'} />
              <span>Games</span>
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
                fontSize: '0.92rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease'
              }}
            >
              <Gamepad2 size={18} color={activeTab === 'games' || activeTab === 'play' ? '#F05438' : '#78716C'} />
              <span>Games</span>
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                setIsMobileNavOpen(false);
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
                fontSize: '0.92rem',
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
                setIsMobileNavOpen(false);
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
                fontSize: '0.92rem',
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
                fontSize: '0.92rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease'
              }}
            >
              <Target size={18} color={activeTab === 'practice' ? '#F05438' : '#78716C'} />
              <span>Practice</span>
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
                fontSize: '0.92rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease'
              }}
            >
              <Timer size={18} color={activeTab === 'test' ? '#F05438' : '#78716C'} />
              <span>⚡ Mock Test</span>
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
                fontSize: '0.92rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease'
              }}
            >
              <BarChart3 size={18} color={activeTab === 'results' ? '#F05438' : '#78716C'} />
              <span>Results & Analytics</span>
            </button>
          </nav>
        </div>

        {/* Bottom Progress Card (Desktop only) */}
        <div className="desktop-nav" style={{ padding: '0 6px', flexDirection: 'column' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 900, color: '#A8A29E', letterSpacing: '0.08em', marginBottom: '12px' }}>
            YOUR PROGRESS
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
            {/* Circular Progress Gauge */}
            <div style={{ position: 'relative', width: '56px', height: '56px', flexShrink: 0 }}>
              <svg width="56" height="56" viewBox="0 0 56 56">
                <circle cx="28" cy="28" r="23" fill="none" stroke="#E7E5E4" strokeWidth="5" />
                <circle
                  cx="28"
                  cy="28"
                  r="23"
                  fill="none"
                  stroke="#84CC16"
                  strokeWidth="5"
                  strokeDasharray={144.5}
                  strokeDashoffset={144.5 * (1 - 3 / 7)}
                  strokeLinecap="round"
                  transform="rotate(-90 28 28)"
                />
              </svg>
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 900, lineHeight: 1 }}>3/7</span>
              </div>
            </div>

            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#78716C', lineHeight: 1.3 }}>
              Games<br />Completed
            </div>
          </div>

          <div style={{
            fontSize: '0.82rem',
            color: '#78716C',
            fontStyle: 'italic',
            lineHeight: 1.4,
            position: 'relative'
          }}>
            "Better thinking builds a brighter you."
            <div style={{ fontSize: '1rem', marginTop: '2px' }}>⤷</div>
          </div>
        </div>
      </aside>

      {/* ============================================================ */}
      {/* 2. MAIN DASHBOARD CONTENT AREA                               */}
      {/* ============================================================ */}
      <main className="dashboard-main">
        
        {/* Top Header Bar (Search, Notifications, Profile) */}
        <header style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '28px'
        }}>
          {/* Search bar placeholder */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#FAF8F3',
            border: '1.5px solid #E7E5E4',
            borderRadius: '9999px',
            padding: '8px 16px',
            width: '260px'
          }}>
            <Search size={16} color="#A8A29E" />
            <input
              type="text"
              placeholder="Search games, skills..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: '0.85rem',
                width: '100%',
                color: '#121110'
              }}
            />
          </div>

          {/* Right Header Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* Explicit Login / Profile Button */}
            <button
              onClick={onOpenAuth}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: '#FFFFFF',
                border: '1.5px solid #141312',
                boxShadow: '2px 2px 0px #141312',
                borderRadius: '9999px',
                padding: '6px 14px',
                fontWeight: 900,
                fontSize: '0.82rem',
                color: '#121110',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              title="Sign In or Switch Profile"
            >
              <LogIn size={14} color="#FF3B20" />
              <span>LOG IN</span>
            </button>

            {/* Notification Bell with Badge */}
            <div style={{ position: 'relative', cursor: 'pointer' }}>
              <Bell size={20} color="#57534E" />
              <span style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: '#FF3B20'
              }} />
            </div>

            {/* Profile Avatar Chip matching Image 1 */}
            <div
              onClick={onOpenAuth}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: '#FAF8F5',
                border: '1.5px solid #E7E5E4',
                borderRadius: '9999px',
                padding: '4px 12px 4px 6px',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              title="Click to view profile / switch user"
            >
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: '#121110',
                color: '#FFF',
                fontWeight: 900,
                fontSize: '0.82rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {displayName.charAt(0).toUpperCase()}
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>{displayName}</span>
              <ChevronDown size={14} color="#78716C" />
            </div>
          </div>
        </header>

        {/* ============================================================ */}
        {/* 3. HERO ROW (BANNER + WATCH QIVORA PLAY)                     */}
        {/* ============================================================ */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.6fr 1fr',
          gap: '24px',
          marginBottom: '36px'
        }}>
          {/* Main Hero Card */}
          <div style={{
            background: '#FAF8F3',
            border: '1.5px solid #EAE6DF',
            borderRadius: '24px',
            padding: '36px 36px 32px 36px',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ maxWidth: '420px', zIndex: 2 }}>
              {/* Tag */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.72rem',
                fontWeight: 900,
                fontFamily: 'var(--font-mono)',
                color: '#65A30D',
                letterSpacing: '0.08em',
                marginBottom: '16px'
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#84CC16' }} />
                <span>THE COGNITIVE GAME PLAYGROUND</span>
              </div>

              {/* Display Headline */}
              <h1 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.4rem, 4vw, 3.4rem)',
                fontWeight: 950,
                lineHeight: 1.02,
                letterSpacing: '-0.04em',
                marginBottom: '14px'
              }}>
                THINK FASTER.<br />
                <span style={{ color: '#FF3B20' }}>PLAY SMARTER.</span>
              </h1>

              <p style={{ fontSize: '0.98rem', color: '#78716C', lineHeight: 1.5, marginBottom: '24px' }}>
                Games that challenge how you think, remember, react and solve.
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => onSelectGame('inductive')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: '#121110',
                    color: '#FFFFFF',
                    padding: '12px 22px',
                    borderRadius: '9999px',
                    border: 'none',
                    fontSize: '0.88rem',
                    fontWeight: 900,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                    transition: 'transform 0.15s ease'
                  }}
                >
                  <span>EXPLORE GAMES</span>
                  <ArrowRight size={16} />
                </button>

                <button
                  onClick={() => onNavigateTab('test')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: '#FF3B20',
                    color: '#FFFFFF',
                    padding: '12px 20px',
                    borderRadius: '9999px',
                    border: '2px solid #141312',
                    boxShadow: '2px 2px 0px #141312',
                    fontSize: '0.88rem',
                    fontWeight: 900,
                    cursor: 'pointer',
                    transition: 'transform 0.15s ease'
                  }}
                >
                  <Timer size={16} />
                  <span>⚡ RAPID MOCK TEST</span>
                </button>
              </div>
            </div>

            {/* 3D Brain Illustration Visual matching Image 1 */}
            <div style={{ position: 'relative', width: '220px', height: '220px', flexShrink: 0 }}>
              <img
                src="/assets/brain_hero.jpg"
                alt="3D Cognitive Brain"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '20px'
                }}
                onError={(e) => {
                  // Fallback to stylized SVG brain if image loading fails
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div style={{
                position: 'absolute',
                bottom: '-6px',
                right: '-4px',
                background: 'rgba(255, 255, 255, 0.92)',
                backdropFilter: 'blur(8px)',
                padding: '4px 10px',
                borderRadius: '8px',
                fontSize: '0.7rem',
                fontWeight: 800,
                color: '#57534E',
                boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
              }}>
                Small challenges. Big changes.
              </div>
            </div>
          </div>

          {/* Watch Qivora Play Card matching Image 1 */}
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <Sparkles size={16} color="#8B5CF6" />
                <span style={{ fontSize: '0.85rem', fontWeight: 900, letterSpacing: '0.04em' }}>
                  WATCH QIVORA PLAY
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#78716C', margin: '0 0 16px 0' }}>
                See how it works. Then it's your turn.
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
                  <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#A1A1AA' }}>
                    ⤳ INDUCTIVE / DEMO
                  </span>
                  <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#4ADE80', background: 'rgba(74, 222, 128, 0.12)', padding: '2px 8px', borderRadius: '10px' }}>
                    AI SOLVER
                  </span>
                </div>

                {/* Mini Visual Sequence */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  background: '#09090B',
                  borderRadius: '10px',
                  padding: '12px 8px',
                  marginBottom: '14px',
                  position: 'relative'
                }}>
                  <div style={{ width: '28px', height: '28px', background: '#27272A', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A78BFA' }}>▲</div>
                  <span style={{ fontSize: '0.75rem', color: '#71717A' }}>→</span>
                  <div style={{ width: '28px', height: '28px', background: '#27272A', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60A5FA' }}>■</div>
                  <span style={{ fontSize: '0.75rem', color: '#71717A' }}>→</span>
                  <div style={{ width: '28px', height: '28px', background: '#27272A', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FACC15' }}>◆</div>
                  <span style={{ fontSize: '0.75rem', color: '#71717A' }}>→</span>
                  <div style={{ width: '28px', height: '28px', background: '#3F3F46', border: '1.5px dashed #FF3B20', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF3B20', fontWeight: 900 }}>?</div>

                  {/* Play circle */}
                  <div style={{
                    position: 'absolute',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'rgba(255, 59, 32, 0.9)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 12px rgba(255, 59, 32, 0.6)',
                    cursor: 'pointer'
                  }}>
                    <Play size={14} fill="#FFF" color="#FFF" style={{ marginLeft: '2px' }} />
                  </div>
                </div>

                {/* Robot Mascot Speech Bubble */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <img
                    src="/assets/robot_avatar.jpg"
                    alt="Robot Mascot"
                    style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div style={{
                    background: '#FFFFFF',
                    color: '#18181B',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '6px 10px',
                    borderRadius: '8px',
                    lineHeight: 1.3
                  }}>
                    Watch how I find the pattern and predict the next state.
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
                  <span>PLAY DEMO</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* NEW FEATURE SUITE: 1V1 DUEL, DAILY WORKOUT & AI COPILOT      */}
        {/* ============================================================ */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '18px',
          marginBottom: '36px'
        }}>
          {/* Card 1: 1v1 Ghost Duel */}
          <div style={{
            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
            borderRadius: '20px',
            padding: '22px',
            color: '#FFFFFF',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            border: '1px solid #334155',
            boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.3)'
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
                <span style={{ fontSize: '0.7rem', fontWeight: 800, background: 'rgba(245, 158, 11, 0.2)', color: '#FCD34D', padding: '3px 8px', borderRadius: '6px' }}>
                  1v1 LIVE
                </span>
              </div>
              <h3 style={{ margin: '0 0 4px', fontSize: '1.15rem', fontWeight: 800 }}>Ghost Duel Mode</h3>
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
                padding: '9px 16px',
                fontWeight: 800,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <span>Enter 1v1 Arena</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Card 2: Daily Cognitive Workout */}
          <div style={{
            background: 'linear-gradient(135deg, #431407 0%, #9A3412 100%)',
            borderRadius: '20px',
            padding: '22px',
            color: '#FFFFFF',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            border: '1px solid #7C2D12',
            boxShadow: '0 10px 25px -5px rgba(124, 45, 18, 0.3)'
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
                <span style={{ fontSize: '0.7rem', fontWeight: 800, background: 'rgba(254, 215, 170, 0.2)', color: '#FED7AA', padding: '3px 8px', borderRadius: '6px' }}>
                  🔥 5 DAY STREAK
                </span>
              </div>
              <h3 style={{ margin: '0 0 4px', fontSize: '1.15rem', fontWeight: 800 }}>Daily 3-Min Drill</h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#FFEDD5', lineHeight: 1.4 }}>
                Curated 3-challenge circuit refreshed daily. Track your 12-week activity heatmap.
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
                padding: '9px 16px',
                fontWeight: 800,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <span>Launch Daily Workout</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Card 3: AI Copilot & Verified Certificate */}
          <div style={{
            background: 'linear-gradient(135deg, #1E1B4B 0%, #3730A3 100%)',
            borderRadius: '20px',
            padding: '22px',
            color: '#FFFFFF',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            border: '1px solid #4338CA',
            boxShadow: '0 10px 25px -5px rgba(67, 56, 202, 0.3)'
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
                <span style={{ fontSize: '0.7rem', fontWeight: 800, background: 'rgba(199, 210, 254, 0.2)', color: '#C7D2FE', padding: '3px 8px', borderRadius: '6px' }}>
                  AI TELEMETRY
                </span>
              </div>
              <h3 style={{ margin: '0 0 4px', fontSize: '1.15rem', fontWeight: 800 }}>Cognitive Copilot</h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#C7D2FE', lineHeight: 1.4 }}>
                Instant error diagnosis, latency decay curve & verified PDF credentials export.
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
                  padding: '9px 12px',
                  fontWeight: 800,
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
                  padding: '9px 14px',
                  fontWeight: 800,
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
        {/* 4. WHAT DO YOU WANT TO PLAY? (9 COGNITIVE ENGINES)           */}
        {/* ============================================================ */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 950, letterSpacing: '-0.02em', margin: 0, fontFamily: 'var(--font-display)' }}>
                WHAT DO YOU WANT TO PLAY?
              </h2>
              <p style={{ fontSize: '0.8rem', color: '#78716C', margin: '4px 0 0 0' }}>
                Select any of the 9 game-based cognitive engines to practice with live AI state solver and timed evaluations.
              </p>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#16A34A', background: '#DCFCE7', padding: '4px 10px', borderRadius: '12px' }}>
                ● 9 ENGINES ACTIVE
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
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                <span>View Full Catalog</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>

          {/* Cognitive Category Filter Bar */}
          <div style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '8px',
            marginBottom: '18px'
          }}>
            {[
              { id: 'all', label: 'All 10 Engines' },
              { id: 'placement', label: '🎯 Placement Aptitude Battery (8 Games)' },
              { id: 'logic', label: 'Logical (Inductive, Deductive)' },
              { id: 'spatial', label: 'Spatial & Quantitative (Grid, Math, Motion)' },
              { id: 'speed', label: 'Attention & Speed (Reaction, Focus)' },
              { id: 'executive', label: 'Executive (Switch, Memory)' }
            ].map(cat => {
              const isActive = (searchQuery === '' && cat.id === 'all') || (cat.id !== 'all' && cat.id === searchQuery);
              return (
                <button
                  key={cat.id}
                  onClick={() => setSearchQuery(cat.id === 'all' ? '' : cat.id)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '20px',
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
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '18px',
            marginBottom: '20px'
          }}>
            {[
              // 01 Inductive
              {
                id: 'inductive' as GameId,
                num: '01',
                title: 'Inductive Reasoning',
                desc: 'Pattern sequence extrapolation, Spacio "The Same Rule" & discovery.',
                icon: <Target size={18} color="#F59E0B" />,
                badgeBg: '#FEF3C7',
                category: 'logic',
                isPlacement: true,
                accentColor: '#F59E0B',
                subtypes: ['The Same Rule', 'Sequence', 'Odd One Out', 'Analogy']
              },
              // 02 Deductive
              {
                id: 'deductive' as GameId,
                num: '02',
                title: 'Deductive Reasoning',
                desc: 'Geo-Sudo geometrical Latin squares & conditional elimination.',
                icon: <Zap size={18} color="#0EA5E9" />,
                badgeBg: '#E0F2FE',
                category: 'logic',
                isPlacement: true,
                accentColor: '#0EA5E9',
                subtypes: ['Geo-Sudo', 'Syllogisms', 'Ordering', 'Constraints']
              },
              // 03 Spatial
              {
                id: 'grid' as GameId,
                num: '03',
                title: 'Spatial Reasoning',
                desc: 'Multi-Stage Grid Challenge: dot memorization, symmetry & recall.',
                icon: <Layers size={18} color="#0284C7" />,
                badgeBg: '#E0F2FE',
                category: 'spatial',
                isPlacement: true,
                accentColor: '#0284C7',
                subtypes: ['Grid Challenge', 'Rotation', 'Symmetry', 'Missing Cell']
              },
              // 04 Flexibility
              {
                id: 'switch' as GameId,
                num: '04',
                title: 'Cognitive Flexibility',
                desc: 'Switch Challenge: 4-digit transformation operators.',
                icon: <Shuffle size={18} color="#FB923C" />,
                badgeBg: '#FFEDD5',
                category: 'executive',
                isPlacement: true,
                accentColor: '#FB923C',
                subtypes: ['Switch Machine', 'Task Switch', 'Reverse Rule', 'Dual Pipeline']
              },
              // 05 Working Memory
              {
                id: 'memory' as GameId,
                num: '05',
                title: 'Working Memory',
                desc: 'Recall target sequences under high interference distraction.',
                icon: <Sparkles size={18} color="#0D9488" />,
                badgeBg: '#CCFBF1',
                category: 'executive',
                isPlacement: false,
                accentColor: '#0D9488',
                subtypes: ['Digit Span', 'Spatial Span', 'Interference', 'Delayed']
              },
              // 06 Attention & Focus
              {
                id: 'attention' as GameId,
                num: '06',
                title: 'Attention & Focus',
                desc: 'Target anomaly detection amid high-density visual distractors.',
                icon: <Eye size={18} color="#EAB308" />,
                badgeBg: '#FEF9C3',
                category: 'speed',
                isPlacement: false,
                accentColor: '#EAB308',
                subtypes: ['Anomaly Search', 'Feature Frequency', 'Rapid Match']
              },
              // 07 Processing Speed
              {
                id: 'reaction' as GameId,
                num: '07',
                title: 'Processing Speed',
                desc: 'Dynamic random-target reaction latency & Go/No-Go inhibition.',
                icon: <Zap size={18} color="#84CC16" />,
                badgeBg: '#ECFCCB',
                category: 'speed',
                isPlacement: false,
                accentColor: '#84CC16',
                subtypes: ['Dynamic Target RT', 'Rapid Match', 'Go/No-Go', 'Comparison']
              },
              // 08 Motion & Prediction
              {
                id: 'motion' as GameId,
                num: '08',
                title: 'Motion & Planning',
                desc: 'Motion Challenge: sliding token maze navigation.',
                icon: <Timer size={18} color="#EC4899" />,
                badgeBg: '#FCE7F3',
                category: 'spatial',
                isPlacement: true,
                accentColor: '#EC4899',
                subtypes: ['Slide Maze', 'Trajectory', 'Deflectors', 'Pathfinding']
              },
              // 09 Numerical Reasoning
              {
                id: 'math' as GameId,
                num: '09',
                title: 'Numerical Reasoning',
                desc: 'Digit Challenge: fill equation slots 1–9 left-to-right.',
                icon: <Calculator size={18} color="#10B981" />,
                badgeBg: '#D1FAE5',
                category: 'spatial',
                isPlacement: true,
                accentColor: '#10B981',
                subtypes: ['Digit Challenge', 'Number Series', 'Constraints', 'Estimation']
              },
              // 10 Color the Grid Challenge
              {
                id: 'color_grid' as GameId,
                num: '10',
                title: 'Color the Grid',
                desc: 'Diamond Rule Coding: deduce rules from 6 tables and color 4 query tables.',
                icon: <Sparkles size={18} color="#F97316" />,
                badgeBg: '#FFEDD5',
                category: 'logic',
                isPlacement: true,
                accentColor: '#F97316',
                subtypes: ['Z-Count Invariance', 'Parity & Vowels', 'Diamond Coding', 'Speed Decoding']
              }
            ]
              .filter(game => {
                if (!searchQuery) return true;
                if (searchQuery === 'placement') return game.isPlacement;
                if (searchQuery === 'logic') return game.category === 'logic';
                if (searchQuery === 'spatial') return game.category === 'spatial';
                if (searchQuery === 'speed') return game.category === 'speed';
                if (searchQuery === 'executive') return game.category === 'executive';
                return game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       game.desc.toLowerCase().includes(searchQuery.toLowerCase());
              })
              .map((game) => (
                <div
                  key={game.id}
                  style={{
                    background: '#18181B',
                    borderRadius: '18px',
                    padding: '20px',
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
                    {/* Header: Icon and Placement Badge */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          background: '#27272A',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {game.icon}
                        </div>
                      </div>
                      <span style={{
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        color: '#4ADE80',
                        background: 'rgba(74, 222, 128, 0.12)',
                        padding: '2px 8px',
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
                          padding: '2px 6px',
                          borderRadius: '4px'
                        }}>
                          {st}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Play Button */}
                  <button
                    onClick={() => onSelectGame(game.id)}
                    style={{
                      width: '100%',
                      background: '#27272A',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '9px 14px',
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

          {/* Pastel Lime Progress Callout Banner */}
          <div style={{
            background: '#E6F893',
            borderRadius: '20px',
            padding: '24px 28px',
            color: '#121110',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: '1.2rem' }}>✦</span>
                <span style={{ fontSize: '0.78rem', fontWeight: 900, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#3F6212' }}>
                  COMPLETE COGNITIVE ASSESSMENT ARCHITECTURE
                </span>
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 950, margin: '0 0 4px 0', letterSpacing: '-0.02em', fontFamily: 'var(--font-display)' }}>
                Master All 13 Domains with Continuous Practice &amp; Level 1–5 Progression
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#44403C', margin: 0 }}>
                Procedural question generation guarantees unique questions every trial without duplicates.
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
    </div>
  );
};
