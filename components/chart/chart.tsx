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

interface GraficoAplicacoesProps {
  jobs: {
    id: string
    date: Date
  }[]
}

export function GraficoAplicacoes({ jobs }: GraficoAplicacoesProps) {
  const chartData = React.useMemo(() => {

    const grouped: Record<string, number> = {}

    jobs.forEach((job) => {

      const date = new Date(job.date)

      const formattedDate = date.toISOString().split("T")[0]

      grouped[formattedDate] =
        (grouped[formattedDate] || 0) + 1
    })

    return Object.entries(grouped).map(([date, total]) => ({
      date,
      applications: total,
    }))

  }, [jobs])

  return (
    <Card className="py-0">
      <CardHeader className="flex flex-col items-stretch  p-0! sm:flex-row">
        <div className="flex flex-col justify-center p-4 my-3 sm:py-0!">
          <CardTitle className="text-xl font-semibold">Aplicações no mês</CardTitle>
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
                  nameKey="views"
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
              fill="#60A5FA"
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
