'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { unstable_noStore as noStore } from "next/cache";
import { getSession } from "@/lib/auth";
import { z } from "zod";

const personalSchema = z.object({
  name: z.string().trim().min(1, "Nome é obrigatório!"),
  email: z.string().email("E-mail inválido"),
  phoneNumber: z.string().min(1, "Telefone é obrigatório!"),
  birthday: z.preprocess(
    (arg) => (typeof arg === "string" ? new Date(arg) : arg),
    z.date().optional().nullable()
  ),
  linkedin: z.string().url().optional().or(z.literal("")).nullable(),
  portifolio: z.string().url().optional().or(z.literal("")).nullable(),
});

const resumeSchema = z.object({
  resume: z.string().min(50, "É preciso preencher seu resumo profissional!"),
});

const experienceSchema = z.object({
  enterpriseName: z.string().min(3, "Preencha o nome da empresa."),
  job: z.string().trim().min(1, "Preencha o seu cargo."),
  jobStart: z.object({
    month: z.string(),
    year: z.string(),
  }),
  jobEnd: z.object({
    month: z.string(),
    year: z.string(),
  }).optional().nullable(),
  jobDescription: z.string().min(1, "Preencha a descrição do trabalho."),
  jobLocalization: z.string().min(1, "Digite o país da empresa."),
});

const educationSchema = z.object({
  institutionName: z.string().min(3, "Digite o nome da instituição."),
  title: z.string().min(1, "Digite o título da graduação."),
  start: z.object({
    month: z.string(),
    year: z.string(),
  }),
  end: z.object({
    month: z.string(),
    year: z.string(),
  }).optional().nullable(),
  description: z.string().min(1, "Descreva as atividades."),
});

const projectSchema = z.object({
  projectName: z.string().trim().min(1, "Digite o nome do projeto."),
  projectLink: z.string().url("Link inválido"),
  projectDescription: z.string().min(1, "Descreva o projeto."),
});

const languageSchema = z.object({
  language: z.string().min(1, "Digite o idioma."),
  level: z.string().min(1, "Selecione o nível de proficiência."),
});

const curriculumSchema = z.object({
  personalInfo: personalSchema,
  resume: resumeSchema,
  experience: z.array(experienceSchema),
  education: z.array(educationSchema),
  skills: z.array(z.string()).min(1, "Adicione pelo menos uma habilidade."),
  tools: z.array(z.string()).min(1, "Adicione pelo menos uma ferramenta."),
  projects: z.array(projectSchema),
  languages: z.array(languageSchema),
});

interface Experience {
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
}

interface Education {
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
}

interface Project {
  projectName: string;
  projectLink: string;
  projectDescription: string;
}

interface Language {
  language: string;
  level: string;
}

interface SaveCurriculumProps {
  personalInfo: {
    name: string;
    email: string;
    phoneNumber: string;
    birthday?: Date;
    linkedin?: string;
    portifolio?: string;
  };

  resume: {
    resume: string;
  };

  experience: Experience[];
  education: Education[];
  skills: string[];
  tools: string[];
  projects: Project[];
  languages: Language[];
}

export async function saveCurriculum(
  userId: string,
  data: SaveCurriculumProps
) {
noStore();
  const session = await getSession();
  if (!session || session.userId !== userId) {
    throw new Error("Acesso não autorizado.");
  }

  const validated = curriculumSchema.parse(data);

  const curriculumData: {
    name: string
    email: string
    phoneNumber: string
    linkedin: string
    portfolio: string
    resume: string
    skills: string[]
    tools: string[]
    birthday?: Date
  } = {
    name: validated.personalInfo.name,

    email: validated.personalInfo.email,

    phoneNumber: validated.personalInfo.phoneNumber,

    linkedin: validated.personalInfo.linkedin || "",

    portfolio: validated.personalInfo.portifolio || "",

    resume: validated.resume.resume,

    skills: validated.skills,

    tools: validated.tools,
  };

  if (validated.personalInfo.birthday instanceof Date) {
    curriculumData.birthday = validated.personalInfo.birthday;
  }

  const experiencesData = validated.experience.map((exp) => ({
    enterpriseName: exp.enterpriseName,

    job: exp.job,

    startMonth: exp.jobStart.month,

    startYear: exp.jobStart.year,

    endMonth: exp.jobEnd?.month || null,

    endYear: exp.jobEnd?.year || null,

    jobDescription: exp.jobDescription,

    jobLocalization: exp.jobLocalization,
  }));

  const educationsData = validated.education.map((edu) => ({
    institutionName: edu.institutionName,

    title: edu.title,

    startMonth: edu.start.month,

    startYear: edu.start.year,

    endMonth: edu.end?.month || null,

    endYear: edu.end?.year || null,

    description: edu.description,
  }));

  const projectsData = validated.projects.map((project) => ({
    projectName: project.projectName,

    projectLink: project.projectLink,

    projectDescription: project.projectDescription,
  }));

  const languagesData = validated.languages.map((language) => ({
    language: language.language,

    level: language.level,
  }));

  await prisma.curriculum.upsert({

    where: {
      userId,
    },

    update: {

      ...curriculumData,

      experiences: {

        deleteMany: {},

        create: experiencesData,
      },

      educations: {

        deleteMany: {},

        create: educationsData,
      },

      projects: {

        deleteMany: {},

        create: projectsData,
      },

      languages: {

        deleteMany: {},

        create: languagesData,
      },
    },

    create: {

      userId,

      ...curriculumData,

      experiences: {
        create: experiencesData,
      },

      educations: {
        create: educationsData,
      },

      projects: {
        create: projectsData,
      },

      languages: {
        create: languagesData,
      },
    },
  });

  revalidatePath('/curriculo');
}

export async function getCurriculum(userId: string) {
  const session = await getSession();
  if (!session || session.userId !== userId) {
    throw new Error("Acesso não autorizado.");
  }

  return prisma.curriculum.findUnique({

    where: {
      userId,
    },

    include: {
      experiences: true,
      educations: true,
      projects: true,
      languages: true,
    },
  });
}