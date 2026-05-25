"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

export function LanguagesCard() {
  const { control, register, formState } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "languages",
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold uppercase">
            Idiomas
          </CardTitle>

          <Button
            type="button"
            onClick={() =>
              append({
                language: "",
                level: "",
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

              {/* IDIOMA */}
              <Field>
                <FieldLabel>Idioma</FieldLabel>
                <Input
                  {...register(`languages.${index}.language`)}
                />
                <FieldError>
                  {
                    formState.errors.languages?.[index]?.language
                      ?.message
                  }
                </FieldError>
              </Field>

              {/* NÍVEL */}
              <Field>
                <FieldLabel>Nível</FieldLabel>
                <Input
                  placeholder="Ex: Básico, Intermediário, Avançado"
                  {...register(`languages.${index}.level`)}
                />
                <FieldError>
                  {
                    formState.errors.languages?.[index]?.level
                      ?.message
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