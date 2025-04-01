"use client"

import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface OptionData {
  strikePrice: number;
  bid: number;
  ask: number;
  volatility: number; // IV
  prevClose?: number; // Used to calculate change
  last?: number; // Current price, used to calculate change
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
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead colSpan={4} className="text-center bg-muted/30">Calls</TableHead>
                <TableHead rowSpan={2} className="text-center bg-primary/10 font-bold w-[100px]">Strike</TableHead>
                <TableHead colSpan={4} className="text-center bg-muted/30">Puts</TableHead>
              </TableRow>
              <TableRow>
                {/* Call columns */}
                <TableHead className="text-center">IV</TableHead>
                <TableHead className="text-center">CHNG</TableHead>
                <TableHead className="text-center">BID</TableHead>
                <TableHead className="text-center">ASK</TableHead>
                {/* Strike is in the middle */}
                {/* Put columns */}
                <TableHead className="text-center">BID</TableHead>
                <TableHead className="text-center">ASK</TableHead>
                <TableHead className="text-center">CHNG</TableHead>
                <TableHead className="text-center">IV</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedStrikes.map((strike, index) => {
                const callOption = callOptions.find(option => option.strikePrice === strike) || {
                  strikePrice: strike,
                  bid: 0,
                  ask: 0,
                  volatility: 0
                };
                
                const putOption = putOptions.find(option => option.strikePrice === strike) || {
                  strikePrice: strike,
                  bid: 0,
                  ask: 0,
                  volatility: 0
                };
                
                const callChange = calculateChange(callOption.last || 0, callOption.prevClose || 0);
                const putChange = calculateChange(putOption.last || 0, putOption.prevClose || 0);
                
                // Determine if strike is near the money (within 5% of underlying price)
                //const isNearTheMoney = Math.abs(strike - underlyingPrice) / underlyingPrice < 0.05;
                // Highlight calls with strike < underlying and puts with strike > underlying
                const isCallInTheMoney = strike < underlyingPrice;
                const isPutInTheMoney = strike > underlyingPrice;
                
                
                return (
                  <TableRow 
                    key={strike} 
                    className={cn(
                      index % 2 === 0 ? "bg-muted/20" : "",
                    )}
                  >
                    {/* Call side */}
                    <TableCell className={cn(
                      "text-center",
                      isCallInTheMoney ? "bg-primary/10" : ""
                    )}>
                      {callOption.volatility ? `${callOption.volatility.toFixed(2)}%` : "-"}
                    </TableCell>
                    <TableCell className={cn(
                      "text-center",
                      isCallInTheMoney ? "bg-primary/10" : "",
                      callChange > 0 ? "text-green-600" : callChange < 0 ? "text-red-600" : ""
                    )}>
                      {callChange !== 0 ? callChange.toFixed(2) : "-"}
                    </TableCell>
                    <TableCell className={cn(
                      "text-center",
                      isCallInTheMoney ? "bg-primary/10" : ""
                    )}>{callOption.bid ? callOption.bid.toFixed(2) : "-"}</TableCell>
                    <TableCell className={cn(
                      "text-center",
                      isCallInTheMoney ? "bg-primary/10" : ""
                    )}>{callOption.ask ? callOption.ask.toFixed(2) : "-"}</TableCell>
                    
                    {/* Strike price (middle column) */}
                    <TableCell className="text-center font-bold bg-gray-100">
                      {strike.toFixed(2)}
                    </TableCell>
                    
                    {/* Put side */}
                    <TableCell className={cn(
                      "text-center",
                      isPutInTheMoney ? "bg-primary/10" : ""
                    )}>{putOption.bid ? putOption.bid.toFixed(2) : "-"}</TableCell>
                    <TableCell className={cn(
                      "text-center",
                      isPutInTheMoney ? "bg-primary/10" : ""
                    )}>{putOption.ask ? putOption.ask.toFixed(2) : "-"}</TableCell>
                    <TableCell className={cn(
                      "text-center",
                      isPutInTheMoney ? "bg-primary/10" : "",
                      putChange > 0 ? "text-green-600" : putChange < 0 ? "text-red-600" : ""
                    )}>
                      {putChange !== 0 ? putChange.toFixed(2) : "-"}
                    </TableCell>
                    <TableCell className={cn(
                      "text-center",
                      isPutInTheMoney ? "bg-primary/10" : ""
                    )}>
                      {putOption.volatility ? `${putOption.volatility.toFixed(2)}%` : "-"}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

