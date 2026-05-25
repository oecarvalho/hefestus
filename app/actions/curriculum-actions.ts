'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface SaveCurriculumProps {
  personalInfo: {
    name: string
    email: string
    phoneNumber: string
    birthday?: Date
    linkedin?: string
    portifolio?: string
  }

  resume: {
    resume: string
  }

  experience: any[]
  education: any[]
  skills: string[]
  tools: string[]
  projects: any[]
  languages: any[]
}

export async function saveCurriculum(
  data: SaveCurriculumProps
) {

  await prisma.curriculum.create({

    data: {

      name:
        data.personalInfo.name,

      email:
        data.personalInfo.email,

      phoneNumber:
        data.personalInfo.phoneNumber,

      birthday:
        data.personalInfo.birthday!,

      linkedin:
        data.personalInfo.linkedin || "",

      portfolio:
        data.personalInfo.portifolio || "",

      resume:
        data.resume.resume,

      skills:
        data.skills,

      tools:
        data.tools,

      experiences: {
        create: data.experience.map(exp => ({

          enterpriseName:
            exp.enterpriseName,

          job:
            exp.job,

          startMonth:
            exp.jobStart.month,

          startYear:
            exp.jobStart.year,

          endMonth:
            exp.jobEnd?.month,

          endYear:
            exp.jobEnd?.year,

          jobDescription:
            exp.jobDescription,

          jobLocalization:
            exp.jobLocalization
        }))
      },

      educations: {
        create: data.education.map(edu => ({

          institutionName:
            edu.institutionName,

          title:
            edu.title,

          startMonth:
            edu.start.month,

          startYear:
            edu.start.year,

          endMonth:
            edu.end?.month,

          endYear:
            edu.end?.year,

          description:
            edu.description
        }))
      },

      projects: {
        create: data.projects.map(project => ({

          projectName:
            project.projectName,

          projectLink:
            project.projectLink,

          projectDescription:
            project.projectDescription
        }))
      },

      languages: {
        create: data.languages.map(language => ({

          language:
            language.language,

          level:
            language.level
        }))
      }
    }
  });

  revalidatePath('/curriculo');
}