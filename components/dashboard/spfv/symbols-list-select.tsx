import { FormControl } from '@/components/ui/form'
import { Select, SelectValue, SelectTrigger, SelectItem, SelectContent } from '@/components/ui/select'
import React from 'react'
import { FieldValues } from 'react-hook-form'

const symbols = [
    { value: 'AAPL', label: 'AAPL' },
    { value: 'GOOG', label: 'GOOG' },
    { value: 'MSFT', label: 'MSFT' },
    { value: 'AMZN', label: 'AMZN' },
    { value: 'TSLA', label: 'TSLA' },
]

export default function SymbolsListSelect({ field }: { field: FieldValues}) {
      
  return (
    <div>
        <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select symbol" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {symbols.map((symbol: { value: string; label: string }) => (
                            <SelectItem key={symbol.value} value={symbol.value}>
                              {symbol.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select> 
    </div>
  )
}
