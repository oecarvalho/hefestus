'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { extractSkills } from '@/lib/extract-skills'
import { getSession } from '@/lib/auth'
import { z } from 'zod'

const createJobSchema = z.object({
  title: z.string().trim().min(1, 'Nome da vaga é obrigatório!'),
  nameEnterprise: z.string().trim().min(1, 'Nome da empresa é obrigatório!'),
  workModel: z.string().trim().min(1, 'Modelo de trabalho é obrigatório!'),
  jobDescription: z.string().min(1, 'Descrição da vaga é obrigatória!'),
  jobStatus: z.string().default('aplicado'),
});

const deleteJobSchema = z.string().cuid('ID de vaga inválido');

const updateStatusSchema = z.object({
  id: z.string().cuid('ID de vaga inválido'),
  status: z.enum(['aplicado', 'andamento', 'rejeitado', 'cancelado']),
});

interface CreateNewJobProps {
  title: string
  nameEnterprise: string
  workModel: string
  jobDescription: string
  jobStatus: string
}

export async function createNewJob(data: CreateNewJobProps) {
  const session = await getSession();
  if (!session) {
    throw new Error('Acesso não autorizado.');
  }

  const validated = createJobSchema.parse(data);

  const skills = await extractSkills(
    validated.jobDescription
  );

  const createdJob = await prisma.job.create({
    data: {
      userId: session.userId,
      jobTitle: validated.title,
      nameEnterprise: validated.nameEnterprise,
      workModel: validated.workModel,
      description: validated.jobDescription,
      status: validated.jobStatus,
      extractedSkills: skills
    },
  })

  await prisma.jobActivity.create({
    data: {
      jobId: createdJob.id,
      type: 'status_change',
      description: 'Candidatura cadastrada no sistema.'
    }
  })

  revalidatePath('/jobs');
}

export async function deleteNewJob(id: string) {
  const session = await getSession();
  if (!session) {
    return {
      error: 'Acesso não autorizado.'
    }
  }

  try {
    const validatedId = deleteJobSchema.parse(id);

    const job = await prisma.job.findUnique({
      where: { id: validatedId },
      select: { userId: true }
    });

    if (!job || job.userId !== session.userId) {
      return {
        error: 'Vaga não encontrada ou acesso não autorizado.'
      }
    }

    await prisma.job.delete({
      where: {
        id: validatedId,
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
  const session = await getSession();
  if (!session) {
    return {
      error: 'Acesso não autorizado.'
    }
  }

  try {
    const { id: validatedId, status: validatedStatus } = updateStatusSchema.parse({ id, status });

    const job = await prisma.job.findUnique({
      where: { id: validatedId },
      select: { userId: true }
    });

    if (!job || job.userId !== session.userId) {
      return {
        error: 'Vaga não encontrada ou acesso não autorizado.'
      }
    }

    const statusLabels: Record<string, string> = {
      aplicado: 'Aplicado',
      andamento: 'Em Andamento',
      rejeitado: 'Rejeitado',
      cancelado: 'Cancelada',
    };

    const statusLabel = statusLabels[validatedStatus] || validatedStatus;

    await prisma.$transaction([
      prisma.job.update({
        where: {
          id: validatedId,
        },
        data: {
          status: validatedStatus,
          lastActivityAt: new Date(),
          alertCycle: 0,
          autoCanceledAlertPending: false,
        },
      }),
      prisma.jobActivity.create({
        data: {
          jobId: validatedId,
          type: 'status_change',
          description: `Status alterado para "${statusLabel}".`
        }
      })
    ]);

    revalidatePath('/jobs');
    revalidatePath(`/jobs/${validatedId}`);

    return { success: true };

  } catch {
    return {
      error: 'Erro ao atualizar status'
    }
  }
}