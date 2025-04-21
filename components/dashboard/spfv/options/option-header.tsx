"use client";

import { Separator } from "@/components/ui/separator";
import { SymbolSelectorSkeleton } from "@/components/dashboard/spfv/options/symbol-selector";
import { SymbolSelector } from "@/components/dashboard/spfv/options/symbol-selector";
import React, { Suspense, useMemo, useState } from "react";
import AutoRefreshMenu from "@/components/dashboard/shared/auto-refresh-menu";
import {
  OptionTypeSelectorRadio,
  OptionTypeSelectorSkeleton,
} from "@/components/dashboard/spfv/options/option-type-selector-radio";
import { HorizontalDatePicker, HorizontalDatePickerSkeleton } from "@/components/dashboard/shared/horizontal-date-picker";
import { format } from "date-fns";
import { toast } from "sonner";
import OptionsContent from "@/components/dashboard/spfv/options/options-content";
import { isMarketOpen } from "@/utils/utils";
import MarketClosedMessage from "@/components/dashboard/spfv/calculator/MarketClosedMessage";
import ATRLineGraph from "@/components/dashboard/spfv/options/atr-line-graph";
import { useSWRConfig } from "swr";
import SPFVBeast from "../spfv-beast";


export default function HeaderOptions() {
  const { mutate: globalMutate } = useSWRConfig();

  const marketIsOpen = useMemo(() => isMarketOpen(), []);
  const [selectedOptionType, setSelectedOptionType] = useState<string>("chain");
  const [selectedSymbol, setSelectedSymbol] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [refreshInterval, setRefreshInterval] = useState<number>(0); // 0 seconds default

  const handleDateSelect = (date: Date) => {
    if(marketIsOpen) {
      setSelectedDate(date);
      globalMutate(
        (key) => typeof key === 'string' && 
          (key.includes('/api/spfv/get-tiers') || 
           key.includes('/api/spfv/get-filtered-chain') || 
           key.includes('/api/spfv/get-last-price-info')),
        undefined,
        { revalidate: true }
      );
      toast.success(`Selected date: ${format(date, "PP")}`);
    } else {
      toast.error("Market is closed");
    }
  };

  const handleSymbolSelect = (symbol: string) => {
    if(marketIsOpen) {
      setSelectedSymbol(symbol);
      globalMutate(
        (key) => typeof key === 'string' && 
          (key.includes('/api/spfv/get-tiers') || 
           key.includes('/api/spfv/get-filtered-chain') || 
           key.includes('/api/spfv/get-last-price-info')),
        undefined,
        { revalidate: true }
      );
    } else {
      toast.error("Market is closed");
    }
  };

  const handleOptionTypeSelect = (optionType: string) => {
    if(marketIsOpen) {
      setSelectedOptionType(optionType);
      globalMutate(
        (key) => typeof key === 'string' && 
          (key.includes('/api/spfv/get-tiers') || 
           key.includes('/api/spfv/get-filtered-chain') || 
           key.includes('/api/spfv/get-last-price-info')),
        undefined,
        { revalidate: true }
      );
    } else {
      toast.error("Market is closed");
    }
  };

  const handleRefreshIntervalChange = (interval: number) => {
    setRefreshInterval(interval);
  };

  const handleManualRefresh = () => {
    // Trigger manual refresh (will be handled by the child components)
    if(marketIsOpen) {
      toast.success("Refreshing data...");
      globalMutate(
        (key) => typeof key === 'string' && 
          (key.includes('/api/spfv/get-tiers') || 
           key.includes('/api/spfv/get-filtered-chain') || 
           key.includes('/api/spfv/get-last-price-info')),
        undefined,
        { revalidate: true }
      );
    } else {
      toast.error("Market is closed");
    }
  };

  return (
    <div className="space-y-4 w-full">
      <div className="flex gap-x-4 justify-between w-full">
        <div className="flex gap-x-4 items-center">
          <Suspense fallback={<SymbolSelectorSkeleton />}>
            <SymbolSelector onSymbolSelect={handleSymbolSelect} />
          </Suspense>
          <Separator className="my-4" orientation="vertical" />
          <Suspense fallback={<OptionTypeSelectorSkeleton />}>
            <OptionTypeSelectorRadio onOptionTypeSelect={handleOptionTypeSelect} />
          </Suspense>
        </div>
        <AutoRefreshMenu
          onRefreshIntervalChange={handleRefreshIntervalChange}
          onManualRefresh={handleManualRefresh}
        />
      </div>
      <Suspense fallback={<HorizontalDatePickerSkeleton />}>
        <HorizontalDatePicker
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
          startDate={new Date()}
          daysToShow={50}
          disabled={(date) => {
            const dayOfWeek = date.getDay();
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if(selectedSymbol?.includes("SPY") || selectedSymbol?.includes("QQQ") || selectedSymbol?.includes("IWM") || selectedSymbol?.includes("NDX") || selectedSymbol?.includes("SPX")) {
              return dayOfWeek === 0 || 
              dayOfWeek === 6 || 
              date < today;
            } 
            return dayOfWeek !== 5 || date < today;
          }}
        />
      </Suspense>

      {!marketIsOpen && <MarketClosedMessage />}

      {/* Show OptionsContent only when both symbol and date are selected */}
      {
        (!selectedSymbol || selectedDate === undefined) && (
          <div className="flex justify-center items-center h-full mt-10">
            <p className="text-gray-500">Please select a symbol and date to continue</p>
          </div>
        )
      }
      {selectedSymbol && selectedDate && (
        <>
          {selectedOptionType === "chain" && (
            <OptionsContent 
              symbol={selectedSymbol} 
              expirationDate={selectedDate} 
              refreshInterval={refreshInterval}
            />
          )}
          {selectedOptionType === "atr" && (
              <ATRLineGraph 
                symbol={selectedSymbol}
                refreshInterval={refreshInterval}
              />
          )}
          {selectedOptionType === "beast" && (
            <SPFVBeast 
              symbol={selectedSymbol} 
              expirationDate={selectedDate} 
              refreshInterval={refreshInterval}
            />
          )}
        </>
      )}
    </div>
  );
}
