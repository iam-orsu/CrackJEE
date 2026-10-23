import { DragToConfirm } from '@/components/ui/DragToConfirm';

interface SubmitModalProps {
  totalAnswered: number;
  total: number;
  onConfirm: () => void;
  onCancel: () => void;
}

/* Confirmation before submitting: shows what is unanswered, then a drag-to-confirm control */
export function SubmitModal({ totalAnswered, total, onConfirm, onCancel }: SubmitModalProps) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50,
    }}>
      <div style={{ background: '#fff', borderRadius: 10, padding: 28, width: 400, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1e293b', marginBottom: 12 }}>Submit Exam?</h3>
        <div style={{ fontSize: 14, color: '#475569', marginBottom: 20, lineHeight: 1.6 }}>
          You have answered <strong>{totalAnswered}</strong> of <strong>{total}</strong> questions.
          {total - totalAnswered > 0 && (
            <> <span style={{ color: '#dc2626' }}>{total - totalAnswered} question{total - totalAnswered > 1 ? 's' : ''} unanswered.</span></>
          )}
          <br />This action cannot be undone.
        </div>
        <DragToConfirm
          label="Drag to submit exam →"
          onConfirm={onConfirm}
        />
        <button
          onClick={onCancel}
          style={{ marginTop: 10, width: '100%', padding: '9px 20px', border: '1px solid #e2e8f0', borderRadius: 6, background: '#fff', color: '#64748b', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}
        >
          Go back and review
        </button>
      </div>
    </div>
  );
}
