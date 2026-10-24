/*
 * Fills mock paper slots from questions already in the mock-only bank, so DeepSeek is only asked for
 * the slots the bank cannot cover. Pure function: no database, so it can be unit tested.
 */

export interface SlotKey {
  subject: string;
  topic: string;
  difficulty: string;
  questionType: string;
}

export interface BankQuestion extends SlotKey {
  id: string;
}

export function slotKey(s: SlotKey): string {
  return `${s.subject}|${s.topic}|${s.difficulty}|${s.questionType}`;
}

/**
 * For each slot, in order, pick a bank question with the same key that is not excluded (already seen by
 * the student, or already used in this paper). Returns the chosen question id per slot, or null when the
 * bank cannot cover that slot.
 */
export function fillSlotsFromBank(
  slots: SlotKey[],
  bank: BankQuestion[],
  exclude: Set<string>,
  random: () => number = Math.random,
): Array<string | null> {
  const byKey = new Map<string, string[]>();
  for (const q of bank) {
    if (exclude.has(q.id)) continue;
    const key = slotKey(q);
    if (!byKey.has(key)) byKey.set(key, []);
    byKey.get(key)!.push(q.id);
  }

  const used = new Set<string>();
  return slots.map((slot) => {
    const candidates = (byKey.get(slotKey(slot)) ?? []).filter((id) => !used.has(id));
    if (candidates.length === 0) return null;
    const chosen = candidates[Math.floor(random() * candidates.length)]!;
    used.add(chosen);
    return chosen;
  });
}
