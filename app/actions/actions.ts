'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

interface CreateNewJobProps {
  title: string
  nameEnterprise: string
  workModel: string
  jobDescription: string
  jobStatus: string
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

  revalidatePath('/jobs');
}

export async function deleteNewJob(id: string) {
  try {

    await prisma.job.delete({
      where: {
        id,
      }
    })

  } catch (error) {
    console.log(error);

    return {
      error: 'Erro ao remover uma vaga.'
    }
  }

  revalidatePath('/jobs');
}

export async function updateJobStatus(id: string, status: string) {
  try {
    await prisma.job.update({
      where: {
        id: id,
      },
      data: {
        status,
      },
    });

    revalidatePath('/jobs');

    return { success: true };

  } catch {
    return {
      error: 'Erro ao atualizar status'
    }
  }
}