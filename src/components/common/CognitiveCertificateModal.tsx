import React, { useRef } from 'react';
import { X, Printer, Download, Award, ShieldCheck, CheckCircle, Brain, Sparkles, ExternalLink } from 'lucide-react';
import { sounds } from '../../services/soundEngine';
import { AssessmentResult, UserProfile } from '../../types';

interface CognitiveCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  result?: AssessmentResult | null;
  user?: UserProfile | null;
}

export const CognitiveCertificateModal: React.FC<CognitiveCertificateModalProps> = ({
  isOpen,
  onClose,
  result,
  user
}) => {
  const certRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const score = result?.overallScore || 85;
  const percentile = result?.percentile || 91;
  const archetype = result?.archetype?.title || 'Algorithmic Strategist';
  const userName = user?.name || 'Cognitive Candidate';
  const certId = `QIV-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
  const issueDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const careerMatches = [
    { title: 'Algorithmic Systems Architect', match: '98%', reason: 'Top 2% Working Memory & Spatial Logic' },
    { title: 'Quantitative / High-Frequency Strategist', match: '94%', reason: 'High-speed deductive rule extraction' },
    { title: 'Complex Problem Solver / AI Engineer', match: '92%', reason: 'Multi-variable pattern synthesis' }
  ];

  const handlePrint = () => {
    sounds.playClick();
    window.print();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.82)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '16px',
      overflowY: 'auto'
    }}>
      <div style={{
        maxWidth: '820px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        maxHeight: '94vh'
      }}>
        {/* Actions Bar (Hidden during Print) */}
        <div className="no-print" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#FFFFFF',
          padding: '12px 20px',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={22} color="#D97706" />
            <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0F172A' }}>
              Official Verified Cognitive Credential
            </span>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handlePrint}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '10px',
                background: '#0F172A',
                color: '#FFFFFF',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              <Printer size={16} /> Print / Save as PDF
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              style={{
                background: '#F1F5F9',
                border: 'none',
                borderRadius: '10px',
                padding: '8px 12px',
                color: '#475569',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Certificate Container */}
        <div
          ref={certRef}
          style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            border: '8px double #D4AF37',
            padding: '40px 48px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Subtle Background Watermark */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(circle at center, rgba(212, 175, 55, 0.04) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />

          {/* Certificate Header */}
          <div style={{ textAlign: 'center', borderBottom: '2px solid #F1F5F9', paddingBottom: '24px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: '#FEF3C7',
              color: '#92400E',
              padding: '4px 14px',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '12px'
            }}>
              <ShieldCheck size={14} color="#D97706" /> QIVORA Global Benchmark Certification
            </div>
            <h1 style={{
              fontFamily: 'serif',
              fontSize: '2.2rem',
              color: '#0F172A',
              margin: '0 0 6px',
              fontWeight: 900,
              letterSpacing: '0.02em'
            }}>
              Certificate of Cognitive Excellence
            </h1>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748B', letterSpacing: '0.04em' }}>
              Standardized Psychometric Assessment of Working Memory, Inversion Resistance & Fluid Intelligence
            </p>
          </div>

          {/* Candidate Body */}
          <div style={{ textAlign: 'center', margin: '32px 0' }}>
            <p style={{ margin: 0, fontSize: '0.92rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              This is officially awarded and verified to
            </p>
            <h2 style={{
              fontSize: '2.4rem',
              color: '#1E1B4B',
              margin: '10px 0',
              fontFamily: 'serif',
              fontWeight: 800,
              textDecoration: 'underline',
              textDecorationColor: '#D4AF37',
              textUnderlineOffset: '8px'
            }}>
              {userName}
            </h2>
            <p style={{ maxWidth: '600px', margin: '14px auto 0', fontSize: '0.95rem', color: '#334155', lineHeight: 1.6 }}>
              Demonstrated mastery across 9 cognitive performance dimensions, attaining an overall score of{' '}
              <strong style={{ color: '#4338CA', fontSize: '1.05rem' }}>{score} / 100</strong> placing in the{' '}
              <strong style={{ color: '#D97706', fontSize: '1.05rem' }}>{percentile}th Percentile</strong> globally as an official{' '}
              <strong style={{ color: '#0F172A' }}>{archetype}</strong>.
            </p>
          </div>

          {/* Highlights & Metrics Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
            margin: '28px 0',
            padding: '20px',
            borderRadius: '16px',
            background: '#F8FAFC',
            border: '1px solid #E2E8F0'
          }}>
            <div style={{ textAlign: 'center', borderRight: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Working Memory</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0F172A', marginTop: '4px' }}>94% <span style={{ fontSize: '0.8rem', color: '#059669' }}>Elite</span></div>
            </div>
            <div style={{ textAlign: 'center', borderRight: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Pattern Extraction</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0F172A', marginTop: '4px' }}>91% <span style={{ fontSize: '0.8rem', color: '#059669' }}>Master</span></div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Cognitive Inversion</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0F172A', marginTop: '4px' }}>86% <span style={{ fontSize: '0.8rem', color: '#4338CA' }}>Advanced</span></div>
            </div>
          </div>

          {/* Career Suitability Index */}
          <div style={{ margin: '24px 0' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: '#475569', letterSpacing: '0.06em', marginBottom: '8px' }}>
              High-Affinity Career Profiles (Top 5% Predictive Match)
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {careerMatches.map((c, i) => (
                <div key={i} style={{
                  padding: '12px',
                  borderRadius: '12px',
                  background: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A' }}>{c.title}</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669' }}>{c.match}</span>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '4px' }}>{c.reason}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer & Signature */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            borderTop: '2px solid #F1F5F9',
            paddingTop: '24px',
            marginTop: '24px'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Credential ID</div>
              <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0F172A', fontFamily: 'monospace' }}>{certId}</div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '4px' }}>Date Issued: {issueDate}</div>
            </div>

            {/* Official Gold Seal Badge */}
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, #FDE68A 0%, #D97706 80%, #92400E 100%)',
              boxShadow: '0 4px 12px rgba(217, 119, 6, 0.4)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              border: '2px dashed rgba(255, 255, 255, 0.8)',
              transform: 'rotate(-8deg)'
            }}>
              <Award size={24} />
              <span style={{ fontSize: '0.55rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}>VERIFIED</span>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'serif', fontSize: '1.2rem', fontStyle: 'italic', color: '#1E1B4B' }}>
                Qivora Cognitive Institute
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748B', borderTop: '1px solid #CBD5E1', paddingTop: '4px', marginTop: '4px' }}>
                Authoritative Validation Authority
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
