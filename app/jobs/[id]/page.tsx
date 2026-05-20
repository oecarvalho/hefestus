import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"

interface JobPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function JobPage({
  params
}: JobPageProps) {

  const { id } = await params

  const job = await prisma.job.findUnique({
    where: {
      id
    }
  })

  if (!job) {
    return notFound()
  }

  return (
    <div className="space-y-4">

      <h1 className="text-3xl font-bold">
        {job.jobTitle}
      </h1>

      <p>{job.nameEnterprise}</p>

      <p>{job.workModel}</p>

      <p>{job.description}</p>

    </div>
  )
}