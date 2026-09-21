import React from 'react';
import { DataQuestion } from '../../engine/generators/dataGenerator';

interface DataRendererProps {
  question: DataQuestion;
  selectedOptionIndex?: number | null;
  onSelectOption: (idx: number) => void;
  showExplanation?: boolean;
  isDemo?: boolean;
}

export const DataRenderer: React.FC<DataRendererProps> = ({
  question,
  selectedOptionIndex,
  onSelectOption,
  showExplanation = false,
  isDemo = false
}) => {
  const maxVal = Math.max(...question.dataPoints.map(d => Math.max(d.valueA, d.valueB || 0)), 100);

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
          color: '#D97706',
          background: '#FEF3C7',
          padding: '4px 14px',
          borderRadius: '20px',
          textTransform: 'uppercase'
        }}>
          {question.subtypeName}
        </span>
        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B' }}>
          {question.metricUnit}
        </span>
      </div>

      {/* Main Prompt */}
      <div style={{ fontSize: '1.02rem', fontWeight: 800, color: '#1E293B', textAlign: 'center', lineHeight: 1.5 }}>
        {question.prompt}
      </div>

      {/* Visual Chart Card */}
      <div style={{
        width: '100%',
        background: '#FFFFFF',
        border: '1.5px solid #E2E8F0',
        borderRadius: '16px',
        padding: '20px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
        boxSizing: 'border-box'
      }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#475569', marginBottom: '16px', textAlign: 'center' }}>
          {question.title}
        </div>

        {question.chartType === 'bar' ? (
          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', height: '160px', paddingBottom: '20px', borderBottom: '1.5px solid #E2E8F0' }}>
            {question.dataPoints.map((pt, i) => {
              const hA = (pt.valueA / maxVal) * 130;
              const hB = pt.valueB ? (pt.valueB / maxVal) * 130 : 0;

              return (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '130px' }}>
                    {/* Bar A (Revenue) */}
                    <div style={{
                      width: '24px',
                      height: `${hA}px`,
                      background: '#3B82F6',
                      borderRadius: '4px 4px 0 0',
                      position: 'relative'
                    }}>
                      <span style={{ position: 'absolute', top: '-16px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.68rem', fontWeight: 800, color: '#1E40AF' }}>
                        {pt.valueA}
                      </span>
                    </div>

                    {/* Bar B (Cost) */}
                    {pt.valueB !== undefined && (
                      <div style={{
                        width: '24px',
                        height: `${hB}px`,
                        background: '#94A3B8',
                        borderRadius: '4px 4px 0 0',
                        position: 'relative'
                      }}>
                        <span style={{ position: 'absolute', top: '-16px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.68rem', fontWeight: 800, color: '#475569' }}>
                          {pt.valueB}
                        </span>
                      </div>
                    )}
                  </div>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#334155' }}>{pt.label}</span>
                </div>
              );
            })}
          </div>
        ) : (
          /* Table View */
          <div style={{ width: '100%', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1.5px solid #E2E8F0', color: '#475569' }}>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Cohort / Dept</th>
                  <th style={{ padding: '10px', textAlign: 'right' }}>Budget ($k)</th>
                  <th style={{ padding: '10px', textAlign: 'right' }}>Headcount</th>
                </tr>
              </thead>
              <tbody>
                {question.dataPoints.map((pt, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '10px', fontWeight: 700, color: '#1E293B' }}>{pt.label}</td>
                    <td style={{ padding: '10px', textAlign: 'right', fontWeight: 800, color: '#2563EB' }}>${pt.valueA}k</td>
                    <td style={{ padding: '10px', textAlign: 'right', fontWeight: 800, color: '#64748B' }}>{pt.valueB}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Legend */}
        {question.chartType === 'bar' && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '14px', fontSize: '0.75rem', fontWeight: 700 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '12px', height: '12px', background: '#3B82F6', borderRadius: '3px' }} />
              <span>Revenue ($M)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '12px', height: '12px', background: '#94A3B8', borderRadius: '3px' }} />
              <span>Cost ($M)</span>
            </div>
          </div>
        )}
      </div>

      {/* Options Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px', width: '100%' }}>
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
                gap: '12px',
                padding: '14px 18px',
                borderRadius: '14px',
                border: isCorrect
                  ? '2px solid #10B981'
                  : isWrong
                  ? '2px solid #EF4444'
                  : isSelected
                  ? '2px solid #D97706'
                  : '1.5px solid #E2E8F0',
                background: isCorrect
                  ? '#ECFDF5'
                  : isWrong
                  ? '#FEF2F2'
                  : isSelected
                  ? '#FFFBEB'
                  : '#FFFFFF',
                color: isCorrect ? '#065F46' : isWrong ? '#991B1B' : '#1E293B',
                fontWeight: 800,
                fontSize: '0.92rem',
                cursor: isDemo ? 'default' : 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: isSelected ? '#D97706' : '#F1F5F9',
                color: isSelected ? '#FFFFFF' : '#64748B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.78rem',
                fontWeight: 900
              }}>
                {String.fromCharCode(65 + idx)}
              </div>
              <span style={{ flex: 1, textAlign: 'left' }}>{opt}</span>
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
          💡 <strong>Data Synthesis Rationale:</strong> {question.explanation}
        </div>
      )}
    </div>
  );
};
