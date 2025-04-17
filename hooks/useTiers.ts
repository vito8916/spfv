import useSWR from 'swr';

interface TierOption {
  strike: number;
  bid: number;
  ask: number;
  midpoint: number;
}

interface TierData {
  ratio: number;
  higherComponent?: string;
  callOption: TierOption | null;
  putOption: TierOption | null;
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.')
    throw error
  }
  return res.json()
}

export function useTiers(symbol?: string, expiration?: Date, refreshInterval = 0) {
  //const formattedDate = expiration ? format(expiration, 'yyyyMMdd') : null;
  const shouldFetch = !!symbol && !!expiration;

  
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    shouldFetch ? `/api/spfv/get-tiers?symbol=${symbol}&expirationDate=${expiration}` : null,
    fetcher,
    {
      refreshInterval: refreshInterval,
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      // Disable caching to always get fresh data
      dedupingInterval: 0
    }
  );
  

  console.log("error::::::::::::::::::::::", error);
  // Process tiers data if available
  let tiers: TierData[] | null = null;
  if (data) {
    tiers = Object.values(data);
    
    // Filter valid tiers and sort by ratio
    if (tiers.length > 0) {
      tiers = tiers
        .filter(tier => 
          tier.callOption !== null && 
          tier.putOption !== null && 
          tier.higherComponent !== "Error/Unavailable"
        )
        .sort((a, b) => a.ratio - b.ratio);
    }
  }
  
  return {
    tiers,
    isLoading: isLoading || (isValidating && !data),
    isError: !!error,
    error,
    mutate,
    isValidating
  };
} 