-- AlterTable
ALTER TABLE "job" ADD COLUMN     "alertCycle" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "autoCanceledAlertPending" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastActivityAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "job_activities" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "job_activities_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "job_activities" ADD CONSTRAINT "job_activities_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "job"("id") ON DELETE CASCADE ON UPDATE CASCADE;
