export const dynamic = "force-dynamic";

import {
  BarChart3,
  BriefcaseBusiness,
  Clock3,
  Sparkles,
  WandSparkles,
  Percent,
  AlertTriangle,
  Building2,
  TrendingUp,
  Activity,
  Lightbulb,
  CheckCircle2,
  CalendarDays
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getReportsData } from "./actions/reports-actions";
import { EvolutionChart } from "./components/evolution-chart";

export default async function ReportsPage() {
  const report = await getReportsData();
  const { totalJobs, sampleStatus, overview, funnel, evolution, attentionJobs, technologies, missingSkills, strengths, priorities, companies, averageResponseDetails } = report;

  // Determinar badges de atenção
  const getAttentionBadge = (level: 'attention' | 'alert' | 'critical' | null) => {
    if (!level) return null;
    switch (level) {
      case 'critical':
        return <Badge className="bg-red-500 hover:bg-red-600 text-white">Crítico</Badge>;
      case 'alert':
        return <Badge className="bg-orange-500 hover:bg-orange-600 text-white">Alerta</Badge>;
      case 'attention':
        return <Badge className="bg-amber-500 hover:bg-amber-600 text-white">Atenção</Badge>;
      default:
        return null;
    }
  };

  return (
    <section className="h-full max-w-6xl w-full px-4 mx-auto py-16 space-y-8">
      {/* HEADER & AMOSTRA */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-border/40">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Relatórios</h1>
          <p className="text-sm text-muted-foreground">Insights analíticos sobre o mercado e suas candidaturas.</p>
        </div>
        <div className="flex flex-col items-end gap-1 text-right">
          <Badge variant="outline" className="px-3 py-1 text-xs border-primary/20 bg-primary/5">
            Relatório baseado em {totalJobs} {totalJobs === 1 ? 'vaga cadastrada' : 'vagas cadastradas'}
          </Badge>
          {sampleStatus.isSmall && (
            <span className="text-[10px] text-amber-600 dark:text-amber-400 max-w-xs block leading-tight">
              Os resultados ainda representam uma amostra pequena. Cadastre mais vagas para obter insights mais confiáveis.
            </span>
          )}
        </div>
      </div>

      {/* 1. VISÃO GERAL */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight flex items-center gap-2">
          <Activity className="size-5 text-primary" />
          Visão Geral
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* TOTAL */}
          <Card className="border-t-2 border-t-metal">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase text-muted-foreground font-semibold">Total de Vagas</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-between items-end">
              <span className="text-3xl font-bold text-foreground leading-none">{overview.totalJobs}</span>
              <BriefcaseBusiness className="size-7 text-metal/80" />
            </CardContent>
          </Card>

          {/* TAXA DE RESPOSTA */}
          <Card className="border-t-2 border-t-emerald-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase text-muted-foreground font-semibold">Taxa de Resposta</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-between items-end">
              <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 leading-none">
                {overview.responseRate}%
              </span>
              <Percent className="size-7 text-emerald-500/80" />
            </CardContent>
          </Card>

          {/* TEMPO MÉDIO DE RETORNO */}
          <Card className="border-t-2 border-t-sky-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase text-muted-foreground font-semibold">Tempo de Resposta</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-between items-end">
              <span className="text-3xl font-bold text-sky-600 dark:text-sky-400 leading-none">
                {overview.totalJobs === 0 || overview.responseRate === 0 
                  ? '-' 
                  : `${overview.averageResponseDays}d`}
              </span>
              <Clock3 className="size-7 text-sky-500/80" />
            </CardContent>
          </Card>

          {/* PRECISA DE ATENÇÃO */}
          <Card className={`border-t-2 ${overview.needsAttentionCount > 0 ? 'border-t-rose-500' : 'border-t-border'}`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase text-muted-foreground font-semibold">Precisa de Atenção</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-between items-end">
              <span className={`text-3xl font-bold leading-none ${overview.needsAttentionCount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-muted-foreground'}`}>
                {overview.needsAttentionCount}
              </span>
              <AlertTriangle className={`size-7 ${overview.needsAttentionCount > 0 ? 'text-rose-500/80' : 'text-muted-foreground/50'}`} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 2. ANDAMENTO DAS CANDIDATURAS */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight flex items-center gap-2">
          <TrendingUp className="size-5 text-primary" />
          Andamento das Candidaturas
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* FUNIL */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Funil de candidaturas</CardTitle>
              <CardDescription>Distribuição real de candidaturas nas etapas do processo seletivo.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              {funnel.length === 0 ? (
                <div className="text-center py-8 text-sm text-muted-foreground">Cadastre vagas para visualizar o funil.</div>
              ) : (
                funnel.map((item) => (
                  <div key={item.status} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span>{item.label}</span>
                      <span className="text-muted-foreground">
                        {item.amount} {item.amount === 1 ? 'vaga' : 'vagas'} ({item.percentage}%)
                      </span>
                    </div>
                    <Progress value={item.percentage} className="h-2" />
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* EVOLUÇÃO */}
          <EvolutionChart data={evolution} />
        </div>

        {/* ATENÇÃO LIST */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-1.5">
              <AlertTriangle className="size-5 text-rose-500" />
              Candidaturas que precisam de atenção
            </CardTitle>
            <CardDescription>
              Vagas ativas que estão sem movimentações há 7 dias ou mais.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {attentionJobs.length === 0 ? (
              <div className="flex items-center justify-center py-6 text-center text-sm text-muted-foreground gap-2">
                <CheckCircle2 className="size-5 text-emerald-500" />
                Excelente! Nenhuma candidatura ativa necessita de atenção no momento.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                  <thead>
                    <tr className="border-b text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      <th className="py-3 px-2">Vaga</th>
                      <th className="py-3 px-2">Empresa</th>
                      <th className="py-3 px-2 text-center">Dias sem movimentação</th>
                      <th className="py-3 px-2 text-right">Atenção</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attentionJobs.map((job) => (
                      <tr key={job.id} className="border-b hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-2 font-medium">{job.jobTitle}</td>
                        <td className="py-3 px-2 text-muted-foreground">{job.nameEnterprise}</td>
                        <td className="py-3 px-2 text-center font-mono font-semibold text-rose-600 dark:text-rose-400">
                          {job.daysInactive} {job.daysInactive === 1 ? 'dia' : 'dias'}
                        </td>
                        <td className="py-3 px-2 text-right">{getAttentionBadge(job.attentionLevel)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 3. MERCADO E PERFIL */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight flex items-center gap-2">
          <Sparkles className="size-5 text-primary" />
          Mercado e Perfil
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* COMPETÊNCIAS MAIS PEDIDAS */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Competências mais pedidas nas vagas</CardTitle>
              <CardDescription>Quais habilidades são mais frequentes nas candidaturas cadastradas.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {technologies.length === 0 ? (
                <div className="text-center py-8 text-sm text-muted-foreground">Insira vagas com descrição para extrair competências.</div>
              ) : (
                technologies.map((tech, index) => (
                  <div key={`${tech.name}-${index}`} className="grid grid-cols-[140px_1fr_60px] items-center gap-4">
                    <span className="text-xs font-semibold truncate text-foreground">{tech.name}</span>
                    <Progress value={tech.percentage} className="h-2" />
                    <span className="text-right text-xs font-mono text-muted-foreground whitespace-nowrap">
                      {tech.amount}v ({tech.percentage}%)
                    </span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* COMPETÊNCIAS MAIS PEDIDAS QUE NÃO ESTÃO NO PERFIL */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Competências mais pedidas que não estão no seu perfil</CardTitle>
              <CardDescription>Gaps identificados comparando suas competências com as exigências das vagas.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {missingSkills.length === 0 ? (
                <div className="text-center py-8 text-sm text-muted-foreground">Muito bem! Seu currículo atende a todas as competências mapeadas.</div>
              ) : (
                missingSkills.map((skill, index) => (
                  <div key={`${skill.name}-${index}`} className="grid grid-cols-[140px_1fr_60px] items-center gap-4">
                    <span className="text-xs font-semibold truncate text-foreground">{skill.name}</span>
                    <Progress value={skill.percentage} className="h-2 bg-rose-100 dark:bg-rose-950/20 [&>[data-slot=progress-indicator]]:bg-rose-500" />
                    <span className="text-right text-xs font-mono text-muted-foreground whitespace-nowrap">
                      {skill.amount}v ({skill.percentage}%)
                    </span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* FORÇAS DO PERFIL */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Competências do seu perfil com maior demanda</CardTitle>
            <CardDescription>
              Habilidades do seu currículo que mais aparecem como exigência de mercado nas vagas analisadas.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {strengths.length === 0 ? (
              <div className="text-center py-6 text-sm text-muted-foreground">Cadastre vagas e adicione competências ao seu currículo para calcular.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                {strengths.map((item, index) => (
                  <div key={`${item.name}-${index}`} className="grid grid-cols-[140px_1fr_60px] items-center gap-4">
                    <span className="text-xs font-semibold truncate text-foreground">{item.name}</span>
                    <Progress value={item.percentage} className="h-2 bg-emerald-100 dark:bg-emerald-950/20 [&>[data-slot=progress-indicator]]:bg-emerald-500" />
                    <span className="text-right text-xs font-mono text-muted-foreground">
                      {item.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            )}
            <p className="pt-2 text-xs text-muted-foreground leading-relaxed">
              * O percentual representa a presença desta competência em todas as vagas analisadas. Destaque essas palavras-chave nos seus currículos para maximizar a aderência aos processos.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 4. RECOMENDAÇÕES */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight flex items-center gap-2">
          <Lightbulb className="size-5 text-primary" />
          Recomendações
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* PRIORIDADES DE MATCH */}
          <Card className="h-full flex flex-col justify-between">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Prioridades para aumentar seu match</CardTitle>
              <CardDescription>
                Temas de estudo ou pontos ausentes no perfil que têm maior relevância nas vagas.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
              {priorities.length === 0 ? (
                <div className="text-center py-8 text-sm text-muted-foreground flex-1 flex items-center justify-center">
                  Seu currículo cobre as principais prioridades das vagas cadastradas!
                </div>
              ) : (
                <div className="space-y-3.5">
                  {priorities.map((rec, index) => (
                    <div key={`${rec.name}-${index}`} className="flex items-center justify-between border p-3 rounded-xl hover:bg-muted/10 transition-colors">
                      <div className="space-y-0.5">
                        <p className="font-semibold text-sm">{rec.name}</p>
                        <p className="text-xs text-muted-foreground">{rec.description}</p>
                      </div>
                      <Badge className={
                        rec.priority === 'high' 
                          ? 'bg-rose-500 text-white' 
                          : rec.priority === 'medium'
                            ? 'bg-amber-500 text-white'
                            : 'bg-zinc-500 text-white'
                      }>
                        {rec.priority === 'high' ? 'Alta' : rec.priority === 'medium' ? 'Média' : 'Baixa'}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* TEMPO DE RESPOSTA DETALHADO & EMPRESAS */}
          <div className="flex flex-col gap-4 h-full">
            {/* TEMPO MÉDIO */}
            <Card className="flex-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Tempo de retorno de candidaturas</CardTitle>
              </CardHeader>
              <CardContent>
                {!averageResponseDetails ? (
                  <div className="text-xs text-muted-foreground bg-muted/40 p-4 rounded-xl border space-y-1">
                    <p className="font-semibold text-foreground">Ainda não há dados suficientes</p>
                    <p>Registre uma mudança de status ou um acompanhamento após receber retorno da empresa para calcular o tempo médio de resposta.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-baseline">
                      <span className="text-3xl font-extrabold tracking-tight text-sky-600 dark:text-sky-400">
                        {averageResponseDetails.averageResponseDays} {averageResponseDetails.averageResponseDays === 1 ? 'dia' : 'dias'}
                      </span>
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                        Média de retorno
                      </span>
                    </div>
                    <Progress
                      value={Math.min(averageResponseDetails.averageResponseDays * 6.5, 100)}
                      className="h-2 [&>[data-slot=progress-indicator]]:bg-sky-500"
                    />
                    <div className="grid grid-cols-3 gap-2 pt-1 border-t text-center text-xs">
                      <div>
                        <p className="text-muted-foreground text-[10px] uppercase font-semibold">Analisadas</p>
                        <p className="font-bold text-foreground text-sm">{averageResponseDetails.count}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-[10px] uppercase font-semibold">Mínimo</p>
                        <p className="font-bold text-foreground text-sm">{averageResponseDetails.minResponseDays}d</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-[10px] uppercase font-semibold">Máximo</p>
                        <p className="font-bold text-foreground text-sm">{averageResponseDetails.maxResponseDays}d</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* EMPRESAS */}
            <Card className="flex-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Empresas com melhor taxa de resposta</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col justify-center">
                {companies.length === 0 ? (
                  <div className="text-xs text-muted-foreground bg-muted/40 p-4 rounded-xl border space-y-1">
                    <p className="font-semibold text-foreground">Amostra insuficiente para comparação</p>
                    <p>Cadastre pelo menos 2 candidaturas por empresa ou registre retornos para ver o ranking de taxa de resposta.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {companies.map((company, index) => (
                      <div key={`${company.name}-${index}`} className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <span className="font-medium text-sm">{company.name}</span>
                          <p className="text-xs text-muted-foreground">
                            {company.respondedJobs} {company.respondedJobs === 1 ? 'retorno' : 'retornos'} em {company.totalJobs} {company.totalJobs === 1 ? 'candidatura' : 'candidaturas'}
                          </p>
                        </div>
                        <Badge variant="secondary" className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10">
                          {company.responseRate}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}