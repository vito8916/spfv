import useSWR from 'swr';
import { format } from 'date-fns';
import React, { useMemo } from 'react';

export interface ProcessedBeastData {
  date: number; // timestamp
  price: number;
  totalVolume: number;
  timeClose: number;
  timeVWAP: number;
  weightedAvg: number;
  isBeast: boolean;
  symbol: string;
  preMarketHigh: number;
  preMarketLow: number;
}

// New interface for the chart data structure
export interface BeastNumberChartData {
  price: number;
  timeClose: number;
  timeVWAP: number;
  totalVolume: number;
  weightedAvg: number;
  isBeast: boolean;
}

interface SPFVBeastDailyResponse {
  beastNumbers: {
    price: number;
    timeClose: number;
    timeVWAP: number;
    totalVolume: number;
    weightedAvg: number;
    isBeast: boolean;
    date: string;
    symbol: string;
    preMarketHigh: number;
    preMarketLow: number;
  }[];
}

export interface ProcessedBeastStats {
  minPrice: number;
  maxPrice: number;
  trendPct: string;
  isTrendingUp: boolean;
  formattedDateRange?: {
    start: string;
    end: string;
  }
  totalVolume?: number;
  beastNumber?: number;
  preMarketHigh?: number;
  preMarketLow?: number;
}

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.');
    throw error;
  }
  return res.json();
};
// New hook for the daily beast chart
export function useSpfvBeastDailyChart(symbol: string, refreshInterval = 0) {
  const today = new Date();
  const formattedToday = format(today, 'yyyy-MM-dd');

  
  const { data, error, isLoading, mutate } = useSWR<SPFVBeastDailyResponse>(
    symbol ? `/api/spfv/get-spfv-beast-daily?symbol=${symbol}&endDate=${formattedToday}` : null,
    fetcher,
    {
      refreshInterval: refreshInterval,
      revalidateOnFocus: true,
      shouldRetryOnError: false,
    }
  );

  // Process the chart data
  const chartData: BeastNumberChartData[] = useMemo(() => {
    if (!data?.beastNumbers?.length) return [];
    
    // Get only today's data
    /* const todayData = data.beastNumbers.filter(item => 
      format(parse(item.date, 'yyyy-MM-dd', new Date()), 'yyyy-MM-dd') === formattedToday
    ); */
    
   // if (!todayData.length) return [];

    // Round prices and aggregate data
    const priceMap = new Map<number, {
      timeClose: number;
      timeVWAP: number;
      totalVolume: number;
      weightedAvg: number;
      isBeast: boolean;
    }>();

    // Process each data point
    data.beastNumbers.forEach(item => {
      const roundedPrice = Math.round(item.price);
      
      // Get or create entry for this price
      const existingEntry = priceMap.get(roundedPrice) || {
        timeClose: 0,
        timeVWAP: 0,
        totalVolume: 0,
        weightedAvg: 0,
        isBeast: false
      };

      // Aggregate time and volume
      priceMap.set(roundedPrice, {
        timeClose: existingEntry.timeClose + item.timeClose,
        timeVWAP: existingEntry.timeVWAP + item.timeVWAP,
        totalVolume: existingEntry.totalVolume + item.totalVolume,
        weightedAvg: 0, // Will calculate later
        isBeast: existingEntry.isBeast || item.isBeast
      });
    });

    // Convert to array and sort by price
    const sortedData = Array.from(priceMap.entries())
      .map(([price, data]) => ({ price, ...data }))
      .sort((a, b) => a.price - b.price);

    // Calculate total sums for weighted average calculation
    const totalTimeClose = sortedData.reduce((sum, item) => sum + item.timeClose, 0);
    const totalTimeVWAP = sortedData.reduce((sum, item) => sum + item.timeVWAP, 0);
    const totalVolume = sortedData.reduce((sum, item) => sum + item.totalVolume, 0);

    // Calculate weighted average for each price
    sortedData.forEach(item => {
      // Use the weighted average formula based on the requirements
      item.weightedAvg = 
        (totalTimeClose ? (item.timeClose / totalTimeClose) : 0) +
        (totalTimeVWAP ? (item.timeVWAP / totalTimeVWAP) : 0) +
        (totalVolume ? (item.totalVolume / totalVolume) : 0);
    });

    // Find the beast number (highest weighted average)
    const beastIndex = sortedData.reduce(
      (maxIndex, item, currentIndex, array) => 
        item.weightedAvg > array[maxIndex].weightedAvg ? currentIndex : maxIndex, 
      0
    );

    // Mark the price with highest weighted avg as the beast
    if (beastIndex >= 0) {
      sortedData[beastIndex].isBeast = true;
    }

    return sortedData;
  }, [data, formattedToday]);

  // Calculate stats for the chart
  const stats: ProcessedBeastStats = React.useMemo(() => {
    if (!chartData.length) {
      return {
        minPrice: 0,
        maxPrice: 0,
        trendPct: "0.00",
        isTrendingUp: false
      };
    }

    const prices = chartData.map(d => d.price);
    const totalVolume = chartData.reduce((sum, item) => sum + item.totalVolume, 0);
    const beastItem = chartData.find(item => item.isBeast);
    
    // Get premarket high and low from original data
    const preMarketData = data?.beastNumbers?.[0];
    
    return {
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
      trendPct: "0.00", // Not relevant for single day view
      isTrendingUp: false, // Not relevant for single day view
      totalVolume,
      beastNumber: beastItem?.price || 0,
      preMarketHigh: preMarketData?.preMarketHigh || 0,
      preMarketLow: preMarketData?.preMarketLow || 0,
      formattedDateRange: {
        start: formattedToday,
        end: formattedToday
      }
    };
  }, [chartData, data]);

  return {
    chartData,
    stats,
    error,
    isLoading,
    isError: !!error,
    mutate
  };
} 