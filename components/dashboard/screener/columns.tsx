"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, Calendar, DollarSign, Percent, Tag } from "lucide-react";
import { format } from "date-fns";

// This type is used to define the shape of our data.
// use a Zod schema here if you want.
export type Payment = {
  id: string;
  symbol: string;
  callPutIndicator: string;
  strike: number;
  tte: number;
  strikeDiff: number;
  spfv: number;
  spfvDistanceDollar: number;
  spfvDistancePercent: number;
  createdAt: string;
  optionBid?: number;
  optionAsk?: number;
  optionMid?: number;
  currentUnderlyingPrice?: number;
  expiration?: string;
};

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "symbol",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          className="px-2 w-full"
          onClick={() => column.toggleSorting(isSorted === "asc")}
        >
          <div className="flex items-center">
            <Tag className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>Symbol</span>
            {isSorted === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : isSorted === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4 opacity-30" />
            )}
          </div>
        </Button>
      );
    },
    cell: ({ row }) => {
      const symbol = row.original.symbol;
      return (
        <div className="flex items-center w-full px-3">
          <span className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs text-primary mr-2">
            {symbol.charAt(0)}
          </span>
          <Badge variant="outline" className="font-medium text-sm">
            {symbol}
          </Badge>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "callPutIndicator",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          className="px-2 w-full"
          onClick={() => column.toggleSorting(isSorted === "asc")}
        >
          <div className="flex items-center">
            <span>Type</span>
            {isSorted === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : isSorted === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4 opacity-30" />
            )}
          </div>
        </Button>
      );
    },
    cell: ({ row }) => {
      const callPutIndicator = row.original.callPutIndicator;
      return (
        <div className="flex items-center w-full px-3">
          <Badge
            variant={callPutIndicator === "C" ? "default" : "destructive"}
            className="font-medium px-2 py-0.5"
        >
          {callPutIndicator === "C" ? "Call" : "Put"}
        </Badge>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "strike",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          className="px-2 w-full"
          onClick={() => column.toggleSorting(isSorted === "asc")}
        >
          <div className="flex items-center">
            <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>Strike</span>
            {isSorted === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : isSorted === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4 opacity-30" />
            )}
          </div>
        </Button>
      );
    },
    cell: ({ row }) => {
      const strike = row.original.strike;
      return <div className="font-medium text-right px-3">${strike.toFixed(2)}</div>;
    },
  },
  {
    accessorKey: "expiration",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          className="px-2 w-full"
          onClick={() => column.toggleSorting(isSorted === "asc")}
        >
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>Expiration</span>
            {isSorted === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : isSorted === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4 opacity-30" />
            )}
          </div>
        </Button>
      );
    },
    cell: ({ row }) => {
      // Handle both expiration and createdAt fields
      const dateString = row.original.expiration || row.original.createdAt;
      try {
        const date = new Date(dateString);
        return <div className="text-center px-3">{format(date, "MMM d, yyyy")}</div>;
      } catch {
        return <div className="text-center px-3">{dateString}</div>;
      }
    },
  },
  
  {
    accessorKey: "currentUnderlyingPrice",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          className="px-2 w-full"
          onClick={() => column.toggleSorting(isSorted === "asc")}
        >
          <div className="flex items-center whitespace-nowrap">
            <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>Current Price</span>
            {isSorted === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : isSorted === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4 opacity-30" />
            )}
          </div>
        </Button>
      );
    },
    cell: ({ row }) => {
      const price = row.original.currentUnderlyingPrice;
      if (!price) return null;
      return <div className="text-right font-medium px-3">${price.toFixed(3)}</div>;
    },
  },
  {
    id: "bidAsk",
    header: () => {
      return (
        <Button variant="ghost" className="px-2 w-full">
          <div className="flex items-center whitespace-nowrap">
            <span>Bid/Ask</span>
          </div>
        </Button>
      );
    },
    cell: ({ row }) => {
      const bid = row.original.optionBid;
      const ask = row.original.optionAsk;
      if (!bid || !ask) return null;
      return (
        <div className="text-right font-medium px-3">
          ${bid.toFixed(3)} / ${ask.toFixed(3)}
        </div>
      );
    },
  },
  {
    accessorKey: "spfv",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          className="px-2 w-full"
          onClick={() => column.toggleSorting(isSorted === "asc")}
        >
          <div className="flex items-center">
            <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>SPFV</span>
            {isSorted === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : isSorted === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4 opacity-30" />
            )}
          </div>
        </Button>
      );
    },
    cell: ({ row }) => {
      const spfv = row.original.spfv;
      return (
        <div className="text-right font-medium text-primary px-3">
          ${spfv.toFixed(3)}
        </div>
      );
    },
  },
  {
    accessorKey: "spfvDistanceDollar",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          className="px-2 w-full"
          onClick={() => column.toggleSorting(isSorted === "asc")}
        >
          <div className="flex items-center whitespace-nowrap">
            <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>SPFV Dist $</span>
            {isSorted === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : isSorted === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4 opacity-30" />
            )}
          </div>
        </Button>
      );
    },
    cell: ({ row }) => {
      const spfvDistanceDollar = row.original.spfvDistanceDollar;
      const isPositive = spfvDistanceDollar >= 0;
      return (
        <div
          className={`text-right font-medium px-3 ${
            isPositive ? "text-green-600" : "text-red-600"
          }`}
        >
          {isPositive ? "+" : ""}${spfvDistanceDollar.toFixed(3)}
        </div>
      );
    },
  },
  {
    accessorKey: "spfvDistancePercent",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          className="px-2 w-full"
          onClick={() => column.toggleSorting(isSorted === "asc")}
        >
          <div className="flex items-center whitespace-nowrap">
            <Percent className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>SPFV Dist %</span>
            {isSorted === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : isSorted === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4 opacity-30" />
            )}
          </div>
        </Button>
      );
    },
    cell: ({ row }) => {
      const spfvDistancePercent = row.original.spfvDistancePercent;
      const isPositive = spfvDistancePercent >= 0;
      const percentValue = spfvDistancePercent * 100;
      return (
        <div
          className={`text-right font-medium px-3 ${
            isPositive ? "text-green-600" : "text-red-600"
          }`}
        >
          {isPositive ? "+" : ""}
          {percentValue.toFixed(2)}%
        </div>
      );
    },
  },
];
