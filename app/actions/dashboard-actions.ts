'use server'

import { prisma } from "@/lib/prisma";
import { calculateMatch } from "@/lib/match";
import { unstable_noStore as noStore } from "next/cache";
import { getSession } from "@/lib/auth";
type DashboardJob = {
    id: string;
    status: string;
    extractedSkills: unknown;
    date: Date;
};

export async function getDashboardMetrics() {
noStore();
    const session = await getSession();
    if (!session) {
        return {
            totalJobs: 0,
            andamento: 0,
            rejeitadas: 0,
            averageMatch: 0,
            jobs: [],
        };
    }
    const userId = session.userId;

    const curriculum = await prisma.curriculum.findUnique({
        where: {
            userId,
        },

        select: {
            skills: true,
            tools: true,
        },
    });

    const jobsRaw = await prisma.job.findMany({
        where: {
            userId,
        },
        orderBy: {
            date: "desc",
        },

        select: {
            id: true,
            status: true,
            extractedSkills: true,
            date: true,
        },
    });

    const jobs: DashboardJob[] = jobsRaw;

    const totalJobs = jobs.length;

    const andamento = jobs.filter(
        (job: DashboardJob) => job.status === "andamento"
    ).length;

    const rejeitadas = jobs.filter(
        (job: DashboardJob) => job.status === "rejeitado"
    ).length;

    const userSkills = [
        ...(curriculum?.skills || []),
        ...(curriculum?.tools || []),
    ];

    const matches = jobs.map((job: DashboardJob) => {

        const jobSkills = Array.isArray(job.extractedSkills)
            ? (job.extractedSkills as string[])
            : [];

        const match = calculateMatch({
            curriculumSkills: userSkills,
            jobSkills,
        });

        return match.matchScore;
    });

    const averageMatch = matches.length > 0
        ? Math.round(
            matches.reduce((acc, curr) => acc + curr, 0)
            / matches.length
        )
        : 0;

    return {
        totalJobs,
        andamento,
        rejeitadas,
        averageMatch,
        jobs,
    };
}