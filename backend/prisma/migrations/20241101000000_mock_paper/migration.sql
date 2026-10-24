-- Stored mock papers: generated once, then given to any student who starts a paper of that exam and difficulty
CREATE TABLE "MockPaper" (
    "id" TEXT NOT NULL,
    "examType" TEXT NOT NULL,
    "difficultyMode" TEXT NOT NULL,
    "items" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MockPaper_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "MockPaper_examType_difficultyMode_idx" ON "MockPaper"("examType", "difficultyMode");
