import { getMarketStudies } from "@/app/actions/market-actions";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { NewStudyDialog } from "./components/new-study-dialog";
import { DeleteStudyButton } from "./components/delete-study-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Briefcase, Building2, CalendarDays, ArrowRight, TrendingUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export const dynamic = "force-dynamic";

export default async function MercadoPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const studies = await getMarketStudies();

  return (
    <section className="h-full max-w-6xl w-full px-4 mx-auto py-16 space-y-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-border/40">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
            <TrendingUp className="text-primary size-7" />
            Inteligência de Mercado
          </h1>
          <p className="text-sm text-muted-foreground">
            Crie estudos de mercado, adicione vagas e analise a demanda por tecnologias, roadmaps de estudos e gaps de perfil.
          </p>
        </div>
        <div className="flex-shrink-0">
          <NewStudyDialog />
        </div>
      </div>

      {/* ESTUDOS */}
      {studies.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-20 px-4 bg-muted/20 border rounded-2xl gap-4 max-w-md mx-auto">
          <div className="rounded-full bg-primary/10 p-4 text-primary">
            <TrendingUp size={32} />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">Nenhum estudo de mercado</h3>
            <p className="text-sm text-muted-foreground">
              Você ainda não criou nenhum estudo de mercado. Comece definindo a profissão ou cargo que deseja analisar.
            </p>
          </div>
          <NewStudyDialog />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {studies.map((study) => {
            const timeAgo = formatDistanceToNow(new Date(study.updatedAt), {
              addSuffix: true,
              locale: ptBR,
            });

            return (
              <Card key={study.id} className="relative hover:shadow-md transition-shadow flex flex-col justify-between group overflow-hidden border border-border/60">
                <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <DeleteStudyButton studyId={study.id} studyTitle={study.title} />
                </div>

                <div>
                  <CardHeader className="pb-3">
                    <CardTitle className="pr-8 truncate text-lg font-bold">{study.title}</CardTitle>
                    <CardDescription className="line-clamp-2 min-h-[40px] text-xs">
                      {study.description || "Nenhuma descrição informada."}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-3 pb-6 border-b border-muted/50">
                    <div className="grid grid-cols-2 gap-4">
                      {/* Vagas */}
                      <div className="flex items-center gap-2 text-sm">
                        <div className="p-1.5 rounded-lg bg-metal/5 text-metal dark:bg-metal/10">
                          <Briefcase size={16} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs text-muted-foreground leading-none">Vagas</span>
                          <span className="font-semibold text-sm leading-tight">{study.vacanciesCount}</span>
                        </div>
                      </div>

                      {/* Empresas */}
                      <div className="flex items-center gap-2 text-sm">
                        <div className="p-1.5 rounded-lg bg-metal/5 text-metal dark:bg-metal/10">
                          <Building2 size={16} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs text-muted-foreground leading-none">Empresas</span>
                          <span className="font-semibold text-sm leading-tight">{study.companiesCount}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <CalendarDays size={14} />
                      <span>Atualizado {timeAgo}</span>
                    </div>
                  </CardContent>
                </div>

                <div className="p-4 bg-muted/20 hover:bg-primary/5 transition-colors">
                  <Link
                    href={`/mercado/${study.id}`}
                    className="flex items-center justify-between text-xs font-semibold text-primary"
                  >
                    Visualizar Análise
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </section>
  );
}
