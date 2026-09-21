import React, { useState, useEffect } from 'react';
import { MultitaskQuestion } from '../../engine/generators/multitaskGenerator';

interface MultitaskRendererProps {
  question: MultitaskQuestion;
  selectedOptionIndex?: number | null;
  onSelectOption: (idx: number) => void;
  showExplanation?: boolean;
  isDemo?: boolean;
}

export const MultitaskRenderer: React.FC<MultitaskRendererProps> = ({
  question,
  selectedOptionIndex,
  onSelectOption,
  showExplanation = false,
  isDemo = false
}) => {
  const [needlePos, setNeedlePos] = useState(question.gaugeValue);

  // Subtle gauge drift simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setNeedlePos(prev => {
        const delta = (Math.random() - 0.5) * 4;
        return Math.min(95, Math.max(5, prev + delta));
      });
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      maxWidth: '620px',
      gap: '20px',
      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif"
    }}>
      {/* Subtype Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        padding: '0 4px'
      }}>
        <span style={{
          fontSize: '0.78rem',
          fontWeight: 800,
          color: '#E11D48',
          background: '#FFE4E6',
          padding: '4px 14px',
          borderRadius: '20px',
          textTransform: 'uppercase'
        }}>
          {question.subtypeName}
        </span>
        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#E11D48', background: '#FFF1F2', padding: '3px 8px', borderRadius: '6px' }}>
          ⚡ DUAL-STREAM CHANNEL
        </span>
      </div>

      {/* Main Prompt */}
      <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#1E293B', textAlign: 'center', lineHeight: 1.5 }}>
        {question.prompt}
      </div>

      {/* Split-Screen Dual Channel Cockpit */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '14px',
        width: '100%'
      }}>
        {/* Stream 1: Reactor Dial Gauge */}
        <div style={{
          background: '#FFFFFF',
          border: '1.5px solid #E2E8F0',
          borderRadius: '16px',
          padding: '18px 16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Primary Stream: Gauge
          </span>

          {/* Semicircle Gauge Visual */}
          <div style={{ width: '100%', height: '70px', position: 'relative', overflow: 'hidden' }}>
            {/* Safe zone highlight */}
            <div style={{
              width: '100%',
              height: '14px',
              background: '#F1F5F9',
              borderRadius: '8px',
              position: 'relative',
              marginTop: '28px',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                left: `${question.targetSafeZone[0]}%`,
                width: `${question.targetSafeZone[1] - question.targetSafeZone[0]}%`,
                height: '100%',
                background: '#10B981'
              }} />
            </div>

            {/* Drifting Pointer Indicator */}
            <div style={{
              position: 'absolute',
              left: `${needlePos}%`,
              top: '16px',
              transform: 'translateX(-50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              transition: 'left 0.3s ease'
            }}>
              <div style={{ width: '4px', height: '24px', background: '#E11D48', borderRadius: '2px' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#E11D48' }} />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '0.72rem', fontWeight: 800 }}>
            <span style={{ color: '#94A3B8' }}>0% Critical</span>
            <span style={{ color: '#10B981' }}>Safe (40-65%)</span>
            <span style={{ color: '#94A3B8' }}>100% Critical</span>
          </div>
        </div>

        {/* Stream 2: Concurrent Arithmetic Verification */}
        <div style={{
          background: '#FFFFFF',
          border: '1.5px solid #E2E8F0',
          borderRadius: '16px',
          padding: '18px 16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Secondary Stream: Parity Check
          </span>

          <div style={{
            fontSize: '1.4rem',
            fontWeight: 900,
            fontFamily: 'monospace',
            color: '#1E293B',
            background: '#F8FAFC',
            padding: '8px 20px',
            borderRadius: '10px',
            border: '1px solid #E2E8F0'
          }}>
            {question.secondaryTask.question}
          </div>

          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B' }}>
            Is the resulting sum EVEN or ODD?
          </span>
        </div>
      </div>

      {/* Decision Options Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', width: '100%' }}>
        {question.options.map((opt, idx) => {
          const isSelected = selectedOptionIndex === idx;
          const isCorrect = showExplanation && idx === question.correctOptionIndex;
          const isWrong = showExplanation && isSelected && !isCorrect;

          return (
            <button
              key={idx}
              onClick={() => onSelectOption(idx)}
              disabled={isDemo}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '14px 16px',
                borderRadius: '14px',
                border: isCorrect
                  ? '2px solid #10B981'
                  : isWrong
                  ? '2px solid #EF4444'
                  : isSelected
                  ? '2px solid #E11D48'
                  : '1.5px solid #E2E8F0',
                background: isCorrect
                  ? '#ECFDF5'
                  : isWrong
                  ? '#FEF2F2'
                  : isSelected
                  ? '#FFF1F2'
                  : '#FFFFFF',
                color: isCorrect ? '#065F46' : isWrong ? '#991B1B' : '#1E293B',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: isDemo ? 'default' : 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                background: isSelected ? '#E11D48' : '#F1F5F9',
                color: isSelected ? '#FFFFFF' : '#64748B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 900
              }}>
                {String.fromCharCode(65 + idx)}
              </div>
              <span style={{ flex: 1 }}>{opt}</span>
            </button>
          );
        })}
      </div>

      {/* Explanation Box */}
      {showExplanation && (
        <div style={{
          width: '100%',
          padding: '14px 18px',
          background: '#F8FAFC',
          border: '1.5px solid #E2E8F0',
          borderRadius: '12px',
          fontSize: '0.85rem',
          color: '#475569',
          lineHeight: 1.5
        }}>
          💡 <strong>Executive Control Synthesis:</strong> {question.explanation}
        </div>
      )}
    </div>
  );
};
