"use client"

import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
interface OptionData {
  strikePrice: number;
  bid: number;
  ask: number;
  volatility: number; // IV
  prevClose?: number; // Used to calculate change
  last?: number; // Current price, used to calculate change
  spfv?: number;
  spfvData?: {
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
  };
}

interface OptionsResultsTableProps {
  callOptions: OptionData[];
  putOptions: OptionData[];
  symbol: string;
  expiryDate?: Date;
  underlyingPrice: number;
}

export function OptionsResultsTable({ callOptions, putOptions, symbol, expiryDate, underlyingPrice }: OptionsResultsTableProps) {
  // Helper function to calculate price change
  const calculateChange = (current: number, previous: number) => {
    if (!current || !previous) return 0;
    return current - previous;
  };

  // Sort options by strike price
  const sortedStrikes = Array.from(
    new Set([
      ...callOptions.map(option => option.strikePrice),
      ...putOptions.map(option => option.strikePrice)
    ])
  ).sort((a, b) => a - b); // Sort from lowest to highest


  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <CardTitle className="text-xl">
              {symbol} Option Chain
            </CardTitle>
            <CardDescription>
              {expiryDate ? `Expiring ${format(expiryDate, "MMMM d, yyyy")}` : ""}
              {underlyingPrice ? ` • Stock Price: $${underlyingPrice.toFixed(2)}` : ""}
            </CardDescription>
          </div>
          <Badge variant="outline" className="self-start md:self-auto">
            {sortedStrikes.length} strikes available
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative rounded-md border">
          <div className="overflow-auto max-h-[600px]">
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
                  <th className="h-12 px-4 text-center bg-muted/30 align-middle font-medium text-muted-foreground w-[90px]">SPFV</th>
                  {/* Strike is in the middle */}
                  {/* Put columns - match same order as in the data rows */}
                  <th className="h-12 px-4 text-center bg-muted/30 align-middle font-medium text-muted-foreground w-[90px]">SPFV</th>
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
                  
                  return (
                    <tr 
                      key={strike} 
                      className={cn(
                        "border-b transition-colors",
                        index % 2 === 0 ? "bg-muted/20" : ""
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
                        callOption.spfvData?.spfv?.spfv ? "text-blue-600" : ""
                      )}>
                        {callOption.spfvData?.spfv?.spfv ? 
                          (typeof callOption.spfvData.spfv.spfv === 'number' ? 
                            callOption.spfvData.spfv.spfv.toFixed(2) : 
                            String(callOption.spfvData.spfv.spfv)
                          ) : "-"}
                      </td>
                      
                      {/* Strike price (middle column) */}
                      <td className="p-4 align-middle text-center font-bold bg-gray-100">
                        {strike.toFixed(2)}
                      </td>
                      
                      {/* Put side */}
                      <td className={cn(
                        "p-4 align-middle text-center font-medium",
                        isPutInTheMoney ? "bg-primary/10" : "",
                        putOption.spfvData?.spfv?.spfv ? "text-blue-600" : ""
                      )}>
                        {putOption.spfvData?.spfv?.spfv ? 
                          (typeof putOption.spfvData.spfv.spfv === 'number' ? 
                            putOption.spfvData.spfv.spfv.toFixed(2) : 
                            String(putOption.spfvData.spfv.spfv)
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

