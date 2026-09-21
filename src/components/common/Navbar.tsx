import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { LayoutDashboard, Flame, Swords, Volume2, VolumeX, HelpCircle, Gamepad2, GraduationCap, Zap, TrendingUp } from 'lucide-react';
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

  const handleToggleSound = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      sounds.playCorrect(1);
    }
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(250, 248, 245, 0.96)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1.5px solid var(--border-subtle)',
      width: '100%'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '70px',
        gap: '20px'
      }}>
        {/* ── Brand Logo ──────────────────────────────────────── */}
        <div 
          onClick={() => {
            sounds.playClick();
            onNavigate('landing');
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            userSelect: 'none',
            flexShrink: 0
          }}
        >
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'var(--accent-vermillion)',
            border: '2px solid var(--border-ink)',
            boxShadow: '2px 2px 0px #141312',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#FFFFFF' }} />
          </div>
          <div>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.45rem',
              fontWeight: 900,
              letterSpacing: '-0.04em',
              color: 'var(--text-primary)',
              lineHeight: 1
            }}>
              QIVORA
            </span>
            <div style={{ fontSize: '0.58rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.12em' }}>
              PLAY · THINK · GROW
            </div>
          </div>
        </div>

        {/* ── Center Editorial Navigation ────────────────────── */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          background: 'rgba(0, 0, 0, 0.03)',
          padding: '4px 6px',
          borderRadius: '9999px',
          border: '1px solid rgba(0,0,0,0.06)'
        }}>
          <button
            className={`nav-link ${currentTab === 'landing' ? 'active' : ''}`}
            onClick={() => {
              sounds.playClick();
              onNavigate('landing');
            }}
          >
            🪐 Orbit
          </button>

          <button
            className={`nav-link ${currentTab === 'dashboard' || currentTab === 'home' ? 'active' : ''}`}
            onClick={() => {
              sounds.playClick();
              onNavigate('dashboard');
            }}
          >
            Dashboard
          </button>

          <button
            className={`nav-link ${currentTab === 'games' || currentTab === 'play' ? 'active' : ''}`}
            onClick={() => {
              sounds.playClick();
              onNavigate('games');
            }}
          >
            Games
          </button>

          <button
            className={`nav-link ${currentTab === 'duel' ? 'active' : ''}`}
            onClick={() => {
              sounds.playClick();
              onNavigate('duel');
            }}
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
            onClick={() => {
              sounds.playClick();
              onNavigate('practice');
            }}
          >
            Practice
          </button>

          <button
            className={`nav-link ${currentTab === 'test' || currentTab === 'assessment' ? 'active' : ''}`}
            onClick={() => {
              sounds.playClick();
              onNavigate('test');
            }}
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
            onClick={() => {
              sounds.playClick();
              onNavigate('results');
            }}
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
          {/* Daily Drill Workout */}
          {onOpenDailyDrill && (
            <button
              onClick={() => {
                sounds.playClick();
                onOpenDailyDrill();
              }}
              style={{
                display: 'flex',
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
              width: '34px',
              height: '34px',
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
            {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>

          {/* Keyboard Shortcuts Help */}
          {onOpenShortcuts && (
            <button
              onClick={() => {
                sounds.playClick();
                onOpenShortcuts();
              }}
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: '#FFFFFF',
                border: '1.5px solid var(--border-ink)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                fontWeight: 800,
                fontSize: '0.82rem',
                transition: 'all 0.15s ease'
              }}
              title="Keyboard Shortcuts (?)"
            >
              <HelpCircle size={15} />
            </button>
          )}

          {/* Subtle Vertical Divider */}
          <div style={{
            width: '1px',
            height: '22px',
            background: 'var(--border-subtle)',
            margin: '0 4px'
          }} />

          {/* Unified Profile Badge (Replaces the duplicate pill + avatar) */}
          <button
            onClick={() => onOpenAuth ? onOpenAuth() : onNavigate('profile')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 12px 4px 4px',
              borderRadius: '9999px',
              background: '#FFFFFF',
              border: '1.5px solid var(--border-ink)',
              boxShadow: 'var(--shadow-tactile-sm)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap'
            }}
            title="Manage Profile / Account"
          >
            <div style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              background: 'var(--text-primary)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '0.75rem'
            }}>
              {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <span style={{
              fontWeight: 800,
              fontSize: '0.8rem',
              color: 'var(--text-primary)',
              maxWidth: '100px',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {user.name ? user.name : 'Account'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

