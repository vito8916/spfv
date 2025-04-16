import React, { Suspense } from 'react';
import TiersCardsSkeleton from '@/components/skeletons/tiers-cards-skeleton';
import TiersList from '../tiers-list';

interface TierOption {
  strike: number;
  bid: number;
  ask: number;
  midpoint: number;
}

interface TierData {
  ratio: number;
  higherComponent?: string;
  callOption: TierOption | null;
  putOption: TierOption | null;
}

interface TiersSectionProps {
  tiers: TierData[] | null;
  tiersLoading: boolean;
  tiersError: boolean;
  symbol?: string;
  expirationDate?: Date;
}

export function TiersSection({
  tiers,
  tiersLoading,
  tiersError,
  symbol,
  expirationDate,
}: TiersSectionProps) {
  if (tiersLoading) {
    return <TiersCardsSkeleton />;
  }

  if (tiersError) {
    console.log("tiersError", tiersError);
    return (
      <div className="p-4 border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20 rounded">
        <p className="text-red-700 dark:text-red-400">
          Error loading Multi value live data. Please try again or select a different symbol/expiration.
        </p>
      </div>
    );
  }

  if (tiers) {
    return (
      <Suspense fallback={<TiersCardsSkeleton />}>
        <TiersList tiers={tiers} symbol={symbol} expiration={expirationDate} tiersError={tiersError}/>
      </Suspense>
    );
  }

  return null;
}

export default TiersSection; 