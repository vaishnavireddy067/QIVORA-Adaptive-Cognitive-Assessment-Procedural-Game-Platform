import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { 
  LayoutDashboard, 
  Flame, 
  Swords, 
  Volume2, 
  VolumeX, 
  HelpCircle, 
  Gamepad2, 
  GraduationCap, 
  Zap, 
  TrendingUp,
  Menu,
  X,
  Compass
} from 'lucide-react';
import { sounds } from '../../services/soundEngine';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  user: UserProfile;
  onOpenAuth?: () => void;
  onOpenDailyDrill?: () => void;
  onOpenShortcuts?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigate,
  user,
  onOpenAuth,
  onOpenDailyDrill,
  onOpenShortcuts
}) => {
  const [isMuted, setIsMuted] = useState(sounds.getMuted());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleToggleSound = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      sounds.playCorrect(1);
    }
  };

  const handleNavClick = (tab: string) => {
    sounds.playClick();
    setIsMobileMenuOpen(false);
    onNavigate(tab);
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(250, 248, 245, 0.98)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1.5px solid var(--border-subtle)',
      width: '100%'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px',
        gap: '12px'
      }}>
        {/* ── Brand Logo ──────────────────────────────────────── */}
        <div 
          onClick={() => handleNavClick('landing')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            userSelect: 'none',
            flexShrink: 0
          }}
        >
          <div style={{
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            background: 'var(--accent-vermillion)',
            border: '2px solid var(--border-ink)',
            boxShadow: '2px 2px 0px #141312',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#FFFFFF' }} />
          </div>
          <div>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.35rem',
              fontWeight: 900,
              letterSpacing: '-0.04em',
              color: 'var(--text-primary)',
              lineHeight: 1
            }}>
              QIVORA
            </span>
            <div className="navbar-tagline" style={{ fontSize: '0.54rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.12em' }}>
              PLAY · THINK · GROW
            </div>
          </div>
        </div>

        {/* ── Center Editorial Navigation (Desktop Only) ─────── */}
        <nav 
          className="desktop-nav"
          style={{
            alignItems: 'center',
            gap: '4px',
            background: 'rgba(0, 0, 0, 0.03)',
            padding: '4px 6px',
            borderRadius: '9999px',
            border: '1px solid rgba(0,0,0,0.06)'
          }}
        >
          <button
            className={`nav-link ${currentTab === 'landing' ? 'active' : ''}`}
            onClick={() => handleNavClick('landing')}
          >
            🪐 Orbit
          </button>

          <button
            className={`nav-link ${currentTab === 'dashboard' || currentTab === 'home' ? 'active' : ''}`}
            onClick={() => handleNavClick('dashboard')}
          >
            Dashboard
          </button>

          <button
            className={`nav-link ${currentTab === 'games' || currentTab === 'play' ? 'active' : ''}`}
            onClick={() => handleNavClick('games')}
          >
            Games
          </button>

          <button
            className={`nav-link ${currentTab === 'duel' ? 'active' : ''}`}
            onClick={() => handleNavClick('duel')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              color: currentTab === 'duel' ? '#D97706' : undefined
            }}
          >
            <Swords size={13} color="#D97706" />
            <span>1v1 Duel</span>
          </button>

          <button
            className={`nav-link ${currentTab === 'practice' ? 'active' : ''}`}
            onClick={() => handleNavClick('practice')}
          >
            Practice
          </button>

          <button
            className={`nav-link ${currentTab === 'test' || currentTab === 'assessment' ? 'active' : ''}`}
            onClick={() => handleNavClick('test')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: currentTab === 'test' ? 'var(--accent-vermillion)' : undefined
            }}
          >
            <Zap size={13} color="var(--accent-vermillion)" />
            <span>Mock Test</span>
          </button>

          <button
            className={`nav-link ${currentTab === 'progress' || currentTab === 'results' || currentTab === 'journey' ? 'active' : ''}`}
            onClick={() => handleNavClick('results')}
          >
            Progress
          </button>
        </nav>

        {/* ── Right Utility Cluster & Unified Profile ────────── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexShrink: 0
        }}>
          {/* Daily Drill Workout (Desktop/Tablet) */}
          {onOpenDailyDrill && (
            <button
              className="desktop-nav"
              onClick={() => {
                sounds.playClick();
                onOpenDailyDrill();
              }}
              style={{
                alignItems: 'center',
                gap: '5px',
                padding: '6px 12px',
                borderRadius: '9999px',
                background: '#FEF3C7',
                border: '1.5px solid #F59E0B',
                color: '#92400E',
                fontWeight: 800,
                fontSize: '0.78rem',
                cursor: 'pointer',
                transition: 'transform 0.1s ease',
                whiteSpace: 'nowrap'
              }}
              title="Daily Cognitive Workout & Habit Heatmap"
            >
              <Flame size={14} color="#D97706" />
              <span>Daily Drill</span>
            </button>
          )}

          {/* Sound Toggle */}
          <button
            onClick={handleToggleSound}
            style={{
              width: '32px',
              height: '32px',
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
            title={isMuted ? 'Unmute Sound Effects (M)' : 'Mute Sound Effects (M)'}
          >
            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>

          {/* Unified Profile Badge */}
          <button
            className="navbar-profile-btn"
            onClick={() => onOpenAuth ? onOpenAuth() : onNavigate('profile')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '3px 10px 3px 3px',
              borderRadius: '9999px',
              background: user.authProvider === 'google' ? '#FFF8F6' : '#FFFFFF',
              border: `1.5px solid ${user.authProvider === 'google' ? '#FF3B20' : 'var(--border-ink)'}`,
              boxShadow: 'var(--shadow-tactile-sm)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
            title={user.authProvider === 'google' ? `Signed in as ${user.name} (${user.email})` : 'Sign in with Google'}
          >
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
              />
            ) : (
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'var(--text-primary)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '0.72rem'
              }}>
                {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
            )}
            <span 
              className="navbar-username"
              style={{
                fontWeight: 800,
                fontSize: '0.78rem',
                color: 'var(--text-primary)',
                maxWidth: '80px',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {user.name ? user.name : 'Account'}
            </span>
          </button>

          {/* Mobile Hamburger Toggle Button */}
          <button
            className="mobile-menu-btn"
            onClick={() => {
              sounds.playClick();
              setIsMobileMenuOpen(!isMobileMenuOpen);
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
              color: 'var(--text-primary)',
              flexShrink: 0
            }}
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* ── Mobile Navigation Drawer ────────────────────────── */}
      {isMobileMenuOpen && (
        <div 
          className="mobile-drawer"
          style={{
            background: 'rgba(250, 248, 245, 0.98)',
            borderBottom: '2px solid var(--border-ink)',
            padding: '12px 16px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
          }}
        >
          <button
            className={`nav-link ${currentTab === 'landing' ? 'active' : ''}`}
            onClick={() => handleNavClick('landing')}
            style={{ textAlign: 'left', padding: '10px 14px', fontSize: '0.95rem' }}
          >
            🪐 Orbit (Visual Neural Map)
          </button>

          <button
            className={`nav-link ${currentTab === 'dashboard' || currentTab === 'home' ? 'active' : ''}`}
            onClick={() => handleNavClick('dashboard')}
            style={{ textAlign: 'left', padding: '10px 14px', fontSize: '0.95rem' }}
          >
            📊 Analytics Dashboard
          </button>

          <button
            className={`nav-link ${currentTab === 'games' || currentTab === 'play' ? 'active' : ''}`}
            onClick={() => handleNavClick('games')}
            style={{ textAlign: 'left', padding: '10px 14px', fontSize: '0.95rem' }}
          >
            🎮 Games Library (All 9 Games)
          </button>

          <button
            className={`nav-link ${currentTab === 'duel' ? 'active' : ''}`}
            onClick={() => handleNavClick('duel')}
            style={{ 
              textAlign: 'left', 
              padding: '10px 14px', 
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#D97706'
            }}
          >
            <Swords size={16} />
            <span>1v1 Ghost Duel (AI Battle)</span>
          </button>

          <button
            className={`nav-link ${currentTab === 'practice' ? 'active' : ''}`}
            onClick={() => handleNavClick('practice')}
            style={{ textAlign: 'left', padding: '10px 14px', fontSize: '0.95rem' }}
          >
            🎯 Targeted Practice
          </button>

          <button
            className={`nav-link ${currentTab === 'test' || currentTab === 'assessment' ? 'active' : ''}`}
            onClick={() => handleNavClick('test')}
            style={{ 
              textAlign: 'left', 
              padding: '10px 14px', 
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--accent-vermillion)'
            }}
          >
            <Zap size={16} />
            <span>⚡ Full Mock Assessment</span>
          </button>

          <button
            className={`nav-link ${currentTab === 'progress' || currentTab === 'results' || currentTab === 'journey' ? 'active' : ''}`}
            onClick={() => handleNavClick('results')}
            style={{ textAlign: 'left', padding: '10px 14px', fontSize: '0.95rem' }}
          >
            📈 Progress & History
          </button>

          {onOpenDailyDrill && (
            <button
              onClick={() => {
                sounds.playClick();
                setIsMobileMenuOpen(false);
                onOpenDailyDrill();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 14px',
                borderRadius: '12px',
                background: '#FEF3C7',
                border: '1.5px solid #F59E0B',
                color: '#92400E',
                fontWeight: 800,
                fontSize: '0.9rem',
                cursor: 'pointer',
                marginTop: '4px'
              }}
            >
              <Flame size={16} color="#D97706" />
              <span>Open Daily Drill 🔥</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};


