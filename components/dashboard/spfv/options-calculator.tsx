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
import { CalendarIcon, LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";
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
import SymbolsListSelect from "./symbols-list-select";
import { useOptionsChain } from "@/hooks/useOptionsChain";
import { useTiers } from "@/hooks/useTiers";
import {
  MarketClosedMessage,
  TiersSection,
  ResultsSection
} from "./calculator";

export function OptionsCalculator() {
  const marketIsOpen = useMemo(() => isMarketOpen(), []);

  const [symbol, setSymbol] = useState<string>();
  const [expirationDate, setExpirationDate] = useState<Date>();
  const [showResults, setShowResults] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState<Date | null>(null);
  const [wasSubmitted, setWasSubmitted] = useState(false);
  // Use our custom hook to fetch and manage options chain data
  const { 
    callOptions, 
    putOptions, 
    underlyingPrice, 
    isLoading, 
    isError, 
    mutate 
  } = useOptionsChain(symbol, expirationDate, refreshInterval);

  // Use our custom hook to fetch and manage tiers data
  const { 
    tiers, 
    isLoading: tiersLoading, 
    isError: tiersError, 
    mutate: mutateTiers 
  } = useTiers(symbol, expirationDate, refreshInterval);

  // Initialize form with React Hook Form and Zod resolver
  const form = useForm<OptionsCalculatorFormValues>({
    resolver: zodResolver(optionsCalculatorSchema),
  });

  // Update last refresh time when data changes
  useEffect(() => {
    if ((callOptions.length > 0 || putOptions.length > 0) && !isLoading) {
      setLastRefreshTime(new Date());
      setShowResults(true);
      setIsRefreshing(false);
      setWasSubmitted(false);
    }
  }, [callOptions, putOptions, isLoading]);

  // Handle manual refresh button click
  const handleRefresh = async () => {
    if (!symbol || !expirationDate || isRefreshing) return;
    setWasSubmitted(false); 
    setIsRefreshing(true);
    await mutate();
    await mutateTiers();
  };

  // Submit handler
  async function onSubmit(data: OptionsCalculatorFormValues) {
    if (!isMarketOpen()) {
      toast.warning("The market is currently closed.");
      return;
    }

    // Prevent duplicate submissions
    if (isLoading) return;

    // Only update if values changed
    const symbolChanged = symbol !== data.symbol;
    const dateChanged = !expirationDate || expirationDate.getTime() !== data.expirationDate.getTime();
    
    if (symbolChanged) {
      setSymbol(data.symbol);
    }
    if (dateChanged) {
      setExpirationDate(data.expirationDate);
    }
    
    // Only show loading indicators on new searches
    if (symbolChanged || dateChanged) {
     
      setShowResults(false);
      setWasSubmitted(true);
      // Initial fetch with no auto-refresh
      setRefreshInterval(0);
      
      // Manually trigger a fetch
      await mutate();
      await mutateTiers();
      toast.success(
        `Loading option chain for ${data.symbol} expiring on ${format(data.expirationDate, "PP")}`
      );
    }
  }

 
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
                {isLoading && !showResults ? (
                  <>
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    Loading Option Chain...
                  </>
                ) : !marketIsOpen ? (
                  <>Waiting for market to open...</>
                ) : (
                  "View Option Chain"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {!marketIsOpen && <MarketClosedMessage />}
      
      <TiersSection 
        tiers={tiers}
        tiersLoading={tiersLoading}
        tiersError={tiersError}
        symbol={symbol}
        expirationDate={expirationDate}
      />
      
      
      <ResultsSection 
        showResults={showResults}
        error={isError}
        isLoading={isLoading}
        lastRefreshTime={lastRefreshTime}
        setRefreshInterval={setRefreshInterval}
        handleRefresh={handleRefresh}
        callOptions={callOptions}
        putOptions={putOptions}
        symbol={form.getValues("symbol")}
        expiryDate={form.getValues("expirationDate")}
        underlyingPrice={underlyingPrice}
        wasSubmitted={wasSubmitted}
      />
    </div>
  );
}
