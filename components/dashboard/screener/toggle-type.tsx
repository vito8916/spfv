import { DollarSign, Percent } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface ToggleTypeProps {
  selectedValue: string;
  onValueChange: (value: string) => void;
}

export default function ToggleType({
                                     selectedValue,
                                     onValueChange,
                                   }: ToggleTypeProps) {
  return (
      <div className="flex gap-x-4 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:pb-0 sm:overflow-visible">
        <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-md border">
          <div>
            <input
                type="radio"
                id="dollar_pos"
                value="dollar_pos"
                checked={selectedValue === "dollar_pos"}
                onChange={() => onValueChange("dollar_pos")}
                className="sr-only"
            />
            <Label
                htmlFor="dollar_pos"
                className={cn(
                    "flex items-center justify-center gap-x-2 text-sm font-medium cursor-pointer rounded-md px-3 py-2 transition-all whitespace-nowrap",
                    selectedValue === "dollar_pos"
                        ? "bg-white dark:bg-slate-950 text-primary shadow-sm"
                        : "hover:bg-slate-200 dark:hover:bg-slate-700 text-muted-foreground"
                )}
            >
              <DollarSign className="h-4 w-4" />
              Dollar Pos
            </Label>
          </div>
          <div>
            <input
                type="radio"
                id="percent_pos"
                value="percent_pos"
                checked={selectedValue === "percent_pos"}
                onChange={() => onValueChange("percent_pos")}
                className="sr-only"
            />
            <Label
                htmlFor="percent_pos"
                className={cn(
                    "flex items-center justify-center gap-x-2 text-sm font-medium cursor-pointer rounded-md px-3 py-2 transition-all whitespace-nowrap",
                    selectedValue === "percent_pos"
                        ? "bg-white dark:bg-slate-950 text-primary shadow-sm"
                        : "hover:bg-slate-200 dark:hover:bg-slate-700 text-muted-foreground"
                )}
            >
              <Percent className="h-4 w-4" />
              Percent Pos
            </Label>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-md border">
          <div>
            <input
                type="radio"
                id="dollar_neg"
                value="dollar_neg"
                checked={selectedValue === "dollar_neg"}
                onChange={() => onValueChange("dollar_neg")}
                className="sr-only"
            />
            <Label
                htmlFor="dollar_neg"
                className={cn(
                    "flex items-center justify-center gap-x-2 text-sm font-medium cursor-pointer rounded-md px-3 py-2 transition-all whitespace-nowrap",
                    selectedValue === "dollar_neg"
                        ? "bg-white dark:bg-slate-950 text-primary shadow-sm"
                        : "hover:bg-slate-200 dark:hover:bg-slate-700 text-muted-foreground"
                )}
            >
              <DollarSign className="h-4 w-4" />
              Dollar Neg
            </Label>
          </div>
          <div>
            <input
                type="radio"
                id="percent_neg"
                value="percent_neg"
                checked={selectedValue === "percent_neg"}
                onChange={() => onValueChange("percent_neg")}
                className="sr-only"
            />
            <Label
                htmlFor="percent_neg"
                className={cn(
                    "flex items-center justify-center gap-x-2 text-sm font-medium cursor-pointer rounded-md px-3 py-2 transition-all whitespace-nowrap",
                    selectedValue === "percent_neg"
                        ? "bg-white dark:bg-slate-950 text-primary shadow-sm"
                        : "hover:bg-slate-200 dark:hover:bg-slate-700 text-muted-foreground"
                )}
            >
              <Percent className="h-4 w-4" />
              Percent Neg
            </Label>
          </div>
        </div>
      </div>
  );
}
