"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, LoaderCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { OptionsCalculatorFormValues, optionsCalculatorSchema } from "@/lib/validations/options-calculator"
import { toast } from "sonner"
import { OptionsResultsTable } from "./options-results-table"
import SymbolsListSelect from "./symbols-list-select"
import { getSymbolChainAndSPFV } from "@/app/actions/spfvchain"

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
  const [callOptions, setCallOptions] = useState<OptionData[]>([])
  const [putOptions, setPutOptions] = useState<OptionData[]>([])
  const [underlyingPrice, setUnderlyingPrice] = useState<number>(0)
  const [showResults, setShowResults] = useState(false)

  // Initialize form with React Hook Form and Zod resolver
  const form = useForm<OptionsCalculatorFormValues>({
    resolver: zodResolver(optionsCalculatorSchema)
  })

  // Submit handler
  async function onSubmit(data: OptionsCalculatorFormValues) {
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append("symbol", data.symbol);
      formData.append("expirationDate", data.expirationDate.toISOString());
      
      const responseData = await getSymbolChainAndSPFV(formData)
      
      if (responseData) {
        setUnderlyingPrice(responseData.callOptionChain.underlyingPrice || 0)
        
        // Process call options
        const callOptionsData = responseData.callOptionChain?.strikes?.map((option: ChainOptionData) => ({
          strikePrice: option.strikePrice,
          bid: option.bid,
          ask: option.ask, 
          volatility: option.volatility,
          prevClose: option.prevClose,
          last: option.last,
          spfv: option.spfv,
          spfvData: option.spfvData
        })) || [];
        
        // Process put options
        const putOptionsData = responseData.putOptionChain?.strikes?.map((option: ChainOptionData) => ({
          strikePrice: option.strikePrice,
          bid: option.bid,
          ask: option.ask,
          volatility: option.volatility,
          prevClose: option.prevClose,
          last: option.last,
          spfv: option.spfv,
          spfvData: option.spfvData
        })) || [];
        
        setCallOptions(callOptionsData)
        setPutOptions(putOptionsData)
        setShowResults(true)
        
        toast.success('Option chain loaded successfully')
      }
    } catch (error) {
      console.error('Error fetching option chain:', error)
      toast.error('Failed to load option chain')
    } finally {
      setIsLoading(false)
    }
  }

  const getSPFV = async () => {
    const spfvParams = new URLSearchParams({
      expiration: '04-04-2025',
      symbol: 'TSLA',
      callPutIndicator: 'P',
      strike: '282.50',
    });
    const response = await fetch(`/api/spfv/get-spfv?${spfvParams}`);
    const data = await response.json();
    console.log('SPFV', data);
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
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    Loading Option Chain...
                  </>
                ) : (
                  "View Option Chain"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Button onClick={getSPFV}>Log Call Options</Button>

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

