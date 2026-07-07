import { gemini } from "@/lib/gemini";
import { buildResumePrompt } from "./resume-prompt";

interface JobPromptData {
  description: string;
  extractedSkills: unknown;
}

interface GenerateResumeAIProps {
  curriculum: unknown;
  job: JobPromptData;
}

export async function generateResumeAI({
  curriculum,
  job,
}: GenerateResumeAIProps) {

  const prompt = buildResumePrompt({
    curriculum,
    job,
  });

  const response = await gemini.models.generateContent({

    model: "gemini-2.5-flash",

    contents: prompt,
  });

  return response.text;
}