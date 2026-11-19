/*
 * Fills mock paper slots from questions already in the mock-only bank, so DeepSeek is only asked for
 * the slots the bank cannot cover. Pure function: no database, so it can be unit tested.
 */

export interface SlotKey {
  subject: string;
  topic: string;
  difficulty: string;
  questionType: string;
  requiresDiagram?: boolean;
}

export interface BankQuestion extends SlotKey {
  id: string;
  questionText?: string;
  diagram?: unknown;
}

export function normalizeQuestionText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 120);
}

export function slotKey(s: SlotKey): string {
  return `${s.subject}|${s.topic}|${s.difficulty}|${s.questionType}`;
}

/**
 * For each slot, in order, pick a bank question with the same key that is not excluded (already seen by
 * the student by ID or text, or already used in this paper). If requiresDiagram is true, only pick bank questions with
 * diagram != null. Returns the chosen question id per slot, or null when the bank cannot cover that slot.
 */
export function fillSlotsFromBank(
  slots: SlotKey[],
  bank: BankQuestion[],
  exclude: Set<string>,
  random: () => number = Math.random,
  excludeTexts?: Set<string>,
): Array<string | null> {
  const byKey = new Map<string, Array<{ id: string; hasDiagram: boolean; normText: string }>>();
  for (const q of bank) {
    if (exclude.has(q.id)) continue;
    const norm = q.questionText ? normalizeQuestionText(q.questionText) : '';
    if (norm && excludeTexts && excludeTexts.has(norm)) continue;
    const key = slotKey(q);
    if (!byKey.has(key)) byKey.set(key, []);
    const hasDiagram = q.diagram !== null && q.diagram !== undefined;
    byKey.get(key)!.push({ id: q.id, hasDiagram, normText: norm });
  }

  const used = new Set<string>();
  const usedTexts = new Set<string>();
  return slots.map((slot) => {
    const key = slotKey(slot);
    const allCandidates = (byKey.get(key) ?? []).filter(
      (item) => !used.has(item.id) && (!item.normText || !usedTexts.has(item.normText)),
    );
    let candidates = allCandidates;

    if (slot.requiresDiagram) {
      candidates = allCandidates.filter((item) => item.hasDiagram);
    } else {
      // If the slot doesn't require a diagram, prefer non-diagram questions so diagram questions stay available for slots that do
      const nonDiagram = allCandidates.filter((item) => !item.hasDiagram);
      if (nonDiagram.length > 0) {
        candidates = nonDiagram;
      }
    }

    if (candidates.length === 0) return null;
    const chosen = candidates[Math.floor(random() * candidates.length)]!;
    used.add(chosen.id);
    if (chosen.normText) usedTexts.add(chosen.normText);
    return chosen.id;
  });
}

export interface PracticeSlotRequest extends SlotKey {
  bankExamType: string;
}

export interface PracticePoolCandidate extends SlotKey {
  id: string;
  examType: string;
}

/**
 * Index-aligned fallback matcher for non-mock practice bank questions.
 * Tries exact match first and progressively relaxes questionType -> difficulty -> examType -> topic
 * within the same subject so missing slots can be covered without N+1 DB queries or positional drift.
 */
export function fillPracticeSlotsWithFallbacks<T extends PracticePoolCandidate>(
  slots: PracticeSlotRequest[],
  pool: T[],
  exclude: Set<string>,
  random: () => number = Math.random,
): Array<T | null> {
  const bySubject = new Map<string, T[]>();
  for (const q of pool) {
    if (exclude.has(q.id)) continue;
    let list = bySubject.get(q.subject);
    if (!list) {
      list = [];
      bySubject.set(q.subject, list);
    }
    list.push(q);
  }

  const used = new Set<string>();
  return slots.map((slot) => {
    const subjectPool = (bySubject.get(slot.subject) ?? []).filter((q) => !used.has(q.id));
    if (subjectPool.length === 0) return null;

    const tiers: Array<(q: T) => boolean> = [
      (q) => q.topic === slot.topic && q.difficulty === slot.difficulty && q.examType === slot.bankExamType && q.questionType === slot.questionType,
      (q) => q.topic === slot.topic && q.difficulty === slot.difficulty && q.examType === slot.bankExamType,
      (q) => q.topic === slot.topic && q.examType === slot.bankExamType,
      (q) => q.topic === slot.topic,
      (q) => q.difficulty === slot.difficulty && q.examType === slot.bankExamType,
      () => true,
    ];

    for (const matches of tiers) {
      const candidates = subjectPool.filter(matches);
      if (candidates.length > 0) {
        const chosen = candidates[Math.floor(random() * candidates.length)]!;
        used.add(chosen.id);
        return chosen;
      }
    }
    return null;
  });
}
