import React from 'react';
import { VerbalQuestion } from '../../engine/generators/verbalGenerator';

interface VerbalRendererProps {
  question: VerbalQuestion;
  selectedOptionIndex?: number | null;
  onSelectOption: (idx: number) => void;
  showExplanation?: boolean;
  isDemo?: boolean;
}

export const VerbalRenderer: React.FC<VerbalRendererProps> = ({
  question,
  selectedOptionIndex,
  onSelectOption,
  showExplanation = false,
  isDemo = false
}) => {
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
      {/* Active Subtype Pill */}
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
          color: '#7C3AED',
          background: '#EDE9FE',
          padding: '4px 14px',
          borderRadius: '20px',
          textTransform: 'uppercase',
          letterSpacing: '0.04em'
        }}>
          {question.subtypeName}
        </span>
        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B' }}>
          ⏱ {question.timeLimitSec}s Speed Limit
        </span>
      </div>

      {/* Main Prompt */}
      <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1E293B', textAlign: 'center', lineHeight: 1.5 }}>
        {question.prompt}
      </div>

      {/* Base Pair Display (for Analogies) */}
      {question.basePair && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: '#FFFFFF',
          border: '2px solid #DDD6FE',
          borderRadius: '16px',
          padding: '16px 28px',
          boxShadow: '0 4px 12px rgba(124, 58, 237, 0.08)'
        }}>
          <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#6D28D9', letterSpacing: '0.04em' }}>
            {question.basePair.left}
          </span>
          <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#C4B5FD' }}>:</span>
          <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#6D28D9', letterSpacing: '0.04em' }}>
            {question.basePair.right}
          </span>
        </div>
      )}

      {/* Context Reading Passage (for Inference) */}
      {question.contextText && (
        <div style={{
          background: '#FFFFFF',
          border: '1.5px solid #E2E8F0',
          borderRadius: '14px',
          padding: '18px 22px',
          fontSize: '0.94rem',
          color: '#334155',
          lineHeight: 1.65,
          fontStyle: 'italic',
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
        }}>
          "{question.contextText}"
        </div>
      )}

      {/* Options List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', marginTop: '4px' }}>
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
                gap: '14px',
                padding: '14px 20px',
                borderRadius: '14px',
                border: isCorrect
                  ? '2px solid #10B981'
                  : isWrong
                  ? '2px solid #EF4444'
                  : isSelected
                  ? '2px solid #7C3AED'
                  : '1.5px solid #E2E8F0',
                background: isCorrect
                  ? '#ECFDF5'
                  : isWrong
                  ? '#FEF2F2'
                  : isSelected
                  ? '#F5F3FF'
                  : '#FFFFFF',
                color: isCorrect ? '#065F46' : isWrong ? '#991B1B' : '#1E293B',
                fontWeight: 700,
                fontSize: '0.92rem',
                cursor: isDemo ? 'default' : 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
                boxShadow: isSelected ? '0 2px 8px rgba(124, 58, 237, 0.12)' : 'none'
              }}
            >
              <div style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                background: isSelected ? '#7C3AED' : '#F1F5F9',
                color: isSelected ? '#FFFFFF' : '#64748B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.8rem',
                fontWeight: 900,
                flexShrink: 0
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
          💡 <strong>Reasoning Rationale:</strong> {question.explanation}
        </div>
      )}
    </div>
  );
};
