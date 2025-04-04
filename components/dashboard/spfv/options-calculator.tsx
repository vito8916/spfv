"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, LoaderCircle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useMemo, useRef, useState } from "react";
import TiersList from "./tiers-list";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  OptionsCalculatorFormValues,
  optionsCalculatorSchema,
} from "@/lib/validations/options-calculator";
import { toast } from "sonner";
import { isMarketOpen } from "@/utils/utils";
import { OptionsResultsTable } from "./options-results-table";
import { Skeleton } from "@/components/ui/skeleton";
import SymbolsListSelect from "./symbols-list-select";

interface SPFVData {
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
interface OptionData {
  strikePrice: number;
  bid: number;
  ask: number;
  volatility: number;
  prevClose?: number;
  last?: number;
  spfv?: number;
  spfvData?: SPFVData;
}
interface ChainOptionData {
  strikePrice: number;
  bid: number;
  ask: number;
  volatility: number;
  prevClose: number;
  last: number;
  spfv?: number;
  spfvData?: SPFVData;
  // Add other fields that might come from the API
}

export function OptionsCalculator() {
  const marketIsOpen = useMemo(() => isMarketOpen(), []);

  const [symbol, setSymbol] = useState<string>();
  const [expirationDate, setExpirationDate] = useState<Date>();
  const [showTiers, setShowTiers] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [callOptions, setCallOptions] = useState<OptionData[]>([]);
  const [putOptions, setPutOptions] = useState<OptionData[]>([]);
  const [underlyingPrice, setUnderlyingPrice] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastRefreshTime, setLastRefreshTime] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Reference to store the interval ID
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Initialize form with React Hook Form and Zod resolver
  const form = useForm<OptionsCalculatorFormValues>({
    resolver: zodResolver(optionsCalculatorSchema),
  });

  // Fetch data function that can be reused for initial load and refreshes
  const fetchData = async (formData: OptionsCalculatorFormValues) => {
    const isRefresh = isRefreshing;
    if (!isRefresh) setIsLoading(true);
    
    try {
      // Format date as YYYY-MM-DD
      //const formattedDate = format(data.expirationDate, "yyyy-MM-dd");
      
      // Use the filtered chain API endpoint that returns strikes with SPFV data
      const url = `/api/spfv/get-filtered-chain?symbol=${formData.symbol}&date=${formData.expirationDate}`;
      
      if (!isRefresh) {
        console.log(`Submitting request to: ${url}`);
      } else {
        console.log(`Refreshing data from: ${url}`);
      }
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }
      
      const responseData = await response.json();
      
      if (responseData) {
        if (!isRefresh) {
          console.log("Chain data with SPFV values received successfully", responseData);
        } else {
          console.log("Chain data refreshed successfully");
        }
        
        // Extract strikes from the response
        const callStrikes = responseData.callOptionChain?.strikes || [];
        const putStrikes = responseData.putOptionChain?.strikes || [];
        const underlyingPrice = responseData.underlyingPrice || 0;
        
        setUnderlyingPrice(underlyingPrice);
        
        // Process call options
        const callOptionsData = callStrikes.map((option: ChainOptionData) => ({
          strikePrice: option.strikePrice,
          bid: option.bid,
          ask: option.ask, 
          volatility: option.volatility,
          prevClose: option.prevClose,
          last: option.last,
          spfv: option.spfvData?.spfv?.spfv,
          spfvData: option.spfvData
        }));
        
        // Process put options
        const putOptionsData = putStrikes.map((option: ChainOptionData) => ({
          strikePrice: option.strikePrice,
          bid: option.bid,
          ask: option.ask,
          volatility: option.volatility,
          prevClose: option.prevClose,
          last: option.last,
          spfv: option.spfvData?.spfv?.spfv,
          spfvData: option.spfvData
        }));
        
        if (!isRefresh) {
          console.log(`Processed ${callOptionsData.length} call options and ${putOptionsData.length} put options with SPFV values`);
        }
        
        setCallOptions(callOptionsData);
        setPutOptions(putOptionsData);
        setShowResults(true);
        setLastRefreshTime(new Date());
        
        if (!isRefresh) {
          toast.success(`Option chain loaded with ${callOptionsData.length} calls and ${putOptionsData.length} puts containing SPFV values`);
        }
      } else {
        console.error("Empty response data received");
        if (!isRefresh) {
          toast.error('No data received from server');
        }
      }
    } catch (error) {
      // Show detailed error information
      let errorMessage = isRefresh ? 'Failed to refresh data' : 'Failed to load option chain';
      
      if (error instanceof Error) {
        console.error(isRefresh ? 'Error refreshing data:' : 'Error fetching option chain:', error.message);
        console.error('Stack:', error.stack);
        errorMessage = `Error: ${error.message}`;
      } else {
        console.error('Unknown error type:', error);
      }
      
      toast.error(errorMessage, {
        description: 'Please try again or contact support if the problem persists'
      });
    } finally {
      if (!isRefresh) setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Submit handler
  async function onSubmit(data: OptionsCalculatorFormValues) {
    if (!isMarketOpen()) {
      toast.warning("The market is currently closed.");
      return;
    }

    setSymbol(data.symbol);
    setExpirationDate(data.expirationDate);
    setShowTiers(true);
    setShowResults(false);
    
    // Call the fetchData function with the form data
    await fetchData(data);
  }
  
  // Handle manual refresh button click
  const handleRefresh = async () => {
    if (!symbol || !expirationDate) return;
    
    setIsRefreshing(true);
    await fetchData({ symbol, expirationDate });
  };
  
  // Set up auto-refresh interval when autoRefresh is enabled
  useEffect(() => {
    // Clear any existing interval
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }
    
    // If auto-refresh is enabled and we have valid data to refresh
    if (autoRefresh && showResults && symbol && expirationDate) {
      refreshIntervalRef.current = setInterval(() => {
        setIsRefreshing(true);
        fetchData({ symbol, expirationDate });
      }, 10000); // 10 seconds
    }
    
    // Clean up on unmount
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [autoRefresh, showResults, symbol, expirationDate]);

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Options Strategy Tiers</CardTitle>
          <CardDescription>
            View optimal strategy tiers for any stock symbol and expiration date
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
                {/* Symbol */}
                <FormField
                  control={form.control}
                  name="symbol"
                  render={({ field }) => (
                    <FormItem className="lg:col-span-1">
                      <FormLabel>Symbol</FormLabel>
                      <SymbolsListSelect field={field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Expiration Date */}
                <FormField
                  control={form.control}
                  name="expirationDate"
                  render={({ field }) => (
                    <FormItem className="lg:col-span-1">
                      <FormLabel>Expiration</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, "PP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            disabled={(date) => {
                              const dayOfWeek = date.getDay();
                              return dayOfWeek !== 5;
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isLoading || !marketIsOpen}
              >
                {isLoading ? (
                  <>
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    Loading Option Chain...
                  </>
                ) : !marketIsOpen ? (
                  <>
                  Waiting for market to open...
                  </>
                ) : (
                  "View Option Chain"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* if the market is not open, show a message */}
      {!marketIsOpen && (
        <div className="flex justify-center items-center text-center">
          <p className="text-muted-foreground text-sm">
            The market is currently closed. It opens at 9:30 AM ET, Monday to
            Friday.
          </p>
        </div>
      )}

      {/* Use the TierSection component */}
      {showTiers && <TiersList symbol={symbol} expiration={expirationDate} />}

      {isLoading && !isRefreshing && (
        <div className="space-y-6">
            <h3 className="text-lg font-medium">Loading Option Chain...</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </div>
        </div>
      )}

      {showResults && (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Options with SPFV Values</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="auto-refresh"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="auto-refresh" className="text-sm text-muted-foreground">
                  Auto-refresh (10s)
                </label>
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
                disabled={isRefreshing || !symbol || !expirationDate}
                className="flex items-center gap-2"
              >
                <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
                Refresh
              </Button>
              
              {lastRefreshTime && (
                <span className="text-xs text-muted-foreground">
                  Last updated: {format(lastRefreshTime, "HH:mm:ss")}
                </span>
              )}
            </div>
          </div>
          
          <OptionsResultsTable
            callOptions={callOptions}
            putOptions={putOptions}
            symbol={form.getValues("symbol")}
            expiryDate={form.getValues("expirationDate")}
            underlyingPrice={underlyingPrice}
          />
        </>
      )}
    </div>
  );
}

