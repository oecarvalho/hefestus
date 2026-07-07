
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
        <section className="h-full max-w-6xl w-full px-4 m-auto py-16">
            <div className="flex justify-between items-end mb-7">
                <div>
                    <h1 className="text-3xl font-bold">Vagas</h1>
                    <p className="text-muted-foreground text-sm">Gerencie suas candidaturas, acompanhe o match com seu currículo e status de cada processo.</p>
                </div>

                <AddJobsButton />
            </div>
            <div className="flex justify-between gap-5 mb-5">
                <JobsSearch />
                <JobsFilter />
            </div>

            <div className="grid grid-cols-3 gap-4">

                {jobsWithMatch.map((job) => (
                    <CardJobs
                        key={job.id}
                        job={job}
                        match={job.match}
                    />
                ))}

            </div>
        </section>
    )
}