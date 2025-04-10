"use client";

import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RefreshCcw } from "lucide-react";
type ScreenerItem = {
  symbol: string;
  callPutIndicator: "C" | "P";
  strike: number;
  tte: number;
  strikeDiff: number;
  expiration: string;
  optionBid: number;
  optionAsk: number;
  optionMid: number;
  currentUnderlyingPrice: number;
  spfv: number;
  spfvDistanceDollar: number;
  spfvDistancePercent: number;
  createdAt: string;
};

// Sample data for development
const sampleData: ScreenerItem[] = [
  {
    "symbol": "TLRY",
    "callPutIndicator": "C",
    "strike": 0.5,
    "tte": 1171,
    "strikeDiff": 0,
    "expiration": "2025-04-11T00:00:00",
    "optionBid": 0.02,
    "optionAsk": 0.03,
    "optionMid": 0.025,
    "currentUnderlyingPrice": 0.457,
    "spfv": 0.01,
    "spfvDistanceDollar": 0.015,
    "spfvDistancePercent": 0.6,
    "createdAt": "2025-04-08T20:04:38.942906"
  },
  {
    "symbol": "TLRY",
    "callPutIndicator": "P",
    "strike": 0.5,
    "tte": 1171,
    "strikeDiff": 0,
    "expiration": "2025-04-11T00:00:00",
    "optionBid": 0.04,
    "optionAsk": 0.05,
    "optionMid": 0.045,
    "currentUnderlyingPrice": 0.457,
    "spfv": 0.113,
    "spfvDistanceDollar": -0.068,
    "spfvDistancePercent": -1.511111111111111,
    "createdAt": "2025-04-08T20:04:38.935216"
  }
];

export default function StockScreener() {
  const [items] = useState<ScreenerItem[]>(sampleData);
  const [filterSymbol, setFilterSymbol] = useState("");
  const [optionType, setOptionType] = useState("all");
  const [daysToExpiration, setDaysToExpiration] = useState("all");

  // Format date to readable format
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Calculate days to expiration from now
  const getDaysToExpiration = (expirationDate: string) => {
    const now = new Date();
    const expDate = new Date(expirationDate);
    const diffTime = Math.abs(expDate.getTime() - now.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Filter items based on multiple criteria
  const filteredItems = items.filter(item => {
    // Symbol filter
    const symbolMatch = filterSymbol ? 
      item.symbol.includes(filterSymbol.toUpperCase()) : 
      true;
    
    // Option type filter
    const typeMatch = optionType === "all" ? 
      true : 
      item.callPutIndicator === optionType;
    
    // Days to expiration filter
    let dteMatch = true;
    if (daysToExpiration !== "all") {
      const dte = getDaysToExpiration(item.expiration);
      const dteLimit = parseInt(daysToExpiration);
      dteMatch = dte <= dteLimit;
    }
    
    return symbolMatch && typeMatch && dteMatch;
  });

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center pb-2 border-b">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stock Screener</h1>
          <p className="text-muted-foreground mt-1">Find and analyze options with potential based on SPFV metrics.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="ml-2">
            {filteredItems.length} results
          </Badge>
          <Button className="px-4">
            <RefreshCcw className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
        </div>
      </div>
      
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl flex items-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 20 20" 
              fill="currentColor" 
              className="w-5 h-5 mr-2 text-primary"
            >
              <path fillRule="evenodd" d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 01.628.74v2.288a2.25 2.25 0 01-.659 1.59l-4.682 4.683a2.25 2.25 0 00-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 018 18.25v-5.757a2.25 2.25 0 00-.659-1.591L2.659 6.22A2.25 2.25 0 012 4.629V2.34a.75.75 0 01.628-.74z" clipRule="evenodd" />
            </svg>
            Filters
          </CardTitle>
          <Separator className="mt-3" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label htmlFor="symbol" className="text-sm font-medium flex items-center">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 20 20" 
                  fill="currentColor" 
                  className="w-4 h-4 mr-1.5 text-muted-foreground"
                >
                  <path d="M10 9a3 3 0 100-6 3 3 0 000 6zM6 8a2 2 0 11-4 0 2 2 0 014 0zM1.49 15.326a.78.78 0 01-.358-.442 3 3 0 014.308-3.516 6.484 6.484 0 00-1.905 3.959c-.023.222-.014.442.025.654a4.97 4.97 0 01-2.07-.655zM16.44 15.98a4.97 4.97 0 002.07-.654.78.78 0 00.357-.442 3 3 0 00-4.308-3.517 6.484 6.484 0 011.907 3.96 2.32 2.32 0 01-.026.654zM18 8a2 2 0 11-4 0 2 2 0 014 0zM5.304 16.19a.844.844 0 01-.277-.71 5 5 0 019.947 0 .843.843 0 01-.277.71A6.975 6.975 0 0110 18a6.974 6.974 0 01-4.696-1.81z" />
                </svg>
                Symbol
              </label>
              <Input 
                id="symbol" 
                placeholder="e.g. AAPL, MSFT, TSLA" 
                value={filterSymbol}
                onChange={(e) => setFilterSymbol(e.target.value)}
                className="bg-background"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="option-type" className="text-sm font-medium flex items-center">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 20 20" 
                  fill="currentColor" 
                  className="w-4 h-4 mr-1.5 text-muted-foreground"
                >
                  <path fillRule="evenodd" d="M2 3a1 1 0 00-1 1v1a1 1 0 001 1h16a1 1 0 001-1V4a1 1 0 00-1-1H2zm0 4.5h16l.811 7.68a2 2 0 01-1.99 2.32H3.18a2 2 0 01-1.989-2.32L2 7.5z" clipRule="evenodd" />
                </svg>
                Option Type
              </label>
              <Select 
                value={optionType} 
                onValueChange={setOptionType}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select option type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="C">Calls Only</SelectItem>
                  <SelectItem value="P">Puts Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="date-range" className="text-sm font-medium flex items-center">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 20 20" 
                  fill="currentColor" 
                  className="w-4 h-4 mr-1.5 text-muted-foreground"
                >
                  <path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z" clipRule="evenodd" />
                </svg>
                Days to Expiration
              </label>
              <Select 
                value={daysToExpiration} 
                onValueChange={setDaysToExpiration}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select expiration range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Expiration</SelectItem>
                  <SelectItem value="30">Within 30 days</SelectItem>
                  <SelectItem value="60">Within 60 days</SelectItem>
                  <SelectItem value="90">Within 90 days</SelectItem>
                  <SelectItem value="180">Within 180 days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 flex items-end">
              <Button 
                className="w-full bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary"
                variant="outline"
                onClick={() => {
                  setFilterSymbol("");
                  setOptionType("all");
                  setDaysToExpiration("all");
                }}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 20 20" 
                  fill="currentColor" 
                  className="w-4 h-4 mr-2"
                >
                  <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z" clipRule="evenodd" />
                </svg>
                Reset Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl flex items-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 20 20" 
                fill="currentColor" 
                className="w-5 h-5 mr-2 text-primary"
              >
                <path d="M15.5 2A1.5 1.5 0 0014 3.5v13a1.5 1.5 0 001.5 1.5h1a1.5 1.5 0 001.5-1.5v-13A1.5 1.5 0 0016.5 2h-1zM9.5 6A1.5 1.5 0 008 7.5v9A1.5 1.5 0 009.5 18h1a1.5 1.5 0 001.5-1.5v-9A1.5 1.5 0 0010.5 6h-1zM3.5 10A1.5 1.5 0 002 11.5v5A1.5 1.5 0 003.5 18h1A1.5 1.5 0 006 16.5v-5A1.5 1.5 0 004.5 10h-1z" />
              </svg>
              Screener Results
            </CardTitle>
            <div className="text-sm text-muted-foreground">
              Last updated: {items.length > 0 ? formatDate(items[0].createdAt) : "N/A"}
            </div>
          </div>
          <Separator className="mt-3" />
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-26rem)] rounded-md">
            <Table>
              <TableHeader className="sticky top-0 bg-card z-10">
                <TableRow>
                  <TableHead className="w-[100px]">
                    <div className="flex items-center">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        className="w-4 h-4 mr-1.5"
                      >
                        <path d="M3 3v18h18"></path>
                        <path d="m19 9-5-5-4 4-3-3"></path>
                      </svg>
                      Symbol
                    </div>
                  </TableHead>
                  <TableHead className="w-[100px]">Type</TableHead>
                  <TableHead className="w-[100px]">Strike</TableHead>
                  <TableHead className="w-[140px]">Expiration</TableHead>
                  <TableHead className="w-[120px]">Current Price</TableHead>
                  <TableHead className="text-right w-[120px]">Bid/Ask</TableHead>
                  <TableHead className="text-right w-[100px]">SPFV</TableHead>
                  <TableHead className="text-right w-[120px]">Distance %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.length > 0 ? (
                  filteredItems.map((item, index) => (
                    <TableRow key={index} className="hover:bg-muted/50 cursor-pointer">
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <span className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs text-primary mr-2">
                            {item.symbol.charAt(0)}
                          </span>
                          {item.symbol}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={item.callPutIndicator === "C" ? "default" : "destructive"} className="px-2 py-0.5">
                          {item.callPutIndicator === "C" ? "Call" : "Put"}
                        </Badge>
                      </TableCell>
                      <TableCell>${item.strike.toFixed(2)}</TableCell>
                      <TableCell>{formatDate(item.expiration)}</TableCell>
                      <TableCell>${item.currentUnderlyingPrice.toFixed(3)}</TableCell>
                      <TableCell className="text-right">${item.optionBid.toFixed(3)} / ${item.optionAsk.toFixed(3)}</TableCell>
                      <TableCell className="text-right font-medium">${item.spfv.toFixed(3)}</TableCell>
                      <TableCell className={`text-right font-medium ${item.spfvDistancePercent >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {item.spfvDistancePercent >= 0 ? "+" : ""}{item.spfvDistancePercent.toFixed(2)}%
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No results found. Try adjusting your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}