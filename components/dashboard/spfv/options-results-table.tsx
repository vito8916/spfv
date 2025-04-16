"use client"

import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useEffect, useRef } from "react"
import { useLastPriceInfo } from "@/hooks/useLastPriceInfo"

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

interface OptionsResultsTableProps {
  callOptions: OptionData[];
  putOptions: OptionData[];
  symbol: string;
  expiryDate?: Date;
  underlyingPrice: number;
  wasSubmitted?: boolean;
}

export function OptionsResultsTable({ callOptions, putOptions, symbol, expiryDate, underlyingPrice, wasSubmitted }: OptionsResultsTableProps) {
  // Add a ref for the table container
  const tableContainerRef = useRef<HTMLDivElement>(null)
  
  // Helper function to calculate price change
  const calculateChange = (current: number, previous: number) => {
    if (!current || !previous) return 0;
    return current - previous;
  };

  // Create a collection of all available strike prices
  const allStrikePrices = new Set<number>([
    ...callOptions.map(option => option.strikePrice),
    ...putOptions.map(option => option.strikePrice)
  ]);

  // Sort strikes by strike price
  const sortedStrikes = Array.from(allStrikePrices).sort((a, b) => a - b);

  // Count how many options have SPFV data
  const callsWithSPFV = callOptions.filter(option => option.spfvData?.spfv?.spfv).length;
  const putsWithSPFV = putOptions.filter(option => option.spfvData?.spfv?.spfv).length;
  
  // Calculate how many unique strikes have at least one side (call or put) with SPFV data
  const strikesWithSPFVData = new Set([
    ...callOptions.filter(option => option.spfvData?.spfv?.spfv).map(option => option.strikePrice),
    ...putOptions.filter(option => option.spfvData?.spfv?.spfv).map(option => option.strikePrice)
  ]);

    // Use our custom hook to fetch and manage last price info
    const endDate = expiryDate ? format(expiryDate, 'yyyyMMdd') : undefined;
    const { 
      data: lastPriceInfo, 
    } = useLastPriceInfo(symbol, endDate, 3000);

  // Use effect to scroll to the current price when component is mounted or data changes
  useEffect(() => {
    if (tableContainerRef.current && sortedStrikes.length > 0 && underlyingPrice) {
      // Find the index of the strike closest to the current price
      let closestIndex = 0;
      let minDiff = Math.abs(sortedStrikes[0] - underlyingPrice);

      for (let i = 1; i < sortedStrikes.length; i++) {
        const diff = Math.abs(sortedStrikes[i] - underlyingPrice);
        if (diff < minDiff) {
          minDiff = diff;
          closestIndex = i;
        }
      }

      // Get all table rows
      const tableRows = tableContainerRef.current.querySelectorAll('tbody tr');
      
      if (tableRows.length > 0 && tableRows[closestIndex] && wasSubmitted) {
        // Calculate the scroll position to center the target row
        const targetRow = tableRows[closestIndex] as HTMLElement;
        const container = tableContainerRef.current;
        const containerHeight = container.clientHeight;
        const targetOffset = targetRow.offsetTop;
        
        // Set the scroll position to center the target row
        // Subtract half the container height to center it
        container.scrollTop = targetOffset - (containerHeight / 2) + (targetRow.clientHeight / 2);
      }
    }
  }, [sortedStrikes, underlyingPrice, callOptions, putOptions, wasSubmitted]);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <CardTitle className="text-xl">
              {symbol} Option Chain
            </CardTitle>
            <CardDescription className="font-bold">
              {expiryDate ? `Expiring ${format(expiryDate, "MMMM d, yyyy")}` : ""}
              {lastPriceInfo ? ` • Stock Price: $${lastPriceInfo.underlyingPrice.toFixed(2)}` : ""}
              {lastPriceInfo ? ` • Stock Price Change: $${lastPriceInfo.lastTradeAmountChange.toFixed(2)}` : ""}
              {lastPriceInfo ? ` • Stock Price Percent Change: $${lastPriceInfo.lastTradePercentChange.toFixed(2)}` : ""}
            </CardDescription>
          </div>
          <div className="flex flex-col md:flex-row gap-2">
            <Badge variant="outline" className="self-start md:self-auto">
              {sortedStrikes.length} strikes available
            </Badge>
            <Badge variant="outline" className="self-start md:self-auto">
              {strikesWithSPFVData.size} strikes with SPFV values
            </Badge>
            <Badge variant="default" className="self-start md:self-auto text-xs">
              {callsWithSPFV} calls • {putsWithSPFV} puts
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative rounded-md border">
          <div ref={tableContainerRef} className="overflow-auto max-h-[600px]">
            <table className="w-full caption-bottom text-sm">
              <thead className="sticky top-0 z-10 bg-background dark:bg-gray-950 border-b">
                <tr className="border-b transition-colors hover:bg-transparent">
                  <th colSpan={6} className="h-12 px-4 text-center bg-muted/30 dark:bg-gray-800/50 align-middle font-medium text-muted-foreground dark:text-gray-300">
                    Calls
                  </th>
                  <th rowSpan={2} className="h-12 px-4 text-center bg-gray-100 dark:bg-gray-800/50 align-middle font-medium w-[100px] dark:text-white">
                    Strike
                  </th>
                  <th colSpan={6} className="h-12 px-4 text-center bg-muted/30 dark:bg-gray-800/50 align-middle font-medium text-muted-foreground dark:text-gray-300">
                    Puts
                  </th>
                </tr>
                <tr className="border-b transition-colors hover:bg-transparent">
                  {/* Call columns */}
                  <th className="h-10 px-4 text-center bg-muted/30 dark:bg-gray-800/50 align-middle font-medium text-muted-foreground dark:text-gray-300 w-[90px]">IV</th>
                  <th className="h-10 px-4 text-center bg-muted/30 dark:bg-gray-800/50 align-middle font-medium text-muted-foreground dark:text-gray-300 w-[90px]">CHNG</th>
                  <th className="h-10 px-4 text-center bg-muted/30 dark:bg-gray-800/50 align-middle font-medium text-muted-foreground dark:text-gray-300 w-[90px]">BID</th>
                  <th className="h-10 px-4 text-center bg-muted/30 dark:bg-gray-800/50 align-middle font-medium text-muted-foreground dark:text-gray-300 w-[90px]">ASK</th>
                  <th className="h-10 px-4 text-center bg-muted/30 dark:bg-gray-800/50 align-middle font-medium text-muted-foreground dark:text-gray-300 w-[90px]">LAST</th>
                  <th className="h-10 px-4 text-center bg-muted/30 dark:bg-gray-800/50 align-middle font-medium text-muted-foreground dark:text-gray-300 w-[90px] ">SPFV</th>
                  {/* Strike is in the middle */}
                  {/* Put columns - match same order as in the data rows */}
                  <th className="h-10 px-4 text-center bg-muted/30 dark:bg-gray-800/50 align-middle font-medium text-muted-foreground dark:text-gray-300 w-[90px] ">SPFV</th>
                  <th className="h-10 px-4 text-center bg-muted/30 dark:bg-gray-800/50 align-middle font-medium text-muted-foreground dark:text-gray-300 w-[90px]">LAST</th>
                  <th className="h-10 px-4 text-center bg-muted/30 dark:bg-gray-800/50 align-middle font-medium text-muted-foreground dark:text-gray-300 w-[90px]">BID</th>
                  <th className="h-10 px-4 text-center bg-muted/30 dark:bg-gray-800/50 align-middle font-medium text-muted-foreground dark:text-gray-300 w-[90px]">ASK</th>
                  <th className="h-10 px-4 text-center bg-muted/30 dark:bg-gray-800/50 align-middle font-medium text-muted-foreground dark:text-gray-300 w-[90px]">CHNG</th>
                  <th className="h-10 px-4 text-center bg-muted/30 dark:bg-gray-800/50 align-middle font-medium text-muted-foreground dark:text-gray-300 w-[90px]">IV</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {sortedStrikes.map((strike, index) => {
                  const callOption = callOptions.find(option => option.strikePrice === strike) || {
                    strikePrice: strike,
                    bid: 0,
                    ask: 0,
                    mid: 0,
                    volatility: 0,
                    last: 0,
                    prevClose: 0,
                    spfvData: undefined
                  };
                  
                  const putOption = putOptions.find(option => option.strikePrice === strike) || {
                    strikePrice: strike,
                    bid: 0,
                    ask: 0,
                    mid: 0,
                    volatility: 0,
                    last: 0,
                    prevClose: 0,
                    spfvData: undefined
                  };
                  
                  const callChange = calculateChange(callOption.last || 0, callOption.prevClose || 0);
                  const putChange = calculateChange(putOption.last || 0, putOption.prevClose || 0);
                  
                  const isCallInTheMoney = strike < underlyingPrice;
                  const isPutInTheMoney = strike > underlyingPrice;
                  
                  // Get SPFV values directly from the spfvData object
                  const callSPFV = callOption.spfvData?.spfv?.spfv;
                  const putSPFV = putOption.spfvData?.spfv?.spfv;
                  
                  // Flag for highlighting rows with SPFV values
                  const hasAnySPFV = Boolean(callSPFV || putSPFV);
                  const isCurrentPrice = Math.abs(strike - underlyingPrice) < 0.01;
                  
                  return (
                    <tr 
                      key={strike} 
                      className={cn(
                        "border-b transition-colors",
                        index % 2 === 0 ? "bg-muted/20 dark:bg-gray-900/60" : "dark:bg-gray-950",
                        hasAnySPFV ? "bg-blue-50/20 dark:bg-blue-950/30" : ""
                      )}
                    >
                      {/* Call side */}
                      <td className={cn(
                        "px-4 py-1 align-middle text-center",
                        isCallInTheMoney ? "bg-primary/10 dark:bg-primary/20" : ""
                      )}>
                        {callOption.volatility ? `${(callOption.volatility * 100).toFixed(2)}%` : "-"}
                      </td>
                      <td className={cn(
                        "px-4 py-1 align-middle text-center",
                        isCallInTheMoney ? "bg-primary/10 dark:bg-primary/20" : "",
                        callChange > 0 ? "text-green-600 dark:text-green-400" : callChange < 0 ? "text-red-600 dark:text-red-400" : ""
                      )}>
                        {callChange !== 0 ? callChange.toFixed(2) : "-"}
                      </td>
                      <td className={cn(
                        "px-4 py-1 align-middle text-center",
                        isCallInTheMoney ? "bg-primary/10 dark:bg-primary/20" : ""
                      )}>
                        {callOption.bid ? callOption.bid.toFixed(2) : "-"}
                      </td>
                      <td className={cn(
                        "px-4 py-1 align-middle text-center",
                        isCallInTheMoney ? "bg-primary/10 dark:bg-primary/20" : ""
                      )}>
                        {callOption.ask ? callOption.ask.toFixed(2) : "-"}
                      </td>
                      
                      <td className={cn(
                        "px-4 py-1 align-middle text-center",
                        isCallInTheMoney ? "bg-primary/10 dark:bg-primary/20" : ""
                      )}>
                        {callOption.last ? callOption.last.toFixed(2) : "-"}
                      </td>
                      <td className={cn(
                        "px-4 py-1 align-middle text-center font-bold border-x border-primary dark:border-gray-600",
                        isCallInTheMoney ? "bg-primary/10 dark:bg-primary/20" : "",
                        callSPFV ? "text-primary dark:text-gray-100" : ""
                      )}>
                        {callSPFV ? 
                          (typeof callSPFV === 'number' ? 
                            callSPFV.toFixed(3) : 
                            String(callSPFV)
                          ) : "-"}
                      </td>
                      
                      {/* Strike price (middle column) */}
                      <td className={cn(
                        "px-4 py-1 align-middle text-center font-bold",
                        "bg-gray-100 dark:bg-gray-800", 
                        isCurrentPrice ? "bg-yellow-100 dark:bg-yellow-900/50 outline-1 outline-yellow-400 dark:outline-yellow-600" : ""
                      )}>
                        {strike.toFixed(2)}
                        {isCurrentPrice && <span className="block text-xs font-normal text-gray-600 dark:text-gray-400">Current</span>}
                      </td>
                      
                      {/* Put side */}
                      <td className={cn(
                        "px-4 py-1 align-middle text-center font-bold border-x border-primary dark:border-gray-600",
                        isPutInTheMoney ? "bg-primary/10 dark:bg-primary/20" : "",
                        putSPFV ? "text-primary dark:text-gray-100" : ""
                      )}>
                        {putSPFV ? 
                          (typeof putSPFV === 'number' ? 
                            putSPFV.toFixed(3) : 
                            String(putSPFV)
                          ) : "-"}
                      </td>
                      <td className={cn(
                        "px-4 py-1 align-middle text-center",
                        isPutInTheMoney ? "bg-primary/10 dark:bg-primary/20" : ""
                      )}>
                        {putOption.last ? putOption.last.toFixed(2) : "-"}
                      </td>
                      
                      <td className={cn(
                        "px-4 py-1 align-middle text-center",
                        isPutInTheMoney ? "bg-primary/10 dark:bg-primary/20" : ""
                      )}>
                        {putOption.bid ? putOption.bid.toFixed(2) : "-"}
                      </td>
                      <td className={cn(
                        "px-4 py-1 align-middle text-center",
                        isPutInTheMoney ? "bg-primary/10 dark:bg-primary/20" : ""
                      )}>
                        {putOption.ask ? putOption.ask.toFixed(2) : "-"}
                      </td>
                      <td className={cn(
                        "px-4 py-1 align-middle text-center",
                        isPutInTheMoney ? "bg-primary/10 dark:bg-primary/20" : "",
                        putChange > 0 ? "text-green-600 dark:text-green-400" : putChange < 0 ? "text-red-600 dark:text-red-400" : ""
                      )}>
                        {putChange !== 0 ? putChange.toFixed(2) : "-"}
                      </td>
                      <td className={cn(
                        "px-4 py-1 align-middle text-center",
                        isPutInTheMoney ? "bg-primary/10 dark:bg-primary/20" : ""
                      )}>
                        {putOption.volatility ? `${(putOption.volatility * 100).toFixed(2)}%` : "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

