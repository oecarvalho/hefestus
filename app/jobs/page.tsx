import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { CardJobs } from "./components/card-job";

export default function Jobs() {
    return (
        <section className="h-full w-300 m-auto py-16">
            <div className="flex justify-between items-end mb-7">
                <div>
                    <h1 className="text-3xl font-bold">Vagas</h1>
                    <p className="text-muted-foreground text-sm">Gerencie suas candidaturas, acompanhe o match com seu currículo e status de cada processo.</p>
                </div>

                <Button>Nova Vaga</Button>
            </div>
            <div className="flex justify-between gap-5 mb-5">
                <InputGroup className="max-w-full">
                    <InputGroupInput placeholder="Buscar por cargo ou empresa..." />
                    <InputGroupAddon>
                        <Search />
                    </InputGroupAddon>
                </InputGroup>

                <Select>
                    <SelectTrigger className="w-full max-w-48">
                        <SelectValue placeholder="Todos os Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Status da vaga</SelectLabel>
                            <SelectItem value="aplicado">Aplicado</SelectItem>
                            <SelectItem value="analise">Em Analise</SelectItem>
                            <SelectItem value="andamento">Em Andamento</SelectItem>
                            <SelectItem value="rejeitado">Rejeitado</SelectItem>
                            <SelectItem value="cancelado">Cancelada</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            <div className="grid grid-cols-3 gap-4">

            <CardJobs/>

            </div>
        </section>
    )
}