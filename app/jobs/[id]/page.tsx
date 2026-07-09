import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { calculateMatch } from "@/lib/match"
import { prisma } from "@/lib/prisma"
import { ArrowLeft, Building2, MapPin } from "lucide-react"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { GenerateResumeButton } from "../components/generate-resume-button"
import { getSession } from "@/lib/auth"

interface JobPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function JobPage({ params }: JobPageProps) {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }

  const { id } = await params

  const job = await prisma.job.findUnique({
    where: {
      id
    }
  })

  if (!job || job.userId !== session.userId) {
    return notFound()
  }

  const curriculum = await prisma.curriculum.findUnique({
    where: {
      userId: session.userId
    }
  });

  const match = calculateMatch({

    jobSkills:
      (job?.extractedSkills as string[]) ?? [],

    curriculumSkills: [

      ...(curriculum?.skills ?? []),

      ...(curriculum?.tools ?? [])
    ]
  });



  const getMatchDetails = (score: number) => {
    if (score >= 75) {
      return {
        textClass: "text-emerald-600 dark:text-emerald-400",
        indicatorClass: "[&>[data-slot=progress-indicator]]:bg-emerald-500",
        label: "Aderência Excelente"
      };
    }
    if (score >= 45) {
      return {
        textClass: "text-primary",
        indicatorClass: "[&>[data-slot=progress-indicator]]:bg-primary",
        label: "Aderência Média"
      };
    }
    return {
      textClass: "text-rose-600 dark:text-rose-400",
      indicatorClass: "[&>[data-slot=progress-indicator]]:bg-rose-500",
      label: "Aderência Baixa"
    };
  };

  const matchDetails = getMatchDetails(match.matchScore);

  return (
    <section className="h-full max-w-6xl w-full px-4 mx-auto py-16">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6">
        <div>
          <Button variant="ghost" className="mb-1 gap-2" asChild>
            <Link href="/jobs">
              <ArrowLeft size={16} />
              Voltar
            </Link>
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">{job.jobTitle}</h1>

          <div className="flex items-center gap-4 flex-wrap text-sm text-muted-foreground">
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

        <GenerateResumeButton 
          jobId={job.id} 
          userId={session.userId}
          jobTitle={job.jobTitle}
          nameEnterprise={job.nameEnterprise}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6">
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

        <div className="w-full flex flex-col gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Match da Vaga</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="flex items-baseline justify-between">
                <span className={`text-3xl font-extrabold tracking-tight ${matchDetails.textClass}`}>
                  {match.matchScore}%
                </span>
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  {matchDetails.label}
                </span>
              </div>
              <Progress 
                value={match.matchScore} 
                className={`h-2 w-full ${matchDetails.indicatorClass}`}
              />
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