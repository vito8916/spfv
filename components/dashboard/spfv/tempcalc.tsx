"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, LoaderCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useMemo, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { OptionsCalculatorFormValues, optionsCalculatorSchema } from "@/lib/validations/options-calculator"
import { toast } from "sonner"
import { OptionsResultsTable } from "./options-results-table"
import SymbolsListSelect from "./symbols-list-select"
import Image from "next/image"
import { isMarketOpen } from "@/utils/utils"
import TiersList from "@/components/dashboard/spfv/tiers-list"
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
  const [isLoading, setIsLoading] = useState(false)
  const [callOptions, setCallOptions] = useState<OptionData[]>([]);
  const [putOptions, setPutOptions] = useState<OptionData[]>([]);
  const [underlyingPrice, setUnderlyingPrice] = useState<number>(0);
  const [showResults, setShowResults] = useState(false);


  const marketIsOpen = useMemo(() => isMarketOpen(), []);


  // Initialize form with React Hook Form and Zod resolver
  const form = useForm<OptionsCalculatorFormValues>({
    resolver: zodResolver(optionsCalculatorSchema)
  })

  const symbol = form.watch("symbol");
  const expirationDate = form.watch("expirationDate");
  console.log("symbol", symbol)
  console.log("expirationDate", expirationDate)



  // Submit handler
  async function onSubmit(data: OptionsCalculatorFormValues) {
    if (!isMarketOpen()) {
      toast.warning("The market is currently closed.");
      return;
    }

    setIsLoading(true)
    try {
      // Format date as YYYY-MM-DD
      const formattedDate = format(data.expirationDate, "yyyy-MM-dd");
      
      // Construct the URL with query parameters
      const url = `/api/spfv/get-chain-with-spfv?symbol=${data.symbol}&date=${formattedDate}`;
      
      console.log(`Submitting request to: ${url}`);
      
      // Fetch data from our API route
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
        console.log("Chain and SPFV data received successfully", responseData);
        
        // Extract strikes from the response
        const callStrikes = responseData.callOptionChain?.strikes || [];
        const putStrikes = responseData.putOptionChain?.strikes || [];
        const underlyingPrice = responseData.callOptionChain?.underlyingPrice || 0;
        
        setUnderlyingPrice(underlyingPrice);
        
        // Process call options
        const callOptionsData = callStrikes.map((option: ChainOptionData) => ({
          strikePrice: option.strikePrice,
          bid: option.bid,
          ask: option.ask, 
          volatility: option.volatility,
          prevClose: option.prevClose,
          last: option.last,
          spfv: option.spfv,
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
          spfv: option.spfv,
          spfvData: option.spfvData
        }));
        
        console.log(`Processed ${callOptionsData.length} call options and ${putOptionsData.length} put options`);
        
        setCallOptions(callOptionsData)
        setPutOptions(putOptionsData)
        setShowResults(true)
        
        toast.success('Option chain loaded successfully')
      } else {
        console.error("Empty response data received");
        toast.error('No data received from server')
      }
    } catch (error) {
      // Show detailed error information
      let errorMessage = 'Failed to load option chain';
      
      if (error instanceof Error) {
        console.error('Error fetching option chain:', error.message);
        console.error('Stack:', error.stack);
        errorMessage = `Error: ${error.message}`;
      } else {
        console.error('Unknown error type:', error);
      }
      
      toast.error(errorMessage, {
        description: 'Please try again or contact support if the problem persists'
      });
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Options Chain Viewer</CardTitle>
          <CardDescription>View option chains for any stock symbol and expiration date</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}className="space-y-6">
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
                              className={cn("w-full justify-start text-left font-normal", 
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? format(field.value, "PP") : <span>Pick a date</span>}
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

      {isLoading && (
        <div className="flex justify-center items-center">
          <Image src="/logo-animado-blanco.gif" alt="Loading" width={100} height={100} /> 
        </div>
      )}

      {/* if the market is not open, show a message */}
      {
         !marketIsOpen && (
          <div className="flex justify-center items-center text-center">
          <p className="text-muted-foreground text-sm">
            The market is currently closed. It opens at 9:30 AM ET, Monday to Friday.
          </p>
        </div>
        )
      }
      
      {
        showResults && (
          <TiersList symbol={symbol} expiration={expirationDate} />
        )
      }

      {showResults && (
        <OptionsResultsTable
          callOptions={callOptions}
          putOptions={putOptions}
          symbol={form.getValues("symbol")}
          expiryDate={form.getValues("expirationDate")}
          underlyingPrice={underlyingPrice}
        />
      )}
    </div>
  )
}

