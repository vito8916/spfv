import React from 'react';

export function MarketClosedMessage() {
  return (
    <div className="flex justify-center items-center text-center">
      <p className="text-muted-foreground text-sm">
        The market is currently closed. It opens at 9:30 AM ET, Monday to
        Friday.
      </p>
    </div>
  );
}

export default MarketClosedMessage; 