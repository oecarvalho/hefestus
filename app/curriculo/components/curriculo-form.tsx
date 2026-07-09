'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { z } from "zod";
import { FormProvider, useForm, FieldErrors } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Prisma } from "@prisma/client";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { saveCurriculum } from "@/app/actions/curriculum-actions";

import { BirthdayField } from "./birthdayPopover";
import { ExperienceCard } from "./experienceCard";
import { EducationCard } from "./educationCards";
import { ProjectsCard } from "./projects";
import { Loader2 } from "lucide-react";
import { LanguagesCard } from "./languageCards";

import { TagsField } from "../tagField";

const personalSchema = z.object({
    name: z.string().trim().min(1, {
        message: "Nome é obrigatório!",
    }),

    email: z.string().email(),

    phoneNumber: z.string().min(1, {
        message: "Telefone é obrigatório!",
    }),

    birthday: z.date().optional(),

    linkedin: z.string().url().optional().or(z.literal("")),

    portifolio: z.string().url().optional().or(z.literal("")),
});

const resumeSchema = z.object({
    resume: z.string().min(50, {
        message: "É preciso preencher seu resumo profissional!",
    }),
});

const experienceSchema = z.object({
    enterpriseName: z.string().min(3, {
        message: "Preencha o nome da empresa.",
    }),

    job: z.string().trim().min(1, {
        message: "Preencha o seu cargo.",
    }),

    jobStart: z.object({
        month: z.string(),
        year: z.string(),
    }),

    jobEnd: z.object({
        month: z.string(),
        year: z.string(),
    }).optional(),

    jobDescription: z.string().min(1, {
        message: "Preencha a descrição do trabalho.",
    }),

    jobLocalization: z.string().min(1, {
        message: "Digite o país da empresa.",
    }),
});

const educationSchema = z.object({
    institutionName: z.string().min(3, {
        message: "Digite o nome da instituição.",
    }),

    title: z.string().min(1, {
        message: "Digite o título da graduação.",
    }),

    start: z.object({
        month: z.string(),
        year: z.string(),
    }),

    end: z.object({
        month: z.string(),
        year: z.string(),
    }).optional(),

    description: z.string().min(1, {
        message: "Descreva as atividades.",
    }),
});

const projectSchema = z.object({
    projectName: z.string().trim().min(1, {
        message: "Digite o nome do projeto.",
    }),

    projectLink: z.string().url(),

    projectDescription: z.string().min(1, {
        message: "Descreva o projeto.",
    }),
});

const languageSchema = z.object({
    language: z.string().min(1, {
        message: "Digite o idioma.",
    }),

    level: z.string().min(1, {
        message: "Selecione o nível de proficiência.",
    }),
});

const curriculumSchema = z.object({
    personalInfo: personalSchema,

    resume: resumeSchema,

    experience: z.array(experienceSchema),

    education: z.array(educationSchema),

    skills: z.array(z.string()).min(1, {
        message: "Adicione pelo menos uma habilidade.",
    }),

    tools: z.array(z.string()).min(1, {
        message: "Adicione pelo menos uma ferramenta.",
    }),

    projects: z.array(projectSchema),

    languages: z.array(languageSchema),
});

type CurriculumFormData = z.infer<typeof curriculumSchema>;

type CurriculumWithRelations = Prisma.CurriculumGetPayload<{
    include: {
        experiences: true;
        educations: true;
        projects: true;
        languages: true;
    };
}>;

interface CurriculoFormProps {
    curriculum: CurriculumWithRelations | null;
    userId: string;
}

export default function CurriculoForm({
    curriculum,
    userId,
}: CurriculoFormProps) {

    const defaultValues: CurriculumFormData = curriculum
        ? {
            personalInfo: {
                name: curriculum.name || "",

                email: curriculum.email || "",

                phoneNumber: curriculum.phoneNumber || "",

                birthday: curriculum.birthday
                    ? new Date(curriculum.birthday)
                    : undefined,

                linkedin: curriculum.linkedin || "",

                portifolio: curriculum.portfolio || "",
            },

            resume: {
                resume: curriculum.resume || "",
            },

            experience: curriculum.experiences.map((exp) => ({
                enterpriseName: exp.enterpriseName,

                job: exp.job,

                jobStart: {
                    month: exp.startMonth,
                    year: exp.startYear,
                },

                jobEnd:
                    exp.endMonth && exp.endYear
                        ? {
                            month: exp.endMonth,
                            year: exp.endYear,
                        }
                        : undefined,

                jobDescription: exp.jobDescription,

                jobLocalization: exp.jobLocalization,
            })),

            education: curriculum.educations.map((edu) => ({
                institutionName: edu.institutionName,

                title: edu.title,

                start: {
                    month: edu.startMonth,
                    year: edu.startYear,
                },

                end:
                    edu.endMonth && edu.endYear
                        ? {
                            month: edu.endMonth,
                            year: edu.endYear,
                        }
                        : undefined,

                description: edu.description,
            })),

            skills: curriculum.skills || [],

            tools: curriculum.tools || [],

            projects: curriculum.projects.map((project) => ({
                projectName: project.projectName,
                projectLink: project.projectLink,
                projectDescription: project.projectDescription,
            })),

            languages: curriculum.languages.map((language) => ({
                language: language.language,
                level: language.level,
            })),
        }

        : {
            personalInfo: {
                name: "",
                email: "",
                phoneNumber: "",
                birthday: undefined,
                linkedin: "",
                portifolio: "",
            },

            resume: {
                resume: "",
            },

            experience: [],

            education: [],

            skills: [],

            tools: [],

            projects: [],

            languages: [],
        };

    const form = useForm<CurriculumFormData>({
        resolver: zodResolver(curriculumSchema),

        defaultValues,
    });

    const onSubmit = async (data: CurriculumFormData) => {
        try {
            await saveCurriculum(userId, data);
            toast.success("Currículo base salvo com sucesso!");
        } catch (error) {
            console.error("Erro ao salvar currículo:", error);
            toast.error("Ocorreu um erro ao salvar o currículo.");
        }
    };

    const onError = (errors: FieldErrors<CurriculumFormData>) => {
        console.log(errors);
    };

    return (
        <section className="h-full max-w-6xl w-full px-4 mx-auto py-16">

            <div className="flex justify-between items-end mb-8 pb-4 border-b border-border/40">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                        Currículo Base
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Cadastre suas informações principais para personalizar com IA de acordo com as vagas.
                    </p>
                </div>
            </div>

            <FormProvider {...form}>

                <form onSubmit={form.handleSubmit(onSubmit, onError)}>

                    <div className="flex flex-col my-6 gap-8">

                        <Card>

                            <CardHeader>
                                <CardTitle className="text-xl font-bold uppercase">
                                    Dados Pessoais
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <Field>
                                    <FieldLabel>
                                        Nome*
                                    </FieldLabel>

                                    <Input
                                        {...form.register("personalInfo.name")}
                                    />

                                    <FieldError>
                                        {form.formState.errors.personalInfo?.name?.message}
                                    </FieldError>
                                </Field>

                                <Field>
                                    <FieldLabel>
                                        E-mail*
                                    </FieldLabel>

                                    <Input
                                        {...form.register("personalInfo.email")}
                                    />

                                    <FieldError>
                                        {form.formState.errors.personalInfo?.email?.message}
                                    </FieldError>
                                </Field>

                                <Field>
                                    <FieldLabel>
                                        Telefone*
                                    </FieldLabel>

                                    <Input
                                        {...form.register("personalInfo.phoneNumber")}
                                    />

                                    <FieldError>
                                        {form.formState.errors.personalInfo?.phoneNumber?.message}
                                    </FieldError>
                                </Field>

                                <Field>
                                    <FieldLabel>
                                        Data de nascimento
                                    </FieldLabel>

                                    <BirthdayField />

                                    <FieldError>
                                        {form.formState.errors.personalInfo?.birthday?.message}
                                    </FieldError>
                                </Field>

                                <Field>
                                    <FieldLabel>
                                        LinkedIn
                                    </FieldLabel>

                                    <Input
                                        {...form.register("personalInfo.linkedin")}
                                    />

                                    <FieldError>
                                        {form.formState.errors.personalInfo?.linkedin?.message}
                                    </FieldError>
                                </Field>

                                <Field>
                                    <FieldLabel>
                                        Portfólio
                                    </FieldLabel>

                                    <Input
                                        {...form.register("personalInfo.portifolio")}
                                    />

                                    <FieldError>
                                        {form.formState.errors.personalInfo?.portifolio?.message}
                                    </FieldError>
                                </Field>

                            </CardContent>
                        </Card>

                        <Card>

                            <CardHeader>
                                <CardTitle className="text-xl font-bold uppercase">
                                    Resumo Profissional
                                </CardTitle>
                            </CardHeader>

                            <CardContent>

                                <Field>
                                    <Textarea
                                        {...form.register("resume.resume")}
                                        placeholder="Escreva um resumo profissional detalhado das suas principais experiências e objetivos..."
                                    />
                                    <FieldError>
                                        {form.formState.errors.resume?.resume?.message}
                                    </FieldError>
                                </Field>

                            </CardContent>
                        </Card>

                        <ExperienceCard />

                        <EducationCard />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            <Card>

                                <CardHeader>
                                    <CardTitle className="text-xl font-bold uppercase">
                                        Habilidades Técnicas
                                    </CardTitle>
                                </CardHeader>

                                <CardContent className="w-full">
                                    <TagsField
                                        name="skills"
                                        label="Habilidades Técnicas"
                                        placeholder="Ex: React, Docker..."
                                    />
                                </CardContent>

                            </Card>

                            <Card>

                                <CardHeader>
                                    <CardTitle className="text-xl font-bold uppercase">
                                        Ferramentas
                                    </CardTitle>
                                </CardHeader>

                                <CardContent className="w-full">
                                    <TagsField
                                        name="tools"
                                        label="Ferramentas"
                                        placeholder="Ex: Figma, Docker..."
                                    />
                                </CardContent>

                            </Card>

                        </div>

                        <ProjectsCard />

                        <LanguagesCard />

                    </div>

                    <div className="flex justify-end mt-8 mb-16">
                        <Button 
                            type="submit" 
                            size="lg" 
                            className="px-8 font-medium gap-2"
                            disabled={form.formState.isSubmitting}
                        >
                            {form.formState.isSubmitting ? (
                                <>
                                    <Loader2 className="animate-spin size-4" />
                                    Salvando...
                                </>
                            ) : (
                                "Salvar Currículo"
                            )}
                        </Button>
                    </div>

                </form>

            </FormProvider>

        </section>
    );
}