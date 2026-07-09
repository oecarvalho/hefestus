"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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

type ExperienceForm = {
    experience: {
        enterpriseName: string;
        job: string;

        jobStart: {
            month: string;
            year: string;
        };

        jobEnd?: {
            month: string;
            year: string;
        };

        jobDescription: string;
        jobLocalization: string;
    }[];
};

export function ExperienceCard() {

    const {
        control,
        register,
        formState,
    } = useFormContext<ExperienceForm>();

    const { fields, append, remove } = useFieldArray({
        control,
        name: "experience",
    });

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle className="text-xl font-bold uppercase">
                        Experiências Profissionais
                    </CardTitle>

                    <Button
                        type="button"
                        className="gap-2"
                        onClick={() =>
                            append({
                                enterpriseName: "",
                                job: "",
                                jobStart: {
                                    month: "",
                                    year: "",
                                },
                                jobEnd: {
                                    month: "",
                                    year: "",
                                },
                                jobDescription: "",
                                jobLocalization: "",
                            })
                        }
                    >
                        <Plus size={16} />
                        Adicionar
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                {fields.map((field, index) => (
                    <Card key={field.id} className="border border-muted-foreground/10 bg-muted/10">
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">

                            {/* EMPRESA */}
                            <Field>
                                <FieldLabel>Empresa</FieldLabel>

                                <Input
                                    {...register(
                                        `experience.${index}.enterpriseName`
                                    )}
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
                                    {...register(
                                        `experience.${index}.job`
                                    )}
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
                                    {...register(
                                        `experience.${index}.jobLocalization`
                                    )}
                                />

                                <FieldError>
                                    {
                                        formState.errors.experience?.[index]
                                            ?.jobLocalization?.message
                                    }
                                </FieldError>
                            </Field>

                            {/* DATAS */}
                            <div className="grid grid-cols-2 gap-4">

                                {/* INÍCIO */}
                                <Field>
                                    <FieldLabel>Início</FieldLabel>

                                    <div className="flex gap-2">

                                        <select
                                            {...register(
                                                `experience.${index}.jobStart.month`
                                            )}
                                            className="flex h-9 w-full rounded-md border border-input bg-background px-2 py-1 text-sm shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                                        >
                                            <option value="">Mês</option>

                                            {months.map((m) => (
                                                <option
                                                    key={m.value}
                                                    value={m.value}
                                                >
                                                    {m.label}
                                                </option>
                                            ))}
                                        </select>

                                        <select
                                            {...register(
                                                `experience.${index}.jobStart.year`
                                            )}
                                            className="flex h-9 w-full rounded-md border border-input bg-background px-2 py-1 text-sm shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                                        >
                                            <option value="">Ano</option>

                                            {years.map((y) => (
                                                <option
                                                    key={y}
                                                    value={y}
                                                >
                                                    {y}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <FieldError>
                                        {
                                            formState.errors.experience?.[index]
                                                ?.jobStart?.month?.message
                                        }
                                    </FieldError>
                                </Field>

                                {/* FIM */}
                                <Field>
                                    <FieldLabel>Fim</FieldLabel>

                                    <div className="flex gap-2">

                                        <select
                                            {...register(
                                                `experience.${index}.jobEnd.month`
                                            )}
                                            className="flex h-9 w-full rounded-md border border-input bg-background px-2 py-1 text-sm shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                                        >
                                            <option value="">Mês</option>

                                            {months.map((m) => (
                                                <option
                                                    key={m.value}
                                                    value={m.value}
                                                >
                                                    {m.label}
                                                </option>
                                            ))}
                                        </select>

                                        <select
                                            {...register(
                                                `experience.${index}.jobEnd.year`
                                            )}
                                            className="flex h-9 w-full rounded-md border border-input bg-background px-2 py-1 text-sm shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                                        >
                                            <option value="">Ano</option>

                                            {years.map((y) => (
                                                <option
                                                    key={y}
                                                    value={y}
                                                >
                                                    {y}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <FieldError>
                                        {
                                            formState.errors.experience?.[index]
                                                ?.jobEnd?.month?.message
                                        }
                                    </FieldError>
                                </Field>
                            </div>

                            {/* DESCRIÇÃO */}
                            <Field className="col-span-1 md:col-span-2">
                                <FieldLabel>Descrição</FieldLabel>

                                <Textarea
                                    {...register(
                                        `experience.${index}.jobDescription`
                                    )}
                                />

                                <FieldError>
                                    {
                                        formState.errors.experience?.[index]
                                            ?.jobDescription?.message
                                    }
                                </FieldError>
                            </Field>

                            {/* REMOVER */}
                            <div className="col-span-1 md:col-span-2 flex justify-end">
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="gap-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50/50 dark:hover:bg-rose-950/20"
                                        >
                                            <Trash size={16} />
                                            Remover
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Deseja remover esta experiência?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Esta ação removerá permanentemente os dados preenchidos para esta experiência do seu currículo.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                            <AlertDialogAction 
                                                onClick={() => remove(index)} 
                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                            >
                                                Remover
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>

                        </CardContent>
                    </Card>
                ))}
            </CardContent>
        </Card>
    );
}