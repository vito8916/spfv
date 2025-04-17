'use client'

import React from 'react'
import { TiersSection } from '../calculator/TiersSection'
import { useTiers } from '@/hooks/useTiers'
import { useOptionsChain } from '@/hooks/useOptionsChain'
import ResultsSection from '../calculator/ResultsSection'

interface OptionsContentProps {
  symbol: string;
  expirationDate: Date;
  refreshInterval: number;
}

export default function OptionsContent({ symbol, expirationDate, refreshInterval }: OptionsContentProps) {

// Use our custom hook to fetch and manage options chain data
  const { 
    callOptions, 
    putOptions, 
    underlyingPrice,
     isLoading, 
     error, 
     //mutate: mutateOptions
  } = useOptionsChain(symbol, expirationDate, refreshInterval);

    // Use our custom hook to fetch and manage tiers data
  const { 
    tiers, 
    isLoading: tiersLoading, 
    error: tiersError,
    //mutate: mutateTiers
  } = useTiers(symbol, expirationDate, refreshInterval);



  return (
    <div className="space-y-4">
      
      <TiersSection 
        tiers={tiers}
        tiersLoading={tiersLoading}
        tiersError={tiersError}
        symbol={symbol}
        expirationDate={expirationDate}
      />
      <ResultsSection
        showResults={!isLoading}
        error={error}
        isLoading={isLoading}
        callOptions={callOptions}
        putOptions={putOptions}
        symbol={symbol}
        expiryDate={expirationDate}
        underlyingPrice={underlyingPrice || 0}
        wasSubmitted={false}
      />
    </div>
  )
}
