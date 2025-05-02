"use client";

import React from "react";
import {
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Bar,
  ComposedChart,
  Line,
  TooltipProps,
} from "recharts";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { useSpfvBeastDailyChart } from "@/hooks/use-spfv-beast-daily";
import { format } from "date-fns";

interface SPFVBeastDailyProps {
  symbol: string;
  refreshInterval?: number;
}

// Chart configuration
const chartConfig = {
  price: {
    label: "Price",
    color: "hsl(var(--chart-1))",
  },
  timeClose: {
    label: "Time Close",
    color: "hsl(var(--chart-4))",
  },
  timeVWAP: {
    label: "Time VWAP",
    color: "hsl(var(--primary))",
  },
  volume: {
    label: "Volume",
    color: "hsl(var(--))",
  },
} satisfies ChartConfig;

// Format large numbers with suffixes
const formatNumber = (value: number): string => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value.toString();
};

// Custom tooltip to format the numbers
const CustomTooltip = ({
                         active,
                         payload,
                         label,
                       }: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
        <div className="rounded-lg border bg-background p-2 shadow-sm">
          <div className="grid grid-cols-4 gap-2">
            <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              Price
            </span>
              <span className="font-bold text-muted-foreground">
              ${label}
            </span>
            </div>
            <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              Time Close
            </span>
              <span className="font-bold text-muted-foreground">
              {payload[0]?.value} min
            </span>
            </div>
            <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              Time VWAP
            </span>
              <span className="font-bold text-muted-foreground">
              {payload[1]?.value} min
            </span>
            </div>
            <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              Volume
            </span>
              <span className="font-bold text-muted-foreground">
              {payload[2]?.value
                  ? Number(payload[2].value).toLocaleString()
                  : ""}
            </span>
            </div>
          </div>
        </div>
    );
  }
  return null;
};

export default function SPFVBeastDaily({
                                         symbol,
                                         refreshInterval = 0,
                                       }: SPFVBeastDailyProps) {
  // Use the new hook for daily chart data
  const { chartData, stats, error, isLoading } = useSpfvBeastDailyChart(
      symbol,
      refreshInterval
  );

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
  if (error || !chartData?.length) {
    return (
        <Card>
          <CardHeader>
            <CardTitle>{symbol} Beast Numbers</CardTitle>
            <CardDescription className="text-red-500">
              Error loading data. Please try again later.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[500px] flex items-center justify-center">
            <p className="text-muted-foreground">No data available for today</p>
          </CardContent>
        </Card>
    );
  }

  return (
      <Card>
        <CardHeader>
          <CardTitle>{symbol} Beast Number</CardTitle>
          <CardDescription>
            {stats.formattedDateRange?.start && `Data for ${format(new Date(stats.formattedDateRange.start), "MMM d, yyyy")}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] md:h-[500px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                  accessibilityLayer
                  data={chartData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 10,
                  }}
              >
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                    dataKey="price"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.toFixed(2)}
                    label={{ value: 'Price', position: 'insideBottom', offset: -5 }}
                />
                <YAxis
                    yAxisId="left"
                    domain={[0, 'auto']}
                    orientation="left"
                    label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }}
                />
                <YAxis
                    yAxisId="right"
                    orientation="right"
                    dataKey="totalVolume"
                    tickFormatter={formatNumber}
                    domain={[0, 'dataMax']}
                    label={{ value: 'Volume', angle: 90, position: 'insideRight' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ paddingTop: "10px" }} />

                <Bar
                    yAxisId="left"
                    dataKey="timeClose"
                    fill="var(--chart-3)"
                    opacity={0.8}
                    name="Time Close"
                    barSize={80}
                />

                <Bar
                    yAxisId="left"
                    dataKey="timeVWAP"
                    fill="var(--secondary)"
                    opacity={0.8}
                    name="Time VWAP"
                    barSize={80}
                />
                <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="totalVolume"
                    stroke="var(--primary)"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 6, strokeWidth: 1 }}
                    name="Volume"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex flex-wrap gap-4 font-medium leading-none">
            <div>
              <span className="text-muted-foreground">Beast Number:</span>{" "}
              <span className="font-bold text-primary">${stats.beastNumber?.toFixed(0)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Total Volume:</span>{" "}
              <span className="font-bold">{stats.totalVolume?.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Pre-Market High:</span>{" "}
              <span className="font-bold text-green-500">${stats.preMarketHigh?.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Pre-Market Low:</span>{" "}
              <span className="font-bold text-red-500">${stats.preMarketLow?.toFixed(2)}</span>
            </div>
          </div>
          <div className="leading-none text-muted-foreground text-xs mt-2">
            Premarket Numbers charts show where premarket trading (resting
            orders) occurred at the highest time and volume intervals. These
            prices, especially the ones with significant volumes, can act as
            potential points of interest (resistance / support / pins) in the
            market.
          </div>
        </CardFooter>
      </Card>
  );
} 