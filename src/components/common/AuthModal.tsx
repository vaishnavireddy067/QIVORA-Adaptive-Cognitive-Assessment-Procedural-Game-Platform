import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { X, Lock, Mail, User, CheckCircle, ArrowRight, Shield, LogOut, AlertCircle, Sparkles } from 'lucide-react';
import { UserProfile } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { saveUserProfile, getUserProfile } from '../../services/storage';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: (user: UserProfile) => void;
  currentUser?: UserProfile;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const { user, isAuthenticated, loginWithGoogle, logout, authError } = useAuth();
  const [tab, setTab] = useState<'signin' | 'signup' | 'profiles'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [localFeedback, setLocalFeedback] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const isGoogleConfigured = Boolean(
    import.meta.env.VITE_GOOGLE_CLIENT_ID &&
    !import.meta.env.VITE_GOOGLE_CLIENT_ID.includes('dummy') &&
    import.meta.env.VITE_GOOGLE_CLIENT_ID.trim() !== ''
  );

  const handleGoogleSuccess = async (credential: string) => {
    setIsProcessing(true);
    setLocalFeedback(null);
    try {
      const authenticatedProfile = await loginWithGoogle(credential);
      setLocalFeedback(`Signed in as ${authenticatedProfile.name}!`);
      setIsProcessing(false);
      if (onLoginSuccess) onLoginSuccess(authenticatedProfile);
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err: any) {
      setIsProcessing(false);
      console.error('[Google Auth Error]', err);
    }
  };

  const handleQuickLogin = (preset: 'vaishnavi' | 'guest') => {
    let profile: UserProfile;
    if (preset === 'vaishnavi') {
      const existing = getUserProfile();
      profile = {
        ...existing,
        id: 'usr_vaishnavi_01',
        name: 'Vaishnavi',
        email: 'vaishnavi.anugu@qivora.edu',
        authProvider: 'guest',
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
        authProvider: 'guest',
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
    setLocalFeedback(`Signed in as ${profile.name}!`);
    setTimeout(() => {
      if (onLoginSuccess) onLoginSuccess(profile);
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
      authProvider: 'guest'
    };

    saveUserProfile(profile);
    setLocalFeedback(`Welcome back, ${profile.name}!`);
    setTimeout(() => {
      if (onLoginSuccess) onLoginSuccess(profile);
      onClose();
    }, 450);
  };

  const handleLogoutClick = () => {
    logout();
    setLocalFeedback('You have been signed out.');
    setTimeout(() => {
      onClose();
    }, 600);
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
          padding: '22px 28px 18px 28px',
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
              <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#A8A29E', letterSpacing: '0.08em', marginTop: '2px' }}>
                COGNITIVE PROFILE & PROGRESS
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
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
            <X size={16} />
          </button>
        </div>

        {/* If user is actively authenticated with Google */}
        {isAuthenticated && user.authProvider === 'google' ? (
          <div style={{ padding: '28px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '18px',
              background: '#F8FAFC',
              borderRadius: '16px',
              border: '1.5px solid #E2E8F0',
              marginBottom: '20px'
            }}>
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '50%',
                    border: '2px solid #FF3B20',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <div style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  background: '#141312',
                  color: '#FFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '1.4rem'
                }}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontWeight: 900, fontSize: '1.1rem', color: '#1E293B' }}>{user.name}</span>
                  <span style={{ fontSize: '0.72rem', background: '#DCFCE7', color: '#16A34A', fontWeight: 800, padding: '2px 6px', borderRadius: '4px' }}>
                    Google Verified
                  </span>
                </div>
                <div style={{ fontSize: '0.82rem', color: '#64748B', marginTop: '2px' }}>{user.email}</div>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '4px' }}>
                  Joined {user.joinedDate} • CQ Score: {user.cqScore}
                </div>
              </div>
            </div>

            {localFeedback && (
              <div style={{
                padding: '10px 14px',
                background: '#ECFDF5',
                border: '1px solid #10B981',
                borderRadius: '10px',
                color: '#065F46',
                fontWeight: 700,
                fontSize: '0.85rem',
                marginBottom: '14px',
                textAlign: 'center'
              }}>
                {localFeedback}
              </div>
            )}

            <button
              onClick={handleLogoutClick}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                border: '1.5px solid #CBD5E1',
                background: '#FFFFFF',
                color: '#DC2626',
                fontWeight: 800,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#FEF2F2')}
              onMouseLeave={e => (e.currentTarget.style.background = '#FFFFFF')}
            >
              <LogOut size={16} />
              <span>Sign Out of Google</span>
            </button>
          </div>
        ) : (
          <div>
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
                Google &amp; Sign In
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
                1-Click Presets
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
                Email
              </button>
            </div>

            {/* Body Content */}
            <div style={{ padding: '24px 28px' }}>
              {/* Feedback or Auth Error Banners */}
              {(localFeedback || authError) && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  background: authError ? '#FEF2F2' : '#ECFDF5',
                  border: `1.5px solid ${authError ? '#EF4444' : '#10B981'}`,
                  color: authError ? '#991B1B' : '#065F46',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  marginBottom: '16px'
                }}>
                  {authError ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
                  <span>{authError || localFeedback}</span>
                </div>
              )}

              {tab === 'signin' && (
                <div>
                  <div style={{ fontSize: '0.86rem', color: '#57534E', marginBottom: '16px', lineHeight: 1.45 }}>
                    Sign in with your Google account to sync your cognitive test benchmarks, speed history, and certificate accreditation.
                  </div>

                  {/* Primary Google Login Button Container */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    padding: '16px',
                    background: '#F8FAFC',
                    borderRadius: '16px',
                    border: '1.5px solid #E2E8F0',
                    marginBottom: '18px'
                  }}>
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                      <GoogleLogin
                        onSuccess={credentialResponse => {
                          if (credentialResponse.credential) {
                            handleGoogleSuccess(credentialResponse.credential);
                          }
                        }}
                        onError={() => {
                          setLocalFeedback('Google Sign-In failed or was cancelled.');
                        }}
                        useOneTap={false}
                        shape="pill"
                        size="large"
                        text="continue_with"
                        theme="filled_black"
                        width="300"
                      />
                    </div>

                    {!isGoogleConfigured && (
                      <div style={{
                        fontSize: '0.74rem',
                        color: '#64748B',
                        textAlign: 'center',
                        lineHeight: 1.4,
                        padding: '4px 8px'
                      }}>
                        💡 Note: Add your <code style={{ background: '#ECE7DD', padding: '1px 4px', borderRadius: '4px' }}>VITE_GOOGLE_CLIENT_ID</code> in <code style={{ background: '#ECE7DD', padding: '1px 4px', borderRadius: '4px' }}>.env</code> to connect your Google Cloud project.
                      </div>
                    )}
                  </div>

                  {isProcessing && (
                    <div style={{ textAlign: 'center', color: '#FF3B20', fontWeight: 800, fontSize: '0.85rem', marginBottom: '12px' }}>
                      Verifying Google credentials...
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '14px 0' }}>
                    <div style={{ flex: 1, height: '1px', background: '#E7E5E4' }} />
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#A8A29E', textTransform: 'uppercase' }}>or quick access</span>
                    <div style={{ flex: 1, height: '1px', background: '#E7E5E4' }} />
                  </div>

                  <button
                    onClick={() => handleQuickLogin('vaishnavi')}
                    style={{
                      width: '100%',
                      padding: '11px',
                      borderRadius: '12px',
                      border: '1.5px solid #141312',
                      background: '#FFFFFF',
                      color: '#141312',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <Sparkles size={15} color="#FF3B20" />
                    <span>Continue with Vaishnavi Demo Profile</span>
                  </button>
                </div>
              )}

              {tab === 'profiles' && (
                <div>
                  <div style={{ fontSize: '0.85rem', color: '#78716C', marginBottom: '16px', lineHeight: 1.4 }}>
                    Instant demo login presets for evaluation and offline practice:
                  </div>

                  {/* Vaishnavi Preset */}
                  <div
                    onClick={() => handleQuickLogin('vaishnavi')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 16px',
                      borderRadius: '14px',
                      border: '2px solid #FF3B20',
                      background: '#FFF8F6',
                      cursor: 'pointer',
                      marginBottom: '10px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        background: '#121110',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 900,
                        fontSize: '1rem'
                      }}>
                        V
                      </div>
                      <div>
                        <div style={{ fontWeight: 900, fontSize: '0.95rem', color: '#121110' }}>
                          Vaishnavi
                        </div>
                        <div style={{ fontSize: '0.74rem', color: '#78716C' }}>
                          vaishnavi.anugu@qivora.edu
                        </div>
                      </div>
                    </div>
                    <div style={{
                      padding: '5px 12px',
                      borderRadius: '9999px',
                      background: '#FF3B20',
                      color: '#FFFFFF',
                      fontSize: '0.75rem',
                      fontWeight: 900
                    }}>
                      Select →
                    </div>
                  </div>

                  {/* Guest Candidate Preset */}
                  <div
                    onClick={() => handleQuickLogin('guest')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 16px',
                      borderRadius: '14px',
                      border: '1.5px solid #E7E5E4',
                      background: '#FAF8F5',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        background: '#78716C',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 900,
                        fontSize: '1rem'
                      }}>
                        G
                      </div>
                      <div>
                        <div style={{ fontWeight: 900, fontSize: '0.95rem', color: '#121110' }}>
                          Guest Candidate
                        </div>
                        <div style={{ fontSize: '0.74rem', color: '#78716C' }}>
                          Fresh baseline profile (0 benchmarks)
                        </div>
                      </div>
                    </div>
                    <div style={{
                      padding: '5px 12px',
                      borderRadius: '9999px',
                      background: '#121110',
                      color: '#FFFFFF',
                      fontSize: '0.75rem',
                      fontWeight: 900
                    }}>
                      Select
                    </div>
                  </div>
                </div>
              )}

              {tab === 'signup' && (
                <form onSubmit={handleEmailSubmit}>
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

                  <div style={{ marginBottom: '18px' }}>
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
                      padding: '13px',
                      borderRadius: '14px',
                      border: '2px solid #141312',
                      background: '#FF3B20',
                      color: '#FFFFFF',
                      fontWeight: 900,
                      fontSize: '0.92rem',
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
                    <span>Save &amp; Continue</span>
                    <ArrowRight size={16} />
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Modal Footer Note */}
        <div style={{
          padding: '12px 24px',
          background: '#FAF8F5',
          borderTop: '1.5px solid #F0EEE9',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.72rem',
          color: '#78716C'
        }}>
          <Shield size={14} color="#10B981" />
          <span>Google OAuth tokens and test telemetry are verified client-side with HTTPS encryption.</span>
        </div>
      </div>
    </div>
  );
};
