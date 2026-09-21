import React, { useState } from 'react';
import { getLeaderboardData } from '../services/storage';
import { Award, Trophy, Users, Globe, Calendar } from 'lucide-react';

export const LeaderboardPage: React.FC = () => {
  const [filter, setFilter] = useState<'global' | 'weekly' | 'cohort'>('global');
  const data = getLeaderboardData();

  return (
    <div style={{ padding: '36px 0 60px 0' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Trophy size={20} color="#F59E0B" />
              <span className="badge badge-amber">Competitive Standings</span>
            </div>
            <h1 style={{ fontSize: '2.4rem', fontWeight: 800 }}>Cognitive Leaderboard</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '4px' }}>
              Rankings calculated from standardized 18-minute psychometric batteries.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="tab-nav">
            <button
              className={`tab-item ${filter === 'global' ? 'active' : ''}`}
              onClick={() => setFilter('global')}
            >
              <Globe size={16} />
              <span>All-Time Global</span>
            </button>
            <button
              className={`tab-item ${filter === 'weekly' ? 'active' : ''}`}
              onClick={() => setFilter('weekly')}
            >
              <Calendar size={16} />
              <span>Weekly Sprint</span>
            </button>
            <button
              className={`tab-item ${filter === 'cohort' ? 'active' : ''}`}
              onClick={() => setFilter('cohort')}
            >
              <Users size={16} />
              <span>University / Tech</span>
            </button>
          </div>
        </div>

        {/* Leaderboard Table Container */}
        <div className="glass-panel" style={{ padding: '12px 20px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-dim)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '14px 12px' }}>Rank</th>
                <th style={{ padding: '14px 12px' }}>Candidate</th>
                <th style={{ padding: '14px 12px' }}>Cohort / Institute</th>
                <th style={{ padding: '14px 12px' }}>Prime Dimension</th>
                <th style={{ padding: '14px 12px', textAlign: 'right' }}>Percentile</th>
                <th style={{ padding: '14px 12px', textAlign: 'right' }}>Cognitive Quotient</th>
              </tr>
            </thead>
            <tbody>
              {data.map((entry) => {
                const isTop3 = entry.rank <= 3;
                const medal = entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : null;

                return (
                  <tr
                    key={entry.rank}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                      background: entry.isCurrentUser ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                      fontWeight: entry.isCurrentUser ? 700 : 500,
                      transition: 'background 0.15s ease'
                    }}
                  >
                    {/* Rank */}
                    <td style={{ padding: '16px 12px', fontFamily: 'var(--font-mono)' }}>
                      {medal ? (
                        <span style={{ fontSize: '1.2rem', marginRight: '4px' }}>{medal}</span>
                      ) : (
                        <span style={{ color: 'var(--text-dim)', fontSize: '0.95rem' }}>#{entry.rank}</span>
                      )}
                    </td>

                    {/* Candidate */}
                    <td style={{ padding: '16px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '1.4rem' }}>{entry.avatar}</span>
                        <div>
                          <div style={{ color: entry.isCurrentUser ? '#A5B4FC' : '#F8FAFC', fontSize: '0.95rem' }}>
                            {entry.name}
                          </div>
                          {entry.isCurrentUser && (
                            <span className="badge badge-indigo" style={{ fontSize: '0.65rem', padding: '1px 5px' }}>
                              You
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Tag */}
                    <td style={{ padding: '16px 12px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      {entry.tag}
                    </td>

                    {/* Top Skill */}
                    <td style={{ padding: '16px 12px' }}>
                      <span className="badge badge-emerald" style={{ fontSize: '0.72rem' }}>
                        {entry.topSkill}
                      </span>
                    </td>

                    {/* Percentile */}
                    <td style={{ padding: '16px 12px', textAlign: 'right', fontFamily: 'var(--font-mono)', color: '#10B981' }}>
                      {entry.percentile}th %
                    </td>

                    {/* CQ Score */}
                    <td style={{ padding: '16px 12px', textAlign: 'right' }}>
                      <span style={{
                        fontSize: '1.2rem',
                        fontWeight: 800,
                        fontFamily: 'var(--font-mono)',
                        color: isTop3 ? '#FCD34D' : '#F8FAFC'
                      }}>
                        {entry.score}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
