import { DragToConfirm } from '@/components/ui/DragToConfirm';
import { EX } from './examTheme';

interface SubmitModalProps {
  totalAnswered: number;
  total: number;
  onConfirm: () => void;
  onCancel: () => void;
}

/* Confirmation before submitting: shows what is unanswered, then a drag-to-confirm control */
export function SubmitModal({ totalAnswered, total, onConfirm, onCancel }: SubmitModalProps) {
  const unanswered = total - totalAnswered;
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(20, 28, 40, 0.55)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 20,
    }}>
      <div style={{
        background: EX.paper, borderRadius: 4, padding: '22px 24px 20px',
        width: 420, maxWidth: '100%', border: `1px solid ${EX.line}`,
        borderTop: `3px solid ${EX.accent}`, boxShadow: '0 24px 64px rgba(15, 23, 42, 0.25)',
      }}>
        <div style={{
          fontSize: 9.5, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase',
          color: EX.mute, marginBottom: 6,
        }}>
          Examination
        </div>
        <h3 style={{ fontSize: 17, fontWeight: 700, color: EX.ink, margin: '0 0 10px' }}>Submit exam?</h3>
        <div style={{ fontSize: 13.5, color: EX.ink2, marginBottom: 20, lineHeight: 1.6 }}>
          You have answered <strong>{totalAnswered}</strong> of <strong>{total}</strong> questions.
          {unanswered > 0 && (
            <> <span style={{ color: EX.danger }}>{unanswered} question{unanswered > 1 ? 's' : ''} unanswered.</span></>
          )}
          <br />This action cannot be undone.
        </div>
        <DragToConfirm
          label="Slide to submit exam"
          onConfirm={onConfirm}
        />
        <button
          onClick={onCancel}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#F7F9FC'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = EX.paper; }}
          style={{
            marginTop: 10, width: '100%', padding: '9px 20px', border: `1px solid ${EX.line}`,
            borderRadius: 3, background: EX.paper, color: EX.ink2, fontSize: 13, fontWeight: 600, cursor: 'pointer',
          }}
        >
          Go back and review
        </button>
      </div>
    </div>
  );
}