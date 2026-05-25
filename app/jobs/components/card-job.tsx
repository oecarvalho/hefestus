'use client'

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, ExternalLink, MapPin, Trash } from "lucide-react";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { deleteNewJob, updateJobStatus } from "@/app/actions/actions";
import { toast } from "sonner";
import { useState, useTransition } from "react";
import { getDaysAgo } from "@/lib/get-days";

interface CardJobsProps {
    job: {
        id: string
        jobTitle: string
        nameEnterprise: string
        workModel: string
        status: string
        date: string | Date
    }

    match: {
        matchScore: number
        matchingSkills: string[]
        missingSkills: string[]
    }
}

export function CardJobs({ job, match }: CardJobsProps) {
    const [status, setStatus] = useState(job.status ?? "aplicado");
    const [isPending, startTransition] = useTransition();

    const handleDelete = async () => {
        const result = await deleteNewJob(job.id);

        if (result?.error) {
            toast.error(result.error);
            return;
        }


        toast.success('Vaga removida com sucesso!')
    }

    const updateStatus = async (newStatus: string) => {

        const previousStatus = status;

        setStatus(newStatus);

        startTransition(async () => {

            const result = await updateJobStatus(
                job.id,
                newStatus
            );

            if (result?.error) {

                setStatus(previousStatus);

                toast.error(result.error);
                return;
            }

            toast.success('Status atualizado!')
        });
    }

    return (

        <Card>
            <CardHeader>
                <CardTitle className="font-semibold truncate">{job.jobTitle}</CardTitle>
                <CardDescription className="flex gap-2">
                    <div className="flex gap-1 items-center">
                        <Building2 size={18} />
                        {job.nameEnterprise}
                    </div>

                    <div className="flex gap-1 items-center">
                        <MapPin size={18} />
                        {job.workModel}
                    </div>
                </CardDescription>
                <CardAction className="flex h-16 w-16 flex-col items-center justify-center rounded-full bg-zinc-100">
                    <span className="text-lg font-bold leading-none text-red-400">
                       {match.matchScore}%
                    </span>

                    <span className="text-[10px] font-medium text-zinc-400">
                        match
                    </span>
                </CardAction>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
                <Select value={status} onValueChange={updateStatus} disabled={isPending}>
                    <SelectTrigger className="w-full max-w-40">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="aplicado">Aplicado</SelectItem>
                            <SelectItem value="andamento">Em Andamento</SelectItem>
                            <SelectItem value="rejeitado">Rejeitado</SelectItem>
                            <SelectItem value="cancelado">Cancelada</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>



                <Badge> {getDaysAgo(job.date)}</Badge>
            </CardContent>
            <CardFooter className="flex items-center justify-between pt-2 border-t">

                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant='outline'>
                            <Trash />
                            Excluir
                        </Button>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Você realmente deseja excluir essa candidatura?</AlertDialogTitle>
                            <AlertDialogDescription>Essa ação não poderá ser revertida!</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                <Link href={`/jobs/${job.id}`}>
                    <Button>
                        Detalhes
                        <ExternalLink />
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    )
}