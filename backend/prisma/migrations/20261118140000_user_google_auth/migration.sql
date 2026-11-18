-- AlterTable
ALTER TABLE `User` ADD COLUMN `googleSub` VARCHAR(191) NULL,
    ADD COLUMN `avatarUrl` TEXT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_googleSub_key` ON `User`(`googleSub`);
