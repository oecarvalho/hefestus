'use server'

import { prisma } from "@/lib/prisma";

export async function getReportsData() {

    const jobs = await prisma.job.findMany({
        select: {
            id: true,
            status: true,
            extractedSkills: true,
            nameEnterprise: true,
            date: true,
        }
    });

    const curriculum = await prisma.curriculum.findFirst({
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

    const companiesMap: Record<string, number> = {};

    jobs.forEach((job) => {

        const company = job.nameEnterprise;

        companiesMap[company] =
            (companiesMap[company] || 0) + 1;
    });

    const companies = Object.entries(companiesMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, amount]) => ({
            name,
            amount,
        }));

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
            relation: "suas skills",
            value: Math.min(amount * 20, 100),
        }));

    // =========================
    // TEMPO MÉDIO
    // =========================

    const averageResponseDays = 7;

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