'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Building2, Cpu, BarChart3, PieChart, Star } from "lucide-react";
import { RankingItem, DistributionItem } from "@/app/actions/market-actions";

interface MarketDashboardProps {
  metrics: {
    totalVacancies: number;
    totalCompanies: number;
    totalTechnologies: number;
  };
  rankings: {
    hardSkills: RankingItem[];
    softSkills: RankingItem[];
    languages: RankingItem[];
    frameworks: RankingItem[];
    libraries: RankingItem[];
    tools: RankingItem[];
    databases: RankingItem[];
    cloud: RankingItem[];
    tests: RankingItem[];
    devops: RankingItem[];
    methodologies: RankingItem[];
    otherTech: RankingItem[];
  };
  distributions: {
    seniority: DistributionItem[];
    workModel: DistributionItem[];
    benefits: DistributionItem[];
  };
  isCompanyFiltered: boolean;
}

export function MarketDashboard({
  metrics,
  rankings,
  distributions,
  isCompanyFiltered,
}: MarketDashboardProps) {

  const renderRankingCard = (title: string, list: RankingItem[], colorClass = "bg-primary") => {
    return (
      <Card className="border border-border/50 shadow-sm">
        <CardHeader className="pb-3 pt-4">
          <CardTitle className="text-sm font-semibold flex items-center justify-between">
            {title}
            <Badge variant="outline" className="text-[10px] py-0 px-1 font-normal border-primary/20 bg-primary/5">
              {list.length} itens
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pb-4">
          {list.length === 0 ? (
            <div className="text-xs text-muted-foreground text-center py-6">Nenhum dado cadastrado.</div>
          ) : (
            list.map((item, index) => (
              <div key={`${item.name}-${index}`} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium truncate max-w-[140px] text-foreground">{item.name}</span>
                  <span className="text-muted-foreground font-mono text-[11px]">
                    {item.count}v ({item.percentage}%)
                  </span>
                </div>
                <Progress 
                  value={item.percentage} 
                  className="h-1.5 [&>[data-slot=progress-indicator]]:bg-primary" 
                />
              </div>
            ))
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-8">
      {/* 1. VISÃO GERAL (MÉTRICAS) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* TOTAL DE VAGAS */}
        <Card className="border-t-2 border-t-primary shadow-sm">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-xs uppercase text-muted-foreground font-bold">Total de Vagas</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-between items-end pb-4">
            <span className="text-3xl font-extrabold text-foreground leading-none">{metrics.totalVacancies}</span>
            <Briefcase className="size-7 text-primary/60" />
          </CardContent>
        </Card>

        {/* TOTAL DE EMPRESAS */}
        <Card className="border-t-2 border-t-metal shadow-sm">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-xs uppercase text-muted-foreground font-bold">Total de Empresas</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-between items-end pb-4">
            <span className="text-3xl font-extrabold text-foreground leading-none">{metrics.totalCompanies}</span>
            <Building2 className="size-7 text-metal/60" />
          </CardContent>
        </Card>

        {/* TOTAL DE TECNOLOGIAS */}
        <Card className="border-t-2 border-t-sky-500 shadow-sm">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-xs uppercase text-muted-foreground font-bold">Tecnologias Distintas</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-between items-end pb-4">
            <span className="text-3xl font-extrabold text-foreground leading-none">{metrics.totalTechnologies}</span>
            <Cpu className="size-7 text-sky-500/60" />
          </CardContent>
        </Card>
      </div>

      {/* 2. RANKINGS GERAIS */}
      <div className="space-y-3.5">
        <h3 className="text-base font-bold flex items-center gap-2 text-foreground">
          <BarChart3 className="size-5 text-primary" />
          Rankings de Demandas Técnicas
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {renderRankingCard("Hard Skills", rankings.hardSkills)}
          {renderRankingCard("Linguagens", rankings.languages)}
          {renderRankingCard("Frameworks", rankings.frameworks)}
          {renderRankingCard("Bibliotecas", rankings.libraries)}
          {renderRankingCard("Bancos de Dados", rankings.databases)}
          {renderRankingCard("Cloud / Nuvem", rankings.cloud)}
          {renderRankingCard("Testes", rankings.tests)}
          {renderRankingCard("DevOps & Infra", rankings.devops)}
          {renderRankingCard("Ferramentas", rankings.tools)}
          {renderRankingCard("Metodologias", rankings.methodologies)}
          {renderRankingCard("Soft Skills", rankings.softSkills)}
          {renderRankingCard("Outras Tecnologias", rankings.otherTech)}
        </div>
      </div>

      {/* 3. DISTRIBUIÇÕES */}
      <div className="space-y-3.5">
        <h3 className="text-base font-bold flex items-center gap-2 text-foreground">
          <PieChart className="size-5 text-primary" />
          Distribuições & Modelos
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Senioridade */}
          <Card className="border border-border/50 shadow-sm">
            <CardHeader className="pb-3 pt-4">
              <CardTitle className="text-sm font-semibold">Distribuição por Senioridade</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pb-4">
              {distributions.seniority.length === 0 ? (
                <div className="text-xs text-muted-foreground text-center py-6">Sem dados de senioridade.</div>
              ) : (
                distributions.seniority.map((item, index) => (
                  <div key={`${item.name}-${index}`} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="capitalize">{item.name}</span>
                      <span className="text-muted-foreground font-mono text-[11px]">
                        {item.count}v ({item.percentage}%)
                      </span>
                    </div>
                    <Progress 
                      value={item.percentage} 
                      className="h-2 [&>[data-slot=progress-indicator]]:bg-indigo-500 bg-indigo-100 dark:bg-indigo-950/20" 
                    />
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Modelo de trabalho */}
          <Card className="border border-border/50 shadow-sm">
            <CardHeader className="pb-3 pt-4">
              <CardTitle className="text-sm font-semibold">Distribuição por Modelo de Trabalho</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pb-4">
              {distributions.workModel.length === 0 ? (
                <div className="text-xs text-muted-foreground text-center py-6">Sem dados de modelo de trabalho.</div>
              ) : (
                distributions.workModel.map((item, index) => (
                  <div key={`${item.name}-${index}`} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="capitalize">{item.name}</span>
                      <span className="text-muted-foreground font-mono text-[11px]">
                        {item.count}v ({item.percentage}%)
                      </span>
                    </div>
                    <Progress 
                      value={item.percentage} 
                      className="h-2 [&>[data-slot=progress-indicator]]:bg-emerald-500 bg-emerald-100 dark:bg-emerald-950/20" 
                    />
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Benefícios Recorrentes */}
          <Card className="border border-border/50 shadow-sm">
            <CardHeader className="pb-3 pt-4">
              <CardTitle className="text-sm font-semibold">Benefícios Recurrentes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pb-4">
              {distributions.benefits.length === 0 ? (
                <div className="text-xs text-muted-foreground text-center py-6">Sem benefícios encontrados.</div>
              ) : (
                distributions.benefits.map((item, index) => (
                  <div key={`${item.name}-${index}`} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="truncate max-w-[150px] capitalize">{item.name}</span>
                      <span className="text-muted-foreground font-mono text-[11px]">
                        {item.count}v ({item.percentage}%)
                      </span>
                    </div>
                    <Progress 
                      value={item.percentage} 
                      className="h-2 [&>[data-slot=progress-indicator]]:bg-amber-500 bg-amber-100 dark:bg-amber-950/20" 
                    />
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
