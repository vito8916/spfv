import useSWR from 'swr';
import { parse, format } from 'date-fns';

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
}


const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.');
    throw error;
  }
  return res.json();
};

export function useSpfvBeastDaily(symbol: string, endDate?: Date, refreshInterval = 0) {
  const shouldFetch = !!symbol;

  const { data, error, isLoading, mutate } = useSWR<SPFVBeastDailyResponse>(
    shouldFetch ? `/api/spfv/get-spfv-beast-daily?symbol=${symbol}&endDate=${endDate}` : null,
    fetcher,
    {
      refreshInterval: refreshInterval,
      revalidateOnFocus: true,
      shouldRetryOnError: false,
    }
  );

  // Process the data - using date-fns parse instead of custom parseLocalDate
  const processedData: ProcessedBeastData[] = data?.beastNumbers 
    ? data.beastNumbers
        .map((d) => ({
          ...d,
          // Convert date string to timestamp using date-fns parse
          // Assuming date format is 'yyyy-MM-dd'
          date: parse(d.date, 'yyyy-MM-dd', new Date()).getTime(),
        }))
        .sort((a, b) => a.date - b.date)
    : [];

  // Calculate stats
  const stats: ProcessedBeastStats = processedData.length 
    ? (() => {
        const prices = processedData.map((d) => d.price);
        const first = prices[0];
        const last = prices[prices.length - 1];
        const changePct = first > 0 ? ((last - first) / first) * 100 : 0;
        
        return {
          minPrice: Math.min(...prices),
          maxPrice: Math.max(...prices),
          trendPct: Math.abs(changePct).toFixed(2),
          isTrendingUp: changePct > 0,
          formattedDateRange: processedData.length > 0 ? {
            start: format(processedData[0].date, "MMM d, yyyy"),
            end: format(processedData[processedData.length-1].date, "MMM d, yyyy")
          } : undefined
        };
      })()
    : { 
        minPrice: 0, 
        maxPrice: 0,  
        trendPct: "0.00", 
        isTrendingUp: false 
      };

  return {
    data: processedData,
    stats,
    error,
    isLoading,
    isError: !!error,
    mutate
  };
} 