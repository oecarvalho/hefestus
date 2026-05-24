'use client'

import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput
} from "@/components/ui/input-group";

import { Search } from "lucide-react";

import {
    usePathname,
    useRouter,
    useSearchParams
} from "next/navigation";

export default function JobsSearch(){

    const router = useRouter();

    const pathname = usePathname();

    const searchParams = useSearchParams();

    function handleSearch(value: string){

        const params = new URLSearchParams(
            searchParams
        );

        if(value){

            params.set('search', value);

        } else {

            params.delete('search');

        }

        router.push(
            `${pathname}?${params.toString()}`
        );
    }

    return (
        <InputGroup className="max-w-full">

            <InputGroupInput
                placeholder="Buscar por cargo ou empresa..."
                onChange={(e) =>
                    handleSearch(e.target.value)
                }
            />

            <InputGroupAddon>
                <Search />
            </InputGroupAddon>

        </InputGroup>
    )
}