'use server'
import { unstable_noStore as noStore } from "next/cache";

import { prisma } from "@/lib/prisma";
import { generateResumeAI } from "@/lib/generate-resume";
import { ResumeTemplate } from "@/components/resume-template";
import { pdf } from "@react-pdf/renderer";
import { getSession } from "@/lib/auth";
import { z } from "zod";

const generateSchema = z.object({
  jobId: z.string().cuid('ID de vaga inválido'),
  userId: z.string().cuid('ID de usuário inválido'),
});

const aiResumeSchema = z.object({
  summary: z.string().default(''),
  skills: z.array(z.string()).default([]),
  experiences: z.array(z.object({
    enterpriseName: z.string().default(''),
    job: z.string().default(''),
    period: z.string().default(''),
    description: z.string().default(''),
  })).default([]),
  projects: z.array(z.object({
    projectName: z.string().default(''),
    projectDescription: z.string().default(''),
  })).default([]),
  educations: z.array(z.object({
    institutionName: z.string().default(''),
    title: z.string().default(''),
    period: z.string().default(''),
    description: z.string().optional(),
  })).optional().default([]),
  languages: z.array(z.object({
    language: z.string().default(''),
    level: z.string().default(''),
  })).optional().default([]),
});

export async function generateResumePdf(
  jobId: string,
  userId: string
) {
    noStore();
    const validated = generateSchema.parse({ jobId, userId });

    const session = await getSession();
    if (!session || session.userId !== validated.userId) {
      throw new Error("Acesso não autorizado.");
    }

  const job = await prisma.job.findUnique({
    where: {
      id: validated.jobId
    }
  });

  if (!job) {
    throw new Error("Vaga não encontrada.");
  }

  if (job.userId !== session.userId) {
    throw new Error("Acesso não autorizado.");
  }

  const curriculum =
    await prisma.curriculum.findUnique({

      where: {
        userId: validated.userId
      },

      include: {
        experiences: true,
        educations: true,
        projects: true,
        languages: true,
      }
    });

  if (!curriculum) {
    throw new Error("Currículo não encontrado.");
  }

  // IA
  const aiResponse = await generateResumeAI({
    curriculum,
    job,
  });

  if (!aiResponse) {
    throw new Error("Resposta da IA não foi gerada.");
  }

  let parsedData;
  try {
    const cleanedResponse = aiResponse
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // Extrair apenas o JSON contido entre chaves { } para evitar textos explicativos indesejados da IA
    const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
    const jsonString = jsonMatch ? jsonMatch[0] : cleanedResponse;
    const rawObject = JSON.parse(jsonString);

    parsedData = aiResumeSchema.parse(rawObject);
  } catch (error) {
    console.error("Erro ao analisar ou validar JSON da IA:", error);
    throw new Error("Falha ao analisar os dados customizados gerados pela IA. Por favor, tente novamente.");
  }

  // cria pdf
  const document = (
    <ResumeTemplate
      data={parsedData}
      personalInfo={{
        name: curriculum.name,
        email: curriculum.email,
        phoneNumber: curriculum.phoneNumber,
        linkedin: curriculum.linkedin,
        portfolio: curriculum.portfolio,
      }}
    />
  );

  const pdfBlob = await pdf(document).toBlob();

  const arrayBuffer = await pdfBlob.arrayBuffer();

  const base64 = Buffer
    .from(arrayBuffer)
    .toString("base64");

  return {
    file: base64,
  };
}