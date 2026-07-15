'use server'
import { unstable_noStore as noStore } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { normalizeSkillName } from "@/lib/normalize-skill";

export async function getReportsData() {
    noStore();
    const session = await getSession();
    if (!session) {
        return {
            totalJobs: 0,
            sampleStatus: { total: 0, isSmall: true },
            overview: { totalJobs: 0, responseRate: 0, averageResponseDays: 0, needsAttentionCount: 0 },
            funnel: [],
            evolution: [],
            attentionJobs: [],
            technologies: [],
            missingSkills: [],
            strengths: [],
            priorities: [],
            companies: [],
            averageResponseDetails: null,
        };
    }
    const userId = session.userId;

    // Buscar todos os jobs com suas respectivas atividades
    const jobs = await prisma.job.findMany({
        where: {
            userId
        },
        include: {
            activities: {
                orderBy: {
                    date: 'asc'
                }
            }
        }
    });

    const curriculum = await prisma.curriculum.findUnique({
        where: {
            userId
        },
        select: {
            skills: true,
            tools: true,
        }
    });

    const totalJobs = jobs.length;
    const isSampleSmall = totalJobs < 5;

    // ============================================
    // NORMALIZAÇÃO DE COMPETÊNCIAS DO USUÁRIO
    // ============================================
    const userSkillsSet = new Set(
        [
            ...(curriculum?.skills || []),
            ...(curriculum?.tools || []),
        ].map(skill => normalizeSkillName(skill))
    );

    // ============================================
    // NORMALIZAÇÃO DE COMPETÊNCIAS DAS VAGAS
    // ============================================
    const jobsSkillsNormalized = jobs.map(job => {
        const skills = Array.isArray(job.extractedSkills)
            ? (job.extractedSkills as string[])
            : [];
        // Dedup por vaga após normalizar
        const normalizedSet = new Set(skills.map(s => normalizeSkillName(s)));
        return {
            jobId: job.id,
            skills: Array.from(normalizedSet)
        };
    });

    // Calcular frequências de cada competência
    const skillFrequencies: Record<string, { amount: number; percentage: number; jobsWithSkill: string[] }> = {};

    jobsSkillsNormalized.forEach(({ jobId, skills }) => {
        skills.forEach(skill => {
            if (!skillFrequencies[skill]) {
                skillFrequencies[skill] = { amount: 0, percentage: 0, jobsWithSkill: [] };
            }
            skillFrequencies[skill].amount += 1;
            skillFrequencies[skill].jobsWithSkill.push(jobId);
        });
    });

    Object.keys(skillFrequencies).forEach(skill => {
        const freq = skillFrequencies[skill];
        freq.percentage = totalJobs > 0 ? Math.round((freq.amount / totalJobs) * 100) : 0;
    });

    // 1. Competências mais pedidas nas vagas
    const technologies = Object.entries(skillFrequencies)
        .map(([name, freq]) => ({
            name,
            amount: freq.amount,
            percentage: freq.percentage
        }))
        .sort((a, b) => b.amount - a.amount || a.name.localeCompare(b.name))
        .slice(0, 12);

    // 2. Competências mais pedidas que não estão no perfil (Missing Skills)
    const missingSkills = Object.entries(skillFrequencies)
        .filter(([name]) => !userSkillsSet.has(name))
        .map(([name, freq]) => ({
            name,
            amount: freq.amount,
            percentage: freq.percentage
        }))
        .sort((a, b) => b.amount - a.amount || a.name.localeCompare(b.name))
        .slice(0, 10);

    // 3. Competências do seu perfil com maior demanda
    const strengths = Array.from(userSkillsSet)
        .map(name => {
            const freq = skillFrequencies[name] || { amount: 0, percentage: 0 };
            return {
                name,
                amount: freq.amount,
                percentage: freq.percentage
            };
        })
        .filter(item => item.amount > 0)
        .sort((a, b) => b.amount - a.amount || a.name.localeCompare(b.name))
        .slice(0, 8);

    // 4. Prioridades para aumentar seu match (cruza ausência, relevância e frequência)
    const priorities = Object.entries(skillFrequencies)
        .filter(([name]) => !userSkillsSet.has(name))
        .map(([name, freq]) => {
            let priority: 'high' | 'medium' | 'low' = 'low';
            if (freq.percentage >= 50) {
                priority = 'high';
            } else if (freq.percentage >= 25) {
                priority = 'medium';
            }
            return {
                name,
                percentage: freq.percentage,
                amount: freq.amount,
                priority,
                description: `Ausente no perfil e solicitado em ${freq.percentage}% das vagas.`
            };
        })
        .sort((a, b) => {
            const priorityOrder = { high: 0, medium: 1, low: 2 };
            if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            }
            return b.percentage - a.percentage || a.name.localeCompare(b.name);
        })
        .slice(0, 6);

    // ============================================
    // DETERMINAR RETORNOS E TEMPOS DE RESPOSTA
    // ============================================
    const jobsWithResponseData = jobs.map(job => {
        // Retorno: atividade específica de contato/entrevista/teste ou mudança de status para andamento/rejeitado
        const responseActivities = job.activities.filter(act => 
            act.type === 'callback_received' ||
            act.type === 'interview' ||
            act.type === 'technical_test' ||
            (act.type === 'status_change' && (
                act.description.toLowerCase().includes('andamento') || 
                act.description.toLowerCase().includes('rejeitado')
            ))
        );

        let firstResponseDate: Date | null = null;
        if (responseActivities.length > 0) {
            firstResponseDate = new Date(Math.min(...responseActivities.map(a => new Date(a.date).getTime())));
        } else if (job.status === 'andamento' || job.status === 'rejeitado') {
            firstResponseDate = new Date(job.updatedAt);
        }

        const hasResponse = firstResponseDate !== null;
        let responseTimeDays: number | null = null;

        if (hasResponse && firstResponseDate) {
            const diffMs = firstResponseDate.getTime() - new Date(job.date).getTime();
            responseTimeDays = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
        }

        return {
            ...job,
            hasResponse,
            firstResponseDate,
            responseTimeDays
        };
    });

    const respondedJobsList = jobsWithResponseData.filter(j => j.hasResponse && j.responseTimeDays !== null);
    
    let averageResponseDays = 0;
    let averageResponseDetails = null;

    if (respondedJobsList.length > 0) {
        const responseDays = respondedJobsList.map(j => j.responseTimeDays as number);
        const totalDays = responseDays.reduce((sum, val) => sum + val, 0);
        averageResponseDays = Math.round(totalDays / respondedJobsList.length);
        
        averageResponseDetails = {
            averageResponseDays,
            count: respondedJobsList.length,
            minResponseDays: Math.min(...responseDays),
            maxResponseDays: Math.max(...responseDays)
        };
    }

    const totalRespondedCount = jobsWithResponseData.filter(j => j.hasResponse).length;
    const responseRate = totalJobs > 0 ? Math.round((totalRespondedCount / totalJobs) * 100) : 0;

    // ============================================
    // CANDIDATURAS QUE PRECISAM DE ATENÇÃO
    // ============================================
    const now = new Date();
    const attentionJobs = jobs
        .filter(job => job.status === 'aplicado' || job.status === 'andamento')
        .map(job => {
            const diffMs = now.getTime() - new Date(job.lastActivityAt).getTime();
            const daysInactive = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            
            let attentionLevel: 'attention' | 'alert' | 'critical' | null = null;
            if (daysInactive >= 21 && daysInactive < 30) {
                attentionLevel = 'critical';
            } else if (daysInactive >= 14 && daysInactive < 21) {
                attentionLevel = 'alert';
            } else if (daysInactive >= 7 && daysInactive < 14) {
                attentionLevel = 'attention';
            }

            return {
                id: job.id,
                jobTitle: job.jobTitle,
                nameEnterprise: job.nameEnterprise,
                daysInactive,
                attentionLevel
            };
        })
        .filter(job => job.attentionLevel !== null)
        .sort((a, b) => b.daysInactive - a.daysInactive); // Mais dias inativos primeiro

    // ============================================
    // FUNIL DE CANDIDATURAS
    // ============================================
    const statusKeys = ['aplicado', 'andamento', 'rejeitado', 'cancelado'];
    const statusLabels: Record<string, string> = {
        aplicado: 'Aplicada',
        andamento: 'Em Andamento / Entrevista',
        rejeitado: 'Rejeitada',
        cancelado: 'Cancelada'
    };

    const funnel = statusKeys.map(status => {
        const amount = jobs.filter(j => j.status === status).length;
        const percentage = totalJobs > 0 ? Math.round((amount / totalJobs) * 100) : 0;
        return {
            status,
            label: statusLabels[status],
            amount,
            percentage
        };
    });

    // ============================================
    // EVOLUÇÃO DAS CANDIDATURAS (ÚLTIMAS 4 SEMANAS)
    // ============================================
    const evolution = [];
    const intervals = [
        { label: 'Há 3 semanas', start: 30, end: 22 },
        { label: 'Há 2 semanas', start: 21, end: 15 },
        { label: 'Há 1 semana', start: 14, end: 8 },
        { label: 'Esta semana', start: 7, end: 0 }
    ];

    for (const interval of intervals) {
        const startDate = new Date(now);
        startDate.setDate(startDate.getDate() - interval.start);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(now);
        endDate.setDate(endDate.getDate() - interval.end);
        endDate.setHours(23, 59, 59, 999);

        const realizadas = jobs.filter(j => {
            const d = new Date(j.date);
            return d >= startDate && d <= endDate;
        }).length;

        const respostas = jobsWithResponseData.filter(j => {
            if (!j.hasResponse || !j.firstResponseDate) return false;
            const d = new Date(j.firstResponseDate);
            return d >= startDate && d <= endDate;
        }).length;

        const entrevistas = jobs.filter(j => {
            return j.activities.some(act => {
                if (act.type !== 'interview') return false;
                const d = new Date(act.date);
                return d >= startDate && d <= endDate;
            });
        }).length;

        evolution.push({
            period: interval.label,
            realizadas,
            respostas,
            entrevistas
        });
    }

    // ============================================
    // EMPRESAS COM MELHOR TAXA DE RESPOSTA
    // ============================================
    const companiesMap: Record<string, { originalName: string; totalJobs: number; respondedJobs: number }> = {};
    
    jobsWithResponseData.forEach(job => {
        const name = job.nameEnterprise.trim();
        const key = name.toLowerCase();
        if (!companiesMap[key]) {
            companiesMap[key] = { originalName: name, totalJobs: 0, respondedJobs: 0 };
        }
        companiesMap[key].totalJobs += 1;
        if (job.hasResponse) {
            companiesMap[key].respondedJobs += 1;
        }
    });

    const hasSufficientSample = Object.values(companiesMap).some(c => c.totalJobs >= 2);
    
    let companies: any[] = [];
    if (hasSufficientSample) {
        companies = Object.values(companiesMap)
            .map(c => ({
                name: c.originalName,
                totalJobs: c.totalJobs,
                respondedJobs: c.respondedJobs,
                responseRate: Math.round((c.respondedJobs / c.totalJobs) * 100)
            }))
            .sort((a, b) => b.responseRate - a.responseRate || b.totalJobs - a.totalJobs || a.name.localeCompare(b.name))
            .slice(0, 5);
    }

    return {
        totalJobs,
        sampleStatus: {
            total: totalJobs,
            isSmall: isSampleSmall
        },
        overview: {
            totalJobs,
            responseRate,
            averageResponseDays,
            needsAttentionCount: attentionJobs.length
        },
        funnel,
        evolution,
        attentionJobs,
        technologies,
        missingSkills,
        strengths,
        priorities,
        companies,
        averageResponseDetails
    };
}