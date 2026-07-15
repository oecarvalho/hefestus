'use client'

import { useState, useEffect, useTransition } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { AlertTriangle, Check, RefreshCw, X, Archive, Calendar, Building2, MapPin } from 'lucide-react'
import {
  getPendingAlerts,
  acknowledgeInactivityAlert,
  acknowledgeAutoCanceledAlert,
  reactivateJob,
  createJobActivity
} from '@/app/actions/inactivity-actions'

interface InactivityAlert {
  id: string
  jobTitle: string
  nameEnterprise: string
  daysInactive: number
  cycle: number
}

interface AutoCanceledAlert {
  id: string
  jobTitle: string
  nameEnterprise: string
  daysInactive: number
}

export function InactivityAlertManager() {
  const [isOpen, setIsOpen] = useState(false)
  const [inactivityAlerts, setInactivityAlerts] = useState<InactivityAlert[]>([])
  const [autoCanceledAlerts, setAutoCanceledAlerts] = useState<AutoCanceledAlert[]>([])
  const [activeTab, setActiveTab] = useState<'inactive' | 'canceled'>('inactive')
  
  // Estados para registrar atividade inline
  const [selectedJobForActivity, setSelectedJobForActivity] = useState<string | null>(null)
  const [activityDescription, setActivityDescription] = useState('')
  const [activityType, setActivityType] = useState<'custom_activity' | 'callback_received' | 'interview' | 'technical_test'>('custom_activity')

  const [isPending, startTransition] = useTransition()

  // Buscar alertas pendentes no carregamento
  useEffect(() => {
    async function loadAlerts() {
      try {
        const result = await getPendingAlerts()
        if (result.inactivityAlerts.length > 0 || result.autoCanceledAlerts.length > 0) {
          setInactivityAlerts(result.inactivityAlerts)
          setAutoCanceledAlerts(result.autoCanceledAlerts)
          setIsOpen(true)
          
          if (result.inactivityAlerts.length === 0 && result.autoCanceledAlerts.length > 0) {
            setActiveTab('canceled')
          }
        }
      } catch (err) {
        console.error('Erro ao buscar alertas de inatividade:', err)
      }
    }
    loadAlerts()
  }, [])

  // Fechar o modal quando não restar mais nenhum alerta
  useEffect(() => {
    if (inactivityAlerts.length === 0 && autoCanceledAlerts.length === 0 && isOpen) {
      setIsOpen(false)
    }
  }, [inactivityAlerts, autoCanceledAlerts, isOpen])

  // Ações para Inatividade
  const handleAcknowledgeInactivity = async (jobId: string, cycle: number) => {
    startTransition(async () => {
      const res = await acknowledgeInactivityAlert(jobId, cycle)
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success('Lembrete arquivado para este ciclo!')
        setInactivityAlerts(prev => prev.filter(item => item.id !== jobId))
      }
    })
  }

  const handleUpdateStatus = async (jobId: string, newStatus: string) => {
    startTransition(async () => {
      // Importa dinamicamente ou chama o updateJobStatus de actions.ts
      const { updateJobStatus } = await import('@/app/actions/actions')
      const res = await updateJobStatus(jobId, newStatus)
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success('Status da candidatura atualizado!')
        setInactivityAlerts(prev => prev.filter(item => item.id !== jobId))
      }
    })
  }

  const handleSaveActivity = async (jobId: string) => {
    if (!activityDescription.trim()) {
      toast.error('Por favor, informe uma descrição.')
      return
    }

    startTransition(async () => {
      const res = await createJobActivity({
        jobId,
        type: activityType,
        description: activityDescription
      })
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success('Acompanhamento registrado com sucesso!')
        setInactivityAlerts(prev => prev.filter(item => item.id !== jobId))
        setSelectedJobForActivity(null)
        setActivityDescription('')
      }
    })
  }

  const handleCancelJob = async (jobId: string) => {
    startTransition(async () => {
      const { updateJobStatus } = await import('@/app/actions/actions')
      const res = await updateJobStatus(jobId, 'cancelado')
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success('Candidatura cancelada com sucesso.')
        setInactivityAlerts(prev => prev.filter(item => item.id !== jobId))
      }
    })
  }

  // Ações para Vagas Canceladas Automaticamente
  const handleAcknowledgeCanceled = async (jobId: string) => {
    startTransition(async () => {
      const res = await acknowledgeAutoCanceledAlert(jobId)
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success('Cancelamento confirmado!')
        setAutoCanceledAlerts(prev => prev.filter(item => item.id !== jobId))
      }
    })
  }

  const handleReactivateJob = async (jobId: string) => {
    startTransition(async () => {
      const res = await reactivateJob(jobId, 'aplicado')
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success('Candidatura reativada com sucesso!')
        setAutoCanceledAlerts(prev => prev.filter(item => item.id !== jobId))
      }
    })
  }

  const getCycleBadge = (cycle: number) => {
    switch (cycle) {
      case 1:
        return <Badge className="bg-amber-500 hover:bg-amber-600 text-white">Alerta: 7d</Badge>
      case 2:
        return <Badge className="bg-orange-500 hover:bg-orange-600 text-white">Alerta: 14d</Badge>
      case 3:
        return <Badge className="bg-rose-500 hover:bg-rose-600 text-white">Alerta: 21d</Badge>
      case 4:
        return <Badge className="bg-red-600 hover:bg-red-700 text-white animate-pulse">Crítico: 28d</Badge>
      default:
        return <Badge variant="outline">Inativa</Badge>
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-3xl w-full max-h-[85vh] flex flex-col p-6 overflow-hidden">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <AlertTriangle className="text-amber-500 size-6" />
            Central de Candidaturas Inativas
          </DialogTitle>
          <DialogDescription>
            Encontramos candidaturas sem movimentação recente. Resolva-as para manter seu progresso organizado.
          </DialogDescription>
        </DialogHeader>

        {/* Tabs de Seleção */}
        {(inactivityAlerts.length > 0 && autoCanceledAlerts.length > 0) && (
          <div className="flex border-b border-border/60 mt-4">
            <button
              onClick={() => setActiveTab('inactive')}
              className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === 'inactive'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Sem movimentação ({inactivityAlerts.length})
            </button>
            <button
              onClick={() => setActiveTab('canceled')}
              className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === 'canceled'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Canceladas automaticamente ({autoCanceledAlerts.length})
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto py-4 pr-1 space-y-4">
          {/* Seção de Candidaturas Inativas */}
          {(activeTab === 'inactive' || autoCanceledAlerts.length === 0) && inactivityAlerts.map(alert => (
            <div
              key={alert.id}
              className="p-4 border border-border/80 rounded-xl bg-card shadow-sm hover:border-border/100 transition-all flex flex-col gap-3"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <h3 className="font-semibold text-base text-foreground leading-tight">{alert.jobTitle}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
                    <Building2 className="size-4" /> {alert.nameEnterprise}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {getCycleBadge(alert.cycle)}
                  <span className="text-xs font-medium text-muted-foreground">
                    {alert.daysInactive} {alert.daysInactive === 1 ? 'dia' : 'dias'} sem movimentação
                  </span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground italic bg-muted/30 p-2.5 rounded-lg border border-border/40">
                &quot;A candidatura para {alert.jobTitle} na {alert.nameEnterprise} está há {alert.daysInactive} dias sem movimentação.&quot;
              </p>

              {/* Botões de Ação */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAcknowledgeInactivity(alert.id, alert.cycle)}
                  disabled={isPending}
                  className="text-xs"
                >
                  <Archive className="mr-1.5 size-3.5" />
                  Manter sem alteração
                </Button>

                <Select
                  disabled={isPending}
                  onValueChange={(val) => handleUpdateStatus(alert.id, val)}
                >
                  <SelectTrigger className="h-8 w-[140px] text-xs">
                    <SelectValue placeholder="Mudar Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="aplicado">Aplicado</SelectItem>
                      <SelectItem value="andamento">Em Andamento</SelectItem>
                      <SelectItem value="rejeitado">Rejeitado</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedJobForActivity(
                      selectedJobForActivity === alert.id ? null : alert.id
                    )
                  }}
                  disabled={isPending}
                  className="text-xs"
                >
                  <Calendar className="mr-1.5 size-3.5" />
                  Registrar Movimentação
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCancelJob(alert.id)}
                  disabled={isPending}
                  className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50/50 dark:hover:bg-rose-950/20 ml-auto"
                >
                  <X className="mr-1.5 size-3.5" />
                  Cancelar Vaga
                </Button>
              </div>

              {/* Formulário inline para registrar movimentação */}
              {selectedJobForActivity === alert.id && (
                <div className="mt-3 p-3 bg-muted/40 border rounded-lg flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Tipo de Movimentação:
                    </span>
                    <Select
                      value={activityType}
                      onValueChange={(val: any) => setActivityType(val)}
                    >
                      <SelectTrigger className="h-7 w-[200px] text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="custom_activity">Outro acompanhamento</SelectItem>
                        <SelectItem value="callback_received">Retorno da empresa</SelectItem>
                        <SelectItem value="interview">Participação em entrevista</SelectItem>
                        <SelectItem value="technical_test">Realização de teste técnico</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Textarea
                    placeholder="Ex: Recebi contato da recrutadora para agendar a primeira conversa."
                    value={activityDescription}
                    onChange={(e) => setActivityDescription(e.target.value)}
                    className="text-xs min-h-[60px]"
                  />

                  <div className="flex gap-2 justify-end">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setSelectedJobForActivity(null)
                        setActivityDescription('')
                      }}
                      className="text-xs h-7"
                    >
                      Cancelar
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleSaveActivity(alert.id)}
                      disabled={isPending}
                      className="text-xs h-7"
                    >
                      Salvar Acompanhamento
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Seção de Candidaturas Canceladas Automaticamente */}
          {(activeTab === 'canceled' || inactivityAlerts.length === 0) && autoCanceledAlerts.map(alert => (
            <div
              key={alert.id}
              className="p-4 border border-red-200 dark:border-red-950/40 rounded-xl bg-red-50/20 dark:bg-red-950/5 flex flex-col gap-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-base text-foreground leading-tight">{alert.jobTitle}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
                    <Building2 className="size-4" /> {alert.nameEnterprise}
                  </p>
                </div>
                <Badge variant="destructive" className="animate-pulse">Cancelamento Automático</Badge>
              </div>

              <p className="text-sm text-muted-foreground italic bg-red-50/50 dark:bg-red-950/10 p-2.5 rounded-lg border border-red-100 dark:border-red-950/20">
                &quot;A candidatura para {alert.jobTitle} na {alert.nameEnterprise} foi cancelada automaticamente após 30 dias sem movimentação.&quot;
              </p>

              <div className="flex gap-2 pt-1 justify-end">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAcknowledgeCanceled(alert.id)}
                  disabled={isPending}
                  className="text-xs"
                >
                  <Check className="mr-1.5 size-3.5" />
                  Entendi, arquivar aviso
                </Button>

                <Button
                  size="sm"
                  onClick={() => handleReactivateJob(alert.id)}
                  disabled={isPending}
                  className="text-xs gap-1.5"
                >
                  <RefreshCw className="size-3.5" />
                  Reativar Vaga
                </Button>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
