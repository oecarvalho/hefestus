import { getMarketStudyDetails } from "@/app/actions/market-actions";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Briefcase,
  Building2,
  Calendar,
  TrendingUp,
  BarChart3,
  Scale,
  FileText,
  Compass,
  Sparkles,
} from "lucide-react";
import { CompanySelectFilter } from "../components/company-select-filter";
import { AddVacancyDialog } from "../components/add-vacancy-dialog";
import { VacancyDetailsDialog } from "../components/vacancy-details-dialog";
import { MarketDashboard } from "../components/market-dashboard";
import { CompanyComparison } from "../components/company-comparison";
import { ResumeComparison } from "../components/resume-comparison";
import { StudyRoadmap } from "../components/study-roadmap";
import { StudyInsights } from "../components/study-insights";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Params {
  id: string;
}

interface SearchParams {
  company?: string;
  tab?: string;
}

interface StudyPageProps {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}

export const dynamic = "force-dynamic";

export default async function StudyPage({ params, searchParams }: StudyPageProps) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const { id } = await params;
  const { company, tab } = await searchParams;

  // Tratar valor padrão do filtro de empresa
  const companyFilter = company && company !== "all_companies" ? company : undefined;
  const companySelectValue = company || "all_companies";

  // Obter detalhes estatísticos do banco
  const studyData = await getMarketStudyDetails(id, companyFilter);

  // Tratar valor padrão da aba ativa
  // Se a aba for "comparison" mas não houver filtro de empresa, redireciona para "dashboard"
  let activeTab = tab || "dashboard";
  if (activeTab === "comparison" && !companyFilter) {
    activeTab = "dashboard";
  }

  // Usar as vagas brutas retornadas do fetch
  const vacanciesToRender = companyFilter
    ? studyData.study.vacancies.filter(
        (v) => v.enterprise.trim().toLowerCase() === companyFilter.trim().toLowerCase()
      )
    : studyData.study.vacancies;

  // Lista de abas disponíveis
  const tabs = [
    { id: "dashboard", label: "Dashboard & Rankings", icon: BarChart3 },
    ...(companyFilter ? [{ id: "comparison", label: "Mercado x Empresa", icon: Scale }] : []),
    { id: "curriculum", label: "Currículo & Aderência", icon: FileText },
    { id: "roadmap", label: "Roadmap de Estudos", icon: Compass },
    { id: "insights", label: "Insights da IA", icon: Sparkles },
    { id: "vacancies", label: `Vagas (${vacanciesToRender.length})`, icon: Briefcase },
  ];

  // Helper para construir links preservando filtros
  const getTabUrl = (tabId: string) => {
    const queryParams = new URLSearchParams();
    if (companyFilter) queryParams.set("company", companyFilter);
    queryParams.set("tab", tabId);
    return `/mercado/${id}?${queryParams.toString()}`;
  };

  return (
    <section className="h-full max-w-6xl w-full px-4 mx-auto py-16 space-y-8">
      {/* CAME BACK BUTTON */}
      <div>
        <Link
          href="/mercado"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-semibold"
        >
          <ArrowLeft size={14} />
          Voltar para Estudos
        </Link>
      </div>

      {/* TITLE & DESCRIPTION */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-4 border-b border-border/40">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-2">
            <TrendingUp className="text-primary size-7" />
            {studyData.study.title}
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            {studyData.study.description || "Nenhuma descrição fornecida para este estudo de mercado."}
          </p>
        </div>
        <div className="flex-shrink-0 flex items-center gap-3">
          <CompanySelectFilter
            companies={studyData.companiesList}
            defaultValue={companySelectValue}
          />
          <AddVacancyDialog studyId={id} />
        </div>
      </div>

      {/* ABAS DE NAVEGAÇÃO */}
      {vacanciesToRender.length === 0 && !companyFilter ? (
        <div className="flex flex-col items-center justify-center text-center py-24 bg-muted/20 border rounded-2xl gap-4 max-w-md mx-auto">
          <div className="rounded-full bg-primary/10 p-4 text-primary">
            <Briefcase size={32} />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">Nenhuma vaga cadastrada</h3>
            <p className="text-sm text-muted-foreground">
              Para visualizar o dashboard de inteligência, você precisa adicionar as vagas que deseja analisar.
            </p>
          </div>
          <AddVacancyDialog studyId={id} />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Navegação horizontal de abas */}
          <div className="border-b border-muted flex flex-wrap gap-1">
            {tabs.map((tabItem) => {
              const TabIcon = tabItem.icon;
              const isActive = activeTab === tabItem.id;

              return (
                <Link
                  key={tabItem.id}
                  href={getTabUrl(tabItem.id)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
                    isActive
                      ? "border-primary text-primary bg-primary/5 rounded-t-lg"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <TabIcon size={14} />
                  {tabItem.label}
                </Link>
              );
            })}
          </div>

          {/* CONTEÚDO DAS ABAS */}
          <div className="pt-2">
            {activeTab === "dashboard" && (
              <MarketDashboard
                metrics={studyData.metrics}
                rankings={studyData.rankings}
                distributions={studyData.distributions}
                isCompanyFiltered={!!companyFilter}
              />
            )}

            {activeTab === "comparison" && companyFilter && (
              <CompanyComparison
                comparison={studyData.comparisonMetrics}
                companyName={companyFilter}
              />
            )}

            {activeTab === "curriculum" && (
              <ResumeComparison
                curriculumComparison={studyData.curriculumComparison}
                gapOfKnowledge={studyData.gapOfKnowledge}
                companyCompatibility={studyData.companyCompatibility}
                companyName={companyFilter || "Mercado Geral"}
              />
            )}

            {activeTab === "roadmap" && (
              <StudyRoadmap
                roadmap={studyData.roadmap}
                title={companyFilter ? `Roadmap para trabalhar na ${companyFilter}` : "Roadmap Geral de Estudos"}
              />
            )}

            {activeTab === "insights" && (
              <StudyInsights
                studyId={id}
                companyFilter={companyFilter}
                companyName={companyFilter || "Mercado Geral"}
              />
            )}

            {activeTab === "vacancies" && (
              <Card className="border border-border/50 shadow-sm overflow-hidden">
                <CardHeader className="pb-3 pt-4 border-b">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-sm font-bold">Vagas Analisadas</CardTitle>
                      <CardDescription className="text-xs">
                        Lista de todas as vagas cadastradas neste estudo de mercado {companyFilter ? `da empresa ${companyFilter}` : ""}.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {vacanciesToRender.length === 0 ? (
                    <div className="text-center py-12 text-sm text-muted-foreground">
                      Nenhuma vaga cadastrada correspondente a esta empresa.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left border-collapse">
                        <thead>
                          <tr className="border-b bg-muted/20 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                            <th className="py-3 px-4">Empresa</th>
                            <th className="py-3 px-4">Cargo</th>
                            <th className="py-3 px-4">Data de Cadastro</th>
                            <th className="py-3 px-4 text-right">Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {vacanciesToRender.map((vacancy) => (
                            <tr key={vacancy.id} className="border-b hover:bg-muted/30 transition-colors">
                              <td className="py-3.5 px-4 font-semibold text-foreground">{vacancy.enterprise}</td>
                              <td className="py-3.5 px-4 text-muted-foreground font-medium">{vacancy.role}</td>
                              <td className="py-3.5 px-4 text-muted-foreground">
                                {new Date(vacancy.createdAt).toLocaleDateString("pt-BR")}
                              </td>
                              <td className="py-3.5 px-4 text-right flex justify-end gap-2">
                                <VacancyDetailsDialog vacancy={vacancy} studyId={id} />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
