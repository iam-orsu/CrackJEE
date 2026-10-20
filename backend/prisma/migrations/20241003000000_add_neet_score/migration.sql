-- AddColumn biologyScore for NEET exams
ALTER TABLE "MockExamResult" ADD COLUMN "biologyScore" DOUBLE PRECISION NOT NULL DEFAULT 0;
