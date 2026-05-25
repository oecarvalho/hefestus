"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";

const months = [
    { label: "Jan", value: "01" },
    { label: "Fev", value: "02" },
    { label: "Mar", value: "03" },
    { label: "Abr", value: "04" },
    { label: "Mai", value: "05" },
    { label: "Jun", value: "06" },
    { label: "Jul", value: "07" },
    { label: "Ago", value: "08" },
    { label: "Set", value: "09" },
    { label: "Out", value: "10" },
    { label: "Nov", value: "11" },
    { label: "Dez", value: "12" },
];

const years = Array.from({ length: 50 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return year.toString();
});

export function EducationCard() {
    const { control, register, formState, setValue, watch } = useFormContext();

    const {
        fields,
        append,
        remove,
    } = useFieldArray({
        control,
        name: "education",
    });

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle className="text-xl font-bold uppercase">
                        Educação
                    </CardTitle>

                    <Button
                        type="button"
                        onClick={() =>
                            append({
                                institutionName: "",
                                title: "",
                                start: { month: "", year: "" },
                                end: { month: "", year: "" },
                                description: "",
                                skills: [],
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

                            {/* INSTITUIÇÃO */}
                            <Field>
                                <FieldLabel>Instituição</FieldLabel>
                                <Input
                                    {...register(`education.${index}.institutionName`)}
                                />
                                <FieldError>
                                    {
                                        formState.errors.education?.[index]
                                            ?.institutionName?.message
                                    }
                                </FieldError>
                            </Field>

                            {/* CURSO */}
                            <Field>
                                <FieldLabel>Curso / Formação</FieldLabel>
                                <Input
                                    {...register(`education.${index}.title`)}
                                />
                                <FieldError>
                                    {
                                        formState.errors.education?.[index]
                                            ?.title?.message
                                    }
                                </FieldError>
                            </Field>

                            {/* DATAS */}
                            <div className="col-span-2 grid grid-cols-2 gap-4">

                                {/* INÍCIO */}
                                <Field>
                                    <FieldLabel>Início</FieldLabel>

                                    <div className="flex gap-2">
                                        <select
                                            {...register(`education.${index}.start.month`)}
                                            className="border rounded p-2 w-full"
                                        >
                                            <option value="">Mês</option>
                                            {months.map((m) => (
                                                <option key={m.value} value={m.value}>
                                                    {m.label}
                                                </option>
                                            ))}
                                        </select>

                                        <select
                                            {...register(`education.${index}.start.year`)}
                                            className="border rounded p-2 w-full"
                                        >
                                            <option value="">Ano</option>
                                            {years.map((y) => (
                                                <option key={y} value={y}>
                                                    {y}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </Field>

                                {/* FIM */}
                                <Field>
                                    <FieldLabel>Fim</FieldLabel>

                                    <div className="flex gap-2">
                                        <select
                                            {...register(`education.${index}.end.month`)}
                                            className="border rounded p-2 w-full"
                                        >
                                            <option value="">Mês</option>
                                            {months.map((m) => (
                                                <option key={m.value} value={m.value}>
                                                    {m.label}
                                                </option>
                                            ))}
                                        </select>

                                        <select
                                            {...register(`education.${index}.end.year`)}
                                            className="border rounded p-2 w-full"
                                        >
                                            <option value="">Ano</option>
                                            {years.map((y) => (
                                                <option key={y} value={y}>
                                                    {y}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </Field>

                            </div>

                            {/* DESCRIÇÃO */}
                            <Field className="col-span-2">
                                <FieldLabel>Descrição</FieldLabel>
                                <Textarea
                                    {...register(`education.${index}.description`)}
                                />
                                <FieldError>
                                    {
                                        formState.errors.education?.[index]
                                            ?.description?.message
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