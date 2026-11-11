'use client';

import { PracticeSession } from '@/components/practice/PracticeSession';
import { JEE_PRACTICE } from '@/components/practice/examConfig';

export default function PracticePage() {
  return <PracticeSession config={JEE_PRACTICE} />;
}
