import AddJobsButton from "@/components/add-jobs-button";
import { GraficoAplicacoes } from "@/components/chart/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, CheckCheck, CircleX, TrendingUp } from "lucide-react";
import { getDashboardMetrics } from "@/app/actions/dashboard-actions";

export default async function Home() {

  const metrics = await getDashboardMetrics();

  return (
    <section className="h-full max-w-6xl w-full px-4 m-auto py-16">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground text-sm">Visão geral das suas candidaturas e performance.</p>
        </div>
 
        <AddJobsButton/>
      </div>

      <div className="grid grid-cols-4 gap-4 my-6">
        <Card className="gap-2">
          <CardHeader >
            <CardTitle className="text-xs uppercase text-muted-foreground">Total de Vagas</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-between">
            <span className="text-4xl font-bold text-blue-400">{metrics.totalJobs}</span>
            <Briefcase size={40} className="text-blue-400" />
          </CardContent>
        </Card>

        <Card className="gap-2">
          <CardHeader >
            <CardTitle className="text-xs uppercase text-muted-foreground">Em andamento</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-between">
            <span className="text-4xl font-bold text-green-400">{metrics.andamento}</span>
            <TrendingUp size={40} className="text-green-400" />
          </CardContent>
        </Card>

        <Card className="gap-2">
          <CardHeader >
            <CardTitle className="text-xs uppercase text-muted-foreground">Rejeitadas</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-between">
            <span className="text-4xl font-bold text-red-400">{metrics.rejeitadas}</span>
            <CircleX size={40} className="text-red-400" />
          </CardContent>
        </Card>

        <Card className="gap-2">
          <CardHeader >
            <CardTitle className="text-xs uppercase text-muted-foreground">Match Médio</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-between">
            <span className="text-4xl font-bold text-orange-400">{metrics.averageMatch}%</span>
            <CheckCheck size={40} className="text-orange-400" />
          </CardContent>
        </Card>
      </div>

      <GraficoAplicacoes jobs={metrics.jobs}/>
    </section>
  );
}
