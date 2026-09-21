import React, { useState, useEffect } from 'react';
import { X, Flame, Calendar, Sparkles, CheckCircle2, Play, Trophy, Clock, Zap, Star } from 'lucide-react';
import { sounds } from '../../services/soundEngine';

interface DailyWorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartDailyChallenge: (gameId: string) => void;
}

export const DailyWorkoutModal: React.FC<DailyWorkoutModalProps> = ({
  isOpen,
  onClose,
  onStartDailyChallenge
}) => {
  const [streak, setStreak] = useState(5);
  const [completedToday, setCompletedToday] = useState(false);

  useEffect(() => {
    try {
      const savedStreak = localStorage.getItem('qivora_daily_streak');
      if (savedStreak) setStreak(parseInt(savedStreak, 10));
      const todayDone = localStorage.getItem(`qivora_daily_done_${new Date().toISOString().slice(0, 10)}`);
      if (todayDone === 'true') setCompletedToday(true);
    } catch {}
  }, []);

  if (!isOpen) return null;

  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  const dailyDrills = [
    {
      id: 'switch',
      title: 'Drill 1: Rule Inversion Flash',
      duration: '60s',
      focus: 'Cognitive Inversion Speed',
      xp: 150,
      icon: Zap,
      color: '#4F46E5',
      done: completedToday
    },
    {
      id: 'grid',
      title: 'Drill 2: Visual Grid Span',
      duration: '90s',
      focus: 'Working Memory Retention',
      xp: 200,
      icon: Star,
      color: '#059669',
      done: completedToday
    },
    {
      id: 'inductive',
      title: 'Drill 3: Pattern Elimination',
      duration: '90s',
      focus: 'Inductive Hypothesis Testing',
      xp: 250,
      icon: Sparkles,
      color: '#D97706',
      done: completedToday
    }
  ];

  // Generate 84 days (12 weeks) of activity heatmap
  const generateHeatmapDays = () => {
    const days = [];
    for (let i = 83; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      // Deterministic activity based on day number
      const dayNum = d.getDate();
      const intensity = (dayNum % 7 === 0 || dayNum % 5 === 0) ? (dayNum % 4) + 1 : (dayNum % 3 === 0 ? 1 : 0);
      days.push({
        date: d.toISOString().slice(0, 10),
        intensity: i === 0 && completedToday ? 3 : intensity
      });
    }
    return days;
  };

  const heatmap = generateHeatmapDays();

  const getCellColor = (intensity: number) => {
    switch (intensity) {
      case 1: return '#BBF7D0';
      case 2: return '#4ADE80';
      case 3: return '#16A34A';
      case 4: return '#15803D';
      default: return '#F1F5F9';
    }
  };

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
        maxHeight: '92vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #7C2D12 0%, #C2410C 50%, #EA580C 100%)',
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
              background: 'rgba(255, 255, 255, 0.2)',
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

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.25)',
                padding: '12px',
                borderRadius: '16px',
                display: 'flex'
              }}>
                <Flame size={28} color="#FEF08A" />
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#FED7AA', fontWeight: 700, textTransform: 'uppercase' }}>
                  {todayStr}
                </div>
                <h2 style={{ margin: '2px 0 0', fontSize: '1.4rem', fontWeight: 800 }}>
                  Daily Cognitive Workout
                </h2>
              </div>
            </div>

            <div style={{
              background: 'rgba(0, 0, 0, 0.25)',
              padding: '10px 16px',
              borderRadius: '14px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              textAlign: 'center',
              marginRight: '36px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
                <Flame size={20} color="#FDE047" />
                <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#FFFFFF' }}>{streak}</span>
              </div>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#FED7AA', textTransform: 'uppercase' }}>
                Day Streak 🔥
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          {/* Today's 3-Drill Protocol */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px'
            }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: '#475569' }}>
                Today's Curated Drills (Total ~4 Mins)
              </span>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#EA580C' }}>
                +600 Bonus XP on completion
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {dailyDrills.map((drill, idx) => {
                const Icon = drill.icon;
                return (
                  <div key={idx} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 18px',
                    borderRadius: '14px',
                    border: '1.5px solid #E2E8F0',
                    background: '#F8FAFC'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        background: drill.color,
                        padding: '8px',
                        borderRadius: '10px',
                        display: 'flex',
                        color: '#FFFFFF'
                      }}>
                        <Icon size={18} />
                      </div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#0F172A' }}>
                          {drill.title}
                        </h4>
                        <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '2px' }}>
                          {drill.focus} • <strong style={{ color: '#D97706' }}>+{drill.xp} XP</strong>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        sounds.playClick();
                        onStartDailyChallenge(drill.id);
                        onClose();
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 16px',
                        borderRadius: '10px',
                        background: '#0F172A',
                        color: '#FFFFFF',
                        border: 'none',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      <Play size={14} /> Start Drill
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 90-Day Activity Heatmap */}
          <div style={{
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '16px',
            padding: '18px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={16} color="#64748B" />
                <span style={{ fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', color: '#475569' }}>
                  12-Week Cognitive Habit Heatmap
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: '#64748B' }}>
                <span>Less</span>
                {[0, 1, 2, 3, 4].map(int => (
                  <div key={int} style={{ width: '10px', height: '10px', borderRadius: '2px', background: getCellColor(int) }} />
                ))}
                <span>More</span>
              </div>
            </div>

            {/* Grid display */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(12, 1fr)',
              gridAutoFlow: 'column',
              gridTemplateRows: 'repeat(7, 1fr)',
              gap: '4px',
              overflowX: 'auto',
              paddingBottom: '4px'
            }}>
              {heatmap.map((cell, i) => (
                <div
                  key={i}
                  title={`${cell.date}: Level ${cell.intensity} activity`}
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '3px',
                    backgroundColor: getCellColor(cell.intensity),
                    transition: 'transform 0.1s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.3)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                />
              ))}
            </div>
          </div>
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
          <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
            Daily drills reset every midnight UTC.
          </span>
          <button
            onClick={() => {
              sounds.playClick();
              onStartDailyChallenge('switch');
              onClose();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #EA580C, #C2410C)',
              color: '#FFFFFF',
              border: 'none',
              fontWeight: 800,
              fontSize: '0.88rem',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(234, 88, 12, 0.3)'
            }}
          >
            <Flame size={16} /> Complete Full Daily Set
          </button>
        </div>
      </div>
    </div>
  );
};
