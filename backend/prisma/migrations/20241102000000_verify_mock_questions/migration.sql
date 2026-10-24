-- Mock questions generated before the answer check were never verified. Mark them unverified so they are no
-- longer reused in new papers, and clear the stored-paper cache so new papers are built from verified questions.
-- Exams already taken keep their own questions; only reuse changes.
UPDATE "Question" SET "validatedAt" = NULL WHERE "mockOnly" = true;
DELETE FROM "MockPaper";
