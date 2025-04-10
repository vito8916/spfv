import AutoRefreshMenu from "@/components/dashboard/shared/auto-refresh-menu";
import { ScreenerDataTable } from "@/components/dashboard/screener/data-table";
import { columns } from "@/components/dashboard/screener/columns";
import { getSpfvTop } from "@/utils/spfv/getSpfvTop";
import { Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const revalidate = 5;

function ScreenerSkeleton() {
  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="flex justify-between">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-8 w-[100px]" />
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}

export default async function StockScreener() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center pb-2 border-b">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stock Screener</h1>
          <p className="text-muted-foreground mt-1">
            Find and analyze options with potential based on SPFV metrics.
          </p>
        </div>
        <AutoRefreshMenu />
      </div>
      
      <Suspense fallback={<ScreenerSkeleton />}>
        <ScreenerContent />
      </Suspense>
    </div>
  );
}

async function ScreenerContent() {
  const data = await getSpfvTop();
  
  return <ScreenerDataTable columns={columns} data={data} />;
}
