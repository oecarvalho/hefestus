/*
  Warnings:

  - You are about to drop the `newjob` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "newjob";

-- CreateTable
CREATE TABLE "job" (
    "id" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "nameEnterprise" TEXT NOT NULL,
    "workModel" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "scheduleAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_pkey" PRIMARY KEY ("id")
);
