export async function getTiers(symbol?: string, expiration?: string) {
    if (!symbol || !expiration) return null;
    console.log("FORMATED DATE:::::::::", expiration);

  
    const params = new URLSearchParams({
      symbol,
      expirationDate: expiration, 
    });

  
    const response = await fetch(`/api/spfv/tiers?${params.toString()}`, {
      method: "GET",
      credentials: "include",
    });
  
    if (!response.ok) {
      console.error("Failed to fetch tiers:", await response.text());
      return null;
    }
  
    return response.json();
  }
  