-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "class" TEXT NOT NULL,
    "targetExam" TEXT NOT NULL,
    "currentLevel" TEXT NOT NULL DEFAULT 'beginner',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "questionText" TEXT NOT NULL,
    "options" JSONB NOT NULL,
    "answer" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "diagram" JSONB,
    "difficulty" TEXT NOT NULL,
    "examType" TEXT NOT NULL,
    "questionType" TEXT NOT NULL DEFAULT 'mcq_single',
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validatedAt" TIMESTAMP(3),

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentAttempt" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "answerSubmitted" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "timeSpent" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudentAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MockExam" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "examType" TEXT NOT NULL,
    "difficultyMode" TEXT NOT NULL DEFAULT 'medium',
    "status" TEXT NOT NULL DEFAULT 'generating',
    "durationSeconds" INTEGER NOT NULL,
    "startedAt" TIMESTAMP(3),
    "submittedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MockExam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MockExamQuestion" (
    "id" TEXT NOT NULL,
    "examId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "questionNumber" INTEGER NOT NULL,
    "subjectIndex" INTEGER NOT NULL,
    "savedAnswer" TEXT,
    "markedForReview" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "MockExamQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MockExamResult" (
    "id" TEXT NOT NULL,
    "examId" TEXT NOT NULL,
    "totalScore" DOUBLE PRECISION NOT NULL,
    "maxScore" INTEGER NOT NULL,
    "physicsScore" DOUBLE PRECISION NOT NULL,
    "chemistryScore" DOUBLE PRECISION NOT NULL,
    "mathScore" DOUBLE PRECISION NOT NULL,
    "correct" INTEGER NOT NULL,
    "incorrect" INTEGER NOT NULL,
    "unattempted" INTEGER NOT NULL,
    "timeTaken" INTEGER NOT NULL,
    "scoreBreakdown" JSONB NOT NULL,

    CONSTRAINT "MockExamResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TopicProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "topicName" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "correctCount" INTEGER NOT NULL DEFAULT 0,
    "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "markedAsWeak" BOOLEAN NOT NULL DEFAULT false,
    "lastAttemptAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TopicProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Question_topic_subject_difficulty_questionType_idx" ON "Question"("topic", "subject", "difficulty", "questionType");

-- CreateIndex
CREATE INDEX "Question_subject_difficulty_examType_questionType_idx" ON "Question"("subject", "difficulty", "examType", "questionType");

-- CreateIndex
CREATE INDEX "StudentAttempt_userId_idx" ON "StudentAttempt"("userId");

-- CreateIndex
CREATE INDEX "StudentAttempt_questionId_idx" ON "StudentAttempt"("questionId");

-- CreateIndex
CREATE INDEX "StudentAttempt_userId_createdAt_idx" ON "StudentAttempt"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "MockExam_userId_idx" ON "MockExam"("userId");

-- CreateIndex
CREATE INDEX "MockExam_userId_createdAt_idx" ON "MockExam"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "MockExamQuestion_examId_idx" ON "MockExamQuestion"("examId");

-- CreateIndex
CREATE INDEX "MockExamQuestion_examId_subject_idx" ON "MockExamQuestion"("examId", "subject");

-- CreateIndex
CREATE UNIQUE INDEX "MockExamResult_examId_key" ON "MockExamResult"("examId");

-- CreateIndex
CREATE UNIQUE INDEX "TopicProgress_userId_topicName_key" ON "TopicProgress"("userId", "topicName");

-- CreateIndex
CREATE INDEX "TopicProgress_userId_idx" ON "TopicProgress"("userId");

-- CreateIndex
CREATE INDEX "TopicProgress_userId_markedAsWeak_idx" ON "TopicProgress"("userId", "markedAsWeak");

-- AddForeignKey
ALTER TABLE "StudentAttempt" ADD CONSTRAINT "StudentAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentAttempt" ADD CONSTRAINT "StudentAttempt_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MockExam" ADD CONSTRAINT "MockExam_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MockExamQuestion" ADD CONSTRAINT "MockExamQuestion_examId_fkey" FOREIGN KEY ("examId") REFERENCES "MockExam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MockExamQuestion" ADD CONSTRAINT "MockExamQuestion_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MockExamResult" ADD CONSTRAINT "MockExamResult_examId_fkey" FOREIGN KEY ("examId") REFERENCES "MockExam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopicProgress" ADD CONSTRAINT "TopicProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
