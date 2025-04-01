import React from 'react'
import { Skeleton } from '../ui/skeleton'

export default function DashboardSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                <Skeleton className="aspect-video rounded-xl" />
                <Skeleton className="aspect-video rounded-xl" />
                <Skeleton className="aspect-video rounded-xl" />
            </div>
            <Skeleton className="h-[400px] flex-1 rounded-xl" />
            <div className="grid gap-4 md:grid-cols-2">
                <Skeleton className="h-[300px] rounded-xl" />
                <Skeleton className="h-[300px] rounded-xl" />
            </div>
        </div>
  )
}
