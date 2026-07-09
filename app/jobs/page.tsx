
import { CardJobs } from "./components/card-job";
import { prisma } from "@/lib/prisma";
import AddJobsButton from "@/components/add-jobs-button";
import JobsFilter from "./components/jobs-filter";
import JobsSearch from "./components/job-search";
import { calculateMatch } from "@/lib/match";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

interface JobsPageProps {
    searchParams: Promise<{
        status?: string
        search?: string
    }>
}

import { Briefcase } from "lucide-react";

export default async function Jobs({ searchParams }: JobsPageProps) {
    const session = await getSession();
    if (!session) {
        redirect('/login');
    }
    const userId = session.userId;

    const { status, search } = await searchParams

    const jobs = await prisma.job.findMany({
        where: {
            AND: [
                { userId },
                status
                    ? { status }
                    : {},

                search
                    ? {
                        OR: [
                            {
                                jobTitle: {
                                    contains: search,
                                    mode: 'insensitive'
                                }
                            },

                            {
                                nameEnterprise: {
                                    contains: search,
                                    mode: 'insensitive'
                                }
                            }
                        ]
                    }
                    : {}
            ]
        }
    })

    const curriculum = await prisma.curriculum.findUnique({
        where: { userId }
    });

    const jobsWithMatch = jobs.map((job) => {

        const match = calculateMatch({

            jobSkills:
                (job.extractedSkills as string[]) ?? [],

            curriculumSkills: [

                ...(curriculum?.skills ?? []),

                ...(curriculum?.tools ?? [])
            ]
        });

        return {
            ...job,
            match
        };
    });

    return (
        <section className="h-full max-w-6xl w-full px-4 mx-auto py-16">
            <div className="flex justify-between items-end mb-8 pb-4 border-b border-border/40">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Vagas</h1>
                    <p className="text-sm text-muted-foreground">Gerencie suas candidaturas, acompanhe o match com seu currículo e status de cada processo.</p>
                </div>

                <AddJobsButton />
            </div>
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-5">
                <JobsSearch />
                <JobsFilter />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                {jobsWithMatch.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center text-center py-16 px-4 bg-muted/20 border rounded-xl gap-3">
                        <div className="rounded-full bg-muted p-4 text-muted-foreground">
                            <Briefcase size={32} />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-lg font-semibold">Nenhuma vaga encontrada</h3>
                            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                                Não encontramos candidaturas correspondentes à busca ou filtros selecionados. Tente buscar por outro termo ou limpar os filtros de status!
                            </p>
                        </div>
                    </div>
                ) : (
                    jobsWithMatch.map((job) => (
                        <CardJobs
                            key={job.id}
                            job={job}
                            match={job.match}
                        />
                    ))
                )}

            </div>
        </section>
    )
}