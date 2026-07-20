'use client'

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2 } from "lucide-react";

interface CompanySelectFilterProps {
  companies: string[];
  defaultValue: string;
}

export function CompanySelectFilter({ companies, defaultValue }: CompanySelectFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleValueChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("company", value);
    } else {
      params.delete("company");
    }
    // Preservar aba ativa se houver
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <Building2 className="size-4 text-muted-foreground" />
      <Select value={defaultValue} onValueChange={handleValueChange}>
        <SelectTrigger className="w-[200px] h-9 bg-background">
          <SelectValue placeholder="Todas as Empresas" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all_companies">Mercado Geral</SelectItem>
            {companies.map((company) => (
              <SelectItem key={company} value={company}>
                {company}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
