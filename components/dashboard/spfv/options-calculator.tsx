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
import { bankHoliday, isMarketOpen } from "@/utils/utils";
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
  // New state specifically for controlling table scrolling
  const [shouldScrollTable, setShouldScrollTable] = useState(false);

  // Use our custom hook to fetch and manage options chain data
  const { 
    callOptions, 
    putOptions, 
    underlyingPrice, 
    isLoading, 
    error, 
    mutate 
  } = useOptionsChain(symbol, expirationDate, refreshInterval);

  // Use our custom hook to fetch and manage tiers data
  const { 
    tiers, 
    isLoading: tiersLoading, 
    error: tiersError, 
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
      // Don't reset shouldScrollTable here so it stays true after form submission
    }
  }, [callOptions, putOptions, isLoading]);

  // Reset shouldScrollTable after scrolling has been applied and data has loaded
  useEffect(() => {
    if (shouldScrollTable && !isLoading && callOptions.length > 0 && putOptions.length > 0) {
      // Set a short timeout to ensure scrolling has been applied before resetting
      const timer = setTimeout(() => {
        setShouldScrollTable(false);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [shouldScrollTable, isLoading, callOptions.length, putOptions.length]);

  // Handle manual refresh button click
  const handleRefresh = async () => {
    if (!symbol || !expirationDate || isRefreshing) return;
    setShouldScrollTable(false); // Don't scroll on manual refresh
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
      
      // Initial fetch with no auto-refresh
      setRefreshInterval(0);
      setShouldScrollTable(true); // Enable scrolling on form submission
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
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-end">
                {/* Symbol */}
                <FormField
                  control={form.control}
                  name="symbol"
                  render={({ field }) => (
                    <FormItem className="lg:col-span-1">
                      <FormLabel>Symbol</FormLabel>
                      <SymbolsListSelect field={{
                        ...field,
                        onChange: (value: string) => {
                          setSymbol(value);
                          field.onChange(value);
                          // @ts-expect-error - This is a workaround to clear the expiration date
                          form.setValue("expirationDate", null);
                          // @ts-expect-error - This is a workaround to clear the expiration date
                          setExpirationDate(null);
                        }
                      }} />
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
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);
                              if(symbol?.includes("SPY") || symbol?.includes("QQQ") || symbol?.includes("IWM") || symbol?.includes("NDX")) {
                                return dayOfWeek === 0 || 
                                dayOfWeek === 6 || 
                                date < today || bankHoliday(date);
                              } 
                              return dayOfWeek !== 5 || date < today || bankHoliday(date);
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
              </div>
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
        error={error}
        isLoading={isLoading}
        lastRefreshTime={lastRefreshTime}
        setRefreshInterval={setRefreshInterval}
        handleRefresh={handleRefresh}
        callOptions={callOptions}
        putOptions={putOptions}
        symbol={form.getValues("symbol")}
        expiryDate={form.getValues("expirationDate")}
        underlyingPrice={underlyingPrice}
        wasSubmitted={shouldScrollTable}
      />
    </div>
  );
}
