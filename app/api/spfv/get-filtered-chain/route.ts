import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { format } from "date-fns";
import { revalidatePath } from "next/cache";
// API endpoints
const CHAIN_API_URL = `${process.env.SPFV_API_URL}/symbol-chain`;
const SPFV_API_URL = `${process.env.SPFV_API_URL}/symbol-multi-value-live`;

// Types for SPFV data
interface SPFVValue {
  symbol: string;
  spfv: number;
  callPutIndicator: string;
  expiration: string;
  strike: number;
  strikeDiff: number;
  tte: number;
  currentUnderlyingPrice: number;
}

interface SPFVResponse {
  values: SPFVValue[];
}

// Types for option chain data
interface Strike {
  milliseconds: number;
  symbol: string;
  contract: string;
  callOrPut: number;
  strikePrice: number;
  expirationDate: string;
  last: number;
  bid: number;
  ask: number;
  mid: number;
  prevClose: number;
  volatility: number;
  volume: number;
  openInterest: number;
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
  rho: number;
  // Other properties...
}

interface OptionChain {
  symbol: string;
  lastTradePrice: number;
  underlyingPrice: number;
  marketIsCurrentlyOpen: boolean;
  strikes: Strike[];
}

interface ChainResponse {
  symbol: string;
  fedRate: number;
  isMarketOpen: boolean;
  requestedType: string;
  callOptionChain: OptionChain;
  putOptionChain: OptionChain;
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

    // Authentication check
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const chainDateFormat = format(date, "yyyyMMdd");
    const spfvDateFormat = format(date, "MM-dd-yyyy");
        
    // Step 1: Fetch option chain data
    const chainApiUrl = `${CHAIN_API_URL}?symbol=${symbol}&StartDateTime=${chainDateFormat}&EndDateTime=${chainDateFormat}&callOrPut=BOTH`;
    
    const chainResponse = await fetch(chainApiUrl, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    if (!chainResponse.ok) {
      const errorText = await chainResponse.text();
      console.error(`Chain API error: ${chainResponse.status} - ${errorText}`);
      return NextResponse.json(
        { error: `Chain API error: ${chainResponse.status} - ${chainResponse.statusText}` },
        { status: chainResponse.status }
      );
    }

    const chainData = await chainResponse.json() as ChainResponse;
    
    // Step 2: Fetch SPFV data

    console.log(`Fetching SPFV values for ${symbol} on ${spfvDateFormat}`);
    const spfvApiUrl = `${SPFV_API_URL}?expiration=${spfvDateFormat}&symbol=${symbol}`;
    
    console.log(`SPFV API URL: ${spfvApiUrl}`);
    
    const spfvResponse = await fetch(spfvApiUrl, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    if (!spfvResponse.ok) {
      const errorText = await spfvResponse.text();
      console.error(`SPFV API error: ${spfvResponse.status} - ${errorText}`);
      return NextResponse.json(
        { error: `SPFV API error: ${spfvResponse.status} - ${spfvResponse.statusText}` },
        { status: spfvResponse.status }
      );
    }

    const spfvData = await spfvResponse.json() as SPFVResponse;
    
    if (!spfvData.values || spfvData.values.length === 0) {
      console.warn(`No SPFV values found for ${symbol} on ${spfvDateFormat}`);
      return NextResponse.json(
        { error: `No SPFV values found for ${symbol} on ${date}` },
        { status: 404 }
      );
    }

    // Step 3: Organize SPFV data by strike and type (call/put)
    const spfvByStrike = new Map<string, SPFVValue>();
    
    // Track all strikes that have SPFV data (either call or put)
    const strikesWithSPFV = new Set<number>();
    
    for (const spfvValue of spfvData.values) {
      const key = `${spfvValue.strike}_${spfvValue.callPutIndicator}`;
      spfvByStrike.set(key, spfvValue);
      strikesWithSPFV.add(spfvValue.strike);
    }

    console.log(`Found ${strikesWithSPFV.size} unique strikes with SPFV data`);

    // Step 4: Process all call and put options, keeping those with SPFV data
    // and also including all strikes that have SPFV data on either side
    const processedCallOptions = chainData.callOptionChain.strikes
      .filter(strike => 
        // Keep this strike if it has SPFV data OR any other strike with same price has SPFV data
        strikesWithSPFV.has(strike.strikePrice) || 
        spfvByStrike.has(`${strike.strikePrice}_C`)
      )
      .map(strike => {
        const key = `${strike.strikePrice}_C`;
        const spfvValue = spfvByStrike.get(key);
        
        return {
          ...strike,
          spfvData: spfvValue ? { spfv: spfvValue } : undefined
        };
      });

    const processedPutOptions = chainData.putOptionChain.strikes
      .filter(strike => 
        // Keep this strike if it has SPFV data OR any other strike with same price has SPFV data
        strikesWithSPFV.has(strike.strikePrice) || 
        spfvByStrike.has(`${strike.strikePrice}_P`)
      )
      .map(strike => {
        const key = `${strike.strikePrice}_P`;
        const spfvValue = spfvByStrike.get(key);
        
        return {
          ...strike,
          spfvData: spfvValue ? { spfv: spfvValue } : undefined
        };
      });

    // Step 6: Build the combined response with all relevant strikes
    const combinedResponse = {
      symbol: chainData.symbol,
      fedRate: chainData.fedRate,
      isMarketOpen: chainData.isMarketOpen,
      requestedType: chainData.requestedType,
      underlyingPrice: chainData.callOptionChain.underlyingPrice,
      // Include only filtered data
      callOptionChain: {
        ...chainData.callOptionChain,
        strikes: processedCallOptions
      },
      putOptionChain: {
        ...chainData.putOptionChain,
        strikes: processedPutOptions
      },
      matchedStrikes: {
        calls: processedCallOptions.filter(o => o.spfvData).length,
        puts: processedPutOptions.filter(o => o.spfvData).length,
        totalStrikes: strikesWithSPFV.size
      }
    };

    console.log(`Returning data with ${processedCallOptions.length} calls and ${processedPutOptions.length} puts for ${strikesWithSPFV.size} unique strikes`);
    revalidatePath('/spfv/calculator')
    return NextResponse.json(combinedResponse);
    
  } catch (error) {
    console.error('Error processing request:', error);
    
    let errorMessage = 'Internal server error';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 