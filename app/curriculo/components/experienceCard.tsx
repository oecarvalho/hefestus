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

export function ExperienceCard() {
    const { control, register, formState } = useFormContext();

    const { fields, append, remove } = useFieldArray({
        control,
        name: "experience",
    });

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle className="text-xl font-bold uppercase">Experiências Profissionais</CardTitle>

                    <Button
                        type="button"
                        onClick={() =>
                            append({
                                enterpriseName: "",
                                job: "",
                                jobStart: { month: "", year: "" },
                                jobEnd: { month: "", year: "" },
                                jobDescription: "",
                                jobLocalization: "",
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

                            {/* EMPRESA */}
                            <Field>
                                <FieldLabel>Empresa</FieldLabel>
                                <Input
                                    {...register(`experience.${index}.enterpriseName`)}
                                />
                                <FieldError>
                                    {
                                        formState.errors.experience?.[index]
                                            ?.enterpriseName?.message
                                    }
                                </FieldError>
                            </Field>

                            {/* CARGO */}
                            <Field>
                                <FieldLabel>Cargo</FieldLabel>
                                <Input
                                    {...register(`experience.${index}.job`)}
                                />
                                <FieldError>
                                    {
                                        formState.errors.experience?.[index]
                                            ?.job?.message
                                    }
                                </FieldError>
                            </Field>

                            {/* LOCAL */}
                            <Field>
                                <FieldLabel>Local</FieldLabel>
                                <Input
                                    {...register(`experience.${index}.jobLocalization`)}
                                />
                            </Field>

                            <div className="grid grid-cols-2 gap-4">

                                {/* INÍCIO */}
                                <Field>
                                    <FieldLabel>Início</FieldLabel>

                                    <div className="flex gap-2">
                                        <select
                                            {...register(`experience.${index}.jobStart.month`)}
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
                                            {...register(`experience.${index}.jobStart.year`)}
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

                                    <FieldError>
                                        {
                                            formState.errors.experience?.[index]?.jobStart?.month?.message
                                        }
                                    </FieldError>
                                </Field>

                                {/* FIM */}
                                <Field>
                                    <FieldLabel>Fim</FieldLabel>

                                    <div className="flex gap-2">
                                        <select
                                            {...register(`experience.${index}.jobEnd.month`)}
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
                                            {...register(`experience.${index}.jobEnd.year`)}
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
                                    {...register(`experience.${index}.jobDescription`)}
                                />
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