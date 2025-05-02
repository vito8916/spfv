'use client'

import React, { useState } from 'react'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { ChartNoAxesCombined, ChartSpline, TableCellsMerge } from 'lucide-react'

type OptionType = 'chain' | 'atr' | 'beast'

export function OptionTypeSelectorRadio({ onOptionTypeSelect }: { onOptionTypeSelect: (optionType: string) => void }) {
    const [selectedOption, setSelectedOption] = useState<OptionType>('chain')

    return (
        <div className="w-full">
            <div className="flex rounded-md p-1 bg-slate-100 dark:bg-slate-800 gap-x-2">
                <RadioOption
                    id="option-chain"
                    value="chain"
                    selected={selectedOption === 'chain'}
                    onChange={() => {
                        setSelectedOption('chain')
                        onOptionTypeSelect('chain')
                    }}
                    icon={<TableCellsMerge className="mr-2 h-4 w-4" />}
                    label="Option Chain"
                />
                <RadioOption
                    id="option-atr"
                    value="atr"
                    selected={selectedOption === 'atr'}
                    onChange={() => {
                        setSelectedOption('atr')
                        onOptionTypeSelect('atr')
                    }}
                    icon={<ChartSpline className="mr-2 h-4 w-4" />}
                    label="ATR"
                />
                <RadioOption
                    id="option-volatility"
                    value="volatility"
                    selected={selectedOption === 'beast'}
                    onChange={() => {
                        setSelectedOption('beast')
                        onOptionTypeSelect('beast')
                    }}
                    icon={<ChartNoAxesCombined className="mr-2 h-4 w-4" />}
                    label="PM numbers"
                />
            </div>
        </div>
    )
}

interface RadioOptionProps {
    id: string
    value: string
    selected: boolean
    onChange: () => void
    icon?: React.ReactNode
    label: string
}

function RadioOption({ id, value, selected, onChange, icon, label }: RadioOptionProps) {
    return (
        <div className="">
            <input
                type="radio"
                id={id}
                value={value}
                checked={selected}
                onChange={onChange}
                className="sr-only"
            />
            <Label
                htmlFor={id}
                className={cn(
                    "flex items-center justify-center gap-x-2 text-sm font-medium cursor-pointer rounded-md px-3 py-2 transition-all whitespace-nowrap",
                    selected
                        ? "bg-white dark:bg-slate-950 text-primary shadow-sm"
                        : "hover:bg-slate-200 dark:hover:bg-slate-700 text-muted-foreground"
                )}
            >
                {icon}
                {label}
            </Label>
        </div>
    )
}

export function OptionTypeSelectorSkeleton() {
    return (
        <div className="flex w-full gap-2">
            <Skeleton className="h-10 w-full rounded-md" />
        </div>
    )
} 