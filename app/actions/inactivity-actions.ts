'use server'

import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { getInactivityDays, getAlertCycle, shouldAutoCancel } from '@/lib/inactivity-utils'

const reactivateSchema = z.object({
  jobId: z.string().cuid('ID de vaga inválido'),
  status: z.enum(['aplicado', 'andamento']),
})

const activitySchema = z.object({
  jobId: z.string().cuid('ID de vaga inválido'),
  type: z.enum(['status_change', 'custom_activity', 'callback_received', 'interview', 'technical_test', 'reactivation', 'auto_canceled']),
  description: z.string().trim().min(1, 'A descrição do acompanhamento é obrigatória!'),
})

export async function getPendingAlerts() {
  const session = await getSession();
  if (!session) {
    return { inactivityAlerts: [], autoCanceledAlerts: [] };
  }

  const userId = session.userId;

  // 1. Buscar vagas ativas do usuário
  const activeJobs = await prisma.job.findMany({
    where: {
      userId,
      status: {
        in: ['aplicado', 'andamento']
      }
    }
  });

  const now = new Date();
  const inactivityAlerts = [];
  const autoCanceledAlerts = [];

  for (const job of activeJobs) {
    const diffInDays = getInactivityDays(job.lastActivityAt, now);

    if (shouldAutoCancel(diffInDays)) {
      // Cancelar automaticamente a vaga
      await prisma.$transaction([
        prisma.job.update({
          where: { id: job.id },
          data: {
            status: 'cancelado',
            autoCanceledAlertPending: true,
            alertCycle: 0 // Reseta o ciclo de alerta
          }
        }),
        prisma.jobActivity.create({
          data: {
            jobId: job.id,
            type: 'auto_canceled',
            description: 'Candidatura cancelada automaticamente após 30 dias sem movimentação.'
          }
        })
      ]);

      autoCanceledAlerts.push({
        id: job.id,
        jobTitle: job.jobTitle,
        nameEnterprise: job.nameEnterprise,
        daysInactive: diffInDays
      });
    } else {
      // Verificar se entra em algum ciclo de alerta (7, 14, 21, 28)
      const currentCycle = getAlertCycle(diffInDays);

      // Se o ciclo atual é maior do que o alertCycle registrado, precisamos exibir o alerta
      if (currentCycle > job.alertCycle) {
        inactivityAlerts.push({
          id: job.id,
          jobTitle: job.jobTitle,
          nameEnterprise: job.nameEnterprise,
          daysInactive: diffInDays,
          cycle: currentCycle
        });
      }
    }
  }

  // 2. Buscar vagas que foram canceladas automaticamente e cujo alerta ainda está pendente
  const pendingCancelAlerts = await prisma.job.findMany({
    where: {
      userId,
      status: 'cancelado',
      autoCanceledAlertPending: true
    }
  });

  for (const job of pendingCancelAlerts) {
    // Caso a vaga já esteja na lista (pode ter sido adicionada acima no mesmo request)
    if (!autoCanceledAlerts.some(a => a.id === job.id)) {
      const diffInDays = getInactivityDays(job.lastActivityAt, now);
      autoCanceledAlerts.push({
        id: job.id,
        jobTitle: job.jobTitle,
        nameEnterprise: job.nameEnterprise,
        daysInactive: diffInDays
      });
    }
  }

  return {
    inactivityAlerts,
    autoCanceledAlerts
  };
}

export async function acknowledgeInactivityAlert(jobId: string, cycle: number) {
  const session = await getSession();
  if (!session) {
    return { error: 'Acesso não autorizado.' };
  }

  try {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      select: { userId: true }
    });

    if (!job || job.userId !== session.userId) {
      return { error: 'Vaga não encontrada ou acesso não autorizado.' };
    }

    await prisma.job.update({
      where: { id: jobId },
      data: {
        alertCycle: cycle
      }
    });

    return { success: true };
  } catch (error) {
    console.error('Erro ao confirmar alerta:', error);
    return { error: 'Erro ao processar confirmação do alerta.' };
  }
}

export async function acknowledgeAutoCanceledAlert(jobId: string) {
  const session = await getSession();
  if (!session) {
    return { error: 'Acesso não autorizado.' };
  }

  try {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      select: { userId: true }
    });

    if (!job || job.userId !== session.userId) {
      return { error: 'Vaga não encontrada ou acesso não autorizado.' };
    }

    await prisma.job.update({
      where: { id: jobId },
      data: {
        autoCanceledAlertPending: false
      }
    });

    return { success: true };
  } catch (error) {
    console.error('Erro ao confirmar cancelamento automático:', error);
    return { error: 'Erro ao processar confirmação.' };
  }
}

export async function reactivateJob(jobId: string, status: 'aplicado' | 'andamento') {
  const session = await getSession();
  if (!session) {
    return { error: 'Acesso não autorizado.' };
  }

  try {
    const validated = reactivateSchema.parse({ jobId, status });

    const job = await prisma.job.findUnique({
      where: { id: validated.jobId },
      select: { userId: true, jobTitle: true }
    });

    if (!job || job.userId !== session.userId) {
      return { error: 'Vaga não encontrada ou acesso não autorizado.' };
    }

    await prisma.$transaction([
      prisma.job.update({
        where: { id: validated.jobId },
        data: {
          status: validated.status,
          lastActivityAt: new Date(),
          alertCycle: 0,
          autoCanceledAlertPending: false
        }
      }),
      prisma.jobActivity.create({
        data: {
          jobId: validated.jobId,
          type: 'reactivation',
          description: `Candidatura reativada com status "${validated.status === 'aplicado' ? 'Aplicado' : 'Em Andamento'}".`
        }
      })
    ]);

    revalidatePath('/jobs');
    revalidatePath(`/jobs/${validated.jobId}`);

    return { success: true };
  } catch (error) {
    console.error('Erro ao reativar candidatura:', error);
    return { error: 'Erro ao reativar a vaga.' };
  }
}

export async function createJobActivity(data: { jobId: string, type: 'status_change' | 'custom_activity' | 'callback_received' | 'interview' | 'technical_test' | 'reactivation' | 'auto_canceled', description: string }) {
  const session = await getSession();
  if (!session) {
    return { error: 'Acesso não autorizado.' };
  }

  try {
    const validated = activitySchema.parse(data);

    const job = await prisma.job.findUnique({
      where: { id: validated.jobId },
      select: { userId: true }
    });

    if (!job || job.userId !== session.userId) {
      return { error: 'Vaga não encontrada ou acesso não autorizado.' };
    }

    await prisma.$transaction([
      prisma.jobActivity.create({
        data: {
          jobId: validated.jobId,
          type: validated.type,
          description: validated.description
        }
      }),
      prisma.job.update({
        where: { id: validated.jobId },
        data: {
          lastActivityAt: new Date(),
          alertCycle: 0,
          autoCanceledAlertPending: false
        }
      })
    ]);

    revalidatePath('/jobs');
    revalidatePath(`/jobs/${validated.jobId}`);

    return { success: true };
  } catch (error) {
    console.error('Erro ao registrar acompanhamento:', error);
    return { error: 'Erro ao registrar acompanhamento.' };
  }
}
