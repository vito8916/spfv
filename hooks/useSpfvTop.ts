import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useSpfvTop(type: string, intervalTime = 0) {
  console.log("type:::::::", type);
  console.log("intervalTime::::::", intervalTime);

  const shouldFetch = type;
  console.log("shouldFetch::::::", shouldFetch);

  const { data, error, isLoading, mutate } = useSWR(
    shouldFetch ? `/api/spfv/spfv-top?type=${type}` : null,
    fetcher,
    {
      refreshInterval: intervalTime,
      revalidateOnFocus: false,
      //dedupingInterval: 5000,
    }
  );

  console.log("data::::::", data);
  
  return {
    data: data?.items,
    error,
    isLoading,
    isError: !!error,
    mutate,
  };
}
