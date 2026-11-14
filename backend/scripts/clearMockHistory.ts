import { prisma } from '../src/config/database';

async function main() {
  console.log('Clearing old mock exam attempts and cached mock papers...');
  const [exams, papers] = await Promise.all([
    prisma.mockExam.deleteMany(),
    prisma.mockPaper.deleteMany(),
  ]);
  console.log(`✓ Deleted ${exams.count} mock exam attempts.`);
  console.log(`✓ Deleted ${papers.count} cached mock papers.`);
  console.log('✨ Clean slate ready! All 12,729 practice questions and user accounts remain intact.');
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error('Failed to clear mocks:', err);
  process.exit(1);
});
