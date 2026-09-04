-- DropForeignKey
ALTER TABLE "QuizAttemptAnswer" DROP CONSTRAINT "QuizAttemptAnswer_questionId_fkey";

-- AlterTable
ALTER TABLE "QuizAttemptAnswer" ALTER COLUMN "questionId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "QuizAttemptAnswer" ADD CONSTRAINT "QuizAttemptAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "QuizQuestion"("id") ON DELETE SET NULL ON UPDATE CASCADE;
