import React from 'react'
import { Card } from '../ui/card'
import { Skeleton } from '../ui/skeleton'
import { CardContent } from '../ui/card'

export default function CalculatorSkeleton() {
  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="space-y-6">
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-8 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>
    </div>
  )
}
