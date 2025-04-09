export async function getFilteredSymbolChain(symbol: string, expiration: Date) {
    if (!symbol || !expiration) {
        console.error("Symbol or expiration is undefined", symbol, expiration);
        return null;
    }
  
    const params = new URLSearchParams({
      symbol,
      date: expiration.toISOString(), 
    });
  
    const response = await fetch(`/api/spfv/get-filtered-chain?${params.toString()}`, {
      credentials: "include",
      cache: "no-store",
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Content-Type": "application/json"
      }
    });
  
    if (!response.ok) {
      console.error("Failed to fetch filtered symbol chain:", response.status, response.statusText);
      return null;
    }
  
    return response.json();
  }
  