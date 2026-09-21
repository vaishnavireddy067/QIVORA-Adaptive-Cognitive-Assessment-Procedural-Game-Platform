import React, { useState } from 'react';
import { X, Sparkles, Brain, Zap, Target, TrendingUp, AlertCircle, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import { sounds } from '../../services/soundEngine';
import { AssessmentResult } from '../../types';

interface CognitiveCopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
  result?: AssessmentResult | null;
  onStartDrill?: (gameId: string) => void;
}

export const CognitiveCopilotModal: React.FC<CognitiveCopilotModalProps> = ({
  isOpen,
  onClose,
  result,
  onStartDrill
}) => {
  const [activeTab, setActiveTab] = useState<'diagnosis' | 'bottlenecks' | 'drill_plan'>('diagnosis');

  if (!isOpen) return null;

  const score = result?.overallScore || 84;
  const percentile = result?.percentile || 89;
  const archetype = result?.archetype?.title || 'Algorithmic Strategist';

  const diagnostics = [
    {
      title: 'Latency Consistency',
      metric: '1.24s ± 0.18s',
      status: 'Elite',
      score: 94,
      desc: 'Minimal hesitation across progressive difficulty shifts. Your decision threshold is well-calibrated.'
    },
    {
      title: 'Switch Cost Penalty',
      metric: '320ms latency spike',
      status: 'Moderate',
      score: 72,
      desc: 'When task rules inverted in Switch Challenge, your reaction slowed by 320ms before adapting.'
    },
    {
      title: 'Visual Memory Retention',
      metric: '8-Node Span',
      status: 'Super-Linear',
      score: 96,
      desc: 'Grid sequence replication was in the top 4% of all verified test takers globally.'
    }
  ];

  const recommendations = [
    {
      title: 'Cognitive Inversion Drill',
      gameId: 'switch',
      duration: '4 mins',
      focus: 'Rule Flexibility & Inversion Resistance',
      impact: '+14% faster context switching'
    },
    {
      title: 'Spatial Rotation Burst',
      gameId: 'grid',
      duration: '3 mins',
      focus: 'Mental Isometric Transformation',
      impact: '+9% pattern solve velocity'
    },
    {
      title: 'Inductive Hypothesis Testing',
      gameId: 'inductive',
      duration: '5 mins',
      focus: 'Counter-example Rule Elimination',
      impact: '+18% deductive certainty'
    }
  ];

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.8)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '16px'
    }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: '24px',
        maxWidth: '720px',
        width: '100%',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.3)',
        border: '1px solid #E2E8F0',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '90vh'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #4338CA 100%)',
          color: '#FFFFFF',
          padding: '24px',
          position: 'relative'
        }}>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              padding: '12px',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              display: 'flex'
            }}>
              <Brain size={28} color="#A5B4FC" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  background: 'rgba(165, 180, 252, 0.25)',
                  padding: '2px 8px',
                  borderRadius: '20px',
                  color: '#C7D2FE'
                }}>
                  Neural AI Engine
                </span>
                <span style={{ fontSize: '0.8rem', color: '#A5B4FC' }}>• Active Telemetry</span>
              </div>
              <h2 style={{ margin: '4px 0 0', fontSize: '1.4rem', fontWeight: 800 }}>
                QIVORA Cognitive Copilot
              </h2>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            marginTop: '20px',
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '12px 16px',
            borderRadius: '14px',
            border: '1px solid rgba(255, 255, 255, 0.15)'
          }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#C7D2FE', textTransform: 'uppercase', fontWeight: 700 }}>Cognitive Archetype</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#FFFFFF', marginTop: '2px' }}>{archetype}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#C7D2FE', textTransform: 'uppercase', fontWeight: 700 }}>Overall Index</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#FCD34D', marginTop: '2px' }}>{score} / 100</div>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#C7D2FE', textTransform: 'uppercase', fontWeight: 700 }}>Global Standing</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#6EE7B7', marginTop: '2px' }}>Top {100 - percentile}%</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #E2E8F0',
          background: '#F8FAFC',
          padding: '0 24px'
        }}>
          {[
            { id: 'diagnosis', label: 'Telemetry Breakdown', icon: TrendingUp },
            { id: 'bottlenecks', label: 'Cognitive Vulnerabilities', icon: AlertCircle },
            { id: 'drill_plan', label: 'Tailored Workout Plan', icon: Sparkles }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  sounds.playClick();
                  setActiveTab(tab.id as any);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '14px 16px',
                  border: 'none',
                  background: 'none',
                  borderBottom: isActive ? '2.5px solid #4338CA' : '2.5px solid transparent',
                  color: isActive ? '#4338CA' : '#64748B',
                  fontWeight: isActive ? 700 : 600,
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          {activeTab === 'diagnosis' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                padding: '14px 18px',
                borderRadius: '14px',
                background: '#EEF2FF',
                border: '1px solid #C7D2FE',
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start'
              }}>
                <Sparkles size={20} color="#4338CA" style={{ flexShrink: 0, marginTop: '2px' }} />
                <p style={{ margin: 0, fontSize: '0.88rem', color: '#312E81', lineHeight: 1.5 }}>
                  <strong>Copilot Synthesis:</strong> You exhibit rare high-fidelity working memory coupled with high spatial speed. Your pattern verification loop is 2.3x faster than average, but mental context switching reveals a minor recovery lag under time pressure.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {diagnostics.map((d, i) => (
                  <div key={i} style={{
                    padding: '16px',
                    borderRadius: '14px',
                    border: '1px solid #E2E8F0',
                    background: '#FFFFFF',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0F172A' }}>{d.title}</span>
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        padding: '3px 8px',
                        borderRadius: '6px',
                        background: d.score > 85 ? '#DCFCE7' : '#FEF3C7',
                        color: d.score > 85 ? '#166534' : '#92400E'
                      }}>
                        {d.status} ({d.metric})
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.84rem', color: '#64748B', lineHeight: 1.4 }}>
                      {d.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'bottlenecks' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                padding: '16px',
                borderRadius: '14px',
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                display: 'flex',
                gap: '12px'
              }}>
                <AlertCircle size={22} color="#DC2626" style={{ flexShrink: 0 }} />
                <div>
                  <h4 style={{ margin: '0 0 4px', fontSize: '0.92rem', color: '#991B1B', fontWeight: 800 }}>Primary Vulnerability: Rule Inversion Lag</h4>
                  <p style={{ margin: 0, fontSize: '0.84rem', color: '#7F1D1D', lineHeight: 1.4 }}>
                    When task rules rapidly toggle from <em>Matching Color</em> to <em>Matching Shape</em>, your accuracy drops from 95% to 78% for the initial 2 trials.
                  </p>
                </div>
              </div>

              <div style={{
                padding: '16px',
                borderRadius: '14px',
                background: '#FFFBEB',
                border: '1px solid #FDE68A',
                display: 'flex',
                gap: '12px'
              }}>
                <Target size={22} color="#D97706" style={{ flexShrink: 0 }} />
                <div>
                  <h4 style={{ margin: '0 0 4px', fontSize: '0.92rem', color: '#92400E', fontWeight: 800 }}>Secondary Vulnerability: Over-Verification Bias</h4>
                  <p style={{ margin: 0, fontSize: '0.84rem', color: '#78350F', lineHeight: 1.4 }}>
                    On high-confidence trials, you spent 650ms re-checking already correct answers, sacrificing ~12 bonus speed points.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'drill_plan' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>
                Targeted 12-Minute Prescription to elevate your profile from <strong>{score}</strong> to <strong>90+</strong>:
              </div>

              {recommendations.map((rec, i) => (
                <div key={i} style={{
                  padding: '16px',
                  borderRadius: '14px',
                  border: '1.5px solid #E2E8F0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#F8FAFC'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        background: '#EEF2FF',
                        color: '#4338CA',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: '6px'
                      }}>
                        {rec.duration}
                      </span>
                      <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#0F172A' }}>
                        {rec.title}
                      </h4>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#64748B', marginTop: '4px' }}>
                      {rec.focus} • <strong style={{ color: '#059669' }}>{rec.impact}</strong>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      sounds.playClick();
                      if (onStartDrill) {
                        onStartDrill(rec.gameId);
                        onClose();
                      }
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 14px',
                      borderRadius: '10px',
                      background: '#4338CA',
                      color: '#FFFFFF',
                      border: 'none',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Start <ArrowRight size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px',
          background: '#F8FAFC',
          borderTop: '1px solid #E2E8F0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#64748B' }}>
            <ShieldCheck size={16} color="#059669" /> Verified by Qivora AI Cognitive Engine v2.4
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              background: '#0F172A',
              color: '#FFFFFF',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            Close Analysis
          </button>
        </div>
      </div>
    </div>
  );
};
