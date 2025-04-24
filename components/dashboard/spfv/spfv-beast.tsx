"use client";

import React, { useState } from "react";
import { Line } from "recharts";
import { Bar } from "recharts";
import {
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ComposedChart } from "recharts";
import { TooltipProps } from "recharts";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { TrendingDown, TrendingUp } from "lucide-react";
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
import { useSpfvBeastMonthly } from "@/hooks/use-spfv-beast-monthly";
import { format } from "date-fns";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import SPFVBeastDaily from "./spfv-beast-daily";

interface SPFVBeastProps {
  symbol: string;
  expirationDate?: Date;
  refreshInterval?: number;
}

// Chart configuration
const chartConfig = {
  price: {
    label: "Price",
    color: "hsl(var(--chart-1))",
  },
  volume: {
    label: "Volume",
    color: "hsl(var(--chart-2))",
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
        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              Date
            </span>
            <span className="font-bold text-muted-foreground">
              {format(new Date(label as number), "M/d")}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              Price
            </span>
            <span className="font-bold text-muted-foreground">
              ${payload[0]?.value}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              Volume
            </span>
            <span className="font-bold text-muted-foreground">
              {payload[1]?.value
                ? Number(payload[1].value).toLocaleString()
                : ""}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function SPFVBeast({
  symbol,
  expirationDate,
  refreshInterval = 0,
}: SPFVBeastProps) {
  const [activeTab, setActiveTab] = useState("30days");

  // Use enhanced hook with pre-processed data and stats
  const { data, stats, error, isLoading } = useSpfvBeastMonthly(
    symbol,
    expirationDate,
    refreshInterval
  );

  // Handle loading state for monthly view
  const MonthlyView = () => {
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
    if (error || !data?.length) {
      return (
        <Card>
          <CardHeader>
            <CardTitle>{symbol} Premarket Numbers</CardTitle>
            <CardDescription className="text-red-500">
              Error loading data. Please try again later.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[500px] flex items-center justify-center">
            <p className="text-muted-foreground">No data available</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle>{symbol} Premarket Beast Numbers</CardTitle>
          <CardDescription>
            {stats.formattedDateRange &&
              `Data from ${stats.formattedDateRange.start} to ${stats.formattedDateRange.end}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[500px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                accessibilityLayer
                data={data}
                margin={{
                  top: 10,
                  right: 0,
                  left: 0,
                  bottom: 10,
                }}
              >
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(ts) => format(new Date(ts), "M/d")}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  yAxisId="left"
                  domain={["auto", "auto"]}
                  tickFormatter={(value) => value.toFixed(0)}
                  width={60}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  dataKey="totalVolume"
                  tickFormatter={formatNumber}
                  domain={[0, "dataMax"]}
                  width={80}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ paddingTop: "10px" }} />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="price"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                  name="Price"
                />
                <Bar
                  yAxisId="right"
                  dataKey="totalVolume"
                  fill="hsl(var(--chart-2))"
                  name="Volume"
                  barSize={20}
                  opacity={0.8}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            {stats.isTrendingUp ? (
              <>
                Trending up by {stats.trendPct}%
                <TrendingUp className="h-4 w-4 text-green-500" />
              </>
            ) : (
              <>
                Trending down by {stats.trendPct}%
                <TrendingDown className="h-4 w-4 text-red-500" />
              </>
            )}
          </div>
          <div className="leading-none text-muted-foreground">
            Min: ${stats.minPrice.toFixed(2)} | Max: $
            {stats.maxPrice.toFixed(2)}
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
  };

  return (
    <div className="flex flex-col gap-4">
      <Tabs defaultValue="30days" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-[400px] grid-cols-2">
          <TabsTrigger value="30days">30 Days</TabsTrigger>
          <TabsTrigger value="daily">Daily</TabsTrigger>
        </TabsList>
        <TabsContent value="30days">
          <MonthlyView />
        </TabsContent>
        <TabsContent value="daily">
          <SPFVBeastDaily symbol={symbol}  refreshInterval={refreshInterval} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
