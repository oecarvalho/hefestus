"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

export const description = "An interactive bar chart"

const chartConfig = {
  applications: {
    label: "Aplicações",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

import { BarChart2 } from "lucide-react"
import { CardDescription } from "@/components/ui/card"

interface GraficoAplicacoesProps {
  jobs: {
    id: string
    date: Date
  }[]
}

export function GraficoAplicacoes({ jobs }: GraficoAplicacoesProps) {
  const chartData = React.useMemo(() => {
    const grouped: Record<string, number> = {}
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    jobs.forEach((job) => {
      const date = new Date(job.date)
      if (date >= thirtyDaysAgo) {
        const formattedDate = date.toISOString().split("T")[0]
        grouped[formattedDate] = (grouped[formattedDate] || 0) + 1
      }
    })

    return Object.entries(grouped)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, total]) => ({
        date,
        applications: total,
      }))
  }, [jobs])

  if (jobs.length === 0) {
    return (
      <Card className="py-4">
        <CardContent className="flex flex-col items-center justify-center text-center py-16 gap-3">
          <div className="rounded-full bg-blue-50 dark:bg-blue-950/20 p-4 text-blue-500 dark:text-blue-400">
             <BarChart2 className="size-8" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold">Sem dados de candidaturas</CardTitle>
            <CardDescription className="max-w-sm mx-auto">
              As candidaturas dos últimos 30 dias serão listadas aqui de forma diária. Adicione vagas para começar a acompanhar seu progresso!
            </CardDescription>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="py-0">
      <CardHeader className="flex flex-col items-stretch p-0! sm:flex-row">
        <div className="flex flex-col justify-center p-4 my-3 sm:py-0!">
          <CardTitle className="text-xl font-semibold">Aplicações no mês</CardTitle>
          <CardDescription>Candidaturas enviadas nos últimos 30 dias.</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("pt-BR", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="applications"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("pt-BR", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }}
                />
              }
            />
            <Bar
              dataKey="applications"
              fill="var(--color-applications)"
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
