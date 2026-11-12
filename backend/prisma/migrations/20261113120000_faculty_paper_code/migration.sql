-- AlterTable
ALTER TABLE `FacultyPaper` ADD COLUMN `paperCode` VARCHAR(32) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `FacultyPaper_paperCode_key` ON `FacultyPaper`(`paperCode`);
