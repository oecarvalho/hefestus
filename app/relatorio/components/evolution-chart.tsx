'use client'

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { LineChart } from "lucide-react"

const chartConfig = {
  realizadas: {
    label: "Candidaturas Realizadas",
    color: "var(--chart-1)",
  },
  respostas: {
    label: "Respostas Recebidas",
    color: "var(--chart-2)",
  },
  entrevistas: {
    label: "Entrevistas Obtidas",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig

interface EvolutionChartProps {
  data: {
    period: string
    realizadas: number
    respostas: number
    entrevistas: number
  }[]
}

export function EvolutionChart({ data }: EvolutionChartProps) {
  const isDataEmpty = React.useMemo(() => {
    return data.every(d => d.realizadas === 0 && d.respostas === 0 && d.entrevistas === 0)
  }, [data])

  if (isDataEmpty) {
    return (
      <Card className="h-full flex flex-col justify-between">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Evolução das candidaturas</CardTitle>
          <CardDescription>Acompanhe o andamento temporal dos últimos 30 dias.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center text-center py-12 gap-3 flex-1">
          <div className="rounded-full bg-muted p-4 text-muted-foreground">
            <LineChart size={24} />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">Ainda não há dados suficientes</h4>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto">
              Sua evolução histórica de candidaturas e respostas aparecerá aqui conforme você cadastrar vagas e interagir com o sistema.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Mapeia cores inline para o recharts baseado nos tokens
  const chartData = data.map(item => ({
    ...item,
    fillRealizadas: "hsl(var(--primary))",
    fillRespostas: "#10b981", // Emerald-500
    fillEntrevistas: "#8b5cf6", // Violet-500
  }))

  return (
    <Card className="h-full flex flex-col justify-between">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Evolução das candidaturas</CardTitle>
        <CardDescription>Sua atividade nas últimas 4 semanas (candidaturas, respostas e entrevistas).</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-4 flex flex-col justify-end">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[220px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 0,
              right: 0,
              top: 10,
              bottom: 0,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted/40" />
            <XAxis
              dataKey="period"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className="text-[10px]"
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[200px]"
                  labelFormatter={(value) => value}
                />
              }
            />
            <Bar
              dataKey="realizadas"
              name="Candidaturas Realizadas"
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="respostas"
              name="Respostas Recebidas"
              fill="#10b981"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="entrevistas"
              name="Entrevistas Obtidas"
              fill="#8b5cf6"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
