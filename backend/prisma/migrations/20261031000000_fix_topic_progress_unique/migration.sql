-- Fix TopicProgress unique constraint to include subject.
-- The old constraint (userId, topicName) merged "Waves" in Physics and "Waves" in Chemistry
-- into one row, corrupting per-subject accuracy tracking.
-- The new constraint (userId, topicName, subject) keeps them separate.

-- Drop the old index
DROP INDEX IF EXISTS "TopicProgress_userId_topicName_key";

-- Add the corrected unique index
CREATE UNIQUE INDEX "TopicProgress_userId_topicName_subject_key"
  ON "TopicProgress"("userId", "topicName", "subject");
