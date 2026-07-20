'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, AlertTriangle, Lightbulb, CheckCircle2 } from "lucide-react";
import { Roadmap } from "@/app/actions/market-actions";

interface StudyRoadmapProps {
  roadmap: Roadmap;
  title: string;
}

export function StudyRoadmap({ roadmap, title }: StudyRoadmapProps) {
  const hasItems = 
    roadmap.highPriority.length > 0 || 
    roadmap.mediumPriority.length > 0 || 
    roadmap.differentials.length > 0;

  return (
    <Card className="border border-border/50 shadow-sm">
      <CardHeader className="pb-3 pt-4">
        <CardTitle className="text-base font-bold flex items-center justify-between">
          <span>{title}</span>
        </CardTitle>
        <CardDescription className="text-xs">
          Passo a passo de estudos estruturado a partir do volume de exigências encontradas na análise das vagas.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pb-6">
        {!hasItems ? (
          <div className="text-center py-10 text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
            <CheckCircle2 className="size-8 text-emerald-500" />
            <div className="font-semibold text-sm">Nenhum estudo necessário</div>
            <p className="max-w-xs leading-normal">
              Muito bem! Seu perfil atual atende plenamente às demandas identificadas nas vagas analisadas.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Alta Prioridade */}
            <div className="space-y-3 p-4 rounded-xl border bg-rose-50/10 dark:bg-rose-950/5 border-rose-500/10">
              <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-bold text-sm">
                <AlertTriangle className="size-4" />
                Alta Prioridade
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Tecnologias presentes em pelo menos 40% das vagas. Domínio imediato é crucial para sua aprovação.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {roadmap.highPriority.length === 0 ? (
                  <span className="text-[11px] text-muted-foreground italic">Nenhuma tecnologia pendente nesta faixa.</span>
                ) : (
                  roadmap.highPriority.map((tech) => (
                    <Badge key={tech} className="bg-rose-500 hover:bg-rose-600 text-white text-xs px-2.5 py-0.5 capitalize">
                      {tech}
                    </Badge>
                  ))
                )}
              </div>
            </div>

            {/* Média Prioridade */}
            <div className="space-y-3 p-4 rounded-xl border bg-amber-50/10 dark:bg-amber-950/5 border-amber-500/10">
              <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold text-sm">
                <Star className="size-4" />
                Média Prioridade
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Tecnologias solicitadas em 15% a 39% das vagas. Excelente complemento para alargar seu leque.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {roadmap.mediumPriority.length === 0 ? (
                  <span className="text-[11px] text-muted-foreground italic">Nenhuma tecnologia pendente nesta faixa.</span>
                ) : (
                  roadmap.mediumPriority.map((tech) => (
                    <Badge key={tech} className="bg-amber-500 hover:bg-amber-600 text-white text-xs px-2.5 py-0.5 capitalize">
                      {tech}
                    </Badge>
                  ))
                )}
              </div>
            </div>

            {/* Diferenciais */}
            <div className="space-y-3 p-4 rounded-xl border bg-sky-50/10 dark:bg-sky-950/5 border-sky-500/10">
              <div className="flex items-center gap-1.5 text-sky-600 dark:text-sky-400 font-bold text-sm">
                <Lightbulb className="size-4" />
                Diferenciais
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Presentes em menos de 15% das vagas. Demonstrar este conhecimento te dará vantagem competitiva.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {roadmap.differentials.length === 0 ? (
                  <span className="text-[11px] text-muted-foreground italic">Nenhuma tecnologia pendente nesta faixa.</span>
                ) : (
                  roadmap.differentials.map((tech) => (
                    <Badge key={tech} className="bg-sky-500 hover:bg-sky-600 text-white text-xs px-2.5 py-0.5 capitalize">
                      {tech}
                    </Badge>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
