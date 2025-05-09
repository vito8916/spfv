import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useSpfvTop(type: string, intervalTime = 0) {
  const shouldFetch = type;

  const { data, error, isLoading, mutate } = useSWR(
    shouldFetch ? `/api/spfv/get-spfv-top?type=${type}` : null,
    fetcher,
    {
      refreshInterval: intervalTime,
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );
  return {
    data: data?.items,
    error,
    isLoading,
    isError: !!error,
    mutate,
  };
}
