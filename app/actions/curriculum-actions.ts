'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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
    name: data.personalInfo.name,

    email: data.personalInfo.email,

    phoneNumber: data.personalInfo.phoneNumber,

    linkedin: data.personalInfo.linkedin || "",

    portfolio: data.personalInfo.portifolio || "",

    resume: data.resume.resume,

    skills: data.skills,

    tools: data.tools,
  };

  if (data.personalInfo.birthday instanceof Date) {
    curriculumData.birthday = data.personalInfo.birthday;
  }

  const experiencesData = data.experience.map((exp: Experience) => ({
    enterpriseName: exp.enterpriseName,

    job: exp.job,

    startMonth: exp.jobStart.month,

    startYear: exp.jobStart.year,

    endMonth: exp.jobEnd?.month || null,

    endYear: exp.jobEnd?.year || null,

    jobDescription: exp.jobDescription,

    jobLocalization: exp.jobLocalization,
  }));

  const educationsData = data.education.map((edu: Education) => ({
    institutionName: edu.institutionName,

    title: edu.title,

    startMonth: edu.start.month,

    startYear: edu.start.year,

    endMonth: edu.end?.month || null,

    endYear: edu.end?.year || null,

    description: edu.description,
  }));

  const projectsData = data.projects.map((project: Project) => ({
    projectName: project.projectName,

    projectLink: project.projectLink,

    projectDescription: project.projectDescription,
  }));

  const languagesData = data.languages.map((language: Language) => ({
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