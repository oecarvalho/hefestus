'use client'

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { ExtractedVacancyData } from "@/lib/extract-market-vacancy";
import { Eye, ExternalLink, Calendar, Building2, Briefcase, Trash2 } from "lucide-react";
import { deleteMarketVacancy } from "@/app/actions/market-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface VacancyDetailsDialogProps {
  vacancy: {
    id: string;
    enterprise: string;
    role: string;
    url: string | null;
    description: string;
    createdAt: Date;
    extractedData: any;
  };
  studyId: string;
}

export function VacancyDetailsDialog({ vacancy, studyId }: VacancyDetailsDialogProps) {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  const data = vacancy.extractedData as ExtractedVacancyData | null;

  const handleDelete = async () => {
    if (confirm("Tem certeza que deseja excluir esta vaga do estudo?")) {
      try {
        setDeleting(true);
        await deleteMarketVacancy(vacancy.id, studyId);
        toast.success("Vaga removida com sucesso!");
        setOpen(false);
        router.refresh();
      } catch (error) {
        console.error(error);
        toast.error("Erro ao remover a vaga.");
      } finally {
        setDeleting(false);
      }
    }
  };

  const renderSection = (title: string, list?: string[]) => {
    if (!list || list.length === 0) return null;
    return (
      <div className="space-y-1.5">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{title}</h4>
        <div className="flex flex-wrap gap-1.5">
          {list.map((item) => (
            <Badge key={item} variant="secondary" className="capitalize text-xs px-2.5 py-0.5">
              {item}
            </Badge>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted/80">
          <Eye size={16} className="text-muted-foreground hover:text-foreground" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b border-muted">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                <Briefcase className="size-5 text-primary" />
                {vacancy.role}
              </DialogTitle>
              <DialogDescription className="text-sm font-medium flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground pt-1">
                <span className="flex items-center gap-1">
                  <Building2 className="size-4" />
                  {vacancy.enterprise}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="size-4" />
                  {new Date(vacancy.createdAt).toLocaleDateString("pt-BR")}
                </span>
                {vacancy.url && (
                  <a
                    href={vacancy.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-0.5 text-primary hover:underline font-semibold"
                  >
                    Ver Vaga Original
                    <ExternalLink className="size-3" />
                  </a>
                )}
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 mr-6"
              onClick={handleDelete}
              disabled={deleting}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-2">
          {/* Coluna 1: Descrição Completa */}
          <div className="p-6 border-r border-muted flex flex-col overflow-hidden max-h-[55vh] md:max-h-full">
            <h3 className="text-sm font-bold pb-2.5 border-b border-muted mb-3">Descrição da Vaga</h3>
            <div className="overflow-y-auto pr-4 flex-1">
              <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap font-sans">
                {vacancy.description}
              </p>
            </div>
          </div>

          {/* Coluna 2: Análise da IA */}
          <div className="p-6 bg-muted/10 flex flex-col overflow-hidden max-h-[55vh] md:max-h-full">
            <h3 className="text-sm font-bold pb-2.5 border-b border-muted mb-3 flex items-center gap-1.5">
              <span>Análise Inteligente da IA</span>
              <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] py-0 px-1.5 font-semibold">Sucesso</Badge>
            </h3>
            <div className="overflow-y-auto pr-4 flex-1">
              <div className="space-y-4">
                {/* Senioridade e Modelo */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-2.5 bg-background border rounded-xl flex flex-col gap-0.5">
                    <span className="text-[10px] uppercase font-semibold text-muted-foreground">Senioridade</span>
                    <span className="text-sm font-bold capitalize text-foreground">
                      {data?.seniority || "não especificado"}
                    </span>
                  </div>
                  <div className="p-2.5 bg-background border rounded-xl flex flex-col gap-0.5">
                    <span className="text-[10px] uppercase font-semibold text-muted-foreground">Modelo</span>
                    <span className="text-sm font-bold capitalize text-foreground">
                      {data?.workModel || "não especificado"}
                    </span>
                  </div>
                </div>

                {/* Habilidades e Techs */}
                {renderSection("Idiomas / Linguagens", data?.languages)}
                {renderSection("Frameworks", data?.frameworks)}
                {renderSection("Bibliotecas", data?.libraries)}
                {renderSection("Bancos de Dados", data?.databases)}
                {renderSection("Cloud / Nuvem", data?.cloud)}
                {renderSection("Testes", data?.tests)}
                {renderSection("DevOps & Infra", data?.devops)}
                {renderSection("Habilidades Técnicas (Hard Skills)", data?.hardSkills)}
                {renderSection("Ferramentas", data?.tools)}
                {renderSection("Metodologias", data?.methodologies)}
                {renderSection("Outras Tecnologias", data?.otherTech)}
                {renderSection("Habilidades Comportamentais (Soft Skills)", data?.softSkills)}
                {renderSection("Benefícios Identificados", data?.benefits)}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
