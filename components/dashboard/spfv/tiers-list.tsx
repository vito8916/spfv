"use client";

import React from "react";
import { TierCard } from "./tier-card";
import { format } from "date-fns";
import { AlertCircle } from "lucide-react";

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

interface TiersListProps {
  tiers: TierData[] | null;
  symbol: string | undefined;
  expiration: Date | undefined;
  tiersError: boolean;
}

export default function TiersList({ tiers, symbol, expiration, tiersError }: TiersListProps) {
  // Display empty state
  if (!tiers || tiers.length === 0 || tiersError) {
    return (
      <div className="rounded-md p-4 border border-yellow-200 bg-yellow-50 text-yellow-800">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          <h5 className="font-medium">No Data</h5>
        </div>
        <p className="mt-2 text-sm">
          No tier data is available for this selection.
        </p>
      </div>
    );
  }

  // Filter out tiers with null callOption or putOption
  const validTiers = tiers.filter(
    tier => tier.callOption !== null && tier.putOption !== null
  );

  if (validTiers.length === 0) {
    return (
      <div className="rounded-md p-4 border border-yellow-200 bg-yellow-50 text-yellow-800">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          <h5 className="font-medium">No Valid Data</h5>
        </div>
        <p className="mt-2 text-sm">
          No valid tier data is available for this selection.
        </p>
      </div>
    );
  }

  // Display data
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">
        Top Strategy Tiers for {symbol} - Expiring{" "}
        {expiration ? format(expiration, "PP") : ""}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {validTiers.map((tier, index) => (
          <TierCard
            key={index}
            tier={index + 1}
            ratio={tier.ratio}
            callStrike={tier.callOption?.strike ?? 0}
            callMidpoint={tier.callOption?.midpoint ?? 0}
            putStrike={tier.putOption?.strike ?? 0}
            putMidpoint={tier.putOption?.midpoint ?? 0}
          />
        ))}
      </div>
    </div> 
  );
}
