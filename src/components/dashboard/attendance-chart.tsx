
"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const chartData = [
  { month: "January", attendance: 186 },
  { month: "February", attendance: 305 },
  { month: "March", attendance: 237 },
  { month: "April", attendance: 273 },
  { month: "May", attendance: 209 },
  { month: "June", attendance: 250 },
]

const chartConfig = {
  attendance: {
    label: "Attendance",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export function AttendanceChart() {
  return (
    <ChartContainer config={chartConfig} className="h-[250px] w-full">
      <ResponsiveContainer>
        <BarChart data={chartData} accessibilityLayer>
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            fontSize={12}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            fontSize={12}
            tickFormatter={(value) => `${value}`}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dot" />}
          />
          <Bar dataKey="attendance" fill="var(--color-attendance)" radius={4} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
