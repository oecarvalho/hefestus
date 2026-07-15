'use client'

import { useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { RefreshCw, Loader2 } from 'lucide-react'
import { reactivateJob } from '@/app/actions/inactivity-actions'
import { toast } from 'sonner'

interface ReactivateJobButtonProps {
  jobId: string
  className?: string
  variant?: 'default' | 'outline' | 'secondary' | 'ghost'
}

export function ReactivateJobButton({ jobId, className, variant = 'default' }: ReactivateJobButtonProps) {
  const [isPending, startTransition] = useTransition()

  const handleReactivate = () => {
    startTransition(async () => {
      const res = await reactivateJob(jobId, 'aplicado')
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success('Candidatura reativada como "Aplicado" com sucesso!')
      }
    })
  }

  return (
    <Button
      onClick={handleReactivate}
      disabled={isPending}
      variant={variant}
      className={className}
    >
      {isPending ? (
        <>
          <Loader2 className="animate-spin mr-2 size-4" />
          Reativando...
        </>
      ) : (
        <>
          <RefreshCw className="mr-2 size-4" />
          Reativar Candidatura
        </>
      )}
    </Button>
  )
}
