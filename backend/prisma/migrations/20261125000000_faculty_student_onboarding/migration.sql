-- Student portal onboarding: email + mobile verification state for faculty-created students.
ALTER TABLE `FacultyStudent` ADD COLUMN `emailVerified` BOOLEAN NOT NULL DEFAULT false,
                             ADD COLUMN `mobile` VARCHAR(191) NULL,
                             ADD COLUMN `mobileVerified` BOOLEAN NOT NULL DEFAULT false,
                             ADD COLUMN `isOnboarded` BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX `FacultyStudent_mobile_idx` ON `FacultyStudent`(`mobile`);
