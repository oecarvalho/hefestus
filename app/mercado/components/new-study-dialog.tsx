'use client'

import { useState } from "react";
import { useForm } from "react-hook-form";
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
import { createMarketStudy } from "@/app/actions/market-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  title: z.string().trim().min(1, "O nome da profissão é obrigatório!"),
  description: z.string().trim().optional(),
});

type FormSchema = z.infer<typeof formSchema>;

export function NewStudyDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const onSubmit = async (data: FormSchema) => {
    try {
      setLoading(true);
      const study = await createMarketStudy(data);
      toast.success("Estudo de mercado criado com sucesso!");
      form.reset();
      setOpen(false);
      router.push(`/mercado/${study.id}`);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar o estudo de mercado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus size={16} />
          Novo Estudo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Criar Estudo de Mercado</DialogTitle>
          <DialogDescription>
            Defina o cargo ou profissão para o qual você deseja realizar a análise agregada de vagas.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <FieldGroup>
            <Field>
              <FieldLabel>Nome da Profissão / Cargo</FieldLabel>
              <Input
                {...form.register("title")}
                placeholder="Ex: Front-end React, Product Manager..."
                disabled={loading}
              />
              <FieldError>
                {form.formState.errors.title?.message}
              </FieldError>
            </Field>

            <Field>
              <FieldLabel>Descrição (Opcional)</FieldLabel>
              <Textarea
                {...form.register("description")}
                placeholder="Ex: Análise focada em vagas pleno/sênior do mercado brasileiro."
                disabled={loading}
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
                {loading && <Loader2 className="animate-spin size-4" />}
                Criar Estudo
              </Button>
            </div>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
