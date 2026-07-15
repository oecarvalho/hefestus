'use client'

import { useState, useTransition } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Loader2, Calendar } from 'lucide-react'
import { toast } from 'sonner'
import { createJobActivity } from '@/app/actions/inactivity-actions'

const activityFormSchema = z.object({
  type: z.enum(['custom_activity', 'callback_received', 'interview', 'technical_test']),
  description: z.string().trim().min(1, 'A descrição do acompanhamento é obrigatória!'),
})

type ActivityFormSchema = z.infer<typeof activityFormSchema>

interface AddActivityDialogProps {
  jobId: string
  trigger?: React.ReactNode
  onSuccess?: () => void
}

export function AddActivityDialog({ jobId, trigger, onSuccess }: AddActivityDialogProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const form = useForm<ActivityFormSchema>({
    resolver: zodResolver(activityFormSchema),
    defaultValues: {
      type: 'custom_activity',
      description: '',
    }
  })

  const onSubmit = async (data: ActivityFormSchema) => {
    startTransition(async () => {
      const res = await createJobActivity({
        jobId,
        type: data.type,
        description: data.description
      })

      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success('Acompanhamento registrado com sucesso!')
        form.reset()
        setOpen(false)
        if (onSuccess) onSuccess()
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2">
            <Plus size={16} />
            Registrar Acompanhamento
          </Button>
        )}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar size={20} className="text-primary" />
            Registrar Acompanhamento
          </DialogTitle>
          <DialogDescription>
            Registre qualquer nova movimentação no processo seletivo para reiniciar a contagem de inatividade.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4">
          <FieldGroup>
            <Field>
              <FieldLabel>Tipo de Movimentação</FieldLabel>
              <Controller
                name="type"
                control={form.control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="custom_activity">Outro acompanhamento</SelectItem>
                        <SelectItem value="callback_received">Retorno da empresa</SelectItem>
                        <SelectItem value="interview">Participação em entrevista</SelectItem>
                        <SelectItem value="technical_test">Realização de teste técnico</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError>
                {form.formState.errors.type?.message}
              </FieldError>
            </Field>

            <Field>
              <FieldLabel>Descrição do Acompanhamento</FieldLabel>
              <Controller
                name="description"
                control={form.control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    placeholder="Ex: Participei de uma entrevista técnica com a equipe de engenharia."
                    className="min-h-[100px]"
                  />
                )}
              />
              <FieldError>
                {form.formState.errors.description?.message}
              </FieldError>
            </Field>

            <Button type="submit" disabled={isPending} className="gap-2 justify-center w-full">
              {isPending ? (
                <>
                  <Loader2 className="animate-spin size-4" />
                  Salvando acompanhamento...
                </>
              ) : (
                'Salvar Acompanhamento'
              )}
            </Button>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  )
}
