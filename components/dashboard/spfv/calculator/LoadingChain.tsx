import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface LoadingChainProps {
  isLoading: boolean;
  showResults: boolean;
}

export function LoadingChain({ isLoading, showResults }: LoadingChainProps) {
  if (isLoading && !showResults) {
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-medium">Loading Option Chain...</h3>
        <div className="grid grid-cols-1 gap-4">
          <div className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default LoadingChain; 