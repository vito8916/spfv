import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useLastPriceInfo(symbol: string | undefined, endDateTime: string | undefined, intervalTime = 0) {
  console.log("symbol:::::::", symbol);
  console.log("intervalTime::::::", intervalTime);

  const shouldFetch = symbol;
  console.log("shouldFetch::::::", shouldFetch);

  const { data, error, isLoading, mutate } = useSWR(
    shouldFetch ? `/api/spfv/getLastPriceInfo?symbol=${symbol}&endDateTime=${endDateTime}` : null,
    fetcher,
    {
      refreshInterval: intervalTime,
      revalidateOnFocus: false,
      shouldRetryOnError: false
    }
  );

  console.log("data::::::", data);
  
  return {
    data: data,
    error,
    isLoading,
    isError: !!error,
    mutate,
  };
}