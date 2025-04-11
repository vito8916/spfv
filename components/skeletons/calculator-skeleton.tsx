import React from "react";
import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { CardContent } from "../ui/card";

export default function CalculatorSkeleton() {
  return (
    <div className="container mx-auto py-10 px-4">
      <Card>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-3 w-[280px]" />
          </div>
          <div className="flex flex-row gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div>
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
