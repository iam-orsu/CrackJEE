-- Mock-generated questions must not be served by practice or the question bank
ALTER TABLE "Question" ADD COLUMN "mockOnly" BOOLEAN NOT NULL DEFAULT false;

-- Existing rows that a mock exam uses were all generated for mocks
UPDATE "Question" SET "mockOnly" = true WHERE "id" IN (SELECT "questionId" FROM "MockExamQuestion");
