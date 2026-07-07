'use client'

import { Button } from "@/components/ui/button";

import { generateResumePdf } from "@/app/actions/generate-resume";

import { WandSparkles } from "lucide-react";

import { useTransition } from "react";
import { toast } from "sonner";

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
      try {
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
        toast.success("Currículo personalizado gerado com sucesso!");
      } catch (error) {
        console.error('Erro ao gerar currículo:', error);
        const errorMessage = error instanceof Error ? error.message : "Ocorreu um erro ao gerar o currículo.";
        toast.error(errorMessage);
      }
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