import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, ExternalLink, MapPin, Trash } from "lucide-react";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";


interface CardJobsProps {
    job: {
        id: string
        jobTitle: string
        nameEnterprise: string
        workModel: string
    }
}

export function CardJobs({ job }: CardJobsProps) {
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
                        27%
                    </span>

                    <span className="text-[10px] font-medium text-zinc-400">
                        match
                    </span>
                </CardAction>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
                <Select>
                    <SelectTrigger className="w-full max-w-40">
                        <SelectValue placeholder="Aplicado" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="aplicado">Aplicado</SelectItem>
                            <SelectItem value="analise">Em Analise</SelectItem>
                            <SelectItem value="andamento">Em Andamento</SelectItem>
                            <SelectItem value="rejeitado">Rejeitado</SelectItem>
                            <SelectItem value="cancelado">Cancelada</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>



                <Badge> 27d sem atualização</Badge>
            </CardContent>
            <CardFooter className="flex items-center justify-between pt-2 border-t">
                <Button>
                    <Trash />
                    Excluir
                </Button>

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