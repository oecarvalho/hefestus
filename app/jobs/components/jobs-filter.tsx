'use client'

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    usePathname,
    useRouter,
    useSearchParams
} from "next/navigation";

export default function JobsFilter() {

     const router = useRouter();

    const pathname = usePathname();

    const searchParams = useSearchParams();

    function handleFilter(value: string){

        const params = new URLSearchParams(
            searchParams
        );

        if(value === 'all'){

            params.delete('status');

        } else {

            params.set('status', value);

        }

        router.push(
            `${pathname}?${params.toString()}`
        );
    }

    return (
        <Select onValueChange={handleFilter}>
            <SelectTrigger className="w-full max-w-48">
                <SelectValue placeholder="Todos os Status" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Status da vaga</SelectLabel>
                    <SelectItem value="all">
                        Todos
                    </SelectItem>
                    <SelectItem value="aplicado">Aplicado</SelectItem>
                    <SelectItem value="andamento">Em Andamento</SelectItem>
                    <SelectItem value="rejeitado">Rejeitado</SelectItem>
                    <SelectItem value="cancelado">Cancelada</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}