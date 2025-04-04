import React, { useState } from 'react'
import { FieldValues } from 'react-hook-form'
import { cn } from "@/lib/utils"
import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FormControl } from '@/components/ui/form'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const symbols = [
    { value: "AAL", label: "AAL" },
    { value: "AAPL", label: "AAPL" },
    { value: "ABNB", label: "ABNB" },
    { value: "ACHR", label: "ACHR" },
    { value: "ADBE", label: "ADBE" },
    { value: "AFRM", label: "AFRM" },
    { value: "AI", label: "AI" },
    { value: "ALAB", label: "ALAB" },
    { value: "AMC", label: "AMC" },
    { value: "AMD", label: "AMD" },
    { value: "AMAT", label: "AMAT" },
    { value: "AMZN", label: "AMZN" },
    { value: "ANET", label: "ANET" },
    { value: "APP", label: "APP" },
    { value: "APLD", label: "APLD" },
    { value: "APPS", label: "APPS" },
    { value: "ARM", label: "ARM" },
    { value: "ASML", label: "ASML" },
    { value: "ASTS", label: "ASTS" },
    { value: "AVGO", label: "AVGO" },
    { value: "BA", label: "BA" },
    { value: "BABA", label: "BABA" },
    { value: "BAC", label: "BAC" },
    { value: "BB", label: "BB" },
    { value: "BBAI", label: "BBAI" },
    { value: "BEKE", label: "BEKE" },
    { value: "BIDU", label: "BIDU" },
    { value: "BILI", label: "BILI" },
    { value: "BMY", label: "BMY" },
    { value: "BP", label: "BP" },
    { value: "C", label: "C" },
    { value: "CCL", label: "CCL" },
    { value: "CELH", label: "CELH" },
    { value: "CFLT", label: "CFLT" },
    { value: "CLF", label: "CLF" },
    { value: "CLMT", label: "CLMT" },
    { value: "CMCSA", label: "CMCSA" },
    { value: "CMG", label: "CMG" },
    { value: "COF", label: "COF" },
    { value: "COIN", label: "COIN" },
    { value: "COST", label: "COST" },
    { value: "CRM", label: "CRM" },
    { value: "CRWD", label: "CRWD" },
    { value: "CSCO", label: "CSCO" },
    { value: "CVNA", label: "CVNA" },
    { value: "CVS", label: "CVS" },
    { value: "CVX", label: "CVX" },
    { value: "DAL", label: "DAL" },
    { value: "DASH", label: "DASH" },
    { value: "DDOG", label: "DDOG" },
    { value: "DECK", label: "DECK" },
    { value: "DELL", label: "DELL" },
    { value: "DIS", label: "DIS" },
    { value: "DJT", label: "DJT" },
    { value: "DKNG", label: "DKNG" },
    { value: "ELF", label: "ELF" },
    { value: "ENPH", label: "ENPH" },
    { value: "ENVX", label: "ENVX" },
    { value: "ET", label: "ET" },
    { value: "F", label: "F" },
    { value: "FCX", label: "FCX" },
    { value: "FSLR", label: "FSLR" },
    { value: "FSLY", label: "FSLY" },
    { value: "FUBO", label: "FUBO" },
    { value: "FUTU", label: "FUTU" },
    { value: "GE", label: "GE" },
    { value: "GILD", label: "GILD" },
    { value: "GM", label: "GM" },
    { value: "GME", label: "GME" },
    { value: "GOOG", label: "GOOG" },
    { value: "GOOGL", label: "GOOGL" },
    { value: "GOLD", label: "GOLD" },
    { value: "GRAB", label: "GRAB" },
    { value: "GS", label: "GS" },
    { value: "GT", label: "GT" },
    { value: "HIMS", label: "HIMS" },
    { value: "HIMX", label: "HIMX" },
    { value: "HOOD", label: "HOOD" },
    { value: "IBIT", label: "IBIT" },
    { value: "IBM", label: "IBM" },
    { value: "INTC", label: "INTC" },
    { value: "IONQ", label: "IONQ" },
    { value: "IQ", label: "IQ" },
    { value: "IRBT", label: "IRBT" },
    { value: "IREN", label: "IREN" },
    { value: "JD", label: "JD" },
    { value: "JNJ", label: "JNJ" },
    { value: "JPM", label: "JPM" },
    { value: "KO", label: "KO" },
    { value: "LCID", label: "LCID" },
    { value: "LLY", label: "LLY" },
    { value: "LRCX", label: "LRCX" },
    { value: "LUNR", label: "LUNR" },
    { value: "LUV", label: "LUV" },
    { value: "LYFT", label: "LYFT" },
    { value: "MARA", label: "MARA" },
    { value: "MBLY", label: "MBLY" },
    { value: "MCD", label: "MCD" },
    { value: "META", label: "META" },
    { value: "MGM", label: "MGM" },
    { value: "MMM", label: "MMM" },
    { value: "MRK", label: "MRK" },
    { value: "MRNA", label: "MRNA" },
    { value: "MRVL", label: "MRVL" },
    { value: "MSFT", label: "MSFT" },
    { value: "MSTR", label: "MSTR" },
    { value: "MSTU", label: "MSTU" },
    { value: "MSTX", label: "MSTX" },
    { value: "MU", label: "MU" },
    { value: "NEE", label: "NEE" },
    { value: "NEM", label: "NEM" },
    { value: "NFLX", label: "NFLX" },
    { value: "NIO", label: "NIO" },
    { value: "NKE", label: "NKE" },
    { value: "NKLA", label: "NKLA" },
    { value: "NOK", label: "NOK" },
    { value: "NOW", label: "NOW" },
    { value: "NVDA", label: "NVDA" },
    { value: "NVDL", label: "NVDL" },
    { value: "NVO", label: "NVO" },
    { value: "NVT", label: "NVT" },
    { value: "NXE", label: "NXE" },
    { value: "OKLO", label: "OKLO" },
    { value: "ONON", label: "ONON" },
    { value: "ORCL", label: "ORCL" },
    { value: "OXY", label: "OXY" },
    { value: "PAA", label: "PAA" },
    { value: "PANW", label: "PANW" },
    { value: "PBI", label: "PBI" },
    { value: "PDD", label: "PDD" },
    { value: "PFE", label: "PFE" },
    { value: "PG", label: "PG" },
    { value: "PINS", label: "PINS" },
    { value: "PLTR", label: "PLTR" },
    { value: "PLUG", label: "PLUG" },
    { value: "PTON", label: "PTON" },
    { value: "PYPL", label: "PYPL" },
    { value: "QBTS", label: "QBTS" },
    { value: "QCOM", label: "QCOM" },
    { value: "QQQ", label: "QQQ" },
    { value: "QS", label: "QS" },
    { value: "QUBT", label: "QUBT" },
    { value: "RBLX", label: "RBLX" },
    { value: "RDDT", label: "RDDT" },
    { value: "RDFN", label: "RDFN" },
    { value: "RGTI", label: "RGTI" },
    { value: "RIOT", label: "RIOT" },
    { value: "RIVN", label: "RIVN" },
    { value: "RKLB", label: "RKLB" },
    { value: "ROKU", label: "ROKU" },
    { value: "RXRX", label: "RXRX" },
    { value: "SAVE", label: "SAVE" },
    { value: "SBLK", label: "SBLK" },
    { value: "SBUX", label: "SBUX" },
    { value: "SCHW", label: "SCHW" },
    { value: "SEDG", label: "SEDG" },
    { value: "SERV", label: "SERV" },
    { value: "SHOP", label: "SHOP" },
    { value: "SMCI", label: "SMCI" },
    { value: "SNAP", label: "SNAP" },
    { value: "SNOW", label: "SNOW" },
    { value: "SOFI", label: "SOFI" },
    { value: "SOUN", label: "SOUN" },
    { value: "SPOT", label: "SPOT" },
    { value: "SPX", label: "SPX" },
    { value: "SPY", label: "SPY" },
    { value: "SQ", label: "SQ" },
    { value: "T", label: "T" },
    { value: "TDOC", label: "TDOC" },
    { value: "TECK", label: "TECK" },
    { value: "TEM", label: "TEM" },
    { value: "TGT", label: "TGT" },
    { value: "TIGR", label: "TIGR" },
    { value: "TLRY", label: "TLRY" },
    { value: "TTD", label: "TTD" },
    { value: "TSLA", label: "TSLA" },
    { value: "U", label: "U" },
    { value: "UBER", label: "UBER" },
    { value: "UPS", label: "UPS" },
    { value: "UPST", label: "UPST" },
    { value: "VALE", label: "VALE" },
    { value: "VRT", label: "VRT" },
    { value: "VST", label: "VST" },
    { value: "VZ", label: "VZ" },
    { value: "WBA", label: "WBA" },
    { value: "WBD", label: "WBD" },
    { value: "WDC", label: "WDC" },
    { value: "WFC", label: "WFC" },
    { value: "WMT", label: "WMT" },
    { value: "WULF", label: "WULF" },
    { value: "XOM", label: "XOM" },
    { value: "XYZ", label: "XYZ" },
    { value: "ZIM", label: "ZIM" },
];

export default function SymbolsListSelect({ field }: { field: FieldValues}) {
  const [open, setOpen] = useState(false)
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {field.value
              ? symbols.find((symbol) => symbol.value === field.value)?.label || field.value
              : "Select symbol..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search symbol..." />
          <CommandList>
            <CommandEmpty>No symbol found.</CommandEmpty>
            <CommandGroup className="max-h-[300px] overflow-y-auto">
              {symbols.map((symbol) => (
                <CommandItem
                  key={symbol.value}
                  onSelect={() => {
                    field.onChange(symbol.value)
                    setOpen(false)
                  }}
                >
                  {symbol.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      field.value === symbol.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
