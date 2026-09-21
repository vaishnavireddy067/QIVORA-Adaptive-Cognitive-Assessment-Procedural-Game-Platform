import React, { useState } from 'react';
import { GameId } from '../types';
import { GAMES_DATA } from '../engine/gamesData';
import { BookOpen, Target, Timer, ArrowRight, Filter, Search } from 'lucide-react';

interface PracticeHubPageProps {
  onSelectGame: (gameId: GameId) => void;
  userScores?: Partial<Record<GameId, number>>;
}

export const PracticeHubPage: React.FC<PracticeHubPageProps> = ({ onSelectGame, userScores = {} }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const games = Object.values(GAMES_DATA);
  const categories = ['All', 'Logical Reasoning', 'Working Memory', 'Attention & Speed', 'Spatial & Quantitative'];

  const filteredGames = games.filter(g => {
    const matchesCategory = selectedCategory === 'All' || g.category === selectedCategory;
    const matchesSearch = g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          g.skill.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ padding: '36px 0 60px 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800 }}>Practice Arena</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginTop: '6px' }}>
            Choose a game to begin the 3-step mastery flow: Learn the rules, practice with hints, or test under timer.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '32px'
        }}>
          {/* Categories */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: '#0B1120',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '8px 14px',
            width: '260px'
          }}>
            <Search size={16} color="var(--text-dim)" />
            <input
              type="text"
              placeholder="Search cognitive game..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#FFF',
                outline: 'none',
                fontSize: '0.85rem',
                width: '100%'
              }}
            />
          </div>
        </div>

        {/* Game Cards Grid */}
        <div className="grid grid-cols-2 gap-6">
          {filteredGames.map(game => {
            const currentScore = userScores[game.id] ?? 70;

            return (
              <div
                key={game.id}
                className="glass-panel"
                style={{
                  padding: '28px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '18px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span className={`badge badge-${game.badgeColor}`}>
                      {game.skill}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                      Best: <strong style={{ color: '#10B981' }}>{currentScore}%</strong>
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '6px' }}>
                    {game.title}
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                    {game.description}
                  </p>
                </div>

                {/* 3-Step Pill indicators */}
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  padding: '8px 12px',
                  background: '#0B1120',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <BookOpen size={12} color="var(--primary-light)" />
                    <span>1. Learn</span>
                  </div>
                  <span>•</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Target size={12} color="#10B981" />
                    <span>2. Practice</span>
                  </div>
                  <span>•</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Timer size={12} color="#F59E0B" />
                    <span>3. Test</span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                    Avg Duration: ~{Math.round(game.avgTimeSec / 60)} min
                  </span>
                  <button
                    className="btn btn-primary"
                    onClick={() => onSelectGame(game.id)}
                  >
                    <span>Launch Game</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
