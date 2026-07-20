'use client'

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, RefreshCw, Loader2, Lightbulb, Compass, Award, TrendingUp, BookOpen, AlertTriangle } from "lucide-react";
import { getMarketStudyAIInsights } from "@/app/actions/market-actions";

interface StudyInsightsProps {
  studyId: string;
  companyFilter?: string;
  companyName: string;
}

interface AIInsightsData {
  executiveSummary: string;
  predominantTechs: string[];
  observedTrends: string[];
  careerAdvice: string;
  ubiquitousTechs: string[];
  differentialTechs: string[];
  companyTechProfile: string;
}

export function StudyInsights({ studyId, companyFilter, companyName }: StudyInsightsProps) {
  const [data, setData] = useState<AIInsightsData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const res = await getMarketStudyAIInsights(studyId, companyFilter);
      setData(res);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, [studyId, companyFilter]);

  if (loading) {
    return (
      <Card className="border border-border/50 shadow-sm">
        <CardHeader className="pb-3 pt-4">
          <CardTitle className="text-sm font-bold flex items-center gap-1.5 text-foreground">
            <Sparkles className="size-4 animate-pulse text-primary" />
            Análise Inteligente da IA
          </CardTitle>
          <CardDescription className="text-xs">
            Aguarde enquanto a IA do Gemini compila os resumos executivos e cruza as informações.
          </CardDescription>
        </CardHeader>
        <CardContent className="py-12 flex flex-col items-center justify-center gap-4 text-center">
          <Loader2 className="animate-spin text-primary size-10" />
          <div className="space-y-1">
            <h4 className="font-semibold text-sm">Consultando o Gemini...</h4>
            <p className="text-xs text-muted-foreground max-w-xs leading-normal">
              Isso pode levar de 3 a 8 segundos dependendo da quantidade de vagas e complexidade técnica.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="border border-dashed p-6 text-center shadow-sm">
        <AlertTriangle className="size-8 text-amber-500 mx-auto mb-2" />
        <h4 className="font-bold text-sm text-foreground mb-1">Erro ao carregar insights</h4>
        <p className="text-xs text-muted-foreground mb-4">
          Não foi possível conectar à API do Gemini para gerar a análise do estudo.
        </p>
        <Button onClick={fetchInsights} variant="outline" size="sm" className="gap-1.5">
          <RefreshCw size={14} />
          Tentar Novamente
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER ACTIONS */}
      <div className="flex justify-between items-center pb-2 border-b border-border/40">
        <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
          <Sparkles className="size-3.5 text-primary" />
          Gerado automaticamente pela inteligência artificial Gemini.
        </span>
        <Button onClick={fetchInsights} variant="outline" size="xs" className="gap-1 bg-background text-xs">
          <RefreshCw size={12} />
          Recalcular Insights
        </Button>
      </div>

      {/* 1. RESUMO EXECUTIVO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 border border-border/50 shadow-sm flex flex-col justify-between">
          <CardHeader className="pb-3 pt-4">
            <CardTitle className="text-sm font-bold flex items-center gap-1.5 text-foreground">
              <Compass className="size-4 text-primary" />
              Resumo Executivo da Análise
            </CardTitle>
            <CardDescription className="text-xs">
              Síntese analítica das exigências coletadas para o estudo de mercado.
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-6">
            <p className="text-xs leading-relaxed text-muted-foreground whitespace-pre-line font-sans">
              {data.executiveSummary}
            </p>
          </CardContent>
        </Card>

        {/* Predominant Stacks / Techs */}
        <Card className="border border-border/50 shadow-sm">
          <CardHeader className="pb-3 pt-4">
            <CardTitle className="text-sm font-bold flex items-center gap-1.5 text-foreground">
              <Award className="size-4 text-primary" />
              Tecnologias Predominantes
            </CardTitle>
            <CardDescription className="text-xs">
              Tecnologias cruciais identificadas nas vagas de modo geral.
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <ul className="space-y-2 text-xs">
              {data.predominantTechs.map((tech, i) => (
                <li key={i} className="flex gap-2 text-muted-foreground leading-relaxed font-sans">
                  <div className="text-primary font-bold mt-0.5">•</div>
                  <div>{tech}</div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* 2. ANALISE DA EMPRESA OU GERAL */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border border-border/50 shadow-sm">
          <CardHeader className="pb-3 pt-4">
            <CardTitle className="text-sm font-bold flex items-center gap-1.5 text-foreground">
              <BookOpen className="size-4 text-primary" />
              Perfil Tecnológico {companyFilter ? `da ${companyName}` : "Geral das Empresas"}
            </CardTitle>
            <CardDescription className="text-xs">
              Visão sobre o ecossistema tecnológico e stack preferencial de contratação.
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-6">
            <p className="text-xs leading-relaxed text-muted-foreground whitespace-pre-line font-sans">
              {data.companyTechProfile}
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border/50 shadow-sm">
          <CardHeader className="pb-3 pt-4">
            <CardTitle className="text-sm font-bold flex items-center gap-1.5 text-foreground">
              <TrendingUp className="size-4 text-primary" />
              Tendências Observadas no Mercado
            </CardTitle>
            <CardDescription className="text-xs">
              Direcionamentos de contratação capturados na análise.
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <ul className="space-y-2.5 text-xs">
              {data.observedTrends.map((trend, i) => (
                <li key={i} className="flex gap-2 text-muted-foreground leading-relaxed font-sans">
                  <div className="text-primary font-bold mt-0.5">•</div>
                  <div>{trend}</div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* 3. TRANSVERSAIS (O QUE ESTUDAR, UBÍQUAS E DIFERENCIAIS) */}
      <Card className="border border-border/50 shadow-sm bg-primary/5">
        <CardHeader className="pb-3 pt-4">
          <CardTitle className="text-sm font-bold flex items-center gap-1.5 text-primary">
            <Lightbulb className="size-4" />
            Conselho Prático para Crescimento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pb-6">
          <p className="text-xs leading-relaxed text-muted-foreground font-sans">
            {data.careerAdvice}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t">
            {/* Ubíquas */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Aparecem em quase todas as vagas</span>
              <div className="flex flex-wrap gap-1.5">
                {data.ubiquitousTechs.length === 0 ? (
                  <span className="text-[11px] text-muted-foreground italic">Nenhuma identificada.</span>
                ) : (
                  data.ubiquitousTechs.map((tech) => (
                    <Badge key={tech} className="bg-primary/20 hover:bg-primary/30 text-primary border-transparent text-[11px] px-2 py-0.5 capitalize font-medium">
                      {tech}
                    </Badge>
                  ))
                )}
              </div>
            </div>

            {/* Diferenciais */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider block">Tecnologias que são Diferenciais de Peso</span>
              <div className="flex flex-wrap gap-1.5">
                {data.differentialTechs.length === 0 ? (
                  <span className="text-[11px] text-muted-foreground italic">Nenhuma identificada.</span>
                ) : (
                  data.differentialTechs.map((tech) => (
                    <Badge key={tech} className="bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border-transparent text-[11px] px-2 py-0.5 capitalize font-medium">
                      {tech}
                    </Badge>
                  ))
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
