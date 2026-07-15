import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { calculateMatch } from "@/lib/match"
import { prisma } from "@/lib/prisma"
import { 
  ArrowLeft, 
  Building2, 
  MapPin,
  History,
  Clock,
  TrendingUp,
  MessageSquare,
  Video,
  Code,
  RefreshCw,
  AlertTriangle,
  FileText
} from "lucide-react"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { GenerateResumeButton } from "../components/generate-resume-button"
import { getSession } from "@/lib/auth"
import { AddActivityDialog } from "@/components/add-activity-dialog"
import { ReactivateJobButton } from "../components/reactivate-job-button"

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
    },
    include: {
      activities: {
        orderBy: {
          date: 'desc'
        }
      }
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

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'status_change':
        return <TrendingUp className="text-primary size-3.5" />;
      case 'callback_received':
        return <MessageSquare className="text-emerald-500 size-3.5" />;
      case 'interview':
        return <Video className="text-purple-500 size-3.5" />;
      case 'technical_test':
        return <Code className="text-blue-500 size-3.5" />;
      case 'reactivation':
        return <RefreshCw className="text-sky-500 size-3.5" />;
      case 'auto_canceled':
        return <AlertTriangle className="text-red-500 size-3.5" />;
      default:
        return <FileText className="text-muted-foreground size-3.5" />;
    }
  };

  const getActivityLabel = (type: string) => {
    switch (type) {
      case 'status_change':
        return 'Alteração de Status';
      case 'callback_received':
        return 'Retorno da Empresa';
      case 'interview':
        return 'Entrevista';
      case 'technical_test':
        return 'Teste Técnico';
      case 'reactivation':
        return 'Reativação';
      case 'auto_canceled':
        return 'Cancelamento Automático';
      default:
        return 'Acompanhamento';
    }
  };

  return (
    <section className="h-full max-w-6xl w-full px-4 mx-auto py-16">

      {job.status === 'cancelado' && (
        <div className="mb-6 p-4 border border-red-200 dark:border-red-950/40 rounded-xl bg-red-50/20 dark:bg-red-950/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="font-semibold text-red-800 dark:text-red-400 text-sm md:text-base">Candidatura Cancelada</h3>
            <p className="text-xs md:text-sm text-red-600 dark:text-red-400/80 mt-1">
              Esta vaga foi cancelada. Para continuar acompanhando-a, reative o processo a qualquer momento.
            </p>
          </div>
          <ReactivateJobButton jobId={job.id} variant="outline" className="border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-950/20" />
        </div>
      )}

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
        <div className="flex flex-col gap-6">
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

          <Card>
            <CardHeader className="flex flex-row justify-between items-center pb-4 border-b">
              <CardTitle className="flex items-center gap-2">
                <History className="size-5 text-muted-foreground" />
                Histórico de Acompanhamento
              </CardTitle>
              {job.status !== 'cancelado' && (
                <AddActivityDialog jobId={job.id} />
              )}
            </CardHeader>
            <CardContent className="pt-6">
              {!job.activities || job.activities.length === 0 ? (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  Nenhuma atividade registrada neste processo seletivo ainda.
                </div>
              ) : (
                <div className="relative pl-6 border-l border-border space-y-6">
                  {job.activities.map((activity) => (
                    <div key={activity.id} className="relative">
                      {/* Indicador na linha do tempo */}
                      <span className="absolute -left-[37px] top-1.5 flex h-6 w-6 items-center justify-center rounded-full border bg-background shadow-sm">
                        {getActivityIcon(activity.type)}
                      </span>
                      
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-foreground">
                            {getActivityLabel(activity.type)}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock size={12} />
                            {new Date(activity.date).toLocaleString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                          {activity.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

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