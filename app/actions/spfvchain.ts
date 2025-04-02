"use server";
import { revalidatePath } from "next/cache";
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
  spfvData?: SPFVResponse; // Complete SPFV response object
}

interface OptionChain {
  strikes: Strike[];
  underlyingPrice: number;
}

interface ChainResponse {
  callOptionChain: OptionChain;
  putOptionChain: OptionChain;
}

function formatDateForChain(dateStr: string): string {
  const date = new Date(dateStr);
  return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
}

function formatDateForSPFV(dateStr: string): string {
  const date = new Date(dateStr);
  return `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}-${date.getFullYear()}`;
}

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 5000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch {
    clearTimeout(id);
    return null;
  }
}

async function fetchSPFVWithRetry(
  baseUrl: string,
  symbol: string,
  strike: number,
  expirationDate: string,
  callPutIndicator: 'C' | 'P',
  maxRetries = 1
): Promise<SPFVResponse | null> {
  const formattedDate = formatDateForSPFV(expirationDate);
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const spfvResponse = await fetchWithTimeout(
        `${baseUrl}/api/spfv/get-spfv?symbol=${symbol}&strike=${strike.toFixed(2)}&callPutIndicator=${callPutIndicator}&expiration=${formattedDate}`,
        { cache: 'no-store' }
      );

      if (spfvResponse?.status === 400) {
        console.log(`Attempt ${attempt + 1}: Timeout fetching SPFV for ${callPutIndicator} strike ${strike}`);
        if (attempt < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
          continue;
        }
        return null;
      }

      if (!spfvResponse?.ok) {
        console.log(`Attempt ${attempt + 1}: Failed to fetch SPFV for ${callPutIndicator} strike ${strike}: ${spfvResponse?.statusText}`);
        if (attempt < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
          continue;
        }
        return null;
      }

      const spfvData = await spfvResponse.json();
      console.log('SPFV DATA', spfvData);
      console.log('SPFV value type:', typeof spfvData.spfv);
      
      // Insertar la respuesta tal cual sin validación adicional
      return spfvData as SPFVResponse;
    } catch (error) {
      console.error(`Attempt ${attempt + 1}: Error fetching SPFV for ${callPutIndicator} strike ${strike}:`, error);
      if (attempt < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
        continue;
      }
      return null;
    }
  }
  return null;
}

async function processSPFVBatch(
  options: Strike[],
  baseUrl: string,
  symbol: string,
  callPutIndicator: 'C' | 'P'
): Promise<Strike[]> {
  const batchSize = 3; // Process 3 strikes at a time
  const results: Strike[] = [];

  for (let i = 0; i < options.length; i += batchSize) {
    const batch = options.slice(i, i + batchSize);
    const batchPromises = batch.map(async (option) => {
      const spfvData = await fetchSPFVWithRetry(
        baseUrl,
        symbol,
        option.strikePrice,
        option.expirationDate,
        callPutIndicator
      );

      // Only include spfvData if it was successful
      if (spfvData !== null) {
        return {
          ...option,
          spfv: spfvData.spfv.spfv,
          spfvData: spfvData
        };
      } else {
        return option;
      }
    });

    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);

    // Add delay between batches
    if (i + batchSize < options.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  return results;
}

export async function getSymbolChainAndSPFV(data: FormData) {
  // Intentar obtener la URL base de varias variables de entorno posibles
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  console.log(`Using base URL: ${baseUrl}`);
  
  try {
    // Get form data
    const symbol = data.get('symbol')?.toString();
    const date = data.get('expirationDate')?.toString();
    
    if (!symbol || !date) {
      throw new Error('Missing required parameters');
    }

    console.log(`Fetching chain for symbol: ${symbol}, date: ${date}, baseUrl: ${baseUrl}`);

    // Format date for chain API (YYYYMMDD)
    const formattedChainDate = formatDateForChain(date);
    
    // Fetch symbol chain - get both calls and puts
    const chainUrl = `${baseUrl}/api/spfv/get-calls-puts?symbol=${symbol}&StartDateTime=${formattedChainDate}&EndDateTime=${formattedChainDate}&callOrPut=both`;
    console.log(`Requesting chain from: ${chainUrl}`);

    const chainResponse = await fetch(
      chainUrl,
      { 
        method: 'GET',
        cache: 'no-store'
      }
    );

    if (!chainResponse.ok) {
      const errorText = await chainResponse.text();
      console.error(`Chain API error: ${chainResponse.status} - ${errorText}`);
      throw new Error(`Failed to fetch chain: ${chainResponse.statusText} (${chainResponse.status})`);
    }

    const chainData = await chainResponse.json() as ChainResponse;
    console.log(`Chain data received. Call strikes: ${chainData.callOptionChain.strikes.length}, Put strikes: ${chainData.putOptionChain.strikes.length}`);
    
    if (!chainData.callOptionChain?.strikes?.length && !chainData.putOptionChain?.strikes?.length) {
      console.warn(`No strike data found for ${symbol} on ${date}`);
      // Si no hay strikes, devolver los datos del chain sin procesar SPFV
      return chainData;
    }

    // Process calls and puts in parallel, but with controlled batch sizes
    try {
      console.log(`Starting SPFV processing for ${chainData.callOptionChain.strikes.length} call strikes and ${chainData.putOptionChain.strikes.length} put strikes`);
      
      // Para evitar sobrecarga, limitamos el número de strikes a procesar
      const maxStrikesToProcess = 50; // Ajustar según sea necesario
      
      const callStrikesToProcess = chainData.callOptionChain.strikes.slice(0, maxStrikesToProcess);
      const putStrikesToProcess = chainData.putOptionChain.strikes.slice(0, maxStrikesToProcess);
      
      const [spfvCallData, spfvPutData] = await Promise.all([
        processSPFVBatch(callStrikesToProcess, baseUrl, symbol, 'C'),
        processSPFVBatch(putStrikesToProcess, baseUrl, symbol, 'P')
      ]);
      
      console.log(`SPFV processing completed. Call data: ${spfvCallData.length}, Put data: ${spfvPutData.length}`);
      
      revalidatePath('/dashboard/spfv/calculator');
      
      return {
        callOptionChain: {
          ...chainData.callOptionChain,
          strikes: spfvCallData
        },
        putOptionChain: {
          ...chainData.putOptionChain,
          strikes: spfvPutData
        }
      };
    } catch (spfvError) {
      console.error('Error processing SPFV data:', spfvError);
      // Si hay un error en el procesamiento SPFV, devolver los datos del chain sin SPFV
      console.log('Returning chain data without SPFV due to processing error');
      return chainData;
    }
  } catch (error) {
    console.error('Error in getSymbolChainAndSPFV:', error);
    // Proporcionar información más detallada sobre el error
    if (error instanceof Error) {
      console.error(`Error details: ${error.message}`);
      console.error(`Stack trace: ${error.stack}`);
      throw new Error(`Failed to fetch option chain: ${error.message}`);
    }
    throw error;
  }
}
