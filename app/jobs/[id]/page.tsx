import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { calculateMatch } from "@/lib/match"
import { prisma } from "@/lib/prisma"
import { ArrowLeft, Building2, MapPin, WandSparkles } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

interface JobPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function JobPage({ params }: JobPageProps) {

  const { id } = await params

  const job = await prisma.job.findUnique({
    where: {
      id
    }
  })

  if (!job) {
    return notFound()
  }

  const curriculum = await prisma.curriculum.findFirst();

  const match = calculateMatch({

    jobSkills:
      (job?.extractedSkills as string[]) ?? [],

    curriculumSkills: [

      ...(curriculum?.skills ?? []),

      ...(curriculum?.tools ?? [])
    ]
  });

  return (
    <section className="h-full w-300 m-auto py-16">

      <div className="flex justify-between items-end mb-4">
        <div>
          <Link href='/jobs'><Button variant='ghost' className="mb-1"> <ArrowLeft /> Voltar</Button></Link>
          <h1 className="text-3xl font-bold mb-2">{job.jobTitle}</h1>

          <div className="flex items-center gap-4">
            <div className="flex gap-1 items-center">
              <Building2 size={18} />
              {job.nameEnterprise}
            </div>

            <div className="flex gap-1 items-center">
              <MapPin size={18} />
              {job.workModel}
            </div>
          </div>

        </div>

        <Button>
          <WandSparkles />
          Gerar Currículo com IA
        </Button>
      </div>

      <div className="grid grid-cols-[2fr_1fr] gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Informações da Vaga</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
              {job.description}
            </p>
          </CardContent>
        </Card>

        <div className="w-full max-w-100 flex flex-col gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Match da Vaga</CardTitle>
            </CardHeader>
            <CardContent>
              {match.matchScore}%
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Skills Compatíveis</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-2 flex-wrap">
              {match.matchingSkills.map((skill) => (
                <Badge key={skill}>{skill}</Badge>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Skills Faltantes</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-2 flex-wrap">
              {match.missingSkills.map((skill) => (
                <Badge variant='destructive' key={skill}>{skill}</Badge>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}