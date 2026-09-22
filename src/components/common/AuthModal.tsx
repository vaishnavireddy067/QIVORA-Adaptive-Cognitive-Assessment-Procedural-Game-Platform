import React, { useState } from 'react';
import { X, Lock, Mail, User, CheckCircle, ArrowRight, Shield } from 'lucide-react';
import { UserProfile } from '../../types';
import { saveUserProfile, getUserProfile } from '../../services/storage';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  currentUser?: UserProfile;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  currentUser
}) => {
  const [tab, setTab] = useState<'signin' | 'signup' | 'profiles'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleQuickLogin = (preset: 'vaishnavi' | 'guest') => {
    let profile: UserProfile;
    if (preset === 'vaishnavi') {
      const existing = getUserProfile();
      profile = {
        ...existing,
        id: 'usr_vaishnavi_01',
        name: 'Vaishnavi',
        email: 'vaishnavi.anugu@qivora.edu',
        joinedDate: 'September 2026'
      };
    } else {
      profile = {
        id: 'usr_guest_demo',
        name: 'Guest Candidate',
        email: 'guest.candidate@qivora.edu',
        cqScore: 0,
        streakDays: 0,
        testsCompleted: 0,
        puzzlesSolved: 0,
        joinedDate: 'September 2026',
        bestScores: {
          inductive: 0,
          deductive: 0,
          grid: 0,
          switch: 0,
          memory: 0,
          attention: 0,
          reaction: 0,
          math: 0
        }
      };
    }

    saveUserProfile(profile);
    setFeedback(`Signed in as ${profile.name}!`);
    setTimeout(() => {
      onLoginSuccess(profile);
      onClose();
    }, 450);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const userName = name || email.split('@')[0] || 'Candidate';
    const profile: UserProfile = {
      ...getUserProfile(),
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      name: userName.charAt(0).toUpperCase() + userName.slice(1),
      email: email,
    };

    saveUserProfile(profile);
    setFeedback(`Welcome back, ${profile.name}!`);
    setTimeout(() => {
      onLoginSuccess(profile);
      onClose();
    }, 450);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(18, 17, 16, 0.65)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          border: '2px solid #141312',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2), 6px 6px 0px #141312',
          width: '100%',
          maxWidth: '460px',
          overflow: 'hidden',
          animation: 'scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{
          padding: '24px 28px 20px 28px',
          borderBottom: '1.5px solid #F0EEE9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#FAF8F5'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1 }}>
                QIVORA ACCOUNT
              </div>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#A8A29E', letterSpacing: '0.08em', marginTop: '2px' }}>
                COGNITIVE PROFILE & PROGRESS
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              border: '1.5px solid #E7E5E4',
              background: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#57534E',
              transition: 'all 0.15s ease'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Selector */}
        <div style={{
          display: 'flex',
          borderBottom: '1.5px solid #E7E5E4',
          background: '#FAF8F5'
        }}>
          <button
            onClick={() => setTab('signin')}
            style={{
              flex: 1,
              padding: '12px 0',
              border: 'none',
              background: tab === 'signin' ? '#FFFFFF' : 'transparent',
              fontWeight: 800,
              fontSize: '0.85rem',
              color: tab === 'signin' ? '#FF3B20' : '#78716C',
              borderBottom: tab === 'signin' ? '2.5px solid #FF3B20' : '2.5px solid transparent',
              cursor: 'pointer'
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => setTab('profiles')}
            style={{
              flex: 1,
              padding: '12px 0',
              border: 'none',
              background: tab === 'profiles' ? '#FFFFFF' : 'transparent',
              fontWeight: 800,
              fontSize: '0.85rem',
              color: tab === 'profiles' ? '#FF3B20' : '#78716C',
              borderBottom: tab === 'profiles' ? '2.5px solid #FF3B20' : '2.5px solid transparent',
              cursor: 'pointer'
            }}
          >
            1-Click Profiles
          </button>
          <button
            onClick={() => setTab('signup')}
            style={{
              flex: 1,
              padding: '12px 0',
              border: 'none',
              background: tab === 'signup' ? '#FFFFFF' : 'transparent',
              fontWeight: 800,
              fontSize: '0.85rem',
              color: tab === 'signup' ? '#FF3B20' : '#78716C',
              borderBottom: tab === 'signup' ? '2.5px solid #FF3B20' : '2.5px solid transparent',
              cursor: 'pointer'
            }}
          >
            New Account
          </button>
        </div>

        {/* Body Content */}
        <div style={{ padding: '24px 28px' }}>
          {feedback && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 16px',
              borderRadius: '12px',
              background: '#ECFDF5',
              border: '1.5px solid #10B981',
              color: '#065F46',
              fontWeight: 800,
              fontSize: '0.9rem',
              marginBottom: '18px'
            }}>
              <CheckCircle size={18} />
              <span>{feedback}</span>
            </div>
          )}

          {tab === 'profiles' ? (
            <div>
              <div style={{ fontSize: '0.85rem', color: '#78716C', marginBottom: '16px', lineHeight: 1.4 }}>
                Instant demo login to sync your cognitive test benchmarks, speed history, and assessment scores:
              </div>

              {/* Vaishnavi Preset */}
              <div
                onClick={() => handleQuickLogin('vaishnavi')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  borderRadius: '16px',
                  border: '2px solid #FF3B20',
                  background: '#FFF8F6',
                  cursor: 'pointer',
                  marginBottom: '12px',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: '#121110',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: '1.1rem'
                  }}>
                    V
                  </div>
                  <div>
                    <div style={{ fontWeight: 900, fontSize: '1rem', color: '#121110' }}>
                      Vaishnavi
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#78716C' }}>
                      CQ Score: 88 · Top Ranker (Inductive 94, Grid 90)
                    </div>
                  </div>
                </div>
                <div style={{
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  background: '#FF3B20',
                  color: '#FFFFFF',
                  fontSize: '0.78rem',
                  fontWeight: 900
                }}>
                  Login →
                </div>
              </div>

              {/* Guest Candidate Preset */}
              <div
                onClick={() => handleQuickLogin('guest')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  borderRadius: '16px',
                  border: '1.5px solid #E7E5E4',
                  background: '#FAF8F5',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: '#78716C',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: '1.1rem'
                  }}>
                    G
                  </div>
                  <div>
                    <div style={{ fontWeight: 900, fontSize: '1rem', color: '#121110' }}>
                      Guest Candidate
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#78716C' }}>
                      Fresh benchmark profile · 5 tests completed
                    </div>
                  </div>
                </div>
                <div style={{
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  background: '#121110',
                  color: '#FFFFFF',
                  fontSize: '0.78rem',
                  fontWeight: 900
                }}>
                  Select
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleEmailSubmit}>
              {tab === 'signup' && (
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 900, color: '#57534E', marginBottom: '6px', textTransform: 'uppercase' }}>
                    Your Full Name
                  </label>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    border: '1.5px solid #E7E5E4',
                    borderRadius: '12px',
                    padding: '10px 14px',
                    background: '#FAF8F5'
                  }}>
                    <User size={18} color="#A8A29E" />
                    <input
                      type="text"
                      placeholder="e.g. Vaishnavi"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.9rem', color: '#121110' }}
                    />
                  </div>
                </div>
              )}

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 900, color: '#57534E', marginBottom: '6px', textTransform: 'uppercase' }}>
                  Email Address
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  border: '1.5px solid #E7E5E4',
                  borderRadius: '12px',
                  padding: '10px 14px',
                  background: '#FAF8F5'
                }}>
                  <Mail size={18} color="#A8A29E" />
                  <input
                    type="email"
                    placeholder="name@assessment.edu"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.9rem', color: '#121110' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 900, color: '#57534E', marginBottom: '6px', textTransform: 'uppercase' }}>
                  Password
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  border: '1.5px solid #E7E5E4',
                  borderRadius: '12px',
                  padding: '10px 14px',
                  background: '#FAF8F5'
                }}>
                  <Lock size={18} color="#A8A29E" />
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.9rem', color: '#121110' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '14px',
                  border: '2px solid #141312',
                  background: '#FF3B20',
                  color: '#FFFFFF',
                  fontWeight: 900,
                  fontSize: '0.95rem',
                  letterSpacing: '0.02em',
                  cursor: 'pointer',
                  boxShadow: '3px 3px 0px #141312',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{tab === 'signin' ? 'SIGN IN NOW' : 'CREATE ACCOUNT'}</span>
                <ArrowRight size={16} />
              </button>

              <div style={{
                textAlign: 'center',
                marginTop: '16px',
                fontSize: '0.8rem',
                color: '#78716C'
              }}>
                Or test quickly with{' '}
                <span
                  onClick={() => handleQuickLogin('vaishnavi')}
                  style={{ color: '#FF3B20', fontWeight: 900, cursor: 'pointer', textDecoration: 'underline' }}
                >
                  1-Click Vaishnavi Profile
                </span>
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer Note */}
        <div style={{
          padding: '14px 24px',
          background: '#FAF8F5',
          borderTop: '1.5px solid #F0EEE9',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.75rem',
          color: '#78716C'
        }}>
          <Shield size={14} color="#10B981" />
          <span>Cognitive assessment sessions are stored securely in browser storage.</span>
        </div>
      </div>
    </div>
  );
};
