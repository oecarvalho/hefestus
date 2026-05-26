'use server'

import { prisma } from "@/lib/prisma";
import { calculeMatch } from "./calcule-match";

export async function getDashboardMetrics() {

    const userId = "123";

    const curriculum = await prisma.curriculum.findUnique({
        where: {
            userId,
        },

        select: {
            skills: true,
            tools: true,
        },
    });

    const jobs = await prisma.job.findMany({
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

    const totalJobs = jobs.length;

    const andamento = jobs.filter(
        (job) => job.status === "andamento"
    ).length;

    const rejeitadas = jobs.filter(
        (job) => job.status === "rejeitado"
    ).length;

    const userSkills = [
        ...(curriculum?.skills || []),
        ...(curriculum?.tools || []),
    ];

    const matches = jobs.map((job) => {

        const jobSkills = Array.isArray(job.extractedSkills)
            ? (job.extractedSkills as string[])
            : [];

        const match = calculeMatch({
            userSkills,
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