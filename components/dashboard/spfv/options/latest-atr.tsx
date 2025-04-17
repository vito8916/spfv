'use client'

import { TrendingDown, TrendingUp } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useATRData } from "@/hooks/useATRData"
import { Skeleton } from "@/components/ui/skeleton"

interface LatestATRProps {
  symbol: string;
  refreshInterval?: number;
}

export default function LatestATR({ symbol, refreshInterval = 0 }: LatestATRProps) {
  // Fetch ATR data using our custom hook
  const { data, isLoading, error } = useATRData(symbol, refreshInterval);

  // Handle loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>
    );
  }

  // Handle error state
  if (error || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            {symbol} Latest ATR Value
          </CardTitle>
          <CardDescription className="text-red-500">
            Error loading ATR data. Please try again later.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[200px] flex items-center justify-center">
          <p className="text-muted-foreground">No data available</p>
        </CardContent>
      </Card>
    );
  }

  // Get the latest data point
  const latestDataPoint = data.dataPoints[data.dataPoints.length - 1];
  
  // Determine if trend is up or down
  const isTrendingUp = data.percentChange > 0;
  const trendPercentage = Math.abs(data.percentChange).toFixed(2);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {symbol} Latest ATR Value
        </CardTitle>
        <CardDescription>
          Last Refreshed: {data.metaData.lastRefreshed}
          <br />
          Interval: {data.metaData.interval} / Time Period: {data.metaData.timePeriod}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="mt-6 mb-8">
            <p className="text-sm text-muted-foreground mb-2">Date: {latestDataPoint.formattedDate}</p>
            <div className="text-6xl font-bold mb-8">{latestDataPoint.value.toFixed(2)}</div>
            
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-sm font-medium">Trend: </span>
              {isTrendingUp ? (
                <div className="flex items-center text-green-500">
                  Up {trendPercentage}% 
                  <TrendingUp className="h-4 w-4 ml-1" />
                </div>
              ) : (
                <div className="flex items-center text-red-500">
                  Down {trendPercentage}% 
                  <TrendingDown className="h-4 w-4 ml-1" />
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="border rounded-md p-4">
              <p className="text-sm text-muted-foreground">Min</p>
              <p className="text-xl font-semibold">{data.minValue.toFixed(2)}</p>
            </div>
            <div className="border rounded-md p-4">
              <p className="text-sm text-muted-foreground">Average</p>
              <p className="text-xl font-semibold">{data.averageValue.toFixed(2)}</p>
            </div>
            <div className="border rounded-md p-4">
              <p className="text-sm text-muted-foreground">Max</p>
              <p className="text-xl font-semibold">{data.maxValue.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 