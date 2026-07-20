'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { deleteMarketStudy } from "@/app/actions/market-actions";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface DeleteStudyButtonProps {
  studyId: string;
  studyTitle: string;
}

export function DeleteStudyButton({ studyId, studyTitle }: DeleteStudyButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteMarketStudy(studyId);
      toast.success("Estudo excluído com sucesso!");
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao excluir o estudo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
        >
          <Trash2 size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir Estudo</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir o estudo de mercado para <strong>{studyTitle}</strong>? Esta ação excluirá permanentemente todas as vagas cadastradas neste estudo e não poderá ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
            className="gap-2"
          >
            {loading && <Loader2 className="animate-spin size-4" />}
            Excluir permanentemente
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
