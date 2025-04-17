import React from "react";
import { OptionsResultsTable } from "../options-results-table";
import ChainTableSkeleton from "@/components/skeletons/chain-table-skeleton";
// Define the SPFVData interface
interface SPFVData {
  spfv: {
    milliseconds: number;
    spfv: number;
    symbol: string;
    callPutIndicator: string;
    tte: number;
    strikeDiff: number;
    expiration: string;
    currentUnderlyingPrice: number;
  };
}

// Use the correct OptionData type
interface OptionData {
  strikePrice: number;
  bid: number;
  ask: number;
  mid: number;
  volatility: number; // IV
  prevClose?: number; // Used to calculate change
  last?: number; // Current price, used to calculate change
  spfv?: number;
  spfvData?: SPFVData;
}

interface ResultsSectionProps {
  showResults: boolean;
  error: boolean;
  isLoading: boolean;
  callOptions: OptionData[];
  putOptions: OptionData[];
  symbol?: string;
  expiryDate?: Date;
  underlyingPrice?: number;
  wasSubmitted: boolean;
}

export function ResultsSection({
  showResults,
  error,
  isLoading,
  callOptions,
  putOptions,
  symbol,
  expiryDate,
  underlyingPrice,
}: ResultsSectionProps) {
  if (isLoading) {
    return <ChainTableSkeleton />;
  }

  if (error) {
    return (
      <div className="p-4 border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20 rounded">
        <p className="text-red-700 dark:text-red-400">
          Error loading option chain. Please try again or select a different
          symbol/expiration.
        </p>
      </div>
    );
  }

  if (showResults) {
    return (
      <>
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Options with SPFV Values</h2>
        </div>

        <OptionsResultsTable
          callOptions={callOptions}
          putOptions={putOptions}
          symbol={symbol || ""}
          expiryDate={expiryDate}
            underlyingPrice={underlyingPrice || 0}
            wasSubmitted={false}
        />

      </>
    );
  }

  return null;
}

export default ResultsSection;
