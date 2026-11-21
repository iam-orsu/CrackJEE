-- JEENEET.ai Database Schema (Generated from Prisma Schema)
-- Target: MySQL 8.0+
-- Character Set: utf8mb4 / utf8mb4_unicode_ci

CREATE DATABASE IF NOT EXISTS `jeeneet` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `jeeneet`;

-- CreateTable: User
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `googleSub` VARCHAR(191) NULL,
    `avatarUrl` TEXT NULL,
    `class` VARCHAR(191) NOT NULL,
    `targetExam` VARCHAR(191) NOT NULL,
    `hasPsychometric` BOOLEAN NOT NULL DEFAULT false,
    `currentLevel` VARCHAR(191) NOT NULL DEFAULT 'beginner',
    `isOnboarded` BOOLEAN NOT NULL DEFAULT false,
    `mobile` VARCHAR(191) NULL,
    `mobileVerified` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_googleSub_key`(`googleSub`),
    UNIQUE INDEX `User_mobile_key`(`mobile`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable: Topic
CREATE TABLE `Topic` (
    `id` VARCHAR(191) NOT NULL,
    `numericCode` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `subject` VARCHAR(191) NOT NULL,
    `classLevel` VARCHAR(191) NOT NULL,
    `examCategory` VARCHAR(191) NOT NULL,
    `syllabusOrder` INTEGER NOT NULL DEFAULT 0,
    `isExcluded` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `Topic_numericCode_key`(`numericCode`),
    UNIQUE INDEX `Topic_name_key`(`name`),
    INDEX `Topic_subject_classLevel_idx`(`subject`, `classLevel`),
    INDEX `Topic_examCategory_syllabusOrder_idx`(`examCategory`, `syllabusOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable: Question
CREATE TABLE `Question` (
    `id` VARCHAR(191) NOT NULL,
    `topicId` VARCHAR(191) NULL,
    `topic` VARCHAR(191) NOT NULL,
    `subject` VARCHAR(191) NOT NULL,
    `questionText` TEXT NOT NULL,
    `options` JSON NOT NULL,
    `answer` VARCHAR(191) NOT NULL,
    `explanation` TEXT NOT NULL,
    `betterExplanation` TEXT NULL,
    `bestExplanation` TEXT NULL,
    `diagram` JSON NULL,
    `difficulty` VARCHAR(191) NOT NULL,
    `examType` VARCHAR(191) NOT NULL,
    `questionType` VARCHAR(191) NOT NULL DEFAULT 'mcq_single',
    `generatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `validatedAt` DATETIME(3) NULL,
    `mockOnly` BOOLEAN NOT NULL DEFAULT false,

    INDEX `Question_topicId_difficulty_questionType_idx`(`topicId`, `difficulty`, `questionType`),
    INDEX `Question_topic_subject_difficulty_questionType_idx`(`topic`, `subject`, `difficulty`, `questionType`),
    INDEX `Question_subject_difficulty_examType_questionType_idx`(`subject`, `difficulty`, `examType`, `questionType`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable: StudentAttempt
CREATE TABLE `StudentAttempt` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `questionId` VARCHAR(191) NOT NULL,
    `answerSubmitted` TEXT NOT NULL,
    `isCorrect` BOOLEAN NOT NULL,
    `timeSpent` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `StudentAttempt_userId_idx`(`userId`),
    INDEX `StudentAttempt_questionId_idx`(`questionId`),
    INDEX `StudentAttempt_userId_createdAt_idx`(`userId`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable: MockExam
CREATE TABLE `MockExam` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `examType` VARCHAR(191) NOT NULL,
    `difficultyMode` VARCHAR(191) NOT NULL DEFAULT 'medium',
    `status` VARCHAR(191) NOT NULL DEFAULT 'generating',
    `durationSeconds` INTEGER NOT NULL,
    `startedAt` DATETIME(3) NULL,
    `submittedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `MockExam_userId_idx`(`userId`),
    INDEX `MockExam_userId_createdAt_idx`(`userId`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable: MockExamQuestion
CREATE TABLE `MockExamQuestion` (
    `id` VARCHAR(191) NOT NULL,
    `examId` VARCHAR(191) NOT NULL,
    `questionId` VARCHAR(191) NOT NULL,
    `subject` VARCHAR(191) NOT NULL,
    `questionNumber` INTEGER NOT NULL,
    `subjectIndex` INTEGER NOT NULL,
    `sourceType` VARCHAR(191) NOT NULL DEFAULT 'BASE',
    `savedAnswer` TEXT NULL,
    `markedForReview` BOOLEAN NOT NULL DEFAULT false,

    INDEX `MockExamQuestion_examId_idx`(`examId`),
    INDEX `MockExamQuestion_examId_subject_idx`(`examId`, `subject`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable: MockPaper
CREATE TABLE `MockPaper` (
    `id` VARCHAR(191) NOT NULL,
    `examType` VARCHAR(191) NOT NULL,
    `difficultyMode` VARCHAR(191) NOT NULL,
    `items` JSON NOT NULL,
    `planKey` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `MockPaper_examType_difficultyMode_idx`(`examType`, `difficultyMode`),
    INDEX `MockPaper_examType_difficultyMode_planKey_idx`(`examType`, `difficultyMode`, `planKey`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable: StudentTopicMastery
CREATE TABLE `StudentTopicMastery` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `topicId` VARCHAR(191) NOT NULL,
    `attemptsCount` INTEGER NOT NULL DEFAULT 0,
    `correctCount` INTEGER NOT NULL DEFAULT 0,
    `accuracyPct` DOUBLE NOT NULL DEFAULT 0,
    `marksLostTotal` DOUBLE NOT NULL DEFAULT 0,
    `isWeak` BOOLEAN NOT NULL DEFAULT false,
    `lastTestedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `StudentTopicMastery_userId_isWeak_idx`(`userId`, `isWeak`),
    INDEX `StudentTopicMastery_topicId_idx`(`topicId`),
    UNIQUE INDEX `StudentTopicMastery_userId_topicId_key`(`userId`, `topicId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable: MockExamResult
CREATE TABLE `MockExamResult` (
    `id` VARCHAR(191) NOT NULL,
    `examId` VARCHAR(191) NOT NULL,
    `totalScore` DOUBLE NOT NULL,
    `maxScore` INTEGER NOT NULL,
    `physicsScore` DOUBLE NOT NULL,
    `chemistryScore` DOUBLE NOT NULL,
    `mathScore` DOUBLE NOT NULL,
    `biologyScore` DOUBLE NOT NULL DEFAULT 0,
    `correct` INTEGER NOT NULL,
    `partial` INTEGER NOT NULL DEFAULT 0,
    `incorrect` INTEGER NOT NULL,
    `unattempted` INTEGER NOT NULL,
    `timeTaken` INTEGER NOT NULL,
    `scoreBreakdown` JSON NOT NULL,

    UNIQUE INDEX `MockExamResult_examId_key`(`examId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable: TopicProgress
CREATE TABLE `TopicProgress` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `topicName` VARCHAR(191) NOT NULL,
    `subject` VARCHAR(191) NOT NULL,
    `attempts` INTEGER NOT NULL DEFAULT 0,
    `correctCount` INTEGER NOT NULL DEFAULT 0,
    `successRate` DOUBLE NOT NULL DEFAULT 0,
    `markedAsWeak` BOOLEAN NOT NULL DEFAULT false,
    `lastAttemptAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `TopicProgress_userId_idx`(`userId`),
    INDEX `TopicProgress_userId_markedAsWeak_idx`(`userId`, `markedAsWeak`),
    UNIQUE INDEX `TopicProgress_userId_topicName_subject_key`(`userId`, `topicName`, `subject`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable: Faculty
CREATE TABLE `Faculty` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `googleSub` VARCHAR(191) NULL,
    `avatarUrl` TEXT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Faculty_email_key`(`email`),
    UNIQUE INDEX `Faculty_googleSub_key`(`googleSub`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable: FacultyPaper
CREATE TABLE `FacultyPaper` (
    `id` VARCHAR(191) NOT NULL,
    `paperCode` VARCHAR(191) NULL,
    `facultyId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `examType` VARCHAR(191) NOT NULL,
    `difficulty` VARCHAR(191) NOT NULL DEFAULT 'intermediate',
    `questionCount` INTEGER NOT NULL,
    `selections` JSON NOT NULL,
    `items` JSON NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'generating',
    `verifiedCount` INTEGER NOT NULL DEFAULT 0,
    `errorMessage` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `FacultyPaper_paperCode_key`(`paperCode`),
    INDEX `FacultyPaper_facultyId_createdAt_idx`(`facultyId`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Foreign Keys & Constraints
ALTER TABLE `Question` ADD CONSTRAINT `Question_topicId_fkey` FOREIGN KEY (`topicId`) REFERENCES `Topic`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `StudentAttempt` ADD CONSTRAINT `StudentAttempt_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `StudentAttempt` ADD CONSTRAINT `StudentAttempt_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `Question`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `MockExam` ADD CONSTRAINT `MockExam_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `MockExamQuestion` ADD CONSTRAINT `MockExamQuestion_examId_fkey` FOREIGN KEY (`examId`) REFERENCES `MockExam`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `MockExamQuestion` ADD CONSTRAINT `MockExamQuestion_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `Question`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `StudentTopicMastery` ADD CONSTRAINT `StudentTopicMastery_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `StudentTopicMastery` ADD CONSTRAINT `StudentTopicMastery_topicId_fkey` FOREIGN KEY (`topicId`) REFERENCES `Topic`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `MockExamResult` ADD CONSTRAINT `MockExamResult_examId_fkey` FOREIGN KEY (`examId`) REFERENCES `MockExam`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `TopicProgress` ADD CONSTRAINT `TopicProgress_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `FacultyPaper` ADD CONSTRAINT `FacultyPaper_facultyId_fkey` FOREIGN KEY (`facultyId`) REFERENCES `Faculty`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable: PsychometricItem
CREATE TABLE IF NOT EXISTS `PsychometricItem` (
    `id` VARCHAR(191) NOT NULL,
    `section` VARCHAR(191) NOT NULL,
    `construct` VARCHAR(191) NOT NULL,
    `subFacet` VARCHAR(191) NULL,
    `itemType` VARCHAR(191) NOT NULL,
    `scenarioText` TEXT NULL,
    `promptText` TEXT NOT NULL,
    `options` JSON NULL,
    `correctAnswer` VARCHAR(191) NULL,
    `isReverseKeyed` BOOLEAN NOT NULL DEFAULT false,
    `orderIndex` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `PsychometricItem_section_construct_idx`(`section`, `construct`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable: PsychometricSession
CREATE TABLE IF NOT EXISTS `PsychometricSession` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'in_progress',
    `currentSection` VARCHAR(191) NOT NULL DEFAULT 'COGNITIVE',
    `timeTakenSeconds` INTEGER NOT NULL DEFAULT 0,
    `startedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `completedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `PsychometricSession_userId_status_idx`(`userId`, `status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable: PsychometricResponse
CREATE TABLE IF NOT EXISTS `PsychometricResponse` (
    `id` VARCHAR(191) NOT NULL,
    `sessionId` VARCHAR(191) NOT NULL,
    `itemId` VARCHAR(191) NOT NULL,
    `answer` VARCHAR(191) NOT NULL,
    `score` DOUBLE NOT NULL,
    `timeSpentMs` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `PsychometricResponse_sessionId_itemId_key`(`sessionId`, `itemId`),
    INDEX `PsychometricResponse_sessionId_idx`(`sessionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable: PsychometricReport
CREATE TABLE IF NOT EXISTS `PsychometricReport` (
    `id` VARCHAR(191) NOT NULL,
    `sessionId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `cognitivePercentile` DOUBLE NOT NULL DEFAULT 0,
    `cognitiveBreakdown` JSON NOT NULL,
    `oceanProfile` JSON NOT NULL,
    `honestyHumility` DOUBLE NOT NULL DEFAULT 0,
    `testAnxietyIndex` DOUBLE NOT NULL DEFAULT 0,
    `academicResilience` DOUBLE NOT NULL DEFAULT 0,
    `sjtCompetencies` JSON NOT NULL,
    `riasecCode` VARCHAR(191) NOT NULL DEFAULT 'IRE',
    `riasecScores` JSON NOT NULL,
    `streamRecommendations` JSON NOT NULL,
    `studyHabitAdvice` JSON NOT NULL,
    `burnoutRisk` VARCHAR(191) NOT NULL DEFAULT 'low',
    `facultyAdvice` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `PsychometricReport_sessionId_key`(`sessionId`),
    INDEX `PsychometricReport_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

