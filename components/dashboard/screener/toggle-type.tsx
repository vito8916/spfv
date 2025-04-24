import { DollarSign, Percent } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface ToggleTypeProps {
  selectedValue: string;
  onValueChange: (value: string) => void;
}

export default function ToggleType({
  selectedValue,
  onValueChange,
}: ToggleTypeProps) {
  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center space-x-4 bg-muted/50 p-1 rounded-md border">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="dollar_pos"
            checked={selectedValue === "dollar_pos"}
            onCheckedChange={() => onValueChange("dollar_pos")}
            className={`${
              selectedValue === "dollar_pos"
                ? "bg-primary border-primary hover:bg-primary/90"
                : "bg-background"
            }`}
          />
          <Label
            htmlFor="dollar_pos"
            className={`flex items-center gap-x-2 text-sm font-medium cursor-pointer ${
              selectedValue === "dollar_pos" ? "text-primary" : ""
            }`}
          >
            <DollarSign className="h-4 w-4" />
            Dollar Pos
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="percent_pos"
            checked={selectedValue === "percent_pos"}
            onCheckedChange={() => onValueChange("percent_pos")}
            className={`${
              selectedValue === "percent_pos"
                ? "bg-primary border-primary hover:bg-primary/90"
                : "bg-background"
            }`}
          />
          <Label
            htmlFor="percent_pos"
            className={`flex items-center gap-x-2 text-sm font-medium cursor-pointer ${
              selectedValue === "percent_pos" ? "text-primary" : ""
            }`}
          >
            <Percent className="h-4 w-4" />
            Percent Pos
          </Label>
        </div>
      </div>
      <div className="flex items-center space-x-4 bg-muted/50 p-1 rounded-md border">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="dollar_neg"
            checked={selectedValue === "dollar_neg"}
            onCheckedChange={() => onValueChange("dollar_neg")}
            className={`${
              selectedValue === "dollar_neg"
                ? "bg-primary border-primary hover:bg-primary/90"
                : "bg-background"
            }`}
          />
          <Label
            htmlFor="dollar_neg"
            className={`flex items-center gap-x-2 text-sm font-medium cursor-pointer ${
              selectedValue === "dollar_neg" ? "text-primary" : ""
            }`}
          >
            <DollarSign className="h-4 w-4" />
            Dollar Neg
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="percent_neg"
            checked={selectedValue === "percent_neg"}
            onCheckedChange={() => onValueChange("percent_neg")}
            className={`${
              selectedValue === "percent_neg"
                ? "bg-primary border-primary hover:bg-primary/90"
                : "bg-background"
            }`}
          />
          <Label
            htmlFor="percent_neg"
            className={`flex items-center gap-x-2 text-sm font-medium cursor-pointer ${
              selectedValue === "percent_neg" ? "text-primary" : ""
            }`}
          >
            <Percent className="h-4 w-4" />
            Percent Neg
          </Label>
        </div>
      </div>
    </div>
  );
}
