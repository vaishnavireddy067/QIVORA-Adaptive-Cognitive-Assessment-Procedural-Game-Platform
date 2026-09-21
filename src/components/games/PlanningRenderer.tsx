import React from 'react';
import { PlanningQuestion } from '../../engine/generators/planningGenerator';

interface PlanningRendererProps {
  question: PlanningQuestion;
  selectedOptionIndex?: number | null;
  onSelectOption: (idx: number) => void;
  showExplanation?: boolean;
  isDemo?: boolean;
}

export const PlanningRenderer: React.FC<PlanningRendererProps> = ({
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
          color: '#0891B2',
          background: '#CFFAFE',
          padding: '4px 14px',
          borderRadius: '20px',
          textTransform: 'uppercase'
        }}>
          {question.subtypeName}
        </span>
        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B' }}>
          LEVEL {question.level} OF 5
        </span>
      </div>

      {/* Main Prompt */}
      <div style={{ fontSize: '1.02rem', fontWeight: 800, color: '#1E293B', textAlign: 'center', lineHeight: 1.5 }}>
        {question.prompt}
      </div>

      {/* Interactive Network Graph Canvas (for Route Planning) */}
      {question.nodes && question.edges && (
        <div style={{
          width: '100%',
          height: '240px',
          background: '#FFFFFF',
          border: '1.5px solid #E2E8F0',
          borderRadius: '16px',
          position: 'relative',
          boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
          overflow: 'hidden'
        }}>
          <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
            {/* Draw Edges with cost badges */}
            {question.edges.map((edge, i) => {
              const nodeFrom = question.nodes!.find(n => n.id === edge.from)!;
              const nodeTo = question.nodes!.find(n => n.id === edge.to)!;
              const midX = (nodeFrom.x + nodeTo.x) / 2;
              const midY = (nodeFrom.y + nodeTo.y) / 2;

              return (
                <g key={i}>
                  <line
                    x1={`${nodeFrom.x}%`}
                    y1={`${nodeFrom.y}%`}
                    x2={`${nodeTo.x}%`}
                    y2={`${nodeTo.y}%`}
                    stroke="#94A3B8"
                    strokeWidth="2.5"
                    strokeDasharray="4 3"
                  />
                  {/* Cost badge */}
                  <rect
                    x={`calc(${midX}% - 14px)`}
                    y={`calc(${midY}% - 10px)`}
                    width="28"
                    height="20"
                    rx="6"
                    fill="#1E293B"
                  />
                  <text
                    x={`${midX}%`}
                    y={`calc(${midY}% + 4px)`}
                    fill="#FFFFFF"
                    fontSize="11"
                    fontWeight="800"
                    textAnchor="middle"
                  >
                    {edge.cost}
                  </text>
                </g>
              );
            })}

            {/* Draw Nodes */}
            {question.nodes.map((node) => {
              const isStart = node.id === question.startNodeId;
              const isGoal = node.id === question.targetNodeId;

              return (
                <g key={node.id}>
                  <circle
                    cx={`${node.x}%`}
                    cy={`${node.y}%`}
                    r={isStart || isGoal ? '18' : '14'}
                    fill={isStart ? '#10B981' : isGoal ? '#F97316' : '#0891B2'}
                    stroke="#FFFFFF"
                    strokeWidth="3"
                    style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))' }}
                  />
                  <text
                    x={`${node.x}%`}
                    y={`calc(${node.y}% + 4px)`}
                    fill="#FFFFFF"
                    fontSize="12"
                    fontWeight="900"
                    textAnchor="middle"
                  >
                    {node.id}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      )}

      {/* Options Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', width: '100%' }}>
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
                justifyContent: 'center',
                padding: '14px 18px',
                borderRadius: '14px',
                border: isCorrect
                  ? '2px solid #10B981'
                  : isWrong
                  ? '2px solid #EF4444'
                  : isSelected
                  ? '2px solid #0891B2'
                  : '1.5px solid #E2E8F0',
                background: isCorrect
                  ? '#ECFDF5'
                  : isWrong
                  ? '#FEF2F2'
                  : isSelected
                  ? '#ECFEFF'
                  : '#FFFFFF',
                color: isCorrect ? '#065F46' : isWrong ? '#991B1B' : '#1E293B',
                fontWeight: 800,
                fontSize: '1rem',
                cursor: isDemo ? 'default' : 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: isSelected ? '0 2px 8px rgba(8, 145, 178, 0.15)' : 'none'
              }}
            >
              Option {String.fromCharCode(65 + idx)}: {opt}
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
          💡 <strong>Optimal Plan Rationale:</strong> {question.explanation}
        </div>
      )}
    </div>
  );
};
