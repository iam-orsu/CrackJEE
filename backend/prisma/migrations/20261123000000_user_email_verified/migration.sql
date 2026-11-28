ALTER TABLE `User` ADD COLUMN `emailVerified` BOOLEAN NOT NULL DEFAULT false;

UPDATE `User` SET `emailVerified` = true WHERE `googleSub` IS NOT NULL;
