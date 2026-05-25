'use server'

import { prisma } from "@/lib/prisma";
import { generateResumeAI } from "@/lib/generate-resume";
import { ResumeTemplate } from "@/components/resume-template";
import { pdf } from "@react-pdf/renderer";

export async function generateResumePdf(
  jobId: string,
  userId: string
) {

  const job = await prisma.job.findUnique({
    where: {
      id: jobId
    }
  });

  if (!job) {
    throw new Error("Vaga não encontrada.");
  }

  const curriculum =
    await prisma.curriculum.findUnique({

      where: {
        userId
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

  // remove markdown
  const cleanedResponse = aiResponse
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  // converte para objeto
  const parsedData = JSON.parse(cleanedResponse);

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