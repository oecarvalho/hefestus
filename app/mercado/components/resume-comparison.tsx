'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, Info, Sparkles } from "lucide-react";
import { CompanyCompatibilityResult } from "@/app/actions/market-actions";

interface ResumeComparisonProps {
  curriculumComparison: {
    presentSkills: string[];
    missingSkills: string[];
    adherencePercent: number;
  };
  gapOfKnowledge: {
    name: string;
    count: number;
    percentage: number;
  }[];
  companyCompatibility: CompanyCompatibilityResult | null;
  companyName: string;
}

export function ResumeComparison({
  curriculumComparison,
  gapOfKnowledge,
  companyCompatibility,
  companyName,
}: ResumeComparisonProps) {

  const getAdherenceBadgeColor = (percent: number) => {
    if (percent >= 75) return "bg-emerald-500 hover:bg-emerald-600 text-white";
    if (percent >= 45) return "bg-amber-500 hover:bg-amber-600 text-white";
    return "bg-rose-500 hover:bg-rose-600 text-white";
  };

  const getAdherenceText = (percent: number) => {
    if (percent >= 75) return "Excelente Aderência";
    if (percent >= 45) return "Média Aderência";
    return "Baixa Aderência";
  };

  return (
    <div className="space-y-6">
      {/* 1. ADERÊNCIA CURRÍCULO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Adhêrencia Mercado Geral */}
        <Card className="border border-border/50 shadow-sm flex flex-col justify-between">
          <CardHeader className="pb-3 pt-4">
            <CardTitle className="text-base font-bold flex items-center justify-between">
              Aderência ao Mercado Geral
              <Badge className={getAdherenceBadgeColor(curriculumComparison.adherencePercent)}>
                {getAdherenceText(curriculumComparison.adherencePercent)}
              </Badge>
            </CardTitle>
            <CardDescription className="text-xs">
              Percentual de compatibilidade do seu currículo com todas as vagas analisadas neste estudo.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pb-6">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold tracking-tight text-primary">
                {curriculumComparison.adherencePercent}%
              </span>
              <span className="text-[10px] font-semibold text-muted-foreground uppercase">aderência</span>
            </div>
            <Progress 
              value={curriculumComparison.adherencePercent} 
              className="h-2.5 [&>[data-slot=progress-indicator]]:bg-primary bg-primary/10" 
            />
            
            <div className="grid grid-cols-2 gap-4 text-xs pt-1 border-t">
              <div>
                <span className="text-muted-foreground block">Competências Dominadas</span>
                <span className="font-bold text-sm text-emerald-600 dark:text-emerald-400">
                  {curriculumComparison.presentSkills.length} techs
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block">Competências Faltantes</span>
                <span className="font-bold text-sm text-rose-500">
                  {curriculumComparison.missingSkills.length} techs
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Adherência Empresa (se selecionada) */}
        {companyCompatibility ? (
          <Card className="border border-border/50 shadow-sm flex flex-col justify-between">
            <CardHeader className="pb-3 pt-4">
              <CardTitle className="text-base font-bold flex items-center justify-between">
                Aderência à Empresa ({companyName})
                <Badge className={getAdherenceBadgeColor(companyCompatibility.compatibilityPercent)}>
                  {getAdherenceText(companyCompatibility.compatibilityPercent)}
                </Badge>
              </CardTitle>
              <CardDescription className="text-xs">
                Percentual de compatibilidade com as tecnologias específicas solicitadas nas vagas da {companyName}.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold tracking-tight text-indigo-600 dark:text-indigo-400">
                  {companyCompatibility.compatibilityPercent}%
                </span>
                <span className="text-[10px] font-semibold text-muted-foreground uppercase">compatibilidade</span>
              </div>
              <Progress 
                value={companyCompatibility.compatibilityPercent} 
                className="h-2.5 [&>[data-slot=progress-indicator]]:bg-indigo-500 bg-indigo-100 dark:bg-indigo-950/20" 
              />
              
              <div className="grid grid-cols-2 gap-4 text-xs pt-1 border-t">
                <div>
                  <span className="text-muted-foreground block">Competências Atendidas</span>
                  <span className="font-bold text-sm text-emerald-600 dark:text-emerald-400">
                    {companyCompatibility.matchingSkills.length} techs
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Competências Faltantes</span>
                  <span className="font-bold text-sm text-rose-500">
                    {companyCompatibility.missingSkills.length} techs
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border border-dashed shadow-sm flex flex-col justify-center items-center text-center p-6 bg-muted/5">
            <Info className="size-8 text-muted-foreground/60 mb-2" />
            <h4 className="font-semibold text-sm text-foreground mb-1">Aderência por Empresa</h4>
            <p className="text-xs text-muted-foreground max-w-xs leading-normal">
              Selecione uma empresa específica no filtro acima para visualizar o índice de compatibilidade exclusivo.
            </p>
          </Card>
        )}
      </div>

      {/* 2. RECOMENDAÇÕES DA EMPRESA */}
      {companyCompatibility && companyCompatibility.recommendations.length > 0 && (
        <Card className="border border-border/50 shadow-sm bg-indigo-50/25 dark:bg-indigo-950/5">
          <CardHeader className="pb-3 pt-4">
            <CardTitle className="text-sm font-bold flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
              <Sparkles className="size-4" />
              Recomendações Específicas ({companyName})
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <ul className="space-y-2 text-xs">
              {companyCompatibility.recommendations.map((rec, i) => (
                <li key={i} className="flex gap-2 text-muted-foreground leading-relaxed">
                  <div className="text-indigo-500 font-bold mt-0.5">•</div>
                  <div>{rec}</div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* 3. GAP DE CONHECIMENTO */}
      <Card className="border border-border/50 shadow-sm">
        <CardHeader className="pb-3 pt-4">
          <CardTitle className="text-sm font-bold flex items-center gap-1.5 text-foreground">
            <AlertCircle className="size-4 text-rose-500" />
            Gap de Conhecimento ({companyCompatibility ? companyName : "Mercado Geral"})
          </CardTitle>
          <CardDescription className="text-xs">
            Lista de competências encontradas nas vagas que ainda não constam em seu currículo, ordenadas por frequência.
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-4">
          {gapOfKnowledge.length === 0 ? (
            <div className="text-center py-8 text-xs text-muted-foreground flex items-center justify-center gap-1.5">
              <CheckCircle2 className="size-4 text-emerald-500" />
              Parabéns! Seu currículo cobre todas as tecnologias identificadas.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {gapOfKnowledge.map((item, index) => (
                <div key={`${item.name}-${index}`} className="grid grid-cols-[140px_1fr_60px] items-center gap-4 border p-2.5 rounded-xl hover:bg-muted/10 transition-colors">
                  <span className="text-xs font-semibold truncate text-foreground capitalize">{item.name}</span>
                  <Progress 
                    value={item.percentage} 
                    className="h-1.5 bg-rose-100 dark:bg-rose-950/20 [&>[data-slot=progress-indicator]]:bg-rose-500" 
                  />
                  <span className="text-right text-[11px] font-mono text-muted-foreground whitespace-nowrap">
                    {item.count}v ({item.percentage}%)
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
