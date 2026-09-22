import React, { useState } from 'react';
import { UserProfile, GameAttempt } from '../types';
import { getGameAttempts, saveUserProfile } from '../services/storage';
import { GAMES_DATA } from '../engine/gamesData';
import { User, Shield, CheckCircle, Flame, Calendar, Award, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ProfilePageProps {
  user: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ user, onUpdateUser }) => {
  const { logout } = useAuth();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [isEditing, setIsEditing] = useState(false);
  const attempts: GameAttempt[] = getGameAttempts();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = { ...user, name, email };
    saveUserProfile(updated);
    onUpdateUser(updated);
    setIsEditing(false);
  };

  const handleSignOut = () => {
    logout();
  };

  return (
    <div style={{ padding: '36px 0 60px 0' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        {/* Profile Header */}
        <div className="glass-panel" style={{ padding: '32px', display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px' }}>
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                border: '3px solid #FF3B20',
                objectFit: 'cover',
                boxShadow: '0 0 25px rgba(255, 59, 32, 0.4)'
              }}
            />
          ) : (
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366F1 0%, #10B981 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 25px rgba(99, 102, 241, 0.4)'
            }}>
              <User size={40} color="#FFF" />
            </div>
          )}

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{user.name}</h1>
              <span className="badge badge-emerald">
                {user.authProvider === 'google' ? 'Google Verified' : 'Candidate Profile'}
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '2px' }}>
              {user.email} • Joined {user.joinedDate}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
            {user.authProvider === 'google' && (
              <button
                className="btn btn-secondary btn-sm"
                onClick={handleSignOut}
                style={{ color: '#EF4444', borderColor: '#FCA5A5' }}
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            )}
          </div>
        </div>

        {/* Edit Form Modal/Dropdown */}
        {isEditing && (
          <form onSubmit={handleSave} className="glass-panel" style={{ padding: '24px', marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>Edit Account Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Candidate Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', background: '#0B1120', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFF' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', background: '#0B1120', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFF' }}
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary">Save Changes</button>
          </form>
        )}

        {/* Badges / Achievements */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>
            Cognitive Accreditations & Milestones
          </h3>
          <div className="grid grid-cols-4 gap-4">
            <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '6px' }}>⚡</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>Quick Reflex</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sub-220ms Reaction</div>
            </div>
            <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '6px' }}>🧩</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>Matrix Prodigy</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>90%+ Spatial Accuracy</div>
            </div>
            <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '6px' }}>🔄</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>Graph Master</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>BFS Shortest Path in Switch</div>
            </div>
            <div className="glass-panel" style={{ padding: '20px', textAlign: 'center', opacity: user.streakDays >= 3 ? 1 : 0.6 }}>
              <div style={{ fontSize: '2rem', marginBottom: '6px' }}>🔥</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>Consistent Mind</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {user.streakDays >= 3 ? `${user.streakDays}-Day Continuous Streak` : 'Requires 3-Day Streak'}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Game Attempts History */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>
            Recent Practice & Test Telemetry
          </h3>

          {attempts.length === 0 ? (
            <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>
              No recorded practice sessions yet. Launch any game from the Practice Hub to begin recording!
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {attempts.slice(0, 8).map((att) => {
                const meta = GAMES_DATA[att.gameId];
                return (
                  <div
                    key={att.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px 16px',
                      background: '#0B1120',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid rgba(255, 255, 255, 0.05)'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#F8FAFC' }}>
                        {meta ? meta.title : att.gameId}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                        Difficulty: {att.difficulty} • Latency: {Math.round(att.speedMs)}ms
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#10B981', fontFamily: 'var(--font-mono)' }}>
                          {att.score}%
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          {new Date(att.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
