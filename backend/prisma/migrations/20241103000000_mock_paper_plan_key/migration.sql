-- Add planKey to MockPaper so a second student with the same topic plan can find the stored paper
-- directly, without scanning all papers and checking topics one by one.
-- Nullable for backwards compatibility: existing papers without a planKey are skipped by the new lookup.
ALTER TABLE "MockPaper" ADD COLUMN "planKey" TEXT;

CREATE INDEX "MockPaper_examType_difficultyMode_planKey_idx" ON "MockPaper"("examType", "difficultyMode", "planKey");
