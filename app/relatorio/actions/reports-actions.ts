'use server'
import { unstable_noStore as noStore } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function getReportsData() {
    noStore();
    const session = await getSession();
    if (!session) {
        return {
            technologies: [],
            missingSkills: [],
            companies: [],
            strengths: [],
            decayWatch: [],
            adjacentSkills: [],
            averageResponseDays: 0,
        };
    }
    const userId = session.userId;

    const jobs = await prisma.job.findMany({
        where: {
            userId
        },
        select: {
            id: true,
            status: true,
            extractedSkills: true,
            nameEnterprise: true,
            date: true,
            updatedAt: true,
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

    // =========================
    // TODAS AS SKILLS DAS VAGAS
    // =========================

    const allJobSkills = jobs.flatMap((job) =>
        Array.isArray(job.extractedSkills)
            ? (job.extractedSkills as string[])
            : []
    );

    // =========================
    // SKILLS DO USUÁRIO
    // =========================

    const userSkills = [
        ...(curriculum?.skills || []),
        ...(curriculum?.tools || []),
    ].map((skill) => skill.toLowerCase());

    // =========================
    // CONTAGEM DE TECNOLOGIAS
    // =========================

    const technologiesMap: Record<string, number> = {};

    allJobSkills.forEach((skill) => {

        const normalized = skill.toLowerCase();

        technologiesMap[normalized] =
            (technologiesMap[normalized] || 0) + 1;
    });

    const maxOccurrences = Math.max(
        ...Object.values(technologiesMap),
        1
    );

    const technologies = Object.entries(technologiesMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 12)
        .map(([name, amount]) => ({
            name,
            amount,
            value: Math.round(
                (amount / maxOccurrences) * 100
            ),
        }));

    // =========================
    // MISSING SKILLS
    // =========================

    const missingSkills = Object.entries(technologiesMap)
        .filter(([skill]) =>
            !userSkills.includes(skill.toLowerCase())
        )
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([skill, amount]) =>
            `${skill} ×${amount}`
        );

    // =========================
    // EMPRESAS
    // =========================

    const companiesMap = new Map();

    jobs.forEach((job) => {

        const companyName =
            job.nameEnterprise?.toLowerCase();

        if (!companyName) return;

        const existing =
            companiesMap.get(companyName);

        if (existing) {

            existing.total += 1;

            if (job.status === "andamento") {
                existing.andamento += 1;
            }

        } else {

            companiesMap.set(companyName, {
                name: job.nameEnterprise,
                total: 1,
                andamento:
                    job.status === "andamento"
                        ? 1
                        : 0,
            });
        }
    });

    const companies = Array.from(
        companiesMap.values()
    )
        .sort((a, b) => b.total - a.total)
        .slice(0, 5);


    // =========================
    // FORÇAS DO PERFIL
    // =========================

    const strengths = userSkills.map((skill) => {

        const occurrences = allJobSkills.filter(
            (jobSkill) =>
                jobSkill.toLowerCase() ===
                skill.toLowerCase()
        ).length;

        const value =
            maxOccurrences > 0
                ? Math.round(
                    (occurrences / maxOccurrences) * 100
                )
                : 0;

        return {
            name: skill,
            value,
        };
    })
        .filter((item) => item.value > 0)
        .sort((a, b) => b.value - a.value)
        .slice(0, 6);

    // =========================
    // DECAY WATCH
    // =========================

    const decayWatch = userSkills.filter((skill) => {

        const existsInJobs = allJobSkills.some(
            (jobSkill) =>
                jobSkill.toLowerCase() ===
                skill.toLowerCase()
        );

        return !existsInJobs;
    });

    // =========================
    // ADJACENT SKILLS
    // =========================

    const adjacentSkillsMap: Record<string, number> = {};

    jobs.forEach((job) => {

        const skills =
            Array.isArray(job.extractedSkills)
                ? (job.extractedSkills as string[])
                : [];

        skills.forEach((skill) => {

            const normalizedSkill =
                skill.toLowerCase();

            if (
                !userSkills.includes(normalizedSkill)
            ) {

                adjacentSkillsMap[normalizedSkill] =
                    (adjacentSkillsMap[normalizedSkill] || 0) + 1;
            }
        });
    });

    const adjacentSkills = Object.entries(adjacentSkillsMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([skill, amount]) => ({
            skill,
            relation: "presença nas vagas",
            value: jobs.length > 0 ? Math.round((amount / jobs.length) * 100) : 0,
        }));

    // =========================
    // TEMPO MÉDIO DE RESPOSTA REAL
    // =========================

    const jobsWithResponse = jobs.filter(
        (job) => job.status !== "aplicado"
    );

    let averageResponseDays = 0;
    if (jobsWithResponse.length > 0) {
        const totalDays = jobsWithResponse.reduce((sum, job) => {
            const diffTime = Math.abs(new Date(job.updatedAt).getTime() - new Date(job.date).getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return sum + diffDays;
        }, 0);
        averageResponseDays = Math.round(totalDays / jobsWithResponse.length);
    }

    return {
        technologies,
        missingSkills,
        companies,
        strengths,
        decayWatch,
        adjacentSkills,
        averageResponseDays,
    };
}