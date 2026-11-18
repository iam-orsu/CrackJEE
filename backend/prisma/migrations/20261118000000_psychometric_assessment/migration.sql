-- AlterTable: User add hasPsychometric
ALTER TABLE `User` ADD COLUMN `hasPsychometric` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable: PsychometricItem
CREATE TABLE `PsychometricItem` (
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
CREATE TABLE `PsychometricSession` (
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
CREATE TABLE `PsychometricResponse` (
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
CREATE TABLE `PsychometricReport` (
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

-- AddForeignKey
ALTER TABLE `PsychometricSession` ADD CONSTRAINT `PsychometricSession_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PsychometricResponse` ADD CONSTRAINT `PsychometricResponse_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `PsychometricSession`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PsychometricResponse` ADD CONSTRAINT `PsychometricResponse_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `PsychometricItem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PsychometricReport` ADD CONSTRAINT `PsychometricReport_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `PsychometricSession`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PsychometricReport` ADD CONSTRAINT `PsychometricReport_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
