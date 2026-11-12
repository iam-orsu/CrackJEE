'use client';

import { PracticeSession } from '@/components/practice/PracticeSession';
import { NEET_PRACTICE } from '@/components/practice/examConfig';

export default function NEETPracticePage() {
  return <PracticeSession config={NEET_PRACTICE} />;
}
