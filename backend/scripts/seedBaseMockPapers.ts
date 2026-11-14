import { loadDotEnv } from '../src/config/env';
loadDotEnv();

import { prisma } from '../src/config/database';

async function seedBasePapers() {
  console.log('Seeding progressive Base Mock Papers for JEE Main, JEE Advanced, and NEET...');

  const usedQuestionIds = new Set<string>();

  // 1. JEE Main: 5 papers (75 questions each: 25 Physics, 25 Chemistry, 25 Mathematics)
  console.log('Generating JEE Main Base Papers...');
  for (let paperNum = 1; paperNum <= 5; paperNum++) {
    const paperQuestions: string[] = [];

    for (const subject of ['Physics', 'Chemistry', 'Mathematics']) {
      // 20 mcq_single
      const singles = await prisma.question.findMany({
        where: {
          subject,
          questionType: 'mcq_single',
          id: { notIn: Array.from(usedQuestionIds) },
        },
        take: 20,
        select: { id: true },
      });
      for (const q of singles) {
        paperQuestions.push(q.id);
        usedQuestionIds.add(q.id);
      }

      // 5 integer
      const integers = await prisma.question.findMany({
        where: {
          subject,
          questionType: 'integer',
          id: { notIn: Array.from(usedQuestionIds) },
        },
        take: 5,
        select: { id: true },
      });
      for (const q of integers) {
        paperQuestions.push(q.id);
        usedQuestionIds.add(q.id);
      }
    }

    if (paperQuestions.length === 75) {
      await prisma.baseMockPaper.upsert({
        where: { examType_paperNumber: { examType: 'Main', paperNumber: paperNum } },
        update: {
          title: `JEE Main Official Base Paper #${paperNum}`,
          totalQuestions: 75,
          questionIds: paperQuestions,
        },
        create: {
          paperNumber: paperNum,
          examType: 'Main',
          title: `JEE Main Official Base Paper #${paperNum}`,
          totalQuestions: 75,
          questionIds: paperQuestions,
        },
      });
      console.log(`✓ JEE Main Base Paper #${paperNum} created with 75 questions.`);
    } else {
      console.error(`Failed to assemble 75 questions for JEE Main Paper #${paperNum} (got ${paperQuestions.length})`);
    }
  }

  // 2. JEE Advanced: 5 papers (51 questions each: 17 Physics, 17 Chemistry, 17 Mathematics)
  console.log('Generating JEE Advanced Base Papers...');
  for (let paperNum = 1; paperNum <= 5; paperNum++) {
    const paperQuestions: string[] = [];

    for (const subject of ['Physics', 'Chemistry', 'Mathematics']) {
      // 7 mcq_single
      const singles = await prisma.question.findMany({
        where: {
          subject,
          questionType: 'mcq_single',
          id: { notIn: Array.from(usedQuestionIds) },
        },
        take: 7,
        select: { id: true },
      });
      for (const q of singles) {
        paperQuestions.push(q.id);
        usedQuestionIds.add(q.id);
      }

      // 4 mcq_multi
      const multis = await prisma.question.findMany({
        where: {
          subject,
          questionType: 'mcq_multi',
          id: { notIn: Array.from(usedQuestionIds) },
        },
        take: 4,
        select: { id: true },
      });
      for (const q of multis) {
        paperQuestions.push(q.id);
        usedQuestionIds.add(q.id);
      }

      // 6 integer
      const integers = await prisma.question.findMany({
        where: {
          subject,
          questionType: 'integer',
          id: { notIn: Array.from(usedQuestionIds) },
        },
        take: 6,
        select: { id: true },
      });
      for (const q of integers) {
        paperQuestions.push(q.id);
        usedQuestionIds.add(q.id);
      }
    }

    if (paperQuestions.length === 51) {
      await prisma.baseMockPaper.upsert({
        where: { examType_paperNumber: { examType: 'Advanced', paperNumber: paperNum } },
        update: {
          title: `JEE Advanced Official Base Paper #${paperNum}`,
          totalQuestions: 51,
          questionIds: paperQuestions,
        },
        create: {
          paperNumber: paperNum,
          examType: 'Advanced',
          title: `JEE Advanced Official Base Paper #${paperNum}`,
          totalQuestions: 51,
          questionIds: paperQuestions,
        },
      });
      console.log(`✓ JEE Advanced Base Paper #${paperNum} created with 51 questions.`);
    } else {
      console.error(`Failed to assemble 51 questions for JEE Advanced Paper #${paperNum} (got ${paperQuestions.length})`);
    }
  }

  // 3. NEET: 5 papers (180 questions each: 45 Physics, 45 Chemistry, 45 Botany, 45 Zoology)
  console.log('Generating NEET Base Papers...');
  for (let paperNum = 1; paperNum <= 5; paperNum++) {
    const paperQuestions: string[] = [];

    for (const subject of ['Physics', 'Chemistry', 'Botany', 'Zoology']) {
      // 45 mcq_single
      const singles = await prisma.question.findMany({
        where: {
          subject,
          questionType: 'mcq_single',
          id: { notIn: Array.from(usedQuestionIds) },
        },
        take: 45,
        select: { id: true },
      });
      for (const q of singles) {
        paperQuestions.push(q.id);
        usedQuestionIds.add(q.id);
      }
    }

    if (paperQuestions.length === 180) {
      await prisma.baseMockPaper.upsert({
        where: { examType_paperNumber: { examType: 'NEET', paperNumber: paperNum } },
        update: {
          title: `NEET Official Base Paper #${paperNum}`,
          totalQuestions: 180,
          questionIds: paperQuestions,
        },
        create: {
          paperNumber: paperNum,
          examType: 'NEET',
          title: `NEET Official Base Paper #${paperNum}`,
          totalQuestions: 180,
          questionIds: paperQuestions,
        },
      });
      console.log(`✓ NEET Base Paper #${paperNum} created with 180 questions.`);
    } else {
      console.error(`Failed to assemble 180 questions for NEET Paper #${paperNum} (got ${paperQuestions.length})`);
    }
  }

  const totalBasePapers = await prisma.baseMockPaper.count();
  console.log(`Base Mock Papers seeding complete! Total active base papers: ${totalBasePapers}`);

  await prisma.$disconnect();
}

seedBasePapers().catch((err) => {
  console.error('Error seeding base papers:', err);
  process.exit(1);
});
