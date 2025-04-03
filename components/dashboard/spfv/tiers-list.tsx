"use client";

import React, { useEffect, useState } from "react";
import { TierCard } from "./tier-card";
import { getTiers } from "@/utils/spfv/getTiers";
import { format } from "date-fns";
import { AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface TiersListProps {
  symbol: string | undefined;
  expiration: Date | undefined;
}

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

// La estructura de la respuesta API es un objeto con keys tier1, tier2, etc.
interface TiersResponse {
  [key: string]: TierData;
}

export default function TiersList({ symbol, expiration }: TiersListProps) {
  const [tiers, setTiers] = useState<TierData[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTiers = async () => {
      if (!symbol || !expiration) {
        setError("Symbol and expiration date are required");
        return;
      }

      // Format as YYYYMMDD, which is the correct format for the updown API
      const formattedDate = format(expiration, "yyyyMMdd");
      
      try {
        setLoading(true);
        setError(null);
        const data = await getTiers(symbol, formattedDate);
        console.log("DATA:::::::::", data);
        
        if (!data) {
          setError("No tier data available for this selection");
          setTiers(null);
          return;
        }

        // Convertir la respuesta de objeto a array para poder iterarla
        const tiersData = Object.values(data as TiersResponse);
        
        if (tiersData.length === 0) {
          setError("No tier data available for this selection");
          setTiers(null);
        } else {
          console.log("Processed tiers data:", tiersData);
          setTiers(tiersData);
        }
      } catch (err) {
        console.error("Error fetching tiers:", err);
        setError("Failed to load tier data. Please try again.");
        setTiers(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTiers();
  }, [symbol, expiration]);

  if (loading) {
    return (
      <div className="space-y-6">
      <h3 className="text-lg font-medium">Loading Strategy Tiers...</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-6 w-12" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md p-4 border border-red-200 bg-red-50 text-red-800">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          <h5 className="font-medium">Error</h5>
        </div>
        <p className="mt-2 text-sm">{error}</p>
      </div>
    );
  }

  if (!tiers || tiers.length === 0) {
    return (
      <div className="rounded-md p-4 border border-yellow-200 bg-yellow-50 text-yellow-800">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          <h5 className="font-medium">No Data</h5>
        </div>
        <p className="mt-2 text-sm">No tier data is available for this selection.</p>
      </div>
    );
  }

  // Filtrar tiers inválidos (donde callOption o putOption son null)
  const validTiers = tiers.filter(tier => 
    tier.callOption !== null && 
    tier.putOption !== null &&
    tier.higherComponent !== 'Error/Unavailable'
  );

  // Si no hay tiers válidos después de filtrar
  if (validTiers.length === 0) {
    return (
      <div className="rounded-md p-4 border border-yellow-200 bg-yellow-50 text-yellow-800">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          <h5 className="font-medium">No Valid Data</h5>
        </div>
        <p className="mt-2 text-sm">No valid tier data is available for this selection.</p>
      </div>
    );
  }

  // Ordenar tiers por ratio (de mayor a menor)
  const sortedTiers = [...validTiers].sort((a, b) => b.ratio - a.ratio);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">
        Top Strategy Tiers for {symbol} - Expiring {expiration ? format(expiration, "PP") : ""}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedTiers.map((tier, index) => {
          return (
            <TierCard 
              key={index} 
              ratio={tier.ratio} 
              callStrike={tier.callOption!.strike} 
              callMidpoint={tier.callOption!.midpoint} 
              putStrike={tier.putOption!.strike} 
              putMidpoint={tier.putOption!.midpoint} 
            />
          );
        })}
      </div>
    </div>
  );
}
