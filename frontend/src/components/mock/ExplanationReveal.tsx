import { useState } from 'react';
import { MathText } from '@/lib/math';
import { api } from '@/lib/api';

/*
 * Explanation for one question of a submitted mock. Nothing is written until the student asks; the first
 * request writes it, and the server saves it, so later views load instantly.
 */
export function ExplanationReveal({ examId, mockQuestionId }: { examId: string; mockQuestionId: string }) {
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [text, setText] = useState('');

  async function reveal() {
    setState('loading');
    try {
      const res = await api.mock.explanation(examId, mockQuestionId);
      setText(res.explanation);
      setState('done');
    } catch {
      setState('error');
    }
  }

  if (state === 'done') {
    return (
      <div style={{
        padding: '14px 16px', background: '#fffbeb', border: '1px solid #fde68a',
        borderRadius: 6, fontSize: 13, color: '#92400e', lineHeight: 1.7,
      }}>
        <div style={{ fontWeight: 700, marginBottom: 6, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Explanation</div>
        <MathText text={text} />
      </div>
    );
  }

  if (state === 'loading') {
    return (
      <div className="explain-loading" role="status" aria-live="polite">
        <span className="explain-sparkles" aria-hidden="true">✦ ✧ ✦</span>
        <span>Writing your explanation…</span>
      </div>
    );
  }

  return (
    <div>
      <button type="button" className="explain-btn" onClick={reveal}>✨ Show explanation</button>
      {state === 'error' && (
        <p style={{ fontSize: 12, color: '#dc2626', marginTop: 6 }}>Could not load the explanation. Please try again.</p>
      )}
    </div>
  );
}
