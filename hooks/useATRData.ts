import useSWR from 'swr';
import { format, parse, isAfter, startOfYear } from 'date-fns';

interface ATRMetaData {
  '1: Symbol': string;
  '2: Indicator': string;
  '3: Last Refreshed': string;
  '4: Interval': string;
  '5: Time Period': number;
  '6: Time Zone': string;
}

interface FormattedATRDataPoint {
  date: string;
  formattedDate: string;
  value: number;
}

// Internal interface with parsedDate for filtering
interface InternalATRDataPoint extends FormattedATRDataPoint {
  parsedDate: Date;
}

interface ATRResponse {
  'Meta Data': ATRMetaData;
  'Technical Analysis: ATR': Record<string, { ATR: string }>;
}

interface ProcessedATRData {
  metaData: {
    symbol: string;
    indicator: string;
    lastRefreshed: string;
    interval: string;
    timePeriod: number;
    timeZone: string;
  };
  dataPoints: FormattedATRDataPoint[];
  minValue: number;
  maxValue: number;
  averageValue: number;
  percentChange: number; // Last value compared to average
}

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.');
    throw error;
  }
  return res.json();
};

export function useATRData(symbol: string, refreshInterval = 0) {
  const shouldFetch = !!symbol;

  const { data: rawData, error, isLoading, mutate } = useSWR<ATRResponse>(
    shouldFetch ? `/api/spfv/get-atr?symbol=${symbol}` : null,
    fetcher,
    {
      refreshInterval: refreshInterval,
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      dedupingInterval: 0
    }
  );

  // Process and format the data for the chart
  let processedData: ProcessedATRData | null = null;

  if (rawData) {
    try {
      const metaData = {
        symbol: rawData['Meta Data']['1: Symbol'],
        indicator: rawData['Meta Data']['2: Indicator'],
        lastRefreshed: rawData['Meta Data']['3: Last Refreshed'],
        interval: rawData['Meta Data']['4: Interval'],
        timePeriod: rawData['Meta Data']['5: Time Period'],
        timeZone: rawData['Meta Data']['6: Time Zone']
      };

      // Define the start of 2024 as the cutoff date
      const startOf2024 = startOfYear(new Date(2024, 0, 1));

      // Convert the ATR data to an array and filter for dates in 2024 and beyond
      const technicalData = rawData['Technical Analysis: ATR'];
      
      // First map to internal format with parsedDate
      const internalDataPoints: InternalATRDataPoint[] = Object.entries(technicalData)
        .map(([date, data]) => {
          const value = parseFloat(data.ATR);
          // Parse the date and format it for display
          const parsedDate = parse(date, 'yyyy-MM-dd', new Date());
          const formattedDate = format(parsedDate, 'MMM d');
          
          return {
            date,
            formattedDate,
            value,
            parsedDate
          };
        });
      
      // Filter for 2024 and beyond
      const filteredDataPoints = internalDataPoints
        .filter(point => isAfter(point.parsedDate, startOf2024) || point.date.startsWith('2024'));
        
      // Convert back to FormattedATRDataPoint and sort
      const dataPoints: FormattedATRDataPoint[] = filteredDataPoints
        .map(({ date, formattedDate, value }) => ({
          date,
          formattedDate,
          value
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      // Calculate statistics
      if (dataPoints.length === 0) {
        // Handle case with no data points after filtering
        throw new Error('No data available for 2024 and onwards');
      }

      const values = dataPoints.map(point => point.value);
      const minValue = Math.min(...values);
      const maxValue = Math.max(...values);
      const averageValue = values.reduce((sum, val) => sum + val, 0) / values.length;
      
      // Calculate percent change (from first to last value)
      const firstValue = values[0];
      const lastValue = values[values.length - 1];
      const percentChange = ((lastValue - firstValue) / firstValue) * 100;

      processedData = {
        metaData,
        dataPoints,
        minValue,
        maxValue,
        averageValue,
        percentChange
      };
    } catch (e) {
      console.error('Error processing ATR data:', e);
      // Return null in case of processing error
      processedData = null;
    }
  }

  return {
    data: processedData,
    error,
    isLoading,
    isError: !!error,
    mutate
  };
} 