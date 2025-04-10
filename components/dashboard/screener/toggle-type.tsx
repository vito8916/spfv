import { DollarSign, Percent } from 'lucide-react'
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface ToggleTypeProps {
  selectedValue: string;
  onValueChange: (value: string) => void;
}

export default function ToggleType({ selectedValue, onValueChange }: ToggleTypeProps) {
  return (
    <div className="flex items-center space-x-4 bg-muted/50 p-1 rounded-md border">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="dollar"
          checked={selectedValue === 'dollar'}
          onCheckedChange={() => onValueChange('dollar')}
          className={`${
            selectedValue === 'dollar' 
              ? 'bg-primary border-primary hover:bg-primary/90' 
              : 'bg-background'
          }`}
        />
        <Label
          htmlFor="dollar"
          className={`flex items-center gap-x-2 text-sm font-medium cursor-pointer ${
            selectedValue === 'dollar' ? 'text-primary' : ''
          }`}
        >
          <DollarSign className="h-4 w-4" />
          Dollar
        </Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="percent"
          checked={selectedValue === 'percent'}
          onCheckedChange={() => onValueChange('percent')}
          className={`${
            selectedValue === 'percent' 
              ? 'bg-primary border-primary hover:bg-primary/90' 
              : 'bg-background'
          }`}
        />
        <Label
          htmlFor="percent"
          className={`flex items-center gap-x-2 text-sm font-medium cursor-pointer ${
            selectedValue === 'percent' ? 'text-primary' : ''
          }`}
        >
          <Percent className="h-4 w-4" />
          Percent
        </Label>
      </div>
    </div>
  )
}
