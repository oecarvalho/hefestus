'use client'

import { Button } from "@/components/ui/button";

import { generateResumePdf } from "@/app/actions/generate-resume";

import { WandSparkles } from "lucide-react";

import { useTransition } from "react";
import { toast } from "sonner";

export function GenerateResumeButton({
  jobId,
  userId,
  jobTitle,
  nameEnterprise,
}: {
  jobId: string
  userId: string
  jobTitle: string
  nameEnterprise: string
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

        // Converter base64 em blob
        const byteCharacters = atob(result.file);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "application/pdf" });
        const blobUrl = URL.createObjectURL(blob);

        const sanitizedTitle = jobTitle.replace(/[^a-zA-Z0-9]/g, "_");
        const sanitizedEnterprise = nameEnterprise.replace(/[^a-zA-Z0-9]/g, "_");
        const fileName = `curriculo_${sanitizedEnterprise}_${sanitizedTitle}.pdf`;

        // Tentar abrir na nova aba
        const newTab = window.open(blobUrl, "_blank");
        
        if (!newTab) {
          // Se bloqueado pelo navegador, faz download
          const link = document.createElement("a");
          link.href = blobUrl;
          link.download = fileName;
          link.click();
          toast.success("Currículo gerado! Download iniciado.");
        } else {
          toast.success("Currículo gerado! Visualização aberta em nova aba.");
        }
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