"use client"

import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useEffect, useRef } from "react"

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
}

export function OptionsResultsTable({ callOptions, putOptions, symbol, expiryDate, underlyingPrice }: OptionsResultsTableProps) {
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
      
      if (tableRows.length > 0 && tableRows[closestIndex]) {
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
  }, [sortedStrikes, underlyingPrice, callOptions, putOptions]);

  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <CardTitle className="text-xl">
              {symbol} Option Chain
            </CardTitle>
            <CardDescription className="font-bold">
              {expiryDate ? `Expiring ${format(expiryDate, "MMMM d, yyyy")}` : ""}
              {underlyingPrice ? ` • Stock Price: $${underlyingPrice.toFixed(2)}` : ""}
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
              <thead className="sticky top-0 z-10 bg-background border-b">
                <tr className="border-b transition-colors hover:bg-transparent">
                  <th colSpan={6} className="h-12 px-4 text-center bg-muted/30 align-middle font-medium text-muted-foreground">
                    Calls
                  </th>
                  <th rowSpan={2} className="h-12 px-4 text-center bg-primary/10 align-middle font-medium w-[100px]">
                    Strike
                  </th>
                  <th colSpan={6} className="h-12 px-4 text-center bg-muted/30 align-middle font-medium text-muted-foreground">
                    Puts
                  </th>
                </tr>
                <tr className="border-b transition-colors hover:bg-transparent">
                  {/* Call columns */}
                  <th className="h-12 px-4 text-center bg-muted/30 align-middle font-medium text-muted-foreground w-[90px]">IV</th>
                  <th className="h-12 px-4 text-center bg-muted/30 align-middle font-medium text-muted-foreground w-[90px]">CHNG</th>
                  <th className="h-12 px-4 text-center bg-muted/30 align-middle font-medium text-muted-foreground w-[90px]">BID</th>
                  <th className="h-12 px-4 text-center bg-muted/30 align-middle font-medium text-muted-foreground w-[90px]">ASK</th>
                  <th className="h-12 px-4 text-center bg-muted/30 align-middle font-medium text-muted-foreground w-[90px]">LAST</th>
                  <th className="h-12 px-4 text-center bg-muted/30 align-middle font-medium text-muted-foreground w-[90px] ">SPFV</th>
                  {/* Strike is in the middle */}
                  {/* Put columns - match same order as in the data rows */}
                  <th className="h-12 px-4 text-center bg-muted/30 align-middle font-medium text-muted-foreground w-[90px] ">SPFV</th>
                  <th className="h-12 px-4 text-center bg-muted/30 align-middle font-medium text-muted-foreground w-[90px]">LAST</th>
                  <th className="h-12 px-4 text-center bg-muted/30 align-middle font-medium text-muted-foreground w-[90px]">BID</th>
                  <th className="h-12 px-4 text-center bg-muted/30 align-middle font-medium text-muted-foreground w-[90px]">ASK</th>
                  <th className="h-12 px-4 text-center bg-muted/30 align-middle font-medium text-muted-foreground w-[90px]">CHNG</th>
                  <th className="h-12 px-4 text-center bg-muted/30 align-middle font-medium text-muted-foreground w-[90px]">IV</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {sortedStrikes.map((strike, index) => {
                  const callOption = callOptions.find(option => option.strikePrice === strike) || {
                    strikePrice: strike,
                    bid: 0,
                    ask: 0,
                    volatility: 0,
                    last: 0,
                    prevClose: 0,
                    spfvData: undefined
                  };
                  
                  const putOption = putOptions.find(option => option.strikePrice === strike) || {
                    strikePrice: strike,
                    bid: 0,
                    ask: 0,
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
                        index % 2 === 0 ? "bg-muted/20" : "",
                        hasAnySPFV ? "bg-blue-50/20" : ""
                      )}
                    >
                      {/* Call side */}
                      <td className={cn(
                        "p-4 align-middle text-center",
                        isCallInTheMoney ? "bg-primary/10" : ""
                      )}>
                        {callOption.volatility ? `${(callOption.volatility * 100).toFixed(2)}%` : "-"}
                      </td>
                      <td className={cn(
                        "p-4 align-middle text-center",
                        isCallInTheMoney ? "bg-primary/10" : "",
                        callChange > 0 ? "text-green-600" : callChange < 0 ? "text-red-600" : ""
                      )}>
                        {callChange !== 0 ? callChange.toFixed(2) : "-"}
                      </td>
                      <td className={cn(
                        "p-4 align-middle text-center",
                        isCallInTheMoney ? "bg-primary/10" : ""
                      )}>
                        {callOption.bid ? callOption.bid.toFixed(2) : "-"}
                      </td>
                      <td className={cn(
                        "p-4 align-middle text-center",
                        isCallInTheMoney ? "bg-primary/10" : ""
                      )}>
                        {callOption.ask ? callOption.ask.toFixed(2) : "-"}
                      </td>
                      <td className={cn(
                        "p-4 align-middle text-center",
                        isCallInTheMoney ? "bg-primary/10" : ""
                      )}>
                        {callOption.last ? callOption.last.toFixed(2) : "-"}
                      </td>
                      <td className={cn(
                        "p-4 align-middle text-center font-medium",
                        isCallInTheMoney ? "bg-primary/10" : "",
                        callSPFV ? "text-blue-600 bg-blue-50/50" : ""
                      )}>
                        {callSPFV ? 
                          (typeof callSPFV === 'number' ? 
                            callSPFV.toFixed(3) : 
                            String(callSPFV)
                          ) : "-"}
                      </td>
                      
                      {/* Strike price (middle column) */}
                      <td className={cn(
                        "p-4 align-middle text-center font-bold",
                        "bg-gray-100", 
                        isCurrentPrice ? "bg-yellow-100  outline-1 outline-yellow-400" : ""
                      )}>
                        {strike.toFixed(2)}
                        {isCurrentPrice && <span className="block text-xs font-normal text-gray-600">Current</span>}
                      </td>
                      
                      {/* Put side */}
                      <td className={cn(
                        "p-4 align-middle text-center font-medium",
                        isPutInTheMoney ? "bg-primary/10" : "",
                        putSPFV ? "text-blue-600 bg-blue-50/50" : ""
                      )}>
                        {putSPFV ? 
                          (typeof putSPFV === 'number' ? 
                            putSPFV.toFixed(3) : 
                            String(putSPFV)
                          ) : "-"}
                      </td>
                      <td className={cn(
                        "p-4 align-middle text-center",
                        isPutInTheMoney ? "bg-primary/10" : ""
                      )}>
                        {putOption.last ? putOption.last.toFixed(2) : "-"}
                      </td>
                      <td className={cn(
                        "p-4 align-middle text-center",
                        isPutInTheMoney ? "bg-primary/10" : ""
                      )}>
                        {putOption.bid ? putOption.bid.toFixed(2) : "-"}
                      </td>
                      <td className={cn(
                        "p-4 align-middle text-center",
                        isPutInTheMoney ? "bg-primary/10" : ""
                      )}>
                        {putOption.ask ? putOption.ask.toFixed(2) : "-"}
                      </td>
                      <td className={cn(
                        "p-4 align-middle text-center",
                        isPutInTheMoney ? "bg-primary/10" : "",
                        putChange > 0 ? "text-green-600" : putChange < 0 ? "text-red-600" : ""
                      )}>
                        {putChange !== 0 ? putChange.toFixed(2) : "-"}
                      </td>
                      <td className={cn(
                        "p-4 align-middle text-center",
                        isPutInTheMoney ? "bg-primary/10" : ""
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

