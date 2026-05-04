import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { email, z } from 'zod'

const personalSchema = z.object({
    name: z.string().trim().min(1, {
        message: 'Nome é obrigatório!'
    }),
    email: z.email({
        message: 'E-mail é obrigatório!'
    }),
    phoneNumber: z.string().min(1, {
        message: 'Telefone é obrigatório!'
    }),
    birthday: z.date().min(1, {
        message: 'Data de nascimento é obrigatório!'
    }),
    linkedin: z.url().optional(),
    portifolio: z.url().optional()
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
    }),
    skills: z.array(z.string().trim().toLowerCase().min(1, "Habilidade inválida")
    ).min(1, "Adicione pelo menos uma habilidade")
});

const skillSchema = z.object({
    hardSkills: z.array(z.string().trim().toLowerCase().min(1, "Habilidade inválida")).min(1, "Adicione pelo menos uma habilidade")
})

const toolSchema = z.object({
    toolsSkills: z.array(z.string().trim().toLowerCase().min(1, "Ferranebta inválida")).min(1, "Adicione pelo menos uma ferramenta")
})

const projectSchema = z.object({
    projectName: z.string().trim().min(1, {
        message: 'digite o nome do projeto'
    }),
    projectLink: z.url(),
    projectDescription: z.string().min(1, {
        message: 'descreva o projeto em detalhes'
    }),
    usedTecnologies: z.array(z.string().trim().toLowerCase().min(1, "Habilidade inválida")).min(1, "Adicione pelo menos uma habilidade")
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
    skills: skillSchema,
    tools: toolSchema,
    projects: z.array(projectSchema),
    languages: z.array(languageSchema)
})

export default function Curriculo() {
    return (
        <section className="h-full w-300 m-auto py-16">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold">Currículo Base</h1>
                    <p className="text-muted-foreground text-sm">Preencha as informações abaixo. Esse currículo será a base para gerarmos versões personalizadas.</p>
                </div>

                <Button>Salvar</Button>
            </div>

            <div className="flex flex-col my-6 gap-8">
                <Card >
                    <CardHeader >
                        <CardTitle className="text-xl font-bold uppercase ">Dados Pessoais</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-between">

                    </CardContent>
                </Card>
                <Card >
                    <CardHeader >
                        <CardTitle className="text-xl font-bold uppercase ">Resumo Profissional</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-between">

                    </CardContent>
                </Card>
                <Card >
                    <CardHeader >
                        <CardTitle className="text-xl font-bold uppercase ">Experiências Profissionais</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-between">

                    </CardContent>
                </Card>

                <Card >
                    <CardHeader >
                        <CardTitle className="text-xl font-bold uppercase ">Educação</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-between">

                    </CardContent>
                </Card>

                <div className="grid grid-cols-2 gap-8">
                    <Card >
                        <CardHeader >
                            <CardTitle className="text-xl font-bold uppercase ">Habilidades Técnicas</CardTitle>
                        </CardHeader>
                        <CardContent className="flex justify-between">

                        </CardContent>
                    </Card>

                    <Card >
                        <CardHeader >
                            <CardTitle className="text-xl font-bold uppercase ">Ferramentas</CardTitle>
                        </CardHeader>
                        <CardContent className="flex justify-between">

                        </CardContent>
                    </Card>
                </div>

                <Card >
                    <CardHeader >
                        <CardTitle className="text-xl font-bold uppercase ">Idiomas</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-between">

                    </CardContent>
                </Card>

                <Card >
                    <CardHeader >
                        <CardTitle className="text-xl font-bold uppercase ">Projetos</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-between">

                    </CardContent>
                </Card>
            </div>


        </section>
    )
}