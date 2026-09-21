import React, { useEffect } from 'react';
import { X, Command, Zap, Play, RotateCcw, HelpCircle, CheckCircle } from 'lucide-react';
import { sounds } from '../../services/soundEngine';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const shortcuts = [
    {
      category: 'In-Game Selection & Choices',
      items: [
        { keys: ['1', '2', '3', '4'], desc: 'Select options A, B, C, D instantly without clicking' },
        { keys: ['Space', 'Enter'], desc: 'Lock answer / Submit current choice' },
        { keys: ['Arrow Keys'], desc: 'Navigate spatial grids & inductive puzzle candidate cells' },
      ]
    },
    {
      category: 'Speed & Flow Navigation',
      items: [
        { keys: ['R'], desc: 'Instant Restart / Reset current practice round' },
        { keys: ['Esc'], desc: 'Pause game / Close active overlays & modals' },
        { keys: ['?'], desc: 'Toggle this Pro Shortcuts Cheat Sheet anytime' },
        { keys: ['M'], desc: 'Toggle sound effects Mute / Unmute' },
      ]
    },
    {
      category: '1v1 Ghost Duel & Assessments',
      items: [
        { keys: ['Tab'], desc: 'Cycle focus across active interactive inputs' },
        { keys: ['Shift', 'Enter'], desc: 'Force fast-forward to next battery assessment game' },
      ]
    }
  ];

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '16px'
    }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: '20px',
        maxWidth: '640px',
        width: '100%',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: '1.5px solid #E2E8F0',
        overflow: 'hidden',
        animation: 'fadeIn 0.2s ease-out'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          color: '#FFFFFF',
          padding: '20px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #F59E0B, #D97706)',
              padding: '8px',
              borderRadius: '10px',
              display: 'flex'
            }}>
              <Command size={20} color="#FFFFFF" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>Pro-Gamer Keyboard Shortcuts</h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#94A3B8' }}>Zero-latency keyboard controls for maximum APM</p>
            </div>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '8px',
              padding: '6px',
              color: '#FFFFFF',
              cursor: 'pointer'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Shortcuts List */}
        <div style={{ padding: '24px', maxHeight: '65vh', overflowY: 'auto' }}>
          {shortcuts.map((sec, idx) => (
            <div key={idx} style={{ marginBottom: idx < shortcuts.length - 1 ? '20px' : '0' }}>
              <div style={{
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                fontWeight: 800,
                letterSpacing: '0.06em',
                color: '#64748B',
                marginBottom: '10px'
              }}>
                {sec.category}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {sec.items.map((item, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0'
                  }}>
                    <span style={{ fontSize: '0.88rem', color: '#334155', fontWeight: 500 }}>
                      {item.desc}
                    </span>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      {item.keys.map((k, kIdx) => (
                        <kbd key={kIdx} style={{
                          background: '#FFFFFF',
                          border: '1.5px solid #CBD5E1',
                          boxShadow: '0 2px 0 #94A3B8',
                          borderRadius: '6px',
                          padding: '3px 8px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: '#0F172A',
                          fontFamily: 'monospace'
                        }}>
                          {k}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Quick Tip */}
          <div style={{
            marginTop: '20px',
            padding: '12px 16px',
            background: '#FEF3C7',
            border: '1px solid #FDE68A',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <Zap size={18} color="#D97706" style={{ flexShrink: 0 }} />
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#92400E', lineHeight: 1.4 }}>
              <strong>Speed Advantage:</strong> Players using hotkeys complete Switch & Inductive rounds <strong>38% faster</strong> on average compared to mouse clicks.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px',
          background: '#F8FAFC',
          borderTop: '1px solid #E2E8F0',
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
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
            Got it, Let's Play (Esc)
          </button>
        </div>
      </div>
    </div>
  );
};
