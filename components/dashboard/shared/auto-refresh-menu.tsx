"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuContent,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Settings, RefreshCcw, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface AutoRefreshMenuProps {
  onRefreshIntervalChange: (interval: number) => void;
  onManualRefresh: () => void;
}

export default function AutoRefreshMenu({ onRefreshIntervalChange, onManualRefresh }: AutoRefreshMenuProps) {
  const [refreshRate, setRefreshRate] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Handle auto-refresh countdown
  useEffect(() => {
    if (refreshRate <= 0) {
      setCountdown(0);
      onRefreshIntervalChange(0);
      return;
    }

    onRefreshIntervalChange(refreshRate);
    setCountdown(refreshRate);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          handleRefresh();
          return refreshRate;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [refreshRate, onRefreshIntervalChange]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    onManualRefresh();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  return (
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline" className="relative">
                  <Settings className="h-4 w-4 mr-1" />
                  <span>Refresh</span>
                  {refreshRate > 0 && (
                    <Badge variant="outline" className="ml-1 w-10 h-5 px-2 text-primary">
                      {countdown}s
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Configure auto-refresh</p>
            </TooltipContent>
          </Tooltip>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Auto Refresh Settings</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup 
              value={refreshRate.toString()} 
              onValueChange={(value) => setRefreshRate(parseInt(value))}
            >
              <DropdownMenuRadioItem value="0" className="cursor-pointer">
                Off
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="10" className="cursor-pointer">
                Every 10 seconds
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="30" className="cursor-pointer">
                Every 30 seconds
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="60" className="cursor-pointer">
                Every 1 minute
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="300" className="cursor-pointer">
                Every 5 minutes
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              size="sm" 
              variant="outline"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCcw className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Refresh now</p>
          </TooltipContent>
        </Tooltip>
      </div>
  );
}
