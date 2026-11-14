import { loadDotEnv } from '../src/config/env';
loadDotEnv();

import { prisma } from '../src/config/database';
import {
  JEE_TOPICS_BY_CLASS,
  NEET_TOPICS_BY_CLASS,
  JEE_MAIN_EXCLUDED_TOPICS,
  type Subject,
} from '../src/types/index';

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const SUBJECT_PREFIX: Record<string, string> = {
  Physics: 'phy',
  Chemistry: 'chem',
  Mathematics: 'math',
  Botany: 'bot',
  Zoology: 'zoo',
};

interface CanonicalTopic {
  id: string;
  name: string;
  subject: string;
  classLevel: string;
  examCategory: string; // "JEE" | "NEET" | "BOTH"
  syllabusOrder: number;
  isExcluded: boolean;
}

async function main() {
  console.log('Seeding canonical topics...');

  const topicList: CanonicalTopic[] = [];
  let order = 0;

  // Process JEE topics
  for (const [subject, classes] of Object.entries(JEE_TOPICS_BY_CLASS)) {
    const prefix = SUBJECT_PREFIX[subject] ?? subject.slice(0, 3).toLowerCase();
    for (const name of classes.class11) {
      order++;
      const id = `${prefix}-${slugify(name)}-11`;
      const isExcluded = JEE_MAIN_EXCLUDED_TOPICS.has(name);
      topicList.push({
        id,
        name,
        subject,
        classLevel: '11',
        examCategory: 'JEE',
        syllabusOrder: order,
        isExcluded,
      });
    }
    for (const name of classes.class12) {
      order++;
      const id = `${prefix}-${slugify(name)}-12`;
      const isExcluded = JEE_MAIN_EXCLUDED_TOPICS.has(name);
      topicList.push({
        id,
        name,
        subject,
        classLevel: '12',
        examCategory: 'JEE',
        syllabusOrder: order,
        isExcluded,
      });
    }
  }

  // Process NEET topics (Botany, Zoology, and any Physics/Chemistry topics specific or shared)
  for (const [subject, classes] of Object.entries(NEET_TOPICS_BY_CLASS)) {
    const prefix = SUBJECT_PREFIX[subject] ?? subject.slice(0, 3).toLowerCase();
    for (const name of classes.class11) {
      const existing = topicList.find((t) => t.name.toLowerCase() === name.toLowerCase() && t.subject === subject);
      if (existing) {
        existing.examCategory = 'BOTH';
      } else {
        order++;
        const id = `${prefix}-${slugify(name)}-11`;
        topicList.push({
          id,
          name,
          subject,
          classLevel: '11',
          examCategory: 'NEET',
          syllabusOrder: order,
          isExcluded: false,
        });
      }
    }
    for (const name of classes.class12) {
      const existing = topicList.find((t) => t.name.toLowerCase() === name.toLowerCase() && t.subject === subject);
      if (existing) {
        existing.examCategory = 'BOTH';
      } else {
        order++;
        const id = `${prefix}-${slugify(name)}-12`;
        topicList.push({
          id,
          name,
          subject,
          classLevel: '12',
          examCategory: 'NEET',
          syllabusOrder: order,
          isExcluded: false,
        });
      }
    }
  }

  console.log(`Prepared ${topicList.length} canonical topics.`);

  // Upsert into Topic table
  for (const t of topicList) {
    await prisma.topic.upsert({
      where: { id: t.id },
      update: {
        name: t.name,
        subject: t.subject,
        classLevel: t.classLevel,
        examCategory: t.examCategory,
        syllabusOrder: t.syllabusOrder,
        isExcluded: t.isExcluded,
      },
      create: {
        id: t.id,
        name: t.name,
        subject: t.subject,
        classLevel: t.classLevel,
        examCategory: t.examCategory,
        syllabusOrder: t.syllabusOrder,
        isExcluded: t.isExcluded,
      },
    });
  }
  console.log('Successfully upserted all canonical topics into database.');

  // Backfill Question table: link question to Topic by topic name / subject match
  console.log('Backfilling topicId in Question table...');
  const allTopics = await prisma.topic.findMany();
  const topicByNameAndSubject = new Map<string, string>(); // `${subj.toLowerCase()}:${name.toLowerCase()}` -> id
  const topicByNameOnly = new Map<string, string>(); // `name.toLowerCase()` -> id

  for (const t of allTopics) {
    topicByNameAndSubject.set(`${t.subject.toLowerCase()}:${t.name.toLowerCase()}`, t.id);
    if (!topicByNameOnly.has(t.name.toLowerCase())) {
      topicByNameOnly.set(t.name.toLowerCase(), t.id);
    }
  }

  // Get distinct question topics and subjects
  const distinctQuestionTopics = await prisma.question.findMany({
    select: { topic: true, subject: true },
    distinct: ['topic', 'subject'],
  });

  console.log(`Found ${distinctQuestionTopics.length} distinct topic-subject pairs in Question table.`);

  let matchedPairs = 0;
  let unmatchedPairs: Array<{ topic: string; subject: string }> = [];

  for (const item of distinctQuestionTopics) {
    const key = `${item.subject.toLowerCase()}:${item.topic.toLowerCase()}`;
    let matchedId = topicByNameAndSubject.get(key) ?? topicByNameOnly.get(item.topic.toLowerCase());

    if (!matchedId) {
      // Fuzzy / fallback matching (e.g. "Work, Energy, and Power" vs "Work Energy and Power")
      const normalizedTopic = item.topic.toLowerCase().replace(/[^a-z0-9]/g, '');
      const match = allTopics.find(
        (t) =>
          t.subject.toLowerCase() === item.subject.toLowerCase() &&
          t.name.toLowerCase().replace(/[^a-z0-9]/g, '') === normalizedTopic
      ) || allTopics.find(
        (t) => t.name.toLowerCase().replace(/[^a-z0-9]/g, '') === normalizedTopic
      );

      if (match) {
        matchedId = match.id;
      }
    }

    if (matchedId) {
      matchedPairs++;
      await prisma.question.updateMany({
        where: { topic: item.topic, subject: item.subject },
        data: { topicId: matchedId },
      });
    } else {
      unmatchedPairs.push(item);
    }
  }

  console.log(`Matched ${matchedPairs}/${distinctQuestionTopics.length} pairs.`);
  if (unmatchedPairs.length > 0) {
    console.log('Unmatched pairs:', unmatchedPairs);
  }

  const updatedCount = await prisma.question.count({
    where: { topicId: { not: null } },
  });
  const totalQuestions = await prisma.question.count();
  console.log(`Total questions with topicId populated: ${updatedCount} / ${totalQuestions} (${Math.round((updatedCount / totalQuestions) * 100)}%)`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
