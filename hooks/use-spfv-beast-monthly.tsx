import useSWR from 'swr';

//api response example
/* {
  "beastNumbers": [
      {
          "price": 297,
          "timeClose": 80,
          "timeVWAP": 84,
          "totalVolume": 330896,
          "weightedAvg": 0.55,
          "isBeast": true,
          "date": "2025-03-03",
          "symbol": "TSLA",
          "preMarketHigh": 304.42,
          "preMarketLow": 295.36
      },
    ]
} */

interface SPFVBeastMonthlyResponse {
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


const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.');
    throw error;
  }
  return res.json();
};

export function useSpfvBeastMonthly(symbol: string, endDate?: Date, refreshInterval = 0) {
  const shouldFetch = !!symbol;

  const { data, error, isLoading, mutate } = useSWR<SPFVBeastMonthlyResponse>(
    shouldFetch ? `/api/spfv/get-spfv-beast-monthly?symbol=${symbol}&endDate=${endDate}` : null,
    fetcher,
    {
      refreshInterval: refreshInterval,
      revalidateOnFocus: true,
      shouldRetryOnError: false,
    }
  );

  return {
    data: data?.beastNumbers,
    error,
    isLoading,
    isError: !!error,
    mutate
  };
} 