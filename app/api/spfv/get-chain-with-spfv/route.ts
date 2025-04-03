import { NextRequest, NextResponse } from 'next/server';

// API endpoints
const CHAIN_API_URL = `${process.env.SPFV_API_URL}/symbol-chain`;
const SPFV_API_URL = `${process.env.SPFV_API_URL}/symbol-value-live`;

// Interfaces
interface SPFVResponse {
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

interface Strike {
  strikePrice: number;
  expirationDate: string;
  bid: number;
  ask: number;
  volatility: number;
  prevClose: number;
  last: number;
  spfv?: number;
  spfvData?: SPFVResponse;
}

interface OptionChain {
  strikes: Strike[];
  underlyingPrice: number;
}

interface ChainResponse {
  callOptionChain: OptionChain;
  putOptionChain: OptionChain;
}

// Helper function to format date for SPFV API
function formatDateForSPFV(dateStr: string): string {
  const date = new Date(dateStr);
  return `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}-${date.getFullYear()}`;
}

// Helper function to fetch SPFV data with retry logic
async function fetchSPFVData(
  symbol: string,
  strike: number,
  expirationDate: string,
  callPutIndicator: 'C' | 'P',
  maxRetries = 2,
  timeoutMs = 10000
): Promise<SPFVResponse | null> {
  const formattedDate = formatDateForSPFV(expirationDate);
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      // Abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
      
      // Construct the API URL with parameters
      const apiUrl = `${SPFV_API_URL}?symbol=${symbol}&expiration=${formattedDate}&strike=${strike.toFixed(2)}&callPutIndicator=${callPutIndicator}`;
      console.log(`Fetching SPFV data from: ${apiUrl} (Attempt ${attempt + 1}/${maxRetries})`);
      
      // Fetch data from external API
      const response = await fetch(apiUrl, {
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });
      
      // Clear the timeout
      clearTimeout(timeoutId);
      
      if (response.status === 400) {
        console.log(`Attempt ${attempt + 1}: No SPFV data found for ${callPutIndicator} strike ${strike}`);
        if (attempt < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
          continue;
        }
        return null;
      }
      
      if (!response.ok) {
        console.error(`Attempt ${attempt + 1}: SPFV API error: ${response.status} - ${response.statusText}`);
        if (attempt < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
          continue;
        }
        return null;
      }
      
      // Parse the response data
      const data = await response.json();
      console.log(`Successfully fetched SPFV data for ${callPutIndicator} strike ${strike}: ${data.spfv?.spfv || 'N/A'}`);
      return data as SPFVResponse;
      
    } catch (error) {
      // Check if this is an abort error (timeout)
      if (error instanceof Error && error.name === 'AbortError') {
        console.error(`Attempt ${attempt + 1}: Timeout fetching SPFV for ${callPutIndicator} strike ${strike}`);
      } else if (error instanceof Error) {
        console.error(`Attempt ${attempt + 1}: Error fetching SPFV for ${callPutIndicator} strike ${strike}: ${error.message}`);
      } else {
        console.error(`Attempt ${attempt + 1}: Unknown error fetching SPFV for ${callPutIndicator} strike ${strike}`);
      }
      
      if (attempt < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
        continue;
      }
      return null;
    }
  }
  
  return null;
}

// Helper function to process a batch of strikes
async function processSPFVBatch(
  strikes: Strike[],
  symbol: string,
  callPutIndicator: 'C' | 'P',
  batchSize = 3
): Promise<Strike[]> {
  const results: Strike[] = [];
  
  // Process strikes in batches to avoid overwhelming the API
  for (let i = 0; i < strikes.length; i += batchSize) {
    // Get a slice of strikes to process in this batch
    const batch = strikes.slice(i, i + batchSize);
    console.log(`Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(strikes.length / batchSize)} of ${callPutIndicator} strikes`);
    
    // Process each strike in the batch in parallel
    const batchPromises = batch.map(async (strike) => {
      const spfvData = await fetchSPFVData(
        symbol,
        strike.strikePrice,
        strike.expirationDate,
        callPutIndicator
      );
      
      if (spfvData && spfvData.spfv) {
        return {
          ...strike,
          spfv: spfvData.spfv.spfv,
          spfvData: spfvData
        };
      }
      
      // If SPFV data fetch failed, return the strike without SPFV data
      return strike;
    });
    
    // Wait for all strikes in this batch to be processed
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
    
    // Add a delay between batches to avoid rate limiting
    if (i + batchSize < strikes.length) {
      console.log(`Waiting before processing next batch...`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  return results;
}

export async function GET(request: NextRequest) {
  try {
    // Parse search parameters
    const searchParams = request.nextUrl.searchParams;
    const symbol = searchParams.get('symbol');
    const date = searchParams.get('date');
    
    console.log(`Processing request for symbol: ${symbol}, date: ${date}`);

    // Validate required parameters
    if (!symbol || !date) {
      return NextResponse.json(
        { error: 'Missing required parameters. Required: symbol, date' },
        { status: 400 }
      );
    }

    // Format date for chain API (YYYYMMDD)
    const formattedDate = date.replace(/-/g, '');
    
    // Construct the API URL with parameters for chain
    const chainApiUrl = `${CHAIN_API_URL}?symbol=${symbol}&StartDateTime=${formattedDate}&EndDateTime=${formattedDate}&callOrPut=both`;
    console.log(`Requesting chain from: ${chainApiUrl}`);

    // Fetch chain data
    const chainResponse = await fetch(chainApiUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Check if the chain API request was successful
    if (!chainResponse.ok) {
      const errorText = await chainResponse.text();
      console.error(`Chain API error: ${chainResponse.status} - ${errorText}`);
      return NextResponse.json(
        { error: `Chain API error: ${chainResponse.status} - ${chainResponse.statusText}` },
        { status: chainResponse.status }
      );
    }

    // Parse the chain response data
    const chainData = await chainResponse.json() as ChainResponse;
    console.log(`Chain data received. Call strikes: ${chainData.callOptionChain.strikes.length}, Put strikes: ${chainData.putOptionChain.strikes.length}`);
    
    // If no strikes found, return the chain data as is
    if (!chainData.callOptionChain?.strikes?.length && !chainData.putOptionChain?.strikes?.length) {
      console.log(`No strike data found for ${symbol} on ${date}`);
      return NextResponse.json(chainData);
    }
    
    // For performance reasons, limit the number of strikes to process
    const maxStrikesToProcess = 15; // You can adjust this as needed
    
    // Sort strikes by their proximity to the underlying price and take the closest ones
    const sortedCallStrikes = [...chainData.callOptionChain.strikes].sort((a, b) => 
      Math.abs(a.strikePrice - chainData.callOptionChain.underlyingPrice) - 
      Math.abs(b.strikePrice - chainData.callOptionChain.underlyingPrice)
    ).slice(0, maxStrikesToProcess);
    
    const sortedPutStrikes = [...chainData.putOptionChain.strikes].sort((a, b) => 
      Math.abs(a.strikePrice - chainData.putOptionChain.underlyingPrice) - 
      Math.abs(b.strikePrice - chainData.putOptionChain.underlyingPrice)
    ).slice(0, maxStrikesToProcess);
    
    console.log(`Processing SPFV data for ${sortedCallStrikes.length} call strikes and ${sortedPutStrikes.length} put strikes`);
    
    // Process calls and puts in sequence to avoid overwhelming the API
    try {
      // Process call strikes first
      const spfvCallData = await processSPFVBatch(sortedCallStrikes, symbol, 'C');
      console.log(`Completed processing ${spfvCallData.length} call strikes`);
      
      // Then process put strikes
      const spfvPutData = await processSPFVBatch(sortedPutStrikes, symbol, 'P');
      console.log(`Completed processing ${spfvPutData.length} put strikes`);
      
      // Return the combined data
      const result = {
        callOptionChain: {
          ...chainData.callOptionChain,
          strikes: chainData.callOptionChain.strikes.map(strike => {
            // Find if we have SPFV data for this strike
            const processedStrike = spfvCallData.find(s => s.strikePrice === strike.strikePrice);
            return processedStrike || strike;
          })
        },
        putOptionChain: {
          ...chainData.putOptionChain,
          strikes: chainData.putOptionChain.strikes.map(strike => {
            // Find if we have SPFV data for this strike
            const processedStrike = spfvPutData.find(s => s.strikePrice === strike.strikePrice);
            return processedStrike || strike;
          })
        }
      };
      
      return NextResponse.json(result);
    } catch (spfvError) {
      console.error('Error processing SPFV data:', spfvError);
      
      // If there's an error processing SPFV, still return the chain data
      return NextResponse.json(chainData);
    }
    
  } catch (error) {
    let errorMessage = 'Failed to fetch options data';
    
    if (error instanceof Error) {
      errorMessage = error.message;
      console.error('Error fetching options data:', error.message);
      console.error('Stack:', error.stack);
    } else {
      console.error('Unknown error type:', error);
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 