"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import {z} from 'zod'
import {useForm} from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
    title: z.string().trim().min(1, {
        message: 'Nome da vaga é obrigatório!'
    }),
    nameEnterprise: z.string().trim().min(1, {
        message: 'Nome da empresa é obrigatório!'
    }),
    workModel: z.string().trim().min(1, {
        message: 'Modelo de trabalho é obrigatório!'
    }),
    jobDescription: z.string().min(1, {
        message: 'descrição da vaga é obrigatório!'
    }),
    jobPosition: z.string().min(1, {
        message: 'Cargo da vaga é obrigatório!'
    })

})

type FormSchema = z.infer<typeof formSchema>

const AddJobsButton = () => {
    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema)
    })

    const onSubmit = (data: FormSchema) =>{
        console.log({data})
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button><Plus/>Nova Vaga</Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Nova Vaga</DialogTitle>
                    <DialogDescription>Preencha as informações com atenção para o Hefestus te ajudar.</DialogDescription>
                </DialogHeader>

                <form>
                    
                </form>

            </DialogContent>
        </Dialog>
    )
}

export default AddJobsButton