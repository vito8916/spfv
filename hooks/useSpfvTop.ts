import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useSpfvTop(type: string, intervalTime = 0) {
  const shouldFetch = type;
  const { data, error, isLoading, mutate } = useSWR(
    shouldFetch ? `/api/spfv/spfv-top?type=${type}` : null,
    fetcher,
    {
      refreshInterval: intervalTime,
      revalidateOnFocus: true,
      //dedupingInterval: 5000,
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
