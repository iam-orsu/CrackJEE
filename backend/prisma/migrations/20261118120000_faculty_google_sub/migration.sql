-- AlterTable
ALTER TABLE `Faculty` ADD COLUMN `googleSub` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Faculty_googleSub_key` ON `Faculty`(`googleSub`);
