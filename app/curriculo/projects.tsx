"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";

export function ProjectsCard() {
  const { control, register, formState } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "projects",
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold uppercase">
            Projetos
          </CardTitle>

          <Button
            type="button"
            onClick={() =>
              append({
                projectName: "",
                projectLink: "",
                projectDescription: "",
              })
            }
          >
            <Plus /> Adicionar
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {fields.map((field, index) => (
          <Card key={field.id}>
            <CardContent className="grid grid-cols-2 gap-4">

              {/* NOME */}
              <Field>
                <FieldLabel>Nome do Projeto</FieldLabel>
                <Input
                  {...register(`projects.${index}.projectName`)}
                />
                <FieldError>
                  {
                    formState.errors.projects?.[index]?.projectName
                      ?.message
                  }
                </FieldError>
              </Field>

              {/* LINK */}
              <Field>
                <FieldLabel>Link</FieldLabel>
                <Input
                  {...register(`projects.${index}.projectLink`)}
                />
                <FieldError>
                  {
                    formState.errors.projects?.[index]?.projectLink
                      ?.message
                  }
                </FieldError>
              </Field>

              {/* DESCRIÇÃO */}
              <Field className="col-span-2">
                <FieldLabel>Descrição</FieldLabel>
                <Textarea
                  {...register(`projects.${index}.projectDescription`)}
                />
                <FieldError>
                  {
                    formState.errors.projects?.[index]
                      ?.projectDescription?.message
                  }
                </FieldError>
              </Field>

              {/* REMOVER */}
              <div className="col-span-2 flex justify-end">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => remove(index)}
                >
                  Remover
                </Button>
              </div>

            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}