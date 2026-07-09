"use client";

import {
    useFormContext,
    useFieldArray,
} from "react-hook-form";

import { Button } from "@/components/ui/button";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    Field,
    FieldLabel,
    FieldError,
} from "@/components/ui/field";

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

type CurriculumFormData = {
    education: {
        institutionName: string;

        title: string;

        start: {
            month: string;
            year: string;
        };

        end?: {
            month: string;
            year: string;
        };

        description: string;
    }[];
};

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

    const {
        control,
        register,
        formState,
    } = useFormContext<CurriculumFormData>();

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
                        className="gap-2"
                        onClick={() =>
                            append({
                                institutionName: "",
                                title: "",

                                start: {
                                    month: "",
                                    year: "",
                                },

                                end: {
                                    month: "",
                                    year: "",
                                },

                                description: "",
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

                            <Field>
                                <FieldLabel>
                                    Instituição
                                </FieldLabel>

                                <Input
                                    {...register(
                                        `education.${index}.institutionName` as const
                                    )}
                                />

                                <FieldError>
                                    {
                                        formState.errors.education?.[index]
                                            ?.institutionName?.message
                                    }
                                </FieldError>
                            </Field>

                            <Field>
                                <FieldLabel>
                                    Curso / Formação
                                </FieldLabel>

                                <Input
                                    {...register(
                                        `education.${index}.title` as const
                                    )}
                                />

                                <FieldError>
                                    {
                                        formState.errors.education?.[index]
                                            ?.title?.message
                                    }
                                </FieldError>
                            </Field>

                            <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-4">

                                <Field>
                                    <FieldLabel>
                                        Início
                                    </FieldLabel>

                                    <div className="flex gap-2">

                                        <select
                                            {...register(
                                                `education.${index}.start.month` as const
                                            )}
                                            className="flex h-9 w-full rounded-md border border-input bg-background px-2 py-1 text-sm shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                                        >
                                            <option value="">
                                                Mês
                                            </option>

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
                                                `education.${index}.start.year` as const
                                            )}
                                            className="flex h-9 w-full rounded-md border border-input bg-background px-2 py-1 text-sm shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                                        >
                                            <option value="">
                                                Ano
                                            </option>

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
                                </Field>

                                <Field>
                                    <FieldLabel>
                                        Fim
                                    </FieldLabel>

                                    <div className="flex gap-2">

                                        <select
                                            {...register(
                                                `education.${index}.end.month` as const
                                            )}
                                            className="flex h-9 w-full rounded-md border border-input bg-background px-2 py-1 text-sm shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                                        >
                                            <option value="">
                                                Mês
                                            </option>

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
                                                `education.${index}.end.year` as const
                                            )}
                                            className="flex h-9 w-full rounded-md border border-input bg-background px-2 py-1 text-sm shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                                        >
                                            <option value="">
                                                Ano
                                            </option>

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
                                </Field>

                            </div>

                            <Field className="col-span-1 md:col-span-2">

                                <FieldLabel>
                                    Descrição
                                </FieldLabel>

                                <Textarea
                                    {...register(
                                        `education.${index}.description` as const
                                    )}
                                />

                                <FieldError>
                                    {
                                        formState.errors.education?.[index]
                                            ?.description?.message
                                    }
                                </FieldError>

                            </Field>

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
                                            <AlertDialogTitle>Deseja remover esta formação?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Esta ação removerá permanentemente os dados preenchidos para esta formação do seu currículo.
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