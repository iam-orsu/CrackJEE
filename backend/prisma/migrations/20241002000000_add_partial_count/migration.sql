-- AlterTable: track partially-correct answers (Advanced multi-correct with some but not all options right)
ALTER TABLE "MockExamResult" ADD COLUMN "partial" INTEGER NOT NULL DEFAULT 0;
