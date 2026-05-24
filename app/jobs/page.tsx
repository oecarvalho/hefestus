import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Search } from "lucide-react";
import { CardJobs } from "./components/card-job";
import { prisma } from "@/lib/prisma";
import AddJobsButton from "@/components/add-jobs-button";
import JobsFilter from "./components/jobs-filter";
import JobsSearch from "./components/job-search";

interface JobsPageProps {
    searchParams: Promise<{
        status?: string
        search?: string
    }>
}

export default async function Jobs({ searchParams }: JobsPageProps) {

    const { status, search } = await searchParams

    const jobs = await prisma.job.findMany({
        where: {
            AND: [

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

    return (
        <section className="h-full w-300 m-auto py-16">
            <div className="flex justify-between items-end mb-7">
                <div>
                    <h1 className="text-3xl font-bold">Vagas</h1>
                    <p className="text-muted-foreground text-sm">Gerencie suas candidaturas, acompanhe o match com seu currículo e status de cada processo.</p>
                </div>

                <AddJobsButton />
            </div>
            <div className="flex justify-between gap-5 mb-5">
                <JobsSearch/>
                <JobsFilter />
            </div>

            <div className="grid grid-cols-3 gap-4">

                {jobs.map((job) => (
                    <CardJobs
                        key={job.id}
                        job={job}
                    />
                ))}

            </div>
        </section>
    )
}