"use client";

import { Check, ChevronsUpDown, SearchIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { symbols } from "@/lib/constants/symbols";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { SymbolIcon } from "@/components/shared/SymbolIcon";

export function SymbolSelector({
                                 onSymbolSelect,
                               }: {
  onSymbolSelect: (symbol: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const handleSymbolSelect = (symbol: string) => {
    onSymbolSelect(symbol);
    setOpen(false);
  };

  return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[140px] justify-between"
          >
            {value ? (
                <div className="flex items-center gap-2">
                  {symbols.find((symbol) => symbol.value === value)?.name && (
                      <SymbolIcon symbol={symbols.find((symbol) => symbol.value === value)?.value || ""} name={symbols.find((symbol) => symbol.value === value)?.name || ""} />
                  )}
                  <span className="font-medium">
                {symbols.find((symbol) => symbol.value === value)?.label}
              </span>
                </div>
            ) : (
                <div className="flex items-center gap-2">
                  <SearchIcon className="h-4 w-4 opacity-50" />
                  <span>Symbol</span>
                </div>
            )}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[220px] p-0">
          <Command>
            <CommandInput placeholder="Search symbols..." className="h-9" />
            <CommandList>
              <CommandEmpty>No symbol found.</CommandEmpty>
              <CommandGroup className="max-h-[300px] overflow-auto">
                {symbols.map((symbol) => (
                    <CommandItem
                        value={symbol.label}
                        key={symbol.value}
                        onSelect={(currentValue) => {
                          setValue(currentValue);
                          handleSymbolSelect(currentValue);
                          setOpen(false);
                        }}
                        className="flex items-center gap-2 py-1.5"
                    >
                      {symbol.name && (
                          <SymbolIcon symbol={symbol.value} name={symbol.name} />
                      )}
                      <div className="flex items-center gap-x-2">
                        <span className="font-medium">{symbol.label}</span>
                        {symbol.name && (
                            <span className="text-xs text-muted-foreground">
                        {symbol.name}
                      </span>
                        )}
                      </div>
                      <Check
                          className={cn(
                              "ml-auto",
                              value === symbol.value ? "opacity-100" : "opacity-0"
                          )}
                      />
                    </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
  );
}

export function SymbolSelectorSkeleton() {
  return (
      <div className="flex items-center space-x-2">
        <Skeleton className="h-9 w-[200px] rounded-md" />
      </div>
  );
}
