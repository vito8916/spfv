"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, LoaderCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { optionsCalculatorSchema, type OptionsCalculatorFormValues } from "@/lib/validations/options-calculator"
import { toast } from "sonner"
import { OptionsResultsTable } from "./options-results-table"
import SymbolsListSelect from "./symbols-list-select"


interface OptionData {
  strikePrice: number;
  bid: number;
  ask: number;
  volatility: number;
  prevClose?: number;
  last?: number;
}

// Shape of API response
interface OptionsApiResponse {
  symbol: string;
  underlyingPrice: number;
  isMarketOpen: boolean;
  callOptionChain: {
    symbol: string;
    lastTradePrice: number;
    strikes: Array<{
      strikePrice: number;
      bid: number;
      ask: number;
      volatility: number;
      prevClose: number;
      last: number;
    }>;
  };
  putOptionChain: {
    symbol: string;
    lastTradePrice: number;
    strikes: Array<{
      strikePrice: number;
      bid: number;
      ask: number;
      volatility: number;
      prevClose: number;
      last: number;
    }>;
  };
}

export function OptionsCalculator() {
  const [isLoading, setIsLoading] = useState(false)
  const [callOptions, setCallOptions] = useState<OptionData[]>([])
  const [putOptions, setPutOptions] = useState<OptionData[]>([])
  const [underlyingPrice, setUnderlyingPrice] = useState<number>(0)
  const [showResults, setShowResults] = useState(false)
     

  // Initialize form with React Hook Form and Zod resolver
  const form = useForm<OptionsCalculatorFormValues>({
    resolver: zodResolver(optionsCalculatorSchema),
    defaultValues: {
      symbol: "",
      desiredStrike: 0,
      nearTheMoney: false,
      optionType: "both",
      strikeCount: "20"
    }
  })

  // Submit handler
  const onSubmit = async (data: OptionsCalculatorFormValues) => {
    setIsLoading(true)
    try {
      // Format the date for API
      const formattedDate = format(data.expirationDate, "yyyy-MM-dd")
      
      // Construct API parameters
      const params = new URLSearchParams({
        symbol: data.symbol,
        StartDateTime: formattedDate,
        EndDateTime: formattedDate,
        callOrPut: "both", 
        strikeCount: data.strikeCount
      })

      // Add optional parameters
      if (data.desiredStrike) {
        params.append('desiredStrike', data.desiredStrike.toString())
      }
      
      if (data.nearTheMoney) {
        params.append('nearTheMoney', 'true')
      }
      
      const response = await fetch(`/api/spfv/get-calls-puts?${params}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch options data')
      }
      
      const responseData: OptionsApiResponse = await response.json()
      
      // Process response data
      if (responseData) {
        setUnderlyingPrice(responseData.callOptionChain.lastTradePrice || 0)
        
        // Process call options
        const callOptionsData = responseData.callOptionChain?.strikes?.map(option => ({
          strikePrice: option.strikePrice,
          bid: option.bid,
          ask: option.ask, 
          volatility: option.volatility,
          prevClose: option.prevClose,
          last: option.last
        })) || [];
        
        // Process put options
        const putOptionsData = responseData.putOptionChain?.strikes?.map(option => ({
          strikePrice: option.strikePrice,
          bid: option.bid,
          ask: option.ask,
          volatility: option.volatility,
          prevClose: option.prevClose,
          last: option.last
        })) || [];
        
        setCallOptions(callOptionsData)
        setPutOptions(putOptionsData)
        setShowResults(true)
        
        toast.success('Option chain loaded successfully')
      } else {
        toast.error('Invalid response from server')
      }
    } catch (error) {
      console.error('Error fetching option chain:', error)
      toast.error('Failed to load option chain')
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-center">
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
                              return dayOfWeek !== 5; // 5 is Friday
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Strike Price */}
                <FormField
                  control={form.control}
                  name="desiredStrike"
                  render={({ field }) => (
                    <FormItem className="lg:col-span-1">
                      <FormLabel>Desired Strike</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0.00" 
                          {...field}
                          value={field.value || 0}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Near The Money */}
                <FormField
                  control={form.control}
                  name="nearTheMoney"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-end space-x-2 lg:col-span-1">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="!mt-0">Near the Money</FormLabel>
                    </FormItem>
                  )}
                />

                {/* Option Type - Hidden since it's always "both" for the option chain view */}
                <FormField
                  control={form.control}
                  name="optionType"
                  render={({ field }) => (
                    <input type="hidden" {...field} value="both" />
                  )}
                />

                {/* Strike Count - Hidden since it's always 20 */}
                <FormField
                  control={form.control}
                  name="strikeCount"
                  render={({ field }) => (
                    <input type="hidden" {...field} value="20" />
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

