'use client'

import { Button } from "@/components/ui/button";

import { generateResumePdf } from "@/app/actions/generate-resume";

import { FileText, WandSparkles } from "lucide-react";

import { useTransition } from "react";

export function GenerateResumeButton({
  jobId,
  userId,
}: {
  jobId: string
  userId: string
}) {

  const [isPending, startTransition]
    = useTransition();

  async function handleGenerate() {

    startTransition(async () => {

      const result =
        await generateResumePdf(
          jobId,
          userId
        );

      const link = document.createElement("a");

      link.href =
        `data:application/pdf;base64,${result.file}`;

      link.download =
        "curriculo.pdf";

      link.click();
    });
  }

  return (
    <Button
      onClick={handleGenerate}
      disabled={isPending}
    >
      <WandSparkles/>

      {isPending
        ? "Gerando..."
        : "Gerar currículo IA"}
    </Button>
  );
}