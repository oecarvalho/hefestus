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
  userId: string,
  data: SaveCurriculumProps
) {

  const curriculumData = {

    name: data.personalInfo.name,

    email: data.personalInfo.email,

    phoneNumber: data.personalInfo.phoneNumber,

    birthday: data.personalInfo.birthday,

    linkedin: data.personalInfo.linkedin || "",

    portfolio: data.personalInfo.portifolio || "",

    resume: data.resume.resume,

    skills: data.skills,

    tools: data.tools,
  }

  const experiencesData = data.experience.map(exp => ({
    enterpriseName: exp.enterpriseName,

    job: exp.job,

    startMonth: exp.jobStart.month,

    startYear: exp.jobStart.year,

    endMonth: exp.jobEnd?.month,

    endYear: exp.jobEnd?.year,

    jobDescription: exp.jobDescription,

    jobLocalization: exp.jobLocalization
  }))

  const educationsData = data.education.map(edu => ({
    institutionName: edu.institutionName,

    title: edu.title,

    startMonth: edu.start.month,

    startYear: edu.start.year,

    endMonth: edu.end?.month,

    endYear: edu.end?.year,

    description: edu.description
  }))

  const projectsData = data.projects.map(project => ({
    projectName: project.projectName,

    projectLink: project.projectLink,

    projectDescription: project.projectDescription
  }))

  const languagesData = data.languages.map(language => ({
    language: language.language,

    level: language.level
  }))

  await prisma.curriculum.upsert({

    where: {
      userId
    },

    update: {

      ...curriculumData,

      experiences: {

        deleteMany: {},

        create: experiencesData
      },

      educations: {

        deleteMany: {},

        create: educationsData
      },

      projects: {

        deleteMany: {},

        create: projectsData
      },

      languages: {

        deleteMany: {},

        create: languagesData
      }
    },

    create: {

      userId,

      ...curriculumData,

      experiences: {
        create: experiencesData
      },

      educations: {
        create: educationsData
      },

      projects: {
        create: projectsData
      },

      languages: {
        create: languagesData
      }
    }
  })

  revalidatePath('/curriculo')
}

export async function getCurriculum(userId: string) {

    return prisma.curriculum.findUnique({

        where: {
            userId
        },

        include: {
            experiences: true,
            educations: true,
            projects: true,
            languages: true,
        }
    })
}