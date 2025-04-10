import useSWR from "swr";
import { getFilteredSymbolChain } from "@/utils/spfv/getFilteredSymbolChain";
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

// Custom fetcher for the options chain data
const optionsChainFetcher = async (symbol: string, expirationDate: Date) => {
  if (!symbol || !expirationDate) return null;
  return getFilteredSymbolChain(symbol, expirationDate);
};

export function useOptionsChain(symbol: string | undefined, expirationDate: Date | undefined, refreshInterval = 0) {
  // Only fetch if we have both symbol and expirationDate
  const shouldFetch = !!(symbol && expirationDate);
  
  // Create a unique key for SWR based on the inputs
  const swrKey = shouldFetch ? [symbol, expirationDate] : null;
  
  const { data, error, isLoading, mutate } = useSWR(
    swrKey,
    () => optionsChainFetcher(symbol!, expirationDate!),
    {
      refreshInterval: refreshInterval,
      revalidateOnFocus: false,
      //dedupingInterval: 2000, // Don't revalidate more than once every 2 seconds
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