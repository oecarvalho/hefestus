import AddJobsButton from "@/components/add-jobs-button";
import { GraficoAplicacoes } from "@/components/chart/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, CheckCheck, CircleX, TrendingUp } from "lucide-react";
import { getDashboardMetrics } from "@/app/actions/dashboard-actions";

export default async function Home() {

  const metrics = await getDashboardMetrics();

  return (
    <section className="h-full max-w-6xl w-full px-4 mx-auto py-16">
      <div className="flex justify-between items-end mb-8 pb-4 border-b border-border/40">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">Painel Geral</h1>
          <p className="text-sm text-muted-foreground">
            Acompanhe suas candidaturas e metas de resposta.
          </p>
        </div>

        <AddJobsButton/>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="gap-2 border-t-2 border-t-metal">
          <CardHeader >
            <CardTitle className="text-xs uppercase text-muted-foreground">Total de Vagas</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-between">
            <span className="text-4xl font-bold text-metal">{metrics.totalJobs}</span>
            <Briefcase size={40} className="text-metal/80" />
          </CardContent>
        </Card>

        <Card className="gap-2 border-t-2 border-t-emerald-500">
          <CardHeader >
            <CardTitle className="text-xs uppercase text-muted-foreground">Em andamento</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-between">
            <span className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">{metrics.andamento}</span>
            <TrendingUp size={40} className="text-emerald-500/80 dark:text-emerald-400/80" />
          </CardContent>
        </Card>

        <Card className="gap-2 border-t-2 border-t-rose-500">
          <CardHeader >
            <CardTitle className="text-xs uppercase text-muted-foreground">Rejeitadas</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-between">
            <span className="text-4xl font-bold text-rose-600 dark:text-rose-400">{metrics.rejeitadas}</span>
            <CircleX size={40} className="text-rose-500/80 dark:text-rose-400/80" />
          </CardContent>
        </Card>

        <Card className="gap-2 border-t-2 border-t-primary">
          <CardHeader >
            <CardTitle className="text-xs uppercase text-muted-foreground">Match Médio</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-between">
            <span className="text-4xl font-bold text-primary">{metrics.averageMatch}%</span>
            <CheckCheck size={40} className="text-primary/80" />
          </CardContent>
        </Card>
      </div>

      <GraficoAplicacoes jobs={metrics.jobs}/>
    </section>
  );
}
