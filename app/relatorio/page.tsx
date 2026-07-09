export const dynamic = "force-dynamic";

import {
    BarChart3,
    BriefcaseBusiness,
    Clock3,
    Sparkles,
    TrendingDown,
    WandSparkles,
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

export default async function ReportsPage() {

    const report = await getReportsData();

    return (
        <section className="h-full max-w-6xl w-full px-4 mx-auto py-16">

            {/* HEADER */}
            <div className="flex justify-between items-end mb-8 pb-4 border-b border-border/40">

                <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                        Relatórios
                    </h1>

                    <p className="text-sm text-muted-foreground">
                        Insights sobre o mercado e suas candidaturas.
                    </p>
                </div>

            </div>

            {/* GRID 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

                {/* TECNOLOGIAS */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <BarChart3 className="size-5 text-sky-500" />

                            <CardTitle>
                                Tecnologias mais pedidas
                            </CardTitle>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-5">
                        {report.technologies.map((tech, index) => (
                            <div
                                key={`${tech.name}-${index}`}
                                className="grid grid-cols-[140px_1fr_30px] items-center gap-4"
                            >
                                <span className="text-sm font-medium capitalize">
                                    {tech.name}
                                </span>

                                <Progress value={tech.value} />

                                <span className="text-right text-sm font-semibold">
                                    {tech.amount}
                                </span>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* MISSING SKILLS */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <WandSparkles className="size-5 text-violet-500" />

                            <CardTitle>
                                Tecnologias que faltam no seu perfil
                            </CardTitle>
                        </div>
                    </CardHeader>

                    <CardContent className="flex flex-wrap gap-2">
                        {report.missingSkills.map((skill, index) => (
                            <Badge
                                key={`${skill}-${index}`}
                                variant="secondary"
                                className="rounded-full px-3 py-1"
                            >
                                {skill}
                            </Badge>
                        ))}
                    </CardContent>
                </Card>

                {/* EMPRESAS */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <BriefcaseBusiness className="size-5 text-amber-500" />

                            <CardTitle>
                                Empresas com mais retorno
                            </CardTitle>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {report.companies.map((company, index) => (
                            <div
                                key={`${company.name}-${index}`}
                                className="flex items-center justify-between"
                            >
                                <span className="font-medium">
                                    {company.name}
                                </span>

                                <span className="text-sm text-muted-foreground">
                                    {company.andamento}/{company.total} ativas
                                </span>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* TEMPO MÉDIO */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Clock3 className="size-5 text-sky-500" />

                            <CardTitle>
                                Tempo médio de resposta
                            </CardTitle>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {(() => {
                            const getResponseDaysColors = (days: number) => {
                                if (days === 0) return {
                                    indicator: "[&>[data-slot=progress-indicator]]:bg-zinc-300",
                                    text: "text-zinc-500",
                                    label: "Sem retorno cadastrado"
                                };
                                if (days < 5) return {
                                    indicator: "[&>[data-slot=progress-indicator]]:bg-emerald-500",
                                    text: "text-emerald-600 dark:text-emerald-400",
                                    label: "Excelente tempo de retorno"
                                };
                                if (days <= 10) return {
                                    indicator: "[&>[data-slot=progress-indicator]]:bg-amber-500",
                                    text: "text-amber-600 dark:text-amber-400",
                                    label: "Tempo de retorno aceitável"
                                };
                                return {
                                    indicator: "[&>[data-slot=progress-indicator]]:bg-rose-500",
                                    text: "text-rose-600 dark:text-rose-400",
                                    label: "Tempo de retorno lento"
                                };
                            };
                            const daysConfig = getResponseDaysColors(report.averageResponseDays);
                            return (
                                <div className="space-y-2">
                                    <div className="flex justify-between items-baseline">
                                        <span className={`text-2xl font-extrabold tracking-tight ${daysConfig.text}`}>
                                            {report.averageResponseDays} {report.averageResponseDays === 1 ? 'dia' : 'dias'}
                                        </span>
                                        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                                            {daysConfig.label}
                                        </span>
                                    </div>
                                    <Progress
                                        value={Math.min(
                                            report.averageResponseDays * 10,
                                            100
                                        )}
                                        className={`h-2.5 w-full ${daysConfig.indicator}`}
                                    />
                                    <CardDescription className="text-xs pt-1">
                                        Tempo médio entre o cadastro e a primeira mudança de status (Meta: &lt; 5 dias).
                                    </CardDescription>
                                </div>
                            );
                        })()}
                    </CardContent>
                </Card>
            </div>

            {/* GRID 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

                {/* FORÇAS */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Sparkles className="size-5 text-emerald-500" />

                            <CardTitle>
                                Suas forças no mercado
                            </CardTitle>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-5">
                        {report.strengths.map((item, index) => (
                            <div
                                key={`${item.name}-${index}`}
                                className="grid grid-cols-[120px_1fr_50px] items-center gap-4"
                            >
                                <span className="text-sm font-medium capitalize">
                                    {item.name}
                                </span>

                                <Progress value={item.value} />

                                <span className="text-right text-sm font-semibold">
                                    {item.value}%
                                </span>
                            </div>
                        ))}

                        <p className="pt-2 text-sm text-muted-foreground">
                            Skills suas que aparecem em ≥20% das vagas —
                            destaque-as no topo do CV.
                        </p>
                    </CardContent>
                </Card>

                {/* DECAY WATCH */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <TrendingDown className="size-5 text-red-500" />

                            <CardTitle>
                                Decay Watch
                            </CardTitle>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {report.decayWatch.map((skill, index) => (
                            <div
                                key={`${skill}-${index}`}
                                className="flex items-center justify-between rounded-xl border p-4"
                            >
                                <span className="font-medium capitalize">
                                    {skill}
                                </span>

                                <Badge
                                    variant="destructive"
                                    className="rounded-full"
                                >
                                    obsoleto · 0%
                                </Badge>
                            </div>
                        ))}

                        <p className="pt-2 text-sm text-muted-foreground">
                            Skills no CV com pouca/nenhuma presença em vagas
                            dos últimos 60d.
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* SKILLS ADJACENTES */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Sparkles className="size-5 text-sky-500" />

                        <CardTitle>
                            Skills adjacentes
                        </CardTitle>
                    </div>
                </CardHeader>

                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {report.adjacentSkills.map((item, index) => (
                            <div
                                key={`${item.skill}-${index}`}
                                className="flex items-center justify-between rounded-xl border p-4"
                            >
                                <div>
                                    <p className="font-semibold capitalize">
                                        {item.skill}
                                    </p>

                                    <p className="text-sm text-muted-foreground">
                                        aparece com {item.relation}
                                    </p>
                                </div>

                                <Badge
                                    variant="outline"
                                    className="rounded-full"
                                >
                                    {item.value}%
                                </Badge>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

        </section>
    );
}