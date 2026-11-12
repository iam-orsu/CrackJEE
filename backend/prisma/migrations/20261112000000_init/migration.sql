-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `class` VARCHAR(191) NOT NULL,
    `targetExam` VARCHAR(191) NOT NULL,
    `currentLevel` VARCHAR(191) NOT NULL DEFAULT 'beginner',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Question` (
    `id` VARCHAR(191) NOT NULL,
    `topic` VARCHAR(191) NOT NULL,
    `subject` VARCHAR(191) NOT NULL,
    `questionText` TEXT NOT NULL,
    `options` JSON NOT NULL,
    `answer` VARCHAR(191) NOT NULL,
    `explanation` TEXT NOT NULL,
    `diagram` JSON NULL,
    `difficulty` VARCHAR(191) NOT NULL,
    `examType` VARCHAR(191) NOT NULL,
    `questionType` VARCHAR(191) NOT NULL DEFAULT 'mcq_single',
    `generatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `validatedAt` DATETIME(3) NULL,
    `mockOnly` BOOLEAN NOT NULL DEFAULT false,

    INDEX `Question_topic_subject_difficulty_questionType_idx`(`topic`, `subject`, `difficulty`, `questionType`),
    INDEX `Question_subject_difficulty_examType_questionType_idx`(`subject`, `difficulty`, `examType`, `questionType`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
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

-- CreateTable
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

-- CreateTable
CREATE TABLE `MockExamQuestion` (
    `id` VARCHAR(191) NOT NULL,
    `examId` VARCHAR(191) NOT NULL,
    `questionId` VARCHAR(191) NOT NULL,
    `subject` VARCHAR(191) NOT NULL,
    `questionNumber` INTEGER NOT NULL,
    `subjectIndex` INTEGER NOT NULL,
    `savedAnswer` TEXT NULL,
    `markedForReview` BOOLEAN NOT NULL DEFAULT false,

    INDEX `MockExamQuestion_examId_idx`(`examId`),
    INDEX `MockExamQuestion_examId_subject_idx`(`examId`, `subject`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
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

-- CreateTable
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

-- CreateTable
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

-- AddForeignKey
ALTER TABLE `StudentAttempt` ADD CONSTRAINT `StudentAttempt_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentAttempt` ADD CONSTRAINT `StudentAttempt_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `Question`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MockExam` ADD CONSTRAINT `MockExam_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MockExamQuestion` ADD CONSTRAINT `MockExamQuestion_examId_fkey` FOREIGN KEY (`examId`) REFERENCES `MockExam`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MockExamQuestion` ADD CONSTRAINT `MockExamQuestion_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `Question`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MockExamResult` ADD CONSTRAINT `MockExamResult_examId_fkey` FOREIGN KEY (`examId`) REFERENCES `MockExam`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TopicProgress` ADD CONSTRAINT `TopicProgress_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

