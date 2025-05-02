"use client";

import AutoRefreshMenu from "@/components/dashboard/shared/auto-refresh-menu";
import { ScreenerDataTable } from "@/components/dashboard/screener/data-table";
import { columns } from "@/components/dashboard/screener/columns";
import { Suspense, useState } from "react";
import ScreenerSkeleton from "@/components/skeletons/screener-skeleton";
import { useSpfvTop } from "@/hooks/useSpfvTop";
import ToggleType from "@/components/dashboard/screener/toggle-type";

export default function StockScreener() {
  const [refreshInterval, setRefreshInterval] = useState(0);
  const [selectedType, setSelectedType] = useState("dollar_pos");
  const { data, isLoading, isError, mutate } = useSpfvTop(
      selectedType,
      refreshInterval
  );

  console.log("refreshInterval", refreshInterval);
  console.log("selectedType", selectedType);
  console.log("data", data);
  console.log("isLoading", isLoading);
  console.log("isError", isError);

  const handleManualRefresh = () => {
    mutate(); // Manually trigger a revalidation of the data
  };

  return (
      <div className="space-y-6 p-6">
        <div className="flex justify-between gap-4 items-center md:items-center pb-2 border-b">
          <div>
            <h1 className="text-xl md:text-3xl font-bold tracking-tight">Stock Screener</h1>
            <p className="hidden md:block text-muted-foreground mt-1">
              Find and analyze options with potential based on SPFV metrics.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <AutoRefreshMenu
                onRefreshIntervalChange={setRefreshInterval}
                onManualRefresh={handleManualRefresh}
            />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="w-full overflow-x-auto">
            <ToggleType
                selectedValue={selectedType}
                onValueChange={setSelectedType}
            />
          </div>
          {isError && <div className="text-red-500">Error loading data</div>}
          <Suspense fallback={<ScreenerSkeleton />}>
            <ScreenerDataTable
                columns={columns}
                data={data}
                isLoading={isLoading}
            />
          </Suspense>
        </div>
      </div>
  );
}
