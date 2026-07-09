'use client'

import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput
} from "@/components/ui/input-group";

import { Search } from "lucide-react";
import { useState, useEffect } from "react";

import {
    usePathname,
    useRouter,
    useSearchParams
} from "next/navigation";

export default function JobsSearch(){

    const router = useRouter();

    const pathname = usePathname();

    const searchParams = useSearchParams();

    const currentSearch = searchParams.get('search') || '';
    const [inputValue, setInputValue] = useState(currentSearch);
    const [prevSearch, setPrevSearch] = useState(currentSearch);

    if (currentSearch !== prevSearch) {
        setPrevSearch(currentSearch);
        setInputValue(currentSearch);
    }

    // Executar re-roteamento com debounce de 350ms
    useEffect(() => {
        const handler = setTimeout(() => {
            const params = new URLSearchParams(searchParams);
            const urlQuery = params.get('search') || '';
            
            if (inputValue === urlQuery) {
                return;
            }

            if (inputValue) {
                params.set('search', inputValue);
            } else {
                params.delete('search');
            }

            router.push(`${pathname}?${params.toString()}`);
        }, 350);

        return () => {
            clearTimeout(handler);
        };
    }, [inputValue, router, pathname, searchParams]);

    return (
        <InputGroup className="flex-1 max-w-full">

            <InputGroupInput
                placeholder="Buscar por cargo ou empresa..."
                value={inputValue}
                onChange={(e) =>
                    setInputValue(e.target.value)
                }
            />

            <InputGroupAddon>
                <Search />
            </InputGroupAddon>

        </InputGroup>
    )
}