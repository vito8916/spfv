import React from 'react'
import { Card, CardContent, CardHeader } from '../ui/card';
import { Skeleton } from '../ui/skeleton'

export default function QuestionnaireSkeleton() {  
  return (
    <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-96 mt-2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                </div>
              </CardContent>
            </Card>
      
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-96 mt-2" />
              </CardHeader>
              <CardContent className="space-y-6">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-24" />
                      <Skeleton className="h-6 w-24" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
      
            <Card>
              <CardContent>
                <div className="flex items-start space-x-3">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-4 w-96" />
                </div>
              </CardContent>
            </Card>
      
            <div className="flex justify-end">
              <Skeleton className="h-10 w-[200px]" />
            </div>
          </div>
  )
}
