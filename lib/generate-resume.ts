import { gemini } from "@/lib/gemini";
import { buildResumePrompt } from "./resume-prompt";

interface GenerateResumeAIProps {
  curriculum: any
  job: any
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

    model: "gemini-3.5-flash",

    contents: prompt,
  });

  return response.text;
}