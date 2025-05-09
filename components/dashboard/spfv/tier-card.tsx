import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ChevronUp, ChevronDown } from "lucide-react";

interface TierCardProps {
  tier: number;
  ratio: number;
  callStrike: number;
  callMidpoint: number;
  putStrike: number;
  putMidpoint: number;
}

export function TierCard({ tier, ratio, callStrike, callMidpoint, putStrike, putMidpoint }: TierCardProps) {
  // Determinar si el ratio es favorable 
  // (estos valores son arbitrarios, ajústalos según tus criterios de negocio)
  const isGoodRatio = callMidpoint > putMidpoint;
  //const isExcellentRatio = ratio >= 1.0;
  
  // Formatear números con 2 decimales
  const formatNumber = (num: number) => num.toFixed(2);
  
  // Determinar el color de background según el ratio
  /* const getBadgeVariant = () => {
    if (isExcellentRatio) return "default";
    if (isGoodRatio) return "secondary";
    return "destructive";
  }; */

  return (
    <Card className={`transition-all duration-200 hover:shadow-md ${isGoodRatio ? 'border-green-400/20' : ''}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2 text-base">
            <div className="flex items-center gap-2">
              {tier === 1 ? "+/- 5 Ratio" : tier === 2 ? "+/- 10 Ratio" : "+/- 15 Ratio"}
              {isGoodRatio && (
                <ChevronUp className="h-4 w-4 text-green-500" />
              )}
              {!isGoodRatio && (
                <ChevronDown className="h-4 w-4 text-red-500" />
              )}
            </div>
            <Badge variant="default" className={`text-xs ${isGoodRatio ? 'bg-green-500' : 'bg-primary'}`}>
                {formatNumber(ratio)}
            </Badge>
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="pt-4">
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-muted/50 p-2 rounded-md">
              <p className="text-xs font-medium mb-1">Call Strike</p>
              <p className="text-sm font-semibold">${formatNumber(callStrike)}</p>
            </div>
            <div className="bg-muted/50 p-2 rounded-md">
              <p className="text-xs font-medium mb-1">Put Strike</p>
              <p className="text-sm font-semibold">${formatNumber(putStrike)}</p>
            </div>
            
          </div>
          
          <div className="grid grid-cols-2 gap-2">
          <div className="bg-muted/50 p-2 rounded-md">
              <p className="text-xs font-medium mb-1">Call Midpoint</p>
              <p className="text-sm font-semibold">${formatNumber(callMidpoint)}</p>
            </div>
            <div className="bg-muted/50 p-2 rounded-md">
              <p className="text-xs font-medium mb-1">Put Midpoint</p>
              <p className="text-sm font-semibold">${formatNumber(putMidpoint)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

