'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Scale, ArrowUpRight, ArrowDownRight, Compass, Info } from "lucide-react";
import { ComparisonMetrics } from "@/app/actions/market-actions";

interface CompanyComparisonProps {
  comparison: ComparisonMetrics | null;
  companyName: string;
}

export function CompanyComparison({ comparison, companyName }: CompanyComparisonProps) {
  if (!comparison) return null;

  return (
    <div className="space-y-6">
      {/* 1. INDICE DE SIMILARIDADE */}
      <Card className="border border-border/50 shadow-sm">
        <CardHeader className="pb-3 pt-4">
          <CardTitle className="text-base font-bold flex items-center gap-1.5 text-foreground">
            <Scale className="size-4 text-primary" />
            Similaridade da Empresa com o Mercado Geral
          </CardTitle>
          <CardDescription className="text-xs">
            Sobreposição de tecnologias utilizadas pela {companyName} comparada à média das outras vagas de mercado.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pb-6">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold tracking-tight text-primary">
              {comparison.similarity}%
            </span>
            <span className="text-[10px] font-semibold text-muted-foreground uppercase">índice jaccard</span>
          </div>
          <Progress value={comparison.similarity} className="h-2.5 [&>[data-slot=progress-indicator]]:bg-primary bg-primary/10" />
          <p className="text-xs text-muted-foreground leading-relaxed pt-1">
            {comparison.similarity >= 75
              ? `A stack técnica da ${companyName} é altamente alinhada com as demandas gerais do mercado.`
              : comparison.similarity >= 40
              ? `A ${companyName} possui stacks comuns ao mercado, com algumas especificidades.`
              : `A ${companyName} utiliza uma stack técnica bem particular e diferenciada do mercado geral.`}
          </p>
        </CardContent>
      </Card>

      {/* 2. MAIS VALORIZADAS E MENOS RELEVANTES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tecnologias Mais Valorizadas */}
        <Card className="border border-border/50 shadow-sm flex flex-col justify-between">
          <CardHeader className="pb-3 pt-4">
            <CardTitle className="text-sm font-bold flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <ArrowUpRight className="size-4" />
              Mais Valorizadas pela Empresa
            </CardTitle>
            <CardDescription className="text-xs">
              Tecnologias exigidas com maior frequência na {companyName} do que na média do mercado.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pb-4">
            {comparison.moreValuedByCompany.length === 0 ? (
              <div className="text-xs text-muted-foreground text-center py-6">Nenhuma disparidade relevante.</div>
            ) : (
              comparison.moreValuedByCompany.map((item, index) => (
                <div key={`${item.name}-${index}`} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="capitalize">{item.name}</span>
                    <span className="text-muted-foreground font-mono text-[11px]">
                      {item.companyPercent}% vs {item.marketPercent}% (geral)
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden flex">
                    <div 
                      className="bg-emerald-500 h-full rounded-l-full" 
                      style={{ width: `${item.companyPercent}%` }} 
                    />
                    <div 
                      className="bg-primary/20 h-full rounded-r-full" 
                      style={{ width: `${Math.max(0, item.marketPercent - item.companyPercent)}%` }} 
                    />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Tecnologias Menos Relevantes */}
        <Card className="border border-border/50 shadow-sm flex flex-col justify-between">
          <CardHeader className="pb-3 pt-4">
            <CardTitle className="text-sm font-bold flex items-center gap-1.5 text-rose-500">
              <ArrowDownRight className="size-4" />
              Menos Relevantes para a Empresa
            </CardTitle>
            <CardDescription className="text-xs">
              Tecnologias de mercado que possuem pouca ou nenhuma ocorrência na {companyName}.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pb-4">
            {comparison.lessRelevantForCompany.length === 0 ? (
              <div className="text-xs text-muted-foreground text-center py-6">Nenhuma disparidade relevante.</div>
            ) : (
              comparison.lessRelevantForCompany.map((item, index) => (
                <div key={`${item.name}-${index}`} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="capitalize">{item.name}</span>
                    <span className="text-muted-foreground font-mono text-[11px]">
                      {item.companyPercent}% vs {item.marketPercent}% (geral)
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden flex">
                    <div 
                      className="bg-rose-500 h-full rounded-l-full" 
                      style={{ width: `${item.companyPercent}%` }} 
                    />
                    <div 
                      className="bg-primary/20 h-full rounded-r-full" 
                      style={{ width: `${Math.max(0, item.marketPercent - item.companyPercent)}%` }} 
                    />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* 3. COMPETÊNCIAS EXCLUSIVAS */}
      <Card className="border border-border/50 shadow-sm">
        <CardHeader className="pb-3 pt-4">
          <CardTitle className="text-sm font-bold flex items-center gap-1.5 text-foreground">
            <Compass className="size-4 text-indigo-500" />
            Competências Exclusivas da {companyName}
          </CardTitle>
          <CardDescription className="text-xs">
            Habilidades ou tecnologias que aparecem somente nas vagas desta empresa no estudo atual.
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-4">
          {comparison.exclusiveSkills.length === 0 ? (
            <div className="text-xs text-muted-foreground bg-muted/30 p-4 rounded-xl border flex items-center gap-2">
              <Info className="size-4 text-muted-foreground/60" />
              Nenhuma tecnologia do estudo foi identificada como exclusiva desta empresa. Todas também aparecem em vagas concorrentes.
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {comparison.exclusiveSkills.map((tech) => (
                <Badge key={tech} className="bg-indigo-500 hover:bg-indigo-600 text-white text-xs px-2.5 py-0.5 capitalize">
                  {tech}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
