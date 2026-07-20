-- CreateTable
CREATE TABLE "market_studies" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "market_studies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "market_vacancies" (
    "id" TEXT NOT NULL,
    "studyId" TEXT NOT NULL,
    "enterprise" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "url" TEXT,
    "description" TEXT NOT NULL,
    "extractedData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "market_vacancies_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "market_studies" ADD CONSTRAINT "market_studies_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "market_vacancies" ADD CONSTRAINT "market_vacancies_studyId_fkey" FOREIGN KEY ("studyId") REFERENCES "market_studies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
