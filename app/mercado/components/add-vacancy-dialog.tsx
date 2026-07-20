'use client'

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FieldGroup, Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Plus, Loader2 } from "lucide-react";
import { createMarketVacancy } from "@/app/actions/market-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  enterprise: z.string().trim().min(1, "O nome da empresa é obrigatório!"),
  role: z.string().trim().min(1, "O cargo é obrigatório!"),
  url: z.string().trim().url("URL inválida!").optional().or(z.literal("")),
  description: z.string().min(1, "A descrição da vaga é obrigatória!"),
});

type FormSchema = z.infer<typeof formSchema>;

interface AddVacancyDialogProps {
  studyId: string;
}

export function AddVacancyDialog({ studyId }: AddVacancyDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      enterprise: "",
      role: "",
      url: "",
      description: "",
    },
  });

  const onSubmit = async (data: FormSchema) => {
    try {
      setLoading(true);
      await createMarketVacancy({
        studyId,
        ...data,
      });
      toast.success("Vaga cadastrada e analisada pela IA com sucesso!");
      form.reset();
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao cadastrar a vaga. Verifique os campos ou tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus size={16} />
          Adicionar Vaga
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Adicionar Vaga ao Estudo</DialogTitle>
          <DialogDescription>
            Insira os dados da vaga. Nossa Inteligência Artificial analisará a descrição completa para extrair as tecnologias exigidas automaticamente.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <FieldGroup>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Empresa</FieldLabel>
                <Input
                  {...form.register("enterprise")}
                  placeholder="Ex: Nubank, iFood..."
                  disabled={loading}
                />
                <FieldError>
                  {form.formState.errors.enterprise?.message}
                </FieldError>
              </Field>

              <Field>
                <FieldLabel>Cargo</FieldLabel>
                <Input
                  {...form.register("role")}
                  placeholder="Ex: Desenvolvedor Front-end"
                  disabled={loading}
                />
                <FieldError>
                  {form.formState.errors.role?.message}
                </FieldError>
              </Field>
            </div>

            <Field>
              <FieldLabel>URL da Vaga (Opcional)</FieldLabel>
              <Input
                {...form.register("url")}
                placeholder="Ex: https://linkedin.com/jobs/..."
                disabled={loading}
              />
              <FieldError>
                {form.formState.errors.url?.message}
              </FieldError>
            </Field>

            <Field>
              <FieldLabel>Descrição Completa da Vaga</FieldLabel>
              <Controller
                name="description"
                control={form.control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    placeholder="Cole aqui todos os requisitos, responsabilidades, tecnologias e benefícios descritos na vaga..."
                    className="min-h-[160px] resize-y"
                    disabled={loading}
                  />
                )}
              />
              <FieldError>
                {form.formState.errors.description?.message}
              </FieldError>
            </Field>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading} className="gap-2">
                {loading ? (
                  <>
                    <Loader2 className="animate-spin size-4" />
                    Extraindo dados via IA...
                  </>
                ) : (
                  "Salvar e Analisar"
                )}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
