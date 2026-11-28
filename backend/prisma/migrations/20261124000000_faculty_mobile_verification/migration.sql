ALTER TABLE `Faculty` ADD COLUMN `mobile` VARCHAR(191) NULL,
                       ADD COLUMN `mobileVerified` BOOLEAN NOT NULL DEFAULT false;

CREATE UNIQUE INDEX `Faculty_mobile_key` ON `Faculty`(`mobile`);
