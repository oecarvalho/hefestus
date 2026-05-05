'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { z } from 'zod';
import { useForm, FormProvider } from 'react-hook-form'
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { BirthdayField } from "./birthdayPopover";
import { Textarea } from "@/components/ui/textarea";
import { ExperienceCard } from "./experienceCard";
import { EducationCard } from "./educationCards";
import { TagsField } from "./tagField";
import { ProjectsCard } from "./projects";
import { LanguagesCard } from "./languageCards";
import { useEffect } from "react";


const personalSchema = z.object({
    name: z.string().trim().min(1, {
        message: 'Nome é obrigatório!'
    }),
    email: z.string().min(1).pipe(z.email()),
    phoneNumber: z.string().min(1, {
        message: 'Telefone é obrigatório!'
    }),
    birthday: z.coerce.date().optional(),
    linkedin: z.string().url().optional().or(z.literal("")),
    portifolio: z.string().url().optional().or(z.literal(""))
})

const resumeSchema = z.object({
    resume: z.string().min(50, {
        message: "É preciso preencher seu resumo profissional!"
    })
})

const experienceSchema = z.object({
    enterpriseName: z.string().min(3, {
        message: 'Preencha o nome da empresa.'
    }),
    job: z.string().trim().min(1, {
        message: 'preencha o seu cargo.'
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
        message: 'preencha a descrição do trabalho.'
    }),
    jobLocalization: z.string().min(1, {
        message: 'digite o país da empresa.'
    })
})

const educationSchema = z.object({
    institutionName: z.string().min(3, {
        message: 'Digite o nome da instituição.'
    }),
    title: z.string().min(1, {
        message: 'digite o titulo da sua graduação'
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
        message: 'Descreva as atividades.'
    })
});

const skillSchema = z.object({
    skills: z.array(z.string()).min(1, "Adicione pelo menos uma habilidade"),
})

const toolSchema = z.object({
    tools: z.array(z.string()).min(1, "Adicione pelo menos uma ferramenta"),
})

const projectSchema = z.object({
    projectName: z.string().trim().min(1, {
        message: 'digite o nome do projeto'
    }),
    projectLink: z.url(),
    projectDescription: z.string().min(1, {
        message: 'descreva o projeto em detalhes'
    }),
})

const languageSchema = z.object({
    language: z.string().min(1, {
        message: 'digite o idioma'
    }),
    level: z.string().min(1, {
        message: 'selecione o nivel de proeficiência.'
    })
})

const curriculumSchema = z.object({
    personalInfo: personalSchema,
    resume: resumeSchema,
    experience: z.array(experienceSchema),
    education: z.array(educationSchema),
    skills: z.array(z.string()).min(1, "Adicione pelo menos uma habilidade"),
    tools: z.array(z.string()).min(1, "Adicione pelo menos uma ferramenta"),
    projects: z.array(projectSchema),
    languages: z.array(languageSchema)
})

type CurriculumFormData = z.infer<typeof curriculumSchema>;

export default function Curriculo() {


    const onSubmit = (data: CurriculumFormData) => {
        localStorage.setItem("curriculum", JSON.stringify(data));
        console.log("SALVO", data);
    };

    const onError = (errors) => {
        console.log("ERROS", errors);
    };

    const form = useForm<CurriculumFormData>({
        resolver: zodResolver(curriculumSchema),
        defaultValues: {
            personalInfo: {
                name: '',
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
        },
    })

    useEffect(() => {
        const saved = localStorage.getItem("curriculum");
        if (saved) {
            form.reset(JSON.parse(saved));
        }
    }, []);

    return (
        <section className="h-full w-300 m-auto py-16">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold">Currículo Base</h1>
                    <p className="text-muted-foreground text-sm">Preencha as informações abaixo. Esse currículo será a base para gerarmos versões personalizadas.</p>
                </div>
            </div>

            <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(onSubmit, onError)}>
                    <div className="flex flex-col my-6 gap-8">

                        <Card >
                            <CardHeader >
                                <CardTitle className="text-xl font-bold uppercase ">Dados Pessoais</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-2 gap-4">

                                <Field>
                                    <FieldLabel className="font-medium text-muted-foreground text-xs">Nome*</FieldLabel>
                                    <Input {...form.register('personalInfo.name')} />
                                    <FieldError>
                                        {form.formState.errors.personalInfo?.name?.message}
                                    </FieldError>
                                </Field>

                                <Field>
                                    <FieldLabel className="font-medium text-muted-foreground text-xs">E-mail*</FieldLabel>
                                    <Input {...form.register('personalInfo.email')} />
                                    <FieldError>
                                        {form.formState.errors.personalInfo?.email?.message}
                                    </FieldError>
                                </Field>

                                <Field>
                                    <FieldLabel className="font-medium text-muted-foreground text-xs">Telefone*</FieldLabel>
                                    <Input {...form.register('personalInfo.phoneNumber')} />
                                    <FieldError>
                                        {form.formState.errors.personalInfo?.phoneNumber?.message}
                                    </FieldError>
                                </Field>

                                <Field>
                                    <FieldLabel className="font-medium text-muted-foreground text-xs">Data de Nascimento*</FieldLabel>
                                    <BirthdayField />
                                    <FieldError>
                                        {form.formState.errors.personalInfo?.birthday?.message}
                                    </FieldError>
                                </Field>

                                <Field>
                                    <FieldLabel className="font-medium text-muted-foreground text-xs">LinkedIn*</FieldLabel>
                                    <Input {...form.register('personalInfo.linkedin')} />
                                    <FieldError>
                                        {form.formState.errors.personalInfo?.linkedin?.message}
                                    </FieldError>
                                </Field>

                                <Field>
                                    <FieldLabel className="font-medium text-muted-foreground text-xs">Portifólio*</FieldLabel>
                                    <Input {...form.register('personalInfo.portifolio')} />
                                    <FieldError>
                                        {form.formState.errors.personalInfo?.portifolio?.message}
                                    </FieldError>
                                </Field>
                            </CardContent>
                        </Card>

                        <Card >
                            <CardHeader >
                                <CardTitle className="text-xl font-bold uppercase ">Resumo Profissional</CardTitle>
                            </CardHeader>
                            <CardContent className="flex justify-between">
                                <Field>
                                    <Textarea {...form.register("resume.resume")} />
                                </Field>
                            </CardContent>
                        </Card>

                        <ExperienceCard />

                        <EducationCard />

                        <div className="grid grid-cols-2 gap-8">
                            <Card >
                                <CardHeader >
                                    <CardTitle className="text-xl font-bold uppercase ">Habilidades Técnicas</CardTitle>
                                </CardHeader>
                                <CardContent className="w-full">
                                    <TagsField
                                        name="skills"
                                        label="Habilidades Técnicas"
                                        placeholder="Ex: React, docker..."
                                    />
                                </CardContent>
                            </Card>

                            <Card >
                                <CardHeader >
                                    <CardTitle className="text-xl font-bold uppercase ">Ferramentas</CardTitle>
                                </CardHeader>
                                <CardContent className="w-full">
                                    <TagsField
                                        name="tools"
                                        label="Ferramentas"
                                        placeholder="Ex: figma, docker..."
                                    />
                                </CardContent>
                            </Card>
                        </div>

                        <ProjectsCard />

                        <LanguagesCard />

                    </div>

                    <Button type="submit">Salvar Currículo</Button>
                </form>


            </FormProvider>

        </section>
    )
}