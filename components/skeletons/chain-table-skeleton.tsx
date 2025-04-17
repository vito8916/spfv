import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export default function ChainTableSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-4 px-4">
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-4">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-3 w-[300px]" />
          </div>
          <div className="flex gap-4 items-center">
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-3 w-[150px]" />
          </div>
        </div>
      </div>
      <Card>
        <div className="space-y-4 px-4">
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-4">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-3 w-[300px]" />
            </div>
            <div className="flex gap-4">
            <Skeleton className="h-4 w-[100px] bg-blue-500/20 dark:bg-blue-400/20" />                  
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-[100px]" />
            </div>
          </div>
          <hr className="my-4" />
          <div className="flex flex-row justify-between items-center gap-4">
            <div className="space-y-4 w-full">
              <div className="grid grid-cols-6 gap-4 w-full">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
              </div>
              <div className="grid grid-cols-6 gap-4 w-full">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
              </div>
              <div className="grid grid-cols-6 gap-4 w-full">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
              </div>
            </div>
            <div className="grid gap-4 w-[200px]">
              <Skeleton className="h-[100px] w-[200px]" />
            </div>
            <div className="space-y-4 w-full">
              <div className="grid grid-cols-6 gap-4 w-full">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
              </div>
              <div className="grid grid-cols-6 gap-4 w-full">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
              </div>
              <div className="grid grid-cols-6 gap-4 w-full">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
              </div>
            </div>
          </div>
          <hr className="my-4" />
          <div className="flex justify-between">
            <Skeleton className="h-4  w-[200px]" />
            <Skeleton className="h-4 w-[100px]" />
          </div>
        </div>
      </Card>
    </div>
  );
}
