import useSWR from "swr";
import { useMemo } from "react";

interface SPFVData {
  spfv: {
    milliseconds: number;
    spfv: number;
    symbol: string;
    callPutIndicator: string;
    tte: number;
    strikeDiff: number;
    expiration: string;
    currentUnderlyingPrice: number;
  };
}

interface OptionData {
  strikePrice: number;
  bid: number;
  ask: number;
  mid: number;
  volatility: number;
  prevClose?: number;
  last?: number;
  spfv?: number;
  spfvData?: SPFVData;
}

interface OptionsChainResponse {
  symbol: string;
  fedRate: number;
  isMarketOpen: boolean;
  requestedType: string;
  underlyingPrice: number;
  callOptionChain: {
    strikes: OptionData[];
  };
  putOptionChain: {
    strikes: OptionData[];
  };
  matchedStrikes?: {
    calls: number;
    puts: number;
    totalStrikes: number;
  };
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());


export function useOptionsChain(symbol: string | undefined, expirationDate: Date | undefined, refreshInterval = 0) {
  // Only fetch if we have both symbol and expirationDate
  const shouldFetch = !!(symbol && expirationDate);

  const params = new URLSearchParams({
    symbol: symbol || "",
    date: expirationDate?.toISOString() || ""
  });

  const { data, error, isLoading, mutate } = useSWR(
      shouldFetch ? `/api/spfv/get-filtered-chain?${params.toString()}` : null,
      fetcher,
      {
        refreshInterval: refreshInterval,
        revalidateOnFocus: false,
        shouldRetryOnError: false,
        // Disable caching to always get fresh data
        dedupingInterval: 0
      }
  );

  // Process the response data into the format expected by the component
  const processedData = data as OptionsChainResponse;
  
  // Memoize the processed data to prevent unnecessary re-renders
  const callOptions = useMemo(() => {
    return processedData?.callOptionChain?.strikes?.map((option) => ({
      strikePrice: option.strikePrice,
      bid: option.bid,
      ask: option.ask,
      mid: option.mid || (option.bid && option.ask ? (option.bid + option.ask) / 2 : 0),
      volatility: option.volatility,
      prevClose: option.prevClose,
      last: option.last,
      spfv: option.spfvData?.spfv?.spfv,
      spfvData: option.spfvData,
    })) || [];
  }, [processedData?.callOptionChain?.strikes]);

  const putOptions = useMemo(() => {
    return processedData?.putOptionChain?.strikes?.map((option) => ({
      strikePrice: option.strikePrice,
      bid: option.bid,
      ask: option.ask,
      mid: option.mid || (option.bid && option.ask ? (option.bid + option.ask) / 2 : 0),
      volatility: option.volatility,
      prevClose: option.prevClose,
      last: option.last,
      spfv: option.spfvData?.spfv?.spfv,
      spfvData: option.spfvData,
    })) || [];
  }, [processedData?.putOptionChain?.strikes]);
  
  const underlyingPrice = useMemo(() => {
    return processedData?.underlyingPrice || 0;
  }, [processedData?.underlyingPrice]);

  return {
    callOptions,
    putOptions,
    underlyingPrice,
    data: processedData,
    error,
    isLoading,
    isError: !!error,
    mutate,
  };
} 