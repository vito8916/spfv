'use client'

import { TrendingDown, TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
} from "@/components/ui/chart"
import { useATRData } from "@/hooks/useATRData"
import { Skeleton } from "@/components/ui/skeleton"

interface ATRLineGraphProps {
  symbol: string;
  refreshInterval?: number;
}

export default function ATRLineGraph({ symbol, refreshInterval = 0 }: ATRLineGraphProps) {
  // Fetch ATR data using our custom hook
  const { data, isLoading, error } = useATRData(symbol, refreshInterval);

  // Chart configuration
  const chartConfig = {
    atr: {
      label: "ATR",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  // Handle loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[500px] w-full" />
        </CardContent>
        <CardFooter>
          <Skeleton className="h-4 w-full" />
        </CardFooter>
      </Card>
    );
  }

  // Handle error state
  if (error || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            {symbol} Average True Range (ATR) - 2024 Data
          </CardTitle>
          <CardDescription className="text-red-500">
            Error loading ATR data. Please try again later.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[500px] flex items-center justify-center">
          <p className="text-muted-foreground">No data available</p>
        </CardContent>
      </Card>
    );
  }

  // Format data for the chart
  const chartData = data.dataPoints.map(point => ({
    date: point.formattedDate,
    atr: point.value
  }));

  // Determine if trend is up or down
  const isTrendingUp = data.percentChange > 0;
  const trendPercentage = Math.abs(data.percentChange).toFixed(2);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {symbol} Average True Range (ATR) - 2024 Data
        </CardTitle>
        <CardDescription>
          Last Refreshed: {data.metaData.lastRefreshed}
          <br />
          Interval: {data.metaData.interval} / Time Period: {data.metaData.timePeriod}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[500px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{
                top: 10,
                right: 30,
                left: 20,
                bottom: 10,
              }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis 
                domain={['auto', 'auto']}
                tickFormatter={(value) => value.toFixed(2)}
                width={60}
              />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Date
                            </span>
                            <span className="font-bold text-muted-foreground">
                              {payload[0].payload.date}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              ATR
                            </span>
                            <span className="font-bold text-muted-foreground">
                              {typeof payload[0].value === 'number' ? payload[0].value.toFixed(2) : payload[0].value}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="atr"
                stroke="var(--primary)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {isTrendingUp ? (
            <>
              Trending up by {trendPercentage}% 
              <TrendingUp className="h-4 w-4 text-green-500" />
            </>
          ) : (
            <>
              Trending down by {trendPercentage}% 
              <TrendingDown className="h-4 w-4 text-red-500" />
            </>
          )}
        </div>
        <div className="leading-none text-muted-foreground">
          Min: {data.minValue.toFixed(2)} | Max: {data.maxValue.toFixed(2)} | Avg: {data.averageValue.toFixed(2)}
        </div>
      </CardFooter>
    </Card>
  )
}
