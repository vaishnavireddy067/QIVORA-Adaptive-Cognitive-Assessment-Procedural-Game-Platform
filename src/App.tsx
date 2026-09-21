import React, { useState, useEffect } from 'react';
import { GameId, AssessmentResult, UserProfile } from './types';
import { getUserProfile } from './services/storage';
import { sounds } from './services/soundEngine';

import { Navbar } from './components/common/Navbar';
import { AuthModal } from './components/common/AuthModal';
import { QivoraDashboard } from './components/dashboard/QivoraDashboard';
import { GamesLobbyPage } from './pages/GamesLobbyPage';
import { LandingPage } from './pages/LandingPage';
import { GameArenaShell } from './components/games/GameArenaShell';
import { AssessmentPage } from './pages/AssessmentPage';
import { ResultsPage } from './pages/ResultsPage';
import { JourneyPage } from './pages/JourneyPage';
import { ProfilePage } from './pages/ProfilePage';
import { GhostDuelPage } from './pages/GhostDuelPage';

// Modals
import { CognitiveCertificateModal } from './components/common/CognitiveCertificateModal';
import { CognitiveCopilotModal } from './components/common/CognitiveCopilotModal';
import { DailyWorkoutModal } from './components/dashboard/DailyWorkoutModal';
import { KeyboardShortcutsModal } from './components/common/KeyboardShortcutsModal';

type ViewMode = 
  | 'landing' 
  | 'dashboard'
  | 'home'
  | 'games'
  | 'play' 
  | 'practice' 
  | 'duel'
  | 'test' 
  | 'progress' 
  | 'results' 
  | 'profile';

export function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('landing');
  const [activeGameId, setActiveGameId] = useState<GameId | null>(null);
  const [user, setUser] = useState<UserProfile>(getUserProfile());
  const [latestResult, setLatestResult] = useState<AssessmentResult | null>(null);
  
  // Modals state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [isCopilotModalOpen, setIsCopilotModalOpen] = useState(false);
  const [isDailyModalOpen, setIsDailyModalOpen] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.key === '?') {
        sounds.playClick();
        setIsShortcutsModalOpen(prev => !prev);
      } else if (e.key === 'm' || e.key === 'M') {
        sounds.toggleMute();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const handleLaunchGame = (gameId?: GameId) => {
    sounds.playClick();
    setActiveGameId(gameId || 'grid');
    setCurrentView('practice');
  };

  const handleTakeTest = () => {
    sounds.playClick();
    setCurrentView('test');
  };

  const handleAssessmentComplete = (result: AssessmentResult) => {
    setLatestResult(result);
    setUser(getUserProfile());
    setCurrentView('results');
  };

  const isFullDashboard = currentView === 'dashboard' || currentView === 'home';
  const isGamesCatalog = currentView === 'games' || currentView === 'play';
  const isDuelArena = currentView === 'duel';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#FCF9F2' }}>
      {/* Subpage Header (shown when NOT on QivoraDashboard full sidebar view or Duel Arena) */}
      {!isFullDashboard && !isDuelArena && (
        <Navbar
          currentTab={currentView}
          onNavigate={(tab) => {
            if (tab === 'landing') setCurrentView('landing');
            else if (tab === 'home' || tab === 'dashboard') setCurrentView('dashboard');
            else if (tab === 'games' || tab === 'play') setCurrentView('games');
            else if (tab === 'duel') setCurrentView('duel');
            else if (tab === 'practice') {
              if (!activeGameId) setActiveGameId('grid');
              setCurrentView('practice');
            }
            else if (tab === 'test') setCurrentView('test');
            else if (tab === 'results') setCurrentView('results');
            else if (tab === 'progress') setCurrentView('progress');
            else if (tab === 'profile') setCurrentView('profile');
          }}
          user={user}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onOpenDailyDrill={() => setIsDailyModalOpen(true)}
          onOpenShortcuts={() => setIsShortcutsModalOpen(true)}
        />
      )}

      {/* Main Viewport */}
      <main style={{ flex: 1 }}>
        {/* 1. Public Landing Page */}
        {currentView === 'landing' && (
          <LandingPage
            onPlay={handleLaunchGame}
            onTakeTest={handleTakeTest}
            onOpenDashboard={() => setCurrentView('dashboard')}
            onOpenAuth={() => setIsAuthModalOpen(true)}
          />
        )}

        {/* 2. Comprehensive Cognitive Diagnosis & Analytics Dashboard */}
        {isFullDashboard && (
          <QivoraDashboard
            onSelectGame={handleLaunchGame}
            onNavigateTab={(tab) => {
              if (tab === 'landing') setCurrentView('landing');
              else if (tab === 'home' || tab === 'dashboard') setCurrentView('dashboard');
              else if (tab === 'games' || tab === 'play') setCurrentView('games');
              else if (tab === 'duel') setCurrentView('duel');
              else if (tab === 'practice') {
                if (!activeGameId) setActiveGameId('grid');
                setCurrentView('practice');
              }
              else if (tab === 'test') setCurrentView('test');
              else if (tab === 'results' || tab === 'progress') setCurrentView('results');
            }}
            activeTab="home"
            userName={user.name}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onOpenDailyDrill={() => setIsDailyModalOpen(true)}
            onOpenDuel={() => setCurrentView('duel')}
            onOpenCertificate={() => setIsCertificateModalOpen(true)}
            onOpenCopilot={() => setIsCopilotModalOpen(true)}
          />
        )}

        {/* 3. 1v1 Ghost Duel / AI Battle Mode */}
        {currentView === 'duel' && (
          <GhostDuelPage
            onBack={() => setCurrentView('dashboard')}
            userName={user.name}
          />
        )}

        {/* 4. 9-Domain Games & Challenge Catalog */}
        {isGamesCatalog && (
          <GamesLobbyPage
            onSelectGame={handleLaunchGame}
            onNavigateTab={(tab) => {
              if (tab === 'landing') setCurrentView('landing');
              else if (tab === 'home' || tab === 'dashboard') setCurrentView('dashboard');
              else if (tab === 'games' || tab === 'play') setCurrentView('games');
              else if (tab === 'duel') setCurrentView('duel');
              else if (tab === 'practice') {
                if (!activeGameId) setActiveGameId('grid');
                setCurrentView('practice');
              }
              else if (tab === 'test') setCurrentView('test');
              else if (tab === 'results' || tab === 'progress') setCurrentView('results');
            }}
            activeTab="games"
            userName={user.name}
            onOpenAuth={() => setIsAuthModalOpen(true)}
          />
        )}

        {/* 5. Game Arena (6-Step Guided Flow) */}
        {currentView === 'practice' && (
          <GameArenaShell
            gameId={activeGameId || 'grid'}
            onBack={() => setCurrentView('games')}
            onLaunchTimedAssessment={() => setCurrentView('test')}
            onComplete={() => setUser(getUserProfile())}
          />
        )}

        {/* 6. Full Battery Mock Assessment */}
        {currentView === 'test' && (
          <AssessmentPage
            onAssessmentComplete={handleAssessmentComplete}
            onExit={() => setCurrentView('dashboard')}
          />
        )}

        {/* 7. Comprehensive Assessment Results */}
        {currentView === 'results' && (
          <ResultsPage
            result={latestResult || {
              id: 'mock_res',
              overallScore: 82,
              percentile: 88,
              archetype: {
                title: 'Strategic Analyst',
                description: 'Exceptional pattern extraction and rapid visual memory retention.',
                traits: ['Pattern Recognition', 'Working Memory', 'Spatial Precision']
              },
              skillScores: {
                inductive: 86,
                deductive: 74,
                grid: 91,
                switch: 68,
                memory: 94,
                attention: 87,
                reaction: 79,
                math: 76,
                motion: 82,
                color_grid: 84
              },
              strengths: [
                { gameId: 'inductive', label: 'Pattern Recognition', score: 86 },
                { gameId: 'memory', label: 'Visual Memory', score: 94 }
              ],
              weaknesses: [
                { gameId: 'switch', label: 'Cognitive Flexibility', score: 68 }
              ],
              recommendation: {
                gameId: 'switch',
                reason: 'Switch Game presents your greatest opportunity for growth.',
                difficulty: 'hard'
              },
              completedAt: new Date().toISOString(),
              durationMin: 10
            }}
            onRetake={handleTakeTest}
            onPracticeGame={handleLaunchGame}
            onOpenCertificate={() => setIsCertificateModalOpen(true)}
            onOpenCopilot={() => setIsCopilotModalOpen(true)}
          />
        )}

        {/* 8. Cognitive Growth Progress */}
        {currentView === 'progress' && (
          <JourneyPage
            onPlayGame={handleLaunchGame}
          />
        )}

        {/* 9. Profile Page */}
        {currentView === 'profile' && (
          <ProfilePage
            user={user}
            onUpdateUser={setUser}
          />
        )}
      </main>

      {/* Global Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(updatedUser) => {
          setUser(updatedUser);
          setIsAuthModalOpen(false);
        }}
        currentUser={user}
      />

      <CognitiveCertificateModal
        isOpen={isCertificateModalOpen}
        onClose={() => setIsCertificateModalOpen(false)}
        result={latestResult}
        user={user}
      />

      <CognitiveCopilotModal
        isOpen={isCopilotModalOpen}
        onClose={() => setIsCopilotModalOpen(false)}
        result={latestResult}
        onStartDrill={(gameId) => handleLaunchGame(gameId as GameId)}
      />

      <DailyWorkoutModal
        isOpen={isDailyModalOpen}
        onClose={() => setIsDailyModalOpen(false)}
        onStartDailyChallenge={(gameId) => handleLaunchGame(gameId as GameId)}
      />

      <KeyboardShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
      />

      {/* Editorial Footer */}
      {!isFullDashboard && !isDuelArena && (
        <footer style={{
          borderTop: '1.5px solid var(--border-subtle)',
          background: 'var(--bg-surface)',
          padding: '40px 0'
        }}>
          <div className="container" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            <div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.2rem', color: 'var(--text-primary)' }}>
                QIVORA
              </span>
              <span style={{ marginLeft: '12px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Think faster. Play smarter.
              </span>
            </div>

            <div style={{ display: 'flex', gap: '24px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              <span style={{ cursor: 'pointer' }} onClick={() => setCurrentView('landing')}>Landing Page</span>
              <span style={{ cursor: 'pointer' }} onClick={() => setCurrentView('dashboard')}>Dashboard</span>
              <span style={{ cursor: 'pointer' }} onClick={() => setCurrentView('duel')}>1v1 Duel</span>
              <span style={{ cursor: 'pointer' }} onClick={() => setCurrentView('test')}>Mock Test</span>
              <span style={{ cursor: 'pointer' }} onClick={() => setIsDailyModalOpen(true)}>Daily Drill</span>
              <span style={{ cursor: 'pointer' }} onClick={() => setIsShortcutsModalOpen(true)}>Shortcuts (?)</span>
              <span style={{ cursor: 'pointer' }} onClick={() => setIsAuthModalOpen(true)}>Log In</span>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

export default App;
