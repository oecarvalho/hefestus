'use server'

import { prisma } from '@/lib/prisma'

interface CreateNewJobProps {
  title: string
  nameEnterprise: string
  workModel: string
  jobDescription: string
}

export async function createNewJob(data: CreateNewJobProps) {
  await prisma.job.create({
    data: {
      jobTitle: data.title,
      nameEnterprise: data.nameEnterprise,
      workModel: data.workModel,
      description: data.jobDescription,
    },
  })
}