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

// Interfaz para los items de respuesta de API batch
interface SPFVBatchResponseItem {
  strikePrice: number;
  spfv: SPFVResponse['spfv'];
}

// Helper function to format date for SPFV API
function formatDateForSPFV(dateStr: string): string {
  const date = new Date(dateStr);
  return `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}-${date.getFullYear()}`;
}

// Intentar obtener datos SPFV por lotes más grandes
async function fetchSPFVBatch(
  symbol: string,
  strikes: number[],
  expirationDate: string,
  callPutIndicator: 'C' | 'P',
  timeoutMs = 8000
): Promise<Map<number, SPFVResponse>> {
  try {
    const formattedDate = formatDateForSPFV(expirationDate);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    
    // Preparar los parámetros de la solicitud
    // Esta es una implementación ejemplo, ya que no sé si el API soporta solicitudes batch
    // Si tu API tiene un endpoint batch, usa ese. Si no, podríamos hacer algo como esto:
    
    // Construir una URL que solicite todos los strikes a la vez si el API lo soporta
    const strikesParam = strikes.map(s => s.toFixed(2)).join(',');
    const apiUrl = `${SPFV_API_URL}/batch?symbol=${symbol}&expiration=${formattedDate}&strikes=${strikesParam}&callPutIndicator=${callPutIndicator}`;
    
    console.log(`Fetching batch SPFV data for ${strikes.length} ${callPutIndicator} strikes`);
    
    // Intentar solicitud batch primero (si existe el endpoint)
    try {
      const batchResponse = await fetch(apiUrl, {
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (batchResponse.ok) {
        const batchData = await batchResponse.json();
        console.log(`Successfully fetched batch SPFV data for ${callPutIndicator}`);
        
        // Procesar los datos de lote (esto dependerá de cómo responda tu API)
        const resultMap = new Map<number, SPFVResponse>();
        
        // Este código asume un formato de respuesta específico que podría no coincidir con tu API
        // Ajústalo según sea necesario
        if (Array.isArray(batchData)) {
          batchData.forEach((item: SPFVBatchResponseItem) => {
            if (item.strikePrice && item.spfv) {
              resultMap.set(parseFloat(item.strikePrice.toString()), item as unknown as SPFVResponse);
            }
          });
        }
        
        return resultMap;
      }
    } catch {
      console.log('Batch request not supported or failed, falling back to individual requests');
      // Continuamos con solicitudes individuales en paralelo
    }
    
    // Si la solicitud batch falla, hacer solicitudes en paralelo pero con menos llamadas
    const batchSize = 5; // Procesar más strikes a la vez
    const resultMap = new Map<number, SPFVResponse>();
    
    // Dividir los strikes en lotes más grandes
    for (let i = 0; i < strikes.length; i += batchSize) {
      const batchStrikes = strikes.slice(i, i + batchSize);
      console.log(`Processing sub-batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(strikes.length / batchSize)} of ${callPutIndicator} strikes`);
      
      // Hacer solicitudes en paralelo para este lote
      const promises = batchStrikes.map(async (strike) => {
        try {
          const apiUrl = `${SPFV_API_URL}?symbol=${symbol}&expiration=${formattedDate}&strike=${strike.toFixed(2)}&callPutIndicator=${callPutIndicator}`;
          
          const response = await fetch(apiUrl, {
            headers: {
              'Content-Type': 'application/json',
            },
            // No usamos el mismo controller para dar más tiempo a cada solicitud individual
            // Pero limitamos el número máximo que procesamos
          });
          
          if (response.ok) {
            const data = await response.json();
            console.log(`Got SPFV for ${callPutIndicator} strike ${strike}: ${data.spfv?.spfv || 'N/A'}`);
            return { strike, data };
          }
          
          return { strike, data: null };
        } catch (error) {
          console.error(`Error fetching SPFV for ${callPutIndicator} strike ${strike}:`, error);
          return { strike, data: null };
        }
      });
      
      // Esperar a que todas las solicitudes del lote terminen
      const results = await Promise.all(promises);
      
      // Agregar al mapa de resultados
      for (const result of results) {
        if (result.data) {
          resultMap.set(result.strike, result.data as SPFVResponse);
        }
      }
    }
    
    return resultMap;
  } catch (error) {
    console.error('Error in fetchSPFVBatch:', error);
    return new Map<number, SPFVResponse>();
  }
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
    
    // Para rendimiento, limitar el número de strikes pero procesar más que antes
    const maxStrikesToProcess = 50; // Procesar más strikes ya que haremos llamadas paralelas
    
    // Ordenar los strikes por su proximidad al precio subyacente
    const sortedCallStrikes = [...chainData.callOptionChain.strikes].sort((a, b) => 
      Math.abs(a.strikePrice - chainData.callOptionChain.underlyingPrice) - 
      Math.abs(b.strikePrice - chainData.callOptionChain.underlyingPrice)
    ).slice(0, maxStrikesToProcess);
    
    const sortedPutStrikes = [...chainData.putOptionChain.strikes].sort((a, b) => 
      Math.abs(a.strikePrice - chainData.putOptionChain.underlyingPrice) - 
      Math.abs(b.strikePrice - chainData.putOptionChain.underlyingPrice)
    ).slice(0, maxStrikesToProcess);
    
    console.log(`Processing SPFV data for ${sortedCallStrikes.length} call strikes and ${sortedPutStrikes.length} put strikes`);
    
    // Control de tiempo para asegurar que no excedamos el límite de Netlify
    const startTime = Date.now();
    const maxTimeForCalls = 4000; // 4 segundos para calls
    const maxTimeForPuts = 8000;  // 8 segundos total (4 segundos para puts)
    
    try {
      // Extraer solo los precios de strike para la solicitud batch
      const callStrikePrices = sortedCallStrikes.map(strike => strike.strikePrice);
      const putStrikePrices = sortedPutStrikes.map(strike => strike.strikePrice);
      
      // Definir una expiración para el procesamiento de calls
      const callTimeout = setTimeout(() => {
        console.log('Call processing timeout reached, continuing with puts');
      }, maxTimeForCalls);
      
      // Procesar calls en un lote grande
      const callSPFVMap = await fetchSPFVBatch(
        symbol,
        callStrikePrices,
        sortedCallStrikes[0].expirationDate,
        'C'
      );
      
      clearTimeout(callTimeout);
      console.log(`Completed processing ${callSPFVMap.size} call strikes out of ${callStrikePrices.length}`);
      
      // Verificar si tenemos tiempo suficiente para procesar puts
      let putSPFVMap = new Map<number, SPFVResponse>();
      
      if (Date.now() - startTime < maxTimeForPuts) {
        // Procesar puts
        putSPFVMap = await fetchSPFVBatch(
          symbol,
          putStrikePrices,
          sortedPutStrikes[0].expirationDate,
          'P'
        );
        console.log(`Completed processing ${putSPFVMap.size} put strikes out of ${putStrikePrices.length}`);
      } else {
        console.log('Skipping put processing due to time constraints');
      }
      
      // Aplicar los datos SPFV a los strikes
      const enhancedCallStrikes = chainData.callOptionChain.strikes.map(strike => {
        const spfvData = callSPFVMap.get(strike.strikePrice);
        if (spfvData) {
          return {
            ...strike,
            spfv: spfvData.spfv.spfv,
            spfvData: spfvData
          };
        }
        return strike;
      });
      
      const enhancedPutStrikes = chainData.putOptionChain.strikes.map(strike => {
        const spfvData = putSPFVMap.get(strike.strikePrice);
        if (spfvData) {
          return {
            ...strike,
            spfv: spfvData.spfv.spfv,
            spfvData: spfvData
          };
        }
        return strike;
      });
      
      // Retornar los datos completos
      const result = {
        callOptionChain: {
          ...chainData.callOptionChain,
          strikes: enhancedCallStrikes
        },
        putOptionChain: {
          ...chainData.putOptionChain,
          strikes: enhancedPutStrikes
        }
      };
      
      return NextResponse.json(result);
    } catch (spfvError) {
      console.error('Error processing SPFV data:', spfvError);
      
      // Si hay un error procesando SPFV, retornar al menos los datos de chain
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