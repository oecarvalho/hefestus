"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { z } from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue, Select } from "./ui/select";
import { Textarea } from "./ui/textarea";

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

})

type FormSchema = z.infer<typeof formSchema>

const AddJobsButton = () => {
    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            nameEnterprise: '',
            workModel: '',
            jobDescription: '',
        }
    })

    const onSubmit = (data: FormSchema) => {
        console.log({ data })
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button><Plus />Nova Vaga</Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Nova Vaga</DialogTitle>
                    <DialogDescription>Preencha as informações com atenção para o Hefestus te ajudar.</DialogDescription>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <Field>
                            <FieldLabel>Titulo da Vaga</FieldLabel>
                            <Controller
                                name="title"
                                control={form.control}
                                render={({ field }) => (<Input {...field} placeholder="Nome da vaga" required />)}
                            />

                            <FieldError>
                                {form.formState.errors.title?.message}
                            </FieldError>
                        </Field>

                        <div className="grid grid-cols-2 gap-4">
                            <Field>
                                <FieldLabel>Empresa</FieldLabel>
                                <Controller
                                    name="nameEnterprise"
                                    control={form.control}
                                    render={({ field }) => (<Input {...field} placeholder="Nome da empresa" required />)}
                                />

                                <FieldError>
                                    {form.formState.errors.nameEnterprise?.message}
                                </FieldError>
                            </Field>

                            <Field>
                                <FieldLabel>Modelo</FieldLabel>
                                <Controller
                                    name="workModel"
                                    control={form.control}
                                    render={({ field }) => (
                                        <Select defaultValue={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem value="presencial">Presencial</SelectItem>
                                                    <SelectItem value="hibrido">Híbrido</SelectItem>
                                                    <SelectItem value="remoto">Remoto</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />

                                <FieldError>
                                    {form.formState.errors.workModel?.message}
                                </FieldError>
                            </Field>
                        </div>

                        <Field>
                            <FieldLabel>Descrição da Vaga</FieldLabel>
                                                            <Controller
                                    name="jobDescription"
                                    control={form.control}
                                    render={({ field }) => (<Textarea {...field} placeholder="Adicione aqui a descrição completa da vaga" />)}
                                />

                                <FieldError>
                                    {form.formState.errors.jobDescription?.message}
                                </FieldError>
                            
                        </Field>

                        <Button type="submit">Cadastrar Vaga</Button>
                    </FieldGroup>
                </form>

            </DialogContent>
        </Dialog>
    )
}

export default AddJobsButton