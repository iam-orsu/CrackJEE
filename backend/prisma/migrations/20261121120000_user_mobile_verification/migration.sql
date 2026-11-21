ALTER TABLE `User` ADD COLUMN `mobile` VARCHAR(191) NULL,
                  ADD COLUMN `mobileVerified` BOOLEAN NOT NULL DEFAULT false;

CREATE UNIQUE INDEX `User_mobile_key` ON `User`(`mobile`);
